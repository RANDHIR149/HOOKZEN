import React from 'react';
import { 
  Home, 
  Compass, 
  Layers, 
  Target, 
  Menu 
} from 'lucide-react';
import { PlatformId, ToneId, GoalId } from '../types';

export type ActiveCategory = 'home' | 'platform' | 'tone' | 'goal' | null;

interface BottomNavProps {
  activeCategory: ActiveCategory;
  onSelectCategory: (cat: ActiveCategory) => void;
  platform: PlatformId;
  tone: ToneId;
  goal: GoalId;
  onOpenMenu: () => void;
  disabled?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeCategory,
  onSelectCategory,
  platform,
  tone,
  goal,
  onOpenMenu,
  disabled = false,
}) => {
  return (
    <nav
      id="bottom-dock-navigation"
      aria-label="Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-3 sm:pb-4 pt-1 pointer-events-none"
    >
      <div className="max-w-md mx-auto pointer-events-auto">
        <div className="bg-zinc-950/95 backdrop-blur-2xl border border-zinc-800 rounded-3xl p-2 sm:p-2.5 shadow-2xl shadow-black ring-1 ring-white/10 flex items-center justify-around gap-1">
          
          {/* 1. Home Button */}
          <button
            id="bottom-nav-home"
            type="button"
            onClick={() => onSelectCategory('home')}
            className={`flex flex-col items-center justify-center p-1 sm:p-1.5 rounded-2xl transition-all duration-200 group ${
              activeCategory === 'home' || activeCategory === null
                ? 'text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
            title="Home - Studio & Media Upload"
          >
            <div
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all ${
                activeCategory === 'home' || activeCategory === null
                  ? 'bg-white text-black shadow-lg shadow-white/10 ring-2 ring-white/30 scale-105'
                  : 'bg-zinc-900 border border-zinc-800 group-hover:border-zinc-700 group-hover:bg-zinc-850'
              }`}
            >
              <Home className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold mt-1 tracking-tight">Home</span>
          </button>

          {/* 2. Platform Category Button */}
          <button
            id="bottom-nav-platform"
            type="button"
            disabled={disabled}
            onClick={() => onSelectCategory('platform')}
            className={`flex flex-col items-center justify-center p-1 sm:p-1.5 rounded-2xl transition-all duration-200 group ${
              activeCategory === 'platform' ? 'text-white' : 'text-zinc-400 hover:text-white'
            } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
            title={`Platform: ${platform}`}
          >
            <div
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all relative ${
                activeCategory === 'platform'
                  ? 'bg-white text-black shadow-lg shadow-white/10 ring-2 ring-white/30 scale-105'
                  : 'bg-zinc-900 border border-zinc-800 group-hover:border-zinc-700'
              }`}
            >
              <Compass className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-white rounded-full ring-2 ring-black" />
            </div>
            <span className="text-[10px] font-medium mt-1 max-w-[54px] truncate text-center">
              Platform
            </span>
          </button>

          {/* 3. Tone & Voice Button */}
          <button
            id="bottom-nav-tone"
            type="button"
            disabled={disabled}
            onClick={() => onSelectCategory('tone')}
            className={`flex flex-col items-center justify-center p-1 sm:p-1.5 rounded-2xl transition-all duration-200 group ${
              activeCategory === 'tone' ? 'text-white' : 'text-zinc-400 hover:text-white'
            } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
            title={`Tone: ${tone}`}
          >
            <div
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all ${
                activeCategory === 'tone'
                  ? 'bg-white text-black shadow-lg shadow-white/10 ring-2 ring-white/30 scale-105'
                  : 'bg-zinc-900 border border-zinc-800 group-hover:border-zinc-700'
              }`}
            >
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium mt-1 max-w-[50px] truncate text-center">
              Tone
            </span>
          </button>

          {/* 4. Goal Button */}
          <button
            id="bottom-nav-goal"
            type="button"
            disabled={disabled}
            onClick={() => onSelectCategory('goal')}
            className={`flex flex-col items-center justify-center p-1 sm:p-1.5 rounded-2xl transition-all duration-200 group ${
              activeCategory === 'goal' ? 'text-white' : 'text-zinc-400 hover:text-white'
            } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
            title={`Goal: ${goal}`}
          >
            <div
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all ${
                activeCategory === 'goal'
                  ? 'bg-white text-black shadow-lg shadow-white/10 ring-2 ring-white/30 scale-105'
                  : 'bg-zinc-900 border border-zinc-800 group-hover:border-zinc-700'
              }`}
            >
              <Target className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium mt-1 max-w-[48px] truncate text-center">
              Goal
            </span>
          </button>

          {/* 5. Menu / Settings Button */}
          <button
            id="bottom-nav-menu"
            type="button"
            onClick={onOpenMenu}
            className="flex flex-col items-center justify-center p-1 sm:p-1.5 rounded-2xl transition-all duration-200 group text-zinc-400 hover:text-white cursor-pointer active:scale-95"
            title="Menu & Studio Settings"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all bg-zinc-900 border border-zinc-800 group-hover:border-zinc-700 group-hover:bg-zinc-850">
              <Menu className="w-5 h-5 text-zinc-300 group-hover:text-white" />
            </div>
            <span className="text-[10px] font-medium mt-1 text-center">
              Menu
            </span>
          </button>

        </div>
      </div>
    </nav>
  );
};

