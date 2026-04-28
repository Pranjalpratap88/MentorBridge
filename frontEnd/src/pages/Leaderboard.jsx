import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';

const roleColors = {
  STUDENT: 'bg-blue-500/20 text-blue-300',
  SENIOR_STUDENT: 'bg-purple-500/20 text-purple-300',
  ALUMNI: 'bg-emerald-500/20 text-emerald-300',
  MENTOR: 'bg-orange-500/20 text-orange-300',
};

const Leaderboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState('ALL');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        let res;
        if (filterRole === 'ALL') {
          res = await userService.getLeaderboard();
        } else {
          res = await userService.getUsersByRole(filterRole);
        }
        setUsers(res.data || []);
      } catch (err) {
        console.error('Leaderboard fetch error:', err);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [filterRole]);

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const top3 = users.slice(0, 3);
  const rest = users.slice(3);
  const currentUserRank = users.findIndex(u => u.id === user?.id) + 1;

  return (
    <div className="px-8 py-10 max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <span className="text-primary text-xs font-bold uppercase tracking-widest">Elite Performance</span>
          <h1 className="text-4xl font-black text-[#dee5ff] tracking-tight mt-1">Leaderboard</h1>
          <p className="text-[#9baad6] mt-1">Top contributors ranked by reputation points</p>
        </div>
        {currentUserRank > 0 && (
          <div className="bg-primary/10 border border-primary/20 rounded-xl px-4 py-3 text-center">
            <p className="text-[#9baad6] text-xs font-bold uppercase tracking-widest">Your Rank</p>
            <p className="text-3xl font-black text-primary">#{currentUserRank}</p>
          </div>
        )}
      </div>

      {/* Role Filter */}
      <div className="flex gap-2 flex-wrap">
        {['ALL', 'STUDENT', 'SENIOR_STUDENT', 'ALUMNI', 'MENTOR'].map(role => (
          <button
            key={role}
            onClick={() => setFilterRole(role)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
              filterRole === role
                ? 'bg-primary text-on-primary'
                : 'bg-[#0c1427]/80 text-[#9baad6] hover:text-[#dee5ff] border border-white/5'
            }`}
          >
            {role.replace('_', ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : users.length === 0 ? (
        <div className="bg-[#0c1427]/80 rounded-2xl p-12 border border-white/5 text-center">
          <span className="material-symbols-outlined text-[#9baad6] text-5xl mb-4 block">leaderboard</span>
          <p className="text-[#9baad6]">No users found for this filter.</p>
        </div>
      ) : (
        <>
          {/* Top 3 Podium */}
          {top3.length >= 3 && (
            <div className="grid grid-cols-3 gap-4 items-end mb-8">
              {/* Rank 2 */}
              <div className="flex flex-col items-center">
                <div className="bg-[#0c1427]/80 rounded-2xl p-6 border border-white/5 w-full text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black text-xl mx-auto mb-3 overflow-hidden">
                    {top3[1]?.profilePicture ? (
                      <img src={top3[1].profilePicture} alt={top3[1].fullName} className="w-full h-full object-cover" />
                    ) : getInitials(top3[1]?.fullName)}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#9baad6]/20 text-[#9baad6] font-black text-sm flex items-center justify-center mx-auto mb-2">#2</div>
                  <p className="text-[#dee5ff] font-bold text-sm truncate">{top3[1]?.fullName}</p>
                  <p className="text-[#9baad6] text-xs truncate">{top3[1]?.college || top3[1]?.currentCompany || ''}</p>
                  <p className="text-primary font-black mt-2">{top3[1]?.reputationPoints ?? 0} pts</p>
                </div>
              </div>

              {/* Rank 1 */}
              <div className="flex flex-col items-center">
                <div className="bg-[#0c1427]/80 rounded-2xl p-6 border border-primary/30 shadow-[0_0_30px_rgba(144,147,255,0.15)] w-full text-center relative">
                  <span className="material-symbols-outlined text-yellow-400 text-4xl absolute -top-5 left-1/2 -translate-x-1/2">emoji_events</span>
                  <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black text-2xl mx-auto mb-3 mt-2 overflow-hidden border-2 border-primary/40">
                    {top3[0]?.profilePicture ? (
                      <img src={top3[0].profilePicture} alt={top3[0].fullName} className="w-full h-full object-cover" />
                    ) : getInitials(top3[0]?.fullName)}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-primary text-on-primary font-black text-sm flex items-center justify-center mx-auto mb-2">#1</div>
                  <p className="text-[#dee5ff] font-black truncate">{top3[0]?.fullName}</p>
                  <p className="text-[#9baad6] text-xs truncate">{top3[0]?.college || top3[0]?.currentCompany || ''}</p>
                  <p className="text-primary font-black text-lg mt-2">{top3[0]?.reputationPoints ?? 0} pts</p>
                  {top3[0]?.id === user?.id && (
                    <span className="text-xs text-primary font-bold">That's you! 🎉</span>
                  )}
                </div>
              </div>

              {/* Rank 3 */}
              <div className="flex flex-col items-center">
                <div className="bg-[#0c1427]/80 rounded-2xl p-6 border border-white/5 w-full text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black text-xl mx-auto mb-3 overflow-hidden">
                    {top3[2]?.profilePicture ? (
                      <img src={top3[2].profilePicture} alt={top3[2].fullName} className="w-full h-full object-cover" />
                    ) : getInitials(top3[2]?.fullName)}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#9baad6]/20 text-[#9baad6] font-black text-sm flex items-center justify-center mx-auto mb-2">#3</div>
                  <p className="text-[#dee5ff] font-bold text-sm truncate">{top3[2]?.fullName}</p>
                  <p className="text-[#9baad6] text-xs truncate">{top3[2]?.college || top3[2]?.currentCompany || ''}</p>
                  <p className="text-primary font-black mt-2">{top3[2]?.reputationPoints ?? 0} pts</p>
                </div>
              </div>
            </div>
          )}

          {/* Full Rankings List */}
          <div className="space-y-2">
            {users.map((u, index) => (
              <div
                key={u.id}
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                  u.id === user?.id
                    ? 'bg-primary/10 border-primary/30'
                    : 'bg-[#0c1427]/80 border-white/5 hover:border-white/10'
                }`}
              >
                <span className={`w-8 text-center font-black text-sm ${
                  index === 0 ? 'text-yellow-400' :
                  index === 1 ? 'text-[#9baad6]' :
                  index === 2 ? 'text-amber-600' :
                  'text-[#9baad6]/50'
                }`}>
                  #{index + 1}
                </span>

                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold text-sm overflow-hidden flex-shrink-0">
                  {u.profilePicture ? (
                    <img src={u.profilePicture} alt={u.fullName} className="w-full h-full object-cover" />
                  ) : getInitials(u.fullName)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[#dee5ff] font-bold text-sm truncate">{u.fullName}</p>
                    {u.id === user?.id && <span className="text-xs text-primary font-bold">(You)</span>}
                  </div>
                  <p className="text-[#9baad6] text-xs truncate">
                    {u.college || u.currentCompany || u.username}
                  </p>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${roleColors[u.userRole] || 'bg-gray-500/20 text-gray-400'}`}>
                  {u.userRole?.replace('_', ' ')}
                </span>

                <div className="text-right">
                  <p className="text-[#dee5ff] font-black text-sm">{u.reputationPoints ?? 0}</p>
                  <p className="text-[#9baad6] text-xs">pts</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Leaderboard;
