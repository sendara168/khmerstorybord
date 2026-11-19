import type {
  CharacterProfile,
  StoryboardScene,
  StorySection,
} from '../types/storyboard';

export interface NarrativeContext {
  topic: string;
  categoryLabelKh?: string;
  targetScenes: number;
  characters?: CharacterProfile[];
  animationStyleLabel?: string;
  styleAnchor?: string;
}

export interface StoryMilestonePlan {
  targetScenes: number;
  introCount: number;
  mainCount: number;
  lessonsCount: number;
  conclusionCount: number;
  mainEnd: number;
  lessonsEnd: number;
}

export function computeStoryMilestones(targetCount: number): StoryMilestonePlan {
  const targetScenes = Math.max(4, Math.min(120, Number(targetCount) || 24));
  const introCount = Math.max(1, Math.min(4, Math.round(targetScenes * 0.12)));
  const conclusionCount = Math.max(1, Math.min(4, Math.round(targetScenes * 0.10)));
  const lessonsCount = Math.max(1, Math.min(6, Math.round(targetScenes * 0.18)));
  const mainCount = targetScenes - introCount - lessonsCount - conclusionCount;
  const mainEnd = introCount + mainCount;
  const lessonsEnd = mainEnd + lessonsCount;

  return {
    targetScenes,
    introCount,
    mainCount,
    lessonsCount,
    conclusionCount,
    mainEnd,
    lessonsEnd,
  };
}

interface NarrativeStepTemplate {
  section: StorySection;
  titleKh: string;
  bridgeStarter: string;
  narratorBody: string;
  actionDesc: string;
  dialogueKh: string;
  cameraMovement: string;
  bgm: string;
}

