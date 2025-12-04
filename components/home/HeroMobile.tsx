"use client";
import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// Helper component for the animated number card
const AnimatedNumber = ({ value, label }: { value: number; label: string }) => {
    return (
        <div className="flex flex-col items-center mx-1.5">
            <div className="relative overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 rounded-xl w-14 h-16 sm:w-16 sm:h-20 flex items-center justify-center shadow-2xl">
                <AnimatePresence mode="popLayout">
                    <motion.span
                        key={value}
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: "0%", opacity: 1 }}
                        exit={{ y: "-100%", opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="absolute text-2xl sm:text-3xl font-mono font-bold text-white tracking-tighter"
                    >
                        {value.toString().padStart(2, "0")}
                    </motion.span>
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">
                {label}
            </span>
        </div>
    );
};

export default function HeroMobile({ timeLeft, isEventStarted }: { timeLeft: any, isEventStarted: boolean }) {

    // The announcement text
    const announcementText = "REGISTRATION FOR GROUP SONG (INDIAN), GROUP SONG (WESTERN), CLASSICAL DANCE, FOLK DANCE, WESTERN DANCE WILL BE OPENED TODAY 04-12-25 10:00 AM. REGISTER YOUR TEAM VIA YOUR TEAM PORTAL. 📢";

    // Reusable Marquee Content
    const MarqueeContent = () => (
        <div className="flex items-center gap-4 px-2">
            {[...Array(2)].map((_, i) => (
                <span key={i} className="text-yellow-300 font-mono text-xs tracking-widest font-semibold flex items-center whitespace-nowrap">
                    <span className="mr-2 text-white">★</span>
                    {announcementText}
                </span>
            ))}
        </div>
    );

    return (
        <section className="relative min-h-[100dvh] flex flex-col items-center justify-center text-white bg-gray-900 overflow-hidden pt-20 pb-20">

            {/* --- Background Elements --- */}
            <div className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-60" style={{ backgroundImage: "url(/background.jpg)" }} />
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/80 via-black/50 to-black/90"></div>

            {/* Ambient Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] bg-purple-600/30 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] bg-blue-600/20 rounded-full blur-[100px]"></div>

            {/* --- Main Content --- */}
            <div className="relative z-10 w-full flex flex-col items-center text-center justify-center flex-1 px-4">

                {/* Date Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-6"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 backdrop-blur-md text-xs font-medium tracking-wide text-gray-200 shadow-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse"></span>
                        12–13 December 2025
                    </span>
                </motion.div>

                {/* TITLE */}
                <motion.h1
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.7, type: "spring" }}
                    className="text-6xl font-black tracking-tight leading-none mb-8 drop-shadow-2xl"
                    style={{ fontFamily: "'Anton', sans-serif" }}
                >
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 block tracking-wide">
                        INDEP
                    </span>

                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 font-serif italic block mt-2">
                        &apos;25
                    </span>
                </motion.h1>

                {/* --- Countdown Timer --- */}
                <div className="w-full mb-12">
                    {isEventStarted ? (
                        <div className="p-6 bg-green-500/20 backdrop-blur-lg border border-green-500/50 rounded-2xl">
                            <p className="text-2xl font-bold text-green-300">🚀 Event Started!</p>
                        </div>
                    ) : (
                        <div className="flex flex-wrap justify-center gap-2">
                            <AnimatedNumber value={timeLeft.days} label="Days" />
                            <AnimatedNumber value={timeLeft.hours} label="Hours" />
                            <AnimatedNumber value={timeLeft.minutes} label="Mins" />
                            <AnimatedNumber value={timeLeft.seconds} label="Secs" />
                        </div>
                    )}
                </div>

                {/* --- Action Buttons --- */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col gap-4 w-full px-4 mb-8"
                >
                    <Link
                        href="/login"
                        className="px-8 py-3.5 bg-white text-black rounded-xl font-bold text-base shadow-lg w-full text-center hover:scale-105 transition-transform"
                    >
                        Login
                    </Link>
                    <Link
                        href="/rules"
                        className="px-8 py-3.5 bg-white/5 border border-white/20 text-white rounded-xl font-semibold text-base w-full text-center backdrop-blur-sm hover:bg-white/10 transition-colors"
                    >
                        Rules & Regulations
                    </Link>
                </motion.div>

            </div>

            {/* --- SCROLLING ANNOUNCEMENT TICKER (Fixed at Bottom or Inline) --- */}
            <div className="relative z-20 w-full overflow-hidden bg-black/60 border-y border-yellow-500/30 backdrop-blur-md">
                <div className="flex w-max animate-marquee py-2">
                    <MarqueeContent />
                    <MarqueeContent />
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
          animation: marquee 30s linear infinite;
        }
      `}</style>
        </section>
    );
}