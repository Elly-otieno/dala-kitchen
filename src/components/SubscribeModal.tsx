import React, { useState, useEffect, useRef } from 'react';
import { X, Mail, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe?: (email: string, name?: string) => void;
  initialEmail?: string;
}

export const SubscribeModal: React.FC<SubscribeModalProps> = ({
  isOpen,
  onClose,
  onSubscribe,
  initialEmail = '',
}) => {
  const [email, setEmail] = useState(initialEmail);
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
      setEmail(initialEmail);
      setName('');
      setTimeout(() => {
        if (nameInputRef.current) {
          nameInputRef.current.focus();
        }
      }, 100);
    }
  }, [isOpen, initialEmail]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    if (onSubscribe) {
      onSubscribe(email.trim(), name.trim());
    }
    setSubmitted(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#f0ebe1] w-full max-w-lg rounded-xs shadow-2xl border border-gray-200 overflow-hidden relative p-6 sm:p-8"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-full text-gray-500 hover:bg-gray-200/60 transition-colors cursor-pointer"
            >
              <X size={20} />
            </motion.button>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="w-16 h-16 bg-dala-green text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm"
                >
                  <Check size={32} />
                </motion.div>
                <h3 className="text-2xl font-serif font-bold text-dala-text mb-2">
                  Welcome to Dala Kitchen!
                </h3>
                <p className="text-sm text-dala-text-light mb-6">
                  Thank you {name ? name : ''}! We've sent a special welcome gift &amp; our top 5 scratch recipe guide directly to <strong>{email}</strong>.
                </p>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onClose}
                  className="bg-dala-green text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xs hover:bg-dala-green-dark transition-colors cursor-pointer"
                >
                  Back to Kitchen
                </motion.button>
              </motion.div>
            ) : (
              <div>
                <div className="text-center mb-6">
                  <span className="font-signature text-3xl text-dala-green block -mb-1">
                    Achieng's Newsletter
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-dala-text mb-2">
                    Join 45,000+ Home Cooks
                  </h3>
                  <p className="text-xs sm:text-sm text-dala-text-light leading-relaxed">
                    Get weekly tested-from-scratch recipes, sourdough fermentation tips, and exclusive Swahili family classics delivered straight to your inbox.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-dala-text mb-1">
                      Your First Name
                    </label>
                    <input
                      ref={nameInputRef}
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sarah"
                      className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xs focus:ring-1 focus:ring-dala-green focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-dala-text mb-1">
                      Your Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. sarah@example.com"
                      className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xs focus:ring-1 focus:ring-dala-green focus:outline-none"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full bg-dala-gold text-white py-3 text-xs font-bold uppercase tracking-widest hover:bg-yellow-600 transition duration-300 rounded-xs shadow-2xs cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Mail size={16} /> Get Free Weekly Recipes
                  </motion.button>
                </form>

                <p className="text-[10px] text-center text-gray-500 mt-4">
                  We respect your privacy. Zero spam, unsubscribe anytime in 1 click.
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
