import React, { useMemo, useState } from 'react';
import { Copy, Check, Download, Mic, AlignLeft, BookOpen } from 'lucide-react';
import type { StoryboardProject, StorySection } from '../types/storyboard';
import {
  downloadTextFile,
  formatClock,
  generateStandaloneNarratorScript,
  getSectionLabel,
} from '../utils/exporters';

interface NarratorScriptTabProps {
  project: StoryboardProject;
}

export const NarratorScriptTab: React.FC<NarratorScriptTabProps> = ({ project }) => {
  const [copied, setCopied] = useState(false);
  const [teleprompterMode, setTeleprompterMode] = useState(false);

  const plainScript = useMemo(
    () => generateStandaloneNarratorScript(project),
    [project]
  );

  const totalSeconds = project.scenes.reduce((sum, s) => sum + (s.durationSeconds || 8), 0);

  const handleCopyAll = async () => {
    await navigator.clipboard.writeText(plainScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyPureVoiceOnly = async () => {
    const pureText = project.scenes
      .map((s) => s.narratorScriptKh.trim())
      .filter(Boolean)
      .join('\n\n');
    await navigator.clipboard.writeText(pureText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  let lastSection: StorySection | null = null;

  return (
    <div className="tab-stack">
      <section className="studio-card">
        <div className="card-header-row wrap">
          <div className="title-with-icon">
            <Mic size={20} className="text-amber" />
            <div>
              <h3>Script អ្នកនិទានពេញលេញ (ដាច់ដោយឡែកពី AI Prompts)</h3>
              <p className="muted-text">
                អត្ថបទសម្រាប់អានថតសំឡេង ឬដាក់ចូល AI Voiceover ភាសាខ្មែរភ្លាមៗ — សរុប{' '}
                <strong>{project.scenes.length} ឈុត</strong> ({formatClock(totalSeconds)})
              </p>
            </div>
          </div>

          <div className="button-row">
            <button
              className={`btn-outline btn-sm ${teleprompterMode ? 'active-toggle' : ''}`}
              onClick={() => setTeleprompterMode((v) => !v)}
            >
              {teleprompterMode ? <AlignLeft size={14} /> : <BookOpen size={14} />}
              <span>{teleprompterMode ? 'ទម្រង់ធម្មតា' : 'ទម្រង់អានថតសំឡេង (ធំច្បាស់)'}</span>
            </button>
            <button className="btn-secondary btn-sm" onClick={handleCopyPureVoiceOnly}>
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'បានចម្លង!' : 'ចម្លងតែអត្ថបទអាន'}</span>
            </button>
            <button className="btn-outline btn-sm" onClick={handleCopyAll}>
              <Copy size={14} />
              <span>ចម្លងមានលេខឈុត</span>
            </button>
            <button
              className="btn-primary btn-sm"
              onClick={() =>
                downloadTextFile(`${project.id}-narrator.txt`, plainScript)
              }
            >
              <Download size={14} />
              <span>ទាញយក .TXT</span>
            </button>
          </div>
        </div>

        <div className={`narrator-sheet ${teleprompterMode ? 'teleprompter' : ''}`}>
          {project.scenes.map((scene) => {
            const showHeader = scene.section !== lastSection;
            lastSection = scene.section;
            return (
              <React.Fragment key={scene.sceneNumber}>
                {showHeader && (
                  <div className={`script-act-divider act-${scene.section.toLowerCase()}`}>
                    {getSectionLabel(scene.section)}
                  </div>
                )}
                <div className="script-paragraph">
                  <div className="script-meta-tag">
                    <span className="scene-num-pill">
                      Scene {String(scene.sceneNumber).padStart(2, '0')}
                    </span>
                    <span className="scene-mini-title">{scene.sceneTitle}</span>
                    <span className="scene-dur-pill">{scene.durationSeconds}s</span>
                  </div>
                  <p className="narrator-spoken-text">«{scene.narratorScriptKh}»</p>
                  {scene.characterDialogue?.trim() && (
                    <p className="narrator-dialogue-line">
                      <strong>សន្ទនាតួអង្គ៖</strong> {scene.characterDialogue}
                    </p>
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </section>
    </div>
  );
};
