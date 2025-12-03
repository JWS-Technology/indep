"use client";

import React, { useEffect, useState } from "react";
// Import necessary icons
import { Loader2, Zap, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export default function Page() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // track which eventId is being updated (saving state)
    const [savingFor, setSavingFor] = useState<Record<string, boolean>>({});
    // per-event error messages
    const [rowError, setRowError] = useState<Record<string, string>>({});

    // helper to interpret openRegistration value robustly
    const isOpenValue = (val: any) => val === true || val === "true" || val === 1 || val === "1";

    const fetchEvents = async () => {
        setLoading(true);
        setError("");
        try {
            // Simulate fetching data from /api/events
            const res = await fetch("/api/events"); 
            if (!res.ok) throw new Error("Failed to fetch events list");

            const data = await res.json();
            let eventList = data.events ?? data;

            // Sort alphabetically by event.title (case-insensitive)
            eventList = Array.isArray(eventList)
                ? eventList.sort((a, b) =>
                    (a.title ?? a.eventName ?? "").toLowerCase().localeCompare((b.title ?? b.eventName ?? "").toLowerCase())
                )
                : [];

            setEvents(eventList);
        } catch (err: any) {
            setError(err.message || "Failed to fetch events from API.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);


    const handleToggle = async (eventId: string, newValue: boolean) => {
        // Prevent toggle if it's already saving for this event
        if (savingFor[eventId]) return; 

        setRowError((r) => ({ ...r, [eventId]: "" }));
        setSavingFor((s) => ({ ...s, [eventId]: true }));

        try {
            // Simulate updating data to /api/open-registration
            const res = await fetch("/api/open-registration", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    eventId,
                    openRegistration: newValue, // true if open, false if closed
                }),
            });

            if (!res.ok) {
                const text = await res.text().catch(() => "Unknown error");
                // IMPORTANT: Revert optimistic update on failure
                // NOTE: The optimistic update is now done *after* a successful fetch, 
                // but if you prefer the old way, you'd manually revert here:
                // setEvents(prev => prev.map(ev => ev._id === eventId ? { ...ev, openRegistration: !newValue } : ev));
                throw new Error(text || `Request failed (${res.status})`);
            }

            // Optimistic update of local state ONLY ON SUCCESS
            // This prevents the toggle from visually flipping back immediately if the update fails.
            setEvents((prev) =>
                prev.map((ev) => {
                    const currentId = String(ev._id ?? ev.id);
                    return currentId === String(eventId)
                        ? { ...ev, openRegistration: newValue }
                        : ev;
                })
            );
        } catch (err: any) {
            console.error(err);
            setRowError((r) => ({ ...r, [eventId]: err.message ?? "Update failed" }));
        } finally {
            setSavingFor((s) => ({ ...s, [eventId]: false }));
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-xl text-indigo-600 font-semibold p-4 rounded-lg bg-white shadow-md flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" /> Fetching event data...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-10 font-sans">
            <header className="mb-10 max-w-4xl mx-auto">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
                    <Zap className="w-8 h-8 text-indigo-600" /> Manage Registration Status
                </h1>
                <p className="text-gray-600 mt-2">Control which events are currently accepting new registrations.</p>
                {error && (
                    <div className="mt-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-lg flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <span className="font-medium">Global Error:</span> {error}
                    </div>
                )}
            </header>

            <div className="max-w-4xl mx-auto">
                {events.length === 0 ? (
                    <div className="p-8 bg-white rounded-xl shadow-lg text-center text-gray-500">
                        <AlertTriangle className="w-10 h-10 mx-auto text-yellow-500 mb-3" />
                        <p className="font-semibold text-lg">No events found.</p>
                        <p className="text-sm">Please check your API endpoint `/api/events`.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {events.map((event: any) => {
                            const id = (event._id ?? event.id ?? String(event.title)) || 'unknown';
                            const isOpen = isOpenValue(event.openRegistration);
                            const saving = Boolean(savingFor[id]);
                            const errMsg = rowError[id];
                            const cardBg = isOpen ? 'border-green-300 bg-white hover:shadow-lg' : 'border-red-300 bg-white hover:shadow-lg';
                            const statusText = isOpen ? 'Open' : 'Closed';

                            return (
                                <div
                                    key={id}
                                    className={`p-5 rounded-xl border-l-4 shadow-md transition duration-200 ease-in-out ${cardBg}`}
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        {/* Event Details */}
                                        <div className="flex-1">
                                            <div className="font-bold text-lg text-gray-800">
                                                {event.title ?? event.eventName ?? "Untitled Event"}
                                            </div>
                                            <div className="text-sm text-gray-500 mt-1">Category: {event.category ?? "General"}</div>
                                            <div className="text-xs text-gray-400 mt-1 truncate">ID: {id}</div>
                                        </div>

                                        {/* Registration Status and Toggle - IMPROVED SECTION */}
                                        <div className="flex items-center gap-6 flex-shrink-0">
                                            {/* Status Badge */}
                                            <div className={`font-semibold text-sm py-1 px-3 rounded-full border ${isOpen ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'} flex items-center gap-1 min-w-[70px] justify-center`}>
                                                {isOpen ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                                {statusText}
                                            </div>

                                            {/* Toggle Switch */}
                                            <label className="flex items-center cursor-pointer relative">
                                                <input
                                                    type="checkbox"
                                                    checked={isOpen}
                                                    onChange={() => handleToggle(id, !isOpen)}
                                                    disabled={saving}
                                                    className="sr-only" // Hide the default checkbox
                                                />
                                                <div className={`w-14 h-8 flex items-center rounded-full p-1 transition duration-200 ${isOpen ? 'bg-green-500' : 'bg-gray-300'} ${saving ? 'opacity-60 cursor-not-allowed' : ''}`}>
                                                    <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-200 ${isOpen ? 'translate-x-6' : 'translate-x-0'} flex items-center justify-center`}>
                                                        {saving && <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />}
                                                    </div>
                                                </div>
                                                <span className={`ml-3 text-sm font-medium ${isOpen ? 'text-green-700' : 'text-gray-700'}`}>
                                                    {isOpen ? "Open" : "Closed"}
                                                </span>
                                            </label>
                                        </div>
                                        {/* End IMPROVED SECTION */}
                                    </div>

                                    {/* Row Error Message */}
                                    {errMsg && (
                                        <div className="mt-3 text-sm font-medium text-red-600 bg-red-50 p-2 rounded-md border border-red-200 flex items-center gap-1.5">
                                            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                                            Update Failed: {errMsg}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}