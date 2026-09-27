import React, { useState } from 'react';
import { Play, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CallToActionsBannerProps {
  onOpenYoutube: () => void;
  onSubscribeSubmit?: (email: string) => void;
}

export const CallToActionsBanner: React.FC<CallToActionsBannerProps> = ({
  onOpenYoutube,
  onSubscribeSubmit,
}) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    if (onSubscribeSubmit) {
      onSubscribeSubmit(email);
    }
    setSubmitted(true);
    setTimeout(() => {
      setEmail('');
      setSubmitted(false);
    }, 4000);
  };

  return (
    <section className="max-w-7xl mx-auto px-6 sm:px-8 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
      {/* YouTube Promo */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-30px' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -3 }}
        className="bg-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between border border-gray-100 shadow-2xs hover:shadow-md transition-shadow duration-300 rounded-xs"
      >
        <div className="pr-0 sm:pr-6 mb-6 sm:mb-0 w-full sm:w-auto">
          <h3 className="text-2xl font-serif font-bold text-dala-text mb-2">
            New videos every week!
          </h3>
          <p className="text-dala-text-light text-xs sm:text-sm mb-6 max-w-xs leading-relaxed">
            Easy, delicious and practical recipes for everyday home cooks.
          </p>
          <motion.button
            whileHover={{ scale: 1.025 }}
            whileTap={{ scale: 0.97 }}
            onClick={onOpenYoutube}
            className="bg-dala-green text-white px-6 py-2.5 text-xs font-semibold uppercase tracking-wider hover:bg-dala-green-dark transition-colors duration-300 flex items-center justify-center gap-2 rounded-xs shadow-2xs cursor-pointer"
          >
            <Play size={14} className="fill-white" /> Visit our YouTube channel
          </motion.button>
        </div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          onClick={onOpenYoutube}
          className="w-48 h-32 bg-gray-200 relative overflow-hidden rounded-xs shadow-inner flex-shrink-0 cursor-pointer group"
        >
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxPmDxYWVo8DLfPcz1jkTN0MnGpZKABfGtdH7W80cfUliSNRTaengET5QAiMAgJ9ProIEN1h30gy81t58S9OAUvOhqxK8vd5ltNoRbvLGv_hgcxtgnh3hZYxJKIG0IdRuemNPruCgyDVA9vT0NYNWEWrMFS6EQlQmT5wve_As1mVEhQURhVOrU85xOsQIxbWBZk2FlttvCx4FNhZ3cnswqP88QXSCZpkEsfqnzSSfTV6JTfInPWk3P"
            alt="Video thumbnail"
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition-colors flex items-center justify-center">
            <motion.i
              whileHover={{ scale: 1.2 }}
              className="fa-brands fa-youtube text-red-600 text-4xl transition-transform"
            ></motion.i>
          </div>
        </motion.div>
      </motion.div>

      {/* Newsletter Signup */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-30px' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -3 }}
        className="bg-[#f0ebe1] p-6 sm:p-8 flex items-center justify-between shadow-2xs hover:shadow-md transition-shadow duration-300 rounded-xs relative"
      >
        <div className="w-full max-w-sm">
          <h3 className="text-2xl font-serif font-bold text-dala-text mb-2">
            Let's stay in touch!
          </h3>
          <p className="text-dala-text-light text-xs sm:text-sm mb-6 leading-relaxed">
            Subscribe to get our latest recipes, tips and kitchen inspiration.
          </p>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white p-3 rounded-xs text-dala-green text-xs font-bold flex items-center gap-2 border border-dala-green/20 shadow-xs"
              >
                <Check size={16} className="text-dala-green" /> Welcome to Dala Kitchen! Check your inbox soon.
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="flex w-full bg-white p-1 rounded-xs shadow-2xs"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full px-3 py-2 text-xs sm:text-sm border-none focus:ring-0 focus:outline-none bg-transparent text-dala-text"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="bg-dala-gold text-white px-5 sm:px-6 py-2 text-xs font-bold uppercase tracking-wider hover:bg-yellow-600 transition whitespace-nowrap rounded-xs cursor-pointer shadow-2xs"
                >
                  Subscribe
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Decorative Seal Badge */}
        <motion.div
          animate={{ rotate: [0, 3, 0, -3, 0] }}
          transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
          className="hidden sm:block ml-6 flex-shrink-0"
        >
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnuKPkuL6wpp3gv4oOVZ9-B-2OSKbudS17yFnQMQm1GNrWuJPVtbdEPviHhYpUKKR7RDJ4oBZhhrUjIjSBxMVtUmgIYmsd_CcPUtBMjn4u_U9ja5Hv4ewrzET6KlmkwTXTSkSjTcmAs211O2bpbLwaB4v_pP5jp6LCakCDIXk6ROgTCU6ZdrwGYX2Xk39zRoMEh-dTHNzQyggWi8I1skjSDTvTmGxvwyEjvEuluIZzHtU9pXrmVAeZvwIM_0Goe-G4NA"
            alt="Made with Real Ingredients"
            className="w-24 h-24 object-contain opacity-90"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};
