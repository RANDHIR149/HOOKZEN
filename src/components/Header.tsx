import React from 'react';
import { RotateCcw, Sun, Moon } from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import { Language } from '../types';
import { ThemeMode } from './MenuModal';
import { HookJainLogo } from './HookJainLogo';

interface HeaderProps {
  languages: Language[];
  currentLanguage: string;
  onLanguageChange: (code: string) => void;
  hasResults: boolean;
  onReset: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  languages,
  currentLanguage,
  onLanguageChange,
  hasResults,
  onReset,
  theme,
  onToggleTheme,
}) => {
  return (
    <header id="main-header" className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-black/95 backdrop-blur-xl transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-4">
        {/* Brand Logo Mark */}
        <div className="flex items-center gap-3">
          <div 
            id="brand-logo-mark"
            className="group cursor-pointer transition-transform active:scale-95"
            title="Hook Jain AI Studio"
          >
            <HookJainLogo className="w-10 h-10 rounded-2xl border border-zinc-700/80 group-hover:border-zinc-500 shadow-md" />
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900/90 border border-zinc-800 text-[10px] font-mono text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-zinc-300 font-semibold uppercase tracking-wider">Hook Jain</span>
          </div>
        </div>

        {/* Top Header Buttons Toolbar */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick Theme Switcher (Sun / Moon) */}
          <button
            id="btn-header-theme-toggle"
            type="button"
            onClick={onToggleTheme}
            className="h-9 w-9 flex items-center justify-center rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-all shadow-sm cursor-pointer active:scale-95"
            title={theme === 'light' ? 'Switch to Dark Mode (Black & White)' : 'Switch to Light Mode (White & Black)'}
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-zinc-700" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>

          {/* Language Selector Button - Clear, Prominent & Professional */}
          <LanguageSelector
            languages={languages}
            currentLanguage={currentLanguage}
            onLanguageChange={onLanguageChange}
          />

          {/* Reset / Start New Audit Button in Header (Visible when results or media are loaded) */}
          {hasResults && (
            <button
              id="btn-header-reset"
              type="button"
              onClick={onReset}
              className="h-9 flex items-center gap-1.5 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 hover:text-rose-400 border border-rose-500/30 hover:border-rose-500/50 text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95"
              title="Reset and start new post"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};


