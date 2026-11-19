import type {
  AiProviderId,
  AnimationStyleId,
  DurationPresetId,
  GenerationRequest,
  PresenterSetupOption,
  SceneActionDynamicOption,
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
    defaultModel: 'openrouter/free',
    suggestedModels: [
      'openrouter/free',
      'google/gemma-4-31b-it:free',
      'google/gemma-4-26b-a4b-it:free',
      'nvidia/nemotron-3.5-lightning:free',
      'google/gemma-3-27b-it',
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
    badgeKh: 'ភាសាខ្មែររលូនបំផុត • ឥតគិតថ្លៃ',
    requiresKey: true,
    defaultBaseUrl: '',
    defaultModel: 'gemini-2.5-flash',
    suggestedModels: ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.5-pro'],
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
      '៥ កំហុសធ្ងន់ធ្ងរដែលធ្វើឱ្យអ្នកចាប់ផ្ដើមរកស៊ីខាតដើមទុន',
      'វិធីសន្សំលុយសម្រាប់អ្នកមានប្រាក់ខែតិចឱ្យសល់ប្រាក់រាល់ខែ',
      'ភាពខុសគ្នារវាង «ទ្រព្យសកម្ម» និង «បំណុល» ពន្យល់ងាយយល់',
      'របៀបចាប់ផ្ដើមអាជីវកម្មតូចមួយដោយប្រើដើមទុនតិចនៅកម្ពុជា',
      'អំណាចនៃការប្រាក់សមាស (Compound Interest) ដែលអ្នកគួរដឹងពីក្មេង',
      '៧ ទម្លាប់ចាយវាយដែលធ្វើឱ្យមនុស្សមិនអាចសល់ប្រាក់បាន',
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
      'រឿងដើមឫស្សីចិន៖ ហេតុអ្វីការអត់ធ្មត់ ៥ ឆ្នាំមានតម្លៃមហាសាល?',
      'មេរៀនពីកែវទឹកមួយកែវ៖ របៀបដាក់ចុះនូវទុក្ខព្រួយក្នុងចិត្ត',
      'ហេតុអ្វីការជ្រើសរើសមិត្តភក្តិល្អ កំណត់អនាគតជីវិតអ្នក?',
      'រឿងថ្មធំ ក្រួស និងខ្សាច់៖ របៀបរៀបចំអាទិភាពក្នុងជីវិត',
      '៧ រឿងដែលមនុស្សមានសុភមង្គលមិនដែលធ្វើ',
      'តម្លៃនៃពាក្យសម្ដី៖ មេរៀនពីរឿងដំដែកគោលលើរបងឈើ',
    ],
  },
  {
    id: 'history',
    code: '03',
    nameEn: 'History',
    nameKh: 'ប្រវត្តិសាស្ត្រខ្មែរ និងពិភពលោក',
    descriptionKh: 'ប្រវត្តិសាស្ត្រខ្មែរ អាណាចក្រអង្គរ អរិយធម៌បុរាណ និងព្រឹត្តិការណ៍សំខាន់ៗ',
    accent: '#b45309',
    sampleTopics: [
      'ប្រព័ន្ធធារាសាស្ត្រអស្ចារ្យនៃអាណាចក្រអង្គរ',
      'ប្រវត្តិនៃការកសាងប្រាសាទអង្គរវត្ត និងស្ថាបត្យកម្មដ៏អច្ឆរិយៈ',
      'របៀបដែលបុព្វបុរសខ្មែរដឹកជញ្ជូនថ្មភក់រាប់លានតោនមកសាងសង់ប្រាសាទ',
      'អាណាចក្រហ្វូណន៖ ដើមកំណើតពាណិជ្ជកម្មសមុទ្រដ៏រុងរឿងរបស់ខ្មែរ',
      'របៀបដែលផ្លូវសូត្របុរាណផ្លាស់ប្តូរពិភពលោក',
      'ប្រវត្តិនៃការបង្កើតលុយក្រដាសដំបូងលើពិភពលោក',
      'អរិយធម៌អេហ្ស៊ីបបុរាណ និងអាថ៌កំបាំងពីរ៉ាមីត',
      'ប្រវត្តិនៃការបង្កើតអក្សរសាស្ត្រ និងសិលាចារឹកបុរាណ',
    ],
  },
  {
    id: 'science',
    code: '04',
    nameEn: 'Science & Knowledge',
    nameKh: 'វិទ្យាសាស្ត្រ និងចំណេះដឹង',
    descriptionKh: 'ចំណេះដឹងទូទៅ រាងកាយមនុស្ស ធម្មជាតិ រូបវិទ្យា និងគីមីវិទ្យាប្រចាំថ្ងៃ',
    accent: '#0284c7',
    sampleTopics: [
      'ហេតុអ្វីមេឃមានពណ៌ខៀវ ហើយថ្ងៃលិចមានពណ៌ក្រហម?',
      'អ្វីកើតឡើងក្នុងខួរក្បាលពេលយើងគេងលក់?',
      'ដំណើរនៃដំណក់ទឹកមួយដំណក់ជុំវិញភពផែនដី',
      'ហេតុអ្វីទឹកសមុទ្រមានរសជាតិប្រៃ ឯទឹកទន្លេមានរសជាតិសាប?',
      'តើភ្លៀងផ្គររន្ទះកើតឡើងដោយវិធីណា? ពន្យល់ងាយយល់',
      'ហេតុអ្វីយន្តហោះដែកធ្ងន់រាប់រយតោនអាចហោះលើអាកាសបាន?',
      'ប្រព័ន្ធភាពស៊ាំក្នុងរាងកាយមនុស្សការពារយើងពីមេរោគយ៉ាងដូចម្តេច?',
      'ហេតុអ្វីស្លឹកឈើមានពណ៌បៃតង និងបង្កើតអុកស៊ីសែនឱ្យយើងដកដង្ហើម?',
      'អគ្គិសនីដំណើរការយ៉ាងដូចម្តេច ពីរោងចក្រមកដល់ផ្ទះយើង?',
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
      'ចិត្តវិទ្យានៃការបង្កើតទំនុកចិត្តលើខ្លួនឯងពីសូន្យ',
      'ហេតុអ្វីការប្រៀបធៀបខ្លួនឯងជាមួយអ្នកដទៃបំផ្លាញសុភមង្គល?',
      'បាតុភូត Dunning-Kruger៖ ហេតុអ្វីមនុស្សខ្លះគិតថាខ្លួនដឹងគ្រប់យ៉ាង?',
      'របៀបយកឈ្នះការគិតច្រើនហួសហេតុ (Overthinking)',
      'ភាសាកាយវិការទាំង ៧ ដែលជួយឱ្យអ្នកយល់ពីអារម្មណ៍អ្នកដទៃ',
    ],
  },
  {
    id: 'education',
    code: '06',
    nameEn: 'Education',
    nameKh: 'ការអប់រំ និងការសិក្សា',
    descriptionKh: 'វិធីសាស្ត្ររៀនពូកែ ការរៀនភាសា ជំនាញ និងការអភិវឌ្ឍខ្លួន',
    accent: '#2563eb',
    sampleTopics: [
      'វិធីសាស្ត្ររៀនឱ្យចាំបានយូរដោយបច្ចេកទេស Feynman',
      '៥ ជំនាញសំខាន់បំផុតសម្រាប់យុវជនក្នុងសតវត្សទី ២១',
      'របៀបអានសៀវភៅឱ្យទទួលបានប្រយោជន៍ពិតប្រាកដ',
      'វិធីរៀនភាសាអង់គ្លេសដោយខ្លួនឯងឱ្យឆាប់ចេះនិយាយ',
      'បច្ចេកទេស Pomodoro៖ រៀន ២៥ នាទី ផ្ដោតអារម្មណ៍បានខ្ពស់បំផុត',
      'របៀបកត់ត្រាមេរៀនតាមវិធី Cornell Notes របស់សិស្សពូកែ',
      'វិធីត្រៀមប្រឡងបាក់ឌុបដោយមិនស្ត្រេស និងទទួលបាននិទ្ទេសល្អ',
      'ហេតុអ្វីការសួរសំណួរសំខាន់ជាងការទន្ទេញចាំមាត់?',
    ],
  },
  {
    id: 'motivation',
    code: '07',
    nameEn: 'Motivation',
    nameKh: 'ការលើកទឹកចិត្ត',
    descriptionKh: 'រឿងអ្នកជោគជ័យ វិន័យផ្ទាល់ខ្លួន និងការផ្លាស់ប្តូរជីវិត',
    accent: '#e11d48',
    sampleTopics: [
      'ដំណើរពីជីវិតលំបាក ទៅកាន់ជីវិតមានឯករាជ្យភាពហិរញ្ញវត្ថុ',
      'អំណាចនៃការខិតខំ ១% ជារៀងរាល់ថ្ងៃ',
      'ហេតុអ្វីវិន័យសំខាន់ជាងការលើកទឹកចិត្តបណ្ដោះអាសន្ន?',
      'ក្បួន ៥ វិនាទី៖ វិធីបញ្ឈប់ភាពខ្ជិល ហើយចាប់ផ្ដើមធ្វើភ្លាមៗ',
      'ជីវិតយុវជនជនបទម្នាក់ដែលផ្លាស់ប្តូរគ្រួសារតាមរយៈការសិក្សា',
      'កុំបោះបង់ពេលជួបព្យុះ៖ មេរៀនពីសត្វឥន្ទ្រី',
      'របៀបកំណត់គោលដៅជីវិតឱ្យច្បាស់ និងសម្រេចបានពិតប្រាកដ',
      'ហេតុអ្វីការចាប់ផ្ដើមតូច ល្អជាងការរង់ចាំភាពល្អឥតខ្ចោះ?',
    ],
  },
  {
    id: 'mystery',
    code: '08',
    nameEn: 'Mystery & Knowledge',
    nameKh: 'អាថ៌កំបាំង និងចំណេះដឹង',
    descriptionKh: 'អាថ៌កំបាំងប្រវត្តិសាស្ត្រ ការរកឃើញបុរាណវិទ្យា និងរឿងគួរឱ្យចាប់អារម្មណ៍',
    accent: '#4f46e5',
    sampleTopics: [
      'អាថ៌កំបាំងនៃមហាសមុទ្រជ្រៅដែលមនុស្សមិនទាន់រកឃើញ',
      'ការរកឃើញបុរាណវិទ្យាដ៏អស្ចារ្យទាំង ៥ លើពិភពលោក',
      'អាថ៌កំបាំងពីក្រោយបណ្ណាល័យបុរាណ Alexandria',
      'ទីក្រុងបុរាណ មហិន្ទ្របព៌ត លើភ្នំគូលែនដែលរកឃើញដោយបច្ចេកវិទ្យា LiDAR',
      'អាថ៌កំបាំងត្រីកោណ Bermuda៖ វិទ្យាសាស្ត្រពន្យល់យ៉ាងដូចម្តេច?',
      'រុក្ខជាតិ និងសត្វចម្លែកបំផុតទាំង ៧ នៅលើភពផែនដី',
      'អាថ៌កំបាំងនៃក្តីសុបិន៖ ហេតុអ្វីយើងសុបិនឃើញរឿងចម្លែកៗ?',
    ],
  },
  {
    id: 'technology',
    code: '09',
    nameEn: 'Technology & AI',
    nameKh: 'បច្ចេកវិទ្យា និង AI',
    descriptionKh: 'AI បញ្ញាសិប្បនិម្មិត អ៊ីនធឺណិត ទូរស័ព្ទ និងអនាគតឌីជីថល',
    accent: '#0891b2',
    sampleTopics: [
      'បញ្ញាសិប្បនិម្មិត (AI) ដំណើរការយ៉ាងដូចម្តេច? ពន្យល់ងាយយល់',
      'របៀបប្រើ AI ជួយការងារ និងការសិក្សាប្រចាំថ្ងៃឱ្យលឿនជាងមុន ៥ ដង',
      'អ៊ីនធឺណិត និង Wi-Fi បញ្ជូនទិន្នន័យឆ្លងទ្វីបដោយវិធីណា?',
      'សុវត្ថិភាពអនឡាញ៖ ៥ វិធីការពារគណនី និងលុយពីជនឆបោក',
      'អនាគតការងារក្នុងយុគសម័យ AI៖ ជំនាញណាដែលមនុស្សនៅតែឈ្នះ?',
      'ប្រវត្តិទូរស័ព្ទដៃពីទំហំប៉ុនឥដ្ឋ ដល់ស្មាតហ្វូនសម័យទំនើប',
      'តើរថយន្តអគ្គិសនី (EV) ដំណើរការខុសពីរថយន្តសាំងយ៉ាងដូចម្តេច?',
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
      'អ្វីកើតឡើងចំពោះរាងកាយ ពេលអ្នកផឹកទឹកគ្រប់គ្រាន់រាល់ថ្ងៃ?',
      'គ្រោះថ្នាក់នៃការញ៉ាំស្ករ និងភេសជ្ជៈផ្អែមច្រើនពេកចំពោះសុខភាព',
      'អត្ថប្រយោជន៍ដ៏អស្ចារ្យនៃការដើរហាត់ប្រាណ ៣០ នាទីរៀងរាល់ថ្ងៃ',
      'ផលប៉ះពាល់នៃការមើលទូរស័ព្ទមុនពេលចូលគេង និងវិធីកែខៃ',
      'អាហារសុខភាពងាយរកនៅផ្សារខ្មែរ ដែលជួយពង្រឹងខួរក្បាល',
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
      'ហេតុអ្វីប្រទេសតូចៗមួយចំនួនដូចជា សិង្ហបុរី អាចអភិវឌ្ឍសេដ្ឋកិច្ចបានយ៉ាងលឿន?',
      'វប្បធម៌នៃការអប់រំ និងវិន័យដ៏គួរឱ្យចាប់អារម្មណ៍នៅប្រទេសជប៉ុន',
      'ប្រទេសដែលមានតំបន់ពេលវេលាច្រើនបំផុត និងមូលហេតុដែលម៉ោងខុសគ្នា',
      'របៀបដែលកប៉ាល់ដឹកទំនិញឆ្លងកាត់ព្រែកជីកប៉ាណាម៉ា',
      'អច្ឆរិយវត្ថុទាំង ៧ នៃពិភពលោកសម័យថ្មី និងប្រវត្តិសង្ខេប',
      'ហេតុអ្វីប្រទេសខ្លះមាន ៤ រដូវ ឯប្រទេសកម្ពុជាមាន ២ រដូវ?',
      'របៀបដែលប្រព័ន្ធដឹកជញ្ជូនរថភ្លើងល្បឿនលឿនផ្លាស់ប្តូរសេដ្ឋកិច្ច',
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
      'Albert Einstein៖ ពីក្មេងចូលចិត្តសួរសំណួរ ដល់អ្នកវិទ្យាសាស្ត្រដ៏អស្ចារ្យ',
      'វណ្ណ ម៉ូលីវណ្ណ៖ បិតាស្ថាបត្យកម្មសម័យទំនើបដ៏ល្បីល្បាញរបស់កម្ពុជា',
      'ព្រះបាទជ័យវរ្ម័នទី៧៖ មេដឹកនាំដែលកសាងមន្ទីរពេទ្យ និងសាលាសំណាក់រាប់រយ',
      'Leonardo da Vinci៖ ទេពកោសល្យទាំងសិល្បៈ និងវិទ្យាសាស្ត្រ',
      'បណ្ឌិត ជួន ណាត៖ វីរជនអ្នកថែរក្សា និងបង្កើតវចនានុក្រមខ្មែរ',
    ],
  },
  {
    id: 'khmer-culture',
    code: '13',
    nameEn: 'Khmer Culture & Heritage',
    nameKh: 'វប្បធម៌ និងបេតិកភណ្ឌខ្មែរ',
    descriptionKh: 'ប្រពៃណីខ្មែរ ពិធីបុណ្យជាតិ ក្រមា សិល្បៈ ល្បែងប្រជាប្រិយ និងម្ហូបខ្មែរ',
    accent: '#c2410c',
    sampleTopics: [
      'ប្រវត្តិ និងអត្ថន័យដ៏ជ្រាលជ្រៅនៃ «ក្រមាខ្មែរ» ក្នុងជីវភាពប្រចាំថ្ងៃ',
      'អត្ថន័យនៃពិធីបុណ្យចូលឆ្នាំថ្មីប្រពៃណីជាតិខ្មែរ និងល្បែងប្រជាប្រិយ',
      'ប្រវត្តិពិធីបុណ្យអុំទូក បណ្ដែតប្រទីប អកអំបុក និងសំពះព្រះខែ',
      'ស្ថាបត្យកម្ម «ផ្ទះឈើខ្មែរ»៖ បញ្ញាញាណដូនតាទប់ទល់នឹងអាកាសធាតុក្ដៅ និងទឹកជំនន់',
      'ល្ខោនស្បែកធំ និងរបាំអប្សរា៖ មរតកវប្បធម៌អរូបីនៃមនុស្សជាតិ',
      'ដើមត្នោតខ្មែរ៖ រុក្ខជាតិអត្តសញ្ញាណជាតិដែលមានប្រយោជន៍ពីឫសដល់ចុង',
      'អត្ថន័យនៃការសំពះទាំង ៥ បែបក្នុងវប្បធម៌គោរពគ្នារបស់ខ្មែរ',
      'ប្រវត្តិ និងប្រយោជន៍នៃម្ហូបខ្មែរបុរាណ (សម្លកកូរ អាម៉ុក ប្រហុក)',
    ],
  },
  {
    id: 'folktales',
    code: '14',
    nameEn: 'Folktales & Fables',
    nameKh: 'រឿងព្រេង និងនិទានអប់រំ',
    descriptionKh: 'រឿងព្រេងខ្មែរ រឿងនិទានសត្វ គតិបណ្ឌិត និងសុភាសិតខ្មែរ',
    accent: '#b91c1c',
    sampleTopics: [
      'រឿងសុភាទន្សាយ និងសត្វខ្លា៖ ប្រើបញ្ញាឈ្នះកម្លាំងបាយ',
      'រឿងអណ្ដើក និងទន្សាយ៖ មេរៀនកុំមើលងាយគូប្រជែង និងការតស៊ូជាប់លាប់',
      'រឿងក្អែកឆ្លាត និងក្អមទឹក៖ បញ្ញាដោះស្រាយបញ្ហាពេលជួបភាពទាល់ច្រក',
      'រឿងកសិករ និងកូនប្រុសទាំងបី៖ ទ្រព្យសម្បត្តិពិតប្រាកដនៅក្នុងដីស្រែ',
      'រឿងស្រមោច និងកណ្ដូប៖ មេរៀននៃការត្រៀមខ្លួនទុកមុនសម្រាប់អនាគត',
      'អត្ថន័យសុភាសិតខ្មែរ «តក់ៗពេញបំពង់» តាមរយៈរឿងនិទានសម័យថ្មី',
      'រឿងសត្វចាប និងព្រៃឈើ៖ កម្លាំងនៃសាមគ្គីភាពជួយឱ្យរួចផុតពីគ្រោះថ្នាក់',
      'អត្ថន័យសុភាសិត «ចំណេះវិជ្ជាជាទ្រព្យដែលចោរលួចមិនបាន»',
    ],
  },
  {
    id: 'family-parenting',
    code: '15',
    nameEn: 'Family & Parenting',
    nameKh: 'គ្រួសារ និងការអប់រំកូន',
    descriptionKh: 'ទំនាក់ទំនងគ្រួសារ ការចិញ្ចឹមអប់រំកូន ការស្ដាប់គ្នា និងសុភមង្គលក្នុងផ្ទះ',
    accent: '#db2777',
    sampleTopics: [
      '៥ វិធីបង្ហាត់កូនឱ្យចេះសន្សំលុយ និងស្គាល់តម្លៃប្រាក់តាំងពីតូច',
      'របៀបនិយាយជាមួយកូនដោយមិនចាំបាច់ស្រែកសម្លុត តែកូនស្ដាប់បង្គាប់',
      'ហេតុអ្វីពេលវេលាញ៉ាំបាយជុំគ្រួសារសំខាន់សម្រាប់ការលូតលាស់ផ្លូវចិត្តកូន?',
      'វិធីជួយកូនឱ្យស្រឡាញ់ការអានសៀវភៅជាជាងលេងទូរស័ព្ទ',
      '៧ ទម្លាប់តូចៗដែលធ្វើឱ្យជីវិតប្ដីប្រពន្ធកាន់តែកក់ក្ដៅ និងយូរអង្វែង',
      'របៀបបង្ហាញការដឹងគុណចំពោះឪពុកម្ដាយក្នុងជីវិតប្រចាំថ្ងៃ',
      'វិធីបង្រៀនកូនឱ្យមានទំនុកចិត្ត និងហ៊ានបញ្ចេញមតិ',
    ],
  },
  {
    id: 'communication',
    code: '16',
    nameEn: 'Communication & Soft Skills',
    nameKh: 'ជំនាញទំនាក់ទំនង',
    descriptionKh: 'សិល្បៈនៃការនិយាយ ការស្ដាប់ ការចរចា និងការធ្វើការជាក្រុម',
    accent: '#0d9488',
    sampleTopics: [
      '៥ តិចនិកនិយាយជាសាធារណៈដោយមិនភ័យញ័រ',
      'សិល្បៈនៃការស្ដាប់៖ ហេតុអ្វីអ្នកពូកែស្ដាប់តែងមានមនុស្សស្រឡាញ់ច្រើន?',
      'របៀបបដិសេធអ្នកដទៃដោយសុភាពរាបសារ មិនឱ្យអន់ចិត្ត',
      'វិធីចាប់ផ្ដើមការសន្ទនាជាមួយមនុស្សថ្មីឱ្យមានភាពស្និទ្ធស្នាល',
      'របៀបចរចាដំឡើងប្រាក់ខែ ឬតម្លៃការងារដោយវិជ្ជាជីវៈ',
      '៦ ពាក្យសម្ដីដែលអ្នកដឹកនាំឆ្លាតតែងប្រើដើម្បីលើកទឹកចិត្តក្រុមការងារ',
      'របៀបដោះស្រាយជម្លោះនៅកន្លែងធ្វើការដោយសន្តិវិធី',
    ],
  },
  {
    id: 'agriculture-rural',
    code: '17',
    nameEn: 'Agriculture & Rural Life',
    nameKh: 'កសិកម្ម និងជីវិតស្រុកស្រែ',
    descriptionKh: 'កសិកម្មសម័យថ្មី បច្ចេកទេសដាំដុះ កែច្នៃកសិផល និងសហគ្រិនភាពជនបទ',
    accent: '#65a30d',
    sampleTopics: [
      'កសិកម្មឆ្លាតវៃ៖ របៀបកសិករខ្មែរសម័យថ្មីបង្កើនចំណូលលើដីតូច',
      'អត្ថប្រយោជន៍នៃដំណាំសរីរាង្គ និងជីកំប៉ុសធម្មជាតិជួយដីឱ្យមានជីជាតិ',
      'របៀបកែច្នៃកសិផលក្នុងស្រុក (ស្វាយ ស្ករត្នោត ចេក) ឱ្យមានតម្លៃខ្ពស់ជាងមុន',
      'ប្រព័ន្ធស្រោចស្រពតំណក់ទឹក៖ ដំណោះស្រាយសន្សំទឹកសម្រាប់កសិករ',
      'ជីវិតកសិករសម័យឌីជីថល៖ លក់បន្លែផ្លែឈើស្រស់ផ្ទាល់ពីចម្ការតាមអនឡាញ',
      'ហេតុអ្វីអង្ករផ្ការំដួលខ្មែរមានក្លិនក្រអូប និងល្បីល្បាញលើពិភពលោក?',
      'គំរូចិញ្ចឹមត្រី និងដាំបន្លែរួមគ្នា (Aquaponics) នៅតាមផ្ទះ',
    ],
  },
  {
    id: 'environment-nature',
    code: '18',
    nameEn: 'Environment & Nature',
    nameKh: 'បរិស្ថាន និងធម្មជាតិ',
    descriptionKh: 'ទន្លេមេគង្គ បឹងទន្លេសាប ព្រៃឈើ សត្វព្រៃ និងការការពារបរិស្ថាន',
    accent: '#15803d',
    sampleTopics: [
      'អច្ឆរិយភាពនៃ «បឹងទន្លេសាប»៖ ហេតុអ្វីទឹកទន្លេសាបហូរចូល និងហូរចេញប្រចាំឆ្នាំ?',
      'ផលប៉ះពាល់នៃថង់ប្លាស្ទិកចំពោះទន្លេ សមុទ្រ និងសុខភាពមនុស្ស',
      'ហេតុអ្វីសត្វឃ្មុំតូចៗមានសារៈសំខាន់ខ្លាំងណាស់ចំពោះអាហារមនុស្សជាតិ?',
      'សត្វផ្សោតទន្លេមេគង្គ៖ មរតកធម្មជាតិដ៏កម្រដែលយើងត្រូវរួមគ្នាការពារ',
      'បម្រែបម្រួលអាកាសធាតុ និងមូលហេតុដែលផែនដីកាន់តែក្ដៅឡើង',
      '៥ ទម្លាប់ងាយៗប្រចាំថ្ងៃដែលជួយការពារបរិស្ថានកម្ពុជាឱ្យស្អាត',
      'ព្រៃកោងកាង៖ ជញ្ជាំងធម្មជាតិការពារឆ្នេរសមុទ្រ និងជម្រកត្រីសមុទ្រ',
    ],
  },
  {
    id: 'space-universe',
    code: '19',
    nameEn: 'Space & Universe',
    nameKh: 'លំហអាកាស និងចក្រវាល',
    descriptionKh: 'ប្រព័ន្ធព្រះអាទិត្យ ភព ផ្កាយ ប្រហោងខ្មៅ និងការរុករកអវកាស',
    accent: '#3730a3',
    sampleTopics: [
      'ដំណើរផ្សងព្រេងឆ្លងកាត់ភពទាំង ៨ ក្នុងប្រព័ន្ធព្រះអាទិត្យ',
      'តើប្រហោងខ្មៅ (Black Hole) គឺជាអ្វី? អ្វីកើតឡើងបើធ្លាក់ចូល?',
      'ហេតុអ្វីផែនដីជាភពតែមួយគត់ដែលយើងស្គាល់ថាមានជីវិតរស់នៅ?',
      'តើសូរ្យគ្រាស និងចន្ទគ្រាសកើតឡើងដោយវិធីណា?',
      'ជីវិតអវកាសយានិកលើស្ថានីយអវកាសអន្តរជាតិ (ISS)៖ ញ៉ាំ និងគេងយ៉ាងម៉េច?',
      'អ្វីនឹងកើតឡើងបើព្រះច័ន្ទស្រាប់តែបាត់ខ្លួនពីផែនដី?',
      'ផ្កាយដុះកន្ទុយ និងផ្កាយធ្លាក់ មានប្រភពមកពីណា?',
    ],
  },
  {
    id: 'career-productivity',
    code: '20',
    nameEn: 'Career & Productivity',
    nameKh: 'ការងារ និងការគ្រប់គ្រងពេលវេលា',
    descriptionKh: 'ប្រសិទ្ធភាពការងារ រៀបចំកាលវិភាគ ស្វែងរកការងារ និងការរីកចម្រើនអាជីព',
    accent: '#0369a1',
    sampleTopics: [
      'ក្បួន 80/20 (Pareto Principle)៖ ធ្វើការតិច តែទទួលបានលទ្ធផលធំ',
      'របៀបរៀបចំកាលវិភាគប្រចាំថ្ងៃឱ្យមានពេលសម្រាប់ការងារ គ្រួសារ និងសុខភាព',
      'តារាង Eisenhower Matrix៖ វិធីបែងចែកការងារសំខាន់ និងការងារបន្ទាន់',
      '៥ គន្លឹះសម្ភាសន៍ការងារឱ្យជាប់ និងធ្វើឱ្យនិយោជកពេញចិត្ត',
      'របៀបបង្កើត CV ដ៏ទាក់ទាញសម្រាប់និស្សិតទើបបញ្ចប់ការសិក្សា',
      'វិធីគេចផុតពីភាពនឿយហត់ការងារ (Burnout) និងរក្សាថាមពលវិជ្ជមាន',
      '៧ ទម្លាប់របស់បុគ្គលិកឆ្នើមដែលឆាប់ឡើងតំណែង',
    ],
  },
  {
    id: 'philosophy-wisdom',
    code: '21',
    nameEn: 'Philosophy & Wisdom',
    nameKh: 'ទស្សនវិជ្ជា និងគតិបណ្ឌិត',
    descriptionKh: 'ការអប់រំចិត្ត សេចក្ដីស្ងប់ សតិសម្បជញ្ញៈ និងទស្សនៈអ្នកប្រាជ្ញ',
    accent: '#a16207',
    sampleTopics: [
      'ទស្សនវិជ្ជា Stoicism៖ របៀបរក្សាចិត្តស្ងប់កណ្ដាលព្យុះបញ្ហាជីវិត',
      'គោលគំនិត «Ikigai» របស់ជប៉ុន៖ ស្វែងរកអត្ថន័យនៃការរស់នៅ',
      'ការអប់រំចិត្តឱ្យស្គាល់សុភមង្គលក្នុងបច្ចុប្បន្នកាល (Mindfulness)',
      'រឿងព្រះសង្ឃ និងកែវតែពេញ៖ មេរៀននៃការដាក់ខ្លួនរៀនសូត្រជានិច្ច',
      'ហេតុអ្វីការអត់ឱនឱ្យអ្នកដទៃ ជាការដោះលែងខ្លួនឯងពីទុក្ខ?',
      'សិល្បៈនៃការរស់នៅសាមញ្ញ (Minimalism)៖ កាន់តែតិច កាន់តែសប្បាយចិត្ត',
      'មេរៀនពីធម្មជាតិ៖ ភាពស្ងប់ស្ងាត់ដូចទឹក និងភាពរឹងមាំដូចភ្នំ',
    ],
  },
  {
    id: 'digital-online-business',
    code: '22',
    nameEn: 'Digital & Online Business',
    nameKh: 'អាជីវកម្មអនឡាញ និងទីផ្សារ',
    descriptionKh: 'ការលក់អនឡាញ YouTube, Content Creation, Branding និង Digital Marketing',
    accent: '#be185d',
    sampleTopics: [
      'របៀបកសាងឆានែល YouTube អប់រំពីសូន្យឱ្យមានអ្នកតាមដានពិតប្រាកដ',
      '៥ គន្លឹះបង្កើតមាតិកា (Content) ឱ្យអ្នកទស្សនាចូលចិត្ត និងចែករំលែក',
      'របៀបលក់ផលិតផលតាមអនឡាញឱ្យអតិថិជនជឿទុកចិត្ត និងទិញម្ដងហើយម្ដងទៀត',
      'អ្វីទៅជា Personal Branding ហើយហេតុអ្វីមនុស្សសម័យថ្មីគួរកសាងវា?',
      'គន្លឹះថតរូប និងរៀបចំហាងអនឡាញឱ្យមើលទៅដូចម៉ាកល្បី',
      'វិធីប្រើការនិទានរឿង (Storytelling) ក្នុងការផ្សព្វផ្សាយអាជីវកម្ម',
      'ការចាប់ផ្ដើមការងារ Freelance តាមអនឡាញសម្រាប់យុវជនកម្ពុជា',
    ],
  },
  {
    id: 'law-civics',
    code: '23',
    nameEn: 'Law & Civics',
    nameKh: 'ច្បាប់ និងសីលធម៌សង្គម',
    descriptionKh: 'សុវត្ថិភាពចរាចរណ៍ សីលធម៌សាធារណៈ សិទ្ធិ និងកាតព្វកិច្ចពលរដ្ឋ',
    accent: '#334155',
    sampleTopics: [
      'វប្បធម៌បើកបរមានសុវត្ថិភាព៖ ៥ ទម្លាប់ជួយកាត់បន្ថយគ្រោះថ្នាក់ចរាចរណ៍',
      'សុជីវធម៌នៅទីសាធារណៈ៖ ការតម្រង់ជួរ និងការគោរពសិទ្ធិអ្នកដទៃ',
      'សិទ្ធិអ្នកប្រើប្រាស់ និងវិធីពិនិត្យកិច្ចសន្យាមុនពេលចុះហត្ថលេខា',
      'ការប្រើប្រាស់បណ្ដាញសង្គមដោយមានទំនួលខុសត្រូវ និងចៀសវាងព័ត៌មានក្លែងក្លាយ',
      'តួនាទីយុវជនក្នុងការចូលរួមអភិវឌ្ឍសហគមន៍មូលដ្ឋាន',
      'ការការពារកម្មសិទ្ធិបញ្ញា (Copyright) សម្រាប់អ្នកបង្កើតមាតិកា',
    ],
  },
  {
    id: 'kids-stories',
    code: '24',
    nameEn: 'Kids Science & Stories',
    nameKh: 'ចំណេះដឹង និងរឿងនិទានកុមារ',
    descriptionKh: 'សំណួរចង់ដឹងរបស់ក្មេងៗ ទម្លាប់ល្អ សត្វគួរឱ្យស្រឡាញ់ និងសុវត្ថិភាពកុមារ',
    accent: '#f59e0b',
    sampleTopics: [
      'ហេតុអ្វីក្មេងៗត្រូវដុសធ្មេញរាល់ព្រឹក និងមុនពេលចូលគេង? (រឿងទ័ពមេរោគតូច)',
      'ដំណើររបស់ដង្កូវតូចក្លាយជាមេអំបៅដ៏ស្រស់ស្អាត',
      'ហេតុអ្វីសត្វអំពិលអំពែកអាចបញ្ចេញពន្លឺនៅពេលយប់បាន?',
      'មេរៀនល្អសម្រាប់កុមារ៖ ការនិយាយពាក្យ «អរគុណ» និង «សុំទោស»',
      'ហេតុអ្វីដំរីមានប្រមោយវែង និងស្លឹកត្រចៀកធំ?',
      'សុវត្ថិភាពកុមារ៖ ៥ រឿងដែលក្មេងៗត្រូវដឹងពេលនៅផ្ទះ និងពេលដើរឆ្លងផ្លូវ',
      'រឿងដំណើរផ្សងព្រេងរបស់គ្រាប់ពូជស្វាយតូចមួយ',
    ],
  },
  {
    id: 'custom',
    code: '25',
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

export const PRESENTER_SETUP_OPTIONS: PresenterSetupOption[] = [
  {
    id: 'group',
    labelKh: 'ក្រុមតួអង្គច្រើននាក់ / ក្រុមការងារ (Team & Group Presentation)',
    labelEn: 'Team & Group Ensemble (3–5 Characters)',
    badgeKh: 'ពេញនិយម • មានតួអង្គ ៣–៥ នាក់',
    descriptionKh:
      'មានតួអង្គជាក្រុម (ប្រធានក្រុម អ្នកបច្ចេកទេស សមាជិក) ធ្វើការរួមគ្នា ប្រជុំ ពិភាក្សា ចែករំលែកបទពិសោធន៍ និងធ្វើសកម្មភាពជាក់ស្តែង',
    castCount: '3–5 Characters',
    castHintKh: 'បង្កើតតួអង្គសំខាន់ ៣ ទៅ ៥ នាក់ដែលមានតួនាទីខុសៗគ្នា និងសហការគ្នាគ្រប់ឈុត',
  },
  {
    id: 'duo',
    labelKh: 'គូតួអង្គធ្វើបទបង្ហាញ / ពិភាក្សាឆ្លើយឆ្លង (Duo Co-hosts / Dynamic Pair)',
    labelEn: 'Duo Co-hosts / Dynamic Pair (2 Characters)',
    badgeKh: 'ឆ្លើយឆ្លង • តួអង្គ ២ នាក់',
    descriptionKh:
      'តួអង្គ ២ នាក់ឆ្លើយឆ្លងគ្នា (ដូចជា គ្រូ & សិស្ស, អ្នកជំនាញ & អ្នកចាប់ផ្តើម ឬមិត្តភក្តិ ២ នាក់) ជួយពន្យល់ និងសួរដេញដោល',
    castCount: '2 Characters',
    castHintKh: 'បង្កើតតួអង្គ ២ នាក់ដែលមានចរិតបំពេញគ្នាទៅវិញទៅមក និងជជែកសួរឆ្លើយរស់រវើក',
  },
  {
    id: 'drama-cast',
    labelKh: 'ក្រុមតួអង្គដើរតួក្នុងសាច់រឿងជាក់ស្តែង (Full Story Narrative / Drama Cast)',
    labelEn: 'Full Narrative Story & Drama Roleplay (3–6 Characters)',
    badgeKh: 'សាច់រឿងជីវិតពិត • ៣–៦ នាក់',
    descriptionKh:
      'សាច់រឿងបែបកុនជីវិតពិត មានតួឯក តួគ្រួសារ មិត្តភក្តិ អតិថិជន និងសហគមន៍ សម្តែងឈុតឆាកជាក់ស្តែងតាមជីវិតរស់នៅ',
    castCount: '3–6 Characters',
    castHintKh: 'មានតួឯក តួគ្រួសារ អ្នកជិតខាង និងអតិថិជន សម្តែងជាសាច់រឿងជាក់ស្តែង',
  },
  {
    id: 'solo',
    labelKh: 'អ្នកធ្វើបទបង្ហាញទោល + តួអង្គក្នុងឧទាហរណ៍ (Solo Host + Scenario Examples)',
    labelEn: 'Solo Host + Scenario Cast (1–2 Characters)',
    badgeKh: 'បទបង្ហាញទោល • ១–២ នាក់',
    descriptionKh:
      'មានអ្នកធ្វើបទបង្ហាញម្នាក់ជាគោល ប៉ុន្តែចុះទៅបង្ហាញសកម្មភាពផ្ទាល់ និងជួបតួអង្គផ្សេងៗក្នុងសាច់រឿង',
    castCount: '1–2 Characters',
    castHintKh: 'អ្នកធ្វើបទបង្ហាញ ១ នាក់ និងតួអង្គឧទាហរណ៍ក្នុងសាច់រឿង',
  },
];

export const SCENE_ACTION_DYNAMICS: SceneActionDynamicOption[] = [
  {
    id: 'cinematic-action',
    labelKh: 'ប្លង់សកម្មភាពជាក់ស្តែង & ចលនារស់រវើក (Cinematic Action & Movement)',
    labelEn: 'Cinematic Action & Movement (NO Boring Talking Heads)',
    badgeKh: 'ណែនាំ • ហាមឈរនិយាយទទេ',
    descriptionKh:
      'ហាមដាច់ខាតឈរនិយាយទទេ! តួអង្គត្រូវមានចលនា ដើរ រត់ ធ្វើការងារ បើកបរ ចង្អុលបង្ហាញ ជួបមនុស្ស និងដោះស្រាយបញ្ហាផ្ទាល់',
    actionHintKh: 'គ្រប់ឈុតត្រូវមានសកម្មភាពរស់រវើក មិនឈរនិយាយស្ងៀមៗមុខកាមេរ៉ាឡើយ',
  },
  {
    id: 'hands-on-demo',
    labelKh: 'ការងារ & ការអនុវត្តជាក់ស្តែង (Hands-on Workflow & Step-by-Step)',
    labelEn: 'Hands-on Workflow & Practical Demonstration',
    badgeKh: 'អនុវត្តផ្ទាល់',
    descriptionKh:
      'បង្ហាញដំណាក់កាលធ្វើការងារជាក់ស្តែង ប្រើប្រាស់ឧបករណ៍ សរសេរ គណនា ចម្អិន ឬសាងសង់ ដោយមានកាយវិការសកម្ម',
    actionHintKh: 'ផ្តោតលើការបង្ហាញកាយវិការធ្វើការងារជាក់ស្តែង ប្រើដៃ ឧបករណ៍ ឬឯកសារផ្ទាល់',
  },
  {
    id: 'dialogue-roleplay',
    labelKh: 'ការសន្ទនាឆ្លើយឆ្លង & ប្លង់កាត់មុំកាមេរ៉ា (Interactive Group Dialogue)',
    labelEn: 'Interactive Group Dialogue & Multi-Angle Shots',
    badgeKh: 'សន្ទនាឆ្លើយឆ្លង',
    descriptionKh:
      'ប្លង់សន្ទនាជាក្រុម ចាប់មុំពីចំហៀង មុំពីក្រោយស្មា (Over-The-Shoulder) និងប្លង់ទូលាយ មិនមែនសំឡឹងចំកាមេរ៉ាស្ងៀមៗឡើយ',
    actionHintKh: 'ផ្តោតលើការសន្ទនាឆ្លើយឆ្លងគ្នា និងមុំកាមេរ៉ាកាត់ចុះឡើងរវាងតួអង្គ',
  },
  {
    id: 'field-documentary',
    labelKh: 'ចុះទីតាំងផ្ទាល់បែបឯកសារ (On-location Fieldwork & Exploration)',
    labelEn: 'On-location Fieldwork & Environment Exploration',
    badgeKh: 'ចុះទីតាំងផ្ទាល់',
    descriptionKh:
      'តួអង្គធ្វើដំណើរចុះទីតាំងផ្ទាល់ ផ្សារ វាលស្រែ រោងចក្រ ការិយាល័យ ផ្ទះ និងកន្លែងសាធារណៈ រួមជាមួយមនុស្សជុំវិញ',
    actionHintKh: 'ផ្តោតលើការចុះទីតាំងជាក់ស្តែង និងទំនាក់ទំនងជាមួយបរិស្ថានជុំវិញ',
  },
];

export function buildMasterPrompt(req?: Partial<GenerationRequest>): string {
  const durationObj =
    DURATION_PRESETS.find((d) => d.id === req?.durationPreset) || DURATION_PRESETS[1];
  const styleObj =
    ANIMATION_STYLES.find((s) => s.id === req?.animationStyle) || ANIMATION_STYLES[0];
  const presenterObj =
    PRESENTER_SETUP_OPTIONS.find((p) => p.id === req?.presenterSetup) || PRESENTER_SETUP_OPTIONS[0];
  const actionObj =
    SCENE_ACTION_DYNAMICS.find((a) => a.id === req?.actionDynamic) || SCENE_ACTION_DYNAMICS[0];
  const topicText = req?.topic?.trim() || '[បញ្ចូលប្រធានបទ]';
  const categoryText = req?.categoryLabelKh || 'Business & Money – មុខជំនួញ និងហិរញ្ញវត្ថុ';
  const targetScenes = req?.targetScenes || durationObj.defaultScenes;
  const narratorVoice = req?.narratorVoice || 'Khmer Male Voice';
  const hasTopic = Boolean(req?.topic?.trim());

  return `MASTER PROMPT – KHMER EDUCATIONAL STORYTELLING ANIMATION

អ្នកគឺជាអ្នកនិពន្ធស្គ្រីបភាពយន្ត អ្នកស្រាវជ្រាវចំណេះដឹង អ្នកដឹកនាំរឿង Animation និងអ្នកនិទានរឿងអាជីព។
ខ្ញុំចង់បង្កើតវីដេអូអប់រំ និងចែករំលែកចំណេះដឹង បែប ${styleObj.labelEn} ដោយយកស្ទីល Educational Storytelling & Dynamic Action ជាគំរូ។

1. ព័ត៌មានសម្រាប់បង្កើតវីដេអូ
- Category: ${categoryText}
- Topic: ${topicText}
- Video Title: [បង្កើតចំណងជើងគួរឱ្យចាប់អារម្មណ៍ជាភាសាខ្មែរ]
- Language: Khmer
- Video Duration: ${durationObj.labelEn} (${targetScenes} ឈុត / 5–10 វិនាទីក្នុងមួយឈុត)
- Video Format: 16:9 (1920 × 1080)
- Animation Style: ${styleObj.labelEn}
- Presenter & Cast Setup: ${presenterObj.labelEn} — ${presenterObj.labelKh} (${presenterObj.castCount})
- Scene Action Dynamics: ${actionObj.labelEn} — ${actionObj.labelKh}
- Narrator: ${narratorVoice}
- Voice Tone: Natural, Clear, Professional, Engaging
- Subtitle: Khmer
- Audience: General Audience
- Storytelling: Educational, Dynamic Real-world Action, Practical Demonstrations${
    req?.customNotes?.trim() ? `\n- Additional Notes: ${req.customNotes.trim()}` : ''
  }

2. របៀបសរសេរ Script
សូមសរសេរ Script ពេញលេញ ដោយមានផ្នែកដូចខាងក្រោម៖
A. INTRODUCTION
- ចាប់ផ្ដើមដោយសំណួរ ឬសកម្មភាពជាក់ស្តែងដែលធ្វើឱ្យអ្នកទស្សនាចង់ដឹង។
- បង្ហាញបញ្ហា ឬចំណុចគួរឱ្យចាប់អារម្មណ៍តាមរយៈតួអង្គក្នុងជីវិតពិត។
- ណែនាំប្រធានបទវីដេអូ។

B. MAIN STORY
- រៀបរាប់ខ្លឹមសារជាផ្នែកៗ។
- ពន្យល់ឱ្យងាយយល់ និងមានសកម្មភាពការងារជាក់ស្តែង។
- ប្រើប្រាស់តួអង្គជាក្រុម ឬដៃគូ ដើម្បីជជែក ដោះស្រាយ និងបង្ហាញដំណោះស្រាយផ្ទាល់ដៃ។
- រៀបចំចំណុចសំខាន់ៗជាលំដាប់។

C. IMPORTANT LESSONS
- សង្ខេបមេរៀនសំខាន់ៗ។
- ផ្តល់គំនិត និងដំណោះស្រាយដែលអាចអនុវត្តបាន។
- បង្ហាញអ្វីដែលអ្នកទស្សនាគួររៀនពីប្រធានបទនេះ។

D. CONCLUSION
- បញ្ចប់ដោយសារដ៏មានអត្ថន័យ និងឃ្លាដែលធ្វើឱ្យអ្នកទស្សនាចងចាំ។
- អញ្ជើញឱ្យ Like, Share និង Subscribe។

3. ច្បាប់សំខាន់សម្រាប់តួអង្គ និងប្លង់សកម្មភាព (STRICT ACTION & CAST DYNAMICS)
- ជម្រើសទម្រង់តួអង្គ៖ ${presenterObj.labelKh} (${presenterObj.castHintKh})
- ជម្រើសប្លង់សកម្មភាព៖ ${actionObj.labelKh} (${actionObj.actionHintKh})
- ហាមដាច់ខាតឈរនិយាយទទេ (ANTI-TALKING-HEAD MANDATE)៖ កុំឱ្យតួអង្គគ្រាន់តែឈរស្ងៀមៗមុខកាមេរ៉ាអាន Script Voiceover ឱ្យសោះ! នេះជាគំនូរជីវចលអប់រំបែប Storytelling រស់រវើក។
- គ្រប់ឈុតទាំងអស់៖ «visualDescription» និង «characterAction» ត្រូវតែរៀបរាប់សកម្មភាពរូបវន្តរស់រវើក (Physical actions) ដូចជា៖
  * តួអង្គដើរយ៉ាងស្វាហាប់តាមដងផ្លូវ ទីប្រជុំជន ឬវាលស្រែ
  * ក្រុមការងារប្រជុំ លើកដៃស្នើគំនិត ចង្អុលបង្ហាញក្រាហ្វិកលើក្តារខៀន ឬអេក្រង់កុំព្យូទ័រ
  * កំពុងកាន់ និងបង្ហាញឧបករណ៍ ឬទំនិញជាក់ស្តែងក្នុងដៃ
  * កំពុងជិះ PassApp/រ៉ឺម៉កកង់បី ជជែកគ្នា ឬអង្គុយញ៉ាំកាហ្វេជជែកការងារ
  * កំពុងចុះពិនិត្យកសិដ្ឋាន ហាង ផ្សារ ឬរោងចក្រជាមួយប្រជាជនក្នុងតំបន់
  * មានកាយវិការឆ្លើយឆ្លង សើច ឆ្ងល់ ពិភាក្សា និងសហការគ្នា
- សំឡេងអ្នកនិទាន (Khmer Narrator Script) គឺជាអ្នករៀបរាប់សាច់រឿងអប់រំពីលើ (Voiceover Narration) ខណៈពេលដែលតួអង្គកំពុងធ្វើសកម្មភាពជាក់ស្តែងក្នុងរូបភាព។
- ឈុតដែលមានការសន្ទនា សូមបញ្ចូលឃ្លាសន្ទនាខ្លីៗរវាងតួអង្គក្នុង «characterDialogue» ឱ្យបានច្រើន ដើម្បីឱ្យសាច់រឿងមានភាពរស់រវើកបែបមនុស្សពិត!

4. FORMAT សម្រាប់រៀបចំឈុតវីដេអូ
បែងចែកវីដេអូជា ${targetScenes} ឈុត (5–10 វិនាទី/ឈុត)។ ឈុតនីមួយៗត្រូវមាន៖
- Scene Number
- Scene Title
- Duration
- Visual Description
- Character (ឈ្មោះតួអង្គ ឬក្រុមតួអង្គដែលកំពុងធ្វើសកម្មភាព)
- Character Action (សកម្មភាពជាក់ស្តែងរស់រវើក មិនឈរនិយាយទទេ)
- Narrator Script (Khmer Voiceover ពេញលេញ)
- Character Dialogue (សន្ទនាខ្លីៗរវាងតួអង្គ)
- On-screen Text
- AI Image Prompt (English — active poses, multi-character composition, Cambodian setting)
- AI Video Animation Prompt (English + Spoken Khmer Narration instruction)
- Camera Movement (Track shot, dynamic panning, over-the-shoulder, etc.)
- Background Music / Sound Effects

5. ច្បាប់សំខាន់សម្រាប់អ្នកនិទាន (NARRATOR SCRIPT)
- សរសេរជាភាសាខ្មែរឱ្យត្រឹមត្រូវតាមវេយ្យាករណ៍ ប្រើពាក្យសាមញ្ញ ងាយស្ដាប់ និងងាយយល់។
- Script ត្រូវមានអត្ថន័យពេញលេញ មិនមែនសរសេរត្រឹមតែចំណងជើងទេ ហើយត្រូវមានការតភ្ជាប់ពីប្រយោគមួយទៅប្រយោគមួយ។
- កុំប្រើពាក្យដដែលៗច្រើនពេក និងកុំសង្ខេបខ្លឹមសារខ្លីពេក។
- ត្រូវសរសេរអត្ថបទដែលអ្នកនិទានអាចអានថតសំឡេងបានភ្លាមៗ និងត្រូវដាក់ដាច់ដោយឡែកពី AI Image Prompt និង AI Video Prompt។
- កុំឱ្យ Narrator និយាយខុសពីសកម្មភាពដែលកំពុងបង្ហាញក្នុងរូបភាព។

6. ANIMATION STYLE, KHMER CULTURAL SETTING & VISUAL CONSISTENCY
${styleObj.promptAnchor}.
- តួអង្គទាំងអស់ត្រូវជាតួអង្គខ្មែរពិតប្រាកដ (Authentic Cambodian/Khmer facial features, natural Southeast Asian skin tone, realistic everyday Khmer outfits, school uniforms, or subtle krama details when appropriate)។
- ទេសភាព និងទិដ្ឋភាពត្រូវជាបរិយាកាសកម្ពុជាពិតប្រាកដ ទាំងស្រុកស្រែចម្ការ (វាលស្រែ ដើមត្នោត ផ្ទះឈើខ្មែរ ស្រះឈូក ផ្លូវដីក្រហម ដំបូលវត្ត) និងទីក្រុងកម្ពុជា (ផ្ទះល្វែងខ្មែរ មាត់ទន្លេចតុមុខ ហាងកាហ្វេភ្នំពេញ រ៉ឺម៉កកង់បី/PassApp ដើមឈើតាមដងផ្លូវ)។
- បើមានហាង សាលារៀន ផ្សារ ឬអគារពាណិជ្ជកម្ម ត្រូវបញ្ចូលអក្សរខ្មែរលើស្លាកយីហោឱ្យច្បាស់ល្អ (ឧ. «កាហ្វេតារា», «ហាងលក់ទំនិញ», «វិទ្យាល័យ», «ផ្សារ») ប៉ុន្តែកុំដាក់ Watermark ឬអក្សរ Subtitle អណ្ដែតលើរូប។
- Consistent character design across all scenes (no random character changes).

7. RESEARCH & ACCURACY
- ប្រើព័ត៌មានដែលអាចផ្ទៀងផ្ទាត់បាន មិនបង្កើតតួលេខ ឬសម្រង់សម្តីក្លែងក្លាយ។
- ប្រសិនបើជាប្រវត្តិសាស្ត្រ ត្រូវរក្សាឈ្មោះ និងព្រឹត្តិការណ៍ឱ្យត្រឹមត្រូវ។
- បើជារឿងប្រឌិត ត្រូវបញ្ជាក់ថាជារឿងប្រឌិត។ បើមានព័ត៌មានមិនច្បាស់ ត្រូវបញ្ជាក់ថាមិនទាន់អាចផ្ទៀងផ្ទាត់បាន។

8. FINAL OUTPUT
សូមបង្កើតលទ្ធផលពេញលេញជា៖
1. Video Title
2. Video Description
3. Character Consistency Sheet & AI Character Reference Image Prompts (English — រូបភាពតួអង្គនីមួយៗ)
4. Main Story Outline
5. Complete Standalone Narrator Script (Khmer)
6. Scene-by-Scene Storyboard (${targetScenes} Scenes)
7. AI Image Prompts for Every Scene (English — តាម Scenes នីមួយៗ)
8. AI Video Animation Prompts for Every Scene (និយាយភាសាខ្មែរ — តាម Scenes នីមួយៗ)
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
  const presenterObj =
    PRESENTER_SETUP_OPTIONS.find((p) => p.id === req.presenterSetup) || PRESENTER_SETUP_OPTIONS[0];
  const actionObj =
    SCENE_ACTION_DYNAMICS.find((a) => a.id === req.actionDynamic) || SCENE_ACTION_DYNAMICS[0];
  const topicText = req.topic.trim() || '៧ វិធីគ្រប់គ្រងលុយឱ្យមានប្រសិទ្ធភាព';

  return `You are an expert Khmer Educational Storytelling Animation director, documentary researcher, scriptwriter, and narrator.
Create a complete, production-ready Khmer Educational Animation storyboard for:
- Category: ${req.categoryLabelKh}
- Topic: ${topicText}
- Presenter & Cast Setup: ${presenterObj.labelEn} (${presenterObj.labelKh} — ${presenterObj.castCount})
- Scene Action Dynamics: ${actionObj.labelEn} (${actionObj.labelKh})
- Duration: ${durationObj.labelEn} (${req.targetScenes} sequential scenes, 6–10 seconds per scene)
- Animation Style: ${styleObj.labelEn}
- Visual Anchor (include in every aiImagePromptEn): "${styleObj.promptAnchor}"
- Narrator: ${req.narratorVoice} (Natural, Clear, Professional, Engaging Khmer)
${req.customNotes?.trim() ? `- Additional Notes: ${req.customNotes.trim()}` : ''}

STRICT PRODUCTION RULES:
1. MULTI-CHARACTER CAST SETUP (${presenterObj.labelEn}):
   - In "characters", define multiple distinct Cambodian (Khmer) characters (${presenterObj.castHintKh}).
   - Give each character a distinct role (e.g. Team Leader, Technical Specialist, Practitioner, Curious Learner), distinct natural Cambodian appearance, consistent everyday outfits, and distinct personalities.
   - Throughout the story, actively showcase these characters collaborating, discussing, problem-solving, and interacting together!

2. ANTI-TALKING-HEAD MANDATE & DYNAMIC SCENE ACTION (${actionObj.labelEn}):
   - CRITICAL RULE: NEVER create scenes where characters merely stand still facing the camera reading the voiceover script!
   - In EVERY SINGLE SCENE, "visualDescription" and "characterAction" MUST depict tangible, dynamic physical activities:
     * Characters walking briskly through Phnom Penh streets or Cambodian village paths
     * Writing or sketching workflows on a whiteboard with team members gathered around exchanging ideas
     * Inspecting real equipment, crops, books, financial spreadsheets, or products hands-on
     * Riding PassApp / bicycles / motorbikes while pointing out real-world landmarks
     * Gathering around a desk with laptops, sticky notes, or tea/coffee cups in lively discussion
     * Shaking hands, handing over items, smiling, gesturing expressively, cheering, solving problems
   - The Khmer Narrator Script is voiceover storytelling that accompanies the visual actions, while characters actively live, work, and collaborate in the world.
   - Include natural Khmer conversational dialogue between characters in "characterDialogue" whenever characters talk to each other!

3. KHMER NARRATOR SCRIPT: Write natural, grammatically accurate, complete Khmer narrator sentences ready to read aloud immediately (NOT bullet headings). Connect every scene smoothly to the next like a polished documentary storyteller.
4. CAMBODIAN CULTURAL SETTING: Authentic Cambodian features, scenery, clean Khmer script on shop signboards (no floating subtitles/watermarks).
5. RETURN ONLY VALID JSON inside a single \`\`\`json code block matching the exact structure below (no extra explanation outside the JSON):

\`\`\`json
{
  "videoTitle": "ចំណងជើងវីដេអូគួរឱ្យចាប់អារម្មណ៍ជាភាសាខ្មែរ",
  "videoDescription": "ការពិពណ៌នាវីដេអូសម្រាប់ YouTube ជាភាសាខ្មែរ",
  "isFictionalNote": "កំណត់សម្គាល់ភាពត្រឹមត្រូវ ឬបញ្ជាក់បើជារឿងប្រឌិតអប់រំ",
  "characters": [
    {
      "name": "ឈ្មោះតួអង្គ (ឧ. សុខា - ប្រធានក្រុម)",
      "role": "តួនាទីជាក់លាក់",
      "appearance": "រូបរាង អាយុ សក់ សម្បុរ",
      "outfit": "សម្លៀកបំពាក់ជាក់លាក់",
      "personality": "បុគ្គលិកលក្ខណៈ",
      "aiCharacterImagePromptEn": "Authentic Cambodian (Khmer) character design turnaround reference sheet (front view, 3/4 view, 3 expressions, exact outfit/hair/colors, clean solid cream background) + ${styleObj.promptAnchor}"
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
      "visualDescription": "ការពិពណ៌នារូបភាពជាភាសាខ្មែរ (សកម្មភាពជាក់ស្តែង មិនឈរនិយាយទទេ)",
      "character": "ឈ្មោះតួអង្គ ឬក្រុមតួអង្គ",
      "characterAction": "សកម្មភាពតួអង្គជាក់ស្តែង (កំពុងដើរ ពិភាក្សា ចង្អុលបង្ហាញ ឬធ្វើការងារផ្ទាល់)",
      "narratorScriptKh": "អត្ថបទអ្នកនិទានពេញលេញជាភាសាខ្មែរដែលអានថតសំឡេងបានភ្លាមៗ",
      "characterDialogue": "ឃ្លាសន្ទនាខ្លីៗរវាងតួអង្គ (បើមាន)",
      "onScreenText": "អក្សរខ្លីលើអេក្រង់",
      "aiImagePromptEn": "Detailed English 2D illustration prompt depicting active poses, multi-character teamwork, authentic Cambodian countryside/city background + ${styleObj.promptAnchor}",
      "aiVideoPromptEn": "Visual Motion: smooth character motion, walking, gesturing, camera tracking. Spoken Khmer Narration (${req.narratorVoice}, natural clear Khmer language): \\"<exact Khmer narratorScriptKh for this scene>\\". Background Music & SFX: warm documentary music. No floating subtitles.",
      "cameraMovement": "Dynamic tracking shot / over-the-shoulder angle",
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
    "visualConcept": "គំនិតរចនារូបភាពតួអង្គជាក្រុមធ្វើសកម្មភាព",
    "aiThumbnailPromptEn": "Eye-catching 16:9 Cambodian 2D cartoon YouTube thumbnail prompt in English showing team collaboration & Cambodian setting, no watermarks"
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
  const presenterObj =
    PRESENTER_SETUP_OPTIONS.find((p) => p.id === req.presenterSetup) || PRESENTER_SETUP_OPTIONS[0];
  const actionObj =
    SCENE_ACTION_DYNAMICS.find((a) => a.id === req.actionDynamic) || SCENE_ACTION_DYNAMICS[0];
  const topicText = req.topic.trim() || 'ប្រធានបទវីដេអូថ្មី';
  const count = Math.min(20, Math.max(8, Math.round(req.targetScenes / 2)));
  const now = new Date().toISOString();

  let characters = [
    {
      name: 'សុខា (ប្រធានក្រុម / Team Lead)',
      role: 'អ្នកដឹកនាំ និងសម្របសម្រួលបទបង្ហាញ',
      appearance: 'យុវជនខ្មែរអាយុ ២៨ ឆ្នាំ សក់ខ្លីរៀបរយ ទឹកមុខរួសរាយ សម្បុរស្រអែមធម្មជាតិ',
      outfit: 'អាវពណ៌ខៀវផ្ទៃមេឃ ខោពណ៌ទឹកប៊ិចចាស់ ស្បែកជើងស្បែក',
      personality: 'មានភាពជាអ្នកដឹកនាំ ពូកែពន្យល់ និងលើកទឹកចិត្តក្រុម',
      aiCharacterImagePromptEn: `Authentic Cambodian (Khmer) 2D cartoon character design turnaround reference sheet of Sokha, a friendly 28-year-old Cambodian team lead with natural Southeast Asian facial features, neat short black hair, warm light-tan skin tone, wearing a sky-blue polo shirt and dark navy pants. Full-body front view, 3/4 view, and 3 facial expressions (speaking, smiling, enthusiastic). ${styleObj.promptAnchor}.`,
    },
    {
      name: 'តារា (អ្នកបច្ចេកទេស & អនុវត្ត / Specialist)',
      role: 'អ្នកបង្ហាញការងារ និងដំណោះស្រាយជាក់ស្តែង',
      appearance: 'យុវជនខ្មែរអាយុ ២៥ ឆ្នាំ ពាក់វ៉ែនតា សក់ទាន់សម័យ សម្បុរសណ្តែកបាយ',
      outfit: 'អាវយឺតកមូលពណ៌ស អាវក្រៅពណ៌ប្រផេះស្រាល ខោខូវប៊យ',
      personality: 'រហ័សរហួន ពូកែវិភាគ និងបង្ហាញឧបករណ៍ជាក់ស្តែង',
      aiCharacterImagePromptEn: `Authentic Cambodian (Khmer) 2D cartoon character design turnaround reference sheet of Dara, a smart 25-year-old Cambodian tech specialist with round glasses, stylish short black hair, wearing a white t-shirt under a light gray casual jacket and jeans. Full-body front view, 3/4 view, and 3 facial expressions (focused, analyzing, joyful). ${styleObj.promptAnchor}.`,
    },
    {
      name: 'កញ្ញា (អ្នកស្រាវជ្រាវ / Researcher)',
      role: 'អ្នកផ្តល់ព័ត៌មាន និងសួរសំណួរគន្លឹះ',
      appearance: 'យុវតីខ្មែរអាយុ ២៤ ឆ្នាំ ចងសក់ទៅក្រោយ ទឹកមុខឆ្លាតវៃ សម្បុរស្រស់ថ្លា',
      outfit: 'អាវសាច់ក្រណាត់ដៃវែងពណ៌លឿងខ្ចី សំពត់ពណ៌ខ្មៅរៀបរយ',
      personality: 'ឧស្សាហ៍ព្យាយាម សម្បូរគំនិតច្នៃប្រឌិត និងយកចិត្តទុកដាក់',
      aiCharacterImagePromptEn: `Authentic Cambodian (Khmer) 2D cartoon character design turnaround reference sheet of Kanya, a bright 24-year-old Cambodian female researcher with ponytail hair, warm Southeast Asian skin tone, wearing a pastel yellow blouse and dark pleated skirt. Full-body front view, 3/4 view, and 3 facial expressions (curious, presenting, satisfied). ${styleObj.promptAnchor}.`,
    },
  ];

  if (presenterObj.id === 'duo') {
    characters = characters.slice(0, 2);
  } else if (presenterObj.id === 'solo') {
    characters = [characters[0]];
  }

  const scenes: StoryboardScene[] = Array.from({ length: count }, (_, idx) => {
    const num = idx + 1;
    let section: StoryboardScene['section'] = 'MAIN_STORY';
    let sceneTitle = `សកម្មភាព និងការអនុវត្តផ្នែកទី ${num - 2}`;
    let narrator = `សរសេរអត្ថបទអ្នកនិទានពេញលេញសម្រាប់ឈុតទី ${num} ទាក់ទងនឹង «${topicText}» នៅទីនេះ។`;
    let character = 'សុខា & ក្រុមការងារ';
    let action = 'សមាជិកក្រុមកំពុងពិភាក្សា លើកដៃចង្អុលបង្ហាញក្រាហ្វិកលើក្តារខៀនយ៉ាងសកម្ម មិនឈរស្ងៀម';
    let dialogue = '';

    if (num <= 2) {
      section = 'INTRODUCTION';
      sceneTitle = num === 1 ? 'សំណួរចាប់ផ្ដើម & បញ្ហាជាក់ស្តែង' : 'ក្រុមការងារជួបជុំណែនាំប្រធានបទ';
      narrator =
        num === 1
          ? `តើអ្នកធ្លាប់ឆ្ងល់ទេអំពី «${topicText}»? នៅក្នុងវីដេអូនេះ ក្រុមការងារយើងនឹងនាំអ្នកទាំងអស់គ្នាទៅស្វែងយល់តាមរយៈសកម្មភាពជាក់ស្តែង។`
          : `មនុស្សជាច្រើនតែងជួបបញ្ហានេះ ដូច្នេះថ្ងៃនេះក្រុមយើងបានរៀបចំវិធីសាស្ត្រងាយៗដើម្បីអនុវត្តជាមួយគ្នា។`;
      character = 'សុខា & តារា';
      action = 'សុខា និងតារាកំពុងដើរយ៉ាងស្វាហាប់តាមផ្លូវក្នុងទីក្រុងភ្នំពេញ ទឹកមុខរស់រវើក ចង្អុលបង្ហាញស្ថានភាពជុំវិញ';
      dialogue = 'សុខា៖ «តោះតារា! យើងទៅពិនិត្យមើលបញ្ហានេះជាក់ស្តែងទាំងអស់គ្នា!»';
    } else if (num === count - 2) {
      section = 'IMPORTANT_LESSONS';
      sceneTitle = 'សង្ខេបមេរៀន និងដំណោះស្រាយជាក់ស្តែង';
      narrator = `សង្ខេបមកវិញ មេរៀនសំខាន់បំផុតពី «${topicText}» គឺការយកទៅអនុវត្តជាក់ស្ដែងជាមួយក្រុមការងារ និងជីវិតរស់នៅ។`;
      character = 'ក្រុមការងារទាំងមូល (សុខា, តារា, កញ្ញា)';
      action = 'តួអង្គទាំង ៣ នាក់ប្រជុំជុំវិញតុការងារ កញ្ញាចង្អុលបង្ហាញរបាយការណ៍ តារាសរសេរលើក្តារខៀន សុខាងក់ក្បាលគាំទ្រ';
      dialogue = 'កញ្ញា៖ «បើយើងអនុវត្តតាមជំហានទាំងនេះ លទ្ធផលនឹងកើនឡើងជាក់ជាមិនខាន!»';
    } else if (num >= count - 1) {
      section = 'CONCLUSION';
      sceneTitle = num === count ? 'អញ្ជើញ Like, Share និង Subscribe' : 'សារដ៏មានអត្ថន័យចុងបញ្ចប់';
      narrator =
        num === count
          ? 'សូមអរគុណសម្រាប់ការទស្សនា! កុំភ្លេចចុច Like, Share និង Subscribe ដើម្បីទទួលបានវីដេអូចំណេះដឹងថ្មីៗពីក្រុមយើងខ្ញុំ!'
          : 'សូមចងចាំថា ការផ្លាស់ប្តូរដ៏អស្ចារ្យ តែងតែចាប់ផ្ដើមពីការសហការ និងជំហានដំបូងដែលអ្នកធ្វើនៅថ្ងៃនេះ។';
      character = 'ក្រុមការងារទាំងមូល';
      action = 'សមាជិកក្រុមទាំងអស់ឈររួមគ្នាដោយទឹកមុខរីករាយ ញញឹម និងលើកដៃស្វាគមន៍អ្នកទស្សនា ក្រោមពន្លឺថ្ងៃកក់ក្តៅ';
      dialogue = 'សុខា & ក្រុមការងារ៖ «កុំភ្លេចចុច Subscribe ជួបគ្នានៅវីដេអូបន្ទាប់!»';
    }

    return {
      sceneNumber: num,
      section,
      sceneTitle,
      durationSeconds: 8,
      visualDescription: `ប្លង់សកម្មភាពរស់រវើកបែបខ្មែរ៖ ${action} ក្នុងបរិយាកាសកម្ពុជាពិតប្រាកដ`,
      character,
      characterAction: action,
      narratorScriptKh: narrator,
      characterDialogue: dialogue,
      onScreenText: sceneTitle,
      aiImagePromptEn: `Authentic Cambodian educational storytelling animation scene of ${character}, actively engaged in: ${action}, topic: "${topicText}", vibrant authentic Cambodian setting, expressive body language and teamwork, natural warm cinematic lighting, ${styleObj.promptAnchor}.`,
      aiVideoPromptEn: `Smooth dynamic 2D animation motion of ${character} actively moving and collaborating in authentic Cambodian setting, expressive gestures, camera slowly tracking, clear Khmer voiceover.`,
      cameraMovement: num === 1 ? 'Dynamic track shot following characters' : 'Medium two-shot with subtle push-in',
      bgmAndSfx: 'ភ្លេង Documentary ស្រទន់កក់ក្ដៅ + សំឡេងបរិយាកាសធម្មជាតិ',
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
    presenterSetup: presenterObj.id,
    presenterSetupLabel: presenterObj.labelKh,
    actionDynamic: actionObj.id,
    actionDynamicLabel: actionObj.labelKh,
    subtitleLanguage: 'Khmer',
    audience: 'General Audience',
    isFictionalNote:
      'គម្រោងព្រាង (Offline Draft) — សូមកែសម្រួល និងបញ្ជាក់ប្រភពព័ត៌មានបន្ថែមមុនពេលថតសំឡេង។',
    characters,
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
      visualConcept: `បង្ហាញក្រុមតួអង្គខ្មែរមានទឹកមុខចាប់អារម្មណ៍ជាមួយទេសភាពកម្ពុជា និងនិមិត្តសញ្ញានៃ «${topicText}» ក្រោមពន្លឺពណ៌មាសកក់ក្ដៅ។`,
      aiThumbnailPromptEn: `Eye-catching authentic Cambodian YouTube thumbnail for "${topicText}", expressive Cambodian cartoon characters in lively collaboration, pointing at glowing educational visual metaphors with Cambodian sugar palm trees and Phnom Penh skyline in the background, warm amber and teal contrast, ${styleObj.promptAnchor}.`,
    },
  };
}
