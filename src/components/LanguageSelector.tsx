import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, ChevronDown, Globe, Check, X, Sparkles, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language } from '../types';

interface LanguageSelectorProps {
  languages: Language[];
  currentLanguage: string;
  onLanguageChange: (code: string) => void;
}

type CategoryTab = 'all' | 'popular' | 'indian' | 'asia' | 'europe-americas' | 'middle-east';

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  languages,
  currentLanguage,
  onLanguageChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<CategoryTab>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedLanguage = useMemo(() => {
    return languages.find((l) => l.code === currentLanguage) || languages[0];
  }, [languages, currentLanguage]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      setSearchQuery('');
      setActiveTab('all');
    }
  }, [isOpen]);

  const filteredLanguages = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return languages.filter((l) => {
      // 1. Search Query Filter
      if (q) {
        return (
          l.name.toLowerCase().includes(q) ||
          l.code.toLowerCase().includes(q) ||
          l.region.toLowerCase().includes(q) ||
          (l.nativeScript && l.nativeScript.toLowerCase().includes(q)) ||
          (l.badge && l.badge.toLowerCase().includes(q))
        );
      }

      // 2. Category Tab Filter
      if (activeTab === 'popular') {
        return l.category === 'popular';
      }
      if (activeTab === 'indian') {
        return (
          l.category === 'indian' ||
          l.code.includes('Hinglish') ||
          l.code.includes('Hindi')
        );
      }
      if (activeTab === 'asia') {
        return (
          l.category === 'asia' ||
          l.code.includes('Japanese') ||
          l.code.includes('Korean') ||
          l.code.includes('Chinese')
        );
      }
      if (activeTab === 'europe-americas') {
        return (
          l.category === 'europe' ||
          l.category === 'americas' ||
          l.code.includes('Spanish') ||
          l.code.includes('French') ||
          l.code.includes('German') ||
          l.code.includes('English') ||
          l.code.includes('Portuguese')
        );
      }
      if (activeTab === 'middle-east') {
        return l.category === 'middle-east' || l.code.includes('Arabic');
      }

      return true;
    });
  }, [languages, searchQuery, activeTab]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button in Header */}
      <button
        id="btn-open-language-selector"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select output language"
        className="h-9 sm:h-10 flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-100 rounded-xl border border-zinc-700 hover:border-purple-500 shadow-md transition-all cursor-pointer group active:scale-95"
      >
        <div className="w-6 h-6 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-sm shrink-0">
          {selectedLanguage.flag ? (
            <span className="leading-none">{selectedLanguage.flag}</span>
          ) : (
            <Globe className="w-3.5 h-3.5 text-purple-400" />
          )}
        </div>

        <div className="flex items-center gap-1.5 text-left">
          <span className="text-[11px] font-semibold text-zinc-400 hidden lg:inline uppercase tracking-wider">
            Language:
          </span>
          <span className="text-xs sm:text-sm font-extrabold text-white tracking-tight">
            {selectedLanguage.name}
          </span>
          {selectedLanguage.nativeScript && (
            <span className="text-[10px] font-bold text-purple-300 bg-purple-500/25 px-1.5 py-0.2 rounded border border-purple-500/40 hidden sm:inline">
              {selectedLanguage.nativeScript}
            </span>
          )}
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 text-zinc-400 group-hover:text-purple-300 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-purple-400' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="language-dropdown-menu"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-[calc(100vw-24px)] sm:w-[470px] max-w-[470px] max-h-[560px] bg-[#0c0d12] border-2 border-zinc-700 rounded-2xl shadow-2xl shadow-black/95 overflow-hidden z-[120] flex flex-col"
          >
            {/* Header Area */}
            <div className="p-3.5 sm:p-4 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-md">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-inner">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs sm:text-sm font-extrabold text-white tracking-wide">
                        Select Target Language
                      </h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                        {languages.length} Global & Regional
                      </span>
                    </div>
                    <p className="text-[11px] font-medium text-zinc-400">
                      AI tailors viral title, hooks, native slang, and regional tags
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Search Bar with instant filtering */}
              <div className="relative mb-2.5">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  ref={searchInputRef}
                  id="input-search-language"
                  type="text"
                  placeholder="Search language, script, country (Hindi, हिंदी, Brazil, Japan, UK)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl py-2 pl-9 pr-9 text-xs sm:text-sm font-medium text-white placeholder:text-zinc-500 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/40 transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Category Filter Pills (Only visible when not actively searching) */}
              {!searchQuery && (
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
                  <button
                    type="button"
                    onClick={() => setActiveTab('all')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === 'all'
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                    }`}
                  >
                    All ({languages.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('popular')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                      activeTab === 'popular'
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                    }`}
                  >
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>🔥 Top Viral</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('indian')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === 'indian'
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                    }`}
                  >
                    🇮🇳 India & South Asia
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('asia')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === 'asia'
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                    }`}
                  >
                    🌏 East & SE Asia
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('europe-americas')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === 'europe-americas'
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                    }`}
                  >
                    🌎 Europe & Americas
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('middle-east')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === 'middle-east'
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                    }`}
                  >
                    🇦🇪 Middle East
                  </button>
                </div>
              )}
            </div>

            {/* Language Cards List */}
            <div className="flex-1 overflow-y-auto p-2 sm:p-2.5 space-y-1.5 custom-scrollbar bg-[#0c0d12]">
              {filteredLanguages.length > 0 ? (
                filteredLanguages.map((lang) => {
                  const isSelected = lang.code === currentLanguage;
                  return (
                    <button
                      key={lang.code}
                      id={`lang-option-${lang.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                      type="button"
                      onClick={() => {
                        onLanguageChange(lang.code);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between gap-3 p-2.5 sm:p-3 rounded-xl text-left transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-purple-600/20 border-purple-500 shadow-md ring-1 ring-purple-500/50'
                          : 'bg-zinc-900/90 hover:bg-zinc-800/90 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      {/* Flag and Main Info */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center text-xl shrink-0 border ${
                            isSelected
                              ? 'bg-purple-500/30 border-purple-400'
                              : 'bg-zinc-950 border-zinc-800'
                          }`}
                        >
                          {lang.flag || '🌐'}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <span className="text-sm font-extrabold text-white tracking-wide">
                              {lang.name}
                            </span>
                            {lang.nativeScript && (
                              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/40">
                                {lang.nativeScript}
                              </span>
                            )}
                            {lang.badge && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                {lang.badge}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-xs font-medium text-zinc-400 truncate">
                            <MapPin className="w-3 h-3 text-zinc-500 shrink-0" />
                            <span className="truncate">{lang.region}</span>
                          </div>
                        </div>
                      </div>

                      {/* Selected Status / Indicator */}
                      {isSelected ? (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-600 text-white text-xs font-bold shrink-0 shadow-sm">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span className="hidden sm:inline">Selected</span>
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-zinc-700 flex items-center justify-center opacity-40 group-hover:opacity-80 shrink-0">
                          <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                        </div>
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="py-10 text-center px-4 space-y-2">
                  <p className="text-sm font-bold text-white">
                    No language found for &quot;{searchQuery}&quot;
                  </p>
                  <p className="text-xs text-zinc-400">
                    Try searching country, script or language name (e.g. &quot;Japan&quot;, &quot;Brazil&quot;, &quot;Hindi&quot;)
                  </p>
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="mt-2 text-xs font-bold text-purple-400 hover:text-purple-300 underline cursor-pointer"
                  >
                    Show all {languages.length} languages
                  </button>
                </div>
              )}
            </div>

            {/* Footer with Pro Creator Insight */}
            <div className="p-2.5 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between text-[11px] text-zinc-400 px-3.5">
              <span>
                💡 <strong className="text-zinc-200">Pro Tip:</strong> Content tailored in local slang generates up to <span className="text-purple-300 font-bold">3.4x higher shares</span>.
              </span>
              <span className="font-mono text-[10px] text-zinc-500 hidden sm:inline">
                {languages.length} Languages
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
