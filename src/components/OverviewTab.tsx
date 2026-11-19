import React, { useState } from 'react';
import {
  Copy,
  Check,
  Users,
  ListTree,
  Info,
  Monitor,
  Mic,
  Film,
  Subtitles,
  Image as ImageIcon,
  Edit3,
  Activity,
} from 'lucide-react';
import type { StoryboardProject } from '../types/storyboard';
import {
  formatClock,
  getCharacterImagePrompt,
  getSectionLabel,
} from '../utils/exporters';

interface OverviewTabProps {
  project: StoryboardProject;
  onUpdateProject: (updated: StoryboardProject) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  project,
  onUpdateProject,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [editingCharIdx, setEditingCharIdx] = useState<number | null>(null);

  const totalSeconds = project.scenes.reduce((sum, s) => sum + (s.durationSeconds || 8), 0);

  const copyText = async (key: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const updateCharacterPrompt = (idx: number, nextPrompt: string) => {
    const nextChars = project.characters.map((c, i) =>
      i === idx ? { ...c, aiCharacterImagePromptEn: nextPrompt } : c
    );
    onUpdateProject({ ...project, characters: nextChars });
  };

  return (
    <div className="tab-stack">
      {/* Production Spec Strip */}
      <div className="spec-strip">
        <div className="spec-item">
          <Monitor size={16} />
          <div>
            <span>ទម្រង់ & កម្រិតច្បាស់</span>
            <strong>
              {project.videoFormat} ({project.resolution})
            </strong>
          </div>
        </div>
        <div className="spec-item">
          <Film size={16} />
          <div>
            <span>ចំនួនឈុត & រយៈពេល</span>
            <strong>
              {project.scenes.length} ឈុត ({formatClock(totalSeconds)})
            </strong>
          </div>
        </div>
        <div className="spec-item">
          <Mic size={16} />
          <div>
            <span>អ្នកនិទាន (Narrator)</span>
            <strong>{project.narratorVoice}</strong>
          </div>
        </div>
        <div className="spec-item">
          <Subtitles size={16} />
          <div>
            <span>អក្សររត់ (Subtitle)</span>
            <strong>{project.subtitleLanguage} (SRT Ready)</strong>
          </div>
        </div>
        {project.presenterSetupLabel && (
          <div className="spec-item">
            <Users size={16} />
            <div>
              <span>ទម្រង់តួអង្គ</span>
              <strong>{project.presenterSetupLabel.split('(')[0]}</strong>
            </div>
          </div>
        )}
        {project.actionDynamicLabel && (
          <div className="spec-item">
            <Activity size={16} />
            <div>
              <span>ប្លង់សកម្មភាព</span>
              <strong>{project.actionDynamicLabel.split('(')[0]}</strong>
            </div>
          </div>
        )}
      </div>

      {/* Video Title & YouTube Description */}
      <section className="studio-card">
        <div className="card-header-row">
          <h3>ចំណងជើង និងការពិពណ៌នាវីដេអូ (YouTube Ready)</h3>
          <button
            className="btn-secondary btn-sm"
            onClick={() =>
              copyText('desc', `${project.videoTitle}\n\n${project.videoDescription}`)
            }
          >
            {copiedKey === 'desc' ? <Check size={14} /> : <Copy size={14} />}
            <span>{copiedKey === 'desc' ? 'បានចម្លង!' : 'ចម្លង Title & Description'}</span>
          </button>
        </div>

        <div className="form-group">
          <label>ចំណងជើងវីដេអូ (Video Title)</label>
          <input
            type="text"
            className="input-field input-lg"
            value={project.videoTitle}
            onChange={(e) =>
              onUpdateProject({ ...project, videoTitle: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label>ការពិពណ៌នាវីដេអូ (Video Description)</label>
          <textarea
            rows={5}
            className="input-field textarea-field"
            value={project.videoDescription}
            onChange={(e) =>
              onUpdateProject({ ...project, videoDescription: e.target.value })
            }
          />
        </div>

        {project.isFictionalNote && (
          <div className="accuracy-note">
            <Info size={16} />
            <span>{project.isFictionalNote}</span>
          </div>
        )}
      </section>

      {/* Character Consistency Bible + AI Character Image Prompts */}
      <section className="studio-card">
        <div className="card-header-row">
          <div className="title-with-icon">
            <Users size={18} className="text-amber" />
            <div>
              <h3>តួអង្គសំខាន់ & Prompt បង្កើតរូបភាពតួអង្គ (Character Consistency Sheet)</h3>
              <p className="muted-text">
                ចម្លង AI Character Image Prompt ខាងក្រោមដើម្បីបង្កើតរូបភាពគំរូតួអង្គទុកប្រើជា Reference ឱ្យមុខមាត់ដូចគ្នាគ្រប់ឈុត។
              </p>
            </div>
          </div>
        </div>

        <div className="character-grid">
          {project.characters.map((char, idx) => {
            const promptText = getCharacterImagePrompt(char, project.animationStyleLabel);
            const isEditing = editingCharIdx === idx;
            return (
              <div key={idx} className="character-card">
                <div className="character-head">
                  <div className="character-avatar">{char.name.slice(0, 1)}</div>
                  <div>
                    <h4>{char.name}</h4>
                    <span className="character-role">{char.role}</span>
                  </div>
                </div>
                <div className="character-details">
                  <div>
                    <span className="detail-k">រូបរាង៖</span> {char.appearance}
                  </div>
                  <div>
                    <span className="detail-k">សម្លៀកបំពាក់៖</span> {char.outfit}
                  </div>
                  <div>
                    <span className="detail-k">បុគ្គលិកលក្ខណៈ៖</span> {char.personality}
                  </div>
                </div>

                <div className="prompt-dark-box" style={{ marginTop: 12 }}>
                  <div className="prompt-dark-head">
                    <span>
                      <ImageIcon size={12} /> AI CHARACTER IMAGE PROMPT
                    </span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        className="btn-copy-dark"
                        onClick={() => setEditingCharIdx(isEditing ? null : idx)}
                      >
                        <Edit3 size={11} />
                        <span>{isEditing ? 'Done' : 'Edit'}</span>
                      </button>
                      <button
                        className="btn-copy-dark"
                        onClick={() => copyText(`char-${idx}`, promptText)}
                      >
                        {copiedKey === `char-${idx}` ? <Check size={12} /> : <Copy size={12} />}
                        <span>{copiedKey === `char-${idx}` ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                  {isEditing ? (
                    <textarea
                      rows={4}
                      className="input-field textarea-field mono"
                      style={{ background: '#292524', color: '#f5f5f4', borderColor: '#44403c', fontSize: '0.78rem' }}
                      value={promptText}
                      onChange={(e) => updateCharacterPrompt(idx, e.target.value)}
                    />
                  ) : (
                    <p>{promptText}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Main Story Outline */}
      <section className="studio-card">
        <div className="card-header-row">
          <div className="title-with-icon">
            <ListTree size={18} className="text-amber" />
            <div>
              <h3>គ្រោងសាច់រឿងទាំង ៤ ផ្នែក (Main Story Outline)</h3>
              <p className="muted-text">
                A. Introduction → B. Main Story → C. Important Lessons → D. Conclusion
              </p>
            </div>
          </div>
        </div>

        <div className="outline-grid">
          {project.outline.map((sec, idx) => (
            <div key={idx} className={`outline-card section-${sec.section.toLowerCase()}`}>
              <span className={`section-badge badge-${sec.section.toLowerCase()}`}>
                {getSectionLabel(sec.section)}
              </span>
              <h4>{sec.titleKh}</h4>
              <p>{sec.summary}</p>
              <ul>
                {sec.keyPoints.map((pt, i) => (
                  <li key={i}>{pt}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
