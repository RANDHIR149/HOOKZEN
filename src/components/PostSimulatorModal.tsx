import React, { useState } from 'react';
import { ViralContent, PlatformId, MediaType } from '../types';
import { X, Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';

interface PostSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: ViralContent;
  previewUrl: string | null;
  mediaType: MediaType | null;
  defaultPlatform: PlatformId;
}

export const PostSimulatorModal: React.FC<PostSimulatorModalProps> = ({
  isOpen,
  onClose,
  result,
  previewUrl,
  mediaType,
  defaultPlatform,
}) => {
  const [platform, setPlatform] = useState<PlatformId>(defaultPlatform);

  if (!isOpen) return null;

  const hook = result.hooks[0]?.text || result.title;
  const caption = result.captions.punchy;
  const hashtags = result.hashtags.highReach.slice(0, 5).map(t => t.startsWith('#') ? t : `#${t}`).join(' ');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-950">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              Live Feed Simulator
            </span>
            <span className="text-[10px] font-mono bg-zinc-900 text-zinc-300 px-2 py-0.5 rounded-full border border-zinc-700">
              {platform}
            </span>
          </div>

          <button
            id="btn-close-simulator"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Platform Switcher */}
        <div className="flex items-center justify-center gap-1.5 p-2 bg-zinc-950 border-b border-zinc-800 overflow-x-auto">
          {(['Instagram', 'TikTok', 'Twitter', 'LinkedIn'] as PlatformId[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPlatform(p)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                platform === p
                  ? 'bg-white text-black font-bold'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Simulated Mobile Mockup View */}
        <div className="p-4 overflow-y-auto custom-scrollbar flex-1 bg-black">
          <div className="max-w-[340px] mx-auto bg-zinc-950 rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl">
            {/* Account Header */}
            <div className="flex items-center justify-between p-3 border-b border-zinc-800/80">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white text-black font-black flex items-center justify-center text-xs">
                  VV
                </div>
                <div>
                  <p className="text-xs font-bold text-white leading-tight">your_channel</p>
                  <p className="text-[10px] text-zinc-400 leading-tight">Original Audio</p>
                </div>
              </div>
              <MoreHorizontal className="w-4 h-4 text-zinc-400" />
            </div>

            {/* Media Container with Hook Overlay */}
            <div className="relative bg-zinc-950 aspect-[4/5] sm:aspect-square flex items-center justify-center overflow-hidden">
              {previewUrl ? (
                mediaType === 'video' ? (
                  <video src={previewUrl} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                ) : (
                  <img src={previewUrl} alt="Post preview" className="w-full h-full object-cover" />
                )
              ) : (
                <div className="text-xs text-zinc-500">No media attached</div>
              )}

              {/* Dynamic Hook On-Screen Text Overlay */}
              <div className="absolute inset-x-3 bottom-3 p-2.5 rounded-xl bg-black/85 backdrop-blur-md border border-white/20 text-center shadow-lg">
                <p className="text-xs font-extrabold text-white leading-snug tracking-tight">
                  "{hook}"
                </p>
              </div>
            </div>

            {/* Engagement Metrics Bar */}
            <div className="p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-white">
                  <Heart className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                  <MessageCircle className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                  <Send className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                </div>
                <Bookmark className="w-5 h-5 text-white hover:text-zinc-400 cursor-pointer transition-colors" />
              </div>

              <p className="text-[11px] font-bold text-white">
                14,289 likes
              </p>

              {/* Simulated Caption */}
              <div className="text-xs space-y-1">
                <p className="text-zinc-200 leading-relaxed">
                  <span className="font-bold text-white mr-1.5">your_channel</span>
                  {caption.slice(0, 140)}...
                </p>
                <p className="text-zinc-400 font-mono text-[10px]">
                  {hashtags}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
