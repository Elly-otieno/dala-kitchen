import React, { useState } from 'react';
import { ShieldCheck, FileText, Cookie, Printer, CheckCircle, ArrowLeft } from 'lucide-react';

export type PolicyType = 'privacy' | 'terms' | 'cookies';

interface LegalPoliciesViewProps {
  initialTab?: PolicyType;
  onNavigateHome: () => void;
}

export const LegalPoliciesView: React.FC<LegalPoliciesViewProps> = ({
  initialTab = 'privacy',
  onNavigateHome,
}) => {
  const [activeTab, setActiveTab] = useState<PolicyType>(initialTab);

  const handlePrint = () => {
    try {
      if (typeof window !== 'undefined') {
        window.print();
      }
    } catch (e) {
      console.warn('Print function blocked by browser sandbox:', e);
    }
  };

  return (
    <div className="bg-[#fcf9f8] min-h-screen py-10 px-4 sm:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Top Breadcrumb / Back Button */}
        <div className="flex items-center justify-between">
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#24331e] hover:text-[#3d4a31] transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} /> Back to Home
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#e6e2dc] text-[#1b1c1c] rounded-xl text-xs font-semibold hover:bg-[#f4f1eb] transition-colors cursor-pointer shadow-2xs"
          >
            <Printer size={15} /> Print Policy
          </button>
        </div>

        {/* Hero Banner Header */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#e6e2dc] shadow-2xs relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#24331e] text-white flex items-center justify-center shrink-0 shadow-md">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#1b1c1c] uppercase tracking-wide">
                  Dala Kitchen Legal Center
                </h1>
                <p className="text-xs text-[#666666] mt-1">
                  Effective &amp; Verified for 2026 • Transparent guidelines for all global readers
                </p>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <CheckCircle size={14} className="text-emerald-700" /> Compliance Verified
            </span>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-[#e6e2dc] mt-8 -mb-2">
            <button
              onClick={() => setActiveTab('privacy')}
              className={`pb-3.5 px-5 font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-colors cursor-pointer uppercase tracking-wider ${
                activeTab === 'privacy'
                  ? 'border-[#24331e] text-[#24331e]'
                  : 'border-transparent text-gray-500 hover:text-[#1b1c1c]'
              }`}
            >
              <ShieldCheck size={18} /> Privacy Policy
            </button>
            <button
              onClick={() => setActiveTab('terms')}
              className={`pb-3.5 px-5 font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-colors cursor-pointer uppercase tracking-wider ${
                activeTab === 'terms'
                  ? 'border-[#24331e] text-[#24331e]'
                  : 'border-transparent text-gray-500 hover:text-[#1b1c1c]'
              }`}
            >
              <FileText size={18} /> Terms of Service
            </button>
            <button
              onClick={() => setActiveTab('cookies')}
              className={`pb-3.5 px-5 font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-colors cursor-pointer uppercase tracking-wider ${
                activeTab === 'cookies'
                  ? 'border-[#24331e] text-[#24331e]'
                  : 'border-transparent text-gray-500 hover:text-[#1b1c1c]'
              }`}
            >
              <Cookie size={18} /> Cookie Policy
            </button>
          </div>
        </div>

        {/* Page Main Policy Body */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#e6e2dc] shadow-2xs space-y-8 text-sm text-[#2d2d2d] leading-relaxed">
          {activeTab === 'privacy' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <h2 className="font-serif font-bold text-2xl text-[#1b1c1c] border-b border-gray-100 pb-3">
                Privacy Policy &amp; Data Protection
              </h2>
              <p>
                At Dala Kitchen ("we", "our", or "us"), led by Chef Achieng, we hold the trust of our cooking community in the highest regard. This Privacy Policy outlines how your personal information is collected, used, and safeguarded when you visit our website, subscribe to our newsletter broadcasts, or save recipe bookmarks.
              </p>

              <h3 className="font-bold text-base text-[#1b1c1c] pt-2">
                1. Information We Collect &amp; Usage Scope
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>
                  <strong className="text-[#1b1c1c]">Email Addresses:</strong> Collected when you subscribe to our newsletter or register a staff account. Used strictly to deliver recipe digests, sourdough workshops, and culinary updates.
                </li>
                <li>
                  <strong className="text-[#1b1c1c]">Saved Recipe State:</strong> Stored locally on your browser to ensure your offline recipe box remains accessible across sessions.
                </li>
                <li>
                  <strong className="text-[#1b1c1c]">Analytics &amp; Usage:</strong> Aggregate data regarding popular categories (e.g., Sourdough, Air Fryer, Kenyan Recipes) to help Chef Achieng refine upcoming meal guides.
                </li>
              </ul>

              <h3 className="font-bold text-base text-[#1b1c1c] pt-2">
                2. Newsletter Subscriptions &amp; Unsubscribing
              </h3>
              <p>
                Every email sent from Dala Kitchen contains a direct 1-click unsubscribe link. You may also request total deletion of your email record by contacting <span className="font-mono text-[#24331e] font-bold">privacy@dalakitchen.com</span>.
              </p>

              <h3 className="font-bold text-base text-[#1b1c1c] pt-2">
                3. Third-Party Sharing &amp; Media
              </h3>
              <p>
                We never sell, rent, or commercialize your contact information to third-party marketers or data brokers. Embedded YouTube videos adhere to standard YouTube privacy enhanced mode.
              </p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <h2 className="font-serif font-bold text-2xl text-[#1b1c1c] border-b border-gray-100 pb-3">
                Terms of Service &amp; Recipe Licensing
              </h2>
              <p>
                Welcome to Dala Kitchen. By accessing or using our website, culinary guides, video masterclasses, or recipes, you agree to be bound by these Terms of Service.
              </p>

              <h3 className="font-bold text-base text-[#1b1c1c] pt-2">
                1. Intellectual Property &amp; Content Rights
              </h3>
              <p>
                All recipe formulation, high-resolution food photography, video guides, and literary blog content on Dala Kitchen are the sole property of Chef Achieng and Dala Kitchen. You are granted a non-exclusive license for personal, non-commercial home cooking. Commercial syndication or republication without express written permission is strictly prohibited.
              </p>

              <h3 className="font-bold text-base text-[#1b1c1c] pt-2">
                2. Dietary &amp; Nutritional Information Disclaimer
              </h3>
              <p>
                Nutritional values provided in recipes (calories, macros, dietary tags) are estimations generated using standard ingredient database calculators. Home cooks with severe medical allergies or gluten sensitivities should independently verify ingredient suitability.
              </p>

              <h3 className="font-bold text-base text-[#1b1c1c] pt-2">
                3. User Submissions &amp; Reviews
              </h3>
              <p>
                Comments or recipe reviews submitted by readers must be respectful and free of offensive language. Dala Kitchen staff reserves the right to moderate or remove abusive submissions.
              </p>
            </div>
          )}

          {activeTab === 'cookies' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <h2 className="font-serif font-bold text-2xl text-[#1b1c1c] border-b border-gray-100 pb-3">
                Cookie Policy &amp; Browser Storage
              </h2>
              <p>
                Dala Kitchen utilizes cookies and browser local storage technology to deliver a seamless, personalized culinary experience without requiring invasive tracker scripts.
              </p>

              <h3 className="font-bold text-base text-[#1b1c1c] pt-2">
                1. Types of Storage We Utilize
              </h3>
              <div className="space-y-3">
                <div className="p-4 bg-[#f8f6f3] rounded-2xl border border-[#e6e2dc]">
                  <p className="font-bold text-[#1b1c1c]">Essential Local Storage</p>
                  <p className="text-gray-600 mt-1 text-xs">
                    Saves your saved recipes list, admin auth token, and theme preferences directly in your web browser.
                  </p>
                </div>
                <div className="p-4 bg-[#f8f6f3] rounded-2xl border border-[#e6e2dc]">
                  <p className="font-bold text-[#1b1c1c]">Performance &amp; Analytics Cookies</p>
                  <p className="text-gray-600 mt-1 text-xs">
                    Monitors website loading speeds, recipe views, and popular search terms so we can fix bugs and create content you enjoy.
                  </p>
                </div>
              </div>

              <h3 className="font-bold text-base text-[#1b1c1c] pt-2">
                2. Managing Cookie Preferences
              </h3>
              <p>
                You can clear or block cookies at any time through your browser settings. Note that disabling local storage may affect your ability to save recipes offline or maintain staff login state.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
