import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { NavTab } from '../types';

interface AdminLoginViewProps {
  onLoginSuccess: () => void;
  onNavigate: (tab: NavTab) => void;
  logoUrl?: string;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({
  onLoginSuccess,
  onNavigate,
  logoUrl,
}) => {
  const [email, setEmail] = useState('contactesfaye@gmail.com');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{ email?: string; password?: string; confirm?: string }>({});
  const [isSetupMode, setIsSetupMode] = useState(false);
  const [isAccountConfigured, setIsAccountConfigured] = useState(false);

  useEffect(() => {
    const initialized = authService.isAccountInitialized();
    setIsAccountConfigured(initialized);
    // If not yet initialized, default to initial administrator setup
    if (!initialized) {
      setIsSetupMode(true);
    }
  }, []);

  const validateForm = (): boolean => {
    const errors: { email?: string; password?: string; confirm?: string } = {};

    if (!email.trim()) {
      errors.email = 'Administrator email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please provide a valid email address.';
    }

    if (!password) {
      errors.password = 'Password is required to authenticate.';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }

    if (isSetupMode) {
      if (password !== confirmPassword) {
        errors.confirm = 'Passwords do not match.';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      if (isSetupMode) {
        // Register / initialize administrator master password
        await authService.registerAdmin(email, password);
        setIsAccountConfigured(true);
        onLoginSuccess();
      } else {
        // Authenticate administrator
        await authService.login(email, password);
        onLoginSuccess();
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Authentication failed. Please check your credentials and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-[80vh] justify-center px-gutter-sm py-space-lg animate-in fade-in duration-300">
      {/* Return to Portfolio Link */}
      <div className="mb-space-md">
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-1.5 text-slate-cool hover:text-primary font-label-md text-label-md transition-colors cursor-pointer group"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-0.5 transition-transform">
            arrow_back
          </span>
          <span>Back to Public Portfolio</span>
        </button>
      </div>

      {/* Main Login Card */}
      <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-xl border border-border-subtle/80 flex flex-col gap-space-md">
        {/* Header branding */}
        <div className="flex flex-col items-center text-center gap-2 pb-space-sm border-b border-border-subtle/50">
          <div className="relative">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Tesfaye Teklu Monogram"
                className="h-12 w-auto object-contain mx-auto"
              />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mx-auto">
                <span className="material-symbols-outlined text-[28px]">shield_person</span>
              </div>
            )}
            <span className="absolute -bottom-1 -right-1 bg-secondary text-on-secondary rounded-full p-0.5 flex items-center justify-center">
              <span className="material-symbols-outlined text-[14px]">lock</span>
            </span>
          </div>

          <div>
            <h1 className="font-headline-sm text-headline-sm text-primary font-bold">
              {isSetupMode ? 'Initialize Administrator Account' : 'Executive Portal Admin Login'}
            </h1>
            <p className="font-body-sm text-body-sm text-slate-cool mt-1 max-w-sm">
              {isSetupMode
                ? 'Register the master administrator password for contactesfaye@gmail.com through the secure authentication system.'
                : 'Restricted administrative console for executive portfolio governance and record management.'}
            </p>
          </div>
        </div>

        {/* Informational Banner for Setup vs Login */}
        {isSetupMode ? (
          <div className="p-space-sm rounded-lg bg-secondary/10 border border-secondary/20 flex items-start gap-2.5">
            <span className="material-symbols-outlined text-secondary text-[20px] flex-shrink-0 mt-0.5">
              shield
            </span>
            <div className="text-xs text-on-surface-variant leading-relaxed">
              <span className="font-semibold text-primary block">
                Secure Credential Registration
              </span>
              Your password will be cryptographically hashed using PBKDF2 with SHA-256 and salted locally. It is never stored in plain text or hard-coded anywhere.
            </div>
          </div>
        ) : null}

        {/* Global Error Banner */}
        {errorMessage && (
          <div
            className="p-space-sm rounded-lg bg-error/10 border border-error/30 text-error flex items-start gap-2.5 animate-in fade-in"
            role="alert"
          >
            <span className="material-symbols-outlined text-[20px] flex-shrink-0 mt-0.5">
              error
            </span>
            <div className="text-body-sm font-medium leading-snug">
              {errorMessage}
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-space-md">
          {/* Email Field */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="admin-email"
              className="font-label-sm text-label-sm text-primary font-bold flex items-center justify-between"
            >
              <span>Administrator Email</span>
              <span className="text-[11px] text-slate-cool font-normal">
                Restricted to authorized administrator
              </span>
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-cool text-[20px]">
                mail
              </span>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (validationErrors.email) {
                    setValidationErrors((prev) => ({ ...prev, email: undefined }));
                  }
                }}
                disabled={isLoading}
                placeholder="contactesfaye@gmail.com"
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border bg-surface text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 transition-all ${
                  validationErrors.email
                    ? 'border-error focus:ring-error/20'
                    : 'border-border-subtle focus:ring-secondary/20 focus:border-secondary'
                }`}
                autoComplete="email"
              />
            </div>
            {validationErrors.email && (
              <span className="text-xs text-error font-medium">
                {validationErrors.email}
              </span>
            )}
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="admin-password"
              className="font-label-sm text-label-sm text-primary font-bold flex items-center justify-between"
            >
              <span>{isSetupMode ? 'Choose Master Password' : 'Password'}</span>
              <span className="text-[11px] text-slate-cool font-normal">
                Min. 6 characters
              </span>
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-cool text-[20px]">
                key
              </span>
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (validationErrors.password) {
                    setValidationErrors((prev) => ({ ...prev, password: undefined }));
                  }
                }}
                disabled={isLoading}
                placeholder={isSetupMode ? 'Enter strong administrator password' : 'Enter administrator password'}
                className={`w-full pl-10 pr-11 py-2.5 rounded-lg border bg-surface text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 transition-all ${
                  validationErrors.password
                    ? 'border-error focus:ring-error/20'
                    : 'border-border-subtle focus:ring-secondary/20 focus:border-secondary'
                }`}
                autoComplete={isSetupMode ? 'new-password' : 'current-password'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-cool hover:text-primary transition-colors cursor-pointer p-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            {validationErrors.password && (
              <span className="text-xs text-error font-medium">
                {validationErrors.password}
              </span>
            )}
          </div>

          {/* Confirm Password Field (Only during setup mode) */}
          {isSetupMode && (
            <div className="flex flex-col gap-1.5 animate-in fade-in">
              <label
                htmlFor="admin-confirm-password"
                className="font-label-sm text-label-sm text-primary font-bold"
              >
                Confirm Master Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-cool text-[20px]">
                  lock_reset
                </span>
                <input
                  id="admin-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (validationErrors.confirm) {
                      setValidationErrors((prev) => ({ ...prev, confirm: undefined }));
                    }
                  }}
                  disabled={isLoading}
                  placeholder="Re-enter your master password"
                  className={`w-full pl-10 pr-11 py-2.5 rounded-lg border bg-surface text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 transition-all ${
                    validationErrors.confirm
                      ? 'border-error focus:ring-error/20'
                      : 'border-border-subtle focus:ring-secondary/20 focus:border-secondary'
                  }`}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-cool hover:text-primary transition-colors cursor-pointer p-1"
                  aria-label={showConfirmPassword ? 'Hide confirmed password' : 'Show confirmed password'}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showConfirmPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
              {validationErrors.confirm && (
                <span className="text-xs text-error font-medium">
                  {validationErrors.confirm}
                </span>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            id="admin-login-submit-btn"
            className="w-full bg-primary text-on-primary py-3 rounded-lg font-label-lg text-label-lg font-semibold flex items-center justify-center gap-2 shadow-sm hover:bg-secondary transition-all active:scale-[0.98] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[20px]">
                  sync
                </span>
                <span>Authenticating Administrator...</span>
              </>
            ) : isSetupMode ? (
              <>
                <span className="material-symbols-outlined text-[20px]">
                  verified_user
                </span>
                <span>Register & Access Dashboard</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">
                  login
                </span>
                <span>Login</span>
              </>
            )}
          </button>
        </form>

        {/* Switch between Login and Setup Mode if account is already configured */}
        {isAccountConfigured && (
          <div className="pt-2 border-t border-border-subtle/40 flex items-center justify-between text-xs text-slate-cool">
            <span>
              {isSetupMode
                ? 'Already initialized your master password?'
                : 'Need to reset or re-initialize password?'}
            </span>
            <button
              type="button"
              onClick={() => {
                setIsSetupMode(!isSetupMode);
                setErrorMessage(null);
                setValidationErrors({});
              }}
              className="text-secondary hover:text-primary font-semibold transition-colors cursor-pointer"
            >
              {isSetupMode ? 'Switch to Login' : 'First-Time Setup / Reset'}
            </button>
          </div>
        )}

        {/* Security & Access Info Footer */}
        <div className="pt-space-xs border-t border-border-subtle/30 flex flex-col gap-1.5 text-center text-slate-cool font-label-sm text-[11px]">
          <div className="flex items-center justify-center gap-3">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px] text-secondary">
                lock
              </span>
              PBKDF2 Cryptographic Vault
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px] text-secondary">
                verified
              </span>
              Zero-Trust Protection
            </span>
          </div>
          <p>
            Authorized access only. All administrative logins and actions are cryptographically signed.
          </p>
        </div>
      </div>
    </div>
  );
};
