import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI } from '@google/genai';
import { STORYBOARD_JSON_SCHEMA, buildGenerationPrompt } from './schema.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const STORYBOARDS_DIR = path.join(ROOT_DIR, 'storyboards');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

const PORT = Number(process.env.PORT) || 3001;

const app = express();
app.use(cors());
app.use(express.json({ limit: '15mb' }));

function sanitizeId(raw) {
  return String(raw || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function formatSrtTime(totalSeconds) {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = Math.floor(totalSeconds % 60);
  const ms = Math.round((totalSeconds - Math.floor(totalSeconds)) * 1000);
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
}

function generateSrtText(project) {
  let cursor = 0;
  const blocks = [];
  (project.scenes || []).forEach((scene, idx) => {
    const dur = Math.max(3, Number(scene.durationSeconds) || 8);
    const start = formatSrtTime(cursor);
    const end = formatSrtTime(cursor + dur);
    cursor += dur;
    const lines = [String(scene.narratorScriptKh || '').trim()];
    if (scene.characterDialogue && String(scene.characterDialogue).trim()) {
      lines.push(String(scene.characterDialogue).trim());
    }
    blocks.push(`${idx + 1}\n${start} --> ${end}\n${lines.join('\n')}`);
  });
  return blocks.join('\n\n') + '\n';
}

function generateNarratorText(project) {
  const sectionLabels = {
    INTRODUCTION: 'A. ផ្នែកផ្ដើម (INTRODUCTION)',
    MAIN_STORY: 'B. សាច់រឿងសំខាន់ (MAIN STORY)',
    IMPORTANT_LESSONS: 'C. មេរៀនសំខាន់ៗ (IMPORTANT LESSONS)',
    CONCLUSION: 'D. សេចក្ដីបញ្ចប់ (CONCLUSION)',
  };

  const lines = [
    '====================================================================',
    'COMPLETE NARRATOR SCRIPT (KHMER VOICEOVER ONLY)',
    '====================================================================',
    `ចំណងជើងវីដេអូ: ${project.videoTitle}`,
    `ប្រធានបទ: ${project.topic}`,
    `សំឡេងអ្នកនិទាន: ${project.narratorVoice} (${project.voiceTone})`,
    `ចំនួនឈុតសរុប: ${(project.scenes || []).length} ឈុត`,
    '====================================================================',
    '',
  ];

  let lastSection = null;
  for (const scene of project.scenes || []) {
    if (scene.section !== lastSection) {
      lines.push(`\n--- ${sectionLabels[scene.section] || scene.section} ---\n`);
      lastSection = scene.section;
    }
    const num = String(scene.sceneNumber).padStart(2, '0');
    lines.push(`[Scene ${num} – ${scene.sceneTitle} | ${scene.durationSeconds}s]`);
    lines.push(String(scene.narratorScriptKh || '').trim());
    if (scene.characterDialogue && String(scene.characterDialogue).trim()) {
      lines.push(`(សន្ទនាតួអង្គ: ${String(scene.characterDialogue).trim()})`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

function formatKhmerVideoPrompt(scene, project) {
  const baseMotion = String(scene.aiVideoPromptEn || '').trim();
  const script = String(scene.narratorScriptKh || '').trim();
  if (
    /Spoken Khmer|Khmer Narration|និយាយជាភាសាខ្មែរ/i.test(baseMotion) &&
    script &&
    baseMotion.includes(script.slice(0, 18))
  ) {
    return baseMotion;
  }
  const parts = [];
  if (baseMotion) parts.push(`Visual Motion: ${baseMotion}`);
  if (scene.cameraMovement) parts.push(`Camera Movement: ${scene.cameraMovement}.`);
  if (script) {
    parts.push(
      `Spoken Khmer Narration (${project.narratorVoice || 'Khmer Male Voice'}, ${project.voiceTone || 'Natural, Clear, Professional, Engaging'}, speak clearly in natural Khmer language): "${script}"`
    );
  }
  if (scene.characterDialogue && String(scene.characterDialogue).trim()) {
    parts.push(
      `Character Dialogue (spoken in natural Khmer language with matching lip-sync): "${String(scene.characterDialogue).trim()}"`
    );
  }
  if (scene.bgmAndSfx) parts.push(`Background Music & SFX: ${scene.bgmAndSfx}.`);
  parts.push(
    `Style & Specs: ${project.animationStyleLabel || '2D Cartoon Cambodian Educational Animation'}, authentic Cambodian (Khmer) characters and Cambodian scenery, keep natural Khmer script on shop/school signboards legible if present, ${project.videoFormat || '16:9'}, ${scene.durationSeconds || 8} seconds, clear Khmer pronunciation, no floating subtitles or English watermarks.`
  );
  return parts.join('\n');
}

function generateMarkdownText(project) {
  const totalSec = (project.scenes || []).reduce((acc, s) => acc + (Number(s.durationSeconds) || 8), 0);
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;

  const lines = [
    `# ${project.videoTitle}`,
    '',
    `- **ប្រភេទ (Category):** ${project.categoryLabelKh}`,
    `- **ប្រធានបទ (Topic):** ${project.topic}`,
    `- **រយៈពេល (Duration):** ${project.durationLabel} (${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')} / ${(project.scenes || []).length} ឈុត)`,
    `- **ទម្រង់វីដេអូ (Format):** ${project.videoFormat} (${project.resolution})`,
    `- **ស្ទីល Animation:** ${project.animationStyleLabel}`,
    `- **អ្នកនិទាន (Narrator):** ${project.narratorVoice} — ${project.voiceTone}`,
    `- **កំណត់សម្គាល់ភាពត្រឹមត្រូវ:** ${project.isFictionalNote}`,
    '',
    '## 1. ការពិពណ៌នាវីដេអូ (Video Description)',
    '',
    project.videoDescription || '',
    '',
    '## 2. តួអង្គសំខាន់ & AI Character Image Prompts (Character Consistency Sheet)',
    '',
    ...(project.characters || []).flatMap((c) => [
      `### ${c.name} (${c.role})`,
      `- **រូបរាង៖** ${c.appearance}`,
      `- **សម្លៀកបំពាក់៖** ${c.outfit}`,
      `- **បុគ្គលិកលក្ខណៈ៖** ${c.personality}`,
      `- **AI Character Image Prompt (English):** \`${c.aiCharacterImagePromptEn || ''}\``,
      '',
    ]),
    '## 3. គ្រោងសាច់រឿង (Main Story Outline)',
    '',
    ...(project.outline || []).flatMap((o) => [
      `### ${o.section} — ${o.titleKh}`,
      o.summary,
      ...(o.keyPoints || []).map((kp) => `- ${kp}`),
      '',
    ]),
    '## 4. Script អ្នកនិទានពេញលេញ (Standalone Narrator Script)',
    '',
    ...(project.scenes || []).flatMap((s) => [
      `**Scene ${String(s.sceneNumber).padStart(2, '0')} – ${s.sceneTitle}** (${s.durationSeconds}s)`,
      `> ${s.narratorScriptKh}`,
      ...(s.characterDialogue ? [`> *សន្ទនា៖ ${s.characterDialogue}*`] : []),
      '',
    ]),
    '## 5. Storyboard តាមឈុត (Scene-by-Scene Storyboard)',
    '',
    ...(project.scenes || []).flatMap((s) => [
      `### Scene ${String(s.sceneNumber).padStart(2, '0')}: ${s.sceneTitle} (${s.durationSeconds}s)`,
      `- **Section:** ${s.section}`,
      `- **Visual Description:** ${s.visualDescription}`,
      `- **Character:** ${s.character}`,
      `- **Character Action:** ${s.characterAction}`,
      `- **Narrator Script (Khmer):** ${s.narratorScriptKh}`,
      `- **Character Dialogue:** ${s.characterDialogue || '—'}`,
      `- **On-screen Text:** ${s.onScreenText || '—'}`,
      `- **AI Image Prompt (English):** \`${s.aiImagePromptEn}\``,
      `- **AI Video Prompt (និយាយភាសាខ្មែរ / Khmer Voiceover):**`,
      '```text',
      formatKhmerVideoPrompt(s, project),
      '```',
      `- **Camera Movement:** ${s.cameraMovement}`,
      `- **Background Music / SFX:** ${s.bgmAndSfx}`,
      '',
    ]),
    '## 6. ភ្លេងផ្ទៃខាងក្រោយ (Background Music Suggestions)',
    '',
    ...(project.musicSuggestions || []).map(
      (m) => `- **${m.section}:** ${m.mood} (${m.tempo}) — ${m.instruments}. *${m.usageTip}*`
    ),
    '',
    '## 7. YouTube Thumbnail Prompt',
    '',
    `- **Headline (Khmer):** ${project.thumbnail?.headlineKh || ''}`,
    `- **Sub-text (Khmer):** ${project.thumbnail?.subTextKh || ''}`,
    `- **Visual Concept:** ${project.thumbnail?.visualConcept || ''}`,
    `- **AI Thumbnail Prompt (English):**`,
    '```text',
    project.thumbnail?.aiThumbnailPromptEn || '',
    '```',
    '',
  ];

  return lines.join('\n');
}

function extractJsonFromText(rawText) {
  const text = String(rawText || '').trim();
  if (!text) {
    throw new Error('ទិន្នន័យទទេ — មិនមាន JSON សម្រាប់បម្លែងទេ។');
  }

  // 1. Direct JSON parse
  try {
    return JSON.parse(text);
  } catch {
    // continue
  }

  // 2. Extract from ```json ... ``` fenced block
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenceMatch && fenceMatch[1]) {
    try {
      return JSON.parse(fenceMatch[1].trim());
    } catch {
      // continue
    }
  }

  // 3. Find outermost { ... }
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    const slice = text.slice(firstBrace, lastBrace + 1);
    return JSON.parse(slice);
  }

  throw new Error(
    'មិនអាចអានទម្រង់ JSON បានទេ។ សូមប្រាកដថាអ្នកបានចម្លងប្លុក JSON ពេញលេញ (ចាប់ផ្ដើមដោយ { និងបញ្ចប់ដោយ })។'
  );
}

function normalizeSection(val) {
  const upper = String(val || '')
    .toUpperCase()
    .replace(/[\s-]+/g, '_');
  if (upper.includes('INTRO')) return 'INTRODUCTION';
  if (upper.includes('LESSON')) return 'IMPORTANT_LESSONS';
  if (upper.includes('CONCLU') || upper.includes('OUTRO')) return 'CONCLUSION';
  return 'MAIN_STORY';
}

function normalizeProjectPayload(parsed, meta = {}) {
  const now = new Date().toISOString();
  const rawScenes = Array.isArray(parsed.scenes) ? parsed.scenes : [];
  if (rawScenes.length === 0) {
    throw new Error('មិនឃើញបញ្ជីឈុត ("scenes") នៅក្នុង JSON ទេ។ សូមពិនិត្យលទ្ធផលម្ដងទៀត។');
  }

  const normalizedScenes = rawScenes.map((s, idx) => ({
    sceneNumber: idx + 1,
    section: normalizeSection(s.section),
    sceneTitle: String(s.sceneTitle || s.title || `ឈុតទី ${idx + 1}`),
    durationSeconds: Math.max(4, Math.min(20, Number(s.durationSeconds || s.duration) || 8)),
    visualDescription: String(s.visualDescription || ''),
    character: String(s.character || ''),
    characterAction: String(s.characterAction || ''),
    narratorScriptKh: String(s.narratorScriptKh || s.narratorScript || ''),
    characterDialogue: String(s.characterDialogue || ''),
    onScreenText: String(s.onScreenText || ''),
    aiImagePromptEn: String(s.aiImagePromptEn || s.aiImagePrompt || ''),
    aiVideoPromptEn: String(s.aiVideoPromptEn || s.aiVideoPrompt || ''),
    cameraMovement: String(s.cameraMovement || 'Gentle slow zoom in'),
    bgmAndSfx: String(s.bgmAndSfx || 'Warm documentary background music'),
  }));

  const topicText = String(meta.topic || parsed.topic || parsed.videoTitle || 'ប្រធានបទថ្មី').trim();

  return {
    id: sanitizeId(parsed.id) || `sb-${Date.now()}`,
    createdAt: parsed.createdAt || now,
    updatedAt: now,
    categoryId: meta.categoryId || parsed.categoryId || 'custom',
    categoryLabelKh: meta.categoryLabelKh || parsed.categoryLabelKh || 'ប្រធានបទផ្ទាល់ខ្លួន',
    topic: topicText,
    videoTitle: String(parsed.videoTitle || topicText),
    videoDescription: String(parsed.videoDescription || ''),
    language: 'Khmer',
    durationPreset: meta.durationPreset || parsed.durationPreset || '5-10',
    durationLabel: meta.durationLabel || parsed.durationLabel || '5–10 នាទី',
    videoFormat: '16:9',
    resolution: '1920 × 1080',
    animationStyle: meta.animationStyle || parsed.animationStyle || '2d-cartoon',
    animationStyleLabel:
      meta.animationStyleLabel || parsed.animationStyleLabel || '2D Cartoon Educational Animation',
    narratorVoice: meta.narratorVoice || parsed.narratorVoice || 'Khmer Male Voice',
    voiceTone: 'Natural, Clear, Professional, Engaging',
    presenterSetup: meta.presenterSetup || parsed.presenterSetup || 'group',
    presenterSetupLabel:
      meta.presenterSetupLabel || parsed.presenterSetupLabel || 'Team & Group Presentation (3–5 Characters)',
    actionDynamic: meta.actionDynamic || parsed.actionDynamic || 'cinematic-action',
    actionDynamicLabel:
      meta.actionDynamicLabel || parsed.actionDynamicLabel || 'Cinematic Action & Movement (No Static Talking Heads)',
    subtitleLanguage: 'Khmer',
    audience: 'General Audience',
    isFictionalNote:
      parsed.isFictionalNote ||
      'តួអង្គ និងស្ថានភាពក្នុងរឿងនេះ ត្រូវបានប្រឌិតឡើងក្នុងគោលបំណងអប់រំ ដើម្បីងាយយល់។',
    characters: Array.isArray(parsed.characters)
      ? parsed.characters.map((c) => {
          const styleLabel =
            meta.animationStyleLabel ||
            parsed.animationStyleLabel ||
            '2D Cartoon Educational Animation';
          const name = String(c.name || 'Character');
          const role = String(c.role || '');
          const appearance = String(c.appearance || '');
          const outfit = String(c.outfit || '');
          const personality = String(c.personality || '');
          const existingPrompt = String(
            c.aiCharacterImagePromptEn || c.aiImagePromptEn || c.characterPrompt || ''
          ).trim();
          return {
            name,
            role,
            appearance,
            outfit,
            personality,
            aiCharacterImagePromptEn:
              existingPrompt ||
              `Authentic Cambodian (Khmer) 2D cartoon character design turnaround reference sheet of ${name} (${role}), natural Cambodian facial features and warm light-tan Southeast Asian skin tone, ${appearance}, wearing ${outfit}, ${personality}. Full-body front view, 3/4 view, and 3 expressive faces on a clean solid soft cream background, ${styleLabel}, clean cel-shaded vector style, warm cinematic lighting, consistent proportions and colors, 16:9 composition, no floating watermarks.`,
          };
        })
      : [],
    outline: Array.isArray(parsed.outline)
      ? parsed.outline.map((o) => ({
          section: normalizeSection(o.section),
          titleKh: String(o.titleKh || o.title || ''),
          summary: String(o.summary || ''),
          keyPoints: Array.isArray(o.keyPoints) ? o.keyPoints.map(String) : [],
        }))
      : [],
    scenes: normalizedScenes,
    musicSuggestions: Array.isArray(parsed.musicSuggestions) ? parsed.musicSuggestions : [],
    thumbnail: parsed.thumbnail || {
      headlineKh: String(parsed.videoTitle || topicText),
      subTextKh: 'មេរៀនអប់រំ 2D Animation',
      visualConcept: '',
      aiThumbnailPromptEn: '',
    },
  };
}

async function ensureStoryboardsDir() {
  await fs.mkdir(STORYBOARDS_DIR, { recursive: true });
}

async function saveProjectBundle(project) {
  await ensureStoryboardsDir();
  const safeId = sanitizeId(project.id);
  if (!safeId) throw new Error('Invalid project id');
  project.id = safeId;

  const jsonPath = path.join(STORYBOARDS_DIR, `${safeId}.json`);
  const mdPath = path.join(STORYBOARDS_DIR, `${safeId}.md`);
  const narratorPath = path.join(STORYBOARDS_DIR, `${safeId}-narrator.txt`);
  const srtPath = path.join(STORYBOARDS_DIR, `${safeId}.srt`);

  await Promise.all([
    fs.writeFile(jsonPath, JSON.stringify(project, null, 2), 'utf8'),
    fs.writeFile(mdPath, generateMarkdownText(project), 'utf8'),
    fs.writeFile(narratorPath, generateNarratorText(project), 'utf8'),
    fs.writeFile(srtPath, generateSrtText(project), 'utf8'),
  ]);

  return project;
}

async function generateWithOllama({ baseUrl, model, prompt }) {
  const cleanBase = String(baseUrl || 'http://127.0.0.1:11434').replace(/\/+$/, '');
  const selectedModel = String(model || 'gemma3').trim();

  let res;
  try {
    res = await fetch(`${cleanBase}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: selectedModel,
        stream: false,
        format: 'json',
        messages: [
          {
            role: 'system',
            content:
              'You are a professional Khmer educational animation scriptwriter and storyboard director. Output ONLY valid JSON.',
          },
          { role: 'user', content: prompt },
        ],
        options: {
          temperature: 0.7,
        },
      }),
    });
  } catch (err) {
    throw new Error(
      `មិនអាចភ្ជាប់ទៅ Ollama នៅ ${cleanBase} បានទេ។ សូមប្រាកដថាអ្នកបានដំឡើង និងបើកកម្មវិធី Ollama លើកុំព្យូទ័រ (https://ollama.com/download) ហើយទាញយកម៉ូដែល (ឧទាហរណ៍៖ ollama pull ${selectedModel})។`
    );
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      data?.error ||
        `Ollama Error (${res.status}): សូមពិនិត្យថាអ្នកបានទាញយកម៉ូដែល "${selectedModel}" ដោយពាក្យបញ្ជា "ollama pull ${selectedModel}"។`
    );
  }

  const content = data?.message?.content;
  if (!content) {
    throw new Error('Ollama បានត្រឡប់លទ្ធផលទទេ។ សូមសាកល្បងម្ដងទៀត ឬបន្ថយចំនួនឈុតបន្តិច។');
  }
  return extractJsonFromText(content);
}

async function generateWithOpenAICompatible({ provider, baseUrl, apiKey, model, prompt }) {
  const defaults = {
    openrouter: { url: 'https://openrouter.ai/api/v1', model: 'google/gemma-3-27b-it:free' },
    groq: { url: 'https://api.groq.com/openai/v1', model: 'llama-3.3-70b-versatile' },
    openai: { url: 'https://api.openai.com/v1', model: 'gpt-4o-mini' },
  };
  const def = defaults[provider] || defaults.openai;
  const cleanBase = String(baseUrl || def.url).replace(/\/+$/, '');
  const selectedModel = String(model || def.model).trim();
  const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1)/i.test(cleanBase);

  if (!isLocal && !apiKey) {
    throw new Error(
      `សូមបញ្ចូល API Key សម្រាប់ ${provider.toUpperCase()} នៅក្នុង «កំណត់ការភ្ជាប់ AI» ជាមុនសិន។`
    );
  }

  const headers = {
    'Content-Type': 'application/json',
  };
  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  }
  if (provider === 'openrouter') {
    headers['HTTP-Referer'] = 'http://localhost:3001';
    headers['X-Title'] = 'Khmer Storyboard Studio';
  }

  const body = {
    model: selectedModel,
    messages: [
      {
        role: 'system',
        content:
          'You are a professional Khmer educational storytelling animation scriptwriter and storyboard director. Always return ONLY valid JSON.',
      },
      { role: 'user', content: prompt },
    ],
    temperature: 0.7,
  };

  // Use json_object response_format for providers that reliably support it
  if (provider === 'openai' || provider === 'groq') {
    body.response_format = { type: 'json_object' };
  }

  let res;
  try {
    res = await fetch(`${cleanBase}/chat/completions`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
  } catch (err) {
    throw new Error(
      `មិនអាចភ្ជាប់ទៅ ${cleanBase} បានទេ (${err instanceof Error ? err.message : 'Network error'})។`
    );
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errMsg = data?.error?.message || data?.message || `HTTP ${res.status}`;
    throw new Error(`${provider.toUpperCase()} Error (${res.status}): ${errMsg}`);
  }

  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error(`${provider.toUpperCase()} បានត្រឡប់លទ្ធផលទទេ។`);
  }
  return extractJsonFromText(content);
}

async function generateWithGemini({ apiKey, model, prompt }) {
  const effectiveKey = (apiKey && String(apiKey).trim()) || (process.env.GEMINI_API_KEY || '').trim();
  if (!effectiveKey) {
    throw new Error(
      'មិនទាន់មាន Gemini API Key ទេ។ សូមបញ្ចូល API Key នៅក្នុង «កំណត់ការភ្ជាប់ AI» ឬប្ដូរទៅប្រើ Ollama (Offline) / បិទភ្ជាប់ពី ChatGPT Web។'
    );
  }

  const allowedModels = ['gemini-3.8-flash', 'gemini-4-argon'];
  const selectedModel = allowedModels.includes(model) ? model : 'gemini-3.8-flash';
  const client = new GoogleGenAI({ apiKey: effectiveKey });

  const interaction = await client.interactions.create({
    model: selectedModel,
    input: prompt,
    response_format: {
      type: 'text',
      mime_type: 'application/json',
      schema: STORYBOARD_JSON_SCHEMA,
    },
    store: false,
  });

  const outputText = interaction.output_text;
  if (!outputText) {
    throw new Error('Gemini returned an empty response. Please try again.');
  }
  return extractJsonFromText(outputText);
}

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    hasEnvApiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim()),
    storyboardsDir: STORYBOARDS_DIR,
  });
});

