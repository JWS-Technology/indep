"use client";

import { useEffect, useState, useMemo } from "react";
import {
    Search,
    Calendar,
    Users,
    User,
    Trophy,
    LayoutDashboard,
    Hash,
    Sparkles,
    Clock,
    Smartphone,
    Monitor,
    AlertCircle
} from "lucide-react";

// --- Types ---
interface OffstageReg {
    _id: string;
    eventName: string;
    contestantName: string;
    dNo: string;
    secondContestantName?: string;
    secondDno?: string;
    createdAt: string;
    lotNo?: string;
}

interface LotResponse {
    lot: { lot_number: string } | null;
}

const LOT_API_URL = "/api/get-lot";

export default function OffstageTeamDashboard({
    teamId,
    teamName,
}: {
    teamId: string;
    teamName: string;
}) {
    const [loading, setLoading] = useState(true);
    const [registrations, setRegistrations] = useState<OffstageReg[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    // 1. Mobile Detection
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // 2. Data Fetching (Registrations + Lots)
    useEffect(() => {
        if (!teamId) {
            setRegistrations([]);
            setLoading(false);
            return;
        }

        let mounted = true;

        const fetchRegistrationsAndLots = async () => {
            setLoading(true);
            setError(null);

            try {
                // A. Fetch Registrations
                const res = await fetch(`/api/offstage/registrations/${teamId}`);
                if (!res.ok) throw new Error(`Failed to load data`);

                const data = await res.json();
                const fetched: OffstageReg[] = (data.registrations || []).map((r: any) => ({
                    _id: r._id,
                    eventName: r.eventName,
                    contestantName: r.contestantName,
                    dNo: r.dNo,
                    secondContestantName: r.secondContestantName,
                    secondDno: r.secondDno,
                    createdAt: r.createdAt,
                    lotNo: undefined,
                }));

                // B. Fetch Lots in Parallel
                const uniqueEvents = Array.from(new Set(fetched.map((f) => f.eventName)));
                const eventToLotMap: Record<string, string | null> = {};

                await Promise.all(
                    uniqueEvents.map(async (eventName) => {
                        try {
                            const lotRes = await fetch(LOT_API_URL, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ teamId, eventName }),
                            });

                            if (!lotRes.ok) {
                                eventToLotMap[eventName] = null;
                                return;
                            }

                            const lotData: LotResponse = await lotRes.json();
                            eventToLotMap[eventName] = lotData?.lot?.lot_number ?? null;
                        } catch (e) {
                            console.error("Lot fetch error", e);
                            eventToLotMap[eventName] = null;
                        }
                    })
                );

                // C. Merge Data
                const withLots = fetched.map((r) => ({
                    ...r,
                    lotNo: eventToLotMap[r.eventName] ?? "N/A",
                }));

                if (mounted) setRegistrations(withLots);

            } catch (err: any) {
                if (mounted) {
                    setError(err.message || "Failed to fetch data");
                    setRegistrations([]);
                }
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchRegistrationsAndLots();
        return () => { mounted = false; };
    }, [teamId]);

    // 3. Filtering
    const filteredRegistrations = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return registrations;
        return registrations.filter((r) =>
            r.eventName.toLowerCase().includes(q) ||
            r.contestantName.toLowerCase().includes(q) ||
            r.dNo.toLowerCase().includes(q) ||
            (r.lotNo || "").toLowerCase().includes(q)
        );
    }, [registrations, searchQuery]);

    const formatDate = (date: string) =>
        new Date(date).toLocaleString("en-IN", {
            day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
        });

    // --- Render ---
    return (
        <div className="space-y-6">
            {/* HEADER SECTION - Standalone Card */}
            <div className="flex flex-col md:flex-row gap-6 justify-between items-end bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="w-full md:w-auto">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <span className="p-2 bg-indigo-600 rounded-lg text-white">
                            <Trophy className="w-5 h-5" />
                        </span>
                        Offstage Events
                    </h2>
                    <div className="flex items-center justify-between mt-2">
                        <p className="text-gray-500 text-sm flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-500" />
                            Managing <span className="font-semibold text-gray-900">{registrations.length}</span> entries
                        </p>
                        {/* Mobile View Toggle Indicator */}
                        <div className="md:hidden flex items-center gap-1 text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">
                            {isMobile ? <Smartphone size={12} /> : <Monitor size={12} />}
                            {isMobile ? "Card View" : "Table View"}
                        </div>
                    </div>
                </div>

                {/* Search Input */}
                <div className="relative w-full md:w-80 group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search event, D-No or Lot..."
                        className="pl-10 pr-4 py-3 w-full text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* CONTENT AREA - No Outer White Box (Fixes the Box-in-Box issue) */}
            <div className="min-h-[300px]">
                {error ? (
                    <div className="p-12 text-center bg-red-50 rounded-xl border border-red-100 text-red-600 flex flex-col items-center">
                        <AlertCircle className="w-10 h-10 mb-2" />
                        <p>{error}</p>
                    </div>
                ) : loading ? (
                    <TableSkeleton isMobile={isMobile} />
                ) : filteredRegistrations.length === 0 ? (
                    <EmptyState searchQuery={searchQuery} />
                ) : (
                    <>
                        {/* DESKTOP VIEW: Floating Rows Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-sm text-left border-separate border-spacing-y-4">
                                <thead className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                                    <tr>
                                        {/* Added PL-8 to align with card content */}
                                        <th className="px-6 pl-8 py-2">Event Information</th>
                                        <th className="px-6 py-2">Lot No</th>
                                        <th className="px-6 py-2">Participants</th>
                                        <th className="px-6 pr-8 py-2 text-right">Registered</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRegistrations.map((r) => (
                                        <DesktopRow key={r._id} data={r} formatDate={formatDate} />
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* MOBILE VIEW: Cards */}
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

function DesktopRow({ data, formatDate }: { data: OffstageReg; formatDate: (d: string) => string }) {
    return (
        <tr className="bg-white shadow-sm hover:shadow-md transition-all duration-200 group rounded-xl border border-transparent hover:border-indigo-100">

            {/* Column 1: Event Info */}
            <td className="px-6 py-5 rounded-l-xl border-y border-l border-gray-100 group-hover:border-indigo-100">
                <div className="flex items-start gap-3">
                    <div className="mt-1 p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                        <LayoutDashboard size={18} />
                    </div>
                    <div>
                        <div className="font-bold text-gray-900 text-base">{data.eventName}</div>
                        <div className="flex items-center gap-1 mt-1">
                            <span className="text-xs text-gray-400 font-mono">
                                ID: {data._id.slice(-6).toUpperCase()}
                            </span>
                        </div>
                    </div>
                </div>
            </td>

            {/* Column 2: Lot Number (New) */}
            <td className="px-6 py-5 border-y border-gray-100 group-hover:border-indigo-100">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400">
                        <Hash size={14} />
                    </div>
                    <span className="text-lg font-bold text-gray-700">
                        {data.lotNo && data.lotNo !== "N/A" ? data.lotNo : "--"}
                    </span>
                </div>
            </td>

            {/* Column 3: Participants */}
            <td className="px-6 py-5 border-y border-gray-100 group-hover:border-indigo-100">
                <div className="flex flex-col gap-3">
                    <ParticipantRow name={data.contestantName} dNo={data.dNo} color="indigo" />
                    {data.secondContestantName && (
                        <ParticipantRow
                            name={data.secondContestantName}
                            dNo={data.secondDno || ""}
                            color="purple"
                        />
                    )}
                </div>
            </td>

            {/* Column 4: Time */}
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

function MobileCard({ data, formatDate }: { data: OffstageReg; formatDate: (d: string) => string }) {
    return (
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4 relative overflow-hidden">
            {/* Decorative accent */}
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>

            {/* Card Header with Lot Badge */}
            <div className="flex justify-between items-start pl-2">
                <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg">{data.eventName}</h3>
                    <span className="text-xs text-gray-400 font-mono">
                        ID: {data._id.slice(-6).toUpperCase()}
                    </span>
                </div>
                {/* Lot Badge */}
                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">LOT</span>
                    <div className="bg-indigo-50 text-indigo-700 font-bold px-3 py-1 rounded-lg border border-indigo-100 text-lg">
                        {data.lotNo && data.lotNo !== "N/A" ? data.lotNo : "-"}
                    </div>
                </div>
            </div>

            <div className="h-px bg-gray-100 w-full" />

            {/* Participants */}
            <div className="space-y-3 pl-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Participants</p>
                <div className="space-y-2">
                    <ParticipantRow name={data.contestantName} dNo={data.dNo} color="indigo" />
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
                <span className="text-green-600 font-medium bg-green-50 px-2 py-1 rounded-md">
                    Confirmed
                </span>
            </div>
        </div>
    );
}

function ParticipantRow({ name, dNo, color }: { name: string; dNo: string; color: "indigo" | "purple" }) {
    const styles = {
        indigo: { bg: "bg-indigo-100", text: "text-indigo-700" },
        purple: { bg: "bg-fuchsia-100", text: "text-fuchsia-700" },
    };
    const theme = styles[color];

    return (
        <div className="flex items-center gap-3">
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
                    ? `We couldn't find any entries matching "${searchQuery}".`
                    : "Your team hasn't registered for any offstage events yet."}
            </p>
        </div>
    );
}

function TableSkeleton({ isMobile }: { isMobile: boolean }) {
    if (isMobile) {
        return (
            <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-xl p-5 border border-gray-100 space-y-4">
                        <div className="flex justify-between">
                            <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-8 bg-gray-200 rounded w-10"></div>
                        </div>
                        <div className="h-12 bg-gray-100 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    </div>
                ))}
            </div>
        );
    }
    return (
        <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white h-24 rounded-xl border border-gray-100 shadow-sm flex items-center p-6 gap-6">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-3 bg-gray-100 rounded w-1/4"></div>
                    </div>
                    <div className="w-20 h-8 bg-gray-100 rounded-lg"></div>
                    <div className="w-32 h-8 bg-gray-100 rounded-full"></div>
                </div>
            ))}
        </div>
    );
}