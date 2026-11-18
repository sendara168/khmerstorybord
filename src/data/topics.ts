import type {
  AiProviderId,
  AnimationStyleId,
  DurationPresetId,
  GenerationRequest,
  StoryboardProject,
  StoryboardScene,
  TopicCategory,
} from '../types/storyboard';

export interface ProviderPreset {
  id: AiProviderId;
  name: string;
  badgeKh: string;
  requiresKey: boolean;
  defaultBaseUrl: string;
  defaultModel: string;
  suggestedModels: string[];
  keyPlaceholder: string;
  docsUrl: string;
  descriptionKh: string;
}

export const AI_PROVIDER_PRESETS: ProviderPreset[] = [
  {
    id: 'ollama',
    name: 'Ollama (Offline Local AI)',
    badgeKh: 'ឥតគិតថ្លៃ • មិនបាច់ API Key',
    requiresKey: false,
    defaultBaseUrl: 'http://127.0.0.1:11434',
    defaultModel: 'gemma3',
    suggestedModels: ['gemma3', 'gemma3:12b', 'qwen2.5:7b', 'qwen3:8b', 'llama3.1'],
    keyPlaceholder: 'មិនចាំបាច់បញ្ចូល API Key ទេ',
    docsUrl: 'https://ollama.com/download',
    descriptionKh: 'ដំណើរការ AI ផ្ទាល់លើកុំព្យូទ័រអ្នក ឥតគិតថ្លៃ 100% និងបង្កើតបានមិនកំណត់។',
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    badgeKh: 'មានម៉ូដែលឥតគិតថ្លៃ (Free Tier)',
    requiresKey: true,
    defaultBaseUrl: 'https://openrouter.ai/api/v1',
    defaultModel: 'google/gemma-3-27b-it:free',
    suggestedModels: [
      'google/gemma-3-27b-it:free',
      'meta-llama/llama-3.3-70b-instruct:free',
      'qwen/qwen-2.5-72b-instruct:free',
      'openai/gpt-4o-mini',
    ],
    keyPlaceholder: 'sk-or-v1-...',
    docsUrl: 'https://openrouter.ai/keys',
    descriptionKh: 'គាំទ្រម៉ូដែលឥតគិតថ្លៃ (:free) និងម៉ូដែលល្បីៗជាច្រើនដោយប្រើ Key តែមួយ។',
  },
  {
    id: 'groq',
    name: 'Groq Cloud',
    badgeKh: 'ឥតគិតថ្លៃ • លឿនខ្លាំង',
    requiresKey: true,
    defaultBaseUrl: 'https://api.groq.com/openai/v1',
    defaultModel: 'llama-3.3-70b-versatile',
    suggestedModels: ['llama-3.3-70b-versatile', 'qwen/qwen3-32b', 'llama-3.1-8b-instant'],
    keyPlaceholder: 'gsk_...',
    docsUrl: 'https://console.groq.com/keys',
    descriptionKh: 'បង្កើតលឿនបំផុត និងមានគម្រោងឥតគិតថ្លៃសម្រាប់សាកល្បង និងផលិតប្រចាំថ្ងៃ។',
  },
  {
    id: 'gemini',
    name: 'Google Gemini API',
    badgeKh: 'ភាសាខ្មែររលូនបំផុត',
    requiresKey: true,
    defaultBaseUrl: '',
    defaultModel: 'gemini-3.8-flash',
    suggestedModels: ['gemini-3.8-flash', 'gemini-4-argon'],
    keyPlaceholder: 'AIzaSy...',
    docsUrl: 'https://aistudio.google.com/apikey',
    descriptionKh: 'ម៉ូដែល Google Gemini ផ្លូវការ សរសេរភាសាខ្មែរច្បាស់ ត្រឹមត្រូវតាមវេយ្យាករណ៍។',
  },
  {
    id: 'openai',
    name: 'OpenAI / DeepSeek / LM Studio',
    badgeKh: 'OpenAI-Compatible',
    requiresKey: false,
    defaultBaseUrl: 'https://api.openai.com/v1',
    defaultModel: 'gpt-4o-mini',
    suggestedModels: ['gpt-4o-mini', 'gpt-4.1-mini', 'deepseek-chat'],
    keyPlaceholder: 'sk-... (ទុកទទេសម្រាប់ LM Studio)',
    docsUrl: 'https://platform.openai.com/api-keys',
    descriptionKh: 'ប្រើបានជាមួយ OpenAI, DeepSeek ឬ LM Studio លើកុំព្យូទ័រ (http://127.0.0.1:1234/v1)។',
  },
];