const EXTENDED_STORY_STEPS: NarrativeStepTemplate[] = [
  {
    section: 'MAIN_STORY',
    titleKh: 'ស្វែងយល់ពីឫសគល់ & មូលហេតុពិតប្រាកដ',
    bridgeStarter: 'ដើម្បីឆ្លើយតបនឹងសំណួរនេះ ជំហានដំបូងបំផុតគឺ',
    narratorBody: 'ការស្វែងយល់ពីឫសគល់ពិតប្រាកដនៃបញ្ហា។ មូលហេតុចម្បងដែលមនុស្សភាគច្រើនតែងជួបការលំបាក គឺដោយសារកង្វះប្រព័ន្ធតាមដានច្បាស់លាស់ និងការខ្វះវិធីសាស្ត្រវិទ្យាសាស្ត្រក្នុងការអនុវត្ត។',
    actionDesc: 'តួអង្គអង្គុយជុំវិញតុការងារ យកឯកសារស្រាវជ្រាវ និងកត់ត្រាមូលហេតុចម្បងលើសៀវភៅការងារយ៉ាងយកចិត្តទុកដាក់',
    dialogueKh: '«បើយើងមិនយល់ពីឫសគល់បញ្ហាទេ យើងនឹងពិបាករកដំណោះស្រាយដែលត្រឹមត្រូវណាស់!»',
    cameraMovement: 'Slow push in on the workspace desk',
    bgm: 'Warm documentary piano & acoustic guitar',
  },
  {
    section: 'MAIN_STORY',
    titleKh: 'ក្បួនអនុវត្តជាក់ស្តែងទី ១៖ ការរៀបចំផែនការ & បែងចែកអាទិភាព',
    bridgeStarter: 'បន្ទាប់ពីយើងបានយល់ពីឫសគល់ហើយ ជំហានជាក់ស្តែងទីមួយគឺ',
    narratorBody: 'ការរៀបចំក្បួនអនុវត្តសាមញ្ញៗដែលអាចធ្វើបានប្រចាំថ្ងៃ។ តាមរយៈការបែងចែកគោលដៅធំៗមកជាជំហានតូចៗ យើងអាចបង្កើតទម្លាប់ថ្មីប្រកបដោយទំនុកចិត្ត និងភាពងាយស្រួល។',
    actionDesc: 'តួអង្គចង្អុលបង្ហាញគំនូសបំព្រួញលើក្តារខៀន ពន្យល់ពីជំហានទីមួយដល់សមាជិកក្រុមដោយទឹកមុខស្វាហាប់',
    dialogueKh: '«ជំហានដំបូងនេះងាយស្រួលអនុវត្តណាស់ ហើយចំណាយពេលត្រឹមតែប៉ុន្មាននាទីប៉ុណ្ណោះក្នុងមួយថ្ងៃ!»',
    cameraMovement: 'Dynamic tracking shot along the whiteboard',
    bgm: 'Inspiring rhythmic documentary music',
  },
  {
    section: 'MAIN_STORY',
    titleKh: 'ការសាកល្បងអនុវត្តផ្ទាល់ដៃ & ឧទាហរណ៍ជាក់ស្ដែងក្នុងសង្គមខ្មែរ',
    bridgeStarter: 'ប៉ុន្តែ តើចុះបើជួបឧបសគ្គក្នុងពេលអនុវត្ត? ត្រង់ចំណុចនេះហើយដែល',
    narratorBody: 'ក្រុមការងារយើងបានសាកល្បងចុះអនុវត្តផ្ទាល់ដៃ ជាមួយឧទាហរណ៍ជាក់ស្ដែងក្នុងជីវភាពរស់នៅ ដើម្បីផ្ទៀងផ្ទាត់ប្រសិទ្ធភាព និងបង្ហាញពីដំណោះស្រាយពិតៗជូនទស្សនិកជន។',
    actionDesc: 'ក្រុមការងារចុះទៅកាន់ទីតាំងជាក់ស្តែង (ហាងទំនិញ ទីផ្សារ ឬកន្លែងការងារ) កំពុងកាន់ឧបករណ៍ធ្វើតេស្ត និងជជែកជាមួយមនុស្សជុំវិញ',
    dialogueKh: '«តោះយើងសាកល្បងវាផ្ទាល់តែម្តង ដើម្បីដឹងថាតើវិធីសាស្ត្រនេះដំណើរការល្អកម្រិតណា!»',
    cameraMovement: 'Smooth handheld follow camera',
    bgm: 'Lively acoustic beats & ambient market sound',
  },
  {
    section: 'MAIN_STORY',
    titleKh: 'ក្បួនអនុវត្តជាក់ស្តែងទី ២៖ ការបង្កើតទម្លាប់ & ប្រព័ន្ធតាមដាន',
    bridgeStarter: 'តភ្ជាប់ពីជំហានមុននេះ កត្តាសំខាន់ទីពីរដែលមិនអាចខ្វះបានគឺ',
    narratorBody: 'ការបង្កើតប្រព័ន្ធតាមដាន និងវិន័យជាប់លាប់។ នៅពេលដែលយើងមានឧបករណ៍ត្រួតពិនិត្យច្បាស់លាស់ យើងនឹងដឹងពីចំណុចខ្វះខាត និងអាចកែតម្រូវបានទាន់ពេលវេលា។',
    actionDesc: 'តួអង្គបង្ហាញអេក្រង់កុំព្យូទ័រយួរដៃដែលមានក្រាហ្វិក និងតារាងទិន្នន័យច្បាស់លាស់ សមាជិកទាំងអស់ផ្ទៀងផ្ទាត់ដោយស្នាមញញឹម',
    dialogueKh: '«មើលចុះ! នៅពេលយើងតាមដានទិន្នន័យទៀងទាត់ យើងកាត់បន្ថយកំហុសបានច្រើនមែនទែន!»',
    cameraMovement: 'Over-the-shoulder medium shot',
    bgm: 'Gentle positive documentary synth',
  },
  {
    section: 'MAIN_STORY',
    titleKh: 'ការដោះស្រាយឧបសគ្គ & ការកែសម្រួលវិធីសាស្ត្រ',
    bridgeStarter: 'ក្រៅពីវិធីសាស្ត្រខាងលើ បញ្ហាប្រឈមដែលមនុស្សជាច្រើនតែងបោះបង់ពាក់កណ្តាលទីគឺ',
    narratorBody: 'កង្វះការលើកទឹកចិត្ត និងការភ័យខ្លាចការបរាជ័យ។ ដូច្នេះ គន្លឹះដោះស្រាយគឺការបង្កើតបរិយាកាសគាំទ្រ និងការអបអរសាទរជ័យជម្នះតូចៗជារៀងរាល់សប្តាហ៍។',
    actionDesc: 'សមាជិកក្រុមទាំងអស់អង្គុយជុំវិញតុ លើកកែវទឹកតែជជែកគ្នាដោយរីករាយ និងចែករំលែកអារម្មណ៍វិជ្ជមាន',
    dialogueKh: '«ការលើកទឹកចិត្តគ្នាទៅវិញទៅមក ជួយឱ្យយើងមានកម្លាំងចិត្តបន្តទៅមុខឥតឈប់ឈរ!»',
    cameraMovement: 'Warm orbital slow pan around the group',
    bgm: 'Uplifting warm piano',
  },
  {
    section: 'MAIN_STORY',
    titleKh: 'ការវាស់វែងលទ្ធផល & ការប្រៀបធៀបមុននិងក្រោយ',
    bridgeStarter: 'នៅពេលដែលយើងអនុវត្តចំណុចទាំងនេះបានជោគជ័យ លទ្ធផលវិជ្ជមានគឺ',
    narratorBody: 'ការផ្លាស់ប្តូរតូចៗប្រចាំថ្ងៃ បានប្រែក្លាយទៅជាសមិទ្ធផលធំធេង។ ការប្រៀបធៀបទិន្នន័យមុន និងក្រោយពេលអនុវត្ត បានបង្ហាញយ៉ាងច្បាស់ពីការរីកចម្រើនគួរឱ្យកត់សម្គាល់។',
    actionDesc: 'តួអង្គលើករបាយការណ៍លទ្ធផលបង្ហាញក្រុមការងារ គ្រប់គ្នាទះដៃអបអរសាទរ និងញញឹមដោយមោទនភាព',
    dialogueKh: '«លទ្ធផលជាក់ស្តែងបានបញ្ជាក់ហើយថា វិធីសាស្ត្រនេះពិតជាមានប្រសិទ្ធភាពខ្ពស់!»',
    cameraMovement: 'Wide establishing pan to medium focus',
    bgm: 'Triumphant gentle crescendo',
  },
  {
    section: 'MAIN_STORY',
    titleKh: 'ក្បួនអនុវត្តជាក់ស្តែងទី ៣៖ ការបង្កើនប្រសិទ្ធភាពទ្វេដង',
    bridgeStarter: 'តើធ្វើដូចម្តេចដើម្បីពង្រីកលទ្ធផលឱ្យកាន់តែធំធេង? ត្រង់ចំណុចនេះ',
    narratorBody: 'យើងត្រូវស្វែងយល់ពីក្បួន 80/20 ដោយផ្តោតលើសកម្មភាពសំខាន់ ២០% ដែលបង្កើតផល ៨០%។ ការមិនខ្ជះខ្ជាយថាមពលលើរឿងមិនចាំបាច់ ជាគន្លឹះនៃភាពរហ័សរហួន។',
    actionDesc: 'តួអង្គរៀបចំឯកសារ និងប្រើថេប្លេតកត់ត្រាការងារសំខាន់ៗ ដោយទឹកមុខស្ងប់ស្ងាត់ និងមានវិន័យខ្ពស់',
    dialogueKh: '«ផ្តោតតែលើអ្វីដែលសំខាន់បំផុត នោះយើងនឹងចំណេញទាំងពេលវេលា និងកម្លាំង!»',
    cameraMovement: 'Side profile sliding track shot',
    bgm: 'Focused light electronic beat',
  },
  {
    section: 'MAIN_STORY',
    titleKh: 'ការគ្រប់គ្រងហានិភ័យ & ការពារកំហុសដែលកើតឡើងដដែលៗ',
    bridgeStarter: 'លើសពីនេះទៅទៀត ចំណុចដែលត្រូវប្រុងប្រយ័ត្នជាប្រចាំគឺ',
    narratorBody: 'ការការពារកុំឱ្យធ្លាក់ចូលទៅក្នុងទម្លាប់ចាស់ដែលបង្កគ្រោះថ្នាក់។ ការរៀបចំផែនការបម្រុង (Plan B) ជួយឱ្យយើងមិនភ័យស្លន់ស្លោនៅពេលមានការប្រែប្រួលជាយថាហេតុ។',
    actionDesc: 'ក្រុមការងារកំពុងគូសសញ្ញាប្រុងប្រយ័ត្ន និងជម្រើសដោះស្រាយលើតារាងផែនទីការងារ',
    dialogueKh: '«ការត្រៀមខ្លួនទុកជាមុន ជួយឱ្យយើងឆ្លងកាត់ឧបសគ្គដោយរលូនជានិច្ច!»',
    cameraMovement: 'Top-down table angle tilting up',
    bgm: 'Subtle investigative pulse',
  },
  {
    section: 'MAIN_STORY',
    titleKh: 'ការកសាងបណ្ដាញគាំទ្រ & កម្លាំងសាមគ្គី',
    bridgeStarter: 'មេរៀនមួយទៀតដែលមិនអាចមើលរំលងបាន គឺសារៈសំខាន់នៃ',
    narratorBody: 'ការសហការ និងការចែករំលែកចំណេះដឹង។ គ្មាននរណាម្នាក់អាចជោគជ័យតែឯងបានយូរអង្វែងឡើយ—កម្លាំងសាមគ្គីភាពក្នុងគ្រួសារ និងក្រុមការងារ ជាថាមពលរុញច្រានទៅមុខ។',
    actionDesc: 'សមាជិកក្រុមចាប់ដៃគ្នា និងជួយលើកទំនិញ ឬឧបករណ៍សម្រួលដល់គ្នាទៅវិញទៅមកដោយក្តីស្រឡាញ់',
    dialogueKh: '«រួមគ្នា យើងអាចសម្រេចបានច្រើនជាងការធ្វើតែម្នាក់ឯងឆ្ងាយណាស់!»',
    cameraMovement: 'Medium two-shot tracking camera',
    bgm: 'Heartwarming strings & acoustic guitar',
  },
  {
    section: 'MAIN_STORY',
    titleKh: 'ការអនុវត្តជាប់លាប់ដើម្បីនិរន្តរភាពយូរអង្វែង',
    bridgeStarter: 'នៅពេលដែលយើងបន្តអនុវត្តជាប្រចាំថ្ងៃ អត្ថប្រយោជន៍ដ៏ធំបំផុតគឺ',
    narratorBody: 'ការផ្លាស់ប្តូរពីការបង្ខំចិត្ត មកជាទម្លាប់ធម្មជាតិដែលកើតចេញពីស្វ័យប្រវត្តិ។ ភាពខ្ជាប់ខ្ជួននេះហើយដែលបង្កើតឱ្យមានឯករាជ្យភាព និងសន្តិភាពក្នុងចិត្ត។',
    actionDesc: 'តួអង្គដើរចេញពីកន្លែងធ្វើការនៅពេលរសៀល ទឹកមុខស្រស់ស្រាយ និងមានទំនុកចិត្តពេញលេញលើអនាគត',
    dialogueKh: '«ធ្វើតិចៗតែរាល់ថ្ងៃ ល្អជាងធ្វើច្រើនតែឈប់ពាក់កណ្តាលទី!»',
    cameraMovement: 'Cinematic wide outdoor tracking shot',
    bgm: 'Calm reflective melodic background',
  },
];

