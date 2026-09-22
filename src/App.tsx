import React, { useState, useEffect } from 'react';
import { 
  PlatformId, 
  ToneId, 
  GoalId, 
  MediaType, 
  ViralContent, 
  AnalysisHistoryItem, 
  Language
} from './types';
import { Header } from './components/Header';
import { MediaUpload } from './components/MediaUpload';
import { BottomNav, ActiveCategory } from './components/BottomNav';
import { CategoryModal } from './components/CategoryModal';
import { CategoryStoriesBar } from './components/CategoryStoriesBar';
import { ScoreCard } from './components/ScoreCard';
import { VideoIntelligence } from './components/VideoIntelligence';
import { HookVariations } from './components/HookVariations';
import { CaptionStudio } from './components/CaptionStudio';
import { HashtagMatrix } from './components/HashtagMatrix';
import { ActionPlan } from './components/ActionPlan';
import { CreatorPostKit } from './components/CreatorPostKit';
import { PostSimulatorModal } from './components/PostSimulatorModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { GmailShareModal } from './components/GmailShareModal';
import { AuthModal } from './components/AuthModal';
import { MenuModal, ThemeMode } from './components/MenuModal';
import { Toast } from './components/Toast';
import { analyzeMedia } from './services/geminiService';
import { initAuth, logoutGoogle } from './services/authService';
import { User } from 'firebase/auth';
import { 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  Smartphone, 
  AlertCircle, 
  SlidersHorizontal,
  RotateCcw,
  Mail,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { LANGUAGES } from './data/languages';

export function App() {
  // Studio Strategy State
  const [platform, setPlatform] = useState<PlatformId>('Instagram');
  const [tone, setTone] = useState<ToneId>('high-energy');
  const [goal, setGoal] = useState<GoalId>('max-reach');
  const [language, setLanguage] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('vv_user_language');
      if (saved) return saved;
    } catch {
      // ignore
    }
    return 'Hinglish (हिंदी + English)';
  });
  const [isTurbo, setIsTurbo] = useState<boolean>(true);

  // Active Bottom Sheet / Category Dialog
  const [activeCategory, setActiveCategory] = useState<ActiveCategory>(null);

  // Media Ingestion State
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<MediaType | null>(null);

  // Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [estimatedTimeLeft, setEstimatedTimeLeft] = useState<number>(0);
  const [result, setResult] = useState<ViralContent | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Modals & Drawers
  const [isSimulatorOpen, setIsSimulatorOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isGmailModalOpen, setIsGmailModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('vv_theme_mode');
      if (saved === 'dark' || saved === 'light') return saved;
      return 'light'; // Default to White & Black on startup as requested
    } catch {
      return 'light';
    }
  });
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');
  const [copiedMaster, setCopiedMaster] = useState(false);
  const [showAdvancedDiagnostics, setShowAdvancedDiagnostics] = useState<boolean>(false);

  // Sync theme with HTML document & localStorage
  useEffect(() => {
    try {
      localStorage.setItem('vv_theme_mode', theme);
    } catch {
      // ignore
    }
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
  }, [theme]);

  // Google User State
  const [user, setUser] = useState<User | null>(null);

  // Initialize Firebase Google Auth listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (authUser) => {
        setUser(authUser);
      },
      () => {
        setUser(null);
      }
    );
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  // History State
  const [history, setHistory] = useState<AnalysisHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('viral_vision_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const showNotification = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
    const isVid = selectedFile.type.startsWith('video/');
    setMediaType(isVid ? 'video' : 'image');

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    showNotification(`Asset Loaded: ${selectedFile.name}`);
  };

  const handleClearFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setFile(null);
    setPreviewUrl(null);
    setMediaType(null);
    setResult(null);
    setProgress(0);
    setError(null);
  };

  const handleSelectBottomCategory = (cat: ActiveCategory) => {
    if (cat === 'home') {
      setActiveCategory(null);
      return;
    }
    setActiveCategory(cat);
  };

  const handleAnalyze = async () => {
    if (!file || !mediaType) {
      setError('Please upload a video or image before generating the audit.');
      return;
    }

    setIsAnalyzing(true);
    setProgress(5);
    setEstimatedTimeLeft(isTurbo ? 6 : 14);
    setError(null);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 92) return 92;
        const jump = Math.floor(Math.random() * 8) + 4;
        return Math.min(prev + jump, 92);
      });
      setEstimatedTimeLeft((prev) => Math.max(prev - 1, 1));
    }, 450);

    try {
      const analysisResult = await analyzeMedia(
        file,
        mediaType,
        platform,
        tone,
        goal,
        language,
        isTurbo,
        (p) => setProgress(p)
      );

      clearInterval(progressInterval);
      setProgress(100);
      setResult(analysisResult);

      const historyEntry: AnalysisHistoryItem = {
        id: 'hist_' + Date.now(),
        timestamp: Date.now(),
        mediaName: file.name,
        mediaType: mediaType,
        platform,
        tone,
        goal,
        language,
        overallScore: analysisResult.scoreBreakdown.overall,
        previewUrl: previewUrl,
        result: analysisResult,
        title: analysisResult.title || file.name,
      };

      setHistory((prev) => {
        const updated = [historyEntry, ...prev.slice(0, 24)];
        try {
          localStorage.setItem('viral_vision_history', JSON.stringify(updated));
        } catch {
          // localStorage failsafe
        }
        return updated;
      });

      showNotification('AI Viral Growth Audit Generated!');
    } catch (err: unknown) {
      clearInterval(progressInterval);
      const errMsg = err instanceof Error ? err.message : 'Analysis failed. Please try again.';
      setError(errMsg);
      showNotification(errMsg, 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showNotification(`Copied: ${label}`);
  };

  const handleCopyMasterKit = () => {
    if (!result) return;
    const masterKit = `
=========================================
VIRAL VISION PRO - GROWTH LAUNCH KIT
Platform: ${platform}
Tone: ${tone}
Goal: ${goal}
Language: ${language}
Overall Viral Score: ${result.scoreBreakdown.overall}/100
=========================================

1. HOOK ANGLES (0-3 SECONDS)
-----------------------------------------------------
${result.hooks.map((h, i) => `[Angle ${i + 1}: ${h.label}]\n"${h.text}"\nWhy it works: ${h.reasoning}`).join('\n\n')}

2. CAPTIONS
-----------------------------------------------------
[PUNCHY SHORT FORM]:
${result.captions.punchy}

[STORYTELLING / HIGH ENGAGEMENT]:
${result.captions.story}

[BULLET THREAD / STEP-BY-STEP]:
${result.captions.thread}

3. HASHTAGS & SEO MATRIX
-----------------------------------------------------
Macro Reach: ${result.hashtags.highReach.join(' ')}
Niche Community: ${result.hashtags.nicheTargeted.join(' ')}
SEO Autocomplete: ${result.hashtags.seoKeywords.join(' ')}

4. STRATEGY BLUEPRINT
-----------------------------------------------------
Target Persona: ${result.audienceStrategy.targetPersona}
Emotional Trigger: ${result.audienceStrategy.emotionalTrigger}
Best Post Window: ${result.audienceStrategy.bestPostTime}
Recommended CTA: "${result.audienceStrategy.recommendedCta}"
`;
    navigator.clipboard.writeText(masterKit.trim());
    setCopiedMaster(true);
    showNotification('Complete Master Viral Kit copied to clipboard');
    setTimeout(() => setCopiedMaster(false), 2500);
  };

  const handleDownloadReport = () => {
    if (!result) return;
    const reportText = `VIRAL AUDIT REPORT - VIRAL VISION PRO
Generated: ${new Date().toLocaleString()}
Platform: ${platform} | Tone: ${tone} | Goal: ${goal} | Language: ${language}
Overall Score: ${result.scoreBreakdown.overall}/100

1. DIAGNOSTIC BENCHMARK
-----------------------------------------------------
Hook Strength: ${result.scoreBreakdown.hookStrength}%
Viewer Retention: ${result.scoreBreakdown.retentionScore}%
Shareability: ${result.scoreBreakdown.shareability}%
Algorithmic SEO: ${result.scoreBreakdown.seoScore}%
Strategic Summary: ${result.summaryAngle}

2. 0-3S OPENING HOOKS
-----------------------------------------------------
${result.hooks.map((h, i) => `Option ${i + 1} (${h.label}): "${h.text}"\nStrategy: ${h.reasoning}`).join('\n\n')}

3. CAPTION VARIANTS
-----------------------------------------------------
Punchy (Short):
${result.captions.punchy}

Story (Long):
${result.captions.story}

Thread (Steps):
${result.captions.thread}

4. ALGORITHMIC HASHTAG & SEO TIERS
-----------------------------------------------------
Tier 1 (High Reach): ${result.hashtags.highReach.join(' ')}
Tier 2 (Niche Community): ${result.hashtags.nicheTargeted.join(' ')}
Tier 3 (SEO Search Keywords): ${result.hashtags.seoKeywords.join(' ')}

5. AUDIENCE & DISTRIBUTION BLUEPRINT
-----------------------------------------------------
Target Persona: ${result.audienceStrategy.targetPersona}
Emotional Trigger: ${result.audienceStrategy.emotionalTrigger}
Peak Post Window: ${result.audienceStrategy.bestPostTime}
Recommended CTA: "${result.audienceStrategy.recommendedCta}"

6. A/B EXPERIMENTS
-----------------------------------------------------
${result.experiments.map((e, i) => `Test ${i + 1}: ${e.name}\nHypothesis: ${e.hypothesis}\nVariant A: ${e.variantA}\nVariant B: ${e.variantB}`).join('\n\n')}
`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ViralVision_${platform}_Audit_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showNotification('Report file downloaded');
  };

  const handleRestoreHistory = (item: AnalysisHistoryItem) => {
    setResult(item.result);
    setPlatform(item.platform);
    setTone(item.tone);
    setLanguage(item.language);
    setIsHistoryOpen(false);
    showNotification(`Restored audit: "${item.title || item.mediaName}"`);
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
    showNotification('Audit removed from history');
  };

  const handleClearAllHistory = () => {
    setHistory([]);
    showNotification('History cleared');
  };

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    try {
      localStorage.setItem('vv_user_language', newLang);
    } catch {
      // ignore
    }
    const found = LANGUAGES.find((l) => l.code === newLang);
    showNotification(`Language set to ${found?.name || newLang}`, 'info');
  };

  const handleReset = () => {
    handleClearFile();
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-white selection:text-black pb-28">
      {/* Precision Header */}
      <Header
        languages={LANGUAGES}
        currentLanguage={language}
        onLanguageChange={handleLanguageChange}
        hasResults={!!result}
        onReset={handleReset}
        theme={theme}
        onToggleTheme={() => {
          const next = theme === 'light' ? 'dark' : 'light';
          setTheme(next);
          showNotification(next === 'light' ? 'Switched to Light Mode (White & Black)' : 'Switched to Dark Mode (Black & White)', 'info');
        }}
      />

      {/* Main Studio Hub on Home */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        
      {/* Story-Style Category Circles Row at Top of Home */}
        <CategoryStoriesBar
          platform={platform}
          tone={tone}
          goal={goal}
          isTurbo={isTurbo}
          onTurboToggle={() => {
            setIsTurbo(!isTurbo);
            showNotification(`Turbo Mode ${!isTurbo ? 'Enabled' : 'Disabled'}`);
          }}
          onOpenCategory={(cat) => setActiveCategory(cat)}
          disabled={isAnalyzing}
        />

        {!result ? (
          /* WORKSPACE SETUP MODE: Clean, focused Home view */
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* Intro Headline */}
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-900 text-zinc-300 border border-zinc-800 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-white" />
                AI Social Growth Engine
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                AI Viral Hook & Strategy Studio
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Transform any raw video or image into high-retention 0–3s viral hooks, platform-tailored captions, and audience growth blueprints.
              </p>
            </div>

            {/* Intuitive 3-Step Flow Guide */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 rounded-2xl bg-card border border-border text-left shadow-sm">
              <button
                type="button"
                onClick={() => setActiveCategory('platform')}
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-secondary/60 hover:bg-secondary border border-border text-left cursor-pointer transition-colors"
                title="Click to choose platform"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-500 text-black font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
                  1
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-foreground text-xs truncate">1. Choose Platform</p>
                  <p className="text-[10px] text-muted-foreground truncate">{platform} • {tone}</p>
                </div>
              </button>

              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-secondary/60 border border-border">
                <div className="w-7 h-7 rounded-lg bg-purple-500 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
                  2
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-foreground text-xs truncate">2. Upload Media</p>
                  <p className="text-[10px] text-muted-foreground truncate">Video up to 5GB or Sample</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-secondary/60 border border-border">
                <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
                  3
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-foreground text-xs truncate">3. Post Kit Ready</p>
                  <p className="text-[10px] text-muted-foreground truncate">Title, Caption, Tags & Time</p>
                </div>
              </div>
            </div>

            {/* Media Upload & Ingestion Center */}
            <div className="space-y-3">
              <MediaUpload
                selectedFile={file}
                previewUrl={previewUrl}
                mediaType={mediaType}
                onFileSelect={handleFileSelect}
                onClearFile={handleClearFile}
                isAnalyzing={isAnalyzing}
                progress={progress}
                estimatedTimeLeft={estimatedTimeLeft}
                onAnalyze={handleAnalyze}
              />
            </div>

            {/* Error Message Card */}
            {error && (
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs flex items-start gap-3 shadow-lg">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-zinc-400" />
                <div className="space-y-1">
                  <p className="font-semibold text-white">Analysis Error</p>
                  <p className="text-[11px] leading-relaxed text-zinc-300">{error}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* RESULTS MODE: Creator Post Kit + Optional Diagnostics */
          <div className="space-y-6 animate-fadeIn">
            {/* 1. PRIMARY CREATOR DELIVERABLE: Title, Description, Hashtags, Time & Hook */}
            <CreatorPostKit
              result={result}
              platform={platform}
              onReset={handleReset}
              onOpenSimulator={() => setIsSimulatorOpen(true)}
              onAdjustStrategy={() => setActiveCategory('platform')}
              onCopyText={handleCopyText}
            />

            {/* 2. ACTIONS & EXPORT TOOLBAR */}
            <div className="bg-card border border-border rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-foreground">Post Utilities:</span>
                <span className="text-[11px] text-muted-foreground">Ready to publish on {platform}</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Live Simulator Modal Trigger */}
                <button
                  id="btn-open-simulator"
                  type="button"
                  onClick={() => setIsSimulatorOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-xs font-semibold text-foreground transition-colors border border-border cursor-pointer shadow-sm"
                  title="Simulate Feed Preview"
                >
                  <Smartphone className="w-3.5 h-3.5 text-purple-500" />
                  <span>Feed Simulator</span>
                </button>

                {/* Download Report */}
                <button
                  id="btn-download-report"
                  type="button"
                  onClick={handleDownloadReport}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-xs font-semibold text-foreground transition-colors border border-border cursor-pointer shadow-sm"
                  title="Download text report"
                >
                  <Download className="w-3.5 h-3.5 text-blue-500" />
                  <span>Export TXT</span>
                </button>

                {/* Send / Draft via Gmail */}
                <button
                  id="btn-open-gmail-modal"
                  type="button"
                  onClick={() => setIsGmailModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-xs font-semibold text-foreground transition-colors border border-border cursor-pointer shadow-sm"
                  title="Send or Draft via Gmail"
                >
                  <Mail className="w-3.5 h-3.5 text-red-500" />
                  <span>Gmail</span>
                </button>

                {/* Copy Master Kit */}
                <button
                  id="btn-copy-master-kit"
                  type="button"
                  onClick={handleCopyMasterKit}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors shadow-md cursor-pointer ${
                    copiedMaster
                      ? 'bg-emerald-600 text-white border border-emerald-500'
                      : 'bg-foreground text-background hover:opacity-90 border border-foreground/20'
                  }`}
                >
                  {copiedMaster ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedMaster ? 'Kit Copied!' : 'Copy All'}</span>
                </button>

                {/* Prominently Adjusted Reset Button - Kept only at the bottom */}
                <button
                  id="btn-new-audit-reset"
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 hover:border-rose-500/50 text-xs font-bold transition-colors shadow-sm cursor-pointer"
                  title="Start a new post from scratch"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* 3. OPTIONAL ADVANCED DIAGNOSTICS TOGGLE */}
            <div className="pt-2">
              <button
                id="btn-toggle-advanced-diagnostics"
                type="button"
                onClick={() => setShowAdvancedDiagnostics(!showAdvancedDiagnostics)}
                className="w-full py-3 px-4 rounded-xl bg-secondary/60 hover:bg-secondary border border-border flex items-center justify-between text-xs font-bold text-foreground transition-colors cursor-pointer shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-purple-500" />
                  <span>🔬 View Advanced Diagnostics (Score Breakdown, Retention Curve & Tips)</span>
                </div>
                {showAdvancedDiagnostics ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>

              {showAdvancedDiagnostics && (
                <div className="space-y-6 pt-4 animate-fadeIn">
                  {/* Diagnostic Score Card */}
                  <ScoreCard
                    scoreBreakdown={result.scoreBreakdown}
                    summaryAngle={result.summaryAngle}
                  />

                  {/* Video Intelligence (If video content is detected) */}
                  {result.videoInsights && (
                    <VideoIntelligence insights={result.videoInsights} />
                  )}

                  {/* 4 Multi-Angle Hooks */}
                  <HookVariations
                    hooks={result.hooks}
                    onCopyText={handleCopyText}
                  />

                  {/* Caption Studio */}
                  <CaptionStudio
                    captions={result.captions}
                    onCopyText={handleCopyText}
                  />

                  {/* Hashtag & SEO Matrix */}
                  <HashtagMatrix
                    hashtags={result.hashtags}
                    onCopyText={handleCopyText}
                  />

                  {/* Audience, Experiments & Action Plan */}
                  <ActionPlan
                    audience={result.audienceStrategy}
                    experiments={result.experiments}
                    actionableTips={result.actionableTips}
                    onCopyText={handleCopyText}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Floating Instagram-Style Bottom Navigation Dock with Circular Category Buttons */}
      <BottomNav
        activeCategory={activeCategory}
        onSelectCategory={handleSelectBottomCategory}
        platform={platform}
        tone={tone}
        goal={goal}
        onOpenMenu={() => setIsMenuOpen(true)}
        disabled={isAnalyzing}
      />

      {/* Interactive Category Selector Modal */}
      <CategoryModal
        category={activeCategory}
        onClose={() => setActiveCategory(null)}
        onSelectCategoryTab={(cat) => setActiveCategory(cat)}
        platform={platform}
        onPlatformChange={(p) => {
          setPlatform(p);
          showNotification(`Target Platform: ${p}`);
        }}
        tone={tone}
        onToneChange={(t) => {
          setTone(t);
          showNotification(`Tone: ${t.replace('-', ' ')}`);
        }}
        goal={goal}
        onGoalChange={(g) => {
          setGoal(g);
          showNotification(`Goal: ${g}`);
        }}
        disabled={isAnalyzing}
      />

      {/* Live Feed Simulator Modal */}
      {result && (
        <PostSimulatorModal
          isOpen={isSimulatorOpen}
          onClose={() => setIsSimulatorOpen(false)}
          result={result}
          previewUrl={previewUrl}
          mediaType={mediaType}
          defaultPlatform={platform}
        />
      )}

      {/* History Slide-over Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onRestore={handleRestoreHistory}
        onDeleteItem={handleDeleteHistoryItem}
        onClearAll={handleClearAllHistory}
      />

      {/* Gmail Export & Draft Modal */}
      {result && (
        <GmailShareModal
          isOpen={isGmailModalOpen}
          onClose={() => setIsGmailModalOpen(false)}
          result={result}
          platform={platform}
          tone={tone}
          goal={goal}
          language={language}
          user={user}
          onAuthSuccess={(authUser) => {
            setUser(authUser);
          }}
          onLogout={() => {
            setUser(null);
          }}
          showNotification={showNotification}
        />
      )}

      {/* Google & Gmail Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        user={user}
        onAuthSuccess={(authUser) => {
          setUser(authUser);
        }}
        onLogout={() => {
          setUser(null);
        }}
        showNotification={showNotification}
      />

      {/* Studio Menu & Preferences Modal */}
      <MenuModal
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        theme={theme}
        onThemeChange={(newTheme) => setTheme(newTheme)}
        isTurbo={isTurbo}
        onTurboToggle={() => setIsTurbo(!isTurbo)}
        soundEnabled={soundEnabled}
        onSoundToggle={() => setSoundEnabled(!soundEnabled)}
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onClearHistory={handleClearAllHistory}
        onSelectPlatform={(p) => setPlatform(p)}
        showNotification={showNotification}
      />

      {/* Global Toast Notification */}
      <Toast
        show={!!toastMessage}
        message={toastMessage || ''}
        type={toastType}
      />
    </div>
  );
}
export default App;
