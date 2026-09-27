import React, { useState } from 'react';
import {
  HelpCircle,
  BookOpen,
  Activity,
  Send,
  FileQuestion,
  CheckCircle2,
  AlertCircle,
  LifeBuoy,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Inbox,
  Trash2,
  User,
  Clock,
  Mail,
} from 'lucide-react';
import { ContactMessage } from '../../types';

interface AdminSupportViewProps {
  contactMessages?: ContactMessage[];
  onDeleteMessage?: (id: string) => void;
}

export const AdminSupportView: React.FC<AdminSupportViewProps> = ({
  contactMessages = [],
  onDeleteMessage,
}) => {
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Technical Issue');
  const [ticketPriority, setTicketPriority] = useState('Medium');
  const [ticketMessage, setTicketMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How do I feature a new recipe on the Home page hero grid?',
      a: 'Navigate to Recipes tab in the Admin sidebar, click Edit on any recipe, check the "Featured Recipe" toggle box, and click Save Recipe. It will immediately appear in the hero showcase for public readers.',
    },
    {
      q: 'What image format is recommended for recipe photos?',
      a: 'We recommend high-resolution Unsplash or custom webp/jpeg images formatted at 4:3 aspect ratio (minimum 1200x900px) for crisp display across retina screens and mobile devices.',
    },
    {
      q: 'How do newsletter broadcasts reach unsubscribed readers?',
      a: 'They do not. The newsletter engine automatically filters out unsubscribed emails to comply with global GDPR and CAN-SPAM regulations.',
    },
    {
      q: 'How do I assign Chef permissions to a new team member?',
      a: 'Go to User Management tab in the Admin Sidebar, click "Invite Team Member", enter their email and select "Chef" as their role. An invitation link will be dispatched.',
    },
  ];

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;

    setSubmitted(true);
    setTimeout(() => {
      setTicketSubject('');
      setTicketMessage('');
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 space-y-6 sm:space-y-8 bg-[#fcf9f8] min-h-screen font-sans">
      {/* Page Header */}
      <div>
        <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#1b1c1c] tracking-wide uppercase">
          STAFF SUPPORT &amp; HELP DESK
        </h1>
        <p className="text-xs sm:text-sm text-[#666666] font-sans mt-1">
          Access authoring documentation, view system status, or contact technical engineering support.
        </p>
      </div>

      {/* System Health Diagnostics Bar */}
      <div className="bg-white rounded-2xl border border-[#e6e2dc] p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#e6e2dc] pb-3">
          <div className="flex items-center gap-2">
            <Activity size={18} className="text-[#24331e]" />
            <h2 className="font-serif font-bold text-base text-[#1b1c1c]">
              System Health &amp; Operational Status
            </h2>
          </div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            ● All Systems Operational
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-[#f8f6f3] rounded-xl border border-[#e6e2dc]">
            <p className="text-gray-500 font-semibold">Database Latency</p>
            <p className="text-sm font-bold text-[#1b1c1c] mt-0.5">14 ms (Optimal)</p>
          </div>
          <div className="p-3 bg-[#f8f6f3] rounded-xl border border-[#e6e2dc]">
            <p className="text-gray-500 font-semibold">Image CDN Cache</p>
            <p className="text-sm font-bold text-emerald-700 mt-0.5">99.98% Hit Rate</p>
          </div>
          <div className="p-3 bg-[#f8f6f3] rounded-xl border border-[#e6e2dc]">
            <p className="text-gray-500 font-semibold">Email Broadcast Engine</p>
            <p className="text-sm font-bold text-emerald-700 mt-0.5">Ready (0 Queued)</p>
          </div>
          <div className="p-3 bg-[#f8f6f3] rounded-xl border border-[#e6e2dc]">
            <p className="text-gray-500 font-semibold">Server Storage Used</p>
            <p className="text-sm font-bold text-[#1b1c1c] mt-0.5">18.4 GB / 250 GB</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Submit Support Ticket & FAQ */}
        <div className="lg:col-span-2 space-y-8">
          {/* Received Contact Form Messages Section */}
          <div className="bg-white rounded-2xl border border-[#e6e2dc] p-6 sm:p-8 shadow-2xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#e6e2dc]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-700 text-white flex items-center justify-center">
                  <Inbox size={20} />
                </div>
                <div>
                  <h2 className="font-serif font-bold text-lg text-[#1b1c1c]">
                    "Let's Connect" Inbound Messages ({contactMessages.length})
                  </h2>
                  <p className="text-xs text-gray-500">
                    Real-time messages submitted by public readers from the Let's Connect contact page.
                  </p>
                </div>
              </div>
            </div>

            {contactMessages.length === 0 ? (
              <div className="p-8 text-center bg-[#f8f6f3] rounded-xl border border-dashed border-[#d8d3cb]">
                <Mail size={32} className="mx-auto text-gray-400 mb-2" />
                <p className="text-sm font-bold text-gray-700">No contact messages received yet</p>
                <p className="text-xs text-gray-500 mt-1">
                  Messages submitted on the public "Let's Connect" form will automatically record here and in your database.
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
                {contactMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-4 rounded-xl bg-[#f8f6f3] border border-[#e6e2dc] space-y-2 hover:border-[#24331e]/40 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e6e2dc] pb-2">
                      <div className="flex items-center gap-2">
                        <User size={15} className="text-amber-700 shrink-0" />
                        <span className="font-bold text-xs text-[#1b1c1c]">{msg.name}</span>
                        <a
                          href={`mailto:${msg.email}`}
                          className="text-[11px] text-amber-800 font-mono hover:underline"
                        >
                          &lt;{msg.email}&gt;
                        </a>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-gray-500 flex items-center gap-1">
                          <Clock size={12} />
                          {new Date(msg.createdAt).toLocaleDateString()} {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {onDeleteMessage && (
                          <button
                            type="button"
                            onClick={() => onDeleteMessage(msg.id)}
                            className="text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete message"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                    {msg.subject && (
                      <p className="text-xs font-bold text-[#1b1c1c]">Subject: {msg.subject}</p>
                    )}
                    <p className="text-xs text-gray-700 font-sans leading-relaxed whitespace-pre-wrap bg-white p-3 rounded-lg border border-[#e6e2dc]">
                      {msg.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Support Ticket Form */}
          <div className="bg-white rounded-2xl border border-[#e6e2dc] p-6 sm:p-8 shadow-2xs space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-[#e6e2dc]">
              <div className="w-10 h-10 rounded-xl bg-[#24331e] text-white flex items-center justify-center">
                <LifeBuoy size={20} />
              </div>
              <div>
                <h2 className="font-serif font-bold text-lg text-[#1b1c1c]">
                  Submit Technical Support Ticket
                </h2>
                <p className="text-xs text-gray-500">
                  Direct inquiry to Dala Kitchen lead web engineering team.
                </p>
              </div>
            </div>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-6 rounded-2xl text-center space-y-2">
                <CheckCircle2 size={32} className="mx-auto text-emerald-700" />
                <h4 className="font-bold text-base">Support Ticket Created!</h4>
                <p className="text-xs text-emerald-700 max-w-md mx-auto">
                  Ticket #DK-8492 has been submitted. Our technical team usually responds within 2 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleTicketSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#1b1c1c] mb-1.5">
                      Issue Category
                    </label>
                    <select
                      value={ticketCategory}
                      onChange={(e) => setTicketCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#f8f6f3] border border-[#d8d3cb] rounded-xl text-xs font-semibold text-[#1b1c1c] focus:outline-none focus:border-[#24331e]"
                    >
                      <option value="Technical Issue">Technical Bug / Error</option>
                      <option value="Recipe Editor">Recipe Editor Assistance</option>
                      <option value="Newsletter Issue">Newsletter Broadcast Help</option>
                      <option value="User Account">Staff Account / Permission Request</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#1b1c1c] mb-1.5">
                      Priority Level
                    </label>
                    <select
                      value={ticketPriority}
                      onChange={(e) => setTicketPriority(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#f8f6f3] border border-[#d8d3cb] rounded-xl text-xs font-semibold text-[#1b1c1c] focus:outline-none focus:border-[#24331e]"
                    >
                      <option value="Low">Low - Informational Request</option>
                      <option value="Medium">Medium - Normal Inquiry</option>
                      <option value="High">High - Urgent Blocking Bug</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1b1c1c] mb-1.5">
                    Subject Line *
                  </label>
                  <input
                    type="text"
                    required
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    placeholder="e.g. Issue uploading YouTube video thumbnail for Mandazi series"
                    className="w-full px-3.5 py-2.5 bg-[#f8f6f3] border border-[#d8d3cb] rounded-xl text-xs text-[#1b1c1c] focus:outline-none focus:border-[#24331e]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1b1c1c] mb-1.5">
                    Detailed Message &amp; Reproduction Steps *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    placeholder="Describe what happened, error codes displayed, or what you were trying to achieve..."
                    className="w-full p-3.5 bg-[#f8f6f3] border border-[#d8d3cb] rounded-xl text-xs text-[#1b1c1c] focus:outline-none focus:border-[#24331e] font-sans"
                  ></textarea>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#24331e] hover:bg-[#34462c] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-2xs flex items-center gap-2 cursor-pointer"
                  >
                    <Send size={15} /> Submit Support Ticket
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* FAQ Accordion */}
          <div className="bg-white rounded-2xl border border-[#e6e2dc] p-6 sm:p-8 shadow-2xs space-y-4">
            <h2 className="font-serif font-bold text-lg text-[#1b1c1c] flex items-center gap-2">
              <FileQuestion size={18} className="text-[#765845]" /> Frequently Asked Staff Questions
            </h2>

            <div className="space-y-3 pt-2">
              {faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="border border-[#e6e2dc] rounded-xl overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full p-4 text-left font-bold text-xs text-[#1b1c1c] bg-[#f8f6f3] hover:bg-[#f2efe8] flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {isOpen && (
                      <div className="p-4 bg-white text-xs text-gray-600 leading-relaxed border-t border-[#e6e2dc]">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: Guides & Contact Direct */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#e6e2dc] p-6 shadow-2xs space-y-4">
            <h3 className="font-serif font-bold text-base text-[#1b1c1c] flex items-center gap-2">
              <BookOpen size={18} className="text-[#24331e]" /> Staff Documentation
            </h3>

            <div className="space-y-3 text-xs">
              <a
                href="#guide-1"
                onClick={(e) => { e.preventDefault(); alert('Opening Recipe Authoring Manual...'); }}
                className="block p-3 rounded-xl bg-[#f8f6f3] hover:bg-[#f0ede8] transition-colors font-semibold text-[#1b1c1c]"
              >
                📖 Recipe Authoring &amp; Formatting Guide
              </a>
              <a
                href="#guide-2"
                onClick={(e) => { e.preventDefault(); alert('Opening Sourdough Workshop Guide...'); }}
                className="block p-3 rounded-xl bg-[#f8f6f3] hover:bg-[#f0ede8] transition-colors font-semibold text-[#1b1c1c]"
              >
                🍞 Sourdough Workshop Masterclass Notes
              </a>
              <a
                href="#guide-3"
                onClick={(e) => { e.preventDefault(); alert('Opening Newsletter Formatting Guide...'); }}
                className="block p-3 rounded-xl bg-[#f8f6f3] hover:bg-[#f0ede8] transition-colors font-semibold text-[#1b1c1c]"
              >
                💌 Newsletter Best Practices &amp; Deliverability
              </a>
            </div>
          </div>

          <div className="bg-[#24331e] text-white rounded-2xl p-6 shadow-md space-y-3">
            <MessageSquare size={24} className="text-amber-400" />
            <h3 className="font-serif font-bold text-lg">Direct Chef Hotline</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              For urgent live site outages or breaking issues during recipe broadcasting, contact the lead admin directly:
            </p>
            <div className="pt-2">
              <p className="text-xs font-mono text-amber-300 font-bold">
                achieng@dalakitchen.com
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">Response target: &lt; 30 minutes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
