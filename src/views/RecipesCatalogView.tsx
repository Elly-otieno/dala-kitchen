import React, { useState } from 'react';
import { Search, SlidersHorizontal, Sparkles, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Recipe, RecipeCategory } from '../types';
import { RecipeCard } from '../components/RecipeCard';

interface RecipesCatalogViewProps {
  recipes: Recipe[];
  selectedCategory: RecipeCategory | null;
  onSelectCategory: (category: RecipeCategory | null) => void;
  onSelectRecipe: (recipe: Recipe) => void;
  savedRecipeIds: string[];
  onToggleSave: (recipe: Recipe, e: React.MouseEvent) => void;
}

export const RecipesCatalogView: React.FC<RecipesCatalogViewProps> = ({
  recipes,
  selectedCategory,
  onSelectCategory,
  onSelectRecipe,
  savedRecipeIds,
  onToggleSave,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'rating' | 'prepTime'>('rating');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);

  const allCategories: RecipeCategory[] = [
    'Breakfast',
    'Lunch',
    'Dinner',
    'Baking',
    'Air Fryer',
    'Sourdough',
    'Kenyan Recipes',
  ];

  // Only show categories that have at least 1 active recipe
  const availableCategories = React.useMemo(() => {
    const activeRecipes = recipes.filter((r) => !r.archived && !r.draft);
    const existingCats = new Set(activeRecipes.map((r) => r.category));
    return allCategories.filter((c) => existingCats.has(c));
  }, [recipes]);

  const filterPills: (RecipeCategory | 'All')[] = [
    'All',
    ...availableCategories,
  ];

  const filteredRecipes = recipes
    .filter((recipe) => {
      const matchCat =
        !selectedCategory || selectedCategory === 'All'
          ? true
          : recipe.category === selectedCategory;

      const matchDifficulty =
        selectedDifficulty === 'All' || recipe.difficulty === selectedDifficulty;

      const matchSearch =
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.ingredients.some((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchCat && matchDifficulty && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      return a.prepTime.localeCompare(b.prepTime);
    });

  const displayedRecipes = filteredRecipes.slice(0, visibleCount);

  return (
    <div className="bg-dala-cream min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 text-left"
        >
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-dala-text mb-2 tracking-wide uppercase">
            All Recipes
          </h1>
          <p className="text-base sm:text-lg text-dala-text-light font-sans">
            Browse all delicious recipes by category or search for your favorites.
          </p>
        </motion.div>

        {/* Search and Filters Bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white border border-gray-200/80 rounded-none p-4 md:p-6 mb-12 shadow-2xs flex flex-col md:flex-row gap-6 items-center justify-between"
        >
          {/* Search Box */}
          <div className="w-full md:w-1/3 relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recipes..."
              className="w-full pl-11 pr-4 py-3 bg-dala-cream/30 border border-gray-200/80 rounded-none focus:outline-none focus:border-dala-green focus:ring-1 focus:ring-dala-green text-sm text-dala-text placeholder:text-gray-400 transition-colors"
            />
          </div>

          {/* Category Filter Pills (Desktop & Tablet) */}
          <div className="hidden md:flex items-center gap-3 overflow-x-auto pb-1 md:pb-0 hide-scrollbar">
            {filterPills.map((cat) => {
              const active =
                (!selectedCategory && cat === 'All') || selectedCategory === cat;
              return (
                <motion.button
                  key={cat}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => onSelectCategory(cat === 'All' ? null : (cat as RecipeCategory))}
                  className={`flex-shrink-0 px-5 py-2 rounded-none text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    active
                      ? 'bg-dala-green text-white shadow-2xs'
                      : 'bg-white text-dala-text-light border border-gray-200 hover:border-dala-green hover:text-dala-green'
                  }`}
                >
                  {cat}
                </motion.button>
              );
            })}

            {/* Filter Toggle */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-none text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                showAdvancedFilters
                  ? 'bg-dala-green/10 text-dala-green border border-dala-green'
                  : 'text-dala-green hover:bg-gray-100'
              }`}
            >
              <SlidersHorizontal size={16} /> Filters
            </motion.button>
          </div>

          {/* Mobile Filter Buttons */}
          <div className="w-full md:hidden flex justify-between gap-3">
            <select
              value={selectedCategory || 'All'}
              onChange={(e) =>
                onSelectCategory(e.target.value === 'All' ? null : (e.target.value as RecipeCategory))
              }
              className="flex-1 py-2.5 px-3 bg-white border border-gray-200 rounded-none text-xs font-bold uppercase text-dala-text"
            >
              <option value="All">All Categories</option>
              {availableCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-none border border-gray-200 bg-white text-dala-text font-bold text-xs uppercase"
            >
              <SlidersHorizontal size={15} /> Filters
            </motion.button>
          </div>
        </motion.div>

        {/* Collapsible Advanced Filters Drawer */}
        <AnimatePresence>
          {showAdvancedFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden mb-12"
            >
              <div className="bg-white border border-gray-200/80 rounded-none p-6 shadow-2xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-dala-text mb-2">
                      Active Categories
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableCategories.map((cat) => {
                        const active = selectedCategory === cat;
                        return (
                          <motion.button
                            key={cat}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => onSelectCategory(active ? null : cat)}
                            className={`px-3 py-1.5 rounded-none font-semibold transition-colors cursor-pointer ${
                              active
                                ? 'bg-dala-green text-white'
                                : 'bg-gray-100 text-dala-text hover:bg-gray-200'
                            }`}
                          >
                            {cat}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider text-dala-text mb-2">
                      Difficulty
                    </label>
                    <div className="flex gap-2">
                      {['All', 'Easy', 'Medium', 'Advanced'].map((diff) => (
                        <motion.button
                          key={diff}
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => setSelectedDifficulty(diff)}
                          className={`px-3 py-1.5 rounded-none font-semibold transition-colors cursor-pointer ${
                            selectedDifficulty === diff
                              ? 'bg-dala-green text-white'
                              : 'bg-gray-100 text-dala-text hover:bg-gray-200'
                          }`}
                        >
                          {diff}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider text-dala-text mb-2">
                      Sort By
                    </label>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setSortBy('rating')}
                        className={`px-3 py-1.5 rounded-none font-semibold transition-colors cursor-pointer ${
                          sortBy === 'rating'
                            ? 'bg-dala-green text-white'
                            : 'bg-gray-100 text-dala-text hover:bg-gray-200'
                        }`}
                      >
                        Highest Rated
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setSortBy('prepTime')}
                        className={`px-3 py-1.5 rounded-none font-semibold transition-colors cursor-pointer ${
                          sortBy === 'prepTime'
                            ? 'bg-dala-green text-white'
                            : 'bg-gray-100 text-dala-text hover:bg-gray-200'
                        }`}
                      >
                        Prep Time
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recipe Grid */}
        {filteredRecipes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center py-20 bg-white border border-gray-200/80 rounded-none"
          >
            <Sparkles size={40} className="mx-auto text-gray-300 mb-3" />
            <h3 className="text-xl font-serif font-bold text-dala-text mb-2">
              No matching recipes found
            </h3>
            <p className="text-sm text-dala-text-light mb-6">
              Try adjusting your search criteria or select another category above.
            </p>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                onSelectCategory(null);
                setSearchQuery('');
                setSelectedDifficulty('All');
              }}
              className="bg-dala-green text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-none hover:bg-dala-green-dark transition-colors cursor-pointer"
            >
              Reset All Filters
            </motion.button>
          </motion.div>
        ) : (
          <div>
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
            >
              {displayedRecipes.map((recipe, index) => (
                <motion.div
                  key={recipe.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.3) }}
                >
                  <RecipeCard
                    recipe={recipe}
                    onSelect={onSelectRecipe}
                    showSaveButton={false}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Load More Recipes Button */}
            {visibleCount < filteredRecipes.length && (
              <div className="flex justify-center mt-12">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                  className="px-8 py-3.5 border-2 border-dala-green text-dala-green font-bold text-xs uppercase tracking-widest rounded-none hover:bg-dala-green/5 transition-colors flex items-center gap-2 cursor-pointer shadow-2xs"
                >
                  Load More Recipes
                  <ChevronDown size={18} />
                </motion.button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
