import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Menu, X, Clock, ArrowRight, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Recipe, RecipeCategory, SiteSettings } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: RecipeCategory | null) => void;
  onOpenSubscribe: () => void;
  savedRecipesCount?: number;
  onOpenSavedRecipes?: () => void;
  recipes?: Recipe[];
  onSelectRecipe?: (recipe: Recipe) => void;
  siteSettings?: SiteSettings;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  setSelectedCategory,
  onOpenSubscribe,
  recipes = [],
  onSelectRecipe,
  siteSettings,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [recipesDropdownOpen, setRecipesDropdownOpen] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const fbUrl = siteSettings?.facebookUrl || 'https://www.facebook.com/share/1BBMxx2UTw/';
  const igUrl = siteSettings?.instagramUrl || 'https://www.instagram.com/dala.kitchen?utm_source=qr&igsh=M21jcnQzbDZkYzJx';
  const ytUrl = siteSettings?.youtubeUrl || 'https://youtube.com';
  const pinUrl = siteSettings?.pinterestUrl || 'https://pinterest.com';
  const ttUrl = siteSettings?.tiktokUrl || 'https://tiktok.com';

  const categories: RecipeCategory[] = [
    'Breakfast',
    'Lunch',
    'Dinner',
    'Baking',
    'Air Fryer',
    'Sourdough',
    'Kenyan Recipes',
  ];

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setSearchExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-focus input when search expanded
  useEffect(() => {
    if (searchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchExpanded]);

  const handleCategoryClick = (cat: RecipeCategory) => {
    setSelectedCategory(cat);
    setActiveTab('recipes');
    setRecipesDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const handleNavClick = (tab: string) => {
    setActiveTab(tab);
    if (tab !== 'recipes') {
      setSelectedCategory(null);
    }
    setMobileMenuOpen(false);
  };

  const handleScrollToFooterNewsletter = () => {
    setMobileMenuOpen(false);
    const footerNewsletterEl = document.getElementById('footer-newsletter');
    if (footerNewsletterEl) {
      footerNewsletterEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        const inputEl = document.getElementById('footer-newsletter-input') as HTMLInputElement | null;
        if (inputEl) {
          inputEl.focus();
          inputEl.classList.add('ring-2', 'ring-dala-gold');
          setTimeout(() => {
            inputEl.classList.remove('ring-2', 'ring-dala-gold');
          }, 2500);
        }
      }, 500);
    } else if (onOpenSubscribe) {
      onOpenSubscribe();
    }
  };

  // Filter recipes for live dropdown
  const searchResults = searchQuery.trim()
    ? recipes
        .filter(
          (r) =>
            r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  return (
    <header className="bg-dala-cream/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40 shadow-2xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex justify-between items-stretch">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center py-3 cursor-pointer group"
          onClick={() => handleNavClick('home')}
        >
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBz7JEDgKCPIKFgy3Gav7l9pEUVX4wa0h9vP-nIfpBR1-HGUdHdWBfVd7cYzMusFLM0UGlW3YI1GoBz2Xtei9YOsiLv8IRIxOgJ7XIi47KtxemiqBsIT-0apni9puHrz2iSMPlmPIj-WLpsF6Baxbk3H88d2GuRU0MuFPrSxfIA70MbCynJeOXazLal3frFxzv_mH5wQ5y-2s13jzKhgQzgBng-q9egV-XRLuzt_4OwmT9XouHYPw_7lxkWckq_ZViWog"
            alt="Dala Kitchen Logo"
            className="h-10 sm:h-12 w-auto object-contain group-hover:opacity-90 transition-opacity"
          />
        </motion.div>

        <div className="flex flex-col justify-between py-3">
          {/* Top Row: Socials */}
          <div className="hidden md:flex justify-end space-x-4 text-xs text-dala-text mb-2">
            <motion.a
              whileHover={{ scale: 1.15, y: -1 }}
              whileTap={{ scale: 0.9 }}
              href={ytUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-dala-green transition-colors"
              aria-label="YouTube"
            >
              <i className="fa-brands fa-youtube"></i>
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.15, y: -1 }}
              whileTap={{ scale: 0.9 }}
              href={igUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-dala-green transition-colors"
              aria-label="Instagram"
            >
              <i className="fa-brands fa-instagram"></i>
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.15, y: -1 }}
              whileTap={{ scale: 0.9 }}
              href={pinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-dala-green transition-colors"
              aria-label="Pinterest"
            >
              <i className="fa-brands fa-pinterest"></i>
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.15, y: -1 }}
              whileTap={{ scale: 0.9 }}
              href={ttUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-dala-green transition-colors"
              aria-label="TikTok"
            >
              <i className="fa-brands fa-tiktok"></i>
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.15, y: -1 }}
              whileTap={{ scale: 0.9 }}
              href={fbUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-dala-green transition-colors"
              aria-label="Facebook"
            >
              <i className="fa-brands fa-facebook-f"></i>
            </motion.a>
          </div>

          {/* Main Nav Row */}
          <div className="flex items-center space-x-6 sm:space-x-8">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8 text-xs font-bold tracking-widest uppercase">
              <button
                onClick={() => handleNavClick('home')}
                className={`transition-colors py-1 relative ${
                  activeTab === 'home' ? 'text-dala-green border-b-2 border-dala-green' : 'hover:text-dala-green'
                }`}
              >
                Home
              </button>

              {/* Recipes Dropdown */}
              <div className="relative" onMouseLeave={() => setRecipesDropdownOpen(false)}>
                <button
                  onClick={() => handleNavClick('recipes')}
                  onMouseEnter={() => setRecipesDropdownOpen(true)}
                  className={`flex items-center gap-1 transition-colors py-1 ${
                    activeTab === 'recipes' ? 'text-dala-green border-b-2 border-dala-green' : 'hover:text-dala-green'
                  }`}
                >
                  Recipes <ChevronDown size={12} className={`transition-transform duration-200 ${recipesDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {recipesDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="absolute top-full left-0 w-52 bg-white shadow-xl border border-gray-100 py-2 rounded-md z-50 overflow-hidden"
                    >
                      <button
                        onClick={() => {
                          setSelectedCategory(null);
                          setActiveTab('recipes');
                          setRecipesDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-wider text-dala-green hover:bg-gray-50 flex items-center justify-between transition-colors"
                      >
                        All Recipes <span className="text-[10px] text-gray-400">View All</span>
                      </button>
                      <div className="border-t border-gray-100 my-1"></div>
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => handleCategoryClick(cat)}
                          className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:text-dala-green hover:bg-gray-50 transition-colors capitalize font-semibold"
                        >
                          {cat}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={() => handleNavClick('blog')}
                className={`transition-colors py-1 ${
                  activeTab === 'blog' ? 'text-dala-green border-b-2 border-dala-green' : 'hover:text-dala-green'
                }`}
              >
                Blog
              </button>

              <button
                onClick={() => handleNavClick('youtube')}
                className={`transition-colors py-1 ${
                  activeTab === 'youtube' ? 'text-dala-green border-b-2 border-dala-green' : 'hover:text-dala-green'
                }`}
              >
                YouTube
              </button>

              

              <button
                onClick={() => handleNavClick('about')}
                className={`transition-colors py-1 ${
                  activeTab === 'about' ? 'text-dala-green border-b-2 border-dala-green' : 'hover:text-dala-green'
                }`}
              >
                About
              </button>

              

              <button
                onClick={() => handleNavClick('contact')}
                className={`transition-colors py-1 ${
                  activeTab === 'contact' ? 'text-dala-green border-b-2 border-dala-green' : 'hover:text-dala-green'
                }`}
              >
                Contact
              </button>
            </nav>

            {/* Actions: Inline Expandable Search & Subscribe */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Inline Search Container */}
              <div ref={searchContainerRef} className="relative hidden md:flex items-center">
                <AnimatePresence initial={false} mode="wait">
                  {searchExpanded ? (
                    <motion.div
                      key="search-bar"
                      initial={{ width: 40, opacity: 0 }}
                      animate={{ width: 240, opacity: 1 }}
                      exit={{ width: 40, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className="flex items-center bg-white border border-gray-300 focus-within:border-dala-green focus-within:ring-1 focus-within:ring-dala-green rounded-full px-3 py-1 shadow-xs"
                    >
                      <Search size={15} className="text-gray-400 flex-shrink-0 mr-2" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search recipes..."
                        className="w-full text-xs text-dala-text bg-transparent outline-none placeholder:text-gray-400 font-sans"
                      />
                      {searchQuery ? (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="text-gray-400 hover:text-gray-600 p-0.5 ml-1 cursor-pointer"
                          title="Clear search"
                        >
                          <X size={13} />
                        </button>
                      ) : (
                        <button
                          onClick={() => setSearchExpanded(false)}
                          className="text-gray-400 hover:text-gray-600 p-0.5 ml-1 cursor-pointer"
                          title="Close search"
                        >
                          <X size={13} />
                        </button>
                      )}
                    </motion.div>
                  ) : (
                    <motion.button
                      key="search-btn"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSearchExpanded(true)}
                      className="text-dala-text hover:text-dala-green transition-colors p-1.5 cursor-pointer flex items-center justify-center rounded-full hover:bg-black/5"
                      title="Search Recipes"
                      aria-label="Search recipes"
                    >
                      <Search size={18} />
                    </motion.button>
                  )}
                </AnimatePresence>

                {/* Floating Search Results Dropdown */}
                <AnimatePresence>
                  {searchExpanded && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-2 w-72 sm:w-88 bg-white rounded-xl shadow-xl border border-gray-200/90 overflow-hidden z-50 p-2 text-left"
                    >
                      {searchQuery.trim() === '' ? (
                        <div className="p-3">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                            Popular Searches
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {['Sourdough', 'Pilau', 'Air Fryer', 'Mahamri', 'Baking'].map((term) => (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                key={term}
                                onClick={() => setSearchQuery(term)}
                                className="px-2.5 py-1 bg-gray-100 hover:bg-dala-green hover:text-white rounded-md text-xs font-medium text-gray-700 transition-colors cursor-pointer"
                              >
                                {term}
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      ) : searchResults.length > 0 ? (
                        <div>
                          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 flex justify-between items-center border-b border-gray-100">
                            <span>{searchResults.length} Recipes Found</span>
                            <span
                              className="text-dala-green hover:underline cursor-pointer font-bold"
                              onClick={() => handleNavClick('recipes')}
                            >
                              View All
                            </span>
                          </div>
                          <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                            {searchResults.map((recipe) => (
                              <motion.div
                                whileHover={{ x: 3 }}
                                key={recipe.id}
                                onClick={() => {
                                  if (onSelectRecipe) onSelectRecipe(recipe);
                                  setSearchExpanded(false);
                                  setSearchQuery('');
                                }}
                                className="p-2.5 flex items-center gap-3 hover:bg-dala-cream/60 transition-colors cursor-pointer rounded-lg group"
                              >
                                <img
                                  src={recipe.image}
                                  alt={recipe.title}
                                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0 group-hover:scale-105 transition-transform"
                                />
                                <div className="flex-grow min-w-0">
                                  <h4 className="text-xs font-serif font-bold text-dala-text group-hover:text-dala-green truncate transition-colors">
                                    {recipe.title}
                                  </h4>
                                  <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-0.5">
                                    <span className="bg-dala-green/10 text-dala-green font-bold px-1.5 py-0.5 rounded-xs">
                                      {recipe.category}
                                    </span>
                                    <span className="flex items-center gap-0.5">
                                      <Clock size={10} /> {recipe.cookTime}
                                    </span>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 text-center">
                          <p className="text-xs text-gray-500 mb-2">
                            No recipes matching "<span className="font-semibold text-dala-text">{searchQuery}</span>"
                          </p>
                          <button
                            onClick={() => {
                              handleNavClick('recipes');
                              setSearchExpanded(false);
                            }}
                            className="text-xs font-bold text-dala-green hover:underline inline-flex items-center gap-1 cursor-pointer"
                          >
                            Browse Catalog <ArrowRight size={12} />
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleScrollToFooterNewsletter}
                className="bg-dala-gold text-white px-4 sm:px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-yellow-600 transition-colors duration-200 rounded-xs shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <span>Subscribe</span>
              </motion.button>

              {/* Mobile Menu Button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-dala-text p-1 cursor-pointer"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden bg-white border-b border-gray-200 px-6 py-4 shadow-lg overflow-hidden"
          >
            <div className="flex flex-col space-y-3 text-sm font-bold uppercase tracking-wider">
              <button
                onClick={() => handleNavClick('home')}
                className={`text-left py-2 border-b border-gray-100 ${
                  activeTab === 'home' ? 'text-dala-green' : 'text-gray-700'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => handleNavClick('recipes')}
                className={`text-left py-2 border-b border-gray-100 flex justify-between items-center ${
                  activeTab === 'recipes' ? 'text-dala-green' : 'text-gray-700'
                }`}
              >
                Recipes
              </button>
              <div className="pl-4 flex flex-wrap gap-2 py-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className="bg-gray-100 hover:bg-dala-green hover:text-white px-2.5 py-1 text-[11px] rounded-xs transition-colors font-medium text-gray-700"
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <button
                onClick={() => handleNavClick('about')}
                className={`text-left py-2 border-b border-gray-100 ${
                  activeTab === 'about' ? 'text-dala-green' : 'text-gray-700'
                }`}
              >
                About
              </button>
              <button
                onClick={() => handleNavClick('youtube')}
                className={`text-left py-2 border-b border-gray-100 ${
                  activeTab === 'youtube' ? 'text-dala-green' : 'text-gray-700'
                }`}
              >
                YouTube
              </button>
              <button
                onClick={() => handleNavClick('blog')}
                className={`text-left py-2 border-b border-gray-100 ${
                  activeTab === 'blog' ? 'text-dala-green' : 'text-gray-700'
                }`}
              >
                Blog
              </button>
              <button
                onClick={() => handleNavClick('contact')}
                className={`text-left py-2 border-b border-gray-100 ${
                  activeTab === 'contact' ? 'text-dala-green' : 'text-gray-700'
                }`}
              >
                Contact
              </button>
              <div className="pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleScrollToFooterNewsletter}
                  className="w-full bg-dala-gold text-white py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-yellow-600 transition duration-200 rounded-xs shadow-2xs text-center cursor-pointer"
                >
                  Subscribe to Newsletter
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
