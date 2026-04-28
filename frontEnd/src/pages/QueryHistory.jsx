import React from 'react';
import { Link } from 'react-router-dom';

const QueryHistory = () => {
    return (
        <React.Fragment>
            {/* TopNavBar */}

<div className="flex min-h-screen">
{/* SideNavBar */}

{/* Main Content */}

<div className="max-w-6xl mx-auto">
{/* Header & Stats Bento */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
<div className="lg:col-span-2">
<h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 headline text-on-surface">My Asked Queries</h1>
<p className="text-on-surface-variant text-lg max-w-2xl">Review your historical knowledge requests and track the progress of ongoing mentorship discussions.</p>
</div>
<div className="flex items-end justify-end gap-3">
<button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-surface-container-high text-on-surface font-semibold hover:bg-surface-bright transition-all active:scale-95">
<span className="material-symbols-outlined text-sm">filter_list</span>
                            Filter
                        </button>
<button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary-container font-bold shadow-[0px_0px_15px_rgba(144,147,255,0.3)] hover:scale-105 transition-all active:scale-95">
<span className="material-symbols-outlined">add</span>
                            Ask Query
                        </button>
</div>
</div>
{/* Filters Section */}
<div className="flex flex-wrap gap-3 mb-8">
<button className="px-6 py-2 rounded-full bg-primary text-on-primary font-semibold text-sm">All Queries</button>
<button className="px-6 py-2 rounded-full bg-secondary-container text-secondary font-medium text-sm hover:bg-surface-bright transition-colors">Answered</button>
<button className="px-6 py-2 rounded-full bg-surface-container-high text-on-surface-variant font-medium text-sm hover:bg-surface-bright transition-colors">Pending</button>
<button className="px-6 py-2 rounded-full bg-surface-container-high text-on-surface-variant font-medium text-sm hover:bg-surface-bright transition-colors">Closed</button>
</div>
{/* Queries Table/List */}
<div className="surface-container-low rounded-3xl overflow-hidden shadow-2xl">
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface-container-highest/50">
<th className="px-8 py-5 text-sm font-bold text-primary-fixed-dim uppercase tracking-widest">Query Title</th>
<th className="px-8 py-5 text-sm font-bold text-primary-fixed-dim uppercase tracking-widest">Date</th>
<th className="px-8 py-5 text-sm font-bold text-primary-fixed-dim uppercase tracking-widest">Status</th>
<th className="px-8 py-5 text-sm font-bold text-primary-fixed-dim uppercase tracking-widest">Mentor Assigned</th>
<th className="px-8 py-5"></th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant/10">
{/* Query Row 1 */}
<tr className="group hover:bg-surface-container-high/40 transition-all cursor-pointer">
<td className="px-8 py-6">
<div className="flex flex-col">
<span className="text-on-surface font-semibold text-base mb-1">Optimizing GraphQL queries for low-latency React apps</span>
<span className="text-on-surface-variant text-xs flex items-center gap-2">
<span className="material-symbols-outlined text-[10px]" >sell</span>
                                                Web Development
                                            </span>
</div>
</td>
<td className="px-8 py-6">
<span className="text-on-surface-variant text-sm font-medium">Oct 24, 2023</span>
</td>
<td className="px-8 py-6">
<div className="inline-flex items-center px-3 py-1 rounded-full bg-tertiary-container/20 text-tertiary-fixed font-semibold text-xs border border-tertiary/20">
<span className="w-1.5 h-1.5 rounded-full bg-tertiary mr-2"></span>
                                            Answered
                                        </div>
</td>
<td className="px-8 py-6">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-full overflow-hidden border border-primary/20">
<img alt="Mentor" data-alt="Headshot of a senior software engineer with glasses, looking friendly, soft blue studio background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBlPAFm-SkfcqAQ2ZBRGNumXrt4lw5ol-qq9d6gszhy43NxISuQ2iFCTIhFYu_U0ylE7UNT21vi9Mx3uUCmruI3Iyn2rNhlQ4mI7UEvwK2atNM__6v3QXRlsElv48u7nnn-w3KcqCjWL-AdNi3vd6XRJ5-cq80-nlxlMECvwOeWaSSi2GDUsGp1rianfTxk0qXHWvIeGVOj1Gmk84kHIFQHJZ4WllLeQcjeIHq3fcLihlnaFsvGWEJJccA6qSpm8XdPfQuevXdODRaN" />
</div>
<span className="text-on-surface text-sm font-medium">Alex Rivers</span>
</div>
</td>
<td className="px-8 py-6 text-right">
<button className="p-2 text-outline hover:text-primary transition-colors">
<span className="material-symbols-outlined">chevron_right</span>
</button>
</td>
</tr>
{/* Query Row 2 */}
<tr className="group hover:bg-surface-container-high/40 transition-all cursor-pointer">
<td className="px-8 py-6">
<div className="flex flex-col">
<span className="text-on-surface font-semibold text-base mb-1">Transitioning from Junior to Mid-level Designer</span>
<span className="text-on-surface-variant text-xs flex items-center gap-2">
<span className="material-symbols-outlined text-[10px]" >sell</span>
                                                Career Growth
                                            </span>
</div>
</td>
<td className="px-8 py-6">
<span className="text-on-surface-variant text-sm font-medium">Nov 02, 2023</span>
</td>
<td className="px-8 py-6">
<div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary-fixed-dim font-semibold text-xs border border-primary/20">
<span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse mr-2"></span>
                                            Pending
                                        </div>
</td>
<td className="px-8 py-6">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant/20 bg-surface-container">
<img alt="Mentor" data-alt="Portrait of a female product designer, modern creative office background, cinematic lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCATEvTI2iWMsEYgZZMCFcO4Om_WG_Dd204bexq4Rnk6Xlsq-3rFuTU4YKOwSy9ZYpkwVKYz3og4SaI50b_nJH_HxOHmpfHfG__emOqCmfM8h_R4zEJv97BPaYqEgo54VrXMl9Vtm4rt8Tc5_vOP3DPXITxBZ72O5A4DsJPdTEqisJmHC9T6BFZS5y3Slw-8d2UVAjiuMk1IdaiU2AzJ9mI4zKmOz19NhLYxM8cRvWVpA-lKqPEtbkG_wuwfvxHrAx6Vq-K76_RHPgq" />
</div>
<span className="text-on-surface text-sm font-medium">Sarah Chen</span>
</div>
</td>
<td className="px-8 py-6 text-right">
<button className="p-2 text-outline hover:text-primary transition-colors">
<span className="material-symbols-outlined">chevron_right</span>
</button>
</td>
</tr>
{/* Query Row 3 */}
<tr className="group hover:bg-surface-container-high/40 transition-all cursor-pointer">
<td className="px-8 py-6">
<div className="flex flex-col">
<span className="text-on-surface font-semibold text-base mb-1">Effective prompt engineering for LLM fine-tuning</span>
<span className="text-on-surface-variant text-xs flex items-center gap-2">
<span className="material-symbols-outlined text-[10px]" >sell</span>
                                                Artificial Intelligence
                                            </span>
</div>
</td>
<td className="px-8 py-6">
<span className="text-on-surface-variant text-sm font-medium">Oct 15, 2023</span>
</td>
<td className="px-8 py-6">
<div className="inline-flex items-center px-3 py-1 rounded-full bg-outline-variant/20 text-on-surface-variant font-semibold text-xs border border-outline-variant/10">
<span className="w-1.5 h-1.5 rounded-full bg-outline-variant mr-2"></span>
                                            Closed
                                        </div>
</td>
<td className="px-8 py-6">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-full overflow-hidden border border-primary/20">
<img alt="Mentor" data-alt="Portrait of an AI research scientist, tech laboratory background, neon accents" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9kfyFoyNY4MqPZ_jMWCJz-gCmxm7z2-uHTuBHefHIHn1rIi40qc9Wo8N1pnXYQwEIDyNv139iNhRDLfjJ5IYicwPXgSblZ0xUozC0MDdwlz9qPz_lS8J2qdixOa_1565rL4UpphDpO3KBvYGLZwK5FHkyCrkrDt5qs9ZtXBxTNiMsNutoU4-lL_d0TNTt0uIj56HsKqBsuJfsZMSwJTNf7VP_8FYCq6KUChKoozwoUVXmFFOcQBCtFz4i75lGUFyTk02JI7NMSq_L" />
</div>
<span className="text-on-surface text-sm font-medium">Dr. Aris Thorne</span>
</div>
</td>
<td className="px-8 py-6 text-right">
<button className="p-2 text-outline hover:text-primary transition-colors">
<span className="material-symbols-outlined">chevron_right</span>
</button>
</td>
</tr>
{/* Query Row 4 */}
<tr className="group hover:bg-surface-container-high/40 transition-all cursor-pointer">
<td className="px-8 py-6">
<div className="flex flex-col">
<span className="text-on-surface font-semibold text-base mb-1">Building a personal brand as a solo founder</span>
<span className="text-on-surface-variant text-xs flex items-center gap-2">
<span className="material-symbols-outlined text-[10px]" >sell</span>
                                                Entrepreneurship
                                            </span>
</div>
</td>
<td className="px-8 py-6">
<span className="text-on-surface-variant text-sm font-medium">Oct 10, 2023</span>
</td>
<td className="px-8 py-6">
<div className="inline-flex items-center px-3 py-1 rounded-full bg-tertiary-container/20 text-tertiary-fixed font-semibold text-xs border border-tertiary/20">
<span className="w-1.5 h-1.5 rounded-full bg-tertiary mr-2"></span>
                                            Answered
                                        </div>
</td>
<td className="px-8 py-6">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-full overflow-hidden border border-primary/20">
<img alt="Mentor" data-alt="Entrepreneur sitting in a high-rise office at night, cityscape blurred in background, warm interior lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5bq2YrCwo1qoBOqrvg-AW3Zgk_aW3AkDkSeLNEmIfdHL0zsvKnWBY9gqa7L-SGbsTX9E1oZ5olq4oO0mKf31Fzk1cR-aMYLZ7TJRckINwD7Uquu7_sAhKWmblY4NQcphmH7w4kND9_Myk5a9jP8Qg3eFoipPJX8Xxskmdw6VSXjp8WEEUuhmfWv-XHqv1HmokqcyGLIZNxBxAohuHtParwDyrKqDb0OpFRER2LbCFXpsaVnAEzCTZrq-dOYc0vSJ1Esj7560fR84V" />
</div>
<span className="text-on-surface text-sm font-medium">Marcus Vane</span>
</div>
</td>
<td className="px-8 py-6 text-right">
<button className="p-2 text-outline hover:text-primary transition-colors">
<span className="material-symbols-outlined">chevron_right</span>
</button>
</td>
</tr>
</tbody>
</table>
</div>
{/* Pagination-like footer */}
<div className="px-8 py-6 flex items-center justify-between bg-surface-container-high/20 border-t border-outline-variant/10">
<span className="text-on-surface-variant text-sm">Showing <span className="text-on-surface font-semibold">4</span> of <span className="text-on-surface font-semibold">24</span> queries</span>
<div className="flex gap-2">
<button className="p-2 rounded-lg bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors disabled:opacity-50" disabled="">
<span className="material-symbols-outlined">chevron_left</span>
</button>
<button className="p-2 rounded-lg bg-surface-container-high text-on-surface hover:text-primary hover:bg-surface-bright transition-colors">
<span className="material-symbols-outlined">chevron_right</span>
</button>
</div>
</div>
</div>
{/* Featured Connection Glass Card */}
<div className="mt-16 relative overflow-hidden rounded-[2.5rem] p-1 glass-panel border border-outline-variant/20 shadow-2xl">
<div className="absolute -right-24 -top-24 w-96 h-96 bg-primary/20 blur-[100px] rounded-full"></div>
<div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
<div className="max-w-xl">
<h3 className="text-2xl md:text-3xl font-bold mb-4 headline">Level Up Your Journey</h3>
<p className="text-on-surface-variant leading-relaxed mb-8">Your query history shows a strong interest in AI and Full-stack development. We've identified 3 top-tier mentors who can help you bridge the gap to senior roles.</p>
<div className="flex flex-wrap gap-4">
<div className="flex -space-x-3">
<div className="w-12 h-12 rounded-full border-4 border-surface overflow-hidden">
<img alt="Mentor" data-alt="Close up portrait of a tech lead, confident expression, soft natural window light" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZyWiR9ITawVj8mGWVoFhdO3vyOmJtB2TOzb7gJyiwWjTpWvsVgL7GcXLQt_NPcgIPqwP5WWmKR4drECWdRIKHjIewOkEFvR1cCSLaCVQLslKsoigBGmMR3s4wjY30o_lBFuS-ruZLc-TU5Mid004hEd4yxd0ikO5cw4Vci3t-PWsFVUb1QfxXpbfWxUABi8_SKKgMCwmGJLTvvNWy7AiDIBPzOLVGjViMC2m0eDa7PZjDlCCapskmETzljmdHVLQzpia9K8Kycq2u" />
</div>
<div className="w-12 h-12 rounded-full border-4 border-surface overflow-hidden">
<img alt="Mentor" data-alt="Portrait of a female CTO, professional attire, modern architectural background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0EpXcye8Xv_27DG2oRsx9LrDVUy-if0y3I9qPl0lku8gLVeH5mOpo21ennEtktc4Hwy2aJ13aiTqQZFqThqxS_ljO5pLZGPTVe06eMc-htcAA2vofL-IGRwXvL0OSfE69e5_bH5dXrdbfpkmaZZNWUtx9WJMvuKvPRBQZO5y4ISpP-VHJxHiseYbQjQ0bhE-KVkWJSCvYvmGVHn1YB14f9nJEqIBD_D_ZhIKUg6Lyl-B80ijsWhiVnadBmJNR2IGJk__zbHZYkOef" />
</div>
<div className="w-12 h-12 rounded-full border-4 border-surface overflow-hidden">
<img alt="Mentor" data-alt="Creative director headshot, colorful but sophisticated studio lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3qg3tjCzOeUq3d3_8_TAm2ey5kRd_6jQJVs8BMaPr9Qcg7ncTry3JW9UYr-K2V8DfVeP9ro5Jan1RqFO4yRZFTDCZTwuEquhkGGSt6vGw95MBFHjNNZsSq7QtsoaAQVEIzkfNOqWXwv3NEmFwj8bu8rZg6-uX0AqQ9KPlLT6KfipiSqIhzDy-DZeVGkXAqQCznU13-VkyWj7AytT8fMr7PgNewJIRuewtPtM3s_eeH4x7tbDpQYEWoW2OAv9t_ehitxh-rTcNo5aP" />
</div>
</div>
<button className="px-8 py-3 rounded-xl bg-white/5 text-on-surface font-bold border border-white/10 hover:bg-white/10 transition-all active:scale-95">
                                    View Recommended
                                </button>
</div>
</div>
<div className="w-full md:w-auto flex flex-col gap-4">
<div className="bg-surface-container-high/80 p-6 rounded-2xl border border-outline-variant/10 shadow-lg">
<div className="flex justify-between items-start mb-4">
<span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-wider">Expertise Match</span>
<span className="text-primary text-xs font-bold">98% Match</span>
</div>
<div className="flex items-center gap-4">
<div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary">
<img alt="Top Mentor" data-alt="Professional profile photo of a research scientist in deep thought, atmospheric lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5UB61Ezna3_k8RZOcAlp03e2rM90_YygCHH6DQXXmMlQYdhvfNA-3dT6auPKunDl96WNRXHT15cDK0Dk456UI8QSMTHtVrP9I_vgn7nNFgKuNwxJxqBiOot6aqqoAMvszU-HjeLJcLxuB-7IGCmFeQOGoWYAHoKYT5qiBhximgF9cfRQTin7Sx-FwxysLLgpcefmoynSTSU8mic7uMvHIEvThFekRydJa6ob9gmouUgZPacFkn8TJ3fqdcd4HqxOiCsFL9kC5FWFU" />
</div>
<div>
<p className="text-on-surface font-bold">Elena Solokov</p>
<p className="text-on-surface-variant text-xs">AI Lead @ NeuralSystems</p>
</div>
</div>
</div>
</div>
</div>
</div>
</div>

</div>
        </React.Fragment>
    );
};

export default QueryHistory;
