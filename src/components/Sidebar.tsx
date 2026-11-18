import React, { useRef } from 'react';
import {
  Clapperboard,
  Plus,
  Settings,
  Trash2,
  Upload,
  Film,
  BookOpen,
  Clock,
} from 'lucide-react';
import type { AiProviderId, ProjectSummary } from '../types/storyboard';
import { formatClock } from '../utils/exporters';

interface SidebarProps {
  projects: ProjectSummary[];
  activeView: 'creator' | 'project';
  selectedProjectId: string | null;
  provider: AiProviderId;
  isAiReady: boolean;
  onSelectCreator: () => void;
  onSelectProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
  onImportJson: (file: File) => void;
  onOpenSettings: () => void;
}

const PROVIDER_SHORT: Record<AiProviderId, string> = {
  ollama: 'Ollama (Offline)',
  openrouter: 'OpenRouter',
  groq: 'Groq Cloud',
  gemini: 'Gemini API',
  openai: 'OpenAI / Local',
};

export const Sidebar: React.FC<SidebarProps> = ({
  projects,
  activeView,
  selectedProjectId,
  provider,
  isAiReady,
  onSelectCreator,
  onSelectProject,
  onDeleteProject,
  onImportJson,
  onOpenSettings,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">
          <Clapperboard size={20} />
        </div>
        <div>
          <div className="brand-title">Khmer Storyboard</div>
          <div className="brand-sub">2D Educational Studio</div>
        </div>
      </div>

      <div className="sidebar-actions">
        <button
          className={`btn-create-new ${activeView === 'creator' ? 'active' : ''}`}
          onClick={onSelectCreator}
        >
          <Plus size={18} />
          <span>បង្កើតវីដេអូថ្មី (New Topic)</span>
        </button>

        <button
          className="btn-sidebar-ghost"
          onClick={() => fileInputRef.current?.click()}
          title="នាំចូលឯកសារ Storyboard JSON"
        >
          <Upload size={15} />
          <span>នាំចូល JSON</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          style={{ display: 'none' }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              onImportJson(file);
              e.target.value = '';
            }
          }}
        />
      </div>

      <div className="sidebar-section-label">
        <BookOpen size={13} />
        <span>បណ្ណាល័យ Storyboard ({projects.length})</span>
      </div>

      <div className="project-list">
        {projects.length === 0 ? (
          <div className="empty-sidebar">
            មិនទាន់មានគម្រោងទេ។ ចុច «បង្កើតវីដេអូថ្មី» ដើម្បីចាប់ផ្ដើម។
          </div>
        ) : (
          projects.map((proj) => {
            const isSelected = activeView === 'project' && selectedProjectId === proj.id;
            return (
              <div
                key={proj.id}
                className={`project-item ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelectProject(proj.id)}
              >
                <div className="project-item-top">
                  <span className="project-item-title">{proj.videoTitle}</span>
                  <button
                    className="btn-icon-danger"
                    title="លុបគម្រោង"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteProject(proj.id);
                    }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <div className="project-item-meta">
                  <span>
                    <Film size={12} /> {proj.sceneCount} ឈុត
                  </span>
                  <span>
                    <Clock size={12} /> {formatClock(proj.totalSeconds)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="sidebar-footer">
        <button className="btn-settings" onClick={onOpenSettings}>
          <Settings size={16} />
          <span>AI: {PROVIDER_SHORT[provider] || provider}</span>
          <span className={`status-dot ${isAiReady ? 'connected' : ''}`} />
        </button>
      </div>
    </aside>
  );
};
