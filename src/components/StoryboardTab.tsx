import React, { useMemo, useState } from 'react';
import {
  Copy,
  Check,
  Edit3,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Search,
  Camera,
  Music,
  User,
  Users,
  Type,
  MessageSquare,
  Image as ImageIcon,
  Video,
  Clock,
} from 'lucide-react';
import type {
  StoryboardProject,
  StoryboardScene,
  StorySection,
} from '../types/storyboard';
import {
  buildKhmerSpeakingVideoPrompt,
  getCharacterImagePrompt,
  getSectionLabel,
} from '../utils/exporters';

interface StoryboardTabProps {
  project: StoryboardProject;
  onUpdateProject: (updated: StoryboardProject) => void;
}

const SECTIONS: Array<{ id: 'ALL' | StorySection; label: string }> = [
  { id: 'ALL', label: 'ទាំងអស់' },
  { id: 'INTRODUCTION', label: 'A. ផ្នែកផ្ដើម' },
  { id: 'MAIN_STORY', label: 'B. សាច់រឿង' },
  { id: 'IMPORTANT_LESSONS', label: 'C. មេរៀនសំខាន់' },
  { id: 'CONCLUSION', label: 'D. បញ្ចប់' },
];

export const StoryboardTab: React.FC<StoryboardTabProps> = ({
  project,
  onUpdateProject,
}) => {
  const [sectionFilter, setSectionFilter] = useState<'ALL' | StorySection>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingSceneNum, setEditingSceneNum] = useState<number | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const filteredScenes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return project.scenes.filter((s) => {
      if (sectionFilter !== 'ALL' && s.section !== sectionFilter) return false;
      if (!q) return true;
      return (
        s.sceneTitle.toLowerCase().includes(q) ||
        s.narratorScriptKh.toLowerCase().includes(q) ||
        s.visualDescription.toLowerCase().includes(q) ||
        s.aiImagePromptEn.toLowerCase().includes(q) ||
        String(s.sceneNumber).includes(q)
      );
    });
  }, [project.scenes, sectionFilter, searchQuery]);

  const copyPrompt = async (key: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1600);
  };

  const renumberScenes = (scenes: StoryboardScene[]): StoryboardScene[] =>
    scenes.map((s, idx) => ({ ...s, sceneNumber: idx + 1 }));

  const updateScene = (sceneNumber: number, patch: Partial<StoryboardScene>) => {
    const next = project.scenes.map((s) =>
      s.sceneNumber === sceneNumber ? { ...s, ...patch } : s
    );
    onUpdateProject({ ...project, scenes: next });
  };

  const moveScene = (sceneNumber: number, dir: -1 | 1) => {
    const idx = project.scenes.findIndex((s) => s.sceneNumber === sceneNumber);
    const targetIdx = idx + dir;
    if (idx < 0 || targetIdx < 0 || targetIdx >= project.scenes.length) return;
    const copy = [...project.scenes];
    const [item] = copy.splice(idx, 1);
    copy.splice(targetIdx, 0, item);
    onUpdateProject({ ...project, scenes: renumberScenes(copy) });
    if (editingSceneNum === sceneNumber) {
      setEditingSceneNum(targetIdx + 1);
    }
  };

  const deleteScene = (sceneNumber: number) => {
    if (project.scenes.length <= 1) return;
    const next = renumberScenes(
      project.scenes.filter((s) => s.sceneNumber !== sceneNumber)
    );
    onUpdateProject({ ...project, scenes: next });
    if (editingSceneNum === sceneNumber) setEditingSceneNum(null);
  };

  const addScene = () => {
    const nextNum = project.scenes.length + 1;
    const newScene: StoryboardScene = {
      sceneNumber: nextNum,
      section: sectionFilter === 'ALL' ? 'MAIN_STORY' : sectionFilter,
      sceneTitle: `ឈុតថ្មីទី ${nextNum}`,
      durationSeconds: 8,
      visualDescription: 'ពិពណ៌នារូបភាពក្នុងឈុតនេះ...',
      character: project.characters[0]?.name || 'តួអង្គឯក',
      characterAction: 'សកម្មភាពតួអង្គ...',
      narratorScriptKh: 'សរសេរអត្ថបទអ្នកនិទានជាភាសាខ្មែរនៅទីនេះ...',
      characterDialogue: '',
      onScreenText: '',
      aiImagePromptEn:
        'Clean 2D cartoon educational illustration, smooth cel-shaded vector style, warm cinematic lighting, consistent character design, 16:9 composition, no text inside image.',
      aiVideoPromptEn:
        'Smooth 2D cartoon educational animation with gentle expressive character motion and subtle warm lighting.',
      cameraMovement: 'Slow push-in',
      bgmAndSfx: 'Warm documentary background music',
    };
    onUpdateProject({ ...project, scenes: [...project.scenes, newScene] });
    setEditingSceneNum(nextNum);
  };

  return (
    <div className="tab-stack">
      {/* Character Reference Image Prompts Quick Strip */}
      {project.characters.length > 0 && (
        <details className="character-ref-strip" open>
          <summary>
            <span className="title-with-icon" style={{ alignItems: 'center' }}>
              <Users size={16} className="text-amber" />
              <strong>
                Prompt បង្កើតរូបភាពតួអង្គ ({project.characters.length} តួអង្គ — បង្កើតទុកជា Reference មុនគេ)
              </strong>
            </span>
          </summary>
          <div className="character-ref-grid">
            {project.characters.map((char, idx) => {
              const promptText = getCharacterImagePrompt(
                char,
                project.animationStyleLabel
              );
              const copyId = `sb-char-${idx}`;
              return (
                <div key={idx} className="prompt-dark-box">
                  <div className="prompt-dark-head">
                    <span>
                      <Users size={12} /> {char.name} — CHARACTER IMAGE PROMPT
                    </span>
                    <button
                      className="btn-copy-dark"
                      onClick={() => copyPrompt(copyId, promptText)}
                    >
                      {copiedKey === copyId ? <Check size={12} /> : <Copy size={12} />}
                      <span>{copiedKey === copyId ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                  <p>{promptText}</p>
                </div>
              );
            })}
          </div>
        </details>
      )}

      {/* Toolbar */}
      <div className="storyboard-toolbar">
        <div className="filter-pills">
          {SECTIONS.map((sec) => (
            <button
              key={sec.id}
              className={`filter-pill ${sectionFilter === sec.id ? 'active' : ''}`}
              onClick={() => setSectionFilter(sec.id)}
            >
              {sec.label}
            </button>
          ))}
        </div>

        <div className="toolbar-right">
          <div className="search-box">
            <Search size={15} />
            <input
              type="text"
              placeholder="ស្វែងរកឈុត ឬអត្ថបទ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="btn-primary btn-sm" onClick={addScene}>
            <Plus size={15} />
            <span>បន្ថែមឈុតថ្មី</span>
          </button>
        </div>
      </div>

      {/* Scene Cards */}
      <div className="scenes-list">
        {filteredScenes.map((scene) => {
          const isEditing = editingSceneNum === scene.sceneNumber;
          const sceneCode = String(scene.sceneNumber).padStart(2, '0');

          return (
            <article key={scene.sceneNumber} className="scene-card">
              <div className="scene-card-header">
                <div className="scene-header-left">
                  <span className="scene-badge-number">Scene {sceneCode}</span>
                  <span className={`section-badge badge-${scene.section.toLowerCase()}`}>
                    {getSectionLabel(scene.section).split(' ')[0]}
                  </span>
                  <h4 className="scene-title">{scene.sceneTitle}</h4>
                </div>

                <div className="scene-header-actions">
                  <span className="duration-tag">
                    <Clock size={12} /> {scene.durationSeconds}s
                  </span>
                  <button
                    className="btn-icon-subtle"
                    title="ផ្លាស់ទីឡើងលើ"
                    onClick={() => moveScene(scene.sceneNumber, -1)}
                    disabled={scene.sceneNumber === 1}
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    className="btn-icon-subtle"
                    title="ផ្លាស់ទីចុះក្រោម"
                    onClick={() => moveScene(scene.sceneNumber, 1)}
                    disabled={scene.sceneNumber === project.scenes.length}
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button
                    className={`btn-icon-subtle ${isEditing ? 'active' : ''}`}
                    title="កែសម្រួលឈុតនេះ"
                    onClick={() =>
                      setEditingSceneNum(isEditing ? null : scene.sceneNumber)
                    }
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    className="btn-icon-subtle danger"
                    title="លុបឈុតនេះ"
                    onClick={() => deleteScene(scene.sceneNumber)}
                    disabled={project.scenes.length <= 1}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {isEditing ? (
                <div className="scene-edit-grid">
                  <div className="edit-row-3">
                    <div className="form-group">
                      <label>ចំណងជើងឈុត (Scene Title)</label>
                      <input
                        className="input-field"
                        value={scene.sceneTitle}
                        onChange={(e) =>
                          updateScene(scene.sceneNumber, { sceneTitle: e.target.value })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>ផ្នែក (Section)</label>
                      <select
                        className="input-field"
                        value={scene.section}
                        onChange={(e) =>
                          updateScene(scene.sceneNumber, {
                            section: e.target.value as StorySection,
                          })
                        }
                      >
                        <option value="INTRODUCTION">A. INTRODUCTION</option>
                        <option value="MAIN_STORY">B. MAIN STORY</option>
                        <option value="IMPORTANT_LESSONS">C. IMPORTANT LESSONS</option>
                        <option value="CONCLUSION">D. CONCLUSION</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>រយៈពេល (វិនាទី)</label>
                      <input
                        type="number"
                        min={3}
                        max={20}
                        className="input-field"
                        value={scene.durationSeconds}
                        onChange={(e) =>
                          updateScene(scene.sceneNumber, {
                            durationSeconds: Math.max(3, Number(e.target.value) || 8),
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Script អ្នកនិទាន (Khmer Narrator Script)</label>
                    <textarea
                      rows={3}
                      className="input-field textarea-field"
                      value={scene.narratorScriptKh}
                      onChange={(e) =>
                        updateScene(scene.sceneNumber, {
                          narratorScriptKh: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="edit-row-2">
                    <div className="form-group">
                      <label>ការពិពណ៌នារូបភាព (Visual Description)</label>
                      <textarea
                        rows={2}
                        className="input-field textarea-field"
                        value={scene.visualDescription}
                        onChange={(e) =>
                          updateScene(scene.sceneNumber, {
                            visualDescription: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>សកម្មភាពតួអង្គ (Character Action)</label>
                      <textarea
                        rows={2}
                        className="input-field textarea-field"
                        value={scene.characterAction}
                        onChange={(e) =>
                          updateScene(scene.sceneNumber, {
                            characterAction: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="edit-row-3">
                    <div className="form-group">
                      <label>តួអង្គ (Character)</label>
                      <input
                        className="input-field"
                        value={scene.character}
                        onChange={(e) =>
                          updateScene(scene.sceneNumber, { character: e.target.value })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>សន្ទនាតួអង្គ (Dialogue — បើមាន)</label>
                      <input
                        className="input-field"
                        value={scene.characterDialogue || ''}
                        onChange={(e) =>
                          updateScene(scene.sceneNumber, {
                            characterDialogue: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>អក្សរលើអេក្រង់ (On-screen Text)</label>
                      <input
                        className="input-field"
                        value={scene.onScreenText || ''}
                        onChange={(e) =>
                          updateScene(scene.sceneNumber, { onScreenText: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="edit-row-2">
                    <div className="form-group">
                      <label>AI Image Prompt (English)</label>
                      <textarea
                        rows={3}
                        className="input-field textarea-field mono"
                        value={scene.aiImagePromptEn}
                        onChange={(e) =>
                          updateScene(scene.sceneNumber, {
                            aiImagePromptEn: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>AI Video Animation Prompt (English)</label>
                      <textarea
                        rows={3}
                        className="input-field textarea-field mono"
                        value={scene.aiVideoPromptEn}
                        onChange={(e) =>
                          updateScene(scene.sceneNumber, {
                            aiVideoPromptEn: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="edit-row-2">
                    <div className="form-group">
                      <label>ចលនាកាមេរ៉ា (Camera Movement)</label>
                      <input
                        className="input-field"
                        value={scene.cameraMovement}
                        onChange={(e) =>
                          updateScene(scene.sceneNumber, {
                            cameraMovement: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>ភ្លេង & សំឡេងរំខាន (BGM / SFX)</label>
                      <input
                        className="input-field"
                        value={scene.bgmAndSfx}
                        onChange={(e) =>
                          updateScene(scene.sceneNumber, { bgmAndSfx: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      className="btn-primary btn-sm"
                      onClick={() => setEditingSceneNum(null)}
                    >
                      រួចរាល់ (Done Editing)
                    </button>
                  </div>
                </div>
              ) : (
                <div className="scene-card-body">
                  {/* Narrator Block */}
                  <div className="scene-narrator-box">
                    <span className="box-micro-label">NARRATOR SCRIPT (KHMER)</span>
                    <p className="scene-narrator-text">«{scene.narratorScriptKh}»</p>
                    {scene.characterDialogue?.trim() && (
                      <div className="scene-dialogue-pill">
                        <MessageSquare size={13} />
                        <span>{scene.characterDialogue}</span>
                      </div>
                    )}
                  </div>

                  {/* Visual & Metadata */}
                  <div className="scene-details-grid">
                    <div className="detail-item">
                      <span className="detail-label">Visual Description</span>
                      <p>{scene.visualDescription}</p>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">
                        {/&|,|និង|ក្រុម|team/i.test(scene.character) ? (
                          <Users size={12} className="text-amber" />
                        ) : (
                          <User size={12} />
                        )}{' '}
                        តួអង្គ & ប្លង់សកម្មភាព (Character & Action)
                      </span>
                      <p>
                        <strong>{scene.character}</strong> — <span>{scene.characterAction}</span>
                      </p>
                    </div>
                  </div>

                  <div className="scene-meta-bar">
                    {scene.onScreenText?.trim() && (
                      <span className="meta-chip onscreen">
                        <Type size={12} /> On-screen: {scene.onScreenText}
                      </span>
                    )}
                    <span className="meta-chip">
                      <Camera size={12} /> {scene.cameraMovement}
                    </span>
                    <span className="meta-chip">
                      <Music size={12} /> {scene.bgmAndSfx}
                    </span>
                  </div>

                  {/* AI Prompts Split */}
                  <div className="scene-prompts-grid">
                    <div className="prompt-dark-box">
                      <div className="prompt-dark-head">
                        <span>
                          <ImageIcon size={12} /> AI IMAGE PROMPT (ENGLISH)
                        </span>
                        <button
                          className="btn-copy-dark"
                          onClick={() =>
                            copyPrompt(`img-${scene.sceneNumber}`, scene.aiImagePromptEn)
                          }
                        >
                          {copiedKey === `img-${scene.sceneNumber}` ? (
                            <Check size={12} />
                          ) : (
                            <Copy size={12} />
                          )}
                          <span>
                            {copiedKey === `img-${scene.sceneNumber}` ? 'Copied' : 'Copy'}
                          </span>
                        </button>
                      </div>
                      <p>{scene.aiImagePromptEn}</p>
                    </div>

                    <div className="prompt-dark-box video-box">
                      <div className="prompt-dark-head">
                        <span>
                          <Video size={12} /> AI VIDEO PROMPT (និយាយភាសាខ្មែរ)
                        </span>
                        <button
                          className="btn-copy-dark"
                          onClick={() =>
                            copyPrompt(
                              `vid-${scene.sceneNumber}`,
                              buildKhmerSpeakingVideoPrompt(scene, project)
                            )
                          }
                        >
                          {copiedKey === `vid-${scene.sceneNumber}` ? (
                            <Check size={12} />
                          ) : (
                            <Copy size={12} />
                          )}
                          <span>
                            {copiedKey === `vid-${scene.sceneNumber}` ? 'Copied' : 'Copy'}
                          </span>
                        </button>
                      </div>
                      <p style={{ whiteSpace: 'pre-wrap' }}>
                        {buildKhmerSpeakingVideoPrompt(scene, project)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
};
