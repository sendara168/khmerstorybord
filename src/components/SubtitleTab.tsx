import React, { useMemo, useState } from 'react';
import { Copy, Check, Download, Subtitles } from 'lucide-react';
import type { StoryboardProject } from '../types/storyboard';
import {
  downloadTextFile,
  formatSrtTime,
  generateKhmerSrt,
} from '../utils/exporters';

interface SubtitleTabProps {
  project: StoryboardProject;
}

export const SubtitleTab: React.FC<SubtitleTabProps> = ({ project }) => {
  const [copied, setCopied] = useState(false);

  const srtContent = useMemo(() => generateKhmerSrt(project), [project]);

  const timelineRows = useMemo(() => {
    let cursor = 0;
    return project.scenes.map((s, idx) => {
      const dur = Math.max(3, Number(s.durationSeconds) || 8);
      const start = formatSrtTime(cursor);
      const end = formatSrtTime(cursor + dur);
      cursor += dur;
      return {
        index: idx + 1,
        sceneNumber: s.sceneNumber,
        start,
        end,
        text: s.narratorScriptKh,
        onScreen: s.onScreenText,
      };
    });
  }, [project]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(srtContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="tab-stack">
      <section className="studio-card">
        <div className="card-header-row wrap">
          <div className="title-with-icon">
            <Subtitles size={20} className="text-amber" />
            <div>
              <h3>អក្សររត់ភាសាខ្មែរ (Khmer Subtitle — SRT Auto-Synced)</h3>
              <p className="muted-text">
                គណនាម៉ោងស្វ័យប្រវត្តិតាមរយៈពេលឈុតនីមួយៗ រួចរាល់សម្រាប់នាំចូល CapCut, Premiere Pro ឬ YouTube។
              </p>
            </div>
          </div>

          <div className="button-row">
            <button className="btn-secondary btn-sm" onClick={handleCopy}>
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'បានចម្លង SRT!' : 'ចម្លង SRT'}</span>
            </button>
            <button
              className="btn-primary btn-sm"
              onClick={() => downloadTextFile(`${project.id}.srt`, srtContent)}
            >
              <Download size={14} />
              <span>ទាញយក .SRT</span>
            </button>
          </div>
        </div>

        <div className="srt-table-wrap">
          <table className="srt-table">
            <thead>
              <tr>
                <th style={{ width: 60 }}>#</th>
                <th style={{ width: 220 }}>Timecode (SRT)</th>
                <th>អក្សររត់ភាសាខ្មែរ (Khmer Subtitle)</th>
                <th style={{ width: 210 }}>On-screen Text</th>
              </tr>
            </thead>
            <tbody>
              {timelineRows.map((row) => (
                <tr key={row.index}>
                  <td className="mono">{String(row.index).padStart(2, '0')}</td>
                  <td className="mono timecode-cell">
                    {row.start} → {row.end}
                  </td>
                  <td className="khmer-cell">{row.text}</td>
                  <td className="onscreen-cell">{row.onScreen || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <details className="raw-srt-details">
          <summary>មើលកូដ SRT ដើម (Raw .SRT Format)</summary>
          <pre className="prompt-code-block">{srtContent}</pre>
        </details>
      </section>
    </div>
  );
};
