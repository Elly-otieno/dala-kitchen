import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Shield,
  UtensilsCrossed,
  FileEdit,
  Search,
  Filter,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Mail,
  MoreVertical,
  X,
  UserCheck,
  UserX,
  Send,
  Award,
  Copy,
  Check,
  ExternalLink,
  Link as LinkIcon,
} from 'lucide-react';
import { AdminUser, UserRole, UserStatus } from '../../types';
import { DeleteConfirmationModal } from '../common/DeleteConfirmationModal';
import { syncAdminUserToSupabase, deleteAdminUserFromSupabase } from '../../lib/supabaseSync';

interface AdminUsersViewProps {
  users: AdminUser[];
  setUsers: React.Dispatch<React.SetStateAction<AdminUser[]>>;
}

const getInitials = (name: string) => {
  if (!name) return 'DK';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getRoleBadgeStyle = (role: string) => {
  switch (role) {
    case 'Admin':
      return 'bg-[#24331e] text-[#f4efe6] border-[#1b2716] shadow-2xs';
    case 'Chef':
      return 'bg-[#765845] text-amber-50 border-[#5a4233] shadow-2xs';
    case 'Editor':
      return 'bg-[#2d4a58] text-sky-50 border-[#203641] shadow-2xs';
    default:
      return 'bg-[#24331e] text-white border-[#1b2716] shadow-2xs';
  }
};

export const AdminUsersView: React.FC<AdminUsersViewProps> = ({ users, setUsers }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | UserStatus>('all');
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  // Invite Form State
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('Chef');
  const [inviteNote, setInviteNote] = useState('');

  // Generated Link Modal State
  const [generatedInvite, setGeneratedInvite] = useState<{
    name: string;
    email: string;
    role: string;
    link: string;
  } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Delete Modal State
  const [deletingUser, setDeletingUser] = useState<AdminUser | null>(null);

  const adminCount = users.filter((u) => u.role === 'Admin').length;
  const chefCount = users.filter((u) => u.role === 'Chef').length;
  const editorCount = users.filter((u) => u.role === 'Editor').length;

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const generateInviteLink = (name: string, email: string, role: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const path = typeof window !== 'undefined' ? window.location.pathname : '';
    const code = 'DK-ADMIN-2026';
    return `${origin}${path}?tab=admin&invite=${code}&email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}&role=${role}`;
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !inviteName) return;

    const cleanEmail = inviteEmail.trim().toLowerCase();
    const cleanName = inviteName.trim();

    const newUser: AdminUser = {
      id: `usr-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      role: inviteRole,
      status: 'pending',
      joinedAt: new Date().toISOString().split('T')[0],
      recipesCount: 0,
      articlesCount: 0,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80`,
    };

    setUsers((prev) => [newUser, ...prev]);
    syncAdminUserToSupabase(newUser);

    const directLink = generateInviteLink(cleanName, cleanEmail, inviteRole);

    setGeneratedInvite({
      name: cleanName,
      email: cleanEmail,
      role: inviteRole,
      link: directLink,
    });

    // Reset Form
    setInviteName('');
    setInviteEmail('');
    setInviteRole('Chef');
    setInviteNote('');
    setInviteModalOpen(false);
  };

  const handleCopyLink = (linkText: string) => {
    try {
      if (typeof window !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(linkText);
      }
    } catch (e) {
      console.warn('Clipboard write blocked:', e);
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const updated = { ...u, role: newRole };
          syncAdminUserToSupabase(updated);
          return updated;
        }
        return u;
      })
    );
  };

  const handleStatusToggle = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextStatus: UserStatus =
            u.status === 'active' ? 'suspended' : 'active';
          const updated = { ...u, status: nextStatus };
          syncAdminUserToSupabase(updated);
          return updated;
        }
        return u;
      })
    );
  };

  const handleDeleteConfirm = () => {
    if (deletingUser) {
      setUsers((prev) => prev.filter((u) => u.id !== deletingUser.id));
      deleteAdminUserFromSupabase(deletingUser.id);
      setDeletingUser(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 space-y-6 sm:space-y-8 bg-[#fcf9f8] min-h-screen font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif font-bold text-3xl text-[#1b1c1c] tracking-wide uppercase">
            USER MANAGEMENT
          </h1>
          <p className="text-sm text-[#666666] font-sans mt-1">
            Manage culinary team permissions, invite new chefs &amp; editors, and assign roles.
          </p>
        </div>

        <button
          onClick={() => setInviteModalOpen(true)}
          className="flex items-center gap-2 bg-[#24331e] hover:bg-[#34462c] text-white font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl transition-colors shadow-2xs cursor-pointer"
        >
          <UserPlus size={16} /> Invite Team Member
        </button>
      </div>

      {/* Summary Role Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#e6e2dc] shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Total Staff
            </p>
            <h3 className="text-2xl font-serif font-bold text-[#1b1c1c] mt-1">
              {users.length}
            </h3>
            <span className="text-[10px] text-gray-400 mt-1 block">Active &amp; Pending</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#24331e]/10 text-[#24331e] flex items-center justify-center">
            <Users size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e6e2dc] shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Admins
            </p>
            <h3 className="text-2xl font-serif font-bold text-[#1b1c1c] mt-1">
              {adminCount}
            </h3>
            <span className="text-[10px] text-purple-700 font-semibold mt-1 block">
              Full System Access
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <Shield size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e6e2dc] shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Chefs
            </p>
            <h3 className="text-2xl font-serif font-bold text-[#24331e] mt-1">
              {chefCount}
            </h3>
            <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">
              Recipe Creators
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <UtensilsCrossed size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e6e2dc] shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Editors
            </p>
            <h3 className="text-2xl font-serif font-bold text-[#765845] mt-1">
              {editorCount}
            </h3>
            <span className="text-[10px] text-amber-700 font-semibold mt-1 block">
              Blog &amp; Media Staff
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <FileEdit size={22} />
          </div>
        </div>
      </div>

      {/* Main Users Table Container */}
      <div className="bg-white rounded-2xl border border-[#e6e2dc] overflow-hidden shadow-2xs">
        {/* Filters Bar */}
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
              placeholder="Search by name or email address..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-[#d8d3cb] rounded-xl text-xs text-[#1b1c1c] placeholder:text-gray-400 focus:outline-none focus:border-[#24331e]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-gray-500" />
              <span className="font-semibold text-gray-600">Role:</span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as any)}
                className="bg-white border border-[#d8d3cb] rounded-xl px-3 py-1.5 text-xs font-medium text-[#1b1c1c] focus:outline-none"
              >
                <option value="all">All Roles</option>
                <option value="Admin">Admin Only</option>
                <option value="Chef">Chef Only</option>
                <option value="Editor">Editor Only</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-600">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-white border border-[#d8d3cb] rounded-xl px-3 py-1.5 text-xs font-medium text-[#1b1c1c] focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending Invite</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f6f3] text-[#525252] text-[11px] font-bold uppercase tracking-wider border-b border-[#e6e2dc]">
                <th className="py-3.5 px-6">Staff Member</th>
                <th className="py-3.5 px-4">Role Assignment</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-4">Joined / Invited</th>
                <th className="py-3.5 px-4">Contributions</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eeeae4] text-xs">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-[#fbf9f6] transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-serif font-bold text-sm tracking-wider border shrink-0 select-none ${getRoleBadgeStyle(
                            user.role
                          )}`}
                          title={`${user.name} (${user.role})`}
                        >
                          {getInitials(user.name)}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-[#1b1c1c]">{user.name}</p>
                          <p className="text-gray-400 font-mono text-[11px]">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                        className="bg-white border border-[#d8d3cb] rounded-lg px-2.5 py-1 text-xs font-bold text-[#1b1c1c] focus:outline-none focus:border-[#24331e] cursor-pointer"
                      >
                        <option value="Admin">🛡️ Admin</option>
                        <option value="Chef">🍳 Chef</option>
                        <option value="Editor">✍️ Editor</option>
                      </select>
                    </td>

                    <td className="py-4 px-4">
                      {user.status === 'active' ? (
                        <span className="inline-flex items-center gap-1.5 font-bold text-xs text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 size={13} /> Active
                        </span>
                      ) : user.status === 'pending' ? (
                        <span className="inline-flex items-center gap-1.5 font-bold text-xs text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                          <Clock size={13} /> Pending Invite
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 font-bold text-xs text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                          <AlertCircle size={13} /> Suspended
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-gray-500 font-medium">
                      {user.joinedAt}
                    </td>

                    <td className="py-4 px-4 text-gray-600">
                      <span className="font-semibold text-[#1b1c1c]">
                        {user.recipesCount ?? 0}
                      </span>{' '}
                      recipes •{' '}
                      <span className="font-semibold text-[#1b1c1c]">
                        {user.articlesCount ?? 0}
                      </span>{' '}
                      articles
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {user.status !== 'pending' && (
                          <button
                            onClick={() => handleStatusToggle(user.id)}
                            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors cursor-pointer ${
                              user.status === 'active'
                                ? 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                            }`}
                          >
                            {user.status === 'active' ? 'Suspend' : 'Activate'}
                          </button>
                        )}

                        {user.status === 'pending' && (
                          <button
                            onClick={() => {
                              const link = generateInviteLink(user.name, user.email, user.role);
                              handleCopyLink(link);
                            }}
                            className="px-2.5 py-1 bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 rounded-lg font-bold text-[11px] transition-colors cursor-pointer flex items-center gap-1"
                            title="Copy Direct Invite Link for this staff member"
                          >
                            <Copy size={12} />
                            <span>Copy Link</span>
                          </button>
                        )}

                        {user.status === 'pending' && (
                          <button
                            onClick={() => {
                              const link = generateInviteLink(user.name, user.email, user.role);
                              setGeneratedInvite({
                                name: user.name,
                                email: user.email,
                                role: user.role,
                                link,
                              });
                            }}
                            className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg font-bold text-[11px] transition-colors cursor-pointer flex items-center gap-1"
                            title="View / Resend Staff Invitation"
                          >
                            <Send size={12} /> Resend
                          </button>
                        )}

                        <button
                          onClick={() => setDeletingUser(user)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Revoke & Delete Staff Account"
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
                    No team members found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Staff Modal */}
      {inviteModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-[#e6e2dc] max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setInviteModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black p-1 rounded-lg cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#24331e] text-white flex items-center justify-center">
                <UserPlus size={20} />
              </div>
              <div>
                <h3 className="font-serif font-bold text-xl text-[#1b1c1c]">
                  Invite Culinary Team Member
                </h3>
                <p className="text-xs text-gray-500">
                  Grant authoring &amp; editorial permissions to staff members.
                </p>
              </div>
            </div>

            <form onSubmit={handleSendInvite} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1b1c1c] mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Chef Sarah Ochieng"
                  className="w-full px-3.5 py-2.5 bg-[#f8f6f3] border border-[#d8d3cb] rounded-xl text-xs text-[#1b1c1c] focus:outline-none focus:border-[#24331e]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1b1c1c] mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="sarah.ochieng@dalakitchen.com"
                  className="w-full px-3.5 py-2.5 bg-[#f8f6f3] border border-[#d8d3cb] rounded-xl text-xs text-[#1b1c1c] focus:outline-none focus:border-[#24331e]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1b1c1c] mb-1.5">
                  Role Permission
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setInviteRole('Chef')}
                    className={`p-3 rounded-xl border text-left flex flex-col items-center justify-center text-center gap-1 transition-all cursor-pointer ${
                      inviteRole === 'Chef'
                        ? 'border-[#24331e] bg-[#24331e]/5 text-[#24331e] font-bold'
                        : 'border-[#d8d3cb] text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <UtensilsCrossed size={18} />
                    <span className="text-xs">Chef</span>
                    <span className="text-[9px] text-gray-400">Recipes &amp; Guides</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setInviteRole('Editor')}
                    className={`p-3 rounded-xl border text-left flex flex-col items-center justify-center text-center gap-1 transition-all cursor-pointer ${
                      inviteRole === 'Editor'
                        ? 'border-[#765845] bg-[#765845]/5 text-[#765845] font-bold'
                        : 'border-[#d8d3cb] text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <FileEdit size={18} />
                    <span className="text-xs">Editor</span>
                    <span className="text-[9px] text-gray-400">Blogs &amp; Media</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setInviteRole('Admin')}
                    className={`p-3 rounded-xl border text-left flex flex-col items-center justify-center text-center gap-1 transition-all cursor-pointer ${
                      inviteRole === 'Admin'
                        ? 'border-purple-800 bg-purple-50 text-purple-900 font-bold'
                        : 'border-[#d8d3cb] text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Shield size={18} />
                    <span className="text-xs">Admin</span>
                    <span className="text-[9px] text-gray-400">Full Access</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1b1c1c] mb-1.5">
                  Personal Invitation Message (Optional)
                </label>
                <textarea
                  rows={3}
                  value={inviteNote}
                  onChange={(e) => setInviteNote(e.target.value)}
                  placeholder="Welcome to the team! We are thrilled to have you lead our artisanal baking section..."
                  className="w-full p-3 bg-[#f8f6f3] border border-[#d8d3cb] rounded-xl text-xs text-[#1b1c1c] focus:outline-none focus:border-[#24331e]"
                ></textarea>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-[#e6e2dc]">
                <button
                  type="button"
                  onClick={() => setInviteModalOpen(false)}
                  className="px-4 py-2 border border-[#d8d3cb] text-xs font-bold text-[#1b1c1c] rounded-xl hover:bg-[#f8f6f3] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#24331e] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#34462c] cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <Send size={14} /> Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Generated Shareable Invite Link Modal */}
      {generatedInvite && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-[#e6e2dc] max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150 space-y-5">
            <button
              onClick={() => setGeneratedInvite(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black p-1 rounded-lg cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h3 className="font-serif font-bold text-xl text-[#1b1c1c]">
                  Staff Invitation Created!
                </h3>
                <p className="text-xs text-gray-500">
                  Share this verified one-click registration link with <span className="font-bold text-[#1b1c1c]">{generatedInvite.name}</span> ({generatedInvite.role}).
                </p>
              </div>
            </div>

            <div className="p-4 bg-[#f8f6f3] rounded-xl border border-[#e6e2dc] space-y-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500">
                Direct Sign-Up / Access URL
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={generatedInvite.link}
                  className="w-full bg-white border border-[#d8d3cb] rounded-lg px-3 py-2 text-xs font-mono text-[#1b1c1c] focus:outline-none select-all"
                />
                <button
                  type="button"
                  onClick={() => handleCopyLink(generatedInvite.link)}
                  className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-2xs ${
                    copiedLink
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#24331e] text-white hover:bg-[#34462c]'
                  }`}
                >
                  {copiedLink ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>

            <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900 leading-relaxed">
              <p className="font-bold mb-0.5 flex items-center gap-1.5">
                <Award size={14} className="text-amber-700" />
                What happens when they open this link:
              </p>
              <p className="text-[11px] text-amber-800">
                The link opens the Dala Kitchen staff portal in sign-up mode, pre-fills their authorized email &amp; role credentials, verifies their invite token, and redirects them directly to the Chef Admin Console upon password creation.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row justify-between items-center gap-2 border-t border-[#e6e2dc]">
              <a
                href={`mailto:${generatedInvite.email}?subject=${encodeURIComponent(
                  'Invitation to join the Dala Kitchen Culinary Team'
                )}&body=${encodeURIComponent(
                  `Hello ${generatedInvite.name},\n\nYou have been invited to join the Dala Kitchen team as a ${generatedInvite.role}.\n\nPlease click the link below to activate your account and choose your secure password:\n\n${generatedInvite.link}\n\nBest regards,\nDala Kitchen Culinary Team`
                )}`}
                className="w-full sm:w-auto px-4 py-2.5 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Mail size={14} /> Open in Email App
              </a>

              <button
                type="button"
                onClick={() => setGeneratedInvite(null)}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#24331e] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#34462c] cursor-pointer shadow-2xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={Boolean(deletingUser)}
        onClose={() => setDeletingUser(null)}
        onConfirm={handleDeleteConfirm}
        title="Revoke Staff Account"
        itemName={deletingUser ? `${deletingUser.name} (${deletingUser.email})` : ''}
        itemType="staff member"
        warningText="Revoking this account immediately removes access to the Dala Kitchen Chef Admin Console."
      />
    </div>
  );
};
