import React from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { SiteSettings } from '../../types';

interface AboutHeroProps {
  siteSettings?: SiteSettings;
}

export const AboutHero: React.FC<AboutHeroProps> = ({ siteSettings }) => {
  const chefImage = siteSettings?.chefPhoto || '/images/achieng.png';

  return (
    <section className="max-w-7xl mx-auto px-6 sm:px-8 py-12 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      {/* Left Column: Text & Story */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="order-2 md:order-1 flex flex-col gap-6 pr-0 md:pr-8"
      >
        <div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-dala-text uppercase mb-2">
            About Achieng
          </h1>
          <div className="font-signature text-2xl sm:text-3xl text-dala-green italic">
            The heart behind the kitchen.
          </div>
        </div>

        <div className="text-dala-text-light text-sm sm:text-base leading-relaxed space-y-4 font-sans">
          <p>
            I'm Achieng, a home cook, recipe developer, and content creator passionate about turning simple, real ingredients into wholesome meals that bring families together.
          </p>
          <p>
            Here at DalaKitchen, I share tested-from-scratch recipes, kitchen tips, and inspiration to help you cook with confidence and love. My journey started in my grandmother's kitchen, where I learned that the best flavors come from patience, intuition, and a willingness to get a little messy.
          </p>
        </div>

        <div className="pt-2 flex items-center gap-2">
          <span className="font-signature text-4xl sm:text-5xl text-dala-green">Achieng</span>
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Heart className="w-6 h-6 text-dala-green fill-dala-green/20" />
          </motion.div>
        </div>
      </motion.div>

      {/* Right Column: High Quality Portrait */}
      <motion.div
        initial={{ opacity: 0, x: 20, scale: 0.96 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="order-1 md:order-2"
      >
        <div className="relative rounded-none overflow-hidden shadow-md border border-gray-200/80 w-full aspect-[4/5] md:aspect-square bg-gray-100 group">
          <img
            src={chefImage}
            alt="Portrait of Chef Achieng in her kitchen"
            className="w-full h-full object-cover transform group-hover:scale-103 transition-transform duration-700"
          />
        </div>
      </motion.div>
    </section>
  );
};
