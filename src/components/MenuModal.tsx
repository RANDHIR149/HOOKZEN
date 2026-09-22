import React, { useState } from 'react';
import { 
  X, 
  Sun, 
  Moon, 
  Zap, 
  Sliders, 
  Volume2, 
  VolumeX, 
  Trash2, 
  Shield, 
  Sparkles, 
  Smartphone, 
  Info, 
  Check, 
  HelpCircle,
  Cpu,
  Monitor,
  History,
  ChevronRight
} from 'lucide-react';
import { PlatformId } from '../types';

export type ThemeMode = 'dark' | 'light';

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  isTurbo: boolean;
  onTurboToggle: () => void;
  soundEnabled: boolean;
  onSoundToggle: () => void;
  historyCount: number;
  onOpenHistory: () => void;
  onClearHistory: () => void;
  onSelectPlatform: (platform: PlatformId) => void;
  showNotification: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const MenuModal: React.FC<MenuModalProps> = ({
  isOpen,
  onClose,
  theme,
  onThemeChange,
  isTurbo,
  onTurboToggle,
  soundEnabled,
  onSoundToggle,
  historyCount,
  onOpenHistory,
  onClearHistory,
  onSelectPlatform,
  showNotification,
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md transition-all animate-fadeIn">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col z-10 animate-slideUp text-white"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center font-black text-sm">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
                <span>Studio Menu & Preferences</span>
              </h3>
              <p className="text-xs text-zinc-400">
                Customize appearance, AI engine, and studio options
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors shrink-0 cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-xs">
          
          {/* 1. Appearance / Theme Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Monitor className="w-3.5 h-3.5 text-zinc-300" />
                <span>Theme & Appearance</span>
              </label>
              <span className="text-[11px] font-mono text-zinc-400 capitalize">{theme} Mode</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {/* Dark Mode Option */}
              <button
                type="button"
                id="btn-theme-dark"
                onClick={() => {
                  onThemeChange('dark');
                  showNotification('Switched to Dark Mode (Black & White)', 'info');
                }}
                className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-zinc-900 border-zinc-400 shadow-md ring-1 ring-zinc-400'
                    : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-black border border-zinc-750 flex items-center justify-center text-white shrink-0">
                    <Moon className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-xs">Dark Mode</p>
                    <p className="text-[10px] text-zinc-400">Black & White</p>
                  </div>
                </div>
                {theme === 'dark' && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
              </button>

              {/* Light Mode Option */}
              <button
                type="button"
                id="btn-theme-light"
                onClick={() => {
                  onThemeChange('light');
                  showNotification('Switched to Light Mode (White & Black)', 'info');
                }}
                className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'bg-zinc-900 border-zinc-400 shadow-md ring-1 ring-zinc-400'
                    : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white border border-zinc-300 flex items-center justify-center text-black shrink-0">
                    <Sun className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-xs">Light Mode</p>
                    <p className="text-[10px] text-zinc-400">White & Black</p>
                  </div>
                </div>
                {theme === 'light' && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
              </button>
            </div>
          </div>

          {/* 2. Analysis History Section */}
          <div className="space-y-3">
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-zinc-300" />
              <span>Analysis & History</span>
            </label>

            <div className="p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white shrink-0">
                    <History className="w-4 h-4 text-zinc-300" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-xs">Saved Audits & Blueprints</p>
                    <p className="text-[11px] text-zinc-400">
                      {historyCount === 0 ? 'No audits stored yet' : `${historyCount} audit(s) saved in local history`}
                    </p>
                  </div>
                </div>

                {historyCount > 0 && (
                  <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold rounded-full bg-white text-black font-mono">
                    {historyCount}
                  </span>
                )}
              </div>

              {/* Action Buttons for History */}
              <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                <button
                  type="button"
                  id="btn-menu-open-history"
                  onClick={() => {
                    onClose();
                    onOpenHistory();
                  }}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                >
                  <span>Open Saved History</span>
                  <ChevronRight className="w-3.5 h-3.5 text-black" />
                </button>

                {!showClearConfirm ? (
                  <button
                    type="button"
                    id="btn-confirm-clear-data"
                    disabled={historyCount === 0}
                    onClick={() => setShowClearConfirm(true)}
                    className="px-3 py-2 rounded-xl bg-zinc-850 hover:bg-red-950 hover:text-red-300 border border-zinc-750 hover:border-red-800 text-zinc-300 text-xs font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Clear All
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        onClearHistory();
                        setShowClearConfirm(false);
                        showNotification('All history records cleared');
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold transition-colors cursor-pointer"
                    >
                      Confirm
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowClearConfirm(false)}
                      className="px-2 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 text-[10px] transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 3. AI Engine & Turbo Settings */}
          <div className="space-y-3">
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-zinc-300" />
              <span>AI Engine & Performance</span>
            </label>

            <div className="p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-3">
              {/* Turbo Mode Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isTurbo ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-400'}`}>
                    <Zap className={`w-4 h-4 ${isTurbo ? 'fill-black' : ''}`} />
                  </div>
                  <div>
                    <p className="font-bold text-white text-xs">Turbo Hook Engine</p>
                    <p className="text-[11px] text-zinc-400">Generates ultra-fast 0-3s viral hook variants</p>
                  </div>
                </div>

                {/* Switch Toggle */}
                <button
                  type="button"
                  id="btn-toggle-turbo-menu"
                  onClick={() => {
                    onTurboToggle();
                    showNotification(isTurbo ? 'Turbo Mode Disabled' : 'Turbo Mode Enabled');
                  }}
                  className={`w-12 h-6.5 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                    isTurbo ? 'bg-white justify-end' : 'bg-zinc-800 justify-start'
                  }`}
                >
                  <div className={`w-5.5 h-5.5 rounded-full shadow-md transition-transform ${isTurbo ? 'bg-black' : 'bg-zinc-400'}`} />
                </button>
              </div>

              {/* Model Info Badge */}
              <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px]">
                <span className="text-zinc-400">Active AI Model:</span>
                <span className="font-mono font-bold text-zinc-200 px-2 py-0.5 bg-zinc-950 border border-zinc-800 rounded-md">
                  Gemini 3.7 Flash
                </span>
              </div>
            </div>
          </div>

          {/* 3. Audio & Haptics Feedback */}
          <div className="space-y-3">
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-zinc-300" />
              <span>Feedback & Sound</span>
            </label>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${soundEnabled ? 'bg-zinc-800 text-white' : 'bg-zinc-900 text-zinc-500'}`}>
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </div>
                <div>
                  <p className="font-bold text-white text-xs">Sound Effects & Haptics</p>
                  <p className="text-[11px] text-zinc-400">Play subtle audio on audit completion and copy</p>
                </div>
              </div>

              <button
                type="button"
                id="btn-toggle-sound"
                onClick={() => {
                  onSoundToggle();
                  showNotification(soundEnabled ? 'Audio Feedback Muted' : 'Audio Feedback Enabled');
                }}
                className={`w-12 h-6.5 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                  soundEnabled ? 'bg-white justify-end' : 'bg-zinc-800 justify-start'
                }`}
              >
                <div className={`w-5.5 h-5.5 rounded-full shadow-md transition-transform ${soundEnabled ? 'bg-black' : 'bg-zinc-400'}`} />
              </button>
            </div>
          </div>

          {/* 4. About & App Info */}
          <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-850 space-y-2 text-center">
            <div className="w-8 h-8 rounded-xl bg-white text-black font-black text-xs mx-auto flex items-center justify-center">
              VV
            </div>
            <div>
              <p className="font-bold text-white text-xs">VIRAL VISION PRO • v2.5</p>
              <p className="text-[11px] text-zinc-400">Professional AI Video Hook, Caption & Retention Architecture</p>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold transition-colors cursor-pointer"
          >
            Close Menu
          </button>
        </div>
      </div>
    </div>
  );
};
