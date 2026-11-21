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
              'Direct spoken lines of the character in Khmer, formatted as [ឈ្មោះតួអង្គ]៖ «<សម្ដីតួអង្គនិយាយផ្ទាល់ជាភាសាខ្មែរ>». The character is the active speaker delivering the story directly in natural, engaging spoken Khmer (2-4 well-developed sentences, ~35-65 words) matching the scene\'s action.',
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
              'Detailed English AI video animation prompt describing authentic character acting and spoken delivery: Cambodian characters actively speaking on camera in Khmer with natural speech articulation, engaging facial expressions, and communicative hand gestures while illustrating the topic, smooth 24fps motion, 16:9, no floating text.',
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
          aiMusicPromptEn: { type: 'string' },
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
  '3d-cinematic-cgi':
    'Hyper-realistic 3D cinematic CGI animation rendered in Unreal Engine 5, Octane render, ray-traced ambient occlusion, subsurface skin scattering, authentic Cambodian (Khmer) characters and breathtaking Cambodian scenery (Angkorian stone architectures, lush tropical flora, rural sugar palm trees or modern Phnom Penh skyline), volumetric lighting and atmospheric depth, 8k resolution, cinematic composition, consistent 3D character design, 16:9 widescreen, no floating text or subtitles',
  '2d-documentary':
    'Modern 2D editorial documentary illustration, authentic Cambodian (Khmer) people and real Cambodian countryside/urban architecture (Phnom Penh streets, Khmer shophouses, sugar palm rice fields), clean Khmer script on shop/street signs where relevant, textured gouache and clean ink outlines, warm cinematic lighting, consistent character design, 16:9 composition, no watermarks',
  'photorealistic-real':
    'Ultra-photorealistic cinematic live-action photography of authentic real Cambodian (Khmer) people, highly detailed natural skin texture, realistic human facial features and pores, authentic everyday Cambodian outfits and real Southeast Asian hairstyles, genuine authentic Cambodian settings (Phnom Penh urban streets, modern cafés, bustling markets, or rural Cambodian landscape with sugar palm trees and stilt houses), authentic Khmer signage on shops, shot on 35mm lens, f/1.8 aperture, soft cinematic background bokeh, natural warm golden hour sunlight, 8k resolution, photorealistic masterpiece, strictly no cartoon, no 3D render, no CGI, no floating watermarks or text',
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

export function sanitizeScriptRepetitions(scenes, topic, videoTitle) {
  const cleanTopic = String(topic || '').trim();
  const cleanTitle = String(videoTitle || '').trim();
  const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  return (scenes || []).map((scene, idx) => {
    let script = String(scene.narratorScriptKh || '').trim();

    // Scene 1 can mention the topic once; Scene 2+ must NOT recite the topic or title repeatedly
    if (idx > 0) {
      const targets = [cleanTitle, cleanTopic].filter(Boolean);

      for (const t of targets) {
        if (!t || t.length < 3) continue;

        const escaped = escapeRegExp(t);

        // Replace repetitive title citations with natural contextual Khmer phrasing
        script = script.replace(
          new RegExp(`(?:នៃ|អំពី|ជាមួយ|ចំពោះ)\\s*«${escaped}»`, 'gi'),
          'នៃបញ្ហានេះ'
        );
        script = script.replace(
          new RegExp(`(?:ក្នុង|សម្រាប់)\\s*«${escaped}»`, 'gi'),
          'ក្នុងចំណុចនេះ'
        );
        script = script.replace(new RegExp(`«${escaped}»`, 'gi'), 'ចំណុចនេះ');

        // Without Khmer quotes
        script = script.replace(
          new RegExp(`(?:នៃ|អំពី|ជាមួយ|ចំពោះ)\\s+${escaped}`, 'gi'),
          'នៃបញ្ហានេះ'
        );
        script = script.replace(
          new RegExp(`(?:ក្នុង|សម្រាប់)\\s+${escaped}`, 'gi'),
          'ក្នុងកិច្ចការនេះ'
        );
        script = script.replace(new RegExp(`\\b${escaped}\\b`, 'gi'), 'បញ្ហានេះ');
      }

      script = script
        .replace(/\s{2,}/g, ' ')
        .replace(/ចំណុចនេះ\s+ចំណុចនេះ/g, 'ចំណុចនេះ')
        .replace(/បញ្ហានេះ\s+បញ្ហានេះ/g, 'បញ្ហានេះ');
    }

    return {
      ...scene,
      narratorScriptKh: script.trim(),
    };
  });
}

function isPhotorealisticStyle(styleAnchor) {
  const sa = String(styleAnchor || '').toLowerCase();
  return sa.includes('photorealistic') || sa.includes('real human') || sa.includes('live-action');
}

