"use client";

import { useEffect, useState, useMemo } from "react";
import { Search, Calendar, Users, User, Trophy, LayoutDashboard } from "lucide-react";

interface OffstageReg {
    _id: string;
    eventName: string;
    contestantName: string;
    dNo: string;
    // Added optional fields referenced in logic
    secondContestantName?: string;
    secondDno?: string;
    createdAt: string;
}

export default function OffstageTeamDashboard({ teamId, teamName }: { teamId: string, teamName: string }) {
    const [loading, setLoading] = useState(true);
    const [registrations, setRegistrations] = useState<OffstageReg[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetch(`/api/offstage/registrations/${teamId}`)
            .then(res => res.json())
            .then(data => {
                setRegistrations(data.registrations || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [teamId]);

    // Filter logic
    const filteredRegistrations = useMemo(() => {
        return registrations.filter((r) =>
            r.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.contestantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.dNo.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [registrations, searchQuery]);

    const formatDate = (date: string) =>
        new Date(date).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit"
        });

    return (
        <div className="max-w-6xl mx-auto space-y-8 p-4 md:p-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                        <LayoutDashboard className="w-8 h-8 text-indigo-600" />
                        Offstage Dashboard
                    </h1>
                    <p className="text-gray-500 mt-1 flex items-center gap-2">
                        Managing registrations for <span className="font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">{teamName}</span>
                    </p>
                </div>

                {/* Stat Card */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4 min-w-[200px]">
                    <div className="p-3 bg-indigo-100 rounded-full text-indigo-600">
                        <Trophy size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Entries</p>
                        <p className="text-2xl font-bold text-gray-900">
                            {loading ? "..." : registrations.length}
                        </p>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search event, contestant or D-No..."
                    className="pl-10 pr-4 py-3 w-full md:w-96 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <TableSkeleton />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4">Event Details</th>
                                    <th className="px-6 py-4">Participants</th>
                                    <th className="px-6 py-4">Registration Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredRegistrations.length > 0 ? (
                                    filteredRegistrations.map((r) => (
                                        <tr key={r._id} className="hover:bg-indigo-50/30 transition-colors group">
                                            <td className="px-6 py-4 align-top">
                                                <div className="font-semibold text-gray-900 text-base">{r.eventName}</div>
                                                <div className="text-xs text-gray-400 mt-1 font-mono uppercase tracking-wider">
                                                    ID: {r._id.slice(-6)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 align-top">
                                                <div className="space-y-3">
                                                    {/* Contestant 1 */}
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700">
                                                            <User size={16} />
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-gray-900">{r.contestantName}</div>
                                                            <div className="text-xs text-gray-500 bg-gray-100 inline-block px-1.5 rounded mt-0.5">
                                                                {r.dNo}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Contestant 2 (if exists) */}
                                                    {r.secondContestantName && (
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700">
                                                                <Users size={16} />
                                                            </div>
                                                            <div>
                                                                <div className="font-medium text-gray-900">{r.secondContestantName}</div>
                                                                <div className="text-xs text-gray-500 bg-gray-100 inline-block px-1.5 rounded mt-0.5">
                                                                    {r.secondDno}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 align-top">
                                                <div className="flex items-center gap-2 text-gray-500">
                                                    <Calendar size={16} />
                                                    <span>{formatDate(r.createdAt)}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center text-gray-400">
                                                <Search size={48} className="mb-4 opacity-20" />
                                                <p className="text-lg font-medium text-gray-900">No registrations found</p>
                                                <p className="text-sm">
                                                    {searchQuery ? `No results for "${searchQuery}"` : "This team hasn't registered for any events yet."}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

// Sub-component for Skeleton Loading state
function TableSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="h-12 bg-gray-100 border-b border-gray-200"></div>
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex border-b border-gray-100 p-6">
                    <div className="w-1/3 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-100 rounded w-1/4"></div>
                    </div>
                    <div className="w-1/3 space-y-3">
                        <div className="flex gap-3">
                            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                            <div className="space-y-2 flex-1">
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-3 bg-gray-100 rounded w-1/4"></div>
                            </div>
                        </div>
                    </div>
                    <div className="w-1/3">
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}