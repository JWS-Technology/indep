"use client";

import { useEffect, useState, useMemo } from "react";
import {
    Search,
    Calendar,
    Users,
    User,
    Trophy,
    LayoutDashboard,
    Clock,
    Sparkles,
    Hash
} from "lucide-react";

interface OffstageReg {
    _id: string;
    eventName: string;
    contestantName: string;
    dNo: string;
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
        <div className="space-y-6">
            {/* Header Section with Gradient Accent */}
            <div className="flex flex-col md:flex-row gap-6 justify-between items-end bg-gradient-to-r from-indigo-50 to-white p-6 rounded-2xl border border-indigo-100">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <span className="p-2 bg-indigo-600 rounded-lg text-white">
                            <Trophy className="w-5 h-5" />
                        </span>
                        Offstage Events
                    </h2>
                    <p className="text-gray-500 mt-2 text-sm flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        Managing <span className="font-semibold text-gray-900">{registrations.length}</span> active registrations
                    </p>
                </div>

                {/* Styled Search Input */}
                <div className="relative w-full md:w-80 group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search event, student or D-No..."
                        className="pl-10 pr-4 py-3 w-full text-sm bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none shadow-sm group-hover:shadow-md"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Content Area */}
            <div className="min-h-[300px]">
                {loading ? (
                    <DashboardSkeleton />
                ) : filteredRegistrations.length === 0 ? (
                    <EmptyState searchQuery={searchQuery} />
                ) : (
                    <>
                        {/* Desktop View: Modern Floating Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-sm text-left border-separate border-spacing-y-3">
                                <thead className="text-xs text-gray-400 uppercase tracking-wider font-semibold px-4">
                                    <tr>
                                        <th className="px-6 py-2">Event Information</th>
                                        <th className="px-6 py-2">Participants</th>
                                        <th className="px-6 py-2 text-right">Registration</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRegistrations.map((r) => (
                                        <DesktopRow key={r._id} data={r} formatDate={formatDate} />
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile View: Detailed Cards */}
                        <div className="md:hidden space-y-4">
                            {filteredRegistrations.map((r) => (
                                <MobileCard key={r._id} data={r} formatDate={formatDate} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

// --- Sub Components ---

function DesktopRow({ data, formatDate }: { data: OffstageReg, formatDate: (d: string) => string }) {
    return (
        <tr className="bg-white shadow-sm hover:shadow-md transition-all duration-200 group rounded-xl border border-transparent hover:border-indigo-100">
            <td className="px-6 py-5 rounded-l-xl border-y border-l border-gray-100 group-hover:border-indigo-100">
                <div className="flex items-start gap-3">
                    <div className="mt-1 p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                        <LayoutDashboard size={18} />
                    </div>
                    <div>
                        <div className="font-bold text-gray-900 text-base">{data.eventName}</div>
                        <div className="flex items-center gap-1 mt-1">
                            <Hash size={12} className="text-gray-400" />
                            <span className="text-xs text-gray-400 font-mono">
                                {data._id.slice(-6).toUpperCase()}
                            </span>
                        </div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-5 border-y border-gray-100 group-hover:border-indigo-100">
                <div className="flex flex-col gap-3">
                    <ParticipantRow
                        name={data.contestantName}
                        dNo={data.dNo}
                        color="indigo"
                    />
                    {data.secondContestantName && (
                        <ParticipantRow
                            name={data.secondContestantName}
                            dNo={data.secondDno || ""}
                            color="purple"
                        />
                    )}
                </div>
            </td>
            <td className="px-6 py-5 rounded-r-xl border-y border-r border-gray-100 group-hover:border-indigo-100 text-right">
                <div className="flex flex-col items-end gap-1">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Registered
                    </span>
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs mt-1">
                        <Clock size={12} />
                        <span>{formatDate(data.createdAt)}</span>
                    </div>
                </div>
            </td>
        </tr>
    );
}

function MobileCard({ data, formatDate }: { data: OffstageReg, formatDate: (d: string) => string }) {
    return (
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4 relative overflow-hidden">
            {/* Decorative accent */}
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>

            {/* Card Header */}
            <div className="flex justify-between items-start pl-2">
                <div>
                    <h3 className="font-bold text-gray-900 text-lg">{data.eventName}</h3>
                    <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-mono">
                            #{data._id.slice(-6).toUpperCase()}
                        </span>
                    </div>
                </div>
            </div>

            <div className="h-px bg-gray-100 w-full" />

            {/* Participants */}
            <div className="space-y-3 pl-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Participants</p>
                <div className="space-y-2">
                    <ParticipantRow
                        name={data.contestantName}
                        dNo={data.dNo}
                        color="indigo"
                    />
                    {data.secondContestantName && (
                        <ParticipantRow
                            name={data.secondContestantName}
                            dNo={data.secondDno || ""}
                            color="purple"
                        />
                    )}
                </div>
            </div>

            <div className="h-px bg-gray-100 w-full" />

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-gray-500 pl-2">
                <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{formatDate(data.createdAt)}</span>
                </div>
                <span className="text-green-600 font-medium bg-green-50 px-2 py-1 rounded-md">Confirmed</span>
            </div>
        </div>
    );
}

function ParticipantRow({ name, dNo, color }: { name: string, dNo: string, color: "indigo" | "purple" }) {
    const styles = {
        indigo: { bg: "bg-indigo-100", text: "text-indigo-700", icon: <User size={14} /> },
        purple: { bg: "bg-fuchsia-100", text: "text-fuchsia-700", icon: <Users size={14} /> },
    };

    const theme = styles[color];

    return (
        <div className="flex items-center gap-3">
            {/* Avatar Circle */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${theme.bg} ${theme.text} font-bold text-xs shadow-sm ring-2 ring-white`}>
                {name.charAt(0).toUpperCase()}
            </div>

            <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-800 leading-none">{name}</span>
                <span className="text-xs text-gray-500 mt-1">
                    D-No: <span className="font-mono text-gray-700 font-medium bg-gray-100 px-1 rounded">{dNo}</span>
                </span>
            </div>
        </div>
    );
}

function EmptyState({ searchQuery }: { searchQuery: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-2xl border border-gray-200 border-dashed">
            <div className="bg-indigo-50 p-4 rounded-full mb-4">
                <Search size={32} className="text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No registrations found</h3>
            <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
                {searchQuery
                    ? `We couldn't find any events or students matching "${searchQuery}". Try a different keyword.`
                    : "Your team hasn't registered for any offstage events yet. Once you do, they will appear here."}
            </p>
        </div>
    );
}

function DashboardSkeleton() {
    return (
        <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white h-24 rounded-xl border border-gray-100 shadow-sm flex items-center p-6 gap-6">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-3 bg-gray-100 rounded w-1/4"></div>
                    </div>
                    <div className="w-32 h-8 bg-gray-100 rounded-full"></div>
                </div>
            ))}
        </div>
    );
}