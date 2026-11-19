import type {
  AiProviderConfig,
  GenerationRequest,
  ProjectSummary,
  StoryboardProject,
  StorySection,
} from '../types/storyboard';
import { ANIMATION_STYLES, DURATION_PRESETS, buildJsonImportPrompt } from '../data/topics';
import { BUNDLED_PROJECTS } from '../data/bundledProjects';
import { buildSyncPromptsForWeb, getCharacterImagePrompt } from '../utils/exporters';

export interface HealthResponse {
  ok: boolean;
  hasEnvApiKey: boolean;
  storyboardsDir: string;
  staticMode?: boolean;
}

const LOCAL_PROJECTS_KEY = 'khmer_storyboard_static_projects_v1';

let backendAvailable: boolean | null = null;

async function isBackendAlive(): Promise<boolean> {
  if (backendAvailable !== null) return backendAvailable;
  try {
    const res = await fetch('/api/health', { cache: 'no-store' });
    if (!res.ok) {
      backendAvailable = false;
      return false;
    }
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      backendAvailable = false;
      return false;
    }
    const data = await res.json();
    backendAvailable = Boolean(data && data.ok);
    return backendAvailable;
  } catch {
    backendAvailable = false;
    return false;
  }
}

function readLocalProjects(): StoryboardProject[] {
  try {
    const raw = window.localStorage.getItem(LOCAL_PROJECTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed as StoryboardProject[];
      }
    }
  } catch {
    // ignore storage errors
  }
  return BUNDLED_PROJECTS.map((p) => JSON.parse(JSON.stringify(p)) as StoryboardProject);
}

function writeLocalProjects(projects: StoryboardProject[]): void {
  try {
    window.localStorage.setItem(LOCAL_PROJECTS_KEY, JSON.stringify(projects));
  } catch {
    // ignore storage errors
  }
}

function toSummary(proj: StoryboardProject): ProjectSummary {
  const totalSeconds = (proj.scenes || []).reduce(
    (sum, s) => sum + (Number(s.durationSeconds) || 8),
    0
  );
  return {
    id: proj.id,
    videoTitle: proj.videoTitle || proj.topic || proj.id,
    topic: proj.topic || '',
    categoryId: proj.categoryId || 'custom',
    categoryLabelKh: proj.categoryLabelKh || 'ប្រធានបទផ្ទាល់ខ្លួន',
    durationLabel: proj.durationLabel || '5–10 នាទី',
    animationStyleLabel: proj.animationStyleLabel || '2D Cartoon Cambodian Educational Animation',
    sceneCount: (proj.scenes || []).length,
    totalSeconds,
    updatedAt: proj.updatedAt || proj.createdAt || new Date().toISOString(),
  };
}

function extractJsonInBrowser(rawText: string): Record<string, any> {
  let text = String(rawText || '').trim();
  if (!text) throw new Error('ទិន្នន័យទទេ — មិនមាន JSON សម្រាប់បម្លែងទេ។');

  // Strip <think>...</think> from reasoning models (e.g. DeepSeek R1, Qwen etc.)
  text = text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

  try {
    return JSON.parse(text);
  } catch {
    // continue
  }
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence && fence[1]) {
    try {
      return JSON.parse(fence[1].trim());
    } catch {
      // continue
    }
  }
  const first = text.indexOf('{');
  const last = text.lastIndexOf('}');
  if (first !== -1 && last > first) {
    const candidate = text.slice(first, last + 1);
    try {
      return JSON.parse(candidate);
    } catch {
      const cleaned = candidate.replace(/,\s*([}\]])/g, '$1');
      try {
        return JSON.parse(cleaned);
      } catch {
        // continue
      }
    }
  }
  throw new Error('មិនអាចអានទម្រង់ JSON បានទេ។ សូមពិនិត្យមើលចម្លើយរបស់ AI ម្ដងទៀត។');
}

