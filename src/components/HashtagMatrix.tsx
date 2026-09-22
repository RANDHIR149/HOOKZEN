import React, { useState } from 'react';
import { HashtagTiers } from '../types';
import { Hash, Copy, Check, TrendingUp, Compass, Search } from 'lucide-react';

interface HashtagMatrixProps {
  hashtags: HashtagTiers;
  onCopyText: (text: string, label: string) => void;
}

export const HashtagMatrix: React.FC<HashtagMatrixProps> = ({ hashtags, onCopyText }) => {
  const [copiedTier, setCopiedTier] = useState<string | null>(null);
  const [copiedTag, setCopiedTag] = useState<string | null>(null);

  const handleCopyTier = (tierKey: string, tags: string[], label: string) => {
    const formatted = tags.map(t => t.startsWith('#') ? t : `#${t}`).join(' ');
    onCopyText(formatted, label);
    setCopiedTier(tierKey);
    setTimeout(() => setCopiedTier(null), 2000);
  };

  const handleCopySingle = (tag: string) => {
    const formatted = tag.startsWith('#') ? tag : `#${tag}`;
    onCopyText(formatted, `Tag (${formatted})`);
    setCopiedTag(tag);
    setTimeout(() => setCopiedTag(null), 1500);
  };

  const handleCopyAll = () => {
    const all = [
      ...hashtags.highReach,
      ...hashtags.nicheTargeted,
      ...hashtags.seoKeywords
    ].map(t => t.startsWith('#') ? t : `#${t}`).join(' ');
    onCopyText(all, 'Complete Hashtag & SEO Matrix');
    setCopiedTier('all');
    setTimeout(() => setCopiedTier(null), 2000);
  };

  const tiers = [
    {
      key: 'highReach',
      tierNumber: 'Tier 01',
      label: 'Macro Viral Reach Tags',
      sublabel: 'Broad discovery & FYP index (>1M volume)',
      icon: <TrendingUp className="w-3.5 h-3.5 text-white" />,
      tags: hashtags.highReach,
    },
    {
      key: 'nicheTargeted',
      tierNumber: 'Tier 02',
      label: 'Niche Community Tags',
      sublabel: 'High-intent target audience (50k - 500k)',
      icon: <Compass className="w-3.5 h-3.5 text-white" />,
      tags: hashtags.nicheTargeted,
    },
    {
      key: 'seoKeywords',
      tierNumber: 'Tier 03',
      label: 'Search Index Keywords',
      sublabel: 'Native search bar & autocomplete keywords',
      icon: <Search className="w-3.5 h-3.5 text-white" />,
      tags: hashtags.seoKeywords,
    }
  ];

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-2">
          <Hash className="w-4 h-4 text-white" />
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Algorithmic Hashtag & SEO Tier Matrix
            </h3>
            <p className="text-[11px] text-zinc-400">
              Structured reach and search keyword distribution
            </p>
          </div>
        </div>

        <button
          id="btn-copy-all-tags"
          type="button"
          onClick={handleCopyAll}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border self-start sm:self-auto ${
            copiedTier === 'all'
              ? 'bg-white text-black border-white'
              : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-700 text-zinc-200 hover:text-white'
          }`}
        >
          {copiedTier === 'all' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedTier === 'all' ? 'All Tags Copied' : 'Copy All 30 Tags'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tiers.map((tier) => {
          const isCopied = copiedTier === tier.key;
          return (
            <div
              key={tier.key}
              className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase text-zinc-400">
                    {tier.tierNumber}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyTier(tier.key, tier.tags, tier.label)}
                    className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded transition-all ${
                      isCopied
                        ? 'bg-white text-black'
                        : 'bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800'
                    }`}
                  >
                    {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{isCopied ? 'Copied' : 'Copy Tier'}</span>
                  </button>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    {tier.icon}
                    {tier.label}
                  </h4>
                  <p className="text-[10px] text-zinc-400 mt-0.5">{tier.sublabel}</p>
                </div>

                {/* Tag Pills */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {tier.tags.map((tag) => {
                    const cleanTag = tag.startsWith('#') ? tag : `#${tag}`;
                    const isSingleCopied = copiedTag === tag;
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleCopySingle(tag)}
                        className={`text-[11px] font-mono px-2 py-0.5 rounded border transition-all ${
                          isSingleCopied
                            ? 'bg-white text-black border-white'
                            : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-zinc-600 hover:text-white'
                        }`}
                        title="Click to copy individual tag"
                      >
                        {cleanTag}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
