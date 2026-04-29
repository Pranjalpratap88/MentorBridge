import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import resumeService from '../services/resumeService';

const REVIEWER_ROLES = ['SENIOR_STUDENT', 'ALUMNI', 'MENTOR'];

const roleColors = {
  STUDENT: 'bg-blue-500/20 text-blue-300',
  SENIOR_STUDENT: 'bg-purple-500/20 text-purple-300',
  ALUMNI: 'bg-emerald-500/20 text-emerald-300',
  MENTOR: 'bg-orange-500/20 text-orange-300',
};

const roleLabels = {
  STUDENT: 'Student',
  SENIOR_STUDENT: 'Senior Student',
  ALUMNI: 'Alumni',
  MENTOR: 'Mentor',
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
};

const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

// ─── Star Rating Display ──────────────────────────────────────────────────────
const StarDisplay = ({ rating, size = 'base' }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map(s => (
      <span
        key={s}
        className={`material-symbols-outlined text-${size} ${s <= rating ? 'text-yellow-400' : 'text-white/10'}`}
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        star
      </span>
    ))}
  </div>
);

// ─── Star Rating Selector ─────────────────────────────────────────────────────
const StarSelector = ({ value, onChange }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map(s => (
      <button
        key={s}
        type="button"
        onClick={() => onChange(s)}
        className="transition-transform hover:scale-110"
      >
        <span
          className={`material-symbols-outlined text-2xl ${s <= value ? 'text-yellow-400' : 'text-white/20 hover:text-yellow-400/50'}`}
          style={{ fontVariationSettings: s <= value ? "'FILL' 1" : "'FILL' 0" }}
        >
          star
        </span>
      </button>
    ))}
    {value > 0 && (
      <span className="text-[#9baad6] text-sm ml-2">{value}/5</span>
    )}
  </div>
);

