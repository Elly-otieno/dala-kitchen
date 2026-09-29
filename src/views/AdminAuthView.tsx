import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Lock,
  Key,
  UtensilsCrossed,
  ArrowRight,
  ShieldCheck,
  Info,
  Eye,
  EyeOff,
  CheckCircle2,
  LogOut,
  PlusCircle,
  BookOpen,
  Users
} from 'lucide-react';

import { AdminSidebar, AdminTabType } from '../components/admin/AdminSidebar';
import { AdminHeader } from '../components/admin/AdminHeader';
import { AdminFooter } from '../components/admin/AdminFooter';
import { AdminContentLibrary } from '../components/admin/AdminContentLibrary';
import { AdminRecipeEditor } from '../components/admin/AdminRecipeEditor';
import { AdminBlogEditor } from '../components/admin/AdminBlogEditor';
import { AdminYouTubeEditor } from '../components/admin/AdminYouTubeEditor';
import { AdminAnalyticsView } from '../components/admin/AdminAnalyticsView';
import { AdminSubscribersView } from '../components/admin/AdminSubscribersView';
import { AdminNewslettersView } from '../components/admin/AdminNewslettersView';
import { AdminUsersView } from '../components/admin/AdminUsersView';
import { AdminSettingsView } from '../components/admin/AdminSettingsView';
import { AdminSupportView } from '../components/admin/AdminSupportView';
import { LegalPoliciesModal, PolicyTab } from '../components/LegalPoliciesModal';
import { 
  syncRecipeToSupabase, 
  syncArticleToSupabase, 
  syncYouTubeVideoToSupabase,
  syncAdminUserToSupabase,
  deleteRecipeFromSupabase,
  deleteArticleFromSupabase,
  deleteYouTubeVideoFromSupabase
} from '../lib/supabaseSync';
import {
  Recipe,
  BlogArticle,
  YouTubeVideo,
  Subscriber,
  Newsletter,
  AdminUser,
  SiteSettings,
  ContactMessage,
  AnalyticsEvent,
} from '../types';

interface AdminAuthViewProps {
  recipes: Recipe[];
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
  articles: BlogArticle[];
  setArticles: React.Dispatch<React.SetStateAction<BlogArticle[]>>;
  videos: YouTubeVideo[];
  setVideos: React.Dispatch<React.SetStateAction<YouTubeVideo[]>>;
  subscribers: Subscriber[];
  setSubscribers: React.Dispatch<React.SetStateAction<Subscriber[]>>;
  newsletters: Newsletter[];
  setNewsletters: React.Dispatch<React.SetStateAction<Newsletter[]>>;
  adminUsers: AdminUser[];
  setAdminUsers: React.Dispatch<React.SetStateAction<AdminUser[]>>;
  siteSettings: SiteSettings;
  setSiteSettings: React.Dispatch<React.SetStateAction<SiteSettings>>;
  contactMessages?: ContactMessage[];
  onDeleteContactMessage?: (id: string) => void;
  analyticsEvents?: AnalyticsEvent[];
  onClearAnalytics?: () => void;
  onNavigateHome: () => void;
  onNavigateRecipes?: () => void;
  onSelectRecipe: (recipe: Recipe) => void;
  onOpenLegal?: (tab?: PolicyTab) => void;
}


