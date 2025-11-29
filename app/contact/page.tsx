'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState } from 'react';
import Image from 'next/image';

// ----------------------
// TypeScript Interfaces
// ----------------------
interface ContactPerson {
    name: string;
    phone: string;
    image?: string | null;
    role: string;
}

interface ContactSection {
    title: string;
    description: string;
    contacts: ContactPerson[];
}

// Fallback avatar component
const AvatarFallback = ({ name, className = "" }: { name: string; className?: string }) => (
    <div className={`bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white font-medium ${className}`}>
        {name.split(' ').map(n => n[0]).join('').toUpperCase()}
    </div>
);

// Floating animation variant
const floatingAnimation = {
    animate: {
        y: [0, -10, 0],
        transition: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
};

export default function Contact() {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

    // --------------------------
    // DATA with strict typing
    // --------------------------
    const contactSections: ContactSection[] = [
        {
            title: "Administrative Support",
            description: "For administrative queries and coordination",
            contacts: [
                {
                    name: "Rev. Dr. L. John Peter Arulanandam SJ",
                    phone: "9486329686",
                    image: "/images/vp.jpg",
                    role: "Administrative Head"
                }
            ]
        },
        {
            title: "Event Coordination",
            description: "For event queries and participation details",
            contacts: [
                {
                    name: "Dr. A. Simi",
                    phone: "9894520549",
                    image: "/images/simi.jpg",
                    role: "Event Coordinator"
                },
                {
                    name: "Dr. A. Vimal Jerald",
                    phone: "9698111008",
                    image: "/images/vimal.jpg",
                    role: "Event Coordinator"
                },
                {
                    name: "S. Frank Antony Vimal",
                    phone: "6379363903",
                    image: "/images/frank.jpg",
                    role: "Event Coordinator"
                }
            ]
        }
    ];

    const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

    const handleImageError = (name: string) => {
        setImageErrors(prev => ({ ...prev, [name]: true }));
    };

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

    const cardHoverVariants = {
        initial: { scale: 1, y: 0 },
        hover: {
            scale: 1.02,
            y: -5,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        }
    };

    return (
        <div className="min-h-screen mt-10 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>

            {/* HERO SECTION */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16 pt-16 relative z-10"
            >
                {/* <motion.div
                    variants={floatingAnimation}
                    animate="animate"
                    className="mb-6"
                >
                    <span className="px-6 py-3 bg-white/80 backdrop-blur-sm text-blue-600 rounded-full text-sm font-semibold shadow-lg border border-blue-100">
                        📞 Get In Touch
                    </span>
                </motion.div> */}

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
                >
                    Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Us</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
                >
                    Reach out to our dedicated team for INDEP 2025 queries and assistance
                </motion.p>
            </motion.section>

            {/* MAIN CONTACT SECTIONS - Two Column Layout */}
            <motion.section
                ref={ref}
                variants={containerVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                className="max-w-7xl mx-auto mb-16 relative z-10"
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

                    {/* LEFT COLUMN - ADMINISTRATIVE SUPPORT */}
                    <motion.div
                        variants={itemVariants}
                        className="relative"
                    >
                        <div className="sticky top-24">
                            <motion.div
                                whileHover="hover"
                                variants={cardHoverVariants}
                                className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl border border-blue-100 p-8 h-full"
                            >
                                {/* Header */}
                                <div className="text-center mb-8">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
                                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-3xl font-bold text-gray-900 mb-3">
                                        {contactSections[0].title}
                                    </h2>
                                    <p className="text-gray-600 text-lg">
                                        {contactSections[0].description}
                                    </p>
                                </div>

                                {/* Admin Contact Card */}
                                <div className="space-y-6">
                                    {contactSections[0].contacts.map((contact, index) => {
                                        const hasImageError = imageErrors[contact.name];

                                        return (
                                            <motion.div
                                                key={contact.name}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                                                className="bg-white rounded-xl shadow-lg border border-blue-200 p-6 hover:shadow-xl transition-all duration-300"
                                            >
                                                <div className="flex items-center space-x-6">
                                                    <div className="relative">
                                                        <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg overflow-hidden">
                                                            {!hasImageError && contact.image ? (
                                                                <Image
                                                                    src={contact.image}
                                                                    alt={contact.name}
                                                                    width={80}
                                                                    height={80}
                                                                    className="w-full h-full object-cover"
                                                                    onError={() => handleImageError(contact.name)}
                                                                />
                                                            ) : (
                                                                <AvatarFallback name={contact.name} className="w-20 h-20 text-lg" />
                                                            )}
                                                        </div>
                                                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white">
                                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 3.5C14.8 3.4 14.6 3.3 14.4 3.3C14.2 3.3 14 3.4 13.8 3.5L8 7V9C8 9.6 8.4 10 9 10H10V20C10 20.6 10.4 21 11 21H13C13.6 21 14 20.6 14 20V10H15C15.6 10 16 9.6 16 9Z" />
                                                            </svg>
                                                        </div>
                                                    </div>

                                                    <div className="flex-1">
                                                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                                                            {contact.name}
                                                        </h3>
                                                        <p className="text-blue-600 font-medium text-sm mb-3">
                                                            {contact.role}
                                                        </p>
                                                        <motion.a
                                                            href={`tel:${contact.phone}`}
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            className="inline-flex items-center space-x-3 bg-blue-50 text-blue-700 px-4 py-3 rounded-xl hover:bg-blue-100 transition-all duration-300 group"
                                                        >
                                                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                            </svg>
                                                            <span className="font-semibold text-lg">{contact.phone}</span>
                                                        </motion.a>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* RIGHT COLUMN - EVENT COORDINATION */}
                    <motion.div
                        variants={itemVariants}
                        className="relative"
                    >
                        <motion.div
                            whileHover="hover"
                            variants={cardHoverVariants}
                            className="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-xl border border-purple-100 p-8 h-full"
                        >
                            {/* Header */}
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mb-4">
                                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                                    {contactSections[1].title}
                                </h2>
                                <p className="text-gray-600 text-lg">
                                    {contactSections[1].description}
                                </p>
                            </div>

                            {/* Event Coordinators Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {contactSections[1].contacts.map((contact, index) => {
                                    const hasImageError = imageErrors[contact.name];

                                    return (
                                        <motion.div
                                            key={contact.name}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.6, delay: 0.7 + index * 0.15 }}
                                            whileHover={{
                                                scale: 1.03,
                                                transition: { duration: 0.2 }
                                            }}
                                            className="bg-white rounded-xl shadow-lg border border-purple-200 p-6 hover:shadow-xl transition-all duration-300 group"
                                        >
                                            <div className="text-center">
                                                {/* Avatar */}
                                                <div className="relative mx-auto mb-4">
                                                    <div className="w-18 h-18 rounded-2xl border-3 border-white shadow-lg overflow-hidden mx-auto group-hover:scale-110 transition-transform duration-300">
                                                        {!hasImageError && contact.image ? (
                                                            <Image
                                                                src={contact.image}
                                                                alt={contact.name}
                                                                width={64}
                                                                height={64}
                                                                className="w-full h-full object-cover"
                                                                onError={() => handleImageError(contact.name)}
                                                            />
                                                        ) : (
                                                            <AvatarFallback name={contact.name} className="w-16 h-16 text-sm" />
                                                        )}
                                                    </div>
                                                    <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center border-2 border-white">
                                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                        </svg>
                                                    </div>
                                                </div>

                                                {/* Info */}
                                                <h3 className="text-sm font-semibold text-gray-900 mb-2 leading-tight">
                                                    {contact.name}
                                                </h3>
                                                <p className="text-purple-600 text-sm font-medium mb-4">
                                                    {contact.role}
                                                </p>

                                                {/* Phone */}
                                                <motion.a
                                                    href={`tel:${contact.phone}`}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="inline-flex items-center space-x-2 text-gray-700 hover:text-purple-700 transition-colors duration-300 group"
                                                >
                                                    <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                    </svg>
                                                    <span className="font-semibold text-sm">{contact.phone}</span>
                                                </motion.a>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.section>

            {/* QUICK ACTIONS SECTION */}
            <motion.section
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="max-w-4xl mx-auto relative z-10"
            >
                <div className="group bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-2xl p-8 md:p-12 text-white relative overflow-hidden">
                    {/* Background Pattern */}
                    {/* Decorative background circles */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">

                        <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full
                    -translate-x-1/2 -translate-y-1/2 
                    transition-transform duration-700 group-hover:scale-150">
                        </div>

                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full
                    translate-x-1/2 translate-y-1/2 
                    transition-transform duration-700 group-hover:scale-150">
                        </div>

                    </div>


                    <div className="relative z-10 text-center">
                        <motion.h3
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-3xl font-bold mb-4"
                        >
                            Need Immediate Assistance?
                        </motion.h3>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto"
                        >
                            Contact our team during college hours for prompt support and guidance
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                        >
                            <motion.a
                                href="tel:9486329686"
                                whileHover={{
                                    scale: 1.05,
                                    boxShadow: "0 10px 25px -5px rgba(255, 255, 255, 0.3)"
                                }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-3 min-w-[200px] justify-center group"
                            >
                                <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span>Call Admin</span>
                            </motion.a>

                            <motion.a
                                href="tel:9894520549"
                                whileHover={{
                                    scale: 1.05,
                                    boxShadow: "0 10px 25px -5px rgba(255, 255, 255, 0.3)"
                                }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 flex items-center space-x-3 min-w-[200px] justify-center group"
                            >
                                <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                <span>Call Coordinator</span>
                            </motion.a>
                        </motion.div>
                    </div>
                </div>
            </motion.section>
        </div>
    );
}