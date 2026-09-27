import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CategoryRow } from './components/CategoryRow';
import { FeaturedRecipes } from './components/FeaturedRecipes';
import { CallToActionsBanner } from './components/CallToActionsBanner';
import { AboutAchiengSection } from './components/AboutAchiengSection';
import { Footer } from './components/Footer';

import { SubscribeModal } from './components/SubscribeModal';
import { SavedRecipesModal } from './components/SavedRecipesModal';
import { YouTubeModal } from './components/YouTubeModal';

import { RecipesCatalogView } from './views/RecipesCatalogView';
import { RecipeDetailView } from './views/RecipeDetailView';
import { AboutView } from './views/AboutView';
import { YouTubeView } from './views/YouTubeView';
import { BlogView } from './views/BlogView';
import { ContactView } from './views/ContactView';
import { AdminAuthView } from './views/AdminAuthView';
import { LegalView } from './views/LegalView';

import { RECIPES, BLOG_ARTICLES, YOUTUBE_VIDEOS } from './data/recipesData';
import { INITIAL_SUBSCRIBERS, INITIAL_NEWSLETTERS, INITIAL_ADMIN_USERS, DEFAULT_SITE_SETTINGS } from './data/adminData';
import { Recipe, BlogArticle, YouTubeVideo, RecipeCategory, Subscriber, Newsletter, AdminUser, SiteSettings, ContactMessage, AnalyticsEvent } from './types';
import { LegalPoliciesModal, PolicyTab } from './components/LegalPoliciesModal';
import { 
  syncSubscriberToSupabase, 
  fetchSubscribersFromSupabase, 
  fetchNewslettersFromSupabase,
  fetchRecipesFromSupabase,
  fetchArticlesFromSupabase,
  fetchYouTubeVideosFromSupabase,
  fetchAdminUsersFromSupabase,
  fetchSiteSettingsFromSupabase,
  syncContactMessageToSupabase,
  fetchContactMessagesFromSupabase,
  deleteContactMessageFromSupabase,
  syncAnalyticsEventToSupabase,
  fetchAnalyticsFromSupabase,
  clearAnalyticsFromSupabase,
} from './lib/supabaseSync';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedCategory, setSelectedCategory] = useState<RecipeCategory | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // Dynamic Catalog States with localStorage persistence
  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    try {
      const saved = localStorage.getItem('dala_recipes');
      return saved ? JSON.parse(saved) : RECIPES;
    } catch {
      return RECIPES;
    }
  });

  const [articles, setArticles] = useState<BlogArticle[]>(() => {
    try {
      const saved = localStorage.getItem('dala_blog_articles');
      return saved ? JSON.parse(saved) : BLOG_ARTICLES;
    } catch {
      return BLOG_ARTICLES;
    }
  });

  const [videos, setVideos] = useState<YouTubeVideo[]>(() => {
    try {
      const saved = localStorage.getItem('dala_youtube_videos');
      return saved ? JSON.parse(saved) : YOUTUBE_VIDEOS;
    } catch {
      return YOUTUBE_VIDEOS;
    }
  });

  const [subscribers, setSubscribers] = useState<Subscriber[]>(() => {
    try {
      const saved = localStorage.getItem('dala_subscribers');
      return saved ? JSON.parse(saved) : INITIAL_SUBSCRIBERS;
    } catch {
      return INITIAL_SUBSCRIBERS;
    }
  });

  const [newsletters, setNewsletters] = useState<Newsletter[]>(() => {
    try {
      const saved = localStorage.getItem('dala_newsletters');
      return saved ? JSON.parse(saved) : INITIAL_NEWSLETTERS;
    } catch {
      return INITIAL_NEWSLETTERS;
    }
  });

  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() => {
    try {
      const saved = localStorage.getItem('dala_admin_users');
      return saved ? JSON.parse(saved) : INITIAL_ADMIN_USERS;
    } catch {
      return INITIAL_ADMIN_USERS;
    }
  });

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem('dala_site_settings');
      return saved ? JSON.parse(saved) : DEFAULT_SITE_SETTINGS;
    } catch {
      return DEFAULT_SITE_SETTINGS;
    }
  });

  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(() => {
    try {
      const saved = localStorage.getItem('dala_contact_messages');
      return saved ? JSON.parse(saved) : [
        {
          id: 'msg-1',
          name: 'Fatima Al-Sabah',
          email: 'fatima@example.com',
          subject: 'Sourdough Workshop Inquiry',
          message: 'Hi Chef Achieng! Loved your artisan sourdough guide. Will you be holding live masterclasses in Kuwait anytime soon?',
          createdAt: '2026-08-05T10:30:00Z',
          read: false,
        }
      ];
    } catch {
      return [];
    }
  });

  const [analyticsEvents, setAnalyticsEvents] = useState<AnalyticsEvent[]>(() => {
    try {
      const saved = localStorage.getItem('dala_analytics_events');
      return saved ? JSON.parse(saved) : [
        {
          id: 'ev-1',
          eventType: 'recipe_view',
          itemId: '1',
          itemTitle: 'Artisan Sourdough Bread',
          path: 'recipe/1',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X)',
        },
        {
          id: 'ev-2',
          eventType: 'page_view',
          path: 'recipes',
          createdAt: new Date(Date.now() - 1800000).toISOString(),
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS)',
        },
      ];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('dala_analytics_events', JSON.stringify(analyticsEvents));
    } catch {}
  }, [analyticsEvents]);

  const recordAnalytics = (
    eventType: AnalyticsEvent['eventType'],
    itemId?: string,
    itemTitle?: string,
    path?: string
  ) => {
    const event: AnalyticsEvent = {
      id: `ev-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      eventType,
      itemId,
      itemTitle,
      path: path || activeTab,
      createdAt: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    };
    setAnalyticsEvents((prev) => [event, ...prev]);
    syncAnalyticsEventToSupabase(event);
  };

  const handleClearAnalytics = () => {
    setAnalyticsEvents([]);
    clearAnalyticsFromSupabase();
  };

  useEffect(() => {
    try {
      localStorage.setItem('dala_recipes', JSON.stringify(recipes));
    } catch {}
  }, [recipes]);

  useEffect(() => {
    try {
      localStorage.setItem('dala_blog_articles', JSON.stringify(articles));
    } catch {}
  }, [articles]);

  useEffect(() => {
    try {
      localStorage.setItem('dala_youtube_videos', JSON.stringify(videos));
    } catch {}
  }, [videos]);

  useEffect(() => {
    try {
      localStorage.setItem('dala_subscribers', JSON.stringify(subscribers));
    } catch {}
  }, [subscribers]);

  useEffect(() => {
    try {
      localStorage.setItem('dala_newsletters', JSON.stringify(newsletters));
    } catch {}
  }, [newsletters]);

  useEffect(() => {
    try {
      localStorage.setItem('dala_admin_users', JSON.stringify(adminUsers));
    } catch {}
  }, [adminUsers]);

  useEffect(() => {
    try {
      localStorage.setItem('dala_site_settings', JSON.stringify(siteSettings));
    } catch {}
  }, [siteSettings]);

  useEffect(() => {
    try {
      localStorage.setItem('dala_contact_messages', JSON.stringify(contactMessages));
    } catch {}
  }, [contactMessages]);

  const handleSendContactMessage = (data: { name: string; email: string; subject: string; message: string }) => {
    const newMsg: ContactMessage = {
      id: `msg-${Date.now()}`,
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      createdAt: new Date().toISOString(),
      read: false,
    };
    setContactMessages((prev) => [newMsg, ...prev]);
    syncContactMessageToSupabase(newMsg);
    recordAnalytics('contact_submit', newMsg.id, `Msg: ${data.name} (${data.email})`);
  };

  const handleDeleteContactMessage = (id: string) => {
    setContactMessages((prev) => prev.filter((m) => m.id !== id));
    deleteContactMessageFromSupabase(id);
  };

  // Non-archived and non-draft items for public readers
  const publicRecipes = recipes.filter((r) => !r.archived && !r.draft);
  const publicArticles = articles.filter((a) => !a.archived && !a.draft);
  const publicVideos = videos.filter((v) => !v.archived && !v.draft);

  // Modals state
  const [subscribeModalOpen, setSubscribeModalOpen] = useState(false);
  const [savedModalOpen, setSavedModalOpen] = useState(false);
  const [youtubeModalOpen, setYoutubeModalOpen] = useState(false);
  const [activeYoutubeVideoId, setActiveYoutubeVideoId] = useState<string | null>(null);
  
  // Legal Policies Modal
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<PolicyTab>('privacy');

  const handleOpenLegal = (tab: PolicyTab = 'privacy') => {
    setLegalModalTab(tab);
    setLegalModalOpen(true);
  };


  // Saved Favorite Recipes in localStorage
  const [savedRecipeIds, setSavedRecipeIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('dala_saved_recipes');
      return saved ? JSON.parse(saved) : ['1', '4'];
    } catch (e) {
      return ['1', '4'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('dala_saved_recipes', JSON.stringify(savedRecipeIds));
    } catch (e) {
      // ignore
    }
  }, [savedRecipeIds]);

  const handleToggleSave = (recipe: Recipe, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSavedRecipeIds((prev) =>
      prev.includes(recipe.id)
        ? prev.filter((id) => id !== recipe.id)
        : [...prev, recipe.id]
    );
  };

  const handleOpenYoutubeVideo = (videoId: string) => {
    setActiveYoutubeVideoId(videoId);
    setYoutubeModalOpen(true);
    recordAnalytics('video_view', videoId, `YouTube Guide: ${videoId}`, `video/${videoId}`);
  };

  const handleOpenRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setActiveTab('recipe-detail');
    recordAnalytics('recipe_view', recipe.id, recipe.title, `recipe/${recipe.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (cat: RecipeCategory | null) => {
    setSelectedCategory(cat);
    setActiveTab('recipes');
    recordAnalytics('page_view', undefined, `Category: ${cat || 'All'}`, 'recipes');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddSubscriber = (email: string, name?: string) => {
    if (!email.trim()) return;
    const cleanEmail = email.trim().toLowerCase();
    const newSub: Subscriber = {
      id: 'sub-' + Date.now(),
      email: cleanEmail,
      name: name?.trim() || cleanEmail.split('@')[0],
      subscribedAt: new Date().toISOString().split('T')[0],
      status: 'active',
      source: 'Website Navigation Modal',
    };
    setSubscribers((prev) => [newSub, ...prev.filter((s) => s.email !== cleanEmail)]);
    syncSubscriberToSupabase(newSub);
    recordAnalytics('newsletter_signup', newSub.id, `Subscriber: ${cleanEmail}`);
  };

  useEffect(() => {
    fetchSubscribersFromSupabase().then((remoteSubs) => {
      if (remoteSubs && remoteSubs.length > 0) {
        setSubscribers((prev) => {
          const emailMap = new Map<string, Subscriber>();
          prev.forEach((s) => emailMap.set(s.email, s));
          remoteSubs.forEach((s) => emailMap.set(s.email, s));
          return Array.from(emailMap.values());
        });
      }
    });

    fetchNewslettersFromSupabase().then((remoteNewsletters) => {
      if (remoteNewsletters && remoteNewsletters.length > 0) {
        setNewsletters((prev) => {
          const newsMap = new Map<string, Newsletter>();
          prev.forEach((n) => newsMap.set(n.id, n));
          remoteNewsletters.forEach((n) => newsMap.set(n.id, n));
          return Array.from(newsMap.values());
        });
      }
    });

    fetchRecipesFromSupabase().then((remoteRecipes) => {
      if (remoteRecipes && remoteRecipes.length > 0) {
        setRecipes(remoteRecipes);
      }
    });

    fetchArticlesFromSupabase().then((remoteArticles) => {
      if (remoteArticles && remoteArticles.length > 0) {
        setArticles(remoteArticles);
      }
    });

    fetchYouTubeVideosFromSupabase().then((remoteVideos) => {
      if (remoteVideos && remoteVideos.length > 0) {
        setVideos(remoteVideos);
      }
    });

    fetchAdminUsersFromSupabase().then((remoteAdminUsers) => {
      if (remoteAdminUsers && remoteAdminUsers.length > 0) {
        setAdminUsers(remoteAdminUsers);
      }
    });

    fetchSiteSettingsFromSupabase().then((remoteSettings) => {
      if (remoteSettings) {
        setSiteSettings(remoteSettings);
      }
    });

    fetchContactMessagesFromSupabase().then((remoteContactMsgs) => {
      if (remoteContactMsgs && remoteContactMsgs.length > 0) {
        setContactMessages(remoteContactMsgs);
      }
    });

    fetchAnalyticsFromSupabase().then((remoteAnalytics) => {
      if (remoteAnalytics && remoteAnalytics.length > 0) {
        setAnalyticsEvents(remoteAnalytics);
      }
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-dala-cream text-dala-text antialiased selection:bg-dala-green selection:text-white">
      {/* Header Navigation - hidden when in Admin Mode */}
      {activeTab !== 'admin' && (
        <Navbar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          onOpenSubscribe={() => setSubscribeModalOpen(true)}
          savedRecipesCount={savedRecipeIds.length}
          onOpenSavedRecipes={() => setSavedModalOpen(true)}
          recipes={publicRecipes}
          onSelectRecipe={handleOpenRecipe}
          siteSettings={siteSettings}
        />
      )}

      {/* Main Tab Views */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <HeroSection
                onBrowseRecipes={() => handleSelectCategory(null)}
                onWatchYoutube={() => {
                  setActiveTab('youtube');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />

              <CategoryRow
                selectedCategory={selectedCategory}
                onSelectCategory={handleSelectCategory}
                recipes={publicRecipes}
                siteSettings={siteSettings}
              />

              <FeaturedRecipes
                recipes={publicRecipes}
                onSelectRecipe={handleOpenRecipe}
                onViewAll={() => handleSelectCategory(null)}
                savedRecipeIds={savedRecipeIds}
                onToggleSave={handleToggleSave}
              />

              <CallToActionsBanner
                onOpenYoutube={() => {
                  setActiveTab('youtube');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onSubscribeSubmit={(email) => handleAddSubscriber(email)}
              />

              <AboutAchiengSection siteSettings={siteSettings} />
            </motion.div>
          )}

          {activeTab === 'recipes' && (
            <motion.div
              key="recipes"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <RecipesCatalogView
                recipes={publicRecipes}
                selectedCategory={selectedCategory}
                onSelectCategory={(cat) => setSelectedCategory(cat)}
                onSelectRecipe={handleOpenRecipe}
                savedRecipeIds={savedRecipeIds}
                onToggleSave={handleToggleSave}
              />
            </motion.div>
          )}

          {activeTab === 'recipe-detail' && selectedRecipe && (
            <motion.div
              key={`recipe-detail-${selectedRecipe.id}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <RecipeDetailView
                recipe={recipes.find((r) => r.id === selectedRecipe.id) || selectedRecipe}
                onBack={() => {
                  setActiveTab('recipes');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onSelectRecipe={handleOpenRecipe}
                allRecipes={publicRecipes}
                isSaved={savedRecipeIds.includes(selectedRecipe.id)}
                onToggleSave={(r) => handleToggleSave(r)}
              />
            </motion.div>
          )}

          {activeTab === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <AboutView onExploreRecipes={() => handleSelectCategory(null)} siteSettings={siteSettings} />
            </motion.div>
          )}

          {activeTab === 'youtube' && (
            <motion.div
              key="youtube"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <YouTubeView videos={publicVideos} onPlayVideo={handleOpenYoutubeVideo} />
            </motion.div>
          )}

          {activeTab === 'blog' && (
            <motion.div
              key="blog"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <BlogView articles={publicArticles} onSubscribeSubmit={(email) => handleAddSubscriber(email)} />
            </motion.div>
          )}

          {activeTab === 'contact' && (
            <motion.div
              key="contact"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <ContactView onSendMessage={handleSendContactMessage} siteSettings={siteSettings} />
            </motion.div>
          )}

          {(activeTab === 'legal' || activeTab === 'terms' || activeTab === 'privacy' || activeTab === 'cookies') && (
            <motion.div
              key="legal"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <LegalView
                initialTab={activeTab === 'privacy' ? 'privacy' : activeTab === 'cookies' ? 'cookies' : 'terms'}
                onNavigateHome={() => {
                  setActiveTab('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onNavigate={(tab) => {
                  setActiveTab(tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </motion.div>
          )}

          {activeTab === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <AdminAuthView
                recipes={recipes}
                setRecipes={setRecipes}
                articles={articles}
                setArticles={setArticles}
                videos={videos}
                setVideos={setVideos}
                subscribers={subscribers}
                setSubscribers={setSubscribers}
                newsletters={newsletters}
                setNewsletters={setNewsletters}
                adminUsers={adminUsers}
                setAdminUsers={setAdminUsers}
                siteSettings={siteSettings}
                setSiteSettings={setSiteSettings}
                contactMessages={contactMessages}
                onDeleteContactMessage={handleDeleteContactMessage}
                analyticsEvents={analyticsEvents}
                onClearAnalytics={handleClearAnalytics}
                onNavigateHome={() => {
                  setActiveTab('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onNavigateRecipes={() => {
                  setActiveTab('recipes');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onSelectRecipe={handleOpenRecipe}
                onOpenLegal={handleOpenLegal}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer - hidden when in Admin Mode */}
      {activeTab !== 'admin' && (
        <Footer
          onSelectCategory={handleSelectCategory}
          onNavigate={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onSubscribeSubmit={(email) => handleAddSubscriber(email)}
          onOpenLegal={handleOpenLegal}
          siteSettings={siteSettings}
        />
      )}

      {/* Interactive Modals */}
      <SavedRecipesModal
        recipes={recipes}
        savedIds={savedRecipeIds}
        isOpen={savedModalOpen}
        onClose={() => setSavedModalOpen(false)}
        onSelectRecipe={(recipe) => handleOpenRecipe(recipe)}
        onRemoveSaved={(recipe) => handleToggleSave(recipe)}
      />

      <SubscribeModal
        isOpen={subscribeModalOpen}
        onClose={() => setSubscribeModalOpen(false)}
        onSubscribe={handleAddSubscriber}
      />

      <YouTubeModal
        videoId={activeYoutubeVideoId}
        isOpen={youtubeModalOpen}
        onClose={() => setYoutubeModalOpen(false)}
      />

      <LegalPoliciesModal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        initialTab={legalModalTab}
      />
    </div>
  );

}
