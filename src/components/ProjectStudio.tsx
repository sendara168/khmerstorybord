import React, { useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  Mic,
  Clapperboard,
  Sparkles,
  Subtitles,
  Music,
  Save,
  Download,
  Check,
  Loader2,
} from 'lucide-react';
import type { AiProviderConfig, StoryboardProject } from '../types/storyboard';
import { OverviewTab } from './OverviewTab';
import { FullDocumentTab } from './FullDocumentTab';
import { NarratorScriptTab } from './NarratorScriptTab';
import { StoryboardTab } from './StoryboardTab';
import { PromptsTab } from './PromptsTab';
import { SubtitleTab } from './SubtitleTab';
import { ProductionKitTab } from './ProductionKitTab';
import {
  downloadTextFile,
  formatClock,
  generateCopyReadyFullPackage,
  generateFullMarkdownPackage,
  generateKhmerSrt,
  generatePromptsBatch,
  generateStandaloneNarratorScript,
} from '../utils/exporters';

type StudioTabId =
  | 'overview'
  | 'fulldoc'
  | 'narrator'
  | 'storyboard'
  | 'prompts'
  | 'subtitles'
  | 'kit';

interface ProjectStudioProps {
  project: StoryboardProject;
  aiConfig: AiProviderConfig;
  isAiReady: boolean;
  isDirty: boolean;
  isSaving: boolean;
  isSyncingPrompts: boolean;
  syncError: string | null;
  onUpdateProject: (updated: StoryboardProject) => void;
  onSaveProject: () => void;
  onSyncPromptsWithAI: () => void;
  onApplySyncedText: (rawText: string) => void;
  onOpenSettings: () => void;
}

