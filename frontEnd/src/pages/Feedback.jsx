import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import feedbackService from '../services/feedbackService';

// ─── Constants ──────────────────────────────────────────────────────────────

const CATEGORIES = [
  { value: 'GENERAL', label: 'General Feedback', icon: 'feedback' },
  { value: 'BUG_REPORT', label: 'Bug Report', icon: 'bug_report' },
  { value: 'FEATURE_REQUEST', label: 'Feature Request', icon: 'lightbulb' },
  { value: 'UI_UX', label: 'UI/UX Improvement', icon: 'palette' },
  { value: 'PERFORMANCE', label: 'Performance Issue', icon: 'speed' },
  { value: 'CONTENT', label: 'Content Suggestion', icon: 'article' },
  { value: 'OTHER', label: 'Other', icon: 'more_horiz' },
];

const CATEGORY_COLORS = {
  GENERAL: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  BUG_REPORT: 'bg-red-500/20 text-red-300 border-red-500/30',
  FEATURE_REQUEST: 'bg-green-500/20 text-green-300 border-green-500/30',
  UI_UX: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  PERFORMANCE: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  CONTENT: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  OTHER: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
};

// ─── Spinner ────────────────────────────────────────────────────────────────

const Spinner = () => (
  <div className="flex items-center justify-center py-16">
    <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
  </div>
);

// ─── Star Rating Component ──────────────────────────────────────────────────

const StarRating = ({ rating, setRating, readonly = false, size = 'text-2xl' }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && setRating && setRating(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          className={`${readonly ? 'cursor-default' : 'cursor-pointer'} transition-transform ${
            !readonly && 'hover:scale-110'
          }`}
        >
          <span
            className={`material-symbols-outlined ${size} ${
              (hover || rating) >= star ? 'text-yellow-400' : 'text-gray-500'
            } transition-colors`}
          >
            {(hover || rating) >= star ? 'star' : 'star_outline'}
          </span>
        </button>
      ))}
    </div>
  );
};

// ─── Feedback Form ──────────────────────────────────────────────────────────

