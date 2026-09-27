import React from 'react';
import { motion } from 'motion/react';

export const AboutMeaningOfDala: React.FC = () => {
  return (
    <section className="bg-white/80 py-16 sm:py-20 border-y border-gray-200/80">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-4xl mx-auto px-6 sm:px-8 text-center flex flex-col items-center"
      >
        <span className="text-[11px] font-bold uppercase tracking-widest text-dala-green mb-3 block">
          THE ROOTS
        </span>
        
        <h2 className="text-2xl sm:text-4xl font-serif font-bold text-dala-text mb-6 tracking-wide">
          The Meaning of "Dala"
        </h2>
        
        <p className="text-base sm:text-xl font-serif italic text-dala-text-light leading-relaxed mb-8 max-w-3xl">
          "Dala means home. It represents more than just a physical space; it's a feeling of belonging, comfort, and nourishment. DalaKitchen is an extension of that feeling, offering recipes that feel like a warm embrace."
        </p>
        
        <div className="w-16 h-px bg-gray-300"></div>
      </motion.div>
    </section>
  );
};
