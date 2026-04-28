import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';

const roleColors = {
  STUDENT: { badge: 'bg-blue-500/20 text-blue-300', label: 'Student' },
  SENIOR_STUDENT: { badge: 'bg-purple-500/20 text-purple-300', label: 'Senior Student' },
  ALUMNI: { badge: 'bg-emerald-500/20 text-emerald-300', label: 'Alumni' },
  MENTOR: { badge: 'bg-orange-500/20 text-orange-300', label: 'Mentor' },
};

const Networking = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState('ALL');
  const [filterCollege, setFilterCollege] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        let res;
        if (filterRole === 'ALL') {
          res = await userService.getNetworkUsers();
        } else {
          res = await userService.getUsersByRole(filterRole);
        }
        setUsers(res.data || []);
      } catch (err) {
        console.error('Networking fetch error:', err);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [filterRole]);

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Get unique colleges and industries for filter dropdowns
  const colleges = [...new Set(users.map(u => u.college).filter(Boolean))];
  const industries = [...new Set(users.map(u => u.industry).filter(Boolean))];

  const filteredUsers = users.filter(u => {
    if (filterCollege && u.college !== filterCollege) return false;
    if (filterIndustry && u.industry !== filterIndustry) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        u.fullName?.toLowerCase().includes(q) ||
        u.college?.toLowerCase().includes(q) ||
        u.currentCompany?.toLowerCase().includes(q) ||
        u.currentPosition?.toLowerCase().includes(q) ||
        u.bio?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="px-8 py-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-4xl font-black text-[#dee5ff] tracking-tight">Network</h1>
          <p className="text-[#9baad6] mt-1">Connect with seniors, alumni, and industry mentors</p>
        </div>
        <div className="text-right">
          <p className="text-[#9baad6] text-sm">{filteredUsers.length} people found</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {/* Role filter */}
        <div className="flex gap-1 bg-[#0c1427]/60 p-1 rounded-xl">
          {['ALL', 'SENIOR_STUDENT', 'ALUMNI', 'MENTOR'].map(role => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                filterRole === role
                  ? 'bg-primary text-on-primary'
                  : 'text-[#9baad6] hover:text-[#dee5ff]'
              }`}
            >
              {role.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* College filter */}
        {colleges.length > 0 && (
          <select
            value={filterCollege}
            onChange={e => setFilterCollege(e.target.value)}
            className="bg-[#0c1427]/80 border border-white/10 text-[#9baad6] text-sm px-4 py-2 rounded-xl focus:border-primary/50 focus:outline-none"
          >
            <option value="">All Colleges</option>
            {colleges.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        )}

        {/* Industry filter */}
        {industries.length > 0 && (
          <select
            value={filterIndustry}
            onChange={e => setFilterIndustry(e.target.value)}
            className="bg-[#0c1427]/80 border border-white/10 text-[#9baad6] text-sm px-4 py-2 rounded-xl focus:border-primary/50 focus:outline-none"
          >
            <option value="">All Industries</option>
            {industries.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        )}

        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#9baad6] text-lg">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name, company, college..."
            className="w-full bg-[#0c1427]/80 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-[#dee5ff] placeholder-[#9baad6]/40 text-sm focus:border-primary/50 focus:outline-none"
          />
        </div>
      </div>

      {/* Users Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-[#0c1427]/80 rounded-2xl p-12 border border-white/5 text-center">
          <span className="material-symbols-outlined text-[#9baad6] text-5xl mb-4 block">group_off</span>
          <p className="text-[#dee5ff] font-bold text-lg mb-2">No users found</p>
          <p className="text-[#9baad6] text-sm">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map(u => {
            const rc = roleColors[u.userRole] || { badge: 'bg-gray-500/20 text-gray-400', label: u.userRole };
            return (
              <div
                key={u.id}
                className="bg-[#0c1427]/80 rounded-2xl p-6 border border-white/5 hover:border-primary/20 transition-all group flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary font-black text-xl overflow-hidden border border-white/10">
                    {u.profilePicture ? (
                      <img src={u.profilePicture} alt={u.fullName} className="w-full h-full object-cover" />
                    ) : getInitials(u.fullName)}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${rc.badge}`}>
                    {rc.label}
                  </span>
                </div>

                <div className="flex-1">
                  <h3 className="text-[#dee5ff] font-black text-lg group-hover:text-primary transition-colors mb-1">
                    {u.fullName}
                  </h3>

                  {u.currentPosition && u.currentCompany && (
                    <p className="text-primary/80 text-sm font-medium mb-1">
                      {u.currentPosition} @ {u.currentCompany}
                    </p>
                  )}

                  {u.college && (
                    <p className="text-[#9baad6] text-xs flex items-center gap-1 mb-1">
                      <span className="material-symbols-outlined text-xs">school</span>
                      {u.college}
                      {u.graduationYear && ` · ${u.graduationYear}`}
                    </p>
                  )}

                  {u.bio && (
                    <p className="text-[#9baad6] text-xs line-clamp-2 mt-2">{u.bio}</p>
                  )}

                  {/* Skills/tags */}
                  {(u.industry || u.branch || u.degree) && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {u.industry && (
                        <span className="px-2 py-0.5 rounded-lg bg-white/5 text-[#9baad6] text-xs">{u.industry}</span>
                      )}
                      {u.branch && (
                        <span className="px-2 py-0.5 rounded-lg bg-white/5 text-[#9baad6] text-xs">{u.branch}</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-1 text-primary text-xs font-bold">
                    <span className="material-symbols-outlined text-sm">star</span>
                    {u.reputationPoints ?? 0} pts
                  </div>
                  {u.linkedinProfile && (
                    <a
                      href={u.linkedinProfile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#9baad6] hover:text-primary transition-colors"
                      onClick={e => e.stopPropagation()}
                    >
                      <span className="material-symbols-outlined text-sm">open_in_new</span>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Networking;
