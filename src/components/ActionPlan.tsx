import React, { useState } from 'react';
import { AudienceStrategy, StrategyExperiment } from '../types';
import { Target, Clock, MousePointerClick, Heart, FlaskConical, Lightbulb, Copy, Check } from 'lucide-react';

interface ActionPlanProps {
  audience: AudienceStrategy;
  experiments: StrategyExperiment[];
  actionableTips: string[];
  onCopyText: (text: string, label: string) => void;
}

export const ActionPlan: React.FC<ActionPlanProps> = ({
  audience,
  experiments,
  actionableTips,
  onCopyText,
}) => {
  const [copiedCta, setCopiedCta] = useState(false);

  const handleCopyCta = () => {
    onCopyText(audience.recommendedCta, 'Recommended CTA');
    setCopiedCta(true);
    setTimeout(() => setCopiedCta(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Audience & Distribution Strategy Card */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-white" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Audience Persona & Conversion Blueprint
              </h3>
              <p className="text-[11px] text-zinc-400">
                Viewer demographics, emotional triggers, optimal window & conversion CTA
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Target Persona */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
              <Target className="w-3.5 h-3.5 text-white" />
              <span>Target Archetype</span>
            </div>
            <p className="text-xs font-bold text-white leading-snug">
              {audience.targetPersona}
            </p>
          </div>

          {/* Emotional Trigger */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
              <Heart className="w-3.5 h-3.5 text-white" />
              <span>Core Trigger</span>
            </div>
            <p className="text-xs font-bold text-white leading-snug">
              {audience.emotionalTrigger}
            </p>
          </div>

          {/* Best Time to Post */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
              <Clock className="w-3.5 h-3.5 text-white" />
              <span>Optimal Post Window</span>
            </div>
            <p className="text-xs font-bold font-mono text-white leading-snug">
              {audience.bestPostTime}
            </p>
          </div>

          {/* Recommended CTA */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-1.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-zinc-400">
                <span className="flex items-center gap-2">
                  <MousePointerClick className="w-3.5 h-3.5 text-white" />
                  Conversion CTA
                </span>
                <button
                  id="btn-copy-cta"
                  type="button"
                  onClick={handleCopyCta}
                  className="text-zinc-400 hover:text-white"
                  title="Copy CTA"
                >
                  {copiedCta ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
              <p className="text-xs font-bold text-white mt-1 truncate">
                "{audience.recommendedCta}"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* A/B Testing Experiments */}
      {experiments && experiments.length > 0 && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
            <FlaskConical className="w-4 h-4 text-white" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                A/B Split Test Hypotheses
              </h3>
              <p className="text-[11px] text-zinc-400">
                Test these creative variants against your control
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {experiments.map((exp, index) => (
              <div key={index} className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">{exp.name}</h4>
                  <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">
                    Test #{index + 1}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 italic">
                  Hypothesis: {exp.hypothesis}
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1">
                    <span className="text-[10px] font-bold text-zinc-400">Variant A</span>
                    <p className="text-xs text-zinc-200">{exp.variantA}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1">
                    <span className="text-[10px] font-bold text-zinc-400">Variant B</span>
                    <p className="text-xs text-zinc-200">{exp.variantB}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actionable Editorial Checklist */}
      {actionableTips && actionableTips.length > 0 && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
            <Lightbulb className="w-4 h-4 text-white" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Editorial Directives & Checklist
              </h3>
              <p className="text-[11px] text-zinc-400">
                Key adjustments before publishing
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {actionableTips.map((tip, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <span className="w-5 h-5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-mono flex items-center justify-center shrink-0">
                  {index + 1}
                </span>
                <p className="text-xs text-zinc-200 leading-relaxed pt-0.5">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