export const TOPIC_CATEGORIES: TopicCategory[] = [
  {
    id: 'business-money',
    code: '01',
    nameEn: 'Business & Money',
    nameKh: 'មុខជំនួញ និងហិរញ្ញវត្ថុ',
    descriptionKh: 'រកស៊ី រកលុយ សន្សំលុយ វិនិយោគ គ្រប់គ្រងចំណូល និងចំណាយ',
    accent: '#d97706',
    sampleTopics: [
      '៧ មេរៀនរកស៊ីពីមនុស្សជោគជ័យ',
      '៧ វិធីគ្រប់គ្រងលុយឱ្យមានប្រសិទ្ធភាព',
      'ហេតុអ្វីអ្នកមានប្រើលុយធ្វើការឱ្យខ្លួន មិនមែនធ្វើការដើម្បីលុយ?',
      'ក្បួនបែងចែកកែវលុយទាំង ៦ សម្រាប់គ្រួសារសម័យថ្មី',
    ],
  },
  {
    id: 'life-lessons',
    code: '02',
    nameEn: 'Life Lessons',
    nameKh: 'មេរៀនជីវិត',
    descriptionKh: 'បទពិសោធន៍ជីវិត ការអត់ធ្មត់ ភាពជោគជ័យ ការបរាជ័យ និងការតស៊ូ',
    accent: '#0f766e',
    sampleTopics: [
      'មេរៀនជីវិតទាំង ៥ ដែលមនុស្សភាគច្រើនដឹងយឺតពេល',
      'រឿងសត្វទីទុយចាស់ និងចាបតូច៖ អំណាចនៃការអត់ធ្មត់',
      'របៀបងើបឡើងវិញបន្ទាប់ពីបរាជ័យធ្ងន់ធ្ងរ',
    ],
  },
  {
    id: 'history',
    code: '03',
    nameEn: 'History',
    nameKh: 'ប្រវត្តិសាស្ត្រ',
    descriptionKh: 'ប្រវត្តិបុគ្គលល្បីៗ ប្រវត្តិសាស្ត្រខ្មែរ អរិយធម៌ និងព្រឹត្តិការណ៍សំខាន់ៗ',
    accent: '#b45309',
    sampleTopics: [
      'ប្រព័ន្ធធារាសាស្ត្រអស្ចារ្យនៃអាណាចក្រអង្គរ',
      'របៀបដែលផ្លូវសូត្របុរាណផ្លាស់ប្តូរពិភពលោក',
      'ប្រវត្តិនៃការបង្កើតលុយក្រដាសដំបូងលើពិភពលោក',
    ],
  },
  {
    id: 'science',
    code: '04',
    nameEn: 'Science & Knowledge',
    nameKh: 'វិទ្យាសាស្ត្រ និងចំណេះដឹង',
    descriptionKh: 'ចំណេះដឹងទូទៅ បច្ចេកវិទ្យា រាងកាយមនុស្ស លំហ និងធម្មជាតិ',
    accent: '#0284c7',
    sampleTopics: [
      'អ្វីកើតឡើងក្នុងខួរក្បាលពេលយើងគេងលក់?',
      'ហេតុអ្វីមេឃមានពណ៌ខៀវ ហើយថ្ងៃលិចមានពណ៌ក្រហម?',
      'ដំណើរនៃដំណក់ទឹកមួយដំណក់ជុំវិញភពផែនដី',
    ],
  },
  {
    id: 'psychology',
    code: '05',
    nameEn: 'Psychology',
    nameKh: 'ចិត្តវិទ្យា',
    descriptionKh: 'ការគិត អារម្មណ៍ ទម្លាប់ មនុស្សវិទ្យា និងការយល់ពីខ្លួនឯង',
    accent: '#7c3aed',
    sampleTopics: [
      'ចិត្តវិទ្យានៃការបង្កើតទម្លាប់ល្អក្នុងរយៈពេល ២១ ថ្ងៃ',
      'ហេតុអ្វីមនុស្សយើងចូលចិត្តពន្យារពេល ហើយវិធីកែខៃ',
      'របៀបគ្រប់គ្រងអារម្មណ៍ខឹង និងស្ត្រេសដោយវិទ្យាសាស្ត្រ',
    ],
  },
  {
    id: 'education',
    code: '06',
    nameEn: 'Education',
    nameKh: 'ការអប់រំ',
    descriptionKh: 'ចំណេះដឹងសម្រាប់សិស្ស ការរៀនភាសា ជំនាញ និងការអភិវឌ្ឍខ្លួន',
    accent: '#2563eb',
    sampleTopics: [
      'វិធីសាស្ត្ររៀនឱ្យចាំបានយូរដោយបច្ចេកទេស Feynman',
      '៥ ជំនាញសំខាន់បំផុតសម្រាប់យុវជនក្នុងសតវត្សទី ២១',
      'របៀបអានសៀវភៅឱ្យទទួលបានប្រយោជន៍ពិតប្រាកដ',
    ],
  },
  {
    id: 'motivation',
    code: '07',
    nameEn: 'Motivation',
    nameKh: 'ការលើកទឹកចិត្ត',
    descriptionKh: 'រឿងអ្នកជោគជ័យ មេរៀនពីអ្នកមាន និងការផ្លាស់ប្តូរជីវិត',
    accent: '#e11d48',
    sampleTopics: [
      'ដំណើរពីជីវិតលំបាក ទៅកាន់ជីវិតមានឯករាជ្យភាពហិរញ្ញវត្ថុ',
      'អំណាចនៃការខិតខំ ១% ជារៀងរាល់ថ្ងៃ',
      'ហេតុអ្វីវិន័យសំខាន់ជាងការលើកទឹកចិត្តបណ្ដោះអាសន្ន?',
    ],
  },
  {
    id: 'mystery',
    code: '08',
    nameEn: 'Mystery & Knowledge',
    nameKh: 'អាថ៌កំបាំង និងចំណេះដឹង',
    descriptionKh: 'អាថ៌កំបាំងប្រវត្តិសាស្ត្រ ការរកឃើញ និងរឿងគួរឱ្យចាប់អារម្មណ៍',
    accent: '#4f46e5',
    sampleTopics: [
      'អាថ៌កំបាំងនៃមហាសមុទ្រជ្រៅដែលមនុស្សមិនទាន់រកឃើញ',
      'ការរកឃើញបុរាណវិទ្យាដ៏អស្ចារ្យទាំង ៥ លើពិភពលោក',
      'អាថ៌កំបាំងពីក្រោយបណ្ណាល័យបុរាណ Alexandria',
    ],
  },
  {
    id: 'technology',
    code: '09',
    nameEn: 'Technology',
    nameKh: 'បច្ចេកវិទ្យា',
    descriptionKh: 'AI បញ្ញាសិប្បនិម្មិត ប្រវត្តិកុំព្យូទ័រ និងអនាគតឌីជីថល',
    accent: '#0891b2',
    sampleTopics: [
      'បញ្ញាសិប្បនិម្មិត (AI) ដំណើរការយ៉ាងដូចម្តេច? ពន្យល់ងាយយល់',
      'របៀបប្រើបច្ចេកវិទ្យាជួយការងារ និងការសិក្សាប្រចាំថ្ងៃ',
    ],
  },
  {
    id: 'health-lifestyle',
    code: '10',
    nameEn: 'Health & Lifestyle',
    nameKh: 'សុខភាព និងរបៀបរស់នៅ',
    descriptionKh: 'អាហារូបត្ថម្ភ ការគេង លំហាត់ប្រាណ និងទម្លាប់រស់នៅល្អ',
    accent: '#16a34a',
    sampleTopics: [
      'ទម្លាប់ពេលព្រឹកទាំង ៥ ដែលជួយឱ្យខួរក្បាលស្រឡះ និងមានថាមពល',
      'ហេតុអ្វីការគេងគ្រប់គ្រាន់ជាថ្នាំវិសេសបំផុតសម្រាប់រាងកាយ?',
    ],
  },
  {
    id: 'world-knowledge',
    code: '11',
    nameEn: 'World Knowledge',
    nameKh: 'ចំណេះដឹងពិភពលោក',
    descriptionKh: 'ភូមិសាស្ត្រ វប្បធម៌ សេដ្ឋកិច្ចសកល និងអច្ឆរិយវត្ថុពិភពលោក',
    accent: '#ea580c',
    sampleTopics: [
      'ហេតុអ្វីប្រទេសតូចៗមួយចំនួនអាចអភិវឌ្ឍសេដ្ឋកិច្ចបានយ៉ាងលឿន?',
      'វប្បធម៌នៃការអប់រំដ៏គួរឱ្យចាប់អារម្មណ៍នៅប្រទេសជប៉ុន',
    ],
  },
  {
    id: 'famous-people',
    code: '12',
    nameEn: 'Famous People',
    nameKh: 'ប្រវត្តិបុគ្គលល្បីៗ',
    descriptionKh: 'ជីវប្រវត្តិអ្នកប្រាជ្ញ អ្នកបង្កើត និងអ្នកដឹកនាំឆ្នើមលើពិភពលោក',
    accent: '#9333ea',
    sampleTopics: [
      'មេរៀនពី Thomas Edison៖ ការតស៊ូពីភាពបរាជ័យរាប់ពាន់ដង',
      'Marie Curie៖ ស្ត្រីដំបូងដែលឈ្នះពានរង្វាន់ណូបែលពីរដង',
    ],
  },
  {
    id: 'custom',
    code: '13',
    nameEn: 'Custom Topic',
    nameKh: 'ប្រធានបទផ្ទាល់ខ្លួន',
    descriptionKh: 'បញ្ចូលប្រធានបទណាមួយតាមតម្រូវការពិសេសរបស់អ្នក',
    accent: '#475569',
    sampleTopics: [],
  },
];

