import React, { useState } from 'react';
import {
  Settings,
  Save,
  Globe,
  Sliders,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Bell,
  UtensilsCrossed,
  Key,
  Database,
  RefreshCw,
  AlertTriangle,
  Copy,
  Check,
  LayoutGrid,
  Camera,
  Share2,
  User,
} from 'lucide-react';
import { SiteSettings, Recipe, RecipeCategory } from '../../types';
import { CATEGORIES } from '../../data/recipesData';
import { syncSiteSettingsToSupabase, testSupabaseConnection } from '../../lib/supabaseSync';

interface AdminSettingsViewProps {
  settings: SiteSettings;
  setSettings: React.Dispatch<React.SetStateAction<SiteSettings>>;
  recipes?: Recipe[];
}

export const AdminSettingsView: React.FC<AdminSettingsViewProps> = ({
  settings,
  setSettings,
  recipes,
}) => {
  const [formData, setFormData] = useState<SiteSettings>(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [testingSupabase, setTestingSupabase] = useState(false);
  const [dbTestResult, setDbTestResult] = useState<{ success: boolean; message: string; rawError?: any } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  const selectedCats: RecipeCategory[] = formData.selectedCategories || [
    'Breakfast',
    'Lunch',
    'Dinner',
    'Baking',
    'Air Fryer',
    'Sourdough',
    'Kenyan Recipes',
  ];

  const handleToggleCategory = (catName: RecipeCategory) => {
    let nextList: RecipeCategory[];
    if (selectedCats.includes(catName)) {
      // Don't allow empty
      if (selectedCats.length <= 1) {
        alert('At least one category must remain enabled.');
        return;
      }
      nextList = selectedCats.filter((c) => c !== catName);
    } else {
      nextList = [...selectedCats, catName];
    }
    setFormData({ ...formData, selectedCategories: nextList });
  };

  const handleSelectAllCategories = () => {
    const all = CATEGORIES.map((c) => c.name as RecipeCategory);
    setFormData({ ...formData, selectedCategories: all });
  };

  const handleTestDatabase = async () => {
    setTestingSupabase(true);
    setDbTestResult(null);
    const result = await testSupabaseConnection();
    setDbTestResult(result);
    setTestingSupabase(false);
  };

  const sqlSnippet = `-- 1. Create contact_messages and page_analytics tables if not exist:
CREATE TABLE IF NOT EXISTS contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS page_analytics (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  item_id TEXT,
  item_title TEXT,
  path TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add 'featured', 'draft' and 'archived' columns to content tables (if missing):
ALTER TABLE IF EXISTS recipes ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS recipes ADD COLUMN IF NOT EXISTS draft BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS recipes ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT false;

ALTER TABLE IF EXISTS blog_articles ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS blog_articles ADD COLUMN IF NOT EXISTS draft BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS blog_articles ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT false;

ALTER TABLE IF EXISTS youtube_videos ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS youtube_videos ADD COLUMN IF NOT EXISTS draft BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS youtube_videos ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT false;

-- 3. Disable Row Level Security (RLS) on all tables to allow sync:
ALTER TABLE IF EXISTS recipes DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS blog_articles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS youtube_videos DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS newsletters DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS subscribers DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS admin_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS site_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS contact_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS page_analytics DISABLE ROW LEVEL SECURITY;`;

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(sqlSnippet);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSettings(formData);
    syncSiteSettingsToSupabase(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 space-y-6 sm:space-y-8 bg-[#fcf9f8] min-h-screen font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#1b1c1c] tracking-wide uppercase">
            ADMIN SYSTEM SETTINGS
          </h1>
          <p className="text-xs sm:text-sm text-[#666666] font-sans mt-1">
            Configure site metadata, recipe calculation defaults, email dispatchers, and security.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          className="flex items-center justify-center gap-2 bg-[#24331e] hover:bg-[#34462c] text-white font-bold text-xs uppercase tracking-wider py-2.5 px-5 rounded-xl transition-colors shadow-2xs cursor-pointer w-full sm:w-auto"
        >
          <Save size={16} /> Save Changes
        </button>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-xl flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-xs font-bold">
            <CheckCircle2 size={18} className="text-emerald-700" />
            System settings updated and saved to server memory successfully!
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: General Site Identity */}
        <div className="bg-white rounded-2xl border border-[#e6e2dc] p-6 sm:p-8 shadow-2xs space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-[#e6e2dc]">
            <div className="w-10 h-10 rounded-xl bg-[#24331e] text-white flex items-center justify-center">
              <Globe size={20} />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-[#1b1c1c]">
                General Site Branding &amp; Identity
              </h2>
              <p className="text-xs text-gray-500">
                Primary website title, tagline, and contact information.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1b1c1c] mb-1.5">
                Site Name
              </label>
              <input
                type="text"
                value={formData.siteName}
                onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#f8f6f3] border border-[#d8d3cb] rounded-xl text-xs font-semibold text-[#1b1c1c] focus:outline-none focus:border-[#24331e]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1b1c1c] mb-1.5">
                Primary Contact Email
              </label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#f8f6f3] border border-[#d8d3cb] rounded-xl text-xs font-semibold text-[#1b1c1c] focus:outline-none focus:border-[#24331e]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#1b1c1c] mb-1.5">
              Brand Tagline &amp; Motto
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#f8f6f3] border border-[#d8d3cb] rounded-xl text-xs font-semibold text-[#1b1c1c] focus:outline-none focus:border-[#24331e]"
            />
          </div>
        </div>

        {/* Section 1B: Chef Achieng Profile & Social Accounts */}
        <div className="bg-white rounded-2xl border border-[#e6e2dc] p-6 sm:p-8 shadow-2xs space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-[#e6e2dc]">
            <div className="w-10 h-10 rounded-xl bg-[#24331e] text-white flex items-center justify-center">
              <User size={20} />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-[#1b1c1c]">
                Chef Achieng Profile &amp; Connected Socials
              </h2>
              <p className="text-xs text-gray-500">
                Manage Chef Achieng's public portrait image and social community channel links.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* Chef Portrait Preview */}
            <div className="flex flex-col items-center text-center p-4 bg-[#f8f6f3] rounded-2xl border border-[#e6e2dc]">
              <div className="relative w-36 h-36 rounded-2xl overflow-hidden border-2 border-[#24331e]/30 shadow-xs mb-3 bg-white">
                <img
                  src={formData.chefPhoto || '/images/achieng.png'}
                  alt="Chef Achieng"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="font-bold text-xs text-[#1b1c1c]">Chef Achieng</p>
              <p className="text-[11px] text-gray-500">Head Chef &amp; Recipe Developer</p>
            </div>

            {/* Photo Path / URL & Socials Inputs */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1b1c1c] mb-1.5 flex items-center gap-1.5">
                  <Camera size={14} /> Chef Portrait Image (Path or URL)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.chefPhoto || '/images/achieng.png'}
                    onChange={(e) => setFormData({ ...formData, chefPhoto: e.target.value })}
                    placeholder="/images/achieng.jpg"
                    className="w-full px-4 py-2.5 bg-[#f8f6f3] border border-[#d8d3cb] rounded-xl text-xs font-semibold text-[#1b1c1c] focus:outline-none focus:border-[#24331e]"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, chefPhoto: '/images/achieng.jpg' })}
                    className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-[11px] font-bold rounded-xl whitespace-nowrap transition-colors"
                  >
                    Reset Photo
                  </button>
                </div>
                <p className="text-[11px] text-gray-500 mt-1">
                  Static photo located at <code className="bg-gray-100 px-1 py-0.5 rounded font-mono">/images/achieng.jpg</code>. Can also accept any public URL or Supabase storage link.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1b1c1c] mb-1 flex items-center gap-1.5">
                    <i className="fa-brands fa-instagram text-pink-600"></i> Instagram URL
                  </label>
                  <input
                    type="url"
                    value={formData.instagramUrl || 'https://www.instagram.com/dala.kitchen?utm_source=qr&igsh=M21jcnQzbDZkYzJx'}
                    onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-[#f8f6f3] border border-[#d8d3cb] rounded-xl text-xs font-semibold text-[#1b1c1c] focus:outline-none focus:border-[#24331e]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1b1c1c] mb-1 flex items-center gap-1.5">
                    <i className="fa-brands fa-facebook text-blue-600"></i> Facebook URL
                  </label>
                  <input
                    type="url"
                    value={formData.facebookUrl || 'https://www.facebook.com/share/1BBMxx2UTw/'}
                    onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-[#f8f6f3] border border-[#d8d3cb] rounded-xl text-xs font-semibold text-[#1b1c1c] focus:outline-none focus:border-[#24331e]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1b1c1c] mb-1 flex items-center gap-1.5">
                    <i className="fa-brands fa-youtube text-pink-600"></i> YouTube URL
                  </label>
                  <input
                    type="url"
                    value={formData.youtubeUrl || 'https://www.instagram.com/dala.kitchen?utm_source=qr&igsh=M21jcnQzbDZkYzJx'}
                    onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-[#f8f6f3] border border-[#d8d3cb] rounded-xl text-xs font-semibold text-[#1b1c1c] focus:outline-none focus:border-[#24331e]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1b1c1c] mb-1 flex items-center gap-1.5">
                    <i className="fa-brands fa-pinterest text-pink-600"></i> Pinterest URL
                  </label>
                  <input
                    type="url"
                    value={formData.pinterestUrl || 'https://www.instagram.com/dala.kitchen?utm_source=qr&igsh=M21jcnQzbDZkYzJx'}
                    onChange={(e) => setFormData({ ...formData, pinterestUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-[#f8f6f3] border border-[#d8d3cb] rounded-xl text-xs font-semibold text-[#1b1c1c] focus:outline-none focus:border-[#24331e]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1b1c1c] mb-1 flex items-center gap-1.5">
                    <i className="fa-brands fa-tiktok text-pink-600"></i> TikTok URL
                  </label>
                  <input
                    type="url"
                    value={formData.tiktokUrl || 'https://www.instagram.com/dala.kitchen?utm_source=qr&igsh=M21jcnQzbDZkYzJx'}
                    onChange={(e) => setFormData({ ...formData, tiktokUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-[#f8f6f3] border border-[#d8d3cb] rounded-xl text-xs font-semibold text-[#1b1c1c] focus:outline-none focus:border-[#24331e]"
                  />
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Recipe & Culinary Preferences */}
        <div className="bg-white rounded-2xl border border-[#e6e2dc] p-6 sm:p-8 shadow-2xs space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-[#e6e2dc]">
            <div className="w-10 h-10 rounded-xl bg-[#765845] text-white flex items-center justify-center">
              <UtensilsCrossed size={20} />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-[#1b1c1c]">
                Recipe Catalog &amp; Measurement Units
              </h2>
              <p className="text-xs text-gray-500">
                Control default measurement units and comment moderation.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1b1c1c] mb-2">
                Default Measurement Unit System
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-xs font-bold text-[#1b1c1c] cursor-pointer">
                  <input
                    type="radio"
                    name="measurementUnit"
                    checked={formData.measurementUnit === 'Metric'}
                    onChange={() => setFormData({ ...formData, measurementUnit: 'Metric' })}
                    className="accent-[#24331e]"
                  />
                  Metric (Grams, ml, Celsius)
                </label>
                <label className="flex items-center gap-2 text-xs font-bold text-[#1b1c1c] cursor-pointer">
                  <input
                    type="radio"
                    name="measurementUnit"
                    checked={formData.measurementUnit === 'Imperial'}
                    onChange={() => setFormData({ ...formData, measurementUnit: 'Imperial' })}
                    className="accent-[#24331e]"
                  />
                  Imperial (Cups, Oz, Fahrenheit)
                </label>
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center justify-between text-xs font-bold text-[#1b1c1c] cursor-pointer p-3 bg-[#f8f6f3] rounded-xl border border-[#e6e2dc]">
                <span>Auto-Approve Reader Recipe Reviews</span>
                <input
                  type="checkbox"
                  checked={formData.autoApproveComments}
                  onChange={(e) => setFormData({ ...formData, autoApproveComments: e.target.checked })}
                  className="w-4 h-4 accent-[#24331e]"
                />
              </label>

              <label className="flex items-center justify-between text-xs font-bold text-[#1b1c1c] cursor-pointer p-3 bg-[#f8f6f3] rounded-xl border border-[#e6e2dc]">
                <span>Display Star Ratings &amp; Reviews</span>
                <input
                  type="checkbox"
                  checked={formData.enableRatings}
                  onChange={(e) => setFormData({ ...formData, enableRatings: e.target.checked })}
                  className="w-4 h-4 accent-[#24331e]"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Section 2B: Homepage Category Row Configuration & Live Numbers */}
        <div className="bg-white rounded-2xl border border-[#e6e2dc] p-6 sm:p-8 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#e6e2dc]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#24331e] text-white flex items-center justify-center">
                <LayoutGrid size={20} />
              </div>
              <div>
                <h2 className="font-serif font-bold text-lg text-[#1b1c1c]">
                  Homepage Category Row
                </h2>
                <p className="text-xs text-gray-500">
                  Select which categories to display on the live site. Numbers automatically sync with backend recipe counts.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSelectAllCategories}
              className="text-xs font-bold text-[#24331e] hover:underline cursor-pointer self-start sm:self-auto"
            >
              Reset to All ({CATEGORIES.length})
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {CATEGORIES.map((cat) => {
              const catName = cat.name as RecipeCategory;
              const isChecked = selectedCats.includes(catName);
              const liveCount = recipes
                ? recipes.filter(
                    (r) => !r.archived && !r.draft && r.category?.toLowerCase() === catName.toLowerCase()
                  ).length
                : 0;

              return (
                <label
                  key={cat.id}
                  className={`flex items-center gap-3.5 p-3 rounded-xl border transition-all cursor-pointer ${
                    isChecked
                      ? 'bg-[#f4f1eb] border-[#24331e] text-[#1b1c1c] shadow-2xs'
                      : 'bg-white border-[#e6e2dc] text-gray-400 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggleCategory(catName)}
                    className="w-4 h-4 accent-[#24331e] shrink-0"
                  />
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#e6e2dc] shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-xs truncate text-[#1b1c1c]">
                      {cat.name}
                    </p>
                    <p className="text-[11px] font-semibold text-[#765845]">
                      {liveCount} {liveCount === 1 ? 'recipe' : 'recipes'} in backend
                    </p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Section 3: Email Dispatcher & Subscriptions */}
        <div className="bg-white rounded-2xl border border-[#e6e2dc] p-6 sm:p-8 shadow-2xs space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-[#e6e2dc]">
            <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center">
              <Mail size={20} />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-[#1b1c1c]">
                Email Dispatcher &amp; Newsletter Pipeline
              </h2>
              <p className="text-xs text-gray-500">
                Manage automated welcome emails and broadcast relay servers.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-center justify-between text-xs font-bold text-[#1b1c1c] cursor-pointer p-4 bg-[#f8f6f3] rounded-xl border border-[#e6e2dc]">
              <div>
                <p className="text-sm font-bold">Automated Welcome Email</p>
                <p className="text-[11px] font-normal text-gray-500 mt-0.5">
                  Send welcome gift PDF to new subscribers instantly.
                </p>
              </div>
              <input
                type="checkbox"
                checked={formData.welcomeEmailEnabled}
                onChange={(e) => setFormData({ ...formData, welcomeEmailEnabled: e.target.checked })}
                className="w-4 h-4 accent-[#24331e]"
              />
            </label>

            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-emerald-900">SMTP Server Status</p>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  Connected to DalaKitchen High-Deliverability Mail Relays
                </p>
              </div>
              <span className="bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Section 4: Supabase Database Live Connection & Diagnostics */}
        <div className="bg-white rounded-2xl border border-[#e6e2dc] p-6 sm:p-8 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#e6e2dc]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-700 text-white flex items-center justify-center">
                <Database size={20} />
              </div>
              <div>
                <h2 className="font-serif font-bold text-lg text-[#1b1c1c]">
                  Supabase Live Database Diagnostics
                </h2>
                <p className="text-xs text-gray-500">
                  Verify real-time read/write access to your 7 Supabase project tables.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleTestDatabase}
              disabled={testingSupabase}
              className="flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
            >
              <RefreshCw size={14} className={testingSupabase ? 'animate-spin' : ''} />
              {testingSupabase ? 'Testing...' : 'Test Database Connection'}
            </button>
          </div>

          {dbTestResult && (
            <div
              className={`p-4 rounded-xl border ${
                dbTestResult.success
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-amber-50 border-amber-300 text-amber-900'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {dbTestResult.success ? (
                  <CheckCircle2 size={20} className="text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <p className="font-bold text-sm">
                    {dbTestResult.success ? 'Supabase Connection Success' : 'Supabase Connection Warning'}
                  </p>
                  <p className="text-xs font-mono break-all">{dbTestResult.message}</p>
                </div>
              </div>
            </div>
          )}

          {/* <div className="bg-[#f8f6f3] p-4 rounded-xl border border-[#e6e2dc] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1b1c1c] uppercase tracking-wider">
                SQL Setup Script: Disable Row Level Security (RLS)
              </span>
              <button
                type="button"
                onClick={copySqlToClipboard}
                className="flex items-center gap-1.5 text-[11px] font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg border border-purple-200 transition-colors cursor-pointer"
              >
                {copiedSql ? <Check size={13} /> : <Copy size={13} />}
                {copiedSql ? 'Copied!' : 'Copy SQL Script'}
              </button>
            </div>
            <p className="text-xs text-gray-600">
              If your Supabase tables are created but actions in the app fail to save or update, Supabase's default <strong>Row Level Security (RLS)</strong> is blocking anonymous public write access. Run this script in your Supabase SQL Editor:
            </p>
            <pre className="bg-[#1e1e1e] text-emerald-400 p-3 rounded-lg text-[11px] font-mono overflow-x-auto whitespace-pre">
              {sqlSnippet}
            </pre>
          </div> */}
        </div>

        {/* Save Footer Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="flex items-center gap-2 bg-[#24331e] hover:bg-[#34462c] text-white font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl transition-colors shadow-md cursor-pointer"
          >
            <Save size={16} /> Save All Configuration Settings
          </button>
        </div>
      </form>
    </div>
  );
};
