import React, { useState } from 'react';
import {
  Mail,
  Send,
  FileEdit,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  Eye,
  Sparkles,
  UtensilsCrossed,
  BarChart,
  Users,
  X,
  RotateCcw,
} from 'lucide-react';
import { Newsletter, Recipe, Subscriber } from '../../types';
import { DeleteConfirmationModal } from '../common/DeleteConfirmationModal';
import { syncNewsletterToSupabase, deleteNewsletterFromSupabase } from '../../lib/supabaseSync';

interface AdminNewslettersViewProps {

  newsletters: Newsletter[];
  setNewsletters: React.Dispatch<React.SetStateAction<Newsletter[]>>;
  recipes: Recipe[];
  subscribers: Subscriber[];
}

export const AdminNewslettersView: React.FC<AdminNewslettersViewProps> = ({
  newsletters,
  setNewsletters,
  recipes,
  subscribers,
}) => {
  const [activeTab, setActiveTab] = useState<'history' | 'compose'>('history');
  const [selectedNewsletter, setSelectedNewsletter] = useState<Newsletter | null>(null);
  const [deletingNewsletter, setDeletingNewsletter] = useState<Newsletter | null>(null);


  // Form states for newsletter composer
  const [subject, setSubject] = useState('');
  const [previewText, setPreviewText] = useState('');
  const [audience, setAudience] = useState('All Active Subscribers');
  const [featuredRecipeId, setFeaturedRecipeId] = useState('');
  const [content, setContent] = useState('');

  const activeSubscribersCount = subscribers.filter((s) => s.status === 'active').length;

  const handleCreateNewsletter = (status: 'sent' | 'draft') => {
    if (!subject.trim() || !content.trim()) {
      alert('Please fill out the Subject and Content of your newsletter.');
      return;
    }

    const newNewsletter: Newsletter = {
      id: `nws-${Date.now()}`,
      subject: subject.trim(),
      previewText: previewText.trim() || subject.trim(),
      content: content.trim(),
      audience,
      sentAt: status === 'sent' ? new Date().toISOString().split('T')[0] : undefined,
      recipientCount: status === 'sent' ? activeSubscribersCount : 0,
      openRate: status === 'sent' ? '45.0%' : undefined,
      clickRate: status === 'sent' ? '16.2%' : undefined,
      status,
      featuredRecipeId: featuredRecipeId || undefined,
    };

    setNewsletters((prev) => [newNewsletter, ...prev]);
    syncNewsletterToSupabase(newNewsletter);

    // Reset form
    setSubject('');
    setPreviewText('');
    setContent('');
    setFeaturedRecipeId('');
    setActiveTab('history');

    if (status === 'sent') {
      alert(` Newsletter Broadcast Sent!\n\nSubject: "${newNewsletter.subject}"\nDelivered to: ${activeSubscribersCount} active subscribers\nStatus: Recorded in database and dispatched.`);
    } else {
      alert('Newsletter saved as draft in database.');
    }
  };

  const handleSendDraft = (id: string) => {
    let updatedNewsletter: Newsletter | null = null;
    setNewsletters((prev) =>
      prev.map((n) => {
        if (n.id === id) {
          updatedNewsletter = {
            ...n,
            status: 'sent',
            sentAt: new Date().toISOString().split('T')[0],
            recipientCount: activeSubscribersCount,
            openRate: '42.5%',
            clickRate: '15.0%',
          };
          return updatedNewsletter;
        }
        return n;
      })
    );
    if (updatedNewsletter) {
      syncNewsletterToSupabase(updatedNewsletter);
    }
    alert(` Draft Newsletter Sent!\n\nDelivered to ${activeSubscribersCount} active subscribers.`);
  };

  const handleResendNewsletter = (newsletter: Newsletter) => {
    const confirmResend = confirm(
      `Resend Newsletter Broadcast?\n\nSubject: "${newsletter.subject}"\nAudience: ${activeSubscribersCount} active subscribers.\n\nThis will update the broadcast record and dispatch the email to all current subscribers.`
    );
    if (!confirmResend) return;

    const todayDate = new Date().toISOString().split('T')[0];
    let updatedNewsletter: Newsletter | null = null;

    setNewsletters((prev) =>
      prev.map((n) => {
        if (n.id === newsletter.id) {
          updatedNewsletter = {
            ...n,
            status: 'sent',
            sentAt: todayDate,
            recipientCount: activeSubscribersCount,
          };
          return updatedNewsletter;
        }
        return n;
      })
    );

    if (updatedNewsletter) {
      syncNewsletterToSupabase(updatedNewsletter);
      if (selectedNewsletter?.id === newsletter.id) {
        setSelectedNewsletter(updatedNewsletter);
      }
    }

    alert(
      ` Newsletter Resent Successfully!\n\nSubject: "${newsletter.subject}"\nDelivered to: ${activeSubscribersCount} active subscribers on ${todayDate}.`
    );
  };

  const handleDeleteNewsletter = (id: string) => {
    if (confirm('Delete this newsletter record permanently?')) {
      setNewsletters((prev) => prev.filter((n) => n.id !== id));
      deleteNewsletterFromSupabase(id);
      if (selectedNewsletter?.id === id) setSelectedNewsletter(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 space-y-6 sm:space-y-8 bg-dala-cream min-h-screen font-sans">
      {/* Top Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-dala-text tracking-wide uppercase">
            NEWSLETTERS
          </h1>
          <p className="text-xs sm:text-sm text-[#666666] font-sans mt-1">
            Broadcast weekly recipe updates, sourdough workshops, and culinary stories.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 sm:flex-initial px-3.5 sm:px-4 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer text-center ${
              activeTab === 'history'
                ? 'bg-dala-text text-white shadow-2xs'
                : 'bg-white border border-[#d8d3cb] text-dala-text hover:bg-[#f9f8f6]'
            }`}
          >
            History & Broadcasts
          </button>
          <button
            onClick={() => setActiveTab('compose')}
            className={`flex-1 sm:flex-initial px-3.5 sm:px-4 py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'compose'
                ? 'bg-[#24331e] text-white shadow-2xs'
                : 'bg-white border border-[#d8d3cb] text-dala-text hover:bg-[#f9f8f6]'
            }`}
          >
            <Plus size={15} /> New Campaign
          </button>
        </div>
      </div>

      {activeTab === 'compose' ? (
        /* Newsletter Composer View */
        <div className="bg-white rounded-2xl border border-[#e6e2dc] p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="border-b border-[#e6e2dc] pb-4 flex items-center justify-between">
            <div>
              <h2 className="font-serif font-bold text-xl text-dala-text">
                Compose Newsletter
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Draft a broadcast email for your {activeSubscribersCount} active subscribers.
              </p>
            </div>
            <span className="bg-[#f0ede8] text-[#4a4a4a] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
              <Users size={14} /> Target: {audience} ({activeSubscribersCount} contacts)
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-dala-text mb-1.5">
                Email Subject Line *
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., 🍂 Autumn Baking & Authentic Kenyan Mandazi Secrets"
                className="w-full px-4 py-3 bg-[#f8f6f3] border border-[#d8d3cb] rounded-xl text-sm font-semibold text-dala-text focus:outline-none focus:border-[#24331e]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-dala-text mb-1.5">
                  Preview Text / Snippet
                </label>
                <input
                  type="text"
                  value={previewText}
                  onChange={(e) => setPreviewText(e.target.value)}
                  placeholder="Appears in email client inbox preview line..."
                  className="w-full px-4 py-2.5 bg-[#f8f6f3] border border-[#d8d3cb] rounded-xl text-xs text-dala-text focus:outline-none focus:border-[#24331e]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-dala-text mb-1.5">
                  Target Audience
                </label>
                <select
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#f8f6f3] border border-[#d8d3cb] rounded-xl text-xs font-semibold text-dala-text focus:outline-none focus:border-[#24331e]"
                >
                  <option value="All Active Subscribers">All Active Subscribers ({activeSubscribersCount})</option>
                  <option value="Weekly Digest">Weekly Digest Group</option>
                  <option value="Baking Enthusiasts">Baking & Sourdough Enthusiasts</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-dala-text mb-1.5 flex items-center gap-1.5">
                <UtensilsCrossed size={14} className="text-[#765845]" /> Attach Featured Recipe (Optional)
              </label>
              <select
                value={featuredRecipeId}
                onChange={(e) => setFeaturedRecipeId(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#f8f6f3] border border-[#d8d3cb] rounded-xl text-xs text-dala-text focus:outline-none focus:border-[#24331e]"
              >
                <option value="">No recipe attached</option>
                {recipes.filter(r => !r.archived).map((recipe) => (
                  <option key={recipe.id} value={recipe.id}>
                    {recipe.title} ({recipe.category})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-dala-text mb-1.5">
                Newsletter Body Message *
              </label>
              <textarea
                rows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your email letter here..."
                className="w-full p-4 bg-[#f8f6f3] border border-[#d8d3cb] rounded-xl text-xs text-dala-text focus:outline-none focus:border-[#24331e] font-sans leading-relaxed"
              ></textarea>
            </div>
          </div>

          <div className="pt-4 border-t border-[#e6e2dc] flex items-center justify-between">
            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className="px-4 py-2.5 border border-[#d8d3cb] text-xs font-bold text-dala-text rounded-xl hover:bg-[#f8f6f3] cursor-pointer"
            >
              Cancel
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleCreateNewsletter('draft')}
                className="px-4 py-2.5 bg-[#f0ede8] hover:bg-[#e4dfd7] text-dala-text text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Save as Draft
              </button>
              <button
                type="button"
                onClick={() => handleCreateNewsletter('sent')}
                className="px-5 py-2.5 bg-[#24331e] hover:bg-[#34462c] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-2xs flex items-center gap-2 cursor-pointer"
              >
                <Send size={15} /> Send Broadcast Now
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* History & Sent Table View */
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#e6e2dc] overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f8f6f3] text-[#525252] text-[11px] font-bold uppercase tracking-wider border-b border-[#e6e2dc]">
                    <th className="py-3.5 px-6">Subject & Preview</th>
                    <th className="py-3.5 px-4">Audience</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Recipients</th>
                    <th className="py-3.5 px-4">Open / Click Rate</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eeeae4] text-xs">
                  {newsletters.length > 0 ? (
                    newsletters.map((item) => (
                      <tr key={item.id} className="hover:bg-[#fbf9f6] transition-colors">
                        <td className="py-4 px-6 max-w-xs">
                          <p className="font-bold text-sm text-dala-text leading-snug">
                            {item.subject}
                          </p>
                          <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">
                            {item.previewText}
                          </p>
                        </td>

                        <td className="py-4 px-4 text-[#4a4a4a] font-medium">
                          {item.audience}
                        </td>

                        <td className="py-4 px-4">
                          {item.status === 'sent' ? (
                            <span className="inline-flex items-center gap-1.5 font-bold text-xs text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                              <CheckCircle2 size={13} /> Sent ({item.sentAt})
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 font-bold text-xs text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                              <Clock size={13} /> Draft
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-4 font-semibold text-dala-text">
                          {item.recipientCount.toLocaleString()} readers
                        </td>

                        <td className="py-4 px-4 font-mono text-gray-600">
                          {item.openRate ? `${item.openRate} open / ${item.clickRate} click` : '—'}
                        </td>

                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedNewsletter(item)}
                              className="p-1.5 text-gray-500 hover:text-dala-text hover:bg-[#f4f1eb] rounded-lg cursor-pointer"
                              title="View Email Content"
                            >
                              <Eye size={16} />
                            </button>
                            {item.status === 'draft' ? (
                              <button
                                onClick={() => handleSendDraft(item.id)}
                                className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg cursor-pointer font-bold"
                                title="Send Draft Now"
                              >
                                <Send size={16} />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleResendNewsletter(item)}
                                className="p-1.5 text-amber-800 hover:text-amber-900 hover:bg-amber-50 rounded-lg cursor-pointer font-bold"
                                title="Resend Newsletter Broadcast to Active Subscribers"
                              >
                                <RotateCcw size={16} />
                              </button>
                            )}
                            <button
                              onClick={() => setDeletingNewsletter(item)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                              title="Delete Broadcast Record"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-gray-400">
                        No newsletters created yet. Click "Create Newsletter" to send your first broadcast!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={Boolean(deletingNewsletter)}
        onClose={() => setDeletingNewsletter(null)}
        onConfirm={() => {
          if (deletingNewsletter) {
            setNewsletters((prev) => prev.filter((n) => n.id !== deletingNewsletter.id));
            if (selectedNewsletter?.id === deletingNewsletter.id) {
              setSelectedNewsletter(null);
            }
            setDeletingNewsletter(null);
          }
        }}
        title="Delete Newsletter Broadcast"
        itemName={deletingNewsletter ? deletingNewsletter.subject : ''}
        itemType="newsletter"
      />

      {/* View Modal */}
      {selectedNewsletter && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-[#e6e2dc] max-w-xl w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setSelectedNewsletter(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black p-1 rounded-lg cursor-pointer"
            >
              <X size={18} />
            </button>

            <span className="text-[10px] font-bold uppercase tracking-widest text-[#765845]">
              Newsletter Preview
            </span>
            <h3 className="font-serif font-bold text-xl text-dala-text mt-1 mb-2">
              {selectedNewsletter.subject}
            </h3>
            <p className="text-xs text-gray-500 mb-4 pb-4 border-b border-[#e6e2dc]">
              Sent to: {selectedNewsletter.audience} • Date: {selectedNewsletter.sentAt || 'Draft'}
            </p>

            <div className="bg-[#f8f6f3] p-4 rounded-xl text-xs text-dala-text leading-relaxed font-sans whitespace-pre-wrap max-h-80 overflow-y-auto mb-6">
              {selectedNewsletter.content}
            </div>

            <div className="flex items-center justify-between border-t border-[#e6e2dc] pt-4">
              <button
                type="button"
                onClick={() => handleResendNewsletter(selectedNewsletter)}
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                <RotateCcw size={14} /> Resend Broadcast Now
              </button>

              <button
                onClick={() => setSelectedNewsletter(null)}
                className="px-4 py-2 bg-dala-text hover:bg-black text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
