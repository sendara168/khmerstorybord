import type {
  AiProviderConfig,
  GenerationRequest,
  ProjectSummary,
  StoryboardProject,
  StorySection,
} from '../types/storyboard';
import { ANIMATION_STYLES, DURATION_PRESETS } from '../data/topics';
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
  const text = String(rawText || '').trim();
  if (!text) throw new Error('ទិន្នន័យទទេ — មិនមាន JSON សម្រាប់បម្លែងទេ។');
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
    return JSON.parse(text.slice(first, last + 1));
  }
  throw new Error('មិនអាចអានទម្រង់ JSON បានទេ។ សូមចម្លងប្លុក JSON ពេញលេញ (ចាប់ផ្ដើមដោយ { ដល់ })។');
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
  if (!(await isBackendAlive())) {
    return {
      available: false,
      models: [],
      error: 'Ollama ប្រើបានតែពេលបើកនៅលើកុំព្យូទ័រផ្ទាល់ (Localhost)។ នៅលើ GitHub Pages សូមប្រើ OpenRouter, Groq ឬ ChatGPT/Gemini Web!',
    };
  }
  const res = await fetch(
    `/api/ollama/models?baseUrl=${encodeURIComponent(baseUrl || 'http://127.0.0.1:11434')}`
  );
  return handleJson(res);
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
  if (!(await isBackendAlive())) {
    throw new Error(
      'កម្មវិធីកំពុងដំណើរការជា Static Web (GitHub Pages)។ សូមប្រើប្រអប់ «ប្រើ ChatGPT / Gemini Web (ឥតគិតថ្លៃ មិនបាច់ API Key)» ឬ «បង្កើតគម្រោងទទេ (Offline Draft)» ខាងក្រោម ឬ Deploy លើ Render/Railway ដើម្បីប្រើ AI API ផ្ទាល់!'
    );
  }
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
  if (!(await isBackendAlive())) {
    void buildSyncPromptsForWeb(project);
    throw new Error(
      'នៅលើ Static Hosting (GitHub Pages) សូមប្រើប៊ូតុង «Sync តាម ChatGPT / Gemini Web (ឥតគិតថ្លៃ)» ដែលនៅជាប់គ្នា!'
    );
  }
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
