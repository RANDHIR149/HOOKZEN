import React, { useState } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Clock, 
  Hash, 
  Lightbulb, 
  FileText, 
  RotateCcw, 
  Smartphone,
  Share2,
  TrendingUp,
  SlidersHorizontal,
  Flame
} from 'lucide-react';
import { ViralContent, PlatformId } from '../types';

interface CreatorPostKitProps {
  result: ViralContent;
  platform: PlatformId;
  onReset: () => void;
  onOpenSimulator: () => void;
  onAdjustStrategy: () => void;
  onCopyText: (text: string, label: string) => void;
}

const PLATFORM_THEMES: Record<PlatformId, {
  name: string;
  badge: string;
  gradient: string;
  accentText: string;
  iconBg: string;
  borderCol: string;
}> = {
  Instagram: {
    name: 'Instagram',
    badge: 'Reels & Posts',
    gradient: 'from-pink-500 via-rose-500 to-purple-600',
    accentText: 'text-pink-500',
    iconBg: 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white',
    borderCol: 'border-pink-500/30 hover:border-pink-500/50',
  },
  YouTube: {
    name: 'YouTube',
    badge: 'Shorts & Videos',
    gradient: 'from-red-600 to-red-700',
    accentText: 'text-red-500',
    iconBg: 'bg-red-600 text-white',
    borderCol: 'border-red-500/30 hover:border-red-500/50',
  },
  TikTok: {
    name: 'TikTok',
    badge: 'Trending Feed',
    gradient: 'from-cyan-500 via-teal-500 to-pink-500',
    accentText: 'text-cyan-400',
    iconBg: 'bg-zinc-950 border border-cyan-400 text-cyan-400',
    borderCol: 'border-cyan-500/30 hover:border-cyan-500/50',
  },
  LinkedIn: {
    name: 'LinkedIn',
    badge: 'Posts & Carousels',
    gradient: 'from-blue-600 to-cyan-700',
    accentText: 'text-blue-500',
    iconBg: 'bg-[#0A66C2] text-white',
    borderCol: 'border-blue-500/30 hover:border-blue-500/50',
  },
  Twitter: {
    name: 'X (Twitter)',
    badge: 'Thread & Media',
    gradient: 'from-zinc-700 to-zinc-900',
    accentText: 'text-zinc-200',
    iconBg: 'bg-black text-white border border-zinc-700',
    borderCol: 'border-zinc-600/30 hover:border-zinc-500/50',
  },
  Facebook: {
    name: 'Facebook',
    badge: 'Feed & Reels',
    gradient: 'from-blue-700 to-indigo-800',
    accentText: 'text-blue-500',
    iconBg: 'bg-[#1877F2] text-white',
    borderCol: 'border-blue-600/30 hover:border-blue-500/50',
  },
  Pinterest: {
    name: 'Pinterest',
    badge: 'Pins & Idea Boards',
    gradient: 'from-rose-600 to-red-700',
    accentText: 'text-rose-500',
    iconBg: 'bg-[#E60023] text-white',
    borderCol: 'border-rose-500/30 hover:border-rose-500/50',
  },
};

