import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import userService from '../services/userService';
import feedbackService from '../services/feedbackService';
import queryService from '../services/queryService';

// ─── Helpers ────────────────────────────────────────────────────────────────

const timeAgo = (dateStr) => {
  if (!dateStr) return '—';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return days < 30 ? `${days}d ago` : new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const ROLE_BADGE = {
  STUDENT: 'bg-blue-500/20 text-blue-300',
  SENIOR_STUDENT: 'bg-purple-500/20 text-purple-300',
  ALUMNI: 'bg-emerald-500/20 text-emerald-300',
  MENTOR: 'bg-orange-500/20 text-orange-300',
};

const CATEGORY_BADGE = {
  GENERAL: 'bg-blue-500/20 text-blue-300',
  BUG_REPORT: 'bg-red-500/20 text-red-300',
  FEATURE_REQUEST: 'bg-green-500/20 text-green-300',
  UI_UX: 'bg-purple-500/20 text-purple-300',
  PERFORMANCE: 'bg-yellow-500/20 text-yellow-300',
  CONTENT: 'bg-cyan-500/20 text-cyan-300',
  OTHER: 'bg-gray-500/20 text-gray-300',
};

const StarDisplay = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map(s => (
      <span key={s} className={`material-symbols-outlined text-sm ${rating >= s ? 'text-yellow-400' : 'text-gray-600'}`}>
        {rating >= s ? 'star' : 'star_outline'}
      </span>
    ))}
  </div>
);

const Spinner = () => (
  <div className="flex items-center justify-center py-16">
    <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
  </div>
);

// ─── Stat Card ───────────────────────────────────────────────────────────────

