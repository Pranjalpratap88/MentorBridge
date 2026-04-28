import React from 'react';
import { Link } from 'react-router-dom';

const RewardsPoints = () => {
    return (
        <React.Fragment>
            {/* TopNavBar Shell */}

<div className="flex min-h-screen pt-4">
{/* SideNavBar Shell */}

{/* Main Content Canvas */}

<div className="max-w-6xl mx-auto space-y-12">
{/* Hero Section: Radial Points */}
<section className="mt-8 flex flex-col md:flex-row items-center gap-12 py-12 px-10 rounded-[2rem] bg-gradient-to-br from-surface-container-low to-surface relative overflow-hidden">
<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(144,147,255,0.08),transparent_50%)]"></div>
<div className="relative w-64 h-64 flex items-center justify-center">
<svg className="w-full h-full transform -rotate-90">
<circle className="text-surface-container-high" cx="128" cy="128" fill="transparent" r="110" stroke="currentColor" strokeWidth="12" />
<circle className="text-primary drop-shadow-[0_0_8px_rgba(144,147,255,0.6)]" cx="128" cy="128" fill="transparent" r="110" stroke="currentColor" strokeDasharray="691" strokeDashoffset="172" strokeWidth="12" />
</svg>
<div className="absolute inset-0 flex flex-col items-center justify-center text-center">
<span className="text-slate-400 text-sm font-medium tracking-widest uppercase">Current Balance</span>
<span className="text-5xl font-extrabold font-headline text-on-surface mt-1">12,450</span>
<span className="text-primary-fixed-dim text-xs font-bold mt-1 tracking-tighter">Nexus Points</span>
</div>
</div>
<div className="flex-1 space-y-6">
<div className="space-y-2">
<h1 className="text-4xl font-extrabold font-headline tracking-tight">Total Nexus Points</h1>
<p className="text-slate-400 max-w-md text-lg leading-relaxed">You're in the top 5% of mentors this month. Continue sharing your expertise to unlock exclusive network perks.</p>
</div>
<div className="flex flex-wrap gap-4">
<div className="px-6 py-3 rounded-xl bg-surface-container-highest flex items-center gap-3">
<div className="w-2 h-2 rounded-full bg-tertiary shadow-[0_0_8px_rgba(123,208,255,0.8)]"></div>
<span className="text-sm font-semibold">Tier: Zenith Mentor</span>
</div>
<div className="px-6 py-3 rounded-xl bg-surface-container-highest flex items-center gap-3">
<span className="material-symbols-outlined text-secondary text-sm" >trending_up</span>
<span className="text-sm font-semibold">+1,200 this week</span>
</div>
</div>
</div>
</section>
{/* Points Breakdown Bento Grid */}
<section className="space-y-6">
<h2 className="text-2xl font-bold font-headline">Points Breakdown</h2>
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
{/* Card 1: Answers */}
<div className="glass-panel p-8 rounded-[1.5rem] relative group hover:bg-surface-bright transition-all">
<span className="material-symbols-outlined text-3xl text-primary mb-6" data-weight="fill">forum</span>
<h3 className="text-xl font-bold mb-2">Expert Answers</h3>
<p className="text-slate-400 text-sm leading-relaxed mb-6">Earned from providing high-quality responses to technical queries.</p>
<div className="flex items-baseline gap-2">
<span className="text-3xl font-bold">5,800</span>
<span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Points</span>
</div>
</div>
{/* Card 2: Reviews */}
<div className="glass-panel p-8 rounded-[1.5rem] relative group hover:bg-surface-bright transition-all">
<span className="material-symbols-outlined text-3xl text-secondary mb-6" data-weight="fill">rate_review</span>
<h3 className="text-xl font-bold mb-2">Mentee Reviews</h3>
<p className="text-slate-400 text-sm leading-relaxed mb-6">Awarded for positive feedback and successful mentorship outcomes.</p>
<div className="flex items-baseline gap-2">
<span className="text-3xl font-bold">4,250</span>
<span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Points</span>
</div>
</div>
{/* Card 3: Networking */}
<div className="glass-panel p-8 rounded-[1.5rem] relative group hover:bg-surface-bright transition-all">
<span className="material-symbols-outlined text-3xl text-tertiary mb-6" data-weight="fill">hub</span>
<h3 className="text-xl font-bold mb-2">Nexus Growth</h3>
<p className="text-slate-400 text-sm leading-relaxed mb-6">Earned by expanding the network and connecting quality professionals.</p>
<div className="flex items-baseline gap-2">
<span className="text-3xl font-bold">2,400</span>
<span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Points</span>
</div>
</div>
</div>
</section>
{/* Two Column: History & Perks */}
<div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
{/* Earning History */}
<section className="lg:col-span-3 space-y-6">
<div className="flex items-center justify-between">
<h2 className="text-2xl font-bold font-headline">Earning History</h2>
<button className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
                                View full log
                                <span className="material-symbols-outlined text-sm">arrow_forward</span>
