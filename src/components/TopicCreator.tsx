import React, { useMemo, useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Wand2,
  Clock,
  Palette,
  Mic,
  FileText,
  Loader2,
  AlertCircle,
  ClipboardPaste,
  FilePlus2,
  Settings2,
  Search,
  Shuffle,
  Users,
  UserCheck,
  Clapperboard,
  User,
  Activity,
  Wrench,
  MessageSquare,
  Compass,
} from 'lucide-react';
import {
  AI_PROVIDER_PRESETS,
  ANIMATION_STYLES,
  DURATION_PRESETS,
  PRESENTER_SETUP_OPTIONS,
  SCENE_ACTION_DYNAMICS,
  TOPIC_CATEGORIES,
  buildJsonImportPrompt,
  buildMasterPrompt,
} from '../data/topics';
import type {
  AiProviderConfig,
  AnimationStyleId,
  DurationPresetId,
  GenerationRequest,
  PresenterSetupId,
  SceneActionDynamicId,
} from '../types/storyboard';

interface TopicCreatorProps {
  isGenerating: boolean;
  isImporting: boolean;
  errorMessage: string | null;
  aiConfig: AiProviderConfig;
  isAiReady: boolean;
  onGenerate: (req: GenerationRequest) => void;
  onImportPasted: (rawText: string, req: GenerationRequest) => void;
  onCreateOfflineDraft: (req: GenerationRequest) => void;
  onOpenSettings: () => void;
  onUpdateAiConfig?: (config: AiProviderConfig) => void;
}