async function callOpenRouterInBrowser(prompt: string, config: AiProviderConfig): Promise<string> {
  const apiKey = (config.apiKey || '').trim();
  if (!apiKey) {
    throw new Error('សូមបញ្ចូល OpenRouter API Key នៅក្នុង «កំណត់ការភ្ជាប់ AI» (ប៊ូតុង Settings) ជាមុនសិន។');
  }
  const baseUrl = (config.baseUrl || 'https://openrouter.ai/api/v1').replace(/\/+$/, '');
  let requestedModel = (config.model || 'google/gemma-4-31b-it:free').trim();

  // If old deprecated free model slug is passed, immediately rewrite to working free model
  if (requestedModel === 'google/gemma-3-27b-it:free') {
    requestedModel = 'google/gemma-4-31b-it:free';
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
    'HTTP-Referer': window.location.origin || 'https://sendara168.github.io',
    'X-Title': 'Khmer Storyboard Studio',
  };

  const candidateModels = [
    requestedModel,
    'google/gemma-4-31b-it:free',
    'google/gemma-4-26b-a4b-it:free',
    'google/gemma-3-27b-it',
  ].filter((m, idx, arr) => Boolean(m) && arr.indexOf(m) === idx);

  let lastError: Error | null = null;

  for (let i = 0; i < candidateModels.length; i++) {
    const modelToTry = candidateModels[i];
    const body = {
      model: modelToTry,
      messages: [
        {
          role: 'system',
          content:
            'You are a professional Khmer educational storytelling animation scriptwriter and storyboard director. Output ONLY valid JSON matching the requested schema.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 8192,
    };

    let res: Response;
    try {
      res = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });
    } catch (err) {
      throw new Error(
        `មិនអាចភ្ជាប់ទៅ OpenRouter បានទេ (${err instanceof Error ? err.message : 'Network error'})។ សូមពិនិត្យ Internet ឬ VPN/Adblock។`
      );
    }

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const errMsg = String(data?.error?.message || data?.message || `HTTP ${res.status}`);
      const isUnavailable =
        res.status === 404 ||
        errMsg.toLowerCase().includes('unavailable') ||
        errMsg.toLowerCase().includes('not found') ||
        errMsg.toLowerCase().includes('use this slug instead');

      if (isUnavailable && i < candidateModels.length - 1) {
        console.warn(`OpenRouter model ${modelToTry} unavailable (${errMsg}), falling back to ${candidateModels[i + 1]}...`);
        lastError = new Error(`OpenRouter Error (${res.status}): ${errMsg}`);
        continue;
      }
      throw new Error(`OpenRouter Error (${res.status}): ${errMsg}`);
    }

    const content = data?.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('OpenRouter បានត្រឡប់លទ្ធផលទទេ។ សូមសាកល្បងម្ដងទៀត ឬប្ដូរម៉ូដែល។');
    }
    return content;
  }

  throw lastError || new Error('OpenRouter មិនអាចដំណើរការបានទេ។');
}

async function callGroqInBrowser(prompt: string, config: AiProviderConfig): Promise<string> {
  const apiKey = (config.apiKey || '').trim();
  if (!apiKey) {
    throw new Error('សូមបញ្ចូល Groq API Key នៅក្នុង «កំណត់ការភ្ជាប់ AI» ជាមុនសិន។');
  }
  const baseUrl = (config.baseUrl || 'https://api.groq.com/openai/v1').replace(/\/+$/, '');
  const model = (config.model || 'llama-3.3-70b-versatile').trim();

  let res: Response;
  try {
    res = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content:
              'You are a professional Khmer educational storytelling animation scriptwriter and storyboard director. Output ONLY valid JSON.',
          },
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
        max_tokens: 8192,
      }),
    });
  } catch (err) {
    throw new Error(`មិនអាចភ្ជាប់ទៅ Groq បានទេ (${err instanceof Error ? err.message : 'Network error'})។`);
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errMsg = data?.error?.message || data?.message || `HTTP ${res.status}`;
    throw new Error(`Groq Error (${res.status}): ${errMsg}`);
  }

  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error('Groq បានត្រឡប់លទ្ធផលទទេ។');
  return content;
}

