"use client";
import React from "react";

export default function HeroDesktop({ timeLeft, isEventStarted }: { timeLeft: any, isEventStarted: boolean }) {
    const announcementText = "REGISTRATION FOR GROUP SONG (INDIAN), GROUP SONG (WESTERN), CLASSICAL DANCE, FOLK DANCE, WESTERN DANCE WILL BE OPENED TODAY 04-12-25 10:00 AM. REGISTER YOUR TEAM VIA YOUR TEAM PORTAL. 📢";

    // Create a content block component to reuse
    const MarqueeContent = () => (
        <div className="flex items-center gap-8 px-4">
            {[...Array(2)].map((_, i) => (
                <span key={i} className="text-yellow-300 font-mono text-sm tracking-widest font-semibold flex items-center whitespace-nowrap">
                    <span className="mr-4 text-white">★</span>
                    {announcementText}
                </span>
            ))}
        </div>
    );

    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center text-white bg-gray-900 overflow-hidden px-4">
            {/* --- Background Elements --- */}
            {/* --- VIDEO BACKGROUND --- */}
            <div className="absolute inset-0 z-0 overflow-hidden blur-xs">
                {/* Desktop Video */}
                <video
                    className="hidden md:block absolute inset-0 w-full h-[115%] object-cover opacity-70"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    poster="/background.jpg"
                >
                    <source src="/hero-video.mp4" type="video/mp4" />
                </video>

                {/* Mobile fallback image */}
                <div
                    className="block md:hidden absolute inset-0 bg-cover bg-center opacity-70"
                    style={{ backgroundImage: "url(/background.jpg)" }}
                />
            </div>

            {/* Dark overlay to improve text visibility */}
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/90 via-black/50 to-black/80"></div>

            {/* Ambient Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]"></div>

            {/* --- Main Content --- */}
            <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center text-center mt-20">

                {/* Date Badge */}
                <div className="mb-8 animate-fade-in-down">
                    <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-sm font-medium tracking-wide text-gray-200 shadow-lg hover:bg-white/10 transition-colors">
                        <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
                        12–13 December 2025
                    </span>
                </div>

                {/* MERGED GIANT TITLE */}
                <h1
                    className="text-9xl lg:text-[10rem] font-black tracking-wide mb-12 leading-none drop-shadow-2xl"
                    style={{ fontFamily: "'Anton', sans-serif" }}
                >
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600">
                        INDEP
                    </span>
                    <span className="ml-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 font-serif italic pr-2">
                        &apos;25
                    </span>
                </h1>

                {/* --- The Countdown Dashboard --- */}
                {/* <div className="w-full max-w-4xl mx-auto mb-16">
                    {isEventStarted ? (
                        <div className="p-8 bg-green-500/20 backdrop-blur-lg border border-green-500/50 rounded-2xl animate-bounce">
                            <p className="text-3xl font-bold text-green-300">
                                🚀 The Event Has Started!
                            </p>
                            <p className="text-white/80 mt-2">Head to the main stage.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-4 gap-8">
                            {[
                                { value: timeLeft.days, label: "DAYS" },
                                { value: timeLeft.hours, label: "HOURS" },
                                { value: timeLeft.minutes, label: "MINUTES" },
                                { value: timeLeft.seconds, label: "SECONDS" },
                            ].map((item, idx) => (
                                <div
                                    key={idx}
                                    className="group relative flex flex-col items-center justify-center p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl hover:border-white/30 hover:bg-white/5 transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className="text-6xl font-mono font-bold text-white tracking-tighter tabular-nums drop-shadow-lg group-hover:text-yellow-300 transition-colors">
                                        {item.value.toString().padStart(2, "0")}
                                    </div>
                                    <div className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mt-2 group-hover:text-white transition-colors">
                                        {item.label}
                                    </div>
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-50"></div>
                                </div>
                            ))}
                        </div>
                    )}
                </div> */}

                {/* --- Action Buttons --- */}
                <div className="flex gap-5 items-center w-full justify-center mb-12">
                    <a
                        href="/Elocution_tamil.pdf"
                        className="group relative px-8 py-4 bg-white text-black rounded-xl font-bold text-lg overflow-hidden shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            Elocution Tamil
                            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        </span>
                        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/80 to-transparent z-0 opacity-50"></div>
                    </a>

                 {*   <a
                        href="/Elocution_english.pdf"
                        className="px-8 py-4 bg-white/5 border border-white/20 text-white rounded-xl font-semibold text-lg backdrop-blur-sm hover:bg-white/10 hover:border-white/40 transition-all"
                    >
                        Elocution English
                    </a> *}
                </div>

                {/* --- INFINITE SCROLLING ANNOUNCEMENT TICKER --- */}
                <div className="w-full max-w-5xl mx-auto overflow-hidden bg-black/40 border-y border-yellow-500/30 backdrop-blur-md relative">
                    <div className="flex w-max animate-marquee">
                        {/* We render the content twice. 
                           The animation moves left by 50% (the width of one set).
                           When it reaches -50%, it snaps back to 0%, creating an infinite loop.
                        */}
                        <MarqueeContent />
                        <MarqueeContent />
                    </div>
                </div>

            </div>

            <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&display=swap');
        
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }

        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); } 
        }

        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        
        /* Optional: Pause on hover for readability */
        .animate-marquee:hover {
            animation-play-state: paused;
        }
      `}</style>
        </section>
    );
}