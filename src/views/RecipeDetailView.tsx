import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Star,
  Clock,
  Flame,
  Bookmark,
  Utensils,
  ChefHat,
  BookOpen,
  Scale,
  CheckSquare,
  Square,
  Share2,
  Printer,
  Heart,
  Play,
  Maximize2,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Recipe } from '../types';
import { extractYoutubeId } from '../lib/youtube';

interface RecipeDetailViewProps {
  recipe: Recipe;
  onBack: () => void;
  onSelectRecipe: (recipe: Recipe) => void;
  allRecipes: Recipe[];
  isSaved?: boolean;
  onToggleSave?: (recipe: Recipe) => void;
  onPlayVideo?: (videoId: string) => void;
}

export const RecipeDetailView: React.FC<RecipeDetailViewProps> = ({
  recipe,
  onBack,
  onSelectRecipe,
  allRecipes,
  isSaved = false,
  onToggleSave,
  onPlayVideo,
}) => {
  // Local state for interactive ingredient checkboxes
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});

  // Dynamic Servings Scaler
  const baseServings = recipe.servings || 4;
  const [activeServings, setActiveServings] = useState<number>(baseServings);

  const formatScaledAmount = (amount?: number) => {
    if (amount === undefined || amount === null) return '';
    const scaled = (amount * activeServings) / baseServings;
    if (Number.isInteger(scaled)) return scaled.toString();
    return Number(scaled.toFixed(2)).toString();
  };

  // YouTube Video State - supports all variations of property names and links
  const videoId = extractYoutubeId(
    recipe.youtubeVideoId,
    recipe.youtubeUrl,
    (recipe as any).youtube_video_id,
    (recipe as any).youtube_url,
    (recipe as any).videoId,
    (recipe as any).videoUrl
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoThumb, setVideoThumb] = useState<string>(() =>
    videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : recipe.image
  );

  useEffect(() => {
    setIsPlaying(false);
    if (videoId) {
      setVideoThumb(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`);
    } else {
      setVideoThumb(recipe.image);
    }
  }, [recipe.id, videoId, recipe.image]);

  const handlePlayVideo = () => {
    setIsPlaying(true);
  };

  const toggleIngredient = (id: string) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const scrollToRecipe = () => {
    const el = document.getElementById('recipe-ingredients-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Split ingredients into logical groups if available or standard dough/sauce splits
  const doughIngredients = recipe.ingredients.slice(0, Math.ceil(recipe.ingredients.length * 0.6));
  const glazeIngredients = recipe.ingredients.slice(Math.ceil(recipe.ingredients.length * 0.6));

  // Related recipes (exclude current)
  const relatedRecipes = allRecipes
    .filter((r) => r.id !== recipe.id && (r.category === recipe.category || true))
    .slice(0, 3);

  // Render the Technique Video Card with the video thumbnail as atmospheric background
  const renderVideoBanner = () => {
    if (!videoId) return null;
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        id="recipe-video-section"
        className="my-8 rounded-3xl bg-[#0E2F24] text-white p-7 sm:p-10 md:p-12 overflow-hidden shadow-xl scroll-mt-28 relative group"
      >
        {/* Video thumbnail as atmospheric background image */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none">
          <img
            src={videoThumb}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-center filter blur-[1px] brightness-[0.36] scale-105 group-hover:scale-110 transition-transform duration-1000 ease-out"
          />
          {/* Deep emerald culinary vignette & gradient overlay for maximum legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#071f16]/95 via-[#0E2F24]/88 to-[#0E2F24]/75" />
          <div className="absolute inset-0 bg-[#0E2F24]/30" />
        </div>

        {isPlaying ? (
          <div className="space-y-4 relative z-10">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/15 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-emerald-400">
                  MASTER THE TECHNIQUE • VIDEO TUTORIAL
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPlaying(false)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-full transition-colors cursor-pointer"
                >
                  <RotateCcw size={12} />
                  Hide Video
                </button>
                {onPlayVideo && (
                  <button
                    type="button"
                    onClick={() => onPlayVideo(videoId)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-full transition-colors cursor-pointer"
                    title="Open full theater dialog"
                  >
                    <Maximize2 size={12} />
                    Theater
                  </button>
                )}
                {recipe.youtubeUrl && (
                  <a
                    href={recipe.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-red-600/80 hover:bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded-full transition-colors"
                  >
                    <i className="fa-brands fa-youtube"></i>
                    YouTube
                  </a>
                )}
              </div>
            </div>

            <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
                title={`${recipe.title} - Master the Technique`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <p className="text-emerald-100/80 italic font-serif text-xs sm:text-sm text-center pt-1">
              "Observe the step-by-step technique, the rhythm of the preparation, and the transformation of ingredients into a legacy of flavor."
            </p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8 relative z-10">
            <div className="max-w-xl space-y-3">
              <p className="text-emerald-400 text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em]">
                MASTER THE TECHNIQUE
              </p>
              <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white font-normal leading-tight">
                Witness the <span className="italic font-serif">Craft</span> in motion.
              </h3>
              <p className="text-emerald-100/90 italic font-serif text-sm sm:text-base leading-relaxed drop-shadow-xs">
                "Observe the traditional methods, the rhythm of the blade, and the transformation of ingredients into a legacy of flavor."
              </p>
            </div>

            <div className="flex-shrink-0 pt-2 lg:pt-0">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={handlePlayVideo}
                className="bg-white hover:bg-emerald-50 text-[#0E2F24] rounded-full px-7 py-3.5 sm:px-8 sm:py-4 shadow-xl flex items-center gap-3.5 group/btn cursor-pointer transition-all"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#0E2F24] text-white flex items-center justify-center flex-shrink-0 group-hover/btn:scale-105 transition-transform shadow-inner">
                  <Play size={14} className="fill-white text-white ml-0.5" />
                </div>
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#0E2F24]">
                  WATCH VIDEO GUIDE
                </span>
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="bg-dala-cream min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <motion.button
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.97 }}
            onClick={onBack}
            className="inline-flex items-center gap-2 text-dala-green font-bold text-xs uppercase tracking-widest hover:text-dala-green-dark transition-colors cursor-pointer group"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Back to All Recipes
          </motion.button>
        </motion.div>

        {/* Hero Banner Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full h-[320px] sm:h-[420px] md:h-[500px] rounded-none overflow-hidden shadow-md mb-8 group bg-gray-100"
        >
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
          
          <div className="absolute bottom-6 left-6 flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-dala-green text-white font-bold text-[10px] uppercase tracking-wider rounded-none shadow-xs">
              {recipe.category}
            </span>
            <span className="px-3 py-1 bg-white/90 text-dala-text font-bold text-[10px] uppercase tracking-wider rounded-none shadow-xs backdrop-blur-xs">
              {recipe.difficulty || 'Scratch Made'}
            </span>
          </div>
        </motion.div>

        {/* Title & Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-10"
        >
          <div className="lg:col-span-8">
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-dala-text mb-3 tracking-wide">
              {recipe.title}
            </h1>
            
            {/* Dynamic Recipe Description from Admin / Database */}
            {recipe.description ? (
              <p className="text-base sm:text-lg text-dala-text-light leading-relaxed mb-6 font-sans">
                {recipe.description}
              </p>
            ) : (
              <p className="font-signature text-2xl sm:text-3xl text-dala-green mb-6">
                A rustic, soul-warming treat crafted with culinary precision.
              </p>
            )}

            {/* Meta Stats Bar */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-dala-text-light font-medium pb-4 border-b border-gray-200">
              <div className="flex items-center gap-1.5">
                <div className="flex text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={
                        star <= Math.round(recipe.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-gray-300'
                      }
                    />
                  ))}
                </div>
                <span className="font-bold text-dala-text ml-1">{recipe.rating.toFixed(1)}</span>
                <span className="text-gray-400">({recipe.reviewCount || 42} reviews)</span>
              </div>

              <div className="h-4 w-px bg-gray-300 hidden sm:block"></div>

              <div className="flex items-center gap-1.5">
                <Clock size={16} className="text-dala-green" />
                <span>Prep: {recipe.prepTime}</span>
              </div>

              <div className="h-4 w-px bg-gray-300 hidden sm:block"></div>

              <div className="flex items-center gap-1.5">
                <Flame size={16} className="text-dala-green" />
                <span>Cook: {recipe.cookTime}</span>
              </div>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="lg:col-span-4 flex flex-sm-row flex-col items-center lg:justify-end gap-3 pt-2">
            {onToggleSave && (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onToggleSave(recipe)}
                className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 border text-xs font-bold uppercase tracking-wider rounded-none transition-colors cursor-pointer w-full ${
                  isSaved
                    ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                    : 'border-gray-300 text-dala-text hover:bg-gray-100 bg-white'
                }`}
              >
                <Bookmark size={16} className={isSaved ? 'fill-red-600 text-red-600' : ''} />
                {isSaved ? 'Saved' : 'Save'}
              </motion.button>
            )}

            {videoId && (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  const el = document.getElementById('recipe-video-section');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                  setIsPlaying(true);
                }}
                className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-3 border border-emerald-900 bg-[#0E2F24] text-white text-xs font-bold uppercase tracking-wider rounded-none hover:bg-[#154636] transition-colors shadow-2xs cursor-pointer w-full"
              >
                <Play size={14} className="fill-white" />
                Watch Video
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={scrollToRecipe}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-dala-green text-white text-xs font-bold uppercase tracking-wider rounded-none hover:bg-dala-green-dark transition-colors shadow-xs cursor-pointer w-full"
            >
              <Utensils size={16} />
              Jump to Recipe
            </motion.button>
          </div>
        </motion.div>

        {/* Content Grid: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left Main Content (8 cols) */}
          <div className="lg:col-span-8 space-y-12">
            {/* Ingredients Section */}
            <motion.section
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4 }}
              id="recipe-ingredients-section"
              className="scroll-mt-24"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-3 mb-6">
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-dala-text flex items-center gap-3">
                  <ChefHat className="text-dala-green" size={26} />
                  Ingredients
                </h2>

                {/* Servings Scaler from Design */}
                {/* <div className="flex items-center gap-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">SERVINGS</span>
                  <div className="inline-flex bg-gray-100 p-0.5 rounded-lg border border-gray-200">
                    {[2, 4, 8].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setActiveServings(s)}
                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                          activeServings === s
                            ? 'bg-white text-dala-green shadow-xs'
                            : 'text-gray-500 hover:text-gray-900'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div> */}
              </div>

              {/* "THE SECRET" Callout Card section (commented out as requested)
              <div className="border-l-4 border-dala-green bg-[#F4F7F4] rounded-r-2xl p-5 sm:p-6 mb-6">
                <div className="flex items-center gap-2 text-dala-green text-[11px] font-bold uppercase tracking-[0.2em] mb-2">
                  <Sparkles size={14} className="text-dala-green" />
                  <span>THE SECRET</span>
                </div>
                <p className="font-serif italic text-dala-text-light text-sm sm:text-base leading-relaxed">
                  "{recipe.tips?.[0] || 'Ensure your spices are freshly ground from whole pods rather than pre-packaged powder for a distinct, high-impact coastal aroma.'}"
                </p>
              </div>
              */}

              <div className="space-y-8 bg-white p-6 sm:p-8 rounded-none border border-gray-200/80 shadow-2xs">
                {/* Section 1: Dough Ingredients */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-dala-green mb-4">
                    THE DOUGH
                  </h3>
                  <ul className="space-y-3">
                    {doughIngredients.map((item, idx) => {
                      const itemKey = `dough-${idx}`;
                      const isChecked = !!checkedIngredients[itemKey];
                      return (
                        <motion.li
                          key={itemKey}
                          whileHover={{ x: 2 }}
                          onClick={() => toggleIngredient(itemKey)}
                          className={`flex items-start gap-3 p-2.5 rounded-none transition-colors cursor-pointer group ${
                            isChecked ? 'bg-gray-50' : 'hover:bg-dala-cream/60'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              e.stopPropagation();
                              toggleIngredient(itemKey);
                            }}
                            className="mt-1 h-4 w-4 rounded-none text-dala-green focus:ring-dala-green border-gray-300 cursor-pointer"
                          />
                          <span
                            className={`text-sm sm:text-base transition-colors ${
                              isChecked
                                ? 'line-through text-gray-400'
                                : 'text-dala-text font-medium'
                            }`}
                          >
                            <span className="font-bold text-dala-green mr-2">
                              {formatScaledAmount(item.amount)} {item.unit}
                            </span>
                            {item.name}
                          </span>
                        </motion.li>
                      );
                    })}
                  </ul>
                </div>

                {/* Section 2: Glaze / Extra Ingredients */}
                {glazeIngredients.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-dala-green mb-4 pt-4 border-t border-gray-100">
                      THE HONEY GLAZE &amp; TOPPING
                    </h3>
                    <ul className="space-y-3">
                      {glazeIngredients.map((item, idx) => {
                        const itemKey = `glaze-${idx}`;
                        const isChecked = !!checkedIngredients[itemKey];
                        return (
                          <motion.li
                            key={itemKey}
                            whileHover={{ x: 2 }}
                            onClick={() => toggleIngredient(itemKey)}
                            className={`flex items-start gap-3 p-2.5 rounded-none transition-colors cursor-pointer group ${
                              isChecked ? 'bg-gray-50' : 'hover:bg-dala-cream/60'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                e.stopPropagation();
                                toggleIngredient(itemKey);
                              }}
                              className="mt-1 h-4 w-4 rounded-none text-dala-green focus:ring-dala-green border-gray-300 cursor-pointer"
                            />
                            <span
                              className={`text-sm sm:text-base transition-colors ${
                                isChecked
                                  ? 'line-through text-gray-400'
                                  : 'text-dala-text font-medium'
                              }`}
                            >
                              <span className="font-bold text-dala-green mr-2">
                                {formatScaledAmount(item.amount)} {item.unit}
                              </span>
                              {item.name}
                            </span>
                          </motion.li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            </motion.section>

            {/* Instructions Section with Memoir Video Section Embedded Within */}
            <motion.section
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4 }}
              id="recipe-instructions-section"
            >
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-dala-text mb-6 flex items-center gap-3 border-b border-gray-200 pb-3">
                <BookOpen className="text-dala-green" size={26} />
                Instructions
              </h2>

              <div className="space-y-6">
                {recipe.instructions.map((step, idx) => {
                  const isMiddle =
                    recipe.instructions.length <= 2
                      ? idx === 0
                      : idx === Math.min(1, Math.floor(recipe.instructions.length / 2));
                  return (
                    <React.Fragment key={step.step}>
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.35, delay: idx * 0.05 }}
                        className="bg-white p-6 sm:p-8 rounded-none border border-gray-200/80 shadow-2xs flex gap-5 sm:gap-6 items-start"
                      >
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-dala-cream border border-dala-green/30 text-dala-green flex items-center justify-center font-serif font-bold text-lg">
                          {step.step}
                        </div>
                        <div className="space-y-2 flex-grow">
                          <h3 className="font-serif font-bold text-lg sm:text-xl text-dala-text">
                            {step.title}
                          </h3>
                          <p className="text-dala-text-light text-sm sm:text-base leading-relaxed">
                            {step.text}
                          </p>
                          {step.tip && (
                            <div className="mt-3 bg-amber-50 border-l-2 border-amber-400 p-3 text-xs text-amber-900 rounded-none">
                              <strong>Kitchen Tip:</strong> {step.tip}
                            </div>
                          )}
                        </div>
                      </motion.div>

                      {/* Video Section embedded within instructions */}
                      {isMiddle && renderVideoBanner()}
                    </React.Fragment>
                  );
                })}

                {/* If instructions is empty or only 1 step and video wasn't rendered yet */}
                {recipe.instructions.length === 0 && renderVideoBanner()}
              </div>
            </motion.section>
          </div>

          {/* Right Sidebar (4 cols) */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Nutrition Facts Card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-none p-6 border border-gray-200/80 shadow-2xs"
            >
              <h3 className="font-serif font-bold text-xl text-dala-text mb-4 flex items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                  <Scale className="text-dala-green" size={20} />
                  Nutrition Facts
                </span>
                <span className="bg-amber-100/80 text-[#765845] font-bold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-none border border-amber-200">
                  Coming Soon
                </span>
              </h3>

              {/* Coming Soon Notice */}
              <div className="border-t border-gray-100 pt-4 text-center py-4 bg-dala-cream/40 rounded-none px-4 mt-2">
                <div className="w-10 h-10 rounded-full bg-dala-green/10 text-dala-green flex items-center justify-center mx-auto mb-2.5">
                  <Scale size={20} />
                </div>
                <p className="text-xs font-bold text-dala-text mb-1">
                  Nutritional Breakdown In Progress
                </p>
                <p className="text-[11px] text-dala-text-light leading-relaxed">
                  Will be available soon.
                </p>
              </div>
            </motion.div>

            {/* Author Card (Achieng) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white rounded-none p-6 border border-gray-200/80 shadow-2xs flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-2 border-dala-green/20 shadow-xs">
                <img
                  src="/images/achieng.png"
                  alt="Achieng portrait"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-serif font-bold text-lg text-dala-text mb-0.5">Achieng</h3>
              <p className="text-[11px] font-bold uppercase tracking-wider text-dala-green mb-3">
                Head Cook &amp; Recipe Developer
              </p>
              <p className="text-xs text-dala-text-light leading-relaxed">
                Achieng merges classic scratch cooking techniques with whole-grain science to create bakes that comfort the soul and nourish the body.
              </p>
            </motion.div>

            {/* Related Recipes */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="pt-4"
            >
              <h3 className="font-serif font-bold text-xl text-dala-text mb-4">
                You Might Also Like
              </h3>
              <div className="space-y-4">
                {relatedRecipes.map((rel) => (
                  <motion.div
                    key={rel.id}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onSelectRecipe(rel);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex gap-4 items-center p-3 bg-white border border-gray-200/80 rounded-none hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="w-20 h-20 rounded-none overflow-hidden flex-shrink-0 bg-gray-100">
                      <img
                        src={rel.image}
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-dala-text group-hover:text-dala-green transition-colors line-clamp-2">
                        {rel.title}
                      </h4>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-dala-green mt-1 inline-block">
                        {rel.category}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </aside>
        </div>
      </div>
    </div>
  );
};
