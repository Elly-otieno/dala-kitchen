import React from 'react';
import { motion } from 'motion/react';
import { CATEGORIES } from '../data/recipesData';
import { RecipeCategory, Recipe, SiteSettings } from '../types';

interface CategoryRowProps {
  selectedCategory: RecipeCategory | null;
  onSelectCategory: (category: RecipeCategory | null) => void;
  recipes?: Recipe[];
  siteSettings?: SiteSettings;
}

export const CategoryRow: React.FC<CategoryRowProps> = ({
  selectedCategory,
  onSelectCategory,
  recipes,
  siteSettings,
}) => {
  // Filter categories based on backend site settings and hide categories with 0 recipes
  const activeCategories = React.useMemo(() => {
    let list = CATEGORIES;
    if (siteSettings?.selectedCategories && siteSettings.selectedCategories.length > 0) {
      const allowed = new Set(siteSettings.selectedCategories.map((c) => c.toLowerCase()));
      list = CATEGORIES.filter((cat) => allowed.has(cat.name.toLowerCase()));
    }

    // Ensure only categories with at least 1 listed non-draft/non-archived recipe appear
    if (recipes && recipes.length > 0) {
      list = list.filter((cat) => {
        const count = recipes.filter(
          (r) => !r.archived && !r.draft && r.category?.toLowerCase() === cat.name?.toLowerCase()
        ).length;
        return count > 0;
      });
    }

    return list;
  }, [siteSettings?.selectedCategories, recipes]);

  return (
    <section className="py-12 border-b border-gray-200 bg-dala-cream overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-between overflow-x-auto pb-4 gap-4 sm:gap-6 hide-scrollbar"
        >
          {activeCategories.map((cat, idx) => {
            const isSelected = selectedCategory === cat.name;
            // Compute dynamic live recipe count from backend recipes state
            const dynamicCount = recipes
              ? recipes.filter(
                  (r) => !r.archived && !r.draft && r.category?.toLowerCase() === cat.name?.toLowerCase()
                ).length
              : null;

            const countText =
              dynamicCount !== null
                ? `${dynamicCount} ${dynamicCount === 1 ? 'recipe' : 'recipes'}`
                : cat.count;

            return (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05, ease: 'easeOut' }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelectCategory(isSelected ? null : cat.name)}
                className="flex flex-col items-center group min-w-[100px] flex-shrink-0 cursor-pointer focus:outline-none"
              >
                <div
                  className={`w-20 h-20 rounded-full overflow-hidden mb-3 border-2 transition-all duration-300 ${
                    isSelected
                      ? 'border-dala-green ring-4 ring-dala-green/20 scale-105 shadow-md'
                      : 'border-transparent group-hover:border-dala-green group-hover:scale-105 shadow-2xs'
                  }`}
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <span
                  className={`font-semibold text-xs uppercase tracking-wide transition-colors ${
                    isSelected ? 'text-dala-green font-bold' : 'text-dala-text group-hover:text-dala-green'
                  }`}
                >
                  {cat.name}
                </span>
                <span className="text-[10px] text-dala-text-light font-medium mt-0.5">
                  {countText}
                </span>
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
