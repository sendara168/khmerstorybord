import type {
  CharacterProfile,
  StoryboardProject,
  StoryboardScene,
  StorySection,
} from '../types/storyboard';

const SECTION_LABELS: Record<StorySection, string> = {
  INTRODUCTION: 'A. ផ្នែកផ្ដើម (INTRODUCTION)',
  MAIN_STORY: 'B. សាច់រឿងសំខាន់ (MAIN STORY)',
  IMPORTANT_LESSONS: 'C. មេរៀនសំខាន់ៗ (IMPORTANT LESSONS)',
  CONCLUSION: 'D. សេចក្ដីបញ្ចប់ (CONCLUSION)',
};

export function getSectionLabel(section: StorySection): string {
  return SECTION_LABELS[section] || section;
}

export function getCharacterImagePrompt(
  character: CharacterProfile,
  animationStyleLabel = '2D Cartoon Cambodian Educational Animation'
): string {
  if (character.aiCharacterImagePromptEn && character.aiCharacterImagePromptEn.trim()) {
    return character.aiCharacterImagePromptEn.trim();
  }
  return `Authentic Cambodian (Khmer) 2D cartoon character design turnaround reference sheet of ${character.name} (${character.role}), natural Cambodian facial features and warm light-tan Southeast Asian skin tone, ${character.appearance}, wearing ${character.outfit}, ${character.personality}. Full-body front view, 3/4 view, and 3 expressive facial expressions (happy, thoughtful, surprised), clean solid neutral light cream background, ${animationStyleLabel}, clean cel-shaded vector style, warm cinematic lighting, consistent proportions and colors, 16:9 composition, no floating watermarks.`;
}

export function buildKhmerSpeakingVideoPrompt(
  scene: StoryboardScene,
  project: Pick<
    StoryboardProject,
    'narratorVoice' | 'voiceTone' | 'animationStyleLabel' | 'videoFormat'
  >
): string {
  const baseMotion = (scene.aiVideoPromptEn || '').trim();
  const hasKhmerBlock =
    /Spoken Khmer|Khmer Narration|Khmer Male Voice|និយាយជាភាសាខ្មែរ/i.test(baseMotion) &&
    scene.narratorScriptKh &&
    baseMotion.includes(scene.narratorScriptKh.slice(0, 18));

  if (hasKhmerBlock) {
    return baseMotion;
  }

  const narratorVoice = project.narratorVoice || 'Khmer Male Voice';
  const voiceTone = project.voiceTone || 'Natural, Clear, Professional, Engaging';
  const styleLabel = project.animationStyleLabel || '2D Cartoon Educational Animation';
  const format = project.videoFormat || '16:9';

  const parts: string[] = [];
  if (baseMotion) {
    parts.push(`Visual Motion: ${baseMotion}`);
  }
  if (scene.cameraMovement?.trim()) {
    parts.push(`Camera Movement: ${scene.cameraMovement.trim()}.`);
  }
  if (scene.narratorScriptKh?.trim()) {
    parts.push(
      `Spoken Khmer Narration (${narratorVoice}, ${voiceTone}, speak clearly in natural Khmer language): "${scene.narratorScriptKh.trim()}"`
    );
  }
  if (scene.characterDialogue?.trim()) {
    parts.push(
      `Character Dialogue (spoken in natural Khmer language with matching lip-sync): "${scene.characterDialogue.trim()}"`
    );
  }
  if (scene.bgmAndSfx?.trim()) {
    parts.push(`Background Music & SFX: ${scene.bgmAndSfx.trim()}.`);
  }
  parts.push(
    `Style & Specs: ${styleLabel}, authentic Cambodian (Khmer) characters and Cambodian scenery, keep natural Khmer script on shop/school signboards legible if present, ${format}, ${scene.durationSeconds || 8} seconds, smooth consistent character motion, clear Khmer audio pronunciation, no floating subtitles or English watermarks.`
  );

  return parts.join('\n');
}

