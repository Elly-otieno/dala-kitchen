import React, { useState } from 'react';
import {
  Users,
  UserCheck,
  UserX,
  Plus,
  Download,
  Search,
  Mail,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { Subscriber } from '../../types';
import { DeleteConfirmationModal } from '../common/DeleteConfirmationModal';
import { syncSubscriberToSupabase, deleteSubscriberFromSupabase } from '../../lib/supabaseSync';

interface AdminSubscribersViewProps {

  subscribers: Subscriber[];
  setSubscribers: React.Dispatch<React.SetStateAction<Subscriber[]>>;
  onNavigateNewsletters: () => void;
}

export const AdminSubscribersView: React.FC<AdminSubscribersViewProps> = ({
  subscribers,
  setSubscribers,
  onNavigateNewsletters,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'unsubscribed'>('all');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newSource, setNewSource] = useState('Manual Admin Add');
  const [deletingSub, setDeletingSub] = useState<Subscriber | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 8;

  const activeCount = subscribers.filter((s) => s.status === 'active').length;
  const unsubscribedCount = subscribers.filter((s) => s.status === 'unsubscribed').length;

  const filteredSubscribers = subscribers.filter((s) => {
    const matchesSearch = s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.source.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredSubscribers.length / itemsPerPage) || 1;
  const paginatedSubscribers = filteredSubscribers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddSubscriber = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newEmail.includes('@')) return;

    const newSub: Subscriber = {
      id: `sub-${Date.now()}`,
      email: newEmail.trim().toLowerCase(),
      subscribedAt: new Date().toISOString().split('T')[0],
      status: 'active',
      source: newSource,
    };

    setSubscribers((prev) => [newSub, ...prev]);
    syncSubscriberToSupabase(newSub);
    setNewEmail('');
    setAddModalOpen(false);
  };

  const handleToggleStatus = (id: string) => {
    setSubscribers((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const updated = { ...s, status: (s.status === 'active' ? 'unsubscribed' : 'active') as 'active' | 'unsubscribed' };
          syncSubscriberToSupabase(updated);
          return updated;
        }
        return s;
      })
    );
  };

  const handleDelete = (id: string, email: string) => {
    if (confirm(`Remove subscriber "${email}" permanently?`)) {
      setSubscribers((prev) => prev.filter((s) => s.id !== id));
      deleteSubscriberFromSupabase(id);
      deleteSubscriberFromSupabase(email);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Email', 'Subscribed Date', 'Status', 'Source'];
    const rows = filteredSubscribers.map((s) => [
      s.email,
      s.subscribedAt,
      s.status,
      `"${s.source}"`,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dalakitchen_subscribers_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 space-y-6 sm:space-y-8 bg-[#fcf9f8] min-h-screen font-sans">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#1b1c1c] tracking-wide uppercase">
            SUBSCRIBERS
          </h1>
          <p className="text-xs sm:text-sm text-[#666666] font-sans mt-1">
            Manage your newsletter audience, track active signups, and export contact data.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <button
            onClick={handleExportCSV}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-white border border-[#d8d3cb] text-[#1b1c1c] font-bold text-xs py-2.5 px-3 sm:px-4 rounded-xl hover:bg-[#f9f8f6] transition-colors shadow-2xs cursor-pointer"
          >
            <Download size={15} /> Export CSV
          </button>
          <button
            onClick={() => setAddModalOpen(true)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-[#24331e] hover:bg-[#34462c] text-white font-bold text-xs uppercase tracking-wider py-2.5 px-3 sm:px-4 rounded-xl transition-colors shadow-2xs cursor-pointer"
          >
            <Plus size={15} /> Add Subscriber
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-[#e6e2dc] shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Total Subscribers
            </p>
            <h3 className="text-2xl font-serif font-bold text-[#1b1c1c] mt-1">
              {subscribers.length}
            </h3>
            <span className="text-[10px] text-gray-400 mt-1 block">Lifetime Signups</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#24331e]/10 text-[#24331e] flex items-center justify-center">
            <Users size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e6e2dc] shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Active Subscribers
            </p>
            <h3 className="text-2xl font-serif font-bold text-emerald-700 mt-1">
              {activeCount}
            </h3>
            <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">
              ✓ Receiving Newsletters
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <UserCheck size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e6e2dc] shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Unsubscribed
            </p>
            <h3 className="text-2xl font-serif font-bold text-amber-800 mt-1">
              {unsubscribedCount}
            </h3>
            <span className="text-[10px] text-gray-400 mt-1 block">Opted Out</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <UserX size={22} />
          </div>
        </div>
      </div>

      {/* Table & Controls Container */}
      <div className="bg-white rounded-2xl border border-[#e6e2dc] overflow-hidden shadow-2xs">
        {/* Filter / Search Bar */}
        <div className="p-4 bg-[#f8f6f3] border-b border-[#e6e2dc] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="relative w-full sm:w-80">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by email or signup source..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-[#d8d3cb] rounded-xl text-xs text-[#1b1c1c] placeholder:text-gray-400 focus:outline-none focus:border-[#24331e]"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-gray-500" />
              <span className="font-semibold text-gray-600">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-white border border-[#d8d3cb] rounded-xl px-3 py-1.5 text-xs font-medium text-[#1b1c1c] focus:outline-none"
              >
                <option value="all">All Subscribers</option>
                <option value="active">Active Only</option>
                <option value="unsubscribed">Unsubscribed Only</option>
              </select>
            </div>

            <button
              onClick={onNavigateNewsletters}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#765845] hover:bg-[#634833] text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              <Mail size={14} /> Send Newsletter
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f6f3] text-[#525252] text-[11px] font-bold uppercase tracking-wider border-b border-[#e6e2dc]">
                <th className="py-3.5 px-6">Subscriber Email</th>
                <th className="py-3.5 px-4">Subscribed Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Source</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eeeae4] text-xs">
              {paginatedSubscribers.length > 0 ? (
                paginatedSubscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-[#fbf9f6] transition-colors">
                    <td className="py-4 px-6 font-semibold text-[#1b1c1c]">
                      {sub.email}
                    </td>
                    <td className="py-4 px-4 text-[#666666]">{sub.subscribedAt}</td>
                    <td className="py-4 px-4">
                      {sub.status === 'active' ? (
                        <span className="inline-flex items-center gap-1.5 font-bold text-xs text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 size={13} /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 font-bold text-xs text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                          <AlertCircle size={13} /> Unsubscribed
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-[#666666]">
                      <span className="bg-[#f0ede8] text-[#4a4a4a] px-2.5 py-1 rounded-md text-[11px] font-medium">
                        {sub.source}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleStatus(sub.id)}
                          className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors cursor-pointer ${
                            sub.status === 'active'
                              ? 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                              : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                          }`}
                        >
                          {sub.status === 'active' ? 'Unsubscribe' : 'Reactivate'}
                        </button>
                        <button
                          onClick={() => setDeletingSub(sub)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Subscriber"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400">
                    No subscribers found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="p-4 bg-[#f8f6f3] border-t border-[#e6e2dc] flex items-center justify-between text-xs text-[#525252]">
          <span>
            Showing {paginatedSubscribers.length} of {filteredSubscribers.length} subscribers
          </span>

          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="px-3 py-1.5 rounded-lg border border-[#d8d3cb] bg-white hover:bg-[#f4f1eb] text-xs font-semibold disabled:opacity-40 cursor-pointer"
            >
              Prev
            </button>
            <span className="px-3 py-1 font-bold text-[#1b1c1c]">
              {currentPage} / {totalPages}
            </span>
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

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={Boolean(deletingSub)}
        onClose={() => setDeletingSub(null)}
        onConfirm={() => {
          if (deletingSub) {
            setSubscribers((prev) => prev.filter((s) => s.id !== deletingSub.id));
            setDeletingSub(null);
          }
        }}
        title="Delete Subscriber"
        itemName={deletingSub ? deletingSub.email : ''}
        itemType="subscriber"
      />

      {/* Add Subscriber Modal */}

      {addModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-[#e6e2dc] max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setAddModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black p-1 rounded-lg cursor-pointer"
            >
              <X size={18} />
            </button>

            <h3 className="font-serif font-bold text-xl text-[#1b1c1c] mb-1">
              Add New Subscriber
            </h3>
            <p className="text-xs text-gray-500 mb-5">
              Manually add a reader email address to your active subscriber list.
            </p>

            <form onSubmit={handleAddSubscriber} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1b1c1c] uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="reader@example.com"
                  className="w-full px-3.5 py-2.5 bg-[#f8f6f3] border border-[#d8d3cb] rounded-xl text-xs text-[#1b1c1c] focus:outline-none focus:border-[#24331e]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1b1c1c] uppercase tracking-wider mb-1.5">
                  Signup Source
                </label>
                <input
                  type="text"
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#f8f6f3] border border-[#d8d3cb] rounded-xl text-xs text-[#1b1c1c] focus:outline-none focus:border-[#24331e]"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 border border-[#d8d3cb] text-xs font-bold text-[#1b1c1c] rounded-xl hover:bg-[#f8f6f3] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#24331e] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#34462c] cursor-pointer"
                >
                  Add Subscriber
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
