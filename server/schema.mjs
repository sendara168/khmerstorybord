export const STORYBOARD_JSON_SCHEMA = {
  type: 'object',
  required: [
    'videoTitle',
    'videoDescription',
    'isFictionalNote',
    'characters',
    'outline',
    'scenes',
    'musicSuggestions',
    'thumbnail',
  ],
  properties: {
    videoTitle: {
      type: 'string',
      description: 'Compelling Khmer YouTube title for the educational storytelling animation.',
    },
    videoDescription: {
      type: 'string',
      description: 'Engaging YouTube description in Khmer with summary and call to action.',
    },
    isFictionalNote: {
      type: 'string',
      description:
        'Khmer note clarifying whether characters/story are fictional educational illustrations or verified historical/scientific facts.',
    },
    characters: {
      type: 'array',
      description: 'Consistent character sheet reused across all scenes, including dedicated English AI Character Reference Image Prompt.',
      items: {
        type: 'object',
        required: [
          'name',
          'role',
          'appearance',
          'outfit',
          'personality',
          'aiCharacterImagePromptEn',
        ],
        properties: {
          name: { type: 'string' },
          role: { type: 'string' },
          appearance: { type: 'string' },
          outfit: { type: 'string' },
          personality: { type: 'string' },
          aiCharacterImagePromptEn: {
            type: 'string',
            description:
              'Detailed English AI image generation prompt for a character reference turnaround sheet (full body front view, 3/4 view, expressive faces, exact outfit/hair/colors, clean neutral background, no text).',
          },
        },
      },
    },
    outline: {
      type: 'array',
      description: 'Four narrative sections: INTRODUCTION, MAIN_STORY, IMPORTANT_LESSONS, CONCLUSION.',
      items: {
        type: 'object',
        required: ['section', 'titleKh', 'summary', 'keyPoints'],
        properties: {
          section: {
            type: 'string',
            enum: ['INTRODUCTION', 'MAIN_STORY', 'IMPORTANT_LESSONS', 'CONCLUSION'],
          },
          titleKh: { type: 'string' },
          summary: { type: 'string' },
          keyPoints: {
            type: 'array',
            items: { type: 'string' },
          },
        },
      },
    },
    scenes: {
      type: 'array',
      description: 'Sequential scene-by-scene storyboard with 5-10s per scene.',
      items: {
        type: 'object',
        required: [
          'sceneNumber',
          'section',
          'sceneTitle',
          'durationSeconds',
          'visualDescription',
          'character',
          'characterAction',
          'narratorScriptKh',
          'characterDialogue',
          'onScreenText',
          'aiImagePromptEn',
          'aiVideoPromptEn',
          'cameraMovement',
          'bgmAndSfx',
        ],
        properties: {
          sceneNumber: { type: 'integer' },
          section: {
            type: 'string',
            enum: ['INTRODUCTION', 'MAIN_STORY', 'IMPORTANT_LESSONS', 'CONCLUSION'],
          },
          sceneTitle: { type: 'string' },
          durationSeconds: { type: 'integer' },
          visualDescription: { type: 'string' },
          character: { type: 'string' },
          characterAction: { type: 'string' },
          narratorScriptKh: {
            type: 'string',
            description:
              'Comprehensive, substantive, natural Khmer narrator voiceover (2-4 well-developed sentences, ~35-65 words) that explains the core topic in depth with root causes, practical steps, and Cambodian analogies, matching the visual action, and explicitly beginning with or featuring narrative bridge words connecting smoothly from the preceding scene.',
          },
          characterDialogue: { type: 'string' },
          onScreenText: { type: 'string' },
          aiImagePromptEn: {
            type: 'string',
            description:
              'Detailed English AI image prompt maintaining exact character consistency, warm cinematic lighting, 16:9 composition, no embedded text.',
          },
          aiVideoPromptEn: {
            type: 'string',
            description:
              'Detailed English AI video animation prompt focusing purely on dynamic visual action, character physical gestures, and camera motion illustrating the topic. CHARACTERS DO NOT SPEAK (silent cinematic action, no dialogue or lip-sync, designed for external voiceover overlay in CapCut/Premiere).',
          },
          cameraMovement: { type: 'string' },
          bgmAndSfx: { type: 'string' },
        },
      },
    },
    musicSuggestions: {
      type: 'array',
      items: {
        type: 'object',
        required: ['section', 'mood', 'tempo', 'instruments', 'usageTip'],
        properties: {
          section: { type: 'string' },
          mood: { type: 'string' },
          tempo: { type: 'string' },
          instruments: { type: 'string' },
          usageTip: { type: 'string' },
        },
      },
    },
    thumbnail: {
      type: 'object',
      required: ['headlineKh', 'subTextKh', 'visualConcept', 'aiThumbnailPromptEn'],
      properties: {
        headlineKh: { type: 'string' },
        subTextKh: { type: 'string' },
        visualConcept: { type: 'string' },
        aiThumbnailPromptEn: { type: 'string' },
      },
    },
  },
};

