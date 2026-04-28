import React from 'react';
import { Link } from 'react-router-dom';

const SearchResults = () => {
    return (
        <React.Fragment>
            {/* TopNavBar */}

<div className="flex">
{/* SideNavBar */}

{/* Main Content Canvas */}

{/* Hero Header */}
<header className="mb-12">
<div className="flex items-center gap-2 text-primary-fixed-dim mb-2 text-sm font-medium">
<span>Search Results</span>
<span className="material-symbols-outlined text-xs">chevron_right</span>
<span className="text-on-surface-variant">"Google"</span>
</div>
<h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface mb-4">
                    Exploring the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-tertiary">Google ecosystem</span>
</h1>
<p className="text-on-surface-variant max-w-2xl text-lg leading-relaxed">
                    Found 124 results including top-tier mentors, trending technical queries, and strategic company insights within the Alphabet network.
                </p>
</header>
{/* Bento Grid Search Summary */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
{/* Mentors Summary Card */}
<div className="bg-surface-container-high p-6 rounded-2xl border border-outline-variant/10 hover:bg-surface-bright transition-all group scale-100 hover:scale-[1.01]">
<div className="flex justify-between items-start mb-6">
<div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
<span className="material-symbols-outlined">group</span>
</div>
<span className="text-3xl font-bold text-on-surface">42</span>
</div>
<h3 className="text-xl font-bold mb-2">Mentors</h3>
<p className="text-on-surface-variant text-sm mb-4">Senior Engineers, PMs, and Designers currently at or alumni of Google.</p>
<div className="flex -space-x-2">
<img alt="Mentor" className="w-8 h-8 rounded-full border-2 border-surface" data-alt="Portrait of a diverse male professional smiling, warm evening light" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzlQ3iL06TuACxgwsFg8O0N3oDkgfQ4iDIW2tA-Xbuhhhqi59EBoSh58l6itfEc-rnEQN5x78_DZXRp0eITglyxlrbP124pHER9eWi78OpqaO5GZ1TS-OU1bPkHXpMP5r0iOW2PpSXw91Ta_RIIWMWGo2_B1CuxK6GkuHKlLMfjU1_j_dkjpOEqGxsV6tnLolYmATtJorteFV308XQodLuzdczGT42DGcv8vpBnmsjfdctdWH3_5EarMHcHBZIFZrfVIA2SLdm6NZb" />
<img alt="Mentor" className="w-8 h-8 rounded-full border-2 border-surface" data-alt="Portrait of a female professional with glasses in a modern office" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbhgiphjx_gPoz2Fej0zpYOrcfm0x7yZxjdX5ym4tzmwrOk-fDPB7tBRX7yY9fwLnI7bakTVJO1JFj0_F7Dj-3jqPTT1rpIDdWzWbeBtpP5uhXGygVePudKW7h6PhbHVLqhCsHBsqUOmWUgb7z59jBuH1XhBSPYSB8vyGDr37G6NavfbnZbVWUOrGt-eWE9L31l_8rD5BgUsz88px9PvFV1kG3DaEjJYfnFyA2LCMZ_1evvGxzSukiDneyGLu07aerZ4zEnWSWcWS9" />
<img alt="Mentor" className="w-8 h-8 rounded-full border-2 border-surface" data-alt="Portrait of a male developer with a confident expression" src="https://lh3.googleusercontent.com/aida-public/AB6AXuChBy6AQM4brgSAoOQnOW2GEtxvNYQ4NVLCMGEahn68rnvPZWKB2d8IyfG-jHLrD5BIu3kmgMvj_Tm7M5ccoDVydp87yT72b88Ap_P4xXBE6JuU_oDyEzP_OW1yTelcR2SchgH3uvCqCySHZhJOcLxSJ6BNYVTr2G11gm28nUEpfSw3B6VAYwEPsBWwfFjPfYMF0O9QDeJRck0EzAejYlrSc7ziB0MrgZIfo7BtlALE0dRuarXSvQ2DEP2KkKeNrWvKKrJ46dGNPw8H" />
<div className="w-8 h-8 rounded-full border-2 border-surface bg-surface-container-highest flex items-center justify-center text-[10px] font-bold">+39</div>
</div>
</div>
{/* Queries Summary Card */}
<div className="bg-surface-container-high p-6 rounded-2xl border border-outline-variant/10 hover:bg-surface-bright transition-all group scale-100 hover:scale-[1.01]">
<div className="flex justify-between items-start mb-6">
<div className="w-12 h-12 rounded-xl bg-tertiary/10 flex items-center justify-center text-tertiary">
<span className="material-symbols-outlined">manage_search</span>
</div>
<span className="text-3xl font-bold text-on-surface">18</span>
</div>
<h3 className="text-xl font-bold mb-2">Active Queries</h3>
<p className="text-on-surface-variant text-sm mb-4">Ongoing discussions about Google's interview process and internal culture.</p>
<div className="flex flex-wrap gap-2">
<span className="bg-secondary-container px-2 py-1 rounded text-[10px] text-secondary font-bold uppercase tracking-wider">L5 Interview</span>
<span className="bg-secondary-container px-2 py-1 rounded text-[10px] text-secondary font-bold uppercase tracking-wider">GCP Architecture</span>
</div>
</div>
{/* Companies Summary Card */}
<div className="bg-surface-container-high p-6 rounded-2xl border border-outline-variant/10 hover:bg-surface-bright transition-all group scale-100 hover:scale-[1.01]">
<div className="flex justify-between items-start mb-6">
<div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
<span className="material-symbols-outlined">corporate_fare</span>
</div>
<span className="text-3xl font-bold text-on-surface">03</span>
</div>
<h3 className="text-xl font-bold mb-2">Entities</h3>
<p className="text-on-surface-variant text-sm mb-4">Deep dives into Google, DeepMind, and Waymo organizational structures.</p>
<div className="flex items-center gap-3">
<div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center overflow-hidden">
<span className="text-[10px] font-black text-on-surface">G</span>
</div>
<div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center overflow-hidden">
<span className="text-[10px] font-black text-on-surface">DM</span>
</div>
<div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center overflow-hidden">
<span className="text-[10px] font-black text-on-surface">W</span>
</div>
</div>
</div>
</div>
{/* Detailed Results */}
<section className="space-y-12">
{/* Category: Mentors */}
<div>
<div className="flex items-center justify-between mb-8">
<div className="flex items-center gap-4">
<h2 className="text-2xl font-bold">Featured Mentors</h2>
<div className="h-[1px] w-32 bg-gradient-to-r from-primary/50 to-transparent"></div>
</div>
<button className="text-primary text-sm font-semibold hover:underline">View all 42</button>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
{/* Connection Glass Card */}
<div className="glass-panel p-6 rounded-2xl flex gap-6 group">
<div className="relative">
<img alt="Alex Rivera" className="w-24 h-24 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all duration-500" data-alt="Close-up portrait of a female software engineer with a neutral expression in a high-tech office setting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJ48YR1uk1NUq6OVlw1MaM1APR1ApoxgkAHYahtF0VJS_FGnalNcdUNDBniwkyaDfX5aRWkjlLHZRV9tFz_T4orWxc5CeBokur8lJLD4ZXVVb8P3IuToOxF9I-x7Ncq3bWDXkOa7k53p1yvDV3jLAuIZeXaowx_kKMFNDRzdV5qJcjKqQwo8qMnvvm9pgagf_1NeFpT7PjqZxWKy9K7DMRDOL3pXiOqP_ot2JsaABm-Dbe4VLdUtWKlwV7sUlQ49_9NXxQJ9x6jfjk" />
<div className="absolute -bottom-2 -right-2 bg-green-500 w-4 h-4 rounded-full border-4 border-[#0c1934]"></div>
</div>
<div className="flex-1">
<div className="flex justify-between items-start">
<div>
<h4 className="text-lg font-bold text-on-surface">Alex Rivera</h4>
<p className="text-primary text-sm font-medium">Staff Engineer at Google Cloud</p>
</div>
<span className="material-symbols-outlined text-outline-variant">verified</span>
</div>
<p className="text-on-surface-variant text-sm mt-3 line-clamp-2">Ex-AWS. Specializing in high-scale distributed systems and Kubernetes orchestration.</p>
<div className="mt-4 flex gap-2">
<span className="bg-surface-container px-3 py-1 rounded-full text-xs text-on-surface-variant font-medium">Distributed Systems</span>
<span className="bg-surface-container px-3 py-1 rounded-full text-xs text-on-surface-variant font-medium">Mentorship</span>
</div>
</div>
</div>
<div className="glass-panel p-6 rounded-2xl flex gap-6 group">
<div className="relative">
<img alt="David Chen" className="w-24 h-24 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all duration-500" data-alt="Professional headshot of a male product manager in a minimalist studio setting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNsCRtd_76Fvw6LnWtMqDqiMzKWNdp_EhWSnHZsawqzOov-VnIJuNpjbPd2KKkK4iwIwHLRdQ4dxG4ACbhDqz4G0TAjtOEqtpHAaoNpeleYgK-FaqoJfAcZM_vqC1bXYKXKCabevvEC9vFL0Rv1fA5nmUPRXPYbhe6IByB9W3DTNbmMLnFMLwAjXq39CNfiCoSmIIuGohehWm_4zYa0iEw-U9hEWwpI1PGu2FXVw0xJtnaHnVJGlKc4UJQ7sJeLHz8ahJVdsp07B5U" />
<div className="absolute -bottom-2 -right-2 bg-orange-500 w-4 h-4 rounded-full border-4 border-[#0c1934]"></div>
</div>
<div className="flex-1">
<div className="flex justify-between items-start">
<div>
<h4 className="text-lg font-bold text-on-surface">David Chen</h4>
<p className="text-primary text-sm font-medium">Principal PM at Google Ads</p>
</div>
<span className="material-symbols-outlined text-outline-variant">verified</span>
</div>
<p className="text-on-surface-variant text-sm mt-3 line-clamp-2">8+ years at Google. Can help with PM interview prep and navigating big tech politics.</p>
<div className="mt-4 flex gap-2">
<span className="bg-surface-container px-3 py-1 rounded-full text-xs text-on-surface-variant font-medium">Product Strategy</span>
<span className="bg-surface-container px-3 py-1 rounded-full text-xs text-on-surface-variant font-medium">Interviews</span>
</div>
</div>
</div>
</div>
</div>
{/* Category: Top Queries */}
<div className="pt-8">
<div className="flex items-center justify-between mb-8">
<div className="flex items-center gap-4">
<h2 className="text-2xl font-bold">Top Queries</h2>
<div className="h-[1px] w-32 bg-gradient-to-r from-tertiary/50 to-transparent"></div>
</div>
<button className="text-tertiary text-sm font-semibold hover:underline">Browse Queries</button>
</div>
<div className="space-y-4">
<div className="bg-surface-container-low p-5 rounded-2xl flex items-center justify-between hover:bg-surface-container transition-all cursor-pointer">
<div className="flex items-center gap-6">
<div className="text-tertiary font-bold text-lg w-8">01</div>
<div>
<h4 className="font-bold text-on-surface">Google L4 vs L5 Expectations: The Real Difference</h4>
<div className="flex items-center gap-3 mt-1">
<span className="text-xs text-on-surface-variant">Last updated 2 days ago</span>
<span className="w-1 h-1 rounded-full bg-outline-variant"></span>
<span className="text-xs text-tertiary-fixed font-semibold">124 replies</span>
</div>
</div>
</div>
<span className="material-symbols-outlined text-outline-variant">chevron_right</span>
</div>
<div className="bg-surface-container-low p-5 rounded-2xl flex items-center justify-between hover:bg-surface-container transition-all cursor-pointer">
<div className="flex items-center gap-6">
<div className="text-tertiary font-bold text-lg w-8">02</div>
<div>
<h4 className="font-bold text-on-surface">Preparing for the "Googlyness" Interview in 2024</h4>
<div className="flex items-center gap-3 mt-1">
<span className="text-xs text-on-surface-variant">Last updated 5 hours ago</span>
<span className="w-1 h-1 rounded-full bg-outline-variant"></span>
<span className="text-xs text-tertiary-fixed font-semibold">89 replies</span>
</div>
</div>
</div>
<span className="material-symbols-outlined text-outline-variant">chevron_right</span>
</div>
<div className="bg-surface-container-low p-5 rounded-2xl flex items-center justify-between hover:bg-surface-container transition-all cursor-pointer">
<div className="flex items-center gap-6">
<div className="text-tertiary font-bold text-lg w-8">03</div>
<div>
<h4 className="font-bold text-on-surface">Internal Transfer: YouTube to DeepMind Path</h4>
<div className="flex items-center gap-3 mt-1">
<span className="text-xs text-on-surface-variant">Last updated 1 week ago</span>
<span className="w-1 h-1 rounded-full bg-outline-variant"></span>
<span className="text-xs text-tertiary-fixed font-semibold">42 replies</span>
</div>
</div>
</div>
<span className="material-symbols-outlined text-outline-variant">chevron_right</span>
</div>
</div>
</div>
{/* Category: Companies */}
<div className="pt-8 pb-20">
<div className="flex items-center justify-between mb-8">
<div className="flex items-center gap-4">
<h2 className="text-2xl font-bold">Company Profiles</h2>
<div className="h-[1px] w-32 bg-gradient-to-r from-secondary/50 to-transparent"></div>
</div>
</div>
<div className="bg-surface-container-high rounded-3xl overflow-hidden relative group">
<div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
<div className="flex flex-col md:flex-row">
<div className="md:w-2/5 h-64 md:h-auto overflow-hidden">
<img alt="Google Office" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" data-alt="Interior of a modern, vibrant tech office with open spaces, colorful furniture, and natural light" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdSKEBFSLhcGqDo01_6L1ybiFFBG88AKb0Wmyh77LXNy001OOE3-KfmzcylpA5TV-0wPtZPUP5jz4pQ_pnyTkLsC0D6N9gijgr4oOFWmPnJ359XuW4gwf0Hml8PZ-RmltudlO6m7ff0DePIeUaU8QNr2DQdozp9UwszTglEHc-hK9SFbjZ3aR9ybQ6atF_y0YNTbPMqvPWYqpNzk9DTO1fuJlxxJV5frKq0VHgE5cSmdffJ6zeJiJ_RQsjpgY0dliKe6qj6xSQV7gx" />
</div>
<div className="p-8 md:p-12 md:w-3/5 flex flex-col justify-center">
<div className="flex items-center gap-4 mb-4">
<div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center p-2">
<img alt="Google" className="w-full h-auto" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjUaaeI2AGyBR09q_n_L744MGVqNN_wFiwxNR7BbGmS3PVGD5iZnZ0igp09CLZuMcAEAWV5qqfYxDFHworwmQGIAWVxupBpEOK1-qGTO-bDNSz0b40R6uyWLFjFXtCMX67PS30EVgmKmDJR3217-A2xBYukL8GuIms5qZtEQLi8zEMlcZ650QrMzb6fgCnjR7JQByeYgfoRYFFBOeZtLwfp57l24SQUIwvwrSRg8eadT7XA4Sk3EwQ_medaxXMzXZ9809w6_8GtEu9"  />
</div>
<h3 className="text-2xl font-bold">Google (Alphabet Inc.)</h3>
</div>
<p className="text-on-surface-variant text-lg mb-8 leading-relaxed">
                                    The global leader in search and cloud computing. Known for its rigorous hiring standards, high-performance culture, and expansive internal mobility programs.
                                </p>
<div className="grid grid-cols-3 gap-6 mb-8">
<div>
<p className="text-xs text-on-surface-variant uppercase tracking-widest font-bold">Difficulty</p>
<p className="text-tertiary font-bold">Very High</p>
</div>
<div>
<p className="text-xs text-on-surface-variant uppercase tracking-widest font-bold">Avg. TC</p>
<p className="text-tertiary font-bold">$210k - $450k</p>
</div>
<div>
<p className="text-xs text-on-surface-variant uppercase tracking-widest font-bold">Hiring State</p>
<p className="text-secondary font-bold">Selective</p>
</div>
</div>
<button className="self-start px-6 py-3 bg-surface-container-highest text-on-surface font-bold rounded-xl border border-outline-variant/20 hover:border-primary/40 transition-all">
                                    Explore Company Insights
                                </button>
</div>
</div>
</div>
</div>
</section>

</div>
{/* Mobile Navigation (Suppressed based on platform rule, but included for complete UI logic) */}
<nav className="md:hidden fixed bottom-0 left-0 right-0 glass-panel border-t border-outline-variant/10 flex justify-around py-3 z-50">
<button className="flex flex-col items-center gap-1 text-primary">
<span className="material-symbols-outlined">search</span>
<span className="text-[10px] font-bold">Discover</span>
</button>
<button className="flex flex-col items-center gap-1 text-slate-500">
<span className="material-symbols-outlined">group</span>
<span className="text-[10px] font-bold">Network</span>
</button>
<button className="flex flex-col items-center gap-1 text-slate-500">
<span className="material-symbols-outlined">manage_search</span>
<span className="text-[10px] font-bold">Queries</span>
</button>
<button className="flex flex-col items-center gap-1 text-slate-500">
<span className="material-symbols-outlined">settings</span>
<span className="text-[10px] font-bold">Settings</span>
</button>
</nav>
        </React.Fragment>
    );
};

export default SearchResults;
