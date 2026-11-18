# មគ្គុទ្ទេសក៍ផលិតវីដេអូអប់រំ 2D Cartoon (Production Guide)

## 1. ការកំណត់ស្តង់ដារ (Standard Production Specs)

| ធាតុ (Element) | ការកំណត់ (Setting) |
|---|---|
| **Animation Style** | 2D Cartoon Educational Animation (Warm cinematic lighting) |
| **Narrator Voice** | Khmer Male Narrator (Natural, Clear, Professional, Engaging) |
| **Script** | អត្ថបទពេញលេញ មិនសង្ខេប ដាច់ដោយឡែកពី AI Prompts |
| **Subtitle** | Khmer (`.srt` synced to 5–10s per scene) |
| **Scene Pacing** | 5–10 វិនាទី / ឈុត (40–60 ឈុត សម្រាប់វីដេអូ 5–10 នាទី) |
| **Resolution** | 1920 × 1080 (Full HD) |
| **Aspect Ratio** | 16:9 |
| **Background Music** | Documentary Educational Background Music (Soft, warm, non-distracting) |

---

## 2. លំដាប់ការងារផលិតវីដេអូ (6-Step Production Pipeline)

1. **ជ្រើសរើសប្រធានបទ & បង្កើត Storyboard**
   - ប្រើ **Khmer Storyboard Studio** ដើម្បីជ្រើសរើសប្រភេទវីដេអូ ប្រធានបទ រយៈពេល និងស្ទីល Animation។
   - កំណត់ **Character Bible** ឱ្យច្បាស់ (សម្លៀកបំពាក់ ពណ៌សក់ អាយុ រូបរាង) ដើម្បីឱ្យតួអង្គដូចគ្នាគ្រប់ឈុត។
2. **ថតសំឡេងអ្នកនិទាន (Khmer Voiceover)**
   - នាំចេញឯកសារ `narrator-script.txt` (ដែលដាច់ដោយឡែកពី Image/Video Prompts)។
   - អានថតសំឡេង ឬប្រើ AI Voiceover ជាភាសាខ្មែរ។
3. **បង្កើតរូបភាពតាមឈុត (AI Image Generation)**
   - ប្រើ **AI Image Prompt (English)** ពីផ្ទាំង AI Prompts តាមលំដាប់ Scene 01 → Scene N។
   - រក្សាពាក្យគន្លឹះ Style Anchor ដូចគ្នាគ្រប់ឈុត (`Clean 2D cartoon educational illustration, warm cinematic lighting, 16:9, no text`).
4. **បង្កើតចលនា Animation (AI Video Generation)**
   - ផ្ដល់រូបភាពឈុតនីមួយៗ + **AI Video Animation Prompt (English)** និង **Camera Movement**។
5. **បញ្ចូលអក្សររត់ខ្មែរ (Khmer Subtitles)**
   - នាំចេញឯកសារ `.srt` ហើយនាំចូលក្នុងកម្មវិធីកាត់ត (CapCut / Premiere Pro / DaVinci Resolve) ដោយប្រើ Font ខ្មែរច្បាស់ដូចជា `Kantumruy Pro` ឬ `Noto Sans Khmer`។
6. **រចនា Thumbnail & បង្ហោះ YouTube**
   - ប្រើ **YouTube Thumbnail Prompt** និង **Video Description** ដែលបានបង្កើតរួចជាស្រេច។
