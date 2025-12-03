"use client";
import React from "react";
// Using Lucide icons for a modern look
import { Calendar, Zap, Lightbulb, Mic, ArrowRight } from 'lucide-react';

const events = [
    { id: "692e66ab2c3c234db7c98b82", title: "Group Song (Indian)", icon: <Mic className="w-6 h-6 text-blue-500" />, color: "bg-blue-100", hoverColor: "ring-blue-500/50", detail: "Register your team for Group Singing (Indian)." },

];
export default function Page() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 font-inter">
            {/* Header Section */}
            <header className="text-center mb-10 max-w-2xl mx-auto">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
                    Select Events
                </h1>
                <p className="text-base sm:text-lg text-gray-600 max-w-lg mx-auto">
                    Register for events and submit your details for approval. You can check the status of your registrations on the dashboard. </p>
            </header>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
                {events.map((event, index) => (
                    <a
                        key={index}
                        href={`./registration/${event.id}`}
                        className={`
                            group 
                            flex flex-col 
                            bg-white 
                            rounded-2xl 
                            shadow-sm hover:shadow-xl 
                            border border-gray-200 ${event.hoverBorder}
                            p-6 
                            transition-all duration-300 ease-in-out 
                            transform hover:-translate-y-1
                            cursor-pointer
                        `}
                    >
                        {/* Top Section: Icon & Title */}
                        <div>
                            <div className={`
                                w-12 h-12 
                                rounded-xl 
                                ${event.color} 
                                flex items-center justify-center 
                                mb-4 
                                group-hover:scale-110 
                                transition-transform duration-300
                            `}>
                                {event.icon}
                            </div>

                            <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                                {event.title}
                            </h2>

                            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                                {event.detail}
                            </p>
                        </div>

                        {/* Bottom Section: Button (Pushed to bottom using mt-auto) */}
                        <div className="mt-auto flex justify-end">
                            <span className="
                                inline-flex items-center 
                                px-4 py-2 
                                text-sm font-semibold 
                                text-white 
                                bg-indigo-600 
                                rounded-full 
                                shadow-md 
                                transition-colors duration-300
                                group-hover:bg-indigo-700
                            ">
                                Register
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </span>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}