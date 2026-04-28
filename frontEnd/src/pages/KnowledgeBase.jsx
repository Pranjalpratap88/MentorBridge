import React from 'react';
import { Link } from 'react-router-dom';

const KnowledgeBase = () => {
    return (
        <React.Fragment>
            {/* TopNavBar */}

<div className="flex min-h-screen">
{/* SideNavBar */}

{/* Main Content Canvas */}

{/* Hero Search Section */}
<section className="mb-16 text-center max-w-3xl mx-auto">
<h1 className="text-5xl font-extrabold font-headline text-on-surface mb-6 tracking-tight">Knowledge Base</h1>
<p className="text-on-surface-variant text-lg mb-10 leading-relaxed">
                    Access expert-verified guides and converted mentor insights to navigate your professional journey.
                </p>
<div className="relative group">
<div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
<span className="material-symbols-outlined text-primary">search</span>
</div>
<input className="w-full bg-surface-container-low border-none rounded-2xl py-5 pl-14 pr-6 text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary/50 glass-panel shadow-2xl transition-all" placeholder="Search for answers, guides, or system design patterns..." type="text" />
</div>
</section>
{/* Category Bento Grid */}
<section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
{/* Placement Tips */}
<div className="group relative overflow-hidden rounded-3xl bg-surface-container-high p-8 hover:bg-surface-bright transition-all duration-300 cursor-pointer ghost-border hover:scale-[1.01]">
<div className="flex flex-col h-full justify-between gap-12 relative z-10">
<div>
<div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
<span className="material-symbols-outlined text-primary">rocket_launch</span>
</div>
<h3 className="text-2xl font-bold font-headline mb-3">Placement Tips</h3>
<p className="text-on-surface-variant text-sm leading-relaxed">Insider strategies for landing roles at FAANG+ and high-growth startups.</p>
</div>
<div className="flex items-center gap-2 text-primary font-semibold text-sm">
                            Explore Guides <span className="material-symbols-outlined text-sm">arrow_forward</span>
</div>
</div>
<div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
<span className="material-symbols-outlined text-9xl">school</span>
</div>
</div>
{/* Technical Round Guides */}
<div className="group relative overflow-hidden rounded-3xl bg-surface-container-high p-8 hover:bg-surface-bright transition-all duration-300 cursor-pointer ghost-border hover:scale-[1.01]">
<div className="flex flex-col h-full justify-between gap-12 relative z-10">
<div>
<div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-6">
<span className="material-symbols-outlined text-secondary">terminal</span>
</div>
<h3 className="text-2xl font-bold font-headline mb-3">Technical Round Guides</h3>
<p className="text-on-surface-variant text-sm leading-relaxed">Deep dives into DS&amp;A, language-specific nuances, and coding best practices.</p>
</div>
<div className="flex items-center gap-2 text-secondary font-semibold text-sm">
                            View Roadmap <span className="material-symbols-outlined text-sm">arrow_forward</span>
</div>
</div>
<div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
<span className="material-symbols-outlined text-9xl">code_blocks</span>
</div>
</div>
{/* System Design 101 */}
<div className="group relative overflow-hidden rounded-3xl bg-surface-container-high p-8 hover:bg-surface-bright transition-all duration-300 cursor-pointer ghost-border hover:scale-[1.01]">
<div className="flex flex-col h-full justify-between gap-12 relative z-10">
<div>
<div className="w-12 h-12 rounded-xl bg-tertiary/10 flex items-center justify-center mb-6">
<span className="material-symbols-outlined text-tertiary">hub</span>
</div>
<h3 className="text-2xl font-bold font-headline mb-3">System Design 101</h3>
<p className="text-on-surface-variant text-sm leading-relaxed">From monolithic architectures to distributed microservices and scalability.</p>
</div>
<div className="flex items-center gap-2 text-tertiary font-semibold text-sm">
                            Study Cases <span className="material-symbols-outlined text-sm">arrow_forward</span>
</div>
</div>
<div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
<span className="material-symbols-outlined text-9xl">schema</span>
</div>
</div>
</section>
{/* Featured Articles: The Knowledge Pulse */}
<section className="mb-20">
<div className="flex items-end justify-between mb-8">
<div>
<h2 className="text-3xl font-bold font-headline mb-2">Featured Mentor Insights</h2>
<p className="text-on-surface-variant">Top-rated answers curated into deep-dive articles.</p>
</div>
<button className="text-primary font-bold hover:underline">View all posts</button>
</div>
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
{/* Featured Article 1 */}
<article className="group bg-surface-container-low rounded-[2rem] overflow-hidden ghost-border flex flex-col md:flex-row h-full hover:bg-surface-container transition-colors">
<div className="md:w-2/5 relative">
<img alt="Modern Workspace" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" data-alt="Cyberpunk style minimalist workspace with purple neon accents, mechanical keyboard, and abstract digital art on multiple monitors" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBd8g24Vm7NkUt_0eZfX616eF8-jq8y3c4vs45sWyXSazFtFtymUKroPA0NXgAqd4qbw53OTb1oHB7qTRlZ5j5kqOa8gG6PXNEXMk30OGky3ebi8Ai-XJFZ7niQlgWDjf7FCDE1tOhbqZcLva0lmaXfvo9ihhiBmcnOekjF-ro5hdb1NBSjQWo2ip2-fSNQix5Q-Kb8kSE4Gazi_15sb_eF9ul45-OwcV0xx9yrFFseVLnGlLTWgjPu1UrIofMn6wdwC_Usm-cENm7_" />
<div className="absolute top-4 left-4">
<span className="bg-primary/90 text-on-primary text-[10px] font-bold px-3 py-1 rounded-full tracking-widest uppercase">Editor's Choice</span>
</div>
</div>
<div className="md:w-3/5 p-8 flex flex-col justify-between">
<div>
<div className="flex items-center gap-2 mb-4">
<span className="px-2 py-1 bg-secondary-container text-secondary text-[10px] font-bold rounded uppercase font-label">System Design</span>
<span className="text-outline text-xs">• 8 min read</span>
</div>
<h3 className="text-2xl font-bold font-headline mb-4 group-hover:text-primary transition-colors leading-tight">Architecting for 10M Concurrent Users</h3>
<p className="text-on-surface-variant text-sm line-clamp-3 mb-6">Learn how top engineering teams handle extreme traffic spikes using Redis caching layers and edge computing strategies...</p>
</div>
<div className="flex items-center gap-3">
<img alt="Mentor" className="w-8 h-8 rounded-full" data-alt="Close up of a confident female tech lead with glasses and professional attire" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjDAorVMf8GKdTOSYlNgKP-X4t5uxbZM6QTVROi4Ou90p1XCcXAc43Tzg1K0MSwDd-lhhB83pRUxKlHUrtwZEVFtUerGBDcPAezqIY_g6B-eY-MY4MTTDDBQChrxSjubo4RF-FJYmREYUZ7kPEStiGClWuoXXZsMDL-o3ECbcgSMLTtGTXYDHYSMy4XsXJtCIf2j_ham4G5JDe7zSR-67AwTgM7R9BBFR05gDQ4KdIKRsIAARP8yELXrg3DFr3IZsG7z2lSO0WDQtf" />
<div>
<p className="text-sm font-bold">Sarah Chen</p>
<p className="text-[10px] text-outline">L8 Principal Engineer @ Meta</p>
</div>
</div>
</div>
</article>
{/* Featured Article 2 */}
<article className="group bg-surface-container-low rounded-[2rem] overflow-hidden ghost-border flex flex-col md:flex-row h-full hover:bg-surface-container transition-colors">
<div className="md:w-2/5 relative">
<img alt="Collaboration" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" data-alt="Minimalist architectural space with flowing white curves and soft blue ambient lighting representing connection and growth" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKV-SYR9dcGHNgpNqVepf8nWvoQK-vN4pVGgbTc9UauezkBeCNfKd5ShM4r9LC_r8nvENYvv9M8cgeLBFIe0mbw2v0oUO1bwQ1pP-UJ9-m_5dPLC48sv-i3tqSz_K2VryabM03o2Bfi1Kd2YI5DYnuVdWpQNC27v8G8ftsXH1ugNDASOX3SocIcx_4bGZfpY5T0uSi_kcG90hY-WMSALjq3-tcUCSF_LDsUjmji9zIlmTgaJ_Smzgp65I2TlGZU_-h3ZKc09jYlphL" />
<div className="absolute top-4 left-4">
<span className="bg-tertiary/90 text-on-tertiary text-[10px] font-bold px-3 py-1 rounded-full tracking-widest uppercase">Top Rated</span>
</div>
</div>
<div className="md:w-3/5 p-8 flex flex-col justify-between">
<div>
<div className="flex items-center gap-2 mb-4">
<span className="px-2 py-1 bg-secondary-container text-secondary text-[10px] font-bold rounded uppercase font-label">Placement Tips</span>
<span className="text-outline text-xs">• 12 min read</span>
</div>
<h3 className="text-2xl font-bold font-headline mb-4 group-hover:text-primary transition-colors leading-tight">Mastering the Behavioral Interview Grid</h3>
<p className="text-on-surface-variant text-sm line-clamp-3 mb-6">The STAR method is just the beginning. Discover how to map your experiences to company values for maximum impact...</p>
</div>
<div className="flex items-center gap-3">
<img alt="Mentor" className="w-8 h-8 rounded-full" data-alt="Portrait of a smiling male senior recruiter with a friendly and approachable look" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvitQfFgJk4NUrzmxHSdbulGpOhW1TJ-NR-CpVjdz5iVXFxKu7ymOjf6mLxn3jm_DY7amBSxEEKr-Dir0bOyJEl6zcwgDVhfcAeLBPRkqpkQLXFa_n4j_DM-aCiMbuAx8kVyQsKfgj9blelJZsHWUOeu6VZSQxpW4jnxoh33mOrYvEler2dG-BtC0NIRqX0bVOt_elxR6fA4PSx3vjXuhGJ1OqhLdDvWOrS98zuSgAJvFKZrm8ZYkK4MeDJoyrEZ8HH-bmuyFNvBn4" />
<div>
<p className="text-sm font-bold">Marcus Thorne</p>
<p className="text-[10px] text-outline">Sr. Technical Recruiter @ Google</p>
</div>
</div>
</div>
</article>
</div>
</section>
{/* Quick Access / Latest Queries Section */}
<section className="mb-20">
<div className="bg-surface-container-low rounded-3xl p-10 relative overflow-hidden">
<div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
<div className="max-w-xl text-center md:text-left">
<h2 className="text-3xl font-extrabold font-headline mb-4">Can't find what you're looking for?</h2>
<p className="text-on-surface-variant text-lg">Ask our network of 500+ industry experts directly and get an answer within 24 hours.</p>
</div>
<button className="bg-surface-bright border border-primary/20 text-on-surface px-8 py-4 rounded-xl font-bold hover:bg-primary/10 transition-all active:scale-95 flex items-center gap-3">
<span className="material-symbols-outlined">chat</span>
                            Submit a Query
                        </button>
</div>
{/* Background ambient glow */}
<div className="absolute -right-20 -bottom-20 w-80 h-80 bg-primary/10 blur-[100px] rounded-full"></div>
<div className="absolute -left-20 -top-20 w-80 h-80 bg-secondary/10 blur-[100px] rounded-full"></div>
</div>
</section>
{/* Popular Tags */}
<section className="flex flex-wrap gap-3 justify-center mb-12">
<span className="px-5 py-2 rounded-full bg-surface-container-high text-on-surface-variant text-sm font-medium hover:bg-primary/20 hover:text-primary cursor-pointer transition-all transition-all duration-300">#leetcode</span>
<span className="px-5 py-2 rounded-full bg-surface-container-high text-on-surface-variant text-sm font-medium hover:bg-primary/20 hover:text-primary cursor-pointer transition-all duration-300">#resumereview</span>
<span className="px-5 py-2 rounded-full bg-surface-container-high text-on-surface-variant text-sm font-medium hover:bg-primary/20 hover:text-primary cursor-pointer transition-all duration-300">#reactjs</span>
<span className="px-5 py-2 rounded-full bg-surface-container-high text-on-surface-variant text-sm font-medium hover:bg-primary/20 hover:text-primary cursor-pointer transition-all duration-300">#scalability</span>
<span className="px-5 py-2 rounded-full bg-surface-container-high text-on-surface-variant text-sm font-medium hover:bg-primary/20 hover:text-primary cursor-pointer transition-all duration-300">#salarynegotiation</span>
<span className="px-5 py-2 rounded-full bg-surface-container-high text-on-surface-variant text-sm font-medium hover:bg-primary/20 hover:text-primary cursor-pointer transition-all duration-300">#kubernetes</span>
<span className="px-5 py-2 rounded-full bg-surface-container-high text-on-surface-variant text-sm font-medium hover:bg-primary/20 hover:text-primary cursor-pointer transition-all duration-300">#golang</span>
</section>

</div>
{/* Mobile Navigation */}
<nav className="md:hidden fixed bottom-0 left-0 right-0 glass-panel border-t border-primary/5 flex justify-around py-3 px-4 z-50">
<button className="flex flex-col items-center gap-1 text-primary">
<span className="material-symbols-outlined">search</span>
<span className="text-[10px] font-medium">Discover</span>
</button>
<button className="flex flex-col items-center gap-1 text-slate-400">
<span className="material-symbols-outlined">group</span>
<span className="text-[10px] font-medium">Network</span>
</button>
<button className="flex flex-col items-center gap-1 text-slate-400">
<span className="material-symbols-outlined">manage_search</span>
<span className="text-[10px] font-medium">Queries</span>
</button>
<button className="flex flex-col items-center gap-1 text-slate-400">
<span className="material-symbols-outlined">settings</span>
<span className="text-[10px] font-medium">Settings</span>
</button>
</nav>
        </React.Fragment>
    );
};

export default KnowledgeBase;
