import React, { useState, useEffect } from 'react';
import { ShieldCheck, FileText, Cookie, Printer, ArrowLeft, CheckCircle2, Lock, Scale, HelpCircle } from 'lucide-react';

export type LegalTab = 'privacy' | 'terms' | 'cookies';

interface LegalViewProps {
  initialTab?: LegalTab;
  onNavigateHome: () => void;
  onNavigate?: (tab: string) => void;
}

export const LegalView: React.FC<LegalViewProps> = ({
  initialTab = 'terms',
  onNavigateHome,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handlePrint = () => {
    try {
      if (typeof window !== 'undefined') {
        window.print();
      }
    } catch (e) {
      console.warn('Print blocked by browser:', e);
    }
  };

  return (
    <div className="bg-dala-cream min-h-screen py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        {/* Top Breadcrumb Navigation */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 text-dala-green font-bold text-xs uppercase tracking-widest hover:text-dala-green-dark transition-colors cursor-pointer group"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Back to Home
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-[#d8d3cb] text-[#1b1c1c] hover:bg-[#f9f8f6] rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Printer size={14} /> Print Document
          </button>
        </div>

        {/* Header Hero Banner */}
        <div className="bg-[#24331e] text-white rounded-2xl p-6 sm:p-10 shadow-md mb-8 relative overflow-hidden">
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 rounded-full text-[11px] font-bold tracking-wider uppercase backdrop-blur-xs">
              <ShieldCheck size={14} className="text-amber-400" />
              Official Documentation &amp; Compliance
            </div>
            <h1 className="font-serif font-bold text-3xl sm:text-4xl uppercase tracking-wide">
              {activeTab === 'terms' && 'Terms of Service'}
              {activeTab === 'privacy' && 'Privacy Policy'}
              {activeTab === 'cookies' && 'Cookie Policy'}
            </h1>
            <p className="text-xs sm:text-sm text-gray-200 max-w-2xl leading-relaxed">
              Dala Kitchen is dedicated to culinary transparency, respectful community interactions, and rigorous data protection. Last updated: August 2026.
            </p>
          </div>
        </div>

        {/* Tab Selection Navigation */}
        <div className="flex border-b border-[#d8d3cb] bg-white rounded-t-2xl px-4 sm:px-6 shadow-2xs">
          <button
            onClick={() => setActiveTab('terms')}
            className={`py-4 px-3 sm:px-5 font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'terms'
                ? 'border-[#24331e] text-[#24331e]'
                : 'border-transparent text-gray-500 hover:text-[#1b1c1c]'
            }`}
          >
            <FileText size={16} /> Terms of Service
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`py-4 px-3 sm:px-5 font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'privacy'
                ? 'border-[#24331e] text-[#24331e]'
                : 'border-transparent text-gray-500 hover:text-[#1b1c1c]'
            }`}
          >
            <ShieldCheck size={16} /> Privacy Policy
          </button>
          <button
            onClick={() => setActiveTab('cookies')}
            className={`py-4 px-3 sm:px-5 font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'cookies'
                ? 'border-[#24331e] text-[#24331e]'
                : 'border-transparent text-gray-500 hover:text-[#1b1c1c]'
            }`}
          >
            <Cookie size={16} /> Cookie Policy
          </button>
        </div>

        {/* Main Content Body */}
        <div className="bg-white rounded-b-2xl border border-t-0 border-[#d8d3cb] p-6 sm:p-10 shadow-2xs space-y-8 text-xs sm:text-sm text-[#2d2d2d] leading-relaxed font-sans">
          {activeTab === 'terms' && (
            <div className="space-y-6">
              <section className="space-y-3">
                <h2 className="font-serif font-bold text-xl text-[#1b1c1c] flex items-center gap-2">
                  <Scale size={20} className="text-dala-green" /> 1. Agreement &amp; Acceptance of Terms
                </h2>
                <p>
                  Welcome to Dala Kitchen ("Website", "Platform", or "Service"), curated by Chef Achieng. By accessing our recipes, educational materials, newsletter publications, or interactive kitchen tools, you agree to comply with and be bound by these Terms of Service.
                </p>
                <p>
                  If you disagree with any portion of these terms, please discontinue use of the site. We reserve the right to revise these terms periodically, and your continued usage constitutes acceptance of any modifications.
                </p>
              </section>

              <section className="space-y-3 pt-4 border-t border-gray-100">
                <h2 className="font-serif font-bold text-xl text-[#1b1c1c]">
                  2. Intellectual Property &amp; Recipe Copyright
                </h2>
                <p>
                  All culinary formulas, recipe step-by-step guides, photography, video productions, and written articles published on Dala Kitchen are the intellectual property of Dala Kitchen and Chef Achieng unless otherwise noted.
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-gray-700">
                  <li>
                    <strong className="text-[#1b1c1c]">Personal Kitchen Usage:</strong> You are granted a non-exclusive license to view, print, and cook any recipe for personal, non-commercial home use.
                  </li>
                  <li>
                    <strong className="text-[#1b1c1c]">Attribution Required:</strong> You may share recipe links and brief excerpts on personal blogs or social platforms, provided clear clickable attribution to Dala Kitchen is included.
                  </li>
                  <li>
                    <strong className="text-[#1b1c1c]">Commercial Restriction:</strong> Full republication, unauthorized syndication, or commercial resale of recipes and imagery without prior written consent is strictly prohibited.
                  </li>
                </ul>
              </section>

              <section className="space-y-3 pt-4 border-t border-gray-100">
                <h2 className="font-serif font-bold text-xl text-[#1b1c1c]">
                  3. Food Safety, Nutritional Estimates &amp; Allergies
                </h2>
                <p>
                  Cooking and baking involve perishable ingredients, high-heat equipment, and biological fermentation (such as wild sourdough cultures).
                </p>
                <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-xl text-amber-900 text-xs sm:text-sm">
                  <strong>Important Kitchen Advisory:</strong> Nutritional values, calorie counts, and baker percentages provided on Dala Kitchen are estimates generated for educational guidance. Readers are responsible for verifying ingredient allergens (including gluten, dairy, tree nuts, and eggs) and adhering to local food safety practices.
                </div>
              </section>

              <section className="space-y-3 pt-4 border-t border-gray-100">
                <h2 className="font-serif font-bold text-xl text-[#1b1c1c]">
                  4. User Conduct &amp; Community Comments
                </h2>
                <p>
                  When submitting reviews, contact inquiries, or interacting with our community, users agree to maintain respectful, constructive discourse. Dala Kitchen reserves the right to moderate or remove inappropriate, abusive, or spam comments.
                </p>
              </section>

              <section className="space-y-3 pt-4 border-t border-gray-100">
                <h2 className="font-serif font-bold text-xl text-[#1b1c1c]">
                  5. Contact &amp; Legal Notices
                </h2>
                <p>
                  For licensing inquiries, recipe syndication requests, or questions regarding these terms, please reach out through our{' '}
                  <button
                    onClick={() => onNavigate && onNavigate('contact')}
                    className="text-dala-green font-bold underline cursor-pointer hover:text-dala-green-dark"
                  >
                    Contact Page
                  </button>{' '}
                  or email <span className="font-mono font-semibold">legal@dalakitchen.com</span>.
                </p>
              </section>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <section className="space-y-3">
                <h2 className="font-serif font-bold text-xl text-[#1b1c1c] flex items-center gap-2">
                  <Lock size={20} className="text-dala-green" /> 1. Privacy Commitment &amp; Overview
                </h2>
                <p>
                  At Dala Kitchen, we hold the trust of our cooking community in the highest regard. This Privacy Policy outlines how personal data is collected, used, and safeguarded when you visit our website, subscribe to newsletter broadcasts, or save recipe bookmarks.
                </p>
              </section>

              <section className="space-y-3 pt-4 border-t border-gray-100">
                <h2 className="font-serif font-bold text-xl text-[#1b1c1c]">
                  2. What Data We Collect
                </h2>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>
                    <strong className="text-[#1b1c1c]">Newsletter Subscribers:</strong> When you subscribe to our email newsletter, we collect your email address (and optional name). This data is used exclusively to deliver weekly recipes, sourdough workshop updates, and kitchen stories.
                  </li>
                  <li>
                    <strong className="text-[#1b1c1c]">Contact Inquiries:</strong> When you send a message through our contact form, we collect your name, email, and message content to respond to your inquiry.
                  </li>
                  <li>
                    <strong className="text-[#1b1c1c]">Recipe Bookmarks &amp; Preferences:</strong> Your saved recipe bookmarks and measurement unit preferences are stored locally in your browser's LocalStorage for instant access.
                  </li>
                  <li>
                    <strong className="text-[#1b1c1c]">Anonymous Usage Analytics:</strong> We record aggregate statistics (popular recipe views, video engagement) to improve site performance and recipe development.
                  </li>
                </ul>
              </section>

              <section className="space-y-3 pt-4 border-t border-gray-100">
                <h2 className="font-serif font-bold text-xl text-[#1b1c1c]">
                  3. We Never Sell Your Data
                </h2>
                <p className="bg-[#24331e]/5 border border-[#24331e]/20 p-4 rounded-xl font-medium text-dala-green">
                  ✓ Dala Kitchen does not sell, rent, or lease subscriber lists or personal reader data to third-party advertisers or data brokers under any circumstances.
                </p>
              </section>

              <section className="space-y-3 pt-4 border-t border-gray-100">
                <h2 className="font-serif font-bold text-xl text-[#1b1c1c]">
                  4. Unsubscribe &amp; Data Rights (GDPR &amp; CCPA Compliance)
                </h2>
                <p>
                  You may unsubscribe from our newsletter at any time with a single click via the unsubscribe link present in every email dispatch. You may also request deletion or export of your subscriber records by contacting us at <span className="font-mono font-semibold">privacy@dalakitchen.com</span>.
                </p>
              </section>
            </div>
          )}

          {activeTab === 'cookies' && (
            <div className="space-y-6">
              <section className="space-y-3">
                <h2 className="font-serif font-bold text-xl text-[#1b1c1c] flex items-center gap-2">
                  <Cookie size={20} className="text-dala-green" /> 1. What Are Cookies?
                </h2>
                <p>
                  Cookies and local browser storage are small text files and cache identifiers stored on your device when you visit web pages. They enable the website to recognize your preferences and provide a seamless cooking experience.
                </p>
              </section>

              <section className="space-y-3 pt-4 border-t border-gray-100">
                <h2 className="font-serif font-bold text-xl text-[#1b1c1c]">
                  2. Cookies &amp; Storage Used on Dala Kitchen
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-[#1b1c1c] mb-1">
                      Essential &amp; Functional Storage
                    </h3>
                    <p className="text-gray-600 text-xs">
                      Preserves your saved recipe bookmarks, dark/light settings, and administrative authentication state across page reloads.
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-[#1b1c1c] mb-1">
                      Embedded Media (YouTube)
                    </h3>
                    <p className="text-gray-600 text-xs">
                      When viewing embedded video tutorials, YouTube may set cookies to measure playback quality and video bandwidth.
                    </p>
                  </div>
                </div>
              </section>

              <section className="space-y-3 pt-4 border-t border-gray-100">
                <h2 className="font-serif font-bold text-xl text-[#1b1c1c]">
                  3. Managing Your Cookie Preferences
                </h2>
                <p>
                  You can control or clear cookies at any time through your browser settings (Chrome, Safari, Firefox, Edge). Please note that disabling local storage may reset your saved recipe bookmarks.
                </p>
              </section>
            </div>
          )}
        </div>

        {/* Footer Support Callout */}
        <div className="mt-8 bg-white border border-[#d8d3cb] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-full bg-dala-cream border border-dala-green/30 text-dala-green flex items-center justify-center flex-shrink-0">
              <HelpCircle size={20} />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-[#1b1c1c]">Have a question about our policies?</h4>
              <p className="text-xs text-gray-500">Our culinary and support team is here to assist you.</p>
            </div>
          </div>

          <button
            onClick={() => onNavigate && onNavigate('contact')}
            className="px-5 py-2.5 bg-[#24331e] hover:bg-[#34462c] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-2xs w-full sm:w-auto text-center"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};