export const DURATION_PRESETS: Array<{
  id: DurationPresetId;
  labelKh: string;
  labelEn: string;
  defaultScenes: number;
  sceneRange: string;
}> = [
  {
    id: '3-5',
    labelKh: '3–5 នាទី',
    labelEn: '3–5 Minutes',
    defaultScenes: 24,
    sceneRange: '20–30 ឈុត',
  },
  {
    id: '5-10',
    labelKh: '5–10 នាទី (ណែនាំ)',
    labelEn: '5–10 Minutes',
    defaultScenes: 42,
    sceneRange: '40–60 ឈុត',
  },
  {
    id: '15-20',
    labelKh: '15–20 នាទី',
    labelEn: '15–20 Minutes',
    defaultScenes: 60,
    sceneRange: '60+ ឈុត',
  },
];

export const ANIMATION_STYLES: Array<{
  id: AnimationStyleId;
  labelKh: string;
  labelEn: string;
  promptAnchor: string;
}> = [
  {
    id: '2d-cartoon',
    labelKh: '2D Cartoon បែបខ្មែរ (ដូចគំរូ)',
    labelEn: '2D Cartoon Cambodian Educational Animation',
    promptAnchor:
      'Clean 2D cartoon educational illustration, authentic Cambodian (Khmer) characters and Southeast Asian Cambodian setting (rural sugar palm trees, wooden stilt houses, rice paddies OR Phnom Penh shophouses, riverside, tuk-tuks), authentic Khmer script on natural shop signboards when shops appear, smooth cel-shaded vector style, expressive facial expressions, warm cinematic lighting, consistent character design, 16:9 aspect ratio, no floating subtitles or English watermarks',
  },
  {
    id: '3d-cartoon',
    labelKh: '3D Cartoon បែបខ្មែរ',
    labelEn: '3D Stylized Cambodian Educational Animation',
    promptAnchor:
      'Stylized 3D Pixar-inspired educational cartoon animation, authentic Cambodian (Khmer) characters and Cambodian rural/city scenery (palm trees, stilt houses, Phnom Penh streets and cafés), authentic Khmer script on natural storefront signboards when shops appear, soft global illumination, warm cinematic lighting, 16:9 aspect ratio, no floating subtitles or watermarks',
  },
  {
    id: '2d-documentary',
    labelKh: '2D Documentary Illustration បែបខ្មែរ',
    labelEn: '2D Documentary Cambodian Editorial Illustration',
    promptAnchor:
      'Modern 2D editorial documentary illustration, authentic Cambodian (Khmer) people and real Cambodian countryside/urban architecture (Phnom Penh riverside, Khmer shophouses, sugar palm rice fields), clean Khmer script on natural street/shop signs where relevant, textured gouache and clean ink outlines, warm atmospheric cinematic lighting, consistent character design, 16:9 aspect ratio, no watermarks',
  },
];

