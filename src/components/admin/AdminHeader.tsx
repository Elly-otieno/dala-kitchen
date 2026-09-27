import React, { useState } from 'react';
import { Search, Bell, ExternalLink, ShieldCheck, Check, Menu } from 'lucide-react';

interface AdminHeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onNavigateHome: () => void;
  onToggleMobileSidebar?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  onNavigateHome,
  onToggleMobileSidebar,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="bg-[#fcf9f8] border-b border-[#e6e2dc] py-2.5 sm:py-3.5 px-3.5 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-20 shadow-2xs gap-3">
      {/* Left: Mobile Toggle & Global Search */}
      <div className="flex items-center gap-2 flex-1 max-w-sm sm:max-w-md">
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 text-gray-700 hover:text-black hover:bg-[#eae6e1] rounded-xl cursor-pointer shrink-0 transition-colors"
            title="Open Menu"
            aria-label="Toggle navigation menu"
          >
            <Menu size={20} />
          </button>
        )}

        <div className="relative w-full">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search all..."
            className="w-full bg-white border border-[#d8d3cb] rounded-full py-1.5 sm:py-2 pl-9 sm:pl-10 pr-3 sm:pr-4 text-xs text-[#1b1c1c] placeholder:text-gray-400 focus:outline-none focus:border-[#24331e] focus:bg-white transition-all shadow-2xs"
          />
        </div>
      </div>

      {/* Right Utility Bar */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-[#24331e] hover:bg-[#34462c] text-white font-bold text-xs rounded-xl transition-colors shadow-2xs cursor-pointer"
          title="View Public Live Website"
        >
          <ExternalLink size={13} />
          <span className="hidden sm:inline">Live Site</span>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-gray-600 hover:text-[#1b1c1c] hover:bg-[#eae6e1] rounded-full transition-colors relative cursor-pointer"
            title="Notifications"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-64 sm:w-72 bg-white border border-[#e6e2dc] rounded-2xl shadow-xl p-4 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-[#e6e2dc] mb-3">
                <span className="font-serif font-bold text-[#1b1c1c]">Staff Notifications</span>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  2 New
                </span>
              </div>
              <div className="space-y-2 text-[#4a4a4a]">
                <div className="p-2 bg-[#f8f6f3] rounded-lg border border-[#e6e2dc]">
                  <p className="font-bold text-[#1b1c1c]">New Subscriber Joined</p>
                  <p className="text-[11px] text-gray-500">sarah.baker@dalakitchen.com via Sourdough guide</p>
                </div>
                <div className="p-2 bg-[#f8f6f3] rounded-lg border border-[#e6e2dc]">
                  <p className="font-bold text-[#1b1c1c]">Recipe Review Approved</p>
                  <p className="text-[11px] text-gray-500">Chef Marcus approved 5-star review on Swahili Pilau</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

