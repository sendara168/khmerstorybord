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
  Mic,
  Music,
  ExternalLink,
} from 'lucide-react';
import type { AiProviderConfig, StoryboardProject } from '../types/storyboard';
import {
  generateTopicTailoredMusic,
  generateTopicTailoredThumbnail,
} from '../data/topics';
import {
  buildKhmerSpeakingVideoPrompt,
  buildAiVideoActionPrompt,
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

type PromptSubTab = 'characters' | 'paired' | 'voiceover' | 'image' | 'video' | 'thumbnail' | 'music';

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

  const isNoCharacters =
    project.presenterSetup === 'no-characters' ||
    (project.characters.length > 0 &&
      project.characters.some(
        (c) =>
          c.name.includes('គ្មានតួអង្គ') ||
          c.name.includes('Topic Visual') ||
          c.role?.includes('Topic Visual')
      ));

  const thumbData = useMemo(() => {
    if (project.thumbnail?.aiThumbnailPromptEn && project.thumbnail.aiThumbnailPromptEn.length > 20) {
      return project.thumbnail;
    }
    return generateTopicTailoredThumbnail(
      project.topic,
      project.animationStyleLabel || '',
      isNoCharacters,
      project.characters
    );
  }, [project, isNoCharacters]);

  const musicList = useMemo(() => {
    if (
      project.musicSuggestions &&
      project.musicSuggestions.length > 0 &&
      project.musicSuggestions.some((m) => Boolean(m.aiMusicPromptEn))
    ) {
      return project.musicSuggestions;
    }
    return generateTopicTailoredMusic(project.topic, project.categoryId);
  }, [project]);

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
          return `[Scene ${num} - ${s.sceneTitle} | ${s.durationSeconds}s]\nVOICEOVER SCRIPT (KHMER):\n${s.narratorScriptKh}\n\nIMAGE PROMPT (ENGLISH):\n${s.aiImagePromptEn}\n\nVIDEO PROMPT (CHARACTER SPEAKING & ACTING):\n${buildAiVideoActionPrompt(s, project)}`;
        })
        .join('\n\n----------------------------------------\n\n');
      await copyText('all-paired', all);
    } else if (subTab === 'voiceover') {
      const all = project.scenes
        .map((s) => {
          const num = String(s.sceneNumber).padStart(2, '0');
          return `[Scene ${num} - ${s.sceneTitle} | ${s.durationSeconds}s]\n${s.narratorScriptKh}${
            s.characterDialogue?.trim() ? `\n(សន្ទនា: ${s.characterDialogue.trim()})` : ''
          }`;
        })
        .join('\n\n');
      await copyText('all-vo', all);
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
            `[Scene ${String(s.sceneNumber).padStart(2, '0')} - ${s.sceneTitle} | ${s.durationSeconds}s]\n${buildAiVideoActionPrompt(s, project)}`
        )
        .join('\n\n');
      await copyText('all-vid', all);
    } else if (subTab === 'thumbnail') {
      await copyText('thumb', thumbData.aiThumbnailPromptEn);
    } else if (subTab === 'music') {
      const all = musicList
        .map(
          (m) =>
            `[${m.section}] — ${m.mood} (${m.tempo})\nInstruments: ${m.instruments}\nTip: ${m.usageTip}\nAI Music Prompt (Suno/Udio):\n${m.aiMusicPromptEn || ''}`
        )
        .join('\n\n----------------------------------------\n\n');
      await copyText('all-music', all);
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
              {isNoCharacters ? <ImageIcon size={15} /> : <Users size={15} />}
              <span>
                {isNoCharacters
                  ? `Prompt Visual Concepts (${project.characters.length})`
                  : `Prompt រូបភាពតួអង្គ (${project.characters.length})`}
              </span>
            </button>
            <button
              className={`subtab-pill ${subTab === 'paired' ? 'active' : ''}`}
              onClick={() => setSubTab('paired')}
            >
              <Layers size={15} />
              <span>ស្គ្រីប & Prompts គ្រប់ឈុត ({project.scenes.length})</span>
            </button>
            <button
              className={`subtab-pill ${subTab === 'voiceover' ? 'active' : ''}`}
              onClick={() => setSubTab('voiceover')}
            >
              <Mic size={15} />
              <span>ស្គ្រីបតួអង្គនិយាយ ({project.scenes.length})</span>
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
              <span>Prompt វីដេអូតួអង្គសម្ដែង & និយាយ ({project.scenes.length})</span>
            </button>
            <button
              className={`subtab-pill ${subTab === 'thumbnail' ? 'active' : ''}`}
              style={subTab === 'thumbnail' ? {} : { border: '1.5px solid #f59e0b', background: '#fffbeb', color: '#92400e' }}
              onClick={() => setSubTab('thumbnail')}
            >
              <Sparkles size={15} className="text-amber" />
              <span>🖼️ Prompt Thumbnail</span>
            </button>
            <button
              className={`subtab-pill ${subTab === 'music' ? 'active' : ''}`}
              style={subTab === 'music' ? {} : { border: '1.5px solid #22c55e', background: '#f0fdf4', color: '#166534' }}
              onClick={() => setSubTab('music')}
            >
              <Music size={15} className="text-teal" />
              <span>🎵 Prompt ភ្លេង AI Background</span>
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

        {/* 1. Character Reference Image Prompts OR Topic Visual Concepts */}
        {subTab === 'characters' && (
          <div className="prompt-batch-list">
            <p className="muted-text" style={{ marginBottom: 4 }}>
              {isNoCharacters
                ? 'បង្កើតរូបភាពគំរូតាមប្រធានបទ (Topic Visual Moodboard / Key Assets) ទាំងនេះក្នុង Whisk / ImageFX / Midjourney / Nano Banana ដើម្បីប្រើជា Reference សម្រាប់ទេសភាព ឧបករណ៍ និងបរិយាកាស!'
                : 'បង្កើតរូបភាពគំរូតួអង្គ (Character Reference Sheet) ទាំងនេះមុនគេ ក្នុង Whisk / ImageFX / Midjourney / Nano Banana ដើម្បីឱ្យមុខមាត់ និងសម្លៀកបំពាក់តួអង្គដូចគ្នា 100% គ្រប់ឈុត!'}
            </p>
            {project.characters.length === 0 ? (
              <div className="empty-sidebar">មិនទាន់មានទិន្នន័យក្នុងគម្រោងនេះទេ។</div>
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
                      <div className="character-avatar">
                        {isNoCharacters ? <ImageIcon size={16} /> : char.name.slice(0, 1)}
                      </div>
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
                          {isNoCharacters ? <ImageIcon size={12} /> : <Users size={12} />} {isNoCharacters ? 'AI TOPIC VISUAL PROMPT (ENGLISH)' : 'AI CHARACTER REFERENCE IMAGE PROMPT (ENGLISH)'}
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
            {/* Quick Access to Thumbnail and Background Music */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: 12,
                marginBottom: 16,
              }}
            >
              {/* Thumbnail Quick Card */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
                  border: '1.5px solid #f59e0b',
                  borderRadius: 12,
                  padding: '14px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontWeight: 700, color: '#92400e', fontSize: '0.92rem' }}>
                    <Sparkles size={16} className="text-amber" />
                    <span>Prompt សម្រាប់ធ្វើ YouTube Thumbnail</span>
                  </div>
                  <button
                    className="btn-primary btn-xs"
                    onClick={() => setSubTab('thumbnail')}
                  >
                    បើកមើលពេញលេញ
                  </button>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#78350f', lineHeight: 1.45 }}>
                  Headline: <strong>«{thumbData.headlineKh}»</strong>
                </div>
                <div
                  style={{
                    background: '#1c1917',
                    color: '#f5f5f4',
                    padding: '8px 10px',
                    borderRadius: 6,
                    fontSize: '0.78rem',
                    lineHeight: 1.4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                  }}
                >
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {thumbData.aiThumbnailPromptEn}
                  </span>
                  <button
                    className="btn-copy-dark"
                    style={{ padding: '2px 8px', fontSize: '0.72rem', flexShrink: 0 }}
                    onClick={() => copyText('thumb-quick', thumbData.aiThumbnailPromptEn)}
                  >
                    {copiedId === 'thumb-quick' ? <Check size={11} /> : <Copy size={11} />}
                    <span>{copiedId === 'thumb-quick' ? 'Copied' : 'Copy Prompt'}</span>
                  </button>
                </div>
              </div>

              {/* Background Music Quick Card */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                  border: '1.5px solid #22c55e',
                  borderRadius: 12,
                  padding: '14px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontWeight: 700, color: '#166534', fontSize: '0.92rem' }}>
                    <Music size={16} className="text-teal" />
                    <span>Prompt សម្រាប់ធ្វើ ភ្លេង AI (Suno / Udio)</span>
                  </div>
                  <button
                    className="btn-secondary btn-xs"
                    style={{ borderColor: '#22c55e', color: '#166534' }}
                    onClick={() => setSubTab('music')}
                  >
                    បើកមើលពេញលេញ
                  </button>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#14532d', lineHeight: 1.45 }}>
                  ស្ទីលភ្លេង៖ <strong>{musicList[0]?.mood} ({musicList[0]?.tempo})</strong>
                </div>
                <div
                  style={{
                    background: '#1c1917',
                    color: '#f5f5f4',
                    padding: '8px 10px',
                    borderRadius: 6,
                    fontSize: '0.78rem',
                    lineHeight: 1.4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                  }}
                >
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {musicList[0]?.aiMusicPromptEn || 'Suno / Udio Background Music Prompt'}
                  </span>
                  <button
                    className="btn-copy-dark"
                    style={{ padding: '2px 8px', fontSize: '0.72rem', flexShrink: 0 }}
                    onClick={() => copyText('music-quick', musicList[0]?.aiMusicPromptEn || '')}
                  >
                    {copiedId === 'music-quick' ? <Check size={11} /> : <Copy size={11} />}
                    <span>{copiedId === 'music-quick' ? 'Copied' : 'Copy Prompt'}</span>
                  </button>
                </div>
              </div>
            </div>

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
                  {/* Form សម្រាប់ Copy Script សម្រាប់ Voice Over ខាងក្រៅ */}
                  <div className="external-vo-form" style={{ marginBottom: 14 }}>
                    <div className="external-vo-header">
                      <div className="external-vo-title-group">
                        <span className="external-vo-badge-tag">
                          <Mic size={13} /> ស្គ្រីបសម្ដីតួអង្គនិយាយ (CHARACTER SPOKEN SCRIPT)
                        </span>
                        <span className="vo-spec-tag">⏱️ ~{scene.durationSeconds}s</span>
                        <span className="vo-spec-tag">
                          📝 ~{scene.narratorScriptKh ? Math.max(scene.narratorScriptKh.trim().split(/\s+/).filter(Boolean).length, Math.round(scene.narratorScriptKh.trim().length / 4.5)) : 0} ពាក្យ
                        </span>
                      </div>

                      <button
                        className={`btn-copy-vo ${copiedId === `p-vo-${scene.sceneNumber}` ? 'copied' : ''}`}
                        onClick={() => copyText(`p-vo-${scene.sceneNumber}`, scene.narratorScriptKh)}
                        title="ចម្លងអត្ថបទនេះយកទៅដាក់ក្នុង CapCut, ElevenLabs ឬអានថតសំឡេង"
                      >
                        {copiedId === `p-vo-${scene.sceneNumber}` ? (
                          <>
                            <Check size={13} />
                            <span>បានចម្លងស្គ្រីប!</span>
                          </>
                        ) : (
                          <>
                            <Copy size={13} />
                            <span>ចម្លងស្គ្រីបសម្ដីតួអង្គ</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="external-vo-body">
                      <p className="scene-narrator-text">«{scene.narratorScriptKh}»</p>
                      {scene.characterDialogue?.trim() && (
                        <div
                          style={{
                            marginTop: 10,
                            padding: '8px 12px',
                            background: '#f8fafc',
                            borderRadius: 8,
                            border: '1px solid #e2e8f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 10,
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#1e293b', fontSize: '0.86rem' }}>
                            <Mic size={14} className="text-amber" />
                            <span>
                              <strong>សម្ដីតួអង្គនិយាយ (Dialogue)៖</strong> {scene.characterDialogue}
                            </span>
                          </div>
                          <button
                            type="button"
                            className={`btn-ghost btn-xs ${copiedId === `p-dlg-${scene.sceneNumber}` ? 'text-green' : ''}`}
                            onClick={() => copyText(`p-dlg-${scene.sceneNumber}`, scene.characterDialogue || '')}
                            title="ចម្លងសម្ដីតួអង្គនិយាយ"
                          >
                            {copiedId === `p-dlg-${scene.sceneNumber}` ? (
                              <>
                                <Check size={12} />
                                <span>បានចម្លង!</span>
                              </>
                            ) : (
                              <>
                                <Copy size={12} />
                                <span>ចម្លងសម្ដី</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="external-vo-footer">
                      <span className="vo-hint-text">
                        💡 ចម្លង Script នេះយកទៅដាក់ក្នុង CapCut / ElevenLabs / AI Voice ឬអានថតសំឡេងខាងក្រៅ
                      </span>
                    </div>
                  </div>

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
                          <Video size={12} /> SCENE {num} — AI VIDEO PROMPT (តួអង្គសម្ដែង & និយាយតាមសាច់រឿង)
                        </span>
                        <button
                          className="btn-copy-dark"
                          onClick={() =>
                            copyText(
                              `p-vid-${scene.sceneNumber}`,
                              buildAiVideoActionPrompt(scene, project)
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
                        {buildAiVideoActionPrompt(scene, project)}
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
            <div
              className="alert-banner-amber"
              style={{
                marginBottom: 16,
                padding: '12px 16px',
                borderRadius: 10,
                background: '#fef3c7',
                border: '1.5px solid #fcd34d',
                color: '#92400e',
                fontSize: '0.88rem',
                lineHeight: 1.5,
              }}
            >
              <strong>💡 គន្លឹះធ្វើ YouTube Thumbnail ឱ្យមានអ្នកចុចមើលច្រើន (High CTR)៖</strong>
              <div style={{ marginTop: 4, color: '#78350f' }}>
                ១. ចម្លង <strong>YOUTUBE THUMBNAIL AI PROMPT</strong> ខាងក្រោម យកទៅដាក់ក្នុង <strong>Midjourney / Ideogram / Flux / Whisk</strong> ដើម្បីបង្កើតរូបភាព Background ច្បាស់ត្រជាក់ភ្នែក (16:9)។
                <br />
                ២. បន្ទាប់មក យកទៅដាក់អក្សរខ្មែរ Headline <strong>«{thumbData.headlineKh}»</strong> ក្នុង Canva ឬ Photoshop ដោយប្រើពុម្ពអក្សរខ្មែរដិតធំៗ និងពណ៌ផ្ទុយ (លឿង/ស) នៅលើផ្ទៃងងឹត។
              </div>
            </div>

            <div className="thumb-meta-grid">
              <div className="thumb-meta-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>ចំណងជើងធំលើ Thumbnail (Khmer Headline)</span>
                  <button
                    className="btn-icon-subtle"
                    style={{ padding: '2px 8px', fontSize: '0.74rem' }}
                    onClick={() => copyText('thumb-hd', thumbData.headlineKh)}
                  >
                    {copiedId === 'thumb-hd' ? <Check size={12} className="text-teal" /> : <Copy size={12} />}
                    <span>{copiedId === 'thumb-hd' ? 'បានចម្លង' : 'ចម្លងអក្សរ'}</span>
                  </button>
                </div>
                <strong>{thumbData.headlineKh}</strong>
              </div>
              <div className="thumb-meta-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>អក្សររង (Sub-text Hook)</span>
                  <button
                    className="btn-icon-subtle"
                    style={{ padding: '2px 8px', fontSize: '0.74rem' }}
                    onClick={() => copyText('thumb-sub', thumbData.subTextKh)}
                  >
                    {copiedId === 'thumb-sub' ? <Check size={12} className="text-teal" /> : <Copy size={12} />}
                    <span>{copiedId === 'thumb-sub' ? 'បានចម្លង' : 'ចម្លងអក្សរ'}</span>
                  </button>
                </div>
                <strong>{thumbData.subTextKh}</strong>
              </div>
            </div>

            <div className="form-group" style={{ marginTop: 12 }}>
              <label>គំនិតរចនារូបភាព (Visual Composition & Focus Concept)</label>
              <p className="concept-text">{thumbData.visualConcept}</p>
            </div>

            <div className="prompt-dark-box">
              <div className="prompt-dark-head">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Sparkles size={14} className="text-amber" />
                  <span>YOUTUBE THUMBNAIL AI PROMPT (MIDJOURNEY / IDEOGRAM / FLUX / WHISK)</span>
                </div>
                <button
                  className="btn-copy-dark"
                  onClick={() => copyText('thumb-single', thumbData.aiThumbnailPromptEn)}
                >
                  {copiedId === 'thumb-single' ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copiedId === 'thumb-single' ? 'Copied Prompt' : 'Copy Thumbnail Prompt'}</span>
                </button>
              </div>
              <p>{thumbData.aiThumbnailPromptEn}</p>
            </div>
          </div>
        )}

        {/* 4. Background Music Prompts (Suno / Udio) */}
        {subTab === 'music' && (
          <div className="prompt-batch-list">
            <div
              className="alert-banner-amber"
              style={{
                marginBottom: 16,
                padding: '12px 16px',
                borderRadius: 10,
                background: '#f0fdf4',
                border: '1.5px solid #86efac',
                color: '#166534',
                fontSize: '0.88rem',
                lineHeight: 1.5,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <strong>🎵 របៀបបង្កើតភ្លេង Background ជាមួយ AI (Suno AI & Udio)៖</strong>
                  <div style={{ marginTop: 3, color: '#14532d' }}>
                    ចម្លង Prompt ខាងក្រោមទៅដាក់ក្នុង <strong>Suno.com</strong> ឬ <strong>Udio.com</strong> (ជ្រើសរើស Instrumental Mode • គ្មានសំឡេងច្រៀង) ដើម្បីទទួលបានភ្លេងផ្ទៃខាងក្រោយដែលស៊ីចង្វាក់ ១០០% នឹងប្រធានបទ «{project.topic}»!
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <a
                    href="https://suno.com"
                    target="_blank"
                    rel="noreferrer"
                    className="btn-outline btn-sm"
                    style={{ background: '#fff', borderColor: '#86efac', color: '#166534' }}
                  >
                    <span>បើក Suno.com</span>
                    <ExternalLink size={12} />
                  </a>
                  <a
                    href="https://udio.com"
                    target="_blank"
                    rel="noreferrer"
                    className="btn-outline btn-sm"
                    style={{ background: '#fff', borderColor: '#86efac', color: '#166534' }}
                  >
                    <span>បើក Udio.com</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>

            <div className="music-grid" style={{ marginBottom: 16 }}>
              {musicList.map((m, idx) => (
                <div key={idx} className="music-card" style={{ background: '#fff' }}>
                  <div className="music-card-top">
                    <strong>{m.section}</strong>
                    <span className="tempo-pill">{m.tempo}</span>
                  </div>
                  <div className="music-mood">{m.mood}</div>
                  <div className="music-inst">
                    <span>ឧបករណ៍ភ្លេង៖</span> {m.instruments}
                  </div>
                  <p className="music-tip">💡 {m.usageTip}</p>

                  <div className="prompt-dark-box" style={{ marginTop: 12, padding: 12 }}>
                    <div className="prompt-dark-head" style={{ marginBottom: 6 }}>
                      <span style={{ fontSize: '0.74rem' }}>SUNO / UDIO AI PROMPT</span>
                      <button
                        className="btn-copy-dark"
                        style={{ padding: '2px 8px', fontSize: '0.72rem' }}
                        onClick={() => copyText(`music-${idx}`, m.aiMusicPromptEn || '')}
                      >
                        {copiedId === `music-${idx}` ? <Check size={11} /> : <Copy size={11} />}
                        <span>{copiedId === `music-${idx}` ? 'Copied' : 'Copy Prompt'}</span>
                      </button>
                    </div>
                    <p style={{ fontSize: '0.82rem', lineHeight: 1.5 }}>{m.aiMusicPromptEn}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Voiceover-Only Batch List */}
        {subTab === 'voiceover' && (
          <div className="prompt-batch-list">
            <p className="muted-text" style={{ marginBottom: 8 }}>
              បញ្ជីស្គ្រីបសម្ដីតួអង្គនិយាយតាមឈុតនីមួយៗ (Character Spoken Script in Khmer) — ចុច «ចម្លងស្គ្រីបសម្ដីតួអង្គ» លើឈុតណាមួយ ឬចុច «ចម្លងទាំងអស់» ខាងលើ ដើម្បីយកទៅអាន ថតសំឡេង ឬកាត់ក្នុង CapCut / Premiere។
            </p>
            {project.scenes.map((scene) => {
              const num = String(scene.sceneNumber).padStart(2, '0');
              const keyId = `vo-batch-${scene.sceneNumber}`;
              const wordCount = scene.narratorScriptKh
                ? Math.max(
                    scene.narratorScriptKh.trim().split(/\s+/).filter(Boolean).length,
                    Math.round(scene.narratorScriptKh.trim().length / 4.5)
                  )
                : 0;

              return (
                <div key={scene.sceneNumber} className="external-vo-form" style={{ marginBottom: 12 }}>
                  <div className="external-vo-header">
                    <div className="external-vo-title-group">
                      <span className="scene-num-pill">Scene {num}</span>
                      <strong>{scene.sceneTitle}</strong>
                      <span className="vo-spec-tag">⏱️ ~{scene.durationSeconds}s</span>
                      <span className="vo-spec-tag">📝 ~{wordCount} ពាក្យ</span>
                    </div>

                    <button
                      className={`btn-copy-vo ${copiedId === keyId ? 'copied' : ''}`}
                      onClick={() => copyText(keyId, scene.narratorScriptKh)}
                      title="ចម្លងអត្ថបទនេះយកទៅដាក់ក្នុង CapCut ឬ ElevenLabs"
                    >
                      {copiedId === keyId ? (
                        <>
                          <Check size={13} />
                          <span>បានចម្លងស្គ្រីប!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          <span>ចម្លងស្គ្រីបសម្ដីតួអង្គ</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="external-vo-body">
                    <p className="scene-narrator-text">«{scene.narratorScriptKh}»</p>
                    {scene.characterDialogue?.trim() && (
                      <div
                        style={{
                          marginTop: 10,
                          padding: '8px 12px',
                          background: '#f8fafc',
                          borderRadius: 8,
                          border: '1px solid #e2e8f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 10,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#1e293b', fontSize: '0.86rem' }}>
                          <Mic size={14} className="text-amber" />
                          <span>
                            <strong>សម្ដីតួអង្គនិយាយ (Dialogue)៖</strong> {scene.characterDialogue}
                          </span>
                        </div>
                        <button
                          type="button"
                          className={`btn-ghost btn-xs ${copiedId === `vo-dlg-${scene.sceneNumber}` ? 'text-green' : ''}`}
                          onClick={() => copyText(`vo-dlg-${scene.sceneNumber}`, scene.characterDialogue || '')}
                          title="ចម្លងសម្ដីតួអង្គនិយាយ"
                        >
                          {copiedId === `vo-dlg-${scene.sceneNumber}` ? (
                            <>
                              <Check size={12} />
                              <span>បានចម្លង!</span>
                            </>
                          ) : (
                            <>
                              <Copy size={12} />
                              <span>ចម្លងសម្ដី</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 4 & 5. Image-Only or Video-Only Batch Lists */}
        {(subTab === 'image' || subTab === 'video') && (
          <div className="prompt-batch-list">
            {project.scenes.map((scene) => {
              const promptText =
                subTab === 'image'
                  ? scene.aiImagePromptEn
                  : buildAiVideoActionPrompt(scene, project);
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
                        {subTab === 'video' ? ' • តួអង្គសម្ដែង & និយាយ' : ''})
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
