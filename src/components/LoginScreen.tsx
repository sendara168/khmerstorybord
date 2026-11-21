import React, { useState } from 'react';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  LogIn,
  ShieldCheck,
  Film,
} from 'lucide-react';
import { login, type AuthUser } from '../api/auth';

interface LoginScreenProps {
  onLoginSuccess: (user: AuthUser) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!username.trim() || !password.trim()) {
      setErrorMessage('សូមបញ្ចូលទាំង Username និង Password!');
      return;
    }

    setIsLoading(true);
    try {
      const res = await login(username, password);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
      } else {
        setErrorMessage(
          res.error || 'ឈ្មោះអ្នកប្រើប្រាស់ (Username) ឬពាក្យសម្ងាត់ (Password) មិនត្រឹមត្រូវ!'
        );
      }
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'មានបញ្ហាបច្ចេកទេសក្នុងការ Login'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-screen-wrapper">
      <div className="login-screen-card">
        {/* Header */}
        <div className="login-header">
          <div className="login-brand-icon">
            <Film size={32} />
          </div>
          <h1>Khmer Storyboard Studio</h1>
          <p className="login-subtitle">
            ប្រព័ន្ធគ្រប់គ្រង និងផលិត Storyboard វីដេអូ AI បែបកម្ពុជា
          </p>
        </div>

        {/* Security Alert Badge */}
        <div className="login-info-pill">
          <ShieldCheck size={16} className="text-amber" />
          <span>សូមបញ្ចូល Username និង Password ដើម្បី Login ចូលប្រើប្រាស់</span>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="login-error-banner" role="alert">
            <span>⚠️ {errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="login-username">ឈ្មោះអ្នកប្រើប្រាស់ (Username)</label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" />
              <input
                id="login-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ឧ. admin"
                autoComplete="username"
                autoFocus
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="login-password">ពាក្យសម្ងាត់ (Password)</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="បញ្ចូលពាក្យសម្ងាត់..."
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="btn-toggle-eye"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'លាក់ពាក្យសម្ងាត់' : 'បង្ហាញពាក្យសម្ងាត់'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-login-submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <span>កំពុងផ្ទៀងផ្ទាត់...</span>
            ) : (
              <>
                <LogIn size={18} />
                <span>Login ចូលប្រព័ន្ធ</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
