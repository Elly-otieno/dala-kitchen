import React, { useState } from 'react';
import {
  UtensilsCrossed,
  FileText,
  Youtube,
  Edit2,
  Trash2,
  Eye,
  Plus,
  Search,
  CheckCircle,
  Clock,
  Archive,
  ArchiveRestore,
  Filter,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Star,
  Sparkles,
  Layers,
  Flame,
  Shuffle,
  X,
} from 'lucide-react';
import { Recipe, BlogArticle, YouTubeVideo } from '../../types';
import { DeleteConfirmationModal } from '../common/DeleteConfirmationModal';

interface AdminContentLibraryProps {
  activeTab?: 'dashboard' | 'recipes' | 'blog' | 'youtube';
  recipes: Recipe[];
  articles: BlogArticle[];
  videos: YouTubeVideo[];
  onEditRecipe: (recipe: Recipe) => void;
  onEditArticle: (article: BlogArticle) => void;
  onEditVideo: (video: YouTubeVideo) => void;
  onDeleteRecipe: (id: string) => void;
  onDeleteArticle: (id: string) => void;
  onDeleteVideo: (id: string) => void;
  onToggleArchiveRecipe: (id: string) => void;
  onToggleArchiveArticle: (id: string) => void;
  onToggleArchiveVideo: (id: string) => void;
  onToggleFeaturedRecipe?: (id: string) => void;
  onToggleFeaturedArticle?: (id: string) => void;
  onToggleFeaturedVideo?: (id: string) => void;
  onAutoSelectFeatured?: (criteria: 'top_rated' | 'latest' | 'category_mix' | 'clear') => void;
  onCreateRecipe: () => void;
  onCreateBlog: () => void;
  onCreateYouTube: () => void;
  onViewLiveRecipe: (recipe: Recipe) => void;
}

