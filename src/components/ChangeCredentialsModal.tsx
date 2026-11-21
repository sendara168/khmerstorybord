import React, { useState } from 'react';
import {
  X,
  KeyRound,
  Lock,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { updateCredentials, getCurrentUser, type AuthUser } from '../api/auth';

interface ChangeCredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedUser: AuthUser, message: string) => void;
}

export const ChangeCredentialsModal: React.FC<ChangeCredentialsModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const currentUser = getCurrentUser();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState(currentUser?.username || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanUser = newUsername.trim();
    const cleanPass = newPassword.trim();
    const cleanCurrent = currentPassword.trim();

    if (!cleanUser || cleanUser.length < 3) {
      setErrorMessage('Username ត្រូវមានយ៉ាងតិច ៣ តួអក្សរ!');
      return;
    }
    if (!cleanPass || cleanPass.length < 4) {
      setErrorMessage('Password ថ្មីត្រូវមានយ៉ាងតិច ៤ តួអក្សរ!');
      return;
    }
    if (cleanPass !== confirmPassword.trim()) {
      setErrorMessage('ការផ្ទៀងផ្ទាត់ Password ថ្មីមិនត្រូវគ្នាទេ!');
      return;
    }

    setIsLoading(true);
    try {
      const res = await updateCredentials(cleanCurrent, cleanUser, cleanPass);
      if (res.success && res.user) {
        onSuccess(
          res.user,
          res.message || 'បានកែប្រែ Username និង Password ដោយជោគជ័យ!'
        );
        onClose();
      } else {
        setErrorMessage(
          res.error || 'មិនអាចកែប្រែ Username និង Password បានទេ'
        );
      }
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'មានបញ្ហាបច្ចេកទេសក្នុងការកែប្រែ'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card change-credentials-card" role="dialog" aria-modal="true">
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-with-icon">
            <KeyRound size={22} className="text-amber" />
            <div>
              <h3>កែប្រែ Username និង Password</h3>
              <p className="modal-subtitle">
                កំណត់ព័ត៌មាន Login ថ្មីសម្រាប់ចូលប្រើប្រាស់ Khmer Storyboard Studio
              </p>
            </div>
          </div>
          <button
            type="button"
            className="btn-icon-close"
            onClick={onClose}
            title="បិទ"
          >
            <X size={18} />
          </button>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="modal-error-banner">
            <AlertTriangle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="current-pass">ពាក្យសម្ងាត់បច្ចុប្បន្ន (Current Password)</label>
            <div className="input-with-icon">
              <Lock size={16} className="input-icon" />
              <input
                id="current-pass"
                type={showCurrentPass ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="បញ្ចូល Password ចាស់ (ដើមគឺ password123)..."
                required
              />
              <button
                type="button"
                className="btn-toggle-eye"
                onClick={() => setShowCurrentPass(!showCurrentPass)}
                title={showCurrentPass ? 'លាក់' : 'បង្ហាញ'}
              >
                {showCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="new-username">Username ថ្មី (New Username)</label>
            <div className="input-with-icon">
              <User size={16} className="input-icon" />
              <input
                id="new-username"
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="ឧ. admin, dara, storymaster"
                required
                minLength={3}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="new-pass">Password ថ្មី (New Password)</label>
            <div className="input-with-icon">
              <Lock size={16} className="input-icon" />
              <input
                id="new-pass"
                type={showNewPass ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="បញ្ចូល Password ថ្មី (យ៉ាងតិច ៤ តួ)..."
                required
                minLength={4}
              />
              <button
                type="button"
                className="btn-toggle-eye"
                onClick={() => setShowNewPass(!showNewPass)}
                title={showNewPass ? 'លាក់' : 'បង្ហាញ'}
              >
                {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirm-pass">ផ្ទៀងផ្ទាត់ Password ថ្មី (Confirm New Password)</label>
            <div className="input-with-icon">
              <Lock size={16} className="input-icon" />
              <input
                id="confirm-pass"
                type={showNewPass ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="បញ្ចូល Password ថ្មីម្តងទៀត..."
                required
                minLength={4}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              បោះបង់
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <span>កំពុងរក្សាទុក...</span>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  <span>រក្សាទុក Username & Password</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