async function callOpenAICompatibleInBrowser(
  prompt: string,
  config: AiProviderConfig
): Promise<string> {
  const baseUrl = (config.baseUrl || 'https://api.openai.com/v1').replace(/\/+$/, '');
  const apiKey = (config.apiKey || '').trim();
  const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1)/i.test(baseUrl);
  if (!isLocal && !apiKey) {
    throw new Error('សូមបញ្ចូល API Key នៅក្នុង «កំណត់ការភ្ជាប់ AI» ជាមុនសិន។');
  }
  const model = (config.model || 'gpt-4o-mini').trim();

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

  let res: Response;
  try {
    res = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content:
              'You are a professional Khmer educational storytelling animation scriptwriter and storyboard director. Output ONLY valid JSON.',
          },
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
        max_tokens: 8192,
      }),
    });
  } catch (err) {
    throw new Error(`មិនអាចភ្ជាប់ទៅ ${baseUrl} បានទេ (${err instanceof Error ? err.message : 'Network error'})។`);
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errMsg = data?.error?.message || data?.message || `HTTP ${res.status}`;
    throw new Error(`AI Provider Error (${res.status}): ${errMsg}`);
  }

  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error('AI Provider បានត្រឡប់លទ្ធផលទទេ។');
  return content;
}

async function callGeminiInBrowser(prompt: string, config: AiProviderConfig): Promise<string> {
  const apiKey = (config.apiKey || '').trim();
  if (!apiKey) {
    throw new Error(
      'សូមបញ្ចូល Gemini API Key នៅក្នុង «កំណត់ការភ្ជាប់ AI» ជាមុនសិន (ទទួលយកឥតគិតថ្លៃនៅ aistudio.google.com)។'
    );
  }
  let model = (config.model || 'gemini-2.5-flash').trim();
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(
    apiKey
  )}`;

  let res: Response;
  try {
    res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.7,
          maxOutputTokens: 8192,
        },
      }),
    });
  } catch (err) {
    throw new Error(
      `មិនអាចភ្ជាប់ទៅ Google Gemini API បានទេ (${err instanceof Error ? err.message : 'Network error'})។`
    );
  }

  if (res.status === 404 && model !== 'gemini-2.5-flash') {
    const fallbackEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(
      apiKey
    )}`;
    res = await fetch(fallbackEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json', temperature: 0.7, maxOutputTokens: 8192 },
      }),
    });
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errMsg = data?.error?.message || `HTTP ${res.status}`;
    throw new Error(`Gemini API Error (${res.status}): ${errMsg}`);
  }

  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini API បានត្រឡប់លទ្ធផលទទេ។');
  return text;
}

async function callOllamaInBrowser(prompt: string, config: AiProviderConfig): Promise<string> {
  const baseUrl = (config.baseUrl || 'http://127.0.0.1:11434').replace(/\/+$/, '');
  const model = (config.model || 'gemma3').trim();

  if (window.location.protocol === 'https:' && baseUrl.startsWith('http:')) {
    throw new Error(
      'ដោយសារគេហទំព័រកំពុងដំណើរការលើ HTTPS (GitHub Pages) Browser មិនអនុញ្ញាតឱ្យហៅ HTTP ទៅ Ollama លើកុំព្យូទ័រដោយផ្ទាល់ទេ (Mixed Content Security)។ សូមប្ដូរទៅប្រើ OpenRouter (ឥតគិតថ្លៃ), Groq ឬ Gemini ឬបើក App លើ Localhost (Start-Studio.bat)!'
    );
  }

  let res: Response;
  try {
    res = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
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
        options: { temperature: 0.7 },
      }),
    });
  } catch (err) {
    throw new Error(
      `មិនអាចភ្ជាប់ទៅ Ollama នៅ ${baseUrl} បានទេ។ សូមប្រាកដថាអ្នកបានបើក Ollama លើកុំព្យូទ័រ និងកំណត់ OLLAMA_ORIGINS="*"។`
    );
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || `Ollama Error (${res.status})`);
  }

  const content = data?.message?.content;
  if (!content) throw new Error('Ollama បានត្រឡប់លទ្ធផលទទេ។');
  return content;
}

async function callAiProviderInBrowser(prompt: string, config: AiProviderConfig): Promise<string> {
  switch (config.provider) {
    case 'openrouter':
      return callOpenRouterInBrowser(prompt, config);
    case 'groq':
      return callGroqInBrowser(prompt, config);
    case 'openai':
      return callOpenAICompatibleInBrowser(prompt, config);
    case 'gemini':
      return callGeminiInBrowser(prompt, config);
    case 'ollama':
      return callOllamaInBrowser(prompt, config);
    default:
      return callOpenRouterInBrowser(prompt, config);
  }
}

