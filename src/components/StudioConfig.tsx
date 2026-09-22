import React from 'react';
import { PlatformId, ToneId, GoalId, Language } from '../types';
import { 
  Compass, 
  Layers, 
  Target, 
  Zap, 
  Flame, 
  Award, 
  BookOpen, 
  Sparkles, 
  ShieldAlert, 
  Smile, 
  TrendingUp, 
  MessageSquare, 
  BookmarkCheck, 
  MousePointerClick, 
  UserPlus, 
  Globe, 
  Check 
} from 'lucide-react';

interface StudioConfigProps {
  platform: PlatformId;
  onPlatformChange: (p: PlatformId) => void;
  tone: ToneId;
  onToneChange: (t: ToneId) => void;
  goal: GoalId;
  onGoalChange: (g: GoalId) => void;
  isTurbo: boolean;
  onTurboToggle: () => void;
  language: string;
  onLanguageChange: (lang: string) => void;
  languages: Language[];
  disabled?: boolean;
}

const PLATFORMS: { id: PlatformId; label: string; formatBadge: string; sublabel: string; icon: string }[] = [
  { id: 'Instagram', label: 'Instagram Reels', formatBadge: '9:16 / 1:1', sublabel: 'Audio & Visual FYP', icon: '📸' },
  { id: 'TikTok', label: 'TikTok Feed', formatBadge: '9:16', sublabel: 'High-Velocity Pacing', icon: '🎵' },
  { id: 'YouTube', label: 'YouTube Shorts', formatBadge: '9:16', sublabel: 'Search & Recommended', icon: '▶️' },
  { id: 'Twitter', label: 'X / Twitter', formatBadge: 'Thread / Media', sublabel: 'Viral Conversations', icon: '𝕏' },
  { id: 'LinkedIn', label: 'LinkedIn Post', formatBadge: 'Carousels / B2B', sublabel: 'Thought Leadership', icon: '💼' },
  { id: 'Facebook', label: 'Facebook Feed', formatBadge: '16:9 / 1:1', sublabel: 'Broad Demographics', icon: '👥' },
  { id: 'Pinterest', label: 'Pinterest Pins', formatBadge: '2:3 / 9:16', sublabel: 'Visual Search & Saves', icon: '📌' },
];

const TONES: { id: ToneId; label: string; icon: React.ReactNode; tagline: string; description: string }[] = [
  { id: 'high-energy', label: 'High Energy & Urgent', icon: <Flame className="w-4 h-4 text-amber-400" />, tagline: 'Fast & Punchy', description: 'Immediate hooks, rapid pacing, strong enthusiasm' },
  { id: 'controversial', label: 'Contrarian / Debate', icon: <ShieldAlert className="w-4 h-4 text-rose-400" />, tagline: 'Myth-Buster', description: 'Challenges consensus, provokes passionate discussions' },
  { id: 'authority', label: 'Industry Authority', icon: <Award className="w-4 h-4 text-indigo-400" />, tagline: 'Expert & Credible', description: 'Data-backed, trusted frameworks, analytical advice' },
  { id: 'storytelling', label: 'Storytelling & Journey', icon: <BookOpen className="w-4 h-4 text-emerald-400" />, tagline: 'Relatable Arc', description: 'Personal narrative, emotional hook, struggle-to-triumph' },
  { id: 'aesthetic', label: 'Modern Aesthetic', icon: <Sparkles className="w-4 h-4 text-pink-400" />, tagline: 'Sleek & Polished', description: 'Minimalist tone, aspirational lifestyle, visual calm' },
  { id: 'humorous', label: 'Witty & Humorous', icon: <Smile className="w-4 h-4 text-yellow-400" />, tagline: 'Meme & Satire', description: 'Self-aware humor, irony, relatable situations' },
];

const GOALS: { id: GoalId; label: string; icon: React.ReactNode; mechanism: string }[] = [
  { id: 'max-reach', label: 'Max Reach & Views', icon: <TrendingUp className="w-4 h-4 text-cyan-400" />, mechanism: 'Optimizes for initial swipe-through & high algorithm circulation' },
  { id: 'comments', label: 'Debate & Comments', icon: <MessageSquare className="w-4 h-4 text-violet-400" />, mechanism: 'Crafts open-ended questions and controversy triggers' },
  { id: 'saves', label: 'Saves & Bookmarks', icon: <BookmarkCheck className="w-4 h-4 text-amber-400" />, mechanism: 'Packs high reference value & actionable step-by-step checklists' },
  { id: 'link-clicks', label: 'Bio / Link Clicks', icon: <MousePointerClick className="w-4 h-4 text-emerald-400" />, mechanism: 'Creates curiosity gap that directs users to external link' },
  { id: 'follower-growth', label: 'Follower Growth', icon: <UserPlus className="w-4 h-4 text-indigo-400" />, mechanism: 'Establishes ongoing series value to earn long-term subscribers' },
];