export const AdminContentLibrary: React.FC<AdminContentLibraryProps> = ({
  activeTab = 'dashboard',
  recipes,
  articles,
  videos,
  onEditRecipe,
  onEditArticle,
  onEditVideo,
  onDeleteRecipe,
  onDeleteArticle,
  onDeleteVideo,
  onToggleArchiveRecipe,
  onToggleArchiveArticle,
  onToggleArchiveVideo,
  onToggleFeaturedRecipe,
  onToggleFeaturedArticle,
  onToggleFeaturedVideo,
  onAutoSelectFeatured,
  onCreateRecipe,
  onCreateBlog,
  onCreateYouTube,
  onViewLiveRecipe,
}) => {
  const [contentType, setContentType] = useState<'all' | 'recipes' | 'blog' | 'youtube'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'featured'>('date');
  const [showFeaturedManager, setShowFeaturedManager] = useState(true);
  const [featuredTab, setFeaturedTab] = useState<'recipes' | 'blog' | 'youtube'>(
    activeTab === 'blog' ? 'blog' : activeTab === 'youtube' ? 'youtube' : 'recipes'
  );
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    title: string;
    type: 'Recipe' | 'Blog' | 'YouTube';
  } | null>(null);
  const itemsPerPage = 7;

  // Determine active filtering mode
  const effectiveType =
    activeTab === 'recipes'
      ? 'recipes'
      : activeTab === 'blog'
      ? 'blog'
      : activeTab === 'youtube'
      ? 'youtube'
      : contentType;

  const headerMeta = {
    recipes: {
      title: 'RECIPES CATALOG',
      subtitle: 'Manage all recipes, ingredients, and step-by-step cooking guides.',
      addLabel: 'Add New Recipe',
      onAdd: onCreateRecipe,
    },
    blog: {
      title: 'BLOG ARTICLES',
      subtitle: 'Manage culinary science articles, stories, and food guides.',
      addLabel: 'Add New Blog Article',
      onAdd: onCreateBlog,
    },
    youtube: {
      title: 'YOUTUBE VIDEOS',
      subtitle: 'Manage video masterclasses and feature DalaKitchen TV episodes.',
      addLabel: 'Add New Video',
      onAdd: onCreateYouTube,
    },
    dashboard: {
      title: 'CONTENT LIBRARY',
      subtitle: 'Manage recipes, blog posts, and video content across DalaKitchen.',
      addLabel: null,
      onAdd: null,
    },
  }[activeTab] || {
    title: 'CONTENT LIBRARY',
    subtitle: 'Manage content across DalaKitchen.',
    addLabel: null,
    onAdd: null,
  };

  // Combine items for universal content library table view
  const allItems = [
    ...recipes.map((r) => ({
      id: r.id,
      title: r.title,
      displayId: `REC-${r.id.slice(-4).toUpperCase()}`,
      type: 'Recipe' as const,
      category: r.category,
      image: r.image,
      author: 'Elena Rossi',
      archived: !!r.archived,
      draft: !!r.draft,
      featured: !!r.featured,
      rating: r.rating || 4.9,
      reviewCount: r.reviewCount || 0,
      status: r.archived ? ('Archived' as const) : r.draft ? ('Draft' as const) : ('Published' as const),
      date: 'Oct 24, 2023',
      raw: r,
    })),
    ...articles.map((a) => ({
      id: a.id,
      title: a.title,
      displayId: `BLG-${a.id.slice(-4).toUpperCase()}`,
      type: 'Blog' as const,
      category: a.category,
      image: a.image,
      author: 'Marcus Chen',
      archived: !!a.archived,
      draft: !!a.draft,
      featured: !!a.featured,
      rating: 5.0,
      reviewCount: 0,
      status: a.archived ? ('Archived' as const) : a.draft ? ('Draft' as const) : ('Published' as const),
      date: a.date || 'Oct 22, 2023',
      raw: a,
    })),
    ...videos.map((v) => ({
      id: v.id,
      title: v.title,
      displayId: `YTB-${v.id.slice(-4).toUpperCase()}`,
      type: 'YouTube' as const,
      category: v.series || 'Video',
      image: v.thumbnail,
      author: 'DalaKitchen TV',
      archived: !!v.archived,
      draft: !!v.draft,
      featured: !!v.featured,
      rating: 5.0,
      reviewCount: 0,
      status: v.archived ? ('Archived' as const) : v.draft ? ('Draft' as const) : ('Published' as const),
      date: v.publishedAt || 'Oct 18, 2023',
      raw: v,
    })),
  ];

  // Currently featured items
  const featuredRecipes = recipes.filter((r) => r.featured && !r.archived && !r.draft);
  const featuredArticle = articles.find((a) => a.featured && !a.archived && !a.draft);
  const featuredVideo = videos.find((v) => v.featured && !v.archived && !v.draft);
  const totalFeaturedCount = featuredRecipes.length + (featuredArticle ? 1 : 0) + (featuredVideo ? 1 : 0);

  // Filter items
  const filteredItems = allItems.filter((item) => {
    const matchesType =
      effectiveType === 'all' ||
      (effectiveType === 'recipes' && item.type === 'Recipe') ||
      (effectiveType === 'blog' && item.type === 'Blog') ||
      (effectiveType === 'youtube' && item.type === 'YouTube');

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'published' && !item.archived && !item.draft) ||
      (statusFilter === 'draft' && item.draft && !item.archived) ||
      (statusFilter === 'archived' && item.archived);

    return matchesType && matchesStatus;
  });

  // Sort
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'featured') {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
    }
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedItems.length / itemsPerPage) || 1;
  const paginatedItems = sortedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6 sm:p-10 space-y-6 bg-[#fcf9f8] min-h-screen font-sans">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif font-bold text-3xl text-[#1b1c1c] tracking-wide uppercase">
            {headerMeta.title}
          </h1>
          <p className="text-sm text-[#666666] font-sans mt-1">
            {headerMeta.subtitle}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {headerMeta.addLabel && headerMeta.onAdd && (
            <button
              onClick={headerMeta.onAdd}
              className="py-2 px-4 bg-[#24331e] hover:bg-[#34462c] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Plus size={16} /> {headerMeta.addLabel}
            </button>
          )}

          {activeTab === 'dashboard' && (
            <button
              onClick={() => setShowFeaturedManager(!showFeaturedManager)}
              className={`py-2 px-3.5 font-bold text-xs rounded-xl border transition-all flex items-center gap-2 cursor-pointer ${
                showFeaturedManager
                  ? 'bg-[#24331e] text-white border-[#24331e] shadow-2xs'
                  : 'bg-white text-[#1b1c1c] border-[#d8d3cb] hover:bg-[#f9f8f6]'
              }`}
            >
              <Star size={15} className={showFeaturedManager ? 'fill-amber-400 text-amber-400' : 'text-amber-500'} />
              <span>Featured Manager ({totalFeaturedCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Content Type Selector Pills (Quick Filter for Recipe, Blog, Video) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-3.5 sm:p-4 rounded-2xl border border-[#e6e2dc] shadow-2xs">
        {/* Type Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
          <button
            onClick={() => {
              setContentType('all');
              setCurrentPage(1);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              effectiveType === 'all'
                ? 'bg-[#24331e] text-white shadow-2xs'
                : 'bg-[#f4f1eb] text-[#4a4a4a] hover:bg-[#eae5dc]'
            }`}
          >
            <Layers size={14} />
            <span>All Content</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                effectiveType === 'all' ? 'bg-white/20 text-white' : 'bg-white text-gray-600'
              }`}
            >
              {allItems.length}
            </span>
          </button>

          <button
            onClick={() => {
              setContentType('recipes');
              setCurrentPage(1);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              effectiveType === 'recipes'
                ? 'bg-[#24331e] text-white shadow-2xs'
                : 'bg-[#f4f1eb] text-[#4a4a4a] hover:bg-[#eae5dc]'
            }`}
          >
            <UtensilsCrossed size={14} />
            <span>Recipes</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                effectiveType === 'recipes' ? 'bg-white/20 text-white' : 'bg-white text-gray-600'
              }`}
            >
              {recipes.length}
            </span>
          </button>

          <button
            onClick={() => {
              setContentType('blog');
              setCurrentPage(1);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              effectiveType === 'blog'
                ? 'bg-[#24331e] text-white shadow-2xs'
                : 'bg-[#f4f1eb] text-[#4a4a4a] hover:bg-[#eae5dc]'
            }`}
          >
            <FileText size={14} />
            <span>Blog Articles</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                effectiveType === 'blog' ? 'bg-white/20 text-white' : 'bg-white text-gray-600'
              }`}
            >
              {articles.length}
            </span>
          </button>

          <button
            onClick={() => {
              setContentType('youtube');
              setCurrentPage(1);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              effectiveType === 'youtube'
                ? 'bg-[#24331e] text-white shadow-2xs'
                : 'bg-[#f4f1eb] text-[#4a4a4a] hover:bg-[#eae5dc]'
            }`}
          >
            <Youtube size={14} />
            <span>YouTube Videos</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                effectiveType === 'youtube' ? 'bg-white/20 text-white' : 'bg-white text-gray-600'
              }`}
            >
              {videos.length}
            </span>
          </button>
        </div>

        {/* Filters & Sort Controls */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap w-full md:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="w-full sm:w-auto appearance-none bg-[#f8f6f3] border border-[#d8d3cb] text-[#1b1c1c] font-semibold text-xs py-2 pl-8 pr-7 rounded-xl cursor-pointer hover:bg-[#f1ede6] focus:outline-none"
            >
              <option value="all">Status: All</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
              <option value="archived">Archived</option>
            </select>
            <Filter
              size={13}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />
          </div>

          <button
            onClick={() =>
              setSortBy(sortBy === 'date' ? 'featured' : sortBy === 'featured' ? 'title' : 'date')
            }
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-[#f8f6f3] border border-[#d8d3cb] text-[#1b1c1c] font-semibold text-xs py-2 px-3 rounded-xl hover:bg-[#f1ede6] transition-colors cursor-pointer shrink-0"
            title="Cycle sort order"
          >
            <SlidersHorizontal size={13} className="text-gray-500" />
            <span>Sort: {sortBy === 'featured' ? 'Featured' : sortBy === 'title' ? 'Title' : 'Date'}</span>
          </button>
        </div>
      </div>

      {/* FEATURED ON SITE MANAGEMENT CARD */}
      {showFeaturedManager && (
        <div className="bg-gradient-to-br from-[#24331e] to-[#1a2516] text-white rounded-2xl p-6 sm:p-7 shadow-md space-y-5 border border-[#3b4e33]">
          {/* Top Bar with Sub-tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/15 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-[#1b1c1c] flex items-center justify-center font-bold">
                <Star size={20} className="fill-current" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-bold text-lg text-white">
                    Featured Content Spotlights
                  </h3>
                  <span className="text-[11px] font-bold bg-amber-400/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                    {totalFeaturedCount} Spotlights Active
                  </span>
                </div>
                <p className="text-xs text-white/70 mt-0.5">
                  Manage prime featured placements for Homepage recipes, Blog hero article, and Watch &amp; Cook video episode.
                </p>
              </div>
            </div>

            {/* Type Selector Tabs */}
            <div className="flex items-center bg-black/30 p-1 rounded-xl border border-white/15">
              <button
                type="button"
                onClick={() => setFeaturedTab('recipes')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  featuredTab === 'recipes'
                    ? 'bg-amber-400 text-[#1b1c1c] shadow-xs'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <UtensilsCrossed size={13} />
                <span>Recipes ({featuredRecipes.length}/4)</span>
              </button>

              <button
                type="button"
                onClick={() => setFeaturedTab('blog')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  featuredTab === 'blog'
                    ? 'bg-amber-400 text-[#1b1c1c] shadow-xs'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <FileText size={13} />
                <span>Blog ({featuredArticle ? '1 Active' : '0/1'})</span>
              </button>

              <button
                type="button"
                onClick={() => setFeaturedTab('youtube')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  featuredTab === 'youtube'
                    ? 'bg-amber-400 text-[#1b1c1c] shadow-xs'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <Youtube size={13} />
                <span>YouTube ({featuredVideo ? '1 Active' : '0/1'})</span>
              </button>
            </div>
          </div>

          {/* TAB 1: RECIPES FEATURED (Max 4, with Auto-Select) */}
          {featuredTab === 'recipes' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                <div className="text-xs text-white/80">
                  <span className="font-bold text-amber-300">Homepage Grid:</span> Displays up to 4 featured recipes in the top curated showcase.
                </div>
                {onAutoSelectFeatured && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-white/60 font-semibold mr-1">Auto-Select:</span>
                    <button
                      type="button"
                      onClick={() => onAutoSelectFeatured('top_rated')}
                      className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold text-white transition-all flex items-center gap-1.5 cursor-pointer"
                      title="Auto-select the 4 highest rated recipes with most reviews"
                    >
                      <Flame size={13} className="text-amber-400" />
                      <span>Top Rated</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onAutoSelectFeatured('latest')}
                      className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold text-white transition-all flex items-center gap-1.5 cursor-pointer"
                      title="Auto-select the 4 newest recipes"
                    >
                      <Clock size={13} className="text-emerald-400" />
                      <span>Newest</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onAutoSelectFeatured('category_mix')}
                      className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold text-white transition-all flex items-center gap-1.5 cursor-pointer"
                      title="Auto-select 1 recipe per category for balanced variety"
                    >
                      <Shuffle size={13} className="text-cyan-400" />
                      <span>Category Mix</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onAutoSelectFeatured('clear')}
                      className="px-2.5 py-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 rounded-xl text-xs font-bold text-red-200 transition-all cursor-pointer"
                      title="Clear all featured selections"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>

              {/* Featured Recipes Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {featuredRecipes.length > 0 ? (
                  featuredRecipes.map((recipe, index) => (
                    <div
                      key={recipe.id}
                      className="bg-white/10 border border-white/15 rounded-xl p-3 flex items-center gap-3 relative group hover:bg-white/15 transition-all"
                    >
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-black/20 shrink-0 relative">
                        <img
                          src={recipe.image}
                          alt={recipe.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-1 left-1 bg-amber-400 text-slate-900 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                          {index + 1}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-xs text-white truncate leading-snug">
                          {recipe.title}
                        </p>
                        <p className="text-[11px] text-amber-300 font-semibold mt-0.5">
                          {recipe.category} • ★ {recipe.rating || 4.9}
                        </p>
                      </div>
                      {onToggleFeaturedRecipe && (
                        <button
                          onClick={() => onToggleFeaturedRecipe(recipe.id)}
                          className="p-1.5 text-white/40 hover:text-red-300 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                          title="Remove from featured"
                        >
                          <X size={15} />
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-6 text-center text-xs text-white/60 bg-white/5 rounded-xl border border-white/10">
                    No recipes currently featured. Click the star icon next to any recipe in the table below or use an Auto-Select preset above.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: BLOG FEATURED ARTICLE (Single item rule) */}
          {featuredTab === 'blog' && (
            <div className="space-y-4">
              <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-xs text-white/80 flex items-center justify-between">
                <div>
                  <span className="font-bold text-amber-300">Blog Hero Spotlight:</span> Only 1 article can be featured at a time. Selecting a new article automatically replaces the current one.
                </div>
              </div>

              {featuredArticle ? (
                <div className="bg-white/10 border border-amber-400/40 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-black/20 shrink-0 border border-white/20">
                      <img
                        src={featuredArticle.image}
                        alt={featuredArticle.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold bg-amber-400 text-slate-900 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Active Hero Article
                        </span>
                        <span className="text-xs text-white/60">• {featuredArticle.category}</span>
                      </div>
                      <h4 className="font-serif font-bold text-base text-white truncate max-w-lg">
                        {featuredArticle.title}
                      </h4>
                      <p className="text-xs text-white/70 line-clamp-1 mt-0.5">
                        {featuredArticle.excerpt}
                      </p>
                      <p className="text-[11px] text-white/50 mt-1">
                        {featuredArticle.readTime} • {featuredArticle.date}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <button
                      type="button"
                      onClick={() => onEditArticle(featuredArticle)}
                      className="px-3 py-1.5 bg-white/15 hover:bg-white/25 rounded-xl text-xs font-bold text-white transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit2 size={13} />
                      <span>Edit Article</span>
                    </button>
                    {onToggleFeaturedArticle && (
                      <button
                        type="button"
                        onClick={() => onToggleFeaturedArticle(featuredArticle.id)}
                        className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-red-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <X size={13} />
                        <span>Remove Featured</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-white/60 bg-white/5 rounded-xl border border-white/10">
                  No article is currently set as the featured hero. Click the star icon next to any article below to feature it.
                </div>
              )}

              {/* Quick switch to another article */}
              {articles.filter((a) => !a.featured && !a.archived && !a.draft).length > 0 && (
                <div className="space-y-2 pt-1">
                  <p className="text-xs font-bold text-white/60 uppercase tracking-wider">
                    Quick-Select Other Articles to Feature:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {articles
                      .filter((a) => !a.featured && !a.archived && !a.draft)
                      .slice(0, 3)
                      .map((article) => (
                        <div
                          key={article.id}
                          className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-2.5 flex items-center justify-between gap-3 transition-colors"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={article.image}
                              alt={article.title}
                              className="w-10 h-10 rounded-lg object-cover shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-white truncate">{article.title}</p>
                              <p className="text-[10px] text-white/50">{article.category}</p>
                            </div>
                          </div>
                          {onToggleFeaturedArticle && (
                            <button
                              type="button"
                              onClick={() => onToggleFeaturedArticle(article.id)}
                              className="px-2.5 py-1 bg-amber-400/20 hover:bg-amber-400 text-amber-300 hover:text-slate-900 border border-amber-400/30 rounded-lg text-[11px] font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1"
                            >
                              <Star size={11} className="fill-current" />
                              <span>Feature</span>
                            </button>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: YOUTUBE FEATURED VIDEO (Single item rule) */}
          {featuredTab === 'youtube' && (
            <div className="space-y-4">
              <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-xs text-white/80 flex items-center justify-between">
                <div>
                  <span className="font-bold text-amber-300">Watch &amp; Cook Main Video:</span> Only 1 video can be featured at a time. Selecting a new video automatically replaces the current one.
                </div>
              </div>

              {featuredVideo ? (
                <div className="bg-white/10 border border-amber-400/40 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-24 h-16 rounded-xl overflow-hidden bg-black/20 shrink-0 border border-white/20 relative">
                      <img
                        src={featuredVideo.thumbnail}
                        alt={featuredVideo.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] font-mono px-1 py-0.2 rounded font-bold">
                        {featuredVideo.duration}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold bg-amber-400 text-slate-900 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Active Watch &amp; Cook Video
                        </span>
                        <span className="text-xs text-white/60">• {featuredVideo.series}</span>
                      </div>
                      <h4 className="font-serif font-bold text-base text-white truncate max-w-lg">
                        {featuredVideo.title}
                      </h4>
                      <p className="text-xs text-white/70 line-clamp-1 mt-0.5">
                        {featuredVideo.description}
                      </p>
                      <p className="text-[11px] text-white/50 mt-1">
                        Published {featuredVideo.publishedAt}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <button
                      type="button"
                      onClick={() => onEditVideo(featuredVideo)}
                      className="px-3 py-1.5 bg-white/15 hover:bg-white/25 rounded-xl text-xs font-bold text-white transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit2 size={13} />
                      <span>Edit Video</span>
                    </button>
                    {onToggleFeaturedVideo && (
                      <button
                        type="button"
                        onClick={() => onToggleFeaturedVideo(featuredVideo.id)}
                        className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-red-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <X size={13} />
                        <span>Remove Featured</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-white/60 bg-white/5 rounded-xl border border-white/10">
                  No video is currently set as the featured masterclass. Click the star icon next to any video below to feature it.
                </div>
              )}

              {/* Quick switch to another video */}
              {videos.filter((v) => !v.featured && !v.archived && !v.draft).length > 0 && (
                <div className="space-y-2 pt-1">
                  <p className="text-xs font-bold text-white/60 uppercase tracking-wider">
                    Quick-Select Other Videos to Feature:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {videos
                      .filter((v) => !v.featured && !v.archived && !v.draft)
                      .slice(0, 3)
                      .map((video) => (
                        <div
                          key={video.id}
                          className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-2.5 flex items-center justify-between gap-3 transition-colors"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={video.thumbnail}
                              alt={video.title}
                              className="w-12 h-8 rounded-lg object-cover shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-white truncate">{video.title}</p>
                              <p className="text-[10px] text-white/50">{video.series}</p>
                            </div>
                          </div>
                          {onToggleFeaturedVideo && (
                            <button
                              type="button"
                              onClick={() => onToggleFeaturedVideo(video.id)}
                              className="px-2.5 py-1 bg-amber-400/20 hover:bg-amber-400 text-amber-300 hover:text-slate-900 border border-amber-400/30 rounded-lg text-[11px] font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1"
                            >
                              <Star size={11} className="fill-current" />
                              <span>Feature</span>
                            </button>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl border border-[#e6e2dc] overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f6f3] text-[#525252] text-[11px] font-bold uppercase tracking-wider border-b border-[#e6e2dc]">
                <th className="py-3.5 px-6">Title</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4 text-center">Featured</th>
                <th className="py-3.5 px-4">Author</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eeeae4] text-xs">
              {paginatedItems.length > 0 ? (
                paginatedItems.map((item) => (
                  <tr
                    key={`${item.type}-${item.id}`}
                    className={`hover:bg-[#fbf9f6] transition-colors ${
                      item.archived ? 'bg-[#fcfbf9] opacity-75' : item.featured ? 'bg-amber-50/35' : ''
                    }`}
                  >
                    {/* Title + Thumbnail + ID */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-[#e6e2dc]">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-[#1b1c1c] leading-snug">
                            {item.title}
                          </p>
                          <p className="text-[11px] text-gray-400 font-mono mt-0.5">
                            ID: {item.displayId}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Type Tag */}
                    <td className="py-4 px-4">
                      <span className="inline-block bg-[#f0ede8] text-[#4a4a4a] text-xs font-semibold px-3 py-1 rounded-full">
                        {item.type}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4 text-[#4a4a4a] font-medium">
                      {item.category}
                    </td>

                    {/* Featured Star Toggle */}
                    <td className="py-4 px-4 text-center">
                      {item.type === 'Recipe' ? (
                        <button
                          onClick={() => onToggleFeaturedRecipe && onToggleFeaturedRecipe(item.id)}
                          className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                            item.featured
                              ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
                              : 'text-gray-300 hover:text-amber-400 hover:bg-gray-100'
                          }`}
                          title={item.featured ? 'Featured on Homepage (Click to Remove)' : 'Feature on Homepage (Max 4)'}
                        >
                          <Star size={16} className={item.featured ? 'fill-amber-400 text-amber-500' : ''} />
                        </button>
                      ) : item.type === 'Blog' ? (
                        <button
                          onClick={() => onToggleFeaturedArticle && onToggleFeaturedArticle(item.id)}
                          className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                            item.featured
                              ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
                              : 'text-gray-300 hover:text-amber-400 hover:bg-gray-100'
                          }`}
                          title={item.featured ? 'Featured Hero Blog Article (Click to Remove)' : 'Feature as Blog Hero (Only 1 item, replaces current)'}
                        >
                          <Star size={16} className={item.featured ? 'fill-amber-400 text-amber-500' : ''} />
                        </button>
                      ) : item.type === 'YouTube' ? (
                        <button
                          onClick={() => onToggleFeaturedVideo && onToggleFeaturedVideo(item.id)}
                          className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                            item.featured
                              ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
                              : 'text-gray-300 hover:text-amber-400 hover:bg-gray-100'
                          }`}
                          title={item.featured ? 'Featured Watch & Cook Video (Click to Remove)' : 'Feature as Main Video Episode (Only 1 item, replaces current)'}
                        >
                          <Star size={16} className={item.featured ? 'fill-amber-400 text-amber-500' : ''} />
                        </button>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>

                    {/* Author */}
                    <td className="py-4 px-4 text-[#4a4a4a] font-medium">
                      {item.author}
                    </td>

                    {/* Status Dot */}
                    <td className="py-4 px-4">
                      {item.archived ? (
                        <span className="inline-flex items-center gap-1.5 font-bold text-xs text-gray-700 bg-gray-100 px-2.5 py-0.5 rounded-full border border-gray-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
                          Archived
                        </span>
                      ) : item.draft ? (
                        <span className="inline-flex items-center gap-1.5 font-bold text-xs text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                          Draft
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 font-bold text-xs text-emerald-900 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                          Published
                        </span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 text-[#666666]">
                      {item.date}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View Live */}
                        {item.type === 'Recipe' && !item.archived && (
                          <button
                            onClick={() => onViewLiveRecipe(item.raw as Recipe)}
                            className="p-1.5 text-gray-500 hover:text-[#24331e] hover:bg-[#f4f1eb] rounded-lg transition-colors cursor-pointer"
                            title="View Live on Site"
                          >
                            <Eye size={16} />
                          </button>
                        )}

                        {/* Edit */}
                        <button
                          onClick={() => {
                            if (item.type === 'Recipe') onEditRecipe(item.raw as Recipe);
                            if (item.type === 'Blog') onEditArticle(item.raw as BlogArticle);
                            if (item.type === 'YouTube') onEditVideo(item.raw as YouTubeVideo);
                          }}
                          className="p-1.5 text-gray-600 hover:text-[#24331e] hover:bg-[#f4f1eb] rounded-lg transition-colors cursor-pointer"
                          title="Edit Item"
                        >
                          <Edit2 size={16} />
                        </button>

                        {/* Archive / Unarchive */}
                        <button
                          onClick={() => {
                            if (item.type === 'Recipe') onToggleArchiveRecipe(item.id);
                            if (item.type === 'Blog') onToggleArchiveArticle(item.id);
                            if (item.type === 'YouTube') onToggleArchiveVideo(item.id);
                          }}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            item.archived
                              ? 'text-amber-700 bg-amber-50 hover:bg-amber-100'
                              : 'text-gray-500 hover:text-amber-700 hover:bg-amber-50'
                          }`}
                          title={item.archived ? 'Unarchive (Make Visible)' : 'Archive (Hide from Public)'}
                        >
                          {item.archived ? <ArchiveRestore size={16} /> : <Archive size={16} />}
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() =>
                            setItemToDelete({
                              id: item.id,
                              title: item.title,
                              type: item.type,
                            })
                          }
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Permanently"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    <p className="text-base font-semibold">No content items found</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Try adjusting your type or status filters.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="p-4 bg-[#f8f6f3] border-t border-[#e6e2dc] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#525252]">
          <span>
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, sortedItems.length)} of {sortedItems.length} entries
          </span>

          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="px-3 py-1.5 rounded-lg border border-[#d8d3cb] bg-white hover:bg-[#f4f1eb] text-xs font-semibold disabled:opacity-40 cursor-pointer"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg font-bold text-xs cursor-pointer ${
                  currentPage === page
                    ? 'bg-[#1b1c1c] text-white'
                    : 'bg-white border border-[#d8d3cb] text-[#1b1c1c] hover:bg-[#f4f1eb]'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="px-3 py-1.5 rounded-lg border border-[#d8d3cb] bg-white hover:bg-[#f4f1eb] text-xs font-semibold disabled:opacity-40 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={Boolean(itemToDelete)}
        onClose={() => setItemToDelete(null)}
        onConfirm={() => {
          if (itemToDelete) {
            if (itemToDelete.type === 'Recipe') onDeleteRecipe(itemToDelete.id);
            if (itemToDelete.type === 'Blog') onDeleteArticle(itemToDelete.id);
            if (itemToDelete.type === 'YouTube') onDeleteVideo(itemToDelete.id);
            setItemToDelete(null);
          }
        }}
        title={`Delete ${itemToDelete?.type || 'Content'}`}
        itemName={itemToDelete?.title || ''}
        itemType={itemToDelete?.type?.toLowerCase() || 'item'}
      />
    </div>
  );
};
