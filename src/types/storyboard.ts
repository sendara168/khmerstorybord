export type StorySection = 'INTRODUCTION' | 'MAIN_STORY' | 'IMPORTANT_LESSONS' | 'CONCLUSION';

export type AnimationStyleId = '2d-cartoon' | '3d-cartoon' | '2d-documentary';

export type DurationPresetId =
  | '1-2'
  | '3-5'
  | '5-10'
  | '10-15'
  | '15-20'
  | '20-30'
  | 'custom';

export type AiProviderId = 'ollama' | 'gemini' | 'openrouter' | 'groq' | 'openai';

export type PresenterSetupId = 'group' | 'duo' | 'drama-cast' | 'solo';

export interface PresenterSetupOption {
  id: PresenterSetupId;
  labelKh: string;
  labelEn: string;
  badgeKh: string;
  descriptionKh: string;
  castCount: string;
  castHintKh: string;
}

export type SceneActionDynamicId =
  | 'cinematic-action'
  | 'hands-on-demo'
  | 'dialogue-roleplay'
  | 'field-documentary';

export interface SceneActionDynamicOption {
  id: SceneActionDynamicId;
  labelKh: string;
  labelEn: string;
  badgeKh: string;
  descriptionKh: string;
  actionHintKh: string;
}

export interface AiProviderConfig {
  provider: AiProviderId;
  apiKey: string;
  model: string;
  baseUrl: string;
}

export interface CharacterProfile {
  name: string;
  role: string;
  appearance: string;
  outfit: string;
  personality: string;
  aiCharacterImagePromptEn?: string;
}

export interface StoryOutlineSection {
  section: StorySection;
  titleKh: string;
  summary: string;
  keyPoints: string[];
}

export interface StoryboardScene {
  sceneNumber: number;
  section: StorySection;
  sceneTitle: string;
  durationSeconds: number;
  visualDescription: string;
  character: string;
  characterAction: string;
  narratorScriptKh: string;
  characterDialogue?: string;
  onScreenText?: string;
  aiImagePromptEn: string;
  aiVideoPromptEn: string;
  cameraMovement: string;
  bgmAndSfx: string;
}

export interface MusicSuggestion {
  section: string;
  mood: string;
  tempo: string;
  instruments: string;
  usageTip: string;
}

export interface ThumbnailPlan {
  headlineKh: string;
  subTextKh: string;
  visualConcept: string;
  aiThumbnailPromptEn: string;
}

export interface StoryboardProject {
  id: string;
  createdAt: string;
  updatedAt: string;
  categoryId: string;
  categoryLabelKh: string;
  topic: string;
  videoTitle: string;
  videoDescription: string;
  language: string;
  durationPreset: DurationPresetId;
  durationLabel: string;
  videoFormat: string;
  resolution: string;
  animationStyle: AnimationStyleId;
  animationStyleLabel: string;
  narratorVoice: string;
  voiceTone: string;
  presenterSetup?: PresenterSetupId;
  presenterSetupLabel?: string;
  actionDynamic?: SceneActionDynamicId;
  actionDynamicLabel?: string;
  subtitleLanguage: string;
  audience: string;
  isFictionalNote: string;
  characters: CharacterProfile[];
  outline: StoryOutlineSection[];
  scenes: StoryboardScene[];
  musicSuggestions: MusicSuggestion[];
  thumbnail: ThumbnailPlan;
}

export interface ProjectSummary {
  id: string;
  videoTitle: string;
  topic: string;
  categoryId: string;
  categoryLabelKh: string;
  durationLabel: string;
  animationStyleLabel: string;
  sceneCount: number;
  totalSeconds: number;
  updatedAt: string;
}

export interface TopicCategory {
  id: string;
  code: string;
  nameEn: string;
  nameKh: string;
  descriptionKh: string;
  accent: string;
  sampleTopics: string[];
}

export interface GenerationRequest {
  categoryId: string;
  categoryLabelKh: string;
  topic: string;
  durationPreset: DurationPresetId;
  targetScenes: number;
  animationStyle: AnimationStyleId;
  narratorVoice: string;
  presenterSetup?: PresenterSetupId;
  presenterSetupLabel?: string;
  actionDynamic?: SceneActionDynamicId;
  actionDynamicLabel?: string;
  customNotes: string;
}
