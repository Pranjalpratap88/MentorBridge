import React from 'react';
import { Link } from 'react-router-dom';

const MentorProfilePublic = () => {
    return (
        <React.Fragment>
            {/* TopNavBar Shell */}

<div className="flex max-w-[1440px] mx-auto">
{/* SideNavBar Shell */}

{/* Main Content Canvas */}

{/* Hero Section */}
<div className="relative mb-16">
<div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-[120px]"></div>
<div className="flex flex-col lg:flex-row gap-12 items-start relative z-10">
<div className="relative group">
<div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
<img className="w-64 h-80 object-cover rounded-2xl relative border border-white/5" data-alt="Portrait of Sarah Chen, a professional woman with a friendly expression, soft lighting, modern studio background with hint of violet and blue" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9YFgNdwnJrESF_pO9fHC5L0XxXPwvvQ9Z_3rkqTRBS0GQgHEns8_92zswn82QI3ry-URStb6pGmtAUBSM8WIMKfA9GtDS9lY6up1seFyNgl4gCX0NxQGW2mCy6LQk5_X1zkC7sX2ci3KkhkaVpxOKKEkJzZQKV8caJ_XAy_MLXSKfB1-4_niKVTJfd-MtsglMBwUE6U-CPhcd8gqOWgnzr1-O6luU4g6SGfeTnDeStxx2dYgzLxm2t7jlEwRaHy9pLK-b6f2WNsOI" />
<div className="absolute -bottom-4 -right-4 bg-tertiary text-on-tertiary px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
<span className="material-symbols-outlined text-sm" >verified</span>
                            Top Mentor
                        </div>
</div>
<div className="flex-1 space-y-6">
<div>
<h1 className="text-5xl lg:text-7xl font-extrabold font-headline tracking-tighter text-on-surface mb-2">Sarah Chen</h1>
<p className="text-2xl text-primary font-medium flex items-center gap-2">
                                Senior Product Designer @ Meta
                                <span className="w-2 h-2 rounded-full bg-primary/30"></span>
<span className="text-on-surface-variant text-lg">12+ Years Exp.</span>
</p>
</div>
<div className="flex flex-wrap gap-3">
<span className="px-4 py-2 rounded-full bg-secondary-container text-secondary text-sm font-medium border border-secondary/20">Product Strategy</span>
<span className="px-4 py-2 rounded-full bg-secondary-container text-secondary text-sm font-medium border border-secondary/20">Design Leadership</span>
<span className="px-4 py-2 rounded-full bg-secondary-container text-secondary text-sm font-medium border border-secondary/20">Career Growth</span>
<span className="px-4 py-2 rounded-full bg-secondary-container text-secondary text-sm font-medium border border-secondary/20">System Thinking</span>
</div>
<div className="flex gap-4 pt-4">
<button className="px-8 py-4 rounded-xl primary-gradient text-on-primary font-bold text-lg flex items-center gap-2 shadow-[0px_0px_20px_rgba(144,147,255,0.4)] hover:scale-105 transition-all">
<span className="material-symbols-outlined">event_available</span>
                                Book Session
                            </button>
<button className="px-8 py-4 rounded-xl bg-surface-container-highest text-on-surface font-bold text-lg flex items-center gap-2 hover:bg-surface-bright transition-all">
<span className="material-symbols-outlined">chat_bubble</span>
                                Connect
                            </button>
</div>
</div>
</div>
</div>
{/* Bento Grid Content */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
{/* Expertise & Bio */}
<div className="lg:col-span-8 space-y-8">
<section className="glass-panel rounded-3xl p-8 border border-white/5">
<h2 className="text-2xl font-bold font-headline mb-6 flex items-center gap-3">
<span className="material-symbols-outlined text-primary">auto_awesome</span>
                            Expertise &amp; Bio
                        </h2>
<div className="space-y-6 text-on-surface-variant leading-relaxed">
<p>I specialize in building complex systems at scale. Currently leading the Design Infrastructure team at Meta, focused on defining the next generation of collaborative tools for designers and engineers.</p>
<p>My mentorship style is direct, action-oriented, and focused on helping you bridge the gap between "good design" and "impactful business strategy." I've helped 50+ designers transition into leadership roles and master the art of cross-functional influence.</p>
</div>
<div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
<div className="p-4 rounded-2xl bg-surface-container-low border border-white/5">
<p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Response Time</p>
<p className="text-xl font-headline font-bold">~ 4 hours</p>
</div>
<div className="p-4 rounded-2xl bg-surface-container-low border border-white/5">
<p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Mentees</p>
<p className="text-xl font-headline font-bold">428</p>
</div>
<div className="p-4 rounded-2xl bg-surface-container-low border border-white/5">
<p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Success Rate</p>
<p className="text-xl font-headline font-bold">98%</p>
</div>
<div className="p-4 rounded-2xl bg-surface-container-low border border-white/5">
<p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Session Price</p>
<p className="text-xl font-headline font-bold">$120/hr</p>
</div>
</div>
</section>
{/* Past Query Responses */}
<section>
<div className="flex items-center justify-between mb-6">
<h2 className="text-2xl font-bold font-headline flex items-center gap-3">
<span className="material-symbols-outlined text-tertiary">quiz</span>
                                Recent Query Responses
                            </h2>
<Link className="text-sm font-bold text-primary hover:underline" to="/">View All Responses</Link>
</div>
<div className="space-y-4">
{/* Response Card 1 */}
<div className="bg-surface-container-low hover:bg-surface-container-high p-6 rounded-2xl transition-all group">
<div className="flex justify-between items-start mb-4">
<h3 className="font-bold text-on-surface group-hover:text-primary transition-colors">How do I present design critiques to non-design executives?</h3>
<div className="flex items-center bg-surface-container-highest px-3 py-1 rounded-full gap-1">
<span className="material-symbols-outlined text-yellow-500 text-sm" >star</span>
<span className="text-xs font-bold">5.0</span>
</div>
</div>
<p className="text-sm text-on-surface-variant line-clamp-2 mb-4">"The key is shifting the language from aesthetic choices to business outcomes. Instead of talking about 'white space', talk about 'user focus' and 'conversion paths'..."</p>
<div className="flex items-center gap-4 text-xs font-medium text-slate-500">
<span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">calendar_today</span> 2 days ago</span>
<span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">thumb_up</span> 84 Helpful</span>
</div>
</div>
{/* Response Card 2 */}
<div className="bg-surface-container-low hover:bg-surface-container-high p-6 rounded-2xl transition-all group">
<div className="flex justify-between items-start mb-4">
<h3 className="font-bold text-on-surface group-hover:text-primary transition-colors">Frameworks for navigating a design system migration?</h3>
<div className="flex items-center bg-surface-container-highest px-3 py-1 rounded-full gap-1">
<span className="material-symbols-outlined text-yellow-500 text-sm" >star</span>
<span className="text-xs font-bold">4.9</span>
</div>
</div>
<p className="text-sm text-on-surface-variant line-clamp-2 mb-4">"Don't boil the ocean. Start with the atomized components that have the highest frequency of use across the product surface..."</p>
<div className="flex items-center gap-4 text-xs font-medium text-slate-500">
<span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">calendar_today</span> 1 week ago</span>
<span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">thumb_up</span> 126 Helpful</span>
</div>
</div>
</div>
</section>
</div>
{/* Nexus Contribution & Sidebar Content */}
<div className="lg:col-span-4 space-y-8">
{/* Nexus Contribution */}
<section className="glass-panel rounded-3xl p-8 border border-primary/20 relative overflow-hidden">
<div className="absolute top-0 right-0 p-4 opacity-10">
<span className="material-symbols-outlined text-8xl" >bolt</span>
</div>
<h2 className="text-xl font-bold font-headline mb-6 flex items-center gap-3">
<span className="material-symbols-outlined text-secondary">flare</span>
                            Nexus Contribution
                        </h2>
<div className="text-center py-6">
<p className="text-5xl font-black font-headline text-secondary tracking-tight mb-2">12,840</p>
<p className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">Total Nexus Points</p>
</div>
<div className="space-y-4">
<div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-primary">emoji_events</span>
<span className="text-sm font-medium">Rank</span>
</div>
<span className="text-sm font-bold text-on-surface">#14 Global</span>
</div>
<div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-tertiary">rate_review</span>
<span className="text-sm font-medium">Peer Reviews</span>
</div>
<span className="text-sm font-bold text-on-surface">1,240+</span>
</div>
<div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-secondary">forum</span>
<span className="text-sm font-medium">Discussions</span>
</div>
<span className="text-sm font-bold text-on-surface">850</span>
</div>
</div>
<div className="mt-8 pt-6 border-t border-white/10 text-center">
<p className="text-xs text-on-surface-variant italic">"A pillar of the design community since 2021"</p>
</div>
</section>
{/* Mentorship Availability */}
<section className="bg-surface-container-high rounded-3xl p-8 border border-white/5">
<h3 className="text-lg font-bold font-headline mb-6 flex items-center gap-2">
<span className="material-symbols-outlined text-green-400">circle</span>
                            Next Availability
                        </h3>
<div className="space-y-4 mb-8">
<div className="flex items-center gap-4">
<div className="w-12 h-12 rounded-xl bg-surface-container-low flex flex-col items-center justify-center border border-white/5">
<span className="text-[10px] font-bold text-primary uppercase">Tue</span>
<span className="text-sm font-bold">14</span>
</div>
<div>
<p className="text-sm font-bold">Tuesday, May 14</p>
<p className="text-xs text-on-surface-variant">09:00 AM - 11:00 AM PST</p>
</div>
</div>
<div className="flex items-center gap-4">
<div className="w-12 h-12 rounded-xl bg-surface-container-low flex flex-col items-center justify-center border border-white/5">
<span className="text-[10px] font-bold text-primary uppercase">Thu</span>
<span className="text-sm font-bold">16</span>
</div>
<div>
<p className="text-sm font-bold">Thursday, May 16</p>
<p className="text-xs text-on-surface-variant">04:00 PM - 06:00 PM PST</p>
</div>
</div>
</div>
<button className="w-full py-4 rounded-xl border border-primary/40 text-primary font-bold hover:bg-primary/10 transition-all">
                            Request Custom Time
                        </button>
</section>
</div>
</div>

</div>
{/* Background Decorative Glows */}
<div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10">
<div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] bg-indigo-500/5 blur-[150px]"></div>
<div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-purple-500/5 blur-[150px]"></div>
</div>
        </React.Fragment>
    );
};

export default MentorProfilePublic;
