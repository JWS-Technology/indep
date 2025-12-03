"use client";
import React, { useEffect, useState } from "react";

/**
 * Team Allocation + Editable Themes Page
 * - Fetches event from GET /api/events/:id
 * - Fetches teams from GET /api/team
 * - Theme column is now an editable input with per-row "Save Theme" button
 *
 * Notes:
 * - POST /api/events/:id/themes   payload: { lot: number, theme: string }
 *   (Adjust URL / method / payload to match your API.)
 */

export default function Page() {
    // --- State ---
    const [id, setId] = useState<string | null>(null);
    const [data, setData] = useState<any>(null);
    const [teams, setTeams] = useState<any[]>([]);
    const [selectedTeams, setSelectedTeams] = useState<Record<number, string>>({});
    const [themes, setThemes] = useState<Record<number, string>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");
    const [isSaving, setIsSaving] = useState(false);
    // track per-lot theme-save status
    const [savingThemeFor, setSavingThemeFor] = useState<Record<number, boolean>>({});

    const totalLots = 28;

    // --- Helpers ---
    const getTeam = (identifier?: string | null) => {
        if (!identifier) return undefined;
        return teams.find((t) => {
            const candidates = [t.teamId, t._id, t.id, t.name].filter(Boolean).map(String);
            return candidates.includes(String(identifier));
        });
    };

    // Try multiple heuristics to determine the event id from the environment / URL
    const getEventId = (): string | null => {
        try {
            // @ts-ignore
            const nextData = typeof window !== "undefined" ? (window as any).__NEXT_DATA__ : undefined;
            if (nextData?.props?.pageProps?.params?.id) {
                const p = nextData.props.pageProps.params.id;
                if (Array.isArray(p)) return String(p[0]);
                return String(p);
            }

            if (typeof window !== "undefined") {
                const qp = new URL(window.location.href).searchParams.get("id");
                if (qp) return qp;
                const parts = window.location.pathname.split("/").filter(Boolean);
                if (parts.length) return parts[parts.length - 1];
            }
        } catch (err) {
            // ignore
        }
        return null;
    };

    // --- Fetch event and teams using real API endpoints ---
    useEffect(() => {
        const resolvedId = getEventId();
        setId(resolvedId);

        if (!resolvedId) {
            setLoading(false);
            setError(
                "Unable to determine event id from URL. Provide ?id=... or ensure you're on a dynamic route like /events/[id]."
            );
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
                    throw new Error(`Failed to fetch event (status ${evRes.status}) ${text ? `- ${text}` : ""}`);
                }
                const evJson = await evRes.json();
                const eventObj = evJson?.event ?? evJson?.data?.event ?? evJson?.data ?? evJson;

                // Fetch teams
                const tRes = await fetch(`/api/team`);
                if (!tRes.ok) {
                    const text = await tRes.text().catch(() => "");
                    throw new Error(`Failed to fetch teams (status ${tRes.status}) ${text ? `- ${text}` : ""}`);
                }
                const tJson = await tRes.json();
                const teamsArr = Array.isArray(tJson) ? tJson : tJson?.teams ?? tJson?.data ?? tJson;

                if (!cancelled) {
                    setData({ event: eventObj });
                    setTeams(Array.isArray(teamsArr) ? teamsArr : []);

                    // initialize themes state from event if present:
                    // expect eventObj.themes to be array like [{ lot:1, theme:"..." }, ...] OR object keyed by lot
                    const initialThemes: Record<number, string> = {};
                    if (eventObj?.themes) {
                        if (Array.isArray(eventObj.themes)) {
                            eventObj.themes.forEach((t: any) => {
                                if (t?.lot != null) initialThemes[Number(t.lot) - 1] = String(t.theme ?? "");
                            });
                        } else if (typeof eventObj.themes === "object") {
                            // object keyed by lot index (1-based or 0-based)
                            Object.entries(eventObj.themes).forEach(([k, v]) => {
                                const idx = Number(k) - 1;
                                if (!Number.isNaN(idx)) initialThemes[idx] = String(v ?? "");
                            });
                        }
                    }
                    // ensure defaults for empty lots
                    for (let i = 0; i < totalLots; i++) {
                        if (!initialThemes[i]) initialThemes[i] = "";
                    }
                    setThemes(initialThemes);
                }
            } catch (err: any) {
                if (!cancelled) {
                    console.error(err);
                    setError(err?.message ?? "Unknown error while fetching data");
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchAll();

        return () => {
            cancelled = true;
        };
    }, []);

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

        // set per-lot saving state
        setSavingThemeFor((s) => ({ ...s, [lotIndex]: true }));
        setError("");

        try {
            // Adjust URL/payload if your backend expects a different route/shape
            const res = await fetch(`/api/events/${id}/themes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ lot: lotIndex + 1, theme: themeText }),
            });

            if (!res.ok) {
                const text = await res.text().catch(() => "");
                throw new Error(`Failed to save theme (status ${res.status}) ${text ? `- ${text}` : ""}`);
            }

            // optional: update local event data or show success toast
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
            const allocations = Object.entries(selectedTeams)
                .filter(([_, teamId]) => Boolean(teamId))
                .map(([lotIndex, teamId]) => ({ lot: Number(lotIndex) + 1, teamId }));

            const res = await fetch(`/api/events/${id}/allocations`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ allocations }),
            });

            if (!res.ok) {
                const text = await res.text().catch(() => "");
                throw new Error(`Failed to save allocations (status ${res.status}) ${text ? `- ${text}` : ""}`);
            }

            console.log("Allocations saved successfully");
        } catch (err: any) {
            console.error(err);
            setError(err?.message ?? "Failed to save allocations");
        } finally {
            setIsSaving(false);
        }
    };

    // --- Render Guards ---
    if (!id) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
                <div className="text-center">
                    <div className="text-2xl font-bold text-red-600 p-6 bg-white rounded-xl shadow-lg">Error: Event ID not found</div>
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
                <div className="text-xl text-indigo-600 font-semibold p-4 rounded-lg bg-white shadow-md">Loading event and teams...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
                <div className="text-center max-w-xl">
                    <div className="text-2xl font-bold text-red-600 p-6 bg-white rounded-xl shadow-lg">{error}</div>
                    <p className="mt-4 text-sm text-gray-600">
                        Check the browser console and the API endpoints <code>/api/events/:id</code> and <code>/api/team</code>.
                    </p>
                </div>
            </div>
        );
    }

    const allocatedCount = Object.values(selectedTeams).filter(Boolean).length;

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-10 font-sans">
            {/* Title */}
            <header className="mb-12">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-gray-900 tracking-tight">
                    {data?.event?.title ?? "Team Allocation Event"}
                </h1>
                <p className="text-center text-lg text-gray-600 mt-3">Allocate teams to the {totalLots} competition themes.</p>
            </header>

            <div className="w-full max-w-6xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200">
                <div className="hidden sm:grid grid-cols-12 gap-4 py-4 px-6 bg-indigo-700 text-white font-semibold text-sm uppercase tracking-wider sticky top-0 z-10 shadow-lg">
                    <span className="col-span-1">Lot</span>
                    <span className="col-span-4">Theme Description</span>
                    <span className="col-span-7">Team Assignment</span>
                </div>

                <div className="divide-y divide-gray-200">
                    {Array.from({ length: totalLots }).map((_, i) => {
                        const selectedId = selectedTeams[i] || "";
                        const selectedTeam = getTeam(selectedId);
                        const displayedTeamId = selectedTeam?.teamId ?? selectedId;
                        const selectedName = selectedTeam?.teamName ?? selectedTeam?.title ?? "";
                        const isAllocated = !!selectedId;
                        const themeValue = themes[i] ?? "";

                        return (
                            <div
                                key={i}
                                className={`grid grid-cols-1 sm:grid-cols-12 gap-4 items-center p-5 transition duration-150 ${isAllocated ? "bg-indigo-50 hover:bg-indigo-100" : i % 2 === 0 ? "bg-white hover:bg-gray-50" : "bg-gray-50 hover:bg-gray-100"
                                    }`}
                            >
                                <div className="sm:col-span-1 text-xl font-extrabold text-indigo-600">{i + 1}</div>

                                {/* Theme input (editable) */}
                                <div className="sm:col-span-4">
                                    <input
                                        value={themeValue}
                                        onChange={(e) => handleThemeChange(i, e.target.value)}
                                        placeholder={`Theme ${i + 1}`}
                                        className="w-full py-2 px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    />
                                </div>

                                <div className="sm:col-span-7 flex flex-col sm:flex-row sm:items-center justify-start gap-3">
                                    <select
                                        value={selectedId}
                                        onChange={(e) => handleSelectChange(i, e.target.value)}
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
                                        <span className="mt-2 sm:mt-0 sm:ml-4 text-sm font-semibold text-indigo-700 bg-indigo-200 py-1 px-3 rounded-full shadow-inner">
                                            Assigned: {displayedTeamId}
                                        </span>
                                    ) : (
                                        <span className="mt-2 sm:mt-0 sm:ml-4 text-sm font-medium text-gray-500">Unassigned</span>
                                    )}

                                    {/* Save theme button */}
                                    <div className="ml-auto sm:ml-4">
                                        <button
                                            onClick={() => saveTheme(i)}
                                            disabled={savingThemeFor[i] || !themeValue.trim()}
                                            className="bg-indigo-600 text-white py-2 px-4 rounded-lg shadow disabled:opacity-60"
                                        >
                                            {savingThemeFor[i] ? "Saving..." : "Save Theme"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Action Bar */}
            <div className="w-full max-w-6xl mx-auto mt-10 flex flex-col sm:flex-row justify-between items-center p-4 bg-white rounded-xl shadow-2xl border border-indigo-200">
                <p className="text-lg font-medium text-gray-700 mb-4 sm:mb-0">
                    <span className="font-bold text-indigo-600">{allocatedCount}</span> of {totalLots} lots allocated.
                </p>
                <div className="flex gap-4 w-full sm:w-auto">
                    <button
                        onClick={handleSaveAllocations}
                        disabled={allocatedCount === 0 || isSaving}
                        className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full shadow-xl transition duration-300 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? "Saving..." : `Save All Allocations (${allocatedCount}/${totalLots})`}
                    </button>
                </div>
            </div>
        </div>
    );
}
