import React from 'react';
import { ScoreBreakdown } from '../types';
import { Award, Zap, Eye, Share2, Search } from 'lucide-react';

interface ScoreCardProps {
  scoreBreakdown: ScoreBreakdown;
  summaryAngle: string;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ scoreBreakdown, summaryAngle }) => {
  const getScoreVerdict = (val: number) => {
    if (val >= 90) return 'Breakout Viral Potential';
    if (val >= 80) return 'High Algorithmic Velocity';
    if (val >= 70) return 'Solid Core Performance';
    return 'Optimization Recommended';
  };

  const metrics = [
    { label: 'Hook Strength', value: scoreBreakdown.hookStrength, icon: <Zap className="w-3.5 h-3.5 text-amber-500" />, desc: '0-3s thumb-stop power', barCol: 'bg-amber-500', textCol: 'text-amber-500' },
    { label: 'Viewer Retention', value: scoreBreakdown.retentionScore, icon: <Eye className="w-3.5 h-3.5 text-emerald-500" />, desc: 'Watch-time completion', barCol: 'bg-emerald-500', textCol: 'text-emerald-500' },
    { label: 'Shareability', value: scoreBreakdown.shareability, icon: <Share2 className="w-3.5 h-3.5 text-purple-500" />, desc: 'DM & repost velocity', barCol: 'bg-purple-500', textCol: 'text-purple-500' },
    { label: 'Algorithmic SEO', value: scoreBreakdown.seoScore, icon: <Search className="w-3.5 h-3.5 text-blue-500" />, desc: 'Keyword discoverability', barCol: 'bg-blue-500', textCol: 'text-blue-500' },
  ];

  return (
    <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-foreground" />
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Viral Performance Breakdown
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Multi-factor algorithmic benchmark
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold text-muted-foreground px-3 py-1 rounded-full bg-secondary border border-border self-start sm:self-auto">
          Verdict: <span className="text-foreground font-bold">{getScoreVerdict(scoreBreakdown.overall)}</span>
        </span>
      </div>

      {/* Top Banner: Master Score and Angle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground bg-secondary px-2 py-0.5 rounded border border-border">
            Strategic Angle
          </span>
          <p className="text-sm font-semibold text-foreground leading-relaxed pt-1">
            {summaryAngle}
          </p>
        </div>

        {/* Master Score Dial */}
        <div className="flex items-center gap-4 shrink-0 bg-secondary/80 border border-border rounded-2xl p-4 self-start md:self-auto shadow-inner">
          <div className="w-16 h-16 rounded-2xl bg-foreground text-background flex flex-col items-center justify-center font-mono shadow-md">
            <span className="text-2xl font-black leading-none">{scoreBreakdown.overall}</span>
            <span className="text-[10px] uppercase font-bold opacity-70">/ 100</span>
          </div>
          <div>
            <p className="text-xs font-bold text-foreground">Viral Index</p>
            <p className="text-[11px] text-muted-foreground">
              {scoreBreakdown.overall >= 80 ? 'Top percentile circulation' : 'Standard distribution'}
            </p>
          </div>
        </div>
      </div>

      {/* 4 Pillar Sub-Metrics Breakdown with Distinct Colors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
        {metrics.map((m) => (
          <div key={m.label} className="bg-secondary/50 border border-border rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-bold text-foreground">
                {m.icon}
                {m.label}
              </span>
              <span className={`font-mono font-bold ${m.textCol}`}>{m.value}%</span>
            </div>
            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden border border-border/40">
              <div
                className={`h-full rounded-full ${m.barCol} transition-all duration-500`}
                style={{ width: `${m.value}%` }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground">{m.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
