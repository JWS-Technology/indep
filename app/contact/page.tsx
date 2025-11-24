'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState } from 'react';

// ----------------------
// TypeScript Interfaces
// ----------------------
interface ContactPerson {
    name: string;
    phone: string;
    image?: string | null;
}

interface ContactSection {
    title: string;
    contacts: ContactPerson[];
}

// Fallback avatar component
const AvatarFallback = ({ name, className = "" }: { name: string; className?: string }) => (
    <div className={`bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold ${className}`}>
        {name.split(' ').map(n => n[0]).join('').toUpperCase()}
    </div>
);

export default function Contact() {
    const [ref1, inView1] = useInView({ triggerOnce: true, threshold: 0.3 });
    const [ref2, inView2] = useInView({ triggerOnce: true, threshold: 0.3 });

    // --------------------------
    // DATA with strict typing
    // --------------------------
    const contactSections: ContactSection[] = [
        {
            title: "ADMINISTRATIVE ASSISTANCE",
            contacts: [
                {
                    name: "Rev. Dr. L. John Peter Arulanandam SJ",
                    phone: "9486329686",
                    image: "/images/vp.jpg"
                }
            ]
        },
        {
            title: "EVENT RELATED ASSISTANCE",
            contacts: [
                {
                    name: "Dr. A. Simi",
                    phone: "9894520549",
                    image: "/images/simi.jpg"
                },
                {
                    name: "Dr. A. Vimal Jerald",
                    phone: "9698111008",
                    image: "/images/vimal.jpg"
                },
                {
                    name: "S. Frank Antony Vimal",
                    phone: "6379363903",
                    image: "/images/frank.jpg"
                }
            ]
        }
    ];

    const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

    const handleImageError = (name: string) => {
        setImageErrors(prev => ({ ...prev, [name]: true }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-4 px-4 sm:px-6 lg:px-8">

            {/* HERO SECTION - Mobile Optimized */}
            <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-8"
            >
                <div className="inline-block mb-3 pt-20">
                    <span className="px-4  py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-xs font-semibold shadow-lg">
                        Get In Touch
                    </span>
                </div>

                <h1 className="text-3xl md:text-7xl font-black mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    CONTACT
                </h1>

                <p className="text-base md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                    Reach out for INDEP 2025 queries
                </p>
            </motion.section>

            <div className="max-w-6xl mx-auto">

                {/* --------------------------- */}
                {/* ADMINISTRATIVE ASSISTANCE - Mobile Optimized */}
                {/* --------------------------- */}
                <motion.section
                    ref={ref1}
                    initial={{ opacity: 0, y: 40 }}
                    animate={inView1 ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="mb-8"
                >
                    <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg md:shadow-2xl p-4 md:p-12 border border-gray-100">

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={inView1 ? { opacity: 1 } : {}}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-center mb-6 md:mb-12"
                        >
                            <h2 className="text-xl md:text-5xl font-bold text-gray-800 mb-2 md:mb-4">
                                Admin <span className="text-blue-600">Support</span>
                            </h2>
                            <p className="text-sm md:text-lg text-gray-600 max-w-2xl mx-auto">
                                Administrative queries and coordination
                            </p>
                        </motion.div>

                        <div className="grid md:grid-cols-1 gap-4 md:gap-8 max-w-2xl mx-auto">
                            {contactSections[0].contacts.map((contact, index) => {
                                const hasImageError = imageErrors[contact.name];

                                return (
                                    <motion.div
                                        key={contact.name}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={inView1 ? { opacity: 1, scale: 1 } : {}}
                                        transition={{ duration: 0.6, delay: 0.4 + index * 0.2 }}
                                        className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl md:rounded-2xl p-4 md:p-8 border border-blue-100 hover:shadow-lg md:hover:shadow-xl transition-all duration-300 group"
                                    >
                                        <div className="text-center">

                                            {/* Profile Image - Smaller on mobile */}
                                            <div className="relative mx-auto mb-3 md:mb-6">
                                                <div className="w-16 h-16 md:w-32 md:h-32 rounded-full border-2 md:border-4 border-white shadow-md md:shadow-lg overflow-hidden mx-auto group-hover:scale-105 md:group-hover:scale-110 transition-transform duration-300">
                                                    {!hasImageError && contact.image ? (
                                                        <img
                                                            src={contact.image}
                                                            alt={contact.name}
                                                            className="w-full h-full object-cover"
                                                            onError={() => handleImageError(contact.name)}
                                                        />
                                                    ) : (
                                                        <AvatarFallback name={contact.name} className="w-16 h-16 md:w-32 md:h-32 text-sm md:text-2xl" />
                                                    )}
                                                </div>

                                                <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 w-6 h-6 md:w-12 md:h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center border-2 md:border-4 border-white">
                                                    <svg className="w-3 h-3 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                </div>
                                            </div>

                                            <h3 className="text-base md:text-2xl font-bold text-gray-800 mb-1 md:mb-2 leading-tight">{contact.name}</h3>
                                            <p className="text-xs md:text-lg text-gray-600 mb-2 md:mb-4">Administrative Head</p>

                                            <div className="flex items-center justify-center space-x-2">
                                                <svg className="w-4 h-4 md:w-5 md:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>

                                                <a href={`tel:${contact.phone}`} className="text-sm md:text-xl font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-300">
                                                    {contact.phone}
                                                </a>
                                            </div>

                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </motion.section>

                {/* --------------------------- */}
                {/* EVENT RELATED ASSISTANCE - Mobile Optimized */}
                {/* --------------------------- */}
                <motion.section
                    ref={ref2}
                    initial={{ opacity: 0, y: 40 }}
                    animate={inView2 ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="mb-8"
                >
                    <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg md:shadow-2xl p-4 md:p-12 border border-gray-100">

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={inView2 ? { opacity: 1 } : {}}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-center mb-6 md:mb-12"
                        >
                            <h2 className="text-xl md:text-5xl font-bold text-gray-800 mb-2 md:mb-4">
                                Event <span className="text-purple-600">Team</span>
                            </h2>

                            <p className="text-sm md:text-lg text-gray-600 max-w-2xl mx-auto">
                                Event queries and participation details
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-8">
                            {contactSections[1].contacts.map((contact, index) => {
                                const hasImageError = imageErrors[contact.name];

                                return (
                                    <motion.div
                                        key={contact.name}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={inView2 ? { opacity: 1, y: 0 } : {}}
                                        transition={{ duration: 0.6, delay: 0.4 + index * 0.2 }}
                                        className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl md:rounded-2xl p-3 md:p-6 border border-purple-100 hover:shadow-lg md:hover:shadow-xl transition-all duration-300 group text-center"
                                    >

                                        {/* Profile Image - Smaller on mobile */}
                                        <div className="relative mx-auto mb-2 md:mb-4">
                                            <div className="w-12 h-12 md:w-24 md:h-24 rounded-full border-2 md:border-4 border-white shadow-md md:shadow-lg overflow-hidden mx-auto group-hover:scale-105 md:group-hover:scale-110 transition-transform duration-300">
                                                {!hasImageError && contact.image ? (
                                                    <img
                                                        src={contact.image}
                                                        alt={contact.name}
                                                        className="w-full h-full object-cover"
                                                        onError={() => handleImageError(contact.name)}
                                                    />
                                                ) : (
                                                    <AvatarFallback name={contact.name} className="w-12 h-12 md:w-24 md:h-24 text-xs md:text-xl" />
                                                )}
                                            </div>

                                            <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 w-4 h-4 md:w-8 md:h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center border-1 md:border-2 border-white">
                                                <svg className="w-2 h-2 md:w-4 md:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                            </div>
                                        </div>

                                        <h3 className="text-sm md:text-lg font-bold text-gray-800 mb-1 md:mb-2 leading-tight">{contact.name}</h3>
                                        <p className="text-xs md:text-sm text-gray-600 mb-2 md:mb-4">Event Coordinator</p>

                                        <div className="flex items-center justify-center space-x-1 md:space-x-2">
                                            <svg className="w-3 h-3 md:w-4 md:h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>

                                            <a href={`tel:${contact.phone}`} className="text-xs md:text-lg font-semibold text-purple-600 hover:text-purple-700 transition-colors duration-300">
                                                {contact.phone}
                                            </a>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </motion.section>

                {/* QUICK ACTIONS - Mobile Optimized */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl md:rounded-3xl p-4 md:p-12 text-white shadow-lg md:shadow-2xl">
                        <h3 className="text-lg md:text-3xl font-bold mb-2 md:mb-4">
                            Need Help?
                        </h3>

                        <p className="text-sm md:text-xl opacity-90 mb-4 md:mb-6 max-w-2xl mx-auto">
                            Call our coordinators during college hours
                        </p>

                        <div className="flex flex-col gap-2 md:gap-4 justify-center">
                            <motion.a
                                href="tel:9486329686"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-4 py-3 md:px-8 md:py-4 bg-white text-blue-600 rounded-lg md:rounded-xl font-semibold text-sm md:text-lg shadow-md md:shadow-lg hover:shadow-lg md:hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
                            >
                                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span>Call Admin</span>
                            </motion.a>

                            <motion.a
                                href="tel:9894520549"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-4 py-3 md:px-8 md:py-4 bg-transparent border border-white md:border-2 text-white rounded-lg md:rounded-xl font-semibold text-sm md:text-lg hover:bg-white/10 transition-all duration-300 flex items-center justify-center space-x-2"
                            >
                                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                <span>Call Coordinator</span>
                            </motion.a>
                        </div>
                    </div>
                </motion.section>

            </div>
        </div>
    );
}