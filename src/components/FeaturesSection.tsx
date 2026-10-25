import React from 'react';
import { Zap, ShieldCheck, CheckCheck, Smartphone, Sparkles, Ban } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Zap,
      title: 'High-Speed Processing',
      description:
        'Our extraction pipeline resolves direct media streams in 2–4 seconds without long waiting queues or intrusive redirects.',
    },
    {
      icon: Sparkles,
      title: 'Original High Definition',
      description:
        'We retrieve the highest quality source video (720p/1080p MP4) and full-resolution photographs available on the Instagram server.',
    },
    {
      icon: Ban,
      title: 'No Added Watermarks',
      description:
        'iGram does not stamp logos or watermarks onto your extracted media. You receive the exact original video stream published by the creator.',
    },
    {
      icon: ShieldCheck,
      title: '100% Free & No Account Needed',
      description:
        'Zero signups, no credit cards, and no subscription fees. You never need to link your Instagram account or provide passwords.',
    },
    {
      icon: Smartphone,
      title: 'Cross-Device Compatibility',
      description:
        'Engineered to work seamlessly on modern web browsers including Safari on iPhone, Chrome on Android, and all desktop operating systems.',
    },
    {
      icon: CheckCheck,
      title: 'Privacy & Security Focused',
      description:
        'We do not retain cookies, track your viewing habits, or archive downloaded videos on our servers. Your extraction sessions are private.',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-zinc-50/50 border-b border-zinc-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight mb-3">
            Why Choose iGram Downloader?
          </h2>
          <p className="text-zinc-600 text-base">
            Designed for speed, privacy, and simplicity. Save your favorite creator moments and educational tutorials with zero hassle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-xs hover:border-pink-200 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-zinc-900 mb-2">{feat.title}</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">{feat.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
