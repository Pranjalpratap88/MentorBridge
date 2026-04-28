import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useHistory } from '../../context/HistoryContext';
import notificationService from '../../services/notificationService';

const Layout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { canGoBack, goBack } = useHistory();
    const [unreadCount, setUnreadCount] = useState(0);

    const isAdmin = user?.roles?.includes('ADMIN');
    const homePath = isAdmin ? '/admin' : '/dashboard';
    const isOnHomePage = location.pathname === homePath;

    // Back button logic:
    // - On home page (dashboard/admin): dimmed, nowhere to go
    // - On any other page: always enabled — go back in history, or fall back to home
    const backEnabled = !isOnHomePage;

    const handleBack = () => {
        if (canGoBack) {
            goBack(homePath);
        } else {
            // No tracked history but not on home — go home
            navigate(homePath);
        }
    };

    // Poll unread notification count every 30 seconds
    useEffect(() => {
        const fetchCount = async () => {
            try {
                const res = await notificationService.getUnreadCount();
                setUnreadCount(res.data?.count ?? 0);
            } catch {
                // silently ignore — user may not be authenticated yet
            }
        };
        fetchCount();
        const interval = setInterval(fetchCount, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { name: 'Dashboard',    path: '/dashboard',  icon: 'grid_view' },
        { name: 'Query Feed',   path: '/queries',    icon: 'dynamic_feed' },
        { name: 'Resume',       path: '/resume',     icon: 'description' },
        { name: 'Networking',   path: '/networking', icon: 'hub' },
        { name: 'Leaderboard',  path: '/leaderboard',icon: 'insights' },
        { name: 'Profile',      path: '/profile',    icon: 'person' },
        { name: 'Feedback',     path: '/feedback',   icon: 'rate_review' },
    ];

    // Admin-only menu items
    const adminMenuItems = [
        { name: 'Admin Panel',  path: '/admin',      icon: 'admin_panel_settings' },
    ];

    const isActive = (path) => location.pathname === path;

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <div className="dark min-h-screen bg-[#060e1d] text-[#dee5ff] font-body flex">

            {/* ── Sidebar ─────────────────────────────────────────────────── */}
            <aside className="h-screen w-56 fixed left-0 top-0 flex flex-col bg-[#0c1427]/90 backdrop-blur-3xl border-r border-white/[0.04] z-50">
                <div className="flex flex-col h-full px-4 py-5">

                    {/* Brand */}
                    <Link to={isAdmin ? '/admin' : '/dashboard'} className="flex items-center gap-2.5 mb-6 group">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-primary-container flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                            <span className="material-symbols-outlined text-on-primary text-base">hub</span>
                        </div>
                        <div>
                            <h1 className="text-sm font-black text-[#dee5ff] tracking-tight leading-none">MentorBridge</h1>
                            <p className="text-[9px] text-primary tracking-[0.25em] uppercase font-bold mt-0.5">The Nexus</p>
                        </div>
                    </Link>

                    {/* Nav */}
                    <nav className="flex-1 flex flex-col gap-0.5">
                        {isAdmin ? (
                            /* ── Admin: only Admin Panel ── */
                            <>
                                <p className="text-[9px] font-black text-red-400/40 uppercase tracking-[0.2em] mb-2 ml-2">Admin</p>
                                {adminMenuItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        to={item.path}
                                        className={`px-3 py-2 flex items-center gap-2.5 rounded-xl text-xs font-semibold transition-all duration-200 relative ${
                                            isActive(item.path)
                                                ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                                : 'text-red-400/60 hover:text-red-400 hover:bg-red-500/[0.06]'
                                        }`}
                                    >
                                        <span className="material-symbols-outlined text-base">{item.icon}</span>
                                        {item.name}
                                        {isActive(item.path) && (
                                            <div className="absolute left-0 w-1 h-4 bg-red-400 rounded-r-full" />
                                        )}
                                    </Link>
                                ))}
                            </>
                        ) : (
                            /* ── Regular user: full nav ── */
                            <>
                                <p className="text-[9px] font-black text-[#9baad6]/40 uppercase tracking-[0.2em] mb-2 ml-2">Navigation</p>
                                {menuItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        to={item.path}
                                        className={`px-3 py-2 flex items-center gap-2.5 rounded-xl text-xs font-semibold transition-all duration-200 relative ${
                                            isActive(item.path)
                                                ? 'bg-primary/10 text-primary border border-primary/20'
                                                : 'text-[#9baad6] hover:text-[#dee5ff] hover:bg-white/[0.04]'
                                        }`}
                                    >
                                        <span className={`material-symbols-outlined text-base ${isActive(item.path) ? 'text-primary' : ''}`}>
                                            {item.icon}
                                        </span>
                                        {item.name}
                                        {isActive(item.path) && (
                                            <div className="absolute left-0 w-1 h-4 bg-primary rounded-r-full" />
                                        )}
                                    </Link>
                                ))}
                            </>
                        )}
                    </nav>

                    {/* User footer */}
                    <div className="mt-auto pt-4 border-t border-white/[0.04]">
                        <div className="flex items-center gap-2.5 mb-3 px-1">
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 overflow-hidden ${isAdmin ? 'bg-red-500/20 text-red-400' : 'bg-primary/20 text-primary'}`}>
                                {user?.profilePicture
                                    ? <img src={user.profilePicture} alt="User" className="w-full h-full object-cover" />
                                    : isAdmin
                                    ? <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
                                    : getInitials(user?.fullName)
                                }
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-[#dee5ff] truncate leading-tight">{user?.fullName || 'User'}</p>
                                <p className={`text-[9px] truncate ${isAdmin ? 'text-red-400/70' : 'text-[#9baad6]'}`}>
                                    {isAdmin ? 'Administrator' : user?.userRole?.replace('_', ' ') || 'Member'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all flex items-center justify-center gap-1.5"
                        >
                            <span className="material-symbols-outlined text-sm">logout</span>
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* ── Main area ───────────────────────────────────────────────── */}
            <div className="flex-1 ml-56 flex flex-col min-h-screen">

                {/* Top bar */}
                <header className="sticky top-0 z-40 bg-[#060e1d]/70 backdrop-blur-3xl flex justify-between items-center w-full px-6 py-3 border-b border-white/[0.04]">
                    <div className="flex items-center gap-4 flex-1">
                        <button
                            onClick={handleBack}
                            disabled={!backEnabled}
                            className={`w-8 h-8 flex items-center justify-center rounded-lg border border-white/5 transition-all active:scale-90 ${
                                backEnabled
                                    ? 'text-[#9baad6] hover:text-[#dee5ff] bg-white/[0.03] hover:bg-white/[0.06] cursor-pointer'
                                    : 'text-[#9baad6]/25 bg-white/[0.02] cursor-not-allowed'
                            }`}
                            title={backEnabled ? 'Go back' : "You're on the home page"}
                        >
                            <span className="material-symbols-outlined text-sm">arrow_back_ios_new</span>
                        </button>

                        <div className="relative w-full max-w-xs hidden md:block">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#9baad6] text-base">search</span>
                            <input
                                className="w-full bg-white/[0.04] border border-white/[0.04] focus:border-primary/30 rounded-xl py-2 pl-9 pr-4 text-[#dee5ff] placeholder:text-[#9baad6]/30 transition-all outline-none text-xs"
                                placeholder="Search..."
                                type="text"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {!isAdmin && (
                            <Link
                                to="/notifications"
                                className="w-8 h-8 flex items-center justify-center text-[#9baad6] hover:text-primary hover:bg-primary/10 rounded-lg transition-all relative"
                            >
                                <span className="material-symbols-outlined text-base">notifications</span>
                                {unreadCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-primary rounded-full flex items-center justify-center text-[9px] font-black text-on-primary px-0.5 border border-[#060e1d]">
                                        {unreadCount > 99 ? '99+' : unreadCount}
                                    </span>
                                )}
                            </Link>
                        )}

                        {isAdmin ? (
                            /* Admin: just show name + admin badge, no profile link */
                            <div className="flex items-center gap-2">
                                <div className="text-right hidden sm:block">
                                    <p className="text-[9px] font-bold text-red-400 uppercase tracking-wider">Administrator</p>
                                    <p className="text-xs font-bold text-[#dee5ff] leading-tight">
                                        {user?.fullName?.split(' ')[0] || 'Admin'}
                                    </p>
                                </div>
                                <div className="w-8 h-8 rounded-xl border border-red-500/30 overflow-hidden bg-red-500/20 flex items-center justify-center text-red-400 text-xs font-bold">
                                    <span className="material-symbols-outlined text-base">admin_panel_settings</span>
                                </div>
                            </div>
                        ) : (
                            <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                                <div className="text-right hidden sm:block">
                                    <p className="text-[9px] font-bold text-primary uppercase tracking-wider">
                                        {user?.userRole?.replace('_', ' ') || 'Member'}
                                    </p>
                                    <p className="text-xs font-bold text-[#dee5ff] leading-tight">
                                        {user?.fullName?.split(' ')[0] || 'User'}
                                    </p>
                                </div>
                                <div className="w-8 h-8 rounded-xl border border-primary/20 overflow-hidden bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                                    {user?.profilePicture
                                        ? <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                                        : getInitials(user?.fullName)
                                    }
                                </div>
                            </Link>
                        )}
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1">
                    <Outlet />
                </main>

                {/* Footer */}
                <footer className="w-full py-4 px-6 border-t border-white/[0.04] bg-[#060e1d]">
                    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-black text-[#dee5ff]">MentorBridge</span>
                            <p className="text-[9px] font-bold text-[#9baad6] uppercase tracking-widest hidden sm:block">v1.0</p>
                        </div>
                        <div className="flex gap-6">
                            <Link className="text-[9px] font-bold uppercase tracking-widest text-[#9baad6] hover:text-primary transition-all" to="/privacy">Privacy</Link>
                            <Link className="text-[9px] font-bold uppercase tracking-widest text-[#9baad6] hover:text-primary transition-all" to="/terms">Terms</Link>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default Layout;