const FeedbackForm = ({ onSubmit, onCancel, initialData = null }) => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: initialData?.name || user?.fullName || '',
    email: initialData?.email || user?.email || '',
    message: initialData?.message || '',
    rating: initialData?.rating || 0,
    category: initialData?.category || 'GENERAL',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.message.trim()) {
      setError('Please provide your feedback message.');
      return;
    }
    if (form.rating === 0) {
      setError('Please select a rating.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err.message || 'Failed to submit feedback.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Rating */}
      <div>
        <label className="block text-xs font-bold text-[#9baad6] uppercase tracking-widest mb-3">
          How would you rate your experience? *
        </label>
        <div className="flex items-center gap-4">
          <StarRating rating={form.rating} setRating={(r) => setForm((f) => ({ ...f, rating: r }))} />
          <span className="text-[#dee5ff] font-bold text-lg">
            {form.rating > 0 ? `${form.rating}/5` : 'Select rating'}
          </span>
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs font-bold text-[#9baad6] uppercase tracking-widest mb-3">
          Feedback Category
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setForm((f) => ({ ...f, category: cat.value }))}
              className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-bold transition-all ${
                form.category === cat.value
                  ? 'border-primary bg-primary/10 text-[#dee5ff]'
                  : 'border-white/10 text-[#9baad6] hover:border-white/20'
              }`}
            >
              <span className="material-symbols-outlined text-base">{cat.icon}</span>
              <span className="truncate">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Name & Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-[#9baad6] uppercase tracking-widest mb-2">
            Your Name
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="John Doe"
            className="w-full bg-[#060e1d] border border-white/10 rounded-xl px-4 py-3 text-[#dee5ff] placeholder-[#9baad6]/40 focus:border-primary/50 focus:outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#9baad6] uppercase tracking-widest mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="john@example.com"
            className="w-full bg-[#060e1d] border border-white/10 rounded-xl px-4 py-3 text-[#dee5ff] placeholder-[#9baad6]/40 focus:border-primary/50 focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Message */}
      <div>
        <label className="block text-xs font-bold text-[#9baad6] uppercase tracking-widest mb-2">
          Your Feedback *
        </label>
        <textarea
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          placeholder="Tell us what you think about MentorBridge. What can we improve? What features would you like to see?"
          rows={5}
          className="w-full bg-[#060e1d] border border-white/10 rounded-xl px-4 py-3 text-[#dee5ff] placeholder-[#9baad6]/40 focus:border-primary/50 focus:outline-none transition-all resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl bg-white/5 text-[#9baad6] font-bold hover:bg-white/10 transition-all"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 py-3 rounded-xl bg-primary text-on-primary font-bold hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <div className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-sm">send</span>
              Submit Feedback
            </>
          )}
        </button>
      </div>
    </form>
  );
};

// ─── Feedback Card ──────────────────────────────────────────────────────────

const FeedbackCard = ({ feedback, showAdmin = false }) => {
  const cat = feedback.category || 'OTHER';
  const categoryStyle = CATEGORY_COLORS[cat] || CATEGORY_COLORS.OTHER;

  return (
    <div className="bg-[#0c1427]/80 rounded-2xl p-6 border border-white/5 hover:border-primary/20 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
            {feedback.name?.charAt(0).toUpperCase() || '?'}
          </div>
          <div>
            <p className="text-[#dee5ff] font-bold text-sm">{feedback.name || 'Anonymous'}</p>
            <p className="text-[#9baad6] text-xs">{feedback.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${categoryStyle}`}>
              {cat.replace(/_/g, ' ')}
            </span>
          {feedback.isReviewed && (
            <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-green-500/20 text-green-300 border border-green-500/30">
              Reviewed
            </span>
          )}
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2 mb-3">
        <StarRating rating={feedback.rating} readonly size="text-base" />
        <span className="text-[#9baad6] text-xs">
          {new Date(feedback.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
      </div>

      {/* Message */}
      <p className="text-[#dee5ff] text-sm leading-relaxed mb-4">{feedback.message}</p>

      {/* Admin Response — visible to the user who submitted */}
      {feedback.adminResponse && (
        <div className="mt-2 p-4 bg-primary/5 border border-primary/20 rounded-xl">
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
            Response from MentorBridge Team
            {feedback.respondedAt && (
              <span className="text-[#9baad6] font-normal normal-case tracking-normal ml-1">
                · {new Date(feedback.respondedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            )}
          </p>
          <p className="text-[#dee5ff] text-sm leading-relaxed">{feedback.adminResponse}</p>
        </div>
      )}
    </div>
  );
};

// ─── Main Feedback Page ─────────────────────────────────────────────────────

const Feedback = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('submit');
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Check if user is admin
  const isAdmin = user?.roles?.includes('ADMIN') || user?.userRole === 'ADMIN';

  const fetchMyFeedback = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await feedbackService.getMyFeedback();
      setFeedbackList(res.data || []);
    } catch (err) {
      // Don't show error for empty feedback list — just show empty state
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        setError('Please log in to view your feedback.');
      } else if (status !== 404) {
        setError('Failed to load your feedback. Please try again.');
      }
      setFeedbackList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'my') {
      setError('');
      setFeedbackList([]);
      fetchMyFeedback();
    } else {
      setError('');
    }
  }, [activeTab]);

  const handleSubmit = async (formData) => {
    await feedbackService.submitFeedback(formData);
    setSuccessMsg('Thank you for your valuable feedback! We appreciate your input.');
    setTimeout(() => setSuccessMsg(''), 5000);
    // Refresh my feedback list
    if (activeTab === 'my') {
      fetchMyFeedback();
    }
  };

  const TABS = [
    { value: 'submit', label: 'Submit Feedback', icon: 'rate_review' },
    { value: 'my', label: 'My Feedback', icon: 'history' },
  ];

  return (
    <div className="px-6 py-10 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-black text-[#dee5ff] tracking-tight mb-2">
          We Value Your Feedback
        </h1>
        <p className="text-[#9baad6] text-sm max-w-xl mx-auto">
          Help us improve MentorBridge! Your feedback is crucial in shaping the future of our platform.
          Share your thoughts, report bugs, or suggest new features.
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-2xl p-6 border border-primary/20">
        <div className="flex items-center justify-center gap-3">
          <span className="material-symbols-outlined text-primary text-3xl">feedback</span>
          <div className="text-center">
            <p className="text-[#dee5ff] font-bold">Your feedback helps us improve!</p>
            <p className="text-[#9baad6] text-xs">We read every piece of feedback and use it to make MentorBridge better.</p>
          </div>
        </div>
      </div>

      {/* Success Message */}
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
      <div className="flex gap-2 justify-center">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
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

      {/* Content */}
      {activeTab === 'submit' ? (
        <div className="bg-[#0c1427]/80 rounded-2xl p-8 border border-white/5">
          <FeedbackForm onSubmit={handleSubmit} />
        </div>
      ) : loading ? (
        <Spinner />
      ) : feedbackList.length === 0 ? (
        <div className="bg-[#0c1427]/80 rounded-2xl p-12 border border-white/5 text-center">
          <span className="material-symbols-outlined text-[#9baad6] text-5xl mb-4 block">
            rate_review
          </span>
          <p className="text-[#dee5ff] font-bold text-lg mb-2">No feedback submitted yet</p>
          <p className="text-[#9baad6] text-sm">Share your thoughts with us!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {feedbackList.map((feedback) => (
            <FeedbackCard key={feedback.id} feedback={feedback} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Feedback;
