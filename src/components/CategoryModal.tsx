import React from 'react';
import { 
  X, 
  Check, 
  Compass, 
  Layers, 
  Target
} from 'lucide-react';
import { PlatformId, ToneId, GoalId } from '../types';
import { ActiveCategory } from './BottomNav';

interface CategoryModalProps {
  category: ActiveCategory;
  onClose: () => void;
  onSelectCategoryTab: (cat: ActiveCategory) => void;
  platform: PlatformId;
  onPlatformChange: (p: PlatformId) => void;
  tone: ToneId;
  onToneChange: (t: ToneId) => void;
  goal: GoalId;
  onGoalChange: (g: GoalId) => void;
  disabled?: boolean;
}

const PLATFORMS: { id: PlatformId; label: string; formatBadge: string; sublabel: string }[] = [
  { id: 'Instagram', label: 'Instagram Reels & Posts', formatBadge: '9:16 / 1:1', sublabel: 'Explore algorithm, visual hooks & audio pairing' },
  { id: 'TikTok', label: 'TikTok Feed', formatBadge: '9:16 Fullscreen', sublabel: 'High-velocity 0-3s retention & trending sounds' },
  { id: 'YouTube', label: 'YouTube Shorts & Videos', formatBadge: '9:16 / 16:9', sublabel: 'Search intent, suggested feed & CTR packaging' },
  { id: 'Twitter', label: 'X (Twitter)', formatBadge: 'Media & Threads', sublabel: 'Viral quote loops, controversy & news discussion' },
  { id: 'LinkedIn', label: 'LinkedIn', formatBadge: 'Carousels & Posts', sublabel: 'B2B frameworks, storytelling & professional credibility' },
  { id: 'Facebook', label: 'Facebook Feed', formatBadge: '16:9 / 1:1', sublabel: 'Broad shareability & community comment velocity' },
  { id: 'Pinterest', label: 'Pinterest Pins', formatBadge: '2:3 / 9:16', sublabel: 'Evergreen search intent, visual boards & saves' },
];

const TONES: { id: ToneId; label: string; tagline: string; description: string }[] = [
  { id: 'high-energy', label: 'High Energy & Urgent', tagline: 'Fast & Punchy', description: 'Immediate hooks, rapid pacing, strong enthusiasm' },
  { id: 'controversial', label: 'Contrarian & Debate', tagline: 'Myth-Buster', description: 'Challenges common beliefs, provokes high-velocity comments' },
  { id: 'authority', label: 'Industry Authority', tagline: 'Expert & Credible', description: 'Data-backed, trusted frameworks, analytical clarity' },
  { id: 'storytelling', label: 'Cinematic Storytelling', tagline: 'Relatable Arc', description: 'Personal narrative, emotional hook, struggle-to-triumph' },
  { id: 'aesthetic', label: 'Modern Aesthetic', tagline: 'Sleek & Minimal', description: 'Understated tone, aspirational lifestyle, visual calm' },
  { id: 'humorous', label: 'Witty & Relatable', tagline: 'Meme & Humor', description: 'Self-aware humor, irony, viral relatable situations' },
];

const GOALS: { id: GoalId; label: string; mechanism: string }[] = [
  { id: 'max-reach', label: 'Max Reach & Discovery', mechanism: 'Optimizes for initial swipe-through prevention & explore feed circulation' },
  { id: 'comments', label: 'Debate & High Comments', mechanism: 'Engineers open-ended polarizing questions and discussion triggers' },
  { id: 'saves', label: 'Saves & Bookmarks', mechanism: 'Packs high cheat-sheet value & actionable step-by-step frameworks' },
  { id: 'link-clicks', label: 'Bio / Link Clicks', mechanism: 'Creates high curiosity gap that directs users to external link' },
  { id: 'follower-growth', label: 'Follower Growth', mechanism: 'Establishes ongoing series value to earn long-term subscribers' },
];

