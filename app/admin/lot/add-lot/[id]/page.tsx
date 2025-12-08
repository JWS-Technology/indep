"use client";
import React, { useEffect, useState } from "react";
import { Loader2, Save, X, Zap } from 'lucide-react';
import { useRouter } from "next/navigation";



// Type definition for the final lot data structure
interface LotSubmission {
    lot: number;
    teamId: string;
    eventName: string;
    teamName?: string;
    theme: string;
}

export default function Page() {

    // --- State ---
    const [id, setId] = useState<string | null>(null);
    const [data, setData] = useState<any>(null);
    const [teams, setTeams] = useState<any[]>([]);
    const [eventName, seteventName] = useState("");
    const router = useRouter();

    useEffect(() => {
        if (!data?.event?.title) return;
        seteventName(data.event.title);
    }, [data?.event?.title]);

    const [selectedTeams, setSelectedTeams] = useState<Record<number, string>>({});
    const [themes, setThemes] = useState<Record<number, string>>({});
    const [consolidatedLots, setConsolidatedLots] = useState<LotSubmission[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");
    const [isSaving, setIsSaving] = useState(false);
    const [savingThemeFor, setSavingThemeFor] = useState<Record<number, boolean>>({});

    const totalLots = 28;

    // --- Helpers ---
    const getTeam = (identifier?: string | null) => {
        if (!identifier) return undefined;
        return teams.find((t) => {
            const candidates = [
                t.teamId,
                t._id,
                t.id,
                t.name,
            ].filter(Boolean).map(String);

            return candidates.includes(String(identifier));
        });
    };

    const getEventId = (): string | null => {
        try {
            const nextData = (window as any)?.__NEXT_DATA__;
            if (nextData?.props?.pageProps?.params?.id) {
                const p = nextData.props.pageProps.params.id;
                return Array.isArray(p) ? String(p[0]) : String(p);
            }

            const qp = new URL(window.location.href).searchParams.get("id");
            if (qp) return qp;

            const parts = window.location.pathname.split("/").filter(Boolean);
            if (parts.length) return parts[parts.length - 1];

        } catch (err) {
            console.error("Error determining event ID:", err);
        }
        return null;
    };

    // --- Fetch event & teams ---
    useEffect(() => {
        const resolvedId = getEventId();
        setId(resolvedId);

        if (!resolvedId) {
            setLoading(false);
            setError("Unable to determine event id from URL.");
            return;
        }

        let cancelled = false;

        const fetchAll = async () => {
            setLoading(true);
            setError("");

            try {
                // Fetch event
                const evRes = await fetch(`/api/events/${resolvedId}`);
                if (!evRes.ok) {
                    const text = await evRes.text().catch(() => "");
                    throw new Error(`Failed to fetch event ${text}`);
                }
                const evJson = await evRes.json();
                const eventObj = evJson?.event ?? evJson?.data ?? evJson;

                // Fetch teams
                const tRes = await fetch(`/api/team`);
                if (!tRes.ok) {
                    const text = await tRes.text().catch(() => "");
                    throw new Error(`Failed to fetch teams ${text}`);
                }

                const tJson = await tRes.json();
                const teamsArr = Array.isArray(tJson) ? tJson : (tJson?.teams ?? tJson?.data ?? tJson ?? []);

                // ------------------------------------------------------
                // 🔥🔥 SORT TEAMS ALPHABETICALLY HERE (A → Z)
                // ------------------------------------------------------
                const sortedTeams = [...teamsArr].sort((a, b) => {
                    const nameA = (a.teamName ?? a.title ?? a.name ?? "").toLowerCase();
                    const nameB = (b.teamName ?? b.title ?? b.name ?? "").toLowerCase();
                    return nameA.localeCompare(nameB);
                });
                // ------------------------------------------------------

                if (!cancelled) {
                    setData({ event: eventObj });
                    setTeams(sortedTeams);

                    // --- INITIAL THEMES ---
                    const initialThemes: Record<number, string> = {};

                    if (Array.isArray(eventObj?.themes)) {
                        eventObj.themes.forEach((t: any) => {
                            if (t?.lot != null) initialThemes[Number(t.lot) - 1] = String(t.theme ?? "");
                        });
                    } else if (typeof eventObj?.themes === "object") {
                        Object.entries(eventObj.themes).forEach(([k, v]) => {
                            const idx = Number(k) - 1;
                            if (!Number.isNaN(idx)) initialThemes[idx] = String(v ?? "");
                        });
                    }

                    for (let i = 0; i < totalLots; i++) {
                        if (!initialThemes[i]) initialThemes[i] = "";
                    }
                    setThemes(initialThemes);

                    // --- INITIAL TEAM ALLOCATIONS ---
                    const initialAlloc: Record<number, string> = {};
                    const allocations = eventObj?.allocations ?? [];

                    if (Array.isArray(allocations)) {
                        allocations.forEach((a: any) => {
                            const lotIndex = Number(a.lot) - 1;
                            if (!isNaN(lotIndex) && lotIndex >= 0 && a.teamId) {
                                initialAlloc[lotIndex] = String(a.teamId);
                            }
                        });
                    }

                    setSelectedTeams(initialAlloc);
                }

            } catch (err: any) {
                console.error(err);
                if (!cancelled) setError(err?.message ?? "Unknown error");
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchAll();

        return () => { cancelled = true };
    }, []);

    


    // --- Consolidation Effect: Synthesize selectedTeams and themes into consolidatedLots ---
    // --- Consolidation Effect: Synthesize selectedTeams and themes into consolidatedLots ---
    useEffect(() => {
        const newConsolidatedLots: LotSubmission[] = [];

        for (let i = 0; i < totalLots; i++) {
            const teamId = selectedTeams[i] || "";
            const theme = themes[i] || "";

            // find team object (getTeam works with multiple id shapes)
            const teamObj = teamId ? getTeam(teamId) : undefined;
            const teamName = teamObj?.teamName ?? teamObj?.title ?? teamObj?.name ?? "";

            // Only include lots that have at least a team allocated OR a theme defined
            if (teamId || theme) {
                newConsolidatedLots.push({
                    lot: i + 1, // Convert 0-based index to 1-based lot number
                    teamId: teamId,
                    teamName: teamName || undefined, // include if found
                    eventName: eventName,
                    theme: theme,
                });
            }
        }

        // This state holds the array of data that aligns with the LotSchema fields (lot_number, team_id, theme)
        setConsolidatedLots(newConsolidatedLots);
    }, [selectedTeams, themes, totalLots, teams, eventName]); // include teams & eventName so names stay in sync

    // --- Handlers ---
    const handleSelectChange = (lotIndex: number, value: string) => {
        setSelectedTeams((prev) => ({ ...prev, [lotIndex]: value }));
    };

    const handleThemeChange = (lotIndex: number, value: string) => {
        setThemes((prev) => ({ ...prev, [lotIndex]: value }));
    };

    // Save a single theme for a lot to backend
    const saveTheme = async (lotIndex: number) => {
        if (!id) {
            setError("Event id missing. Cannot save theme.");
            return;
        }
        const themeText = (themes[lotIndex] ?? "").trim();
        if (!themeText) {
            setError("Theme cannot be empty.");
            return;
        }

        setSavingThemeFor((s) => ({ ...s, [lotIndex]: true }));
        setError("");

        try {
            // Note: This API call is just for the theme update
            const res = await fetch(`/api/events/${id}/themes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ lot: lotIndex + 1, theme: themeText }),
            });

            if (!res.ok) {
                const text = await res.text().catch(() => "");
                throw new Error(`Failed to save theme (status ${res.status}) ${text ? `- ${text}` : ""}`);
            }

            console.log(`Saved theme for lot ${lotIndex + 1}:`, themeText);
        } catch (err: any) {
            console.error(err);
            setError(err?.message ?? "Failed to save theme");
        } finally {
            setSavingThemeFor((s) => ({ ...s, [lotIndex]: false }));
        }
    };
const handleSaveAllocations = async () => {
    if (!id) {
        setError("Event id missing. Cannot save.");
        return;
    }

    setIsSaving(true);
    setError("");

    try {
        const payload = {
            lots: consolidatedLots, // Array of { lot, teamId, theme }
            eventId: id,
            eventName: eventName
        };

        const res = await fetch(`/api/add-lot`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            throw new Error("Failed to save allocations and themes");
        }

        console.log("Allocations and Themes saved successfully. Consolidated Data:", consolidatedLots);

        // OPTIONAL: toast
        // toast.success("Allocations saved successfully!");

        // 🔥 REDIRECT AFTER SUCCESS
        router.push("/admin/lot/select-event");

    } catch (err: any) {
        console.error(err);
        setError(err?.message ?? "Failed to save allocations and themes");
    } finally {
        setIsSaving(false);
    }
};


    // --- Render Guards ---
    if (!id) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
                <div className="text-center">
                    <div className="text-2xl font-bold text-red-600 p-6 bg-white rounded-xl shadow-lg flex items-center justify-center gap-2">
                        <X className="w-6 h-6" /> Error: Event ID not found
                    </div>
                    <p className="mt-4 text-sm text-gray-600">
                        Provide the event id as a query param (e.g. <code>?id=EVENT_ID</code>) or ensure you're on a route like{" "}
                        <code>/events/&lt;id&gt;</code>.
                    </p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-xl text-indigo-600 font-semibold p-4 rounded-lg bg-white shadow-md flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" /> Loading event and teams...
                </div>
            </div>
        );
    }

    // if (error) {
    //     return (
    //         <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
    //             <div className="text-center max-w-xl">
    //                 <div className="text-2xl font-bold text-red-600 p-6 bg-white rounded-xl shadow-lg flex items-center justify-center gap-2">
    //                     <X className="w-6 h-6" /> {error}
    //                 </div>
    //                 <p className="mt-4 text-sm text-gray-600">
    //                     Check the browser console and the API endpoints <code>/api/events/:id</code> and <code>/api/team</code>.
    //                 </p>
    //             </div>
    //         </div>
    //     );
    // }

    const allocatedCount = Object.values(selectedTeams).filter(Boolean).length;
    // Check if any lot has an unsaved theme (i.e., theme is edited but not individually saved)
    const hasUnsavedTheme = consolidatedLots.some(lot =>
        (data?.event?.themes?.[lot.lot] !== lot.theme) // simplified check
    );

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-10 font-sans">
            {/* Title */}
            <header className="mb-12">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-gray-900 tracking-tight">
                    {data?.event?.title ?? "Team Allocation Event"}
                </h1>
                <p className="text-center text-lg text-gray-600 mt-3">Allocate teams and define themes for {totalLots} competition lots (Event ID: <code className="font-mono text-indigo-600 bg-indigo-50 p-1 rounded">{id}</code>)</p>
            </header>

            <div className="w-full max-w-6xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200">
                <div className="hidden sm:grid grid-cols-12 gap-4 py-4 px-6 bg-indigo-700 text-white font-semibold text-sm uppercase tracking-wider sticky top-0 z-10 shadow-lg">
                    <span className="col-span-1">Lot</span>
                    <span className="col-span-4">Theme Description</span>
                    <span className="col-span-7">Team Assignment</span>
                </div>

                <div className="divide-y divide-gray-200">
                    {Array.from({ length: totalLots }).map((_, i) => {
                        const lotIndex = i;
                        const selectedId = selectedTeams[lotIndex] || "";
                        const selectedTeam = getTeam(selectedId);
                        const displayedTeamId = selectedTeam?.teamId ?? selectedId;
                        const isAllocated = !!selectedId;
                        const themeValue = themes[lotIndex] ?? "";
                        const isThemeSaving = savingThemeFor[lotIndex];

                        return (
                            <div
                                key={lotIndex}
                                className={`grid grid-cols-1 sm:grid-cols-12 gap-4 items-center p-5 transition duration-150 ${isAllocated ? "bg-indigo-50 hover:bg-indigo-100" : lotIndex % 2 === 0 ? "bg-white hover:bg-gray-50" : "bg-gray-50 hover:bg-gray-100"
                                    }`}
                            >
                                <div className="sm:col-span-1 text-xl font-extrabold text-indigo-600">{lotIndex + 1}</div>

                                {/* Theme input (editable) */}
                                <div className="sm:col-span-4 flex gap-2">
                                    <input
                                        value={themeValue}
                                        onChange={(e) => handleThemeChange(lotIndex, e.target.value)}
                                        placeholder={`Theme ${lotIndex + 1}`}
                                        className="w-full py-2 px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    />
                                    <button
                                        onClick={() => saveTheme(lotIndex)}
                                        disabled={isThemeSaving || !themeValue.trim()}
                                        className="bg-green-600 text-white text-sm py-2 px-3 rounded-lg shadow disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 transition flex items-center gap-1"
                                        title="Save theme description only"
                                    >
                                        {isThemeSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    </button>
                                </div>

                                <div className="sm:col-span-7 flex flex-col sm:flex-row sm:items-center justify-start gap-3">
                                    <select
                                        value={selectedId}
                                        onChange={(e) => handleSelectChange(lotIndex, e.target.value)}
                                        className="w-full sm:w-64 appearance-none block py-2.5 px-4 border border-gray-300 rounded-xl shadow-md bg-white text-gray-700 font-medium cursor-pointer transition duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:border-indigo-500 focus:ring-opacity-30"
                                        disabled={isSaving}
                                    >
                                        <option value="">-- Select Team --</option>
                                        {teams.map((team) => {
                                            const valueId = team.teamId ?? team._id ?? team.id ?? team.name;
                                            const label = `${team.teamName ?? team.title ?? valueId} (${team.teamId ?? valueId})`;
                                            return (
                                                <option key={team._id ?? String(valueId)} value={valueId}>
                                                    {label}
                                                </option>
                                            );
                                        })}
                                    </select>

                                    {/* Assigned badge (shows custom teamId only) */}
                                    {isAllocated ? (
                                        <span className="mt-2 sm:mt-0 sm:ml-4 text-sm font-semibold text-indigo-700 bg-indigo-200 py-1 px-3 rounded-full shadow-inner flex items-center gap-1">
                                            <Zap className="w-4 h-4" /> Assigned: {displayedTeamId}
                                        </span>
                                    ) : (
                                        <span className="mt-2 sm:mt-0 sm:ml-4 text-sm font-medium text-gray-500">Unassigned</span>
                                    )}

                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Action Bar */}
            <div className="w-full max-w-6xl mx-auto mt-10 flex flex-col sm:flex-row justify-between items-center p-4 bg-white rounded-xl shadow-2xl border border-indigo-200">
                <div className="text-left">
                    <p className="text-lg font-medium text-gray-700 mb-2">
                        <span className="font-bold text-indigo-600">{allocatedCount}</span> of {totalLots} lots allocated.
                    </p>
                    <p className="text-sm text-gray-500">
                        Consolidated Lots Ready for Submission: <span className="font-mono text-xs bg-gray-100 p-1 rounded">{consolidatedLots.length} records</span>
                    </p>
                </div>

                <div className="flex gap-4 w-full sm:w-auto">
                    <button
                        onClick={handleSaveAllocations}
                        disabled={consolidatedLots.length === 0 || isSaving}
                        className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full shadow-xl transition duration-300 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" /> Saving All...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" /> Save All Allocations ({consolidatedLots.length})
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

// NOTE: This Mongoose Schema is provided by the user and is included here for context only.
// The front-end now generates the data structure required by this schema.
/*
import mongoose from "mongoose";

const LotSchema = new mongoose.Schema({
  lot_number: {
    type: String,
    required: true,
  },
  event: {
    type: String,
    required: true,
  },
  team_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true,
  },
  theme: {
    type: String,
    default: "", // keep empty by default
  },
});

export default mongoose.model("Lot", LotSchema);
*/