function normalizeSection(val: unknown): StorySection {
  const upper = String(val || '')
    .toUpperCase()
    .replace(/[\s-]+/g, '_');
  if (upper.includes('INTRO')) return 'INTRODUCTION';
  if (upper.includes('LESSON')) return 'IMPORTANT_LESSONS';
  if (upper.includes('CONCLU') || upper.includes('OUTRO')) return 'CONCLUSION';
  return 'MAIN_STORY';
}

function normalizeParsedInBrowser(
  parsed: Record<string, any>,
  req: GenerationRequest
): StoryboardProject {
  const durationObj =
    DURATION_PRESETS.find((d) => d.id === req.durationPreset) || DURATION_PRESETS[1];
  const styleObj =
    ANIMATION_STYLES.find((s) => s.id === req.animationStyle) || ANIMATION_STYLES[0];
  const rawScenes = Array.isArray(parsed.scenes) ? parsed.scenes : [];
  if (rawScenes.length === 0) {
    throw new Error('មិនឃើញបញ្ជីឈុត ("scenes") នៅក្នុង JSON ទេ។');
  }
  const now = new Date().toISOString();
  const topicText = String(req.topic || parsed.topic || parsed.videoTitle || 'ប្រធានបទថ្មី').trim();

  return {
    id: `sb-${Date.now()}`,
    createdAt: now,
    updatedAt: now,
    categoryId: req.categoryId || 'custom',
    categoryLabelKh: req.categoryLabelKh || 'ប្រធានបទផ្ទាល់ខ្លួន',
    topic: topicText,
    videoTitle: String(parsed.videoTitle || topicText),
    videoDescription: String(parsed.videoDescription || ''),
    language: 'Khmer',
    durationPreset: req.durationPreset || '5-10',
    durationLabel: durationObj.labelKh,
    videoFormat: '16:9',
    resolution: '1920 × 1080',
    animationStyle: req.animationStyle || '2d-cartoon',
    animationStyleLabel: styleObj.labelEn,
    narratorVoice: req.narratorVoice || 'Khmer Male Voice',
    voiceTone: 'Natural, Clear, Professional, Engaging',
    presenterSetup: req.presenterSetup || 'group',
    presenterSetupLabel: req.presenterSetupLabel || 'Team & Group Presentation (3–5 Characters)',
    actionDynamic: req.actionDynamic || 'cinematic-action',
    actionDynamicLabel: req.actionDynamicLabel || 'Cinematic Action & Movement (No Static Talking Heads)',
    subtitleLanguage: 'Khmer',
    audience: 'General Audience',
    isFictionalNote:
      parsed.isFictionalNote ||
      'តួអង្គ និងស្ថានភាពក្នុងរឿងនេះ ត្រូវបានប្រឌិតឡើងក្នុងគោលបំណងអប់រំ ដើម្បីងាយយល់។',
    characters: Array.isArray(parsed.characters)
      ? parsed.characters.map((c: any) => ({
          name: String(c.name || 'តួអង្គ'),
          role: String(c.role || ''),
          appearance: String(c.appearance || ''),
          outfit: String(c.outfit || ''),
          personality: String(c.personality || ''),
          aiCharacterImagePromptEn:
            String(c.aiCharacterImagePromptEn || '').trim() ||
            getCharacterImagePrompt(c, styleObj.labelEn),
        }))
      : [],
    outline: Array.isArray(parsed.outline)
      ? parsed.outline.map((o: any) => ({
          section: normalizeSection(o.section),
          titleKh: String(o.titleKh || o.title || ''),
          summary: String(o.summary || ''),
          keyPoints: Array.isArray(o.keyPoints) ? o.keyPoints.map(String) : [],
        }))
      : [],
    scenes: rawScenes.map((s: any, idx: number) => ({
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
    })),
    musicSuggestions: Array.isArray(parsed.musicSuggestions) ? parsed.musicSuggestions : [],
    thumbnail: parsed.thumbnail || {
      headlineKh: String(parsed.videoTitle || topicText),
      subTextKh: 'មេរៀនអប់រំ 2D Animation',
      visualConcept: '',
      aiThumbnailPromptEn: '',
    },
  };
}