const LESSON_TEMPLATES: NarrativeStepTemplate[] = [
  {
    section: 'IMPORTANT_LESSONS',
    titleKh: 'សង្ខេបមេរៀនសំខាន់ៗ & ក្បួនអនុវត្តមាស',
    bridgeStarter: 'សង្ខេបជារួម មកដល់ចំណុចនេះ មេរៀនសំខាន់បំផុតគឺ',
    narratorBody: 'ការរួមបញ្ចូលគ្នារវាងចំណេះដឹងទ្រឹស្តី និងការចុះអនុវត្តជាក់ស្តែង។ កុំរង់ចាំឱ្យគ្រប់យ៉ាងល្អឥតខ្ចោះទើបចាប់ផ្ដើម—ការចាប់ផ្ដើមបោះជំហានតូចៗនៅថ្ងៃនេះ ជាគ្រឹះនៃជោគជ័យថ្ងៃស្អែក។',
    actionDesc: 'តួអង្គទាំង ៣ ប្រជុំជុំវិញតុការងារ កញ្ញាចង្អុលបង្ហាញរបាយការណ៍ តារាសរសេរលើក្តារខៀន សុខាងក់ក្បាលគាំទ្រ',
    dialogueKh: '«បើយើងអនុវត្តតាមជំហានទាំងនេះ លទ្ធផលនឹងកើនឡើងជាក់ជាមិនខាន!»',
    cameraMovement: 'Smooth dolly in towards team center',
    bgm: 'Warm inspiring documentary chords',
  },
  {
    section: 'IMPORTANT_LESSONS',
    titleKh: 'ការផ្លាស់ប្តូរផ្នត់គំនិត (Mindset Shift) ដើម្បីជោគជ័យ',
    bridgeStarter: 'ក្រៅពីក្បួនអនុវត្តខាងលើ អ្វីដែលត្រូវផ្លាស់ប្តូរជាបន្ទាន់គឺ',
    narratorBody: 'ផ្នត់គំនិតដែលគិតថាខ្លួនឯងធ្វើមិនបាន។ គ្រប់ការបរាជ័យកន្លងមក គឺជាបទពិសោធន៍ដ៏ថ្លៃថ្លាសម្រាប់កែខៃ និងអភិវឌ្ឍសមត្ថភាពខ្លួនឯងឱ្យកាន់តែរឹងមាំ។',
    actionDesc: 'តួអង្គឈរមើលទេសភាពទីក្រុង ឬវាលស្រែពេលព្រលប់ ទឹកមុខឆ្លុះបញ្ចាំងពីការតស៊ូ និងការយល់ដឹងស៊ីជម្រៅ',
    dialogueKh: '«កុំខ្លាចការចាប់ផ្ដើមថ្មី ព្រោះពេលនេះយើងចាប់ផ្ដើមដោយមានបទពិសោធន៍!»',
    cameraMovement: 'Slow dramatic tilt up from character to sky',
    bgm: 'Deep thoughtful cello & piano',
  },
  {
    section: 'IMPORTANT_LESSONS',
    titleKh: 'ក្បួនរក្សាវិន័យ & ភាពខ្ជាប់ខ្ជួនយូរអង្វែង',
    bridgeStarter: 'មេរៀនមាសទីបីដែលអ្នកត្រូវចងចាំជានិច្ច គឺ',
    narratorBody: 'វិន័យផ្ទាល់ខ្លួនសំខាន់ជាងការលើកទឹកចិត្តបណ្ដោះអាសន្ន។ នៅពេលដែលអារម្មណ៍ខ្ជិលច្រអូសកើតឡើង វិន័យនឹងរុញច្រានយើងឱ្យក្រោកឡើងធ្វើការងារតាមកាលវិភាគ។',
    actionDesc: 'តួអង្គបង្ហាញសៀវភៅកំណត់ហេតុ និងផ្ទៀងផ្ទាត់បញ្ជីកិច្ចការប្រចាំថ្ងៃដោយការពេញចិត្ត',
    dialogueKh: '«វិន័យគឺជាស្ពានចម្លងពីក្ដីស្រមៃ ទៅកាន់ការពិតជាក់ស្តែង!»',
    cameraMovement: 'Tight focus on journal page then pulling out to smile',
    bgm: 'Steadily building inspiring rhythm',
  },
];