export const STYLE_ANCHORS = {
  '2d-cartoon':
    'Clean 2D cartoon educational illustration, authentic Cambodian (Khmer) characters and Cambodian rural/city scenery (sugar palm trees, rice paddies, wooden stilt houses OR Phnom Penh shophouses, riverside, tuk-tuks), authentic Khmer script on natural shop signboards where relevant, smooth cel-shaded vector style, expressive facial expressions, warm cinematic lighting, consistent character design, 16:9 composition, no floating subtitles or watermarks',
  '3d-cartoon':
    'Stylized 3D Pixar-inspired educational cartoon animation, authentic Cambodian (Khmer) characters and Cambodian rural/city environments, authentic Khmer script on natural storefront signboards where relevant, soft global illumination, warm cinematic lighting, 16:9 composition, no floating subtitles or watermarks',
  '2d-documentary':
    'Modern 2D editorial documentary illustration, authentic Cambodian (Khmer) people and real Cambodian countryside/urban architecture (Phnom Penh streets, Khmer shophouses, sugar palm rice fields), clean Khmer script on shop/street signs where relevant, textured gouache and clean ink outlines, warm cinematic lighting, consistent character design, 16:9 composition, no watermarks',
};

export function computeStoryMilestones(targetCount) {
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

export function ensureCompleteNarrativeScenes(rawScenes, ctx = {}) {
  const targetCount = Math.max(4, Math.min(120, Number(ctx.targetScenes) || 24));
  const topicText = String(ctx.topic || 'ប្រធានបទអប់រំ').trim();
  const styleAnchor =
    ctx.styleAnchor ||
    ctx.animationStyleLabel ||
    '2D Cartoon Cambodian Educational Animation, authentic Cambodian setting, clean warm lighting, 16:9';

  const chars = Array.isArray(ctx.characters) && ctx.characters.length > 0 ? ctx.characters : [];
  const charNames =
    chars.length > 0
      ? chars.map((c) => String(c.name || '').split('(')[0].trim()).filter(Boolean).join(', ')
      : 'សុខា, តារា & កញ្ញា';
  const leadChar = chars[0]?.name ? String(chars[0].name).split('(')[0].trim() : 'សុខា';

  if (rawScenes.length >= targetCount) {
    const adjusted = rawScenes.map((s, idx) => ({
      ...s,
      sceneNumber: idx + 1,
      section: s.section || (idx === 0 ? 'INTRODUCTION' : idx >= rawScenes.length - 2 ? 'CONCLUSION' : 'MAIN_STORY'),
      durationSeconds: Math.max(4, Math.min(20, Number(s.durationSeconds) || 8)),
    }));

    const lastIdx = adjusted.length - 1;
    if (adjusted[lastIdx].section !== 'CONCLUSION') {
      adjusted[lastIdx].section = 'CONCLUSION';
      if (!adjusted[lastIdx].narratorScriptKh.includes('សូមអរគុណ') && !adjusted[lastIdx].narratorScriptKh.includes('Subscribe')) {
        adjusted[lastIdx].narratorScriptKh += ' សរុបជារួម មកដល់ចំណុចបញ្ចប់នេះ សូមអរគុណសម្រាប់ការទស្សនា និងសូមចុច Like, Share និង Subscribe ដើម្បីទទួលបានចំណេះដឹងថ្មីៗ!';
      }
    }
    return adjusted;
  }

  const milestones = computeStoryMilestones(targetCount);
  const introScenes = [];
  const mainScenes = [];
  const lessonScenes = [];
  const conclusionScenes = [];

  for (const s of rawScenes) {
    const sec = String(s.section || '').toUpperCase();
    if (sec.includes('INTRO')) introScenes.push(s);
    else if (sec.includes('LESSON')) lessonScenes.push(s);
    else if (sec.includes('CONCLU') || sec.includes('OUTRO')) conclusionScenes.push(s);
    else mainScenes.push(s);
  }

  const resultScenes = [];

  const createGeneratedScene = (num, tmpl, customTitle) => {
    const title = customTitle || `${tmpl.titleKh} (${num})`;
    const narrator = `${tmpl.bridgeStarter} «${topicText}» ${tmpl.narratorBody}`;
    const action = `${charNames} ${tmpl.actionDesc}`;
    const dialogue = `${leadChar}៖ ${tmpl.dialogueKh}`;

    return {
      sceneNumber: num,
      section: tmpl.section,
      sceneTitle: title,
      durationSeconds: 8,
      visualDescription: `ប្លង់សកម្មភាពរស់រវើកក្នុងបរិយាកាសកម្ពុជា៖ ${action}។ បរិយាកាសពោរពេញដោយថាមពលវិជ្ជមាន និងការសហការរវាងតួអង្គខ្មែរ។`,
      character: charNames,
      characterAction: action,
      narratorScriptKh: narrator,
      characterDialogue: dialogue,
      onScreenText: title,
      aiImagePromptEn: `Authentic Cambodian 2D illustration showing ${tmpl.actionDesc}, featuring Cambodian characters (${charNames}), authentic Cambodian urban or rural background, active collaborative poses. ${styleAnchor}.`,
      aiVideoPromptEn: `Visual Action: ${charNames} actively engaged in ${tmpl.actionDesc}, smooth natural body language and gestures illustrating "${topicText}". Silent cinematic action, characters do not speak, no dialogue or lip-sync, smooth 24fps motion for external voiceover overlay, 16:9, no floating text.`,
      cameraMovement: tmpl.cameraMovement,
      bgmAndSfx: tmpl.bgm,
    };
  };

  const EXTENDED_STEPS = [
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
  ];

  // 1. Fill INTRODUCTION
  for (let i = 0; i < milestones.introCount; i++) {
    const sceneNum = i + 1;
    if (introScenes[i]) {
      resultScenes.push({
        ...introScenes[i],
        sceneNumber: sceneNum,
        section: 'INTRODUCTION',
      });
    } else {
      const introTmpl = {
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

  // 2. Fill MAIN STORY
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
      const tmplIdx = (num - milestones.introCount - 1) % EXTENDED_STEPS.length;
      const tmpl = EXTENDED_STEPS[tmplIdx];
      const cycle = Math.floor((num - milestones.introCount - 1) / EXTENDED_STEPS.length) + 1;
      const title = cycle > 1 ? `${tmpl.titleKh} (វគ្គទី ${cycle})` : tmpl.titleKh;
      resultScenes.push(createGeneratedScene(num, tmpl, title));
    }
  }

  // 3. Fill IMPORTANT LESSONS
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
      const lessonTmpl = {
        section: 'IMPORTANT_LESSONS',
        titleKh: 'សង្ខេបមេរៀនសំខាន់ៗ & ក្បួនអនុវត្តមាស',
        bridgeStarter: 'សង្ខេបជារួម មកដល់ចំណុចនេះ មេរៀនសំខាន់បំផុតគឺ',
        narratorBody: 'ការរួមបញ្ចូលគ្នារវាងចំណេះដឹងទ្រឹស្តី និងការចុះអនុវត្តជាក់ស្តែង។ កុំរង់ចាំឱ្យគ្រប់យ៉ាងល្អឥតខ្ចោះទើបចាប់ផ្ដើម—ការចាប់ផ្ដើមបោះជំហានតូចៗនៅថ្ងៃនេះ ជាគ្រឹះនៃជោគជ័យថ្ងៃស្អែក។',
        actionDesc: 'តួអង្គទាំង ៣ ប្រជុំជុំវិញតុការងារ កញ្ញាចង្អុលបង្ហាញរបាយការណ៍ តារាសរសេរលើក្តារខៀន សុខាងក់ក្បាលគាំទ្រ',
        dialogueKh: '«បើយើងអនុវត្តតាមជំហានទាំងនេះ លទ្ធផលនឹងកើនឡើងជាក់ជាមិនខាន!»',
        cameraMovement: 'Smooth dolly in towards team center',
        bgm: 'Warm inspiring documentary chords',
      };
      resultScenes.push(createGeneratedScene(num, lessonTmpl, lessonTmpl.titleKh));
    }
  }

  // 4. Fill CONCLUSION
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
      const concluTmpl = {
        section: 'CONCLUSION',
        titleKh: num === targetCount ? 'ការថ្លែងអំណរគុណ & បញ្ចប់សាច់រឿងពេញលេញ (Outro)' : 'សារដាស់តឿនចិត្ត & ជំហានបន្តទៅមុខ',
        bridgeStarter: num === targetCount ? 'សរុបជារួម មកដល់ចំណុចបញ្ចប់នេះ ក្រុមការងារយើងខ្ញុំសង្ឃឹមថា' : 'ជាចុងក្រោយ សូមចងចាំថា គ្រប់ការផ្លាស់ប្តូរដ៏អស្ចារ្យតែងតែ',
        narratorBody:
          num === targetCount
            ? 'ចំណេះដឹង និងបទពិសោធន៍ទាំងអស់នេះ នឹងក្លាយជាពន្លឺបំភ្លឺផ្លូវដ៏មានប្រយោជន៍។ សូមចុច Like, Share និង Subscribe ដើម្បីទទួលបានវីដេអូអប់រំល្អៗជាបន្តបន្ទាប់ទៀត។ សូមអរគុណ!'
            : 'ចាប់ផ្ដើមពីការសម្រេចចិត្តដ៏ត្រឹមត្រូវមួយ និងការតាំងចិត្តធ្វើឱ្យសម្រេច។ មិនថាអ្នកស្ថិតក្នុងស្ថានភាពលំបាកយ៉ាងណាក៏ដោយ អ្នកតែងតែមានលទ្ធភាពបង្កើតលទ្ធផលថ្មីបានជានិច្ច។',
        actionDesc:
          num === targetCount
            ? 'តួអង្គលើកដៃសំពះតាមប្រពៃណីខ្មែរយ៉ាងរម្យទម និងញញឹមផ្ញើក្តីស្រឡាញ់ដល់ទស្សនិកជនគ្រប់គ្នា'
            : 'តួអង្គទាំងអស់ដើរចេញមកខាងមុខដោយស្នាមញញឹមរាក់ទាក់ និងកាយវិការស្វាហាប់ប្រកបដោយក្តីសង្ឃឹម',
        dialogueKh: num === targetCount ? '«សូមអរគុណសម្រាប់ការទស្សនា និងសូមជួបគ្នាក្នុងវីដេអូក្រោយៗទៀត!»' : '«សូមចាប់ផ្ដើមអនុវត្តនៅថ្ងៃនេះ ទាំងអស់គ្នា!»',
        cameraMovement: 'Gentle slow zoom out showing entire friendly group',
        bgm: 'Warm concluding signature outro theme',
      };
      resultScenes.push(createGeneratedScene(num, concluTmpl, concluTmpl.titleKh));
    }
  }

  return resultScenes.map((s, idx) => ({
    ...s,
    sceneNumber: idx + 1,
  }));
}