app.get('/api/ollama/models', async (req, res) => {
  const baseUrl = String(req.query.baseUrl || 'http://127.0.0.1:11434').replace(/\/+$/, '');
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);
    const resp = await fetch(`${baseUrl}/api/tags`, { signal: controller.signal });
    clearTimeout(timer);
    if (!resp.ok) {
      return res.json({ available: false, models: [], error: `HTTP ${resp.status}` });
    }
    const data = await resp.json();
    const models = Array.isArray(data.models) ? data.models.map((m) => m.name) : [];
    res.json({ available: true, models });
  } catch {
    res.json({
      available: false,
      models: [],
      error: `មិនឃើញ Ollama កំពុងដំណើរការនៅ ${baseUrl} ទេ`,
    });
  }
});

app.get('/api/projects', async (_req, res) => {
  try {
    await ensureStoryboardsDir();
    const files = await fs.readdir(STORYBOARDS_DIR);
    const jsonFiles = files.filter((f) => f.endsWith('.json'));
    const summaries = [];

    for (const file of jsonFiles) {
      try {
        const raw = await fs.readFile(path.join(STORYBOARDS_DIR, file), 'utf8');
        const proj = JSON.parse(raw);
        const totalSeconds = (proj.scenes || []).reduce(
          (sum, s) => sum + (Number(s.durationSeconds) || 8),
          0
        );
        summaries.push({
          id: proj.id || file.replace(/\.json$/, ''),
          videoTitle: proj.videoTitle || proj.topic || file,
          topic: proj.topic || '',
          categoryId: proj.categoryId || 'custom',
          categoryLabelKh: proj.categoryLabelKh || 'ប្រធានបទផ្ទាល់ខ្លួន',
          durationLabel: proj.durationLabel || '5–10 នាទី',
          animationStyleLabel: proj.animationStyleLabel || '2D Cartoon',
          sceneCount: (proj.scenes || []).length,
          totalSeconds,
          updatedAt: proj.updatedAt || proj.createdAt || new Date().toISOString(),
        });
      } catch {
        // Skip invalid json files
      }
    }

    summaries.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    res.json({ projects: summaries });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Failed to list projects' });
  }
});