const CONCLUSION_TEMPLATES: NarrativeStepTemplate[] = [
  {
    section: 'CONCLUSION',
    titleKh: 'សារដាស់តឿនចិត្ត & ជំហានបន្តទៅមុខ',
    bridgeStarter: 'ជាចុងក្រោយ សូមចងចាំថា គ្រប់ការផ្លាស់ប្តូរដ៏អស្ចារ្យតែងតែ',
    narratorBody: 'ចាប់ផ្ដើមពីការសម្រេចចិត្តដ៏ត្រឹមត្រូវមួយ និងការតាំងចិត្តធ្វើឱ្យសម្រេច។ មិនថាអ្នកស្ថិតក្នុងស្ថានភាពលំបាកយ៉ាងណាក៏ដោយ អ្នកតែងតែមានលទ្ធភាពបង្កើតលទ្ធផលថ្មីបានជានិច្ច។',
    actionDesc: 'តួអង្គទាំងអស់ដើរចេញមកខាងមុខដោយស្នាមញញឹមរាក់ទាក់ និងកាយវិការស្វាហាប់ប្រកបដោយក្តីសង្ឃឹម',
    dialogueKh: '«សូមចាប់ផ្ដើមអនុវត្តនៅថ្ងៃនេះ ទាំងអស់គ្នា!»',
    cameraMovement: 'Heroic upward angle tracking shot',
    bgm: 'Triumphant emotional conclusion melody',
  },
  {
    section: 'CONCLUSION',
    titleKh: 'ការថ្លែងអំណរគុណ & បញ្ចប់សាច់រឿងពេញលេញ (Outro)',
    bridgeStarter: 'សរុបជារួម មកដល់ចំណុចបញ្ចប់នេះ ក្រុមការងារយើងខ្ញុំសង្ឃឹមថា',
    narratorBody: 'ចំណេះដឹង និងបទពិសោធន៍ទាំងអស់នេះ នឹងក្លាយជាពន្លឺបំភ្លឺផ្លូវដ៏មានប្រយោជន៍។ សូមចុច Like, Share និង Subscribe ដើម្បីទទួលបានវីដេអូអប់រំល្អៗជាបន្តបន្ទាប់ទៀត។ សូមអរគុណ!',
    actionDesc: 'តួអង្គលើកដៃសំពះតាមប្រពៃណីខ្មែរយ៉ាងរម្យទម និងញញឹមផ្ញើក្តីស្រឡាញ់ដល់ទស្សនិកជនគ្រប់គ្នា',
    dialogueKh: '«សូមអរគុណសម្រាប់ការទស្សនា និងសូមជួបគ្នាក្នុងវីដេអូក្រោយៗទៀត!»',
    cameraMovement: 'Gentle slow zoom out showing entire friendly group',
    bgm: 'Warm concluding signature outro theme',
  },
];

