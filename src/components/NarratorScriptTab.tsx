import React, { useMemo, useState } from 'react';
import {
  Copy,
  Check,
  Download,
  Mic,
  AlignLeft,
  BookOpen,
  Link2,
  Sparkles,
  Eye,
  Edit3,
  Save,
  X,
} from 'lucide-react';
import type { StoryboardProject, StorySection } from '../types/storyboard';
import {
  downloadTextFile,
  formatClock,
  generateStandaloneNarratorScript,
  getSectionLabel,
} from '../utils/exporters';
import { sanitizeScriptRepetitions } from '../utils/narrativeEngine';

interface NarratorScriptTabProps {
  project: StoryboardProject;
  onUpdateProject?: (updated: StoryboardProject) => void;
}

export const NarratorScriptTab: React.FC<NarratorScriptTabProps> = ({
  project,
  onUpdateProject,
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedSceneNum, setCopiedSceneNum] = useState<number | null>(null);
  const [teleprompterMode, setTeleprompterMode] = useState(false);
  const [cleanedNotice, setCleanedNotice] = useState(false);
  const [showVisualContext, setShowVisualContext] = useState(true);
  const [editingSceneNum, setEditingSceneNum] = useState<number | null>(null);
  const [editBuffer, setEditBuffer] = useState('');

  const plainScript = useMemo(
    () => generateStandaloneNarratorScript(project),
    [project]
  );

  const totalSeconds = project.scenes.reduce((sum, s) => sum + (s.durationSeconds || 8), 0);

  const handleCopyAll = async () => {
    await navigator.clipboard.writeText(plainScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyPureVoiceOnly = async () => {
    const pureText = project.scenes
      .map((s) => s.narratorScriptKh.trim())
      .filter(Boolean)
      .join('\n\n');
    await navigator.clipboard.writeText(pureText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopySingleScene = async (num: number, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedSceneNum(num);
    setTimeout(() => setCopiedSceneNum(null), 1600);
  };

  const handleCleanRepetitions = () => {
    if (!onUpdateProject) return;
    const cleanedScenes = sanitizeScriptRepetitions(
      project.scenes,
      project.topic,
      project.videoTitle
    );
    onUpdateProject({
      ...project,
      scenes: cleanedScenes,
      updatedAt: new Date().toISOString(),
    });
    setCleanedNotice(true);
    setTimeout(() => setCleanedNotice(false), 3500);
  };

  const handleStartEdit = (num: number, text: string) => {
    setEditingSceneNum(num);
    setEditBuffer(text);
  };

  const handleSaveEdit = (num: number) => {
    if (!onUpdateProject) return;
    const updatedScenes = project.scenes.map((s) =>
      s.sceneNumber === num ? { ...s, narratorScriptKh: editBuffer.trim() } : s
    );
    onUpdateProject({
      ...project,
      scenes: updatedScenes,
      updatedAt: new Date().toISOString(),
    });
    setEditingSceneNum(null);
  };

  const handleCancelEdit = () => {
    setEditingSceneNum(null);
    setEditBuffer('');
  };

  let lastSection: StorySection | null = null;

  return (
    <div className="tab-stack">
      <section className="studio-card">
        <div className="card-header-row wrap">
          <div className="title-with-icon">
            <Mic size={20} className="text-amber" />
            <div>
              <h3>ស្គ្រីបសម្ដីតួអង្គនិយាយតាមសាច់រឿង (Character Spoken Dialogue Script)</h3>
              <p className="muted-text">
                អត្ថបទសម្ដីតួអង្គនិយាយផ្ទាល់ជាភាសាខ្មែរតាមឈុតនីមួយៗ (Character Speaking Script) — ងាយស្រួលអាន ថតសំឡេង ឬកាត់តតាមតួអង្គក្នុង CapCut / Premiere — សរុប{' '}
                <strong>{project.scenes.length} ឈុត</strong> ({formatClock(totalSeconds)})
              </p>
            </div>
          </div>

          <div className="button-row">
            {onUpdateProject && (
              <button
                className="btn-secondary btn-sm"
                onClick={handleCleanRepetitions}
                title="ដកពាក្យចំណងជើង Topic ដែលនិយាយដដែលៗក្នុង Scene 2+ និងតម្រឹមឱ្យត្រូវនឹងរូបភាព"
              >
                <Sparkles size={14} className="text-amber" />
                <span>សំអាតចំណងជើងដដែលៗ</span>
              </button>
            )}
            <button
              className={`btn-outline btn-sm ${showVisualContext ? 'active-toggle' : ''}`}
              onClick={() => setShowVisualContext((v) => !v)}
              title="បង្ហាញ ឬលាក់ការពិពណ៌នារូបភាពដើម្បីផ្ទៀងផ្ទាត់ជាមួយ Script អាន"
            >
              <Eye size={14} />
              <span>{showVisualContext ? 'លាក់រូបភាព Visual' : 'បង្ហាញរូបភាព Visual'}</span>
            </button>
            <button
              className={`btn-outline btn-sm ${teleprompterMode ? 'active-toggle' : ''}`}
              onClick={() => setTeleprompterMode((v) => !v)}
            >
              {teleprompterMode ? <AlignLeft size={14} /> : <BookOpen size={14} />}
              <span>{teleprompterMode ? 'ទម្រង់ធម្មតា' : 'ទម្រង់អានថតសំឡេង (ធំច្បាស់)'}</span>
            </button>
            <button className="btn-secondary btn-sm" onClick={handleCopyPureVoiceOnly}>
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'បានចម្លង!' : 'ចម្លងតែអត្ថបទអាន'}</span>
            </button>
            <button className="btn-outline btn-sm" onClick={handleCopyAll}>
              <Copy size={14} />
              <span>ចម្លងមានលេខឈុត</span>
            </button>
            <button
              className="btn-primary btn-sm"
              onClick={() =>
                downloadTextFile(`${project.id}-narrator.txt`, plainScript)
              }
            >
              <Download size={14} />
              <span>ទាញយក .TXT</span>
            </button>
          </div>
        </div>

        {cleanedNotice && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 8,
              background: '#ecfdf5',
              border: '1.5px solid #a7f3d0',
              color: '#065f46',
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginTop: 10,
              marginBottom: 10,
            }}
          >
            <Check size={16} className="text-teal" />
            <span>
              ✅ បានពិនិត្យ និងសំអាតការនិយាយចំណងជើង Topic ដដែលៗក្នុង Scene 2+ ដោយជោគជ័យ! អត្ថបទត្រូវបានតម្រឹមឱ្យត្រូវនឹងរូបភាព visual គ្រប់ឈុត។
            </span>
          </div>
        )}

        <div className={`narrator-sheet ${teleprompterMode ? 'teleprompter' : ''}`}>
          {project.scenes.map((scene) => {
            const showHeader = scene.section !== lastSection;
            lastSection = scene.section;
            const isEditing = editingSceneNum === scene.sceneNumber;

            return (
              <React.Fragment key={scene.sceneNumber}>
                {showHeader && (
                  <div className={`script-act-divider act-${scene.section.toLowerCase()}`}>
                    {getSectionLabel(scene.section)}
                  </div>
                )}
                <div className="script-paragraph">
                  <div className="script-meta-tag">
                    <span className="scene-num-pill">
                      Scene {String(scene.sceneNumber).padStart(2, '0')}
                    </span>
                    <span className="scene-mini-title">{scene.sceneTitle}</span>
                    <span className="scene-dur-pill">{scene.durationSeconds}s</span>
                    {scene.sceneNumber > 1 && (
                      <span className="narrator-bridge-badge">
                        <Link2 size={11} /> តភ្ជាប់ពី Scene {String(scene.sceneNumber - 1).padStart(2, '0')}
                      </span>
                    )}

                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
                      {onUpdateProject && !isEditing && (
                        <button
                          className="btn-icon-subtle"
                          style={{ padding: '3px 8px', fontSize: '0.74rem', gap: 4 }}
                          onClick={() => handleStartEdit(scene.sceneNumber, scene.narratorScriptKh)}
                          title="កែសម្រួលសម្ដីតួអង្គក្នុងឈុតនេះ"
                        >
                          <Edit3 size={12} />
                          <span>កែសម្រួល</span>
                        </button>
                      )}
                      <button
                        className="btn-icon-subtle"
                        style={{ padding: '3px 9px', fontSize: '0.74rem', gap: 4 }}
                        onClick={() => handleCopySingleScene(scene.sceneNumber, scene.narratorScriptKh)}
                        title="ចម្លងស្គ្រីបសម្ដីតួអង្គឈុតនេះ"
                      >
                        {copiedSceneNum === scene.sceneNumber ? (
                          <>
                            <Check size={12} className="text-teal" />
                            <span className="text-teal">បានចម្លង!</span>
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            <span>ចម្លង Script</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {showVisualContext && (
                    <div className="narrator-visual-row">
                      <span className="narrator-visual-badge">
                        <Eye size={12} /> រូបភាពដែលត្រូវបង្ហាញក្នុងឈុត (Visual Image)៖
                      </span>
                      <span className="narrator-visual-desc">
                        {scene.visualDescription || scene.characterAction || 'រូបភាព Topic B-Roll ស្របតាមសាច់រឿង'}
                      </span>
                    </div>
                  )}

                  {isEditing ? (
                    <div style={{ marginTop: 8 }}>
                      <textarea
                        className="narrator-edit-textarea"
                        value={editBuffer}
                        onChange={(e) => setEditBuffer(e.target.value)}
                        rows={3}
                        placeholder="បញ្ចូល Script សម្រាប់ Voice Over ក្នុងឈុតនេះ..."
                      />
                      <div className="narrator-edit-actions">
                        <button
                          className="btn-primary btn-sm"
                          style={{ padding: '4px 12px', fontSize: '0.8rem' }}
                          onClick={() => handleSaveEdit(scene.sceneNumber)}
                        >
                          <Save size={13} />
                          <span>រក្សាទុក</span>
                        </button>
                        <button
                          className="btn-outline btn-sm"
                          style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                          onClick={handleCancelEdit}
                        >
                          <X size={13} />
                          <span>បោះបង់</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="narrator-spoken-text">«{scene.narratorScriptKh}»</p>
                  )}

                  {scene.characterDialogue?.trim() && (
                    <p className="narrator-dialogue-line">
                      <strong>សន្ទនាតួអង្គ៖</strong> {scene.characterDialogue}
                    </p>
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </section>
    </div>
  );
};
