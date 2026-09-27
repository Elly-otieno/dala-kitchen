import React from 'react';
import {
  LayoutDashboard,
  UtensilsCrossed,
  FileText,
  Youtube,
  BarChart2,
  Users,
  Mail,
  Plus,
  LogOut,
  ExternalLink,
  Settings,
  HelpCircle,
  User as UserIcon,
  Sparkles,
  ChevronRight,
  X,
} from 'lucide-react';
import { Recipe, BlogArticle, YouTubeVideo } from '../../types';

export type AdminTabType =
  | 'dashboard'
  | 'recipes'
  | 'blog'
  | 'youtube'
  | 'analytics'
  | 'subscribers'
  | 'newsletters'
  | 'users'
  | 'settings'
  | 'support';

interface AdminSidebarProps {
  activeTab: AdminTabType;
  setActiveTab: (tab: AdminTabType) => void;
  onNewRecipe: () => void;
  onNewBlog: () => void;
  onNewYouTube: () => void;
  onLogout: () => void;
  onNavigateHome: () => void;
  user: { name: string; email: string; role: string } | null;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  onNewRecipe,
  onNewBlog,
  onNewYouTube,
  onLogout,
  onNavigateHome,
  user,
  mobileOpen = false,
  onMobileClose,
}) => {
  const [showNewMenu, setShowNewMenu] = React.useState(false);

  const navItems = [
    {
      id: 'dashboard' as const,
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'analytics' as const,
      label: 'Analytics',
      icon: BarChart2,
    },
    {
      id: 'users' as const,
      label: 'User Management',
      icon: UserIcon,
    },
    {
      id: 'subscribers' as const,
      label: 'Subscribers',
      icon: Users,
    },
    {
      id: 'newsletters' as const,
      label: 'Newsletters',
      icon: Mail,
    },
    {
      id: 'settings' as const,
      label: 'Site Settings',
      icon: Settings,
    },
    {
      id: 'support' as const,
      label: 'Staff Support',
      icon: HelpCircle,
    },
  ];

  const handleSelectTab = (tab: AdminTabType) => {
    setActiveTab(tab);
    onMobileClose?.();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-[#f8f6f3] text-[#1b1c1c] flex flex-col h-full border-r border-[#e6e2dc] transition-transform duration-300 ease-in-out lg:static lg:w-64 lg:h-screen lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        } select-none`}
      >
        {/* Brand Header & Kitchen Logo -> Reroutes to Live Site */}
        <div className="p-4 border-b border-[#e6e2dc] bg-white/50 flex items-center justify-between">
          <button
            onClick={() => {
              onNavigateHome();
              onMobileClose?.();
            }}
            className="flex-1 text-left group cursor-pointer flex items-center justify-between p-1.5 rounded-xl hover:bg-[#eae6e1] transition-all"
            title="Return to Public Live Website"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#e6e2dc] p-1 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform shrink-0 overflow-hidden">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBz7JEDgKCPIKFgy3Gav7l9pEUVX4wa0h9vP-nIfpBR1-HGUdHdWBfVd7cYzMusFLM0UGlW3YI1GoBz2Xtei9YOsiLv8IRIxOgJ7XIi47KtxemiqBsIT-0apni9puHrz2iSMPlmPIj-WLpsF6Baxbk3H88d2GuRU0MuFPrSxfIA70MbCynJeOXazLal3frFxzv_mH5wQ5y-2s13jzKhgQzgBng-q9egV-XRLuzt_4OwmT9XouHYPw_7lxkWckq_ZViWog"
                  alt="DalaKitchen Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="min-w-0">
                <h1 className="font-serif font-black text-base text-[#1b1c1c] tracking-[0.1em] uppercase leading-none group-hover:text-[#24331e] transition-colors truncate">
                  DALAKITCHEN
                </h1>
                <p className="text-[11px] font-medium text-[#765845] mt-0.5 flex items-center gap-1">
                  <span>View Live Site</span>
                  <ExternalLink size={12} className="text-gray-400 group-hover:text-[#24331e]" />
                </p>
              </div>
            </div>
          </button>

          {/* Close button on mobile */}
          <button
            onClick={onMobileClose}
            className="lg:hidden p-2 text-gray-500 hover:text-black hover:bg-[#eae6e1] rounded-xl cursor-pointer ml-1"
            title="Close navigation"
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-grow px-3 py-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const itemId = item.id as string;
            const isContentItem = ['recipes', 'blog', 'youtube'].includes(itemId);

            return (
              <div key={item.id} className="space-y-1">
                <button
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#24331e] text-white shadow-xs'
                      : 'text-[#3b3b3b] hover:bg-[#eae6e1] hover:text-black'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      size={18}
                      className={isActive ? 'text-white' : 'text-[#636363]'}
                    />
                    <span className="text-xs font-semibold">{item.label}</span>
                  </div>

                  {isContentItem && (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        if (itemId === 'recipes') onNewRecipe();
                        if (itemId === 'blog') onNewBlog();
                        if (itemId === 'youtube') onNewYouTube();
                        onMobileClose?.();
                      }}
                      className={`p-1 rounded-md transition-colors ${
                        isActive
                          ? 'text-white hover:bg-white/20'
                          : 'text-gray-500 hover:text-[#24331e] hover:bg-[#eae6e1]'
                      }`}
                      title={`Add ${item.label}`}
                    >
                      <Plus size={14} />
                    </span>
                  )}
                </button>

                {/* Sub-action for quick adding under active section */}
                {isActive && itemId === 'recipes' && (
                  <div className="pl-9 pr-2 pb-1">
                    <button
                      onClick={() => {
                        onNewRecipe();
                        onMobileClose?.();
                      }}
                      className="w-full text-left px-3 py-1.5 text-[11px] font-bold text-[#24331e] bg-[#e6eedf] hover:bg-[#d4e4cb] rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Plus size={13} /> + Add Recipe
                    </button>
                  </div>
                )}

                {isActive && itemId === 'blog' && (
                  <div className="pl-9 pr-2 pb-1">
                    <button
                      onClick={() => {
                        onNewBlog();
                        onMobileClose?.();
                      }}
                      className="w-full text-left px-3 py-1.5 text-[11px] font-bold text-[#24331e] bg-[#e6eedf] hover:bg-[#d4e4cb] rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Plus size={13} /> + Add Blog Article
                    </button>
                  </div>
                )}

                {isActive && itemId === 'youtube' && (
                  <div className="pl-9 pr-2 pb-1">
                    <button
                      onClick={() => {
                        onNewYouTube();
                        onMobileClose?.();
                      }}
                      className="w-full text-left px-3 py-1.5 text-[11px] font-bold text-[#24331e] bg-[#e6eedf] hover:bg-[#d4e4cb] rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Plus size={13} /> + Add YouTube Video
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Bottom New Content Action & Admin User Info */}
        <div className="p-3.5 border-t border-[#e6e2dc] space-y-3 mt-auto bg-white/30">
          {/* New Content Action Moved to Bottom */}
          <div className="relative">
            <button
              onClick={() => setShowNewMenu(!showNewMenu)}
              className="w-full py-2.5 px-4 bg-[#24331e] hover:bg-[#34462c] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus size={16} /> New Content
            </button>

            {showNewMenu && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-[#e6e2dc] rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <button
                  onClick={() => {
                    onNewRecipe();
                    setShowNewMenu(false);
                    onMobileClose?.();
                  }}
                  className="w-full text-left px-3 py-2.5 text-xs font-semibold text-[#1b1c1c] hover:bg-[#f4f1eb] rounded-lg flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <UtensilsCrossed size={15} className="text-[#24331e]" /> New Recipe
                </button>
                <button
                  onClick={() => {
                    onNewBlog();
                    setShowNewMenu(false);
                    onMobileClose?.();
                  }}
                  className="w-full text-left px-3 py-2.5 text-xs font-semibold text-[#1b1c1c] hover:bg-[#f4f1eb] rounded-lg flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <FileText size={15} className="text-[#765845]" /> New Blog Article
                </button>
                <button
                  onClick={() => {
                    onNewYouTube();
                    setShowNewMenu(false);
                    onMobileClose?.();
                  }}
                  className="w-full text-left px-3 py-2.5 text-xs font-semibold text-[#1b1c1c] hover:bg-[#f4f1eb] rounded-lg flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <Youtube size={15} className="text-red-600" /> New YouTube Video
                </button>
              </div>
            )}
          </div>

          {/* Admin Profile & Logout */}
          <div className="pt-2 border-t border-[#e6e2dc]/80 flex items-center justify-between px-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-8 h-8 rounded-xl bg-[#24331e] text-amber-100 border border-[#1b2716] flex items-center justify-center font-serif font-bold text-xs tracking-wider shrink-0 shadow-2xs select-none"
                title={user?.name || 'Admin'}
              >
                {(() => {
                  if (!user?.name) return 'DK';
                  const parts = user.name.trim().split(/\s+/);
                  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
                  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
                })()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#1b1c1c] truncate">
                  {user?.name || 'Admin'}
                </p>
                <p className="text-[10px] text-gray-500 truncate">
                  {user?.role || 'Administrator'}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                onLogout();
                onMobileClose?.();
              }}
              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
