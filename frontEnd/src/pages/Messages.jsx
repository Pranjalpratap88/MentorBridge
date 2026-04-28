import React from 'react';
import { Link } from 'react-router-dom';

const Messages = () => {
    return (
        <React.Fragment>
            {/* Top Navigation Anchor */}


{/* Conversation Sidebar */}

{/* Main Chat Area */}
<section className="flex-1 flex flex-col bg-background relative overflow-hidden">
{/* Background Accent Glow */}
<div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
{/* Chat Header */}
<header className="p-6 flex justify-between items-center bg-surface/80 backdrop-blur-md z-10">
<div className="flex items-center gap-4">
<div className="relative">
<img alt="Active Chat Avatar" className="w-10 h-10 rounded-full" data-alt="Close-up profile photo of Sarah Drasner, professional software mentor" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZPyiDjn0ePpfMoN95Df1IVNAAB3YURMLnLBjZprkfAao_a9jbyXG6zVZ8L3z_wNzeeZAD5t5fGZYLMRj5cKRTelupeii-HFwMq800ThCy84tmkmDWGF3PXLRkAc0L58R5E9WSHoA6z-k3Ra_CP-LCnOEMpATC6UqustaMChFyl9YrXHX9GayosvIDf8kH9oRoM76r-HqRZw5aCk5XhzcINxSPVJCM4OOBWhhsYh0UcN_PvxJ4OxJZO56tYy0sEJlh5XwgY0m83JOh" />
<span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-tertiary border-2 border-background rounded-full"></span>
</div>
<div>
<h2 className="font-headline font-bold text-on-surface">Sarah Drasner</h2>
<span className="text-xs text-tertiary flex items-center gap-1">
<span className="w-1.5 h-1.5 bg-tertiary rounded-full animate-pulse"></span>
                            Online Now
                        </span>
</div>
</div>
<div className="flex items-center gap-2">
<button className="material-symbols-outlined text-on-surface-variant hover:text-primary hover:bg-surface-container-high p-2 rounded-xl transition-all">videocam</button>
<button className="material-symbols-outlined text-on-surface-variant hover:text-primary hover:bg-surface-container-high p-2 rounded-xl transition-all">call</button>
<div className="w-[1px] h-6 bg-outline-variant/30 mx-2"></div>
<button className="material-symbols-outlined text-on-surface-variant hover:text-primary hover:bg-surface-container-high p-2 rounded-xl transition-all">info</button>
</div>
</header>
{/* Chat Messages Content */}
<div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar z-10">
<div className="flex justify-center">
<span className="bg-surface-container-high px-4 py-1 rounded-full text-[10px] uppercase tracking-widest text-outline font-bold">Tuesday, October 25</span>
</div>
{/* Received Message */}
<div className="flex items-start gap-4 max-w-2xl">
<img alt="Sarah" className="w-8 h-8 rounded-full mt-1" data-alt="Profile of Sarah Drasner" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0bajRV4GdXpb535OZfWCMqTRD6hegCn0mmzYce5E_oBYAGg4Wp87CisTVXGm0TOAuPyV3Q5avARes9PO_W6PC32hnemknAjX_uCAFdc2mvvD0cGzBZULLtKkeb4kMQpjluXMrzvuhH_IJh3JftEKKlPfDkdCQ4YwiseVp6rgngY8hfnES3qKSHWt1ScAhUAi63umQldOIvn5tbfespc4WPdik8OZtSpXGxoy92BCNmqx1Pjg1u3ddcK4UA2ptKWT3FD2FtIBRdf-0" />
<div className="space-y-2">
<div className="glass-panel p-4 rounded-2xl rounded-tl-none border border-outline-variant/10 shadow-sm">
<p className="text-on-surface leading-relaxed">Hey there! I finally had a chance to go through your portfolio and the recent system architecture you drafted. The level of detail in the Nexus Bridge module is impressive.</p>
</div>
<span className="text-[10px] text-outline ml-1 uppercase">12:40 PM</span>
</div>
</div>
{/* Sent Message */}
<div className="flex flex-row-reverse items-start gap-4 max-w-2xl ml-auto">
<div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-[10px] font-bold text-on-primary-container mt-1">ME</div>
<div className="space-y-2 text-right">
<div className="bg-gradient-to-br from-primary to-primary-dim p-4 rounded-2xl rounded-tr-none shadow-[0_10px_30px_rgba(144,147,255,0.2)]">
<p className="text-on-primary text-sm font-medium leading-relaxed">That means a lot coming from you, Sarah! I was worried the data flow was getting a bit cluttered. Did the secondary caching layer make sense?</p>
</div>
<span className="text-[10px] text-outline mr-1 uppercase">12:42 PM</span>
</div>
</div>
{/* Received Message with Link/Attachment */}
<div className="flex items-start gap-4 max-w-2xl">
<img alt="Sarah" className="w-8 h-8 rounded-full mt-1" data-alt="Profile of Sarah Drasner" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqC5gyBGftkBuNPTOSJPutBq3VoQUbQtdgM09knRH-eNn6WgjN-NYKTylx5q25jIZVbq8gkE51J-mj1oTswPvoIexCJY8YhPpF6OVOl8xDFC3tPt69bgL3OYhq7SJiTyUbtN4Sergjt4QRyN3b9OOVp8Vyc9HUnxEi-WO-mjLFxsZdvLopK3Ww_RMkA84TvoWV8gKl8WrHyK4coJXAcNY-WEEmjErUqcyPeE5Ibb9TRp3hQ2XKKs0OS2svslDakT8BG4Q7lHxeTMQo" />
<div className="space-y-2">
<div className="glass-panel p-4 rounded-2xl rounded-tl-none border border-outline-variant/10">
<p className="text-on-surface leading-relaxed">The resume looks great! Let's sync on the caching strategy tomorrow. I've attached a quick resource on Distributed Caching patterns that might refine your approach.</p>
<div className="mt-4 p-3 bg-surface-container-high rounded-xl flex items-center gap-3 border border-outline-variant/20 hover:bg-surface-bright transition-all cursor-pointer">
<span className="material-symbols-outlined text-tertiary-dim">description</span>
<div className="flex-1 overflow-hidden">
<p className="text-xs font-semibold text-on-surface truncate">Distributed_Systems_Refined.pdf</p>
<p className="text-[10px] text-outline uppercase">2.4 MB • PDF Document</p>
</div>
<span className="material-symbols-outlined text-outline text-sm">download</span>
</div>
</div>
<span className="text-[10px] text-outline ml-1 uppercase">12:45 PM</span>
</div>
</div>
</div>
{/* Message Input Area */}

</section>
        </React.Fragment>
    );
};

export default Messages;
