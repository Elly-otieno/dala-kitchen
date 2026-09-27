import React from 'react';
import { Star, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: (recipe: Recipe) => void;
  isSaved?: boolean;
  onToggleSave?: (recipe: Recipe, e: React.MouseEvent) => void;
  showSaveButton?: boolean;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  onSelect,
  isSaved = false,
  onToggleSave,
  showSaveButton = false,
}) => {
  return (
    <motion.article
      whileHover={{ y: -5 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      onClick={() => onSelect(recipe)}
      className="bg-white rounded-none overflow-hidden shadow-2xs border border-gray-200/80 group hover:shadow-lg transition-shadow duration-300 flex flex-col h-full cursor-pointer"
    >
      <div className="aspect-[4/3] w-full overflow-hidden relative bg-gray-100">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
        />

        {showSaveButton && onToggleSave && (
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.85 }}
            onClick={(e) => onToggleSave(recipe, e)}
            className="absolute top-3 right-3 z-10 bg-white/95 hover:bg-white p-2 rounded-full text-gray-700 shadow-sm transition-colors duration-200"
            title={isSaved ? 'Remove from saved' : 'Save recipe'}
          >
            <Heart
              size={16}
              className={isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-500'}
            />
          </motion.button>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-serif text-xl font-bold text-dala-text mb-2 group-hover:text-dala-green transition-colors leading-snug">
          {recipe.title}
        </h3>
        <p className="text-xs sm:text-sm text-dala-text-light line-clamp-2 mb-4 flex-grow leading-relaxed">
          {recipe.description}
        </p>

        <div className="flex items-center gap-1 text-sm text-amber-400">
          <div className="flex text-amber-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={15}
                className={
                  star <= Math.round(recipe.rating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-gray-300'
                }
              />
            ))}
          </div>
          <span className="text-xs text-dala-text-light font-medium ml-1">
            ({recipe.reviewCount || 42})
          </span>
        </div>
      </div>
    </motion.article>
  );
};
