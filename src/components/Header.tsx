import React, { useState } from 'react';
import { Video, Film, Image as ImageIcon, HelpCircle, FileText, Menu, X, ArrowDownCircle } from 'lucide-react';
import { DownloaderMode } from '../types.js';

interface HeaderProps {
  activeMode: DownloaderMode;
  onSelectMode: (mode: DownloaderMode) => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeMode,
  onSelectMode,
  onNavigateSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    onNavigateSection(sectionId);
  };

  const handleModeClick = (mode: DownloaderMode) => {
    setMobileMenuOpen(false);
    onSelectMode(mode);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-pink-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleModeClick('video');
            }}
            className="flex items-center gap-2 group text-zinc-900 transition-opacity hover:opacity-90"
            aria-label="iGram Home"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 p-[1.5px] flex items-center justify-center shadow-xs">
              <div className="w-full h-full bg-white rounded-[7px] flex items-center justify-center">
                <span className="text-sm font-extrabold bg-gradient-to-tr from-pink-600 to-rose-500 bg-clip-text text-transparent">
                  iG
                </span>
              </div>
            </div>
            <div className="flex items-baseline">
              <span className="text-xl font-extrabold tracking-tight text-zinc-900">
                iGram
              </span>
              <span className="text-xs font-semibold text-pink-600 ml-1">Downloader</span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-zinc-600">
            <button
              type="button"
              onClick={() => handleModeClick('video')}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                activeMode === 'video'
                  ? 'text-pink-600 bg-pink-50 font-semibold'
                  : 'hover:text-zinc-900 hover:bg-zinc-50'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>Instagram Video</span>
            </button>

            <button
              type="button"
              onClick={() => handleModeClick('reels')}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                activeMode === 'reels'
                  ? 'text-pink-600 bg-pink-50 font-semibold'
                  : 'hover:text-zinc-900 hover:bg-zinc-50'
              }`}
            >
              <Film className="w-4 h-4" />
              <span>Instagram Reels</span>
            </button>

            <button
              type="button"
              onClick={() => handleModeClick('photo')}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                activeMode === 'photo'
                  ? 'text-pink-600 bg-pink-50 font-semibold'
                  : 'hover:text-zinc-900 hover:bg-zinc-50'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Instagram Photo</span>
            </button>

            <div className="h-4 w-px bg-zinc-200 mx-2" aria-hidden="true" />

            <button
              type="button"
              onClick={() => handleNavClick('how-to-use')}
              className="px-3 py-1.5 rounded-md transition-colors hover:text-zinc-900 hover:bg-zinc-50 flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>How to Use</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('faq')}
              className="px-3 py-1.5 rounded-md transition-colors hover:text-zinc-900 hover:bg-zinc-50 flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>FAQ</span>
            </button>
          </nav>

          {/* Quick CTA on desktop */}
          <div className="hidden lg:flex items-center">
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('downloader-input');
                el?.focus();
                el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              className="px-4 py-2 text-xs font-semibold text-pink-700 bg-pink-50 border border-pink-200/80 rounded-lg hover:bg-pink-100 transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <ArrowDownCircle className="w-3.5 h-3.5 text-pink-600" />
              <span>Paste & Download</span>
            </button>
          </div>

          {/* Mobile hamburger menu toggle */}
          <div className="flex lg:hidden items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-zinc-100 py-3 space-y-1">
            <button
              type="button"
              onClick={() => handleModeClick('video')}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${
                activeMode === 'video' ? 'text-pink-600 bg-pink-50' : 'text-zinc-700 hover:bg-zinc-50'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>Instagram Video Downloader</span>
            </button>

            <button
              type="button"
              onClick={() => handleModeClick('reels')}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${
                activeMode === 'reels' ? 'text-pink-600 bg-pink-50' : 'text-zinc-700 hover:bg-zinc-50'
              }`}
            >
              <Film className="w-4 h-4" />
              <span>Instagram Reels Downloader</span>
            </button>

            <button
              type="button"
              onClick={() => handleModeClick('photo')}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${
                activeMode === 'photo' ? 'text-pink-600 bg-pink-50' : 'text-zinc-700 hover:bg-zinc-50'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Instagram Photo Downloader</span>
            </button>

            <div className="h-px bg-zinc-100 my-2" />

            <button
              type="button"
              onClick={() => handleNavClick('how-to-use')}
              className="w-full text-left px-3 py-2 rounded-md text-sm text-zinc-700 hover:bg-zinc-50 flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-zinc-400" />
              <span>How to Use</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('faq')}
              className="w-full text-left px-3 py-2 rounded-md text-sm text-zinc-700 hover:bg-zinc-50 flex items-center gap-2"
            >
              <HelpCircle className="w-4 h-4 text-zinc-400" />
              <span>Frequently Asked Questions</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
