import React, { useEffect, useMemo, useState } from 'react';
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
  Zap,
  Edit3,
  BookOpen,
  Trash2,
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

export const TOPIC_STARTER_TEMPLATES = [
  { label: '៧ វិធី...', text: '៧ វិធី' },
  { label: '៥ កំហុស...', text: '៥ កំហុសធ្ងន់ធ្ងរដែល' },
  { label: 'ហេតុអ្វី...', text: 'ហេតុអ្វីបានជា' },
  { label: 'របៀប...', text: 'របៀប' },
  { label: 'មេរៀនពី...', text: 'មេរៀនជីវិត និងបទពិសោធន៍ពី' },
  { label: 'ប្រវត្តិនៃ...', text: 'ប្រវត្តិនៃ' },
  { label: 'គន្លឹះ...', text: '៥ គន្លឹះសំខាន់ៗសម្រាប់' },
  { label: 'រឿងនិទាន...', text: 'រឿងនិទានអប់រំអំពី' },
];

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
  const [step2CategoryTab, setStep2CategoryTab] = useState<string>('business-money');
  const [step2Search, setStep2Search] = useState<string>('');
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  useEffect(() => {
    if (categoryId) {
      setStep2CategoryTab(categoryId);
    }
  }, [categoryId]);

  useEffect(() => {
    let timer: any = null;
    if (isGenerating) {
      setElapsedSeconds(0);
      timer = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setElapsedSeconds(0);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isGenerating]);

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

  const visibleStep2Topics = useMemo(() => {
    const q = step2Search.trim().toLowerCase();
    const list: Array<{ categoryId: string; categoryName: string; topic: string }> = [];

    const targetCategories =
      step2CategoryTab === 'all'
        ? TOPIC_CATEGORIES
        : TOPIC_CATEGORIES.filter((c) => c.id === step2CategoryTab);

    for (const cat of targetCategories) {
      for (const t of cat.sampleTopics) {
        if (!q || t.toLowerCase().includes(q) || cat.nameKh.toLowerCase().includes(q)) {
          list.push({ categoryId: cat.id, categoryName: cat.nameKh, topic: t });
        }
      }
    }

    if (step2CategoryTab === 'all' && !q) {
      return list.slice(0, 48);
    }

    return list;
  }, [step2CategoryTab, step2Search]);

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

  const progressInfo = useMemo(() => {
    if (elapsedSeconds < 2) {
      return {
        percent: 25,
        title: '⚡ ដំណាក់កាលទី ១/៤៖ កំពុងរៀបចំ Outline & តួអង្គជាក្រុម...',
        sub: `ដំណើរការលើ ${activePreset.name} (ម៉ូដែល ${activePreset.defaultModel || 'AI'})...`,
      };
    }
    if (elapsedSeconds < 5) {
      return {
        percent: 55,
        title: '✍️ ដំណាក់កាលទី ២/៤៖ កំពុងនិពន្ធ Khmer Narrator Script & សន្ទនា...',
        sub: `សរសេរប្រយោគនិទានជាភាសាខ្មែររលូនតាម ${targetScenes} ឈុត...`,
      };
    }
    if (elapsedSeconds < 9) {
      return {
        percent: 80,
        title: '🎬 ដំណាក់កាលទី ៣/៤៖ កំពុងបង្កើត Scene Actions & AI Image Prompts...',
        sub: 'រៀបចំប្លង់សកម្មភាព & Prompt រូបភាពអង់គ្លេសសម្រាប់ Midjourney/Flux...',
      };
    }
    return {
      percent: 94,
      title: '✨ ដំណាក់កាលទី ៤/៤៖ កំពុងផ្ទៀងផ្ទាត់ និងរៀបចំ Storyboard គម្រោង...',
      sub: 'ជិតរួចរាល់ហើយ! កំពុងត្រួតពិនិត្យទម្រង់ JSON & Timeline...',
    };
  }, [elapsedSeconds, activePreset, targetScenes]);

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
                  setStep2CategoryTab(cat.id);
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

      {/* Step 2: Topic Input + Custom Workspace + Quick Suggestions */}
      <section className="studio-card step2-topic-studio">
        <div className="card-header-row wrap">
          <div>
            <span className="step-pill">ជំហានទី ២ • ប្រអប់វាយ & ជ្រើសរើសប្រធានបទ</span>
            <h2>កំណត់ប្រធានបទវីដេអូ (Video Topic Workspace)</h2>
            <p className="muted-text">
              អ្នកអាច<strong>វាយបញ្ចូលប្រធានបទផ្ទាល់ខ្លួន</strong>ណាមួយដែលចង់ផលិត ឬ<strong>ជ្រើសរើសពីប្រធានបទគំរូ ៤៩៥+</strong> ខាងក្រោមដោយគ្រាន់តែចុចមួយដង។
            </p>
          </div>
          <div className="toolbar-right">
            <button
              type="button"
              className="btn-outline btn-sm"
              onClick={handlePickRandomTopic}
              title="ជ្រើសរើសប្រធានបទចៃដន្យពីបណ្ណាល័យ"
            >
              <Shuffle size={14} />
              <span>រើសប្រធានបទចៃដន្យ</span>
            </button>
            {topic && (
              <button
                type="button"
                className="btn-ghost btn-sm text-muted"
                onClick={() => setTopic('')}
                title="សម្អាតប្រធានបទ"
              >
                <Trash2 size={14} />
                <span>សម្អាត</span>
              </button>
            )}
          </div>
        </div>

        {/* Dedicated Custom Topic Input & Typing Workspace */}
        <div className="custom-topic-box">
          <div className="custom-topic-box-header">
            <div className="custom-topic-title">
              <Edit3 size={16} className="text-amber" />
              <strong>ប្រអប់វាយប្រធានបទផ្ទាល់ខ្លួន (Custom Topic Input)</strong>
            </div>
            <div className="custom-topic-header-actions">
              {topic && (
                <button
                  type="button"
                  className="btn-ghost btn-xs text-muted"
                  onClick={() => setTopic('')}
                  title="សម្អាតអត្ថបទប្រធានបទ"
                >
                  <Trash2 size={13} />
                  <span>សម្អាត</span>
                </button>
              )}
              <span className="custom-topic-badge">
                {topic.trim().length > 0 ? `បានបញ្ចូល ${topic.trim().length} អក្សរ` : 'មិនទាន់វាយប្រធានបទ'}
              </span>
            </div>
          </div>

          <div className="custom-topic-textarea-wrap">
            <textarea
              className="custom-topic-textarea"
              rows={2}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="វាយបញ្ចូលប្រធានបទវីដេអូដែលអ្នកចង់បាននៅទីនេះ (ភាសាខ្មែរ ឬអង់គ្លេស)... ឧទាហរណ៍៖ ៧ វិធីគ្រប់គ្រងលុយឱ្យមានប្រសិទ្ធភាព, របៀបចាប់ផ្ដើមអាជីវកម្មតូច, មេរៀនជីវិតពី..."
            />
          </div>

          <div className="starter-templates-row">
            <span className="starter-label">គំរូចាប់ផ្ដើមរហ័ស (ចុចដើម្បីបន្ថែម)៖</span>
            <div className="starter-chips-wrap">
              {TOPIC_STARTER_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.label}
                  type="button"
                  className="starter-chip"
                  onClick={() => {
                    if (!topic.trim()) {
                      setTopic(tmpl.text + ' ');
                    } else if (!topic.startsWith(tmpl.text)) {
                      setTopic(tmpl.text + ' ' + topic.trim());
                    }
                  }}
                  title={`បន្ថែមពាក្យ «${tmpl.text}» នៅដើមប្រធានបទ`}
                >
                  + {tmpl.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step 2 Topic Browser & Category Filter */}
        <div className="step2-browser-card">
          <div className="step2-browser-header wrap">
            <div className="step2-browser-title">
              <BookOpen size={16} className="text-amber" />
              <strong>បណ្ណាល័យប្រធានបទគំរូ ({totalTopicCount} ប្រធានបទ)</strong>
              <span className="badge-pill-light">ចុចលើប្រធានបទដើម្បីជ្រើសរើសភ្លាម</span>
            </div>

            <div className="search-box sm">
              <Search size={14} />
              <input
                type="text"
                placeholder="ស្វែងរកក្នុងបណ្ណាល័យប្រធានបទ..."
                value={step2Search}
                onChange={(e) => setStep2Search(e.target.value)}
              />
              {step2Search && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setStep2Search('')}
                  title="សម្អាតការស្វែងរក"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Category Tabs for direct switching in Step 2 */}
          <div className="category-tabs-scroll">
            <button
              type="button"
              className={`cat-tab-chip ${step2CategoryTab === 'all' ? 'active' : ''}`}
              onClick={() => setStep2CategoryTab('all')}
            >
              🌐 ទាំងអស់ ({totalTopicCount})
            </button>
            {TOPIC_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`cat-tab-chip ${step2CategoryTab === cat.id ? 'active' : ''}`}
                onClick={() => {
                  setStep2CategoryTab(cat.id);
                  setCategoryId(cat.id);
                }}
              >
                <span className="cat-code-dot">{cat.code}</span>
                {cat.nameKh} ({cat.sampleTopics.length})
              </button>
            ))}
          </div>

          {/* Sample Topics Chips */}
          <div className="step2-topics-list">
            <div className="chip-row">
              {visibleStep2Topics.map((item) => {
                const isSelected = topic === item.topic;
                return (
                  <button
                    key={`${item.categoryId}-${item.topic}`}
                    type="button"
                    className={`topic-chip ${isSelected ? 'active' : ''}`}
                    onClick={() => {
                      setTopic(item.topic);
                      setCategoryId(item.categoryId);
                    }}
                    title={`ប្រភេទ៖ ${item.categoryName}`}
                  >
                    {step2CategoryTab === 'all' && (
                      <span className="topic-cat-badge">[{item.categoryName.split(' ')[0]}]</span>
                    )}
                    <span>{item.topic}</span>
                  </button>
                );
              })}
            </div>
            {visibleStep2Topics.length === 0 && (
              <div className="empty-search-hint">
                <AlertCircle size={16} />
                <span>រកមិនឃើញប្រធានបទដែលត្រូវនឹង «{step2Search}» ឡើយ។ អ្នកអាចវាយប្រធានបទនេះដោយផ្ទាល់ក្នុងប្រអប់ខាងលើបាន!</span>
              </div>
            )}
          </div>
        </div>

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

            {/* Detailed Scene Selector Box */}
            <div className="slider-box">
              <div className="slider-header" style={{ alignItems: 'center', marginBottom: 12 }}>
                <div>
                  <span style={{ fontWeight: 600, fontSize: '0.92rem' }}>
                    ចំនួនឈុតដែលត្រូវបង្កើត (Scene Count):
                  </span>
                  <div className="text-muted" style={{ fontSize: '0.78rem', marginTop: 2 }}>
                    ⏱️ រយៈពេលសរុបប៉ាន់ស្មាន៖ ~{Math.floor((targetScenes * 8) / 60)} នាទី{' '}
                    {(targetScenes * 8) % 60 > 0 ? `${(targetScenes * 8) % 60} វិនាទី` : ''}{' '}
                    (ជាមធ្យម 8s/ឈុត)
                  </div>
                </div>

                {/* Direct Number Input + Stepper */}
                <div className="scene-input-stepper">
                  <button
                    type="button"
                    className="btn-step"
                    onClick={() => setTargetScenes((v) => Math.max(4, v - 5))}
                    title="បន្ថយ ៥ ឈុត"
                  >
                    -5
                  </button>
                  <button
                    type="button"
                    className="btn-step"
                    onClick={() => setTargetScenes((v) => Math.max(4, v - 1))}
                    title="បន្ថយ ១ ឈុត"
                  >
                    -1
                  </button>
                  <div className="scene-number-display">
                    <input
                      type="number"
                      min={4}
                      max={120}
                      value={targetScenes}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (!isNaN(val)) {
                          setTargetScenes(Math.max(4, Math.min(120, val)));
                        }
                      }}
                      className="scene-direct-input"
                    />
                    <span className="scene-input-unit">ឈុត</span>
                  </div>
                  <button
                    type="button"
                    className="btn-step"
                    onClick={() => setTargetScenes((v) => Math.min(120, v + 1))}
                    title="ថែម ១ ឈុត"
                  >
                    +1
                  </button>
                  <button
                    type="button"
                    className="btn-step"
                    onClick={() => setTargetScenes((v) => Math.min(120, v + 5))}
                    title="ថែម ៥ ឈុត"
                  >
                    +5
                  </button>
                </div>
              </div>

              {/* Range Slider 4 to 120 */}
              <input
                type="range"
                min={4}
                max={120}
                step={2}
                value={targetScenes}
                onChange={(e) => setTargetScenes(Number(e.target.value))}
                className="range-slider"
              />

              {/* Quick Preset Scene Chips */}
              <div className="quick-scene-chips">
                <span className="quick-chip-label">រើសរហ័ស៖</span>
                {[6, 10, 16, 24, 30, 42, 50, 60, 80, 100].map((num) => (
                  <button
                    key={num}
                    type="button"
                    className={`quick-scene-chip ${targetScenes === num ? 'active' : ''}`}
                    onClick={() => setTargetScenes(num)}
                  >
                    {num} ឈុត
                  </button>
                ))}
              </div>

              <div className="slider-ticks">
                <span>4 ឈុត (ខ្លីបំផុត)</span>
                <span>24–30 ឈុត (មធ្យម)</span>
                <span>42–60 ឈុត (ពេញលេញ)</span>
                <span>80–120 ឈុត (វែងស៊ីជម្រៅ)</span>
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

            {/* Smart Recovery Action 1: Gemini Key entered in OpenAI or another provider */}
            {(aiConfig.provider !== 'gemini' &&
              (aiConfig.apiKey?.trim().startsWith('AQ.') ||
                aiConfig.apiKey?.trim().startsWith('AIza') ||
                errorMessage.includes('AQ.') ||
                errorMessage.includes('Incorrect API key provided: AQ.'))) &&
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

            {/* Smart Recovery Action 2: Gemini 404 / Deprecated model */}
            {(errorMessage.includes('404') ||
              errorMessage.includes('gemini-2.5-flash') ||
              errorMessage.includes('no longer available') ||
              errorMessage.includes('update your code to use')) &&
              onUpdateAiConfig && (
                <div
                  style={{
                    marginTop: 10,
                    padding: '10px 14px',
                    background: '#fef3c7',
                    border: '1px solid #fcd34d',
                    borderRadius: 8,
                    color: '#92400e',
                  }}
                >
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>
                    🔄 ម៉ូដែលចាស់លែងដំណើរការ៖ Google បានប្ដូរទៅប្រើ <code>gemini-3.8-flash</code>!
                  </div>
                  <div style={{ fontSize: '0.85rem', marginBottom: 8 }}>
                    សូមចុចប៊ូតុងខាងក្រោមដើម្បីធ្វើបច្ចុប្បន្នភាពទៅម៉ូដែលចុងក្រោយបង្អស់ដោយស្វ័យប្រវត្តិ៖
                  </div>
                  <button
                    type="button"
                    className="btn-primary"
                    style={{ fontSize: '0.84rem', padding: '6px 16px' }}
                    onClick={() => {
                      onUpdateAiConfig({
                        ...aiConfig,
                        provider: 'gemini',
                        model: 'gemini-3.8-flash',
                      });
                    }}
                  >
                    🚀 ប្ដូរទៅប្រើ Gemini 3.8 Flash ផ្លូវការភ្លាមៗ
                  </button>
                </div>
              )}

            {/* Smart Recovery Action 3: OpenRouter 429 Rate Limit */}
            {(errorMessage.includes('429') || errorMessage.includes('Rate Limit')) && (
              <div
                style={{
                  marginTop: 10,
                  padding: '10px 14px',
                  background: '#fef3c7',
                  border: '1px solid #fcd34d',
                  borderRadius: 8,
                  color: '#92400e',
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: 4 }}>
                  ⚡ OpenRouter ជាប់ Rate Limit (កូតាឥតគិតថ្លៃកំពុងមមាញឹក)
                </div>
                <div style={{ fontSize: '0.85rem', marginBottom: 8 }}>
                  អ្នកអាចប្ដូរទៅប្រើ <strong>Google Gemini API</strong> (ឥតគិតថ្លៃ លឿនបំផុត & មិនជាប់កូតា) ឬបង្កើតជា <strong>Offline Draft</strong> ភ្លាមៗ៖
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn-primary"
                    style={{ fontSize: '0.84rem', padding: '6px 14px' }}
                    onClick={onOpenSettings}
                  >
                    🔑 ដាក់ Gemini API Key (ទទួលឥតគិតថ្លៃ)
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ fontSize: '0.84rem', padding: '6px 14px', background: '#fff' }}
                    onClick={() => onCreateOfflineDraft(currentRequest)}
                  >
                    📄 បង្កើតជា Offline Draft ភ្លាមៗ (មិនបាច់ចាំ AI)
                  </button>
                </div>
              </div>
            )}

            <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
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
              <button
                type="button"
                className="btn-secondary"
                style={{ fontSize: '0.82rem', padding: '5px 12px', background: '#ffffff', borderColor: '#fca5a5' }}
                onClick={() => onCreateOfflineDraft(currentRequest)}
              >
                📄 បង្កើតជា Offline Draft
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Speed Progress HUD */}
      {isGenerating && (
        <div className="generating-progress-card">
          <div className="progress-header-row">
            <div className="progress-title">
              <Zap size={18} className="text-amber" />
              <span>{progressInfo.title}</span>
            </div>
            <div className="progress-timer-pill">
              ⏱️ {elapsedSeconds} វិនាទី
            </div>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progressInfo.percent}%` }} />
          </div>
          <p className="progress-subtext">{progressInfo.sub}</p>
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

      <div style={{ marginTop: 8, fontSize: '0.8rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: 6 }}>
        <span>⚡ <strong>គន្លឹះល្បឿន៖</strong> ប្រើ <strong>Google Gemini API</strong> ឬ <strong>Groq Cloud</strong> ដើម្បីបង្កើតលឿនបំផុត (ត្រឹមតែ ២ ទៅ ៦ វិនាទីប៉ុណ្ណោះ)។</span>
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
