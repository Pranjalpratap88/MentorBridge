import React from 'react';
import { Link } from 'react-router-dom';

const Settings = () => {
    return (
        <React.Fragment>
            {/* SideNavBar Anchor */}

{/* Main Content Area */}
<div className="md:ml-72 flex flex-col min-h-screen">
{/* TopNavBar Anchor */}

{/* Page Canvas */}

<div className="mb-12">
<h1 className="text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight mb-2">Settings</h1>
<p className="text-on-surface-variant text-lg">Manage your account preferences and connection security.</p>
</div>
<div className="flex flex-col lg:flex-row gap-12">
{/* Vertical Tabs */}
<aside className="w-full lg:w-64 flex flex-col gap-2">
<button className="flex items-center gap-3 px-5 py-4 rounded-xl bg-surface-container-high text-primary font-bold shadow-lg shadow-black/20 text-left transition-all">
<span className="material-symbols-outlined">person</span>
                        Profile Settings
                    </button>
<button className="flex items-center gap-3 px-5 py-4 rounded-xl text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface text-left transition-all">
<span className="material-symbols-outlined">shield</span>
                        Account &amp; Security
                    </button>
<button className="flex items-center gap-3 px-5 py-4 rounded-xl text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface text-left transition-all">
<span className="material-symbols-outlined">notifications_active</span>
                        Notification Preferences
                    </button>
<button className="flex items-center gap-3 px-5 py-4 rounded-xl text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface text-left transition-all">
<span className="material-symbols-outlined">rocket_launch</span>
                        Nexus Pro
                    </button>
</aside>
{/* Forms Area */}
<div className="flex-1 space-y-12">
{/* Profile Section */}
<section className="space-y-8">
<div className="flex items-center gap-4">
<h3 className="text-xl font-bold text-indigo-300">Public Profile</h3>
<div className="flex-1 h-px bg-outline-variant/10"></div>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
<div className="space-y-2">
<label className="text-sm font-semibold text-on-surface-variant ml-1">Full Name</label>
<input className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 text-on-surface ghost-border" type="text" value="Alexander Sterling" />
</div>
<div className="space-y-2">
<label className="text-sm font-semibold text-on-surface-variant ml-1">Professional Title</label>
<input className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 text-on-surface ghost-border" type="text" value="Senior Systems Architect" />
</div>
<div className="md:col-span-2 space-y-2">
<label className="text-sm font-semibold text-on-surface-variant ml-1">Bio</label>
<textarea className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 text-on-surface ghost-border" rows="4">Bridging the gap between legacy infrastructures and future-proof cloud ecosystems. 12+ years of experience in distributed systems.</textarea>
</div>
</div>
</section>
{/* Security Section */}
<section className="space-y-8">
<div className="flex items-center gap-4">
<h3 className="text-xl font-bold text-indigo-300">Security Credentials</h3>
<div className="flex-1 h-px bg-outline-variant/10"></div>
</div>
<div className="glass-panel p-8 rounded-2xl border border-outline-variant/10">
<div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
<div>
<h4 className="font-bold text-on-surface">Password</h4>
<p className="text-sm text-on-surface-variant">Last changed 4 months ago</p>
</div>
<button className="px-6 py-2 rounded-lg bg-surface-container-highest text-on-surface text-sm font-semibold hover:bg-surface-bright transition-colors">
                                    Change Password
                                </button>
</div>
<div className="mt-8 pt-8 border-t border-outline-variant/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
<div>
<h4 className="font-bold text-on-surface">Two-Factor Authentication</h4>
<p className="text-sm text-on-surface-variant">Add an extra layer of security to your account</p>
</div>
<button className="px-6 py-2 rounded-lg border border-indigo-500/30 text-indigo-400 text-sm font-semibold hover:bg-indigo-500/5 transition-colors">
                                    Enable 2FA
                                </button>
</div>
</div>
</section>
{/* Notifications Section */}
<section className="space-y-8">
<div className="flex items-center gap-4">
<h3 className="text-xl font-bold text-indigo-300">Alert Preferences</h3>
<div className="flex-1 h-px bg-outline-variant/10"></div>
</div>
<div className="space-y-4">
<div className="flex items-center justify-between p-4 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors">
<div className="flex items-center gap-4">
<div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
<span className="material-symbols-outlined">mail</span>
</div>
<div>
<h4 className="font-medium text-on-surface">Email Notifications</h4>
<p className="text-xs text-on-surface-variant">Receive weekly digests and mentor updates</p>
</div>
</div>
<label className="relative inline-flex items-center cursor-pointer">
<input checked="" className="sr-only peer" type="checkbox" />
<div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
</label>
</div>
<div className="flex items-center justify-between p-4 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors">
<div className="flex items-center gap-4">
<div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
<span className="material-symbols-outlined">phone_android</span>
</div>
<div>
<h4 className="font-medium text-on-surface">Push Alerts</h4>
<p className="text-xs text-on-surface-variant">Real-time mobile notifications for direct messages</p>
</div>
</div>
<label className="relative inline-flex items-center cursor-pointer">
<input className="sr-only peer" type="checkbox" />
<div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
</label>
</div>
</div>
</section>
<div className="flex justify-end pt-8">
<button className="px-10 py-4 rounded-xl primary-gradient text-on-primary-container font-bold text-lg shadow-[0px_15px_30px_rgba(144,147,255,0.2)] active:scale-95 transition-all">
                            Save All Changes
                        </button>
</div>
</div>
</div>

</div>
{/* BottomNavBar for Mobile */}
<nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#060e20]/90 backdrop-blur-xl border-t border-outline-variant/10 flex justify-around items-center py-4 px-6 z-50">
<button className="flex flex-col items-center gap-1 text-slate-500">
<span className="material-symbols-outlined">search</span>
<span className="text-[10px] font-medium">Discover</span>
</button>
<button className="flex flex-col items-center gap-1 text-slate-500">
<span className="material-symbols-outlined">group</span>
<span className="text-[10px] font-medium">Connections</span>
</button>
<button className="flex flex-col items-center gap-1 text-slate-500">
<span className="material-symbols-outlined">military_tech</span>
<span className="text-[10px] font-medium">Rewards</span>
</button>
<button className="flex flex-col items-center gap-1 text-indigo-400">
<span className="material-symbols-outlined" >settings</span>
<span className="text-[10px] font-bold">Settings</span>
</button>
</nav>
        </React.Fragment>
    );
};

export default Settings;