</button>
</div>
<div className="space-y-3">
<div className="flex items-center justify-between p-5 rounded-2xl bg-surface-container-low hover:bg-surface-container hover:scale-[1.005] transition-all cursor-default">
<div className="flex items-center gap-4">
<div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
<span className="material-symbols-outlined text-xl">psychology</span>
</div>
<div>
<p className="font-semibold">Deep Dive Session: AI Ethics</p>
<p className="text-xs text-slate-500">Oct 24, 2023 • Networking</p>
</div>
</div>
<span className="text-primary font-bold">+450 pts</span>
</div>
<div className="flex items-center justify-between p-5 rounded-2xl bg-surface-container-low hover:bg-surface-container hover:scale-[1.005] transition-all cursor-default">
<div className="flex items-center gap-4">
<div className="w-10 h-10 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary">
<span className="material-symbols-outlined text-xl">star</span>
</div>
<div>
<p className="font-semibold">5-Star Mentorship Review</p>
<p className="text-xs text-slate-500">Oct 22, 2023 • Reviews</p>
</div>
</div>
<span className="text-secondary font-bold">+1,200 pts</span>
</div>
<div className="flex items-center justify-between p-5 rounded-2xl bg-surface-container-low hover:bg-surface-container hover:scale-[1.005] transition-all cursor-default">
<div className="flex items-center gap-4">
<div className="w-10 h-10 rounded-full bg-tertiary-container/20 flex items-center justify-center text-tertiary">
<span className="material-symbols-outlined text-xl">help</span>
</div>
<div>
<p className="font-semibold">Accepted Answer: Cloud Scaling</p>
<p className="text-xs text-slate-500">Oct 21, 2023 • Answers</p>
</div>
</div>
<span className="text-tertiary font-bold">+150 pts</span>
</div>
<div className="flex items-center justify-between p-5 rounded-2xl bg-surface-container-low hover:bg-surface-container hover:scale-[1.005] transition-all cursor-default">
<div className="flex items-center gap-4">
<div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
<span className="material-symbols-outlined text-xl">group_add</span>
</div>
<div>
<p className="font-semibold">Referred New Expert Mentor</p>
<p className="text-xs text-slate-500">Oct 19, 2023 • Networking</p>
</div>
</div>
<span className="text-primary font-bold">+800 pts</span>
</div>
</div>
</section>
{/* Redeemable Perks */}
<section className="lg:col-span-2 space-y-6">
<h2 className="text-2xl font-bold font-headline">Redeemable Perks</h2>
<div className="space-y-4">
{/* Perk 1 */}
<div className="p-6 rounded-[1.5rem] bg-surface-container-highest/50 border border-outline-variant/10 group cursor-pointer hover:border-primary/40 transition-all">
<div className="flex justify-between items-start mb-4">
<div className="p-3 bg-primary-container/30 rounded-xl">
<span className="material-symbols-outlined text-primary text-2xl" >workspace_premium</span>
</div>
<span className="text-xs font-bold px-3 py-1 bg-primary/20 text-primary rounded-full">8,000 pts</span>
</div>
<h4 className="font-bold text-lg mb-1">Nexus Elite Annual</h4>
<p className="text-slate-400 text-sm mb-4">Full access to premium analytics and global network events for one year.</p>
<button className="w-full py-2 bg-on-surface/5 hover:bg-on-surface/10 rounded-lg text-sm font-bold transition-all">Redeem Reward</button>
</div>
{/* Perk 2 */}
<div className="p-6 rounded-[1.5rem] bg-surface-container-highest/50 border border-outline-variant/10 group cursor-pointer hover:border-secondary/40 transition-all">
<div className="flex justify-between items-start mb-4">
<div className="p-3 bg-secondary-container/30 rounded-xl">
<span className="material-symbols-outlined text-secondary text-2xl" >verified</span>
</div>
<span className="text-xs font-bold px-3 py-1 bg-secondary/20 text-secondary rounded-full">2,500 pts</span>
</div>
<h4 className="font-bold text-lg mb-1">Illuminated Badge</h4>
<p className="text-slate-400 text-sm mb-4">A permanent profile flair highlighting your contribution to the community.</p>
<button className="w-full py-2 bg-on-surface/5 hover:bg-on-surface/10 rounded-lg text-sm font-bold transition-all">Redeem Reward</button>
</div>
{/* Perk 3 (Disabled) */}
<div className="p-6 rounded-[1.5rem] bg-surface-container-low border border-dashed border-outline-variant/30 opacity-60">
<div className="flex justify-between items-start mb-4">
<div className="p-3 bg-slate-800 rounded-xl">
<span className="material-symbols-outlined text-slate-500 text-2xl">diamond</span>
</div>
<span className="text-xs font-bold px-3 py-1 bg-slate-800 text-slate-500 rounded-full">25,000 pts</span>
</div>
<h4 className="font-bold text-lg mb-1 text-slate-500">Executive Masterclass</h4>
<p className="text-slate-600 text-sm mb-4">1-on-1 strategy session with our Top-Tier Industry Board Mentors.</p>
<div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
<div className="w-1/2 h-full bg-slate-600"></div>
</div>
<p className="text-[10px] text-slate-600 mt-2 font-bold uppercase tracking-widest">Locked: 50% Complete</p>
</div>
</div>
</section>
</div>
</div>

</div>
{/* Mobile Navigation Shell (Platform Pivot) */}
<nav className="md:hidden fixed bottom-0 left-0 right-0 glass-panel border-t border-outline-variant/10 flex justify-around items-center py-4 z-50">
<button className="flex flex-col items-center text-slate-500">
<span className="material-symbols-outlined">search</span>
<span className="text-[10px] font-medium mt-1">Discover</span>
</button>
<button className="flex flex-col items-center text-slate-500">
<span className="material-symbols-outlined">group</span>
<span className="text-[10px] font-medium mt-1">Nexus</span>
</button>
<button className="flex flex-col items-center text-primary">
<span className="material-symbols-outlined" >military_tech</span>
<span className="text-[10px] font-medium mt-1">Rewards</span>
</button>
<button className="flex flex-col items-center text-slate-500">
<span className="material-symbols-outlined">settings</span>
<span className="text-[10px] font-medium mt-1">Settings</span>
</button>
</nav>
        </React.Fragment>
    );
};

export default RewardsPoints;
