import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { ViralContent, ToneId, GoalId, PlatformId } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

/**
 * Compresses and scales images efficiently for rapid AI vision processing.
 */
async function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.src = url;

    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      let maxDim = 1600;
      if (file.size > 20 * 1024 * 1024) {
        maxDim = 1200;
      }

      if (width > height) {
        if (width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        }
      } else {
        if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Failed to initialize canvas render context"));
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, width, height);

      const compressedBase64 = canvas.toDataURL("image/jpeg", 0.85).split(",")[1];
      resolve(compressedBase64);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image for visual analysis."));
    };
  });
}

export interface VideoFrame {
  time: number;
  label: string;
  base64: string;
}

export interface VideoExtractionResult {
  frames: VideoFrame[];
  base64Composite: string;
  durationSeconds: number;
  width: number;
  height: number;
  aspectRatio: string;
  formattedDuration: string;
}

/**
 * Extracts high-definition keyframes across the full timeline of the video (up to 5GB).
 * Samples 6 chronological checkpoints (Hook opening, hook peak, buildup, core action, climax, and ending)
 * so Gemini can accurately see and understand the REAL substance, actions, objects, and text in the video.
 */
async function extractVideoKeyframes(
  file: File,
  onProgress?: (progress: number) => void
): Promise<VideoExtractionResult> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const objectUrl = URL.createObjectURL(file);

    video.src = objectUrl;
    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;

    // Timeout safety
    const timeout = setTimeout(() => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Video decoding timed out. Please verify the video format."));
    }, 30000);

    video.onloadedmetadata = async () => {
      try {
        const duration = video.duration || 10;
        const width = video.videoWidth || 1280;
        const height = video.videoHeight || 720;
        const isVertical = height > width;
        const aspectRatio = isVertical ? "9:16 (Vertical Reel/Short)" : "16:9 (Landscape / Standard)";

        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        const formattedDuration = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        if (onProgress) onProgress(15);

        // 6 strategic sampling checkpoints across full video timeline
        let samplePoints: { time: number; label: string }[];
        if (duration <= 4) {
          samplePoints = [
            { time: Math.min(0.4, Math.max(0.1, duration * 0.1)), label: "0-1s Hook Opening" },
            { time: Math.min(1.5, Math.max(0.6, duration * 0.4)), label: "1-2s Hook Peak" },
            { time: Math.min(2.5, Math.max(1.2, duration * 0.7)), label: "Main Action / Context" },
            { time: Math.max(0.2, duration - 0.4), label: "End Scene / CTA" },
          ];
        } else {
          samplePoints = [
            { time: Math.min(0.5, Math.max(0.1, duration * 0.03)), label: "0-1s Hook Opening" },
            { time: Math.min(1.8, Math.max(0.8, duration * 0.08)), label: "1-3s Hook Decision Point" },
            { time: Math.round(duration * 0.22 * 10) / 10, label: "20% Mark - Setup & Topic" },
            { time: Math.round(duration * 0.48 * 10) / 10, label: "50% Midpoint - Core Action / Demonstration" },
            { time: Math.round(duration * 0.72 * 10) / 10, label: "70% Mark - Climax / Action Peak" },
            { time: Math.max(0.5, Math.min(duration - 0.4, Math.round(duration * 0.90 * 10) / 10)), label: "90% End - Result & Call to Action" },
          ];
        }

        const capturedCanvases: HTMLCanvasElement[] = [];
        const frames: VideoFrame[] = [];

        // High resolution for clear visual extraction (up to 720px)
        const maxDim = 720;
        let frameW: number;
        let frameH: number;
        if (width > height) {
          frameW = Math.min(width, maxDim);
          frameH = Math.round((height * frameW) / width);
        } else {
          frameH = Math.min(height, maxDim);
          frameW = Math.round((width * frameH) / height);
        }

        for (let i = 0; i < samplePoints.length; i++) {
          const pt = samplePoints[i];
          await new Promise<void>((resSeek) => {
            const handleSeeked = () => {
              video.removeEventListener("seeked", handleSeeked);
              const frameCanvas = document.createElement("canvas");
              frameCanvas.width = frameW;
              frameCanvas.height = frameH;

              const ctx = frameCanvas.getContext("2d");
              if (ctx) {
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = "high";
                ctx.drawImage(video, 0, 0, frameW, frameH);

                // Draw timestamp badge
                ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
                ctx.fillRect(8, 8, 170, 22);
                ctx.fillStyle = "#ffffff";
                ctx.font = "bold 11px sans-serif";
                ctx.fillText(`${pt.time.toFixed(1)}s mark • ${pt.label.slice(0, 16)}`, 14, 23);
              }

              capturedCanvases.push(frameCanvas);
              const b64 = frameCanvas.toDataURL("image/jpeg", 0.85).split(",")[1];
              frames.push({
                time: pt.time,
                label: pt.label,
                base64: b64,
              });

              if (onProgress) onProgress(15 + Math.round(((i + 1) / samplePoints.length) * 45));
              resSeek();
            };
            video.addEventListener("seeked", handleSeeked);
            video.currentTime = pt.time;
          });
        }

        // Composite grid for fallback or visual timeline
        const cols = capturedCanvases.length <= 4 ? 2 : 3;
        const rows = Math.ceil(capturedCanvases.length / cols);
        const singleW = Math.round(frameW / 2);
        const singleH = Math.round(frameH / 2);

        const compositeCanvas = document.createElement("canvas");
        compositeCanvas.width = singleW * cols;
        compositeCanvas.height = singleH * rows;
        const compCtx = compositeCanvas.getContext("2d");
        if (compCtx) {
          compCtx.fillStyle = "#09090b";
          compCtx.fillRect(0, 0, compositeCanvas.width, compositeCanvas.height);
          capturedCanvases.forEach((c, idx) => {
            const col = idx % cols;
            const row = Math.floor(idx / cols);
            compCtx.drawImage(c, col * singleW, row * singleH, singleW, singleH);
          });
        }

        const base64Composite = compositeCanvas.toDataURL("image/jpeg", 0.82).split(",")[1];

        clearTimeout(timeout);
        URL.revokeObjectURL(objectUrl);

        if (onProgress) onProgress(65);

        resolve({
          frames,
          base64Composite,
          durationSeconds: duration,
          width,
          height,
          aspectRatio,
          formattedDuration,
        });
      } catch (err) {
        clearTimeout(timeout);
        URL.revokeObjectURL(objectUrl);
        reject(err);
      }
    };

    video.onerror = () => {
      clearTimeout(timeout);
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to load video file. Please ensure it is an MP4, MOV, or WEBM."));
    };
  });
}