export const AdminAuthView: React.FC<AdminAuthViewProps> = ({
  recipes,
  setRecipes,
  articles,
  setArticles,
  videos,
  setVideos,
  subscribers,
  setSubscribers,
  newsletters,
  setNewsletters,
  adminUsers,
  setAdminUsers,
  siteSettings,
  setSiteSettings,
  contactMessages = [],
  onDeleteContactMessage,
  analyticsEvents = [],
  onClearAnalytics,
  onNavigateHome,
  onNavigateRecipes,
  onSelectRecipe,
  onOpenLegal,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  // Admin Workspace internal state
  const [adminTab, setAdminTab] = useState<AdminTabType>('dashboard');
  const [editingItem, setEditingItem] = useState<{
    type: 'recipe' | 'blog' | 'youtube';
    item: Recipe | BlogArticle | YouTubeVideo | null;
  } | null>(null);
  const [adminSearchQuery, setAdminSearchQuery] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Form states
  const [loginEmail, setLoginEmail] = useState('chef@dalakitchen.com');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);

  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regInviteCode, setRegInviteCode] = useState('');
  const [verifiedInvite, setVerifiedInvite] = useState<{
    code: string;
    email: string;
    name: string;
    role: string;
  } | null>(null);

  // Authentication State
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loggedInUser, setLoggedInUser] = useState<{
    name: string;
    email: string;
    role: string;
  } | null>(() => {
    try {
      const saved = localStorage.getItem('dalakitchen_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Check URL parameters on mount for staff invite links
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const params = new URLSearchParams(window.location.search);
      const invite = params.get('invite');
      const email = params.get('email');
      const name = params.get('name');
      const role = params.get('role');

      if (invite) {
        setMode('register');
        setRegInviteCode(invite);
        if (email) setRegEmail(decodeURIComponent(email));
        if (name) setRegFullName(decodeURIComponent(name));
        setVerifiedInvite({
          code: invite,
          email: email ? decodeURIComponent(email) : '',
          name: name ? decodeURIComponent(name) : '',
          role: role || 'Chef',
        });
      }
    } catch (e) {
      console.warn('Error reading URL params for invite:', e);
    }
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!loginEmail || !loginPassword) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const cleanEmail = loginEmail.trim().toLowerCase();
      const cleanPass = loginPassword.trim();

      // Check if user exists in adminUsers list
      const registeredUser = adminUsers.find(
        (u) => u.email.toLowerCase() === cleanEmail
      );

      // Default demo credentials checks
      const isDefaultHeadChef = (cleanEmail === 'achieng@dalakitchen.com' || cleanEmail === 'admin@dalakitchen.com') && (cleanPass === 'admin123' || cleanPass === 'password123');
      const isDefaultChef = cleanEmail === 'chef@dalakitchen.com' && (cleanPass === 'password123' || cleanPass === 'admin123');
      const isDefaultMarcus = cleanEmail === 'marcus.vance@dalakitchen.com' && (cleanPass === 'chef123' || cleanPass === 'admin123');
      const isDefaultElena = cleanEmail === 'elena.editor@dalakitchen.com' && (cleanPass === 'editor123' || cleanPass === 'admin123');
      
      const isRegisteredValid = registeredUser && (cleanPass === 'admin123' || cleanPass === 'password123' || cleanPass.length >= 6);

      if (!isDefaultHeadChef && !isDefaultChef && !isDefaultMarcus && !isDefaultElena && !isRegisteredValid) {
        setErrorMsg('❌ Access Denied: Invalid email or password. Please verify your credentials or use the demo credentials provided.');
        return;
      }

      const role = registeredUser ? registeredUser.role : isDefaultElena ? 'Editor' : isDefaultMarcus ? 'Chef' : 'Senior Chef & Admin';
      const name = registeredUser ? registeredUser.name : isDefaultHeadChef ? 'Achieng (Head Chef)' : isDefaultMarcus ? 'Chef Marcus Vance' : isDefaultElena ? 'Elena Rostova' : cleanEmail.split('@')[0].replace('.', ' ');

      const user = {
        name,
        email: cleanEmail,
        role,
      };
      setLoggedInUser(user);
      localStorage.setItem('dalakitchen_admin_user', JSON.stringify(user));
    }, 600);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!regFullName || !regEmail || !regPassword) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    const cleanCode = regInviteCode.trim().toUpperCase();
    const validInviteCodes = ['DK-ADMIN-2026', 'DK-STAFF-2026', 'DALA2026', 'DK-ADMIN-XXXX'];
    if (!validInviteCodes.includes(cleanCode)) {
      setErrorMsg('❌ Invalid Secret Invite Code. Authorized code required for internal staff access (e.g. DK-ADMIN-2026).');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const cleanEmail = regEmail.trim().toLowerCase();
      const existingUser = adminUsers.find(
        (u) => u.email.toLowerCase() === cleanEmail
      );

      const targetRole = verifiedInvite?.role
        ? (verifiedInvite.role as any)
        : existingUser?.role || 'Chef';

      if (existingUser) {
        // Update existing pending user to active
        const updatedUser: AdminUser = {
          ...existingUser,
          name: regFullName.trim(),
          status: 'active',
          role: targetRole,
        };
        setAdminUsers((prev) =>
          prev.map((u) => (u.id === existingUser.id ? updatedUser : u))
        );
        syncAdminUserToSupabase(updatedUser);
      } else {
        // Create new active staff member
        const newAdmin: AdminUser = {
          id: `usr-${Date.now()}`,
          name: regFullName.trim(),
          email: cleanEmail,
          role: targetRole,
          status: 'active',
          joinedAt: new Date().toISOString().split('T')[0],
          recipesCount: 0,
          articlesCount: 0,
          avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80`,
        };

        setAdminUsers((prev) => [newAdmin, ...prev]);
        syncAdminUserToSupabase(newAdmin);
      }

      const user = {
        name: regFullName.trim(),
        email: cleanEmail,
        role: targetRole,
      };
      setLoggedInUser(user);
      localStorage.setItem('dalakitchen_admin_user', JSON.stringify(user));

      // Clean URL params after successful registration
      if (typeof window !== 'undefined') {
        window.history.replaceState({}, document.title, window.location.pathname + '?tab=admin');
      }
    }, 600);
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    localStorage.removeItem('dalakitchen_admin_user');
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setResetSent(true);
  };

  // Logged-In Full Admin Dashboard Panel View
  if (loggedInUser) {
    return (
      <div className="flex h-screen bg-dala-cream overflow-hidden font-sans relative">
        {/* Reusable Admin Sidebar */}
        <AdminSidebar
          activeTab={adminTab}
          setActiveTab={(tab) => {
            setAdminTab(tab);
            setEditingItem(null);
            setMobileSidebarOpen(false);
          }}
          onNewRecipe={() => {
            setAdminTab('recipes');
            setEditingItem({ type: 'recipe', item: null });
            setMobileSidebarOpen(false);
          }}
          onNewBlog={() => {
            setAdminTab('blog');
            setEditingItem({ type: 'blog', item: null });
            setMobileSidebarOpen(false);
          }}
          onNewYouTube={() => {
            setAdminTab('youtube');
            setEditingItem({ type: 'youtube', item: null });
            setMobileSidebarOpen(false);
          }}
          onLogout={handleLogout}
          onNavigateHome={onNavigateHome}
          user={loggedInUser}
          mobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />

        {/* Main Content Pane */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto w-full">
          {/* Simplified Admin Header */}
          <AdminHeader
            searchQuery={adminSearchQuery}
            setSearchQuery={setAdminSearchQuery}
            onNavigateHome={onNavigateHome}
            onToggleMobileSidebar={() => setMobileSidebarOpen((prev) => !prev)}
          />

          {/* Conditional Rendering of Editors / Views */}
          <div className="flex-1">
            {editingItem?.type === 'recipe' ? (
              <AdminRecipeEditor
                initialRecipe={editingItem.item as Recipe | null}
                onSave={(updatedRecipe) => {
                  setRecipes((prev) => {
                    const exists = prev.some((r) => r.id === updatedRecipe.id);
                    if (exists) {
                      return prev.map((r) => (r.id === updatedRecipe.id ? updatedRecipe : r));
                    } else {
                      return [updatedRecipe, ...prev];
                    }
                  });
                  syncRecipeToSupabase(updatedRecipe);
                  setEditingItem(null);
                  setAdminTab('dashboard');
                }}
                onCancel={() => setEditingItem(null)}
                onPreviewLive={(recipe) => onSelectRecipe(recipe)}
              />
            ) : editingItem?.type === 'blog' ? (
              <AdminBlogEditor
                initialArticle={editingItem.item as BlogArticle | null}
                onSave={(updatedArticle) => {
                  setArticles((prev) => {
                    let nextList: BlogArticle[];
                    const exists = prev.some((a) => a.id === updatedArticle.id);
                    if (exists) {
                      nextList = prev.map((a) => (a.id === updatedArticle.id ? updatedArticle : a));
                    } else {
                      nextList = [updatedArticle, ...prev];
                    }

                    // If updatedArticle is featured, ensure ONLY this article is featured (one-at-a-time rule)
                    if (updatedArticle.featured) {
                      nextList = nextList.map((a) => {
                        if (a.id !== updatedArticle.id && a.featured) {
                          const unfeatured = { ...a, featured: false };
                          syncArticleToSupabase(unfeatured);
                          return unfeatured;
                        }
                        return a;
                      });
                    }

                    return nextList;
                  });
                  syncArticleToSupabase(updatedArticle);
                  setEditingItem(null);
                  setAdminTab('dashboard');
                }}
                onCancel={() => setEditingItem(null)}
              />
            ) : editingItem?.type === 'youtube' ? (
              <AdminYouTubeEditor
                initialVideo={editingItem.item as YouTubeVideo | null}
                existingSeriesList={Array.from(new Set(videos.map((v) => v.series).filter(Boolean)))}
                onSave={(updatedVideo) => {
                  setVideos((prev) => {
                    let nextList: YouTubeVideo[];
                    const exists = prev.some((v) => v.id === updatedVideo.id);
                    if (exists) {
                      nextList = prev.map((v) => (v.id === updatedVideo.id ? updatedVideo : v));
                    } else {
                      nextList = [updatedVideo, ...prev];
                    }

                    // If updatedVideo is featured, ensure ONLY this video is featured (one-at-a-time rule)
                    if (updatedVideo.featured) {
                      nextList = nextList.map((v) => {
                        if (v.id !== updatedVideo.id && v.featured) {
                          const unfeatured = { ...v, featured: false };
                          syncYouTubeVideoToSupabase(unfeatured);
                          return unfeatured;
                        }
                        return v;
                      });
                    }

                    return nextList;
                  });
                  syncYouTubeVideoToSupabase(updatedVideo);
                  setEditingItem(null);
                  setAdminTab('youtube');
                }}
                onCancel={() => {
                  setEditingItem(null);
                  setAdminTab('youtube');
                }}
              />
            ) : adminTab === 'analytics' ? (
              <AdminAnalyticsView
                recipes={recipes}
                articles={articles}
                videos={videos}
                subscribers={subscribers}
                contactMessages={contactMessages}
                analyticsEvents={analyticsEvents}
                onClearAnalytics={onClearAnalytics}
              />
            ) : adminTab === 'subscribers' ? (
              <AdminSubscribersView
                subscribers={subscribers}
                setSubscribers={setSubscribers}
                onNavigateNewsletters={() => setAdminTab('newsletters')}
              />
            ) : adminTab === 'newsletters' ? (
              <AdminNewslettersView
                newsletters={newsletters}
                setNewsletters={setNewsletters}
                recipes={recipes}
                subscribers={subscribers}
              />
            ) : adminTab === 'users' ? (
              <AdminUsersView
                users={adminUsers}
                setUsers={setAdminUsers}
              />
            ) : adminTab === 'settings' ? (
              <AdminSettingsView
                settings={siteSettings}
                setSettings={setSiteSettings}
                recipes={recipes}
              />
            ) : adminTab === 'support' ? (
              <AdminSupportView
                contactMessages={contactMessages}
                onDeleteMessage={onDeleteContactMessage}
              />
            ) : (
              <AdminContentLibrary
                recipes={recipes}
                articles={articles}
                videos={videos}
                onEditRecipe={(recipe) => {
                  setEditingItem({ type: 'recipe', item: recipe });
                  setAdminTab('recipes');
                }}
                onEditArticle={(article) => {
                  setEditingItem({ type: 'blog', item: article });
                  setAdminTab('blog');
                }}
                onEditVideo={(video) => {
                  setEditingItem({ type: 'youtube', item: video });
                  setAdminTab('youtube');
                }}
                onDeleteRecipe={(id) => {
                  setRecipes((prev) => prev.filter((r) => r.id !== id));
                  deleteRecipeFromSupabase(id);
                }}
                onDeleteArticle={(id) => {
                  setArticles((prev) => prev.filter((a) => a.id !== id));
                  deleteArticleFromSupabase(id);
                }}
                onDeleteVideo={(id) => {
                  setVideos((prev) => prev.filter((v) => v.id !== id));
                  deleteYouTubeVideoFromSupabase(id);
                }}
                onToggleArchiveRecipe={(id) => {
                  setRecipes((prev) =>
                    prev.map((r) => {
                      if (r.id === id) {
                        const updated = { ...r, archived: !r.archived };
                        syncRecipeToSupabase(updated);
                        return updated;
                      }
                      return r;
                    })
                  );
                }}
                onToggleArchiveArticle={(id) => {
                  setArticles((prev) =>
                    prev.map((a) => {
                      if (a.id === id) {
                        const updated = { ...a, archived: !a.archived };
                        syncArticleToSupabase(updated);
                        return updated;
                      }
                      return a;
                    })
                  );
                }}
                onToggleArchiveVideo={(id) => {
                  setVideos((prev) =>
                    prev.map((v) => {
                      if (v.id === id) {
                        const updated = { ...v, archived: !v.archived };
                        syncYouTubeVideoToSupabase(updated);
                        return updated;
                      }
                      return v;
                    })
                  );
                }}
                onToggleFeaturedRecipe={(id) => {
                  setRecipes((prev) =>
                    prev.map((r) => {
                      if (r.id === id) {
                        const updated = { ...r, featured: !r.featured };
                        syncRecipeToSupabase(updated);
                        return updated;
                      }
                      return r;
                    })
                  );
                }}
                onToggleFeaturedArticle={(id) => {
                  setArticles((prev) => {
                    const current = prev.find((a) => a.id === id);
                    const willBeFeatured = !current?.featured;

                    return prev.map((a) => {
                      if (a.id === id) {
                        const updated = { ...a, featured: willBeFeatured };
                        syncArticleToSupabase(updated);
                        return updated;
                      }
                      // If we are featuring this article, ensure all other articles are unfeatured (one-at-a-time rule)
                      if (willBeFeatured && a.featured) {
                        const unfeatured = { ...a, featured: false };
                        syncArticleToSupabase(unfeatured);
                        return unfeatured;
                      }
                      return a;
                    });
                  });
                }}
                onToggleFeaturedVideo={(id) => {
                  setVideos((prev) => {
                    const current = prev.find((v) => v.id === id);
                    const willBeFeatured = !current?.featured;

                    return prev.map((v) => {
                      if (v.id === id) {
                        const updated = { ...v, featured: willBeFeatured };
                        syncYouTubeVideoToSupabase(updated);
                        return updated;
                      }
                      // If we are featuring this video, ensure all other videos are unfeatured (one-at-a-time rule)
                      if (willBeFeatured && v.featured) {
                        const unfeatured = { ...v, featured: false };
                        syncYouTubeVideoToSupabase(unfeatured);
                        return unfeatured;
                      }
                      return v;
                    });
                  });
                }}
                onAutoSelectFeatured={(criteria) => {
                  setRecipes((prev) => {
                    let targetIds = new Set<string>();
                    const active = prev.filter((r) => !r.archived && !r.draft);

                    if (criteria === 'top_rated') {
                      const sorted = [...active].sort(
                        (a, b) => (b.rating || 0) * (b.reviewCount || 1) - (a.rating || 0) * (a.reviewCount || 1)
                      );
                      targetIds = new Set(sorted.slice(0, 4).map((r) => r.id));
                    } else if (criteria === 'latest') {
                      targetIds = new Set(active.slice(0, 4).map((r) => r.id));
                    } else if (criteria === 'category_mix') {
                      const seenCategories = new Set<string>();
                      for (const r of active) {
                        if (!seenCategories.has(r.category) && targetIds.size < 4) {
                          seenCategories.add(r.category);
                          targetIds.add(r.id);
                        }
                      }
                      for (const r of active) {
                        if (targetIds.size < 4 && !targetIds.has(r.id)) {
                          targetIds.add(r.id);
                        }
                      }
                    } else if (criteria === 'clear') {
                      targetIds = new Set();
                    }

                    return prev.map((r) => {
                      const isFeatured = targetIds.has(r.id);
                      if (r.featured !== isFeatured) {
                        const updated = { ...r, featured: isFeatured };
                        syncRecipeToSupabase(updated);
                        return updated;
                      }
                      return r;
                    });
                  });
                }}
                onCreateRecipe={() => {
                  setEditingItem({ type: 'recipe', item: null });
                  setAdminTab('recipes');
                }}
                onCreateBlog={() => {
                  setEditingItem({ type: 'blog', item: null });
                  setAdminTab('blog');
                }}
                onCreateYouTube={() => {
                  setEditingItem({ type: 'youtube', item: null });
                  setAdminTab('youtube');
                }}
                onViewLiveRecipe={(recipe) => {
                  onSelectRecipe(recipe);
                }}
              />
            )}
          </div>

          {/* Dedicated Simplified Admin Footer */}
          <AdminFooter
            onNavigateHome={onNavigateHome}
            onOpenLegal={() => onOpenLegal && onOpenLegal('privacy')}
          />
        </div>
      </div>
    );
  }


  return (
    <div className="bg-dala-cream text-dala-text min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 md:p-12 relative overflow-hidden font-sans">
      {/* Decorative subtle background elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#bcccab] blur-3xl mix-blend-multiply"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[35%] h-[35%] rounded-full bg-[#ffdcc6] blur-3xl mix-blend-multiply"></div>
      </div>

      {/* Mode Switcher Toggle Pill at top */}
      <div className="z-20 mb-6 bg-white border border-[#765845]/20 p-1 rounded-full shadow-xs flex items-center gap-1">
        <button
          onClick={() => {
            setMode('login');
            setErrorMsg('');
          }}
          className={`px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            mode === 'login'
              ? 'bg-dala-green-dark text-white shadow-xs'
              : 'text-gray-600 hover:bg-dala-green-dark'
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => {
            setMode('register');
            setErrorMsg('');
          }}
          className={`px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            mode === 'register'
              ? 'bg-dala-green-dark text-white shadow-xs'
              : 'text-gray-600 hover:bg-dala-green-dark'
          }`}
        >
          Register
        </button>
      </div>

      {/* Main Card Container */}
      <main className="w-full max-w-[480px] z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-white rounded-xl shadow-[0_12px_40px_rgba(61,38,22,0.08)] p-8 md:p-10 border border-[#765845]/10 relative overflow-hidden">
          
          {/* Top Accent line for Login */}
          {mode === 'login' && (
            <div className="absolute top-0 left-0 w-full h-1.5 bg-dala-green-dark"></div>
          )}

          {/* REGISTER FORM DESIGN */}
          {mode === 'register' && (
            <div>
              {/* Header Section */}
              <div className="text-center mb-8">
                <div className="flex justify-center mb-3">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBz7JEDgKCPIKFgy3Gav7l9pEUVX4wa0h9vP-nIfpBR1-HGUdHdWBfVd7cYzMusFLM0UGlW3YI1GoBz2Xtei9YOsiLv8IRIxOgJ7XIi47KtxemiqBsIT-0apni9puHrz2iSMPlmPIj-WLpsF6Baxbk3H88d2GuRU0MuFPrSxfIA70MbCynJeOXazLal3frFxzv_mH5wQ5y-2s13jzKhgQzgBng-q9egV-XRLuzt_4OwmT9XouHYPw_7lxkWckq_ZViWog"
                    alt="DalaKitchen Logo"
                    className="h-12 w-auto object-contain mx-auto"
                  />
                </div>
                <h1 className="font-serif text-2xl md:text-3xl font-bold bg-dala-green-dark mb-1 tracking-wider uppercase">
                  Staff Registration
                </h1>
                <p className="font-signature text-xl md:text-2xl text-[#765845]">
                  Join the DalaKitchen Culinary Team
                </p>
              </div>

              {/* Verified Staff Invitation Notification */}
              {verifiedInvite && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200/90 rounded-xl space-y-1 text-left animate-in fade-in">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                    <CheckCircle2 size={16} className="text-emerald-700" />
                    <span>Verified Staff Invitation</span>
                  </div>
                  <p className="text-xs text-emerald-900 leading-relaxed">
                    Welcome to the team! You have been granted authorized access as a{' '}
                    <span className="font-bold underline">{verifiedInvite.role}</span>. Please complete your details and choose a secure password below to activate your account.
                  </p>
                </div>
              )}

              {errorMsg && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg text-center font-medium">
                  {errorMsg}
                </div>
              )}

              {/* Registration Form */}
              <form onSubmit={handleRegisterSubmit} className="space-y-5">
                {/* Full Name Field */}
                <div>
                  <label
                    className="font-sans font-bold text-[11px] uppercase tracking-[0.15em] text-dala-text-light block mb-2"
                    htmlFor="fullName"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <User
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full bg-dala-cream border border-[#765845]/20 rounded-lg py-3 pl-11 pr-4 text-sm text-dala-text placeholder:text-gray-400 focus:outline-none focus:border-[#27331c] focus:ring-1 focus:ring-[#27331c] transition-all"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label
                    className="font-sans font-bold text-[11px] uppercase tracking-[0.15em] text-dala-text-light block mb-2"
                    htmlFor="email"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="jane@dalakitchen.com"
                      className="w-full bg-dala-cream border border-[#765845]/20 rounded-lg py-3 pl-11 pr-4 text-sm text-dala-text placeholder:text-gray-400 focus:outline-none focus:border-[#27331c] focus:ring-1 focus:ring-[#27331c] transition-all"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label
                    className="font-sans font-bold text-[11px] uppercase tracking-[0.15em] text-dala-text-light block mb-2"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-dala-cream border border-[#765845]/20 rounded-lg py-3 pl-11 pr-10 text-sm text-dala-text placeholder:text-gray-400 focus:outline-none focus:border-[#27331c] focus:ring-1 focus:ring-[#27331c] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Secret Invite Code Field */}
                <div>
                  <label
                    className="font-sans font-bold text-[11px] uppercase tracking-[0.15em] text-dala-text-light mb-2 flex items-center gap-1.5"
                    htmlFor="inviteCode"
                  >
                    <span>Secret Invite Code</span>
                    <span
                      title="Required for internal staff access"
                      className="text-gray-400 hover:text-gray-600 cursor-help flex items-center"
                    >
                      <Info size={14} />
                    </span>
                  </label>
                  <div className="relative">
                    <Key
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#765845]/60"
                    />
                    <input
                      id="inviteCode"
                      name="inviteCode"
                      type="text"
                      required
                      value={regInviteCode}
                      onChange={(e) => setRegInviteCode(e.target.value)}
                      placeholder="DK-ADMIN-XXXX"
                      className="w-full bg-dala-cream border border-[#765845]/20 rounded-lg py-3 pl-11 pr-4 text-sm text-dala-text placeholder:text-gray-400 focus:outline-none focus:border-[#27331c] focus:ring-1 focus:ring-[#27331c] transition-all"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-dala-green-dark text-white font-sans font-bold text-xs uppercase tracking-[0.15em] py-4 rounded-lg hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 flex justify-center items-center gap-2 cursor-pointer disabled:opacity-70"
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                    <ArrowRight size={18} />
                  </button>
                </div>
              </form>

              {/* Footer Links */}
              <div className="mt-8 text-center border-t border-[#765845]/10 pt-5">
                <p className="text-sm text-dala-text-light">
                  Already have an account?{' '}
                  <button
                    onClick={() => {
                      setMode('login');
                      setErrorMsg('');
                    }}
                    className="text-[#765845] font-semibold hover:bg-dala-green-dark transition-colors hover:underline underline-offset-4 cursor-pointer"
                  >
                    Log in
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* LOGIN FORM DESIGN */}
          {mode === 'login' && (
            <div>
              {/* Header Section */}
              <div className="text-center mb-6">
                <h1 className="font-cinzel text-2xl md:text-3xl font-bold bg-dala-green-dark tracking-widest mb-1 uppercase">
                  DalaKitchen Admin
                </h1>
                <p className="font-signature text-xl md:text-2xl text-[#765845]">
                  Manage your culinary world
                </p>
              </div>

              {/* Authorized Staff Credentials Callout Box */}
              {/* <div className="mb-6 p-4 bg-[#f8f6f3] border border-[#27331c]/20 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-bold bg-dala-green-dark uppercase tracking-wider">
                    <Key size={14} className="text-[#765845]" /> Authorized Credentials
                  </span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Protected Access
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-1.5 text-[11px] font-mono text-gray-700 bg-white p-3 rounded-lg border border-[#e6e2dc]">
                  <div className="flex items-center justify-between">
                    <span><strong className="bg-dala-green-dark">Head Chef:</strong> achieng@dalakitchen.com</span>
                    <span className="text-amber-800 font-bold bg-amber-50 px-1.5 py-0.5 rounded">admin123</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                    <span><strong className="bg-dala-green-dark">Staff Chef:</strong> chef@dalakitchen.com</span>
                    <span className="text-amber-800 font-bold bg-amber-50 px-1.5 py-0.5 rounded">password123</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail('achieng@dalakitchen.com');
                    setLoginPassword('admin123');
                    setErrorMsg('');
                  }}
                  className="w-full text-center text-[11px] font-bold text-[#765845] hover:bg-dala-green-dark hover:underline cursor-pointer pt-0.5"
                >
                  ⚡ Click here to Auto-fill Admin Credentials
                </button>
              </div> */}

              {errorMsg && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg text-center font-medium">
                  {errorMsg}
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-5">
                {/* Email Field */}
                <div>
                  <label
                    className="font-sans font-bold text-[11px] uppercase tracking-[0.15em] text-dala-text-light block mb-2"
                    htmlFor="loginEmail"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      id="loginEmail"
                      name="loginEmail"
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="chef@dalakitchen.com"
                      className="w-full bg-dala-cream border border-[#765845]/20 rounded-lg py-3 pl-11 pr-4 text-sm text-dala-text placeholder:text-gray-400 focus:outline-none focus:border-[#27331c] focus:ring-1 focus:ring-[#27331c] transition-all"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label
                      className="font-sans font-bold text-[11px] uppercase tracking-[0.15em] text-dala-text-light"
                      htmlFor="loginPassword"
                    >
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setForgotPasswordOpen(true);
                        setForgotEmail(loginEmail);
                      }}
                      className="font-sans font-bold text-[11px] uppercase tracking-[0.15em] bg-dala-green-dark hover:text-[#3d4a31] transition-colors cursor-pointer"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      id="loginPassword"
                      name="loginPassword"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-dala-cream border border-[#765845]/20 rounded-lg py-3 pl-11 pr-10 text-sm text-dala-text placeholder:text-gray-400 focus:outline-none focus:border-[#27331c] focus:ring-1 focus:ring-[#27331c] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center pt-1">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 bg-dala-green-dark border-gray-300 rounded focus:ring-[#27331c] bg-dala-cream cursor-pointer"
                  />
                  <label
                    htmlFor="remember"
                    className="ml-2.5 text-xs text-dala-text-light cursor-pointer select-none"
                  >
                    Remember me for 30 days
                  </label>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-dala-green-dark text-white font-sans font-bold text-xs uppercase tracking-[0.15em] py-4 rounded-lg hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 flex justify-center items-center gap-2 cursor-pointer disabled:opacity-70"
                  >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                    <ArrowRight size={18} />
                  </button>
                </div>
              </form>

              {/* Bottom Security Badge */}
              <div className="mt-8 pt-5 border-t border-[#1b1c1c]/10 text-center flex justify-center items-center gap-2 text-dala-text-light">
                <ShieldCheck size={16} className="bg-dala-green-dark" />
                <span className="font-sans text-[11px] font-bold uppercase tracking-[0.15em] opacity-80">
                  Secure Admin Access
                </span>
              </div>

              {/* Toggle to Register */}
              <div className="mt-4 text-center">
                <p className="text-xs text-dala-text-light">
                  Need a staff account?{' '}
                  <button
                    onClick={() => {
                      setMode('register');
                      setErrorMsg('');
                    }}
                    className="text-[#765845] font-semibold hover:bg-dala-green-dark transition-colors underline cursor-pointer"
                  >
                    Register here
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Very minimal copyright footer */}
        <div className="text-center mt-6">
          <p className="font-sans text-[11px] font-bold uppercase tracking-[0.15em] text-dala-text-light/60">
            © 2026 DalaKitchen Professional. Secure Admin Portal.
          </p>
        </div>
      </main>

      {/* Forgot Password Modal Dialog */}
      {forgotPasswordOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl border border-gray-100 animate-in fade-in zoom-in-95">
            <h3 className="font-serif font-bold text-xl bg-dala-green-dark mb-2">
              Reset Password
            </h3>
            <p className="text-xs text-gray-600 mb-4">
              Enter your staff email address and we will send you instructions to reset your password.
            </p>

            {resetSent ? (
              <div className="p-4 bg-green-50 border border-green-200 text-green-800 text-xs rounded-lg text-center mb-4">
                ✓ Instructions sent to <strong>{forgotEmail}</strong>. Please check your inbox.
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="chef@dalakitchen.com"
                  className="w-full bg-dala-cream border border-gray-300 rounded-lg p-3 text-xs outline-none focus:border-[#27331c]"
                />
                <button
                  type="submit"
                  className="w-full bg-dala-green-dark text-white py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Send Reset Link
                </button>
              </form>
            )}

            <button
              onClick={() => {
                setForgotPasswordOpen(false);
                setResetSent(false);
              }}
              className="mt-3 w-full text-center text-xs text-gray-500 hover:text-gray-800 font-semibold cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
