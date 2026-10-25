import React from 'react';
import { Copy, ArrowRight, Download, CheckCircle, Smartphone } from 'lucide-react';

export const HowToSection: React.FC = () => {
  return (
    <section id="how-to-use" className="py-16 md:py-24 bg-white border-b border-zinc-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight mb-3">
            How to Download Instagram Videos and Reels
          </h2>
          <p className="text-zinc-600 text-base">
            Follow three quick steps to save high-definition Instagram media directly to your phone, tablet, or desktop computer.
          </p>
        </div>

        {/* 3 Step Process Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="relative p-6 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-700 font-extrabold flex items-center justify-center mb-5 text-lg">
                1
              </div>
              <h3 className="text-lg font-bold text-zinc-900 mb-2">Copy the Instagram Link</h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Open Instagram on your app or browser. Find the Reel, Video, or Photo post you wish to save. Tap the three dots (···) or the Share paper airplane icon and select <strong>Copy Link</strong>.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-200/60 flex items-center gap-2 text-xs text-zinc-500">
              <Copy className="w-4 h-4 text-pink-600 shrink-0" />
              <span>Works on iOS, Android, and Desktop</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative p-6 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-700 font-extrabold flex items-center justify-center mb-5 text-lg">
                2
              </div>
              <h3 className="text-lg font-bold text-zinc-900 mb-2">Paste into iGram</h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Return to iGram and paste the copied link into the input box at the top of the page. You can click our quick <strong>Paste</strong> button or press Ctrl+V / Cmd+V.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-200/60 flex items-center gap-2 text-xs text-zinc-500">
              <ArrowRight className="w-4 h-4 text-pink-600 shrink-0" />
              <span>Instant format validation</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative p-6 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-700 font-extrabold flex items-center justify-center mb-5 text-lg">
                3
              </div>
              <h3 className="text-lg font-bold text-zinc-900 mb-2">Preview & Download</h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Click <strong>Download</strong>. Once our extraction provider resolves the original stream, review the video preview and click the download button to save your MP4 or JPG file.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-200/60 flex items-center gap-2 text-xs text-zinc-500">
              <Download className="w-4 h-4 text-pink-600 shrink-0" />
              <span>Original high definition without watermark</span>
            </div>
          </div>
        </div>

        {/* Reels-specific callout */}
        <div className="mt-12 p-6 rounded-2xl bg-rose-50/50 border border-pink-200/80 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center shrink-0">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-zinc-900">Downloading Instagram Reels on Mobile?</h4>
              <p className="text-xs sm:text-sm text-zinc-600">
                On iPhone (Safari), tap "Download" and find the saved video in your Files app or Photos library. On Android (Chrome), downloads automatically save to your Downloads folder.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              const input = document.getElementById('downloader-input');
              input?.focus();
            }}
            className="shrink-0 px-4 py-2.5 bg-white text-pink-700 border border-pink-200 font-semibold text-xs rounded-xl hover:bg-pink-50 transition-colors shadow-2xs"
          >
            Try It Now
          </button>
        </div>
      </div>
    </section>
  );
};
