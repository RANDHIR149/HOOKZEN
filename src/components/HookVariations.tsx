import React, { useState } from 'react';
import { HookVariation } from '../types';
import { Sparkles, Copy, Check, ShieldAlert, HelpCircle, Award, Users, Zap } from 'lucide-react';

interface HookVariationsProps {
  hooks: HookVariation[];
  onCopyText: (text: string, label: string) => void;
}

export const HookVariations: React.FC<HookVariationsProps> = ({ hooks, onCopyText }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (hook: HookVariation) => {
    setCopiedId(hook.id);
    onCopyText(hook.text, `Hook (${hook.label})`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyAll = () => {
    const text = hooks.map((h, i) => `[Angle ${i + 1}: ${h.label}]\n"${h.text}"\nStrategy: ${h.reasoning}\n`).join('\n');
    onCopyText(text, 'All Hook Variations');
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-white" />
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              0-3s Opening Hook Lab
            </h3>
            <p className="text-[11px] text-zinc-400">
              Scroll-stopping opening hooks tailored to algorithm distribution
            </p>
          </div>
        </div>

        <button
          id="btn-copy-all-hooks"
          type="button"
          onClick={copyAll}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white transition-colors self-start sm:self-auto border border-zinc-750"
        >
          <Copy className="w-3.5 h-3.5" />
          <span>Copy All 4 Angles</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {hooks.map((hook, index) => {
          const isCopied = copiedId === hook.id;
          return (
            <div
              key={hook.id || index}
              className={`bg-zinc-900/60 border rounded-xl p-4 flex flex-col justify-between transition-all duration-200 ${
                isCopied
                  ? 'border-white bg-zinc-900 ring-1 ring-white/30'
                  : 'border-zinc-800/80 hover:border-zinc-700'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-zinc-800 text-zinc-200 border border-zinc-700">
                      {hook.label}
                    </span>
                    {hook.targetSeconds && (
                      <span className="text-[10px] font-mono text-zinc-400">
                        {hook.targetSeconds}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-sm font-semibold text-white leading-snug">
                  "{hook.text}"
                </p>

                <p className="text-xs text-zinc-400 leading-relaxed border-t border-zinc-800/60 pt-2">
                  {hook.reasoning}
                </p>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleCopy(hook)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    isCopied
                      ? 'bg-white text-black font-bold'
                      : 'bg-zinc-950 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800'
                  }`}
                >
                  {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
