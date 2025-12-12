"use client";

import { useEffect, useState } from "react";
import { Search, Loader2, Users, Calendar, AlertCircle } from "lucide-react";

export default function OnStageAttendancePage() {
    const [events, setEvents] = useState<string[]>([]);
    const [eventName, setEventName] = useState("");
    const [records, setRecords] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");

    // Load event list
    useEffect(() => {
        fetch("/api/get-events-on")
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setEvents(data.events);


                }
            });


    }, []);
    console.log(events)
    // Load attendance when event changes
    useEffect(() => {
        if (!eventName) return;

        setLoading(true);
        fetch("/api/onstage/get-attendance-on", {
            method: "POST",
            body: JSON.stringify({ eventName }),
        })
            .then((res) => res.json())
            .then((data) => setRecords(data.attendance || []))
            .finally(() => setLoading(false));
    }, [eventName]);

    const filtered = records.filter((r) => {
        const q = search.toLowerCase();
        return (
            r.contestantName?.toLowerCase().includes(q) ||
            r.teamName?.toLowerCase().includes(q) ||
            r.dNo?.toLowerCase().includes(q) ||
            r.lotNumber?.toLowerCase().includes(q)
        );
    });

    const statusColor = (s: string) => {
        switch (s) {
            case "PRESENT":
                return "text-emerald-600 bg-emerald-100";
            case "ABSENT":
                return "text-red-600 bg-red-100";
            case "MALPRACTICE":
                return "text-amber-700 bg-amber-100";
            default:
                return "text-gray-600 bg-gray-200";
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
                <Calendar className="text-indigo-600" /> On-Stage Attendance
            </h1>

            {/* Event Picker */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <select
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    className="border p-3 rounded-lg"
                >
                    <option value="">Select Event</option>
                    {events.map((e, i) => (
                        <option key={i} value={e}>
                            {e}
                        </option>
                    ))}
                </select>

                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search contestant / team / D-No"
                        className="w-full pl-10 pr-3 p-3 border rounded-lg"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Loading */}
            {loading && (
                <div className="text-center py-10">
                    <Loader2 className="animate-spin text-gray-400 mx-auto" size={32} />
                    <p className="text-gray-600 mt-2">Loading attendance...</p>
                </div>
            )}

            {/* No event selected */}
            {!loading && !eventName && (
                <p className="text-center text-gray-500 py-10">
                    Please select an event to view attendance.
                </p>
            )}

            {/* No data */}
            {eventName && !loading && filtered.length === 0 && (
                <p className="text-center text-gray-500 py-10">
                    No attendance records found.
                </p>
            )}

            {/* Table */}
            {filtered.length > 0 && (
                <table className="w-full border rounded-lg overflow-hidden bg-white">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-3 text-left text-sm font-semibold">Contestant</th>
                            <th className="p-3 text-left text-sm font-semibold">Team</th>
                            <th className="p-3 text-left text-sm font-semibold">D-No</th>
                            <th className="p-3 text-left text-sm font-semibold">Lot</th>
                            <th className="p-3 text-left text-sm font-semibold">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((r, i) => (
                            <tr key={i} className="border-b hover:bg-gray-50">
                                <td className="p-3">{r.contestantName}</td>
                                <td className="p-3">
                                    <p className="font-medium text-gray-900">{r.teamName}</p>
                                    <p className="text-xs text-gray-500">{r.teamId}</p>
                                </td>
                                <td className="p-3">{r.dNo}</td>
                                <td className="p-3 font-medium text-indigo-600">{r.lotNumber}</td>
                                <td className="p-3">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(
                                            r.status
                                        )}`}
                                    >
                                        {r.status || "PENDING"}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
