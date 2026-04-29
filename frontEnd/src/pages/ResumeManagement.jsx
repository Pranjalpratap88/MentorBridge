import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import resumeService from '../services/resumeService';
import userService from '../services/userService';

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

const formatBytes = (bytes) => {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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

// ─── Visibility Settings Modal ────────────────────────────────────────────────
const VisibilityModal = ({ resume, onClose, onSaved }) => {
  const ROLE_OPTIONS = [
    { value: 'SENIOR_STUDENT', label: 'Senior Students' },
    { value: 'ALUMNI', label: 'Alumni' },
    { value: 'MENTOR', label: 'Mentors' },
  ];

  const parseRoles = (str) =>
    str ? str.split(',').map(r => r.trim()).filter(Boolean) : [];

  const [selectedRoles, setSelectedRoles] = useState(parseRoles(resume.visibleToRoles));
  const [specificIds, setSpecificIds] = useState(resume.visibleToUserIds || '');
  const [reviewOpen, setReviewOpen] = useState(resume.reviewRequestOpen ?? false);
  const [reviewNote, setReviewNote] = useState(resume.reviewNote || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const toggleRole = (role) => {
    setSelectedRoles(prev =>
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await resumeService.updateSettings(resume.id, {
        visibleToRoles: selectedRoles.join(','),
        visibleToUserIds: specificIds.trim(),
        reviewRequestOpen: reviewOpen,
        reviewNote: reviewNote.trim(),
      });
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0c1427] rounded-2xl p-8 w-full max-w-lg border border-white/10 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-[#dee5ff]">Visibility Settings</h2>
          <button onClick={onClose} className="text-[#9baad6] hover:text-[#dee5ff] transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <p className="text-[#9baad6] text-xs mb-1 font-bold uppercase tracking-wider">
          {resume.title || resume.originalFileName}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>
        )}

        <div className="space-y-6">
          {/* Visible to roles */}
          <div>
            <label className="block text-sm font-bold text-[#9baad6] mb-3">Visible to Roles</label>
            <div className="space-y-2">
              {ROLE_OPTIONS.map(({ value, label }) => (
                <label key={value} className="flex items-center gap-3 cursor-pointer group">
                  <div
                    onClick={() => toggleRole(value)}
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all cursor-pointer ${
                      selectedRoles.includes(value)
                        ? 'bg-primary border-primary'
                        : 'border-white/20 group-hover:border-primary/50'
                    }`}
                  >
                    {selectedRoles.includes(value) && (
                      <span className="material-symbols-outlined text-on-primary text-xs">check</span>
                    )}
                  </div>
                  <span className="text-[#dee5ff] text-sm">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Specific user IDs */}
          <div>
            <label className="block text-sm font-bold text-[#9baad6] mb-2">
              Specific User IDs
              <span className="font-normal ml-1 text-[#9baad6]/60">(comma-separated)</span>
            </label>
            <input
              type="text"
              value={specificIds}
              onChange={e => setSpecificIds(e.target.value)}
              placeholder="e.g. 12, 45, 78"
              className="w-full bg-[#060e1d] border border-white/10 rounded-xl px-4 py-3 text-[#dee5ff] placeholder-[#9baad6]/40 focus:border-primary/50 focus:outline-none transition-all text-sm"
            />
          </div>

          {/* Open for review toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#dee5ff] text-sm font-bold">Open for Review</p>
              <p className="text-[#9baad6] text-xs mt-0.5">Allow eligible users to write reviews</p>
            </div>
            <button
              onClick={() => setReviewOpen(v => !v)}
              className={`relative w-12 h-6 rounded-full transition-all ${reviewOpen ? 'bg-primary' : 'bg-white/10'}`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${reviewOpen ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          {/* Review note */}
          {reviewOpen && (
            <div>
              <label className="block text-sm font-bold text-[#9baad6] mb-2">Review Note</label>
              <textarea
                value={reviewNote}
                onChange={e => setReviewNote(e.target.value)}
                placeholder="Message to reviewers (e.g. focus on formatting, targeting SWE roles...)"
                rows={3}
                className="w-full bg-[#060e1d] border border-white/10 rounded-xl px-4 py-3 text-[#dee5ff] placeholder-[#9baad6]/40 focus:border-primary/50 focus:outline-none transition-all resize-none text-sm"
              />
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-white/5 text-[#9baad6] font-bold hover:bg-white/10 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-3 rounded-xl bg-primary text-on-primary font-bold hover:bg-primary/90 disabled:opacity-50 transition-all"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Resume Card ──────────────────────────────────────────────────────────────
const ResumeCard = ({ resume, onRefresh }) => {
  const navigate = useNavigate();
  const [toggling, setToggling] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState('');

  const handleToggleReview = async () => {
    setToggling(true);
    setError('');
    try {
      await resumeService.updateSettings(resume.id, {
        reviewRequestOpen: !resume.reviewRequestOpen,
      });
      onRefresh();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update');
    } finally {
      setToggling(false);
    }
  };

  const handleArchiveToggle = async () => {
    setArchiving(true);
    setError('');
    try {
      if (resume.status === 'ARCHIVED') {
        await resumeService.restore(resume.id);
      } else {
        await resumeService.archive(resume.id);
      }
      onRefresh();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update');
    } finally {
      setArchiving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError('');
    try {
      await resumeService.delete(resume.id);
      onRefresh();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete');
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  return (
    <>
      <div className="bg-[#0c1427]/80 rounded-2xl p-6 border border-white/5 hover:border-primary/20 transition-all flex flex-col gap-4">
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">{error}</div>
        )}

        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                resume.status === 'ACTIVE' ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-400'
              }`}>
                {resume.status}
              </span>
              {resume.reviewRequestOpen && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-primary/20 text-primary">
                  Open for Review
                </span>
              )}
              {resume.reviewCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-white/5 text-[#9baad6]">
                  {resume.reviewCount} {resume.reviewCount === 1 ? 'review' : 'reviews'}
                </span>
              )}
            </div>
            <h3 className="text-[#dee5ff] font-black text-base truncate">
              {resume.title || resume.originalFileName}
            </h3>
            <p className="text-[#9baad6] text-xs mt-0.5 truncate">{resume.originalFileName}</p>
          </div>
          <span className="material-symbols-outlined text-[#9baad6] text-2xl flex-shrink-0">description</span>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-[#9baad6]">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">storage</span>
            {formatBytes(resume.fileSizeBytes)}
          </span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">calendar_today</span>
            {formatDate(resume.uploadedAt)}
          </span>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
          <button
            onClick={() => navigate(`/resume-review/${resume.id}`)}
            className="flex items-center gap-1.5 px-3 py-2 bg-primary/10 text-primary rounded-xl text-xs font-bold hover:bg-primary/20 transition-all"
          >
            <span className="material-symbols-outlined text-sm">rate_review</span>
            View Reviews
          </button>

          <button
            onClick={handleToggleReview}
            disabled={toggling || resume.status === 'ARCHIVED'}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50 ${
              resume.reviewRequestOpen
                ? 'bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30'
                : 'bg-white/5 text-[#9baad6] hover:bg-white/10'
            }`}
          >
            <span className="material-symbols-outlined text-sm">
              {resume.reviewRequestOpen ? 'visibility_off' : 'visibility'}
            </span>
            {resume.reviewRequestOpen ? 'Close Review' : 'Open Review'}
          </button>

          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-white/5 text-[#9baad6] rounded-xl text-xs font-bold hover:bg-white/10 transition-all"
          >
            <span className="material-symbols-outlined text-sm">settings</span>
            Settings
          </button>

          <button
            onClick={handleArchiveToggle}
            disabled={archiving}
            className="flex items-center gap-1.5 px-3 py-2 bg-white/5 text-[#9baad6] rounded-xl text-xs font-bold hover:bg-white/10 transition-all disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-sm">
              {resume.status === 'ARCHIVED' ? 'unarchive' : 'archive'}
            </span>
            {resume.status === 'ARCHIVED' ? 'Restore' : 'Archive'}
          </button>

          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-red-500/10 text-red-400 rounded-xl text-xs font-bold hover:bg-red-500/20 transition-all"
            >
              <span className="material-symbols-outlined text-sm">delete</span>
              Delete
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-red-400 font-bold">Sure?</span>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-3 py-2 bg-red-500/20 text-red-300 rounded-xl text-xs font-bold hover:bg-red-500/30 transition-all disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-3 py-2 bg-white/5 text-[#9baad6] rounded-xl text-xs font-bold hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {showSettings && (
        <VisibilityModal
          resume={resume}
          onClose={() => setShowSettings(false)}
          onSaved={onRefresh}
        />
      )}
    </>
  );
};

// ─── Upload Area ──────────────────────────────────────────────────────────────
const UploadArea = ({ onUploaded }) => {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const inputRef = useRef(null);

  const MAX_SIZE = 5 * 1024 * 1024;

  const validateFile = (f) => {
    if (!f) return 'No file selected';
    if (f.type !== 'application/pdf') return 'Only PDF files are allowed';
    if (f.size > MAX_SIZE) return 'File must be under 5 MB';
    return null;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    const err = validateFile(dropped);
    if (err) { setError(err); return; }
    setError('');
    setFile(dropped);
    if (!title) setTitle(dropped.name.replace(/\.pdf$/i, ''));
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    const err = validateFile(selected);
    if (err) { setError(err); return; }
    setError('');
    setFile(selected);
    if (!title) setTitle(selected.name.replace(/\.pdf$/i, ''));
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError('');
    setProgress(0);
    try {
      await resumeService.upload(file, title.trim() || file.name);
      setSuccess('Resume uploaded successfully!');
      setFile(null);
      setTitle('');
      if (inputRef.current) inputRef.current.value = '';
      onUploaded();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="bg-[#0c1427]/80 rounded-2xl p-6 border border-white/5 space-y-4">
      <h3 className="text-[#dee5ff] font-black text-lg flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">upload_file</span>
        Upload Resume
      </h3>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>
      )}
      {success && (
        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm">{success}</div>
      )}

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
          dragging
            ? 'border-primary bg-primary/10'
            : file
            ? 'border-green-500/40 bg-green-500/5'
            : 'border-white/10 hover:border-primary/40 hover:bg-primary/5'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />
        {file ? (
          <div className="flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-green-400 text-4xl">check_circle</span>
            <p className="text-[#dee5ff] font-bold text-sm">{file.name}</p>
            <p className="text-[#9baad6] text-xs">{formatBytes(file.size)}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-[#9baad6] text-4xl">cloud_upload</span>
            <p className="text-[#dee5ff] font-bold text-sm">Drag & drop your PDF here</p>
            <p className="text-[#9baad6] text-xs">or click to browse · Max 5 MB</p>
          </div>
        )}
      </div>

      {/* Title input */}
      {file && (
        <div>
          <label className="block text-sm font-bold text-[#9baad6] mb-2">Resume Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Software Engineer Resume 2025"
            className="w-full bg-[#060e1d] border border-white/10 rounded-xl px-4 py-3 text-[#dee5ff] placeholder-[#9baad6]/40 focus:border-primary/50 focus:outline-none transition-all text-sm"
          />
        </div>
      )}

      {uploading && (
        <div className="w-full bg-white/5 rounded-full h-1.5">
          <div
            className="bg-primary h-1.5 rounded-full transition-all"
            style={{ width: `${progress || 60}%` }}
          />
        </div>
      )}

      <div className="flex gap-3">
        {file && (
          <button
            onClick={() => { setFile(null); setTitle(''); setError(''); if (inputRef.current) inputRef.current.value = ''; }}
            className="px-4 py-2.5 bg-white/5 text-[#9baad6] rounded-xl text-sm font-bold hover:bg-white/10 transition-all"
          >
            Clear
          </button>
        )}
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="flex-1 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-bold hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          {uploading ? (
            <>
              <div className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-sm">upload</span>
              Upload Resume
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const ResumeManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const isReviewer = user && REVIEWER_ROLES.includes(user.userRole);
  const tabs = [
    { id: 'my', label: 'My Resumes', icon: 'description' },
    ...(isReviewer ? [
      { id: 'requests', label: 'Review Requests', icon: 'rate_review' },
      { id: 'reviews', label: 'My Reviews', icon: 'reviews' },
    ] : []),
  ];

  const [activeTab, setActiveTab] = useState('my');
  const [myResumes, setMyResumes] = useState([]);
  const [openResumes, setOpenResumes] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMyResumes = useCallback(async () => {
    try {
      const res = await resumeService.getMyResumes();
      setMyResumes(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load resumes');
    }
  }, []);

  const fetchOpenForReview = useCallback(async () => {
    try {
      const res = await resumeService.getOpenForReview();
      setOpenResumes(res.data || []);
    } catch (err) {
      console.error('Failed to load review requests', err);
    }
  }, []);

  const fetchMyReviews = useCallback(async () => {
    try {
      const res = await resumeService.getMyReviews();
      setMyReviews(res.data || []);
    } catch (err) {
      console.error('Failed to load my reviews', err);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      await fetchMyResumes();
      if (isReviewer) {
        await Promise.all([fetchOpenForReview(), fetchMyReviews()]);
      }
      setLoading(false);
    };
    load();
  }, [fetchMyResumes, fetchOpenForReview, fetchMyReviews, isReviewer]);

  const handleRefresh = () => {
    fetchMyResumes();
    if (isReviewer) {
      fetchOpenForReview();
      fetchMyReviews();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-8 py-10 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-[#dee5ff] tracking-tight">Resume Hub</h1>
        <p className="text-[#9baad6] mt-1">Manage your resumes and get feedback from the community</p>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-[#0c1427]/60 p-1 rounded-xl w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-primary text-on-primary'
                : 'text-[#9baad6] hover:text-[#dee5ff]'
            }`}
          >
            <span className="material-symbols-outlined text-sm">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── My Resumes Tab ── */}
      {activeTab === 'my' && (
        <div className="space-y-6">
          <UploadArea onUploaded={handleRefresh} />

          <div>
            <h2 className="text-xl font-black text-[#dee5ff] mb-4">
              Your Resumes
              <span className="ml-2 text-sm font-normal text-[#9baad6]">({myResumes.length})</span>
            </h2>

            {myResumes.length === 0 ? (
              <div className="bg-[#0c1427]/80 rounded-2xl p-12 border border-white/5 text-center">
                <span className="material-symbols-outlined text-[#9baad6] text-5xl mb-4 block">description</span>
                <p className="text-[#dee5ff] font-bold text-lg mb-2">No resumes yet</p>
                <p className="text-[#9baad6] text-sm">Upload your first resume above to get started</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myResumes.map(resume => (
                  <ResumeCard key={resume.id} resume={resume} onRefresh={handleRefresh} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Review Requests Tab ── */}
      {activeTab === 'requests' && isReviewer && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-[#dee5ff]">
              Open for Review
              <span className="ml-2 text-sm font-normal text-[#9baad6]">({openResumes.length})</span>
            </h2>
            <button
              onClick={fetchOpenForReview}
              className="flex items-center gap-1.5 text-[#9baad6] hover:text-primary transition-colors text-sm"
            >
              <span className="material-symbols-outlined text-sm">refresh</span>
              Refresh
            </button>
          </div>

          {openResumes.length === 0 ? (
            <div className="bg-[#0c1427]/80 rounded-2xl p-12 border border-white/5 text-center">
              <span className="material-symbols-outlined text-[#9baad6] text-5xl mb-4 block">rate_review</span>
              <p className="text-[#dee5ff] font-bold text-lg mb-2">No review requests</p>
              <p className="text-[#9baad6] text-sm">Check back later — students will post resumes for review here</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {openResumes.map(resume => {
                const rc = roleColors[resume.ownerRole] || 'bg-gray-500/20 text-gray-400';
                return (
                  <div
                    key={resume.id}
                    className="bg-[#0c1427]/80 rounded-2xl p-6 border border-white/5 hover:border-primary/20 transition-all flex flex-col gap-4"
                  >
                    {/* Owner info */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold text-sm overflow-hidden">
                        {resume.ownerProfilePicture ? (
                          <img src={resume.ownerProfilePicture} alt={resume.ownerName} className="w-full h-full object-cover" />
                        ) : getInitials(resume.ownerName)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[#dee5ff] font-bold text-sm">{resume.ownerName}</p>
                        <div className="flex items-center gap-2 flex-wrap mt-0.5">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${rc}`}>
                            {roleLabels[resume.ownerRole] || resume.ownerRole}
                          </span>
                          {resume.ownerCollege && (
                            <span className="text-[#9baad6] text-xs">{resume.ownerCollege}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Resume info */}
                    <div>
                      <p className="text-[#dee5ff] font-black text-base">
                        {resume.title || resume.originalFileName}
                      </p>
                      <p className="text-[#9baad6] text-xs mt-0.5 flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">calendar_today</span>
                        {formatDate(resume.uploadedAt)}
                        <span className="mx-1">·</span>
                        <span className="material-symbols-outlined text-xs">rate_review</span>
                        {resume.reviewCount} {resume.reviewCount === 1 ? 'review' : 'reviews'}
                      </p>
                    </div>

                    {/* Review note */}
                    {resume.reviewNote && (
                      <div className="p-3 bg-primary/5 border border-primary/10 rounded-xl">
                        <p className="text-[#9baad6] text-xs italic">"{resume.reviewNote}"</p>
                      </div>
                    )}

                    <button
                      onClick={() => navigate(`/resume-review/${resume.id}`)}
                      className="flex items-center justify-center gap-2 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-bold hover:bg-primary/90 transition-all"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                      Write Review
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── My Reviews Tab ── */}
      {activeTab === 'reviews' && isReviewer && (
        <div className="space-y-4">
          <h2 className="text-xl font-black text-[#dee5ff]">
            Reviews I've Written
            <span className="ml-2 text-sm font-normal text-[#9baad6]">({myReviews.length})</span>
          </h2>

          {myReviews.length === 0 ? (
            <div className="bg-[#0c1427]/80 rounded-2xl p-12 border border-white/5 text-center">
              <span className="material-symbols-outlined text-[#9baad6] text-5xl mb-4 block">reviews</span>
              <p className="text-[#dee5ff] font-bold text-lg mb-2">No reviews yet</p>
              <p className="text-[#9baad6] text-sm">Head to the Review Requests tab to start helping others</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myReviews.map(review => (
                <div
                  key={review.id}
                  className="bg-[#0c1427]/80 rounded-2xl p-6 border border-white/5 hover:border-primary/20 transition-all"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <p className="text-[#dee5ff] font-black text-base">{review.resumeTitle}</p>
                      <p className="text-[#9baad6] text-xs mt-0.5">{formatDate(review.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {[1, 2, 3, 4, 5].map(s => (
                        <span
                          key={s}
                          className={`material-symbols-outlined text-base ${s <= review.rating ? 'text-yellow-400' : 'text-white/10'}`}
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-[#9baad6] text-sm line-clamp-2">{review.overallFeedback}</p>
                  <button
                    onClick={() => navigate(`/resume-review/${review.resumeId}`)}
                    className="mt-4 flex items-center gap-1.5 text-primary text-xs font-bold hover:underline"
                  >
                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                    View Full Review
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResumeManagement;
