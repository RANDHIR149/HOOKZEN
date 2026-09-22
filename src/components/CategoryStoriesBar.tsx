import React from 'react';
import { 
  Zap, 
  Target, 
  Layers, 
  SlidersHorizontal
} from 'lucide-react';
import { PlatformId, ToneId, GoalId } from '../types';
import { ActiveCategory } from './BottomNav';

interface CategoryStoriesBarProps {
  platform: PlatformId;
  tone: ToneId;
  goal: GoalId;
  isTurbo: boolean;
  onTurboToggle: () => void;
  onOpenCategory: (category: ActiveCategory) => void;
  disabled?: boolean;
}

const PLATFORM_STYLES: Record<PlatformId, { code: string; bg: string; text: string; border: string }> = {
  Instagram: { code: 'IG', bg: 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600', text: 'text-white', border: 'border-pink-500/40 hover:border-pink-500' },
  TikTok: { code: 'TT', bg: 'bg-zinc-950', text: 'text-cyan-400', border: 'border-cyan-500/40 hover:border-cyan-400' },
  YouTube: { code: 'YT', bg: 'bg-red-600', text: 'text-white', border: 'border-red-500/40 hover:border-red-500' },
  Twitter: { code: '𝕏', bg: 'bg-zinc-900', text: 'text-white', border: 'border-zinc-700 hover:border-zinc-500' },
  LinkedIn: { code: 'IN', bg: 'bg-[#0A66C2]', text: 'text-white', border: 'border-blue-500/40 hover:border-blue-500' },
  Facebook: { code: 'FB', bg: 'bg-[#1877F2]', text: 'text-white', border: 'border-blue-600/40 hover:border-blue-500' },
  Pinterest: { code: 'PIN', bg: 'bg-[#E60023]', text: 'text-white', border: 'border-rose-500/40 hover:border-rose-500' },
};

export const CategoryStoriesBar: React.FC<CategoryStoriesBarProps> = ({
  platform,
  tone,
  goal,
  isTurbo,
  onTurboToggle,
  onOpenCategory,
  disabled = false,
}) => {
  const platStyle = PLATFORM_STYLES[platform] || PLATFORM_STYLES.Instagram;

  return (
    <div className="bg-card border border-border rounded-2xl p-3.5 sm:p-4 shadow-xl space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-secondary border border-border flex items-center justify-center">
            <SlidersHorizontal className="w-3 h-3 text-foreground" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Strategy Parameters
          </span>
        </div>
        <span className="text-[11px] text-muted-foreground font-medium hidden sm:inline">
          Tap any item to change
        </span>
      </div>

      {/* Balanced 4-Column Strategy Grid */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        
        {/* 1. Platform with Brand Colors */}
        <button
          id="circle-story-platform"
          type="button"
          disabled={disabled}
          onClick={() => onOpenCategory('platform')}
          title="Choose Platform"
          className={`flex flex-col items-center gap-1.5 p-2 sm:p-2.5 rounded-xl bg-secondary/70 hover:bg-secondary border ${platStyle.border} transition-colors text-center cursor-pointer shadow-sm`}
        >
          <div className={`w-10 h-10 rounded-full ${platStyle.bg} flex items-center justify-center text-xs font-black ${platStyle.text} shadow-md`}>
            <span>{platStyle.code}</span>
          </div>
          <div className="w-full">
            <p className="text-[11px] font-bold text-foreground truncate">{platform}</p>
            <p className="text-[9px] text-muted-foreground font-mono">Platform</p>
          </div>
        </button>

        {/* 2. Tone (Purple Accent) */}
        <button
          id="circle-story-tone"
          type="button"
          disabled={disabled}
          onClick={() => onOpenCategory('tone')}
          className="flex flex-col items-center gap-1.5 p-2 sm:p-2.5 rounded-xl bg-purple-500/5 hover:bg-purple-500/10 border border-purple-500/30 hover:border-purple-500/50 transition-colors text-center cursor-pointer shadow-sm"
        >
          <div className="w-10 h-10 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-sm">
            <Layers className="w-4 h-4" />
          </div>
          <div className="w-full">
            <p className="text-[11px] font-bold text-foreground truncate capitalize">
              {tone.replace('-', ' ')}
            </p>
            <p className="text-[9px] text-purple-600 dark:text-purple-400 font-mono">Tone</p>
          </div>
        </button>

        {/* 3. Goal (Emerald Accent) */}
        <button
          id="circle-story-goal"
          type="button"
          disabled={disabled}
          onClick={() => onOpenCategory('goal')}
          className="flex flex-col items-center gap-1.5 p-2 sm:p-2.5 rounded-xl bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/30 hover:border-emerald-500/50 transition-colors text-center cursor-pointer shadow-sm"
        >
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm">
            <Target className="w-4 h-4" />
          </div>
          <div className="w-full">
            <p className="text-[11px] font-bold text-foreground truncate capitalize">
              {goal.replace('-', ' ')}
            </p>
            <p className="text-[9px] text-emerald-600 dark:text-emerald-400 font-mono">Goal</p>
          </div>
        </button>

        {/* 4. Turbo Toggle (Amber Energy Accent) */}
        <button
          id="circle-story-turbo"
          type="button"
          disabled={disabled}
          onClick={onTurboToggle}
          className={`flex flex-col items-center gap-1.5 p-2 sm:p-2.5 rounded-xl border transition-colors text-center cursor-pointer shadow-sm ${
            isTurbo 
              ? 'bg-amber-500/10 border-amber-500/40 hover:border-amber-500 text-foreground' 
              : 'bg-secondary/70 hover:bg-secondary border-border text-foreground'
          }`}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
            isTurbo 
              ? 'bg-amber-500 text-black' 
              : 'bg-secondary border border-border text-muted-foreground'
          }`}>
            <Zap className={`w-4 h-4 ${isTurbo ? 'fill-black text-black' : 'text-muted-foreground'}`} />
          </div>
          <div className="w-full">
            <p className={`text-[11px] font-bold truncate ${isTurbo ? 'text-amber-600 dark:text-amber-400' : 'text-foreground'}`}>
              {isTurbo ? '⚡ Turbo' : 'Deep'}
            </p>
            <p className="text-[9px] text-muted-foreground font-mono">AI Engine</p>
          </div>
        </button>

      </div>
    </div>
  );
};