export function formatSrtTime(totalSeconds: number): string {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = Math.floor(totalSeconds % 60);
  const ms = Math.round((totalSeconds - Math.floor(totalSeconds)) * 1000);
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
}

export function formatClock(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function generateKhmerSrt(project: StoryboardProject): string {
  let cursor = 0;
  const blocks: string[] = [];

  project.scenes.forEach((scene, index) => {
    const duration = Math.max(3, Number(scene.durationSeconds) || 8);
    const start = formatSrtTime(cursor);
    const end = formatSrtTime(cursor + duration);
    cursor += duration;

    const lines = [scene.narratorScriptKh.trim()];
    if (scene.characterDialogue?.trim()) {
      lines.push(scene.characterDialogue.trim());
    }

    blocks.push(`${index + 1}\n${start} --> ${end}\n${lines.join('\n')}`);
  });

  return blocks.join('\n\n') + '\n';
}

export function generateFullArticleOnly(project: StoryboardProject): string {
  const totalSec = project.scenes.reduce((acc, s) => acc + (s.durationSeconds || 8), 0);
  const lines: string[] = [
    `ចំណងជើងវីដេអូ៖ ${project.videoTitle}`,
    `ប្រធានបទ៖ ${project.topic}`,
    `ប្រភេទ៖ ${project.categoryLabelKh}`,
    `រយៈពេលប៉ាន់ស្មាន៖ ${formatClock(totalSec)} (${project.scenes.length} ឈុត) | សំឡេង៖ ${project.narratorVoice}`,
    `====================================================================`,
    ``,
  ];

  let lastSection: StorySection | null = null;
  for (const scene of project.scenes) {
    if (scene.section !== lastSection) {
      lines.push(`【${getSectionLabel(scene.section)}】`);
      lines.push('');
      lastSection = scene.section;
    }
    lines.push(scene.narratorScriptKh.trim());
    if (scene.characterDialogue?.trim()) {
      lines.push(`   ${scene.characterDialogue.trim()}`);
    }
    lines.push('');
  }

  return lines.join('\n').trim() + '\n';
}

export function generateStandaloneNarratorScript(project: StoryboardProject): string {
  const header = [
    `====================================================================`,
    `COMPLETE NARRATOR SCRIPT (KHMER VOICEOVER ONLY)`,
    `====================================================================`,
    `ចំណងជើងវីដេអូ: ${project.videoTitle}`,
    `ប្រធានបទ: ${project.topic}`,
    `សំឡេងអ្នកនិទាន: ${project.narratorVoice} (${project.voiceTone})`,
    `ចំនួនឈុតសរុប: ${project.scenes.length} ឈុត | រយៈពេលប៉ាន់ស្មាន: ${formatClock(
      project.scenes.reduce((acc, s) => acc + (s.durationSeconds || 8), 0)
    )}`,
    `====================================================================`,
    ``,
  ];

  let lastSection: StorySection | null = null;
  const body: string[] = [];

  for (const scene of project.scenes) {
    if (scene.section !== lastSection) {
      body.push(`\n--- ${getSectionLabel(scene.section)} ---\n`);
      lastSection = scene.section;
    }
    const num = String(scene.sceneNumber).padStart(2, '0');
    body.push(`[Scene ${num} – ${scene.sceneTitle} | ${scene.durationSeconds}s]`);
    body.push(scene.narratorScriptKh.trim());
    if (scene.characterDialogue?.trim()) {
      body.push(`(សន្ទនាតួអង្គ: ${scene.characterDialogue.trim()})`);
    }
    body.push('');
  }

  return [...header, ...body].join('\n');
}

export function generatePromptsBatch(project: StoryboardProject): string {
  const lines: string[] = [
    `# AI CHARACTER, SCENE IMAGE & KHMER-SPEAKING VIDEO PROMPTS BATCH`,
    `# Video: ${project.videoTitle}`,
    `# Style: ${project.animationStyleLabel} | Format: ${project.videoFormat} (${project.resolution})`,
    ``,
    `====================================================================`,
    `PART 1: AI CHARACTER REFERENCE IMAGE PROMPTS (តួអង្គនីមួយៗ)`,
    `====================================================================`,
  ];

  for (const char of project.characters) {
    lines.push(`[Character: ${char.name} — ${char.role}]`);
    lines.push(getCharacterImagePrompt(char, project.animationStyleLabel));
    lines.push('');
  }

  lines.push(`====================================================================`);
  lines.push(`PART 2: AI SCENE IMAGE PROMPTS (រូបភាពតាម Scenes នីមួយៗ)`);
  lines.push(`====================================================================`);

  for (const scene of project.scenes) {
    const num = String(scene.sceneNumber).padStart(2, '0');
    lines.push(`[Scene ${num} - ${scene.sceneTitle}]`);
    lines.push(scene.aiImagePromptEn);
    lines.push('');
  }

  lines.push(`====================================================================`);
  lines.push(`PART 3: AI VIDEO PROMPTS WITH KHMER VOICEOVER (វីដេអូនិយាយភាសាខ្មែរតាម Scenes នីមួយៗ)`);
  lines.push(`====================================================================`);

  for (const scene of project.scenes) {
    const num = String(scene.sceneNumber).padStart(2, '0');
    lines.push(`[Scene ${num} - ${scene.sceneTitle} | ${scene.durationSeconds}s]`);
    lines.push(buildKhmerSpeakingVideoPrompt(scene, project));
    lines.push('');
  }

  lines.push(`====================================================================`);
  lines.push(`PART 4: YOUTUBE THUMBNAIL PROMPT`);
  lines.push(`====================================================================`);
  lines.push(`Headline (Khmer): ${project.thumbnail.headlineKh}`);
  lines.push(`Sub-text (Khmer): ${project.thumbnail.subTextKh}`);
  lines.push(`AI Prompt (English):`);
  lines.push(project.thumbnail.aiThumbnailPromptEn);
  lines.push('');

  return lines.join('\n');
}

export function generateCopyReadyFullPackage(project: StoryboardProject): string {
  const totalSec = project.scenes.reduce((sum, s) => sum + (s.durationSeconds || 8), 0);
  const lines: string[] = [
    `====================================================================`,
    `ឯកសារផលិតវីដេអូពេញលេញ (FULL COPY-READY TOPIC PACKAGE)`,
    `====================================================================`,
    `ចំណងជើងវីដេអូ៖ ${project.videoTitle}`,
    `ប្រធានបទ៖ ${project.topic}`,
    `ប្រភេទ៖ ${project.categoryLabelKh}`,
    `រយៈពេល៖ ${project.durationLabel} (${formatClock(totalSec)} / ${project.scenes.length} ឈុត)`,
    `ទម្រង់៖ ${project.videoFormat} (${project.resolution}) | ស្ទីល៖ ${project.animationStyleLabel}`,
    `សំឡេងអ្នកនិទាន៖ ${project.narratorVoice} (${project.voiceTone})`,
    ``,
    `--- ១. ការពិពណ៌នាវីដេអូ (YouTube Description) ---`,
    project.videoDescription,
    ``,
    `--- ២. អត្ថបទ Script អ្នកនិទានពេញលេញ (Full Khmer Article / Script) ---`,
    '',
  ];

  let lastSection: StorySection | null = null;
  for (const scene of project.scenes) {
    if (scene.section !== lastSection) {
      lines.push(`【${getSectionLabel(scene.section)}】`);
      lastSection = scene.section;
    }
    lines.push(scene.narratorScriptKh.trim());
    if (scene.characterDialogue?.trim()) {
      lines.push(`   ${scene.characterDialogue.trim()}`);
    }
    lines.push('');
  }

  lines.push(`--- ៣. Prompt បង្កើតរូបភាពតួអង្គ (Character Reference Image Prompts) ---`);
  lines.push('');
  project.characters.forEach((c, idx) => {
    lines.push(`${idx + 1}. ${c.name} (${c.role})`);
    lines.push(`   រូបរាង៖ ${c.appearance} | សម្លៀកបំពាក់៖ ${c.outfit}`);
    lines.push(`   Prompt រូបភាពតួអង្គ៖`);
    lines.push(`   ${getCharacterImagePrompt(c, project.animationStyleLabel)}`);
    lines.push('');
  });

  lines.push(`--- ៤. Storyboard & Prompts តាមឈុតនីមួយៗ (រូបភាព + វីដេអូនិយាយភាសាខ្មែរ) ---`);
  lines.push('');
  for (const scene of project.scenes) {
    const num = String(scene.sceneNumber).padStart(2, '0');
    lines.push(`==================================================`);
    lines.push(`SCENE ${num}: ${scene.sceneTitle} (${scene.durationSeconds}s)`);
    lines.push(`==================================================`);
    lines.push(`អត្ថបទអ្នកនិទាន (Khmer): ${scene.narratorScriptKh}`);
    if (scene.characterDialogue?.trim()) {
      lines.push(`សន្ទនាតួអង្គ: ${scene.characterDialogue}`);
    }
    if (scene.onScreenText?.trim()) {
      lines.push(`អក្សរលើអេក្រង់: ${scene.onScreenText}`);
    }
    lines.push(`តួអង្គ & សកម្មភាព: ${scene.character} — ${scene.characterAction}`);
    lines.push('');
    lines.push(`[PROMPT រូបភាព SCENE ${num}]`);
    lines.push(scene.aiImagePromptEn);
    lines.push('');
    lines.push(`[PROMPT វីដេអូនិយាយភាសាខ្មែរ SCENE ${num}]`);
    lines.push(buildKhmerSpeakingVideoPrompt(scene, project));
    lines.push('');
  }

  lines.push(`--- ៥. YouTube Thumbnail Prompt ---`);
  lines.push(`ចំណងជើងលើ Thumbnail: ${project.thumbnail.headlineKh} — ${project.thumbnail.subTextKh}`);
  lines.push(`គំនិតរចនា: ${project.thumbnail.visualConcept}`);
  lines.push(`AI Thumbnail Prompt:`);
  lines.push(project.thumbnail.aiThumbnailPromptEn);
  lines.push('');

  return lines.join('\n');
}

export function generateFullMarkdownPackage(project: StoryboardProject): string {
  const totalSec = project.scenes.reduce((sum, s) => sum + (s.durationSeconds || 8), 0);

  const lines: string[] = [
    `# ${project.videoTitle}`,
    ``,
    `- **ប្រភេទ (Category):** ${project.categoryLabelKh}`,
    `- **ប្រធានបទ (Topic):** ${project.topic}`,
    `- **រយៈពេល (Duration):** ${project.durationLabel} (សរុប ${formatClock(totalSec)} / ${project.scenes.length} ឈុត)`,
    `- **ទម្រង់វីដេអូ (Format):** ${project.videoFormat} (${project.resolution})`,
    `- **ស្ទីល Animation:** ${project.animationStyleLabel}`,
    `- **អ្នកនិទាន (Narrator):** ${project.narratorVoice} — ${project.voiceTone}`,
    `- **កំណត់សម្គាល់ភាពត្រឹមត្រូវ (Accuracy Note):** ${project.isFictionalNote}`,
    ``,
    `## 1. ការពិពណ៌នាវីដេអូ (Video Description)`,
    ``,
    project.videoDescription,
    ``,
    `## 2. តួអង្គសំខាន់ & AI Character Image Prompts (Character Consistency Sheet)`,
    ``,
    ...project.characters.flatMap((c) => [
      `### ${c.name} (${c.role})`,
      `- **រូបរាង៖** ${c.appearance}`,
      `- **សម្លៀកបំពាក់៖** ${c.outfit}`,
      `- **បុគ្គលិកលក្ខណៈ៖** ${c.personality}`,
      `- **AI Character Image Prompt (English):** \`${getCharacterImagePrompt(
        c,
        project.animationStyleLabel
      )}\``,
      ``,
    ]),
    `## 3. គ្រោងសាច់រឿង (Main Story Outline)`,
    ``,
    ...project.outline.flatMap((o) => [
      `### ${getSectionLabel(o.section)} — ${o.titleKh}`,
      o.summary,
      ...o.keyPoints.map((kp) => `- ${kp}`),
      ``,
    ]),
    `## 4. Script អ្នកនិទានពេញលេញ (Complete Standalone Narrator Script)`,
    ``,
    ...project.scenes.flatMap((s) => [
      `**Scene ${String(s.sceneNumber).padStart(2, '0')} – ${s.sceneTitle}** (${s.durationSeconds}s)`,
      `> ${s.narratorScriptKh}`,
      ...(s.characterDialogue ? [`> *សន្ទនា៖ ${s.characterDialogue}*`] : []),
      ``,
    ]),
    `## 5. Storyboard តាមឈុត (Scene-by-Scene Storyboard)`,
    ``,
    ...project.scenes.flatMap((s) => [
      `### Scene ${String(s.sceneNumber).padStart(2, '0')}: ${s.sceneTitle} (${s.durationSeconds}s)`,
      `- **ផ្នែក:** ${getSectionLabel(s.section)}`,
      `- **Visual Description:** ${s.visualDescription}`,
      `- **Character:** ${s.character}`,
      `- **Character Action:** ${s.characterAction}`,
      `- **Narrator Script (Khmer):** ${s.narratorScriptKh}`,
      `- **Character Dialogue:** ${s.characterDialogue || '—'}`,
      `- **On-screen Text:** ${s.onScreenText || '—'}`,
      `- **AI Image Prompt (English):** \`${s.aiImagePromptEn}\``,
      `- **AI Video Prompt (Khmer Voiceover):**`,
      `\`\`\`text`,
      buildKhmerSpeakingVideoPrompt(s, project),
      `\`\`\``,
      `- **Camera Movement:** ${s.cameraMovement}`,
      `- **Background Music / SFX:** ${s.bgmAndSfx}`,
      ``,
    ]),
    `## 6. ភ្លេងផ្ទៃខាងក្រោយ (Background Music Suggestions)`,
    ``,
    ...project.musicSuggestions.map(
      (m) => `- **${m.section}:** ${m.mood} (${m.tempo}) — ${m.instruments}. *${m.usageTip}*`
    ),
    ``,
    `## 7. YouTube Thumbnail Prompt`,
    ``,
    `- **Headline (Khmer):** ${project.thumbnail.headlineKh}`,
    `- **Sub-text (Khmer):** ${project.thumbnail.subTextKh}`,
    `- **Visual Concept:** ${project.thumbnail.visualConcept}`,
    `- **AI Thumbnail Prompt (English):**`,
    `\`\`\`text`,
    project.thumbnail.aiThumbnailPromptEn,
    `\`\`\``,
    ``,
    `## 8. អក្សររត់ខ្មែរ (Khmer Subtitle SRT)`,
    ``,
    `\`\`\`srt`,
    generateKhmerSrt(project).trim(),
    `\`\`\``,
    ``,
  ];

  return lines.join('\n');
}

export function buildSyncPromptsForWeb(project: StoryboardProject): string {
  const charSummary = project.characters
    .map(
      (c, i) =>
        `${i + 1}. ${c.name} (${c.role}) — Appearance: ${c.appearance} | Outfit: ${c.outfit} | Personality: ${c.personality}`
    )
    .join('\n');

  const scenesSummary = project.scenes
    .map((s) => {
      const num = String(s.sceneNumber).padStart(2, '0');
      return `Scene ${num} [${s.section} | ${s.durationSeconds}s | Camera: ${s.cameraMovement}]
- Title: ${s.sceneTitle}
- Character: ${s.character} | Action: ${s.characterAction}
- Visual: ${s.visualDescription}
- Khmer Narrator Script: "${s.narratorScriptKh}"${
        s.characterDialogue?.trim() ? `\n- Character Khmer Dialogue: "${s.characterDialogue.trim()}"` : ''
      }`;
    })
    .join('\n\n');

  return `You are an expert Cambodian 2D animation art director and AI prompt engineer.
Rewrite and synchronize ALL AI prompts below so that:
1. ALL characters are authentically Cambodian (Khmer) with natural Southeast Asian Cambodian features and consistent exact outfits across EVERY scene.
2. ALL landscapes and environments are authentically Cambodian — both rural Cambodian countryside (sugar palm trees, rice paddies, wooden stilt houses, lotus ponds, village schools) and Cambodian cities (Phnom Penh shophouses, Chaktomuk riverside, tuk-tuks, Cambodian cafés).
3. Whenever a shop, café, cart, market, or school appears, include authentic clean Khmer script on the natural storefront signboard (e.g., signboard reading "កាហ្វេតារា", "ហាងសុខា", "វិទ្យាល័យ"), with NO floating subtitles or English watermarks.
4. EVERY Scene Image Prompt strictly illustrates what the Khmer Narrator Script is saying in that scene.
5. EVERY Scene Video Prompt describes smooth visual motion, camera movement, AND explicitly instructs the AI video generator to SPEAK IN NATURAL KHMER LANGUAGE using the exact Khmer Narrator Script (and any Khmer character dialogue) for that scene!
6. ACTIVE DYNAMIC ACTIONS (NO STATIC TALKING HEADS): Ensure all Scene Image Prompts and Video Prompts depict tangible active physical movements (team members collaborating around desks/whiteboards, walking briskly through Cambodian streets/markets, demonstrating tools/workflows hands-on, expressive gestures and lively interactions) rather than characters standing still facing the camera.

VIDEO INFO:
- Title: ${project.videoTitle}
- Topic: ${project.topic}
- Style: ${project.animationStyleLabel} (${project.videoFormat}, ${project.resolution})
- Narrator Voice: ${project.narratorVoice} (${project.voiceTone})

CHARACTERS:
${charSummary}

SCENES & KHMER NARRATOR SCRIPT:
${scenesSummary}

Return ONLY valid JSON inside a \`\`\`json code block using this exact structure:
\`\`\`json
{
  "characters": [
    {
      "name": "Exact character name",
      "aiCharacterImagePromptEn": "Authentic Cambodian (Khmer) turnaround character reference sheet prompt in English (front view, 3/4 view, 3 expressions, natural Cambodian features, exact outfit, clean solid neutral background, 16:9, no floating watermarks)"
    }
  ],
  "scenes": [
    {
      "sceneNumber": 1,
      "aiImagePromptEn": "Detailed English image prompt with authentic Cambodian characters, Cambodian countryside/city setting, natural Khmer script on shop signboards if any shop appears, matching Scene 01 Khmer script, 16:9, no floating subtitles",
      "aiVideoPromptEn": "Visual Motion: ... Camera Movement: ... Spoken Khmer Narration (${project.narratorVoice}, natural clear Khmer language): \\"<exact Khmer script for Scene 01>\\". Background Music & SFX: ... Authentic Cambodian setting, no floating subtitles."
    }
  ],
  "aiThumbnailPromptEn": "Eye-catching 16:9 Cambodian 2D cartoon YouTube thumbnail prompt in English matching the video topic and Khmer characters, natural Khmer signboard if relevant, no watermarks"
}
\`\`\``;
}

export function downloadTextFile(filename: string, content: string, mime = 'text/plain;charset=utf-8'): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
