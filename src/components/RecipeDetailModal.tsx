import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  Star,
  Printer,
  Share2,
  Heart,
  Plus,
  Minus,
  Check,
  Play,
  Timer,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Recipe } from '../types';

interface RecipeDetailModalProps {
  recipe: Recipe | null;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (recipe: Recipe) => void;
  onPlayVideo?: (videoId: string) => void;
}

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  recipe,
  onClose,
  isSaved,
  onToggleSave,
  onPlayVideo,
}) => {
  const [servingsMultiplier, setServingsMultiplier] = useState(1);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState(false);
  const [activeTimerMinutes, setActiveTimerMinutes] = useState<number | null>(null);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    setServingsMultiplier(1);
    setCheckedIngredients({});
    setCompletedSteps({});
  }, [recipe]);

  // Timer countdown logic
  useEffect(() => {
    let interval: any = null;
    if (timerRunning && timerSecondsLeft !== null && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft((prev) => (prev !== null ? prev - 1 : 0));
      }, 1000);
    } else if (timerSecondsLeft === 0) {
      setTimerRunning(false);
      if (typeof window !== 'undefined' && 'Notification' in window) {
        // audio chime alert if finished
      }
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSecondsLeft]);

  const startStepTimer = (minutes: number) => {
    setActiveTimerMinutes(minutes);
    setTimerSecondsLeft(minutes * 60);
    setTimerRunning(true);
  };

  const toggleIngredient = (index: number) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const toggleStep = (stepNum: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepNum]: !prev[stepNum],
    }));
  };

  const handlePrint = () => {
    try {
      if (typeof window !== 'undefined') {
        window.print();
      }
    } catch (e) {
      console.warn('Print function blocked:', e);
    }
  };

  const handleShare = () => {
    try {
      if (typeof window !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href);
      }
    } catch (e) {
      console.warn('Clipboard write blocked:', e);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const baseServings = recipe?.servings || 4;
  const currentServings = Math.max(1, Math.round(baseServings * servingsMultiplier));

  return (
    <AnimatePresence>
      {recipe && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-xs"
          onClick={onClose}
        >
          {/* Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-none shadow-2xl border border-gray-100 flex flex-col my-auto relative"
          >
            {/* Sticky Action Header Bar */}
            <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-gray-200 flex justify-between items-center no-print">
              <div className="flex items-center gap-2">
                <span className="badge-tag text-[10px] font-bold px-2.5 py-1 uppercase tracking-wider rounded-none">
                  {recipe.category}
                </span>
                <span className="text-xs font-semibold text-dala-text-light hidden sm:inline">
                  Difficulty: <strong className="text-dala-text">{recipe.difficulty}</strong>
                </span>
              </div>

              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onToggleSave(recipe)}
                  className={`p-2 rounded-full border transition-colors cursor-pointer ${
                    isSaved
                      ? 'border-red-200 bg-red-50 text-red-500'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                  title={isSaved ? 'Saved in favorites' : 'Save recipe'}
                >
                  <Heart size={16} className={isSaved ? 'fill-red-500' : ''} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handlePrint}
                  className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors cursor-pointer"
                  title="Print Recipe"
                >
                  <Printer size={16} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleShare}
                  className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors relative cursor-pointer"
                  title="Share Link"
                >
                  <Share2 size={16} />
                  {copied && (
                    <span className="absolute -bottom-8 right-0 bg-dala-green text-white text-[10px] font-bold px-2 py-1 rounded shadow-md whitespace-nowrap">
                      Link copied!
                    </span>
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors ml-2 cursor-pointer"
                  aria-label="Close dialog"
                >
                  <X size={18} />
                </motion.button>
              </div>
            </div>

            {/* Hero Header Photo & Info */}
            <div className="relative h-72 sm:h-96 w-full bg-gray-100 overflow-hidden group">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-6 sm:p-8">
                <div className="text-white">
                  <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-2 drop-shadow-sm">
                    {recipe.title}
                  </h1>
                  <p className="text-sm sm:text-base text-gray-200 max-w-2xl line-clamp-2 drop-shadow-xs">
                    {recipe.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Meta Stats Row */}
            <div className="bg-[#fcf9f8] px-6 sm:px-8 py-4 border-b border-gray-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="border-r border-gray-200/80 last:border-r-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-dala-text-light block">
                  Prep Time
                </span>
                <span className="text-sm font-semibold text-dala-text flex items-center justify-center gap-1 mt-0.5">
                  <Clock size={13} className="text-dala-green" /> {recipe.prepTime}
                </span>
              </div>

              <div className="border-r sm:border-r border-gray-200/80">
                <span className="text-[10px] font-bold uppercase tracking-wider text-dala-text-light block">
                  Cook Time
                </span>
                <span className="text-sm font-semibold text-dala-text flex items-center justify-center gap-1 mt-0.5">
                  <Clock size={13} className="text-dala-green" /> {recipe.cookTime}
                </span>
              </div>

              <div className="border-r border-gray-200/80">
                <span className="text-[10px] font-bold uppercase tracking-wider text-dala-text-light block">
                  Rating
                </span>
                <span className="text-sm font-semibold text-dala-text flex items-center justify-center gap-1 mt-0.5">
                  <Star size={13} className="fill-dala-gold text-dala-gold" /> {recipe.rating.toFixed(1)} ({recipe.reviewCount} reviews)
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-dala-text-light block">
                  Difficulty
                </span>
                <span className="text-sm font-semibold text-dala-text mt-0.5 block">
                  {recipe.difficulty}
                </span>
              </div>
            </div>

            {/* Video Tutorial Banner if available */}
            {recipe.youtubeVideoId && (
              <div className="bg-dala-green/5 border-b border-dala-green/10 px-6 sm:px-8 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <i className="fa-brands fa-youtube text-red-600 text-2xl"></i>
                  <div>
                    <p className="text-xs font-bold text-dala-text">Watch Step-by-Step Video Tutorial</p>
                    <p className="text-[11px] text-dala-text-light">Achieng shows how to prepare this exact recipe on YouTube</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onPlayVideo?.(recipe.youtubeVideoId!)}
                  className="bg-dala-green text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-none flex items-center gap-1.5 hover:bg-dala-green-dark transition-colors cursor-pointer"
                >
                  <Play size={13} className="fill-white" /> Watch Video
                </motion.button>
              </div>
            )}

            {/* Active Timer Box if active */}
            <AnimatePresence>
              {timerSecondsLeft !== null && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex items-center justify-between text-amber-900"
                >
                  <div className="flex items-center gap-2">
                    <Timer size={18} className="text-amber-700 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider">Kitchen Timer:</span>
                    <span className="text-lg font-mono font-bold text-amber-950">
                      {formatTime(timerSecondsLeft)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setTimerRunning(!timerRunning)}
                      className="bg-amber-200 hover:bg-amber-300 px-3 py-1 text-xs font-bold rounded-none transition-colors cursor-pointer"
                    >
                      {timerRunning ? 'Pause' : 'Resume'}
                    </button>
                    <button
                      onClick={() => {
                        setTimerSecondsLeft(null);
                        setTimerRunning(false);
                      }}
                      className="text-amber-700 hover:text-amber-950 p-1 cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Content Body */}
            <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Left Column: Ingredients & Servings (5 Cols) */}
              <div className="md:col-span-5 border-b md:border-b-0 md:border-r border-gray-200 pr-0 md:pr-6 pb-6 md:pb-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-serif font-bold text-dala-text flex items-center gap-2">
                    <i className="fa-solid fa-leaf text-dala-green text-sm"></i> Ingredients
                  </h3>

                  {/* Servings Modifier */}
                  <div className="flex items-center border border-gray-200 rounded-none bg-white text-xs font-bold">
                    <button
                      onClick={() => setServingsMultiplier((prev) => Math.max(0.25, prev - 0.25))}
                      className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                      title="Decrease servings"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="px-2 text-dala-text">
                      {currentServings} {currentServings === 1 ? 'serving' : 'servings'}
                    </span>
                    <button
                      onClick={() => setServingsMultiplier((prev) => prev + 0.25)}
                      className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                      title="Increase servings"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                <p className="text-[11px] text-gray-500 mb-4 italic">
                  Click checkboxes to mark off ingredients as you prepare.
                </p>

                <ul className="space-y-3">
                  {recipe.ingredients.map((ing, idx) => {
                    const scaledAmount = Number((ing.amount * servingsMultiplier).toFixed(2));
                    const isChecked = checkedIngredients[idx];

                    return (
                      <motion.li
                        key={idx}
                        whileHover={{ x: 2 }}
                        onClick={() => toggleIngredient(idx)}
                        className="flex items-start gap-3 cursor-pointer group py-1 border-b border-gray-100/60 last:border-b-0"
                      >
                        <div
                          className={`w-4 h-4 rounded-none border mt-0.5 flex items-center justify-center flex-shrink-0 transition-colors ${
                            isChecked
                              ? 'bg-dala-green border-dala-green text-white'
                              : 'border-gray-300 group-hover:border-dala-green bg-white'
                          }`}
                        >
                          {isChecked && <Check size={12} strokeWidth={3} />}
                        </div>
                        <span
                          className={`text-sm transition-all ${
                            isChecked
                              ? 'line-through text-gray-400 font-normal'
                              : 'text-dala-text font-medium'
                          }`}
                        >
                          <strong className="text-dala-green font-bold mr-1">
                            {scaledAmount > 0 ? scaledAmount : ''} {ing.unit}
                          </strong>
                          {ing.name}
                          {ing.notes && <span className="text-gray-400 text-xs italic ml-1">({ing.notes})</span>}
                        </span>
                      </motion.li>
                    );
                  })}
                </ul>

                {/* Nutrition Box if provided */}
                {recipe.nutrition && (
                  <div className="mt-8 bg-dala-cream p-4 border border-gray-200 rounded-none">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-dala-text mb-2">
                      Nutrition Facts (per serving)
                    </h4>
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      <div>
                        <span className="block font-bold text-dala-green">{recipe.nutrition.calories}</span>
                        <span className="text-[10px] text-gray-500">Calories</span>
                      </div>
                      <div>
                        <span className="block font-bold text-dala-green">{recipe.nutrition.protein}</span>
                        <span className="text-[10px] text-gray-500">Protein</span>
                      </div>
                      <div>
                        <span className="block font-bold text-dala-green">{recipe.nutrition.carbs}</span>
                        <span className="text-[10px] text-gray-500">Carbs</span>
                      </div>
                      <div>
                        <span className="block font-bold text-dala-green">{recipe.nutrition.fat}</span>
                        <span className="text-[10px] text-gray-500">Fat</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Instructions (7 Cols) */}
              <div className="md:col-span-7">
                <h3 className="text-xl font-serif font-bold text-dala-text mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-leaf text-dala-green text-sm"></i> Step-by-Step Instructions
                </h3>

                <div className="space-y-6">
                  {recipe.instructions.map((step) => {
                    const isDone = completedSteps[step.step];

                    return (
                      <motion.div
                        whileHover={{ y: -1 }}
                        key={step.step}
                        className={`p-4 rounded-none border transition-all ${
                          isDone
                            ? 'bg-gray-50/80 border-gray-200 opacity-70'
                            : 'bg-white border-gray-100 shadow-2xs hover:border-dala-green/30'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => toggleStep(step.step)}
                            className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer ${
                              isDone
                                ? 'bg-dala-green text-white'
                                : 'bg-dala-cream border border-dala-green text-dala-green'
                            }`}
                          >
                            {isDone ? <Check size={14} /> : step.step}
                          </button>

                          <div className="flex-grow">
                            {step.title && (
                              <h4 className="font-serif font-semibold text-base text-dala-text mb-1">
                                {step.title}
                              </h4>
                            )}
                            <p className="text-sm text-dala-text-light leading-relaxed">
                              {step.text}
                            </p>

                            {step.tip && (
                              <div className="mt-2.5 bg-amber-50/70 p-2.5 border-l-2 border-dala-gold text-xs text-amber-900 rounded-none flex items-start gap-2">
                                <Sparkles size={14} className="text-dala-gold flex-shrink-0 mt-0.5" />
                                <span><strong>Achieng's Tip:</strong> {step.tip}</span>
                              </div>
                            )}

                            {step.durationMinutes && (
                              <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => startStepTimer(step.durationMinutes!)}
                                className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-dala-green hover:text-dala-green-dark border border-dala-green/30 hover:bg-dala-green/10 px-3 py-1 rounded-none transition-colors cursor-pointer"
                              >
                                <Timer size={13} /> Start {step.durationMinutes} min timer
                              </motion.button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* General Recipe Tips */}
                {recipe.tips && recipe.tips.length > 0 && (
                  <div className="mt-8 bg-[#f0ebe1] p-5 rounded-none border border-gray-200">
                    <h4 className="font-serif font-bold text-base text-dala-text mb-2 flex items-center gap-2">
                      <i className="fa-solid fa-leaf text-dala-green text-xs"></i> Kitchen Notes &amp; Success Tips
                    </h4>
                    <ul className="list-disc list-inside space-y-1.5 text-xs text-dala-text-light leading-relaxed">
                      {recipe.tips.map((tip, i) => (
                        <li key={i}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
