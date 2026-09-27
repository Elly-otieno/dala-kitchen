import React from 'react';
import { Play } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroSectionProps {
  onBrowseRecipes: () => void;
  onWatchYoutube: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onBrowseRecipes,
  onWatchYoutube,
}) => {
  return (
    <section className="relative h-[550px] sm:h-[600px] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <motion.div
        initial={{ scale: 1.08, opacity: 0.8 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 z-0"
      >
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdGehtO_QCyx41U3i5ZZ_zpcKbZ2bOTUh9rISDCXnU3jrcvNGB6UH6NTPUwxm2LJ8jkpDMYhlPwHYiuskG0QTuSIGgh8Uh4fVmH3Pjg8y1xAa2hsWx43wK4QCoKgWQsrcaj5GUFrIGMNwBTOVQoxYMUwGgQ6-3sgCKebbRfElvoeGnc1a3lu5-2ytvceldQs0dNQ6fWSO5RM_OWUFt9icBs60gR5RSnoc5B9y2-A7Sb9eSwKwacMGfPndrlKexeZY7TQ"
          alt="Fresh Sourdough Bread on a cooling rack"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-white/75 sm:bg-gradient-to-r sm:from-white/95 sm:via-white/70 sm:to-transparent"></div>
      </motion.div>

      {/* Hero Content Container */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl"
        >
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-[#24331e]/10 text-dala-green text-xs font-bold uppercase tracking-wider rounded-full mb-4"
          >
            <span className="w-2 h-2 rounded-full bg-dala-green animate-pulse"></span>
            From Scratch &amp; Tested with Love
          </motion.div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-dala-text leading-[1.15] mb-6 tracking-tight">
            The Science of Scratch,
            <br />
            The Soul of Home.{' '}
            <motion.i
              initial={{ rotate: -20, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.7, type: 'spring', stiffness: 200 }}
              className="fa-solid fa-leaf text-dala-green text-2xl sm:text-3xl inline-block ml-1"
            ></motion.i>
          </h1>
          <p className="text-base sm:text-lg text-dala-text-light mb-8 sm:mb-10 leading-relaxed max-w-lg">
            Wholesome recipes made from real ingredients, tested with love, served with joy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button
              whileHover={{ scale: 1.025, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={onBrowseRecipes}
              className="bg-dala-green text-white px-8 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider hover:bg-dala-green-dark transition-colors duration-300 rounded-xs shadow-sm hover:shadow-md cursor-pointer"
            >
              Browse Recipes
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.025, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={onWatchYoutube}
              className="border border-gray-300 bg-white/90 backdrop-blur-xs text-dala-text px-8 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider hover:bg-white hover:border-dala-green flex items-center justify-center gap-2.5 transition-colors duration-300 rounded-xs cursor-pointer shadow-2xs"
            >
              <Play size={16} className="text-dala-green fill-dala-green" /> Watch on YouTube
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
