import React, { useMemo, useState } from 'react';
import {
  Copy,
  Check,
  Download,
  Image as ImageIcon,
  Video,
  Sparkles,
  Users,
  Layers,
  RefreshCw,
  ClipboardPaste,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import type { AiProviderConfig, StoryboardProject } from '../types/storyboard';
import {
  buildKhmerSpeakingVideoPrompt,
  buildSyncPromptsForWeb,
  downloadTextFile,
  generatePromptsBatch,
  getCharacterImagePrompt,
} from '../utils/exporters';

interface PromptsTabProps {
  project: StoryboardProject;
  aiConfig: AiProviderConfig;
  isAiReady: boolean;
  isSyncing: boolean;
  syncError: string | null;
  onSyncWithAI: () => void;
  onApplySyncedText: (rawText: string) => void;
  onOpenSettings: () => void;
}

type PromptSubTab = 'characters' | 'paired' | 'image' | 'video' | 'thumbnail';

export const PromptsTab: React.FC<PromptsTabProps> = ({
  project,
  aiConfig,
  isAiReady,
  isSyncing,
  syncError,
  onSyncWithAI,
  onApplySyncedText,
  onOpenSettings,
}) => {
  const [subTab, setSubTab] = useState<PromptSubTab>('paired');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showWebSync, setShowWebSync] = useState(false);
  const [pastedSync, setPastedSync] = useState('');

  const webSyncPrompt = useMemo(() => buildSyncPromptsForWeb(project), [project]);

  const copyText = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1600);
  };

  const handleCopyAllVisible = async () => {
    if (subTab === 'characters') {
      const all = project.characters
        .map(
          (c) =>
            `[Character: ${c.name} — ${c.role}]\n${getCharacterImagePrompt(
              c,
              project.animationStyleLabel
            )}`
        )
        .join('\n\n');
      await copyText('all-char', all);
    } else if (subTab === 'paired') {
      const all = project.scenes
        .map((s) => {
          const num = String(s.sceneNumber).padStart(2, '0');
          return `[Scene ${num} - ${s.sceneTitle} | ${s.durationSeconds}s]\nKHMER SCRIPT: ${s.narratorScriptKh}\n\nIMAGE PROMPT:\n${s.aiImagePromptEn}\n\nVIDEO PROMPT (KHMER VOICEOVER):\n${buildKhmerSpeakingVideoPrompt(s, project)}`;
        })
        .join('\n\n----------------------------------------\n\n');
      await copyText('all-paired', all);
    } else if (subTab === 'image') {
      const all = project.scenes
        .map(
          (s) =>
            `[Scene ${String(s.sceneNumber).padStart(2, '0')} - ${s.sceneTitle}]\n${s.aiImagePromptEn}`
        )
        .join('\n\n');
      await copyText('all-img', all);
    } else if (subTab === 'video') {
      const all = project.scenes
        .map(
          (s) =>
            `[Scene ${String(s.sceneNumber).padStart(2, '0')} - ${s.sceneTitle} | ${s.durationSeconds}s]\n${buildKhmerSpeakingVideoPrompt(s, project)}`
        )
        .join('\n\n');
      await copyText('all-vid', all);
    } else {
      await copyText('thumb', project.thumbnail.aiThumbnailPromptEn);
    }
  };

  return (
    <div className="tab-stack">
      {/* Script-to-Prompt Sync Banner */}
      <section className="studio-card web-bridge-card">
        <div className="card-header-row wrap" style={{ marginBottom: showWebSync || syncError ? 14 : 0 }}>
          <div>
            <span className="step-pill">Script ↔ Prompt Alignment</span>
            <h3>ធ្វើសមកាលកម្ម Prompt តួអង្គ + រូបភាព + វីដេអូ ឱ្យត្រូវតាម Script</h3>
            <p className="muted-text">
              ពេលអ្នកកែសម្រួល Script ខ្មែរ ឬព័ត៌មានតួអង្គ សូមចុច Sync ដើម្បីឱ្យ AI សរសេរឡើងវិញនូវ Prompt តួអង្គ, Prompt រូបភាព Scenes និង Prompt វីដេអូទាំងអស់ ឱ្យស៊ីសង្វាក់ 100% ជាមួយ Script!
            </p>
          </div>

          <div className="button-row">
            <button
              className="btn-primary btn-sm"
              disabled={isSyncing}
              onClick={() => {
                if (!isAiReady) {
                  onOpenSettings();
                  return;
                }
                onSyncWithAI();
              }}
            >
              {isSyncing ? <Loader2 size={14} className="spin" /> : <RefreshCw size={14} />}
              <span>
                {isSyncing
                  ? 'កំពុង Sync Prompts តាម Script...'
                  : `Sync ដោយ AI (${aiConfig.provider.toUpperCase()})`}
              </span>
            </button>

            <button
              className={`btn-outline btn-sm ${showWebSync ? 'active-toggle' : ''}`}
              onClick={() => setShowWebSync((v) => !v)}
            >
              <ClipboardPaste size={14} />
              <span>Sync តាម ChatGPT / Gemini Web (ឥតគិតថ្លៃ)</span>
            </button>
          </div>
        </div>

        {syncError && (
          <div className="alert-error" style={{ marginBottom: showWebSync ? 12 : 0 }}>
            <AlertCircle size={16} />
            <span>{syncError}</span>
          </div>
        )}

        {showWebSync && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="button-row">
              <button
                className="btn-secondary btn-sm"
                onClick={() => copyText('web-sync-prompt', webSyncPrompt)}
              >
                {copiedId === 'web-sync-prompt' ? <Check size={14} /> : <Copy size={14} />}
                <span>
                  {copiedId === 'web-sync-prompt'
                    ? 'បានចម្លង Sync Prompt!'
                    : 'ជំហានទី ១៖ ចម្លង Sync Prompt (ភ្ជាប់ Script បច្ចុប្បន្នទាំងអស់)'}
                </span>
              </button>
            </div>
            <textarea
              rows={5}
              className="input-field textarea-field mono"
              value={pastedSync}
              onChange={(e) => setPastedSync(e.target.value)}
              placeholder='ជំហានទី ២៖ បិទភ្ជាប់ចម្លើយ JSON ពី ChatGPT / Gemini Web នៅទីនេះ រួចចុច «អនុវត្ត Prompts ថ្មី»...'
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                className="btn-primary btn-sm"
                disabled={isSyncing || !pastedSync.trim()}
                onClick={() => {
                  onApplySyncedText(pastedSync);
                  setPastedSync('');
                  setShowWebSync(false);
                }}
              >
                <Check size={14} />
                <span>អនុវត្ត Prompts ថ្មីចូលគ្រប់ឈុត</span>
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="studio-card">
        <div className="card-header-row wrap">
          <div className="subtab-pills">
            <button
              className={`subtab-pill ${subTab === 'characters' ? 'active' : ''}`}
              onClick={() => setSubTab('characters')}
            >
              <Users size={15} />
              <span>Prompt រូបភាពតួអង្គ ({project.characters.length})</span>
            </button>
            <button
              className={`subtab-pill ${subTab === 'paired' ? 'active' : ''}`}
              onClick={() => setSubTab('paired')}
            >
              <Layers size={15} />
              <span>រូបភាព + វីដេអូតាមឈុត ({project.scenes.length})</span>
            </button>
            <button
              className={`subtab-pill ${subTab === 'image' ? 'active' : ''}`}
              onClick={() => setSubTab('image')}
            >
              <ImageIcon size={15} />
              <span>Prompt រូបភាព Scenes ({project.scenes.length})</span>
            </button>
            <button
              className={`subtab-pill ${subTab === 'video' ? 'active' : ''}`}
              onClick={() => setSubTab('video')}
            >
              <Video size={15} />
              <span>Prompt វីដេអូនិយាយខ្មែរ ({project.scenes.length})</span>
            </button>
            <button
              className={`subtab-pill ${subTab === 'thumbnail' ? 'active' : ''}`}
              onClick={() => setSubTab('thumbnail')}
            >
              <Sparkles size={15} />
              <span>Thumbnail</span>
            </button>
          </div>

          <div className="button-row">
            <button className="btn-secondary btn-sm" onClick={handleCopyAllVisible}>
              {copiedId?.startsWith('all-') || copiedId === 'thumb' ? (
                <Check size={14} />
              ) : (
                <Copy size={14} />
              )}
              <span>ចម្លងទាំងអស់</span>
            </button>
            <button
              className="btn-primary btn-sm"
              onClick={() =>
                downloadTextFile(
                  `${project.id}-ai-prompts.txt`,
                  generatePromptsBatch(project)
                )
              }
            >
              <Download size={14} />
              <span>ទាញយក Prompts ទាំងអស់ (.TXT)</span>
            </button>
          </div>
        </div>

        {/* 1. Character Reference Image Prompts */}
        {subTab === 'characters' && (
          <div className="prompt-batch-list">
            <p className="muted-text" style={{ marginBottom: 4 }}>
              បង្កើតរូបភាពគំរូតួអង្គ (Character Reference Sheet) ទាំងនេះមុនគេ ក្នុង Whisk / ImageFX / Midjourney / Nano Banana ដើម្បីឱ្យមុខមាត់ និងសម្លៀកបំពាក់តួអង្គដូចគ្នា 100% គ្រប់ឈុត!
            </p>
            {project.characters.length === 0 ? (
              <div className="empty-sidebar">មិនទាន់មានតួអង្គក្នុងគម្រោងនេះទេ។</div>
            ) : (
              project.characters.map((char, idx) => {
                const promptText = getCharacterImagePrompt(
                  char,
                  project.animationStyleLabel
                );
                const keyId = `char-${idx}`;
                return (
                  <div key={idx} className="character-prompt-panel">
                    <div className="character-prompt-meta">
                      <div className="character-avatar">{char.name.slice(0, 1)}</div>
                      <div>
                        <strong>{char.name}</strong>
                        <span className="muted-inline" style={{ display: 'block' }}>
                          {char.role} • {char.outfit}
                        </span>
                      </div>
                    </div>

                    <div className="prompt-dark-box">
                      <div className="prompt-dark-head">
                        <span>
                          <Users size={12} /> AI CHARACTER REFERENCE IMAGE PROMPT (ENGLISH)
                        </span>
                        <button
                          className="btn-copy-dark"
                          onClick={() => copyText(keyId, promptText)}
                        >
                          {copiedId === keyId ? <Check size={13} /> : <Copy size={13} />}
                          <span>{copiedId === keyId ? 'Copied!' : 'Copy'}</span>
                        </button>
                      </div>
                      <p>{promptText}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* 2. Paired Scene Image + Video Prompts */}
        {subTab === 'paired' && (
          <div className="prompt-batch-list">
            <p className="muted-text" style={{ marginBottom: 4 }}>
              បង្ហាញ Script ខ្មែរ + Prompt រូបភាព + Prompt វីដេអូ ទន្ទឹមគ្នាតាមឈុតនីមួយៗ (Scene 01 → Scene {project.scenes.length}) ដើម្បីងាយផ្ទៀងផ្ទាត់ និងផលិតតាមលំដាប់។
            </p>
            {project.scenes.map((scene) => {
              const num = String(scene.sceneNumber).padStart(2, '0');
              return (
                <div key={scene.sceneNumber} className="paired-scene-card">
                  <div className="paired-scene-head">
                    <div className="prompt-batch-title">
                      <span className="scene-num-pill">Scene {num}</span>
                      <strong>{scene.sceneTitle}</strong>
                      <span className="muted-inline">
                        ({scene.durationSeconds}s • តួអង្គ៖ {scene.character || '—'} • Camera: {scene.cameraMovement})
                      </span>
                    </div>
                  </div>
                  <p className="paired-narrator-preview">«{scene.narratorScriptKh}»</p>
                  <div className="scene-prompts-grid">
                    <div className="prompt-dark-box">
                      <div className="prompt-dark-head">
                        <span>
                          <ImageIcon size={12} /> SCENE {num} — AI IMAGE PROMPT (ENGLISH)
                        </span>
                        <button
                          className="btn-copy-dark"
                          onClick={() =>
                            copyText(`p-img-${scene.sceneNumber}`, scene.aiImagePromptEn)
                          }
                        >
                          {copiedId === `p-img-${scene.sceneNumber}` ? (
                            <Check size={12} />
                          ) : (
                            <Copy size={12} />
                          )}
                          <span>
                            {copiedId === `p-img-${scene.sceneNumber}` ? 'Copied!' : 'Copy'}
                          </span>
                        </button>
                      </div>
                      <p>{scene.aiImagePromptEn}</p>
                    </div>

                    <div className="prompt-dark-box video-box">
                      <div className="prompt-dark-head">
                        <span>
                          <Video size={12} /> SCENE {num} — AI VIDEO PROMPT (និយាយភាសាខ្មែរ)
                        </span>
                        <button
                          className="btn-copy-dark"
                          onClick={() =>
                            copyText(
                              `p-vid-${scene.sceneNumber}`,
                              buildKhmerSpeakingVideoPrompt(scene, project)
                            )
                          }
                        >
                          {copiedId === `p-vid-${scene.sceneNumber}` ? (
                            <Check size={12} />
                          ) : (
                            <Copy size={12} />
                          )}
                          <span>
                            {copiedId === `p-vid-${scene.sceneNumber}` ? 'Copied!' : 'Copy'}
                          </span>
                        </button>
                      </div>
                      <p style={{ whiteSpace: 'pre-wrap' }}>
                        {buildKhmerSpeakingVideoPrompt(scene, project)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 3. Thumbnail Prompt */}
        {subTab === 'thumbnail' && (
          <div className="thumbnail-kit-box">
            <div className="thumb-meta-grid">
              <div className="thumb-meta-card">
                <span>ចំណងជើងធំលើ Thumbnail (Khmer Headline)</span>
                <strong>{project.thumbnail.headlineKh}</strong>
              </div>
              <div className="thumb-meta-card">
                <span>អក្សររង (Sub-text)</span>
                <strong>{project.thumbnail.subTextKh}</strong>
              </div>
            </div>
            <div className="form-group">
              <label>គំនិតរចនារូបភាព (Visual Concept)</label>
              <p className="concept-text">{project.thumbnail.visualConcept}</p>
            </div>
            <div className="prompt-dark-box">
              <div className="prompt-dark-head">
                <span>YOUTUBE THUMBNAIL AI PROMPT (ENGLISH)</span>
                <button
                  className="btn-copy-dark"
                  onClick={() =>
                    copyText('thumb-single', project.thumbnail.aiThumbnailPromptEn)
                  }
                >
                  {copiedId === 'thumb-single' ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copiedId === 'thumb-single' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p>{project.thumbnail.aiThumbnailPromptEn}</p>
            </div>
          </div>
        )}

        {/* 4 & 5. Image-Only or Video-Only Batch Lists */}
        {(subTab === 'image' || subTab === 'video') && (
          <div className="prompt-batch-list">
            {project.scenes.map((scene) => {
              const promptText =
                subTab === 'image'
                  ? scene.aiImagePromptEn
                  : buildKhmerSpeakingVideoPrompt(scene, project);
              const keyId = `${subTab}-${scene.sceneNumber}`;
              return (
                <div
                  key={scene.sceneNumber}
                  className={`prompt-batch-item ${subTab === 'video' ? 'video-batch-item' : ''}`}
                >
                  <div className="prompt-batch-head">
                    <div className="prompt-batch-title">
                      <span className="scene-num-pill">
                        Scene {String(scene.sceneNumber).padStart(2, '0')}
                      </span>
                      <strong>{scene.sceneTitle}</strong>
                      <span className="muted-inline" style={{ color: '#a8a29e' }}>
                        ({scene.durationSeconds}s • {scene.cameraMovement}
                        {subTab === 'video' ? ' • និយាយភាសាខ្មែរ' : ''})
                      </span>
                    </div>
                    <button
                      className="btn-copy-dark"
                      onClick={() => copyText(keyId, promptText)}
                    >
                      {copiedId === keyId ? <Check size={13} /> : <Copy size={13} />}
                      <span>{copiedId === keyId ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="prompt-mono-body" style={{ whiteSpace: 'pre-wrap' }}>
                    {promptText}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