export const ProjectStudio: React.FC<ProjectStudioProps> = ({
  project,
  aiConfig,
  isAiReady,
  isDirty,
  isSaving,
  isSyncingPrompts,
  syncError,
  onUpdateProject,
  onSaveProject,
  onSyncPromptsWithAI,
  onApplySyncedText,
  onOpenSettings,
}) => {
  const [activeTab, setActiveTab] = useState<StudioTabId>('storyboard');
  const [exportOpen, setExportOpen] = useState(false);

  const totalSeconds = project.scenes.reduce((sum, s) => sum + (s.durationSeconds || 8), 0);

  return (
    <div className="studio-workspace">
      {/* Workspace Header */}
      <header className="studio-header">
        <div className="studio-header-info">
          <div className="studio-breadcrumb">
            <span className="cat-pill">{project.categoryLabelKh}</span>
            <span className="meta-dot">•</span>
            <span>{project.animationStyleLabel}</span>
            <span className="meta-dot">•</span>
            <span>
              {project.scenes.length} ឈុត ({formatClock(totalSeconds)})
            </span>
          </div>
          <h1 className="studio-project-title">{project.videoTitle}</h1>
        </div>

        <div className="studio-header-actions">
          <button
            className={`btn-save ${isDirty ? 'dirty' : ''}`}
            onClick={onSaveProject}
            disabled={isSaving || !isDirty}
          >
            {isSaving ? (
              <Loader2 size={15} className="spin" />
            ) : isDirty ? (
              <Save size={15} />
            ) : (
              <Check size={15} />
            )}
            <span>
              {isSaving
                ? 'កំពុងរក្សាទុក...'
                : isDirty
                ? 'រក្សាទុកការកែប្រែ'
                : 'បានរក្សាទុករួច'}
            </span>
          </button>

          <div className="export-dropdown-wrap">
            <button
              className="btn-primary btn-sm"
              onClick={() => setExportOpen((v) => !v)}
            >
              <Download size={15} />
              <span>នាំចេញឯកសារ (Export)</span>
            </button>

            {exportOpen && (
              <div className="export-menu" onMouseLeave={() => setExportOpen(false)}>
                <button
                  onClick={() => {
                    downloadTextFile(
                      `${project.id}-full-package.txt`,
                      generateCopyReadyFullPackage(project)
                    );
                    setExportOpen(false);
                  }}
                >
                  <strong>អត្ថបទពេញលេញងាយ Copy (.TXT)</strong>
                  <span>Script ខ្មែរ + តួអង្គ + រូបភាព + វីដេអូនិយាយខ្មែរ</span>
                </button>
                <button
                  onClick={() => {
                    downloadTextFile(
                      `${project.id}.md`,
                      generateFullMarkdownPackage(project),
                      'text/markdown;charset=utf-8'
                    );
                    setExportOpen(false);
                  }}
                >
                  <strong>កញ្ចប់ពេញលេញ (.MD)</strong>
                  <span>Script + Storyboard + Prompts + SRT</span>
                </button>
                <button
                  onClick={() => {
                    downloadTextFile(
                      `${project.id}-narrator.txt`,
                      generateStandaloneNarratorScript(project)
                    );
                    setExportOpen(false);
                  }}
                >
                  <strong>Script អ្នកនិទានដាច់ដោយឡែក (.TXT)</strong>
                  <span>ងាយអានថតសំឡេង ឬដាក់ AI Voiceover</span>
                </button>
                <button
                  onClick={() => {
                    downloadTextFile(`${project.id}.srt`, generateKhmerSrt(project));
                    setExportOpen(false);
                  }}
                >
                  <strong>អក្សររត់ខ្មែរ Subtitle (.SRT)</strong>
                  <span>នាំចូល CapCut / Premiere / YouTube</span>
                </button>
                <button
                  onClick={() => {
                    downloadTextFile(
                      `${project.id}-ai-prompts.txt`,
                      generatePromptsBatch(project)
                    );
                    setExportOpen(false);
                  }}
                >
                  <strong>AI Image & Video Prompts (.TXT)</strong>
                  <span>Prompts អង់គ្លេសគ្រប់ឈុត + Thumbnail</span>
                </button>
                <button
                  onClick={() => {
                    downloadTextFile(
                      `${project.id}.json`,
                      JSON.stringify(project, null, 2),
                      'application/json;charset=utf-8'
                    );
                    setExportOpen(false);
                  }}
                >
                  <strong>ទិន្នន័យគម្រោង (.JSON)</strong>
                  <span>សម្រាប់រក្សាទុកបម្រុង ឬនាំចូលវិញ</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Studio Tabs */}
      <nav className="studio-tabs">
        <button
          className={`studio-tab ${activeTab === 'fulldoc' ? 'active' : ''}`}
          onClick={() => setActiveTab('fulldoc')}
        >
          <FileText size={15} />
          <span>អត្ថបទពេញលេញ (Copy ងាយ)</span>
        </button>
        <button
          className={`studio-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <LayoutDashboard size={15} />
          <span>ទិដ្ឋភាពទូទៅ & គ្រោងរឿង</span>
        </button>
        <button
          className={`studio-tab ${activeTab === 'narrator' ? 'active' : ''}`}
          onClick={() => setActiveTab('narrator')}
        >
          <Mic size={15} />
          <span>Script អ្នកនិទានពេញលេញ</span>
        </button>
        <button
          className={`studio-tab ${activeTab === 'storyboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('storyboard')}
        >
          <Clapperboard size={15} />
          <span>Storyboard ({project.scenes.length} ឈុត)</span>
        </button>
        <button
          className={`studio-tab ${activeTab === 'prompts' ? 'active' : ''}`}
          onClick={() => setActiveTab('prompts')}
        >
          <Sparkles size={15} />
          <span>Prompt AI (រូបភាព • វីដេអូ • Thumbnail • ភ្លេង)</span>
        </button>
        <button
          className={`studio-tab ${activeTab === 'subtitles' ? 'active' : ''}`}
          onClick={() => setActiveTab('subtitles')}
        >
          <Subtitles size={15} />
          <span>អក្សររត់ (Khmer SRT)</span>
        </button>
        <button
          className={`studio-tab ${activeTab === 'kit' ? 'active' : ''}`}
          onClick={() => setActiveTab('kit')}
        >
          <Music size={15} />
          <span>ភ្លេង & Master Prompt</span>
        </button>
      </nav>

      {/* Active Tab Content */}
      <div className="studio-tab-content">
        {activeTab === 'fulldoc' && <FullDocumentTab project={project} />}
        {activeTab === 'overview' && (
          <OverviewTab project={project} onUpdateProject={onUpdateProject} />
        )}
        {activeTab === 'narrator' && (
          <NarratorScriptTab project={project} onUpdateProject={onUpdateProject} />
        )}
        {activeTab === 'storyboard' && (
          <StoryboardTab project={project} onUpdateProject={onUpdateProject} />
        )}
        {activeTab === 'prompts' && (
          <PromptsTab
            project={project}
            aiConfig={aiConfig}
            isAiReady={isAiReady}
            isSyncing={isSyncingPrompts}
            syncError={syncError}
            onSyncWithAI={onSyncPromptsWithAI}
            onApplySyncedText={onApplySyncedText}
            onOpenSettings={onOpenSettings}
          />
        )}
        {activeTab === 'subtitles' && <SubtitleTab project={project} />}
        {activeTab === 'kit' && <ProductionKitTab project={project} />}
      </div>
    </div>
  );
};
