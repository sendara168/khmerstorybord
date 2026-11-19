import React, { useCallback, useEffect, useState } from 'react';
import {
  applySyncedPromptsFromText,
  createProject,
  deleteProject,
  fetchHealth,
  fetchProjectById,
  fetchProjects,
  generateStoryboardWithAI,
  importPastedStoryboard,
  saveProject,
  syncPromptsWithAI,
} from './api/client';
import { AI_PROVIDER_PRESETS, buildOfflineDraftProject } from './data/topics';
import type {
  AiProviderConfig,
  GenerationRequest,
  ProjectSummary,
  StoryboardProject,
} from './types/storyboard';
import { Sidebar } from './components/Sidebar';
import { TopicCreator } from './components/TopicCreator';
import { ProjectStudio } from './components/ProjectStudio';
import { SettingsModal } from './components/SettingsModal';

const STORAGE_KEY_CONFIG = 'khmer_storyboard_ai_config_v2';

const DEFAULT_AI_CONFIG: AiProviderConfig = {
  provider: 'ollama',
  apiKey: '',
  model: 'gemma3',
  baseUrl: 'http://127.0.0.1:11434',
};

function loadInitialConfig(): AiProviderConfig {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_CONFIG);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AiProviderConfig>;
      if (parsed.provider) {
        const preset =
          AI_PROVIDER_PRESETS.find((p) => p.id === parsed.provider) ||
          AI_PROVIDER_PRESETS[0];
        let model = parsed.model || preset.defaultModel;
        // Automatically upgrade deprecated/rate-limited free model slug to openrouter/free
        if (
          model === 'google/gemma-3-27b-it:free' ||
          (parsed.provider === 'openrouter' && model === 'google/gemma-4-31b-it:free')
        ) {
          model = 'openrouter/free';
        }
        const updatedConfig: AiProviderConfig = {
          provider: preset.id,
          apiKey: parsed.apiKey || '',
          model,
          baseUrl: parsed.baseUrl || preset.defaultBaseUrl,
        };
        if (parsed.model !== model) {
          persistConfig(updatedConfig);
        }
        return updatedConfig;
      }
    }
  } catch {
    // ignore storage errors
  }
  return DEFAULT_AI_CONFIG;
}

function persistConfig(cfg: AiProviderConfig): void {
  try {
    window.localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(cfg));
  } catch {
    // ignore storage errors
  }
}

