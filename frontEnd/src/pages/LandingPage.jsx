import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
    const { user } = useAuth();

    return (
        <React.Fragment>
            {/* Top Navigation Bar */}
<nav className="bg-[#060e20] font-manrope font-semibold tracking-tight docked full-width top-0 sticky z-50 bg-surface-container-low border-none shadow-none flex justify-between items-center w-full px-8 py-4">
<div className="flex items-center gap-12">
<Link to="/" className="text-2xl font-black text-[#dee5ff] tracking-tighter">MentorBridge</Link>
<div className="hidden md:flex gap-8 items-center">
<Link className="text-[#dee5ff]/70 hover:text-[#9093ff] transition-all duration-300" to={user ? "/queries" : "/login"}>Browse</Link>
<Link className="text-[#dee5ff]/70 hover:text-[#9093ff] transition-all duration-300" to={user ? "/explore" : "/login"}>Mentors</Link>
<Link className="text-[#dee5ff]/70 hover:text-[#9093ff] transition-all duration-300" to={user ? "/leaderboard" : "/login"}>Leaderboard</Link>
</div>
</div>
<div className="flex items-center gap-6">
{user ? (
    <div className="flex items-center gap-4">
        <Link to="/dashboard" className="px-6 py-2 rounded-lg bg-primary/20 text-primary border border-primary/20 hover:bg-primary/30 transition-all font-bold text-sm">Dashboard</Link>
        <Link to="/profile" className="h-10 w-10 rounded-full border-2 border-primary/30 overflow-hidden">
            <img alt="User" className="w-full h-full object-cover" src={user.avatarUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuAnfrmRpw8Ts1uerRpP1BDfhUDxRVhTRDqD-de6r1aNiifwtm6ZHx3d4RlWny5zM89KRY7hvhLV3Zcf3AHd7LgW8pTEfI5aOB1rDGeIahKqVRSYuioZl67FMQoYjdW_cT8HxyQI6SwyygV2jExfJamlhueOW3hR_E-HmWdJcS9AkQB6aq590yV123_vHNCt_j1VGs99zfQqeUoZ7cHcC0mCzWM0aw4RQ-3_Ib2V-4fHqX2VTT_GbH7OhQgkUbxJLsRcxzaZ1pzbAJ"} />
        </Link>
    </div>
) : (
    <div className="flex items-center gap-4">
        <Link className="text-[#dee5ff]/70 hover:text-primary transition-all text-sm" to="/login">Login</Link>
        <Link className="bg-primary text-on-primary px-6 py-2 rounded-lg font-bold text-sm shadow-[0_0_15px_rgba(144,147,255,0.3)]" to="/register">Join Nexus</Link>
    </div>
)}
</div>
</nav>
{/* Main Content Canvas */}
<main className="relative">
{/* Hero Section */}
<section className="relative min-h-[921px] flex flex-col items-center justify-center text-center px-4 overflow-hidden pt-20">
{/* Background Glow Decor */}
<div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full"></div>
<div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-on-secondary-fixed-variant/10 blur-[100px] rounded-full"></div>
<div className="relative z-10 max-w-5xl mx-auto">
<span className="inline-block py-1 px-4 mb-6 rounded-full bg-secondary-container text-secondary text-xs font-bold tracking-widest uppercase">The Nexus of Knowledge</span>
<h1 className="text-6xl md:text-8xl font-black tracking-tighter text-[#dee5ff] mb-8 leading-[0.9]">
                    Connect. Learn.<br /><span className="bg-gradient-to-r from-primary to-primary-container bg-clip-text text-transparent">Grow.</span>
</h1>
<p className="text-xl md:text-2xl text-[#9baad6] font-body max-w-2xl mx-auto mb-12 font-light">
                    Ask once, learn from many. The bridge between aspiring minds and industry veterans built on editorial precision.
                </p>
<div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
{user ? (
    <Link to="/dashboard" className="bg-gradient-to-tr from-primary to-primary-container px-12 py-5 rounded-xl font-bold text-on-primary shadow-[0_0_25px_rgba(144,147,255,0.4)] hover:scale-[1.05] transition-all duration-300 active:scale-95 text-center text-lg">
        Go to Dashboard
    </Link>
) : (
    <>
        <Link to="/register" className="bg-gradient-to-tr from-primary to-primary-container px-10 py-4 rounded-xl font-bold text-on-primary shadow-[0_0_20px_rgba(144,147,255,0.3)] hover:scale-[1.02] transition-all duration-300 active:scale-95 text-center">
            Get Started
        </Link>
        <Link to="/login" className="px-10 py-4 rounded-xl font-bold bg-[#172b54] text-[#dee5ff] hover:bg-[#1e3a73] transition-all duration-300 text-center">
            Login
        </Link>
    </>
)}
</div>
</div>
{/* Hero Image / Visual Anchor */}
<div className="mt-24 w-full max-w-6xl mx-auto glass-panel p-2 rounded-[2rem] glow-subtle border border-outline-variant/10">
<img alt="Collaborative workspace" className="w-full h-auto rounded-[1.8rem] opacity-90" data-alt="Modern high-tech workspace with diverse team collaborating on digital screens, deep blue ambient lighting and cinematic composition" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2g6cyEZmIhGRpDJrgGGPlNLAgOW3YaHZmO6nqkbYWHoQhzKlR6fAILdhU72qjoHWQGUMLnJwFnBxW-717pfSF_TaONkBjk836qIG-AXyOBPlMG93XHa38ow689REnhWKzexh0ESPUcARBB7Gm9kQac4ee2QXkPwTBPwjCexIJ9xOFcXyFoYWGPT1uIBDJZ-jKf3FSBPqLVmHgqaKlvmMGuvGQFdmVDm3OZh_LUi9EcM0ZEnvuBG_yrIzPY9y5WEb_eqYVHFEStKcI" />
</div>
</section>
{/* Features Bento Grid */}
<section className="py-32 px-8 max-w-7xl mx-auto">
<div className="mb-20">
<h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Crafting the Future</h2>
<p className="text-on-surface-variant max-w-xl">Deep integration tools designed to facilitate meaningful knowledge transfer without the noise of traditional social feeds.</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-12 gap-6">
{/* Large Feature: Alumni Mentorship */}
<div className="md:col-span-8 group relative bg-surface-container-low rounded-[2rem] p-10 overflow-hidden hover:bg-surface-container-high transition-all duration-500">
<div className="relative z-10 h-full flex flex-col justify-between">
<div>
<span className="material-symbols-outlined text-primary text-4xl mb-6">school</span>
<h3 className="text-3xl font-bold mb-4">Alumni Mentorship</h3>
<p className="text-on-surface-variant max-w-md leading-relaxed">Direct access to your institution's legacy. Tap into a private network of graduates who have walked the path you're on.</p>
</div>
<div className="mt-12 flex -space-x-4">
<img alt="A1" className="w-12 h-12 rounded-full border-4 border-surface-container-low" data-alt="portrait of an experienced female tech executive in soft focus office setting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtEH0HeNUJhHagzK9dhS7XQOc_f-6Dlm0YnIEvpZPs6leTAIgCtCi5XY34WXCZnhwKgir7rxXtLbj5ARh41FgX0O5zmJEDhHO59pDf8BQSOrXlhMzKPDkNHDYPi8OuZizFSpL26WHHxNoAeRJA9sLnQ9KA8gyFnHHzZTjWTPlBubwhG-mWE2kaWUwZAauBOolFhvTE4IlMdILrgkzTiJMI_z8-LttYm87zCLt_ZXpiFzqfgQPqosgREiN1PnkvjRQz562TIExcr8Yb" />
<img alt="A2" className="w-12 h-12 rounded-full border-4 border-surface-container-low" data-alt="portrait of a young male software engineer with professional friendly expression" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcDv958t_c1vc907IsicSuQkwLOFyqtTUNCTUjbAUWT-JraGLQ8Vmp9p6MVptd-r_yXWlOXN7c-yY9IYFupvceB9evIiWd6ryO-YQb18Tx5ElqWp59jQ0Ihv-ZqPuGp9sqGObgr4RjNlmiuFVSnQbn-FiKW0-F0x6BZIGjl7e7YxNTdekub48_ylRW3an2BSJyCiexveOVihVfvwZ8goNtRGMLuDmhTifw8eJWkORi_bqm3yL1IgpXCuMYn8rEbNgsjE2kUbwpBmyt" />
<img alt="A3" className="w-12 h-12 rounded-full border-4 border-surface-container-low" data-alt="professional portrait of a middle aged business consultant in a neutral background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhKSneNFovFla2dSKsMyzl3NNB9srtEiAodsNw_lDZot3AsEaK46zGNAednNKw_b4W-FTNbeEGfctvgcxd6dbfGL2jyObUY-xavc9a-nMO7_Wb5JmSh3rmzWIN7Uwe4uKUf1Gqg1H79uZQDt3nA5EX_MVQbkY_qCAXD9HCKpVmJn6OgWofFwJnqP3AIMQOjMkjSR3NIbR2qXyhoRsfT7gr7OhNSBue9nwJtysh4W-48MQHI_rD0NU59q_wnxP0VzOEGh7NHeLTbAdd" />
<div className="w-12 h-12 rounded-full border-4 border-surface-container-low bg-primary-container flex items-center justify-center text-xs font-bold">+2k</div>
</div>
</div>
<div className="absolute right-0 bottom-0 w-1/2 h-full opacity-20 pointer-events-none">
<div className="w-full h-full bg-gradient-to-tl from-primary/30 to-transparent"></div>
</div>
</div>
{/* Small Feature: Query Feed */}
<div className="md:col-span-4 group bg-surface-container-low rounded-[2rem] p-10 hover:bg-surface-container-high transition-all duration-500 flex flex-col">
<span className="material-symbols-outlined text-tertiary text-4xl mb-6">forum</span>
<h3 className="text-2xl font-bold mb-4">Query Feed</h3>
<p className="text-on-surface-variant text-sm leading-relaxed mb-8">Real-time problem solving. Post technical challenges and receive curated architectural advice from specialists.</p>
<div className="mt-auto bg-surface-container-highest/50 rounded-xl p-4 border border-outline-variant/10">
<div className="flex items-center gap-3 mb-2">
<div className="w-2 h-2 rounded-full bg-green-400"></div>
<span className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">New Response</span>
</div>
<div className="h-2 w-3/4 bg-outline-variant/20 rounded-full mb-2"></div>
<div className="h-2 w-1/2 bg-outline-variant/20 rounded-full"></div>
</div>
</div>
{/* Small Feature: High-End Editorial Networking */}
<div className="md:col-span-4 group bg-surface-container-low rounded-[2rem] p-10 hover:bg-surface-container-high transition-all duration-500 flex flex-col">
<span className="material-symbols-outlined text-secondary text-4xl mb-6">groups</span>
<h3 className="text-2xl font-bold mb-4">Premium Networking</h3>
<p className="text-on-surface-variant text-sm leading-relaxed">Curated circles of excellence. No fluff, just high-bandwidth connections between top-tier performers.</p>
</div>
{/* Large Feature: Resume Review */}
<div className="md:col-span-8 group bg-surface-container-low rounded-[2rem] p-10 overflow-hidden hover:bg-surface-container-high transition-all duration-500 flex flex-col md:flex-row gap-10">
<div className="flex-1">
<span className="material-symbols-outlined text-primary-fixed-dim text-4xl mb-6">description</span>
<h3 className="text-3xl font-bold mb-4">Nexus Review</h3>
<p className="text-on-surface-variant leading-relaxed mb-6">Professional document auditing. Get line-by-line critiques from mentors at companies like Google, Tesla, and McKinsey.</p>
<button className="text-primary font-bold flex items-center gap-2 group-hover:translate-x-2 transition-transform duration-300">
                            Learn more <span className="material-symbols-outlined">arrow_forward</span>
</button>
</div>
<div className="flex-1 relative">
<div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent rounded-xl"></div>
<div className="bg-surface-container-highest p-6 rounded-xl border border-outline-variant/10 shadow-2xl rotate-3 translate-y-4">
<div className="space-y-3">
<div className="h-4 w-full bg-primary/20 rounded"></div>
<div className="h-4 w-5/6 bg-on-surface-variant/20 rounded"></div>
<div className="h-4 w-full bg-on-surface-variant/20 rounded"></div>
<div className="h-4 w-4/6 bg-on-surface-variant/20 rounded"></div>
</div>
</div>
</div>
</div>
</div>
</section>
{/* Modern Mentorship Component (Knowledge Pulse) */}
<section className="py-20 relative overflow-hidden">
<div className="absolute inset-0 bg-surface-container-low/50 backdrop-blur-3xl -z-10"></div>
<div className="max-w-4xl mx-auto px-8 text-center">
<h2 className="text-3xl font-bold mb-12">Expertise Fields</h2>
<div className="flex flex-wrap justify-center gap-4">
<span className="px-6 py-3 rounded-full bg-secondary-container text-secondary font-medium border border-secondary/10">Cloud Architecture</span>
<span className="px-6 py-3 rounded-full bg-surface-container-highest text-on-surface-variant font-medium">FinTech Systems</span>
<span className="px-6 py-3 rounded-full bg-secondary-container text-secondary font-medium border border-secondary/10">Product Strategy</span>
<span className="px-6 py-3 rounded-full bg-surface-container-highest text-on-surface-variant font-medium">Generative AI</span>
<span className="px-6 py-3 rounded-full bg-secondary-container text-secondary font-medium border border-secondary/10">Venture Capital</span>
<span className="px-6 py-3 rounded-full bg-surface-container-highest text-on-surface-variant font-medium">BioTech Ethics</span>
</div>
</div>
</section>
{/* CTA Final Section */}
<section className="py-32 px-8">
<div className="max-w-5xl mx-auto bg-gradient-to-br from-surface-container-high to-background rounded-[3rem] p-16 text-center border border-outline-variant/5 glow-subtle">
<h2 className="text-5xl font-black mb-8 tracking-tighter">Ready to bridge the gap?</h2>
<p className="text-xl text-on-surface-variant mb-12 max-w-xl mx-auto">Join thousands of students and mentors in the most focused professional ecosystem available today.</p>
<div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
<button className="w-full sm:w-auto bg-primary text-on-primary font-black py-5 px-12 rounded-2xl text-lg hover:brightness-110 active:scale-95 transition-all">
                        Create Your Nexus
                    </button>
<button className="w-full sm:w-auto text-primary font-bold py-5 px-12 rounded-2xl hover:bg-primary/5 transition-all">
                        View Mentor Directory
                    </button>
</div>
</div>
</section>
</main>
{/* Footer */}
<footer className="w-full py-16 px-8 mt-auto border-t border-[#38476d]/15 bg-[#060e20] font-inter text-xs tracking-wide">
<div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
<div className="flex flex-col gap-4 items-center md:items-start">
<span className="text-lg font-bold text-[#dee5ff]">MentorBridge</span>
<p className="text-[#dee5ff]/40 max-w-xs text-center md:text-left">© 2024 MentorBridge Nexus. High-end editorial mentorship for the world's most ambitious professionals.</p>
</div>
<div className="flex gap-8 flex-wrap justify-center">
<Link className="text-[#dee5ff]/40 hover:text-[#dee5ff] hover:underline transition-all" to="/">Privacy Policy</Link>
<Link className="text-[#dee5ff]/40 hover:text-[#dee5ff] hover:underline transition-all" to="/">Terms of Service</Link>
<Link className="text-[#dee5ff]/40 hover:text-[#dee5ff] hover:underline transition-all" to="/">Campus Partners</Link>
<Link className="text-[#dee5ff]/40 hover:text-[#dee5ff] hover:underline transition-all" to="/">Support</Link>
</div>
<div className="flex gap-4">
<div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
<span className="material-symbols-outlined text-sm">public</span>
</div>
<div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
<span className="material-symbols-outlined text-sm">share</span>
</div>
</div>
</div>
</footer>
        </React.Fragment>
    );
};

export default LandingPage;
