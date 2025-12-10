"use client";

import React, { useEffect, useState } from "react";

type Contestant = {
    contestantName: string;
    dNo: string;
};

export default function Page() {
    const [teamId, setTeamId] = useState("");
    const [teamName, setTeamName] = useState("");
    const [eventName, setEventName] = useState("");
    const [memberCount, setMemberCount] = useState<number>(1);

    const [contestants, setContestants] = useState<Contestant[]>(
        Array.from({ length: 1 }, () => ({ contestantName: "", dNo: "" }))
    );

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    // When memberCount changes, resize contestants array accordingly
    useEffect(() => {
        const newCount = Math.max(1, Math.floor(memberCount || 1));
        setMemberCount(newCount);
        setContestants((prev) => {
            const copy = prev.slice(0, newCount);
            if (copy.length < newCount) {
                for (let i = copy.length; i < newCount; i++) {
                    copy.push({ contestantName: "", dNo: "" });
                }
            }
            return copy;
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [memberCount]);

    // update single contestant
    function updateContestant(index: number, field: keyof Contestant, value: string) {
        setContestants((prev) => {
            const copy = prev.map((c) => ({ ...c }));
            copy[index] = { ...copy[index], [field]: value };
            return copy;
        });
    }

    // submit handler
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setMessage(null);

        // Basic validation
        if (!teamId.trim() || !teamName.trim() || !eventName.trim()) {
            setMessage({ type: "error", text: "Please fill teamId, teamName and eventName." });
            return;
        }

        if (!Array.isArray(contestants) || contestants.length === 0) {
            setMessage({ type: "error", text: "Please add at least one contestant." });
            return;
        }

        for (let i = 0; i < contestants.length; i++) {
            const c = contestants[i];
            if (!c.contestantName.trim()) {
                setMessage({ type: "error", text: `Please enter name for member #${i + 1}.` });
                return;
            }
            if (!c.dNo.trim()) {
                setMessage({ type: "error", text: `Please enter dNo for member #${i + 1}.` });
                return;
            }
        }

        // POST to backend
        setLoading(true);
        try {
            const res = await fetch("/api/onStage-registration", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    teamId: teamId.trim(),
                    teamName: teamName.trim(),
                    eventName: eventName.trim(),
                    contestants: contestants.map((c) => ({
                        contestantName: c.contestantName.trim(),
                        dNo: c.dNo.trim(),
                    })),
                }),
            });

            const json = await res.json();

            if (!res.ok) {
                setMessage({ type: "error", text: json?.message || "Server error" });
            } else {
                setMessage({ type: "success", text: json?.message || "Registered successfully" });
                // Reset contestants but keep memberCount same (empty fields)
                setContestants(Array.from({ length: memberCount }, () => ({ contestantName: "", dNo: "" })));
            }
        } catch (err: any) {
            setMessage({ type: "error", text: err?.message || "Network error" });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-4">On-Stage Event Registration</h1>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className="flex flex-col">
                        <span className="text-sm font-medium">Team ID</span>
                        <input
                            value={teamId}
                            onChange={(e) => setTeamId(e.target.value)}
                            className="mt-1 px-3 py-2 border rounded-md focus:outline-none"
                            placeholder="25ICA02"
                            required
                        />
                    </label>

                    <label className="flex flex-col">
                        <span className="text-sm font-medium">Team Name</span>
                        <input
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            className="mt-1 px-3 py-2 border rounded-md focus:outline-none"
                            placeholder="Commerce"
                            required
                        />
                    </label>

                    <label className="flex flex-col">
                        <span className="text-sm font-medium">Event Name</span>
                        <input
                            value={eventName}
                            onChange={(e) => setEventName(e.target.value)}
                            className="mt-1 px-3 py-2 border rounded-md focus:outline-none"
                            placeholder="Group Singing"
                            required
                        />
                    </label>
                </div>

                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                        <span className="text-sm font-medium">Member Count</span>
                        <input
                            type="number"
                            min={1}
                            value={memberCount}
                            onChange={(e) => setMemberCount(Math.max(1, Number(e.target.value || 1)))}
                            className="w-20 ml-2 px-2 py-1 border rounded-md"
                        />
                    </label>
                </div>

                <div className="space-y-3">
                    <h2 className="text-lg font-medium">Contestants</h2>

                    <div className="grid gap-3">
                        {contestants.map((c, idx) => (
                            <div
                                key={idx}
                                className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end bg-gray-50 p-3 rounded"
                            >
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium">Member #{idx + 1} Name</label>
                                    <input
                                        value={c.contestantName}
                                        onChange={(e) => updateContestant(idx, "contestantName", e.target.value)}
                                        className="mt-1 px-3 py-2 border rounded-md"
                                        placeholder={`Member ${idx + 1} name`}
                                        required
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium">dNo</label>
                                    <input
                                        value={c.dNo}
                                        onChange={(e) => updateContestant(idx, "dNo", e.target.value)}
                                        className="mt-1 px-3 py-2 border rounded-md"
                                        placeholder={`eg 24UCC623`}
                                        required
                                    />
                                </div>

                                <div className="flex gap-2 md:justify-end">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setContestants((prev) => {
                                                const copy = prev.slice();
                                                copy[idx] = { ...copy[idx], contestantName: "", dNo: "" };
                                                return copy;
                                            })
                                        }
                                        className="px-3 py-2 border rounded-md text-sm"
                                    >
                                        Clear
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setContestants((prev) => {
                                                if (prev.length <= 1) return prev;
                                                const copy = prev.slice(0, idx).concat(prev.slice(idx + 1));
                                                setMemberCount(copy.length);
                                                return copy;
                                            })
                                        }
                                        className="px-3 py-2 border rounded-md text-sm"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() =>
                                setContestants((prev) => {
                                    const copy = prev.concat({ contestantName: "", dNo: "" });
                                    setMemberCount(copy.length);
                                    return copy;
                                })
                            }
                            className="px-4 py-2 rounded-md border text-sm"
                        >
                            Add Member
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        {message && (
                            <div
                                className={`px-3 py-2 rounded-md text-sm ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                    }`}
                            >
                                {message.text}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                // reset form
                                setTeamId("");
                                setTeamName("");
                                setEventName("");
                                setMemberCount(1);
                                setContestants([{ contestantName: "", dNo: "" }]);
                                setMessage(null);
                            }}
                            className="px-4 py-2 rounded-md border text-sm"
                        >
                            Reset
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 rounded-md bg-sky-600 text-white text-sm disabled:opacity-60"
                        >
                            {loading ? "Submitting..." : "Submit Registration"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
