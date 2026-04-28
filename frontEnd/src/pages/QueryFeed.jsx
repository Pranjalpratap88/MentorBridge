import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import queryService from '../services/queryService';
import userService from '../services/userService';

// ─── Helpers ────────────────────────────────────────────────────────────────

const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
};

const timeAgo = (dateStr) => {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const ROLE_LABELS = {
  ANYONE: 'Anyone',
  SENIOR_STUDENT: 'Senior Students',
  ALUMNI: 'Alumni',
  MENTOR: 'Mentors',
};

const ROLE_BADGE = {
  SENIOR_STUDENT: 'bg-purple-500/20 text-purple-300',
  ALUMNI: 'bg-emerald-500/20 text-emerald-300',
  MENTOR: 'bg-orange-500/20 text-orange-300',
  ANYONE: 'bg-blue-500/20 text-blue-300',
};

const STATUS_BADGE = {
  OPEN: 'bg-blue-500/20 text-blue-300',
  RESOLVED: 'bg-green-500/20 text-green-300',
  CLOSED: 'bg-gray-500/20 text-gray-400',
};

// ─── Spinner ────────────────────────────────────────────────────────────────

const Spinner = () => (
  <div className="flex items-center justify-center py-16">
    <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
  </div>
);

// ─── Query Card ─────────────────────────────────────────────────────────────

const QueryCard = ({ query, isMyQuery }) => {
  const tags = query.tags ? query.tags.split(',').map((t) => t.trim()).filter(Boolean) : [];

  return (
    <Link
      to={`/query/${query.id}`}
      className="block bg-[#0c1427]/80 rounded-2xl p-6 border border-white/5 hover:border-primary/20 transition-all group"
    >
      {/* Header row */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
          {query.studentProfilePicture ? (
            <img
              src={query.studentProfilePicture}
              alt={query.studentName}
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            getInitials(query.studentName)
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[#dee5ff] font-bold text-sm">{query.studentName || 'Anonymous'}</span>
            <span className="text-[#9baad6] text-xs">{timeAgo(query.createdAt)}</span>
            {query.isPopular && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-500/20 text-yellow-300">
                🔥 Popular
              </span>
            )}
            {query.isPrivate && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 flex items-center gap-1">
                <span className="material-symbols-outlined text-[10px]">lock</span>
                Private
              </span>
            )}
            {query.targetRole && query.targetRole !== 'ANYONE' && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${ROLE_BADGE[query.targetRole] || 'bg-blue-500/20 text-blue-300'}`}>
                → {ROLE_LABELS[query.targetRole] || query.targetRole.replace('_', ' ')}
              </span>
            )}
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-[10px] font-bold flex-shrink-0 ${STATUS_BADGE[query.status] || STATUS_BADGE.OPEN}`}>
          {query.status}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-[#dee5ff] font-black text-base mb-2 group-hover:text-primary transition-colors leading-snug">
        {query.title}
      </h3>

      {/* Content preview */}
      <p className="text-[#9baad6] text-sm leading-relaxed line-clamp-2 mb-4">
        {query.content}
      </p>

      {/* Tags + response count */}
      <div className="flex items-center gap-2 flex-wrap">
        {tags.slice(0, 4).map((tag) => (
          <span key={tag} className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-[10px] font-bold">
            #{tag}
          </span>
        ))}
        <span className="ml-auto text-[#9baad6] text-xs flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">forum</span>
          {query.responseCount ?? 0}
        </span>
      </div>
    </Link>
  );
};

// ─── Post Query Modal ──────────────────────────────────────────────────────

const PostQueryModal = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    title: '',
    content: '',
    tags: '',
    targetRoles: [],
    assignedToId: '',
  });
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleRoleToggle = async (role) => {
    const newRoles = form.targetRoles.includes(role)
      ? form.targetRoles.filter((r) => r !== role)
      : [...form.targetRoles, role];
    
    setForm((f) => ({ ...f, targetRoles: newRoles, assignedToId: '' }));
    
    // Load users if any role is selected
    if (newRoles.length > 0) {
      setLoadingUsers(true);
      try {
        const allUsers = [];
        for (const r of newRoles) {
          const res = await userService.getUsersByRole(r);
          allUsers.push(...(res.data || []));
        }
        // Remove duplicates
        const uniqueUsers = Array.from(new Map(allUsers.map((u) => [u.id, u])).values());
        setUsers(uniqueUsers);
      } catch {
        setUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    } else {
      setUsers([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      setError('Title and content are required.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        title: form.title.trim(),
        content: form.content.trim(),
        tags: form.tags.trim(),
        targetRoles: form.targetRoles.length > 0 ? form.targetRoles : undefined,
        assignedToId: form.assignedToId || undefined,
        isPrivate: false,
      };
      await queryService.createQuery(payload);
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to post query.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0c1427] rounded-2xl w-full max-w-lg border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-xl font-black text-[#dee5ff]">Post Query</h2>
          <button onClick={onClose} className="text-[#9baad6] hover:text-[#dee5ff] transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#9baad6] uppercase tracking-widest mb-2">
              Title *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="What's your question?"
              className="w-full bg-[#060e1d] border border-white/10 rounded-xl px-4 py-3 text-[#dee5ff] placeholder-[#9baad6]/40 focus:border-primary/50 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#9baad6] uppercase tracking-widest mb-2">
              Content *
            </label>
            <textarea
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              placeholder="Describe your question in detail..."
              rows={4}
              className="w-full bg-[#060e1d] border border-white/10 rounded-xl px-4 py-3 text-[#dee5ff] placeholder-[#9baad6]/40 focus:border-primary/50 focus:outline-none transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#9baad6] uppercase tracking-widest mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
              placeholder="e.g. career, internship, resume"
              className="w-full bg-[#060e1d] border border-white/10 rounded-xl px-4 py-3 text-[#dee5ff] placeholder-[#9baad6]/40 focus:border-primary/50 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#9baad6] uppercase tracking-widest mb-3">
              Target Audience (select multiple)
            </label>
            <div className="space-y-2">
              {Object.entries(ROLE_LABELS).map(([val, label]) => (
                <label
                  key={val}
                  className="flex items-center gap-3 p-3 border border-white/10 rounded-xl cursor-pointer hover:border-white/20 transition-all"
                >
                  <input
                    type="checkbox"
                    checked={form.targetRoles.includes(val)}
                    onChange={() => handleRoleToggle(val)}
                    className="w-4 h-4 rounded border-white/20 bg-[#060e1d] accent-primary cursor-pointer"
                  />
                  <span className="text-sm font-bold text-[#9baad6]">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {form.targetRoles.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-[#9baad6] uppercase tracking-widest mb-2">
                Send to Specific Person (optional)
              </label>
              {loadingUsers ? (
                <div className="flex items-center gap-2 text-[#9baad6] text-sm py-2">
                  <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  Loading...
                </div>
              ) : (
                <select
                  value={form.assignedToId}
                  onChange={(e) => setForm((f) => ({ ...f, assignedToId: e.target.value }))}
                  className="w-full bg-[#060e1d] border border-white/10 rounded-xl px-4 py-3 text-[#dee5ff] focus:border-primary/50 focus:outline-none"
                >
                  <option value="">No specific person</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.fullName}
                      {u.currentCompany ? ` @ ${u.currentCompany}` : ''}
                      {u.college ? ` · ${u.college}` : ''}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-white/5 text-[#9baad6] font-bold hover:bg-white/10 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 rounded-xl bg-primary text-on-primary font-bold hover:bg-primary/90 disabled:opacity-50 transition-all"
            >
              {submitting ? 'Posting...' : 'Post Query'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};



// ─── Main QueryFeed Component ────────────────────────────────────────────────

const QueryFeed = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('all');
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [activeTag, setActiveTag] = useState('');
  const [allTags, setAllTags] = useState([]);

  const [showPostModal, setShowPostModal] = useState(false);

  const [successMsg, setSuccessMsg] = useState('');

  const fetchQueries = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      let res;
      if (activeTag) {
        res = await queryService.getQueriesByTag(activeTag);
      } else if (activeTab === 'popular') {
        res = await queryService.getPopularQueries();
      } else if (activeTab === 'mine') {
        res = await queryService.getMyQueries();
      } else if (activeTab === 'unresolved') {
        res = await queryService.getUnresolvedQueries();
      } else if (activeTab === 'alumni') {
        res = await queryService.getQueriesForRole('ALUMNI');
      } else if (activeTab === 'senior') {
        res = await queryService.getQueriesForRole('SENIOR_STUDENT');
      } else if (activeTab === 'mentor') {
        res = await queryService.getQueriesForRole('MENTOR');
      } else {
        res = await queryService.getAllQueries();
      }
      const data = res.data || [];
      setQueries(data);

      // Collect all unique tags for filter chips
      if (activeTab === 'all' && !activeTag) {
        const tagSet = new Set();
        data.forEach((q) => {
          if (q.tags) q.tags.split(',').forEach((t) => tagSet.add(t.trim()));
        });
        setAllTags([...tagSet].filter(Boolean).slice(0, 20));
      }
    } catch (err) {
      setError(err.message || 'Failed to load queries.');
    } finally {
      setLoading(false);
    }
  }, [activeTab, activeTag]);

  useEffect(() => {
    fetchQueries();
  }, [fetchQueries]);

  const handleModalSuccess = () => {
    setShowPostModal(false);
    setSuccessMsg('Query posted successfully!');
    setTimeout(() => setSuccessMsg(''), 4000);
    fetchQueries();
  };

  const TABS = [
    { value: 'all', label: 'All Queries', icon: 'dynamic_feed' },
    { value: 'popular', label: 'Popular', icon: 'local_fire_department' },
    { value: 'unresolved', label: 'Unresolved', icon: 'help_outline' },
    { value: 'mine', label: 'My Queries', icon: 'person' },
    { value: 'alumni', label: 'Alumni', icon: 'school' },
    { value: 'senior', label: 'Seniors', icon: 'trending_up' },
    { value: 'mentor', label: 'Mentors', icon: 'star' },
  ];

  return (
    <div className="px-6 py-10 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-black text-[#dee5ff] tracking-tight">Query Feed</h1>
          <p className="text-[#9baad6] text-sm mt-1">Ask questions, get answers from seniors, alumni, and mentors.</p>
        </div>
        <button
          onClick={() => setShowPostModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-xl font-bold text-sm hover:bg-primary/90 transition-all"
        >
          <span className="material-symbols-outlined text-sm">add_circle</span>
          Post Query
        </button>
      </div>

      {/* Success message */}
      {successMsg && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">check_circle</span>
          {successMsg}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => {
              setActiveTab(tab.value);
              setActiveTag('');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all flex-shrink-0 ${
              activeTab === tab.value
                ? 'bg-primary text-on-primary'
                : 'bg-white/5 text-[#9baad6] hover:bg-white/10'
            }`}
          >
            <span className="material-symbols-outlined text-base">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tag filters (only on all tab) */}
      {activeTab === 'all' && allTags.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? '' : tag)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeTag === tag
                  ? 'bg-primary text-on-primary'
                  : 'bg-primary/10 text-primary hover:bg-primary/20'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <Spinner />
      ) : queries.length === 0 ? (
        <div className="bg-[#0c1427]/80 rounded-2xl p-12 border border-white/5 text-center">
          <span className="material-symbols-outlined text-[#9baad6] text-5xl mb-4 block">
            {activeTab === 'mine' ? 'assignment' : 'inbox'}
          </span>
          <p className="text-[#dee5ff] font-bold text-lg mb-2">
            {activeTab === 'mine' ? 'No queries yet' : 'No queries found'}
          </p>
          <p className="text-[#9baad6] text-sm">
            {activeTab === 'mine'
              ? 'Start by posting your first query!'
              : 'Try adjusting your filters or check back later.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {queries.map((query) => (
            <QueryCard key={query.id} query={query} isMyQuery={query.studentId === user?.id} />
          ))}
        </div>
      )}

      {/* Post Query Modal */}
      {showPostModal && (
        <PostQueryModal onClose={() => setShowPostModal(false)} onSuccess={handleModalSuccess} />
      )}
    </div>
  );
};

export default QueryFeed;
