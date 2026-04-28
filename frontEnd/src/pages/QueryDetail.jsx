import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import queryService from '../services/queryService';
import userService from '../services/userService';

const QueryDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [query, setQuery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [responseText, setResponseText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Resend flow
  const [showResendModal, setShowResendModal] = useState(false);
  const [experts, setExperts] = useState([]);
  const [selectedExpert, setSelectedExpert] = useState('');
  const [resendRole, setResendRole] = useState('ALUMNI');

  const fetchQuery = async () => {
    try {
      const res = await queryService.getQueryById(id);
      setQuery(res.data);
    } catch (err) {
      setError('Query not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuery();
  }, [id]);

  useEffect(() => {
    if (showResendModal && resendRole) {
      userService.getUsersByRole(resendRole)
        .then(res => setExperts(res.data || []))
        .catch(() => setExperts([]));
    }
  }, [showResendModal, resendRole]);

  const isAuthor = user && query && query.studentId === user.id;
  const canRespond = user && query && !isAuthor && query.status === 'OPEN';

  const handleSubmitResponse = async (e) => {
    e.preventDefault();
    if (!responseText.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      await queryService.submitResponse(id, { content: responseText.trim() });
      setResponseText('');
      setSuccess('Response submitted successfully!');
      await fetchQuery();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit response');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkBest = async (responseId) => {
    try {
      await queryService.markBestAnswer(responseId);
      setSuccess('Marked as best answer!');
      await fetchQuery();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark best answer');
    }
  };

  const handleMarkSatisfied = async () => {
    try {
      await queryService.markSatisfied(id);
      setSuccess('Marked as satisfied with community answer!');
      await fetchQuery();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update');
    }
  };

  const handleResend = async () => {
    if (!selectedExpert) return;
    try {
      await queryService.resendToExpert(id, selectedExpert);
      setShowResendModal(false);
      setSuccess('Query resent to expert!');
      await fetchQuery();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!query) {
    return (
      <div className="px-8 py-10 max-w-4xl mx-auto text-center">
        <p className="text-[#9baad6]">Query not found.</p>
        <Link to="/queries" className="text-primary hover:underline mt-4 inline-block">← Back to Feed</Link>
      </div>
    );
  }

  const hasCommunityAnswers = query.responses?.some(r => r.isCommunityResponse);
  const hasPopularAnswers = query.isPopular && query.responses?.length > 0;

  return (
    <div className="px-8 py-10 max-w-4xl mx-auto space-y-8">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[#9baad6] hover:text-primary transition-colors text-sm font-medium"
      >
        <span className="material-symbols-outlined text-lg">arrow_back</span>
        Back to Feed
      </button>

      {/* Alerts */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>
      )}
      {success && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm">{success}</div>
      )}

      {/* Query Header */}
      <div className="bg-[#0c1427]/80 rounded-2xl p-8 border border-white/5">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          {query.tags && query.tags.split(',').map(tag => (
            <span key={tag} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold">
              #{tag.trim()}
            </span>
          ))}
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            query.status === 'RESOLVED' ? 'bg-green-500/20 text-green-300' :
            query.status === 'CLOSED' ? 'bg-gray-500/20 text-gray-400' :
            'bg-blue-500/20 text-blue-300'
          }`}>
            {query.status}
          </span>
          {query.isPopular && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/20 text-yellow-300">
              🔥 Popular · Asked {query.popularCount}+ times
            </span>
          )}
          {query.targetRole && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-secondary/20 text-secondary">
              → {query.targetRole.replace('_', ' ')}
            </span>
          )}
        </div>

        <h1 className="text-3xl font-black text-[#dee5ff] mb-4 leading-tight">{query.title}</h1>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
            {query.studentProfilePicture ? (
              <img src={query.studentProfilePicture} alt={query.studentName} className="w-full h-full object-cover rounded-xl" />
            ) : getInitials(query.studentName)}
          </div>
          <div>
            <p className="text-[#dee5ff] font-bold text-sm">{query.studentName}</p>
            <p className="text-[#9baad6] text-xs">{formatDate(query.createdAt)}</p>
          </div>
        </div>

        <p className="text-[#9baad6] leading-relaxed whitespace-pre-wrap">{query.content}</p>

        {/* Community answer notice */}
        {hasPopularAnswers && isAuthor && query.status === 'OPEN' && (
          <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
            <p className="text-yellow-300 font-bold text-sm mb-2">
              🔥 This is a popular question with community answers below.
            </p>
            <p className="text-yellow-300/70 text-xs mb-3">
              Are you satisfied with the community answers, or would you like to send this to a specific expert?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleMarkSatisfied}
                className="px-4 py-2 bg-green-500/20 text-green-300 rounded-xl text-xs font-bold hover:bg-green-500/30 transition-all"
              >
                ✓ Satisfied with community answers
              </button>
              <button
                onClick={() => setShowResendModal(true)}
                className="px-4 py-2 bg-primary/20 text-primary rounded-xl text-xs font-bold hover:bg-primary/30 transition-all"
              >
                Send to specific expert
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Responses */}
      <div>
        <h2 className="text-xl font-black text-[#dee5ff] mb-4">
          Responses ({query.responses?.length ?? 0})
        </h2>

        {(!query.responses || query.responses.length === 0) ? (
          <div className="bg-[#0c1427]/80 rounded-2xl p-8 border border-white/5 text-center">
            <span className="material-symbols-outlined text-[#9baad6] text-4xl mb-3 block">chat_bubble_outline</span>
            <p className="text-[#9baad6]">No responses yet. Be the first to answer!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {query.responses.map((r) => (
              <div
                key={r.id}
                className={`bg-[#0c1427]/80 rounded-2xl p-6 border transition-all ${
                  r.isBestAnswer
                    ? 'border-green-500/40 shadow-[0_0_20px_rgba(34,197,94,0.1)]'
                    : 'border-white/5'
                }`}
              >
                {r.isBestAnswer && (
                  <div className="flex items-center gap-2 mb-3 text-green-400 text-xs font-bold">
                    <span className="material-symbols-outlined text-sm">verified</span>
                    Best Answer
                  </div>
                )}
                {r.isCommunityResponse && (
                  <div className="flex items-center gap-2 mb-3 text-yellow-300 text-xs font-bold">
                    <span className="material-symbols-outlined text-sm">auto_awesome</span>
                    Community Answer (from knowledge base)
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                    {r.mentorProfilePicture ? (
                      <img src={r.mentorProfilePicture} alt={r.mentorName} className="w-full h-full object-cover rounded-xl" />
                    ) : getInitials(r.mentorName)}
                  </div>
                  <div>
                    <p className="text-[#dee5ff] font-bold text-sm">{r.mentorName}</p>
                    <p className="text-[#9baad6] text-xs">
                      {r.mentorRole?.replace('_', ' ')}
                      {r.mentorCompany ? ` @ ${r.mentorCompany}` : ''}
                      {' · '}{formatDate(r.createdAt)}
                    </p>
                  </div>
                  {isAuthor && !r.isBestAnswer && query.status === 'OPEN' && (
                    <button
                      onClick={() => handleMarkBest(r.id)}
                      className="ml-auto px-3 py-1.5 bg-primary/10 text-primary rounded-xl text-xs font-bold hover:bg-primary/20 transition-all flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      Mark Best
                    </button>
                  )}
                </div>

                <p className="text-[#9baad6] leading-relaxed whitespace-pre-wrap">{r.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit Response */}
      {canRespond && (
        <div className="bg-[#0c1427]/80 rounded-2xl p-6 border border-white/5">
          <h3 className="text-[#dee5ff] font-black mb-4">Your Response</h3>
          <form onSubmit={handleSubmitResponse} className="space-y-4">
            <textarea
              value={responseText}
              onChange={e => setResponseText(e.target.value)}
              className="w-full bg-[#060e1d] border border-white/10 rounded-xl px-4 py-3 text-[#dee5ff] placeholder-[#9baad6]/40 focus:border-primary/50 focus:outline-none transition-all resize-none"
              placeholder="Share your knowledge and experience..."
              rows={5}
            />
            <button
              type="submit"
              disabled={submitting || !responseText.trim()}
              className="px-8 py-3 bg-primary text-on-primary rounded-xl font-bold hover:bg-primary/90 disabled:opacity-50 transition-all"
            >
              {submitting ? 'Submitting...' : 'Post Response'}
            </button>
          </form>
        </div>
      )}

      {/* Resend Modal */}
      {showResendModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0c1427] rounded-2xl p-8 w-full max-w-lg border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-[#dee5ff]">Send to Expert</h2>
              <button onClick={() => setShowResendModal(false)} className="text-[#9baad6] hover:text-[#dee5ff]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold text-[#9baad6] mb-2">Expert Type</label>
              <div className="grid grid-cols-3 gap-2">
                {['SENIOR_STUDENT', 'ALUMNI', 'MENTOR'].map(r => (
                  <label key={r} className={`p-2 border rounded-xl cursor-pointer text-center text-xs font-bold transition-all ${
                    resendRole === r ? 'border-primary bg-primary/10 text-[#dee5ff]' : 'border-white/10 text-[#9baad6]'
                  }`}>
                    <input type="radio" name="resendRole" value={r} checked={resendRole === r}
                      onChange={e => { setResendRole(e.target.value); setSelectedExpert(''); }}
                      className="sr-only" />
                    {r.replace('_', ' ')}
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-[#9baad6] mb-2">Select Expert</label>
              <select
                value={selectedExpert}
                onChange={e => setSelectedExpert(e.target.value)}
                className="w-full bg-[#060e1d] border border-white/10 rounded-xl px-4 py-3 text-[#dee5ff] focus:border-primary/50 focus:outline-none"
              >
                <option value="">Choose an expert...</option>
                {experts.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.fullName}
                    {u.currentCompany ? ` @ ${u.currentCompany}` : ''}
                    {u.college ? ` · ${u.college}` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowResendModal(false)}
                className="flex-1 py-3 rounded-xl bg-white/5 text-[#9baad6] font-bold hover:bg-white/10 transition-all">
                Cancel
              </button>
              <button onClick={handleResend} disabled={!selectedExpert}
                className="flex-1 py-3 rounded-xl bg-primary text-on-primary font-bold hover:bg-primary/90 disabled:opacity-50 transition-all">
                Send Query
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QueryDetail;