function buildSoloPresenterImagePrompt(leadChar, characterAction, styleAnchor, _isDialogueSpeech) {
  if (isPhotorealisticStyle(styleAnchor)) {
    return `Ultra-photorealistic cinematic 35mm photography featuring authentic real Cambodian solo presenter ${leadChar}, natural human skin texture and pores, authentic everyday Cambodian outfit, single person in frame, in an active expressive speaking pose with engaging facial expression, delivering story presentation and gesturing: ${characterAction}, authentic Cambodian setting, natural cinematic lighting, shot on 35mm lens, f/1.8 aperture, 8k resolution, photorealistic masterpiece, strictly real human, no cartoon, strictly no other characters in frame. ${styleAnchor || ''}`;
  }
  const sa = String(styleAnchor || '').toLowerCase();
  const prefix = sa.includes('3d')
    ? 'Stylized 3D Pixar-inspired educational cartoon animation'
    : sa.includes('documentary')
    ? 'Modern 2D editorial documentary illustration'
    : 'Authentic Cambodian 2D illustration';
  return `${prefix} featuring solo presenter ${leadChar}, single person in frame, in an active expressive speaking pose delivering presentation with engaging facial expression and communicative hand gestures: ${characterAction}, authentic Cambodian background, solo presenter shot, strictly no other characters in frame. ${styleAnchor || ''}`;
}

function buildSoloPresenterVideoPrompt(leadChar, characterAction, topicText, styleAnchor, _isDialogueSpeech, dialogueText) {
  const speechLine = dialogueText ? ` while speaking line: "${dialogueText}"` : '';
  if (isPhotorealisticStyle(styleAnchor)) {
    return `Visual Action: Cinematic 4K live-action character acting and spoken delivery: authentic real Cambodian solo presenter ${leadChar}, actively speaking directly on camera in Khmer with natural mouth movements, genuine conversational expressions, and communicative hand gestures while presenting: ${characterAction}${speechLine}, illustrating "${topicText}". Single real person in frame, natural cinematic lighting, smooth 24fps motion, 16:9, no floating text.`;
  }
  return `Visual Action: Expressive animated character acting and spoken delivery: Cambodian solo presenter ${leadChar}, single person in frame, actively speaking on camera in Khmer with natural speech articulation, engaging facial expressions, and communicative gestures while presenting: ${characterAction}${speechLine}, illustrating "${topicText}". Single character in frame, smooth 24fps animation, authentic Cambodian setting, 16:9, no floating text.`;
}

function buildGroupPresenterImagePrompt(charNames, actionDesc, styleAnchor, _isDialogueSpeech) {
  if (isPhotorealisticStyle(styleAnchor)) {
    return `Ultra-photorealistic cinematic 35mm photography of authentic real Cambodian people (${charNames}), natural human skin texture and pores, authentic everyday Cambodian outfits, in a lively conversational scene with characters speaking, engaging facial expressions, and communicative gestures while interacting: ${actionDesc}, authentic Cambodian urban or rural setting, shot on 35mm lens, f/2.0 aperture, natural sunlight, 8k resolution, photorealistic masterpiece, strictly real humans, no cartoon, no 3D render. ${styleAnchor || ''}`;
  }
  const sa = String(styleAnchor || '').toLowerCase();
  const prefix = sa.includes('3d')
    ? 'Stylized 3D Pixar-inspired educational cartoon animation'
    : sa.includes('documentary')
    ? 'Modern 2D editorial documentary illustration'
    : 'Authentic Cambodian 2D illustration';
  return `${prefix} showing lively conversational scene with Cambodian characters (${charNames}) speaking and delivering dialogue with engaging facial expressions and communicative gestures: ${actionDesc}, authentic Cambodian urban or rural background, active collaborative poses. ${styleAnchor || ''}`;
}

function buildGroupPresenterVideoPrompt(charNames, actionDesc, topicText, styleAnchor, _isDialogueSpeech, dialogueText) {
  const speechLine = dialogueText ? ` while delivering dialogue: "${dialogueText}"` : '';
  if (isPhotorealisticStyle(styleAnchor)) {
    return `Visual Action: Cinematic 4K live-action character acting and dialogue delivery: authentic real Cambodian characters (${charNames}), actively speaking and conversing on camera in Khmer with natural mouth movements, genuine conversational expressions, and communicative hand gestures while interacting: ${actionDesc}${speechLine}, illustrating "${topicText}". Smooth cinematic 24fps footage, natural lighting, 16:9, no floating text.`;
  }
  return `Visual Action: Expressive animated character acting and dialogue delivery: Cambodian characters (${charNames}), actively speaking and conversing on camera in Khmer with natural speech articulation, lively conversational expressions, and expressive gestures while interacting: ${actionDesc}${speechLine}, illustrating "${topicText}". Smooth 24fps animation, authentic Cambodian setting, 16:9, no floating text.`;
}

