import React, { useState } from 'react';
import { Mail, MapPin, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SiteSettings } from '../types';

interface ContactViewProps {
  onSendMessage?: (data: { name: string; email: string; subject: string; message: string }) => void;
  siteSettings?: SiteSettings;
}

export const ContactView: React.FC<ContactViewProps> = ({ onSendMessage, siteSettings }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const fbUrl = siteSettings?.facebookUrl || 'https://www.facebook.com/share/1BBMxx2UTw/';
  const igUrl = siteSettings?.instagramUrl || 'https://www.instagram.com/dala.kitchen?utm_source=qr&igsh=M21jcnQzbDZkYzJx';
  const ytUrl = siteSettings?.youtubeUrl || 'https://www.youtube.com/@quinn_Achieng';
  const pinUrl = siteSettings?.pinterestUrl || 'https://pinterest.com';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    if (onSendMessage) {
      onSendMessage(formData);
    }
    setSubmitted(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-[#f9f6f0] min-h-screen relative overflow-hidden"
    >
      <main className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24 relative z-10">
        {/* Top Text Section */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl mb-12"
        >
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-[#1f2937]">
            Let's Connect
          </h1>
          <p className="text-lg text-gray-600 mb-1">
            Have a question, suggestion or just want to say hello?
          </p>
          <p className="text-lg text-gray-600">I'd love to hear from you!</p>
        </motion.section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
          {/* Contact Form (Left) */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="submitted"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35 }}
                  className="bg-white p-8 rounded-none shadow-xs border border-gray-100 text-center py-12"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                    className="w-12 h-12 bg-[#3d4a31] text-white rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <Check size={24} />
                  </motion.div>
                  <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-gray-600 text-sm mb-6">
                    Thank you, <strong>{formData.name}</strong>. Your message has been sent to{' '}
                    <span className="text-[#3d4a31] font-semibold">hello@dalakitchen.com</span>. We will get back to you shortly!
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', subject: '', message: '' });
                    }}
                    className="bg-[#3d4a31] text-white px-6 py-2.5 text-xs font-bold uppercase tracking-widest rounded-none hover:opacity-90 transition-all cursor-pointer"
                  >
                    Send Another Message
                  </motion.button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <div>
                    <label className="sr-only" htmlFor="name">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Name"
                      className="w-full bg-white border border-gray-200 py-4 px-5 text-gray-700 placeholder-gray-400 focus:ring-1 focus:ring-[#3d4a31] shadow-xs rounded-none outline-none transition-shadow"
                    />
                  </div>

                  <div>
                    <label className="sr-only" htmlFor="email">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Email"
                      className="w-full bg-white border border-gray-200 py-4 px-5 text-gray-700 placeholder-gray-400 focus:ring-1 focus:ring-[#3d4a31] shadow-xs rounded-none outline-none transition-shadow"
                    />
                  </div>

                  <div>
                    <label className="sr-only" htmlFor="subject">
                      Subject
                    </label>
                    <input
                      id="subject"
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Subject"
                      className="w-full bg-white border border-gray-200 py-4 px-5 text-gray-700 placeholder-gray-400 focus:ring-1 focus:ring-[#3d4a31] shadow-xs rounded-none outline-none transition-shadow"
                    />
                  </div>

                  <div>
                    <label className="sr-only" htmlFor="message">
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Your Message"
                      className="w-full bg-white border border-gray-200 py-4 px-5 text-gray-700 placeholder-gray-400 focus:ring-1 focus:ring-[#3d4a31] shadow-xs rounded-none outline-none resize-none transition-shadow"
                    ></textarea>
                  </div>

                  <div>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      type="submit"
                      className="bg-[#3d4a31] text-white px-8 py-3.5 text-xs font-bold uppercase tracking-widest rounded-none hover:bg-opacity-90 transition-all w-full md:w-auto cursor-pointer shadow-xs"
                    >
                      Send Message
                    </motion.button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.section>

          {/* Contact Info (Right) */}
          <motion.section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col justify-between"
          >
            <div className="space-y-10 pl-0 md:pl-12 pt-2">
              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="text-gray-400 mt-1">
                  <Mail size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Email</h3>
                  <a
                    href="mailto:hello@dalakitchen.com"
                    className="text-gray-600 hover:text-[#3d4a31] transition-colors"
                  >
                    hello@dalakitchen.com
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-4">
                <div className="text-gray-400 mt-1">
                  <MapPin size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Location</h3>
                  <p className="text-gray-600">Kuwait</p>
                </div>
              </div>

              {/* Socials */}
              <div className="pt-4">
                <h3 className="font-bold text-gray-900 mb-4">Follow Me</h3>
                <div className="flex gap-4">
                  <motion.a
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    href={ytUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-[#1f2937] text-white rounded-full flex items-center justify-center hover:bg-opacity-80 transition-all"
                    aria-label="YouTube"
                  >
                    <i className="fa-brands fa-youtube"></i>
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    href={igUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-[#1f2937] text-white rounded-full flex items-center justify-center hover:bg-opacity-80 transition-all"
                    aria-label="Instagram"
                  >
                    <i className="fa-brands fa-instagram"></i>
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    href={pinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-[#1f2937] text-white rounded-full flex items-center justify-center hover:bg-opacity-80 transition-all"
                    aria-label="Pinterest"
                  >
                    <i className="fa-brands fa-pinterest-p"></i>
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    href={fbUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-[#1f2937] text-white rounded-full flex items-center justify-center hover:bg-opacity-80 transition-all"
                    aria-label="Facebook"
                  >
                    <i className="fa-brands fa-facebook-f"></i>
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.section>
        </div>

        {/* Decorative Image Bottom Right */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 0.8, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="absolute bottom-0 right-0 z-0 pointer-events-none w-full max-w-[400px] lg:max-w-[500px]"
        >
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDA-4dB2Ny-FHPHlbGrO92zNtR2_k04gou7u8gD_FoMdekXdHDZNsbDUEJR2f_TTiTLorJMDSrjCX5t1ZHTF7YqDIy4xq6HgUUAa2Dq8TQXMSwBTTDxO1UVBrrgH-gcSibL4tbtzO08mLbTpx3HlhMPmvwZKM52gczyj3DSjjmmoMVLFw0fOQaWYCefBeRj9nz-v4qnFHWOwgZbwoo0IzLCYiO3HLMIoAKOpCW8P-v50-dw1eMx5PUryJ5OIeguz9FB_w"
            alt="Kitchen utensils and ingredients"
            className="w-full h-auto object-cover object-left-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#f9f6f0] via-[#f9f6f0]/40 to-transparent"></div>
        </motion.div>
      </main>
    </motion.div>
  );
};
