import React, { useMemo, useState } from 'react';
import { Music, Copy, Check, CheckSquare, FileCode, Sparkles, ExternalLink } from 'lucide-react';
import type { StoryboardProject } from '../types/storyboard';
import { buildMasterPrompt, generateTopicTailoredMusic } from '../data/topics';

interface ProductionKitTabProps {
  project: StoryboardProject;
}

export const ProductionKitTab: React.FC<ProductionKitTabProps> = ({ project }) => {
  const [copiedMaster, setCopiedMaster] = useState(false);
  const [copiedMusicIdx, setCopiedMusicIdx] = useState<number | null>(null);

  const reusableMasterPrompt = buildMasterPrompt();

  const musicList = useMemo(() => {
    if (
      project.musicSuggestions &&
      project.musicSuggestions.length > 0 &&
      project.musicSuggestions.some((m) => Boolean(m.aiMusicPromptEn))
    ) {
      return project.musicSuggestions;
    }
    return generateTopicTailoredMusic(project.topic, project.categoryId);
  }, [project]);

  const handleCopyMaster = async () => {
    await navigator.clipboard.writeText(reusableMasterPrompt);
    setCopiedMaster(true);
    setTimeout(() => setCopiedMaster(false), 1800);
  };

  const handleCopyMusicPrompt = async (idx: number, promptText: string) => {
    await navigator.clipboard.writeText(promptText);
    setCopiedMusicIdx(idx);
    setTimeout(() => setCopiedMusicIdx(null), 1800);
  };

  return (
    <div className="tab-stack">
      {/* Music Suggestions */}
      <section className="studio-card">
        <div className="card-header-row wrap">
          <div className="title-with-icon">
            <Music size={19} className="text-amber" />
            <div>
              <h3>ការណែនាំភ្លេង & AI Background Music Prompts (Suno / Udio)</h3>
              <p className="muted-text">
                ភ្លេងផ្ទៃខាងក្រោយដែលត្រូវបានច្នៃឡើងឱ្យស៊ីចង្វាក់ ១០០% នឹងប្រធានបទ «{project.topic}» — អាចចម្លង AI Prompt ទៅដាក់ក្នុង Suno ឬ Udio បានភ្លាមៗ!
              </p>
            </div>
          </div>
          <div className="button-row">
            <a
              href="https://suno.com"
              target="_blank"
              rel="noreferrer"
              className="btn-outline btn-sm"
            >
              <span>បើក Suno.com</span>
              <ExternalLink size={12} />
            </a>
            <a
              href="https://udio.com"
              target="_blank"
              rel="noreferrer"
              className="btn-outline btn-sm"
            >
              <span>បើក Udio.com</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>

        <div className="music-grid">
          {musicList.map((m, i) => (
            <div key={i} className="music-card">
              <div className="music-card-top">
                <strong>{m.section}</strong>
                <span className="tempo-pill">{m.tempo}</span>
              </div>
              <div className="music-mood">{m.mood}</div>
              <div className="music-inst">
                <span>ឧបករណ៍ភ្លេង៖</span> {m.instruments}
              </div>
              <p className="music-tip">💡 {m.usageTip}</p>
              {m.aiMusicPromptEn && (
                <div className="prompt-dark-box" style={{ marginTop: 10, padding: 10 }}>
                  <div className="prompt-dark-head" style={{ marginBottom: 4 }}>
                    <span style={{ fontSize: '0.72rem' }}>SUNO / UDIO PROMPT</span>
                    <button
                      className="btn-copy-dark"
                      style={{ padding: '2px 7px', fontSize: '0.7rem' }}
                      onClick={() => handleCopyMusicPrompt(i, m.aiMusicPromptEn || '')}
                    >
                      {copiedMusicIdx === i ? <Check size={11} /> : <Copy size={11} />}
                      <span>{copiedMusicIdx === i ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <p style={{ fontSize: '0.8rem', lineHeight: 1.45 }}>{m.aiMusicPromptEn}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Quality Standards Table (Section 5) */}
      <section className="studio-card">
        <div className="card-header-row">
          <div className="title-with-icon">
            <CheckSquare size={19} className="text-amber" />
            <div>
              <h3>គន្លឹះស្តង់ដារផលិតវីដេអូ (Standard Production Specs)</h3>
              <p className="muted-text">
                រក្សាទម្រង់ដូចគ្នាគ្រប់វីដេអូ ដើម្បីបង្កើតអត្តសញ្ញាណឆានែលវិជ្ជាជីវៈ។
              </p>
            </div>
          </div>
        </div>

        <div className="specs-table-grid">
          <div className="spec-row">
            <span>Animation</span>
            <strong>{project.animationStyleLabel}</strong>
          </div>
          <div className="spec-row">
            <span>Voice</span>
            <strong>{project.narratorVoice}</strong>
          </div>
          <div className="spec-row">
            <span>Script</span>
            <strong>ពេញលេញ មិនសង្ខេប (ដាច់ដោយឡែកពី AI Prompts)</strong>
          </div>
          <div className="spec-row">
            <span>Subtitle</span>
            <strong>Khmer (.SRT)</strong>
          </div>
          <div className="spec-row">
            <span>Scene Pacing</span>
            <strong>5–10 វិនាទី / ឈុត</strong>
          </div>
          <div className="spec-row">
            <span>Resolution & Ratio</span>
            <strong>1920 × 1080 (16:9 Full HD)</strong>
          </div>
          <div className="spec-row">
            <span>Music</span>
            <strong>Documentary Background Music</strong>
          </div>
        </div>
      </section>

      {/* Reusable Master Prompt */}
      <section className="studio-card">
        <div className="card-header-row wrap">
          <div className="title-with-icon">
            <FileCode size={19} className="text-amber" />
            <div>
              <h3>Master Prompt មេ (Reusable Master Prompt)</h3>
              <p className="muted-text">
                រក្សាទុកក្នុង <code>prompts/MASTER_PROMPT_KHMER_ANIMATION.md</code> ផងដែរ។
              </p>
            </div>
          </div>
          <button className="btn-primary btn-sm" onClick={handleCopyMaster}>
            {copiedMaster ? <Check size={14} /> : <Copy size={14} />}
            <span>{copiedMaster ? 'បានចម្លង!' : 'ចម្លង Master Prompt'}</span>
          </button>
        </div>

        <pre className="prompt-code-block">{reusableMasterPrompt}</pre>
      </section>
    </div>
  );
};
