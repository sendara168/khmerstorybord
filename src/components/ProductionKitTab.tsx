import React, { useState } from 'react';
import { Music, Copy, Check, CheckSquare, FileCode } from 'lucide-react';
import type { StoryboardProject } from '../types/storyboard';
import { buildMasterPrompt } from '../data/topics';

interface ProductionKitTabProps {
  project: StoryboardProject;
}

export const ProductionKitTab: React.FC<ProductionKitTabProps> = ({ project }) => {
  const [copiedMaster, setCopiedMaster] = useState(false);

  const reusableMasterPrompt = buildMasterPrompt();

  const handleCopyMaster = async () => {
    await navigator.clipboard.writeText(reusableMasterPrompt);
    setCopiedMaster(true);
    setTimeout(() => setCopiedMaster(false), 1800);
  };

  return (
    <div className="tab-stack">
      {/* Music Suggestions */}
      <section className="studio-card">
        <div className="card-header-row">
          <div className="title-with-icon">
            <Music size={19} className="text-amber" />
            <div>
              <h3>ការណែនាំភ្លេងផ្ទៃខាងក្រោយ (Background Music Suggestions)</h3>
              <p className="muted-text">
                ប្រើភ្លេងបែប Documentary Educational ដើម្បីរក្សាអារម្មណ៍ទស្សនិកជន និងមិនរំខានសំឡេងអ្នកនិទាន។
              </p>
            </div>
          </div>
        </div>

        <div className="music-grid">
          {project.musicSuggestions.map((m, i) => (
            <div key={i} className="music-card">
              <div className="music-card-top">
                <strong>{m.section}</strong>
                <span className="tempo-pill">{m.tempo}</span>
              </div>
              <div className="music-mood">{m.mood}</div>
              <div className="music-inst">
                <span>ឧបករណ៍ភ្លេង៖</span> {m.instruments}
              </div>
              <p className="music-tip">{m.usageTip}</p>
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
