import React from 'react';
import { Link } from 'react-router-dom';

const ResumeReview = () => {
    return (
        <React.Fragment>
            {/* SideNavBar (Authority: JSON & Conflict Resolution) */}

{/* Main Content Canvas */}

{/* TopAppBar (Authority: JSON) */}

<section className="flex-1 p-8 grid grid-cols-12 gap-8 items-start">
{/* Document Workspace (The Canvas) */}
<div className="col-span-12 xl:col-span-8 flex flex-col gap-6">
{/* Document Header */}
<div className="flex justify-between items-end">
<div>
<div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest mb-1">
<span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                            Live Review Session
                        </div>
<h2 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight">Technical_Resume_V4.pdf</h2>
<p className="text-on-surface-variant text-sm mt-1">Uploaded 2 hours ago • Reviewed by Sarah J.</p>
</div>
<div className="flex gap-3">
<button className="px-5 py-2.5 rounded-xl bg-surface-container-high text-on-surface font-semibold text-sm hover:bg-surface-bright transition-colors flex items-center gap-2">
<span className="material-symbols-outlined text-lg">download</span>
                            Export
                        </button>
<button className="px-5 py-2.5 rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold text-sm shadow-lg hover:scale-105 transition-transform">
                            Update Document
                        </button>
</div>
</div>
{/* Document Viewer */}
<div className="relative group">
{/* Annotation Layer Overlay (Abstract Representation) */}
<div className="absolute inset-0 z-10 pointer-events-none">
<div className="absolute top-[15%] left-[20%] w-48 h-12 border-2 border-primary/40 bg-primary/5 rounded-lg backdrop-blur-[2px] cursor-pointer pointer-events-auto hover:bg-primary/10 transition-colors" title="View Annotation"></div>
<div className="absolute top-[42%] left-[15%] w-64 h-24 border-2 border-secondary/40 bg-secondary/5 rounded-lg backdrop-blur-[2px] cursor-pointer pointer-events-auto hover:bg-secondary/10 transition-colors" title="View Annotation"></div>
<div className="absolute top-[75%] left-[25%] w-56 h-10 border-2 border-primary/40 bg-primary/5 rounded-lg backdrop-blur-[2px] cursor-pointer pointer-events-auto hover:bg-primary/10 transition-colors" title="View Annotation"></div>
</div>
{/* PDF Placeholder */}
<div className="bg-surface-container-low rounded-2xl overflow-hidden shadow-2xl border border-outline-variant/5 min-h-[1000px] flex justify-center p-12">
<div className="w-full max-w-3xl bg-white shadow-inner p-16 min-h-[900px] text-slate-800 font-serif relative">
{/* Faux Content for Resume */}
<div className="text-center mb-10">
<h3 className="text-3xl font-bold uppercase tracking-widest mb-2">Alex Rivera</h3>
<p className="text-sm">San Francisco, CA • alex.rivera@example.com • +1 (555) 000-0000</p>
</div>
<div className="mb-8">
<h4 className="border-b border-slate-300 font-bold uppercase mb-4 text-sm tracking-wider">Experience</h4>
<div className="mb-6">
<div className="flex justify-between font-bold">
<span>Senior Software Engineer • TechFlow Inc.</span>
<span>2021 — Present</span>
</div>
<ul className="list-disc ml-5 mt-2 text-sm leading-relaxed space-y-1">
<li>Architected and deployed high-scale microservices architecture serving 2M+ users.</li>
<li>Optimized database queries reducing latency by 45% using Redis caching.</li>
<li>Led a team of 6 developers following Agile methodologies.</li>
</ul>
</div>
<div className="mb-6">
<div className="flex justify-between font-bold">
<span>Full Stack Developer • Innovate Solutions</span>
<span>2018 — 2021</span>
</div>
<ul className="list-disc ml-5 mt-2 text-sm leading-relaxed space-y-1">
<li>Developed responsive web applications using React and Node.js.</li>
<li>Implemented CI/CD pipelines increasing deployment frequency by 200%.</li>
</ul>
</div>
</div>
<div className="mb-8">
<h4 className="border-b border-slate-300 font-bold uppercase mb-4 text-sm tracking-wider">Education</h4>
<div className="flex justify-between font-bold">
<span>B.S. Computer Science • Stanford University</span>
<span>2014 — 2018</span>
</div>
</div>
<div className="absolute top-0 right-0 p-8 opacity-5 select-none pointer-events-none text-8xl font-black rotate-12">
                                DRAFT
                            </div>
</div>
</div>
</div>
</div>
{/* Feedback Sidebar */}
<div className="col-span-12 xl:col-span-4 flex flex-col gap-6 sticky top-24">
<div className="flex items-center justify-between mb-2">
<h3 className="text-lg font-headline font-bold text-on-surface">Feedback Threads</h3>
<span className="bg-secondary-container text-on-secondary-container text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">3 Active</span>
</div>
{/* Feedback Cards (Asymmetric/High-End) */}
<div className="space-y-6">
{/* Feedback Card 1 */}
<div className="glass-panel p-6 rounded-2xl border-l-4 border-primary transition-all hover:translate-x-1 duration-300 shadow-xl">
<div className="flex items-center gap-3 mb-4">
<img className="w-10 h-10 rounded-full object-cover" data-alt="profile photo of a female technology executive with confident expression, warm lighting, architectural background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBaHNs0VrtToiDtgIgC1FgiMV-DxJLAO2_4DGk5MONq0GGYlH71B_qYbVUc_yw0LUr9S_7ttV66PxE1TCgwIqHnLiCjMlH18sNpbOtqxwonogHkA7u-zVU9ANNiOzya385tdhkEcqv4r_JvXZnUE099pqkvol1kXQWRA69PtNb3JBSS1CFhWbfvILJdqpogM5sniJNpBloPRu5PM5Ge7G0318--G2WDZEkkJ-l5UPFC_4ve6KyAbtkkebWqG6FgeKnctL9LmqSBvll9" />
<div>
<div className="text-sm font-bold text-on-surface">Sarah J. <span className="text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded ml-2">MENTOR</span></div>
<div className="text-[10px] text-on-surface-variant">Engineering Lead @ Google</div>
</div>
</div>
<p className="text-sm leading-relaxed text-on-surface-variant italic mb-4">"Your summary of TechFlow experience is strong, but let's quantify the business impact more. Did that 45% latency reduction improve conversion?"</p>
<div className="flex items-center justify-between">
<button className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
<span className="material-symbols-outlined text-sm">reply</span> Reply
                            </button>
<span className="text-[10px] text-outline">15m ago</span>
</div>
</div>
{/* Feedback Card 2 */}
<div className="glass-panel p-6 rounded-2xl border-l-4 border-secondary transition-all hover:translate-x-1 duration-300 shadow-xl">
<div className="flex items-center gap-3 mb-4">
<img className="w-10 h-10 rounded-full object-cover" data-alt="headshot of a mature professional male with glasses, soft natural lighting, creative studio background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCXwTPtK3nwDWrlkA-n74xM7_iCvZHEZgAx0rb6Ces7G1_xN3iq0CuzedBUrBOFuEijP_jAcqM24HgaUPKwYT24x7ZBrnQKbpO-y6gPYIDvJ2nbKJ_otS8lbax9PIUi4Whqx9X2buUi7fzyjAZtKtIBbOASrpRPC0NfmTv8lEmqZ0MQPgejVUQh5myA61vIHuAYCFKztAEnYzQPcvDRGeAmgL-40AVEVsceyyOrKZihsgdpriucS3BZhhyiKjt-JQWAdFO4Tscisf5O" />
<div>
<div className="text-sm font-bold text-on-surface">Marcus Thorne</div>
<div className="text-[10px] text-on-surface-variant">Senior Recruiter</div>
</div>
</div>
<p className="text-sm leading-relaxed text-on-surface-variant mb-4">"The layout is a bit dense here. Consider increasing the line-height for the bullet points to improve scannability for ATS systems."</p>
<div className="flex items-center justify-between">
<button className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
<span className="material-symbols-outlined text-sm">reply</span> Reply
                            </button>
<span className="text-[10px] text-outline">1h ago</span>
</div>
</div>
{/* Feedback Card 3 */}
<div className="bg-surface-container-high/40 p-6 rounded-2xl border-l-4 border-outline transition-all hover:translate-x-1 duration-300">
<div className="flex items-center gap-3 mb-4">
<div className="w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center text-on-tertiary-container font-bold">AI</div>
<div>
<div className="text-sm font-bold text-on-surface">Nexus Assistant</div>
<div className="text-[10px] text-on-surface-variant">AI Analysis</div>
</div>
</div>
<p className="text-sm leading-relaxed text-on-surface-variant mb-4">"Keyword 'Distributed Systems' is missing from your Innovate Solutions description. Adding it might improve your match for the roles you're browsing."</p>
<div className="flex gap-2">
<button className="text-[10px] font-bold bg-primary/20 text-primary px-3 py-1 rounded-full">Apply Auto-Fix</button>
<button className="text-[10px] font-bold text-on-surface-variant px-3 py-1 rounded-full border border-outline-variant/30">Dismiss</button>
</div>
</div>
</div>
{/* Add Comment Input */}
<div className="mt-4 p-4 rounded-2xl bg-surface-container-low border border-outline-variant/10 focus-within:border-primary/50 transition-all">
<textarea className="w-full bg-transparent border-none outline-none text-sm text-on-surface placeholder:text-outline resize-none h-24" placeholder="Ask a question about a specific section..."></textarea>
<div className="flex justify-between items-center mt-2">
<div className="flex gap-2">
<button className="p-2 text-outline hover:text-primary transition-colors"><span className="material-symbols-outlined text-lg">attach_file</span></button>
<button className="p-2 text-outline hover:text-primary transition-colors"><span className="material-symbols-outlined text-lg">alternate_email</span></button>
</div>
<button className="bg-primary text-on-primary px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider active:scale-95 transition-transform">Post Question</button>
</div>
</div>
</div>
</section>
{/* Footer (Authority: JSON) */}


{/* Contextual FAB (Restricted Use) */}
<button className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-primary to-primary-container rounded-full shadow-[0_10px_30px_rgba(144,147,255,0.4)] flex items-center justify-center text-on-primary hover:scale-110 active:scale-95 transition-all z-50">
<span className="material-symbols-outlined text-3xl">add_comment</span>
</button>
        </React.Fragment>
    );
};

export default ResumeReview;
