import React from 'react';
import { DownloaderMode, ModalType } from '../types.js';

interface FooterProps {
  onSelectMode: (mode: DownloaderMode) => void;
  onNavigateSection: (sectionId: string) => void;
  onOpenModal: (modal: ModalType) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectMode,
  onNavigateSection,
  onOpenModal,
}) => {
  return (
    <footer className="bg-zinc-900 text-zinc-300 py-12 md:py-16 text-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-pink-500 to-rose-500 p-[1.5px] flex items-center justify-center">
                <div className="w-full h-full bg-zinc-900 rounded-[6px] flex items-center justify-center">
                  <span className="text-xs font-bold text-pink-400">iG</span>
                </div>
              </div>
              <span className="text-lg font-bold text-white tracking-tight">iGram</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Fast, simple, and privacy-conscious online tool to download eligible public Instagram videos, Reels, and photos in original quality.
            </p>
          </div>

          {/* Quick Tools */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Downloader Tools</h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onSelectMode('video');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-pink-400 transition-colors"
                >
                  Instagram Video Downloader
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onSelectMode('reels');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-pink-400 transition-colors"
                >
                  Instagram Reels Downloader
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onSelectMode('photo');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-pink-400 transition-colors"
                >
                  Instagram Photo Downloader
                </button>
              </li>
            </ul>
          </div>

          {/* Guide & Help */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Resources</h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateSection('how-to-use')}
                  className="hover:text-pink-400 transition-colors"
                >
                  How to Download Videos
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateSection('faq')}
                  className="hover:text-pink-400 transition-colors"
                >
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenModal('contact')}
                  className="hover:text-pink-400 transition-colors"
                >
                  Contact Support
                </button>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Legal & Privacy</h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <button
                  type="button"
                  onClick={() => onOpenModal('privacy')}
                  className="hover:text-pink-400 transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenModal('terms')}
                  className="hover:text-pink-400 transition-colors"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenModal('copyright')}
                  className="hover:text-pink-400 transition-colors"
                >
                  Copyright & DMCA Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Copyright bar */}
        <div className="pt-8 border-t border-zinc-800 text-center text-xs text-zinc-400 space-y-2">
          <p>
            Disclaimer: iGram is an independent web utility and is not affiliated with, endorsed by, or sponsored by Instagram or Meta Platforms, Inc. All Instagram logos, trademarks, and registered trademarks displayed on this site are property of Meta Platforms, Inc.
          </p>
          <p className="text-zinc-400">
            © {new Date().getFullYear()} iGram. All rights reserved. Made for personal and educational use.
          </p>
        </div>
      </div>
    </footer>
  );
};