export const CreatorPostKit: React.FC<CreatorPostKitProps> = ({
  result,
  platform,
  onReset,
  onOpenSimulator,
  onAdjustStrategy,
  onCopyText,
}) => {
  const [captionTab, setCaptionTab] = useState<'punchy' | 'story' | 'thread'>('punchy');
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedHashtags, setCopiedHashtags] = useState(false);
  const [copiedTag, setCopiedTag] = useState<string | null>(null);

  const theme = PLATFORM_THEMES[platform] || PLATFORM_THEMES.Instagram;

  // Active caption text
  const currentCaption = result.captions[captionTab] || result.captions.punchy;

  // Primary hook details
  const primaryHook = result.hooks?.[0] || {
    text: result.title,
    reasoning: 'Creates instant curiosity gap in first 3 seconds.',
  };

  const hookScore = result.scoreBreakdown.hookStrength || 90;
  const overallScore = result.scoreBreakdown.overall || 88;

  // Hashtags list
  const allHashtags = [
    ...(result.hashtags.highReach || []),
    ...(result.hashtags.nicheTargeted || []),
    ...(result.hashtags.seoKeywords || []),
  ].map((t) => (t.startsWith('#') ? t : `#${t}`));

  const handleCopyTitle = () => {
    onCopyText(result.title, 'Post Title / Hook');
    setCopiedTitle(true);
    setTimeout(() => setCopiedTitle(false), 2000);
  };

  const handleCopyCaption = () => {
    onCopyText(currentCaption, `Caption (${captionTab.toUpperCase()})`);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  const handleCopyAllHashtags = () => {
    const raw = allHashtags.join(' ');
    onCopyText(raw, 'All Hashtags');
    setCopiedHashtags(true);
    setTimeout(() => setCopiedHashtags(false), 2000);
  };

  const handleCopySingleTag = (tag: string) => {
    onCopyText(tag, `Tag (${tag})`);
    setCopiedTag(tag);
    setTimeout(() => setCopiedTag(null), 1500);
  };

  // Retention Hook tip
  const hookTip = 
    result.videoInsights?.hookTiming || 
    result.actionableTips?.[0] || 
    'Start immediately with visual action or question. Avoid saying "Hey guys" in first 3 seconds.';

  return (
    <div className="space-y-4">
      {/* 1. Header Toolbar with Clear Action Controls & Platform Identity */}
      <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-card border border-border shadow-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm shadow-md ${theme.iconBg}`}>
            {platform.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-foreground">
                {platform} Viral Post Kit
              </h2>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 font-mono">
                Ready to Post
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Viral Score: <strong className="text-foreground font-mono">{overallScore}/100</strong> • Optimized for reach & retention
            </p>
          </div>
        </div>

        {/* Action Controls: Live Preview & Adjust (No Reset here - Reset is at the bottom) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenSimulator}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-xs font-semibold text-foreground border border-border transition-colors shadow-sm cursor-pointer"
            title="Preview how it looks on mobile feed"
          >
            <Smartphone className="w-3.5 h-3.5 text-blue-500" />
            <span className="hidden sm:inline">Feed Preview</span>
          </button>

          <button
            type="button"
            onClick={onAdjustStrategy}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-xs font-semibold text-foreground border border-border transition-colors shadow-sm cursor-pointer"
            title="Adjust Platform or Tone"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-purple-500" />
            <span className="hidden sm:inline">Adjust</span>
          </button>
        </div>
      </div>

      {/* Real Video Content Recognition Banner */}
      {result.detectedContent && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-card border border-border shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-start sm:items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-500 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-foreground">Detected Video Topic:</span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  {result.detectedContent.genre}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                <strong className="text-foreground font-medium">{result.detectedContent.realSubject}</strong>
              </p>
            </div>
          </div>

          {result.detectedContent.keyElements && result.detectedContent.keyElements.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap sm:justify-end shrink-0 pt-1 sm:pt-0">
              {result.detectedContent.keyElements.slice(0, 4).map((item, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-secondary text-foreground border border-border"
                >
                  ✓ {item}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. Primary Creator Essentials Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* CARD 1: TITLE & HOOK (Warm Amber / Fire Gradient Card) - 8 Cols on Large */}
        <div className="lg:col-span-8 p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/30 dark:border-amber-500/25 shadow-lg space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/20 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-500">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  1. Viral Title & Hook
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Thumb-stopping headline for your video/post
                </p>
              </div>
            </div>

            {/* Hook Strength Indicator */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-black shadow-sm font-mono">
                <Flame className="w-3 h-3 fill-black" />
                Hook: {hookScore}/100
              </span>
              <button
                type="button"
                id="btn-copy-title"
                onClick={handleCopyTitle}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-card hover:bg-secondary text-foreground text-xs font-semibold border border-amber-500/40 transition-colors shadow-sm cursor-pointer"
              >
                {copiedTitle ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedTitle ? 'Copied!' : 'Copy Title'}</span>
              </button>
            </div>
          </div>

          {/* Master Headline Display */}
          <div className="p-4 rounded-xl sm:rounded-2xl bg-card/80 border border-amber-500/20 space-y-2">
            <p className="text-base sm:text-lg font-extrabold text-foreground leading-snug">
              {result.title}
            </p>
            {primaryHook?.reasoning && (
              <p className="text-xs text-amber-700 dark:text-amber-300/80 flex items-center gap-1.5 pt-1">
                <Lightbulb className="w-3.5 h-3.5 shrink-0" />
                <span>{primaryHook.reasoning}</span>
              </p>
            )}
          </div>
        </div>

        {/* CARD 2: BEST TIME TO POST (Fresh Emerald Mint Card) - 4 Cols on Large */}
        <div className="lg:col-span-4 p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/30 dark:border-emerald-500/25 shadow-lg flex flex-col justify-between space-y-4">
          <div className="flex items-center gap-2 border-b border-emerald-500/20 pb-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-500">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                2. Best Time to Post
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Peak audience engagement window
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl sm:rounded-2xl bg-card/80 border border-emerald-500/20 space-y-2 text-center my-auto">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              High Velocity Window
            </span>
            <p className="text-base sm:text-xl font-black text-foreground font-mono tracking-tight pt-1">
              {result.audienceStrategy?.bestPostTime || '7:00 PM – 9:00 PM (Local Time)'}
            </p>
            <p className="text-[11px] text-muted-foreground">
              Optimal window when your target audience is most active online
            </p>
          </div>
        </div>

        {/* CARD 3: CAPTION / DESCRIPTION (Royal Indigo / Blue Card) - 7 Cols on Large */}
        <div className="lg:col-span-7 p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-indigo-500/10 via-blue-500/5 to-transparent border border-indigo-500/30 dark:border-indigo-500/25 shadow-lg space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-500/20 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-500">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  3. Caption & Description
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Formatted & ready to paste on your post
                </p>
              </div>
            </div>

            {/* Caption Format Switcher */}
            <div className="flex items-center gap-1 bg-card p-1 rounded-xl border border-indigo-500/25">
              <button
                type="button"
                onClick={() => setCaptionTab('punchy')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  captionTab === 'punchy'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Short
              </button>
              <button
                type="button"
                onClick={() => setCaptionTab('story')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  captionTab === 'story'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Detailed
              </button>
              <button
                type="button"
                onClick={() => setCaptionTab('thread')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  captionTab === 'thread'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Points
              </button>
            </div>
          </div>

          {/* Caption Box with Copy Button */}
          <div className="p-4 rounded-xl sm:rounded-2xl bg-card/80 border border-indigo-500/20 space-y-3">
            <div className="max-h-56 overflow-y-auto pr-1">
              <p className="text-xs sm:text-sm text-foreground whitespace-pre-line leading-relaxed select-all">
                {currentCaption}
              </p>
            </div>

            <div className="pt-2 border-t border-indigo-500/15 flex items-center justify-between gap-3">
              <span className="text-[11px] text-muted-foreground">
                {currentCaption.length} characters • Ready to paste
              </span>
              <button
                type="button"
                id="btn-copy-caption-main"
                onClick={handleCopyCaption}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
              >
                {copiedCaption ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCaption ? 'Caption Copied!' : 'Copy Caption'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* CARD 4: HASHTAGS (Vivid Purple Card) - 5 Cols on Large */}
        <div className="lg:col-span-5 p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-purple-500/10 via-fuchsia-500/5 to-transparent border border-purple-500/30 dark:border-purple-500/25 shadow-lg flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between gap-2 border-b border-purple-500/20 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-500">
                <Hash className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  4. Viral Hashtags
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  {allHashtags.length} high-reach & targeted tags
                </p>
              </div>
            </div>

            <button
              type="button"
              id="btn-copy-hashtags-main"
              onClick={handleCopyAllHashtags}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors shadow-sm cursor-pointer"
            >
              {copiedHashtags ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedHashtags ? 'Copied All!' : 'Copy All'}</span>
            </button>
          </div>

          {/* Hashtag Pills Matrix */}
          <div className="p-4 rounded-xl sm:rounded-2xl bg-card/80 border border-purple-500/20 flex-1 flex flex-col justify-between space-y-3">
            <div className="flex flex-wrap gap-1.5 max-h-44 overflow-y-auto pr-1">
              {allHashtags.map((tag) => {
                const isSingleCopied = copiedTag === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleCopySingleTag(tag)}
                    className={`text-[11px] font-mono px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                      isSingleCopied
                        ? 'bg-purple-600 text-white border-purple-600 scale-105'
                        : 'bg-secondary hover:bg-purple-500/20 text-foreground border-border hover:border-purple-500/40'
                    }`}
                    title="Click to copy single hashtag"
                  >
                    {tag}
                  </button>
                );
              })}
            </div>

            <p className="text-[10px] text-muted-foreground text-center">
              Click any hashtag to copy individually
            </p>
          </div>
        </div>

        {/* CARD 5: 3-SECOND RETENTION HOOK SECRET (Cyan Sky Card) - 12 Cols */}
        <div className="lg:col-span-12 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-sky-500/5 to-transparent border border-cyan-500/30 dark:border-cyan-500/25 shadow-md flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-500 shrink-0">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                5. 3-Second Retention Hook Secret
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-mono">
                Retention Tip
              </span>
            </div>
            <p className="text-xs sm:text-sm text-foreground font-medium pt-0.5">
              {hookTip}
            </p>
          </div>
        </div>

        {/* BOTTOM DEDICATED RESTART / RESET CARD */}
        <div className="lg:col-span-12 p-4 sm:p-5 rounded-2xl bg-card border border-border shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-bold text-foreground">
              Ready for your next post?
            </h4>
            <p className="text-xs text-muted-foreground">
              Reset the current workspace to upload another video or creative.
            </p>
          </div>
          <button
            type="button"
            id="btn-bottom-restart-post"
            onClick={onReset}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-600 dark:text-rose-400 border border-rose-500/30 hover:border-rose-500/50 text-xs sm:text-sm font-bold transition-colors cursor-pointer shadow-sm active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Start New Post (Reset)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
