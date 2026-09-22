import React, { useState, useEffect } from 'react';
import { Mail, Send, FileText, CheckCircle2, AlertCircle, Loader2, X, Sparkles, User as UserIcon, LogOut } from 'lucide-react';
import { ViralContent, PlatformId, ToneId, GoalId } from '../types';
import { googleSignIn, logoutGoogle, getCachedAccessToken, auth } from '../services/authService';
import { sendGmailMessage, createGmailDraft } from '../services/gmailService';
import { User } from 'firebase/auth';

interface GmailShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: ViralContent;
  platform: PlatformId;
  tone: ToneId;
  goal: GoalId;
  language: string;
  user: User | null;
  onAuthSuccess: (user: User, token: string) => void;
  onLogout: () => void;
  showNotification: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const GmailShareModal: React.FC<GmailShareModalProps> = ({
  isOpen,
  onClose,
  result,
  platform,
  tone,
  goal,
  language,
  user,
  onAuthSuccess,
  onLogout,
  showNotification,
}) => {
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Initialize recipient and default subject
  useEffect(() => {
    if (user?.email && !recipient) {
      setRecipient(user.email);
    }
    setSubject(`[Viral Vision Pro] ${platform} Growth Strategy & Hooks Report - Score ${result.scoreBreakdown.overall}/100`);
  }, [user, result, platform]);

  if (!isOpen) return null;

  const generateHtmlBody = () => {
    return `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 680px; margin: 0 auto; padding: 24px; color: #18181b; background-color: #ffffff; border: 1px solid #e4e4e7; border-radius: 12px;">
        <div style="border-bottom: 2px solid #18181b; padding-bottom: 16px; margin-bottom: 24px;">
          <h1 style="font-size: 22px; font-weight: 800; margin: 0; color: #09090b; letter-spacing: -0.5px;">VIRAL VISION PRO | Growth Blueprint</h1>
          <p style="font-size: 13px; color: #71717a; margin: 4px 0 0 0;">Automated AI Viral Audit & Hook Engineering Report</p>
        </div>

        <div style="background-color: #f4f4f5; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tr>
              <td style="padding: 4px 0; color: #71717a;">Target Platform:</td>
              <td style="padding: 4px 0; font-weight: 700; color: #09090b;">${platform}</td>
              <td style="padding: 4px 0; color: #71717a;">Viral Score:</td>
              <td style="padding: 4px 0; font-weight: 800; color: #18181b;">${result.scoreBreakdown.overall}/100</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #71717a;">Tone of Voice:</td>
              <td style="padding: 4px 0; font-weight: 600; color: #09090b;">${tone}</td>
              <td style="padding: 4px 0; color: #71717a;">Growth Goal:</td>
              <td style="padding: 4px 0; font-weight: 600; color: #09090b;">${goal}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #71717a;">Language:</td>
              <td style="padding: 4px 0; font-weight: 600; color: #09090b;" colspan="3">${language}</td>
            </tr>
          </table>
        </div>

        <div style="margin-bottom: 24px;">
          <h2 style="font-size: 16px; font-weight: 700; color: #09090b; border-bottom: 1px solid #e4e4e7; padding-bottom: 8px; margin-bottom: 12px;">1. Diagnostic Score Benchmark</h2>
          <p style="font-size: 13px; line-height: 1.6; color: #27272a; margin-bottom: 12px;">${result.summaryAngle}</p>
          <ul style="font-size: 13px; color: #3f3f46; padding-left: 20px; line-height: 1.6;">
            <li><strong>Hook Strength:</strong> ${result.scoreBreakdown.hookStrength}%</li>
            <li><strong>Viewer Retention:</strong> ${result.scoreBreakdown.retentionScore}%</li>
            <li><strong>Shareability Velocity:</strong> ${result.scoreBreakdown.shareability}%</li>
            <li><strong>Algorithmic SEO:</strong> ${result.scoreBreakdown.seoScore}%</li>
          </ul>
        </div>

        <div style="margin-bottom: 24px;">
          <h2 style="font-size: 16px; font-weight: 700; color: #09090b; border-bottom: 1px solid #e4e4e7; padding-bottom: 8px; margin-bottom: 12px;">2. 0-3s Opening Hooks (Swipe-Stoppers)</h2>
          ${result.hooks.map((h, i) => `
            <div style="background-color: #fafafa; border-left: 3px solid #09090b; padding: 12px; margin-bottom: 10px; border-radius: 0 6px 6px 0;">
              <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #71717a; margin-bottom: 4px;">Angle ${i + 1}: ${h.label}</div>
              <div style="font-size: 14px; font-weight: 700; color: #09090b; margin-bottom: 4px;">"${h.text}"</div>
              <div style="font-size: 12px; color: #52525b;">${h.reasoning}</div>
            </div>
          `).join('')}
        </div>

        <div style="margin-bottom: 24px;">
          <h2 style="font-size: 16px; font-weight: 700; color: #09090b; border-bottom: 1px solid #e4e4e7; padding-bottom: 8px; margin-bottom: 12px;">3. Optimized Captions</h2>
          <div style="margin-bottom: 14px;">
            <div style="font-size: 12px; font-weight: 700; color: #71717a;">PUNCHY SHORT FORM:</div>
            <p style="font-size: 13px; line-height: 1.6; color: #18181b; background: #fafafa; padding: 10px; border-radius: 6px; white-space: pre-wrap;">${result.captions.punchy}</p>
          </div>
          <div style="margin-bottom: 14px;">
            <div style="font-size: 12px; font-weight: 700; color: #71717a;">STORYTELLING / ENGAGEMENT:</div>
            <p style="font-size: 13px; line-height: 1.6; color: #18181b; background: #fafafa; padding: 10px; border-radius: 6px; white-space: pre-wrap;">${result.captions.story}</p>
          </div>
          <div>
            <div style="font-size: 12px; font-weight: 700; color: #71717a;">BULLET THREAD / STEP-BY-STEP:</div>
            <p style="font-size: 13px; line-height: 1.6; color: #18181b; background: #fafafa; padding: 10px; border-radius: 6px; white-space: pre-wrap;">${result.captions.thread}</p>
          </div>
        </div>

        <div style="margin-bottom: 24px;">
          <h2 style="font-size: 16px; font-weight: 700; color: #09090b; border-bottom: 1px solid #e4e4e7; padding-bottom: 8px; margin-bottom: 12px;">4. Recommended Hashtags & Keywords</h2>
          <p style="font-size: 12px; line-height: 1.6; color: #27272a;">
            <strong>High Reach:</strong> ${result.hashtags.highReach.join(' ')}<br/>
            <strong>Niche Community:</strong> ${result.hashtags.nicheTargeted.join(' ')}<br/>
            <strong>SEO Search:</strong> ${result.hashtags.seoKeywords.join(' ')}
          </p>
        </div>

        <div style="border-top: 1px solid #e4e4e7; padding-top: 16px; font-size: 11px; color: #a1a1aa; text-align: center;">
          Sent with Viral Vision Pro & Gmail Integration.
        </div>
      </div>
    `;
  };

  const handleGoogleLogin = async () => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const authResult = await googleSignIn();
      if (authResult) {
        onAuthSuccess(authResult.user, authResult.accessToken);
        if (authResult.user.email) {
          setRecipient(authResult.user.email);
        }
        showNotification(`Signed in as ${authResult.user.displayName || authResult.user.email}`);
      }
    } catch (err: any) {
      setAuthError(err?.message || 'Google sign-in failed');
      showNotification('Google sign-in failed', 'error');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSendEmail = async () => {
    const token = getCachedAccessToken();
    if (!token) {
      handleGoogleLogin();
      return;
    }

    if (!recipient || !recipient.includes('@')) {
      showNotification('Please enter a valid recipient email address', 'error');
      return;
    }

    setIsSending(true);
    setStatusMessage(null);
    try {
      const htmlBody = generateHtmlBody();
      await sendGmailMessage(token, recipient, subject, htmlBody);
      showNotification(`Report sent to ${recipient} via Gmail!`, 'success');
      setStatusMessage(`Email dispatched successfully to ${recipient}`);
      setTimeout(() => {
        onClose();
        setStatusMessage(null);
      }, 1800);
    } catch (err: any) {
      console.error('Failed to send email:', err);
      showNotification(err?.message || 'Failed to send email via Gmail', 'error');
    } finally {
      setIsSending(false);
    }
  };

  const handleCreateDraft = async () => {
    const token = getCachedAccessToken();
    if (!token) {
      handleGoogleLogin();
      return;
    }

    setIsDrafting(true);
    setStatusMessage(null);
    try {
      const htmlBody = generateHtmlBody();
      await createGmailDraft(token, recipient || (user?.email || ''), subject, htmlBody);
      showNotification('Draft created in your Gmail account!', 'success');
      setStatusMessage('Draft created in your Gmail! Check your Gmail Drafts.');
      setTimeout(() => {
        onClose();
        setStatusMessage(null);
      }, 1800);
    } catch (err: any) {
      console.error('Failed to create draft:', err);
      showNotification(err?.message || 'Failed to create Gmail draft', 'error');
    } finally {
      setIsDrafting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md transition-all animate-fadeIn">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col z-10 animate-slideUp"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center font-bold">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Share Strategy via Gmail</span>
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-zinc-300">
                  Google Workspace
                </span>
              </h3>
              <p className="text-xs text-zinc-400">
                Send report to your team/client or save as a draft in your Gmail
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-white border border-zinc-800 transition-colors shrink-0"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
          
          {/* User Sign-In Status Bar */}
          {!user ? (
            <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                  <UserIcon className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-white">Gmail Authentication Required</p>
                  <p className="text-[11px] text-zinc-400">Sign in with Google to send reports or create drafts in your account</p>
                </div>
              </div>

              {authError && (
                <div className="p-2.5 rounded-xl bg-red-950/50 border border-red-800 text-red-300 text-[11px] flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {/* Official Sign in with Google Button */}
              <button
                type="button"
                id="btn-gmail-signin"
                disabled={isAuthenticating}
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-100 text-black font-semibold text-xs transition-all shadow-md active:scale-98 cursor-pointer"
              >
                {isAuthenticating ? (
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
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800">
              <div className="flex items-center gap-2.5">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-7 h-7 rounded-full border border-zinc-700" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-zinc-800 text-white flex items-center justify-center font-bold text-xs">
                    {user.displayName ? user.displayName[0] : 'U'}
                  </div>
                )}
                <div>
                  <p className="text-xs font-bold text-white leading-tight">
                    {user.displayName || 'Google User'}
                  </p>
                  <p className="text-[10px] text-zinc-400 font-mono">
                    {user.email}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onLogout}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] transition-colors"
                title="Sign out"
              >
                <LogOut className="w-3 h-3" />
                <span>Switch</span>
              </button>
            </div>
          )}

          {/* Recipient Form */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300">
              Recipient Email Address
            </label>
            <input
              id="input-gmail-recipient"
              type="email"
              placeholder="e.g. client@example.com, manager@agency.com"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-zinc-500 transition-colors"
            />
            <p className="text-[10px] text-zinc-500">
              Defaults to your signed-in email. You can also specify any team member or client email.
            </p>
          </div>

          {/* Subject Line */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300">
              Email Subject Line
            </label>
            <input
              id="input-gmail-subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-zinc-500 transition-colors"
            />
          </div>

          {/* Strategy Summary Preview */}
          <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-zinc-300">Package Contents</span>
              <span className="font-mono text-zinc-400">{result.hooks.length} Hooks • 3 Captions • SEO Matrix</span>
            </div>
            <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-850 text-[11px] text-zinc-400 space-y-1">
              <p><strong className="text-zinc-200">Score:</strong> {result.scoreBreakdown.overall}/100 ({platform})</p>
              <p><strong className="text-zinc-200">Core Angle:</strong> {result.summaryAngle}</p>
              <p><strong className="text-zinc-200">Top Hook:</strong> "{result.hooks[0]?.text}"</p>
            </div>
          </div>

          {/* Success Status Notice */}
          {statusMessage && (
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>{statusMessage}</span>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-zinc-800 bg-zinc-950 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            {/* Save Draft Button */}
            <button
              id="btn-gmail-create-draft"
              type="button"
              disabled={isDrafting || isSending || !user}
              onClick={handleCreateDraft}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-zinc-200 border border-zinc-700 text-xs font-semibold transition-all active:scale-95 cursor-pointer"
            >
              {isDrafting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-400" />
              ) : (
                <FileText className="w-3.5 h-3.5 text-zinc-300" />
              )}
              <span>{isDrafting ? 'Saving Draft...' : 'Save Draft'}</span>
            </button>

            {/* Send Email Button */}
            <button
              id="btn-gmail-send-now"
              type="button"
              disabled={isSending || isDrafting || !user}
              onClick={handleSendEmail}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-white hover:bg-zinc-200 disabled:opacity-50 text-black text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            >
              {isSending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                  <span>Dispatching...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 text-black" />
                  <span>Send via Gmail</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
