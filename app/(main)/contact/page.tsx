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
    email?: string;
}

interface ContactSection {
    title: string;
    description: string;
    contacts: ContactPerson[];
}

// Fallback avatar component
const AvatarFallback = ({ name, className = "" }: { name: string; className?: string }) => (
    <div className={`bg-gradient-to-br from-slate-400 to-slate-600 rounded-full flex items-center justify-center text-white font-bold tracking-wider shadow-inner ${className}`}>
        {name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
    </div>
);

export default function Contact() {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
    const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

    const handleImageError = (name: string) => {
        setImageErrors(prev => ({ ...prev, [name]: true }));
    };

    // --------------------------
    // DATA
    // --------------------------
    const contactSections: ContactSection[] = [
        {
            title: "Administrative Head",
            description: "Overall coordination & institutional guidance",
            contacts: [
                {
                    name: "Rev. Dr. L. John Peter Arulanandam SJ",
                    phone: "9486329686",
                    image: "/images/vp.jpg",
                    role: "Vice Principal"
                }
            ]
        },
        {
            title: "Event Coordinators",
            description: "For technical queries, rules, and participation details",
            contacts: [

                {
                    name: "Dr. A. Vimal Jerald",
                    phone: "9698111008",
                    image: "/images/vimal.jpg",
                    role: "Staff Coordinator"
                },
                {
                    name: "Dr. K. JOHN KENNEDY",
                    phone: "9894520549",
                    image: "https://sjctni.edu/images/Tphotos/25cta53.jpg",
                    role: "Staff Coordinator"
                },
                {
                    name: "K. Samkumar",
                    phone: "9025469183",
                    image: "https://sjctni.edu/images/SPhotos/23/23ucs147.jpg",
                    role: "Student Coordinator"
                }
            ]
        }
    ];

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring" as const, stiffness: 50, damping: 20 }
        }
    };

    return (
        <div className="mt-10 min-h-screen bg-[#FAFAFA] relative overflow-hidden font-sans selection:bg-blue-100 selection:text-blue-900">

            {/* --- Ambient Background Elements --- */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-purple-200/30 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '8s' }}></div>
                <div className="absolute top-[20%] right-[-5%] w-[30rem] h-[30rem] bg-blue-200/30 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }}></div>
                <div className="absolute bottom-[-10%] left-[20%] w-[35rem] h-[35rem] bg-indigo-200/30 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03]"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">

                {/* --- HEADER --- */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <span className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest mb-6 shadow-sm hover:shadow-md transition-all duration-300">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        8am — 7pm Support
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-6">
                        Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">Us.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
                        Have questions about INDEP 2025? Our team is ready to help you with registration, events, and logistics.
                    </p>
                </motion.div>


                {/* --- MAIN GRID --- */}
                <motion.div
                    ref={ref}
                    variants={containerVariants}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                >

                    {/* LEFT: ADMIN CARD (Featured) */}
                    <motion.div variants={cardVariants} className="lg:col-span-5 h-full">
                        <div className="h-full bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 md:p-10 border border-white shadow-xl shadow-blue-900/5 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 flex flex-col justify-between group relative overflow-hidden">

                            {/* Decorative Gradient Blob inside card */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>

                            <div>
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900">{contactSections[0].title}</h2>
                                        <p className="text-slate-500 text-sm">{contactSections[0].description}</p>
                                    </div>
                                </div>

                                {contactSections[0].contacts.map((contact) => (
                                    <div key={contact.name} className="flex flex-col items-center text-center sm:items-start sm:text-left sm:flex-row gap-6">
                                        <div className="relative group-hover:scale-105 transition-transform duration-500">
                                            <div className="w-30 h-30 rounded-3xl overflow-hidden border-4 border-white shadow-lg bg-slate-100 relative">
                                                {!imageErrors[contact.name] && contact.image ? (
                                                    <Image
                                                        src={contact.image}
                                                        alt={contact.name}
                                                        fill
                                                        className=""
                                                        onError={() => handleImageError(contact.name)}
                                                    />
                                                ) : (
                                                    <AvatarFallback name={contact.name} className="w-full h-full text-2xl" />
                                                )}
                                            </div>

                                            {/* UPDATED: Instagram Style Verification Badge */}
                                            <div className="absolute -bottom-2 -right-2 bg-white rounded-full border-[3px] border-white shadow-md text-blue-500">
                                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                                                    <path d="M10.6021 2.40187C11.2163 1.83849 12.1643 1.83849 12.7785 2.40187L14.0772 3.59302C14.3414 3.83533 14.697 3.95763 15.0567 3.93006L16.8247 3.79451C17.6609 3.73041 18.3972 4.31872 18.5756 5.13283L18.9529 6.85467C19.0297 7.20502 19.2435 7.50989 19.5416 7.69468L21.0069 8.60294C21.6999 9.0325 21.9363 9.93259 21.5457 10.6521L20.7198 12.1732C20.5518 12.4827 20.5518 12.8553 20.7198 13.1648L21.5457 14.6859C21.9363 15.4054 21.6999 16.3055 21.0069 16.7351L19.5416 17.6433C19.2435 17.8281 19.0297 18.133 18.9529 18.4833L18.5756 20.2052C18.3972 21.0193 17.6609 21.6076 16.8247 21.5435L15.0567 21.4079C14.697 21.3804 14.3414 21.5027 14.0772 21.745L12.7785 22.9361C12.1643 23.4995 11.2163 23.4995 10.6021 22.9361L9.30338 21.745C9.0392 21.5027 8.68358 21.3804 8.32392 21.4079L6.55588 21.5435C5.71974 21.6076 4.98337 21.0193 4.80497 20.2052L4.42767 18.4833C4.35091 18.133 4.13706 17.8281 3.83897 17.6433L2.37372 16.7351C1.68066 16.3055 1.44427 15.4054 1.83489 14.6859L2.66078 13.1648C2.82882 12.8553 2.82882 12.4827 2.66078 12.1732L1.83489 10.6521C1.44427 9.93259 1.68066 9.0325 2.37372 8.60294L3.83897 7.69468C4.13706 7.50989 4.35091 7.20502 4.42767 6.85467L4.80497 5.13283C4.98337 4.31872 5.71974 3.73041 6.55588 3.79451L8.32392 3.93006C8.68358 3.95763 9.0392 3.83533 9.30338 3.59302L10.6021 2.40187Z" />
                                                    <path d="M10.5 15.5L7.5 12.5L8.91 11.09L10.5 12.67L15.09 8.09L16.5 9.5L10.5 15.5Z" fill="white" />
                                                </svg>
                                            </div>
                                        </div>

                                        <div className="flex-1 pt-2">
                                            <h3 className="text-xl font-bold text-slate-900 leading-tight mb-2">{contact.name}</h3>
                                            <p className="text-blue-600 font-medium mb-4">{contact.role}</p>

                                            <a href={`tel:${contact.phone}`} className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors duration-300 shadow-lg shadow-slate-900/20">
                                                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                                Call Now
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* RIGHT: COORDINATORS GRID */}
                    <motion.div variants={cardVariants} className="lg:col-span-7 flex flex-col gap-6">

                        {/* Section Header Card */}
                        <div className="bg-white/60 backdrop-blur-md rounded-[2rem] p-6 border border-white shadow-sm flex items-center gap-4">
                            <div className="p-3 bg-purple-50 rounded-2xl text-purple-600">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">{contactSections[1].title}</h2>
                                <p className="text-slate-500 text-sm hidden sm:block">{contactSections[1].description}</p>
                            </div>
                        </div>

                        {/* Coordinators List */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 h-full">
                            {contactSections[1].contacts.map((contact, index) => (
                                <motion.div
                                    key={contact.name}
                                    variants={cardVariants}
                                    whileHover={{ y: -5 }}
                                    className={`
                                        bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-purple-900/5 transition-all duration-300 relative group overflow-hidden
                                        ${index === 2 ? "md:col-span-2 md:flex md:items-center md:gap-6" : ""}
                                    `}
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-[4rem] -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500"></div>

                                    <div className="relative z-10 flex items-start gap-5">
                                        <div className="relative flex-shrink-0">
                                            <div className="w-18 h-18 rounded-3xl overflow-hidden border-2 border-white shadow-md">
                                                {!imageErrors[contact.name] && contact.image ? (
                                                    <Image
                                                        src={contact.image}
                                                        alt={contact.name}
                                                        fill
                                                        className="rounded-2xl"
                                                        onError={() => handleImageError(contact.name)}
                                                    />
                                                ) : (
                                                    <AvatarFallback name={contact.name} className="w-full h-full text-sm" />
                                                )}
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-slate-900 truncate">{contact.name}</h3>
                                            <p className="text-purple-600 text-sm font-medium mb-3">{contact.role}</p>
                                            <a
                                                href={`tel:${contact.phone}`}
                                                className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-purple-600 transition-colors"
                                            >
                                                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                                {contact.phone}
                                            </a>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                    </motion.div>
                </motion.div>

                {/* --- FOOTER CTA --- */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-20 max-w-4xl mx-auto"
                >
                    <div className="relative rounded-[2.5rem] bg-slate-900 overflow-hidden px-8 py-12 md:px-16 text-center shadow-2xl shadow-slate-900/30">
                        {/* Abstract Background Shapes */}
                        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
                        </div>

                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold text-white mb-4">Can't find what you're looking for?</h2>
                            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                                Check out our schedule page for timing details or visit the registration desk on campus.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a href="/schedule" className="px-8 py-4 rounded-xl bg-white text-slate-900 font-bold hover:bg-blue-50 transition-colors">
                                    View Schedule
                                </a>
                                <a href="mailto:indep@college.edu" className="px-8 py-4 rounded-xl bg-white/10 text-white font-bold backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors">
                                    Email Support
                                </a>
                            </div>
                        </div>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}