import React from 'react';
import {
  TrendingUp,
  Eye,
  Users,
  UtensilsCrossed,
  Youtube,
  FileText,
  Sparkles,
  Inbox,
  Clock,
  Activity,
  Trash2,
  Globe,
} from 'lucide-react';
import { Recipe, BlogArticle, YouTubeVideo, Subscriber, ContactMessage, AnalyticsEvent } from '../../types';

interface AdminAnalyticsViewProps {
  recipes: Recipe[];
  articles?: BlogArticle[];
  videos?: YouTubeVideo[];
  subscribers?: Subscriber[];
  contactMessages?: ContactMessage[];
  analyticsEvents?: AnalyticsEvent[];
  onClearAnalytics?: () => void;
}

export const AdminAnalyticsView: React.FC<AdminAnalyticsViewProps> = ({
  recipes = [],
  articles = [],
  videos = [],
  subscribers = [],
  contactMessages = [],
  analyticsEvents = [],
  onClearAnalytics,
}) => {
  // Real stats calculation
  const totalEventsCount = analyticsEvents.length;
  const recipeViewsCount = analyticsEvents.filter((e) => e.eventType === 'recipe_view').length;
  const pageVisitsCount = analyticsEvents.filter((e) => e.eventType === 'page_view').length;
  const articleViewsCount = analyticsEvents.filter((e) => e.eventType === 'article_view').length;
  const videoViewsCount = analyticsEvents.filter((e) => e.eventType === 'video_view').length;
  const conversionEventsCount = analyticsEvents.filter(
    (e) => e.eventType === 'newsletter_signup' || e.eventType === 'contact_submit'
  ).length;

  // Recipe view count map
  const recipeViewCountsMap: Record<string, number> = {};
  analyticsEvents.forEach((ev) => {
    if (ev.eventType === 'recipe_view' && ev.itemId) {
      recipeViewCountsMap[ev.itemId] = (recipeViewCountsMap[ev.itemId] || 0) + 1;
    }
  });

  // Top Ranked Recipes by actual views (or fall back to reviewCount)
  const topRecipes = [...recipes]
    .sort((a, b) => {
      const viewsA = recipeViewCountsMap[a.id] || 0;
      const viewsB = recipeViewCountsMap[b.id] || 0;
      if (viewsA !== viewsB) return viewsB - viewsA;
      return (b.reviewCount || 0) - (a.reviewCount || 0);
    })
    .slice(0, 5);

  // Catalog total count
  const totalCatalogItems = recipes.length + articles.length + videos.length;
  const recipePercent = totalCatalogItems > 0 ? Math.round((recipes.length / totalCatalogItems) * 100) : 0;
  const articlePercent = totalCatalogItems > 0 ? Math.round((articles.length / totalCatalogItems) * 100) : 0;
  const videoPercent = totalCatalogItems > 0 ? Math.round((videos.length / totalCatalogItems) * 100) : 0;

  const getEventBadge = (type: AnalyticsEvent['eventType']) => {
    switch (type) {
      case 'recipe_view':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">Recipe View</span>;
      case 'article_view':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-100 text-amber-800 border border-amber-200">Article View</span>;
      case 'video_view':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-red-100 text-red-800 border border-red-200">Video Watch</span>;
      case 'newsletter_signup':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-purple-100 text-purple-800 border border-purple-200">New Subscriber</span>;
      case 'contact_submit':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-blue-100 text-blue-800 border border-blue-200">Contact Msg</span>;
      case 'page_view':
      default:
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-gray-100 text-gray-700 border border-gray-200">Page Navigation</span>;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 bg-[#fcf9f8] min-h-screen">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e6e2dc] pb-5">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#1b1c1c] flex items-center gap-2">
            <Activity className="text-emerald-700" size={26} /> Real-Time Analytics & Traffic Insights
          </h1>
          <p className="text-xs text-gray-600 mt-1">
            Live captured user interactions, recipe views, article reads, and platform conversion logs.
          </p>
        </div>
        {onClearAnalytics && analyticsEvents.length > 0 && (
          <button
            type="button"
            onClick={onClearAnalytics}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-red-200 hover:bg-red-50 text-red-600 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0"
          >
            <Trash2 size={14} /> Clear Activity Logs
          </button>
        )}
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Total Recorded Events
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Activity size={18} />
            </div>
          </div>
          <h3 className="text-3xl font-serif font-bold text-[#1b1c1c] mt-2">
            {totalEventsCount}
          </h3>
          <p className="text-xs text-emerald-700 font-semibold mt-2 flex items-center gap-1">
            <TrendingUp size={14} /> Live database captured
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Recipe Views
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#27331c]/10 text-[#27331c] flex items-center justify-center">
              <Eye size={18} />
            </div>
          </div>
          <h3 className="text-3xl font-serif font-bold text-[#1b1c1c] mt-2">
            {recipeViewsCount}
          </h3>
          <p className="text-xs text-[#27331c] font-semibold mt-2 flex items-center gap-1">
            <UtensilsCrossed size={14} /> {recipes.length} active recipes
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Subscribers & Leads
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Users size={18} />
            </div>
          </div>
          <h3 className="text-3xl font-serif font-bold text-[#1b1c1c] mt-2">
            {subscribers.length + contactMessages.length}
          </h3>
          <p className="text-xs text-amber-800 mt-2 font-medium">
            {subscribers.length} Subscribers | {contactMessages.length} Inbound Msgs
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Articles & Videos Views
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#765845]/10 text-[#765845] flex items-center justify-center">
              <FileText size={18} />
            </div>
          </div>
          <h3 className="text-3xl font-serif font-bold text-[#1b1c1c] mt-2">
            {articleViewsCount + videoViewsCount}
          </h3>
          <p className="text-xs text-gray-600 mt-2 font-medium">
            {articles.length} Articles | {videos.length} YouTube Guides
          </p>
        </div>
      </div>

      {/* Analytics Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Activity Stream & Content Breakdown (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Live Activity Stream Table */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-2xs space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="font-serif font-bold text-xl text-[#1b1c1c] flex items-center gap-2">
                  <Globe size={20} className="text-emerald-700" /> Live Interaction Stream
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Captured in real-time as visitors navigate and view content.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                ● Live Database Feed
              </span>
            </div>

            {analyticsEvents.length === 0 ? (
              <div className="p-8 text-center bg-[#f8f6f3] rounded-xl border border-dashed border-[#d8d3cb]">
                <Activity size={32} className="mx-auto text-gray-400 mb-2" />
                <p className="text-sm font-bold text-gray-700">No interaction events captured yet</p>
                <p className="text-xs text-gray-500 mt-1">
                  Navigate the DalaKitchen public tabs, click on recipes, read articles, or send a message to generate real-time analytics data!
                </p>
              </div>
            ) : (
              <div className="max-h-[380px] overflow-y-auto border border-gray-200 rounded-xl divide-y divide-gray-100">
                {analyticsEvents.slice(0, 30).map((ev) => (
                  <div key={ev.id} className="p-3.5 flex items-center justify-between gap-3 hover:bg-[#fcf9f8] transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      {getEventBadge(ev.eventType)}
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#1b1c1c] truncate">
                          {ev.itemTitle || ev.path || 'Page Navigation'}
                        </p>
                        {ev.path && (
                          <p className="text-[10px] text-gray-500 font-mono truncate">
                            path: /{ev.path}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-gray-500 flex items-center gap-1">
                        <Clock size={11} />
                        {new Date(ev.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Catalog Distribution */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-2xs space-y-6">
            <h3 className="font-serif font-bold text-xl text-[#1b1c1c] border-b border-gray-100 pb-3">
              Content Catalog Breakdown
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                  <span className="flex items-center gap-2">
                    <UtensilsCrossed size={14} className="text-[#27331c]" /> Recipes Catalog
                  </span>
                  <span>{recipePercent}% ({recipes.length} dishes)</span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#27331c] h-full transition-all duration-500" style={{ width: `${recipePercent}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                  <span className="flex items-center gap-2">
                    <FileText size={14} className="text-amber-700" /> Food Science Articles
                  </span>
                  <span>{articlePercent}% ({articles.length} articles)</span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-amber-600 h-full transition-all duration-500" style={{ width: `${articlePercent}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                  <span className="flex items-center gap-2">
                    <Youtube size={14} className="text-red-600" /> YouTube Video Guides
                  </span>
                  <span>{videoPercent}% ({videos.length} videos)</span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-red-600 h-full transition-all duration-500" style={{ width: `${videoPercent}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Top Ranked Recipes & Conversions (4 cols) */}
        <div className="lg:col-span-4 space-y-8">
          {/* Top Ranked Recipes */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-6">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="font-serif font-bold text-lg text-[#1b1c1c] flex items-center gap-2">
                <Sparkles size={18} className="text-amber-500" /> Most Popular Recipes
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Ranked by real captured view counts
              </p>
            </div>

            <div className="space-y-4">
              {topRecipes.map((recipe, idx) => {
                const views = recipeViewCountsMap[recipe.id] || 0;
                return (
                  <div
                    key={recipe.id}
                    className="flex items-center gap-3 p-2.5 bg-[#fcf9f8] rounded-xl border border-gray-200/80"
                  >
                    <span className="w-6 h-6 rounded-full bg-[#27331c] text-white font-serif font-bold text-xs flex items-center justify-center flex-shrink-0">
                      #{idx + 1}
                    </span>
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-11 h-11 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="min-w-0 flex-grow">
                      <h4 className="font-serif font-bold text-xs text-[#1b1c1c] truncate">
                        {recipe.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-0.5">
                        <span className="font-bold text-emerald-700 flex items-center gap-0.5">
                          <Eye size={10} /> {views} views
                        </span>
                        <span>•</span>
                        <span>★ {recipe.rating}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Metrics Summary */}
          <div className="bg-[#27331c] text-white p-6 rounded-2xl space-y-4 shadow-sm">
            <h4 className="font-serif font-bold text-base text-amber-200 flex items-center gap-2">
              <Inbox size={18} /> Audience Conversion
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="text-gray-300">Newsletter Subscribers</span>
                <span className="font-bold text-amber-300">{subscribers.length}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="text-gray-300">Inbound Contact Msgs</span>
                <span className="font-bold text-amber-300">{contactMessages.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Page Navigation Events</span>
                <span className="font-bold text-amber-300">{pageVisitsCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
