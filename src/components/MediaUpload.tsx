import React, { useRef, useState } from 'react';
import { Upload, Video, Image as ImageIcon, Sparkles, X, Loader2, CheckCircle2, Film } from 'lucide-react';
import { MediaType } from '../types';

interface MediaUploadProps {
  selectedFile: File | null;
  previewUrl: string | null;
  mediaType: MediaType | null;
  onFileSelect: (file: File) => void;
  onClearFile: () => void;
  isAnalyzing: boolean;
  progress: number;
  estimatedTimeLeft: number;
  onAnalyze: () => void;
}

export const MediaUpload: React.FC<MediaUploadProps> = ({
  selectedFile,
  previewUrl,
  mediaType,
  onFileSelect,
  onClearFile,
  isAnalyzing,
  progress,
  estimatedTimeLeft,
  onAnalyze,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        onFileSelect(file);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    if (bytes < 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-pink-500/20 via-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Upload className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Select Media
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Upload any video (up to 5GB) or image for instant Title, Caption, Hashtags & Time
            </p>
          </div>
        </div>

        {selectedFile && (
          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            Loaded
          </span>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleInputChange}
        className="hidden"
        id="file-upload-input"
        disabled={isAnalyzing}
      />

      {/* Upload Dropzone or Selected Media Preview */}
      {!selectedFile ? (
        <div
          id="dropzone-area"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-10 text-center cursor-pointer transition-all duration-200 ${
            isDragOver
              ? 'border-foreground bg-secondary'
              : 'border-border hover:border-muted-foreground/50 bg-secondary/30 hover:bg-secondary/60'
          }`}
        >
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-indigo-600 text-white flex items-center justify-center shadow-lg">
              <Upload className="w-5 h-5" />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-bold text-foreground">
                Drag & drop video or photo here, or <span className="text-purple-600 dark:text-purple-400 underline underline-offset-4">browse</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Supports <strong className="text-foreground">Reels, Shorts, TikTok (up to 5GB)</strong> & <strong className="text-foreground">Images (50MB)</strong>
              </p>
            </div>

            {/* Quick Badges with Distinct Colors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 w-full max-w-md text-left">
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-card border border-rose-500/30 text-[11px] shadow-sm">
                <div className="w-6 h-6 rounded-lg bg-rose-500/15 flex items-center justify-center text-rose-500 shrink-0">
                  <Film className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-bold text-foreground">Video (Reels, TikTok, Shorts)</p>
                  <p className="text-[10px] text-muted-foreground">MP4, MOV, WEBM up to 5GB</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-card border border-blue-500/30 text-[11px] shadow-sm">
                <div className="w-6 h-6 rounded-lg bg-blue-500/15 flex items-center justify-center text-blue-500 shrink-0">
                  <ImageIcon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-bold text-foreground">Image (Posts & Carousels)</p>
                  <p className="text-[10px] text-muted-foreground">PNG, JPG, WEBP up to 50MB</p>
                </div>
              </div>
            </div>

            {/* Instant Demo Tryout Trigger */}
            <div className="pt-2 flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
              <span className="text-[11px] text-muted-foreground font-medium">Or test sample:</span>
              <button
                id="btn-sample-demo"
                type="button"
                onClick={() => {
                  // Create a crisp sample image canvas
                  const canvas = document.createElement('canvas');
                  canvas.width = 1080;
                  canvas.height = 1350;
                  const ctx = canvas.getContext('2d');
                  if (ctx) {
                    // Dark luxury gradient
                    const grad = ctx.createLinearGradient(0, 0, 1080, 1350);
                    grad.addColorStop(0, '#0f172a');
                    grad.addColorStop(0.5, '#1e1b4b');
                    grad.addColorStop(1, '#09090b');
                    ctx.fillStyle = grad;
                    ctx.fillRect(0, 0, 1080, 1350);

                    // Grid accent
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
                    ctx.lineWidth = 2;
                    for (let x = 0; x < 1080; x += 60) {
                      ctx.beginPath();
                      ctx.moveTo(x, 0);
                      ctx.lineTo(x, 1350);
                      ctx.stroke();
                    }

                    // Content text
                    ctx.fillStyle = '#ffffff';
                    ctx.font = 'bold 54px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText('3 Secrets to 10x Your Content Reach', 540, 580);

                    ctx.fillStyle = '#a1a1aa';
                    ctx.font = '32px sans-serif';
                    ctx.fillText('Stop scrolling if you want to grow fast', 540, 670);

                    ctx.fillStyle = '#f59e0b';
                    ctx.font = 'bold 30px monospace';
                    ctx.fillText('[ VIRAL SAMPLE CREATIVE ]', 540, 800);

                    canvas.toBlob((blob) => {
                      if (blob) {
                        const sampleFile = new File([blob], 'viral-hook-sample.png', { type: 'image/png' });
                        onFileSelect(sampleFile);
                      }
                    }, 'image/png');
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground border border-border text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Load Sample Video/Image</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Selected Media Preview Card */
        <div id="media-preview-container" className="bg-secondary/40 border border-border rounded-xl p-4 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-border">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center shrink-0">
                {mediaType === 'video' ? (
                  <Video className="w-5 h-5 text-rose-500" />
                ) : (
                  <ImageIcon className="w-5 h-5 text-blue-500" />
                )}
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-foreground truncate">{selectedFile.name}</h4>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                  <span className="font-mono">{formatFileSize(selectedFile.size)}</span>
                  <span>•</span>
                  <span className="uppercase font-mono text-[10px] text-foreground bg-secondary px-1.5 py-0.5 rounded border border-border">
                    {mediaType}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                id="btn-change-media"
                type="button"
                disabled={isAnalyzing}
                onClick={() => fileInputRef.current?.click()}
                className={`px-3 py-1.5 rounded-lg bg-card hover:bg-secondary text-xs font-medium text-foreground border border-border transition-colors cursor-pointer ${
                  isAnalyzing ? 'opacity-50 pointer-events-none' : ''
                }`}
              >
                Change
              </button>
              {/* Reset / Remove Media Button (card level) */}
              <button
                id="btn-remove-media"
                type="button"
                disabled={isAnalyzing}
                onClick={onClearFile}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-xs font-bold border border-rose-500/30 transition-colors cursor-pointer ${
                  isAnalyzing ? 'opacity-50 pointer-events-none' : ''
                }`}
                title="Remove file and reset"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Media Player / Image Display - Steady, fixed height to prevent screen jump */}
          <div className="rounded-xl overflow-hidden bg-black/95 border border-border flex items-center justify-center h-64 sm:h-72 w-full">
            {previewUrl && (
              mediaType === 'video' ? (
                <video
                  src={previewUrl}
                  controls
                  playsInline
                  className="h-full w-full object-contain rounded-xl"
                />
              ) : (
                <img
                  src={previewUrl}
                  alt="Uploaded media preview"
                  className="h-full w-full object-contain rounded-xl"
                />
              )
            )}
          </div>

          {/* Progress Bar (Visible during processing) */}
          {isAnalyzing && (
            <div className="space-y-2.5 bg-card p-4 rounded-xl border border-border shadow-lg">
              <div className="flex items-center justify-between text-xs h-5">
                <span className="font-medium text-foreground flex items-center gap-2 truncate max-w-[80%]">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-foreground shrink-0" />
                  <span className="truncate">
                    {progress < 40 ? 'Analyzing 0-3s hook keyframes...' : 'Generating Title, Caption, Hashtags & Time...'}
                  </span>
                </span>
                <span className="font-mono text-foreground font-bold shrink-0">{progress}%</span>
              </div>
              <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden border border-border/40">
                <div
                  className="bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono h-4">
                <span>AI Deep Content Analysis in Progress</span>
                {estimatedTimeLeft > 0 && (
                  <span>~{estimatedTimeLeft}s remaining</span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Primary Execution CTA Button */}
      {selectedFile && (
        <button
          id="btn-run-audit"
          type="button"
          disabled={isAnalyzing}
          onClick={onAnalyze}
          className={`w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-xl font-bold text-sm sm:text-base transition-colors shadow-lg cursor-pointer ${
            isAnalyzing
              ? 'bg-secondary text-muted-foreground cursor-not-allowed border border-border'
              : 'bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 hover:from-rose-500 hover:via-purple-500 hover:to-indigo-500 text-white shadow-purple-500/20'
          }`}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              <span>AI Analyzing Media... (Please wait)</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-white" />
              <span>Generate Viral Post Strategy</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};

