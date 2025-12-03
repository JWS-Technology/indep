"use client";

import React, { useEffect, useState } from "react";

export default function Page() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // track which eventId is being updated (saving state)
    const [savingFor, setSavingFor] = useState<Record<string, boolean>>({});
    // per-event error messages
    const [rowError, setRowError] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch("/api/events");
                if (!res.ok) throw new Error("Failed to fetch events");

                const data = await res.json();
                const eventList = data.events ?? data; // adapt to API shape
                setEvents(Array.isArray(eventList) ? eventList : []);
            } catch (err: any) {
                setError(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);



    // helper to interpret openRegistration value robustly
    const isOpenValue = (val: any) => val === true || val === "true" || val === 1 || val === "1";

    const handleToggle = async (eventId: string, newValue: boolean) => {
        setRowError((r) => ({ ...r, [eventId]: "" }));
        setSavingFor((s) => ({ ...s, [eventId]: true }));

        try {
            const res = await fetch("/api/open-registration", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    eventId,
                    openRegistration: newValue, // true if open, false if closed
                }),
            });

            if (!res.ok) {
                const text = await res.text().catch(() => "");
                throw new Error(text || `Request failed (${res.status})`);
            }

            // Update local state
            setEvents((prev) =>
                prev.map((ev) =>
                    String(ev._id ?? ev.id) === String(eventId)
                        ? { ...ev, openRegistration: newValue }
                        : ev
                )
            );
        } catch (err: any) {
            console.error(err);
            setRowError((r) => ({ ...r, [eventId]: err.message ?? "Update failed" }));
        } finally {
            setSavingFor((s) => ({ ...s, [eventId]: false }));
        }
    };


    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch("/api/events");
                if (!res.ok) throw new Error("Failed to fetch events");

                const data = await res.json();
                let eventList = data.events ?? data;

                // ✅ Sort alphabetically by event.title (case-insensitive)
                eventList = Array.isArray(eventList)
                    ? eventList.sort((a, b) =>
                        (a.title ?? "").toLowerCase().localeCompare((b.title ?? "").toLowerCase())
                    )
                    : [];

                setEvents(eventList);
            } catch (err: any) {
                setError(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);


    if (loading) return <div className="p-4">Loading events...</div>;
    if (error) return <div className="p-4 text-red-600">{error}</div>;

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4">Events</h1>

            {events.length === 0 ? (
                <p>No events found.</p>
            ) : (
                <ul className="space-y-3">
                    {events.map((event: any) => {
                        const id = event._id ?? event.id ?? String(event);
                        const isOpen = isOpenValue(event.openRegistration);
                        const saving = Boolean(savingFor[id]);
                        const errMsg = rowError[id];

                        return (
                            <li
                                key={id}
                                className="p-4 bg-white rounded-md border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                            >
                                <div className="flex-1">
                                    <div className="font-semibold text-gray-800">
                                        {event.title ?? event.eventName ?? "Untitled Event"}
                                    </div>
                                    <div className="text-sm text-gray-500 mt-1">Category: {event.category ?? "—"}</div>
                                    <div className="text-xs text-gray-400 mt-1">ID: {id}</div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <label className="text-sm text-gray-600">Registration:</label>

                                    <select
                                        value={isOpen ? "open" : "closed"}
                                        onChange={(e) => {
                                            const val = e.target.value === "open"; // "open" → true, "closed" → false
                                            handleToggle(id, val);
                                        }}
                                        disabled={saving}
                                        className="py-2 px-3 border rounded-md bg-white"
                                    >
                                        <option value="open">Open</option>
                                        <option value="closed">Closed</option>
                                    </select>

                                    {saving && <div className="text-sm text-indigo-600">Saving…</div>}
                                </div>

                                {errMsg && <div className="w-full text-sm text-red-600 mt-2 sm:mt-0 sm:ml-4">{errMsg}</div>}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
