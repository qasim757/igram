import React, { useState } from 'react';
import { Download, Play, Check, Copy, ExternalLink, RefreshCw, Volume2, Clock, CheckCircle2 } from 'lucide-react';
import { ExtractedMediaResult } from '../types.js';

interface ResultCardProps {
  media: ExtractedMediaResult;
  onReset: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ media, onReset }) => {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const formatDuration = (seconds?: number) => {
    if (!seconds) return null;
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(media.downloadUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const downloadFilename = `igram_${media.id || 'instagram'}.${media.downloadExt || 'mp4'}`;
  const proxyStreamUrl = `/api/download-stream?url=${encodeURIComponent(media.downloadUrl)}&filename=${encodeURIComponent(downloadFilename)}`;

  const handleDirectDownload = () => {
    setDownloading(true);
    // Use the backend secure streaming proxy to force browser download without CORS restriction
    const a = document.createElement('a');
    a.href = proxyStreamUrl;
    a.setAttribute('download', downloadFilename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => {
      setDownloading(false);
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 my-10 animate-fade-in">
      <div className="bg-white rounded-2xl border border-pink-200/90 shadow-xl shadow-pink-500/5 overflow-hidden">
        {/* Card Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-pink-50/60 to-rose-50/60 border-b border-pink-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-zinc-900">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-bold tracking-tight">Media Ready to Download</span>
            <span className="text-xs text-zinc-400">·</span>
            <span className="text-xs font-medium text-zinc-500">
              Verified via {media.provider === 'weirddl' ? 'WeirdDL' : 'AllDL'}
            </span>
          </div>

          <button
            type="button"
            onClick={onReset}
            className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 px-3 py-1.5 rounded-lg hover:bg-white/80 transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Download Another</span>
          </button>
        </div>

        {/* Card Body */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Media Preview Box */}
            <div className="w-full md:w-64 shrink-0 flex flex-col items-center">
              <div className="relative w-full aspect-[9/16] max-h-[380px] bg-zinc-950 rounded-xl overflow-hidden shadow-md flex items-center justify-center group">
                {media.type === 'video' ? (
                  <video
                    src={media.downloadUrl}
                    poster={media.thumbnailUrl}
                    controls
                    preload="metadata"
                    playsInline
                    className="w-full h-full object-contain"
                  >
                    Your browser does not support video playback.
                  </video>
                ) : (
                  <img
                    src={media.downloadUrl || media.thumbnailUrl}
                    alt={media.title || 'Extracted Instagram Photo'}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                )}
              </div>

              {/* Media details subtitle */}
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-zinc-500">
                {media.duration && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-zinc-400" />
                    <span>{formatDuration(media.duration)}</span>
                  </span>
                )}
                {media.width && media.height && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{media.width}×{media.height}</span>
                  </>
                )}
                {media.hasAudio && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-0.5 text-zinc-600">
                      <Volume2 className="w-3 h-3 text-zinc-400" />
                      <span>Audio included</span>
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Post Information & Download Controls */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                {/* Author badge */}
                {media.author && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-bold text-zinc-900">{media.author}</span>
                    <span className="text-xs text-pink-600 font-medium">Public Creator</span>
                  </div>
                )}

                {/* Caption / Title */}
                <h3 className="text-base font-semibold text-zinc-900 mb-3 line-clamp-3 leading-snug">
                  {media.title || 'Instagram Media Content'}
                </h3>

                {/* Format and technical specifications */}
                <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/70 mb-5 space-y-2 text-xs text-zinc-600">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">Format:</span>
                    <span className="font-semibold text-zinc-800 uppercase">{media.downloadExt} High Quality</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">Content Type:</span>
                    <span className="font-semibold text-zinc-800 capitalize">{media.type} Post</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">Watermark:</span>
                    <span className="font-semibold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> None (Original Stream)
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Area */}
              <div className="space-y-3 pt-2">
                {/* Main Download Button */}
                <button
                  type="button"
                  onClick={handleDirectDownload}
                  disabled={downloading}
                  className="w-full py-3.5 px-5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-pink-500/20 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <Download className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
                  <span>
                    {downloading ? 'Starting Download...' : `Download ${media.downloadExt.toUpperCase()} Video`}
                  </span>
                </button>

                {/* Secondary Actions */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="flex-1 py-2.5 px-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-medium text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                    title="Copy direct media URL to clipboard"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-semibold">Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-zinc-500" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>

                  <a
                    href={media.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-medium text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                    title="Open original video source in new tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Open Source</span>
                  </a>
                </div>

                <p className="text-[11px] text-zinc-400 text-center leading-tight">
                  Media links expire after a short period set by Instagram's CDN servers. If download fails, simply refresh and fetch again.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
