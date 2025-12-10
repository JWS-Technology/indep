"use client";

import React, { useEffect, useState } from "react";

export type Contestant = {
  contestantName: string;
  dNo: string;
};

type Props = {
  // optional prefill values (useful when embedding)
  eventId?: string | null;
  initialTeamId?: string;
  initialTeamName?: string;
  initialEventName?: string;
  onSuccess?: (response: any) => void;
};

export default function OnStageEventRegistration({
  eventId: eventIdProp = null,
  initialTeamId = "",
  initialTeamName = "",
  initialEventName = "",
  onSuccess,
}: Props) {
  // store incoming eventId in state and keep in sync if prop changes
  const [eventId, setEventId] = useState<string | null>(eventIdProp ?? null);
  useEffect(() => {
    setEventId(eventIdProp ?? null);
  }, [eventIdProp]);

  // sync other initial props into local state (keeps editable)
  const [teamId, setTeamId] = useState(initialTeamId);
  const [teamName, setTeamName] = useState(initialTeamName);
  const [eventName, setEventName] = useState(initialEventName);

  useEffect(() => setTeamId(initialTeamId ?? ""), [initialTeamId]);
  useEffect(() => setTeamName(initialTeamName ?? ""), [initialTeamName]);
  useEffect(() => setEventName(initialEventName ?? ""), [initialEventName]);

  const [memberCount, setMemberCount] = useState<number>(1);
  const [contestants, setContestants] = useState<Contestant[]>(
    Array.from({ length: 1 }, () => ({ contestantName: "", dNo: "" }))
  );

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // keep contestants array in sync with memberCount
  useEffect(() => {
    const newCount = Math.max(1, Math.floor(memberCount || 1));
    setMemberCount(newCount);
    setContestants((prev) => {
      const copy = prev.slice(0, newCount);
      for (let i = copy.length; i < newCount; i++) copy.push({ contestantName: "", dNo: "" });
      return copy;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberCount]);

  function updateContestant(index: number, field: keyof Contestant, value: string) {
    setContestants((prev) => {
      const copy = prev.map((c) => ({ ...c }));
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (!teamId.trim() || !teamName.trim() || !eventName.trim()) {
      setMessage({ type: "error", text: "Team ID, Team Name and Event Name are required." });
      return;
    }

    if (!Array.isArray(contestants) || contestants.length === 0) {
      setMessage({ type: "error", text: "Add at least one contestant." });
      return;
    }

    for (let i = 0; i < contestants.length; i++) {
      const c = contestants[i];
      if (!c.contestantName.trim()) {
        setMessage({ type: "error", text: `Enter name for member #${i + 1}.` });
        return;
      }
      if (!c.dNo.trim()) {
        setMessage({ type: "error", text: `Enter D.No for member #${i + 1}.` });
        return;
      }
    }

    setLoading(true);
    try {
      const payload: any = {
        teamId: teamId.trim(),
        teamName: teamName.trim(),
        eventName: eventName.trim(),
        contestants: contestants.map((c) => ({ contestantName: c.contestantName.trim(), dNo: c.dNo.trim() })),
      };

      // include eventId if provided
      if (eventId) payload.eventId = eventId;

      const res = await fetch("/api/onstage/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.message || "Server error");
      }

      setMessage({ type: "success", text: json?.message || "Registered successfully" });
      onSuccess?.(json);

      // reset contestants (keep team/event)
      setContestants(Array.from({ length: memberCount }, () => ({ contestantName: "", dNo: "" })));
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "Network error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">On-Stage Event Registration</h2>

      {eventId && (
        <div className="mb-3 text-sm text-gray-600">
          <strong>Event ID:</strong> <span className="ml-2">{eventId}</span>
        </div>
      )}

      {message && (
        <div
          className={`mb-4 p-3 rounded ${message.type === "success" ? "bg-green-50 border border-green-200 text-green-800" : "bg-red-50 border border-red-200 text-red-800"}`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <label className="flex flex-col">
            <span className="text-sm font-medium">Team ID</span>
            <input value={teamId} onChange={(e) => setTeamId(e.target.value)} className="mt-1 px-3 py-2 border rounded" placeholder="25ICA02" />
          </label>

          <label className="flex flex-col">
            <span className="text-sm font-medium">Team Name</span>
            <input value={teamName} onChange={(e) => setTeamName(e.target.value)} className="mt-1 px-3 py-2 border rounded" placeholder="Commerce" />
          </label>

          <label className="flex flex-col">
            <span className="text-sm font-medium">Event Name</span>
            <input value={eventName} onChange={(e) => setEventName(e.target.value)} className="mt-1 px-3 py-2 border rounded" placeholder="Singing" />
          </label>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <span className="text-sm font-medium">Member Count</span>
            <input type="number" min={1} value={memberCount} onChange={(e) => setMemberCount(Math.max(1, Number(e.target.value || 1)))} className="w-20 ml-2 px-2 py-1 border rounded" />
          </label>

          <div className="ml-auto text-sm text-gray-500">You can also add/remove individual rows below.</div>
        </div>

        <div className="space-y-3">
          {contestants.map((c, idx) => (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end bg-gray-50 p-3 rounded">
              <div className="flex flex-col">
                <label className="text-sm font-medium">Member #{idx + 1} Name</label>
                <input value={c.contestantName} onChange={(e) => updateContestant(idx, "contestantName", e.target.value)} className="mt-1 px-3 py-2 border rounded" placeholder={`Member ${idx + 1} name`} />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium">D.No</label>
                <input value={c.dNo} onChange={(e) => updateContestant(idx, "dNo", e.target.value.toUpperCase())} className="mt-1 px-3 py-2 border rounded" placeholder="Enter D.No" />
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
                  className="px-3 py-2 border rounded text-sm"
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
                  className="px-3 py-2 border rounded text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

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
              className="px-4 py-2 rounded border text-sm"
            >
              Add Member
            </button>
          </div>
        </div>

        <div className="pt-4 border-t flex items-center justify-between">
          <div className="text-sm text-gray-500">Make sure D.No and names match the registration list.</div>

          <button type="submit" disabled={loading} className="px-6 py-2 rounded bg-indigo-600 text-white font-medium disabled:opacity-60">
            {loading ? "Submitting..." : "Submit Registration"}
          </button>
        </div>
      </form>
    </div>
  );
}