// ─── Expandable Section ───────────────────────────────────────────────────────
const ExpandableSection = ({ title, icon, content, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  if (!content) return null;
  return (
    <div className="border border-white/5 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/5 transition-all"
      >
        <span className="flex items-center gap-2 text-[#9baad6] text-sm font-bold">
          <span className="material-symbols-outlined text-sm">{icon}</span>
          {title}
        </span>
        <span className={`material-symbols-outlined text-[#9baad6] text-sm transition-transform ${open ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>
      {open && (
        <div className="px-4 pb-4 pt-1">
          <p className="text-[#9baad6] text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        </div>
      )}
    </div>
  );
};

// ─── Comment Thread ───────────────────────────────────────────────────────────
const CommentThread = ({ review, canComment, onCommentAdded }) => {
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      await resumeService.addComment(review.id, text.trim());
      setText('');
      onCommentAdded();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
      {review.comments && review.comments.length > 0 ? (
        <div className="space-y-3">
          {review.comments.map(comment => {
            const rc = roleColors[comment.authorRole] || 'bg-gray-500/20 text-gray-400';
            return (
              <div key={comment.id} className="flex gap-3">
                <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold text-xs flex-shrink-0 overflow-hidden">
                  {comment.authorProfilePicture ? (
                    <img src={comment.authorProfilePicture} alt={comment.authorName} className="w-full h-full object-cover" />
                  ) : getInitials(comment.authorName)}
                </div>
                <div className="flex-1 bg-white/5 rounded-xl px-3 py-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[#dee5ff] text-xs font-bold">{comment.authorName}</span>
                    <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${rc}`}>
                      {roleLabels[comment.authorRole] || comment.authorRole}
                    </span>
                    <span className="text-[#9baad6] text-xs ml-auto">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="text-[#9baad6] text-xs leading-relaxed">{comment.content}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-[#9baad6] text-xs">No comments yet.</p>
      )}

      {canComment && (
        <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
          <input
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 bg-[#060e1d] border border-white/10 rounded-xl px-3 py-2 text-[#dee5ff] placeholder-[#9baad6]/40 focus:border-primary/50 focus:outline-none transition-all text-xs"
          />
          <button
            type="submit"
            disabled={submitting || !text.trim()}
            className="px-4 py-2 bg-primary text-on-primary rounded-xl text-xs font-bold hover:bg-primary/90 disabled:opacity-50 transition-all"
          >
            {submitting ? '...' : 'Post'}
          </button>
        </form>
      )}
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
};

// ─── Review Card ──────────────────────────────────────────────────────────────
const ReviewCard = ({ review, canComment, onRefresh }) => {
  const rc = roleColors[review.reviewerRole] || 'bg-gray-500/20 text-gray-400';

  return (
    <div className="bg-[#0c1427]/80 rounded-2xl p-6 border border-white/5 space-y-4">
      {/* Reviewer header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold text-sm overflow-hidden flex-shrink-0">
            {review.reviewerProfilePicture ? (
              <img src={review.reviewerProfilePicture} alt={review.reviewerName} className="w-full h-full object-cover" />
            ) : getInitials(review.reviewerName)}
          </div>
          <div>
            <p className="text-[#dee5ff] font-bold text-sm">{review.reviewerName}</p>
            <div className="flex items-center gap-2 flex-wrap mt-0.5">
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${rc}`}>
                {roleLabels[review.reviewerRole] || review.reviewerRole}
              </span>
              {review.reviewerCompany && (
                <span className="text-[#9baad6] text-xs">{review.reviewerCompany}</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <StarDisplay rating={review.rating} />
          <span className="text-[#9baad6] text-xs">{formatDate(review.createdAt)}</span>
        </div>
      </div>

      {/* Overall feedback */}
      <div>
        <p className="text-[#9baad6] text-xs font-bold uppercase tracking-wider mb-2">Overall Feedback</p>
        <p className="text-[#dee5ff] text-sm leading-relaxed whitespace-pre-wrap">{review.overallFeedback}</p>
      </div>

      {/* Expandable sections */}
      <div className="space-y-2">
        <ExpandableSection
          title="Strengths"
          icon="thumb_up"
          content={review.strengthsFeedback}
          defaultOpen={!!review.strengthsFeedback}
        />
        <ExpandableSection
          title="Areas to Improve"
          icon="trending_up"
          content={review.improvementsFeedback}
        />
        <ExpandableSection
          title="Formatting"
          icon="format_paint"
          content={review.formattingFeedback}
        />
        <ExpandableSection
          title="Content"
          icon="article"
          content={review.contentFeedback}
        />
      </div>

      {/* Comments */}
      <CommentThread review={review} canComment={canComment} onCommentAdded={onRefresh} />
    </div>
  );
};

// ─── Write Review Form ────────────────────────────────────────────────────────
const WriteReviewForm = ({ resumeId, onSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [overallFeedback, setOverallFeedback] = useState('');
  const [strengthsFeedback, setStrengthsFeedback] = useState('');
  const [improvementsFeedback, setImprovementsFeedback] = useState('');
  const [formattingFeedback, setFormattingFeedback] = useState('');
  const [contentFeedback, setContentFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!overallFeedback.trim()) { setError('Overall feedback is required'); return; }
    if (rating === 0) { setError('Please select a star rating'); return; }
    setSubmitting(true);
    setError('');
    try {
      await resumeService.submitReview(resumeId, {
        overallFeedback: overallFeedback.trim(),
        strengthsFeedback: strengthsFeedback.trim() || null,
        improvementsFeedback: improvementsFeedback.trim() || null,
        formattingFeedback: formattingFeedback.trim() || null,
        contentFeedback: contentFeedback.trim() || null,
        rating,
      });
      onSubmitted();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const textareaClass =
    'w-full bg-[#060e1d] border border-white/10 rounded-xl px-4 py-3 text-[#dee5ff] placeholder-[#9baad6]/40 focus:border-primary/50 focus:outline-none transition-all resize-none text-sm';

  return (
    <div className="bg-[#0c1427]/80 rounded-2xl p-6 border border-white/5">
      <h3 className="text-[#dee5ff] font-black text-lg mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">edit</span>
        Write a Review
      </h3>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Rating */}
        <div>
          <label className="block text-sm font-bold text-[#9baad6] mb-2">
            Rating <span className="text-red-400">*</span>
          </label>
          <StarSelector value={rating} onChange={setRating} />
        </div>

        {/* Overall feedback */}
        <div>
          <label className="block text-sm font-bold text-[#9baad6] mb-2">
            Overall Feedback <span className="text-red-400">*</span>
          </label>
          <textarea
            value={overallFeedback}
            onChange={e => setOverallFeedback(e.target.value)}
            placeholder="Share your overall impression of this resume..."
            rows={4}
            className={textareaClass}
          />
        </div>

        {/* Strengths */}
        <div>
          <label className="block text-sm font-bold text-[#9baad6] mb-2">Strengths</label>
          <textarea
            value={strengthsFeedback}
            onChange={e => setStrengthsFeedback(e.target.value)}
            placeholder="What does this resume do well?"
            rows={3}
            className={textareaClass}
          />
        </div>

        {/* Areas to improve */}
        <div>
          <label className="block text-sm font-bold text-[#9baad6] mb-2">Areas to Improve</label>
          <textarea
            value={improvementsFeedback}
            onChange={e => setImprovementsFeedback(e.target.value)}
            placeholder="What could be improved?"
            rows={3}
            className={textareaClass}
          />
        </div>

        {/* Formatting */}
        <div>
          <label className="block text-sm font-bold text-[#9baad6] mb-2">Formatting Feedback</label>
          <textarea
            value={formattingFeedback}
            onChange={e => setFormattingFeedback(e.target.value)}
            placeholder="Comments on layout, spacing, fonts, visual hierarchy..."
            rows={3}
            className={textareaClass}
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-bold text-[#9baad6] mb-2">Content Feedback</label>
          <textarea
            value={contentFeedback}
            onChange={e => setContentFeedback(e.target.value)}
            placeholder="Comments on bullet points, achievements, keywords, relevance..."
            rows={3}
            className={textareaClass}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-primary text-on-primary rounded-xl font-bold hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <div className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-sm">send</span>
              Submit Review
            </>
          )}
        </button>
      </form>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const ResumeReview = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [resume, setResume] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pdfError, setPdfError] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [blobUrl, setBlobUrl] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  const fetchResume = useCallback(async () => {
    try {
      const res = await resumeService.getById(id);
      setResume(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Resume not found');
    }
  }, [id]);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await resumeService.getReviews(id);
      setReviews(res.data || []);
    } catch (err) {
      console.error('Failed to load reviews', err);
    }
  }, [id]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchResume(), fetchReviews()]);
      setLoading(false);
    };
    load();
  }, [fetchResume, fetchReviews]);

  const handleRefresh = useCallback(() => {
    fetchResume();
    fetchReviews();
  }, [fetchResume, fetchReviews]);

  // Load PDF as blob (with JWT) once resume is confirmed accessible
  useEffect(() => {
    if (!resume) return;
    setPdfLoading(true);
    setPdfError(false);
    resumeService.getPdfBlobUrl(id)
      .then(url => { setBlobUrl(url); setPdfLoading(false); })
      .catch(() => { setPdfError(true); setPdfLoading(false); });
    // Revoke old blob URL on cleanup
    return () => { if (blobUrl) URL.revokeObjectURL(blobUrl); };
  }, [resume, id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleReviewSubmitted = async () => {
    setReviewSuccess('Review submitted successfully!');
    await handleRefresh();
    setTimeout(() => setReviewSuccess(''), 4000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="px-8 py-10 max-w-4xl mx-auto text-center space-y-4">
        <span className="material-symbols-outlined text-[#9baad6] text-5xl block">error_outline</span>
        <p className="text-[#dee5ff] font-bold text-lg">{error || 'Resume not found'}</p>
        <button
          onClick={() => navigate(-1)}
          className="text-primary hover:underline text-sm"
        >
          ← Go back
        </button>
      </div>
    );
  }

  const isOwner = user && resume.ownerId === user.id;
  const canReview = user && !isOwner && REVIEWER_ROLES.includes(user.userRole);
  const hasAlreadyReviewed = reviews.some(r => r.reviewerId === user?.id);
  const ownerRc = roleColors[resume.ownerRole] || 'bg-gray-500/20 text-gray-400';

  const handleDownload = () => {
    if (!blobUrl) return;
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = resume.originalFileName || 'resume.pdf';
    a.click();
  };

  return (
    <div className="px-4 md:px-8 py-10 max-w-7xl mx-auto space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[#9baad6] hover:text-primary transition-colors text-sm font-medium"
      >
        <span className="material-symbols-outlined text-lg">arrow_back</span>
        Back
      </button>

      {reviewSuccess && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm">
          {reviewSuccess}
        </div>
      )}

      {/* Resume info header */}
      <div className="bg-[#0c1427]/80 rounded-2xl p-6 border border-white/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden flex-shrink-0">
              {resume.ownerProfilePicture ? (
                <img src={resume.ownerProfilePicture} alt={resume.ownerName} className="w-full h-full object-cover" />
              ) : getInitials(resume.ownerName)}
            </div>
            <div>
              <h1 className="text-2xl font-black text-[#dee5ff] leading-tight">
                {resume.title || resume.originalFileName}
              </h1>
              <div className="flex items-center gap-2 flex-wrap mt-1">
                <span className="text-[#9baad6] text-sm">{resume.ownerName}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${ownerRc}`}>
                  {roleLabels[resume.ownerRole] || resume.ownerRole}
                </span>
                {resume.ownerCollege && (
                  <span className="text-[#9baad6] text-xs flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">school</span>
                    {resume.ownerCollege}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-[#9baad6] flex-shrink-0">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">calendar_today</span>
              {formatDate(resume.uploadedAt)}
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">rate_review</span>
              {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
            </span>
          </div>
        </div>

        {resume.reviewNote && (
          <div className="mt-4 p-3 bg-primary/5 border border-primary/10 rounded-xl">
            <p className="text-[#9baad6] text-sm italic">
              <span className="font-bold text-primary not-italic">Note from owner: </span>
              {resume.reviewNote}
            </p>
          </div>
        )}
      </div>

      {/* Two-column layout: PDF + Reviews */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* PDF Viewer */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-[#dee5ff]">Resume PDF</h2>
            <button
              onClick={handleDownload}
              disabled={!blobUrl}
              className="flex items-center gap-1.5 px-4 py-2 bg-primary/10 text-primary rounded-xl text-sm font-bold hover:bg-primary/20 disabled:opacity-50 transition-all"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              Download
            </button>
          </div>

          <div className="bg-[#0c1427]/80 rounded-2xl border border-white/5 overflow-hidden">
            {pdfLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                <p className="text-[#9baad6] text-sm">Loading PDF...</p>
              </div>
            ) : pdfError ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <span className="material-symbols-outlined text-[#9baad6] text-5xl">picture_as_pdf</span>
                <p className="text-[#9baad6] text-sm">Unable to preview PDF in browser.</p>
                <button
                  onClick={handleDownload}
                  disabled={!blobUrl}
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-bold hover:bg-primary/90 disabled:opacity-50 transition-all"
                >
                  <span className="material-symbols-outlined text-sm">download</span>
                  Download PDF
                </button>
              </div>
            ) : (
              <iframe
                src={blobUrl}
                title="Resume PDF"
                className="w-full"
                style={{ height: '75vh', minHeight: '500px' }}
                onError={() => setPdfError(true)}
              />
            )}
          </div>
        </div>

        {/* Reviews + Write Review */}
        <div className="space-y-6">
          {/* Reviews list */}
          <div>
            <h2 className="text-lg font-black text-[#dee5ff] mb-4">
              Reviews
              <span className="ml-2 text-sm font-normal text-[#9baad6]">({reviews.length})</span>
            </h2>

            {reviews.length === 0 ? (
              <div className="bg-[#0c1427]/80 rounded-2xl p-10 border border-white/5 text-center">
                <span className="material-symbols-outlined text-[#9baad6] text-4xl mb-3 block">rate_review</span>
                <p className="text-[#dee5ff] font-bold mb-1">No reviews yet</p>
                <p className="text-[#9baad6] text-sm">
                  {canReview ? 'Be the first to review this resume!' : 'Check back later for feedback.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map(review => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    canComment={isOwner || review.reviewerId === user?.id}
                    onRefresh={handleRefresh}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Write review form */}
          {canReview && !hasAlreadyReviewed && (
            <WriteReviewForm resumeId={id} onSubmitted={handleReviewSubmitted} />
          )}

          {canReview && hasAlreadyReviewed && (
            <div className="bg-[#0c1427]/80 rounded-2xl p-6 border border-white/5 text-center">
              <span className="material-symbols-outlined text-green-400 text-3xl mb-2 block">check_circle</span>
              <p className="text-[#dee5ff] font-bold text-sm">You've already reviewed this resume</p>
              <p className="text-[#9baad6] text-xs mt-1">Thank you for your contribution!</p>
            </div>
          )}

          {!user && (
            <div className="bg-[#0c1427]/80 rounded-2xl p-6 border border-white/5 text-center">
              <p className="text-[#9baad6] text-sm">Sign in to write a review</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeReview;