app.get('/api/projects/:id', async (req, res) => {
  try {
    const safeId = sanitizeId(req.params.id);
    const filePath = path.join(STORYBOARDS_DIR, `${safeId}.json`);
    const raw = await fs.readFile(filePath, 'utf8');
    res.json({ project: JSON.parse(raw) });
  } catch {
    res.status(404).json({ error: 'Project not found' });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    const payload = req.body?.project || req.body;
    if (!payload || !payload.videoTitle) {
      return res.status(400).json({ error: 'Missing project payload' });
    }
    const now = new Date().toISOString();
    const id = sanitizeId(payload.id) || `storyboard-${Date.now()}`;
    const project = {
      ...payload,
      id,
      createdAt: payload.createdAt || now,
      updatedAt: now,
    };
    const saved = await saveProjectBundle(project);
    res.status(201).json({ project: saved });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Failed to create project' });
  }
});

app.post('/api/import-raw', async (req, res) => {
  try {
    const { rawText, meta } = req.body || {};
    const parsed = extractJsonFromText(rawText);
    const project = normalizeProjectPayload(parsed, meta || {});
    const saved = await saveProjectBundle(project);
    res.status(201).json({ project: saved });
  } catch (err) {
    res.status(400).json({
      error: err instanceof Error ? err.message : 'មិនអាចបម្លែងទិន្នន័យ JSON បានទេ',
    });
  }
});

