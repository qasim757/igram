import React, { useState } from 'react';
import { Clipboard, X, ArrowRight, Loader2, Sparkles, AlertCircle, RefreshCw, Film, Video, Image as ImageIcon } from 'lucide-react';
import { DownloaderMode } from '../types.js';

interface DownloaderHeroProps {
  activeMode: DownloaderMode;
  onSelectMode: (mode: DownloaderMode) => void;
  url: string;
  setUrl: (url: string) => void;
  onSubmit: (url: string) => void;
  isLoading: boolean;
  error: string | null;
  onClear: () => void;
  onRetry: () => void;
}

const VERIFIED_SAMPLE_URL = 'https://www.instagram.com/reel/DUtY_OyjMwq/';

export const DownloaderHero: React.FC<DownloaderHeroProps> = ({
  activeMode,
  onSelectMode,
  url,
  setUrl,
  onSubmit,
  isLoading,
  error,
  onClear,
  onRetry,
}) => {
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Mode-specific metadata
  const titles: Record<DownloaderMode, { h1: string; sub: string; placeholder: string }> = {
    video: {
      h1: 'Instagram Video Downloader',
      sub: 'Paste a supported Instagram link to preview eligible media and download it when retrieval is available.',
      placeholder: 'Paste Instagram link here...',
    },
    reels: {
      h1: 'Instagram Reels Downloader',
      sub: 'Download Instagram Reels in high definition. Paste a supported link to inspect and save the video stream.',
      placeholder: 'Paste Instagram Reel link (e.g., https://www.instagram.com/reel/...)',
    },
    photo: {
      h1: 'Instagram Photo Downloader',
      sub: 'Extract full-resolution photos and carousels directly from public Instagram posts.',
      placeholder: 'Paste Instagram post link (e.g., https://www.instagram.com/p/...)',
    },
  };

  const currentMeta = titles[activeMode];

  const handlePaste = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setUrl(text.trim());
          setCopiedNotification(true);
          setTimeout(() => setCopiedNotification(false), 2000);
        }
      } else {
        const input = document.getElementById('downloader-input') as HTMLInputElement;
        input?.focus();
      }
    } catch {
      const input = document.getElementById('downloader-input') as HTMLInputElement;
      input?.focus();
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || isLoading) return;
    onSubmit(url.trim());
  };

  const handleUseSample = () => {
    setUrl(VERIFIED_SAMPLE_URL);
    onSubmit(VERIFIED_SAMPLE_URL);
  };

  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden border-b border-pink-50/80 bg-gradient-to-b from-rose-50/40 via-white to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Mode Selector Tabs */}
        <div className="inline-flex items-center p-1 bg-zinc-100/90 rounded-xl mb-6 shadow-2xs border border-zinc-200/60">
          <button
            type="button"
            onClick={() => onSelectMode('video')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              activeMode === 'video'
                ? 'bg-white text-pink-600 shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Video</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectMode('reels')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              activeMode === 'reels'
                ? 'bg-white text-pink-600 shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Reels</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectMode('photo')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              activeMode === 'photo'
                ? 'bg-white text-pink-600 shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Photo</span>
          </button>
        </div>

        {/* H1 Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-zinc-900 tracking-tight mb-4">
          {currentMeta.h1}
        </h1>

        {/* Supporting text */}
        <p className="text-base sm:text-lg text-zinc-600 max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
          {currentMeta.sub}
        </p>

        {/* Downloader Form */}
        <form
          onSubmit={handleFormSubmit}
          className="relative max-w-2xl mx-auto shadow-lg shadow-pink-500/5 rounded-2xl bg-white p-2 border border-pink-200/90 transition-all focus-within:border-pink-500 focus-within:ring-2 focus-within:ring-pink-100"
        >
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1 flex items-center">
              <input
                id="downloader-input"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={currentMeta.placeholder}
                disabled={isLoading}
                autoComplete="off"
                spellCheck="false"
                required
                className="w-full pl-4 pr-20 py-3.5 text-sm sm:text-base text-zinc-900 placeholder:text-zinc-400 bg-transparent rounded-xl focus:outline-none disabled:opacity-50"
              />

              {/* In-input action buttons: Clear and Paste */}
              <div className="absolute right-2 flex items-center gap-1">
                {url && (
                  <button
                    type="button"
                    onClick={onClear}
                    disabled={isLoading}
                    className="p-1.5 text-zinc-400 hover:text-zinc-600 rounded-lg hover:bg-zinc-100 transition-colors"
                    title="Clear input"
                    aria-label="Clear input"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={handlePaste}
                  disabled={isLoading}
                  className="px-2.5 py-1 text-xs font-semibold text-pink-700 bg-pink-50 hover:bg-pink-100 rounded-md transition-colors flex items-center gap-1"
                  title="Paste from clipboard"
                  aria-label="Paste from clipboard"
                >
                  <Clipboard className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Paste</span>
                </button>
              </div>
            </div>

            {/* Primary Download / Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !url.trim()}
              className="px-6 py-3.5 text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 rounded-xl transition-all shadow-md shadow-pink-500/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[130px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Download</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Quick Test & Helper Row */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-zinc-500">
          <span>Need a test link?</span>
          <button
            type="button"
            onClick={handleUseSample}
            disabled={isLoading}
            className="inline-flex items-center gap-1 text-pink-600 hover:text-pink-700 font-semibold underline underline-offset-2 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load verified sample Reel</span>
          </button>
          {copiedNotification && (
            <span className="text-emerald-600 font-medium animate-fade-in">
              · Link pasted from clipboard!
            </span>
          )}
        </div>

        {/* Error Alert Message */}
        {error && (
          <div
            className="mt-6 max-w-2xl mx-auto p-4 rounded-xl bg-red-50/80 border border-red-200 text-left flex items-start gap-3 text-red-900"
            role="alert"
          >
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1 text-sm">
              <p className="font-semibold text-red-950 mb-0.5">Extraction Failed</p>
              <p className="text-red-700 leading-normal">{error}</p>
              <div className="mt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={onRetry}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-900 rounded-lg transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>
                <button
                  type="button"
                  onClick={handleUseSample}
                  className="text-xs text-red-700 hover:text-red-900 underline"
                >
                  Test with a verified sample Reel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
