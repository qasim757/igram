import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.js';
import { DownloaderHero } from './components/DownloaderHero.js';
import { ResultCard } from './components/ResultCard.js';
import { HowToSection } from './components/HowToSection.js';
import { FeaturesSection } from './components/FeaturesSection.js';
import { SupportedContentSection } from './components/SupportedContentSection.js';
import { FaqSection } from './components/FaqSection.js';
import { Footer } from './components/Footer.js';
import { LegalModals } from './components/LegalModals.js';
import { DownloaderMode, ExtractedMediaResult, ModalType, ApiHealthResponse } from './types.js';

export default function App() {
  const [activeMode, setActiveMode] = useState<DownloaderMode>('video');
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedMedia, setExtractedMedia] = useState<ExtractedMediaResult | null>(null);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [healthStatus, setHealthStatus] = useState<ApiHealthResponse | null>(null);

  // Check backend health on mount
  useEffect(() => {
    fetch('/api/health')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.status === 'healthy') {
          setHealthStatus(data);
        }
      })
      .catch(() => {
        // Soft fail if server isn't ready
      });
  }, []);

  const handleExtract = async (targetUrl: string) => {
    setError(null);
    setExtractedMedia(null);

    const trimmed = targetUrl.trim();
    if (!trimmed) {
      setError('Please paste a valid Instagram link.');
      return;
    }

    // Basic frontend format pre-check
    const isLikelyInstagram = /^(https?:\/\/)?((www|m)\.)?(instagram\.com|instagr\.am)\/(p|reel|reels|tv)\/([a-zA-Z0-9_-]+)/i.test(trimmed);
    if (!isLikelyInstagram) {
      setError(
        'Please enter a valid Instagram link (e.g., https://www.instagram.com/reel/DUtY_OyjMwq/ or /p/...). Stories, profiles, and external sites are not supported.'
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: trimmed }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || 'Failed to extract media. The post may be private, restricted, or an unsupported format.');
        setIsLoading(false);
        return;
      }

      setExtractedMedia(data.media);
      setIsLoading(false);

      // Smooth scroll to result card
      setTimeout(() => {
        const el = document.getElementById('results-section');
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch {
      setError('Network connection error. Please verify your internet connection and try again.');
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setUrl('');
    setError(null);
  };

  const handleReset = () => {
    setExtractedMedia(null);
    setError(null);
    setUrl('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-zinc-900 font-sans selection:bg-pink-100 selection:text-pink-900">
      {/* Navigation Header */}
      <Header
        activeMode={activeMode}
        onSelectMode={(mode) => {
          setActiveMode(mode);
          setExtractedMedia(null);
          setError(null);
        }}
        onNavigateSection={handleNavigateSection}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Downloader Section */}
        <DownloaderHero
          activeMode={activeMode}
          onSelectMode={(mode) => {
            setActiveMode(mode);
            setExtractedMedia(null);
            setError(null);
          }}
          url={url}
          setUrl={setUrl}
          onSubmit={handleExtract}
          isLoading={isLoading}
          error={error}
          onClear={handleClear}
          onRetry={() => handleExtract(url)}
        />

        {/* Media Results Section */}
        {extractedMedia && (
          <div id="results-section">
            <ResultCard media={extractedMedia} onReset={handleReset} />
          </div>
        )}

        {/* Informational & SEO Sections */}
        <HowToSection />
        <FeaturesSection />
        <SupportedContentSection />
        <FaqSection />
      </main>

      {/* Footer */}
      <Footer
        onSelectMode={(mode) => {
          setActiveMode(mode);
          setExtractedMedia(null);
        }}
        onNavigateSection={handleNavigateSection}
        onOpenModal={setActiveModal}
      />

      {/* Legal & Contact Modals */}
      <LegalModals activeModal={activeModal} onClose={() => setActiveModal(null)} />
    </div>
  );
}
