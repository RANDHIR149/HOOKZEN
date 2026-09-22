import React, { useState } from 'react';
import { X, Mail, ShieldCheck, Sparkles, Loader2, AlertCircle, LogOut, Check } from 'lucide-react';
import { googleSignIn, logoutGoogle } from '../services/authService';
import { User } from 'firebase/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onAuthSuccess: (user: User, token: string) => void;
  onLogout: () => void;
  showNotification: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  user,
  onAuthSuccess,
  onLogout,
  showNotification,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const authResult = await googleSignIn();
      if (authResult) {
        onAuthSuccess(authResult.user, authResult.accessToken);
        showNotification(`Welcome back, ${authResult.user.displayName || 'Creator'}!`);
        onClose();
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err?.message || 'Failed to sign in with Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logoutGoogle();
      onLogout();
      showNotification('Signed out successfully');
      onClose();
    } catch (err: any) {
      console.error('Logout error:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md transition-all animate-fadeIn">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Box */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10 animate-slideUp"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center font-black text-xs">
              VV
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Account & Gmail Access
              </h3>
              <p className="text-[11px] text-zinc-400">
                Sign in with Google Workspace
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors shrink-0"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-center">
          {!user ? (
            <>
              <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 mx-auto flex items-center justify-center shadow-inner">
                <Mail className="w-7 h-7 text-white" />
              </div>

              <div className="space-y-1.5">
                <h4 className="text-base font-bold text-white tracking-tight">
                  Sign in or Sign up with Google
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed max-w-xs mx-auto">
                  Connect your Google account to dispatch viral growth blueprints, generate Gmail drafts, and access your studio anywhere.
                </p>
              </div>

              {/* Feature Perks */}
              <div className="text-left space-y-2 p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-850 text-xs text-zinc-300">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-white shrink-0" />
                  <span>One-click send viral strategy reports via Gmail</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-white shrink-0" />
                  <span>Save formatted video hook packages directly to Gmail Drafts</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-white shrink-0" />
                  <span>Secure OAuth token caching & privacy protection</span>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-950/50 border border-red-800 text-red-300 text-xs flex items-center gap-2 text-left">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Official Google Sign In Button */}
              <button
                id="btn-modal-google-signin"
                type="button"
                disabled={isLoading}
                onClick={handleSignIn}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white hover:bg-zinc-100 text-black font-bold text-xs transition-all shadow-md active:scale-98 cursor-pointer"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                )}
                <span>Sign in with Google</span>
              </button>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-2">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-16 h-16 rounded-full border-2 border-zinc-700 shadow-md" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-zinc-800 text-white flex items-center justify-center font-bold text-lg border border-zinc-700">
                    {user.displayName ? user.displayName[0] : 'U'}
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-bold text-white">{user.displayName || 'Google User'}</h4>
                  <p className="text-xs text-zinc-400 font-mono">{user.email}</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-300 flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-white" />
                <span>Gmail API Connected & Ready</span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs transition-colors"
                >
                  Done
                </button>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-semibold transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
