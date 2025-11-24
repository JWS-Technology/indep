'use client';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { events } from "@/data/events";

export default function About() {
    const [ref1, inView1] = useInView({ triggerOnce: true, threshold: 0.3 });
    const [ref2, inView2] = useInView({ triggerOnce: true, threshold: 0.3 });
    const [ref3, inView3] = useInView({ triggerOnce: true, threshold: 0.3 });

    const totalEvents = events.length;

    const stats = [
        { number: "1500+", label: "Students" },
        { number: "2", label: "Days" },
        { number: `${totalEvents}+`, label: "Events" },
        { number: "15+", label: "Departments" }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-20 px-4 sm:px-6 lg:px-8">

            {/* HERO */}
            <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-20"
            >
                <div className="inline-block mb-4 pt-5">
                    <span className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-semibold shadow-lg">
                        January 12-13, 2025
                    </span>
                </div>

                <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    ABOUT INDEP
                </h1>

                <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                    Inter Departmental Cultural Extravaganza at St. Joseph&apos;s College
                </p>
            </motion.section>


            <div className="max-w-6xl mx-auto">

                {/* WHAT IS INDEP */}
                <motion.section
                    ref={ref1}
                    initial={{ opacity: 0 }}
                    animate={inView1 ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-20"
                >
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={inView1 ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8 }}
                            className="space-y-6"
                        >
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
                                What is <span className="text-blue-600">INDEP</span>?
                            </h2>

                            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                                <span className="font-semibold text-blue-600">INDEP</span> stands for
                                <span className="font-semibold"> Inter Departmental Cultural Events</span>.
                                It is a vibrant cultural festival where departments compete in literary,
                                cultural, and performing arts events, creating an atmosphere of healthy
                                competition and camaraderie.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={inView1 ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 text-white shadow-2xl transform hover:scale-105 transition-transform duration-500">
                                <div className="text-6xl font-black mb-4 opacity-20">INDEP</div>
                                <p className="text-lg leading-relaxed relative z-10">
                                    An ever-cherishing and memorable event in every Josephite&apos;s life
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </motion.section>


                {/* EXPERIENCE */}
                <motion.section
                    ref={ref2}
                    initial={{ opacity: 0 }}
                    animate={inView2 ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-20"
                >
                    <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={inView2 ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8 }}
                        >
                            <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
                                The <span className="text-purple-600">INDEP</span> Experience
                            </h3>

                            <div className="grid md:grid-cols-2 gap-8">

                                <div className="space-y-4">
                                    <p className="text-lg text-gray-600 leading-relaxed">
                                        For every Josephite, INDEP is an event which is ever cherishing and
                                        memorable. More than <span className="font-semibold text-blue-600">
                                            1500 students</span> take part in various cultural and literary events.
                                    </p>

                                    <p className="text-lg text-gray-600 leading-relaxed">
                                        Organized by students with guidance from professors, INDEP helps build
                                        extracurricular skills, leadership, and organizational abilities.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-lg text-gray-600 leading-relaxed">
                                        Conducted among departments from both Shift I and Shift II, INDEP fosters
                                        unity and healthy competition.
                                    </p>

                                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                                        <p className="text-yellow-800 font-semibold">
                                            🎯 Building future leaders through cultural excellence
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </motion.div>
                    </div>
                </motion.section>


                {/* STATS */}
                <motion.section
                    ref={ref3}
                    initial={{ opacity: 0 }}
                    animate={inView3 ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-20"
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={inView3 ? { opacity: 1, scale: 1 } : {}}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                                className="bg-white rounded-2xl p-6 text-center shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                            >
                                <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    {stat.number}
                                </div>
                                <div className="text-gray-600 font-semibold mt-2">{stat.label}</div>
                            </motion.div>
                        ))}

                    </div>
                </motion.section>


                {/* DATE HIGHLIGHT */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
                        <h3 className="text-2xl md:text-3xl font-bold mb-4">
                            Mark Your Calendars!
                        </h3>

                        <div className="text-4xl md:text-6xl font-black mb-4">
                            January 12-13, 2025
                        </div>

                        <p className="text-xl opacity-90">
                            Get ready for two days of cultural excellence, creativity, and competition!
                        </p>
                    </div>
                </motion.section>

            </div>
        </div>
    );
}