function mergeSyncedInBrowser(
  project: StoryboardProject,
  synced: Record<string, any>
): StoryboardProject {
  const nextChars = (project.characters || []).map((c, idx) => {
    const match =
      (Array.isArray(synced.characters) &&
        synced.characters.find(
          (sc: any) =>
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
        synced.scenes.find((ss: any) => Number(ss?.sceneNumber) === Number(s.sceneNumber))) ||
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

  const nextThumb =
    String(synced.aiThumbnailPromptEn || synced.thumbnail?.aiThumbnailPromptEn || '').trim() ||
    project.thumbnail?.aiThumbnailPromptEn ||
    '';

  return {
    ...project,
    updatedAt: new Date().toISOString(),
    characters: nextChars,
    scenes: nextScenes,
    thumbnail: {
      ...project.thumbnail,
      aiThumbnailPromptEn: nextThumb,
    },
  };
}

async function handleJson<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data as T;
}

export async function fetchHealth(): Promise<HealthResponse> {
  if (!(await isBackendAlive())) {
    return {
      ok: true,
      hasEnvApiKey: false,
      storyboardsDir: 'Browser Local Storage (Static Hosting Mode)',
      staticMode: true,
    };
  }
  const res = await fetch('/api/health');
  return handleJson<HealthResponse>(res);
}

export async function fetchOllamaModels(baseUrl: string): Promise<{
  available: boolean;
  models: string[];
  error?: string;
}> {
  if (await isBackendAlive()) {
    const res = await fetch(
      `/api/ollama/models?baseUrl=${encodeURIComponent(baseUrl || 'http://127.0.0.1:11434')}`
    );
    return handleJson(res);
  }

  const cleanBase = (baseUrl || 'http://127.0.0.1:11434').replace(/\/+$/, '');
  if (window.location.protocol === 'https:' && cleanBase.startsWith('http:')) {
    return {
      available: false,
      models: [],
      error:
        'Ollama ប្រើបានតែពេលបើកនៅលើកុំព្យូទ័រផ្ទាល់ (Localhost)។ នៅលើ GitHub Pages សូមប្រើ OpenRouter, Groq ឬ Gemini!',
    };
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);
    const resp = await fetch(`${cleanBase}/api/tags`, { signal: controller.signal });
    clearTimeout(timer);
    if (!resp.ok) {
      return { available: false, models: [], error: `HTTP ${resp.status}` };
    }
    const data = await resp.json();
    const models = Array.isArray(data.models) ? data.models.map((m: any) => m.name) : [];
    return { available: true, models };
  } catch {
    return {
      available: false,
      models: [],
      error: 'មិនអាចតភ្ជាប់ទៅ Ollama បានទេ',
    };
  }
}

export async function fetchProjects(): Promise<ProjectSummary[]> {
  if (!(await isBackendAlive())) {
    const list = readLocalProjects();
    return list
      .map(toSummary)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }
  const res = await fetch('/api/projects');
  const data = await handleJson<{ projects: ProjectSummary[] }>(res);
  return data.projects;
}

export async function fetchProjectById(id: string): Promise<StoryboardProject> {
  if (!(await isBackendAlive())) {
    const found = readLocalProjects().find((p) => p.id === id);
    if (!found) throw new Error('Project not found');
    return found;
  }
  const res = await fetch(`/api/projects/${encodeURIComponent(id)}`);
  const data = await handleJson<{ project: StoryboardProject }>(res);
  return data.project;
}

export async function createProject(project: StoryboardProject): Promise<StoryboardProject> {
  if (!(await isBackendAlive())) {
    const now = new Date().toISOString();
    const saved: StoryboardProject = {
      ...project,
      id: project.id || `sb-${Date.now()}`,
      createdAt: project.createdAt || now,
      updatedAt: now,
    };
    const all = readLocalProjects().filter((p) => p.id !== saved.id);
    writeLocalProjects([saved, ...all]);
    return saved;
  }
  const res = await fetch('/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ project }),
  });
  const data = await handleJson<{ project: StoryboardProject }>(res);
  return data.project;
}

