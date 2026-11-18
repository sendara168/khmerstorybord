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
              'Complete, natural, grammatically accurate Khmer narrator voiceover sentence(s) that match the visual action and connect smoothly to adjacent scenes.',
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
              'Detailed AI video animation prompt combining smooth 2D character movement, camera motion, AND explicit spoken Khmer narration instruction: Spoken Khmer Narration (Khmer Male Voice, clear natural Khmer): "<exact Khmer narratorScriptKh>" plus any Khmer character dialogue and background SFX.',
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

export function buildGenerationPrompt(input, includeExplicitJsonShape = false) {
  const styleAnchor = STYLE_ANCHORS[input.animationStyle] || STYLE_ANCHORS['2d-cartoon'];
  const targetScenes = Math.min(60, Math.max(8, Number(input.targetScenes) || 24));

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
- Language for Script, Titles, Visual Descriptions, Subtitles: Natural, grammatically accurate Khmer (ភាសាខ្មែរ)
- Language for AI Image Prompts, AI Video Animation Prompts, and AI Thumbnail Prompt: English
- Target Video Duration: ${input.durationLabel}
- Exact Scene Count: Generate ${targetScenes} sequential scenes (numbered 1 to ${targetScenes}), each 6 to 10 seconds long.
- Video Format: 16:9 (1920x1080)
- Animation Style: ${input.animationStyleLabel}
- Narrator Voice: ${input.narratorVoice || 'Khmer Male Voice'} (Natural, Clear, Professional, Engaging)
${input.customNotes ? `- Special User Instructions: ${input.customNotes}` : ''}

STRICT QUALITY RULES:
1. STORY STRUCTURE:
   - A. INTRODUCTION (~12% of scenes): Start with an intriguing hook question, show the relatable problem, introduce the topic.
   - B. MAIN STORY (~60% of scenes): Explain step-by-step with concrete relatable character scenarios and examples.
   - C. IMPORTANT LESSONS (~18% of scenes): Summarize actionable takeaways and practical solutions.
   - D. CONCLUSION (~10% of scenes): Memorable closing message + warm invitation to Like, Share, and Subscribe in Khmer.

2. KHMER NARRATOR SCRIPT RULES:
   - Write complete, rich, natural Khmer sentences ready to read aloud immediately by a voice actor.
   - NEVER write bare bullet points or headings as narrator script.
   - Connect every scene smoothly to the next scene like a polished documentary storyteller.
   - Ensure the narrator script ALWAYS matches what is visually happening in that scene.
   - Avoid repetitive phrasing.

3. CAMBODIAN (KHMER) CULTURAL & VISUAL CONSISTENCY RULES:
   - ALL characters MUST be authentically Cambodian (Khmer) with natural Cambodian facial features, warm light-brown/tan skin tone, black hair, and realistic Cambodian everyday attire (or Cambodian school uniforms / subtle Khmer krama scarf details where appropriate).
   - ALL landscapes, streets, homes, and backgrounds MUST reflect authentic Cambodia — including BOTH Cambodian countryside (golden rice fields, sugar palm trees / Borassus palms, traditional Khmer wooden stilt houses, lotus ponds, red-earth village paths, distant pagoda roofs) AND Cambodian cityscapes (Phnom Penh shophouses, Chaktomuk riverside promenade, Cambodian coffee shops, tuk-tuks / PassApp, tropical boulevard trees).
   - Whenever a shop, café, cart, market, school, or business appears in a scene, explicitly include authentic clean Khmer script on its natural storefront signboard (e.g., signboard reading "កាហ្វេតារា", "ហាងសុខា", "វិទ្យាល័យ", "ផ្សារទំនើប") while avoiding floating subtitles or random English watermarks.
   - Define 1–3 memorable recurring Cambodian characters in \`characters\` with exact clothing, hair, age, and colors, and repeat those exact visual descriptors in EVERY \`aiImagePromptEn\` where they appear so there are NO random character changes.
   - End or frame every \`aiImagePromptEn\` with the visual style anchor: "${styleAnchor}".
   - Put on-screen overlay titles in \`onScreenText\` (separate from natural Khmer shop signboards inside the world).

4. RESEARCH & ACCURACY RULES:
   - Use verifiable facts; never invent fake statistics or fake historical quotes.
   - If illustrating a principle with fictional characters, clearly state in \`isFictionalNote\` that the characters/story are fictional educational examples.${jsonShapeBlock}

Return ONLY valid JSON.`;
}
