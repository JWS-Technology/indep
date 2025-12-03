"use client";
import React, { useEffect, useState } from "react";
// Using Lucide icons for a modern look
import { Calendar, Zap, Lightbulb, Mic, ArrowRight } from 'lucide-react';

function getIconByType(type: string = "") {
    switch (type.toLowerCase()) {
        case "music":
        case "singing":
        case "group song":
            return <Mic className="w-6 h-6 text-blue-500" />;

        case "workshop":
        case "talk":
            return <Lightbulb className="w-6 h-6 text-yellow-500" />;

        case "competition":
            return <Zap className="w-6 h-6 text-green-500" />;

        default:
            return <Calendar className="w-6 h-6 text-slate-500" />;
    }
}

interface EventItem {
    id?: string;
    _id?: string;
    eventId?: string;
    title?: string;
    name?: string;
    detail?: string;
    description?: string;
    type?: string;
    category?: string;
}

export default function Page() {
    const [events, setEvents] = useState<EventItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;
        async function load() {
            try {
                setLoading(true);
                const res = await fetch('/api/get-open-events');
                if (!res.ok) throw new Error(`Server error: ${res.status}`);
                const data = await res.json();
                // API might return { events: [...] } or an array directly
                let payload = Array.isArray(data) ? data : (data?.events ?? []);
                payload = payload.sort((a: EventItem, b: EventItem) => {
                    const titleA = (a?.title ?? a?.name ?? '').toLowerCase();
                    const titleB = (b?.title ?? b?.name ?? '').toLowerCase();
                    return titleA.localeCompare(titleB);
                });

                if (mounted) setEvents(payload);
            } catch (err: any) {
                if (mounted) setError(err.message ?? "Failed to load events");
            }

            finally {
                if (mounted) setLoading(false);
            }
        }
        load();
        return () => { mounted = false; };
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 font-inter">
            {/* Header Section */}
            <header className="text-center mb-10 max-w-2xl mx-auto">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
                    Select Events
                </h1>
                <p className="text-base sm:text-lg text-gray-600 max-w-lg mx-auto">
                    Register for events and submit your details for approval. You can check the status of your registrations on the dashboard.
                </p>
            </header>

            {/* Loading / Error */}
            {loading ? (
                <div className="py-20">
                    <div className="text-center text-gray-500">Loading events...</div>
                </div>
            ) : error ? (
                <div className="py-10 text-red-600">{error}</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
                    {events.map((event) => {
                        const id = event?.id ?? event?._id ?? event?.eventId;
                        const title = event?.title ?? event?.name ?? 'Untitled Event';
                        const detail = event?.detail ?? event?.description ?? '';
                        const type = event?.type ?? event?.category ?? '';

                        return (
                            <a
                                key={id}
                                href={`./registration/${id}`}
                                className={`group flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-200 p-6 transition-all duration-300 ease-in-out transform hover:-translate-y-1 cursor-pointer`}
                            >
                                {/* Top Section: Icon & Title */}
                                <div>
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 bg-blue-50`}>
                                        {getIconByType(type)}
                                    </div>

                                    <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                                        {title}
                                    </h2>

                                    <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                                        {detail}
                                    </p>
                                </div>

                                {/* Bottom Section: Button (Pushed to bottom using mt-auto) */}
                                <div className="mt-auto flex justify-end">
                                    <span className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-full shadow-md transition-colors duration-300 group-hover:bg-indigo-700">
                                        Register
                                        <ArrowRight className="ml-2 w-4 h-4" />
                                    </span>
                                </div>
                            </a>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
