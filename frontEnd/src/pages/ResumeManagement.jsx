import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const ResumeManagement = () => {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  // Note: Full resume upload requires backend file storage (S3/local).
  // This page provides the UI shell ready to connect to a file upload endpoint.

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setMessage('Only PDF files are supported.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setMessage('File size must be under 5MB.');
      return;
    }
    // Simulate local state (replace with actual API call when backend supports file upload)
    const newResume = {
      id: Date.now(),
      name: file.name,
      size: (file.size / 1024).toFixed(0) + ' KB',
      uploadedAt: new Date().toLocaleDateString(),
      status: 'active',
    };
    setResumes(prev => [newResume, ...prev]);
    setMessage('Resume uploaded successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleDelete = (id) => {
    setResumes(prev => prev.filter(r => r.id !== id));
  };

  const handleArchive = (id) => {
    setResumes(prev => prev.map(r => r.id === id ? { ...r, status: 'archived' } : r));
  };

  const handleRestore = (id) => {
    setResumes(prev => prev.map(r => r.id === id ? { ...r, status: 'active' } : r));
  };

  const activeResumes = resumes.filter(r => r.status === 'active');
  const archivedResumes = resumes.filter(r => r.status === 'archived');

  return (
    <div className="px-8 py-10 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-black text-[#dee5ff] tracking-tight">Resume Hub</h1>
          <p className="text-[#9baad6] mt-1">Manage your professional documents</p>
        </div>
        <label className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-xl font-bold cursor-pointer hover:bg-primary/90 transition-all shadow-lg">
          <span className="material-symbols-outlined">upload_file</span>
          Upload Resume
          <input type="file" accept=".pdf" onChange={handleUpload} className="sr-only" />
        </label>
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-sm font-medium ${
          message.includes('success') ? 'bg-green-500/10 border border-green-500/20 text-green-400' :
          'bg-red-500/10 border border-red-500/20 text-red-400'
        }`}>
          {message}
        </div>
      )}

      {/* Profile info reminder */}
      <div className="bg-primary/10 border border-primary/20 rounded-2xl p-5 flex gap-4">
        <span className="material-symbols-outlined text-primary text-2xl flex-shrink-0">info</span>
        <div>
          <p className="text-[#dee5ff] font-bold text-sm mb-1">Your profile is your resume</p>
          <p className="text-[#9baad6] text-sm">
            Your MentorBridge profile — including your college, company, position, and bio — is visible to the community.
            Upload a PDF resume here for mentors to review in detail.
          </p>
        </div>
      </div>

      {/* Active Resumes */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <span className="w-1.5 h-7 bg-primary rounded-full" />
          <h2 className="text-xl font-black text-[#dee5ff]">Active Resumes</h2>
          <span className="text-xs font-bold text-[#9baad6] border border-white/10 px-2 py-0.5 rounded-full">
            {activeResumes.length} files
          </span>
        </div>

        {activeResumes.length === 0 ? (
          <label className="block border-2 border-dashed border-white/10 rounded-2xl p-12 text-center hover:border-primary/30 transition-all cursor-pointer group">
            <span className="material-symbols-outlined text-[#9baad6] text-5xl mb-3 block group-hover:text-primary transition-colors">upload_file</span>
            <p className="text-[#dee5ff] font-bold mb-1">No resumes uploaded yet</p>
            <p className="text-[#9baad6] text-sm">Click to upload your first resume (PDF, max 5MB)</p>
            <input type="file" accept=".pdf" onChange={handleUpload} className="sr-only" />
          </label>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {activeResumes.map(r => (
              <div key={r.id} className="bg-[#0c1427]/80 rounded-2xl p-6 border border-white/5 hover:border-primary/20 transition-all">
                <div className="flex justify-between items-start mb-5">
                  <div className="w-12 h-14 bg-red-500/10 rounded-lg border border-red-500/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-red-400 text-2xl">picture_as_pdf</span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleArchive(r.id)}
                      className="p-2 text-[#9baad6] hover:text-[#dee5ff] rounded-lg hover:bg-white/5 transition-all"
                      title="Archive"
                    >
                      <span className="material-symbols-outlined text-lg">archive</span>
                    </button>
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="p-2 text-[#9baad6] hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-all"
                      title="Delete"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                </div>
                <p className="text-[#dee5ff] font-bold text-sm mb-1 truncate">{r.name}</p>
                <p className="text-[#9baad6] text-xs">Uploaded {r.uploadedAt} · {r.size}</p>
              </div>
            ))}

            {/* Add more */}
            <label className="border-2 border-dashed border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center hover:border-primary/30 transition-all cursor-pointer group">
              <span className="material-symbols-outlined text-[#9baad6] text-3xl mb-2 group-hover:text-primary transition-colors">add</span>
              <p className="text-[#9baad6] text-sm font-bold group-hover:text-primary transition-colors">Add Resume</p>
              <input type="file" accept=".pdf" onChange={handleUpload} className="sr-only" />
            </label>
          </div>
        )}
      </div>

      {/* Archived Resumes */}
      {archivedResumes.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-5">
            <span className="w-1.5 h-7 bg-white/20 rounded-full" />
            <h2 className="text-xl font-black text-[#dee5ff]/60">Archived</h2>
          </div>
          <div className="space-y-3">
            {archivedResumes.map(r => (
              <div key={r.id} className="flex items-center gap-4 bg-[#0c1427]/40 rounded-xl p-4 border border-white/5">
                <span className="material-symbols-outlined text-[#9baad6]">archive</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[#dee5ff]/60 font-medium text-sm truncate">{r.name}</p>
                  <p className="text-[#9baad6]/60 text-xs">Archived · {r.size}</p>
                </div>
                <button
                  onClick={() => handleRestore(r.id)}
                  className="text-xs font-bold text-[#9baad6] hover:text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-primary/10"
                >
                  Restore
                </button>
                <button
                  onClick={() => handleDelete(r.id)}
                  className="p-1.5 text-[#9baad6] hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-all"
                >
                  <span className="material-symbols-outlined text-lg">delete_forever</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feature info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-[#0c1427]/80 rounded-2xl p-6 border border-white/5">
          <span className="material-symbols-outlined text-primary text-3xl mb-3 block">rate_review</span>
          <h3 className="text-[#dee5ff] font-black mb-2">Get Resume Reviews</h3>
          <p className="text-[#9baad6] text-sm">Post a query in the Query Feed asking for resume feedback. Alumni and mentors can review your uploaded resume.</p>
        </div>
        <div className="bg-[#0c1427]/80 rounded-2xl p-6 border border-white/5">
          <span className="material-symbols-outlined text-primary text-3xl mb-3 block">share</span>
          <h3 className="text-[#dee5ff] font-black mb-2">Share Your Profile</h3>
          <p className="text-[#9baad6] text-sm">Your MentorBridge profile URL can be shared with recruiters and mentors as a professional portfolio.</p>
        </div>
      </div>
    </div>
  );
};

export default ResumeManagement;
