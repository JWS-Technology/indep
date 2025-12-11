"use client";

import { useEffect, useState, useMemo } from "react";
import {
    Search,
    Trophy,
    Users,
    AlertCircle,
    Trash2,
    Sparkles,
    LayoutList,
    AlertTriangle,
    BadgeAlert
} from "lucide-react";

interface Contestant {
    contestantName: string;
    dNo: string;
    _id: string;
}

interface OnstageReg {
    _id: string;
    teamId: string;
    teamName: string;
    eventName: string;
    contestants: Contestant[];
}

export default function OnstageTeamDashboard({
    teamId,
    teamName,
}: {
    teamId: string;
    teamName: string;
}) {
    const [loading, setLoading] = useState(true);
    const [registrations, setRegistrations] = useState<OnstageReg[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Fetch Data
    useEffect(() => {
        if (!teamId) return;

        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await fetch(`/api/onstage/registrations/${teamId}`);
                if (!res.ok) throw new Error("Failed to load data");

                const data = await res.json();
                setRegistrations(data.registrations ?? []);
            } catch (err: any) {
                setError(err?.message ?? "Failed to fetch data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [teamId]);

    // Duplicate Detection
    const signatureToIds = useMemo(() => {
        const map = new Map<string, string[]>();

        for (const r of registrations) {
            const dnos = (r.contestants || [])
                .map((c) => (c.dNo || "").toLowerCase())
                .sort();

            const sig = `${r.eventName.toLowerCase()}::${dnos.join("|")}`;
            const arr = map.get(sig) ?? [];
            arr.push(r._id);
            map.set(sig, arr);
        }

        return map;
    }, [registrations]);

    const duplicateIds = useMemo(() => {
        const set = new Set<string>();
        for (const [, ids] of signatureToIds) {
            if (ids.length > 1) ids.forEach((id) => set.add(id));
        }
        return set;
    }, [signatureToIds]);

    // Delete Handler
    const deleteRegistration = async (regId: string) => {
        if (!duplicateIds.has(regId)) {
            alert("This registration cannot be deleted (not a duplicate).");
            return;
        }

        const ok = confirm("Delete this duplicate registration?");
        if (!ok) return;

        try {
            setDeletingId(regId);

            const res = await fetch(`/api/onstage/registrations/${teamId}/${regId}`, {
                method: "DELETE",
            });

            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data?.message ?? "Failed to delete");
            }

            setRegistrations((prev) => prev.filter((r) => r._id !== regId));
        } catch (err: any) {
            alert(err?.message ?? "Delete failed");
        } finally {
            setDeletingId(null);
        }
    };

    // Search Filter
    const filtered = useMemo(() => {
        const q = searchQuery.toLowerCase().trim();
        if (!q) return registrations;

        return registrations.filter(
            (r) =>
                r.eventName.toLowerCase().includes(q) ||
                r.contestants.some(
                    (c) =>
                        c.contestantName.toLowerCase().includes(q) ||
                        c.dNo.toLowerCase().includes(q)
                )
        );
    }, [registrations, searchQuery]);

    return (
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-500">
            {/* HEADER SECTION */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 bg-gradient-to-r from-white to-slate-50 p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
                <div className="space-y-3 w-full lg:w-auto">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200 text-white shrink-0">
                            <Trophy size={20} strokeWidth={2.5} />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
                            On-Stage Events
                        </h2>
                    </div>
                    <p className="text-slate-500 text-sm font-medium flex flex-wrap items-center gap-2 pl-0 sm:pl-14">
                        <span className="hidden sm:inline">Managing</span>
                        <span className="text-indigo-600 font-semibold">{teamName}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300 mx-1 hidden sm:block"></span>
                        <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md text-slate-600">
                            <Users size={12} />
                            <span className="font-bold">{registrations.length}</span> Total
                        </span>
                    </p>
                </div>

                <div className="relative w-full lg:w-96 group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                    <input
                        className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all shadow-sm text-sm"
                        placeholder="Search event, name or D-No..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* ERROR STATE */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-700 shadow-sm animate-in slide-in-from-top-2">
                    <AlertCircle className="shrink-0" size={20} />
                    <span className="font-medium text-sm break-words">{error}</span>
                </div>
            )}

            {/* MAIN CONTENT AREA */}
            <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden">
                {/* LOADING STATE */}
                {loading && (
                    <div className="p-6 sm:p-8 space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex gap-4 animate-pulse">
                                <div className="h-14 w-14 sm:h-16 sm:w-16 bg-slate-100 rounded-xl shrink-0"></div>
                                <div className="flex-1 space-y-2 py-2">
                                    <div className="h-4 bg-slate-100 rounded w-3/4 sm:w-1/4"></div>
                                    <div className="h-3 bg-slate-100 rounded w-1/2 sm:w-1/3"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* EMPTY STATE */}
                {!loading && filtered.length === 0 && (
                    <div className="py-16 sm:py-20 flex flex-col items-center justify-center text-center px-4">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <Sparkles className="text-slate-300" size={32} />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900">No events found</h3>
                        <p className="text-slate-500 max-w-sm mt-1 text-sm">
                            We couldn't find any registrations matching your search criteria.
                        </p>
                    </div>
                )}

                {/* TABLE (DESKTOP) & CARDS (MOBILE) */}
                {!loading && filtered.length > 0 && (
                    <>
                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        <th className="px-8 py-4 w-1/3 min-w-[250px]">Event Details</th>
                                        <th className="px-8 py-4 min-w-[300px]">Participants</th>
                                        <th className="px-8 py-4 text-right w-[150px]">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filtered.map((r) => (
                                        <DesktopRow
                                            key={r._id}
                                            data={r}
                                            isDeletable={duplicateIds.has(r._id)}
                                            onDelete={() => deleteRegistration(r._id)}
                                            deleting={deletingId === r._id}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile List View */}
                        <div className="md:hidden bg-slate-50/50 p-3 sm:p-4 space-y-3 sm:space-y-4">
                            {filtered.map((r) => (
                                <MobileCard
                                    key={r._id}
                                    data={r}
                                    isDeletable={duplicateIds.has(r._id)}
                                    onDelete={() => deleteRegistration(r._id)}
                                    deleting={deletingId === r._id}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* FOOTER SUMMARY */}
            {!loading && (
                <div className="flex justify-center pb-4">
                    <p className="text-xs text-slate-400 font-medium flex items-center gap-2">
                        <LayoutList size={12} />
                        Showing {filtered.length} of {registrations.length} registrations
                    </p>
                </div>
            )}
        </div>
    );
}

// ================== SUB COMPONENTS ==================

function DesktopRow({
    data,
    isDeletable,
    onDelete,
    deleting,
}: {
    data: OnstageReg;
    isDeletable: boolean;
    onDelete: () => void;
    deleting: boolean;
}) {
    return (
        <tr className={`group transition-colors ${deleting ? "bg-red-50" : "hover:bg-slate-50/80"}`}>
            <td className="px-8 py-6 align-top">
                <div className="flex flex-col gap-1">
                    <span className="font-bold text-slate-800 text-base">{data.eventName}</span>
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                        {data.teamName}
                    </span>
                    {isDeletable && (
                        <span className="mt-2 inline-flex w-fit items-center gap-1 px-2 py-1 rounded-md bg-amber-50 text-amber-700 text-[10px] font-bold uppercase border border-amber-100">
                            <BadgeAlert size={12} /> Duplicate
                        </span>
                    )}
                </div>
            </td>

            <td className="px-8 py-6 align-top">
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                    {data.contestants.map((c) => (
                        <MiniParticipant
                            key={c._id}
                            name={c.contestantName}
                            dNo={c.dNo}
                        />
                    ))}
                </div>
            </td>

            <td className="px-8 py-6 align-top text-right">
                {isDeletable ? (
                    <button
                        onClick={onDelete}
                        disabled={deleting}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium border bg-white text-rose-600 border-rose-200 shadow-sm hover:bg-rose-50 hover:border-rose-300 hover:text-rose-700 hover:shadow transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                    >
                        {deleting ? (
                            <>
                                <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 size={14} /> Remove Duplicate
                            </>
                        )}
                    </button>
                ) : (
                    <div className="text-slate-300 flex justify-end items-center h-full pt-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                    </div>
                )}
            </td>
        </tr>
    );
}

function MobileCard({
    data,
    isDeletable,
    onDelete,
    deleting,
}: {
    data: OnstageReg;
    isDeletable: boolean;
    onDelete: () => void;
    deleting: boolean;
}) {
    return (
        <div className={`relative bg-white p-4 sm:p-5 rounded-2xl border shadow-sm transition-all ${isDeletable ? "border-amber-200 shadow-amber-50" : "border-slate-200"}`}>
            {isDeletable && (
                <div className="absolute top-0 right-0 p-0">
                    <div className="bg-amber-100 text-amber-700 text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl border-b border-l border-amber-200 flex items-center gap-1">
                        <AlertTriangle size={10} /> DUPLICATE
                    </div>
                </div>
            )}

            <div className="space-y-4">
                <div className="pr-10"> {/* Add padding right to avoid overlap with Duplicate badge */}
                    <h3 className="font-bold text-slate-900 text-lg leading-tight">{data.eventName}</h3>
                    <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wide truncate">{data.teamName}</p>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                    {/* Grid-cols-1 on very small, grid-cols-2 on larger mobiles */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {data.contestants.map((c) => (
                            <MiniParticipant key={c._id} name={c.contestantName} dNo={c.dNo} />
                        ))}
                    </div>
                </div>

                {isDeletable && (
                    <button
                        onClick={onDelete}
                        disabled={deleting}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors active:scale-[0.98]"
                    >
                        {deleting ? "Deleting..." : "Delete Registration"}
                    </button>
                )}
            </div>
        </div>
    );
}

function MiniParticipant({ name, dNo }: { name: string; dNo: string }) {
    const colors = [
        "bg-blue-100 text-blue-700",
        "bg-indigo-100 text-indigo-700",
        "bg-purple-100 text-purple-700",
        "bg-emerald-100 text-emerald-700",
        "bg-orange-100 text-orange-700",
    ];
    const charCode = name.charCodeAt(0) || 0;
    const colorClass = colors[charCode % colors.length];

    return (
        <div className="flex items-center gap-3 group">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${colorClass}`}>
                {name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-slate-700 truncate group-hover:text-slate-900 transition-colors">
                    {name}
                </div>
                <div className="text-[11px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded w-fit mt-0.5">
                    {dNo}
                </div>
            </div>
        </div>
    );
}