export async function saveProject(project: StoryboardProject): Promise<StoryboardProject> {
  if (!(await isBackendAlive())) {
    const saved: StoryboardProject = { ...project, updatedAt: new Date().toISOString() };
    const all = readLocalProjects().map((p) => (p.id === saved.id ? saved : p));
    if (!all.some((p) => p.id === saved.id)) all.unshift(saved);
    writeLocalProjects(all);
    return saved;
  }
  const res = await fetch(`/api/projects/${encodeURIComponent(project.id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ project }),
  });
  const data = await handleJson<{ project: StoryboardProject }>(res);
  return data.project;
}

export async function deleteProject(id: string): Promise<void> {
  if (!(await isBackendAlive())) {
    writeLocalProjects(readLocalProjects().filter((p) => p.id !== id));
    return;
  }
  const res = await fetch(`/api/projects/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  await handleJson<{ ok: boolean }>(res);
}

export async function generateStoryboardWithAI(
  req: GenerationRequest,
  config: AiProviderConfig
): Promise<StoryboardProject> {
  if (await isBackendAlive()) {
    try {
      const durationObj =
        DURATION_PRESETS.find((d) => d.id === req.durationPreset) || DURATION_PRESETS[1];
      const styleObj =
        ANIMATION_STYLES.find((s) => s.id === req.animationStyle) || ANIMATION_STYLES[0];

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...req,
          durationLabel: durationObj.labelKh,
          animationStyleLabel: styleObj.labelEn,
          provider: config.provider,
          apiKey: config.apiKey,
          model: config.model,
          baseUrl: config.baseUrl,
        }),
      });
      const data = await handleJson<{ project: StoryboardProject }>(res);
      return data.project;
    } catch (backendErr) {
      console.warn('Backend generate failed, falling back to direct browser AI call:', backendErr);
      if (backendErr instanceof Error && backendErr.message.includes('API Key')) {
        throw backendErr;
      }
    }
  }

  // Direct client-side generation (GitHub Pages / Static Hosting)
  const prompt = buildJsonImportPrompt(req);
  const rawResponse = await callAiProviderInBrowser(prompt, config);
  const parsed = extractJsonInBrowser(rawResponse);
  const project = normalizeParsedInBrowser(parsed, req);
  return createProject(project);
}

export async function importPastedStoryboard(
  rawText: string,
  req: GenerationRequest
): Promise<StoryboardProject> {
  if (!(await isBackendAlive())) {
    const parsed = extractJsonInBrowser(rawText);
    const project = normalizeParsedInBrowser(parsed, req);
    return createProject(project);
  }
  const durationObj =
    DURATION_PRESETS.find((d) => d.id === req.durationPreset) || DURATION_PRESETS[1];
  const styleObj =
    ANIMATION_STYLES.find((s) => s.id === req.animationStyle) || ANIMATION_STYLES[0];

  const res = await fetch('/api/import-raw', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      rawText,
      meta: {
        ...req,
        durationLabel: durationObj.labelKh,
        animationStyleLabel: styleObj.labelEn,
      },
    }),
  });
  const data = await handleJson<{ project: StoryboardProject }>(res);
  return data.project;
}

export async function syncPromptsWithAI(
  project: StoryboardProject,
  config: AiProviderConfig
): Promise<StoryboardProject> {
  if (await isBackendAlive()) {
    try {
      const res = await fetch('/api/sync-prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project,
          provider: config.provider,
          apiKey: config.apiKey,
          model: config.model,
          baseUrl: config.baseUrl,
        }),
      });
      const data = await handleJson<{ project: StoryboardProject }>(res);
      return data.project;
    } catch (backendErr) {
      console.warn('Backend sync failed, falling back to direct browser AI call:', backendErr);
      if (backendErr instanceof Error && backendErr.message.includes('API Key')) {
        throw backendErr;
      }
    }
  }

  // Direct client-side prompt synchronization (GitHub Pages / Static Hosting)
  const syncPrompt = buildSyncPromptsForWeb(project);
  const rawResponse = await callAiProviderInBrowser(syncPrompt, config);
  const parsed = extractJsonInBrowser(rawResponse);
  const merged = mergeSyncedInBrowser(project, parsed);
  return saveProject(merged);
}

export async function applySyncedPromptsFromText(
  project: StoryboardProject,
  rawText: string
): Promise<StoryboardProject> {
  if (!(await isBackendAlive())) {
    const parsed = extractJsonInBrowser(rawText);
    const merged = mergeSyncedInBrowser(project, parsed);
    return saveProject(merged);
  }
  const res = await fetch('/api/apply-synced-prompts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ project, rawText }),
  });
  const data = await handleJson<{ project: StoryboardProject }>(res);
  return data.project;
}
