import React, { useEffect, useState } from 'react';
import {
  Cpu,
  X,
  CheckCircle2,
  ExternalLink,
  AlertTriangle,
  RefreshCw,
  Server,
} from 'lucide-react';
import { AI_PROVIDER_PRESETS } from '../data/topics';
import { fetchOllamaModels } from '../api/client';
import type { AiProviderConfig, AiProviderId } from '../types/storyboard';

interface SettingsModalProps {
  isOpen: boolean;
  config: AiProviderConfig;
  hasEnvApiKey: boolean;
  onSave: (config: AiProviderConfig) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  config,
  hasEnvApiKey,
  onSave,
  onClose,
}) => {
  const [provider, setProvider] = useState<AiProviderId>(config.provider);
  const [apiKey, setApiKey] = useState(config.apiKey);
  const [model, setModel] = useState(config.model);
  const [baseUrl, setBaseUrl] = useState(config.baseUrl);

  const [checkingOllama, setCheckingOllama] = useState(false);
  const [ollamaStatus, setOllamaStatus] = useState<{
    checked: boolean;
    available: boolean;
    models: string[];
    error?: string;
  }>({ checked: false, available: false, models: [] });

  useEffect(() => {
    if (isOpen) {
      setProvider(config.provider);
      setApiKey(config.apiKey);
      setModel(config.model);
      setBaseUrl(config.baseUrl);
      setOllamaStatus({ checked: false, available: false, models: [] });
    }
  }, [isOpen, config]);

  const handleCheckOllama = async (urlToCheck: string) => {
    setCheckingOllama(true);
    try {
      const res = await fetchOllamaModels(urlToCheck);
      setOllamaStatus({
        checked: true,
        available: res.available,
        models: res.models,
        error: res.error,
      });
      if (res.available && res.models.length > 0 && !res.models.includes(model)) {
        setModel(res.models[0]);
      }
    } catch {
      setOllamaStatus({
        checked: true,
        available: false,
        models: [],
        error: 'មិនអាចតភ្ជាប់ទៅ Ollama បានទេ',
      });
    } finally {
      setCheckingOllama(false);
    }
  };

  useEffect(() => {
    if (isOpen && provider === 'ollama') {
      handleCheckOllama(baseUrl || 'http://127.0.0.1:11434');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, provider]);

  if (!isOpen) return null;

  const preset =
    AI_PROVIDER_PRESETS.find((p) => p.id === provider) || AI_PROVIDER_PRESETS[0];

  const handleSwitchProvider = (nextId: AiProviderId) => {
    setProvider(nextId);
    const nextPreset =
      AI_PROVIDER_PRESETS.find((p) => p.id === nextId) || AI_PROVIDER_PRESETS[0];
    setBaseUrl(nextPreset.defaultBaseUrl);
    setModel(nextPreset.defaultModel);
  };

  const trimmedKey = apiKey.trim();
  const detectedProvider = (() => {
    if (!trimmedKey) return null;
    if (trimmedKey.startsWith('AQ.') || trimmedKey.startsWith('AIza')) return 'gemini';
    if (trimmedKey.startsWith('gsk_')) return 'groq';
    if (trimmedKey.startsWith('sk-or-')) return 'openrouter';
    if (trimmedKey.startsWith('sk-proj-') || (trimmedKey.startsWith('sk-') && !trimmedKey.startsWith('sk-or-'))) return 'openai';
    return null;
  })();

  const isKeyMismatch =
    Boolean(trimmedKey) &&
    provider !== 'ollama' &&
    detectedProvider !== null &&
    detectedProvider !== provider;

  const geminiWrongPrefix =
    provider === 'gemini' &&
    Boolean(trimmedKey) &&
    !trimmedKey.startsWith('AIza') &&
    !trimmedKey.startsWith('AQ.');

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card modal-wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-row">
            <Cpu size={20} className="text-amber" />
            <h3>កំណត់ការភ្ជាប់ AI (ជ្រើសរើស Ollama / OpenRouter / Groq / Gemini / OpenAI)</h3>
          </div>
          <button className="btn-icon-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Provider Cards */}
          <div className="form-group">
            <label>១. ជ្រើសរើសប្រភព AI (AI Provider)</label>
            <div className="provider-grid">
              {AI_PROVIDER_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={`provider-card ${provider === p.id ? 'active' : ''}`}
                  onClick={() => handleSwitchProvider(p.id)}
                >
                  <div className="provider-card-top">
                    <strong>{p.name}</strong>
                    <span className={`provider-badge ${!p.requiresKey ? 'free' : ''}`}>
                      {p.badgeKh}
                    </span>
                  </div>
                  <p>{p.descriptionKh}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Ollama Helper */}
          {provider === 'ollama' && (
            <div className="ollama-box">
              <div className="ollama-head">
                <div className="title-with-icon">
                  <Server size={16} className="text-amber" />
                  <div>
                    <strong>ស្ថានភាព Ollama លើកុំព្យូទ័រ (Offline ឥតគិតថ្លៃ 100%)</strong>
                    <p className="muted-text" style={{ fontSize: '0.78rem' }}>
                      មិនត្រូវការ API Key ទេ — គ្រាន់តែដំឡើង Ollama ហើយរត់ <code>ollama pull gemma3</code>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-outline btn-sm"
                  onClick={() => handleCheckOllama(baseUrl || 'http://127.0.0.1:11434')}
                  disabled={checkingOllama}
                >
                  <RefreshCw size={13} className={checkingOllama ? 'spin' : ''} />
                  <span>ស្វែងរកម៉ូដែល</span>
                </button>
              </div>

              {ollamaStatus.checked && (
                ollamaStatus.available ? (
                  <div className="alert-success" style={{ marginTop: 10 }}>
                    <CheckCircle2 size={15} />
                    <span>
                      តភ្ជាប់ Ollama ជោគជ័យ! រកឃើញម៉ូដែល {ollamaStatus.models.length}៖{' '}
                      {ollamaStatus.models.length > 0
                        ? ollamaStatus.models.join(', ')
                        : 'មិនទាន់ទាញយកម៉ូដែលទេ (សូមរត់ ollama pull gemma3)'}
                    </span>
                  </div>
                ) : (
                  <div className="alert-error" style={{ marginTop: 10, padding: '9px 12px' }}>
                    <AlertTriangle size={15} />
                    <span>
                      {ollamaStatus.error} — ទាញយក Ollama នៅ{' '}
                      <a
                        href="https://ollama.com/download"
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: '#9f1239', fontWeight: 700 }}
                      >
                        ollama.com/download
                      </a>{' '}
                      ឬប្រើប្រអប់ <strong>«ChatGPT / Gemini Web»</strong> ដោយមិនបាច់ដំឡើងកម្មវិធីអ្វីឡើយ!
                    </span>
                  </div>
                )
              )}
            </div>
          )}

          {/* Base URL (for Ollama, OpenRouter, Groq, OpenAI/LM Studio) */}
          {provider !== 'gemini' && (
            <div className="form-group">
              <label>Base URL (អាសយដ្ឋាន Server)</label>
              <input
                type="text"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder={preset.defaultBaseUrl}
                className="input-field mono"
              />
            </div>
          )}

          {/* API Key (hidden for Ollama) */}
          {provider !== 'ollama' && (
            <div className="form-group">
              <label>
                API Key សម្រាប់ {preset.name}{' '}
                {provider === 'openai' && '(ទុកទទេបានសម្រាប់ LM Studio Local)'}
              </label>
              {provider === 'gemini' && hasEnvApiKey && (
                <div className="alert-success" style={{ marginBottom: 6 }}>
                  <CheckCircle2 size={15} />
                  <span>
                    មាន <code>GEMINI_API_KEY</code> រួចស្រាប់ក្នុង <code>.env</code> ហើយ។
                  </span>
                </div>
              )}
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={preset.keyPlaceholder}
                className="input-field mono"
              />
              {isKeyMismatch && detectedProvider && (
                <div
                  className="alert-info"
                  style={{
                    marginTop: 6,
                    padding: '8px 12px',
                    fontSize: '0.82rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 8,
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    borderRadius: 6,
                  }}
                >
                  <span style={{ color: '#1e40af' }}>
                    💡 <strong>សម្គាល់ឃើញ៖</strong> Key នេះត្រូវជាមួយ{' '}
                    <strong>
                      {AI_PROVIDER_PRESETS.find((p) => p.id === detectedProvider)?.name}
                    </strong>
                    !
                  </span>
                  <button
                    type="button"
                    className="btn-primary"
                    style={{ fontSize: '0.78rem', padding: '4px 10px' }}
                    onClick={() => handleSwitchProvider(detectedProvider)}
                  >
                    ប្ដូរទៅ {AI_PROVIDER_PRESETS.find((p) => p.id === detectedProvider)?.name} ភ្លាមៗ
                  </button>
                </div>
              )}
              {geminiWrongPrefix && !isKeyMismatch && (
                <div className="alert-error" style={{ marginTop: 6, padding: '8px 11px', fontSize: '0.8rem' }}>
                  <AlertTriangle size={15} />
                  <span>
                    Google Gemini API Key ត្រូវចាប់ផ្ដើមដោយ <code>AQ.</code> ឬ <code>AIza</code>។
                  </span>
                </div>
              )}
              <p className="field-hint">
                ទទួលយក Key នៅ៖{' '}
                <a
                  href={preset.docsUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: '#b45309',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  {preset.docsUrl} <ExternalLink size={12} />
                </a>
              </p>
            </div>
          )}

          {/* Model Selection */}
          <div className="form-group">
            <label>២. ឈ្មោះម៉ូដែល (Model Name)</label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder={preset.defaultModel}
              className="input-field mono"
            />
            <div className="chip-row" style={{ marginTop: 6 }}>
              {(provider === 'ollama' && ollamaStatus.models.length > 0
                ? ollamaStatus.models
                : preset.suggestedModels
              ).map((m) => (
                <button
                  key={m}
                  type="button"
                  className={`topic-chip mono ${model === m ? 'active' : ''}`}
                  style={{ fontSize: '0.76rem' }}
                  onClick={() => setModel(m)}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            បោះបង់
          </button>
          <button
            className="btn-primary"
            onClick={() => {
              let finalProvider = provider;
              if (detectedProvider && detectedProvider !== provider && provider !== 'ollama') {
                finalProvider = detectedProvider;
              }
              const finalPreset =
                AI_PROVIDER_PRESETS.find((p) => p.id === finalProvider) || preset;
              let finalModel = model.trim().replace(/^models\//, '');
              if (
                finalProvider === 'gemini' &&
                (finalModel.includes('2.5') || finalModel.includes('2.0') || finalModel.includes('1.5') || !finalModel)
              ) {
                finalModel = 'gemini-3.8-flash';
              }
              onSave({
                provider: finalProvider,
                apiKey: trimmedKey,
                model: finalModel || finalPreset.defaultModel,
                baseUrl: finalProvider === provider ? (baseUrl.trim() || preset.defaultBaseUrl) : finalPreset.defaultBaseUrl,
              });
              onClose();
            }}
          >
            រក្សាទុកការកំណត់ AI
          </button>
        </div>
      </div>
    </div>
  );
};
