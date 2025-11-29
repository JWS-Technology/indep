'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function AboutSmall() {
    return (
        <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

                {/* LEFT — IMAGE */}
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative w-full h-80 md:h-[420px] rounded-3xl overflow-hidden shadow-2xl"
                >
                    <Image
                        src="https://www.sjctni.edu/img/EventGallery/images/24_Indep2k24/P1218846.jpg"   // 🔥 Change your image path
                        alt="INDEP Event"
                        fill
                        className="object-cover"
                    />
                </motion.div>

                {/* RIGHT — TEXT */}
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="space-y-6"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
                        INDEP –
                        <span className="text-blue-600 text-sm"> Inter Departmental Cultural Events</span>
                    </h2>

                    <p className="text-lg text-gray-600 leading-relaxed">
                        For every Josephite, INDEP is an event which is ever cherishing and memorable
                        in his/her life. INDEP is expanded as <span className="font-semibold text-blue-600">
                            Inter Departmental Cultural Events</span>. It is a cultural extravaganza where
                        more than <span className="font-semibold text-blue-600">1500 students</span> take
                        part in various cultural and literary events.
                    </p>

                    <p className="text-lg text-gray-600 leading-relaxed">
                        It is organized by the students under the able guidance of professors — enabling
                        them to develop extracurricular, leadership, and organizing skills.
                    </p>

                    <p className="text-lg text-gray-600 leading-relaxed">
                        INDEP is conducted among the departments of both Shift I and Shift II to bring
                        out unity and healthy competition.
                    </p>
                </motion.div>

            </div>
        </section>
    );
}
