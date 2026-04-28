import React from 'react';
import { Link } from 'react-router-dom';

const Error404Page = () => {
    return (
        <React.Fragment>
            {/* TopNavBar */}
<header className="bg-[#060e20]/80 backdrop-blur-xl docked full-width top-0 sticky z-50 tonal-shift bg-slate-900/50 shadow-[0px_20px_40px_rgba(0,0,0,0.4)]">
<div className="flex justify-between items-center w-full px-8 py-4 max-w-[1440px] mx-auto">
<div className="flex items-center gap-8">
<span className="text-2xl font-bold tracking-tight text-indigo-400">MentorBridge</span>
<div className="hidden md:flex items-center gap-6">
<Link className="text-slate-400 hover:text-indigo-300 transition-colors" to="/">Pathways</Link>
<Link className="text-slate-400 hover:text-indigo-300 transition-colors" to="/explore">Mentors</Link>
<Link className="text-slate-400 hover:text-indigo-300 transition-colors" to="/">Pulse</Link>
</div>
</div>
<div className="flex items-center gap-4">
<div className="flex items-center gap-2 mr-4">
<button className="p-2 text-slate-400 hover:text-indigo-300 transition-colors">
<span className="material-symbols-outlined" data-icon="notifications">notifications</span>
</button>
<button className="p-2 text-slate-400 hover:text-indigo-300 transition-colors">
<span className="material-symbols-outlined" data-icon="history">history</span>
</button>
<button className="p-2 text-indigo-400 hover:text-indigo-300 transition-colors">
<span className="material-symbols-outlined" data-icon="workspace_premium" >workspace_premium</span>
</button>
</div>
<div className="h-10 w-10 rounded-full bg-surface-container-high overflow-hidden border border-outline-variant/30 active:scale-95 duration-150">
<img alt="User profile" className="w-full h-full object-cover" data-alt="Professional headshot of a smiling young man in a clean studio setting with soft lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-3DMzBnP_8fAMT11VJHP_f8omg6X7PupMn_9GkHsXfNsK6usifrwSN-CyLrHxoGPmk3dbCbfbv59eRH70frcrM8FhQbDh2IbrxyRcVnO72WTHt9CbjPzFSGApQV2266L_N4svjxXuF0n4EEuff637VcAe_w9J0S2IG-aWEYrP1DTjulErX8kTpSJ98DXFEgXRUC_tEDevMuMIzUy4vhUz2-I9Ah6HtXBsdxdEB1pTHAGoV1VQylUHF7h87KlW0tM5_b2Tz1Hht8DW" />
</div>
</div>
</div>
</header>
<div className="flex min-h-[calc(100vh-72px)]">
{/* SideNavBar */}
<aside className="hidden md:flex flex-col h-[calc(100vh-72px)] w-72 sticky top-[72px] left-0 py-8 px-6 gap-y-4 bg-[#060e20] tonal-shift bg-slate-900/20">
<div className="flex items-center gap-3 px-2 mb-6">
<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center">
<span className="material-symbols-outlined text-on-primary" data-icon="hub" >hub</span>
</div>
<div>
<h2 className="text-indigo-400 font-black text-xl leading-tight">Luminous Nexus</h2>
<p className="text-slate-500 text-xs font-medium uppercase tracking-widest">Expert Network</p>
</div>
</div>
<nav className="flex-1 space-y-1">
{/* Navigation Items */}
<Link className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-800/40 hover:text-slate-200 transition-all rounded-xl group active:scale-[0.98]" to="/">
<span className="material-symbols-outlined" data-icon="search">search</span>
<span className="font-medium text-sm">Discover</span>
</Link>
<Link className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-800/40 hover:text-slate-200 transition-all rounded-xl group active:scale-[0.98]" to="/">
<span className="material-symbols-outlined" data-icon="group">group</span>
<span className="font-medium text-sm">Connections</span>
</Link>
<Link className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-800/40 hover:text-slate-200 transition-all rounded-xl group active:scale-[0.98]" to="/resume">
<span className="material-symbols-outlined" data-icon="description">description</span>
<span className="font-medium text-sm">Resume</span>
</Link>
<Link className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-800/40 hover:text-slate-200 transition-all rounded-xl group active:scale-[0.98]" to="/">
<span className="material-symbols-outlined" data-icon="military_tech">military_tech</span>
<span className="font-medium text-sm">Rewards</span>
</Link>
<Link className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-800/40 hover:text-slate-200 transition-all rounded-xl group active:scale-[0.98]" to="/queries">
<span className="material-symbols-outlined" data-icon="manage_search">manage_search</span>
<span className="font-medium text-sm">Queries</span>
</Link>
<Link className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-800/40 hover:text-slate-200 transition-all rounded-xl group active:scale-[0.98]" to="/settings">
<span className="material-symbols-outlined" data-icon="settings">settings</span>
<span className="font-medium text-sm">Settings</span>
</Link>
</nav>
<div className="mt-auto space-y-4">
<div className="p-4 rounded-2xl bg-surface-container-high relative overflow-hidden group">
<div className="relative z-10">
<p className="text-sm font-bold text-on-surface mb-1">Upgrade to Pro</p>
<p className="text-xs text-on-surface-variant mb-3">Access elite mentorship channels.</p>
<button className="w-full py-2 bg-gradient-to-r from-primary to-primary-container rounded-lg text-xs font-bold text-on-primary shadow-[0px_0px_15px_rgba(144,147,255,0.3)]">Elevate Now</button>
</div>
<div className="absolute -right-4 -bottom-4 w-20 h-20 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors"></div>
</div>
<Link className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-800/40 hover:text-slate-200 transition-all rounded-xl active:scale-[0.98]" to="/knowledge-base">
<span className="material-symbols-outlined" data-icon="help">help</span>
<span className="font-medium text-sm">Help Center</span>
</Link>
</div>
</aside>
{/* Main Content Area */}
<main className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden">
{/* Background Decorative Elements */}
<div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
<div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none"></div>
{/* 404 Illustration & Content */}
<div className="max-w-4xl w-full flex flex-col md:flex-row items-center gap-12 relative z-10">
{/* Illustration Section */}
<div className="flex-1 flex justify-center relative">
{/* Glassmorphic Visual for the Disconnected Node */}
<div className="relative w-72 h-72 md:w-96 md:h-96">
{/* Connecting Lines (Broken) */}
<div className="absolute inset-0 opacity-20">
<svg className="w-full h-full text-indigo-400" viewBox="0 0 400 400">
<path d="M50,50 L150,120" stroke="currentColor" strokeDasharray="10 5" strokeWidth="1" />
<path d="M350,50 L250,150" stroke="currentColor" strokeDasharray="5 5" strokeWidth="1" />
<path d="M100,350 L180,250" stroke="currentColor" strokeDasharray="8 4" strokeWidth="1" />
<path d="M300,350 L220,280" stroke="currentColor" strokeDasharray="12 6" strokeWidth="1" />
</svg>
</div>
{/* The Floating Disconnected Node */}
<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-64 md:h-64 rounded-full bg-surface-variant/40 backdrop-blur-3xl flex items-center justify-center border border-outline-variant/20 shadow-[0_0_80px_rgba(144,147,255,0.15)] overflow-hidden group">
<img alt="Disconnected Node" className="w-full h-full object-cover opacity-60 mix-blend-screen group-hover:scale-110 transition-transform duration-700" data-alt="Abstract 3D digital rendering of a floating crystalline sphere with shattered glowing geometric shards floating around it in deep space" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0JatdEaLd76yJy4IgpJtWU5Ir7dN3QLTYPIs2cby_ob8vqXK3bCyxJAtO3X7fuVnoqsAOGqqWKPZT2nJOjxDBud3AFMJRqlOHAn_dIFgqy409PdIvgT2i6Wb33w3DJPIGO9qLJuQjtTUy7aamEiHFY523pTxkWn8WJ6Mi0kd5Ko3p2yjjSbmyZ7-jB7HHQRngm01IhCXYkY0V7iPn4uHkb78AKiU4JdoUb6WafqsIyFulGJFb7A8zpkA_m67QDB6mebjO5lLInvzp" />
{/* Glowing Core */}
<div className="absolute inset-0 flex items-center justify-center">
<div className="w-16 h-16 bg-primary rounded-full blur-2xl opacity-40"></div>
<span className="text-7xl font-black text-on-surface tracking-tighter opacity-80 select-none">404</span>
</div>
</div>
{/* Floating Particles */}
<div className="absolute top-10 right-10 w-4 h-4 bg-secondary rounded-full blur-sm opacity-50"></div>
<div className="absolute bottom-20 left-4 w-3 h-3 bg-primary-container rounded-full blur-xs opacity-40"></div>
</div>
</div>
{/* Text Section */}
<div className="flex-1 text-center md:text-left space-y-6">
<div className="space-y-2">
<span className="text-primary font-bold tracking-[0.2em] uppercase text-sm block">System Outage</span>
<h1 className="text-5xl md:text-7xl font-extrabold text-on-surface leading-tight tracking-tight">
                            404 - Lost in the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Nexus</span>
</h1>
</div>
<p className="text-on-surface-variant text-lg md:text-xl max-w-md leading-relaxed">
                        The neural bridge you're looking for has been decommissioned or moved to another sector of the knowledge grid.
                    </p>
<div className="flex flex-col sm:flex-row gap-4 pt-4">
<Link className="px-8 py-4 bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold rounded-xl shadow-[0px_0px_20px_rgba(144,147,255,0.4)] hover:scale-105 active:scale-95 transition-all text-center" to="/dashboard">
                            Return to Dashboard
                        </Link>
<button className="px-8 py-4 bg-surface-container-highest text-on-surface font-semibold rounded-xl hover:bg-surface-bright transition-all text-center">
                            Contact Oracle
                        </button>
</div>
{/* Subtle metadata */}
<div className="pt-8 flex items-center gap-4 text-xs text-outline font-mono">
<span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-error"></span> ERROR_NODE_UNREACHABLE</span>
<span className="w-1 h-1 rounded-full bg-outline-variant"></span>
<span>LATENCY: NULL</span>
</div>
</div>
</div>
{/* Bento Grid - Suggested Sectors (Fallback) */}
<div className="max-w-[1440px] w-full mt-24">
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
<div className="p-6 rounded-3xl bg-surface-container-low border border-outline-variant/10 group cursor-pointer hover:bg-surface-container transition-colors">
<div className="w-12 h-12 rounded-xl bg-tertiary/10 flex items-center justify-center mb-4 text-tertiary group-hover:scale-110 transition-transform">
<span className="material-symbols-outlined" data-icon="search">search</span>
</div>
<h3 className="text-lg font-bold text-on-surface mb-2">Knowledge Search</h3>
<p className="text-sm text-on-surface-variant">Query the global expert database for help.</p>
</div>
<div className="p-6 rounded-3xl bg-surface-container-low border border-outline-variant/10 group cursor-pointer hover:bg-surface-container transition-colors">
<div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4 text-secondary group-hover:scale-110 transition-transform">
<span className="material-symbols-outlined" data-icon="explore">explore</span>
</div>
<h3 className="text-lg font-bold text-on-surface mb-2">Explore Pathways</h3>
<p className="text-sm text-on-surface-variant">Find structured learning tracks to get back on track.</p>
</div>
<div className="p-6 rounded-3xl bg-surface-container-low border border-outline-variant/10 group cursor-pointer hover:bg-surface-container transition-colors">
<div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition-transform">
<span className="material-symbols-outlined" data-icon="chat_bubble">chat_bubble</span>
</div>
<h3 className="text-lg font-bold text-on-surface mb-2">Help Center</h3>
<p className="text-sm text-on-surface-variant">Speak to a human guide about technical issues.</p>
</div>
</div>
</div>
</main>
</div>
{/* Mobile BottomNavBar */}
<nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#060e20]/90 backdrop-blur-xl flex justify-around items-center p-4 border-t border-outline-variant/10 z-50">
<Link className="flex flex-col items-center gap-1 text-slate-500" to="/">
<span className="material-symbols-outlined" data-icon="search">search</span>
<span className="text-[10px]">Discover</span>
</Link>
<Link className="flex flex-col items-center gap-1 text-slate-500" to="/">
<span className="material-symbols-outlined" data-icon="group">group</span>
<span className="text-[10px]">Connections</span>
</Link>
<Link className="flex flex-col items-center gap-1 text-indigo-400" to="/">
<span className="material-symbols-outlined" data-icon="error" >error</span>
<span className="text-[10px]">404</span>
</Link>
<Link className="flex flex-col items-center gap-1 text-slate-500" to="/">
<span className="material-symbols-outlined" data-icon="military_tech">military_tech</span>
<span className="text-[10px]">Rewards</span>
</Link>
<Link className="flex flex-col items-center gap-1 text-slate-500" to="/settings">
<span className="material-symbols-outlined" data-icon="settings">settings</span>
<span className="text-[10px]">Settings</span>
</Link>
</nav>
        </React.Fragment>
    );
};

export default Error404Page;