const StatCard = ({ label, value, icon, color = 'text-primary', bg = 'bg-primary/10' }) => (
  <div className="bg-[#0c1427]/80 rounded-2xl p-5 border border-white/5">
    <div className="flex items-center justify-between mb-3">
      <p className="text-[#9baad6] text-xs font-bold uppercase tracking-widest">{label}</p>
      <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center`}>
        <span className={`material-symbols-outlined text-base ${color}`}>{icon}</span>
      </div>
    </div>
    <p className="text-3xl font-black text-[#dee5ff]">{value ?? '—'}</p>
  </div>
);

// ─── Overview Tab ────────────────────────────────────────────────────────────

const OverviewTab = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await userService.getAdminStats();
        setStats(res.data);
      } catch { /* ignore */ }
      finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={stats?.totalUsers} icon="group" />
        <StatCard label="Students" value={stats?.totalStudents} icon="school" color="text-blue-400" bg="bg-blue-500/10" />
        <StatCard label="Alumni" value={stats?.totalAlumni} icon="workspace_premium" color="text-emerald-400" bg="bg-emerald-500/10" />
        <StatCard label="Mentors" value={stats?.totalMentors} icon="star" color="text-orange-400" bg="bg-orange-500/10" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <StatCard label="Total Queries" value={stats?.totalQueries} icon="forum" color="text-purple-400" bg="bg-purple-500/10" />
        <StatCard label="Open Queries" value={stats?.openQueries} icon="help_outline" color="text-yellow-400" bg="bg-yellow-500/10" />
        <StatCard label="Resolved" value={stats?.resolvedQueries} icon="check_circle" color="text-green-400" bg="bg-green-500/10" />
      </div>
    </div>
  );
};

// ─── Users Tab ───────────────────────────────────────────────────────────────

const UsersTab = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [actionLoading, setActionLoading] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await userService.getAllUsers();
      setUsers(res.data || []);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleToggleLock = async (id) => {
    setActionLoading(id + '-lock');
    try {
      const res = await userService.toggleUserLock(id);
      setUsers(prev => prev.map(u => u.id === id ? res.data : u));
    } catch { /* ignore */ }
    finally { setActionLoading(null); }
  };

  const handleToggleEnable = async (id) => {
    setActionLoading(id + '-enable');
    try {
      const res = await userService.toggleUserEnable(id);
      setUsers(prev => prev.map(u => u.id === id ? res.data : u));
    } catch { /* ignore */ }
    finally { setActionLoading(null); }
  };

  const filtered = users.filter(u => {
    const matchRole = roleFilter === 'ALL' || u.userRole === roleFilter;
    const matchSearch = !search || u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.username?.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const ROLES = ['ALL', 'STUDENT', 'SENIOR_STUDENT', 'ALUMNI', 'MENTOR'];

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#9baad6] text-base">search</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email, username..."
            className="w-full bg-[#060e1d] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-[#dee5ff] placeholder-[#9baad6]/40 focus:border-primary/50 focus:outline-none text-sm"
          />
        </div>
        <div className="flex gap-1 bg-[#060e1d] rounded-xl p-1 border border-white/10">
          {ROLES.map(r => (
            <button key={r} onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${roleFilter === r ? 'bg-primary text-on-primary' : 'text-[#9baad6] hover:text-[#dee5ff]'}`}>
              {r.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {loading ? <Spinner /> : (
        <div className="space-y-2">
          <p className="text-[#9baad6] text-xs">{filtered.length} user{filtered.length !== 1 ? 's' : ''}</p>
          {filtered.map(u => (
            <div key={u.id} className="bg-[#0c1427]/80 rounded-xl p-4 border border-white/5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0 overflow-hidden">
                {u.profilePicture ? <img src={u.profilePicture} alt={u.fullName} className="w-full h-full object-cover" /> : getInitials(u.fullName)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-[#dee5ff] font-bold text-sm">{u.fullName}</p>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${ROLE_BADGE[u.userRole] || 'bg-gray-500/20 text-gray-300'}`}>
                    {u.userRole?.replace('_', ' ')}
                  </span>
                  {u.accountLocked && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-300">Locked</span>}
                  {!u.accountEnabled && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-500/20 text-gray-400">Disabled</span>}
                </div>
                <p className="text-[#9baad6] text-xs truncate">{u.email} · @{u.username}</p>
                <p className="text-[#9baad6] text-xs">⭐ {u.reputationPoints} pts · Joined {timeAgo(u.createdAt)}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => handleToggleLock(u.id)}
                  disabled={actionLoading === u.id + '-lock'}
                  title={u.accountLocked ? 'Unlock user' : 'Lock user'}
                  className={`p-2 rounded-lg text-xs font-bold transition-all ${u.accountLocked ? 'bg-green-500/20 text-green-300 hover:bg-green-500/30' : 'bg-red-500/20 text-red-300 hover:bg-red-500/30'}`}
                >
                  <span className="material-symbols-outlined text-base">{u.accountLocked ? 'lock_open' : 'lock'}</span>
                </button>
                <button
                  onClick={() => handleToggleEnable(u.id)}
                  disabled={actionLoading === u.id + '-enable'}
                  title={u.accountEnabled ? 'Disable user' : 'Enable user'}
                  className={`p-2 rounded-lg text-xs font-bold transition-all ${u.accountEnabled ? 'bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30' : 'bg-green-500/20 text-green-300 hover:bg-green-500/30'}`}
                >
                  <span className="material-symbols-outlined text-base">{u.accountEnabled ? 'person_off' : 'person_check'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Feedback Tab ─────────────────────────────────────────────────────────────

const FeedbackTab = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [responding, setResponding] = useState(null); // feedback id being responded to
  const [responseText, setResponseText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = filter === 'unreviewed'
        ? await feedbackService.getUnreviewedFeedback()
        : filter === 'reviewed'
        ? await feedbackService.getReviewedFeedback()
        : await feedbackService.getAllFeedback();
      setFeedbackList(res.data || []);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const handleRespond = async (id) => {
    if (!responseText.trim()) return;
    setSubmitting(true);
    try {
      const res = await feedbackService.respondToFeedback(id, responseText.trim());
      setFeedbackList(prev => prev.map(f => f.id === id ? res.data : f));
      setResponding(null);
      setResponseText('');
    } catch { /* ignore */ }
    finally { setSubmitting(false); }
  };

  const FILTERS = [
    { value: 'all', label: 'All' },
    { value: 'unreviewed', label: 'Unreviewed' },
    { value: 'reviewed', label: 'Reviewed' },
  ];

  return (
    <div className="space-y-4">
      {/* Filter tabs */}
      <div className="flex gap-2">
        {FILTERS.map(f => (
          <button key={f.value} onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filter === f.value ? 'bg-primary text-on-primary' : 'bg-white/5 text-[#9baad6] hover:bg-white/10'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {loading ? <Spinner /> : feedbackList.length === 0 ? (
        <div className="bg-[#0c1427]/80 rounded-2xl p-12 border border-white/5 text-center">
          <span className="material-symbols-outlined text-[#9baad6] text-5xl mb-4 block">feedback</span>
          <p className="text-[#dee5ff] font-bold">No feedback found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {feedbackList.map(fb => (
            <div key={fb.id} className={`bg-[#0c1427]/80 rounded-2xl border transition-all ${expandedId === fb.id ? 'border-primary/30' : 'border-white/5'}`}>
              {/* Header */}
              <div
                className="p-5 cursor-pointer"
                onClick={() => setExpandedId(expandedId === fb.id ? null : fb.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                      {getInitials(fb.name)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-[#dee5ff] font-bold text-sm">{fb.name || 'Anonymous'}</p>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${CATEGORY_BADGE[fb.category] || 'bg-gray-500/20 text-gray-300'}`}>
                          {fb.category?.replace(/_/g, ' ')}
                        </span>
                        {fb.isReviewed
                          ? <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-500/20 text-green-300">Reviewed</span>
                          : <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-500/20 text-yellow-300">Pending</span>
                        }
                        {fb.adminResponse && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/20 text-primary">Responded</span>}
                      </div>
                      <p className="text-[#9baad6] text-xs">{fb.email} · {timeAgo(fb.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <StarDisplay rating={fb.rating} />
                    <span className="material-symbols-outlined text-[#9baad6] text-base">
                      {expandedId === fb.id ? 'expand_less' : 'expand_more'}
                    </span>
                  </div>
                </div>
                <p className="text-[#dee5ff] text-sm mt-3 leading-relaxed line-clamp-2">{fb.message}</p>
              </div>

              {/* Expanded content */}
              {expandedId === fb.id && (
                <div className="px-5 pb-5 space-y-4 border-t border-white/5 pt-4">
                  {/* Full message */}
                  <div>
                    <p className="text-xs font-bold text-[#9baad6] uppercase tracking-widest mb-2">Full Message</p>
                    <p className="text-[#dee5ff] text-sm leading-relaxed bg-[#060e1d] rounded-xl p-4">{fb.message}</p>
                  </div>

                  {/* Existing admin response */}
                  {fb.adminResponse && (
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                      <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
                        Admin Response {fb.respondedByName && `· by ${fb.respondedByName}`}
                        {fb.respondedAt && <span className="text-[#9baad6] font-normal normal-case tracking-normal ml-1">· {timeAgo(fb.respondedAt)}</span>}
                      </p>
                      <p className="text-[#dee5ff] text-sm leading-relaxed">{fb.adminResponse}</p>
                    </div>
                  )}

                  {/* Response form */}
                  {responding === fb.id ? (
                    <div className="space-y-3">
                      <p className="text-xs font-bold text-[#9baad6] uppercase tracking-widest">
                        {fb.adminResponse ? 'Update Response' : 'Write Response'}
                      </p>
                      <textarea
                        value={responseText}
                        onChange={e => setResponseText(e.target.value)}
                        placeholder="Write a helpful response to this feedback..."
                        rows={4}
                        className="w-full bg-[#060e1d] border border-white/10 rounded-xl px-4 py-3 text-[#dee5ff] placeholder-[#9baad6]/40 focus:border-primary/50 focus:outline-none resize-none text-sm"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setResponding(null); setResponseText(''); }}
                          className="px-4 py-2 rounded-xl bg-white/5 text-[#9baad6] font-bold text-sm hover:bg-white/10 transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleRespond(fb.id)}
                          disabled={submitting || !responseText.trim()}
                          className="px-4 py-2 rounded-xl bg-primary text-on-primary font-bold text-sm hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center gap-2"
                        >
                          {submitting ? <div className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" /> : <span className="material-symbols-outlined text-sm">send</span>}
                          Send Response
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setResponding(fb.id); setResponseText(fb.adminResponse || ''); }}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary font-bold text-sm hover:bg-primary/20 transition-all"
                    >
                      <span className="material-symbols-outlined text-sm">reply</span>
                      {fb.adminResponse ? 'Edit Response' : 'Respond'}
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Queries Tab ─────────────────────────────────────────────────────────────

const QueriesTab = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = filter === 'unresolved'
          ? await queryService.getUnresolvedQueries()
          : await queryService.getAllQueries();
        setQueries(res.data || []);
      } catch { /* ignore */ }
      finally { setLoading(false); }
    };
    load();
  }, [filter]);

  const STATUS_BADGE = {
    OPEN: 'bg-blue-500/20 text-blue-300',
    RESOLVED: 'bg-green-500/20 text-green-300',
    CLOSED: 'bg-gray-500/20 text-gray-400',
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {[{ v: 'all', l: 'All Queries' }, { v: 'unresolved', l: 'Unresolved' }].map(f => (
          <button key={f.v} onClick={() => setFilter(f.v)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filter === f.v ? 'bg-primary text-on-primary' : 'bg-white/5 text-[#9baad6] hover:bg-white/10'}`}>
            {f.l}
          </button>
        ))}
      </div>

      {loading ? <Spinner /> : (
        <div className="space-y-2">
          <p className="text-[#9baad6] text-xs">{queries.length} quer{queries.length !== 1 ? 'ies' : 'y'}</p>
          {queries.map(q => (
            <div key={q.id} className="bg-[#0c1427]/80 rounded-xl p-4 border border-white/5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${STATUS_BADGE[q.status] || STATUS_BADGE.OPEN}`}>{q.status}</span>
                    {q.isPopular && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-500/20 text-yellow-300">🔥 Popular</span>}
                  </div>
                  <p className="text-[#dee5ff] font-bold text-sm mb-1 truncate">{q.title}</p>
                  <p className="text-[#9baad6] text-xs">by {q.studentName} · {timeAgo(q.createdAt)} · {q.responseCount ?? 0} responses</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Main AdminPanel ──────────────────────────────────────────────────────────

const AdminPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user && !user.roles?.includes('ADMIN')) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const TABS = [
    { value: 'overview', label: 'Overview', icon: 'dashboard' },
    { value: 'users', label: 'Users', icon: 'group' },
    { value: 'feedback', label: 'Feedback', icon: 'rate_review' },
    { value: 'queries', label: 'Queries', icon: 'forum' },
  ];

  return (
    <div className="px-6 py-10 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center">
          <span className="material-symbols-outlined text-red-400 text-xl">admin_panel_settings</span>
        </div>
        <div>
          <h1 className="text-3xl font-black text-[#dee5ff] tracking-tight">Admin Panel</h1>
          <p className="text-[#9baad6] text-sm">Manage users, feedback, and platform activity.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all flex-shrink-0 ${
              activeTab === tab.value ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-white/5 text-[#9baad6] hover:bg-white/10'
            }`}
          >
            <span className="material-symbols-outlined text-base">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'users' && <UsersTab />}
      {activeTab === 'feedback' && <FeedbackTab />}
      {activeTab === 'queries' && <QueriesTab />}
    </div>
  );
};

export default AdminPanel;
