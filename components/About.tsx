'use client';

import Image from "next/image";
import { motion } from "framer-motion";

export default function AboutSmall() {
    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    const imageVariants = {
        hidden: { opacity: 0, scale: 0.8, x: -50 },
        visible: {
            opacity: 1,
            scale: 1,
            x: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut"
            }
        },
        hover: {
            scale: 1.05,
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            }
        }
    };

    const statVariants = {
        hidden: { opacity: 0, scale: 0.5 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: "backOut"
            }
        },
        hover: {
            scale: 1.05,
            y: -5,
            transition: {
                duration: 0.2,
                ease: "easeInOut"
            }
        }
    };

    const buttonVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                delay: 0.8
            }
        },
        hover: {
            scale: 1.05,
            boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)",
            transition: {
                duration: 0.2,
                ease: "easeInOut"
            }
        },
        tap: {
            scale: 0.95
        }
    };

    return (
        <section className="py-16 bg-white px-4 sm:px-6 lg:px-8 overflow-hidden">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                {/* LEFT — IMAGE */}
                <motion.div
                    variants={imageVariants}
                    initial="hidden"
                    whileInView="visible"
                    whileHover="hover"
                    viewport={{ once: true, margin: "-50px" }}
                    className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden shadow-lg group"
                >
                    <Image
                        src="https://www.sjctni.edu/img/EventGallery/images/24_Indep2k24/P1218846.jpg"
                        alt="INDEP Cultural Event"
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />

                    {/* Animated overlay */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"
                        whileHover={{ opacity: 0.3 }}
                        transition={{ duration: 0.3 }}
                    />

                    {/* Floating elements */}
                    {/* <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg"
                    >
                        <div className="flex items-center space-x-2">
                            <motion.div
                                className="w-2 h-2 bg-green-500 rounded-full"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                            <span className="text-sm font-semibold text-gray-800">Live 2025</span>
                        </div>
                    </motion.div> */}
                </motion.div>

                {/* RIGHT — TEXT */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="space-y-6"
                >
                    {/* Title */}
                    <motion.h2
                        variants={itemVariants}
                        className="text-3xl lg:text-4xl font-bold text-gray-900"
                    >
                        INDEP{" "}
                        <motion.span
                            className="text-blue-600"
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            2025
                        </motion.span>
                    </motion.h2>

                    {/* Paragraphs */}
                    <motion.p
                        variants={itemVariants}
                        className="text-gray-600 text-lg leading-relaxed"
                    >
                        INDEP is the Inter-Departmental Cultural Event of St. Joseph's College.
                        It is one of the most cherished traditions for every Josephite, bringing
                        together talent, creativity, and unity.
                    </motion.p>

                    <motion.p
                        variants={itemVariants}
                        className="text-gray-600 text-lg leading-relaxed"
                    >
                        More than{" "}
                        <motion.span
                            className="font-semibold text-blue-600 relative"
                            whileInView={{
                                backgroundColor: ["rgba(59, 130, 246, 0.1)", "rgba(59, 130, 246, 0.2)", "rgba(59, 130, 246, 0.1)"],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            1500 students
                        </motion.span>{" "}
                        from various departments participate in literary, cultural, and on-stage events.
                        INDEP helps students grow in{" "}
                        <motion.span
                            className="font-semibold text-purple-600"
                            whileInView={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 1, delay: 0.5 }}
                        >
                            leadership
                        </motion.span>
                        ,{" "}
                        <motion.span
                            className="font-semibold text-purple-600"
                            whileInView={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 1, delay: 0.7 }}
                        >
                            organizational skills
                        </motion.span>
                        , and{" "}
                        <motion.span
                            className="font-semibold text-purple-600"
                            whileInView={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 1, delay: 0.9 }}
                        >
                            teamwork
                        </motion.span>
                        .
                    </motion.p>

                    <motion.p
                        variants={itemVariants}
                        className="text-gray-600 text-lg leading-relaxed"
                    >
                        It is conducted across both Shift I and Shift II, promoting{" "}
                        <motion.span
                            className="font-semibold text-green-600"
                            whileInView={{
                                textShadow: ["0 0 0px currentColor", "0 0 8px currentColor", "0 0 0px currentColor"]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            healthy competition
                        </motion.span>{" "}
                        and{" "}
                        <motion.span
                            className="font-semibold text-green-600"
                            whileInView={{
                                textShadow: ["0 0 0px currentColor", "0 0 8px currentColor", "0 0 0px currentColor"]
                            }}
                            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                        >
                            unity
                        </motion.span>{" "}
                        among departments.
                    </motion.p>

                    {/* Stats */}
                    <motion.div
                        variants={containerVariants}
                        className="grid grid-cols-3 gap-4 pt-4"
                    >
                        {[
                            { number: "1500+", label: "Students", delay: 0.4 },
                            { number: "50+", label: "Events", delay: 0.6 },
                            { number: "15+", label: "Departments", delay: 0.8 },
                        ].map((stat, idx) => (
                            <motion.div
                                key={idx}
                                variants={statVariants}
                                whileHover="hover"
                                custom={stat.delay}
                                className="text-center p-4 bg-gray-50 border rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 cursor-default"
                            >
                                <motion.div
                                    className="text-xl font-bold text-blue-600"
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 200,
                                        damping: 10,
                                        delay: stat.delay
                                    }}
                                >
                                    {stat.number}
                                </motion.div>
                                <motion.div
                                    className="text-sm text-gray-600 mt-1"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    transition={{ duration: 0.5, delay: stat.delay + 0.2 }}
                                >
                                    {stat.label}
                                </motion.div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Button */}
                    <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-300 flex items-center space-x-2 group"
                    >
                        <span>Learn More</span>
                        <motion.span
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="group-hover:translate-x-1 transition-transform duration-300"
                        >
                            →
                        </motion.span>
                    </motion.button>
                </motion.div>
            </div>
        </section>
    );
}