export function buildMasterPrompt(req?: Partial<GenerationRequest>): string {
  const durationObj =
    DURATION_PRESETS.find((d) => d.id === req?.durationPreset) || DURATION_PRESETS[1];
  const styleObj =
    ANIMATION_STYLES.find((s) => s.id === req?.animationStyle) || ANIMATION_STYLES[0];
  const topicText = req?.topic?.trim() || '[បញ្ចូលប្រធានបទ]';
  const categoryText = req?.categoryLabelKh || 'Business & Money – មុខជំនួញ និងហិរញ្ញវត្ថុ';
  const targetScenes = req?.targetScenes || durationObj.defaultScenes;
  const narratorVoice = req?.narratorVoice || 'Khmer Male Voice';
  const hasTopic = Boolean(req?.topic?.trim());

  return `MASTER PROMPT – KHMER EDUCATIONAL STORYTELLING ANIMATION

អ្នកគឺជាអ្នកនិពន្ធស្គ្រីបភាពយន្ត អ្នកស្រាវជ្រាវចំណេះដឹង អ្នកដឹកនាំរឿង Animation និងអ្នកនិទានរឿងអាជីព។
ខ្ញុំចង់បង្កើតវីដេអូអប់រំ និងចែករំលែកចំណេះដឹង បែប ${styleObj.labelEn} ដោយយកស្ទីល Educational Storytelling ជាគំរូ។

1. ព័ត៌មានសម្រាប់បង្កើតវីដេអូ
- Category: ${categoryText}
- Topic: ${topicText}
- Video Title: [បង្កើតចំណងជើងគួរឱ្យចាប់អារម្មណ៍ជាភាសាខ្មែរ]
- Language: Khmer
- Video Duration: ${durationObj.labelEn} (${targetScenes} ឈុត / 5–10 វិនាទីក្នុងមួយឈុត)
- Video Format: 16:9 (1920 × 1080)
- Animation Style: ${styleObj.labelEn}
- Narrator: ${narratorVoice}
- Voice Tone: Natural, Clear, Professional, Engaging
- Subtitle: Khmer
- Audience: General Audience
- Storytelling: Educational, Informative and Entertaining${
    req?.customNotes?.trim() ? `\n- Additional Notes: ${req.customNotes.trim()}` : ''
  }

2. របៀបសរសេរ Script
សូមសរសេរ Script ពេញលេញ ដោយមានផ្នែកដូចខាងក្រោម៖
A. INTRODUCTION
- ចាប់ផ្ដើមដោយសំណួរដែលធ្វើឱ្យអ្នកទស្សនាចង់ដឹង។
- បង្ហាញបញ្ហា ឬចំណុចគួរឱ្យចាប់អារម្មណ៍។
- ណែនាំប្រធានបទវីដេអូ។

B. MAIN STORY
- រៀបរាប់ខ្លឹមសារជាផ្នែកៗ។
- ពន្យល់ឱ្យងាយយល់ និងមានឧទាហរណ៍ជាក់ស្តែង។
- បង្កើតតួអង្គ និងស្ថានភាពក្នុងរឿង ដើម្បីជួយឱ្យអ្នកទស្សនាយល់។
- រៀបចំចំណុចសំខាន់ៗជាលំដាប់។

C. IMPORTANT LESSONS
- សង្ខេបមេរៀនសំខាន់ៗ។
- ផ្តល់គំនិត និងដំណោះស្រាយដែលអាចអនុវត្តបាន។
- បង្ហាញអ្វីដែលអ្នកទស្សនាគួររៀនពីប្រធានបទនេះ។

D. CONCLUSION
- បញ្ចប់ដោយសារដ៏មានអត្ថន័យ និងឃ្លាដែលធ្វើឱ្យអ្នកទស្សនាចងចាំ។
- អញ្ជើញឱ្យ Like, Share និង Subscribe។

3. FORMAT សម្រាប់រៀបចំឈុតវីដេអូ
បែងចែកវីដេអូជា ${targetScenes} ឈុត (5–10 វិនាទី/ឈុត)។ ឈុតនីមួយៗត្រូវមាន៖
- Scene Number
- Scene Title
- Duration
- Visual Description
- Character
- Character Action
- Narrator Script (Khmer)
- Character Dialogue (if needed)
- On-screen Text
- AI Image Prompt (English)
- AI Video Animation Prompt (English)
- Camera Movement
- Background Music / Sound Effects

4. ច្បាប់សំខាន់សម្រាប់អ្នកនិទាន (NARRATOR SCRIPT)
- សរសេរជាភាសាខ្មែរឱ្យត្រឹមត្រូវតាមវេយ្យាករណ៍ ប្រើពាក្យសាមញ្ញ ងាយស្ដាប់ និងងាយយល់។
- Script ត្រូវមានអត្ថន័យពេញលេញ មិនមែនសរសេរត្រឹមតែចំណងជើងទេ ហើយត្រូវមានការតភ្ជាប់ពីប្រយោគមួយទៅប្រយោគមួយ។
- កុំប្រើពាក្យដដែលៗច្រើនពេក និងកុំសង្ខេបខ្លឹមសារខ្លីពេក។
- ត្រូវសរសេរអត្ថបទដែលអ្នកនិទានអាចអានថតសំឡេងបានភ្លាមៗ និងត្រូវដាក់ដាច់ដោយឡែកពី AI Image Prompt និង AI Video Prompt។
- កុំឱ្យ Narrator និយាយខុសពីសកម្មភាពដែលកំពុងបង្ហាញក្នុងរូបភាព។

5. ANIMATION STYLE, KHMER CULTURAL SETTING & VISUAL CONSISTENCY
${styleObj.promptAnchor}.
- តួអង្គទាំងអស់ត្រូវជាតួអង្គខ្មែរពិតប្រាកដ (Authentic Cambodian/Khmer facial features, natural Southeast Asian skin tone, realistic everyday Khmer outfits, school uniforms, or subtle krama details when appropriate)។
- ទេសភាព និងទិដ្ឋភាពត្រូវជាបរិយាកាសកម្ពុជាពិតប្រាកដ ទាំងស្រុកស្រែចម្ការ (វាលស្រែ ដើមត្នោត ផ្ទះឈើខ្មែរ ស្រះឈូក ផ្លូវដីក្រហម ដំបូលវត្ត) និងទីក្រុងកម្ពុជា (ផ្ទះល្វែងខ្មែរ មាត់ទន្លេចតុមុខ ហាងកាហ្វេភ្នំពេញ រ៉ឺម៉កកង់បី/PassApp ដើមឈើតាមដងផ្លូវ)។
- បើមានហាង សាលារៀន ផ្សារ ឬអគារពាណិជ្ជកម្ម ត្រូវបញ្ចូលអក្សរខ្មែរលើស្លាកយីហោឱ្យច្បាស់ល្អ (ឧ. «កាហ្វេតារា», «ហាងលក់ទំនិញ», «វិទ្យាល័យ», «ផ្សារ») ប៉ុន្តែកុំដាក់ Watermark ឬអក្សរ Subtitle អណ្ដែតលើរូប។
- Consistent character design across all scenes (no random character changes).

6. RESEARCH & ACCURACY
- ប្រើព័ត៌មានដែលអាចផ្ទៀងផ្ទាត់បាន មិនបង្កើតតួលេខ ឬសម្រង់សម្តីក្លែងក្លាយ។
- ប្រសិនបើជាប្រវត្តិសាស្ត្រ ត្រូវរក្សាឈុត និងព្រឹត្តិការណ៍ឱ្យត្រឹមត្រូវ។
- បើជារឿងប្រឌិត ត្រូវបញ្ជាក់ថាជារឿងប្រឌិត។ បើមានព័ត៌មានមិនច្បាស់ ត្រូវបញ្ជាក់ថាមិនទាន់អាចផ្ទៀងផ្ទាត់បាន។

7. FINAL OUTPUT
សូមបង្កើតលទ្ធផលពេញលេញជា៖
1. Video Title
2. Video Description
3. Character Consistency Sheet & AI Character Reference Image Prompts (English — រូបភាពតួអង្គនីមួយៗ)
4. Main Story Outline
5. Complete Standalone Narrator Script (Khmer)
6. Scene-by-Scene Storyboard (${targetScenes} Scenes)
7. AI Image Prompts for Every Scene (English — តាម Scenes នីមួយៗ)
8. AI Video Animation Prompts for Every Scene (English — តាម Scenes នីមួយៗ)
9. Khmer Subtitle (SRT Format)
10. Background Music Suggestions
11. YouTube Thumbnail Prompt

${
  hasTopic
    ? `សូមចាប់ផ្ដើមសរសេរលទ្ធផលពេញលេញសម្រាប់ប្រធានបទ៖ «${topicText}» ឥឡូវនេះ។`
    : 'ចាប់ផ្ដើមដោយបង្ហាញបញ្ជី Topic ឱ្យខ្ញុំជ្រើសរើសជាមុន។ កុំចាប់ផ្ដើមសរសេរ Script រហូតដល់ខ្ញុំជ្រើសរើសប្រធានបទ។'
}`;
}

