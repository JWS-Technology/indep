"use client";
import React from "react";
// Using Lucide icons for a modern look
import { Calendar, Zap, Lightbulb } from 'lucide-react';

const events = [
    { id: 1, title: "Poetry Writing - English", icon: <Lightbulb className="w-6 h-6 text-pink-500" />, color: "bg-pink-100", hoverColor: "ring-pink-500/50", detail: "Creative arts competition focusing on linguistic rhythm and expression." },
    { id: 2, title: "Tech Quiz - Intercollege", icon: <Zap className="w-6 h-6 text-blue-500" />, color: "bg-blue-100", hoverColor: "ring-blue-500/50", detail: "Fast-paced general knowledge quiz covering technology and science topics." },
   
];

export default function Page() {
    return (
        <div className=" bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-8 font-inter">
            <header className="text-center mb-12 max-w-2xl">
                <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-3">
                    Select Events
                </h1>
                <p className="text-xl text-gray-600">
                    Discover and manage the creative and technical competitions.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">
                
                {events.map((event, index) => (
                    <a
                        key={index}
                        href={`/events/${event.id}`} // Example link to the event details
                        className={`
                            group relative
                            bg-white 
                            rounded-3xl 
                            shadow-xl 
                            p-6 sm:p-8
                            border border-gray-100
                            transition-all duration-300 ease-in-out 
                            hover:shadow-2xl 
                            hover:ring-8 
                            hover:ring-opacity-40
                            ${event.hoverColor} 
                            transform hover:-translate-y-1
                            focus:outline-none focus:ring-4
                        `}
                    >
                        {/* Event Icon/Pill */}
                        <div className={`
                            w-12 h-12 
                            rounded-full 
                            ${event.color} 
                            flex items-center justify-center 
                            mb-4 
                            group-hover:scale-110 
                            transition-transform duration-300
                            shadow-md
                        `}>
                            {event.icon}
                        </div>

                        <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition duration-300">
                            {event.title}
                        </h2>

                        <p className="text-sm text-gray-500 mb-6">
                            {event.detail}
                        </p>

                        {/* Call to Action Button/Link */}
                        <div className="absolute bottom-6 right-6">
                            <span 
                                className={`
                                    inline-flex items-center px-4 py-2 
                                    text-sm font-semibold 
                                    text-white 
                                    bg-indigo-600 
                                    rounded-full 
                                    shadow-lg 
                                    shadow-indigo-500/50 
                                    transition-all duration-300
                                    group-hover:bg-indigo-700
                                `}
                            >
                                Register
                                <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </span>
                        </div>
                    </a>
                ))}

            </div>
        </div>
    );
}