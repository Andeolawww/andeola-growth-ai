import React, { useState } from 'react';
import {
  Inbox,
  Mail,
  Linkedin,
  Sparkles,
  Send,
  CheckCircle2,
  Calendar,
  Clock,
  Bell,
  Search,
  Check,
  AlertCircle,
  ExternalLink,
  Tag,
  ArrowRight,
  Shield,
  Smartphone,
  Copy,
  Zap,
} from 'lucide-react';
import { BuyerReply, UserProfile } from '../../types';
import { useToast } from '../../context/ToastContext';

interface InboxViewProps {
  replies: BuyerReply[];
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onMarkAsRead: (replyId: string) => void;
  onSendReplyBack: (replyId: string, text: string) => void;
  onSimulateNewReply: () => void;
}

export const InboxView: React.FC<InboxViewProps> = ({
  replies,
  user,
  onUpdateUser,
  onMarkAsRead,
  onSendReplyBack,
  onSimulateNewReply,
}) => {
  const { showToast } = useToast();
  const [selectedReplyId, setSelectedReplyId] = useState<string>(replies[0]?.id || '');
  const [filterSentiment, setFilterSentiment] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [replyText, setReplyText] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);

  // Notification Email Configuration State
  const [notificationEmail, setNotificationEmail] = useState(
    user.replyNotificationEmail || user.email || 'webhubtech299@gmail.com'
  );
  const [isSavingEmail, setIsSavingEmail] = useState(false);
  const [isSendingTestAlert, setIsSendingTestAlert] = useState(false);

  const selectedReply = replies.find((r) => r.id === selectedReplyId) || replies[0];

  const handleSelectReply = (reply: BuyerReply) => {
    setSelectedReplyId(reply.id);
    if (!reply.isRead) {
      onMarkAsRead(reply.id);
    }
  };

  const handleSaveNotificationEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notificationEmail.trim()) {
      showToast('Email Required', 'Please enter a valid notification email address.', 'error');
      return;
    }
    setIsSavingEmail(true);
    setTimeout(() => {
      onUpdateUser({
        replyNotificationEmail: notificationEmail.trim(),
        emailNotificationsEnabled: true,
      });
      setIsSavingEmail(false);
      showToast(
        'Notification Email Saved! ✅',
        `Buyer reply alerts will be dispatched directly to: ${notificationEmail.trim()}`
      );
    }, 400);
  };

  const handleSendTestAlert = () => {
    setIsSendingTestAlert(true);
    setTimeout(() => {
      setIsSendingTestAlert(false);
      showToast(
        'Test Alert Sent! 📨',
        `Simulated notification dispatched to ${notificationEmail}. You will receive instant emails whenever a buyer replies.`
      );
    }, 700);
  };

  const handleSendResponse = () => {
    if (!replyText.trim() || !selectedReply) return;
    setIsSendingReply(true);
    setTimeout(() => {
      onSendReplyBack(selectedReply.id, replyText.trim());
      setIsSendingReply(false);
      setReplyText('');
      showToast(
        'Response Dispatched',
        `Email sent directly to ${selectedReply.contactName} (${selectedReply.contactEmail})`
      );
    }, 600);
  };

  const handleQuickInsert = (text: string) => {
    setReplyText((prev) => (prev ? prev + '\n\n' + text : text));
  };

  const filteredReplies = replies.filter((r) => {
    const matchesSentiment =
      filterSentiment === 'All'
        ? true
        : filterSentiment === 'Unread'
        ? !r.isRead
        : r.sentiment === filterSentiment;

    const matchesSearch =
      searchQuery.trim() === ''
        ? true
        : r.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.fullMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.subject.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSentiment && matchesSearch;
  });

  const unreadCount = replies.filter((r) => !r.isRead).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Inbox className="w-3.5 h-3.5" />
            Buyer Engagement Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Buyer Replies & Inbound Inbox
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            View prospect responses in real time, configure your notification email for instant alerts, and reply to interested buyers.
          </p>
        </div>

        {/* Live Simulation Trigger Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSimulateNewReply}
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center gap-1.5 cursor-pointer transition-all shrink-0"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Simulate Live Buyer Reply</span>
          </button>
        </div>
      </div>

      {/* Reply Notification Email Configuration Card (Requested in Prompt) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 border border-blue-500/30 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-[10px] uppercase font-bold border border-blue-500/30">
                Email Notification Destination
              </span>
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Live Alerts Active
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-white">
              Where Should We Notify You When A Buyer Replies?
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              Add your email below. The moment any buyer or retail prospect replies to your outreach, an instant alert is sent directly to your inbox so you never miss an interested customer.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSendTestAlert}
            disabled={isSendingTestAlert}
            className="py-2 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <Bell className="w-3.5 h-3.5 text-blue-400" />
            <span>{isSendingTestAlert ? 'Sending Test Alert...' : 'Send Test Reply Alert'}</span>
          </button>
        </div>

        {/* Form to enter/update the notification email */}
        <form onSubmit={handleSaveNotificationEmail} className="flex flex-col sm:flex-row gap-2 pt-1 max-w-2xl">
          <div className="relative flex-1 flex items-center">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5" />
            <input
              type="email"
              value={notificationEmail}
              onChange={(e) => setNotificationEmail(e.target.value)}
              placeholder="Enter your personal or company email (e.g. webhubtech299@gmail.com)"
              className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium"
            />
          </div>
          <button
            type="submit"
            disabled={isSavingEmail}
            className="py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all cursor-pointer shrink-0 flex items-center justify-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>{isSavingEmail ? 'Saving...' : 'Save Notification Email'}</span>
          </button>
        </form>
      </div>

      {/* "How Can I Know When The Buyer Replies On The Website?" Explanatory Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white">1. Live Website Badge</h3>
            <p className="text-slate-400 text-[11px] mt-0.5">
              The bell icon at the top and the Inbox tab in the sidebar light up with an active notification badge whenever a new reply arrives.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white">2. Direct Email Alert</h3>
            <p className="text-slate-400 text-[11px] mt-0.5">
              An instant notification email is delivered to <strong>{user.replyNotificationEmail || notificationEmail}</strong> with the buyer's full text.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white">3. 1-Click AI Response</h3>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Reply back directly from this dashboard or use AI smart prompts to book calls and send wholesale catalogs.
            </p>
          </div>
        </div>
      </div>

      {/* Main Inbox Interface: Left Master List + Right Detail Thread */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
        {/* Left Column: Reply Cards List */}
        <div className="lg:col-span-5 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            {/* Search & Filter */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search buyer replies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Sentiment Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
                {['All', 'Unread', 'Meeting Requested', 'Interested', 'More Info'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setFilterSentiment(filter)}
                    className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      filterSentiment === filter
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {filter === 'Unread' ? `Unread (${unreadCount})` : filter}
                  </button>
                ))}
              </div>
            </div>

            {/* List of Replies */}
            <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
              {filteredReplies.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No replies matching current filter.
                </div>
              ) : (
                filteredReplies.map((reply) => {
                  const isSelected = selectedReply?.id === reply.id;
                  return (
                    <div
                      key={reply.id}
                      onClick={() => handleSelectReply(reply)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                        isSelected
                          ? 'bg-blue-950/40 border-blue-500 shadow-md shadow-blue-950/50'
                          : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      {/* Unread dot */}
                      {!reply.isRead && (
                        <span className="w-2 h-2 rounded-full bg-blue-500 absolute top-3.5 right-3.5" />
                      )}

                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          {reply.channel === 'email' ? (
                            <Mail className="w-3.5 h-3.5 text-blue-400" />
                          ) : (
                            <Linkedin className="w-3.5 h-3.5 text-sky-400" />
                          )}
                          {reply.contactName}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {reply.receivedAt}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-300 font-medium mt-0.5">
                        {reply.companyName} • <span className="text-slate-400">{reply.contactRole}</span>
                      </div>

                      <p className="text-xs text-slate-300 font-semibold mt-1 truncate">
                        {reply.subject}
                      </p>

                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                        {reply.snippet}
                      </p>

                      <div className="mt-2.5 flex items-center justify-between">
                        <span
                          className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                            reply.sentiment === 'Meeting Requested'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : reply.sentiment === 'Interested'
                              ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                              : 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                        >
                          {reply.sentiment}
                        </span>

                        {reply.repliedBack && (
                          <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                            <Check className="w-3 h-3" /> Replied
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Full Thread & Action Pane */}
        {selectedReply ? (
          <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              {/* Thread Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                        selectedReply.sentiment === 'Meeting Requested'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : selectedReply.sentiment === 'Interested'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {selectedReply.sentiment}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Via {selectedReply.channel.toUpperCase()}
                    </span>
                  </div>

                  <h2 className="text-lg font-extrabold text-white">
                    {selectedReply.subject}
                  </h2>

                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                    <span className="text-white font-semibold">{selectedReply.contactName}</span>
                    <span>({selectedReply.contactRole} at {selectedReply.companyName})</span>
                    <span>•</span>
                    <span className="font-mono text-blue-400">{selectedReply.contactEmail}</span>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <span className="text-[11px] text-slate-400 block font-mono">
                    Received {selectedReply.receivedAt}
                  </span>
                  <span className="text-[10px] text-emerald-400 block font-mono mt-0.5">
                    Notified to: {user.replyNotificationEmail || notificationEmail}
                  </span>
                </div>
              </div>

              {/* Thread Body */}
              <div className="space-y-4">
                {/* 1. Sent Outreach Context */}
                {selectedReply.sentMessageText && (
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-400 text-[11px]">
                      <span className="font-bold uppercase tracking-wider text-slate-400">
                        Outreach Sent via Campaign: {selectedReply.campaignName}
                      </span>
                    </div>
                    <p className="text-slate-400 whitespace-pre-line leading-relaxed italic text-[11px]">
                      "{selectedReply.sentMessageText}"
                    </p>
                  </div>
                )}

                {/* 2. Buyer's Inbound Reply */}
                <div className="p-5 rounded-2xl bg-gradient-to-b from-blue-950/20 to-slate-950 border border-blue-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-xs text-white">
                        {selectedReply.contactName.charAt(0)}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">
                          {selectedReply.contactName}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {selectedReply.contactEmail}
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {selectedReply.receivedAt}
                    </span>
                  </div>

                  <div className="text-xs text-slate-200 whitespace-pre-line leading-relaxed pl-10 border-l border-blue-500/20">
                    {selectedReply.fullMessage}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Reply & Response Drafting Box */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Respond to {selectedReply.contactName}
                </span>
                <span className="text-[11px] text-slate-400">
                  Will send from: {user.replyNotificationEmail || user.email}
                </span>
              </div>

              {/* AI Quick Response Chips */}
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                <button
                  type="button"
                  onClick={() =>
                    handleQuickInsert(
                      `Hi ${selectedReply.contactName.split(' ')[0]},\n\nSounds wonderful! I'd love to jump on a quick 15-minute call. You can grab any slot that works for you here: https://cal.com/andeola-growth or let me know if Thursday 2:00 PM CET is still ideal.\n\nBest,\nAndeola`
                    )
                  }
                  className="py-1 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-300 font-medium transition-colors cursor-pointer border border-slate-700"
                >
                  ⚡ Accept Call & Send Calendar Link
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleQuickInsert(
                      `Hi ${selectedReply.contactName.split(' ')[0]},\n\nThanks for your interest! I've attached our wholesale lookbook and line sheet with full MOQ and retail margins.\n\nLooking forward to your thoughts!\n\nBest,\nAndeola`
                    )
                  }
                  className="py-1 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors cursor-pointer border border-slate-700"
                >
                  📄 Send Wholesale Catalog & Pricing
                </button>
              </div>

              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Draft your message to ${selectedReply.contactName}...`}
                rows={4}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 leading-relaxed font-sans"
              />

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Press Send to dispatch via synchronized email server.
                </span>

                <button
                  type="button"
                  onClick={handleSendResponse}
                  disabled={!replyText.trim() || isSendingReply}
                  className="py-2.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSendingReply ? 'Sending...' : 'Send Reply Back'}</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-7 p-12 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-center text-slate-500 text-xs">
            Select a reply on the left to read the full conversation.
          </div>
        )}
      </div>
    </div>
  );
};