export function buildJsonImportPrompt(req: GenerationRequest): string {
  const durationObj =
    DURATION_PRESETS.find((d) => d.id === req.durationPreset) || DURATION_PRESETS[1];
  const styleObj =
    ANIMATION_STYLES.find((s) => s.id === req.animationStyle) || ANIMATION_STYLES[0];
  const topicText = req.topic.trim() || '៧ វិធីគ្រប់គ្រងលុយឱ្យមានប្រសិទ្ធភាព';

  return `You are an expert Khmer Educational Storytelling Animation director, documentary researcher, scriptwriter, and narrator.
Create a complete, production-ready Khmer Educational Animation storyboard for:
- Category: ${req.categoryLabelKh}
- Topic: ${topicText}
- Duration: ${durationObj.labelEn} (${req.targetScenes} sequential scenes, 6–10 seconds per scene)
- Animation Style: ${styleObj.labelEn}
- Visual Anchor (include in every aiImagePromptEn): "${styleObj.promptAnchor}"
- Narrator: ${req.narratorVoice} (Natural, Clear, Professional, Engaging Khmer)
${req.customNotes.trim() ? `- Additional Notes: ${req.customNotes.trim()}` : ''}

RULES:
1. Write natural, grammatically accurate, complete Khmer narrator sentences ready to read aloud immediately (NOT bullet headings).
2. ALL characters MUST be authentically Cambodian (Khmer), and ALL landscapes/settings MUST depict authentic Cambodia (both rural countryside with sugar palm trees, rice fields, wooden stilt houses AND Cambodian cities like Phnom Penh shophouses, riverside, tuk-tuks, local cafés).
3. Whenever shops, cafés, markets, or schools appear, include authentic clean Khmer script on natural storefront signboards (e.g. "កាហ្វេតារា", "វិទ្យាល័យ"), with no floating subtitles or watermarks.
4. Keep consistent character design across ALL scenes by repeating exact clothing/appearance descriptors in every aiImagePromptEn.
5. Structure scenes into 4 sections: INTRODUCTION, MAIN_STORY, IMPORTANT_LESSONS, CONCLUSION (ending with Like, Share, Subscribe CTA).
6. Use verifiable facts (no fake statistics/quotes). State clearly in "isFictionalNote" if characters/story are fictional educational illustrations.
7. IMPORTANT: Return ONLY valid JSON inside a single \`\`\`json code block matching the exact structure below (no extra explanation outside the JSON):

\`\`\`json
{
  "videoTitle": "ចំណងជើងវីដេអូគួរឱ្យចាប់អារម្មណ៍ជាភាសាខ្មែរ",
  "videoDescription": "ការពិពណ៌នាវីដេអូសម្រាប់ YouTube ជាភាសាខ្មែរ",
  "isFictionalNote": "កំណត់សម្គាល់ភាពត្រឹមត្រូវ ឬបញ្ជាក់បើជារឿងប្រឌិតអប់រំ",
  "characters": [
    {
      "name": "ឈ្មោះតួអង្គ",
      "role": "តួនាទី",
      "appearance": "រូបរាង អាយុ សក់",
      "outfit": "សម្លៀកបំពាក់ជាក់លាក់",
      "personality": "បុគ្គលិកលក្ខណៈ",
      "aiCharacterImagePromptEn": "Detailed English character design turnaround reference sheet (front view, 3/4 view, 3 expressions, exact outfit/hair/colors, clean solid cream background) + ${styleObj.promptAnchor}"
    }
  ],
  "outline": [
    {
      "section": "INTRODUCTION",
      "titleKh": "ចំណងជើងផ្នែកផ្ដើម",
      "summary": "សេចក្ដីសង្ខេប",
      "keyPoints": ["ចំណុចទី១", "ចំណុចទី២"]
    },
    {
      "section": "MAIN_STORY",
      "titleKh": "ចំណងជើងសាច់រឿង",
      "summary": "សេចក្ដីសង្ខេប",
      "keyPoints": ["ចំណុចទី១", "ចំណុចទី២"]
    },
    {
      "section": "IMPORTANT_LESSONS",
      "titleKh": "មេរៀនសំខាន់ៗ",
      "summary": "សេចក្ដីសង្ខេប",
      "keyPoints": ["ចំណុចទី១", "ចំណុចទី២"]
    },
    {
      "section": "CONCLUSION",
      "titleKh": "សេចក្ដីបញ្ចប់",
      "summary": "សេចក្ដីសង្ខេប",
      "keyPoints": ["សារចុងក្រោយ", "Like, Share, Subscribe"]
    }
  ],
  "scenes": [
    {
      "sceneNumber": 1,
      "section": "INTRODUCTION",
      "sceneTitle": "ចំណងជើងឈុត",
      "durationSeconds": 8,
      "visualDescription": "ការពិពណ៌នារូបភាពជាភាសាខ្មែរ",
      "character": "ឈ្មោះតួអង្គ",
      "characterAction": "សកម្មភាពតួអង្គ",
      "narratorScriptKh": "អត្ថបទអ្នកនិទានពេញលេញជាភាសាខ្មែរដែលអានថតសំឡេងបានភ្លាមៗ",
      "characterDialogue": "",
      "onScreenText": "អក្សរខ្លីលើអេក្រង់",
      "aiImagePromptEn": "Detailed English 2D illustration prompt with exact character outfit + ${styleObj.promptAnchor}",
      "aiVideoPromptEn": "Visual Motion: smooth 2D character motion and camera movement. Spoken Khmer Narration (${req.narratorVoice}, natural clear Khmer language): \\"<exact Khmer narratorScriptKh for this scene>\\". Background Music & SFX: warm documentary music. No embedded text.",
      "cameraMovement": "Slow push-in",
      "bgmAndSfx": "ភ្លេង Documentary ស្រទន់ + SFX"
    }
  ],
  "musicSuggestions": [
    {
      "section": "A. ផ្នែកផ្ដើម",
      "mood": "Curiosity, Warm Documentary",
      "tempo": "80 BPM",
      "instruments": "Soft Piano, Acoustic Guitar",
      "usageTip": "រក្សាសំឡេងនៅ -20dB ដើម្បីឱ្យសំឡេងអ្នកនិទានច្បាស់"
    }
  ],
  "thumbnail": {
    "headlineKh": "ចំណងជើងធំលើ Thumbnail",
    "subTextKh": "អក្សររងខ្លី",
    "visualConcept": "គំនិតរចនារូបភាព",
    "aiThumbnailPromptEn": "Eye-catching 16:9 YouTube thumbnail prompt in English, no text inside image"
  }
}
\`\`\`

Generate ALL ${req.targetScenes} scenes completely in the "scenes" array now.`;
}

