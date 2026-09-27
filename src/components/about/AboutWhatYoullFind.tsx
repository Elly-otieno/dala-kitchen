import React from 'react';
import { Utensils, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface AboutWhatYoullFindProps {
  onExploreRecipes?: () => void;
}

export const AboutWhatYoullFind: React.FC<AboutWhatYoullFindProps> = ({ onExploreRecipes }) => {
  return (
    <section className="bg-white/60 py-16 sm:py-20 border-t border-gray-200/80">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-dala-text mb-2 uppercase tracking-wide">
            What You'll Find Here
          </h2>
          <p className="text-xs sm:text-sm text-dala-text-light font-medium">
            A collection of recipes for every occasion and skill level.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[200px] sm:auto-rows-[220px]">
          {/* Bento Item 1 (Large 2x2) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.01 }}
            onClick={onExploreRecipes}
            className="md:col-span-2 md:row-span-2 rounded-none overflow-hidden relative group cursor-pointer shadow-xs min-h-[280px]"
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAf3tsjnLN9Qb4aw-mw3YwiiQCq36OmQQmVj0HE_Xf_VkBjXdAJ1oRN40Y4TUFf3_-KNfdII3nRm1SsdcHGxmY95KyagigmzwXiA8ZKzPrGnDguLUslMgAptClP-8JEHvnkq3i-TU-llzlTvAKIv4fGpQxA1CEtzdkdX6_5TE00ZAvG9pMgEccFmd4bPd-tsyPDAelDOuo6xmGtqXo7vsEVdUcNXd-XiVmZFovcFRb-OJ6pwwpBwbak"
              alt="Artisan Sourdough Bread"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 sm:p-8">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-200 mb-2 block">
                ARTISAN
              </span>
              <h3 className="font-serif font-bold text-2xl sm:text-3xl text-white">
                Sourdough Baking
              </h3>
            </div>
          </motion.div>

          {/* Bento Item 2 (Wide 2x1) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.01 }}
            onClick={onExploreRecipes}
            className="md:col-span-2 rounded-none overflow-hidden relative group cursor-pointer shadow-xs"
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCyjOcaRyp3YITM__oUho5tOD_mb7RCDHQUrZvu2T4Hrh-ccwnf5hFSrElMqswpJ1WD_MHxzm6rFPpiEmhkHkgZkpiDBjNpC4R4qtz5ST4k1GvUnLD4HgaDgqHFRs98gnV76UNOEqrn_siZQxAbDT8qRstAQNyOBHZQ51SaYIk3p0kHwusbsGyyEwHvD62Tx3RhHMkSALSTWKL6Q5xybPpwvRxIe-Cy0GhkskuvfB4IdtuG2n3kh0_9"
              alt="Kenyan Flavors Spread"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6">
              <h3 className="font-serif font-bold text-xl sm:text-2xl text-white">
                Kenyan Flavors
              </h3>
            </div>
          </motion.div>

          {/* Bento Item 3 (Everyday Meals Block) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.01 }}
            onClick={onExploreRecipes}
            className="rounded-none overflow-hidden relative group bg-dala-green text-white p-6 flex flex-col justify-end cursor-pointer shadow-xs hover:bg-dala-green-dark transition-colors"
          >
            <div className="absolute top-6 right-6 opacity-25">
              <Utensils size={44} />
            </div>
            <h3 className="font-serif font-bold text-xl z-10">Everyday Meals</h3>
            <p className="text-xs text-white/80 mt-1 z-10">Quick &amp; simple dinners.</p>
          </motion.div>

          {/* Bento Item 4 (Air Fryer) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.01 }}
            onClick={onExploreRecipes}
            className="rounded-none overflow-hidden relative group cursor-pointer shadow-xs"
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-sRIf63bwvM9mmOEoFNIOthL-iu8hDVmOcOrWJpGvL3eRBP9rEfr1ZWaB78uTrm4pK24LDqY8OJlcrxyZqknyKGbq9HCWl5px478RL9rGa4U2eR48y1TDqlS4-W-WOHlHI5SfRY_IGAdCq9qdp4it7Fe4QisKIAmE8vag0qyOg4ZYahBy7uDh8MTtafst5_APKX9nPIwjUZZ_T9sVGHTcEB0AhVZnkVd5jigoRVqBOxxCNrLuzFOG"
              alt="Air Fryer Cooking"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6">
              <h3 className="font-serif font-bold text-xl text-white">Air Fryer</h3>
            </div>
          </motion.div>
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onExploreRecipes}
            className="inline-flex items-center gap-2 bg-dala-text text-white font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-none hover:bg-black transition-colors shadow-xs cursor-pointer"
          >
            Explore All Recipes <ArrowRight size={16} />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};
