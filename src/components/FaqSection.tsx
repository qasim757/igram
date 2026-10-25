import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: 'How do I download an Instagram video?',
    answer:
      'To download an Instagram video, find the post on Instagram, tap the three dots or Share icon, and choose "Copy Link". Next, paste the link into the iGram input box at the top of this page and click "Download". Once the preview appears, click "Download MP4 Video" to save the file to your device.',
  },
  {
    question: 'Can I download Instagram Reels?',
    answer:
      'Yes, iGram fully supports public Instagram Reels. Both high-definition video and synchronized audio streams are extracted directly in MP4 format without watermarks.',
  },
  {
    question: 'Why is my Instagram link not working?',
    answer:
      'A link may fail to process if: (1) The post is from a private Instagram account, (2) The post has been deleted, archived, or restricted by the creator, (3) The link is an ephemeral Story or live broadcast, or (4) The link contains a typo. Make sure your link begins with https://www.instagram.com/reel/ or /p/ and comes from a public account.',
  },
  {
    question: 'Can I download private Instagram videos?',
    answer:
      'No. iGram strictly respects user privacy and creator permissions. Private account content is protected by Instagram authentication and cannot be extracted or downloaded by third-party tools.',
  },
  {
    question: 'Do I need an Instagram password?',
    answer:
      'No! You never need to provide your Instagram password, email, or login credentials. iGram processes public media links without requiring access to your personal account. Never share your password with any downloader site.',
  },
  {
    question: 'Why is the download button unavailable?',
    answer:
      'If the download button is unavailable or disabled, it usually means the provider is still processing the video stream, the Instagram link was malformed, or the media URL has expired. Try clicking "Download Another" and pasting the link again.',
  },
  {
    question: 'Does the downloader work on mobile?',
    answer:
      'Yes. iGram is completely mobile-responsive and works in Safari on iOS (iPhone/iPad) and Google Chrome on Android devices. Videos are saved directly to your device storage.',
  },
  {
    question: 'Is this tool free?',
    answer:
      'Yes, iGram is 100% free to use. There are no subscriptions, registration requirements, or hidden download fees.',
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-16 md:py-24 bg-white border-b border-zinc-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-zinc-600 text-base">
            Everything you need to know about downloading Instagram videos, Reels, and photos with iGram.
          </p>
        </div>

        <div className="divide-y divide-zinc-200/80 border-y border-zinc-200/80">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="py-4">
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left flex items-center justify-between gap-4 py-2 group focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-bold text-zinc-900 group-hover:text-pink-600 transition-colors">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-pink-100 text-pink-700' : 'text-zinc-500'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="pt-2 pb-3 text-sm text-zinc-600 leading-relaxed animate-fade-in pr-8">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
