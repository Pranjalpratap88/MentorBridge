import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
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

const QueryCard = ({ query, onUpvote }) => {
  const tags = query.tags ? query.tags.split(',').map((t) => t.trim()).filter(Boolean) : [];
  const [upvoting, setUpvoting] = useState(false);

  const handleUpvote = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (upvoting) return;
    setUpvoting(true);
    try { await onUpvote(query.id); } finally { setUpvoting(false); }
  };

  const sc = {
    OPEN: { label: 'Open', cls: 'bg-blue-500/15 text-blue-300 border border-blue-500/20' },
    RESOLVED: { label: 'Resolved', cls: 'bg-green-500/15 text-green-300 border border-green-500/20' },
    CLOSED: { label: 'Closed', cls: 'bg-gray-500/15 text-gray-400 border border-gray-500/20' },
  }[query.status] || { label: query.status, cls: 'bg-blue-500/15 text-blue-300 border border-blue-500/20' };

  return (
    <Link
      to={`/query/${query.id}`}
      className="block bg-[#0c1427]/80 rounded-2xl border border-white/5 hover:border-primary/30 hover:shadow-[0_0_30px_rgba(99,102,241,0.07)] transition-all duration-200 group overflow-hidden"
    >
      {query.status === 'RESOLVED' && <div className="h-0.5 bg-gradient-to-r from-green-500/60 to-emerald-500/60" />}
      {query.isPopular && query.status !== 'RESOLVED' && <div className="h-0.5 bg-gradient-to-r from-yellow-500/60 to-orange-500/60" />}

      <div className="p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold text-xs flex-shrink-0 overflow-hidden">
            {query.studentProfilePicture
              ? <img src={query.studentProfilePicture} alt={query.studentName} className="w-full h-full object-cover" />
              : getInitials(query.studentName)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[#dee5ff] font-semibold text-sm">{query.studentName || 'Anonymous'}</span>
              <span className="text-[#9baad6]/60 text-xs">·</span>
              <span className="text-[#9baad6] text-xs">{timeAgo(query.createdAt)}</span>
              {query.isPopular && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-500/15 text-yellow-300 border border-yellow-500/20">🔥 Trending</span>
              )}
              {query.targetRole && query.targetRole !== 'ANYONE' && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${ROLE_BADGE[query.targetRole] || 'bg-blue-500/20 text-blue-300'}`}>
                  → {ROLE_LABELS[query.targetRole] || query.targetRole.replace('_', ' ')}
                </span>
              )}
            </div>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex-shrink-0 ${sc.cls}`}>{sc.label}</span>
        </div>

        <h3 className="text-[#dee5ff] font-bold text-[15px] mb-2 group-hover:text-primary transition-colors leading-snug line-clamp-2">
          {query.title}
        </h3>
        <p className="text-[#9baad6] text-sm leading-relaxed line-clamp-2 mb-4">{query.content}</p>

        {tags.length > 0 && (
          <div className="flex gap-1.5 flex-wrap mb-4">
            {tags.slice(0, 4).map((tag) => (
              <span key={tag} className="px-2 py-0.5 bg-[#060e1d] text-[#9baad6] rounded-lg text-[10px] font-medium border border-white/5">#{tag}</span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 pt-3 border-t border-white/[0.04]">
          <button onClick={handleUpvote} disabled={upvoting}
            className={`flex items-center gap-1.5 text-xs font-semibold transition-all hover:scale-105 active:scale-95 ${query.hasUpvoted ? 'text-primary' : 'text-[#9baad6] hover:text-primary'}`}>
            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: query.hasUpvoted ? "'FILL' 1" : "'FILL' 0" }}>thumb_up</span>
            {query.upvoteCount > 0 && <span>{query.upvoteCount}</span>}
            <span className="text-[10px]">{query.hasUpvoted ? 'Helpful' : 'Helpful?'}</span>
          </button>
          <span className="flex items-center gap-1.5 text-[#9baad6] text-xs">
            <span className="material-symbols-outlined text-base">chat_bubble_outline</span>
            <span>{query.responseCount ?? 0} {query.responseCount === 1 ? 'answer' : 'answers'}</span>
          </span>
          {query.assignedToName && (
            <span className="flex items-center gap-1 text-[#9baad6] text-xs ml-auto">
              <span className="material-symbols-outlined text-sm">person</span>
              <span className="truncate max-w-[100px]">{query.assignedToName}</span>
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

// ─── Post Query Modal (3-step) ─────────────────────────────────────────────

const MAX_RECIPIENTS = 15;

const ROLE_OPTIONS = [
  { value: 'SENIOR_STUDENT', label: 'Senior Students', icon: 'trending_up', color: 'text-purple-400', activeCls: 'border-purple-500/60 bg-purple-500/10 text-purple-300' },
  { value: 'ALUMNI',         label: 'Alumni',          icon: 'school',       color: 'text-emerald-400', activeCls: 'border-emerald-500/60 bg-emerald-500/10 text-emerald-300' },
  { value: 'MENTOR',         label: 'Mentors',         icon: 'star',         color: 'text-orange-400',  activeCls: 'border-orange-500/60 bg-orange-500/10 text-orange-300' },
];

const ROLE_BADGE_STYLE = {
  SENIOR_STUDENT: 'bg-purple-500/20 text-purple-300',
  ALUMNI:         'bg-emerald-500/20 text-emerald-300',
  MENTOR:         'bg-orange-500/20 text-orange-300',
};

const PostQueryModal = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ title: '', content: '', tags: '' });
  const [filters, setFilters] = useState({
    roles: [], college: '', company: '', industry: '', minReputation: '', limit: 10,
  });
  const [candidates, setCandidates] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [searching, setSearching] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const step1Valid = form.title.trim().length > 0 && form.content.trim().length > 0;

  const searchCandidates = async () => {
    setSearching(true);
    try {
      const res = await userService.searchQueryTargets({
        roles: filters.roles.length > 0 ? filters.roles : undefined,
        college: filters.college || undefined,
        company: filters.company || undefined,
        industry: filters.industry || undefined,
        minReputation: filters.minReputation ? parseInt(filters.minReputation) : undefined,
        limit: filters.limit,
      });
      setCandidates(res.data || []);
      setSelectedIds(new Set());
    } catch { setCandidates([]); }
    finally { setSearching(false); }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); }
      else if (next.size < MAX_RECIPIENTS) { next.add(id); }
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!step1Valid) { setError('Title and content are required.'); return; }
    setSubmitting(true); setError('');
    try {
      await queryService.createQuery({
        title: form.title.trim(), content: form.content.trim(), tags: form.tags.trim(),
        targetRoles: filters.roles.length > 0 ? filters.roles : undefined,
        assignedToIds: selectedIds.size > 0 ? [...selectedIds] : undefined,
        isPrivate: false,
      });
      onSuccess();
    } catch (err) { setError(err.message || 'Failed to post query.'); }
    finally { setSubmitting(false); }
  };

  const STEPS = [{ n: 1, label: 'Write' }, { n: 2, label: 'Target' }, { n: 3, label: 'Send' }];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0c1427] rounded-2xl w-full max-w-2xl border border-white/10 shadow-2xl flex flex-col max-h-[92vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 flex-shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-black text-[#dee5ff]">Post Query</h2>
            <div className="flex items-center gap-1">
              {STEPS.map((s, i) => (
                <React.Fragment key={s.n}>
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                    step === s.n ? 'bg-primary text-on-primary' : step > s.n ? 'bg-primary/20 text-primary' : 'bg-white/5 text-[#9baad6]'
                  }`}>
                    {step > s.n ? <span className="material-symbols-outlined text-[10px]">check</span> : <span>{s.n}</span>}
                    {s.label}
                  </div>
                  {i < STEPS.length - 1 && <div className={`w-4 h-px ${step > s.n ? 'bg-primary/40' : 'bg-white/10'}`} />}
                </React.Fragment>
              ))}
            </div>
          </div>
          <button onClick={onClose} className="text-[#9baad6] hover:text-[#dee5ff] transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}

          {/* Step 1: Write */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#9baad6] uppercase tracking-widest mb-2">Title *</label>
                <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="What's your question?"
                  className="w-full bg-[#060e1d] border border-white/10 rounded-xl px-4 py-3 text-[#dee5ff] placeholder-[#9baad6]/40 focus:border-primary/50 focus:outline-none transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#9baad6] uppercase tracking-widest mb-2">Content *</label>
                <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                  placeholder="Describe your question in detail. The more context you give, the better answers you'll get."
                  rows={5} className="w-full bg-[#060e1d] border border-white/10 rounded-xl px-4 py-3 text-[#dee5ff] placeholder-[#9baad6]/40 focus:border-primary/50 focus:outline-none transition-all resize-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#9baad6] uppercase tracking-widest mb-2">Tags</label>
                <input type="text" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                  placeholder="career, internship, resume  (comma-separated)"
                  className="w-full bg-[#060e1d] border border-white/10 rounded-xl px-4 py-3 text-[#dee5ff] placeholder-[#9baad6]/40 focus:border-primary/50 focus:outline-none transition-all" />
              </div>
            </div>
          )}

          {/* Step 2: Target filters */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-[#9baad6] uppercase tracking-widest mb-3">
                  Who should answer? <span className="text-[#9baad6]/50 normal-case tracking-normal font-normal">(optional — leave blank to post publicly)</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {ROLE_OPTIONS.map(r => {
                    const active = filters.roles.includes(r.value);
                    return (
                      <button key={r.value} type="button"
                        onClick={() => setFilters(f => ({ ...f, roles: active ? f.roles.filter(x => x !== r.value) : [...f.roles, r.value] }))}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${active ? r.activeCls : 'border-white/10 text-[#9baad6] hover:border-white/20'}`}>
                        <span className={`material-symbols-outlined text-2xl ${active ? r.color : ''}`}>{r.icon}</span>
                        <span className="text-xs font-bold">{r.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-[#9baad6] text-base">tune</span>
                  <label className="text-xs font-bold text-[#9baad6] uppercase tracking-widest">
                    Narrow down <span className="text-[#9baad6]/50 normal-case tracking-normal font-normal">(all optional)</span>
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: 'college',       label: 'College',        placeholder: 'e.g. IIT, MIT',    type: 'text' },
                    { key: 'company',       label: 'Company',        placeholder: 'e.g. Google, TCS', type: 'text' },
                    { key: 'industry',      label: 'Industry',       placeholder: 'e.g. Finance, Tech',type: 'text' },
                    { key: 'minReputation', label: 'Min Reputation', placeholder: 'e.g. 50',           type: 'number' },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-[10px] font-bold text-[#9baad6]/70 uppercase tracking-widest mb-1.5">{f.label}</label>
                      <input type={f.type} min={f.type === 'number' ? 0 : undefined}
                        value={filters[f.key]} onChange={e => setFilters(prev => ({ ...prev, [f.key]: e.target.value }))}
                        placeholder={f.placeholder}
                        className="w-full bg-[#060e1d] border border-white/10 rounded-xl px-3 py-2.5 text-[#dee5ff] placeholder-[#9baad6]/30 focus:border-primary/50 focus:outline-none text-sm transition-all" />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] font-bold text-[#9baad6]/70 uppercase tracking-widest">Max Recipients</label>
                  <span className="text-sm font-black text-primary">{filters.limit} <span className="text-[#9baad6]/50 font-normal text-[10px]">/ {MAX_RECIPIENTS}</span></span>
                </div>
                <input type="range" min="1" max={MAX_RECIPIENTS} value={filters.limit}
                  onChange={e => setFilters(f => ({ ...f, limit: parseInt(e.target.value) }))}
                  className="w-full accent-primary" />
                <div className="flex justify-between text-[10px] text-[#9baad6]/40 mt-1"><span>1</span><span>Max {MAX_RECIPIENTS}</span></div>
              </div>
            </div>
          )}

          {/* Step 3: Pick recipients */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#9baad6]">{searching ? 'Searching...' : `${candidates.length} people found`}</p>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold ${selectedIds.size >= MAX_RECIPIENTS ? 'text-yellow-400' : 'text-primary'}`}>
                    {selectedIds.size}/{MAX_RECIPIENTS} selected
                  </span>
                  {candidates.length > 0 && (
                    <div className="flex gap-2">
                      <button onClick={() => setSelectedIds(new Set(candidates.slice(0, MAX_RECIPIENTS).map(u => u.id)))}
                        className="text-[10px] font-bold text-primary hover:underline">Select all</button>
                      <span className="text-[#9baad6]/30">·</span>
                      <button onClick={() => setSelectedIds(new Set())} className="text-[10px] font-bold text-[#9baad6] hover:underline">Clear</button>
                    </div>
                  )}
                </div>
              </div>

              {searching ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
              ) : candidates.length === 0 ? (
                <div className="text-center py-12 bg-[#060e1d] rounded-2xl border border-white/5">
                  <span className="material-symbols-outlined text-[#9baad6] text-4xl mb-3 block">search_off</span>
                  <p className="text-[#dee5ff] font-bold mb-1">No matches found</p>
                  <p className="text-[#9baad6] text-sm">Try adjusting your filters</p>
                  <button onClick={() => setStep(2)} className="mt-4 text-primary text-sm font-bold hover:underline">← Back to filters</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {candidates.map(u => {
                    const selected = selectedIds.has(u.id);
                    const disabled = !selected && selectedIds.size >= MAX_RECIPIENTS;
                    return (
                      <button key={u.id} type="button" onClick={() => !disabled && toggleSelect(u.id)}
                        className={`relative text-left p-4 rounded-xl border-2 transition-all ${
                          selected ? 'border-primary bg-primary/10' :
                          disabled ? 'border-white/5 bg-[#060e1d]/50 opacity-40 cursor-not-allowed' :
                          'border-white/10 bg-[#060e1d] hover:border-white/25 cursor-pointer'
                        }`}>
                        <div className={`absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selected ? 'bg-primary border-primary' : 'border-white/20'}`}>
                          {selected && <span className="material-symbols-outlined text-on-primary text-[12px]">check</span>}
                        </div>
                        <div className="flex items-center gap-3 pr-6">
                          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0 overflow-hidden">
                            {u.profilePicture ? <img src={u.profilePicture} alt={u.fullName} className="w-full h-full object-cover" /> : getInitials(u.fullName)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[#dee5ff] font-bold text-sm truncate">{u.fullName}</p>
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${ROLE_BADGE_STYLE[u.userRole] || 'bg-gray-500/20 text-gray-300'}`}>
                              {u.userRole?.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 space-y-0.5">
                          {u.currentCompany && <p className="text-[#9baad6] text-xs flex items-center gap-1 truncate"><span className="material-symbols-outlined text-[11px]">business</span>{u.currentPosition ? `${u.currentPosition} @ ` : ''}{u.currentCompany}</p>}
                          {u.college && <p className="text-[#9baad6] text-xs flex items-center gap-1 truncate"><span className="material-symbols-outlined text-[11px]">school</span>{u.college}</p>}
                          {u.reputationPoints > 0 && <p className="text-primary text-xs font-bold">⭐ {u.reputationPoints} pts</p>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
              {selectedIds.size >= MAX_RECIPIENTS && (
                <p className="text-yellow-400 text-xs text-center font-bold">Maximum {MAX_RECIPIENTS} recipients reached</p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/5 flex-shrink-0">
          {step === 1 && (
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 py-3 rounded-xl bg-white/5 text-[#9baad6] font-bold hover:bg-white/10 transition-all">Cancel</button>
              <button onClick={() => { setError(''); setStep(2); }} disabled={!step1Valid}
                className="flex-[2] py-3 rounded-xl bg-primary text-on-primary font-bold hover:bg-primary/90 disabled:opacity-40 transition-all flex items-center justify-center gap-2">
                Next: Target Audience <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          )}
          {step === 2 && (
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl bg-white/5 text-[#9baad6] font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm">arrow_back</span>Back
              </button>
              <button onClick={async () => { setError(''); setStep(3); await searchCandidates(); }}
                className="flex-1 py-3 rounded-xl bg-white/10 text-[#dee5ff] font-bold hover:bg-white/15 transition-all flex items-center justify-center gap-2">
                Find People <span className="material-symbols-outlined text-sm">search</span>
              </button>
              <button onClick={handleSubmit} disabled={submitting}
                className="flex-1 py-3 rounded-xl bg-primary text-on-primary font-bold hover:bg-primary/90 disabled:opacity-40 transition-all">
                {submitting ? 'Posting...' : 'Post Publicly'}
              </button>
            </div>
          )}
          {step === 3 && (
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-xl bg-white/5 text-[#9baad6] font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm">arrow_back</span>Back
              </button>
              <button onClick={handleSubmit} disabled={submitting}
                className="flex-[2] py-3 rounded-xl bg-primary text-on-primary font-bold hover:bg-primary/90 disabled:opacity-40 transition-all flex items-center justify-center gap-2">
                {submitting ? (
                  <><div className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />Posting...</>
                ) : (
                  <><span className="material-symbols-outlined text-sm">send</span>
                  {selectedIds.size > 0 ? `Send to ${selectedIds.size} person${selectedIds.size > 1 ? 's' : ''}` : 'Post Publicly'}</>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


// ─── Main QueryFeed Component ────────────────────────────────────────────────

const QueryFeed = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('all');
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTag, setActiveTag] = useState('');
  const [allTags, setAllTags] = useState([]);
  const [showPostModal, setShowPostModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

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
      if (activeTab === 'all' && !activeTag) {
        const tagSet = new Set();
        data.forEach((q) => { if (q.tags) q.tags.split(',').forEach((t) => tagSet.add(t.trim())); });
        setAllTags([...tagSet].filter(Boolean).slice(0, 20));
      }
    } catch (err) {
      setError(err.message || 'Failed to load queries.');
    } finally {
      setLoading(false);
    }
  }, [activeTab, activeTag]);

  useEffect(() => { fetchQueries(); }, [fetchQueries]);

  const handleUpvote = async (queryId) => {
    try {
      const res = await queryService.upvoteQuery(queryId);
      setQueries(prev => prev.map(q => q.id === queryId ? { ...q, upvoteCount: res.data?.upvoteCount, hasUpvoted: res.data?.hasUpvoted } : q));
    } catch { /* ignore */ }
  };

  const handleModalSuccess = () => {
    setShowPostModal(false);
    setSuccessMsg('Query posted successfully!');
    setTimeout(() => setSuccessMsg(''), 4000);
    fetchQueries();
  };

  // Client-side search filter
  const filteredQueries = searchQuery.trim()
    ? queries.filter(q => {
        const s = searchQuery.toLowerCase();
        return q.title?.toLowerCase().includes(s) ||
               q.content?.toLowerCase().includes(s) ||
               q.tags?.toLowerCase().includes(s) ||
               q.studentName?.toLowerCase().includes(s);
      })
    : queries;

  const TABS = [
    { value: 'all',       label: 'All',        icon: 'dynamic_feed' },
    { value: 'popular',   label: 'Trending',   icon: 'local_fire_department' },
    { value: 'unresolved',label: 'Unanswered', icon: 'help_outline' },
    { value: 'mine',      label: 'Mine',       icon: 'person' },
    { value: 'alumni',    label: 'Alumni',     icon: 'school' },
    { value: 'senior',    label: 'Seniors',    icon: 'trending_up' },
    { value: 'mentor',    label: 'Mentors',    icon: 'star' },
  ];

  const emptyConfig = {
    mine:       { icon: 'assignment', title: 'No queries yet', sub: 'Post your first question to get started.' },
    unresolved: { icon: 'check_circle', title: 'All caught up!', sub: 'Every question has been answered.' },
    popular:    { icon: 'local_fire_department', title: 'Nothing trending yet', sub: 'Be the first to ask a popular question.' },
    default:    { icon: 'forum', title: 'No queries found', sub: 'Try a different filter or be the first to ask.' },
  };
  const ec = emptyConfig[activeTab] || emptyConfig.default;

  return (
    <div className="min-h-screen bg-[#060e1d]">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 space-y-6">

        {/* ── Header ── */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#dee5ff] tracking-tight">Query Feed</h1>
            <p className="text-[#9baad6] text-sm mt-0.5">Get answers from seniors, alumni & mentors</p>
          </div>
          <button
            onClick={() => setShowPostModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-xl font-bold text-sm hover:bg-primary/90 active:scale-95 transition-all shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined text-sm">edit</span>
            Ask a Question
          </button>
        </div>

        {/* ── Search bar ── */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#9baad6] text-lg">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search questions, topics, tags..."
            className="w-full bg-[#0c1427]/80 border border-white/8 rounded-2xl pl-11 pr-4 py-3 text-[#dee5ff] placeholder-[#9baad6]/40 focus:border-primary/40 focus:outline-none focus:bg-[#0c1427] transition-all text-sm"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9baad6] hover:text-[#dee5ff] transition-colors">
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          )}
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => { setActiveTab(tab.value); setActiveTag(''); setSearchQuery(''); }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-semibold text-xs whitespace-nowrap transition-all flex-shrink-0 ${
                activeTab === tab.value
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-[#9baad6] hover:text-[#dee5ff] hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined text-sm">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Tag chips (all tab only) ── */}
        {activeTab === 'all' && !searchQuery && allTags.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? '' : tag)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all border ${
                  activeTag === tag
                    ? 'bg-primary/20 text-primary border-primary/40'
                    : 'bg-transparent text-[#9baad6] border-white/10 hover:border-white/20 hover:text-[#dee5ff]'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        {/* ── Alerts ── */}
        {successMsg && (
          <div className="p-3.5 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            {successMsg}
          </div>
        )}
        {error && (
          <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">error</span>
            {error}
            <button onClick={fetchQueries} className="ml-auto text-xs font-bold underline">Retry</button>
          </div>
        )}

        {/* ── Search result count ── */}
        {searchQuery && !loading && (
          <p className="text-[#9baad6] text-sm">
            {filteredQueries.length} result{filteredQueries.length !== 1 ? 's' : ''} for "<span className="text-[#dee5ff]">{searchQuery}</span>"
          </p>
        )}

        {/* ── Content ── */}
        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="bg-[#0c1427]/80 rounded-2xl p-5 border border-white/5 animate-pulse">
                <div className="flex gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-white/5" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-white/5 rounded w-1/3" />
                    <div className="h-3 bg-white/5 rounded w-1/4" />
                  </div>
                </div>
                <div className="h-4 bg-white/5 rounded w-3/4 mb-2" />
                <div className="h-3 bg-white/5 rounded w-full mb-1" />
                <div className="h-3 bg-white/5 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : filteredQueries.length === 0 ? (
          <div className="bg-[#0c1427]/80 rounded-2xl p-14 border border-white/5 text-center">
            <span className="material-symbols-outlined text-[#9baad6]/40 text-6xl mb-4 block">{ec.icon}</span>
            <p className="text-[#dee5ff] font-bold text-lg mb-2">{ec.title}</p>
            <p className="text-[#9baad6] text-sm mb-6">{ec.sub}</p>
            {(activeTab === 'mine' || activeTab === 'all') && (
              <button
                onClick={() => setShowPostModal(true)}
                className="px-6 py-2.5 bg-primary/15 text-primary rounded-xl font-bold text-sm hover:bg-primary/25 transition-all border border-primary/20"
              >
                Ask a Question
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredQueries.map((query) => (
              <QueryCard key={query.id} query={query} onUpvote={handleUpvote} />
            ))}
          </div>
        )}

        {/* ── Post Query Modal ── */}
        {showPostModal && (
          <PostQueryModal onClose={() => setShowPostModal(false)} onSuccess={handleModalSuccess} />
        )}
      </div>
    </div>
  );
};

export default QueryFeed;
