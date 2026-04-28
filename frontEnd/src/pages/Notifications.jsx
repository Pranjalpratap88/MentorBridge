import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import notificationService from '../services/notificationService';

// ─── Helpers ────────────────────────────────────────────────────────────────

const timeAgo = (dateStr) => {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
};

// ─── Notification type config ────────────────────────────────────────────────

const TYPE_CONFIG = {
  PRIVATE_QUERY_RECEIVED: {
    icon: 'lock',
    accent: 'text-purple-400',
    bg: 'bg-purple-500/15',
    border: 'border-purple-500/30',
    dot: 'bg-purple-400',
  },
  QUERY_RESPONSE_RECEIVED: {
    icon: 'forum',
    accent: 'text-blue-400',
    bg: 'bg-blue-500/15',
    border: 'border-blue-500/30',
    dot: 'bg-blue-400',
  },
  BEST_ANSWER_MARKED: {
    icon: 'star',
    accent: 'text-yellow-400',
    bg: 'bg-yellow-500/15',
    border: 'border-yellow-500/30',
    dot: 'bg-yellow-400',
  },
  QUERY_ASSIGNED: {
    icon: 'assignment',
    accent: 'text-emerald-400',
    bg: 'bg-emerald-500/15',
    border: 'border-emerald-500/30',
    dot: 'bg-emerald-400',
  },
  SYSTEM: {
    icon: 'info',
    accent: 'text-gray-400',
    bg: 'bg-gray-500/15',
    border: 'border-gray-500/30',
    dot: 'bg-gray-400',
  },
};

const getTypeConfig = (type) => TYPE_CONFIG[type] || TYPE_CONFIG.SYSTEM;

// ─── Spinner ────────────────────────────────────────────────────────────────

const Spinner = () => (
  <div className="flex items-center justify-center py-20">
    <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
  </div>
);

// ─── Notification Item ───────────────────────────────────────────────────────

const NotificationItem = ({ notification, onMarkRead, onNavigate }) => {
  const cfg = getTypeConfig(notification.type);
  const isUnread = !notification.isRead;

  const handleClick = () => {
    if (notification.actionUrl) {
      onNavigate(notification.actionUrl);
    }
    if (isUnread) {
      onMarkRead(notification.id);
    }
  };

  const handleMarkRead = (e) => {
    e.stopPropagation();
    onMarkRead(notification.id);
  };

  return (
    <div
      onClick={handleClick}
      className={`group relative flex gap-4 p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
        isUnread
          ? 'bg-[#0c1427]/90 border-white/10 hover:border-primary/20'
          : 'bg-[#0c1427]/50 border-white/5 hover:border-white/10'
      }`}
    >
      {/* Unread left border indicator */}
      {isUnread && (
        <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 ${cfg.dot} rounded-r-full`} />
      )}

      {/* Avatar / Icon */}
      <div className="flex-shrink-0">
        {notification.actorProfilePicture ? (
          <img
            src={notification.actorProfilePicture}
            alt={notification.actorName}
            className="w-11 h-11 rounded-xl object-cover"
          />
        ) : notification.actorName ? (
          <div className="w-11 h-11 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
            {getInitials(notification.actorName)}
          </div>
        ) : (
          <div className={`w-11 h-11 rounded-xl ${cfg.bg} border ${cfg.border} flex items-center justify-center`}>
            <span className={`material-symbols-outlined text-lg ${cfg.accent}`}>{cfg.icon}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="text-[#dee5ff] text-sm font-bold leading-snug">
            {notification.title}
          </p>
          <span className="text-[#9baad6] text-[10px] uppercase tracking-widest flex-shrink-0 mt-0.5">
            {timeAgo(notification.createdAt)}
          </span>
        </div>
        {notification.message && (
          <p className="text-[#9baad6] text-sm line-clamp-2 leading-relaxed">
            {notification.message}
          </p>
        )}
        {notification.actionUrl && (
          <p className="text-primary text-xs font-bold mt-1.5 flex items-center gap-1">
            View details
            <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
          </p>
        )}
      </div>

      {/* Mark as read button (hover) */}
      {isUnread && (
        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity self-start mt-0.5">
          <button
            onClick={handleMarkRead}
            title="Mark as read"
            className="p-1.5 text-[#9baad6] hover:text-primary transition-colors rounded-lg hover:bg-primary/10"
          >
            <span className="material-symbols-outlined text-lg">check_circle</span>
          </button>
        </div>
      )}

      {/* Unread dot */}
      {isUnread && (
        <div className={`absolute top-4 right-4 w-2 h-2 ${cfg.dot} rounded-full`} />
      )}
    </div>
  );
};

// ─── Main Notifications Component ───────────────────────────────────────────

const Notifications = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('unread');
  const [markingAll, setMarkingAll] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await notificationService.getAll();
      setNotifications(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load notifications.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error('Failed to mark as read:', err.message);
    }
  };

  const handleMarkAllRead = async () => {
    setMarkingAll(true);
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Failed to mark all as read:', err.message);
    } finally {
      setMarkingAll(false);
    }
  };

  const handleNavigate = (url) => {
    if (url) navigate(url);
  };

  const filtered = activeTab === 'unread'
    ? notifications.filter((n) => !n.isRead)
    : notifications;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const TABS = [
    { value: 'all', label: 'All' },
    { value: 'unread', label: 'Unread', count: unreadCount },
  ];

  return (
    <div className="px-6 py-10 max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-black text-[#dee5ff] tracking-tight">Notifications</h1>
          <p className="text-[#9baad6] text-sm mt-1">
            Stay updated with your activity and community interactions.
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            disabled={markingAll}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-[#9baad6] hover:text-primary transition-colors disabled:opacity-50"
          >
            {markingAll ? (
              <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            ) : (
              <span className="material-symbols-outlined text-sm">done_all</span>
            )}
            Mark all as read
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-6 border-b border-white/5">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`pb-3 text-sm font-bold transition-all flex items-center gap-2 border-b-2 -mb-px ${
              activeTab === tab.value
                ? 'text-primary border-primary'
                : 'text-[#9baad6] border-transparent hover:text-[#dee5ff]'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <Spinner />
      ) : filtered.length === 0 ? (
        <div className="bg-[#0c1427]/80 rounded-2xl p-12 border border-white/5 text-center">
          <span className="material-symbols-outlined text-[#9baad6] text-5xl mb-4 block">
            {activeTab === 'unread' ? 'mark_email_read' : 'notifications_none'}
          </span>
          <p className="text-[#dee5ff] font-bold text-lg mb-2">
            {activeTab === 'unread' ? "You're all caught up!" : 'No notifications yet'}
          </p>
          <p className="text-[#9baad6] text-sm">
            {activeTab === 'unread'
              ? 'No unread notifications at the moment.'
              : 'Notifications about your queries, responses, and activity will appear here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkRead={handleMarkRead}
              onNavigate={handleNavigate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
