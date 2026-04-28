import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import queryService from '../services/queryService';

const ProfilePage = () => {
  const { user, login } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');
  const [myQueries, setMyQueries] = useState([]);
  const [myResponses, setMyResponses] = useState([]);
  const [loadingActivity, setLoadingActivity] = useState(true);

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || '',
        bio: user.bio || '',
        college: user.college || '',
        graduationYear: user.graduationYear || '',
        degree: user.degree || '',
        branch: user.branch || '',
        currentCompany: user.currentCompany || '',
        currentPosition: user.currentPosition || '',
        workExperience: user.workExperience || '',
        industry: user.industry || '',
        linkedinProfile: user.linkedinProfile || '',
        achievements: user.achievements || '',
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const queriesRes = await queryService.getMyQueries();
        setMyQueries((queriesRes.data || []).slice(0, 5));
      } catch (err) {
        console.error('Activity fetch error:', err);
      } finally {
        setLoadingActivity(false);
      }
    };
    if (user) fetchActivity();
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError('');
    try {
      await userService.updateProfile(form);
      setSaveSuccess('Profile updated successfully!');
      setEditing(false);
      setTimeout(() => setSaveSuccess(''), 3000);
      // Refresh user in context
      window.location.reload();
    } catch (err) {
      setSaveError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const roleLabels = {
    STUDENT: 'Student',
    SENIOR_STUDENT: 'Senior Student',
    ALUMNI: 'Alumni',
    MENTOR: 'Industry Mentor',
  };

  const roleColors = {
    STUDENT: 'bg-blue-500/20 text-blue-300',
    SENIOR_STUDENT: 'bg-purple-500/20 text-purple-300',
    ALUMNI: 'bg-emerald-500/20 text-emerald-300',
    MENTOR: 'bg-orange-500/20 text-orange-300',
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  if (!user) return null;

  return (
    <div className="px-8 py-10 max-w-5xl mx-auto space-y-8">
      {/* Alerts */}
      {saveError && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{saveError}</div>
      )}
      {saveSuccess && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm">{saveSuccess}</div>
      )}

      {/* Profile Hero */}
      <div className="bg-[#0c1427]/80 rounded-2xl p-8 border border-white/5">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-primary/20 flex items-center justify-center text-primary font-black text-3xl overflow-hidden border-2 border-primary/20">
              {user.profilePicture ? (
                <img src={user.profilePicture} alt={user.fullName} className="w-full h-full object-cover" />
              ) : getInitials(user.fullName)}
            </div>
            {user.emailVerified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-[#060e1d]">
                <span className="material-symbols-outlined text-white text-xs">check</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 className="text-3xl font-black text-[#dee5ff]">{user.fullName}</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${roleColors[user.userRole] || 'bg-gray-500/20 text-gray-400'}`}>
                {roleLabels[user.userRole] || user.userRole}
              </span>
            </div>
            <p className="text-[#9baad6] text-sm mb-1">@{user.username}</p>
            {user.currentPosition && user.currentCompany && (
              <p className="text-primary/80 font-medium mb-1">{user.currentPosition} @ {user.currentCompany}</p>
            )}
            {user.college && (
              <p className="text-[#9baad6] text-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">school</span>
                {user.college}
                {user.graduationYear && ` · Class of ${user.graduationYear}`}
              </p>
            )}
            {user.bio && <p className="text-[#9baad6] text-sm mt-3 max-w-xl">{user.bio}</p>}
          </div>

          {/* Edit button */}
          <button
            onClick={() => setEditing(!editing)}
            className="px-4 py-2 bg-primary/10 text-primary rounded-xl font-bold text-sm hover:bg-primary/20 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">{editing ? 'close' : 'edit'}</span>
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/5">
          <div className="text-center">
            <p className="text-2xl font-black text-primary">{user.reputationPoints ?? 0}</p>
            <p className="text-[#9baad6] text-xs">Reputation Points</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-black text-[#dee5ff]">{myQueries.length}</p>
            <p className="text-[#9baad6] text-xs">Queries Asked</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-black text-[#dee5ff]">{formatDate(user.createdAt)}</p>
            <p className="text-[#9baad6] text-xs">Member Since</p>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      {editing && (
        <div className="bg-[#0c1427]/80 rounded-2xl p-8 border border-primary/20">
          <h2 className="text-xl font-black text-[#dee5ff] mb-6">Edit Profile</h2>
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-[#9baad6] mb-2">Full Name</label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                  className="w-full bg-[#060e1d] border border-white/10 rounded-xl px-4 py-3 text-[#dee5ff] focus:border-primary/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#9baad6] mb-2">LinkedIn Profile URL</label>
                <input
                  type="url"
                  value={form.linkedinProfile}
                  onChange={e => setForm(f => ({ ...f, linkedinProfile: e.target.value }))}
                  className="w-full bg-[#060e1d] border border-white/10 rounded-xl px-4 py-3 text-[#dee5ff] focus:border-primary/50 focus:outline-none"
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#9baad6] mb-2">Bio</label>
              <textarea
                value={form.bio}
                onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                className="w-full bg-[#060e1d] border border-white/10 rounded-xl px-4 py-3 text-[#dee5ff] focus:border-primary/50 focus:outline-none resize-none"
                rows={3}
                placeholder="Tell others about yourself..."
              />
            </div>

            {['STUDENT', 'SENIOR_STUDENT', 'ALUMNI'].includes(user.userRole) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-[#9baad6] mb-2">College/University</label>
                  <input
                    type="text"
                    value={form.college}
                    onChange={e => setForm(f => ({ ...f, college: e.target.value }))}
                    className="w-full bg-[#060e1d] border border-white/10 rounded-xl px-4 py-3 text-[#dee5ff] focus:border-primary/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#9baad6] mb-2">Graduation Year</label>
                  <input
                    type="text"
                    value={form.graduationYear}
                    onChange={e => setForm(f => ({ ...f, graduationYear: e.target.value }))}
                    className="w-full bg-[#060e1d] border border-white/10 rounded-xl px-4 py-3 text-[#dee5ff] focus:border-primary/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#9baad6] mb-2">Degree</label>
                  <input
                    type="text"
                    value={form.degree}
                    onChange={e => setForm(f => ({ ...f, degree: e.target.value }))}
                    className="w-full bg-[#060e1d] border border-white/10 rounded-xl px-4 py-3 text-[#dee5ff] focus:border-primary/50 focus:outline-none"
                    placeholder="B.Tech, M.Tech, MBA..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#9baad6] mb-2">Branch/Specialization</label>
                  <input
                    type="text"
                    value={form.branch}
                    onChange={e => setForm(f => ({ ...f, branch: e.target.value }))}
                    className="w-full bg-[#060e1d] border border-white/10 rounded-xl px-4 py-3 text-[#dee5ff] focus:border-primary/50 focus:outline-none"
                    placeholder="Computer Science, ECE..."
                  />
                </div>
              </div>
            )}

            {['ALUMNI', 'MENTOR'].includes(user.userRole) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-[#9baad6] mb-2">Current Company</label>
                  <input
                    type="text"
                    value={form.currentCompany}
                    onChange={e => setForm(f => ({ ...f, currentCompany: e.target.value }))}
                    className="w-full bg-[#060e1d] border border-white/10 rounded-xl px-4 py-3 text-[#dee5ff] focus:border-primary/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#9baad6] mb-2">Current Position</label>
                  <input
                    type="text"
                    value={form.currentPosition}
                    onChange={e => setForm(f => ({ ...f, currentPosition: e.target.value }))}
                    className="w-full bg-[#060e1d] border border-white/10 rounded-xl px-4 py-3 text-[#dee5ff] focus:border-primary/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#9baad6] mb-2">Industry</label>
                  <input
                    type="text"
                    value={form.industry}
                    onChange={e => setForm(f => ({ ...f, industry: e.target.value }))}
                    className="w-full bg-[#060e1d] border border-white/10 rounded-xl px-4 py-3 text-[#dee5ff] focus:border-primary/50 focus:outline-none"
                    placeholder="Software, Finance, Healthcare..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#9baad6] mb-2">Work Experience (years)</label>
                  <input
                    type="text"
                    value={form.workExperience}
                    onChange={e => setForm(f => ({ ...f, workExperience: e.target.value }))}
                    className="w-full bg-[#060e1d] border border-white/10 rounded-xl px-4 py-3 text-[#dee5ff] focus:border-primary/50 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-[#9baad6] mb-2">Achievements</label>
              <textarea
                value={form.achievements}
                onChange={e => setForm(f => ({ ...f, achievements: e.target.value }))}
                className="w-full bg-[#060e1d] border border-white/10 rounded-xl px-4 py-3 text-[#dee5ff] focus:border-primary/50 focus:outline-none resize-none"
                rows={3}
                placeholder="Awards, certifications, notable projects..."
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="flex-1 py-3 rounded-xl bg-white/5 text-[#9baad6] font-bold hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-3 rounded-xl bg-primary text-on-primary font-bold hover:bg-primary/90 disabled:opacity-50 transition-all"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Account Info */}
      <div className="bg-[#0c1427]/80 rounded-2xl p-6 border border-white/5">
        <h2 className="text-lg font-black text-[#dee5ff] mb-4">Account Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white/[0.03] rounded-xl">
            <p className="text-[#9baad6] text-xs mb-1">Email</p>
            <p className="text-[#dee5ff] font-medium">{user.email}</p>
          </div>
          <div className="p-4 bg-white/[0.03] rounded-xl">
            <p className="text-[#9baad6] text-xs mb-1">Email Status</p>
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.emailVerified ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
              {user.emailVerified ? '✓ Verified' : 'Pending Verification'}
            </span>
          </div>
          <div className="p-4 bg-white/[0.03] rounded-xl">
            <p className="text-[#9baad6] text-xs mb-1">Account Status</p>
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.accountEnabled ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
              {user.accountEnabled ? '✓ Active' : 'Disabled'}
            </span>
          </div>
          <div className="p-4 bg-white/[0.03] rounded-xl">
            <p className="text-[#9baad6] text-xs mb-1">Last Login</p>
            <p className="text-[#dee5ff] font-medium text-sm">{formatDate(user.lastLoginAt)}</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-[#0c1427]/80 rounded-2xl p-6 border border-white/5">
        <h2 className="text-lg font-black text-[#dee5ff] mb-4">Recent Queries</h2>
        {loadingActivity ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : myQueries.length === 0 ? (
          <p className="text-[#9baad6] text-sm text-center py-4">No queries yet.</p>
        ) : (
          <div className="space-y-3">
            {myQueries.map(q => (
              <div key={q.id} className="flex items-center gap-3 p-3 bg-white/[0.03] rounded-xl">
                <span className="material-symbols-outlined text-primary text-sm">forum</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[#dee5ff] text-sm font-medium truncate">{q.title}</p>
                  <p className="text-[#9baad6] text-xs">{q.responseCount ?? 0} responses</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  q.status === 'RESOLVED' ? 'bg-green-500/20 text-green-300' : 'bg-blue-500/20 text-blue-300'
                }`}>
                  {q.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
