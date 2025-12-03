"use client";

import Link from "next/link";
import { Trophy, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

interface Team {
    id: string;
    name: string;
    shift: "I" | "II";
}

export default function HomeTeams() {
    const [teams, setTeams] = useState<{ shiftOne: Team[]; shiftTwo: Team[] }>({
        shiftOne: [],
        shiftTwo: []
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const res = await fetch("/api/team");
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

                const data = await res.json();

                if (!Array.isArray(data.teams))
                    throw new Error("Unexpected API response");

                const mappedTeams: Team[] = data.teams.map((team: any) => ({
                    id: team.teamId,
                    name: team.teamName,
                    shift: team.shift === "Shift I" ? "I" : "II"
                }));

                const shiftOne = mappedTeams.filter((t) => t.shift === "I");
                const shiftTwo = mappedTeams.filter((t) => t.shift === "II");

                setTeams({ shiftOne, shiftTwo });
            } catch (err: any) {
                setError(err.message || "Failed to fetch teams");
            } finally {
                setLoading(false);
            }
        };

        fetchTeams();
    }, []);

    return (
        <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
            {/* Header */}
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
                </p>

                <Link
                    href="/teams"
                    className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-full font-bold hover:bg-yellow-400 transition-colors duration-300"
                >
                    Find Your Team <ArrowRight size={20} />
                </Link>
            </div>

            {/* ==== SHIFT ONE ==== */}
            <div className="relative w-full rotate-2 bg-slate-800/50 py-6 border-y border-white/5 backdrop-blur-sm">
                <div className="flex w-max animate-marquee-left gap-8">
                    {[...teams.shiftOne, ...teams.shiftOne].map((dept, i) => (
                        <span
                            key={i}
                            className="text-4xl md:text-6xl text-transparent bg-clip-text 
                            bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-300 opacity-30 
                            hover:opacity-100 transition-all duration-300 cursor-default"
                        >
                            {dept.name} •
                        </span>
                    ))}
                </div>
            </div>

            {/* ==== SHIFT TWO ==== */}
            <div className="relative w-full -rotate-2 bg-slate-800/50 py-6 border-y border-white/5 backdrop-blur-sm">
                <div className="flex w-max animate-marquee-right gap-8">
                    {[...teams.shiftTwo, ...teams.shiftTwo].map((dept, i) => (
                        <span
                            key={i}
                            className="text-4xl md:text-6xl text-transparent bg-clip-text 
                            bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-300 opacity-30 
                            hover:opacity-100 transition-all duration-300 cursor-default"
                        >
                            {dept.name} •
                        </span>
                    ))}
                </div>
            </div>

        </section>
    );
}
