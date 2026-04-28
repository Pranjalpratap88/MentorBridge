import React from 'react';
import { Link } from 'react-router-dom';

const ExploreFilters = () => {
    return (
        <React.Fragment>
            {/* TopNavBar */}

<div className="flex max-w-[1440px] mx-auto">
{/* SideNavBar */}

{/* Main Content Canvas */}

<div className="flex flex-col lg:flex-row gap-10">
{/* Left Column: Advanced Filters */}
<aside className="w-full lg:w-72 flex flex-col gap-8">
<div>
<h3 className="text-xl font-bold mb-6 text-on-surface flex items-center gap-2">
<span className="material-symbols-outlined text-primary">filter_list</span>
                            Advanced Filters
                        </h3>
<div className="space-y-8">
{/* Company Filter */}
<section>
<p className="text-xs font-bold uppercase tracking-widest text-outline mb-4">Company</p>
<div className="space-y-3">
<label className="flex items-center gap-3 cursor-pointer group">
<div className="w-5 h-5 rounded border border-outline-variant group-hover:border-primary transition-colors flex items-center justify-center">
<div className="w-3 h-3 bg-primary rounded-sm opacity-0 group-hover:opacity-20 transition-opacity"></div>
</div>
<span className="text-sm text-on-surface-variant group-hover:text-on-surface">Google</span>
</label>
<label className="flex items-center gap-3 cursor-pointer group">
<div className="w-5 h-5 rounded border border-primary bg-primary/10 flex items-center justify-center">
<span className="material-symbols-outlined text-xs text-primary font-bold">check</span>
</div>
<span className="text-sm text-on-surface">Meta</span>
</label>
<label className="flex items-center gap-3 cursor-pointer group">
<div className="w-5 h-5 rounded border border-outline-variant group-hover:border-primary transition-colors flex items-center justify-center">
<div className="w-3 h-3 bg-primary rounded-sm opacity-0 group-hover:opacity-20 transition-opacity"></div>
</div>
<span className="text-sm text-on-surface-variant group-hover:text-on-surface">Amazon</span>
</label>
</div>
</section>
{/* College Filter */}
<section>
<p className="text-xs font-bold uppercase tracking-widest text-outline mb-4">College</p>
<div className="space-y-3">
<label className="flex items-center gap-3 cursor-pointer group">
<div className="w-5 h-5 rounded border border-outline-variant group-hover:border-primary transition-colors flex items-center justify-center"></div>
<span className="text-sm text-on-surface-variant group-hover:text-on-surface">Stanford</span>
</label>
<label className="flex items-center gap-3 cursor-pointer group">
<div className="w-5 h-5 rounded border border-outline-variant group-hover:border-primary transition-colors flex items-center justify-center"></div>
<span className="text-sm text-on-surface-variant group-hover:text-on-surface">MIT</span>
</label>
<label className="flex items-center gap-3 cursor-pointer group">
<div className="w-5 h-5 rounded border border-outline-variant group-hover:border-primary transition-colors flex items-center justify-center"></div>
<span className="text-sm text-on-surface-variant group-hover:text-on-surface">Berkeley</span>
</label>
</div>
</section>
{/* Knowledge Pulse Tags */}
<section>
<p className="text-xs font-bold uppercase tracking-widest text-outline mb-4">Knowledge Tags</p>
<div className="flex flex-wrap gap-2">
<button className="px-3 py-1 rounded-full bg-secondary-container text-secondary text-xs font-medium border border-secondary/20">System Design</button>
<button className="px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant text-xs font-medium hover:text-on-surface transition-colors">Frontend</button>
<button className="px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant text-xs font-medium hover:text-on-surface transition-colors">Career Pivot</button>
<button className="px-3 py-1 rounded-full bg-secondary-container text-secondary text-xs font-medium border border-secondary/20">Machine Learning</button>
<button className="px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant text-xs font-medium hover:text-on-surface transition-colors">Product Strategy</button>
</div>
</section>
{/* Availability Range */}
<section>
<p className="text-xs font-bold uppercase tracking-widest text-outline mb-4">Availability</p>
<input className="w-full h-1 bg-outline-variant rounded-lg appearance-none cursor-pointer accent-primary" type="range" />
<div className="flex justify-between mt-2 text-[10px] text-outline font-bold">
<span>ASAP</span>
<span>NEXT MONTH</span>
</div>
</section>
</div>
</div>
</aside>
{/* Right Column: Content Grid */}
<div className="flex-1 space-y-10">
<header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
<div>
<h1 className="text-4xl font-extrabold tracking-tighter text-on-surface mb-2">Discover Experts</h1>
<p className="text-on-surface-variant text-lg max-w-xl">Connecting you with the world's leading engineers, designers, and strategists.</p>
</div>
<div className="flex items-center gap-2 text-sm text-on-surface-variant bg-surface-container-high px-4 py-2 rounded-lg">
<span>Showing 42 mentors at</span>
<span className="text-primary font-bold">Meta</span>
</div>
</header>
{/* Bento-style Grid */}
<div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
{/* Featured Mentor Card (Large) */}
<div className="xl:col-span-2 group relative overflow-hidden rounded-2xl bg-surface-container-high hover:bg-surface-bright transition-all duration-300 transform hover:scale-[1.01] p-8 flex flex-col md:flex-row gap-8">
<div className="relative w-full md:w-48 h-48 rounded-xl overflow-hidden shadow-2xl">
<img alt="Mentor portrait" className="w-full h-full object-cover" data-alt="Professional headshot of a female software architect with glasses, warm laboratory lighting, high-tech background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvq6vKqu7DSw3fUxk6wPt9ONFjI4GJpkia1qKLg5Afx70IwP5hyKhy8Jws3-N69LB8XhsL-B9JwRHaCaDdWLYj6v6hQ6D3RkLfAMvJ1msCLURyRxbvn-tzjsufNFdO7LMoWsU3T1J5IPvfFOZgsCHMKuUIVUXzoZye2EP4zEJbZPLBJKx-5RQkICQM6wMSUm9Ewf8ALWxyAVQXgRymkWQOojwDRmzR3lJ3WUftaUp5-c5WowPmuAaZOKPbHwlp7qi0Ey_MYnWQYcI-" />
<div className="absolute bottom-2 right-2 bg-primary px-2 py-1 rounded-md text-[10px] font-bold text-on-primary">TOP MENTOR</div>
</div>
<div className="flex-1 flex flex-col justify-center">
<div className="flex items-center gap-3 mb-2">
<h3 className="text-2xl font-bold text-on-surface">Elena Rodriguez</h3>
<div className="flex items-center px-2 py-0.5 bg-green-500/10 text-green-400 text-xs font-bold rounded border border-green-500/20">
                                        AVAILABLE NOW
                                    </div>
</div>
<p className="text-primary-fixed-dim font-medium mb-4">Principal Engineer at Meta • Ex-Google</p>
<p className="text-on-surface-variant text-sm mb-6 leading-relaxed max-w-lg">Specializing in large-scale distributed systems and architectural reviews. Mentored 150+ engineers to Senior roles.</p>
<div className="flex flex-wrap gap-2 mb-8">
<span className="px-3 py-1 bg-surface-container-highest rounded text-xs text-on-surface-variant">System Design</span>
<span className="px-3 py-1 bg-surface-container-highest rounded text-xs text-on-surface-variant">Kubernetes</span>
<span className="px-3 py-1 bg-surface-container-highest rounded text-xs text-on-surface-variant">Go</span>
</div>
<div className="flex gap-4">
<button className="px-6 py-2.5 bg-gradient-to-br from-primary to-primary-container text-on-primary-container font-bold rounded-xl shadow-[0px_0px_15px_rgba(144,147,255,0.3)]">Book Session</button>
<button className="px-6 py-2.5 bg-surface-container-highest text-on-surface font-bold rounded-xl">View Profile</button>
</div>
</div>
</div>
{/* Mentor Card 2 */}
<div className="group bg-surface-container-high rounded-2xl p-6 hover:bg-surface-bright transition-all transform hover:scale-[1.01] border border-outline-variant/5">
<div className="flex items-start justify-between mb-4">
<div className="flex items-center gap-4">
<div className="w-14 h-14 rounded-full overflow-hidden border-2 border-indigo-500/20">
<img alt="Mentor portrait" className="w-full h-full object-cover" data-alt="Portrait of a male product designer with a beard, creative studio lighting, artistic aesthetic" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCuxDwGkRBYTgnqz_Z0HAd0hYmYQj3kLU0xad-PScI1itlj4-Z0YCqnRdnUQsPf99nrTKa9ZD3CcUeJ7CIOLNYw_ZjJ_Xqe8E2RdnaL74ugbTzbYm4ANJNTeH5R4mH-SMt9re5gO8GeNbGL_ID5KWrVgqntSV9nvoNW74y5_Kia5bBX9tgnSe1QuX2ElKjJUEhsAGHpFhp6gPnjvXPCyvQMZWuK4pjb4zGOVRdLx4N9bWR9VhfEWQE7A2WIsgAbcjnCHJE2VSn5Ko9j" />
</div>
<div>
<h4 className="font-bold text-on-surface">Marcus Chen</h4>
<p className="text-xs text-on-surface-variant">Senior PM at Meta</p>
</div>
</div>
<div className="text-right">
<span className="block text-primary font-bold">$120</span>
<span className="text-[10px] text-outline uppercase font-black">per hour</span>
</div>
</div>
<p className="text-sm text-on-surface-variant mb-6 line-clamp-2 italic">"Focused on high-impact product launches and cross-functional leadership in big tech."</p>
<div className="flex items-center justify-between">
<div className="flex gap-1">
<span className="material-symbols-outlined text-yellow-500 text-sm" >star</span>
<span className="text-xs font-bold">4.9</span>
<span className="text-xs text-outline">(82 reviews)</span>
</div>
<button className="text-primary-fixed-dim text-sm font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                    Learn More <span className="material-symbols-outlined text-sm">arrow_forward</span>
</button>
</div>
</div>
{/* Mentor Card 3 */}
<div className="group bg-surface-container-high rounded-2xl p-6 hover:bg-surface-bright transition-all transform hover:scale-[1.01] border border-outline-variant/5">
<div className="flex items-start justify-between mb-4">
<div className="flex items-center gap-4">
<div className="w-14 h-14 rounded-full overflow-hidden border-2 border-indigo-500/20">
<img alt="Mentor portrait" className="w-full h-full object-cover" data-alt="Confident woman in business casual attire, soft office background, bright and airy lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2RVgdKBz1Jr8nUsVrVMQSavHgUpHavbutCprOyxgi0UGZvTN89iJ2DIsYXlLBY3aheuWtJz7kTdaXCKOBqxZ3_fLyyN1u7sbK4PVcAY9L_bynotPDprIGcelNKKjTVIvn6hXV-OGuXMNaCfDFFRaMWrL5yPB6TT3qck6JMBAETkie07SK9540Wq7BQYzXAcLRocf-IJEajQzoBfFgad06GlhobUMNP4NCwixTcQkX0TXvhjdAG67pqQxY7lZTm9U1qCj5zvHzS8wM" />
</div>
<div>
<h4 className="font-bold text-on-surface">Sarah Jenkins</h4>
<p className="text-xs text-on-surface-variant">L7 Staff Engineer at Meta</p>
</div>
</div>
<div className="text-right">
<span className="block text-primary font-bold">$250</span>
<span className="text-[10px] text-outline uppercase font-black">per hour</span>
</div>
</div>
<p className="text-sm text-on-surface-variant mb-6 line-clamp-2 italic">"Helping you navigate the transition from Senior to Staff+ with technical excellence."</p>
<div className="flex items-center justify-between">
<div className="flex gap-1">
<span className="material-symbols-outlined text-yellow-500 text-sm" >star</span>
<span className="text-xs font-bold">5.0</span>
<span className="text-xs text-outline">(114 reviews)</span>
</div>
<button className="text-primary-fixed-dim text-sm font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                    Learn More <span className="material-symbols-outlined text-sm">arrow_forward</span>
</button>
</div>
</div>
{/* Community Query Card (Asymmetric Layout) */}
<div className="xl:col-span-2 glass-panel rounded-2xl p-8 border border-primary/10 relative overflow-hidden">
<div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
<div className="relative z-10">
<div className="flex items-center gap-2 mb-4">
<span className="material-symbols-outlined text-tertiary">chat_bubble</span>
<span className="text-xs font-bold uppercase tracking-widest text-tertiary">Trending Community Query</span>
</div>
<h3 className="text-2xl font-bold mb-4 leading-tight">"What is the current interview focus for E5 roles at Meta London vs. Menlo Park?"</h3>
<div className="flex items-center gap-6 mb-6">
<div className="flex -space-x-3">
<img alt="Avatar" className="w-10 h-10 rounded-full border-4 border-surface ring-2 ring-transparent" data-alt="Minimalist avatar of a person" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8vqW11wzFmrm8tVARw8kpgDdFS2T14X1kEn4l2CZEpefJjn2Vqun0Yc-jSDWRY05veXKzNwdlzuQaCElPe7QphP5xd1kQ_cP0e0dVl0K3cWVI2nf-wHqD2Fgqoe_rMJz2xgXQ_E6cm_R3eS0KxxIZHrFcWy-OVEuYzHkx7qTJlyid1JJEBlIChyZnj1B8UBrUGMNXVVinaV0Wk0b1JvGAWXLXTrZ5FboyuCqWOjWjQBOmoJCDM5qTEw2EtKBN6NuNbQgtcCJBbwge" />
<img alt="Avatar" className="w-10 h-10 rounded-full border-4 border-surface ring-2 ring-transparent" data-alt="Minimalist avatar of a person" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDoD0cQN1YDl2-pxSrfH3RCz__blwk05snO53qC_IcQGeKa4gwk53Sw-RDF0A5cjFmKvhm9ZJR34b3BukWxMabM888kBRDNbGLmB_0RQNJL32MS03KxCagtGDqwVurC7q9qA5dVa-nM_C0zNKggYVfDlLAo3WACeiHca4WcrUY4V_I77qnxtK7Fqe1b-IJiClNzEVPde3H_vxUoErM2CgfgxDVEESowGtf2H4G4rv9W8rNAPbPVlKbjrgYjz9zS-mEeNoUr44J_B6C" />
<img alt="Avatar" className="w-10 h-10 rounded-full border-4 border-surface ring-2 ring-transparent" data-alt="Minimalist avatar of a person" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIig0tApxmTWUZgaa8ZTIT1G55IkkcIN36vUb1dzRK2TnA2Zc0EWfO2K3jvqGz6-ozIAhFLnyFDSYL5U7AyaRkdnHQ7gITl8GD108WO_jRE8SD26VBL_2d8jiHuT5FDdGu-qgQdZfJjNPEVgPM3FHchUHww8RCJKTktrTnWj8uDeqHod26sSYJaCcviYKxEb0fOV2-J2_WTA9q4Kp_UmufBStHR4VBKKh80KRrq47p2maYvS6Xev-ttuXaPlRJaR--lpi7UERfFtYV" />
<div className="w-10 h-10 rounded-full bg-surface-container-highest border-4 border-surface flex items-center justify-center text-[10px] font-bold text-on-surface">+14</div>
</div>
<p className="text-sm text-on-surface-variant">14 mentors and 200+ users are discussing this topic</p>
</div>
<button className="px-6 py-3 bg-tertiary-container text-on-tertiary-container font-bold rounded-xl hover:bg-tertiary transition-colors">Join Discussion</button>
</div>
</div>
</div>
</div>
</div>

</div>
{/* Mobile BottomNavBar (Hidden on MD) */}
<nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#060e20]/95 backdrop-blur-lg px-6 py-4 flex justify-between items-center z-50">
<button className="flex flex-col items-center gap-1 text-indigo-400">
<span className="material-symbols-outlined" >search</span>
<span className="text-[10px] font-bold">Discover</span>
</button>
<button className="flex flex-col items-center gap-1 text-slate-500">
<span className="material-symbols-outlined">group</span>
<span className="text-[10px]">Connect</span>
</button>
<button className="flex flex-col items-center gap-1 text-slate-500">
<span className="material-symbols-outlined">manage_search</span>
<span className="text-[10px]">Queries</span>
</button>
<button className="flex flex-col items-center gap-1 text-slate-500">
<span className="material-symbols-outlined">settings</span>
<span className="text-[10px]">Settings</span>
</button>
</nav>
{/* Floating Action Button (Only on Explore/Home) */}
<button className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-primary to-primary-container text-on-primary-container rounded-full shadow-[0px_10px_30px_rgba(144,147,255,0.4)] flex items-center justify-center group active:scale-90 transition-all z-40">
<span className="material-symbols-outlined text-3xl group-hover:rotate-90 transition-transform">add</span>
</button>
        </React.Fragment>
    );
};

export default ExploreFilters;