export const TopicCreator: React.FC<TopicCreatorProps> = ({
  isGenerating,
  isImporting,
  errorMessage,
  aiConfig,
  isAiReady,
  onGenerate,
  onImportPasted,
  onCreateOfflineDraft,
  onOpenSettings,
  onUpdateAiConfig,
}) => {
  const [categoryId, setCategoryId] = useState<string>('business-money');
  const [topic, setTopic] = useState<string>('៧ វិធីគ្រប់គ្រងលុយឱ្យមានប្រសិទ្ធភាព');
  const [durationPreset, setDurationPreset] = useState<DurationPresetId>('5-10');
  const [targetScenes, setTargetScenes] = useState<number>(30);
  const [animationStyle, setAnimationStyle] = useState<AnimationStyleId>('2d-cartoon');
  const [narratorVoice, setNarratorVoice] = useState<string>('Khmer Male Voice');
  const [presenterSetup, setPresenterSetup] = useState<PresenterSetupId>('group');
  const [actionDynamic, setActionDynamic] = useState<SceneActionDynamicId>('cinematic-action');
  const [customNotes, setCustomNotes] = useState<string>('');

  const [showPromptPreview, setShowPromptPreview] = useState<boolean>(false);
  const [showWebBridge, setShowWebBridge] = useState<boolean>(true);
  const [pastedJson, setPastedJson] = useState<string>('');
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [copiedJsonPrompt, setCopiedJsonPrompt] = useState<boolean>(false);
  const [topicSearch, setTopicSearch] = useState<string>('');

  const totalTopicCount = useMemo(
    () => TOPIC_CATEGORIES.reduce((sum, c) => sum + c.sampleTopics.length, 0),
    []
  );

  const filteredCategories = useMemo(() => {
    const q = topicSearch.trim().toLowerCase();
    if (!q) return TOPIC_CATEGORIES;
    return TOPIC_CATEGORIES.filter(
      (c) =>
        c.nameKh.toLowerCase().includes(q) ||
        c.nameEn.toLowerCase().includes(q) ||
        c.descriptionKh.toLowerCase().includes(q) ||
        c.sampleTopics.some((t) => t.toLowerCase().includes(q))
    );
  }, [topicSearch]);

  const matchingTopicsAcrossAll = useMemo(() => {
    const q = topicSearch.trim().toLowerCase();
    if (!q) return [];
    const matches: Array<{ categoryId: string; categoryName: string; topic: string }> = [];
    for (const c of TOPIC_CATEGORIES) {
      for (const t of c.sampleTopics) {
        if (t.toLowerCase().includes(q)) {
          matches.push({ categoryId: c.id, categoryName: c.nameKh, topic: t });
        }
      }
    }
    return matches.slice(0, 18);
  }, [topicSearch]);

  const handlePickRandomTopic = () => {
    const withTopics = TOPIC_CATEGORIES.filter((c) => c.sampleTopics.length > 0);
    const randomCat = withTopics[Math.floor(Math.random() * withTopics.length)];
    const randomTopic =
      randomCat.sampleTopics[Math.floor(Math.random() * randomCat.sampleTopics.length)];
    setCategoryId(randomCat.id);
    setTopic(randomTopic);
  };

  const selectedCategory =
    TOPIC_CATEGORIES.find((c) => c.id === categoryId) || TOPIC_CATEGORIES[0];

  const selectedPresenter =
    PRESENTER_SETUP_OPTIONS.find((p) => p.id === presenterSetup) || PRESENTER_SETUP_OPTIONS[0];

  const selectedAction =
    SCENE_ACTION_DYNAMICS.find((a) => a.id === actionDynamic) || SCENE_ACTION_DYNAMICS[0];

  const activePreset =
    AI_PROVIDER_PRESETS.find((p) => p.id === aiConfig.provider) || AI_PROVIDER_PRESETS[0];

  const currentRequest: GenerationRequest = useMemo(
    () => ({
      categoryId,
      categoryLabelKh: `${selectedCategory.code}. ${selectedCategory.nameEn} – ${selectedCategory.nameKh}`,
      topic,
      durationPreset,
      targetScenes,
      animationStyle,
      narratorVoice,
      presenterSetup,
      presenterSetupLabel: selectedPresenter.labelKh,
      actionDynamic,
      actionDynamicLabel: selectedAction.labelKh,
      customNotes,
    }),
    [
      categoryId,
      selectedCategory,
      topic,
      durationPreset,
      targetScenes,
      animationStyle,
      narratorVoice,
      presenterSetup,
      selectedPresenter,
      actionDynamic,
      selectedAction,
      customNotes,
    ]
  );

  const generatedMasterPrompt = useMemo(
    () => buildMasterPrompt(currentRequest),
    [currentRequest]
  );

  const generatedJsonPrompt = useMemo(
    () => buildJsonImportPrompt(currentRequest),
    [currentRequest]
  );

  const handleDurationChange = (id: DurationPresetId) => {
    setDurationPreset(id);
    const preset = DURATION_PRESETS.find((d) => d.id === id);
    if (preset) {
      setTargetScenes(preset.defaultScenes);
    }
  };

  const handleCopyPrompt = async () => {
    await navigator.clipboard.writeText(generatedMasterPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleCopyJsonPrompt = async () => {
    await navigator.clipboard.writeText(generatedJsonPrompt);
    setCopiedJsonPrompt(true);
    setTimeout(() => setCopiedJsonPrompt(false), 2000);
  };

  return (
    <div className="creator-container">
      <header className="creator-hero">
        <div className="hero-badge">
          <Sparkles size={14} />
          <span>Khmer Educational Storytelling Animation System</span>
        </div>
        <h1>ជ្រើសរើសប្រធានបទ ដើម្បីបង្កើត Script & Storyboard វីដេអូថ្មី</h1>
        <p>
          បង្កើតវីដេអូអប់រំ 2D Cartoon ពេញលេញជាភាសាខ្មែរ — ប្រើបានដោយ <strong>ឥតគិតថ្លៃ មិនបាច់ API Key</strong> តាមរយៈ
          <strong> ChatGPT / Gemini Web</strong>, <strong>Ollama (Offline)</strong>, <strong>Offline Draft</strong> ឬភ្ជាប់ API (OpenRouter / Groq / Gemini / OpenAI)។
        </p>
      </header>

      {/* Step 1: Category Grid */}
      <section className="studio-card">
        <div className="card-header-row wrap">
          <div>
            <span className="step-pill">
              ជំហានទី ១ • {TOPIC_CATEGORIES.length} ប្រភេទ • {totalTopicCount}+ ប្រធានបទគំរូ
            </span>
            <h2>ជ្រើសរើសប្រភេទវីដេអូ (Topic Category)</h2>
          </div>

          <div className="toolbar-right">
            <div className="search-box">
              <Search size={15} />
              <input
                type="text"
                placeholder={`ស្វែងរកក្នុង ${totalTopicCount}+ ប្រធានបទ...`}
                value={topicSearch}
                onChange={(e) => setTopicSearch(e.target.value)}
              />
            </div>
            <button
              type="button"
              className="btn-outline btn-sm"
              onClick={handlePickRandomTopic}
              title="ជ្រើសរើសប្រធានបទចៃដន្យ"
            >
              <Shuffle size={14} />
              <span>រើសប្រធានបទចៃដន្យ</span>
            </button>
          </div>
        </div>

        {matchingTopicsAcrossAll.length > 0 && (
          <div className="search-matches-box">
            <span className="sample-label">
              រកឃើញប្រធានបទត្រូវគ្នា ({matchingTopicsAcrossAll.length}) — ចុចដើម្បីជ្រើសរើសភ្លាម៖
            </span>
            <div className="chip-row">
              {matchingTopicsAcrossAll.map((item) => (
                <button
                  key={`${item.categoryId}-${item.topic}`}
                  type="button"
                  className={`topic-chip ${topic === item.topic ? 'active' : ''}`}
                  onClick={() => {
                    setCategoryId(item.categoryId);
                    setTopic(item.topic);
                  }}
                >
                  <strong>[{item.categoryName}]</strong> {item.topic}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="category-grid">
          {filteredCategories.map((cat) => {
            const active = cat.id === categoryId;
            return (
              <button
                key={cat.id}
                type="button"
                className={`category-card ${active ? 'active' : ''}`}
                style={{ '--cat-accent': cat.accent } as React.CSSProperties}
                onClick={() => {
                  setCategoryId(cat.id);
                  if (cat.sampleTopics.length > 0) {
                    setTopic(cat.sampleTopics[0]);
                  } else {
                    setTopic('');
                  }
                }}
              >
                <div className="category-top">
                  <span className="category-code">{cat.code}</span>
                  <span className="category-en">{cat.nameEn}</span>
                  {cat.sampleTopics.length > 0 && (
                    <span className="cat-count-pill">{cat.sampleTopics.length}</span>
                  )}
                </div>
                <div className="category-kh">{cat.nameKh}</div>
                <div className="category-desc">{cat.descriptionKh}</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Step 2: Topic Input + Quick Suggestions */}
      <section className="studio-card">
        <div className="card-header-row">
          <div>
            <span className="step-pill">ជំហានទី ២</span>
            <h2>កំណត់ប្រធានបទវីដេអូ (Video Topic)</h2>
          </div>
        </div>

        <div className="form-group">
          <label>ប្រធានបទដែលចង់ផលិត (ភាសាខ្មែរ ឬអង់គ្លេស)</label>
          <input
            type="text"
            className="input-field input-lg"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="ឧទាហរណ៍៖ ៧ វិធីគ្រប់គ្រងលុយឱ្យមានប្រសិទ្ធភាព..."
          />
        </div>

        {selectedCategory.sampleTopics.length > 0 && (
          <div className="sample-topics-wrap">
            <span className="sample-label">ឧទាហរណ៍ប្រធានបទពេញនិយម៖</span>
            <div className="chip-row">
              {selectedCategory.sampleTopics.map((sample) => (
                <button
                  key={sample}
                  type="button"
                  className={`topic-chip ${topic === sample ? 'active' : ''}`}
                  onClick={() => setTopic(sample)}
                >
                  {sample}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="form-group" style={{ marginTop: 16 }}>
          <label>ចំណុចបន្ថែម / តួអង្គដែលចង់បាន (ជាជម្រើស)</label>
          <input
            type="text"
            className="input-field"
            value={customNotes}
            onChange={(e) => setCustomNotes(e.target.value)}
            placeholder="ឧទាហរណ៍៖ ចង់ឱ្យមានតួអង្គយុវជនខ្មែរឈ្មោះ ដារ៉ា និងគ្រូណែនាំ..."
          />
        </div>
      </section>

      {/* Step 3: Presenter & Character Cast Setup */}
      <section className="studio-card">
        <div className="card-header-row">
          <div>
            <span className="step-pill">ជំហានទី ៣ • ជម្រើសតួអង្គ</span>
            <h2>ទម្រង់តួអង្គធ្វើបទបង្ហាញ (Presenter & Character Cast Setup)</h2>
            <p className="muted-text">
              ជ្រើសរើសទម្រង់តួអង្គធ្វើបទបង្ហាញក្នុងវីដេអូ — ជាក្រុមការងារច្រើននាក់ គូតួអង្គឆ្លើយឆ្លង ឬក្រុមតួអង្គដើរតួក្នុងសាច់រឿងជាក់ស្តែង។
            </p>
          </div>
        </div>

        <div className="options-grid-2x2">
          {PRESENTER_SETUP_OPTIONS.map((opt) => {
            const active = presenterSetup === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                className={`setup-card-choice ${active ? 'active' : ''}`}
                onClick={() => setPresenterSetup(opt.id)}
              >
                <div className="setup-card-top">
                  <div className="setup-card-title">
                    {opt.id === 'group' && <Users size={18} className="text-amber" />}
                    {opt.id === 'duo' && <UserCheck size={18} className="text-amber" />}
                    {opt.id === 'drama-cast' && <Clapperboard size={18} className="text-amber" />}
                    {opt.id === 'solo' && <User size={18} className="text-amber" />}
                    <span>{opt.labelKh.split('(')[0]}</span>
                  </div>
                  <span className="setup-card-badge">{opt.badgeKh}</span>
                </div>
                <p className="setup-card-desc">{opt.descriptionKh}</p>
                <div className="setup-card-hint">
                  <Sparkles size={12} />
                  <span>{opt.castHintKh}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Step 4: Scene Action Dynamics */}
      <section className="studio-card">
        <div className="card-header-row">
          <div>
            <span className="step-pill">ជំហានទី ៤ • ប្លង់សកម្មភាពរស់រវើក</span>
            <h2>ស្ទីលប្លង់សកម្មភាព (Scene Action Dynamics — ហាមឈរនិយាយទទេ)</h2>
            <p className="muted-text">
              កំណត់របៀបដែលតួអង្គធ្វើសកម្មភាពក្នុងឈុតនីមួយៗ — ផ្តោតលើចលនារស់រវើក ការងារជាក់ស្តែង និងការសហការ មិនឈរនិយាយស្ងៀមមុខកាមេរ៉ា។
            </p>
          </div>
        </div>

        <div className="options-grid-2x2">
          {SCENE_ACTION_DYNAMICS.map((dyn) => {
            const active = actionDynamic === dyn.id;
            return (
              <button
                key={dyn.id}
                type="button"
                className={`setup-card-choice ${active ? 'active' : ''}`}
                onClick={() => setActionDynamic(dyn.id)}
              >
                <div className="setup-card-top">
                  <div className="setup-card-title">
                    {dyn.id === 'cinematic-action' && <Activity size={18} className="text-amber" />}
                    {dyn.id === 'hands-on-demo' && <Wrench size={18} className="text-amber" />}
                    {dyn.id === 'dialogue-roleplay' && <MessageSquare size={18} className="text-amber" />}
                    {dyn.id === 'field-documentary' && <Compass size={18} className="text-amber" />}
                    <span>{dyn.labelKh.split('(')[0]}</span>
                  </div>
                  <span className="setup-card-badge">{dyn.badgeKh}</span>
                </div>
                <p className="setup-card-desc">{dyn.descriptionKh}</p>
                <div className="setup-card-hint">
                  <Sparkles size={12} />
                  <span>{dyn.actionHintKh}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Step 5: Duration, Scene Count, Style, Voice */}
      <section className="studio-card">
        <div className="card-header-row">
          <div>
            <span className="step-pill">ជំហានទី ៥</span>
            <h2>កំណត់រយៈពេល ស្ទីល Animation និងសំឡេងអ្នកនិទាន</h2>
          </div>
        </div>

        <div className="settings-two-col">
          <div>
            <label className="icon-label">
              <Clock size={15} />
              <span>រយៈពេលវីដេអូ (Video Duration)</span>
            </label>
            <div className="pill-options">
              {DURATION_PRESETS.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  className={`option-pill ${durationPreset === d.id ? 'active' : ''}`}
                  onClick={() => handleDurationChange(d.id)}
                >
                  <strong>{d.labelKh}</strong>
                  <span>{d.sceneRange}</span>
                </button>
              ))}
            </div>

            <div className="slider-box">
              <div className="slider-header">
                <span>ចំនួនឈុតគោលដៅ (Target Scenes):</span>
                <strong>
                  {targetScenes} ឈុត (~{Math.round((targetScenes * 8) / 60)} នាទី)
                </strong>
              </div>
              <input
                type="range"
                min={10}
                max={60}
                step={2}
                value={targetScenes}
                onChange={(e) => setTargetScenes(Number(e.target.value))}
                className="range-slider"
              />
              <div className="slider-ticks">
                <span>10 ឈុត (រហ័ស)</span>
                <span>24–30 ឈុត</span>
                <span>40–60 ឈុត (ពេញលេញ)</span>
              </div>
            </div>
          </div>

          <div>
            <label className="icon-label">
              <Palette size={15} />
              <span>ស្ទីល Animation</span>
            </label>
            <div className="stack-options">
              {ANIMATION_STYLES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`style-choice ${animationStyle === s.id ? 'active' : ''}`}
                  onClick={() => setAnimationStyle(s.id)}
                >
                  <strong>{s.labelKh}</strong>
                  <span>{s.labelEn}</span>
                </button>
              ))}
            </div>

            <div className="form-group" style={{ marginTop: 14 }}>
              <label className="icon-label">
                <Mic size={15} />
                <span>សំឡេងអ្នកនិទាន (Narrator Voice)</span>
              </label>
              <select
                className="input-field"
                value={narratorVoice}
                onChange={(e) => setNarratorVoice(e.target.value)}
              >
                <option value="Khmer Male Voice">សំឡេងបុរសភាសាខ្មែរ (Khmer Male Voice — ណែនាំ)</option>
                <option value="Khmer Female Voice">សំឡេងស្ត្រីភាសាខ្មែរ (Khmer Female Voice)</option>
                <option value="Khmer Warm Documentary Narrator">
                  អ្នកនិទានបែបឯកសារប្រវត្តិសាស្ត្រ (Documentary Voice)
                </option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {errorMessage && (
        <div className="alert-error">
          <AlertCircle size={18} />
          <div style={{ flex: 1 }}>
            <div>
              <strong>មានបញ្ហាក្នុងការបង្កើត៖</strong> {errorMessage}
            </div>
            {aiConfig.provider !== 'gemini' &&
              (aiConfig.apiKey?.trim().startsWith('AQ.') ||
                aiConfig.apiKey?.trim().startsWith('AIza') ||
                errorMessage.includes('AQ.') ||
                (errorMessage.includes('401') && aiConfig.apiKey?.trim().startsWith('AQ.'))) &&
              onUpdateAiConfig && (
                <div
                  style={{
                    marginTop: 10,
                    padding: '10px 14px',
                    background: '#eff6ff',
                    border: '1px solid #93c5fd',
                    borderRadius: 8,
                    color: '#1e40af',
                  }}
                >
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>
                    💡 សម្គាល់ឃើញ៖ API Key របស់អ្នក (<code>{aiConfig.apiKey?.slice(0, 8)}...</code>) គឺជា Google Gemini API Key ថ្មី មិនមែន OpenAI Key ទេ!
                  </div>
                  <div style={{ fontSize: '0.85rem', marginBottom: 8, color: '#1e3a8a' }}>
                    Google AI Studio បានប្ដូរទម្រង់ Key ទៅជា <code>AQ....</code>។ សូមចុចប៊ូតុងខាងក្រោមដើម្បីប្ដូរទៅប្រើ Google Gemini API ភ្លាមៗ៖
                  </div>
                  <button
                    type="button"
                    className="btn-primary"
                    style={{ fontSize: '0.84rem', padding: '6px 16px' }}
                    onClick={() => {
                      onUpdateAiConfig({
                        provider: 'gemini',
                        apiKey: aiConfig.apiKey,
                        model: 'gemini-3.8-flash',
                        baseUrl: '',
                      });
                    }}
                  >
                    ✨ ប្ដូរទៅប្រើ Google Gemini ជាមួយ Key នេះភ្លាមៗ
                  </button>
                </div>
              )}
            <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn-secondary"
                style={{ fontSize: '0.82rem', padding: '5px 12px', background: '#ffffff', borderColor: '#fca5a5' }}
                onClick={onOpenSettings}
              >
                ⚙️ ប្ដូរ AI Provider / ម៉ូដែល
              </button>
              <button
                type="button"
                className="btn-secondary"
                style={{ fontSize: '0.82rem', padding: '5px 12px', background: '#ffffff', borderColor: '#fca5a5' }}
                onClick={() => setShowWebBridge(true)}
              >
                📋 ប្រើ ChatGPT / Gemini Web (មិនបាច់ Key)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Bar */}
      <div className="creator-action-bar">
        <button
          type="button"
          className="btn-primary btn-xl"
          disabled={isGenerating || !topic.trim()}
          onClick={() => {
            if (!isAiReady) {
              onOpenSettings();
              return;
            }
            onGenerate(currentRequest);
          }}
        >
          {isGenerating ? (
            <>
              <Loader2 size={18} className="spin" />
              <span>កំពុងបង្កើតដោយ {activePreset.name} ({targetScenes} ឈុត)...</span>
            </>
          ) : (
            <>
              <Wand2 size={18} />
              <span>
                {isAiReady
                  ? `បង្កើតដោយ AI (${activePreset.name})`
                  : `ភ្ជាប់ AI (${activePreset.name}) ដើម្បីបង្កើតស្វ័យប្រវត្តិ`}
              </span>
            </>
          )}
        </button>

        <button
          type="button"
          className="btn-outline btn-xl"
          onClick={onOpenSettings}
          title="ប្ដូរប្រភព AI (Ollama / OpenRouter / Groq / Gemini / OpenAI)"
        >
          <Settings2 size={17} />
          <span>ប្ដូរ AI: {aiConfig.provider.toUpperCase()}</span>
        </button>

        <button
          type="button"
          className="btn-secondary btn-xl"
          disabled={!topic.trim()}
          onClick={() => onCreateOfflineDraft(currentRequest)}
        >
          <FilePlus2 size={17} />
          <span>បង្កើតគម្រោងទទេ (Offline Draft)</span>
        </button>

        <button
          type="button"
          className={`btn-outline btn-xl ${showWebBridge ? 'active-toggle' : ''}`}
          onClick={() => setShowWebBridge((v) => !v)}
        >
          <ClipboardPaste size={17} />
          <span>ប្រើ ChatGPT / Gemini Web (ឥតគិតថ្លៃ)</span>
        </button>
      </div>

      {/* Zero-API-Key ChatGPT / Gemini Web Bridge */}
      {showWebBridge && (
        <section className="studio-card web-bridge-card">
          <div className="card-header-row wrap">
            <div>
              <span className="step-pill">ឥតគិតថ្លៃ 100% • មិនបាច់ API Key • មិនបាច់ដំឡើងអ្វី</span>
              <h3>វិធីងាយបំផុត៖ ចម្លង JSON Prompt → ដាក់ក្នុង ChatGPT / Gemini Web → បិទភ្ជាប់លទ្ធផលវិញ</h3>
              <p className="muted-text">
                គ្រាន់តែចុចចម្លង Prompt ខាងក្រោម យកទៅដាក់ក្នុង ChatGPT ឬ Gemini លើវេបសាយធម្មតា រួចចម្លងចម្លើយ JSON មកបិទភ្ជាប់នៅប្រអប់ខាងក្រោម — App នឹងបម្លែងជា Storyboard ពេញលេញ + Narrator TXT + Khmer SRT ដោយស្វ័យប្រវត្តិ!
              </p>
            </div>
            <div className="button-row">
              <button
                type="button"
                className="btn-primary"
                onClick={handleCopyJsonPrompt}
                disabled={!topic.trim()}
              >
                {copiedJsonPrompt ? <Check size={16} /> : <Copy size={16} />}
                <span>{copiedJsonPrompt ? 'បានចម្លង JSON Prompt!' : 'ជំហានទី ១៖ ចម្លង JSON Prompt'}</span>
              </button>
              <button
                type="button"
                className="btn-outline"
                onClick={() => setShowPromptPreview((prev) => !prev)}
              >
                <FileText size={16} />
                <span>{showPromptPreview ? 'លាក់ Master Prompt' : 'មើល Master Prompt ធម្មតា'}</span>
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>ជំហានទី ២៖ បិទភ្ជាប់លទ្ធផល (JSON ឬចម្លើយទាំងមូល) ពី ChatGPT / Gemini Web នៅទីនេះ</label>
            <textarea
              rows={7}
              className="input-field textarea-field mono"
              value={pastedJson}
              onChange={(e) => setPastedJson(e.target.value)}
              placeholder='បិទភ្ជាប់លទ្ធផល JSON ពី ChatGPT ឬ Gemini នៅទីនេះ... (ទោះជាប់ ```json ... ``` ក៏ប្រព័ន្ធកាត់យកស្វ័យប្រវត្តិដែរ)'
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            {pastedJson && (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setPastedJson('')}
              >
                សម្អាតប្រអប់
              </button>
            )}
            <button
              type="button"
              className="btn-primary"
              disabled={isImporting || !pastedJson.trim()}
              onClick={() => onImportPasted(pastedJson, currentRequest)}
            >
              {isImporting ? (
                <>
                  <Loader2 size={16} className="spin" />
                  <span>កំពុងបម្លែង និងរក្សាទុក...</span>
                </>
              ) : (
                <>
                  <ClipboardPaste size={16} />
                  <span>បម្លែង និងបង្កើត Storyboard ភ្លាមៗ</span>
                </>
              )}
            </button>
          </div>
        </section>
      )}

      {/* Live Master Prompt Preview (Text version) */}
      {showPromptPreview && (
        <section className="studio-card prompt-preview-card">
          <div className="card-header-row">
            <div>
              <h3>Master Prompt ធម្មតា (សម្រាប់អាន ឬប្រើក្នុង ChatGPT / Gemini)</h3>
              <p className="muted-text">
                Prompt នេះត្រូវបានបញ្ចូលប្រធានបទ រយៈពេល ចំនួនឈុត និងស្ទីល Animation ដែលអ្នកទើបជ្រើសរើសដោយស្វ័យប្រវត្តិ។
              </p>
            </div>
            <button type="button" className="btn-primary" onClick={handleCopyPrompt}>
              {copiedPrompt ? <Check size={16} /> : <Copy size={16} />}
              <span>{copiedPrompt ? 'បានចម្លង!' : 'ចម្លងទាំងអស់'}</span>
            </button>
          </div>
          <pre className="prompt-code-block">{generatedMasterPrompt}</pre>
        </section>
      )}
    </div>
  );
};
