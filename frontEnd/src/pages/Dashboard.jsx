import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import queryService from '../services/queryService';

const roleConfig = {
  STUDENT: {
    color: 'from-blue-500 to-indigo-600',
    badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    label: 'Student',
    icon: 'school',
    description: 'Ask questions, learn from seniors and alumni',
  },
  SENIOR_STUDENT: {
    color: 'from-purple-500 to-violet-600',
    badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    label: 'Senior Student',
    icon: 'workspace_premium',
    description: 'Guide juniors and connect with alumni',
  },
  ALUMNI: {
    color: 'from-emerald-500 to-teal-600',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    label: 'Alumni',
    icon: 'verified',
    description: 'Mentor students and share industry experience',
  },
  MENTOR: {
    color: 'from-orange-500 to-amber-600',
    badge: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    label: 'Industry Mentor',
    icon: 'star',
    description: 'Shape the next generation of professionals',
  },
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentQueries, setRecentQueries] = useState([]);
  const [assignedQueries, setAssignedQueries] = useState([]);
  const [loading, setLoading] = useState(true);

  const role = user?.userRole || 'STUDENT';
  const config = roleConfig[role] || roleConfig.STUDENT;

  // Admin must never see the user dashboard — redirect immediately
  useEffect(() => {
    if (user?.roles?.includes('ADMIN')) {
      navigate('/admin', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, myQueriesRes] = await Promise.all([
          userService.getDashboardStats(),
          queryService.getMyQueries(),
        ]);
        setStats(statsRes.data);
        setRecentQueries((myQueriesRes.data || []).slice(0, 5));

        // For seniors/alumni/mentors, also fetch assigned queries
        if (['SENIOR_STUDENT', 'ALUMNI', 'MENTOR'].includes(role)) {
          const assignedRes = await queryService.getAssignedQueries();
          setAssignedQueries((assignedRes.data || []).slice(0, 5));
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchData();
  }, [user, role]);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  };

  const getStatusBadge = (status) => {
    const map = {
      OPEN: 'bg-blue-500/20 text-blue-300',
      RESOLVED: 'bg-green-500/20 text-green-300',
      CLOSED: 'bg-gray-500/20 text-gray-400',
    };
    return map[status] || map.OPEN;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-8 py-10 max-w-7xl mx-auto space-y-10">
      {/* Welcome Banner */}
      <div className={`bg-gradient-to-r ${config.color} rounded-2xl p-8 text-white shadow-xl relative overflow-hidden`}>
        <div className="absolute top-0 right-0 opacity-10 p-6">
          <span className="material-symbols-outlined text-[120px]">{config.icon}</span>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${config.badge}`}>
              {config.label}
            </span>
            {user?.reputationPoints > 0 && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white">
                ⭐ {user.reputationPoints} pts
              </span>
            )}
          </div>
          <h1 className="text-4xl font-black mb-2">
            Welcome back, {user?.fullName?.split(' ')[0] || 'User'}!
          </h1>
          <p className="text-white/80 text-lg">{config.description}</p>
          {user?.college && (
            <p className="text-white/60 text-sm mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">school</span>
              {user.college}
              {user.graduationYear && ` · Class of ${user.graduationYear}`}
            </p>
          )}
          {user?.currentCompany && (
            <p className="text-white/60 text-sm mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">business</span>
              {user.currentPosition} @ {user.currentCompany}
            </p>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#0c1427]/80 rounded-2xl p-6 border border-white/5">
          <p className="text-[#9baad6] text-xs font-bold uppercase tracking-widest mb-2">Reputation</p>
          <p className="text-3xl font-black text-primary">{stats?.reputationPoints ?? user?.reputationPoints ?? 0}</p>
          <p className="text-[#9baad6] text-xs mt-1">points earned</p>
        </div>
        <div className="bg-[#0c1427]/80 rounded-2xl p-6 border border-white/5">
          <p className="text-[#9baad6] text-xs font-bold uppercase tracking-widest mb-2">Queries Asked</p>
          <p className="text-3xl font-black text-[#dee5ff]">{stats?.queriesAsked ?? 0}</p>
          <p className="text-[#9baad6] text-xs mt-1">total questions</p>
        </div>
        <div className="bg-[#0c1427]/80 rounded-2xl p-6 border border-white/5">
          <p className="text-[#9baad6] text-xs font-bold uppercase tracking-widest mb-2">Responses Given</p>
          <p className="text-3xl font-black text-[#dee5ff]">{stats?.responsesGiven ?? 0}</p>
          <p className="text-[#9baad6] text-xs mt-1">answers provided</p>
        </div>
        {['SENIOR_STUDENT', 'ALUMNI', 'MENTOR'].includes(role) ? (
          <div className="bg-[#0c1427]/80 rounded-2xl p-6 border border-white/5">
            <p className="text-[#9baad6] text-xs font-bold uppercase tracking-widest mb-2">Assigned to Me</p>
            <p className="text-3xl font-black text-[#dee5ff]">{stats?.assignedQueries ?? 0}</p>
            <p className="text-[#9baad6] text-xs mt-1">pending queries</p>
          </div>
        ) : (
          <div className="bg-[#0c1427]/80 rounded-2xl p-6 border border-white/5">
            <p className="text-[#9baad6] text-xs font-bold uppercase tracking-widest mb-2">Community</p>
            <p className="text-3xl font-black text-[#dee5ff]">{stats?.totalUsers ?? 0}</p>
            <p className="text-[#9baad6] text-xs mt-1">verified members</p>
          </div>
        )}
      </div>

      {/* Quick Actions — role-specific */}
      <div>
        <h2 className="text-xl font-black text-[#dee5ff] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {role === 'STUDENT' && (
            <>
              <Link to="/queries" className="bg-[#0c1427]/80 rounded-2xl p-6 border border-white/5 hover:border-primary/30 transition-all group">
                <span className="material-symbols-outlined text-primary text-3xl mb-3 block group-hover:scale-110 transition-transform">add_circle</span>
                <h3 className="text-[#dee5ff] font-bold mb-1">Ask a Query</h3>
                <p className="text-[#9baad6] text-sm">Post your question to seniors, alumni, or mentors</p>
              </Link>
              <Link to="/networking" className="bg-[#0c1427]/80 rounded-2xl p-6 border border-white/5 hover:border-primary/30 transition-all group">
                <span className="material-symbols-outlined text-primary text-3xl mb-3 block group-hover:scale-110 transition-transform">hub</span>
                <h3 className="text-[#dee5ff] font-bold mb-1">Find Mentors</h3>
                <p className="text-[#9baad6] text-sm">Connect with alumni and industry mentors</p>
              </Link>
              <Link to="/leaderboard" className="bg-[#0c1427]/80 rounded-2xl p-6 border border-white/5 hover:border-primary/30 transition-all group">
                <span className="material-symbols-outlined text-primary text-3xl mb-3 block group-hover:scale-110 transition-transform">leaderboard</span>
                <h3 className="text-[#dee5ff] font-bold mb-1">Leaderboard</h3>
                <p className="text-[#9baad6] text-sm">See top contributors in the community</p>
              </Link>
            </>
          )}
          {role === 'SENIOR_STUDENT' && (
            <>
              <Link to="/queries" className="bg-[#0c1427]/80 rounded-2xl p-6 border border-white/5 hover:border-primary/30 transition-all group">
                <span className="material-symbols-outlined text-primary text-3xl mb-3 block group-hover:scale-110 transition-transform">forum</span>
                <h3 className="text-[#dee5ff] font-bold mb-1">Answer Queries</h3>
                <p className="text-[#9baad6] text-sm">Help juniors with their questions</p>
              </Link>
              <Link to="/networking" className="bg-[#0c1427]/80 rounded-2xl p-6 border border-white/5 hover:border-primary/30 transition-all group">
                <span className="material-symbols-outlined text-primary text-3xl mb-3 block group-hover:scale-110 transition-transform">groups</span>
                <h3 className="text-[#dee5ff] font-bold mb-1">Network</h3>
                <p className="text-[#9baad6] text-sm">Connect with alumni and mentors</p>
              </Link>
              <Link to="/resume" className="bg-[#0c1427]/80 rounded-2xl p-6 border border-white/5 hover:border-primary/30 transition-all group">
                <span className="material-symbols-outlined text-primary text-3xl mb-3 block group-hover:scale-110 transition-transform">description</span>
                <h3 className="text-[#dee5ff] font-bold mb-1">Resume Review</h3>
                <p className="text-[#9baad6] text-sm">Get your resume reviewed by alumni</p>
              </Link>
            </>
          )}
          {(role === 'ALUMNI' || role === 'MENTOR') && (
            <>
              <Link to="/queries" className="bg-[#0c1427]/80 rounded-2xl p-6 border border-white/5 hover:border-primary/30 transition-all group">
                <span className="material-symbols-outlined text-primary text-3xl mb-3 block group-hover:scale-110 transition-transform">mark_chat_read</span>
                <h3 className="text-[#dee5ff] font-bold mb-1">Answer Queries</h3>
                <p className="text-[#9baad6] text-sm">Respond to student questions and earn points</p>
              </Link>
              <Link to="/networking" className="bg-[#0c1427]/80 rounded-2xl p-6 border border-white/5 hover:border-primary/30 transition-all group">
                <span className="material-symbols-outlined text-primary text-3xl mb-3 block group-hover:scale-110 transition-transform">person_add</span>
                <h3 className="text-[#dee5ff] font-bold mb-1">Mentees</h3>
                <p className="text-[#9baad6] text-sm">Manage your mentee connections</p>
              </Link>
              <Link to="/profile" className="bg-[#0c1427]/80 rounded-2xl p-6 border border-white/5 hover:border-primary/30 transition-all group">
                <span className="material-symbols-outlined text-primary text-3xl mb-3 block group-hover:scale-110 transition-transform">manage_accounts</span>
                <h3 className="text-[#dee5ff] font-bold mb-1">Update Profile</h3>
                <p className="text-[#9baad6] text-sm">Keep your expertise and experience current</p>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* My Recent Queries */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black text-[#dee5ff]">My Recent Queries</h2>
          <Link to="/queries" className="text-primary text-sm font-bold hover:underline flex items-center gap-1">
            View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
        {recentQueries.length === 0 ? (
          <div className="bg-[#0c1427]/80 rounded-2xl p-8 border border-white/5 text-center">
            <span className="material-symbols-outlined text-[#9baad6] text-4xl mb-3 block">forum</span>
            <p className="text-[#9baad6]">No queries yet. Ask your first question!</p>
            <Link to="/queries" className="mt-4 inline-block px-6 py-2 bg-primary/20 text-primary rounded-xl font-bold text-sm hover:bg-primary/30 transition-all">
              Browse Query Feed
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentQueries.map((q) => (
              <Link
                key={q.id}
                to={`/query/${q.id}`}
                className="flex items-center gap-4 bg-[#0c1427]/80 rounded-2xl p-4 border border-white/5 hover:border-primary/20 transition-all group"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[#dee5ff] font-bold truncate group-hover:text-primary transition-colors">{q.title}</p>
                  <p className="text-[#9baad6] text-xs mt-1">
                    {formatDate(q.createdAt)} · {q.responseCount ?? 0} responses
                    {q.tags && ` · ${q.tags.split(',')[0].trim()}`}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusBadge(q.status)}`}>
                  {q.status}
                </span>
                {q.isPopular && (
                  <span className="px-2 py-1 rounded-full text-xs font-bold bg-yellow-500/20 text-yellow-300">
                    🔥 Popular
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Assigned Queries (for seniors/alumni/mentors) */}
      {['SENIOR_STUDENT', 'ALUMNI', 'MENTOR'].includes(role) && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-[#dee5ff]">Queries Assigned to Me</h2>
            <Link to="/queries" className="text-primary text-sm font-bold hover:underline flex items-center gap-1">
              View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
          {assignedQueries.length === 0 ? (
            <div className="bg-[#0c1427]/80 rounded-2xl p-8 border border-white/5 text-center">
              <span className="material-symbols-outlined text-[#9baad6] text-4xl mb-3 block">inbox</span>
              <p className="text-[#9baad6]">No queries assigned to you yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {assignedQueries.map((q) => (
                <Link
                  key={q.id}
                  to={`/query/${q.id}`}
                  className="flex items-center gap-4 bg-[#0c1427]/80 rounded-2xl p-4 border border-white/5 hover:border-primary/20 transition-all group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[#dee5ff] font-bold truncate group-hover:text-primary transition-colors">{q.title}</p>
                    <p className="text-[#9baad6] text-xs mt-1">
                      From: {q.studentName} · {formatDate(q.createdAt)}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusBadge(q.status)}`}>
                    {q.status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Profile Completeness */}
      <div className="bg-[#0c1427]/80 rounded-2xl p-6 border border-white/5">
        <h2 className="text-lg font-black text-[#dee5ff] mb-4">Profile Completeness</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Full Name', value: user?.fullName, icon: 'person' },
            { label: 'Email Verified', value: user?.emailVerified, icon: 'verified' },
            { label: 'Bio', value: user?.bio, icon: 'edit_note' },
            { label: 'Profile Picture', value: user?.profilePicture, icon: 'photo_camera' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.03]">
              <span className={`material-symbols-outlined text-sm ${item.value ? 'text-green-400' : 'text-[#9baad6]'}`}>
                {item.value ? 'check_circle' : 'radio_button_unchecked'}
              </span>
              <span className="text-xs text-[#9baad6]">{item.label}</span>
            </div>
          ))}
        </div>
        <Link to="/profile" className="mt-4 inline-block text-primary text-sm font-bold hover:underline">
          Complete your profile →
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
