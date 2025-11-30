"use client";

import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { Star, Users, Trophy, CalendarClock } from "lucide-react";

export default function AboutSection() {
    const floatAnimation: Variants = {
        animate: {
            y: [0, -20, 0],
            transition: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut" as const,
            },
        },
    };

    const floatAnimationReverse: Variants = {
        animate: {
            y: [0, 20, 0],
            transition: {
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut" as const,
            },
        },
    };

    return (
        <section className="py-24 bg-white relative overflow-hidden">


            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* --- LEFT: TEXT CONTENT --- */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex items-center gap-2 mb-6">
                            <span className="h-px w-12 bg-blue-600"></span>
                            <span className="text-blue-600 font-bold uppercase tracking-widest text-sm">
                                About The Fest
                            </span>
                        </div>

                        <h2 className="text-4xl lg:text-6xl font-black text-slate-900 mb-6 leading-[1.1]">
                            Where <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Talent</span> <br />
                            Meets Tradition.
                        </h2>

                        <p className="text-lg text-slate-600 leading-relaxed mb-8">
                            INDEP is not just an event; it's the pulse of St. Joseph's. For over a decade,
                            we have brought together the brightest minds and the most creative souls.
                            It is a platform where <span className="font-bold text-slate-800">leadership</span> is forged,
                            <span className="font-bold text-slate-800"> teamwork</span> is tested, and
                            <span className="font-bold text-slate-800"> unity</span> is celebrated.
                        </p>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-6 border-t border-slate-100 pt-8">
                            <div>
                                <h4 className="text-3xl font-black text-slate-900">1.5K+</h4>
                                <p className="text-sm text-slate-500 font-medium mt-1">Participants</p>
                            </div>
                            <div>
                                <h4 className="text-3xl font-black text-slate-900">25+</h4>
                                <p className="text-sm text-slate-500 font-medium mt-1">Departments</p>
                            </div>
                            <div>
                                <h4 className="text-3xl font-black text-slate-900">2</h4>
                                <p className="text-sm text-slate-500 font-medium mt-1">Days of Glory</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* --- RIGHT: IMAGE COLLAGE --- */}
                    <div className="relative h-[600px] w-full hidden lg:block">

                        {/* Main Center Image */}
                        <div className="absolute inset-0 m-auto w-[350px] h-[450px] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white z-10 rotate-3">
                            <Image
                                src="https://www.sjctni.edu/img/EventGallery/images/24_Indep2k24/P1218846.jpg"
                                alt="Main Event"
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Floating Top Left */}
                        <motion.div
                            variants={floatAnimation}
                            animate="animate"
                            className="absolute top-10 left-10 w-48 h-64 rounded-2xl overflow-hidden shadow-xl border-4 border-white z-20 -rotate-6"
                        >
                            <Image
                                src="https://www.sjctni.edu/img/EventGallery/images/24_Indep2k24/0A2A6844.jpg" // Placeholder concert image
                                alt="Singing"
                                fill
                                className="object-cover"
                            />
                        </motion.div>

                        {/* Floating Bottom Right */}
                        <motion.div
                            variants={floatAnimationReverse}
                            animate="animate"
                            className="absolute bottom-10 right-10 w-56 h-40 rounded-2xl overflow-hidden shadow-xl border-4 border-white z-20 rotate-6"
                        >
                            <Image
                                src="https://www.sjctni.edu/img/EventGallery/images/24_Indep2k24/P1218948.jpg" // Placeholder lights/crowd
                                alt="Crowd"
                                fill
                                className="object-cover"
                            />
                        </motion.div>

                        {/* Decorative Elements */}
                        <div className="absolute top-0 right-20 text-yellow-400 animate-spin-slow">
                            <Star size={48} fill="currentColor" />
                        </div>
                        <div className="absolute bottom-20 left-0 w-24 h-24 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full blur-2xl opacity-40 animate-pulse" />

                    </div>

                    {/* Mobile Single Image Fallback */}
                    <div className="lg:hidden w-full h-64 relative rounded-2xl overflow-hidden shadow-lg">
                        <Image
                            src="https://www.sjctni.edu/img/EventGallery/images/24_Indep2k24/P1218846.jpg"
                            alt="Main Event"
                            fill
                            className="object-cover"
                        />
                    </div>

                </div>
            </div>
        </section>
    );
}