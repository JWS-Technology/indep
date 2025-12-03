"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { ChevronRight } from "lucide-react"; // Importing an icon for visual guidance

// --- Interface remains the same ---
export interface EventItem {
    _id: string;
    title: string;
    category: string;
    stageType: string;
    date: string;
    time: string;
    venue: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export default function Page() {
    const [events, setEvents] = useState<EventItem[]>([]); // Added type for clarity

    // --- useEffect remains the same ---
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                // Mocking event data to show the UI even if the API call fails
                
                const res = await axios.get("/api/events");
                setEvents(res.data.events); // Use API data, fallback to mock
            } catch (error) {
                console.error("Failed to load events:", error);
                // Fallback to mock data on error
            }
        };

        fetchEvents();
    }, []);

    // Helper to determine the link, using the event's ID as a placeholder
    const getEventLink = (eventId: string) => `/admin/lot/add-lot/${eventId}`;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 sm:p-10">
            {/* Title with improved weight and spacing */}
            <h1 className="text-4xl font-semibold mb-10 text-gray-900">
                Select an Event
            </h1>

            {/* Main list container - using flex for clean vertical stacking */}
            <div className="flex flex-col gap-4 w-full max-w-lg">
                {events.length > 0 ? (
                    events.map((event) => (
                        <Link
                            key={event._id}
                            href={getEventLink(event._id)}
                            // Apple-like styling: large radius, white background, subtle shadow, and hover effects
                            className="bg-white rounded-2xl p-4 sm:p-6 text-left shadow-lg 
                                       hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 ease-in-out 
                                       focus:outline-none focus:ring-4 focus:ring-blue-200 focus:ring-opacity-50
                                       flex justify-between items-center"
                        >
                            {/* Event Title */}
                            <span className="text-xl font-medium text-gray-800 tracking-tight">
                                {event.title}
                            </span>
                            
                            {/* Right Arrow Icon (Chevron) - common in iOS lists */}
                            <ChevronRight className="w-6 h-6 text-gray-400" />
                        </Link>
                    ))
                ) : (
                    <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
                        <p className="text-gray-500">Loading events...</p>
                    </div>
                )}
            </div>
        </div>
    );
}