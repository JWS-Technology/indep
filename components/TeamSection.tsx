"use client";

import Link from "next/link";
import { Trophy, ArrowRight } from "lucide-react";
import { shiftOne, shiftTwo } from "@/data/teams";

export default function HomeTeams() {
    return (
        <section className="py-24 bg-slate-900 text-white overflow-hidden relative">

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 text-center mb-16 relative z-10">
                <div className="inline-flex items-center gap-2 bg-yellow-500/10 text-yellow-400 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide mb-6 border border-yellow-500/20">
                    <Trophy size={16} /> The Battle for Glory
                </div>

                <h2 className="text-4xl md:text-6xl font-black mb-6">
                    Who Will Lift the <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-300">
                        Golden Cup?
                    </span>
                </h2>

                <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10">
                    Over 25+ departments across Shift I and Shift II are gearing up.
                    Support your department and witness history in the making.
                </p>

                <Link
                    href="/teams"
                    className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-full font-bold hover:bg-yellow-400 transition-colors duration-300"
                >
                    Find Your Team <ArrowRight size={20} />
                </Link>
            </div>

            {/* Marquee 1 — Shift One (Scrolls Left → Right) */}
            <div className="relative w-full rotate-2 bg-slate-800/50 py-6 border-y border-white/5 backdrop-blur-sm">
                <div className="flex w-max animate-marquee-left gap-8">
                    {[...shiftOne, ...shiftOne].map((dept, i) => (
                        <span
                            key={i}
                            className="text-4xl md:text-6xl text-gradient-to-r from-yellow-300 via-orange-400 to-yellow-300 md:text-transparent stroke-text opacity-30 hover:opacity-100 hover:text-yellow-400 transition-all duration-300 cursor-default"
                        >
                            {dept} •
                        </span>
                    ))}
                </div>
            </div>

            {/* Marquee 2 — Shift Two (Scrolls Right → Left) */}
            <div className="relative w-full -rotate-2 bg-slate-800/50 py-6 border-y border-white/5 backdrop-blur-sm">
                <div className="flex w-max animate-marquee-right gap-8">
                    {[...shiftTwo, ...shiftTwo].map((dept, i) => (
                        <span
                            key={i}
                            className="text-4xl md:text-6xl text-gradient-to-r from-yellow-300 via-orange-400 to-yellow-300 md:text-transparent stroke-text opacity-30 hover:opacity-100 hover:text-yellow-400 transition-all duration-300 cursor-default"
                        >
                            {dept} •
                        </span>
                    ))}
                </div>
            </div>

            {/* Styles */}
            <style jsx>{`
                .stroke-text {
                    -webkit-text-stroke: 1px rgba(255,255,255,0.5);
                }

                @keyframes marquee-left {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee-left {
                    animation: marquee-left 30s linear infinite;
                }

                @keyframes marquee-right {
                    0% { transform: translateX(-50%); }
                    100% { transform: translateX(0); }
                }
                .animate-marquee-right {
                    animation: marquee-right 30s linear infinite;
                }
            `}</style>
        </section>
    );
}
