import React, { useState } from 'react';
import {
  Search,
  Clock,
  ArrowRight,
  ArrowLeft,
  Mail,
  ChevronLeft,
  ChevronRight,
  Share2,
  Bookmark,
  Printer,
  Sparkles,
  Check,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BLOG_ARTICLES } from '../data/recipesData';
import { BlogArticle } from '../types';

interface BlogViewProps {
  articles?: BlogArticle[];
  onSubscribeSubmit?: (email: string) => void;
}

export const BlogView: React.FC<BlogViewProps> = ({ articles, onSubscribeSubmit }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [copiedShare, setCopiedShare] = useState(false);

  const availableArticles = (articles || BLOG_ARTICLES).filter(a => !a.archived && !a.draft);

  const filterCategories = ['All', 'Kitchen Tips', 'Sourcing', 'Technique', 'Equipment', 'Seasonal'];

  // Dynamically calculate topic counts based on real article data in the database
  const topicCounts = React.useMemo(() => {
    const countsMap: Record<string, number> = {};
    availableArticles.forEach((article) => {
      if (article.category) {
        // Standardize category key
        const catKey = article.category.trim();
        countsMap[catKey] = (countsMap[catKey] || 0) + 1;
      }
    });

    const standardTopics = ['Kitchen Tips', 'Sourcing', 'Technique', 'Seasonal', 'Equipment'];
    // Merge standard categories with any custom user-added categories
    const allCategoryKeys = Array.from(new Set([...standardTopics, ...Object.keys(countsMap)]));

    return allCategoryKeys
      .map((catName) => ({
        name: catName,
        count: countsMap[catName] || 0,
      }))
      .filter((t) => t.count > 0 || standardTopics.includes(t.name));
  }, [availableArticles]);

  // Filter articles based on search & selected category
  const filteredArticles = availableArticles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'All' ||
      article.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const explicitFeatured = availableArticles.find((a) => a.featured);
  const featuredArticle =
    (selectedCategory === 'All' && !searchQuery && explicitFeatured)
      ? explicitFeatured
      : filteredArticles.find((a) => a.featured) || filteredArticles[0] || availableArticles[0];

  const gridArticles = filteredArticles.filter((a) => a.id !== featuredArticle?.id);

  // Dynamic Pagination Logic
  const POSTS_PER_PAGE = 4;
  const totalPages = Math.max(1, Math.ceil(gridArticles.length / POSTS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * POSTS_PER_PAGE;
  const paginatedArticles = gridArticles.slice(startIndex, startIndex + POSTS_PER_PAGE);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const blogHeader = document.getElementById('blog-grid-header');
    if (blogHeader) {
      blogHeader.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      if (onSubscribeSubmit) {
        onSubscribeSubmit(newsletterEmail);
      }
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setNewsletterEmail('');
      }, 4000);
    }
  };

  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleShare = () => {
    try {
      if (typeof window !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href);
      }
    } catch (e) {
      console.warn('Clipboard write blocked:', e);
    }
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 3000);
  };

  // If viewing a single article in reading view
  if (selectedArticle) {
    const relatedArticles = availableArticles.filter((a) => a.id !== selectedArticle.id).slice(0, 3);
    const isBookmarked = bookmarkedIds.includes(selectedArticle.id);

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
        className="bg-dala-cream min-h-screen"
      >
        {/* Full-width Article Hero */}
        <section className="relative w-full h-[480px] sm:h-[580px] bg-slate-900 overflow-hidden flex items-end">
          <motion.img
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            src={selectedArticle.image}
            alt={selectedArticle.title}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          {/* Top Bar inside Hero */}
          <div className="absolute top-6 left-0 right-0 max-w-7xl mx-auto px-6 sm:px-8 flex justify-between items-center z-10">
            <motion.button
              whileHover={{ scale: 1.04, x: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                setSelectedArticle(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-black/40 hover:bg-black/70 backdrop-blur-md text-white font-bold text-xs uppercase tracking-widest rounded-full transition-all cursor-pointer border border-white/20 group"
            >
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
              All Articles
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={(e) => toggleBookmark(selectedArticle.id, e)}
              className={`inline-flex items-center gap-2 px-4 py-2 backdrop-blur-md text-xs font-bold uppercase tracking-wider rounded-full transition-all cursor-pointer border ${
                isBookmarked
                  ? 'bg-dala-green text-white border-dala-green'
                  : 'bg-black/40 hover:bg-black/70 text-white border-white/20'
              }`}
            >
              <Bookmark size={14} className={isBookmarked ? 'fill-white' : ''} />
              {isBookmarked ? 'Bookmarked' : 'Save Article'}
            </motion.button>
          </div>

          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 pb-12 w-full text-center sm:text-left"
            style={{ paddingLeft: '32px', marginLeft: '42.5px' }}
          >
            <span className="inline-block px-3.5 py-1 bg-dala-green text-white font-bold text-[10px] uppercase tracking-widest rounded-full mb-4 shadow-xs">
              {selectedArticle.category}
            </span>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-white mb-4 leading-tight drop-shadow-md">
              {selectedArticle.title}
            </h1>

            <p className="font-signature text-2xl sm:text-3xl text-[#e2c1a4] mb-6">
              The Science of Scratch &amp; The Soul of Home
            </p>

            {/* Author Meta */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-white/90 text-xs sm:text-sm pt-2 border-t border-white/15">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-dala-green shadow-xs">
                  <img
                    src="/images/achieng.png"
                    alt="Achieng"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-bold text-white text-xs sm:text-sm">By Achieng</p>
                  <p className="text-[11px] text-white/70">Recipe Developer &amp; Food Scientist</p>
                </div>
              </div>

              <span className="hidden sm:inline text-white/40">•</span>
              <span className="text-white/80">{selectedArticle.date}</span>
              <span className="text-white/40">•</span>
              <span className="text-white/80 flex items-center gap-1">
                <Clock size={13} /> {selectedArticle.readTime}
              </span>
            </div>
          </motion.div>
        </section>

        {/* Main Article Body & Sidebar Grid */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Sticky Action Sidebar (Desktop) */}
            <aside className="hidden lg:block lg:col-span-1">
              <div className="sticky top-28 flex flex-col items-center gap-5 text-gray-500">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShare}
                  title="Share Article"
                  className="w-11 h-11 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-dala-green hover:text-white hover:border-dala-green transition-colors shadow-2xs cursor-pointer group"
                >
                  <Share2 size={18} className="group-hover:scale-110 transition-transform" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => toggleBookmark(selectedArticle.id, e)}
                  title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Article'}
                  className={`w-11 h-11 rounded-full border flex items-center justify-center transition-colors shadow-2xs cursor-pointer group ${
                    isBookmarked
                      ? 'bg-dala-green text-white border-dala-green'
                      : 'bg-white border-gray-200 text-gray-500 hover:bg-dala-green hover:text-white hover:border-dala-green'
                  }`}
                >
                  <Bookmark
                    size={18}
                    className={`group-hover:scale-110 transition-transform ${
                      isBookmarked ? 'fill-white' : ''
                    }`}
                  />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    try {
                      if (typeof window !== 'undefined') window.print();
                    } catch (e) {
                      console.warn('Print function blocked:', e);
                    }
                  }}
                  title="Print Article"
                  className="w-11 h-11 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-dala-green hover:text-white hover:border-dala-green transition-colors shadow-2xs cursor-pointer group"
                >
                  <Printer size={18} className="group-hover:scale-110 transition-transform" />
                </motion.button>

                {copiedShare && (
                  <span className="text-[10px] font-bold text-dala-green bg-white border border-dala-green/30 px-2 py-1 rounded-md shadow-2xs animate-in fade-in">
                    Copied!
                  </span>
                )}

                <div className="h-12 w-px bg-gray-200 my-2" />
                <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase -rotate-90 origin-center whitespace-nowrap mt-4">
                  SHARE
                </span>
              </div>
            </aside>

            {/* Main Article Content (lg:col-span-8 or centered) */}
            <motion.main
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.2 }}
              className="lg:col-span-8 lg:col-start-2 bg-white rounded-none p-6 sm:p-12 border border-gray-200/80 shadow-2xs"
            >
              {/* Excerpt Lead Paragraph */}
              <p className="text-lg sm:text-xl font-serif text-dala-text leading-relaxed italic border-l-4 border-dala-green pl-6 py-1 mb-8 bg-dala-cream/40 rounded-none">
                "{selectedArticle.excerpt}"
              </p>

              {/* Main Content Paragraphs */}
              <div className="space-y-6 text-dala-text text-base sm:text-lg leading-relaxed font-sans">
                {selectedArticle.content.map((paragraph, idx) => {
                  if (idx === 0) {
                    // First paragraph with elegant drop cap
                    const firstLetter = paragraph.charAt(0);
                    const restOfPara = paragraph.slice(1);
                    return (
                      <p key={idx} className="leading-relaxed">
                        <span className="float-left text-5xl sm:text-6xl font-serif font-bold text-dala-green pr-3 pt-1 leading-none">
                          {firstLetter}
                        </span>
                        {restOfPara}
                      </p>
                    );
                  }
                  return <p key={idx}>{paragraph}</p>;
                })}
              </div>

              {/* Bento Grid Concept Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-10">
                <motion.div
                  whileHover={{ y: -3 }}
                  className="p-6 bg-dala-cream/60 rounded-none border border-dala-green/20"
                >
                  <div className="w-10 h-10 rounded-full bg-dala-green/10 text-dala-green flex items-center justify-center mb-3">
                    <Sparkles size={20} />
                  </div>
                  <h3 className="font-serif font-bold text-base text-dala-text mb-1">
                    Fermentation Dynamics
                  </h3>
                  <p className="text-xs text-dala-text-light leading-relaxed">
                    Lactic acid bacteria produce organic acids that impart a delicate sour tang while strengthening gluten structures.
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ y: -3 }}
                  className="p-6 bg-dala-cream/60 rounded-none border border-dala-green/20"
                >
                  <div className="w-10 h-10 rounded-full bg-[#634833]/10 text-[#634833] flex items-center justify-center mb-3">
                    <BookOpen size={20} />
                  </div>
                  <h3 className="font-serif font-bold text-base text-dala-text mb-1">
                    Precision Technique
                  </h3>
                  <p className="text-xs text-dala-text-light leading-relaxed">
                    Temperature control and flour-to-water ratios are the primary levers for controlling wild yeast vigor and dough rise.
                  </p>
                </motion.div>
              </div>

              {/* Featured Figure Illustration / Photo */}
              <figure className="my-10">
                <div className="w-full h-72 sm:h-96 rounded-none overflow-hidden bg-gray-100 shadow-2xs">
                  <img
                    src={selectedArticle.image}
                    alt={selectedArticle.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <figcaption className="text-center text-xs text-gray-400 font-medium mt-3 italic">
                  Figure 1. Culinary prep and active scientific transformation in the DalaKitchen laboratory.
                </figcaption>
              </figure>

              {/* Pullquote */}
              <blockquote className="my-10 p-6 sm:p-8 bg-[#E7ECE1] rounded-none border border-dala-green/30 text-center">
                <p className="font-signature text-2xl sm:text-3xl text-dala-green mb-3">
                  "Time is a cook's most important ingredient. It transforms simple elements into soul-nourishing meals."
                </p>
                <footer className="text-xs font-bold uppercase tracking-widest text-dala-text">
                  — The DalaKitchen Manifesto
                </footer>
              </blockquote>

              {/* Pro Tip Chip */}
              <div className="p-4 bg-dala-green/10 border border-dala-green/30 rounded-none flex items-start gap-3 mb-10">
                <CheckCircle2 size={20} className="text-dala-green flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-dala-green mb-0.5">
                    Chef's Pro Tip
                  </h4>
                  <p className="text-xs text-dala-text-light leading-relaxed">
                    Always record room temperature and humidity when experimenting with wild yeast or long fermentations to ensure reproducible results.
                  </p>
                </div>
              </div>

              {/* Author Bio Card */}
              <div className="pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-dala-green/40 flex-shrink-0">
                    <img
                      src="/images/achieng.png"
                      alt="Achieng"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-base text-dala-text">Written by Achieng</h4>
                    <p className="text-xs text-dala-text-light">
                      Founder of DalaKitchen, Recipe Developer &amp; Food Chemist based in Nairobi.
                    </p>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    setSelectedArticle(null);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-2.5 bg-dala-green text-white text-xs font-bold uppercase tracking-wider rounded-none hover:bg-dala-green-dark transition-colors cursor-pointer flex-shrink-0"
                >
                  Back to All Articles
                </motion.button>
              </div>
            </motion.main>
          </div>

          {/* Related Articles ("Further Study") */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-16 pt-12 border-t border-gray-200"
          >
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-dala-text uppercase tracking-wider">
                  FURTHER STUDY
                </h2>
                <p className="text-xs sm:text-sm text-dala-text-light font-sans mt-1">
                  Deepen your knowledge of the culinary sciences and scratch cooking techniques.
                </p>
              </div>

              <motion.button
                whileHover={{ x: 2 }}
                onClick={() => {
                  setSelectedArticle(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-xs font-bold uppercase tracking-widest text-dala-green hover:text-dala-green-dark inline-flex items-center gap-1 cursor-pointer"
              >
                View All Articles <ArrowRight size={14} />
              </motion.button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedArticles.map((rel, idx) => (
                <motion.div
                  key={rel.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  whileHover={{ y: -5 }}
                  onClick={() => {
                    setSelectedArticle(rel);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-white rounded-none overflow-hidden border border-gray-200/80 shadow-2xs hover:shadow-md transition-all duration-300 cursor-pointer group flex flex-col h-full"
                >
                  <div className="h-44 w-full overflow-hidden bg-gray-100 relative">
                    <img
                      src={rel.image}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <span className="absolute top-3 left-3 bg-white/90 text-dala-green text-[10px] font-bold px-2.5 py-0.5 uppercase tracking-wider rounded-none shadow-2xs">
                      {rel.category}
                    </span>
                  </div>

                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="font-serif font-bold text-base text-dala-text group-hover:text-dala-green transition-colors mb-2 leading-snug line-clamp-2">
                      {rel.title}
                    </h3>
                    <p className="text-xs text-dala-text-light line-clamp-2 mb-4 leading-relaxed">
                      {rel.excerpt}
                    </p>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-dala-green mt-auto">
                      Read Article <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-dala-cream min-h-screen py-10 sm:py-14"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Header Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-10 max-w-3xl mx-auto"
        >
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-dala-text mb-2 tracking-wide uppercase">
            THE DALAKITCHEN BLOG
          </h1>
          <p className="font-signature text-2xl sm:text-3xl text-dala-green">
            The Science of Scratch &amp; The Soul of Home
          </p>
        </motion.div>

        {/* Layout: Main Grid (Left 8-9 cols) & Sidebar (Right 3-4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Content Area (8 Cols) */}
          <div className="lg:col-span-8 space-y-10" id="blog-grid-header">
            {/* Search and Filters Bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-gray-200"
            >
              {/* Search Box */}
              <div className="relative w-full sm:w-80">
                <Search
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search the blog..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-none text-xs sm:text-sm text-dala-text placeholder:text-gray-400 focus:outline-none focus:border-dala-green focus:ring-1 focus:ring-dala-green transition-colors"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 hide-scrollbar">
                {filterCategories.map((cat) => {
                  const active = selectedCategory === cat;
                  return (
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      key={cat}
                      onClick={() => handleCategorySelect(cat)}
                      className={`flex-shrink-0 px-4 py-2 rounded-none text-xs font-bold transition-colors cursor-pointer ${
                        active
                          ? 'bg-dala-green text-white shadow-2xs'
                          : 'bg-white border border-gray-200 text-dala-text-light hover:border-dala-green hover:text-dala-green'
                      }`}
                    >
                      {cat}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* Featured Post Card (Only shown on Page 1) */}
            {safeCurrentPage === 1 && featuredArticle && (
              <motion.article
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.1 }}
                whileHover={{ y: -4 }}
                onClick={() => {
                  setSelectedArticle(featuredArticle);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-white rounded-none overflow-hidden border border-gray-200/80 shadow-2xs hover:shadow-md transition-all duration-300 cursor-pointer group"
              >
                <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden bg-gray-100">
                  <img
                    src={featuredArticle.image}
                    alt={featuredArticle.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <span className="absolute top-4 left-4 bg-dala-green/90 text-white text-[11px] font-bold px-3 py-1 uppercase tracking-wider rounded-none shadow-2xs">
                    Featured
                  </span>
                </div>

                <div className="p-6 sm:p-8">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-dala-green block mb-2">
                    {featuredArticle.category}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-dala-text group-hover:text-dala-green transition-colors mb-3 leading-tight">
                    {featuredArticle.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-dala-text-light line-clamp-3 mb-6 leading-relaxed">
                    {featuredArticle.excerpt}
                  </p>

                  <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-dala-text border-b-2 border-dala-text pb-1 group-hover:text-dala-green group-hover:border-dala-green transition-colors">
                    Read Article <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </motion.article>
            )}

            {/* Grid of Articles */}
            {paginatedArticles.length > 0 ? (
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {paginatedArticles.map((article, idx) => (
                  <motion.article
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.35, delay: idx * 0.05 }}
                    whileHover={{ y: -4 }}
                    key={article.id}
                    onClick={() => {
                      setSelectedArticle(article);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="bg-white rounded-none overflow-hidden border border-gray-200/80 shadow-2xs hover:shadow-md transition-all duration-300 cursor-pointer group flex flex-col h-full"
                  >
                    <div className="aspect-[16/10] w-full overflow-hidden bg-gray-100 relative">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    </div>

                    <div className="p-6 flex flex-col flex-grow">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-dala-green block mb-2">
                        {article.category}
                      </span>
                      <h3 className="font-serif font-bold text-lg sm:text-xl text-dala-text group-hover:text-dala-green transition-colors mb-2 leading-snug">
                        {article.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-dala-text-light line-clamp-3 mb-6 flex-grow leading-relaxed">
                        {article.excerpt}
                      </p>

                      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-dala-text group-hover:text-dala-green transition-colors mt-auto">
                        Read Article <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-16 text-center bg-white rounded-none border border-gray-200/80 p-8"
              >
                <p className="text-sm font-medium text-gray-500 mb-2">No articles found.</p>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                    setCurrentPage(1);
                  }}
                  className="px-4 py-2 bg-dala-green text-white text-xs font-bold uppercase tracking-wider rounded-none"
                >
                  Reset Filters
                </motion.button>
              </motion.div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-200"
              >
                <p className="text-xs text-dala-text-light">
                  Showing <span className="font-bold text-dala-text">{startIndex + 1}</span>–
                  <span className="font-bold text-dala-text">
                    {Math.min(startIndex + POSTS_PER_PAGE, gridArticles.length)}
                  </span>{' '}
                  of <span className="font-bold text-dala-text">{gridArticles.length}</span> articles
                </p>

                <div className="flex justify-center items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    disabled={safeCurrentPage <= 1}
                    onClick={() => handlePageChange(safeCurrentPage - 1)}
                    className="w-9 h-9 rounded-none border border-gray-200 bg-white flex items-center justify-center text-dala-text hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                    title="Previous Page"
                  >
                    <ChevronLeft size={16} />
                  </motion.button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-9 h-9 rounded-none font-bold text-xs flex items-center justify-center transition-colors cursor-pointer ${
                        safeCurrentPage === pageNum
                          ? 'bg-dala-green text-white shadow-2xs'
                          : 'bg-white border border-gray-200 text-dala-text hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </motion.button>
                  ))}

                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    disabled={safeCurrentPage >= totalPages}
                    onClick={() => handlePageChange(safeCurrentPage + 1)}
                    className="w-9 h-9 rounded-none border border-gray-200 bg-white flex items-center justify-center text-dala-text hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                    title="Next Page"
                  >
                    <ChevronRight size={16} />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar Area (4 Cols) */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Let's Stay In Touch Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.15 }}
              className="bg-[#E7ECE1] rounded-none p-6 sm:p-8 border border-dala-green/20 text-center relative overflow-hidden shadow-2xs"
            >
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 rounded-none bg-white/80 flex items-center justify-center text-dala-green shadow-2xs">
                  <Mail size={22} />
                </div>
              </div>

              <h3 className="font-serif font-bold text-xl uppercase tracking-wider text-dala-text mb-2">
                LET'S STAY IN TOUCH
              </h3>
              <p className="text-xs sm:text-sm text-dala-text-light mb-6 leading-relaxed">
                Get new recipes and kitchen science tips delivered straight to your inbox.
              </p>

              {subscribed ? (
                <div className="bg-dala-green text-white p-3 rounded-none text-xs font-bold animate-in fade-in flex items-center justify-center gap-2">
                  <Check size={16} /> Thank you for subscribing!
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Your email address"
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-none text-xs sm:text-sm text-dala-text placeholder:text-gray-400 focus:outline-none focus:border-dala-green focus:ring-1 focus:ring-dala-green"
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full py-3 bg-[#634833] text-white font-bold text-xs uppercase tracking-widest rounded-none hover:bg-[#523b28] transition-colors cursor-pointer shadow-2xs"
                  >
                    Subscribe
                  </motion.button>
                </form>
              )}
            </motion.div>

            {/* Explore Topics */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.2 }}
              className="bg-white rounded-none p-6 sm:p-8 border border-gray-200/80 shadow-2xs"
            >
              <h3 className="font-serif font-bold text-xl uppercase tracking-wider text-dala-text mb-6 pb-3 border-b border-gray-100">
                EXPLORE TOPICS
              </h3>

              <ul className="space-y-4">
                {topicCounts.map((topic) => (
                  <li key={topic.name}>
                    <motion.button
                      whileHover={{ x: 3 }}
                      onClick={() => {
                        setSelectedCategory(topic.name);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="w-full flex justify-between items-center text-xs font-bold uppercase tracking-wider text-dala-text hover:text-dala-green transition-colors cursor-pointer group py-1"
                    >
                      <span className="group-hover:translate-x-1 transition-transform">
                        {topic.name}
                      </span>
                      <span className="bg-gray-100 group-hover:bg-dala-green group-hover:text-white px-2.5 py-1 rounded-none text-[11px] font-bold text-gray-600 transition-colors">
                        {topic.count}
                      </span>
                    </motion.button>
                  </li>
                ))}
              </ul>
            </motion.div>
          </aside>
        </div>
      </div>
    </motion.div>
  );
};
