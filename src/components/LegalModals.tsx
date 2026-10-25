import React, { useState } from 'react';
import { X, Shield, Scale, AlertTriangle, Mail, Send, CheckCircle2 } from 'lucide-react';
import { ModalType } from '../types.js';

interface LegalModalsProps {
  activeModal: ModalType;
  onClose: () => void;
}

export const LegalModals: React.FC<LegalModalsProps> = ({ activeModal, onClose }) => {
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

  if (!activeModal) return null;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactForm({ name: '', email: '', message: '' });
      onClose();
    }, 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/70">
          <div className="flex items-center gap-2.5">
            {activeModal === 'privacy' && <Shield className="w-5 h-5 text-pink-600" />}
            {activeModal === 'terms' && <Scale className="w-5 h-5 text-pink-600" />}
            {activeModal === 'copyright' && <AlertTriangle className="w-5 h-5 text-pink-600" />}
            {activeModal === 'contact' && <Mail className="w-5 h-5 text-pink-600" />}
            <h3 className="text-lg font-bold text-zinc-900">
              {activeModal === 'privacy' && 'Privacy Policy'}
              {activeModal === 'terms' && 'Terms of Service'}
              {activeModal === 'copyright' && 'Copyright & DMCA Policy'}
              {activeModal === 'contact' && 'Contact Us'}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200 rounded-lg transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto text-sm text-zinc-600 leading-relaxed space-y-4">
          {activeModal === 'privacy' && (
            <>
              <p>
                <strong>Last Updated: October 2026</strong>
              </p>
              <p>
                At <strong>iGram</strong>, we respect your privacy and are committed to protecting it. This Privacy Policy outlines our transparent approach to user data.
              </p>
              <h4 className="font-bold text-zinc-900">1. No Personal Credential Collection</h4>
              <p>
                We do not ask for, capture, or store your Instagram passwords, account tokens, or browser cookies. iGram operates solely as a link-processing tool for publicly accessible media.
              </p>
              <h4 className="font-bold text-zinc-900">2. No Media Storage on Servers</h4>
              <p>
                We do not archive or maintain copies of user-requested videos or photos on our persistent storage. All media is fetched on-the-fly and streamed directly to your browser.
              </p>
              <h4 className="font-bold text-zinc-900">3. Ephemeral Rate Limiting</h4>
              <p>
                To safeguard the service against denial-of-service and automated abuse, client IP addresses are monitored in volatile server memory for rolling 60-second intervals and are automatically purged.
              </p>
            </>
          )}

          {activeModal === 'terms' && (
            <>
              <p>
                <strong>Last Updated: October 2026</strong>
              </p>
              <p>
                By using <strong>iGram</strong>, you agree to these Terms of Service. If you do not agree with any part of these terms, please discontinue using the website.
              </p>
              <h4 className="font-bold text-zinc-900">1. Permitted Use</h4>
              <p>
                iGram is designed strictly for personal, non-commercial archival and educational purposes. You agree not to use the service to infringe intellectual property rights, violate Instagram’s Terms of Service, or harvest media for commercial exploitation.
              </p>
              <h4 className="font-bold text-zinc-900">2. User Responsibility</h4>
              <p>
                You are solely responsible for verifying that you have the right or permission from the original content owner before downloading, copying, or distributing any media found on Instagram.
              </p>
              <h4 className="font-bold text-zinc-900">3. Disclaimer of Warranties</h4>
              <p>
                The service is provided on an "as is" and "as available" basis without warranties of any kind. iGram is not affiliated with, endorsed by, or sponsored by Instagram or Meta Platforms, Inc.
              </p>
            </>
          )}

          {activeModal === 'copyright' && (
            <>
              <p>
                <strong>Copyright & DMCA Takedown Policy</strong>
              </p>
              <p>
                iGram strongly respects intellectual property rights and complies with the Digital Millennium Copyright Act (DMCA) and international copyright legislation.
              </p>
              <h4 className="font-bold text-zinc-900">Notice and Takedown Procedure</h4>
              <p>
                iGram does not host, store, or archive copyrighted content. We act strictly as a technical link processor. However, if you are a copyright owner or authorized representative and believe content is being processed in an infringing manner, you may contact our designated agent:
              </p>
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-mono">
                Email: dmca@igram.io<br />
                Subject: DMCA Notice of Infringement<br />
                Please include: (1) Proof of authorization, (2) The specific Instagram URL, (3) A statement of good faith belief.
              </div>
              <p>
                Upon receiving a verified notice, we will promptly block links associated with the identified post or creator from being resolved by our service.
              </p>
            </>
          )}

          {activeModal === 'contact' && (
            <>
              {contactSubmitted ? (
                <div className="py-8 text-center">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                  <h4 className="text-base font-bold text-zinc-900 mb-1">Message Sent!</h4>
                  <p className="text-sm text-zinc-600">
                    Thank you for reaching out. We will respond to your inquiry shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <p className="text-sm text-zinc-600">
                    Have feedback, questions about our service, or a technical inquiry? Send us a message and our support team will get back to you.
                  </p>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="e.g. Alex Smith"
                      className="w-full px-3.5 py-2 text-sm border border-zinc-300 rounded-lg focus:outline-none focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="alex@example.com"
                      className="w-full px-3.5 py-2 text-sm border border-zinc-300 rounded-lg focus:outline-none focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">Message</label>
                    <textarea
                      rows={4}
                      required
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Tell us what's on your mind..."
                      className="w-full px-3.5 py-2 text-sm border border-zinc-300 rounded-lg focus:outline-none focus:border-pink-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-pink-600 hover:bg-pink-700 text-white font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-100 bg-zinc-50/50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-zinc-700 hover:text-zinc-900 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