const TONE_DESCRIPTIONS: Record<ToneId, string> = {
  "high-energy": "High-energy, dynamic, enthusiastic, and fast-paced urgency.",
  "authority": "Authoritative, educational, expert-level, crisp, and high-trust credibility.",
  "storytelling": "Narrative-driven, emotionally immersive, personal, and cinematic.",
  "aesthetic": "Minimalist, sleek, modern, sophisticated, and lifestyle-focused.",
  "controversial": "Bold, contrarian, myth-busting, polarizing, and debate-sparking.",
  "humorous": "Witty, relatable, self-aware, meme-literate, and entertaining."
};

const GOAL_DESCRIPTIONS: Record<GoalId, string> = {
  "max-reach": "Maximize broad discovery and algorithmic distribution on explore/for-you feeds.",
  "comments": "Drive intense discussion, debates, user questions, and high comment volume.",
  "saves": "Provide evergreen cheat-sheet value and bookmark-worthy reference material.",
  "link-clicks": "Compelling call-to-action driving bio-link visits, sign-ups, and downloads.",
  "follower-growth": "Establish clear niche authority that motivates profile clicks and follows."
};

export async function analyzeMedia(
  file: File,
  mediaType: 'image' | 'video',
  platform: PlatformId,
  tone: ToneId = "high-energy",
  goal: GoalId = "max-reach",
  language: string = "Hinglish (हिंदी + English)",
  isTurbo: boolean = true,
  onProgress?: (progress: number) => void,
  retryCount: number = 0
): Promise<ViralContent> {
  const MAX_RETRIES = 2;
  const model = "gemini-3.8-flash";

  // Maximum supported size: 5GB for Video, 50MB for Images
  const MAX_VIDEO_SIZE = 5 * 1024 * 1024 * 1024; // 5 GB
  const MAX_IMAGE_SIZE = 50 * 1024 * 1024; // 50 MB

  if (file.type.startsWith("image/") && file.size > MAX_IMAGE_SIZE) {
    throw new Error("Image file exceeds 50MB limit. Please choose a smaller image.");
  }
  if (file.type.startsWith("video/") && file.size > MAX_VIDEO_SIZE) {
    throw new Error("Video file exceeds 5GB limit.");
  }

  let visualBase64 = "";
  let videoTelemetryInfo = "";
  let extractionResult: VideoExtractionResult | null = null;

  try {
    if (mediaType === "video" || file.type.startsWith("video/")) {
      extractionResult = await extractVideoKeyframes(file, onProgress);
      visualBase64 = extractionResult.base64Composite;
      videoTelemetryInfo = `
VIDEO METADATA & TELEMETRY:
- Duration: ${extractionResult.formattedDuration} (${extractionResult.durationSeconds.toFixed(1)} seconds)
- Resolution: ${extractionResult.width}x${extractionResult.height} (${extractionResult.aspectRatio})
- File Size on Disk: ${(file.size / (1024 * 1024)).toFixed(1)} MB (${file.name})
- Keyframe Count: ${extractionResult.frames.length} chronological keyframes extracted across 0-100% of duration.
`;
    } else {
      visualBase64 = await compressImage(file);
      if (onProgress) onProgress(60);
    }
  } catch (e: any) {
    console.error("Media preprocessing failed:", e);
    throw new Error(e?.message || "Failed to process media. Please check format and try again.");
  }

  const isHinglish = language.toLowerCase().includes('hinglish');
  const languageInstruction = isHinglish
    ? `CRITICAL HINGLISH REQUIREMENT: The user has selected HINGLISH (Roman script blend of Hindi and English as used by popular Indian creators on Instagram Reels & YouTube Shorts).
All generated titles, hooks, captions, descriptions, and advice MUST be in natural, vibrant conversational Hinglish.
CRITICAL: The Hinglish expressions MUST BE 100% ROOTED IN THE REAL TOPIC OF THIS VIDEO:
- If food/recipe: "Ye wali spicy crispy recipe ek baar banake dekho, hotel ka swaad bhool jaoge! 🤤", "Sirf 10 min me banke ready!", "Ghar pe zaroor try karna aur comment me batana kaisa laga!"
- If gym/fitness: "Agar biceps/chest grow nahi ho rahe toh ye common form mistake abhi sudharo! 💪", "Ego lifting chhod do aur time under tension pe dhyan do!"
- If comedy/skit: "Bhai ke sath aisa kiske kiske sath hota hai? Apne us dost ko tag karo 😂", "Sach sach batana, relate kar pa rahe ho?"
- If tech/gadget: "Kya 2026 me ye phone/gadget lena chahiye? Real camera aur battery test dekho!"
- If travel/vlog: "Sirf ₹2000 ke budget me ye hidden paradise explore kar sakte ho! Save kar lo 🏔️"
NEVER output generic "Reel viral kaise kare" or "views ruk gaye hain" unless the video is literally a tutorial about Instagram settings!`
    : `ALL generated text, titles, hooks, and captions MUST be written natively in ${language}, and MUST be 100% specific to what is actually shown in this video.`;

  const prompt = `You are a World-Class Social Media Growth Engineer and Visual Content Analyst.

======================================================================
CRITICAL DIRECTIVE — REAL CONTENT GROUNDING (NO GENERIC HALLUCINATIONS):
======================================================================
Look at the attached visual keyframes carefully.
Rely ENTIRELY on the visual keyframes, scenes, actions, on-screen text, gestures, and environment to detect the real subject matter with 100% accuracy.
DO NOT assume this video is about "social media tips", "views badhane ka secret", "algorithm hacks", or "secret settings" UNLESS the creator literally uploaded an app tutorial!
Every single deliverable (Title, Hooks, Captions, Hashtags, Tips) MUST DIRECTLY DESCRIBE AND ACCURATELY REFLECT WHAT IS ACTUALLY SHOWN IN THE MEDIA.

STEP 1: IDENTIFY THE REAL SUBJECT MATTER:
1. Determine the exact niche/category:
   - Food / Cooking / Street Food / Baking
   - Gym / Fitness / Bodybuilding / Calisthenics / Yoga
   - Comedy / Skit / Relatable Memes / Acting
   - Tech / Gadgets / Mobile / Gaming / Unboxing
   - Travel / Nature / City Vlog / Road Trip
   - Fashion / Beauty / Hair / Makeup / Grooming
   - Automotive / Bikes / Supercars / Driving
   - Dance / Music / Performance / Singing
   - Education / Study Tips / Career / Coding / Business
   - Daily Life / Family / Pets / Animals / DIY / Art
2. Identify the SPECIFIC items, ingredients, actions, exercises, objects, locations, and people visible in the frames.
3. Read any on-screen text, subtitles, packaging labels, or watermarks.
4. Record this clearly in the 'detectedContent' field.

STEP 2: CREATE STRATEGY MATCHING THE REAL CONTENT:
- Target Platform: ${platform}
- Tone of Voice: ${tone} (${TONE_DESCRIPTIONS[tone] || tone})
- Strategic Growth Goal: ${goal} (${GOAL_DESCRIPTIONS[goal] || goal})
- Language Requirement: ${languageInstruction}
- Visual Inspection: Fully autonomous visual grounding based on keyframe timestamps and actions.
${videoTelemetryInfo}

REQUIRED DELIVERABLES:
1. detectedContent:
   - genre: The exact primary category (e.g., "Food & Recipe", "Gym & Workout", "Comedy Skit", "Tech Review", "Travel Vlog", etc.)
   - realSubject: 1 accurate sentence describing what is literally occurring in this video.
   - keyElements: 3 to 6 specific items/actions spotted in the frames (e.g., ["Paneer Gravy", "Coriander Garnish", "Hot Pan", "Spices"]).
2. Master Title & Angle: A high-converting headline tailored to this real topic + strategic angle.
3. Score Breakdown: Calibrated metrics (0-100) for Overall Score, Hook Strength, Retention, Shareability, and SEO Optimization.
4. 4 Distinct Hook Variations for the first 0-3 seconds:
   - Curiosity Hook (creates desire to see the final result/outcome)
   - Contrarian / Myth-Busting Hook (challenges common belief about this topic)
   - Direct Authority Hook (expert tip / proven method)
   - Relatable POV Hook (funny or shared everyday experience)
5. 3 Multi-Format Captions:
   - 'punchy': Short, high-velocity caption (under 250 chars) tailored to this video with a clear call-to-action.
   - 'story': Value-packed narrative breakdown (500-1000 chars) describing the dish recipe, workout routine, funny story, or travel details with clean line breaks.
   - 'thread': Bulleted steps / tactical framework.
6. Hashtag Matrix: High-reach, niche-targeted, and SEO search keywords matching this SPECIFIC topic.
7. Target Audience Persona: Core demographic, primary emotional trigger, peak posting time window, and best CTA.
8. 2 Concrete A/B Split-Testing Experiments for cover image/first 3 seconds and headline variations.
9. 3-4 Actionable Production Tips for immediate algorithmic boost based on the actual visual quality, lighting, and pacing visible in the frames.`;

  try {
    const parts: any[] = [{ text: prompt }];

    if (extractionResult && extractionResult.frames.length > 0) {
      for (let i = 0; i < extractionResult.frames.length; i++) {
        const f = extractionResult.frames[i];
        parts.push({
          text: `\n=== VIDEO TIMELINE KEYFRAME ${i + 1} of ${extractionResult.frames.length} (Timestamp: ${f.time.toFixed(1)}s - ${f.label}) ===`
        });
        parts.push({
          inlineData: {
            data: f.base64,
            mimeType: "image/jpeg",
          },
        });
      }
    } else {
      parts.push({
        text: `\n=== UPLOADED MEDIA IMAGE ===`
      });
      parts.push({
        inlineData: {
          data: visualBase64,
          mimeType: "image/jpeg",
        },
      });
    }

    const response = await ai.models.generateContent({
      model,
      contents: [
        {
          parts,
        },
      ],
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        tools: isTurbo ? [] : [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedContent: {
              type: Type.OBJECT,
              properties: {
                genre: {
                  type: Type.STRING,
                  description: "Accurate primary category e.g., 'Food & Recipe', 'Gym & Fitness', 'Comedy Skit', 'Tech Review', 'Travel Vlog', etc."
                },
                realSubject: {
                  type: Type.STRING,
                  description: "Accurate factual 1-sentence description of what is actually shown in this specific video"
                },
                keyElements: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Specific objects, ingredients, exercises, tools, or items visually spotted in the frames"
                }
              },
              required: ["genre", "realSubject", "keyElements"]
            },
            title: { type: Type.STRING, description: "Master scroll-stopping headline tailored to the real video content" },
            summaryAngle: { type: Type.STRING, description: "One-sentence core creative strategy angle" },
            scoreBreakdown: {
              type: Type.OBJECT,
              properties: {
                overall: { type: Type.NUMBER, description: "Overall viral score 0-100" },
                hookStrength: { type: Type.NUMBER, description: "Hook score 0-100" },
                retentionScore: { type: Type.NUMBER, description: "Viewer retention score 0-100" },
                shareability: { type: Type.NUMBER, description: "Share & viral coefficient score 0-100" },
                seoScore: { type: Type.NUMBER, description: "Algorithmic SEO score 0-100" }
              },
              required: ["overall", "hookStrength", "retentionScore", "shareability", "seoScore"]
            },
            hooks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ["curiosity", "contrarian", "authority", "relatable"] },
                  label: { type: Type.STRING },
                  text: { type: Type.STRING },
                  reasoning: { type: Type.STRING },
                  targetSeconds: { type: Type.STRING }
                },
                required: ["id", "type", "label", "text", "reasoning"]
              }
            },
            captions: {
              type: Type.OBJECT,
              properties: {
                punchy: { type: Type.STRING },
                story: { type: Type.STRING },
                thread: { type: Type.STRING }
              },
              required: ["punchy", "story", "thread"]
            },
            hashtags: {
              type: Type.OBJECT,
              properties: {
                highReach: { type: Type.ARRAY, items: { type: Type.STRING } },
                nicheTargeted: { type: Type.ARRAY, items: { type: Type.STRING } },
                seoKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                rawString: { type: Type.STRING }
              },
              required: ["highReach", "nicheTargeted", "seoKeywords", "rawString"]
            },
            audienceStrategy: {
              type: Type.OBJECT,
              properties: {
                targetPersona: { type: Type.STRING },
                emotionalTrigger: { type: Type.STRING },
                bestPostTime: { type: Type.STRING },
                recommendedCta: { type: Type.STRING }
              },
              required: ["targetPersona", "emotionalTrigger", "bestPostTime", "recommendedCta"]
            },
            videoInsights: {
              type: Type.OBJECT,
              properties: {
                visualFlow: { type: Type.STRING },
                hookTiming: { type: Type.STRING },
                retentionCurveTips: { type: Type.ARRAY, items: { type: Type.STRING } },
                audioSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
                recommendedPacing: { type: Type.STRING }
              }
            },
            actionableTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            experiments: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  hypothesis: { type: Type.STRING },
                  variantA: { type: Type.STRING },
                  variantB: { type: Type.STRING }
                },
                required: ["name", "hypothesis", "variantA", "variantB"]
              }
            }
          },
          required: [
            "detectedContent",
            "title",
            "summaryAngle",
            "scoreBreakdown",
            "hooks",
            "captions",
            "hashtags",
            "audienceStrategy",
            "actionableTips",
            "experiments"
          ]
        }
      }
    });

    const parsed: ViralContent = JSON.parse(response.text || "{}");
    return parsed;
  } catch (error: any) {
    console.error(`Gemini Analysis Error (Attempt ${retryCount + 1}):`, error);

    const isTransientError =
      error.message?.includes("Rpc failed") ||
      error.message?.includes("xhr error") ||
      error.message?.includes("500") ||
      error.message?.includes("503") ||
      error.message?.includes("deadline exceeded");

    if (isTransientError && retryCount < MAX_RETRIES) {
      const delay = Math.pow(2, retryCount) * 1000;
      await new Promise((r) => setTimeout(r, delay));
      return analyzeMedia(file, mediaType, platform, tone, goal, language, isTurbo, onProgress, retryCount + 1);
    }

    throw new Error(error.message || "Failed to generate viral strategy report. Please try again.");
  }
}

