import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';

const ConnectionRequests = () => {
  const { user } = useAuth();
  const [networkUsers, setNetworkUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('discover');

  useEffect(() => {
    const fetchNetwork = async () => {
      try {
        const res = await userService.getNetworkUsers();
        setNetworkUsers(res.data || []);
      } catch (err) {
        console.error('Network fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchNetwork();
  }, [user]);

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const roleColors = {
    STUDENT: 'bg-blue-500/20 text-blue-300',
    SENIOR_STUDENT: 'bg-purple-500/20 text-purple-300',
    ALUMNI: 'bg-emerald-500/20 text-emerald-300',
    MENTOR: 'bg-orange-500/20 text-orange-300',
  };

  return (
    <div className="px-8 py-10 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-black text-[#dee5ff] tracking-tight">Network Hub</h1>
        <p className="text-[#9baad6] mt-1">Discover and connect with seniors, alumni, and mentors</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#0c1427]/60 p-1 rounded-xl w-fit">
        {[
          { key: 'discover', label: 'Discover' },
          { key: 'stats', label: 'My Stats' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === tab.key
                ? 'bg-primary text-on-primary'
                : 'text-[#9baad6] hover:text-[#dee5ff]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'discover' && (
        <>
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : networkUsers.length === 0 ? (
            <div className="bg-[#0c1427]/80 rounded-2xl p-12 border border-white/5 text-center">
              <span className="material-symbols-outlined text-[#9baad6] text-5xl mb-4 block">group_off</span>
              <p className="text-[#dee5ff] font-bold text-lg mb-2">No connections found</p>
              <p className="text-[#9baad6] text-sm">The network will grow as more users join.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {networkUsers.map(u => (
                <div key={u.id} className="bg-[#0c1427]/80 rounded-2xl p-6 border border-white/5 hover:border-primary/20 transition-all group flex flex-col gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-black text-lg overflow-hidden flex-shrink-0">
                      {u.profilePicture ? (
                        <img src={u.profilePicture} alt={u.fullName} className="w-full h-full object-cover" />
                      ) : getInitials(u.fullName)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-[#dee5ff] font-black group-hover:text-primary transition-colors truncate">
                          {u.fullName}
                        </h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold flex-shrink-0 ${roleColors[u.userRole] || 'bg-gray-500/20 text-gray-400'}`}>
                          {u.userRole?.replace('_', ' ')}
                        </span>
                      </div>
                      {u.currentPosition && u.currentCompany && (
                        <p className="text-primary/70 text-sm font-medium truncate">
                          {u.currentPosition} @ {u.currentCompany}
                        </p>
                      )}
                      {u.college && (
                        <p className="text-[#9baad6] text-xs flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">school</span>
                          {u.college}
                        </p>
                      )}
                    </div>
                  </div>

                  {u.bio && (
                    <p className="text-[#9baad6] text-sm line-clamp-2 italic border-l-2 border-primary/20 pl-3">
                      "{u.bio}"
                    </p>
                  )}

                  <div className="flex gap-2 mt-auto">
                    <Link
                      to="/queries"
                      state={{ assignedToId: u.id, assignedToName: u.fullName }}
                      className="flex-1 py-2.5 text-center bg-primary/10 text-primary rounded-xl text-sm font-bold hover:bg-primary/20 transition-all"
                    >
                      Send Query
                    </Link>
                    {u.linkedinProfile && (
                      <a
                        href={u.linkedinProfile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 bg-white/5 text-[#9baad6] rounded-xl hover:bg-white/10 hover:text-primary transition-all"
                      >
                        <span className="material-symbols-outlined text-lg">open_in_new</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-[#0c1427]/80 rounded-2xl p-6 border border-white/5">
            <p className="text-[#9baad6] text-xs font-bold uppercase tracking-widest mb-3">Your Reputation</p>
            <p className="text-4xl font-black text-primary">{user?.reputationPoints ?? 0}</p>
            <p className="text-[#9baad6] text-xs mt-1">points earned</p>
          </div>
          <div className="bg-[#0c1427]/80 rounded-2xl p-6 border border-white/5">
            <p className="text-[#9baad6] text-xs font-bold uppercase tracking-widest mb-3">Network Size</p>
            <p className="text-4xl font-black text-[#dee5ff]">{networkUsers.length}</p>
            <p className="text-[#9baad6] text-xs mt-1">available connections</p>
          </div>
          <div className="bg-[#0c1427]/80 rounded-2xl p-6 border border-white/5">
            <p className="text-[#9baad6] text-xs font-bold uppercase tracking-widest mb-3">Your Role</p>
            <p className="text-xl font-black text-[#dee5ff]">{user?.userRole?.replace('_', ' ')}</p>
            <p className="text-[#9baad6] text-xs mt-1">{user?.college || user?.currentCompany || ''}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectionRequests;