export const App: React.FC = () => {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [activeView, setActiveView] = useState<'creator' | 'project'>('creator');
  const [currentProject, setCurrentProject] = useState<StoryboardProject | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isSyncingPrompts, setIsSyncingPrompts] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [hasEnvApiKey, setHasEnvApiKey] = useState(false);
  const [aiConfig, setAiConfig] = useState<AiProviderConfig>(loadInitialConfig);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  }, []);

  const refreshProjects = useCallback(async () => {
    try {
      const list = await fetchProjects();
      setProjects(list);
      return list;
    } catch (err) {
      console.error(err);
      return [];
    }
  }, []);

  useEffect(() => {
    fetchHealth()
      .then((h) => setHasEnvApiKey(h.hasEnvApiKey))
      .catch(() => {});

    refreshProjects().then(async (list) => {
      if (list.length > 0) {
        try {
          const first = await fetchProjectById(list[0].id);
          setCurrentProject(first);
          setActiveView('project');
        } catch {
          setActiveView('creator');
        }
      }
    });
  }, [refreshProjects]);

  const handleSelectProject = async (id: string) => {
    try {
      setErrorMessage(null);
      const proj = await fetchProjectById(id);
      setCurrentProject(proj);
      setIsDirty(false);
      setActiveView('project');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'មិនអាចបើកគម្រោងបានទេ');
    }
  };

  const handleUpdateProject = (updated: StoryboardProject) => {
    setCurrentProject(updated);
    setIsDirty(true);
  };

  const handleSaveProject = async () => {
    if (!currentProject) return;
    setIsSaving(true);
    try {
      const saved = await saveProject(currentProject);
      setCurrentProject(saved);
      setIsDirty(false);
      await refreshProjects();
      showToast('បានរក្សាទុក Storyboard (.json, .md, -narrator.txt, .srt) រួចរាល់!');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'រក្សាទុកមិនជោគជ័យ');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm('តើអ្នកពិតជាចង់លុបគម្រោង Storyboard នេះមែនទេ?')) return;
    try {
      await deleteProject(id);
      const list = await refreshProjects();
      if (currentProject?.id === id) {
        if (list.length > 0) {
          const next = await fetchProjectById(list[0].id);
          setCurrentProject(next);
          setActiveView('project');
        } else {
          setCurrentProject(null);
          setActiveView('creator');
        }
      }
      showToast('បានលុបគម្រោងរួចរាល់');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'លុបមិនជោគជ័យ');
    }
  };

  const handleImportJson = async (file: File) => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as StoryboardProject;
      if (!parsed.scenes || !Array.isArray(parsed.scenes)) {
        throw new Error('ឯកសារ JSON មិនត្រឹមត្រូវតាមទម្រង់ Storyboard ទេ។');
      }
      const saved = await createProject(parsed);
      await refreshProjects();
      setCurrentProject(saved);
      setIsDirty(false);
      setActiveView('project');
      showToast('បាននាំចូល Storyboard ជោគជ័យ!');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'នាំចូល JSON មិនជោគជ័យ');
    }
  };

  const handleImportPasted = async (rawText: string, req: GenerationRequest) => {
    setIsImporting(true);
    setErrorMessage(null);
    try {
      const saved = await importPastedStoryboard(rawText, req);
      await refreshProjects();
      setCurrentProject(saved);
      setIsDirty(false);
      setActiveView('project');
      showToast(`បានបម្លែង Storyboard (${saved.scenes.length} ឈុត) និងរក្សាទុករួចរាល់!`);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'មិនអាចបម្លែង JSON ពីលទ្ធផលបានទេ'
      );
    } finally {
      setIsImporting(false);
    }
  };

  const handleCreateOfflineDraft = async (req: GenerationRequest) => {
    setErrorMessage(null);
    try {
      const draft = buildOfflineDraftProject(req);
      const saved = await createProject(draft);
      await refreshProjects();
      setCurrentProject(saved);
      setIsDirty(false);
      setActiveView('project');
      showToast(`បានបង្កើតគម្រោង Offline Draft (${saved.scenes.length} ឈុត) រួចរាល់!`);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'មិនអាចបង្កើតគម្រោង Draft បានទេ'
      );
    }
  };

  const handleGenerate = async (req: GenerationRequest) => {
    setIsGenerating(true);
    setErrorMessage(null);
    try {
      const created = await generateStoryboardWithAI(req, aiConfig);
      await refreshProjects();
      setCurrentProject(created);
      setIsDirty(false);
      setActiveView('project');
      showToast(`បានបង្កើត Storyboard ថ្មី (${created.scenes.length} ឈុត) និងរក្សាទុករួចរាល់!`);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'មិនអាចបង្កើត Storyboard បានទេ'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSyncPromptsWithAI = async () => {
    if (!currentProject) return;
    setIsSyncingPrompts(true);
    setSyncError(null);
    try {
      const updated = await syncPromptsWithAI(currentProject, aiConfig);
      setCurrentProject(updated);
      setIsDirty(false);
      await refreshProjects();
      showToast('បានធ្វើសមកាលកម្ម Prompt តួអង្គ + រូបភាព + វីដេអូ ឱ្យត្រូវតាម Script រួចរាល់!');
    } catch (err) {
      setSyncError(
        err instanceof Error ? err.message : 'មិនអាចធ្វើសមកាលកម្ម Prompts បានទេ'
      );
    } finally {
      setIsSyncingPrompts(false);
    }
  };

  const handleApplySyncedText = async (rawText: string) => {
    if (!currentProject) return;
    setIsSyncingPrompts(true);
    setSyncError(null);
    try {
      const updated = await applySyncedPromptsFromText(currentProject, rawText);
      setCurrentProject(updated);
      setIsDirty(false);
      await refreshProjects();
      showToast('បានអនុវត្ត Prompts ថ្មីចូលគ្រប់តួអង្គ និងគ្រប់ឈុតរួចរាល់!');
    } catch (err) {
      setSyncError(
        err instanceof Error ? err.message : 'មិនអាចអនុវត្ត Prompts ពី JSON បានទេ'
      );
    } finally {
      setIsSyncingPrompts(false);
    }
  };

  const handleSaveSettings = (nextConfig: AiProviderConfig) => {
    setAiConfig(nextConfig);
    persistConfig(nextConfig);
    setErrorMessage(null);
    showToast(`បានប្ដូរទៅប្រើ ${nextConfig.provider.toUpperCase()} (${nextConfig.model})`);
  };

  const isLocalOpenAI =
    aiConfig.provider === 'openai' &&
    /^https?:\/\/(localhost|127\.0\.0\.1)/i.test(aiConfig.baseUrl || '');

  const isAiReady =
    aiConfig.provider === 'ollama' ||
    isLocalOpenAI ||
    Boolean(aiConfig.apiKey.trim()) ||
    (aiConfig.provider === 'gemini' && hasEnvApiKey);

  return (
    <div className="app-shell">
      <Sidebar
        projects={projects}
        activeView={activeView}
        selectedProjectId={currentProject?.id || null}
        provider={aiConfig.provider}
        isAiReady={isAiReady}
        onSelectCreator={() => {
          setErrorMessage(null);
          setActiveView('creator');
        }}
        onSelectProject={handleSelectProject}
        onDeleteProject={handleDeleteProject}
        onImportJson={handleImportJson}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <main className="main-canvas">
        {activeView === 'creator' || !currentProject ? (
          <TopicCreator
            isGenerating={isGenerating}
            isImporting={isImporting}
            errorMessage={errorMessage}
            aiConfig={aiConfig}
            isAiReady={isAiReady}
            onGenerate={handleGenerate}
            onImportPasted={handleImportPasted}
            onCreateOfflineDraft={handleCreateOfflineDraft}
            onOpenSettings={() => setSettingsOpen(true)}
          />
        ) : (
          <ProjectStudio
            project={currentProject}
            aiConfig={aiConfig}
            isAiReady={isAiReady}
            isDirty={isDirty}
            isSaving={isSaving}
            isSyncingPrompts={isSyncingPrompts}
            syncError={syncError}
            onUpdateProject={handleUpdateProject}
            onSaveProject={handleSaveProject}
            onSyncPromptsWithAI={handleSyncPromptsWithAI}
            onApplySyncedText={handleApplySyncedText}
            onOpenSettings={() => setSettingsOpen(true)}
          />
        )}
      </main>

      <SettingsModal
        isOpen={settingsOpen}
        config={aiConfig}
        hasEnvApiKey={hasEnvApiKey}
        onSave={handleSaveSettings}
        onClose={() => setSettingsOpen(false)}
      />

      {toast && <div className="toast-banner">{toast}</div>}
    </div>
  );
};

export default App;
