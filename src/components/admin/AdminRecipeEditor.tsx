import React, { useState } from 'react';
import {
  UtensilsCrossed,
  Save,
  Eye,
  ArrowLeft,
  Plus,
  Trash2,
  Clock,
  Youtube,
  Sparkles,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
  Info,
  Image as ImageIcon,
  FileText,
} from 'lucide-react';
import { Recipe, Ingredient, InstructionStep, RecipeCategory } from '../../types';
import { ImageUploadOrUrlInput } from './ImageUploadOrUrlInput';

interface AdminRecipeEditorProps {
  initialRecipe?: Recipe | null;
  onSave: (recipe: Recipe) => void;
  onCancel: () => void;
  onPreviewLive?: (recipe: Recipe) => void;
}

export const AdminRecipeEditor: React.FC<AdminRecipeEditorProps> = ({
  initialRecipe,
  onSave,
  onCancel,
  onPreviewLive,
}) => {
  // Recipe Form State
  const [title, setTitle] = useState(initialRecipe?.title || '');
  const [slug, setSlug] = useState(
    initialRecipe?.slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
  );
  const [category, setCategory] = useState<RecipeCategory>(
    initialRecipe?.category || 'Baking'
  );
  const [description, setDescription] = useState(
    initialRecipe?.description || ''
  );
  const [image, setImage] = useState(
    initialRecipe?.image ||
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80'
  );
  const [prepTime, setPrepTime] = useState(initialRecipe?.prepTime || '15 mins');
  const [cookTime, setCookTime] = useState(initialRecipe?.cookTime || '45 mins');
  const [totalTime, setTotalTime] = useState(initialRecipe?.totalTime || '60 mins');
  const [servings, setServings] = useState<number>(initialRecipe?.servings || 4);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Advanced'>(
    initialRecipe?.difficulty || 'Easy'
  );
  const [featured, setFeatured] = useState<boolean>(initialRecipe?.featured ?? true);
  const [youtubeUrl, setYoutubeUrl] = useState(initialRecipe?.youtubeUrl || '');
  const [youtubeVideoId, setYoutubeVideoId] = useState(initialRecipe?.youtubeVideoId || '');

  // Ingredients State
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    initialRecipe?.ingredients || [
      { name: 'All-purpose flour', amount: 2, unit: 'cups' },
      { name: 'Fine sea salt', amount: 1, unit: 'tsp' },
      { name: 'Unsalted butter (room temp)', amount: 0.5, unit: 'cups' },
    ]
  );

  // Instructions State
  const [instructions, setInstructions] = useState<InstructionStep[]>(
    initialRecipe?.instructions || [
      {
        step: 1,
        title: 'Prep & Preheat',
        text: 'Preheat oven to 350°F (175°C) and line baking tray with parchment paper.',
        durationMinutes: 10,
      },
      {
        step: 2,
        title: 'Combine Ingredients',
        text: 'Whisk dry ingredients in a large bowl. Cream butter and sugar until light and fluffy.',
        durationMinutes: 10,
        tip: 'Ensure butter is at room temperature for optimal aeration.',
      },
    ]
  );

  // Tips / Science of Scratch Notes State
  const [tips, setTips] = useState<string[]>(
    initialRecipe?.tips || [
      'Resting dough allows gluten proteins to relax for a tender crumb.',
      'Always weigh flour using a digital scale for accuracy.',
    ]
  );

  // Nutrition State
  const [calories, setCalories] = useState<number>(initialRecipe?.nutrition?.calories || 280);
  const [protein, setProtein] = useState<string>(initialRecipe?.nutrition?.protein || '6g');
  const [carbs, setCarbs] = useState<string>(initialRecipe?.nutrition?.carbs || '38g');
  const [fat, setFat] = useState<string>(initialRecipe?.nutrition?.fat || '12g');

  const categories: RecipeCategory[] = [
    'Breakfast',
    'Lunch',
    'Dinner',
    'Baking',
    'Air Fryer',
    'Sourdough',
    'Kenyan Recipes',
  ];

  // Auto-generate slug when title changes
  const handleTitleChange = (val: string) => {
    setTitle(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    );
  };

  // Extract YouTube ID automatically
  const handleYoutubeUrlChange = (url: string) => {
    setYoutubeUrl(url);
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      setYoutubeVideoId(match[2]);
    } else if (url.length === 11) {
      setYoutubeVideoId(url);
    }
  };

  // Ingredient Helpers
  const handleAddIngredient = () => {
    setIngredients([
      ...ingredients,
      { name: '', amount: 1, unit: 'cups' },
    ]);
  };

  const handleUpdateIngredient = (index: number, field: keyof Ingredient, value: any) => {
    const updated = [...ingredients];
    updated[index] = { ...updated[index], [field]: value };
    setIngredients(updated);
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  // Instruction Helpers
  const handleAddInstruction = () => {
    setInstructions([
      ...instructions,
      {
        step: instructions.length + 1,
        title: `Step ${instructions.length + 1}`,
        text: '',
        durationMinutes: 5,
      },
    ]);
  };

  const handleUpdateInstruction = (index: number, field: keyof InstructionStep, value: any) => {
    const updated = [...instructions];
    updated[index] = { ...updated[index], [field]: value };
    setInstructions(updated);
  };

  const handleRemoveInstruction = (index: number) => {
    const filtered = instructions.filter((_, i) => i !== index);
    const renumbered = filtered.map((item, idx) => ({ ...item, step: idx + 1 }));
    setInstructions(renumbered);
  };

  const handleMoveInstruction = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === instructions.length - 1) return;
    const updated = [...instructions];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    const renumbered = updated.map((item, idx) => ({ ...item, step: idx + 1 }));
    setInstructions(renumbered);
  };

  // Tips Helpers
  const handleAddTip = () => setTips([...tips, '']);
  const handleUpdateTip = (index: number, val: string) => {
    const updated = [...tips];
    updated[index] = val;
    setTips(updated);
  };
  const handleRemoveTip = (index: number) => setTips(tips.filter((_, i) => i !== index));

  // Form Submit
  const handleSaveRecipe = (isDraft: boolean = false) => {
    if (!title.trim()) {
      alert('Please enter a recipe title.');
      return;
    }

    const recipeObj: Recipe = {
      id: initialRecipe?.id || `recipe-${Date.now()}`,
      title: title.trim(),
      slug: slug || 'recipe-item',
      category,
      description,
      image,
      prepTime,
      cookTime,
      totalTime,
      servings: Number(servings),
      rating: initialRecipe?.rating || 4.9,
      reviewCount: initialRecipe?.reviewCount || 1,
      featured,
      difficulty,
      youtubeUrl,
      youtubeVideoId,
      ingredients,
      instructions,
      tips,
      nutrition: {
        calories: Number(calories),
        protein,
        carbs,
        fat,
      },
      archived: initialRecipe?.archived ?? false,
      draft: isDraft,
    };

    onSave(recipeObj);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSaveRecipe(false);
  };

  return (
    <div className="bg-[#fcf9f8] min-h-screen py-4 sm:py-8 px-3 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        {/* Editor Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer shrink-0"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="font-serif font-bold text-xl sm:text-2xl text-[#1b1c1c] uppercase tracking-wider">
                {initialRecipe ? 'EDIT RECIPE' : 'WRITE A RECIPE'}
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Share the science and the soul of your dish.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap w-full sm:w-auto">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 sm:flex-initial px-3.5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer text-center justify-center"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSaveRecipe(true)}
              className="flex-1 sm:flex-initial px-3.5 sm:px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <FileText size={15} /> Save Draft
            </button>
            <button
              type="button"
              onClick={() => handleSaveRecipe(false)}
              className="w-full sm:w-auto px-4 sm:px-5 py-2.5 bg-[#27331c] hover:bg-[#3d4a31] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Save size={16} /> Publish Recipe
            </button>
          </div>
        </div>

        {/* Main Form Grid */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Primary Details & Sections (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Title & Basics */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-2xs space-y-6">
              <h2 className="font-serif font-bold text-lg text-[#1b1c1c] border-b border-gray-100 pb-3 flex items-center gap-2">
                <UtensilsCrossed size={18} className="text-[#27331c]" /> Basic Information
              </h2>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Recipe Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Sourdough Lemon Loaf Cake"
                  className="w-full bg-[#fcf9f8] border border-gray-200 rounded-xl px-4 py-3 text-sm text-dala-text font-serif font-bold focus:outline-none focus:border-[#27331c] focus:bg-white transition-all"
                />
              </div>

              {/* Slug & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full bg-[#fcf9f8] border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-600 font-mono focus:outline-none focus:border-[#27331c]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as RecipeCategory)}
                    className="w-full bg-[#fcf9f8] border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-dala-text font-bold focus:outline-none focus:border-[#27331c]"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Description / Excerpt
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="A brief catchy description of taste, texture, and flavor profile..."
                  className="w-full bg-[#fcf9f8] border border-gray-200 rounded-xl p-4 text-xs text-dala-text focus:outline-none focus:border-[#27331c] focus:bg-white"
                />
              </div>
            </div>

            {/* Time, Servings & Difficulty */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-2xs space-y-6">
              <h2 className="font-serif font-bold text-lg text-[#1b1c1c] border-b border-gray-100 pb-3 flex items-center gap-2">
                <Clock size={18} className="text-[#27331c]" /> Preparation & Cooking Specs
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                    Prep Time
                  </label>
                  <input
                    type="text"
                    value={prepTime}
                    onChange={(e) => setPrepTime(e.target.value)}
                    placeholder="15 mins"
                    className="w-full bg-[#fcf9f8] border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#27331c]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                    Cook Time
                  </label>
                  <input
                    type="text"
                    value={cookTime}
                    onChange={(e) => setCookTime(e.target.value)}
                    placeholder="45 mins"
                    className="w-full bg-[#fcf9f8] border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#27331c]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                    Servings
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={servings}
                    onChange={(e) => setServings(Number(e.target.value))}
                    className="w-full bg-[#fcf9f8] border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#27331c]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                    Difficulty
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="w-full bg-[#fcf9f8] border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#27331c]"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Ingredients Section */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h2 className="font-serif font-bold text-lg text-[#1b1c1c] flex items-center gap-2">
                  <UtensilsCrossed size={18} className="text-[#27331c]" /> Ingredients List
                </h2>
                <button
                  type="button"
                  onClick={handleAddIngredient}
                  className="px-3 py-1.5 bg-[#27331c]/10 text-[#27331c] hover:bg-[#27331c] hover:text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={14} /> Add Ingredient
                </button>
              </div>

              <div className="space-y-3">
                {ingredients.map((ing, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-[#fcf9f8] rounded-xl border border-gray-200"
                  >
                    <input
                      type="number"
                      step="any"
                      value={ing.amount || ''}
                      onChange={(e) => handleUpdateIngredient(idx, 'amount', parseFloat(e.target.value) || '')}
                      placeholder="Amount"
                      className="w-full sm:w-24 bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#27331c]"
                    />
                    <input
                      type="text"
                      value={ing.unit}
                      onChange={(e) => handleUpdateIngredient(idx, 'unit', e.target.value)}
                      placeholder="Unit (cups, tbsp, g)"
                      className="w-full sm:w-28 bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#27331c]"
                    />
                    <input
                      type="text"
                      value={ing.name}
                      onChange={(e) => handleUpdateIngredient(idx, 'name', e.target.value)}
                      placeholder="Ingredient Name (e.g. Unsalted butter)"
                      className="w-full flex-grow bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#27331c]"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(idx)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                      title="Remove Ingredient"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions Steps */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h2 className="font-serif font-bold text-lg text-[#1b1c1c] flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-[#27331c]" /> Step-by-Step Instructions
                </h2>
                <button
                  type="button"
                  onClick={handleAddInstruction}
                  className="px-3 py-1.5 bg-[#27331c]/10 text-[#27331c] hover:bg-[#27331c] hover:text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={14} /> Add Step
                </button>
              </div>

              <div className="space-y-4">
                {instructions.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-[#fcf9f8] rounded-xl border border-gray-200 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#27331c] text-white font-bold text-xs flex items-center justify-center">
                          {step.step}
                        </span>
                        <input
                          type="text"
                          value={step.title}
                          onChange={(e) => handleUpdateInstruction(idx, 'title', e.target.value)}
                          placeholder="Step Header (e.g. Mix Dry Ingredients)"
                          className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-bold text-dala-text focus:outline-none focus:border-[#27331c]"
                        />
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveInstruction(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 cursor-pointer"
                        >
                          <ChevronUp size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveInstruction(idx, 'down')}
                          disabled={idx === instructions.length - 1}
                          className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 cursor-pointer"
                        >
                          <ChevronDown size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveInstruction(idx)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <textarea
                      rows={2}
                      value={step.text}
                      onChange={(e) => handleUpdateInstruction(idx, 'text', e.target.value)}
                      placeholder="Detailed instructions for this step..."
                      className="w-full bg-white border border-gray-200 rounded-lg p-3 text-xs text-dala-text focus:outline-none focus:border-[#27331c]"
                    />

                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={step.tip || ''}
                        onChange={(e) => handleUpdateInstruction(idx, 'tip', e.target.value)}
                        placeholder="Pro Tip (optional)"
                        className="flex-grow bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-600 placeholder:text-gray-400 focus:outline-none focus:border-[#27331c]"
                      />
                      <input
                        type="number"
                        value={step.durationMinutes || ''}
                        onChange={(e) => handleUpdateInstruction(idx, 'durationMinutes', parseInt(e.target.value) || 0)}
                        placeholder="Mins"
                        className="w-20 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-600 focus:outline-none focus:border-[#27331c]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Science of Scratch Tips */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h2 className="font-serif font-bold text-lg text-[#1b1c1c] flex items-center gap-2">
                  <Sparkles size={18} className="text-amber-500" /> Science of Scratch Notes
                </h2>
                <button
                  type="button"
                  onClick={handleAddTip}
                  className="px-3 py-1.5 bg-amber-500/10 text-amber-800 hover:bg-amber-500 hover:text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={14} /> Add Scientific Tip
                </button>
              </div>

              <div className="space-y-3">
                {tips.map((tip, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <input
                      type="text"
                      value={tip}
                      onChange={(e) => handleUpdateTip(idx, e.target.value)}
                      placeholder="e.g. Cold butter creates steam pockets resulting in flaky layers."
                      className="flex-grow bg-[#fcf9f8] border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-medium text-dala-text focus:outline-none focus:border-[#27331c]"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveTip(idx)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Media, Publishing & Nutrition (4 cols) */}
          <div className="lg:col-span-4 space-y-8">
            {/* Featured Photography */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
              <ImageUploadOrUrlInput
                label="Recipe Cover Image"
                value={image}
                onChange={(newImg) => setImage(newImg)}
                placeholder="https://... or drop file"
                aspectRatioClass="h-48"
              />
            </div>

            {/* YouTube Integration */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
              <h3 className="font-serif font-bold text-base text-[#1b1c1c] flex items-center gap-2">
                <Youtube size={18} className="text-red-600" /> YouTube Video Tutorial
              </h3>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  YouTube Video Link
                </label>
                <input
                  type="text"
                  value={youtubeUrl}
                  onChange={(e) => handleYoutubeUrlChange(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full bg-[#fcf9f8] border border-gray-200 rounded-xl px-3 py-2 text-xs text-dala-text focus:outline-none focus:border-[#27331c]"
                />
              </div>

              {youtubeVideoId && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-800">
                  <Youtube size={16} /> Video ID: <span className="font-mono font-bold">{youtubeVideoId}</span>
                </div>
              )}
            </div>

            {/* Nutrition Facts */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
              <h3 className="font-serif font-bold text-base text-[#1b1c1c]">
                Nutritional Facts
              </h3>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
                    Calories
                  </label>
                  <input
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(Number(e.target.value))}
                    className="w-full bg-[#fcf9f8] border border-gray-200 rounded-lg px-3 py-1.5 font-bold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
                    Protein
                  </label>
                  <input
                    type="text"
                    value={protein}
                    onChange={(e) => setProtein(e.target.value)}
                    className="w-full bg-[#fcf9f8] border border-gray-200 rounded-lg px-3 py-1.5 font-bold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
                    Carbs
                  </label>
                  <input
                    type="text"
                    value={carbs}
                    onChange={(e) => setCarbs(e.target.value)}
                    className="w-full bg-[#fcf9f8] border border-gray-200 rounded-lg px-3 py-1.5 font-bold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
                    Fat
                  </label>
                  <input
                    type="text"
                    value={fat}
                    onChange={(e) => setFat(e.target.value)}
                    className="w-full bg-[#fcf9f8] border border-gray-200 rounded-lg px-3 py-1.5 font-bold focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Featured & Save Box */}
            <div className="bg-[#27331c] text-white p-6 rounded-2xl shadow-md space-y-5">
              <h3 className="font-serif font-bold text-base uppercase tracking-wider text-white">
                Publishing Status
              </h3>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
                />
                <span className="text-xs font-bold text-gray-200">
                  Feature on Homepage Carousel
                </span>
              </label>

              <div className="pt-2 border-t border-[#3d4a31] space-y-2">
                <button
                  type="button"
                  onClick={() => handleSaveRecipe(true)}
                  className="w-full py-2.5 bg-[#3d4a31] hover:bg-[#4d5c3e] text-amber-200 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer border border-amber-400/30"
                >
                  <FileText size={15} /> Save as Draft
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveRecipe(false)}
                  className="w-full py-3 bg-[#765845] hover:bg-[#634833] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer border border-[#8c6b54]"
                >
                  <Save size={16} /> Publish Recipe
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
