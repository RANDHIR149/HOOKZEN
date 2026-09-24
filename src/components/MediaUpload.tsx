import React, { useRef, useState } from 'react';
import { 
  Upload, 
  Video, 
  Image as ImageIcon, 
  Sparkles, 
  X, 
  Loader2, 
  CheckCircle2, 
  Film,
  Layers,
  FileVideo,
  FileImage
} from 'lucide-react';
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

type UploadTab = 'all' | 'video' | 'image';

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
  const [activeTab, setActiveTab] = useState<UploadTab>('all');
  const [isDragOver, setIsDragOver] = useState(false);
  
  // Dedicated inputs for Video, Photo/Image, and Any
  const videoInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const allInputRef = useRef<HTMLInputElement>(null);

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
      // reset input value so re-selecting same file triggers onChange
      e.target.value = '';
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

  const loadSampleImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1350;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createLinearGradient(0, 0, 1080, 1350);
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(0.5, '#1e1b4b');
      grad.addColorStop(1, '#09090b');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1080, 1350);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 2;
      for (let x = 0; x < 1080; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 1350);
        ctx.stroke();
      }

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 54px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('3 Secrets to 10x Your Reach', 540, 580);

      ctx.fillStyle = '#a1a1aa';
      ctx.font = '32px sans-serif';
      ctx.fillText('Stop scrolling if you want to grow fast', 540, 670);

      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 30px monospace';
      ctx.fillText('[ SAMPLE PHOTO CREATIVE ]', 540, 800);

      canvas.toBlob((blob) => {
        if (blob) {
          const sampleFile = new File([blob], 'viral-photo-sample.png', { type: 'image/png' });
          onFileSelect(sampleFile);
        }
      }, 'image/png');
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
      {/* Hidden File Inputs */}
      {/* 1. Video Specific Input */}
      <input
        ref={videoInputRef}
        type="file"
        accept="video/mp4,video/quicktime,video/webm,video/x-matroska,video/*"
        onChange={handleInputChange}
        className="hidden"
        id="video-upload-input"
        disabled={isAnalyzing}
      />
      {/* 2. Photo / Image Specific Input */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/heic,image/*"
        onChange={handleInputChange}
        className="hidden"
        id="image-upload-input"
        disabled={isAnalyzing}
      />
      {/* 3. Combined Input */}
      <input
        ref={allInputRef}
        type="file"
        accept="video/*,image/*"
        onChange={handleInputChange}
        className="hidden"
        id="all-upload-input"
        disabled={isAnalyzing}
      />

      {/* Header & Tab Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500/20 via-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center text-purple-500 shrink-0">
            <Upload className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <span>Upload Video or Photo</span>
              <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border">
                Both Supported
              </span>
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Choose video (Reels, TikTok, Shorts up to 5GB) or image (Posts, Carousels up to 50MB)
            </p>
          </div>
        </div>

        {/* Tab Filters (Both / Video / Photo) */}
        {!selectedFile && (
          <div className="flex items-center bg-secondary/70 p-1 rounded-xl border border-border self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Both
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('video')}
              className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'video'
                  ? 'bg-rose-500/15 text-rose-500 shadow-sm border border-rose-500/30'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Film className="w-3 h-3" />
              <span>Video</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('image')}
              className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'image'
                  ? 'bg-blue-500/15 text-blue-500 shadow-sm border border-blue-500/30'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <ImageIcon className="w-3 h-3" />
              <span>Photo</span>
            </button>
          </div>
        )}

        {selectedFile && (
          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5 self-start sm:self-auto">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            {mediaType === 'video' ? 'Video Loaded' : 'Photo Loaded'}
          </span>
        )}
      </div>

      {/* Upload Dropzone or Selected Media Preview */}
      {!selectedFile ? (
        <div className="space-y-3">
          {/* TWO PRIMARY DEDICATED UPLOAD BUTTON CARDS: 1 FOR VIDEO, 1 FOR PHOTO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* OPTION 1: UPLOAD VIDEO */}
            {(activeTab === 'all' || activeTab === 'video') && (
              <div
                id="btn-upload-video-card"
                onClick={() => videoInputRef.current?.click()}
                className="group relative border-2 border-dashed border-rose-500/30 hover:border-rose-500 bg-rose-500/5 hover:bg-rose-500/10 rounded-2xl p-5 sm:p-6 text-left cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-600 text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                    <Video className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-500 border border-rose-500/30">
                    Up to 5GB
                  </span>
                </div>

                <div className="space-y-1 mb-4">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm sm:text-base font-bold text-foreground group-hover:text-rose-500 transition-colors">
                      Upload Video
                    </h4>
                    <span className="text-xs text-rose-500 font-semibold">→</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Reels, Shorts, TikTok, long videos. Analyzes keyframes, hooks, pacing, and retention.
                  </p>
                  <p className="text-[11px] text-muted-foreground font-mono pt-1">
                    MP4, MOV, WEBM, MKV
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    videoInputRef.current?.click();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <FileVideo className="w-4 h-4" />
                  <span>Choose Video File</span>
                </button>
              </div>
            )}

            {/* OPTION 2: UPLOAD PHOTO / IMAGE */}
            {(activeTab === 'all' || activeTab === 'image') && (
              <div
                id="btn-upload-image-card"
                onClick={() => imageInputRef.current?.click()}
                className="group relative border-2 border-dashed border-blue-500/30 hover:border-blue-500 bg-blue-500/5 hover:bg-blue-500/10 rounded-2xl p-5 sm:p-6 text-left cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-500 border border-blue-500/30">
                    Up to 50MB
                  </span>
                </div>

                <div className="space-y-1 mb-4">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm sm:text-base font-bold text-foreground group-hover:text-blue-500 transition-colors">
                      Upload Photo / Image
                    </h4>
                    <span className="text-xs text-blue-500 font-semibold">→</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Instagram Posts, Carousels, Banners, Infographics, Memes. Analyzes subject, colors, and viral appeal.
                  </p>
                  <p className="text-[11px] text-muted-foreground font-mono pt-1">
                    PNG, JPG, JPEG, WEBP
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    imageInputRef.current?.click();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <FileImage className="w-4 h-4" />
                  <span>Choose Photo / Image</span>
                </button>
              </div>
            )}
          </div>

          {/* Combined Drag & Drop Strip */}
          <div
            id="dropzone-area"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => allInputRef.current?.click()}
            className={`border border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-200 ${
              isDragOver
                ? 'border-foreground bg-secondary'
                : 'border-border hover:border-muted-foreground/50 bg-secondary/20 hover:bg-secondary/40'
            }`}
          >
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Upload className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Or drag and drop <strong>any Video or Photo</strong> here to browse directly</span>
            </div>
          </div>

          {/* Quick Demo Sample Loader */}
          <div className="flex items-center justify-center gap-2 pt-1">
            <span className="text-[11px] text-muted-foreground font-medium">Try instant sample:</span>
            <button
              id="btn-sample-demo"
              type="button"
              onClick={loadSampleImage}
              className="px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground border border-border text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Load Sample Post (Photo)</span>
            </button>
          </div>
        </div>
      ) : (
        /* Selected Media Preview Card */
        <div id="media-preview-container" className="bg-secondary/40 border border-border rounded-xl p-4 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-border">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${
                mediaType === 'video'
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-500'
                  : 'bg-blue-500/10 border-blue-500/30 text-blue-500'
              }`}>
                {mediaType === 'video' ? (
                  <Video className="w-5 h-5" />
                ) : (
                  <ImageIcon className="w-5 h-5" />
                )}
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-foreground truncate">{selectedFile.name}</h4>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                  <span className="font-mono">{formatFileSize(selectedFile.size)}</span>
                  <span>•</span>
                  <span className={`uppercase font-mono text-[10px] px-2 py-0.5 rounded font-bold border ${
                    mediaType === 'video'
                      ? 'bg-rose-500/15 text-rose-500 border-rose-500/30'
                      : 'bg-blue-500/15 text-blue-500 border-blue-500/30'
                  }`}>
                    {mediaType === 'video' ? 'Video (Reels/Shorts)' : 'Photo / Image'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Switch / Replace Controls */}
            <div className="flex items-center gap-2 flex-wrap self-end sm:self-auto">
              <button
                type="button"
                disabled={isAnalyzing}
                onClick={() => videoInputRef.current?.click()}
                className={`px-2.5 py-1.5 rounded-lg bg-card hover:bg-secondary text-xs font-semibold text-rose-500 border border-rose-500/30 transition-colors cursor-pointer flex items-center gap-1 ${
                  isAnalyzing ? 'opacity-50 pointer-events-none' : ''
                }`}
                title="Replace with another video"
              >
                <Film className="w-3.5 h-3.5" />
                <span>Change Video</span>
              </button>
              <button
                type="button"
                disabled={isAnalyzing}
                onClick={() => imageInputRef.current?.click()}
                className={`px-2.5 py-1.5 rounded-lg bg-card hover:bg-secondary text-xs font-semibold text-blue-500 border border-blue-500/30 transition-colors cursor-pointer flex items-center gap-1 ${
                  isAnalyzing ? 'opacity-50 pointer-events-none' : ''
                }`}
                title="Replace with another photo"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Change Photo</span>
              </button>
              {/* Reset / Remove Media Button */}
              <button
                id="btn-remove-media"
                type="button"
                disabled={isAnalyzing}
                onClick={onClearFile}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground text-xs font-semibold border border-border transition-colors cursor-pointer ${
                  isAnalyzing ? 'opacity-50 pointer-events-none' : ''
                }`}
                title="Remove file"
              >
                <X className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>

          {/* Media Player / Image Display */}
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
                    {mediaType === 'video'
                      ? (progress < 40 ? 'Analyzing 0-3s video keyframes & retention...' : 'Generating Title, Caption, Hashtags & Time...')
                      : (progress < 40 ? 'Analyzing photo composition & visual appeal...' : 'Generating Title, Caption, Hashtags & Time...')}
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
              : 'bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 hover:from-rose-500 hover:via-purple-500 hover:to-indigo-500 text-white shadow-purple-500/20 active:scale-95'
          }`}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              <span>AI Analyzing {mediaType === 'video' ? 'Video' : 'Photo'}... (Please wait)</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-white" />
              <span>Generate Viral Post Strategy for {mediaType === 'video' ? 'Video' : 'Photo'}</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};
