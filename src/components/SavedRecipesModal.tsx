import React from 'react';
import { X, Heart, Clock, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Recipe } from '../types';

interface SavedRecipesModalProps {
  recipes: Recipe[];
  savedIds: string[];
  isOpen: boolean;
  onClose: () => void;
  onSelectRecipe: (recipe: Recipe) => void;
  onRemoveSaved: (recipe: Recipe) => void;
}

export const SavedRecipesModal: React.FC<SavedRecipesModalProps> = ({
  recipes,
  savedIds,
  isOpen,
  onClose,
  onSelectRecipe,
  onRemoveSaved,
}) => {
  const savedList = recipes.filter((r) => savedIds.includes(r.id));

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-xl rounded-xs shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-dala-cream">
              <div className="flex items-center gap-2">
                <Heart size={20} className="fill-red-500 text-red-500" />
                <h3 className="text-xl font-serif font-bold text-dala-text">
                  Saved Recipes ({savedList.length})
                </h3>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-1 rounded-full text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Saved List */}
            <div className="p-5 overflow-y-auto space-y-3 flex-grow">
              {savedList.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Heart size={40} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-sm font-semibold">No saved recipes yet</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Click the heart icon on any recipe card to save it here for quick offline access!
                  </p>
                </div>
              ) : (
                <AnimatePresence>
                  {savedList.map((r) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.2 }}
                      key={r.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-xs hover:border-dala-green/40 hover:shadow-xs transition-all group bg-white"
                    >
                      <div
                        onClick={() => {
                          onSelectRecipe(r);
                          onClose();
                        }}
                        className="flex items-center gap-4 cursor-pointer flex-grow min-w-0"
                      >
                        <img
                          src={r.image}
                          alt={r.title}
                          className="w-16 h-16 object-cover rounded-xs flex-shrink-0 group-hover:scale-104 transition-transform duration-300"
                        />
                        <div className="min-w-0">
                          <span className="badge-tag text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider rounded-xs">
                            {r.category}
                          </span>
                          <h4 className="font-serif font-bold text-sm text-dala-text group-hover:text-dala-green transition-colors truncate mt-1">
                            {r.title}
                          </h4>
                          <span className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                            <Clock size={11} /> {r.totalTime || r.cookTime}
                          </span>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onRemoveSaved(r)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors ml-3 cursor-pointer"
                        title="Remove from saved"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