export function buildOfflineDraftProject(req: GenerationRequest): StoryboardProject {
  const durationObj =
    DURATION_PRESETS.find((d) => d.id === req.durationPreset) || DURATION_PRESETS[1];
  const styleObj =
    ANIMATION_STYLES.find((s) => s.id === req.animationStyle) || ANIMATION_STYLES[0];
  const topicText = req.topic.trim() || 'ប្រធានបទវីដេអូថ្មី';
  const count = Math.min(20, Math.max(8, Math.round(req.targetScenes / 2)));
  const now = new Date().toISOString();

  const scenes: StoryboardScene[] = Array.from({ length: count }, (_, idx) => {
    const num = idx + 1;
    let section: StoryboardScene['section'] = 'MAIN_STORY';
    let sceneTitle = `សាច់រឿងផ្នែកទី ${num - 2}`;
    let narrator = `សរសេរអត្ថបទអ្នកនិទានពេញលេញសម្រាប់ឈុតទី ${num} ទាក់ទងនឹង «${topicText}» នៅទីនេះ។`;

    if (num <= 2) {
      section = 'INTRODUCTION';
      sceneTitle = num === 1 ? 'សំណួរចាប់ផ្ដើម (Opening Hook)' : 'ណែនាំប្រធានបទ និងបញ្ហា';
      narrator =
        num === 1
          ? `តើអ្នកធ្លាប់ឆ្ងល់ទេអំពី «${topicText}»? នៅក្នុងវីដេអូនេះ យើងនឹងស្វែងយល់ជាមួយគ្នាដោយងាយយល់។`
          : `មនុស្សជាច្រើនតែងជួបបញ្ហាទាក់ទងនឹងប្រធានបទនេះ ប៉ុន្តែបើយើងយល់ពីគោលការណ៍សំខាន់ៗ អ្វីៗនឹងផ្លាស់ប្តូរ។`;
    } else if (num === count - 2) {
      section = 'IMPORTANT_LESSONS';
      sceneTitle = 'សង្ខេបមេរៀនសំខាន់ៗ';
      narrator = `សង្ខេបមកវិញ មេរៀនសំខាន់បំផុតពី «${topicText}» គឺការយកទៅអនុវត្តជាក់ស្ដែងក្នុងជីវិតប្រចាំថ្ងៃ។`;
    } else if (num >= count - 1) {
      section = 'CONCLUSION';
      sceneTitle = num === count ? 'អញ្ជើញ Like, Share និង Subscribe' : 'សារដ៏មានអត្ថន័យចុងបញ្ចប់';
      narrator =
        num === count
          ? 'សូមអរគុណសម្រាប់ការទស្សនា! កុំភ្លេចចុច Like, Share និង Subscribe ដើម្បីទទួលបានវីដេអូចំណេះដឹងថ្មីៗបន្តទៀត។'
          : 'សូមចងចាំថា ការផ្លាស់ប្តូរដ៏ធំ ចាប់ផ្ដើមពីជំហានតូចៗដែលអ្នកធ្វើនៅថ្ងៃនេះ។';
    }

    return {
      sceneNumber: num,
      section,
      sceneTitle,
      durationSeconds: 8,
      visualDescription: `ឈុតគំនូរជីវចលអប់រំ 2D បង្ហាញខ្លឹមសារសម្រាប់៖ ${sceneTitle} (${topicText})`,
      character: 'តួអង្គឯក',
      characterAction: 'បង្ហាញទឹកមុខរស់រវើក និងកាយវិការពន្យល់ស្របតាមសំឡេងអ្នកនិទាន',
      narratorScriptKh: narrator,
      characterDialogue: '',
      onScreenText: sceneTitle,
      aiImagePromptEn: `Educational storytelling scene illustrating "${sceneTitle}" for topic "${topicText}", friendly Cambodian main character in sky-blue polo shirt and dark navy pants. ${styleObj.promptAnchor}.`,
      aiVideoPromptEn: `Smooth ${styleObj.labelEn} motion showing expressive facial animation, clear gestures, and warm atmospheric lighting.`,
      cameraMovement: num === 1 ? 'Slow push-in' : 'Gentle steady framing',
      bgmAndSfx: 'ភ្លេង Documentary ស្រទន់កក់ក្ដៅ',
    };
  });

  return {
    id: `draft-${Date.now()}`,
    createdAt: now,
    updatedAt: now,
    categoryId: req.categoryId,
    categoryLabelKh: req.categoryLabelKh,
    topic: topicText,
    videoTitle: topicText,
    videoDescription: `វីដេអូគំនូរជីវចលអប់រំ 2D ជាភាសាខ្មែរ អំពី «${topicText}»។\n\nសូមចុច Like, Share និង Subscribe ដើម្បីតាមដានមេរៀនល្អៗថ្មីៗ!`,
    language: 'Khmer',
    durationPreset: req.durationPreset,
    durationLabel: durationObj.labelKh,
    videoFormat: '16:9',
    resolution: '1920 × 1080',
    animationStyle: req.animationStyle,
    animationStyleLabel: styleObj.labelEn,
    narratorVoice: req.narratorVoice,
    voiceTone: 'Natural, Clear, Professional, Engaging',
    subtitleLanguage: 'Khmer',
    audience: 'General Audience',
    isFictionalNote:
      'គម្រោងព្រាង (Offline Draft) — សូមកែសម្រួល និងបញ្ជាក់ប្រភពព័ត៌មានបន្ថែមមុនពេលថតសំឡេង។',
    characters: [
      {
        name: 'តួអង្គឯក (Main Character)',
        role: 'តួអង្គនាំរឿង',
        appearance: 'យុវជនខ្មែរអាយុ ២៥ ឆ្នាំ សក់ខ្លីរៀបរយ ទឹកមុខរស់រវើក',
        outfit: 'អាវពណ៌ខៀវផ្ទៃមេឃ ខោពណ៌ទឹកប៊ិចចាស់',
        personality: 'ចូលចិត្តរៀនសូត្រ រួសរាយ និងងាយយល់',
        aiCharacterImagePromptEn: `Character design turnaround reference sheet of a friendly 25-year-old Cambodian young man with neat short black hair, expressive eyes, wearing a sky-blue polo shirt and dark navy pants. Full-body front view, 3/4 view, and 3 facial expressions (smiling, curious, inspired) on a clean solid soft cream background. ${styleObj.promptAnchor}.`,
      },
    ],
    outline: [
      {
        section: 'INTRODUCTION',
        titleKh: 'ផ្នែកផ្ដើម & សំណួរចាប់អារម្មណ៍',
        summary: `ណែនាំប្រធានបទ «${topicText}» និងបញ្ហាដែលអ្នកទស្សនាជួបប្រទះ។`,
        keyPoints: ['សំណួរចាប់អារម្មណ៍', 'ណែនាំប្រធានបទ'],
      },
      {
        section: 'MAIN_STORY',
        titleKh: 'ខ្លឹមសារសំខាន់ និងឧទាហរណ៍',
        summary: 'ពន្យល់ខ្លឹមសារជាលំដាប់ជាមួយតួអង្គ និងឧទាហរណ៍ជាក់ស្ដែង។',
        keyPoints: ['ចំណុចសំខាន់ទី១', 'ចំណុចសំខាន់ទី២', 'ឧទាហរណ៍ជាក់ស្ដែង'],
      },
      {
        section: 'IMPORTANT_LESSONS',
        titleKh: 'មេរៀនសំខាន់ៗដែលអាចអនុវត្តបាន',
        summary: 'សង្ខេបដំណោះស្រាយ និងគំនិតដែលអ្នកទស្សនាអាចធ្វើតាមបានភ្លាមៗ។',
        keyPoints: ['មេរៀនអនុវត្តជាក់ស្ដែង'],
      },
      {
        section: 'CONCLUSION',
        titleKh: 'សារចុងក្រោយ & Call to Action',
        summary: 'ឃ្លាចងចាំ និងអញ្ជើញ Like, Share, Subscribe។',
        keyPoints: ['សារលើកទឹកចិត្ត', 'Like, Share, Subscribe'],
      },
    ],
    scenes,
    musicSuggestions: [
      {
        section: 'វីដេអូទាំងមូល',
        mood: 'Warm Documentary, Educational, Uplifting',
        tempo: '85–95 BPM',
        instruments: 'Soft Piano, Acoustic Guitar, Subtle Strings',
        usageTip: 'រក្សាសំឡេងភ្លេងនៅ -20dB ដើម្បីឱ្យសំឡេងអ្នកនិទានច្បាស់ល្អ។',
      },
    ],
    thumbnail: {
      headlineKh: topicText,
      subTextKh: 'មេរៀនអប់រំ 2D Animation',
      visualConcept: `បង្ហាញតួអង្គឯកមានទឹកមុខចាប់អារម្មណ៍ជាមួយរូបភាពនិមិត្តសញ្ញានៃ «${topicText}» ក្រោមពន្លឺពណ៌មាសកក់ក្ដៅ។`,
      aiThumbnailPromptEn: `Eye-catching YouTube thumbnail for "${topicText}", expressive Cambodian cartoon character in sky-blue polo shirt pointing at glowing educational visual metaphors, warm amber and teal contrast, ${styleObj.promptAnchor}.`,
    },
  };
}