export function ensureCompleteNarrativeScenes(
  rawScenes: StoryboardScene[],
  ctx: NarrativeContext
): StoryboardScene[] {
  const targetCount = Math.max(4, Math.min(120, Number(ctx.targetScenes) || 24));
  const topicText = (ctx.topic || 'ប្រធានបទអប់រំ').trim();
  const styleAnchor =
    ctx.styleAnchor ||
    ctx.animationStyleLabel ||
    '2D Cartoon Cambodian Educational Animation, authentic Cambodian setting, clean warm lighting, 16:9';

  // Get primary character names for natural Cambodian action
  const chars = ctx.characters && ctx.characters.length > 0 ? ctx.characters : [];
  const charNames =
    chars.length > 0
      ? chars.map((c) => c.name.split('(')[0].trim()).join(', ')
      : 'សុខា, តារា & កញ្ញា';
  const leadChar = chars[0]?.name ? chars[0].name.split('(')[0].trim() : 'សុខា';

  // If already at or above target, ensure sequential numbering and proper narrative ending
  if (rawScenes.length >= targetCount) {
    const adjusted = rawScenes.map((s, idx) => ({
      ...s,
      sceneNumber: idx + 1,
      section: s.section || (idx === 0 ? 'INTRODUCTION' : idx >= rawScenes.length - 2 ? 'CONCLUSION' : 'MAIN_STORY'),
      durationSeconds: Math.max(4, Math.min(20, Number(s.durationSeconds) || 8)),
    }));

    // Guarantee that the last scene is a CONCLUSION with closure
    const lastIdx = adjusted.length - 1;
    if (adjusted[lastIdx].section !== 'CONCLUSION') {
      adjusted[lastIdx].section = 'CONCLUSION';
      if (!adjusted[lastIdx].narratorScriptKh.includes('សូមអរគុណ') && !adjusted[lastIdx].narratorScriptKh.includes('Subscribe')) {
        adjusted[lastIdx].narratorScriptKh += ' សរុបជារួម មកដល់ចំណុចបញ្ចប់នេះ សូមអរគុណសម្រាប់ការទស្សនា និងសូមចុច Like, Share និង Subscribe ដើម្បីទទួលបានចំណេះដឹងថ្មីៗ!';
      }
    }
    return adjusted;
  }

  // If rawScenes is fewer than targetCount, we must seamlessly bridge & expand to targetCount!
  const milestones = computeStoryMilestones(targetCount);

  // Separate existing scenes by type
  const introScenes: StoryboardScene[] = [];
  const mainScenes: StoryboardScene[] = [];
  const lessonScenes: StoryboardScene[] = [];
  const conclusionScenes: StoryboardScene[] = [];

  for (const s of rawScenes) {
    const sec = String(s.section || '').toUpperCase();
    if (sec.includes('INTRO')) introScenes.push(s);
    else if (sec.includes('LESSON')) lessonScenes.push(s);
    else if (sec.includes('CONCLU') || sec.includes('OUTRO')) conclusionScenes.push(s);
    else mainScenes.push(s);
  }

  const resultScenes: StoryboardScene[] = [];

  // Helper to build a scene from template or custom parameters
  const createGeneratedScene = (
    num: number,
    template: NarrativeStepTemplate,
    customTitle?: string
  ): StoryboardScene => {
    const title = customTitle || `${template.titleKh} (${num})`;
    const narrator = `${template.bridgeStarter} «${topicText}» ${template.narratorBody}`;
    const action = `${charNames} ${template.actionDesc}`;
    const dialogue = `${leadChar}៖ ${template.dialogueKh}`;

    return {
      sceneNumber: num,
      section: template.section,
      sceneTitle: title,
      durationSeconds: 8,
      visualDescription: `ប្លង់សកម្មភាពរស់រវើកក្នុងបរិយាកាសកម្ពុជា៖ ${action}។ បរិយាកាសពោរពេញដោយថាមពលវិជ្ជមាន និងការសហការរវាងតួអង្គខ្មែរ។`,
      character: charNames,
      characterAction: action,
      narratorScriptKh: narrator,
      characterDialogue: dialogue,
      onScreenText: title,
      aiImagePromptEn: `Authentic Cambodian 2D illustration showing ${template.actionDesc}, featuring Cambodian characters (${charNames}), authentic Cambodian urban or rural background, active collaborative poses. ${styleAnchor}.`,
      aiVideoPromptEn: `Visual Action: ${charNames} actively engaged in ${template.actionDesc}, smooth natural body language and gestures illustrating "${topicText}". Silent cinematic action, characters do not speak, no dialogue or lip-sync, smooth 24fps motion for external voiceover overlay, 16:9, no floating text.`,
      cameraMovement: template.cameraMovement,
      bgmAndSfx: template.bgm,
    };
  };

  // 1. Fill INTRODUCTION (Scenes 1 to milestones.introCount)
  for (let i = 0; i < milestones.introCount; i++) {
    const sceneNum = i + 1;
    if (introScenes[i]) {
      resultScenes.push({
        ...introScenes[i],
        sceneNumber: sceneNum,
        section: 'INTRODUCTION',
      });
    } else {
      const introTmpl: NarrativeStepTemplate = {
        section: 'INTRODUCTION',
        titleKh: i === 0 ? 'សំណួរចាប់ផ្ដើម & បញ្ហាជាក់ស្តែង (The Hook)' : 'ផលប៉ះពាល់ & ណែនាំដំណោះស្រាយ',
        bridgeStarter: i === 0 ? 'តើអ្នកធ្លាប់ឆ្ងល់ទេថា' : 'ដើម្បីយល់ឱ្យកាន់តែច្បាស់ ប្រសិនបើយើងមិនយកចិត្តទុកដាក់លើ',
        narratorBody:
          i === 0
            ? `ហេតុអ្វីបានជាមនុស្សជាច្រើនតែងជួបការលំបាកជាមួយ «${topicText}»? នៅក្នុងវីដេអូនេះ ក្រុមការងារយើងនឹងនាំអ្នកទាំងអស់គ្នាទៅស្វែងយល់ពីឫសគល់នៃបញ្ហា និងវិធីសាស្ត្រអនុវត្តជាក់ស្តែងដែលផ្លាស់ប្តូរលទ្ធផលពិតៗ។`
            : `បញ្ហានេះទេ វានឹងជះឥទ្ធិពលអវិជ្ជមានដល់ពេលវេលា និងការរីកចម្រើន។ ដូច្នេះ ក្រុមការងារយើងបានស្រាវជ្រាវ និងចងក្រងនូវដំណោះស្រាយជាប្រព័ន្ធ ដើម្បីចែករំលែកជាមួយអ្នកទាំងអស់គ្នា។`,
        actionDesc:
          i === 0
            ? 'ដើរយ៉ាងស្វាហាប់តាមផ្លូវក្នុងទីក្រុងភ្នំពេញ ទឹកមុខរស់រវើក ចង្អុលបង្ហាញស្ថានភាពជុំវិញ'
            : 'កាន់ថេប្លេតបង្ហាញក្រាហ្វិកបញ្ហា ដើរចូលមកកាន់បន្ទប់ប្រជុំដោយទឹកមុខផ្តោតអារម្មណ៍',
        dialogueKh: i === 0 ? '«តោះយើងទៅពិនិត្យមើលបញ្ហានេះជាក់ស្តែងទាំងអស់គ្នា!»' : '«មើលទិន្នន័យនេះចុះ! បើយើងមិនកែទម្លាប់នេះទេ បញ្ហានឹងកាន់តែរីកធំឡើង!»',
        cameraMovement: i === 0 ? 'Dynamic wide tracking shot' : 'Medium two-shot tracking into office',
        bgm: 'Warm acoustic documentary introduction',
      };
      resultScenes.push(createGeneratedScene(sceneNum, introTmpl, introTmpl.titleKh));
    }
  }

  // 2. Fill MAIN STORY (milestones.introCount + 1 to milestones.mainEnd)
  let existingMainIdx = 0;
  for (let num = milestones.introCount + 1; num <= milestones.mainEnd; num++) {
    if (existingMainIdx < mainScenes.length) {
      resultScenes.push({
        ...mainScenes[existingMainIdx],
        sceneNumber: num,
        section: 'MAIN_STORY',
      });
      existingMainIdx++;
    } else {
      const tmplIdx = (num - milestones.introCount - 1) % EXTENDED_STORY_STEPS.length;
      const tmpl = EXTENDED_STORY_STEPS[tmplIdx];
      const cycle = Math.floor((num - milestones.introCount - 1) / EXTENDED_STORY_STEPS.length) + 1;
      const title = cycle > 1 ? `${tmpl.titleKh} (វគ្គទី ${cycle})` : tmpl.titleKh;
      resultScenes.push(createGeneratedScene(num, tmpl, title));
    }
  }

  // 3. Fill IMPORTANT LESSONS (milestones.mainEnd + 1 to milestones.lessonsEnd)
  let existingLessonIdx = 0;
  for (let num = milestones.mainEnd + 1; num <= milestones.lessonsEnd; num++) {
    if (existingLessonIdx < lessonScenes.length) {
      resultScenes.push({
        ...lessonScenes[existingLessonIdx],
        sceneNumber: num,
        section: 'IMPORTANT_LESSONS',
      });
      existingLessonIdx++;
    } else {
      const tmplIdx = (num - milestones.mainEnd - 1) % LESSON_TEMPLATES.length;
      const tmpl = LESSON_TEMPLATES[tmplIdx];
      resultScenes.push(createGeneratedScene(num, tmpl, tmpl.titleKh));
    }
  }

  // 4. Fill CONCLUSION (milestones.lessonsEnd + 1 to targetCount)
  let existingConcluIdx = 0;
  for (let num = milestones.lessonsEnd + 1; num <= targetCount; num++) {
    if (existingConcluIdx < conclusionScenes.length) {
      resultScenes.push({
        ...conclusionScenes[existingConcluIdx],
        sceneNumber: num,
        section: 'CONCLUSION',
      });
      existingConcluIdx++;
    } else {
      const tmplIdx = (num - milestones.lessonsEnd - 1) % CONCLUSION_TEMPLATES.length;
      const tmpl = CONCLUSION_TEMPLATES[tmplIdx];
      resultScenes.push(createGeneratedScene(num, tmpl, tmpl.titleKh));
    }
  }

  // Guarantee sequential scene numbers 1 to targetCount
  return resultScenes.map((s, idx) => ({
    ...s,
    sceneNumber: idx + 1,
  }));
}