export const StudioConfig: React.FC<StudioConfigProps> = ({
  platform,
  onPlatformChange,
  tone,
  onToneChange,
  goal,
  onGoalChange,
  isTurbo,
  onTurboToggle,
  language,
  onLanguageChange,
  languages,
  disabled = false,
}) => {
  return (
    <div className="space-y-6">
      {/* 1. Target Platform Selection */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <Compass className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                1. Target Social Platform
              </h3>
              <p className="text-xs text-slate-400">
                Optimizes hook timing, aspect ratio constraints, and algorithm distribution
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-indigo-300 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 self-start sm:self-auto">
            Selected: <strong className="text-white">{platform}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {PLATFORMS.map((p) => {
            const isSelected = platform === p.id;
            return (
              <button
                key={p.id}
                id={`btn-platform-${p.id.toLowerCase()}`}
                type="button"
                disabled={disabled}
                onClick={() => onPlatformChange(p.id)}
                className={`flex flex-col justify-between p-3.5 rounded-xl border text-left transition-all relative group ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-600/15 ring-2 ring-indigo-500/40'
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700 hover:bg-slate-950/90'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xl p-1.5 bg-slate-900 rounded-lg border border-slate-800">
                      {p.icon}
                    </span>
                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-indigo-500 text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold leading-tight text-white">
                      {p.label}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {p.formatBadge}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Brand Tone & Style */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <Layers className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                2. Brand Tone & Voice Archetype
              </h3>
              <p className="text-xs text-slate-400">
                Defines vocabulary, emotional resonance, and sentence cadence
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-indigo-300 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 capitalize self-start sm:self-auto">
            Tone: <strong className="text-white">{tone.replace('-', ' ')}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {TONES.map((t) => {
            const isSelected = tone === t.id;
            return (
              <button
                key={t.id}
                id={`btn-tone-${t.id}`}
                type="button"
                disabled={disabled}
                onClick={() => onToneChange(t.id)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500 text-white ring-2 ring-indigo-500/30'
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="shrink-0 p-1.5 bg-slate-900 rounded-lg border border-slate-800">{t.icon}</div>
                    <p className="text-xs font-bold text-slate-100 truncate">{t.label}</p>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">
                    {t.tagline}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-snug mt-2">
                  {t.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Primary Goal & Growth Mechanics */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <Target className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                3. Primary Growth Goal
              </h3>
              <p className="text-xs text-slate-400">
                Directs call-to-actions, psychological triggers, and engagement mechanics
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-indigo-300 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 self-start sm:self-auto">
            Goal: <strong className="text-white">{goal}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {GOALS.map((g) => {
            const isSelected = goal === g.id;
            return (
              <button
                key={g.id}
                id={`btn-goal-${g.id}`}
                type="button"
                disabled={disabled}
                onClick={() => onGoalChange(g.id)}
                className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500 text-white ring-2 ring-indigo-500/30'
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <div className="shrink-0 p-1.5 bg-slate-900 rounded-lg border border-slate-800">{g.icon}</div>
                    <p className="text-xs font-bold text-slate-100">{g.label}</p>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug mt-2">
                    {g.mechanism}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Engine & Language Settings (Distinct side-by-side cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Turbo Engine Toggle */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <Zap className={`w-4 h-4 ${isTurbo ? 'text-amber-400' : 'text-slate-400'}`} />
                </div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  4. AI Reasoning Mode
                </h4>
              </div>
              <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full border ${
                isTurbo 
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' 
                  : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'
              }`}>
                {isTurbo ? '⚡ Turbo Mode' : '🔍 Deep Grounding'}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isTurbo
                ? 'High-speed synthesis for quick creator iterations and immediate hook drafts.'
                : 'Deep multimodal analysis evaluating frame pacing, subtle retention drops, and algorithmic nuances.'}
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
            <span className="text-xs font-medium text-slate-300">Fast Execution Mode</span>
            <button
              id="btn-toggle-turbo-mode"
              type="button"
              disabled={disabled}
              onClick={onTurboToggle}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isTurbo ? 'bg-amber-500' : 'bg-slate-700'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  isTurbo ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Output Language Localization */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                  <Globe className="w-4 h-4 text-indigo-400" />
                </div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  5. Target Language
                </h4>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 max-w-[170px] truncate" title={language}>
                {language}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generates culturally resonant slang, localized hook idioms, and region-targeted SEO keywords.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800/80">
            <select
              id="select-studio-language"
              value={language}
              disabled={disabled}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs font-medium text-white focus:outline-none focus:border-indigo-500 transition-colors"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code} className="bg-slate-900 text-white">
                  {l.flag ? `${l.flag} ` : ''}{l.name} {l.nativeScript ? `(${l.nativeScript})` : ''} — {l.region}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
