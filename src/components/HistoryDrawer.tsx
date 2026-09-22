import React, { useState } from 'react';
import { AnalysisHistoryItem } from '../types';
import { X, History, Trash2, ArrowRight, Video, Image as ImageIcon, Search } from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: AnalysisHistoryItem[];
  onRestore: (item: AnalysisHistoryItem) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onRestore,
  onDeleteItem,
  onClearAll,
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredHistory = history.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.platform.toLowerCase().includes(search.toLowerCase()) ||
    item.mediaName.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(timestamp));
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-zinc-950 border-l border-zinc-800 h-full flex flex-col shadow-2xl">
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-950">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-white" />
            <h3 className="text-sm font-bold text-white">Audit History</h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-300 border border-zinc-800">
              {history.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                id="btn-clear-all-history"
                type="button"
                onClick={onClearAll}
                className="text-[11px] text-zinc-400 hover:text-white px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-colors"
              >
                Clear All
              </button>
            )}
            <button
              id="btn-close-history"
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {history.length > 0 && (
          <div className="p-3 border-b border-zinc-800 bg-zinc-950">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search saved audits..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600"
              />
            </div>
          </div>
        )}

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-16 space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
                <History className="w-6 h-6" />
              </div>
              <p className="text-xs font-semibold text-zinc-400">No audits found</p>
              <p className="text-[11px] text-zinc-500">
                Generated audits will be saved automatically here
              </p>
            </div>
          ) : (
            filteredHistory.map((item) => (
              <div
                key={item.id}
                className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3.5 space-y-2.5 hover:border-zinc-700 transition-all group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center shrink-0">
                      {item.mediaType === 'video' ? (
                        <Video className="w-3.5 h-3.5 text-white" />
                      ) : (
                        <ImageIcon className="w-3.5 h-3.5 text-white" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-zinc-400 font-mono">
                        {item.platform} • {item.tone}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono font-bold text-white bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                    {item.result.scoreBreakdown.overall}/100
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-zinc-800 text-[10px] text-zinc-500">
                  <span>{formatDate(item.timestamp)}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onDeleteItem(item.id)}
                      className="p-1 text-zinc-500 hover:text-white transition-colors"
                      title="Delete audit"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRestore(item)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-white hover:bg-zinc-200 text-black font-semibold text-[11px] transition-colors"
                    >
                      <span>Load</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
