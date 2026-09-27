import React from 'react';
import { Heart, Utensils, Home } from 'lucide-react';
import { motion } from 'motion/react';
import { SiteSettings } from '../types';

interface AboutAchiengSectionProps {
  siteSettings?: SiteSettings;
}

export const AboutAchiengSection: React.FC<AboutAchiengSectionProps> = ({ siteSettings }) => {
  const chefImage = siteSettings?.chefPhoto || '/images/achieng.png';

  const features = [
    {
      icon: <Utensils size={20} />,
      title: 'Scratch Made',
      desc: 'Real ingredients, no shortcuts.',
    },
    {
      icon: <Heart size={20} />,
      title: 'Tested & Loved',
      desc: 'Every recipe is tried, tested and family-approved.',
    },
    {
      icon: <Home size={20} />,
      title: 'Wholesome & Practical',
      desc: 'Recipes that fit real life and real kitchens.',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 sm:px-8 py-16 grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12 border-t border-gray-200 items-stretch bg-dala-cream overflow-hidden">
      {/* Column 1: Portrait Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="col-span-1 h-full min-h-[380px] overflow-hidden group shadow-sm hover:shadow-md transition-shadow duration-300"
      >
        <img
          src={chefImage}
          alt="Portrait of Chef Achieng"
          className="w-full h-full object-cover rounded-none group-hover:scale-104 transition-transform duration-700 ease-out min-h-[380px]"
        />
      </motion.div>

      {/* Column 2: Bio Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="col-span-1 flex flex-col justify-center"
      >
        <h2 className="text-3xl font-serif font-bold text-dala-text mb-6 flex items-center gap-3">
          About Achieng{' '}
          <motion.i
            initial={{ rotate: -15 }}
            whileInView={{ rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', delay: 0.3 }}
            className="fa-solid fa-leaf text-dala-green text-xl"
          ></motion.i>
        </h2>
        <p className="text-dala-text-light mb-4 leading-relaxed text-sm sm:text-base">
          I'm Achieng, a home cook, recipe developer and content creator passionate about turning simple, real ingredients into wholesome meals that bring families together.
        </p>
        <p className="text-dala-text-light mb-8 leading-relaxed text-sm sm:text-base">
          Here at DalaKitchen, I share tested-from-scratch recipes, kitchen tips and inspiration to help you cook with confidence and love.
        </p>
        <div className="flex items-end gap-2 text-dala-green mt-auto">
          <span className="font-signature text-5xl sm:text-6xl select-none">Achieng</span>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          >
            <Heart size={22} className="text-dala-green mb-3 fill-dala-green/20" />
          </motion.div>
        </div>
      </motion.div>

      {/* Column 3: Features */}
      <div className="col-span-1 flex flex-col justify-center gap-8 pl-0 lg:pl-4">
        {features.map((feat, idx) => (
          <motion.div
            key={feat.title}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5, delay: idx * 0.15, ease: 'easeOut' }}
            whileHover={{ x: 4 }}
            className="flex items-start gap-4 group cursor-default"
          >
            <div className="w-12 h-12 rounded-full border border-dala-green flex items-center justify-center flex-shrink-0 text-dala-green bg-white shadow-2xs group-hover:bg-dala-green group-hover:text-white transition-colors duration-300">
              {feat.icon}
            </div>
            <div>
              <h4 className="font-serif font-bold text-lg text-dala-text mb-1 group-hover:text-dala-green transition-colors">
                {feat.title}
              </h4>
              <p className="text-sm text-dala-text-light">
                {feat.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
