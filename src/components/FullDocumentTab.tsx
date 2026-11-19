import React, { useMemo, useState } from 'react';
import {
  Copy,
  Check,
  Download,
  FileText,
  BookOpen,
  Video,
  Image as ImageIcon,
  Users,
} from 'lucide-react';
import type { StoryboardProject } from '../types/storyboard';
import {
  buildKhmerSpeakingVideoPrompt,
  downloadTextFile,
  generateCopyReadyFullPackage,
  generateFullArticleOnly,
  generateFullMarkdownPackage,
  getCharacterImagePrompt,
} from '../utils/exporters';

interface FullDocumentTabProps {
  project: StoryboardProject;
}

type DocViewMode = 'full' | 'article' | 'video-khmer' | 'images';

export const FullDocumentTab: React.FC<FullDocumentTabProps> = ({ project }) => {
  const [viewMode, setViewMode] = useState<DocViewMode>('full');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fullPackageText = useMemo(
    () => generateCopyReadyFullPackage(project),
    [project]
  );

  const pureArticleText = useMemo(
    () => generateFullArticleOnly(project),
    [project]
  );

  const allKhmerVideoPrompts = useMemo(() => {
    const lines = [
      `=== AI VIDEO ACTION PROMPTS (សកម្មភាពទាក់ទង TOPIC • តួអង្គមិននិយាយ) ===`,
      `ចំណងជើង៖ ${project.videoTitle}`,
      `កំណត់សម្គាល់៖ វីដេអូផ្តោតលើសកម្មភាពរស់រវើកទាក់ទងនឹង Topic តួអង្គមិននិយាយទេ ដើម្បីងាយស្រួលយក Script ទៅដាក់ Voice Over ខាងក្រៅ។`,
      ``,
    ];
    project.scenes.forEach((s) => {
      const num = String(s.sceneNumber).padStart(2, '0');
      lines.push(`[Scene ${num} – ${s.sceneTitle} | ${s.durationSeconds}s]`);
      lines.push(buildKhmerSpeakingVideoPrompt(s, project));
      lines.push('');
    });
    return lines.join('\n');
  }, [project]);

  const allImagePrompts = useMemo(() => {
    const lines = [
      `=== PROMPT រូបភាពតួអង្គ & រូបភាពតាមឈុតទាំងអស់ ===`,
      `ប្រធានបទ៖ ${project.videoTitle}`,
      ``,
      `--- តួអង្គ (CHARACTERS) ---`,
    ];
    project.characters.forEach((c) => {
      lines.push(`[Character: ${c.name}]`);
      lines.push(getCharacterImagePrompt(c, project.animationStyleLabel));
      lines.push('');
    });
    lines.push(`--- ឈុតនីមួយៗ (SCENES 01–${project.scenes.length}) ---`);
    project.scenes.forEach((s) => {
      const num = String(s.sceneNumber).padStart(2, '0');
      lines.push(`[Scene ${num} – ${s.sceneTitle}]`);
      lines.push(s.aiImagePromptEn);
      lines.push('');
    });
    return lines.join('\n');
  }, [project]);

  const activeText =
    viewMode === 'full'
      ? fullPackageText
      : viewMode === 'article'
      ? pureArticleText
      : viewMode === 'video-khmer'
      ? allKhmerVideoPrompts
      : allImagePrompts;

  const copyText = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="tab-stack">
      <section className="studio-card">
        <div className="card-header-row wrap">
          <div className="title-with-icon">
            <FileText size={20} className="text-amber" />
            <div>
              <h3>អត្ថបទពេញលេញសម្រាប់ Topic នេះ (ទម្រង់ងាយ Copy យកទៅប្រើភ្លាមៗ)</h3>
              <p className="muted-text">
                បង្ហាញអត្ថបទពេញលេញ រួមទាំង Script ខ្មែរ, Prompt រូបភាពតួអង្គ, Prompt រូបភាព Scenes និង Prompt វីដេអូនិយាយភាសាខ្មែរ ក្នុងទំព័រតែមួយ។
              </p>
            </div>
          </div>

          <div className="button-row">
            <button
              className="btn-primary btn-sm"
              onClick={() => copyText('copy-active', activeText)}
            >
              {copiedId === 'copy-active' ? <Check size={14} /> : <Copy size={14} />}
              <span>
                {copiedId === 'copy-active' ? 'បានចម្លងរួច!' : 'ចម្លងអត្ថបទកំពុងមើលទាំងអស់'}
              </span>
            </button>
            <button
              className="btn-secondary btn-sm"
              onClick={() =>
                downloadTextFile(`${project.id}-full-package.txt`, fullPackageText)
              }
            >
              <Download size={14} />
              <span>ទាញយក .TXT</span>
            </button>
            <button
              className="btn-outline btn-sm"
              onClick={() =>
                downloadTextFile(
                  `${project.id}.md`,
                  generateFullMarkdownPackage(project),
                  'text/markdown;charset=utf-8'
                )
              }
            >
              <Download size={14} />
              <span>ទាញយក .MD</span>
            </button>
          </div>
        </div>

        {/* Quick View Switcher */}
        <div className="subtab-pills" style={{ marginBottom: 14 }}>
          <button
            className={`subtab-pill ${viewMode === 'full' ? 'active' : ''}`}
            onClick={() => setViewMode('full')}
          >
            <FileText size={14} />
            <span>អត្ថបទ & Prompts ពេញលេញទាំងអស់</span>
          </button>
          <button
            className={`subtab-pill ${viewMode === 'article' ? 'active' : ''}`}
            onClick={() => setViewMode('article')}
          >
            <BookOpen size={14} />
            <span>អត្ថបទ Script ខ្មែរសុទ្ធ (ងាយអាន)</span>
          </button>
          <button
            className={`subtab-pill ${viewMode === 'video-khmer' ? 'active' : ''}`}
            onClick={() => setViewMode('video-khmer')}
          >
            <Video size={14} />
            <span>Prompt វីដេអូសកម្មភាព Topic ({project.scenes.length} ឈុត)</span>
          </button>
          <button
            className={`subtab-pill ${viewMode === 'images' ? 'active' : ''}`}
            onClick={() => setViewMode('images')}
          >
            <ImageIcon size={14} />
            <span>Prompt រូបភាពតួអង្គ + Scenes</span>
          </button>
        </div>

        {/* Quick 1-click Copy Strip */}
        <div className="quick-copy-strip">
          <button
            className="btn-outline btn-sm"
            onClick={() => copyText('q-article', pureArticleText)}
          >
            {copiedId === 'q-article' ? <Check size={13} /> : <BookOpen size={13} />}
            <span>{copiedId === 'q-article' ? 'បានចម្លង!' : 'Copy អត្ថបទខ្មែរសុទ្ធ'}</span>
          </button>
          <button
            className="btn-outline btn-sm"
            onClick={() =>
              copyText(
                'q-chars',
                project.characters
                  .map(
                    (c) =>
                      `[${c.name}]\n${getCharacterImagePrompt(c, project.animationStyleLabel)}`
                  )
                  .join('\n\n')
              )
            }
          >
            {copiedId === 'q-chars' ? <Check size={13} /> : <Users size={13} />}
            <span>{copiedId === 'q-chars' ? 'បានចម្លង!' : 'Copy Prompt តួអង្គទាំងអស់'}</span>
          </button>
          <button
            className="btn-outline btn-sm"
            onClick={() => copyText('q-vid', allKhmerVideoPrompts)}
          >
            {copiedId === 'q-vid' ? <Check size={13} /> : <Video size={13} />}
            <span>{copiedId === 'q-vid' ? 'បានចម្លង!' : 'Copy Prompt វីដេអូនិយាយខ្មែរទាំងអស់'}</span>
          </button>
        </div>

        <pre className="full-doc-viewer">{activeText}</pre>
      </section>
    </div>
  );
};