export function buildGenerationPrompt(input, includeExplicitJsonShape = false) {
  const styleAnchor = STYLE_ANCHORS[input.animationStyle] || STYLE_ANCHORS['2d-cartoon'];
  const targetScenes = Math.min(120, Math.max(4, Number(input.targetScenes) || 24));
  const milestones = computeStoryMilestones(targetScenes);

  const jsonShapeBlock = includeExplicitJsonShape
    ? `

EXACT REQUIRED JSON OUTPUT STRUCTURE (return ONLY valid JSON, no markdown prose outside JSON):
{
  "videoTitle": "string (Khmer)",
  "videoDescription": "string (Khmer)",
  "isFictionalNote": "string (Khmer)",
  "characters": [
    {
      "name": "string",
      "role": "string",
      "appearance": "string",
      "outfit": "string",
      "personality": "string",
      "aiCharacterImagePromptEn": "string (English character turnaround reference sheet prompt: front view, 3/4 view, 3 expressions, exact outfit/hair/colors, clean neutral background, ending with visual style anchor)"
    }
  ],
  "outline": [
    { "section": "INTRODUCTION", "titleKh": "string", "summary": "string", "keyPoints": ["string"] },
    { "section": "MAIN_STORY", "titleKh": "string", "summary": "string", "keyPoints": ["string"] },
    { "section": "IMPORTANT_LESSONS", "titleKh": "string", "summary": "string", "keyPoints": ["string"] },
    { "section": "CONCLUSION", "titleKh": "string", "summary": "string", "keyPoints": ["string"] }
  ],
  "scenes": [
    {
      "sceneNumber": 1,
      "section": "INTRODUCTION | MAIN_STORY | IMPORTANT_LESSONS | CONCLUSION",
      "sceneTitle": "string (Khmer)",
      "durationSeconds": 8,
      "visualDescription": "string (Khmer)",
      "character": "string",
      "characterAction": "string (Khmer)",
      "narratorScriptKh": "string (complete natural Khmer voiceover sentence)",
      "characterDialogue": "string (optional Khmer dialogue or empty string)",
      "onScreenText": "string (short Khmer on-screen text)",
      "aiImagePromptEn": "string (detailed English AI image prompt ending with the visual style anchor)",
      "aiVideoPromptEn": "string (detailed English AI video animation prompt)",
      "cameraMovement": "string",
      "bgmAndSfx": "string"
    }
  ],
  "musicSuggestions": [
    { "section": "string", "mood": "string", "tempo": "string", "instruments": "string", "usageTip": "string" }
  ],
  "thumbnail": {
    "headlineKh": "string",
    "subTextKh": "string",
    "visualConcept": "string",
    "aiThumbnailPromptEn": "string (English)"
  }
}`
    : '';

  return `You are an expert Khmer documentary scriptwriter, knowledge researcher, 2D animation director, and professional narrator.

Create a COMPLETE, production-ready Khmer Educational Storytelling Animation storyboard package in JSON strictly following the required structure.

PROJECT PARAMETERS:
- Category: ${input.categoryLabelKh}
- Topic: ${input.topic}
- Presenter & Cast Setup: ${input.presenterSetupLabel || 'Team & Group Presentation (3–5 Characters)'}
- Scene Action Dynamics: ${input.actionDynamicLabel || 'Cinematic Action & Practical Movement (NO Boring Talking Heads)'}
- Language for Script, Titles, Visual Descriptions, Subtitles: Natural, grammatically accurate Khmer (ភាសាខ្មែរ)
- Language for AI Image Prompts, AI Video Animation Prompts, and AI Thumbnail Prompt: English
- Target Video Duration: ${input.durationLabel}
- Exact Scene Count: Generate ${targetScenes} sequential scenes (numbered 1 to ${targetScenes}), each 6 to 10 seconds long.
- Video Format: 16:9 (1920x1080)
- Animation Style: ${input.animationStyleLabel}
- Narrator Voice: ${input.narratorVoice || 'Khmer Male Voice'} (Natural, Clear, Professional, Engaging)
${input.customNotes ? `- Special User Instructions: ${input.customNotes}` : ''}

STRICT QUALITY RULES:
0. MANDATORY EXACT SCENE COUNT & COMPLETE 4-ACT NARRATIVE ROADMAP:
   - You MUST generate EXACTLY ${targetScenes} sequential scenes, numbered 1 to ${targetScenes} without skipping or stopping early!
   - Complete 4-Act Milestone Allocation:
     * Scenes 1 to ${milestones.introCount}: INTRODUCTION (The Hook, Relatable Dilemma & Topic Intro)
     * Scenes ${milestones.introCount + 1} to ${milestones.mainEnd}: MAIN_STORY (Root Causes, Practical Step-by-Step Breakdown, Cambodian Everyday Examples)
     * Scenes ${milestones.mainEnd + 1} to ${milestones.lessonsEnd}: IMPORTANT_LESSONS (Golden Actionable Rules, Mindset Shifts, Key Takeaways)
     * Scenes ${milestones.lessonsEnd + 1} to ${targetScenes}: CONCLUSION (Complete Resolution, Inspiring Final Moral, Call to Action, Outro — ចប់សេចក្តី ១០០%)
   - TOKEN BUDGET DISCIPLINE: Keep English AI visual prompts focused (~20-35 words) so that the JSON response fits comfortably within output limits and NEVER truncates mid-sentence.
   - CRITICAL: Never stop early or summarize remaining scenes. You MUST complete all ${targetScenes} scenes up to scene ${targetScenes}.

1. MULTI-CHARACTER CAST & PRESENTATION DYNAMICS:
   - When Presenter & Cast Setup is a team or duo or drama cast, define MULTIPLE distinct Cambodian characters in \`characters\` with consistent names, distinct roles (e.g. Team Lead, Technical Specialist, Practitioner, Learner), distinct natural Cambodian appearances, everyday attire, and personalities.
   - Actively showcase these characters interacting, collaborating, problem-solving, and discussing across the scenes!

2. ANTI-TALKING-HEAD MANDATE & DYNAMIC SCENE ACTION:
   - CRITICAL: NEVER create scenes where characters merely stand still facing the camera reading the voiceover script!
   - In EVERY SINGLE SCENE, \`visualDescription\` and \`characterAction\` MUST portray active, tangible physical movements:
     * Walking briskly through Cambodian city streets, markets, or village paths
     * Writing/sketching workflows on whiteboards with team members gathered around exchanging ideas
     * Inspecting equipment, crops, books, documents, products, or laptops hands-on
     * Riding PassApp / bicycles / motorbikes while pointing out real-world landmarks
     * Gathering around tables in lively discussion, shaking hands, gesturing expressively, solving practical challenges
   - The Khmer voiceover (narrator script) provides the educational storytelling narrative, while characters actively act out lively scenarios in the visual scenes.
   - Include natural Khmer conversational dialogue between characters in \`characterDialogue\` whenever characters communicate!

3. STORY STRUCTURE & COMPREHENSIVE EDUCATIONAL DEPTH:
   - CRITICAL REQUIREMENT: Every topic must be deeply and thoroughly explained, never treated with shallow bullet points!
   - Explain the "WHY" (Root causes, underlying psychological triggers, scientific, financial, or mechanical principles).
   - Explain the "HOW" (Concrete practical steps, clear rules of thumb, formulas, and actionable techniques viewers can use immediately).
   - Ground every concept in relatable Cambodian real-world analogies (coffee expenses, family bookkeeping, KHQR banking, small trade, agriculture, school life).
   - A. INTRODUCTION (~12% of scenes): Intriguing hook question or relatable dilemma, show the problem's stakes, introduce the topic.
   - B. MAIN STORY (~60% of scenes): Step-by-step breakdown with concrete character scenarios, teamwork, and hands-on demonstrations.
   - C. IMPORTANT LESSONS (~18% of scenes): Actionable takeaways and practical golden rules.
   - D. CONCLUSION (~10% of scenes): Memorable closing message + warm invitation to Like, Share, and Subscribe in Khmer.

4. SEAMLESS SCENE-TO-SCENE NARRATIVE CONTINUITY (មិនដាច់កង់):
   - The entire storyboard MUST flow as ONE unified progressive storytelling journey without disjointed leaps:
     * Scene 1 (Hook & Relatable Dilemma): Begins with an intriguing question or realistic dilemma facing the characters.
     * Scene 2+: Every scene's \`narratorScriptKh\` MUST start with or incorporate explicit narrative bridge words connecting directly to the preceding scene's insight (e.g. «ដើម្បីឆ្លើយតបនឹងសំណួរនេះ...», «បន្ទាប់ពីយើងបានយល់ពី... ជំហានបន្ទាប់ដែលត្រូវធ្វើគឺ...», «ប៉ុន្តែ តើចុះបើ... ត្រង់ចំណុចនេះហើយដែល...», «ក្រៅពីវិធីសាស្ត្រខាងលើ កត្តាមួយទៀតដែលសំខាន់មិនអាចខ្វះបានគឺ...», «នៅពេលដែលយើងអនុវត្តចំណុចនេះបានជោគជ័យ... សំណួរគឺថាតើ...», «តភ្ជាប់ពីចំណុចនេះ...»).
     * Conclusion: Seamlessly unifies all earlier lessons into a powerful takeaway: «សរុបជារួម មកដល់ចំណុចនេះ យើងឃើញថា...».
   - Visual Action Story Arc: Characters follow an unbroken physical journey (Problem Encountered ➔ Team Whiteboard Plan ➔ Field Trial ➔ Challenge Overcome ➔ Measurable Result ➔ Community Lesson).
   - In each scene, \`narratorScriptKh\` must be 2 to 4 rich, well-formed spoken Khmer sentences (~35–65 words) ready for voiceover.

5. CAMBODIAN (KHMER) CULTURAL & VISUAL CONSISTENCY RULES:
   - ALL characters MUST be authentically Cambodian (Khmer) with natural Cambodian facial features, warm light-brown/tan skin tone, black hair, and realistic Cambodian everyday attire (or Cambodian school uniforms / subtle Khmer krama scarf details where appropriate).
   - ALL landscapes, streets, homes, and backgrounds MUST reflect authentic Cambodia — including BOTH Cambodian countryside (golden rice fields, sugar palm trees / Borassus palms, traditional Khmer wooden stilt houses, lotus ponds, red-earth village paths, distant pagoda roofs) AND Cambodian cityscapes (Phnom Penh shophouses, Chaktomuk riverside promenade, Cambodian coffee shops, tuk-tuks / PassApp, tropical boulevard trees).
   - Whenever a shop, café, cart, market, school, or business appears in a scene, explicitly include authentic clean Khmer script on its natural storefront signboard (e.g., signboard reading "កាហ្វេតារា", "ហាងសុខា", "វិទ្យាល័យ", "ផ្សារទំនើប") while avoiding floating subtitles or random English watermarks.
   - Define memorable recurring Cambodian characters in \`characters\` with exact clothing, hair, age, and colors, and repeat those exact visual descriptors in EVERY \`aiImagePromptEn\` where they appear so there are NO random character changes.
   - End or frame every \`aiImagePromptEn\` with the visual style anchor: "${styleAnchor}".
   - Put on-screen overlay titles in \`onScreenText\` (separate from natural Khmer shop signboards inside the world).

6. RESEARCH & ACCURACY RULES:
   - Use verifiable facts; never invent fake statistics or fake historical quotes.
   - If illustrating a principle with fictional characters, clearly state in \`isFictionalNote\` that the characters/story are fictional educational examples.

7. AI VIDEO PROMPT RULES (TOPIC ACTION ONLY — CHARACTERS DO NOT SPEAK):
   - In \`aiVideoPromptEn\`, focus strictly on dynamic physical actions, gestures, workflows, and camera motion illustrating the topic.
   - CHARACTERS DO NOT SPEAK: Do NOT instruct characters to talk or mouth words. No speech, no dialogue, no lip-sync inside video prompts!
   - Modern AI video generators (Runway, Kling, Luma, Sora, Pika) perform best with pure cinematic visual action. The voiceover script is managed separately for external voiceover tools (CapCut / ElevenLabs / Voice Actors).
   - End \`aiVideoPromptEn\` with: "Silent cinematic action, characters do not speak, no dialogue or lip-sync, smooth 24fps motion for external voiceover overlay, 16:9, no floating text."${jsonShapeBlock}

Return ONLY valid JSON.`;
}
