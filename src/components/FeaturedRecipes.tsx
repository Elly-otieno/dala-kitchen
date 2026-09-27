import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Recipe } from '../types';
import { RecipeCard } from './RecipeCard';

interface FeaturedRecipesProps {
  recipes: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
  onViewAll: () => void;
  savedRecipeIds: string[];
  onToggleSave: (recipe: Recipe, e: React.MouseEvent) => void;
}

export const FeaturedRecipes: React.FC<FeaturedRecipesProps> = ({
  recipes,
  onSelectRecipe,
  onViewAll,
  savedRecipeIds,
  onToggleSave,
}) => {
  const explicitFeatured = recipes.filter((r) => r.featured && !r.archived && !r.draft);
  const featuredList =
    explicitFeatured.length > 0
      ? explicitFeatured.slice(0, 4)
      : recipes.filter((r) => !r.archived && !r.draft).slice(0, 4);

  return (
    <section className="max-w-7xl mx-auto px-6 sm:px-8 py-16">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-30px' }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex justify-between items-end mb-8 border-b border-gray-100 pb-4"
      >
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-dala-text flex items-center gap-3">
          <i className="fa-solid fa-leaf text-dala-green text-lg sm:text-xl"></i> Featured Recipes
        </h2>
        <motion.button
          whileHover={{ x: 3 }}
          onClick={onViewAll}
          className="text-xs font-bold uppercase tracking-widest text-dala-text hover:text-dala-green flex items-center gap-2 transition-colors group cursor-pointer"
        >
          View All Recipes{' '}
          <ArrowRight
            size={14}
            className="group-hover:translate-x-1 transition-transform"
          />
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredList.map((recipe, idx) => (
          <motion.div
            key={recipe.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <RecipeCard
              recipe={recipe}
              onSelect={onSelectRecipe}
              isSaved={savedRecipeIds.includes(recipe.id)}
              onToggleSave={onToggleSave}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
};