export const CategoryModal: React.FC<CategoryModalProps> = ({
  category,
  onClose,
  onSelectCategoryTab,
  platform,
  onPlatformChange,
  tone,
  onToneChange,
  goal,
  onGoalChange,
  disabled = false,
}) => {
  if (!category || category === 'home') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md transition-all animate-fadeIn">
      {/* Backdrop tap to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Centered Modal Page Box */}
      <div 
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col z-10 animate-slideUp"
      >
        {/* Top Header & Strategy Category Tabs */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              id="cat-tab-platform"
              type="button"
              onClick={() => onSelectCategoryTab('platform')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                category === 'platform'
                  ? 'bg-white text-black ring-2 ring-white/30 shadow-sm'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Choose Platform</span>
            </button>

            <button
              id="cat-tab-tone"
              type="button"
              onClick={() => onSelectCategoryTab('tone')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                category === 'tone'
                  ? 'bg-white text-black ring-2 ring-white/30 shadow-sm'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Tone</span>
            </button>

            <button
              id="cat-tab-goal"
              type="button"
              onClick={() => onSelectCategoryTab('goal')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                category === 'goal'
                  ? 'bg-white text-black ring-2 ring-white/30 shadow-sm'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>Goal</span>
            </button>
          </div>

          <button
            id="btn-close-cat-modal"
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors shrink-0"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {/* TAB 1: PLATFORM */}
          {category === 'platform' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Choose Platform
                </h3>
                <p className="text-xs text-zinc-400">
                  Calibrates aspect ratios, hook timing, and recommendation feed signals
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {PLATFORMS.map((p) => {
                  const isSelected = platform === p.id;
                  return (
                    <button
                      key={p.id}
                      id={`modal-platform-${p.id.toLowerCase()}`}
                      type="button"
                      disabled={disabled}
                      onClick={() => {
                        onPlatformChange(p.id);
                        onClose();
                      }}
                      className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all relative ${
                        isSelected
                          ? 'bg-zinc-900 border-white text-white ring-1 ring-white/50 shadow-md'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900/50'
                      }`}
                    >
                      <div className="space-y-1 min-w-0 pr-2">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-white truncate">{p.label}</p>
                          <span className="text-[10px] font-mono text-zinc-400 bg-zinc-850 px-1.5 py-0.5 rounded border border-zinc-750 shrink-0">
                            {p.formatBadge}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 leading-snug">{p.sublabel}</p>
                      </div>

                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: TONE */}
          {category === 'tone' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Brand Tone & Voice
                </h3>
                <p className="text-xs text-zinc-400">
                  Controls vocabulary pacing, emotional trigger frequency, and persona
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {TONES.map((t) => {
                  const isSelected = tone === t.id;
                  return (
                    <button
                      key={t.id}
                      id={`modal-tone-${t.id}`}
                      type="button"
                      disabled={disabled}
                      onClick={() => {
                        onToneChange(t.id);
                        onClose();
                      }}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-zinc-900 border-white text-white ring-1 ring-white/50 shadow-md'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{t.label}</span>
                        <span className="text-[10px] font-mono text-zinc-400 bg-zinc-850 px-1.5 py-0.5 rounded border border-zinc-750">
                          {t.tagline}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-snug mt-1.5">
                        {t.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: GOAL */}
          {category === 'goal' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Algorithm Goal
                </h3>
                <p className="text-xs text-zinc-400">
                  Calibrates Call-To-Action (CTA) engineering and retention hooks
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {GOALS.map((g) => {
                  const isSelected = goal === g.id;
                  return (
                    <button
                      key={g.id}
                      id={`modal-goal-${g.id}`}
                      type="button"
                      disabled={disabled}
                      onClick={() => {
                        onGoalChange(g.id);
                        onClose();
                      }}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-zinc-900 border-white text-white ring-1 ring-white/50 shadow-md'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{g.label}</span>
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-white text-black flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-snug mt-1.5">
                        {g.mechanism}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between gap-3 shrink-0">
          <span className="text-xs text-zinc-400 font-mono">
            {platform} • {tone} • {goal}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold transition-all shadow-md active:scale-95"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};

