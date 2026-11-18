# Khmer Storyboard Studio — ប្រព័ន្ធផលិត Script & Storyboard គំនូរជីវចលអប់រំ 2D

កម្មវិធី Web App និងប្រព័ន្ធ Master Prompt សម្រាប់ផលិតវីដេអូបែប **Khmer Educational Storytelling / Knowledge Animation** ជាបន្តបន្ទាប់ ដោយគ្រាន់តែផ្លាស់ប្ដូរប្រធានបទ (Topic)។

## រចនាសម្ព័ន្ធគម្រោង (Project Structure)

- `prompts/MASTER_PROMPT_KHMER_ANIMATION.md` — Master Prompt ពេញលេញសម្រាប់ប្រើឡើងវិញ
- `prompts/PRODUCTION_GUIDE.md` — មគ្គុទ្ទេសក៍ និងស្តង់ដារផលិតវីដេអូ (1920×1080, 16:9, 2D Cartoon, 5–10s/scene)
- `storyboards/` — ផ្ទុកឯកសារ Storyboard ដែលបានបង្កើត និងរក្សាទុកស្វ័យប្រវត្តិជា 4 ទម្រង់៖
  - `*.json` — ទិន្នន័យគម្រោងពេញលេញ
  - `*.md` — កញ្ចប់ Markdown ពេញលេញ
  - `*-narrator.txt` — Script អ្នកនិទានពេញលេញដាច់ដោយឡែក (សម្រាប់អានថតសំឡេងភ្លាមៗ)
  - `*.srt` — អក្សររត់ភាសាខ្មែរ Khmer Subtitle ដែលគណនាម៉ោងស្វ័យប្រវត្តិ
- `src/` — កម្មវិធី React + TypeScript Studio UI
- `server/` — Express API Server ភ្ជាប់ជាមួយ `@google/genai` (`gemini-3.8-flash` / `gemini-4-argon`)

## របៀបដំណើរការកម្មវិធី (How to Run)

1. ដំឡើងកញ្ចប់កម្មវិធី (បានដំឡើងរួចហើយ)៖
   ```powershell
   npm.cmd install
   ```
2. *(ជាជម្រើស)* ដើម្បីប្រើមុខងារបង្កើត Storyboard ស្វ័យប្រវត្តិដោយ Gemini AI៖
   - ចម្លង `.env.example` ទៅជា `.env` ហើយបញ្ចូល `GEMINI_API_KEY=...` **ឬ**
   - បញ្ចូល Gemini API Key ផ្ទាល់នៅក្នុងប៊ូតុង **«កំណត់ការភ្ជាប់ Gemini AI»** ក្នុងកម្មវិធី។
   - *(បើមិនទាន់មាន API Key ក៏អាចប្រើមុខងារ «មើល & ចម្លង Master Prompt», កែសម្រួល Storyboard និងនាំចេញឯកសារ `.txt` / `.srt` / `.md` បាន 100%!)*
3. បើកដំណើរការកម្មវិធី៖
   - **វិធីងាយស្រួលបំផុត៖** ចុច 2 ដង (Double-click) លើឯកសារ `Start-Studio.bat` — វានឹងបើក Server និងបើក `http://127.0.0.1:3001` ក្នុង Browser ដោយស្វ័យប្រវត្តិ។
   - **ឬតាម Terminal (PowerShell)៖**
     ```powershell
     npm.cmd start
     ```
     រួចបើក `http://127.0.0.1:3001` (ឬ `http://localhost:3001`)។
   - *(សម្រាប់អ្នកអភិវឌ្ឍន៍កូដ៖ `npm.cmd run dev` រួចបើក `http://localhost:5173`)*

## ការបង្ហោះគេហទំព័រ (Hosting)

1. **GitHub Pages (ឥតគិតថ្លៃ ស្វ័យប្រវត្តិ):**
   - មាន Workflow `.github/workflows/deploy-pages.yml` រួចជាស្រេច។
   - ចូល **Settings → Pages → Source: GitHub Actions** ក្នុង GitHub Repository របស់អ្នក រួចរង់ចាំ ~1 នាទី។
   - គេហទំព័រនឹងដំណើរការនៅ៖ `https://sendara168.github.io/khmerstorybord/` (ដំណើរការ Static Mode ជាមួយ Browser LocalStorage + ChatGPT/Gemini Web Copy-Paste + Offline Draft + Full Export!)
2. **Render / Railway (Full-Stack Node.js + AI APIs):**
   - មានឯកសារ `render.yaml` រួចស្រាប់ — ភ្ជាប់ GitHub Repo ក្នុង Render ឬ Railway វានឹង Build (`npm install && npm run build`) និង Start (`npm start`) ដោយស្វ័យប្រវត្តិ!