function sanitizeSceneForCast(s, idx, isSolo, isNoCharacters, leadChar, charNames, topicText, styleAnchor, isDialogueSpeech) {
  let character = isNoCharacters
    ? 'គ្មានតួអង្គ (Topic Visuals Only)'
    : isSolo
    ? leadChar
    : s.character || charNames;

  let characterAction = s.characterAction || '';
  let characterDialogue = isNoCharacters ? '' : s.characterDialogue || '';
  let visualDesc = s.visualDescription || '';
  let imgPrompt = s.aiImagePromptEn || '';
  let videoPrompt = s.aiVideoPromptEn || '';

  if (isSolo) {
    character = leadChar;
    characterAction = characterAction
      .replace(/សុខា\s*និង\s*តារា/g, `${leadChar}តែម្នាក់ឯង`)
      .replace(/កញ្ញា\s*និង\s*សុខា/g, `${leadChar}តែម្នាក់ឯង`)
      .replace(/វិចិត្រ\s*និង\s*បុប្ផា/g, `${leadChar}តែម្នាក់ឯង`)
      .replace(/ក្រុមការងារទាំងមូល\s*\(.*?\)/g, leadChar)
      .replace(/ក្រុមការងារ/g, `អ្នកធ្វើបទបង្ហាញទោល (${leadChar})`)
      .replace(/សមាជិកទាំងអស់/g, leadChar)
      .replace(/តួអង្គទាំងអស់/g, leadChar)
      .replace(/តួអង្គទាំង\s*[០-៩0-9]+\s*នាក់/g, leadChar);

    if (characterDialogue && !characterDialogue.startsWith(`${leadChar}៖`)) {
      const colonIdx = characterDialogue.indexOf('៖');
      if (colonIdx > 0 && colonIdx < 15) {
        characterDialogue = `${leadChar}៖` + characterDialogue.slice(colonIdx + 1);
      }
    }

    if (!imgPrompt.toLowerCase().includes('solo presenter') && !imgPrompt.toLowerCase().includes('single person')) {
      imgPrompt = buildSoloPresenterImagePrompt(leadChar, characterAction, styleAnchor, isDialogueSpeech);
    }

    if (!videoPrompt.toLowerCase().includes('solo presenter') && !videoPrompt.toLowerCase().includes('single person')) {
      videoPrompt = buildSoloPresenterVideoPrompt(leadChar, characterAction, topicText, styleAnchor, isDialogueSpeech, characterDialogue);
    }
  } else if (isNoCharacters) {
    character = 'គ្មានតួអង្គ (Topic Visuals Only)';
    characterDialogue = '';
    if (!imgPrompt.toLowerCase().includes('no human characters')) {
      imgPrompt = `${imgPrompt}, no human characters`;
    }
    if (!videoPrompt.toLowerCase().includes('no human characters')) {
      videoPrompt = `${videoPrompt}, no human characters`;
    }
  }

  let narratorScriptKh = (s.narratorScriptKh || '').trim();
  if (!isNoCharacters) {
    const speakerName = (character.split('(')[0] || leadChar).trim();
    const hasSpeakerPrefix = /^[\u1780-\u17FF\w\s]+[៖:]/.test(narratorScriptKh);
    if (!hasSpeakerPrefix && speakerName) {
      narratorScriptKh = `${speakerName}៖ «${narratorScriptKh.replace(/^«|»$/g, '').trim()}»`;
    }
    if (!characterDialogue) {
      characterDialogue = narratorScriptKh;
    }
  }

  return {
    ...s,
    sceneNumber: idx + 1,
    character,
    characterAction,
    narratorScriptKh,
    characterDialogue,
    visualDescription: visualDesc,
    aiImagePromptEn: imgPrompt,
    aiVideoPromptEn: videoPrompt,
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
  const isNoCharacters =
    ctx.presenterSetup === 'no-characters' ||
    (chars.length > 0 &&
      chars.some(
        (c) =>
          String(c.name || '').includes('គ្មានតួអង្គ') ||
          String(c.name || '').includes('Topic Visual') ||
          String(c.role || '').includes('Topic Visual')
      ));
  const isSolo = ctx.presenterSetup === 'solo' || (!isNoCharacters && chars.length === 1);
  const isDialogueSpeech = ctx.actionDynamic === 'character-dialogue-speech';

  const leadChar = chars[0]?.name ? String(chars[0].name).split('(')[0].trim() : 'សុខា';
  const charNames = isNoCharacters
    ? 'គ្មានតួអង្គ (Topic Visuals Only)'
    : isSolo
    ? leadChar
    : chars.length > 0
    ? chars.map((c) => String(c.name || '').split('(')[0].trim()).filter(Boolean).join(', ')
    : 'សុខា, តារា & កញ្ញា';

  if (rawScenes.length >= targetCount) {
    const adjusted = rawScenes.map((s, idx) => {
      let character = isNoCharacters
        ? 'គ្មានតួអង្គ (Topic Visuals Only)'
        : isSolo
        ? leadChar
        : s.character || charNames;

      let characterAction = s.characterAction || '';
      let characterDialogue = isNoCharacters ? '' : s.characterDialogue || '';
      let visualDesc = s.visualDescription || '';
      let imgPrompt = s.aiImagePromptEn || '';
      let videoPrompt = s.aiVideoPromptEn || '';

      if (isSolo) {
        character = leadChar;
        characterAction = characterAction
          .replace(/សុខា\s*និង\s*តារា/g, `${leadChar}តែម្នាក់ឯង`)
          .replace(/កញ្ញា\s*និង\s*សុខា/g, `${leadChar}តែម្នាក់ឯង`)
          .replace(/វិចិត្រ\s*និង\s*បុប្ផា/g, `${leadChar}តែម្នាក់ឯង`)
          .replace(/ក្រុមការងារទាំងមូល\s*\(.*?\)/g, leadChar)
          .replace(/ក្រុមការងារ/g, `អ្នកធ្វើបទបង្ហាញទោល (${leadChar})`)
          .replace(/សមាជិកទាំងអស់/g, leadChar)
          .replace(/តួអង្គទាំងអស់/g, leadChar)
          .replace(/តួអង្គទាំង\s*[០-៩0-9]+\s*នាក់/g, leadChar);

        if (characterDialogue && !characterDialogue.startsWith(`${leadChar}៖`)) {
          const colonIdx = characterDialogue.indexOf('៖');
          if (colonIdx > 0 && colonIdx < 15) {
            characterDialogue = `${leadChar}៖` + characterDialogue.slice(colonIdx + 1);
          }
        }

        if (!imgPrompt.toLowerCase().includes('solo presenter') && !imgPrompt.toLowerCase().includes('single person')) {
          imgPrompt = buildSoloPresenterImagePrompt(leadChar, characterAction, styleAnchor, isDialogueSpeech);
        }

        if (!videoPrompt.toLowerCase().includes('solo presenter') && !videoPrompt.toLowerCase().includes('single person')) {
          videoPrompt = buildSoloPresenterVideoPrompt(leadChar, characterAction, topicText, styleAnchor, isDialogueSpeech, characterDialogue);
        }
      } else if (isNoCharacters) {
        character = 'គ្មានតួអង្គ (Topic Visuals Only)';
        characterDialogue = '';
        if (!imgPrompt.toLowerCase().includes('no human characters')) {
          imgPrompt = `${imgPrompt}, no human characters`;
        }
        if (!videoPrompt.toLowerCase().includes('no human characters')) {
          videoPrompt = `${videoPrompt}, no human characters`;
        }
      }

      return {
        ...s,
        sceneNumber: idx + 1,
        section: s.section || (idx === 0 ? 'INTRODUCTION' : idx >= rawScenes.length - 2 ? 'CONCLUSION' : 'MAIN_STORY'),
        durationSeconds: Math.max(4, Math.min(20, Number(s.durationSeconds) || 8)),
        character,
        characterAction,
        characterDialogue,
        visualDescription: visualDesc,
        aiImagePromptEn: imgPrompt,
        aiVideoPromptEn: videoPrompt,
      };
    });

    const lastIdx = adjusted.length - 1;
    if (adjusted[lastIdx].section !== 'CONCLUSION') {
      adjusted[lastIdx].section = 'CONCLUSION';
      if (!adjusted[lastIdx].narratorScriptKh.includes('សូមអរគុណ') && !adjusted[lastIdx].narratorScriptKh.includes('Subscribe')) {
        adjusted[lastIdx].narratorScriptKh += ' សរុបជារួម មកដល់ចំណុចបញ្ចប់នេះ សូមអរគុណសម្រាប់ការទស្សនា និងសូមចុច Like, Share និង Subscribe ដើម្បីទទួលបានចំណេះដឹងថ្មីៗ!';
      }
    }
    return sanitizeScriptRepetitions(adjusted, topicText, ctx.topic);
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
    const speaker = isNoCharacters ? '' : isSolo ? leadChar : (num % 2 === 1 ? leadChar : 'កញ្ញា');
    const narrator = isNoCharacters
      ? `${tmpl.bridgeStarter} ${tmpl.narratorBody}`
      : `${speaker}៖ «${tmpl.bridgeStarter} ${tmpl.narratorBody}»`;
    const action = isNoCharacters
      ? `ប្លង់រូបភាព B-roll និងទេសភាពទាក់ទងនឹង ${tmpl.titleKh}`
      : isSolo
      ? `${leadChar} ${tmpl.actionDesc}`
      : `${charNames} ${tmpl.actionDesc}`;
    const dialogue = isNoCharacters ? '' : `${speaker}៖ «${tmpl.dialogueKh || tmpl.narratorBody}»`;

    const visualDesc = isNoCharacters
      ? `ប្លង់រូបភាពឯកសារ B-roll គ្មានតួអង្គមនុស្ស៖ ${tmpl.actionDesc} សម្រាប់ប្រធានបទ «${topicText}» ក្នុងបរិបទកម្ពុជាពិតប្រាកដ។`
      : isSolo
      ? `ប្លង់សកម្មភាពអ្នកធ្វើបទបង្ហាញទោល (Solo Host)៖ ${leadChar} ${tmpl.actionDesc} ក្នុងបរិយាកាសកម្ពុជាពិតប្រាកដ ដោយគ្មានតួអង្គដទៃឡើយ។`
      : `ប្លង់សកម្មភាពរស់រវើកក្នុងបរិយាកាសកម្ពុជា៖ ${action}។ បរិយាកាសពោរពេញដោយថាមពលវិជ្ជមាន និងការសហការរវាងតួអង្គខ្មែរ។`;

    const imgPrompt = isNoCharacters
      ? `Cinematic documentary B-roll shot illustrating ${topicText} — ${tmpl.titleKh}, authentic Cambodian setting, detailed environmental and conceptual storytelling, clean composition, no human characters. ${styleAnchor}.`
      : isSolo
      ? buildSoloPresenterImagePrompt(leadChar, tmpl.actionDesc, styleAnchor, isDialogueSpeech)
      : buildGroupPresenterImagePrompt(charNames, tmpl.actionDesc, styleAnchor, isDialogueSpeech);

    const videoPrompt = isNoCharacters
      ? `Visual Action: Cinematic camera motion (smooth pan and push-in) capturing visual details, objects, and authentic Cambodian environment for "${topicText} - ${tmpl.titleKh}". Clean documentary B-roll footage, authentic Cambodian setting, smooth 24fps motion, 16:9, no floating text.`
      : isSolo
      ? buildSoloPresenterVideoPrompt(leadChar, tmpl.actionDesc, topicText, styleAnchor, isDialogueSpeech, dialogue)
      : buildGroupPresenterVideoPrompt(charNames, tmpl.actionDesc, topicText, styleAnchor, isDialogueSpeech, dialogue);

    return {
      sceneNumber: num,
      section: tmpl.section,
      sceneTitle: title,
      durationSeconds: 8,
      visualDescription: visualDesc,
      character: charNames,
      characterAction: action,
      narratorScriptKh: narrator,
      characterDialogue: dialogue,
      onScreenText: title,
      aiImagePromptEn: imgPrompt,
      aiVideoPromptEn: videoPrompt,
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

  // Clean repetitive topic/title citations in scenes 2+ and guarantee sequential scene numbers
  const cleanedScenes = sanitizeScriptRepetitions(resultScenes, topicText, ctx.topic);
  return cleanedScenes.map((s, idx) =>
    sanitizeSceneForCast(s, idx, isSolo, isNoCharacters, leadChar, charNames, topicText, styleAnchor, isDialogueSpeech)
  );
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
      "narratorScriptKh": "string (direct spoken lines of character in Khmer: [ឈ្មោះតួអង្គ]៖ «...»)",
      "characterDialogue": "string (spoken dialogue of character in Khmer: [ឈ្មោះតួអង្គ]៖ «...»)",
      "onScreenText": "string (short Khmer on-screen text)",
      "aiImagePromptEn": "string (detailed English AI image prompt ending with the visual style anchor)",
      "aiVideoPromptEn": "string (detailed English AI video prompt describing character speaking on camera in Khmer with natural speech articulation and communicative gestures)",
      "cameraMovement": "string",
      "bgmAndSfx": "string"
    }
  ],
  "musicSuggestions": [
    { "section": "string", "mood": "string", "tempo": "string", "instruments": "string", "usageTip": "string", "aiMusicPromptEn": "string (Detailed English prompt for Suno/Udio/Stable Audio)" }
  ],
  "thumbnail": {
    "headlineKh": "string",
    "subTextKh": "string",
    "visualConcept": "string",
    "aiThumbnailPromptEn": "string (High-CTR English YouTube thumbnail AI prompt)"
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

1. PRESENTER & CAST SETUP RULES (SOLO / TEAM / NO-CHARACTERS):
   - When Presenter & Cast Setup is 'No Characters (Topic Visuals Only)' or 'no-characters':
     * STRICT MANDATE: This video uses NO human character presenters or talking heads!
     * In \`characters\`, define 2–3 conceptual visual assets / moodboard items representing the topic (e.g. Core Topic Visuals, Practical Tools/Artifacts, Cambodian Environmental Setting).
     * In every scene, set \`character\` to 'គ្មានតួអង្គ (Topic Visuals Only)' and \`characterDialogue\` to ''.
     * In \`visualDescription\`, \`characterAction\`, \`aiImagePromptEn\`, and \`aiVideoPromptEn\`, depict dynamic cinematic B-roll, Cambodian environmental shots, physical objects, equipment, diagrams, charts, and motion graphics illustrating the topic hands-on without human characters.
   - When Presenter & Cast Setup is 'solo' or 'Solo Presenter (Strictly 1 Character)' or mentions 'តែម្នាក់' or 'ទោល':
     * STRICT MANDATE: Define EXACTLY ONE single character in \`characters\` (1 solo Cambodian host/presenter, e.g. 'សុខា (អ្នកធ្វើបទបង្ហាញទោល / Solo Host)')!
     * In EVERY SINGLE SCENE, \`character\` MUST be this ONE character only!
     * STRICTLY FORBIDDEN: NEVER invent a second or third character! NO team meetings! NO group conversations! The entire video is carried 100% by this ONE solo presenter!
     * \`characterAction\` and \`visualDescription\` must portray this solo presenter walking, pointing, writing on whiteboards, demonstrating tools, and acting hands-on alone without any partners.
     * In \`characterDialogue\`, it is strictly monologue of the solo host addressing the audience directly or empty string, NEVER multiple characters talking to each other!
     * In \`aiImagePromptEn\` and \`aiVideoPromptEn\`, explicitly specify: "featuring solo Cambodian presenter (<name>), single character in frame, strictly no other characters in frame".
   - When Presenter & Cast Setup is 'duo', define EXACTLY 2 characters who converse and co-host.
   - When Presenter & Cast Setup is a team or drama cast, define 3–5 distinct Cambodian characters in \`characters\` with consistent names, distinct roles (e.g. Team Lead, Technical Specialist, Practitioner, Learner), distinct natural Cambodian appearances, everyday attire, and personalities.
   - Actively showcase these characters interacting, collaborating, problem-solving, and discussing across the scenes!

2. ANTI-TALKING-HEAD MANDATE & DYNAMIC SCENE ACTION:
   - CRITICAL: NEVER create scenes where characters merely stand still facing the camera reading the voiceover script!
   - In EVERY SINGLE SCENE, \`visualDescription\` and \`characterAction\` MUST portray active, tangible physical movements:
     * Walking briskly through Cambodian city streets, markets, or village paths
     * Writing/sketching workflows on whiteboards with team members gathered around exchanging ideas
     * Inspecting equipment, crops, books, documents, products, or laptops hands-on
     * Riding PassApp / bicycles / motorbikes while pointing out real-world landmarks
     * Gathering around tables in lively discussion, shaking hands, gesturing expressively, solving practical challenges
   - CRITICAL SPOKEN DIALOGUE FORMAT: The character(s) themselves deliver the story script directly in natural spoken Khmer! In EVERY SCENE, format \`narratorScriptKh\` as direct character speech: "[ឈ្មោះតួអង្គ]៖ «<ពាក្យសម្ដីតួអង្គនិយាយជាភាសាខ្មែរ>»".
   - In \`characterDialogue\`, provide this exact same spoken dialogue line: "[ឈ្មោះតួអង្គ]៖ «...»".

3. STORY STRUCTURE, COMPREHENSIVE EDUCATIONAL DEPTH & VISUAL SYNCHRONIZATION:
   - CRITICAL REQUIREMENT: Every topic must be deeply and thoroughly explained, never treated with shallow bullet points!
   - STRICT SCRIPT & VISUAL SYNCHRONIZATION (ពាក្យដែលនិយាយ ត្រូវតែស៊ីសង្វាក់ ១០០% ជាមួយរូបភាព និងប្រធានបទ):
     * In EVERY SINGLE SCENE, \`narratorScriptKh\` MUST DIRECTLY match, explain, and illuminate what is visibly happening in \`visualDescription\` and \`characterAction\` (or topic visual)!
     * What the audience sees with their eyes MUST match what they hear with their ears:
       - If the visual shows examining a financial spreadsheet or scanning a KHQR code on a smartphone, the script MUST explain budget tracking, digital recording, and calculations.
       - If the visual shows testing a farming tool or inspecting crops in a field, the script MUST explain the agricultural technique and tangible results.
       - If the visual shows writing workflows on a whiteboard with team members, the script MUST explain the exact step-by-step methodology and planning.
     * FORBIDDEN: NEVER write generic, abstract text in \`narratorScriptKh\` that disconnects from the physical scene, objects, and actions shown!
   - STRICT ANTI-TITLE-REPETITION MANDATE (ហាមដាច់ខាតយកចំណងជើង ឬឈ្មោះ TOPIC មកនិយាយឡើងវិញដដែលៗគ្រប់ឈុត):
     * The video title or full topic phrase may ONLY be spoken ONCE in Scene 1 (The Hook & Introduction) to introduce the subject.
     * From Scene 2 to Scene ${targetScenes}: ABSOLUTELY DO NOT repeat the full video title or topic phrase!
     * DO NOT start or fill sentences with repetitive robotic phrases like "ចំពោះ «${input.topic}»", "ក្នុង «${input.topic}»", or "នៃ «${input.topic}»".
     * Instead, speak naturally using contextual Khmer reference terms like «បញ្ហានេះ», «វិធីសាស្ត្រនេះ», «ដំណោះស្រាយនេះ», «ជំហានបន្ទាប់», «ការអនុវត្តនេះ» or dive straight into the practical explanation.
   - GENRE-SPECIFIC STORYTELLING TONE (HORROR, COMEDY, FOLKTALES):
     * When Topic or Category is Horror/Ghost (ខ្មោច, ព្រាយ, រន្ធត់, ព្រឺព្រួច, horror, ghost):
       - Deliver spine-tingling Cambodian ghost story suspense, eerie rural or deserted Cambodian settings (creepy banyan trees, lonely midnight bridges, cold mist, distant barking dogs, haunting shadows).
       - Balance scary hair-raising tension with moral respect for Cambodian spiritual beliefs and ancestors, ending with a profound moral lesson or resolution.
     * When Topic or Category is Comedy/Humor (កំប្លែង, សើច, កំប្លុកកំប្លែង, comedy, humor):
       - Deliver hilarious situational comedy, amusing misunderstandings, witty dialogue, funny physical slapstick gestures, and joyful Khmer village/city antics.
       - Characters have comical expressions, shocked reactions, and lively banter that makes viewers laugh out loud while still providing heartwarming takeaways.
     * When Topic or Category is Khmer Folktales & Legends (រឿងព្រេង, និទាន, បុរាណ, សម័យ, folktale, legend):
       - For Ancient Legends: Recreate iconic Cambodian folklore (Tum Teav, Pos Keng Kang, Neang Kangrei, Thononchey, Phnum Pros Phnum Srei) with majestic cultural dignity, traditional attire, and ancestral moral wisdom.
       - For Modern Folktales: Transform contemporary Cambodian life situations (technology, ambition, family, honesty) into inspiring moral fables with heartwarming life lessons.
     * When Topic or Category is Khmer Magic, Sorcery & Mythic Battles (មន្តអាគមន៍, យុទ្ធសិល្ប៍, ខ្មោចព្រាយបីសាច, sorcery, magic, demon, battle):
       - Deliver thrilling supernatural fantasy action combining ancient Khmer martial arts (Bokator / Yuthakun Khom) and sacred magic (Pali mantras, yantra tattoos, enchanted blades, holy amulets, element spells).
       - Portray epic battles between righteous practitioners (Master sorcerers, heroic warriors) and dark occult evils (witches, Pretas, Pisach, Ahp, Krahang, evil spirits).
       - Maintain deep respect for Khmer spiritual traditions, moral values of dharma overcoming adharma (ធម៌ឈ្នះអធម៌), and protecting villagers.
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
   - When the selected style is 'Photorealistic Live-Action Style (Real Cambodian Humans • 8K Photography)' or mentions 'photorealistic', 'Real Human', or 'មនុស្សពិត':
     * STRICT MANDATE: This project features REAL HUMAN BEINGS (Ultra-Photorealistic Live-Action Photography)!
     * STRICTLY FORBIDDEN: DO NOT describe characters or scenes as cartoon, anime, 2D vector, Pixar, or 3D CGI!
     * Portray real human Cambodian actors with natural facial anatomy, real skin texture with visible skin pores, natural eye reflections, realistic everyday Cambodian clothing fabrics, and natural Southeast Asian hairstyles.
     * In \`aiCharacterImagePromptEn\`, write prompts for photorealistic portrait photography turnaround (shot on 85mm portrait lens, natural studio lighting, 8k resolution).
     * In every scene's \`aiImagePromptEn\`, generate prompts for ultra-photorealistic 35mm/85mm photography, natural golden hour lighting, depth of field, 8k resolution.
     * In every scene's \`aiVideoPromptEn\`, describe cinematic live-action 4K camera footage featuring real people moving naturally at 24fps.
   - ALL characters MUST be authentically Cambodian (Khmer) with natural Cambodian facial features, warm light-brown/tan skin tone, black hair, and realistic Cambodian everyday attire (or Cambodian school uniforms / subtle Khmer krama scarf details where appropriate).
   - ALL landscapes, streets, homes, and backgrounds MUST reflect authentic Cambodia — including BOTH Cambodian countryside (golden rice fields, sugar palm trees / Borassus palms, traditional Khmer wooden stilt houses, lotus ponds, red-earth village paths, distant pagoda roofs) AND Cambodian cityscapes (Phnom Penh shophouses, Chaktomuk riverside promenade, Cambodian coffee shops, tuk-tuks / PassApp, tropical boulevard trees).
   - Whenever a shop, café, cart, market, school, or business appears in a scene, explicitly include authentic clean Khmer script on its natural storefront signboard (e.g., signboard reading "កាហ្វេតារា", "ហាងសុខា", "វិទ្យាល័យ", "ផ្សារទំនើប") while avoiding floating subtitles or random English watermarks.
   - Define memorable recurring Cambodian characters in \`characters\` with exact clothing, hair, age, and colors, and repeat those exact visual descriptors in EVERY \`aiImagePromptEn\` where they appear so there are NO random character changes.
   - End or frame every \`aiImagePromptEn\` with the visual style anchor: "${styleAnchor}".
   - Put on-screen overlay titles in \`onScreenText\` (separate from natural Khmer shop signboards inside the world).

6. RESEARCH & ACCURACY RULES:
   - Use verifiable facts; never invent fake statistics or fake historical quotes.
   - If illustrating a principle with fictional characters, clearly state in \`isFictionalNote\` that the characters/story are fictional educational examples.

${
  input.presenterSetup === 'no-characters'
    ? `7. TOPIC VISUALS & B-ROLL RULES (NO HUMAN CHARACTERS):
   - In \`aiVideoPromptEn\`, focus purely on dynamic cinematic B-roll, objects, infographics, and camera movement illustrating «${input.topic}».
   - No human characters appear. Clean 24fps motion, authentic Cambodian atmosphere, 16:9, no floating text.`
    : `7. CHARACTER SPEAKING & ACTING DELIVERY IN KHMER (តួអង្គនិយាយផ្ទាល់តាម SCRIPT សាច់រឿង ជាភាសាខ្មែរ) — CRITICAL MANDATORY RULE:
   - In EVERY scene where characters appear, the character MUST speak their lines directly in the scene according to the script!
   - In \`narratorScriptKh\`, write the character's direct spoken lines formatted as: "[ឈ្មោះតួអង្គ]៖ «<សម្ដីតួអង្គនិយាយផ្ទាល់ជាភាសាខ្មែរ>»".
   - In \`characterDialogue\`, write the same exact spoken dialogue line: "[ឈ្មោះតួអង្គ]៖ «<សម្ដីតួអង្គនិយាយផ្ទាល់ជាភាសាខ្មែរ>»".
   - The character is the active speaker/storyteller! Do NOT write as a detached 3rd-person voiceover.
   - If Solo Presenter: The single lead character speaks directly on camera to the viewers throughout the scenes (e.g. សុខា៖ «សួស្តីបងប្អូនទាំងអស់គ្នា! ថ្ងៃនេះខ្ញុំនឹងបង្ហាញពី...»).
   - If Duo or Group: Characters alternate natural conversational dialogue between each other (e.g. Scene 1: វិចិត្រ៖ «...», Scene 2: បុប្ផា៖ «...»).
   - In \`characterAction\`, describe the character on camera speaking with natural mouth movement, expressive facial animation, and lively communicative hand gestures.
   - In \`aiVideoPromptEn\`, describe authentic on-camera character acting and spoken delivery:
     Format: "Visual Action: Expressive animated character acting and spoken delivery: Cambodian character <character>, actively speaking on camera in Khmer with natural speech articulation, engaging facial expressions, and communicative hand gestures while acting out: <action>, illustrating \"${input.topic}\". Smooth cinematic 24fps motion, authentic Cambodian setting, 16:9, no floating text."
     (If Photorealistic Real Human style: "Visual Action: Cinematic 4K live-action character acting and spoken delivery: authentic real Cambodian character <character>, actively speaking directly on camera in Khmer with natural mouth movements, genuine conversational expressions, and communicative hand gestures while presenting: <action>, illustrating \"${input.topic}\". Single real person in frame, natural lighting, smooth 24fps motion, 16:9, no floating text.")
   - STRICTLY FORBIDDEN: NEVER write "characters do not speak", "silent cinematic action", or "no dialogue or lip-sync"!
   - STRICTLY FORBIDDEN: DO NOT mention external "AI lip-sync software" or "Hedra / LivePortrait". Keep the video prompt as high-quality natural character performance for direct video generation!
   - In \`aiImagePromptEn\`, portray the character in an active, engaging speaking pose with natural facial expression and communicative gestures.`
}

8. YOUTUBE THUMBNAIL & BACKGROUND MUSIC MANDATES (100% TOPIC-TAILORED):
   - THUMBNAIL GENERATION MANDATE:
     * Must be 100% specifically tailored to the topic «${input.topic}».
     * \`headlineKh\`: Short, punchy, high-CTR Khmer text (3–6 words) suitable for thumbnail graphic text (e.g. «៧ មេរៀនរកស៊ីជោគជ័យ», «កុំធ្វើ ៥ កំហុសនេះ!»).
     * \`subTextKh\`: Short curiosity hook badge in Khmer (e.g. «ក្បួនជោគជ័យពិត», «ដឹងមុនមិនស្តាយក្រោយ»).
     * \`visualConcept\`: High-CTR visual concept plan in Khmer describing the composition, lighting, and focal point.
     * \`aiThumbnailPromptEn\`: Ultra high-CTR professional YouTube thumbnail prompt in English formatted for Midjourney / Ideogram / Flux:
       - If Presenter & Cast Setup is 'no-characters' (Topic Visuals Only): STRICTLY NO human characters! Create a breathtaking, glowing central visual metaphor, 3D infographic, or iconic Cambodian artifact representing «${input.topic}» under cinematic rim lighting and bokeh lights.
       - If characters exist: Show an expressive Cambodian character with a dynamic, curious, or excited facial expression, wide eyes, pointing towards a luminous visual metaphor representing the core essence of «${input.topic}».
       - Authentic Cambodian elements (sugar palm tree silhouettes, Angkorian accents, or modern Phnom Penh skyline in the distant warm background).
       - Vibrant complementary colors (warm amber & deep teal, golden neon accents), rule of thirds, clean uncluttered focal subject.
       - End with: "YouTube thumbnail composition, clean focal point, hyper-detailed, vibrant cinematic lighting, 16:9 aspect ratio, no blurry artifacts, no text watermarks, 8k render."
   - BACKGROUND MUSIC SUGGESTIONS & AI MUSIC PROMPTS:
     * Provide 2 to 3 distinct music cues in \`musicSuggestions\` matching the emotional journey of «${input.topic}»:
       1) ផ្នែកផ្ដើម (Intro / Hook) — Captivating, intriguing, curiosity-inducing
       2) សាច់រឿងកណ្ដាល (Main Story / Deep Dive) — Focused, rhythmic, professional educational groove
       3) សង្ខេប & CTA (Conclusion / Climax) — Warm, inspiring, uplifting, motivating
     * In each entry, \`aiMusicPromptEn\` MUST provide a ready-to-copy AI Music Prompt for Suno AI / Udio / Stable Audio specifying:
       Format: "[Instrumental <Genre/Style>] [Tempo: <BPM>] [Mood: <Mood tags>] [Instruments: <Key instruments, e.g. soft acoustic piano, Khmer roneat or flutes if cultural, subtle ambient pads>] [Style: Clean educational documentary background music, balanced frequency range for voiceover, no vocals]"${jsonShapeBlock}

Return ONLY valid JSON.`;
}