app.put('/api/projects/:id', async (req, res) => {
  try {
    const safeId = sanitizeId(req.params.id);
    const payload = req.body?.project || req.body;
    if (!safeId || !payload) {
      return res.status(400).json({ error: 'Invalid project update' });
    }
    const project = {
      ...payload,
      id: safeId,
      updatedAt: new Date().toISOString(),
    };
    const saved = await saveProjectBundle(project);
    res.json({ project: saved });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Failed to save project' });
  }
});

app.delete('/api/projects/:id', async (req, res) => {
  try {
    const safeId = sanitizeId(req.params.id);
    if (!safeId) return res.status(400).json({ error: 'Invalid id' });
    const suffixes = ['.json', '.md', '-narrator.txt', '.srt'];
    await Promise.all(
      suffixes.map((ext) =>
        fs.unlink(path.join(STORYBOARDS_DIR, `${safeId}${ext}`)).catch(() => {})
      )
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Failed to delete project' });
  }
});

app.post('/api/generate', async (req, res) => {
  try {
    const {
      provider: requestedProvider,
      apiKey: bodyKey,
      model: requestedModel,
      baseUrl,
      categoryId,
      categoryLabelKh,
      topic,
      durationPreset,
      durationLabel,
      targetScenes,
      animationStyle,
      animationStyleLabel,
      narratorVoice,
      presenterSetup,
      presenterSetupLabel,
      actionDynamic,
      actionDynamicLabel,
      customNotes,
    } = req.body || {};

    if (!topic || !String(topic).trim()) {
      return res.status(400).json({ error: 'សូមបញ្ចូលប្រធានបទវីដេអូជាមុនសិន។ (Topic is required)' });
    }

    const provider = String(requestedProvider || 'gemini').toLowerCase();
    const promptInput = {
      categoryLabelKh: categoryLabelKh || 'Business & Money – មុខជំនួញ និងហិរញ្ញវត្ថុ',
      topic: String(topic).trim(),
      durationLabel: durationLabel || '5–10 នាទី',
      targetScenes: Number(targetScenes) || 24,
      animationStyle: animationStyle || '2d-cartoon',
      animationStyleLabel: animationStyleLabel || '2D Cartoon Educational Animation',
      narratorVoice: narratorVoice || 'Khmer Male Voice',
      presenterSetup: presenterSetup || 'group',
      presenterSetupLabel: presenterSetupLabel || 'Team & Group Presentation (3–5 Characters)',
      actionDynamic: actionDynamic || 'cinematic-action',
      actionDynamicLabel:
        actionDynamicLabel || 'Cinematic Action & Practical Movement (NO Boring Talking Heads)',
      customNotes: customNotes ? String(customNotes).trim() : '',
    };

    let parsed;
    if (provider === 'ollama') {
      const prompt = buildGenerationPrompt(promptInput, true);
      parsed = await generateWithOllama({ baseUrl, model: requestedModel, prompt });
    } else if (provider === 'openrouter' || provider === 'groq' || provider === 'openai') {
      const prompt = buildGenerationPrompt(promptInput, true);
      parsed = await generateWithOpenAICompatible({
        provider,
        baseUrl,
        apiKey: String(bodyKey || '').trim(),
        model: requestedModel,
        prompt,
      });
    } else {
      const prompt = buildGenerationPrompt(promptInput, false);
      parsed = await generateWithGemini({
        apiKey: String(bodyKey || '').trim(),
        model: requestedModel,
        prompt,
      });
    }

    const project = normalizeProjectPayload(parsed, {
      categoryId,
      categoryLabelKh,
      topic,
      durationPreset,
      durationLabel,
      animationStyle,
      animationStyleLabel,
      narratorVoice,
      presenterSetup,
      presenterSetupLabel,
      actionDynamic,
      actionDynamicLabel,
    });

    const saved = await saveProjectBundle(project);
    res.status(201).json({ project: saved });
  } catch (err) {
    console.error('[Generate Error]', err);
    const rawBody =
      (err && typeof err === 'object' && 'body' in err && err.body) ||
      (err && typeof err === 'object' && 'cause' in err && err.cause?.body) ||
      '';
    let parsedMessage = '';
    let reason = '';
    if (typeof rawBody === 'string' && rawBody.trim()) {
      try {
        const parsed = JSON.parse(rawBody);
        const entry = Array.isArray(parsed) ? parsed[0] : parsed;
        parsedMessage = entry?.error?.message || entry?.message || '';
        const details = entry?.error?.details || [];
        const info = details.find((d) => d?.reason);
        reason = info?.reason || entry?.error?.status || '';
      } catch {
        parsedMessage = rawBody.slice(0, 300);
      }
    }

    let friendlyError =
      parsedMessage || (err instanceof Error ? err.message : 'Failed to generate storyboard');

    if (reason === 'API_KEY_INVALID' || /API key not valid/i.test(friendlyError)) {
      friendlyError =
        'Gemini API Key មិនត្រឹមត្រូវទេ (API key not valid)។ សូមបើក «កំណត់ការភ្ជាប់ AI» ដើម្បីប្ដូរទៅ Ollama (Offline មិនបាច់ Key) ឬបញ្ចូល Gemini Key ត្រឹមត្រូវ (AIza...) ឬប្រើប្រអប់ «ChatGPT / Gemini Web» ខាងក្រោម។';
    } else if (/quota|RESOURCE_EXHAUSTED|429/i.test(`${reason} ${friendlyError}`)) {
      friendlyError = `AI API ដល់កម្រិត Quota បណ្ដោះអាសន្ន (${friendlyError})។ សូមរង់ចាំបន្តិច ឬប្ដូរទៅប្រើ Ollama / ChatGPT Web។`;
    }

    const statusCode =
      (err && typeof err === 'object' && 'status' in err && Number(err.status)) || 500;
    res.status(statusCode >= 400 && statusCode < 600 ? statusCode : 500).json({
      error: friendlyError,
      reason: reason || undefined,
    });
  }
});

function mergeSyncedPrompts(project, synced) {
  const nextChars = (project.characters || []).map((c, idx) => {
    const match =
      (Array.isArray(synced.characters) &&
        synced.characters.find(
          (sc) =>
            sc?.name &&
            String(sc.name).trim().toLowerCase() === String(c.name || '').trim().toLowerCase()
        )) ||
      (Array.isArray(synced.characters) ? synced.characters[idx] : null);

    return {
      ...c,
      aiCharacterImagePromptEn:
        (match && String(match.aiCharacterImagePromptEn || match.aiImagePromptEn || '').trim()) ||
        c.aiCharacterImagePromptEn ||
        '',
    };
  });

  const nextScenes = (project.scenes || []).map((s, idx) => {
    const match =
      (Array.isArray(synced.scenes) &&
        synced.scenes.find((ss) => Number(ss?.sceneNumber) === Number(s.sceneNumber))) ||
      (Array.isArray(synced.scenes) ? synced.scenes[idx] : null);

    return {
      ...s,
      aiImagePromptEn:
        (match && String(match.aiImagePromptEn || match.aiImagePrompt || '').trim()) ||
        s.aiImagePromptEn,
      aiVideoPromptEn:
        (match && String(match.aiVideoPromptEn || match.aiVideoPrompt || '').trim()) ||
        s.aiVideoPromptEn,
    };
  });

  const nextThumbPrompt =
    String(synced.aiThumbnailPromptEn || synced.thumbnail?.aiThumbnailPromptEn || '').trim() ||
    project.thumbnail?.aiThumbnailPromptEn ||
    '';

  return {
    ...project,
    updatedAt: new Date().toISOString(),
    characters: nextChars,
    scenes: nextScenes,
    thumbnail: {
      ...(project.thumbnail || {
        headlineKh: project.videoTitle || '',
        subTextKh: '',
        visualConcept: '',
        aiThumbnailPromptEn: '',
      }),
      aiThumbnailPromptEn: nextThumbPrompt,
    },
  };
}

function buildServerSyncPrompt(project) {
  const chars = (project.characters || [])
    .map(
      (c, i) =>
        `${i + 1}. ${c.name} (${c.role}) — Appearance: ${c.appearance} | Outfit: ${c.outfit} | Personality: ${c.personality}`
    )
    .join('\n');

  const scenes = (project.scenes || [])
    .map(
      (s) =>
        `Scene ${String(s.sceneNumber).padStart(2, '0')} [${s.section} | ${s.durationSeconds}s | Camera: ${s.cameraMovement}]
- Title: ${s.sceneTitle}
- Character: ${s.character} | Action: ${s.characterAction}
- Visual: ${s.visualDescription}
- Khmer Narrator Script: "${s.narratorScriptKh}"`
    )
    .join('\n\n');

  return `You are an expert 2D animation art director and AI prompt engineer.
Rewrite ALL English AI prompts so that EVERY Character Reference Image Prompt, EVERY Scene Image Prompt, and EVERY Scene Video Animation Prompt matches the EXACT Khmer Narrator Script, Visual Description, Character Action, and Camera Movement word-for-word.

VIDEO:
- Title: ${project.videoTitle}
- Topic: ${project.topic}
- Style: ${project.animationStyleLabel} (${project.videoFormat}, ${project.resolution})
- Rule 1 (Cambodian Identity): ALL characters MUST be authentically Cambodian (Khmer) with consistent age, hair, outfit, and colors across EVERY scene.
- Rule 2 (Cambodian Countryside & City Scenery + Khmer Signboards): ALL scenes and backgrounds MUST depict authentic Cambodia — rural countryside (sugar palm trees, rice paddies, wooden stilt houses, village lanes) and Cambodian cities (Phnom Penh shophouses, riverside, tuk-tuks, local cafés). Whenever a shop, café, cart, market, or school appears, include authentic clean Khmer script on the natural shop signboard (e.g., "កាហ្វេតារា", "ហាងសុខា", "វិទ្យាល័យ") — no floating subtitles or English watermarks.
- Rule 3 (Script Alignment): Every scene's aiImagePromptEn MUST strictly illustrate what the Khmer Narrator Script is saying in that scene.
- Rule 4 (Khmer-Speaking Video Prompt): Every scene's aiVideoPromptEn MUST describe smooth visual motion, camera movement, AND explicitly include Spoken Khmer Narration in natural Khmer language using the exact Khmer Narrator Script (and any Khmer dialogue) for that scene!

CHARACTERS:
${chars}

SCENES:
${scenes}

Return ONLY valid JSON:
{
  "characters": [
    { "name": "string", "aiCharacterImagePromptEn": "string" }
  ],
  "scenes": [
    { "sceneNumber": 1, "aiImagePromptEn": "string", "aiVideoPromptEn": "string" }
  ],
  "aiThumbnailPromptEn": "string"
}`;
}

app.post('/api/apply-synced-prompts', async (req, res) => {
  try {
    const { project, rawText } = req.body || {};
    if (!project || !project.id) {
      return res.status(400).json({ error: 'Missing project payload' });
    }
    const parsed = extractJsonFromText(rawText);
    const merged = mergeSyncedPrompts(project, parsed);
    const saved = await saveProjectBundle(merged);
    res.json({ project: saved });
  } catch (err) {
    res.status(400).json({
      error: err instanceof Error ? err.message : 'មិនអាចអនុវត្ត Prompts ពី JSON បានទេ',
    });
  }
});

app.post('/api/sync-prompts', async (req, res) => {
  try {
    const { project, provider: requestedProvider, apiKey, model, baseUrl } = req.body || {};
    if (!project || !project.id) {
      return res.status(400).json({ error: 'Missing project payload' });
    }
    const provider = String(requestedProvider || 'gemini').toLowerCase();
    const prompt = buildServerSyncPrompt(project);

    let parsed;
    if (provider === 'ollama') {
      parsed = await generateWithOllama({ baseUrl, model, prompt });
    } else if (provider === 'openrouter' || provider === 'groq' || provider === 'openai') {
      parsed = await generateWithOpenAICompatible({
        provider,
        baseUrl,
        apiKey: String(apiKey || '').trim(),
        model,
        prompt,
      });
    } else {
      const effectiveKey =
        (apiKey && String(apiKey).trim()) || (process.env.GEMINI_API_KEY || '').trim();
      if (!effectiveKey) {
        throw new Error(
          'មិនទាន់មាន Gemini API Key ទេ។ សូមប្ដូរទៅ Ollama ឬប្រើប៊ូតុង «Sync តាម ChatGPT / Gemini Web» ដោយមិនបាច់ API Key។'
        );
      }
      const allowedModels = ['gemini-3.8-flash', 'gemini-4-argon'];
      const selectedModel = allowedModels.includes(model) ? model : 'gemini-3.8-flash';
      const client = new GoogleGenAI({ apiKey: effectiveKey });
      const interaction = await client.interactions.create({
        model: selectedModel,
        input: prompt,
        store: false,
      });
      parsed = extractJsonFromText(interaction.output_text || '');
    }

    const merged = mergeSyncedPrompts(project, parsed);
    const saved = await saveProjectBundle(merged);
    res.json({ project: saved });
  } catch (err) {
    console.error('[Sync Prompts Error]', err);
    res.status(500).json({
      error: err instanceof Error ? err.message : 'មិនអាចធ្វើសមកាលកម្ម Prompts បានទេ',
    });
  }
});

// Serve built production frontend if dist exists
app.use(
  express.static(DIST_DIR, {
    setHeaders(res, filePath) {
      if (filePath.endsWith('index.html')) {
        res.setHeader('Cache-Control', 'no-store');
      }
    },
  })
);
app.get('/{*splat}', async (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  try {
    const indexPath = path.join(DIST_DIR, 'index.html');
    await fs.access(indexPath);
    res.setHeader('Cache-Control', 'no-store');
    res.sendFile(indexPath);
  } catch {
    res.status(404).send('Run `npm.cmd run build` first, then `npm.cmd start`.');
  }
});

app.listen(PORT, () => {
  console.log(`[Khmer Storyboard Studio] Ready at http://localhost:${PORT} and http://127.0.0.1:${PORT}`);
  console.log(`[Storyboards Directory] ${STORYBOARDS_DIR}`);
});
