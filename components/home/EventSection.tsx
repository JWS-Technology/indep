// components/home/HomeEvents.tsx
"use client";
import { motion } from "framer-motion";
import { Music, Drama, Mic2, Palette, ArrowRight } from "lucide-react";
import Link from "next/link";

const categories = [
    {
        id: "dance",
        title: "Dance",
        icon: <Drama size={32} />,
        desc: "Group & Solo Choreography",
        color: "from-orange-400 to-red-500",
        colSpan: "md:col-span-2",
    },
    {
        id: "music",
        title: "Music",
        icon: <Music size={32} />,
        desc: "Vocals & Instrumentals",
        color: "from-purple-500 to-indigo-600",
        colSpan: "md:col-span-1",
    },
    {
        id: "theatre",
        title: "Theatre",
        icon: <Mic2 size={32} />,
        desc: "Mime, Skit & Drama",
        color: "from-blue-400 to-cyan-500",
        colSpan: "md:col-span-1",
    },
    {
        id: "arts",
        title: "Fine Arts",
        icon: <Palette size={32} />,
        desc: "Painting & Designing",
        color: "from-pink-500 to-rose-500",
        colSpan: "md:col-span-2",
    },
];

export default function HomeEvents() {
    return (
        <section className="py-16 md:py-24 px-4 bg-white relative overflow-hidden">

            {/* Background Blob */}
            <div className="hidden md:block absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
                    <div>
                        <span className="text-blue-600 font-bold tracking-wider uppercase text-xs md:text-sm">Spectacles</span>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mt-2 leading-tight">
                            Signature <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Events</span>
                        </h2>
                    </div>
                    <Link
                        href="/events"
                        className="group flex items-center gap-2 text-slate-600 font-semibold text-sm md:text-base hover:text-blue-600 transition-colors"
                    >
                        View All Events
                        <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    {categories.map((cat, idx) => (
                        <Link
                            key={cat.id}
                            href="/events"
                            className={`block h-full ${cat.colSpan}`} // Grid span applied to the Link wrapper
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className={`
                                    relative group overflow-hidden rounded-2xl md:rounded-3xl p-6 md:p-8 
                                    h-56 md:h-64 flex flex-col justify-between cursor-pointer 
                                    shadow-lg hover:shadow-2xl transition-all duration-300 
                                    bg-slate-50 w-full
                                `}
                            >
                                {/* Hover Gradient Background */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                                <div className="relative z-10">
                                    <div className="bg-white/90 w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center text-slate-800 shadow-sm group-hover:scale-110 transition-transform duration-300">
                                        {cat.icon}
                                    </div>
                                </div>

                                <div className="relative z-10">
                                    <h3 className="text-xl md:text-2xl font-bold text-slate-800 group-hover:text-white transition-colors">
                                        {cat.title}
                                    </h3>
                                    <p className="text-sm md:text-base text-slate-500 font-medium mt-1 group-hover:text-white/90 transition-colors">
                                        {cat.desc}
                                    </p>
                                </div>

                                {/* Decorative Big Icon */}
                                <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:opacity-20 text-slate-900 group-hover:text-white transition-all duration-500 transform group-hover:scale-125 group-hover:-rotate-12">
                                    {cat.icon}
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}