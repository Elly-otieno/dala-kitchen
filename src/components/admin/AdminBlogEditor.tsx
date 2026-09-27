import React, { useState } from 'react';
import {
  FileText,
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  Clock,
  Sparkles,
  BookOpen,
  Image as ImageIcon,
  CheckCircle2,
  Bold,
  Italic,
  List,
  Quote,
  Star,
} from 'lucide-react';
import { BlogArticle } from '../../types';
import { ImageUploadOrUrlInput } from './ImageUploadOrUrlInput';

interface AdminBlogEditorProps {
  initialArticle?: BlogArticle | null;
  onSave: (article: BlogArticle) => void;
  onCancel: () => void;
}

export const AdminBlogEditor: React.FC<AdminBlogEditorProps> = ({
  initialArticle,
  onSave,
  onCancel,
}) => {
  const [title, setTitle] = useState(
    initialArticle?.title || 'The Chemistry of Long Cold Fermentation in Bread'
  );
  const [category, setCategory] = useState<string>(
    initialArticle?.category || 'Technique'
  );
  const [excerpt, setExcerpt] = useState(
    initialArticle?.excerpt ||
      'Unlocking deep enzymatic breakdown and glass-like crust structure through overnight temperature control.'
  );
  const [image, setImage] = useState(
    initialArticle?.image ||
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80'
  );
  const [readTime, setReadTime] = useState(
    initialArticle?.readTime || '6 min read'
  );
  const [date, setDate] = useState(
    initialArticle?.date || 'October 24, 2026'
  );
  const [featured, setFeatured] = useState<boolean>(
    initialArticle?.featured ?? false
  );

  // Content Paragraphs Array
  const [content, setContent] = useState<string[]>(
    initialArticle?.content || [
      'Cold fermentation is the single most transformative technique in artisan baking. By slowing down yeast activity at 38°F (3°C), bacteria continue producing organic acids without gas over-expansion.',
      'During this extended window, amylase enzymes break down starch into simple sugars, giving the finished loaf its golden mahogany crust and rich complex sweetness.',
      'Always allow your dough to rise for 1 hour at room temperature before transferring it to the refrigerator for optimal yeast health.',
    ]
  );

  // Scientific Highlights / Key Science Takeaways
  const [sciencePillars, setSciencePillars] = useState<{ title: string; desc: string }[]>([
    {
      title: 'Lactic Acid Dynamics',
      desc: 'Lower temperatures favor heterofermentative lactic acid bacteria, building mild, creamy acidity.',
    },
    {
      title: 'Enzymatic Breakdown',
      desc: 'Protease activity relaxes gluten strands for a delicate open crumb without tearing.',
    },
  ]);

  const categories = [
    'All',
    'Kitchen Tips',
    'Sourcing',
    'Technique',
    'Equipment',
    'Seasonal',
    'Science of Scratch',
  ];

  // Helper for paragraphs
  const handleAddParagraph = () => setContent([...content, '']);
  const handleUpdateParagraph = (idx: number, val: string) => {
    const updated = [...content];
    updated[idx] = val;
    setContent(updated);
  };
  const handleRemoveParagraph = (idx: number) =>
    setContent(content.filter((_, i) => i !== idx));

  // Helper for science pillars
  const handleAddPillar = () =>
    setSciencePillars([...sciencePillars, { title: '', desc: '' }]);
  const handleUpdatePillar = (
    idx: number,
    field: 'title' | 'desc',
    val: string
  ) => {
    const updated = [...sciencePillars];
    updated[idx] = { ...updated[idx], [field]: val };
    setSciencePillars(updated);
  };
  const handleRemovePillar = (idx: number) =>
    setSciencePillars(sciencePillars.filter((_, i) => i !== idx));

  const handleSaveArticle = (isDraft: boolean = false) => {
    if (!title.trim()) {
      alert('Please enter a blog post title.');
      return;
    }

    const articleObj: BlogArticle = {
      id: initialArticle?.id || `blog-${Date.now()}`,
      title: title.trim(),
      category,
      image,
      readTime,
      date,
      excerpt,
      content: content.filter((p) => p.trim() !== ''),
      featured,
      archived: initialArticle?.archived ?? false,
      draft: isDraft,
    };

    onSave(articleObj);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSaveArticle(false);
  };

  return (
    <div className="bg-[#fcf9f8] min-h-screen py-4 sm:py-8 px-3 sm:px-8">
      <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
        {/* Editor Header */}
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
                {initialArticle ? 'EDIT BLOG POST' : 'WRITE BLOG POST'}
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                DalaKitchen Food Science &amp; Culinary Articles
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
              onClick={() => handleSaveArticle(true)}
              className="flex-1 sm:flex-initial px-3.5 sm:px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <FileText size={15} /> Save Draft
            </button>
            <button
              type="button"
              onClick={() => handleSaveArticle(false)}
              className="w-full sm:w-auto px-4 sm:px-5 py-2.5 bg-[#27331c] hover:bg-[#3d4a31] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Save size={16} /> Publish Article
            </button>
          </div>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Body Column (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Title & Excerpt */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-2xs space-y-6">
              <h2 className="font-serif font-bold text-lg text-[#1b1c1c] border-b border-gray-100 pb-3 flex items-center gap-2">
                <FileText size={18} className="text-[#27331c]" /> Article Title &amp; Lead
              </h2>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Article Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Article headline..."
                  className="w-full bg-[#fcf9f8] border border-gray-200 rounded-xl px-4 py-3 text-base text-dala-text font-serif font-bold focus:outline-none focus:border-[#27331c] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Article Lead / Excerpt
                </label>
                <textarea
                  rows={3}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Summary paragraph that draws the reader in..."
                  className="w-full bg-[#fcf9f8] border border-gray-200 rounded-xl p-4 text-xs text-dala-text leading-relaxed focus:outline-none focus:border-[#27331c] focus:bg-white"
                />
              </div>
            </div>

            {/* Content Paragraphs Editor */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h2 className="font-serif font-bold text-lg text-[#1b1c1c] flex items-center gap-2">
                  <BookOpen size={18} className="text-[#27331c]" /> Body Content
                </h2>
                <button
                  type="button"
                  onClick={handleAddParagraph}
                  className="px-3 py-1.5 bg-[#27331c]/10 text-[#27331c] hover:bg-[#27331c] hover:text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={14} /> Add Paragraph
                </button>
              </div>

              {/* Quick Formatting Bar */}
              <div className="flex items-center gap-2 p-2 bg-[#f6f3f2] rounded-xl text-gray-600 text-xs border border-gray-200">
                <span className="font-bold text-[10px] uppercase text-gray-400 px-2">Format:</span>
                <button type="button" className="p-1.5 hover:bg-white rounded cursor-pointer" title="Bold"><Bold size={14} /></button>
                <button type="button" className="p-1.5 hover:bg-white rounded cursor-pointer" title="Italic"><Italic size={14} /></button>
                <button type="button" className="p-1.5 hover:bg-white rounded cursor-pointer" title="Bullet List"><List size={14} /></button>
                <button type="button" className="p-1.5 hover:bg-white rounded cursor-pointer" title="Quote Block"><Quote size={14} /></button>
              </div>

              <div className="space-y-4">
                {content.map((para, idx) => (
                  <div key={idx} className="p-4 bg-[#fcf9f8] rounded-xl border border-gray-200 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-gray-500">
                      <span>Paragraph {idx + 1} {idx === 0 ? '(With Drop Cap styling)' : ''}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveParagraph(idx)}
                        className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <textarea
                      rows={4}
                      value={para}
                      onChange={(e) => handleUpdateParagraph(idx, e.target.value)}
                      placeholder="Write your article body paragraph here..."
                      className="w-full bg-white border border-gray-200 rounded-lg p-3 text-xs text-dala-text leading-relaxed focus:outline-none focus:border-[#27331c]"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Scientific Takeaways / Bento Cards */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h2 className="font-serif font-bold text-lg text-[#1b1c1c] flex items-center gap-2">
                  <Sparkles size={18} className="text-amber-500" /> Key Scientific Pillars
                </h2>
                <button
                  type="button"
                  onClick={handleAddPillar}
                  className="px-3 py-1.5 bg-amber-500/10 text-amber-800 hover:bg-amber-500 hover:text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={14} /> Add Pillar
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {sciencePillars.map((pil, idx) => (
                  <div key={idx} className="p-4 bg-[#fcf9f8] rounded-xl border border-gray-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                        Pillar #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemovePillar(idx)}
                        className="text-gray-400 hover:text-red-600 cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={pil.title}
                      onChange={(e) => handleUpdatePillar(idx, 'title', e.target.value)}
                      placeholder="Pillar Title (e.g. Fermentation Dynamics)"
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-bold text-dala-text focus:outline-none focus:border-[#27331c]"
                    />
                    <textarea
                      rows={2}
                      value={pil.desc}
                      onChange={(e) => handleUpdatePillar(idx, 'desc', e.target.value)}
                      placeholder="Scientific explanation..."
                      className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs text-gray-600 focus:outline-none focus:border-[#27331c]"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Column (4 cols) */}
          <div className="lg:col-span-4 space-y-8">
            {/* Image Upload */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
              <ImageUploadOrUrlInput
                label="Header Cover Image"
                value={image}
                onChange={(newImg) => setImage(newImg)}
                placeholder="https://... or drop file"
                aspectRatioClass="h-44"
              />
            </div>

            {/* Categorization & Author Meta */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
              <h3 className="font-serif font-bold text-base text-[#1b1c1c]">
                Metadata &amp; Category
              </h3>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#fcf9f8] border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-dala-text focus:outline-none focus:border-[#27331c]"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Read Time
                </label>
                <input
                  type="text"
                  value={readTime}
                  onChange={(e) => setReadTime(e.target.value)}
                  placeholder="e.g. 5 min read"
                  className="w-full bg-[#fcf9f8] border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#27331c]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Publish Date
                </label>
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="e.g. October 24, 2026"
                  className="w-full bg-[#fcf9f8] border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#27331c]"
                />
              </div>
            </div>

            {/* Featured Article Spotlight Toggle */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-900 flex items-center justify-center font-bold">
                    <Star size={16} className="fill-current" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#1b1c1c] uppercase tracking-wide">
                      Featured Blog Article
                    </h4>
                    <p className="text-[11px] text-amber-900/70">
                      Spotlight Hero (Only 1 active)
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                Featured articles appear prominently in the hero spotlight at the top of the blog page. Enabling this will automatically replace the currently featured article.
              </p>
            </div>

            {/* Save Box */}
            <div className="bg-[#27331c] text-white p-6 rounded-2xl shadow-md space-y-4">
              <h3 className="font-serif font-bold text-base uppercase tracking-wider text-white">
                Publishing Controls
              </h3>
              <p className="text-xs text-gray-300">
                Save as draft to work later or publish to post live.
              </p>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleSaveArticle(true)}
                  className="w-full py-2.5 bg-[#3d4a31] hover:bg-[#4d5c3e] text-amber-200 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer border border-amber-400/30"
                >
                  <FileText size={15} /> Save as Draft
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveArticle(false)}
                  className="w-full py-3 bg-[#765845] hover:bg-[#634833] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer border border-[#8c6b54]"
                >
                  <Save size={16} /> Publish Article
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
