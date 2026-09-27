import React from 'react';
import { motion } from 'motion/react';
import { AboutHero } from '../components/about/AboutHero';
import { AboutMeaningOfDala } from '../components/about/AboutMeaningOfDala';
import { AboutKitchenPhilosophy } from '../components/about/AboutKitchenPhilosophy';
import { AboutWhatYoullFind } from '../components/about/AboutWhatYoullFind';
import { SiteSettings } from '../types';

interface AboutViewProps {
  onExploreRecipes?: () => void;
  siteSettings?: SiteSettings;
}

export const AboutView: React.FC<AboutViewProps> = ({ onExploreRecipes, siteSettings }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-dala-cream min-h-screen"
    >
      {/* Hero Section */}
      <AboutHero siteSettings={siteSettings} />

      {/* The Meaning of Dala Section */}
      <AboutMeaningOfDala />

      {/* Kitchen Philosophy Section */}
      <AboutKitchenPhilosophy />

      {/* Bento Grid: What You'll Find Here */}
      <AboutWhatYoullFind onExploreRecipes={onExploreRecipes} />
    </motion.div>
  );
};
