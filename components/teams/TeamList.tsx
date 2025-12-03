"use client";
import React, { useEffect, useState } from "react";

/**
 * Team Allocation Page (full file)
 *
 * - Fetches event from GET /api/events/:id
 * - Fetches teams from GET /api/team
 * - Attempts to determine the `id` from multiple sources:
 *   1. window.__NEXT_DATA__ (Next.js dynamic route props)
 *   2. query param `?id=...`
 *   3. last pathname segment
 *
 * This version uses your custom `teamId` (e.g. "25IAD01") as the selectable value when available
 * and shows both the teamName and the teamId in the Assigned badge.
 */

export default function Page(): JSX.Element {
    // --- State ---
    const [id, setId] = useState<string | null>(null);
    const [data, setData] = useState<any>(null);
    const [teams, setTeams] = useState<any[]>([]);
    const [selectedTeams, setSelectedTeams] = useState<Record<number, string>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");
    const [isSaving, setIsSaving] = useState(false);

    const totalLots = 28;

    // --- Helpers ---
    // Resolve a team object by identifier (prefer teamId, then _id/id/name)
    const getTeam = (identifier?: string | null | undefined) => {
        if (!identifier) return undefined;
        return teams.find((t) => {
            const idCandidates = [t.teamId, t._id, t.id, t.name].filter(Boolean).map(String);
            return idCandidates.includes(String(identifier));
        });
    };

    const getTeamName = (teamIdentifier?: string | null | undefined) => {
        if (!teamIdentifier) return "";
        const team = getTeam(teamIdentifier);
        return team?.teamName ?? team?.title ?? teamIdentifier;
    };

    // Determine event id from a few client-side heuristics
    const getEventId = (): string | null => {
        try {
            // 1) Next's injected data (if present)
            // @ts-ignore
            const nextData = typeof window !== "undefined" ? (window as any).__NEXT_DATA__ : undefined;
            if (nextData?.props?.pageProps?.params?.id) {
                const p = nextData.props.pageProps.params.id;
                if (Array.isArray(p)) return String(p[0]);
                return String(p);
            }

            // 2) Query param ?id=...
            if (typeof window !== "undefined") {
                const qp = new URL(window.location.href).searchParams.get("id");
                if (qp) return qp;
            }

            // 3) Last segment of pathname
            if (typeof window !== "undefined") {
                const pathSegments = window.location.pathname.split("/").filter(Boolean);
                if (pathSegments.length) return pathSegments[pathSegments.length - 1];
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

    // --- Render guards ---
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
                        const selectedIdentifier = selectedTeams[i] || "";
                        const selectedTeam = getTeam(selectedIdentifier);
                        const selectedName = selectedTeam?.teamName ?? selectedTeam?.title ?? selectedIdentifier;
                        // prefer to display custom teamId (team.teamId). fallback to _id or the identifier used.
                        const displayedId = selectedTeam?.teamId ?? selectedTeam?._id ?? selectedIdentifier;
                        const isAllocated = !!selectedIdentifier;

                        return (
                            <div
                                key={i}
                                className={`grid grid-cols-1 sm:grid-cols-12 gap-4 items-center p-5 transition duration-150 ${isAllocated ? "bg-indigo-50 hover:bg-indigo-100" : i % 2 === 0 ? "bg-white hover:bg-gray-50" : "bg-gray-50 hover:bg-gray-100"
                                    }`}
                            >
                                <div className="sm:col-span-1 text-xl font-extrabold text-indigo-600">{i + 1}</div>

                                <div className="sm:col-span-4 text-lg font-medium text-gray-800">Theme {i + 1}</div>

                                <div className="sm:col-span-7 flex flex-col sm:flex-row sm:items-center justify-start">
                                    <select
                                        value={selectedIdentifier}
                                        onChange={(e) => handleSelectChange(i, e.target.value)}
                                        className="w-full sm:w-64 appearance-none block py-2.5 px-4 border border-gray-300 rounded-xl shadow-md bg-white text-gray-700 font-medium cursor-pointer transition duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:border-indigo-500 focus:ring-opacity-30"
                                        disabled={isSaving}
                                    >
                                        <option value="">-- Select Team --</option>
                                        {teams.map((team) => {
                                            // prefer team.teamId as the value, fallback to _id/id/name if teamId is missing
                                            const valueId = team.teamId ?? team._id ?? team.id ?? team.name;
                                            return (
                                                <option key={team._id ?? String(valueId)} value={valueId}>
                                                    {`${team.teamName ?? team.title ?? valueId} (${team.teamId ?? (team._id ?? valueId)})`}
                                                </option>
                                            );
                                        })}
                                    </select>

                                    {isAllocated ? (
                                        <span className="mt-2 sm:mt-0 sm:ml-4 text-sm font-semibold text-indigo-700 bg-indigo-200 py-1 px-3 rounded-full shadow-inner">
                                            Assigned: {selectedName} ({displayedId})
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
