import React, { useState } from 'react';
import { Search, X, Clock, Star } from 'lucide-react';
import { Recipe, RecipeCategory } from '../types';

interface RecipeSearchModalProps {
  recipes: Recipe[];
  isOpen: boolean;
  onClose: () => void;
  onSelectRecipe: (recipe: Recipe) => void;
}

export const RecipeSearchModal: React.FC<RecipeSearchModalProps> = ({
  recipes,
  isOpen,
  onClose,
  onSelectRecipe,
}) => {
  const [query, setQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Baking', 'Air Fryer', 'Sourdough', 'Kenyan Recipes'];

  const filtered = recipes.filter((r) => {
    const matchesCat = selectedCat === 'All' || r.category === selectedCat;
    const matchesQuery =
      r.title.toLowerCase().includes(query.toLowerCase()) ||
      r.description.toLowerCase().includes(query.toLowerCase()) ||
      r.ingredients.some((i) => i.name.toLowerCase().includes(query.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-xs shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Header Input */}
        <div className="p-4 sm:p-5 border-b border-gray-200 flex items-center gap-3 bg-dala-cream">
          <Search size={20} className="text-dala-green" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search recipes by name, ingredient (e.g. lemon, honey, sourdough)..."
            className="w-full text-sm sm:text-base bg-transparent border-none focus:outline-none text-dala-text font-medium"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Category Pills */}
        <div className="px-4 py-3 bg-white border-b border-gray-100 flex items-center gap-2 overflow-x-auto hide-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1 text-xs font-semibold rounded-xs transition-colors whitespace-nowrap ${
                selectedCat === cat
                  ? 'bg-dala-green text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-grow">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <i className="fa-solid fa-magnifying-glass text-3xl mb-3 text-gray-300"></i>
              <p className="text-sm font-semibold">No recipes found matching "{query}"</p>
              <p className="text-xs text-gray-400 mt-1">Try searching for "sourdough", "lemon", or "chicken"</p>
            </div>
          ) : (
            filtered.map((r) => (
              <div
                key={r.id}
                onClick={() => {
                  onSelectRecipe(r);
                  onClose();
                }}
                className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xs border border-transparent hover:border-gray-200 cursor-pointer transition-all group"
              >
                <img
                  src={r.image}
                  alt={r.title}
                  className="w-16 h-16 object-cover rounded-xs flex-shrink-0"
                />
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="badge-tag text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider rounded-xs">
                      {r.category}
                    </span>
                    <span className="text-[10px] text-gray-400 flex items-center gap-1 font-semibold">
                      <Clock size={10} /> {r.totalTime || r.cookTime}
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-sm text-dala-text group-hover:text-dala-green transition-colors truncate">
                    {r.title}
                  </h4>
                  <p className="text-xs text-gray-500 line-clamp-1">{r.description}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-xs font-bold text-dala-gold flex items-center gap-1">
                    <Star size={12} className="fill-dala-gold" /> {r.rating.toFixed(1)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
