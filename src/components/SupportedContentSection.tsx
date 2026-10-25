import React from 'react';
import { CheckCircle2, XCircle, Film, Video, Image as ImageIcon, Lock, Clock, Radio } from 'lucide-react';

export const SupportedContentSection: React.FC = () => {
  return (
    <section className="py-16 md:py-20 bg-white border-b border-zinc-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight mb-3">
            Supported Content & Limitations
          </h2>
          <p className="text-zinc-600 text-base">
            iGram extracts only publicly available media and complies strictly with Instagram copyright and privacy safeguards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Supported Content */}
          <div className="p-6 sm:p-8 rounded-2xl bg-emerald-50/40 border border-emerald-200/80">
            <div className="flex items-center gap-2 mb-6">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              <h3 className="text-lg font-bold text-emerald-950">Supported Media Types</h3>
            </div>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Film className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-zinc-900">Instagram Reels (/reel/)</h4>
                  <p className="text-xs text-zinc-600 mt-0.5">
                    Full audio and video streams from public Reels, including trending clips and original audio.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <Video className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-zinc-900">Feed Videos & IGTV (/p/, /tv/)</h4>
                  <p className="text-xs text-zinc-600 mt-0.5">
                    Standard post videos and longer format IGTV videos in MP4 format.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <ImageIcon className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-zinc-900">Single Photos & Carousels (/p/)</h4>
                  <p className="text-xs text-zinc-600 mt-0.5">
                    High-resolution JPEG photo downloads from public feeds and multi-slide carousels.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Unsupported Content */}
          <div className="p-6 sm:p-8 rounded-2xl bg-zinc-50 border border-zinc-200/80">
            <div className="flex items-center gap-2 mb-6">
              <XCircle className="w-6 h-6 text-zinc-400" />
              <h3 className="text-lg font-bold text-zinc-900">Unsupported Content</h3>
            </div>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-zinc-900">Private Accounts</h4>
                  <p className="text-xs text-zinc-600 mt-0.5">
                    We strictly respect user privacy and do not bypass private-account permissions, password gates, or session cookies.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-zinc-900">Instagram Stories (/stories/)</h4>
                  <p className="text-xs text-zinc-600 mt-0.5">
                    24-hour ephemeral stories require authenticated viewer tokens and are deliberately unsupported.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <Radio className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-zinc-900">Active Live Streams</h4>
                  <p className="text-xs text-zinc-600 mt-0.5">
                    Ongoing Instagram Live broadcasts cannot be extracted until finalized and published as public video posts.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
