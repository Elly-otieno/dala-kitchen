import React, { useState } from 'react';
import { X, ShieldCheck, FileText, Cookie, Printer, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type PolicyTab = 'privacy' | 'terms' | 'cookies';

interface LegalPoliciesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: PolicyTab;
}

export const LegalPoliciesModal: React.FC<LegalPoliciesModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'privacy',
}) => {
  const [activeTab, setActiveTab] = useState<PolicyTab>(initialTab);

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
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl border border-[#e6e2dc] max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden"
          >
            {/* Header Bar */}
            <div className="p-6 bg-[#f8f6f3] border-b border-[#e6e2dc] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#24331e] text-white flex items-center justify-center">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h2 className="font-serif font-bold text-xl text-[#1b1c1c] uppercase tracking-wide">
                    Dala Kitchen Legal Center
                  </h2>
                  <p className="text-xs text-[#666666]">
                    Last updated: August 2026 • Effective for all global readers &amp; subscribers
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePrint}
                  className="p-2 text-gray-500 hover:text-black hover:bg-[#eae6e1] rounded-lg transition-colors cursor-pointer hidden sm:flex items-center gap-1.5 text-xs font-semibold"
                  title="Print Policy"
                >
                  <Printer size={16} /> Print
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-black hover:bg-[#eae6e1] rounded-lg transition-colors cursor-pointer"
                >
                  <X size={20} />
                </motion.button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-[#e6e2dc] bg-white px-6">
              <button
                onClick={() => setActiveTab('privacy')}
                className={`py-3.5 px-4 font-bold text-xs flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'privacy'
                    ? 'border-[#24331e] text-[#24331e]'
                    : 'border-transparent text-gray-500 hover:text-[#1b1c1c]'
                }`}
              >
                <ShieldCheck size={16} /> Privacy Policy
              </button>
              <button
                onClick={() => setActiveTab('terms')}
                className={`py-3.5 px-4 font-bold text-xs flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'terms'
                    ? 'border-[#24331e] text-[#24331e]'
                    : 'border-transparent text-gray-500 hover:text-[#1b1c1c]'
                }`}
              >
                <FileText size={16} /> Terms of Service
              </button>
              <button
                onClick={() => setActiveTab('cookies')}
                className={`py-3.5 px-4 font-bold text-xs flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'cookies'
                    ? 'border-[#24331e] text-[#24331e]'
                    : 'border-transparent text-gray-500 hover:text-[#1b1c1c]'
                }`}
              >
                <Cookie size={16} /> Cookie Policy
              </button>
            </div>

            {/* Scrollable Document Content */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs text-[#2d2d2d] leading-relaxed font-sans">
              <AnimatePresence mode="wait">
                {activeTab === 'privacy' && (
                  <motion.div
                    key="privacy"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <h3 className="font-serif font-bold text-lg text-[#1b1c1c]">
                      1. Privacy Policy &amp; Data Protection Overview
                    </h3>
                    <p>
                      At Dala Kitchen ("we", "our", or "us"), led by Chef Achieng, we hold the trust of our cooking community in highest regard. This Privacy Policy outlines how your personal information is collected, used, and safeguarded when you visit our website, subscribe to our newsletter broadcasts, or save recipe bookmarks.
                    </p>

                    <h4 className="font-bold text-sm text-[#1b1c1c] pt-2">
                      2. Data We Collect &amp; How We Use It
                    </h4>
                    <ul className="list-disc pl-5 space-y-1.5 text-gray-700">
                      <li>
                        <strong className="text-[#1b1c1c]">Email Addresses:</strong> Collected when you subscribe to our newsletter or create a staff account. Used strictly to deliver recipe digests, sourdough workshops, and culinary updates.
                      </li>
                      <li>
                        <strong className="text-[#1b1c1c]">Saved Recipe State:</strong> Stored locally on your device to ensure your offline recipe box remains accessible across sessions.
                      </li>
                      <li>
                        <strong className="text-[#1b1c1c]">Analytics &amp; Usage:</strong> Aggregate data regarding popular categories (e.g., Sourdough, Air Fryer, Kenyan Recipes) to help Chef Achieng refine upcoming meal guides.
                      </li>
                    </ul>

                    <h4 className="font-bold text-sm text-[#1b1c1c] pt-2">
                      3. Newsletter Subscriptions &amp; Unsubscribing
                    </h4>
                    <p>
                      Every email sent from Dala Kitchen contains a direct 1-click unsubscribe link. You may also request total deletion of your email record by contacting <span className="font-mono text-[#24331e] font-bold">privacy@dalakitchen.com</span> or managing your preferences in our subscriber portal.
                    </p>

                    <h4 className="font-bold text-sm text-[#1b1c1c] pt-2">
                      4. Third-Party Sharing
                    </h4>
                    <p>
                      We never sell, rent, or commercialize your contact information to third-party marketers or data brokers. Embedded YouTube videos adhere to standard YouTube privacy mode.
                    </p>
                  </motion.div>
                )}

                {activeTab === 'terms' && (
                  <motion.div
                    key="terms"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <h3 className="font-serif font-bold text-lg text-[#1b1c1c]">
                      1. Terms of Service &amp; Recipe Licensing
                    </h3>
                    <p>
                      Welcome to Dala Kitchen. By accessing or using our website, culinary guides, video masterclasses, or recipes, you agree to be bound by these Terms of Service.
                    </p>

                    <h4 className="font-bold text-sm text-[#1b1c1c] pt-2">
                      2. Intellectual Property &amp; Intellectual Rights
                    </h4>
                    <p>
                      All recipe formulation, high-resolution food photography, video guides, and literary blog content on Dala Kitchen are the sole property of Chef Achieng and Dala Kitchen. You are granted a non-exclusive license for personal, non-commercial home cooking. Commercial syndication or republication without express written permission is strictly prohibited.
                    </p>

                    <h4 className="font-bold text-sm text-[#1b1c1c] pt-2">
                      3. Dietary &amp; Nutritional Information Disclaimer
                    </h4>
                    <p>
                      Nutritional values provided in recipes (calories, macros, dietary tags) are estimations generated using standard ingredient database calculators. Home cooks with severe medical allergies or gluten sensitivities should independently verify ingredient suitability.
                    </p>

                    <h4 className="font-bold text-sm text-[#1b1c1c] pt-2">
                      4. User Submissions &amp; Reviews
                    </h4>
                    <p>
                      Comments or recipe reviews submitted by readers must be respectful and free of offensive language. Dala Kitchen staff reserves the right to moderate or remove abusive submissions.
                    </p>
                  </motion.div>
                )}

                {activeTab === 'cookies' && (
                  <motion.div
                    key="cookies"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <h3 className="font-serif font-bold text-lg text-[#1b1c1c]">
                      1. Cookie Policy &amp; Browser Storage
                    </h3>
                    <p>
                      Dala Kitchen utilizes cookies and browser local storage technology to deliver a seamless, personalized culinary experience without requiring invasive tracker scripts.
                    </p>

                    <h4 className="font-bold text-sm text-[#1b1c1c] pt-2">
                      2. Types of Storage We Utilize
                    </h4>
                    <div className="space-y-2">
                      <div className="p-3 bg-[#f8f6f3] rounded-xl border border-[#e6e2dc]">
                        <p className="font-bold text-[#1b1c1c]">Essential Local Storage</p>
                        <p className="text-gray-600 mt-0.5">
                          Saves your saved recipes list, admin auth token, and theme preferences directly in your web browser.
                        </p>
                      </div>
                      <div className="p-3 bg-[#f8f6f3] rounded-xl border border-[#e6e2dc]">
                        <p className="font-bold text-[#1b1c1c]">Performance &amp; Analytics Cookies</p>
                        <p className="text-gray-600 mt-0.5">
                          Monitors website loading speeds, recipe views, and popular search terms so we can fix bugs and create content you enjoy.
                        </p>
                      </div>
                    </div>

                    <h4 className="font-bold text-sm text-[#1b1c1c] pt-2">
                      3. Managing Cookie Preferences
                    </h4>
                    <p>
                      You can clear or block cookies at any time through your browser settings. Note that disabling local storage may affect your ability to save recipes offline or maintain staff login state.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="p-4 bg-[#f8f6f3] border-t border-[#e6e2dc] flex items-center justify-between text-xs">
              <span className="text-gray-500 font-medium flex items-center gap-1">
                <CheckCircle size={14} className="text-emerald-700" /> Compliance Verified for 2026
              </span>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onClose}
                className="px-5 py-2 bg-[#1b1c1c] hover:bg-black text-white font-bold rounded-xl transition-colors cursor-pointer"
              >
                Close Window
              </motion.button>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
