export type MediaType = 'image' | 'video';

export type PlatformId = 'Instagram' | 'TikTok' | 'YouTube' | 'Twitter' | 'LinkedIn' | 'Facebook' | 'Pinterest';

export type ToneId = 'high-energy' | 'authority' | 'storytelling' | 'aesthetic' | 'controversial' | 'humorous';

export type GoalId = 'max-reach' | 'comments' | 'saves' | 'link-clicks' | 'follower-growth';

export interface HookVariation {
  id: string;
  type: 'curiosity' | 'contrarian' | 'authority' | 'relatable';
  label: string;
  text: string;
  reasoning: string;
  targetSeconds?: string;
}

export interface CaptionVariants {
  punchy: string;
  story: string;
  thread: string;
}

export interface ScoreBreakdown {
  overall: number;
  hookStrength: number;
  retentionScore: number;
  shareability: number;
  seoScore: number;
}

export interface HashtagTiers {
  highReach: string[];
  nicheTargeted: string[];
  seoKeywords: string[];
  rawString: string;
}

export interface VideoInsights {
  visualFlow: string;
  hookTiming: string;
  retentionCurveTips: string[];
  audioSuggestions: string[];
  recommendedPacing: string;
}

export interface AudienceStrategy {
  targetPersona: string;
  emotionalTrigger: string;
  bestPostTime: string;
  recommendedCta: string;
}

export interface StrategyExperiment {
  name: string;
  hypothesis: string;
  variantA: string;
  variantB: string;
}

export interface DetectedContent {
  genre: string;
  realSubject: string;
  keyElements: string[];
}

export interface ViralContent {
  detectedContent?: DetectedContent;
  title: string;
  summaryAngle: string;
  scoreBreakdown: ScoreBreakdown;
  hooks: HookVariation[];
  captions: CaptionVariants;
  hashtags: HashtagTiers;
  audienceStrategy: AudienceStrategy;
  videoInsights?: VideoInsights;
  actionableTips: string[];
  experiments: StrategyExperiment[];
}

export interface AnalysisHistoryItem {
  id: string;
  timestamp: number;
  mediaName: string;
  mediaType: MediaType;
  platform: PlatformId;
  language: string;
  tone: ToneId;
  goal?: GoalId;
  overallScore: number;
  title: string;
  previewUrl: string | null;
  result: ViralContent;
}

export interface Language {
  code: string;
  name: string;
  region: string;
  flag?: string;
  nativeScript?: string;
  category?: 'popular' | 'indian' | 'americas' | 'europe' | 'asia' | 'middle-east' | 'global';
  badge?: string;
}
