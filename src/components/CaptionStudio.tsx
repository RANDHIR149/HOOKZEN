import React, { useState } from 'react';
import { CaptionVariants } from '../types';
import { FileText, Copy, Check, Clock, Hash, AlignLeft } from 'lucide-react';

interface CaptionStudioProps {
  captions: CaptionVariants;
  onCopyText: (text: string, label: string) => void;
}

type TabType = 'punchy' | 'story' | 'thread';

export const CaptionStudio: React.FC<CaptionStudioProps> = ({ captions, onCopyText }) => {
  const [activeTab, setActiveTab] = useState<TabType>('punchy');
  const [copied, setCopied] = useState(false);

  const getActiveText = (): string => {
    switch (activeTab) {
      case 'punchy':
        return captions.punchy;
      case 'story':
        return captions.story;
      case 'thread':
        return captions.thread;
    }
  };

  const activeText = getActiveText();
  const wordCount = activeText.trim().split(/\s+/).filter(Boolean).length;
  const charCount = activeText.length;
  const readTimeSec = Math.max(2, Math.round(wordCount / 3.5));

  const handleCopy = () => {
    onCopyText(activeText, `Caption (${activeTab.toUpperCase()})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-white" />
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Multi-Format Caption Studio
            </h3>
            <p className="text-[11px] text-zinc-400">
              Categorized formats tailored for short-form velocity, long-form saves, or step breakdown
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center bg-zinc-900 p-1 rounded-xl border border-zinc-800 self-start sm:self-auto">
          <button
            id="tab-caption-punchy"
            type="button"
            onClick={() => setActiveTab('punchy')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'punchy'
                ? 'bg-white text-black shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Punchy (Short)
          </button>
          <button
            id="tab-caption-story"
            type="button"
            onClick={() => setActiveTab('story')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'story'
                ? 'bg-white text-black shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Story / Value
          </button>
          <button
            id="tab-caption-thread"
            type="button"
            onClick={() => setActiveTab('thread')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'thread'
                ? 'bg-white text-black shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Bullet Thread
          </button>
        </div>
      </div>

      {/* Caption Content Box */}
      <div className="relative bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 space-y-4">
        {/* Top bar with stats & copy */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-800 text-xs text-zinc-400">
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span className="flex items-center gap-1.5 text-zinc-300">
              <AlignLeft className="w-3.5 h-3.5" />
              {wordCount} words
            </span>
            <span className="flex items-center gap-1.5 text-zinc-300">
              <Hash className="w-3.5 h-3.5" />
              {charCount} chars
            </span>
            <span className="flex items-center gap-1.5 text-zinc-300">
              <Clock className="w-3.5 h-3.5" />
              ~{readTimeSec}s read
            </span>
          </div>

          <button
            id="btn-copy-active-caption"
            type="button"
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              copied
                ? 'bg-white text-black'
                : 'bg-zinc-950 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-800'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Caption'}</span>
          </button>
        </div>

        {/* Text Area */}
        <div className="text-sm font-sans text-zinc-100 whitespace-pre-wrap leading-relaxed">
          {activeText}
        </div>
      </div>
    </div>
  );
};
