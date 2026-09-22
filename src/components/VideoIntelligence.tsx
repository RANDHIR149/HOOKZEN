import React from 'react';
import { VideoInsights } from '../types';
import { Video, Clock, TrendingUp, Music, Activity } from 'lucide-react';

interface VideoIntelligenceProps {
  insights: VideoInsights;
}

export const VideoIntelligence: React.FC<VideoIntelligenceProps> = ({ insights }) => {
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-2">
          <Video className="w-4 h-4 text-white" />
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Frame-by-Frame Retention Audit
            </h3>
            <p className="text-[11px] text-zinc-400">
              Pacing cadence, 0-3s hook drop-off prevention & audio strategy
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono text-zinc-300 bg-zinc-900 px-2.5 py-1 rounded-full border border-zinc-700 self-start sm:self-auto">
          Watch Time Optimization
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Visual Flow & Pacing */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Activity className="w-4 h-4 text-zinc-400" />
              <span>Visual Framing & Motion Flow</span>
            </div>
            {insights.recommendedPacing && (
              <span className="font-mono text-[10px] text-zinc-300 bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700">
                Pacing: {insights.recommendedPacing}
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">
            {insights.visualFlow}
          </p>
        </div>

        {/* Hook Timing Analysis */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <Clock className="w-4 h-4 text-zinc-400" />
            <span>Critical Hook Window (0-3s)</span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">
            {insights.hookTiming}
          </p>
          <div className="pt-2 border-t border-zinc-800 flex items-center gap-1.5 text-[10px] text-zinc-400">
            <span>First 1.5 seconds determine 80% of scroll-away drops.</span>
          </div>
        </div>

        {/* Retention Curve Drop-off Prevention */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <TrendingUp className="w-4 h-4 text-zinc-400" />
            <span>Retention Curve Tactics</span>
          </div>
          <ul className="space-y-2">
            {insights.retentionCurveTips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                <span className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 shrink-0" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Audio & Sound Suggestions */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <Music className="w-4 h-4 text-zinc-400" />
            <span>Audio & Voiceover Strategy</span>
          </div>
          <ul className="space-y-2">
            {insights.audioSuggestions.map((audio, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                <span className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 shrink-0" />
                <span>{audio}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
