"use client";

import React, { useEffect, useState } from "react";

export type Contestant = {
  contestantName: string;
  dNo: string;
};

type Props = {
  eventId?: string | null;
  eventName?: string;
  teamId?: string;
  teamName?: string;
  isRegistrationOpen?: boolean;
  offStageOrOnstage?: string;
  onSuccess?: (response: any) => void;
};

export default function OffStageEventRegistration({
  eventId: eventIdProp = null,
  eventName: eventNameProp = "",
  teamId: teamIdProp = "",
  teamName: teamNameProp = "",
  isRegistrationOpen: isRegistrationOpenProp = false,
  offStageOrOnstage: offStageOrOnstageProp = "",
  onSuccess,
}: Props) {
  // Local state (initialized from props)
  const [eventId, setEventId] = useState<string | null>(eventIdProp ?? null);
  const [eventName, setEventName] = useState<string>(eventNameProp ?? "");
  const [teamId, setTeamId] = useState<string>(teamIdProp ?? "");
  const [teamName, setTeamName] = useState<string>(teamNameProp ?? "");
  const [isRegistrationOpen, setIsRegistrationOpen] = useState<boolean>(!!isRegistrationOpenProp);
  const [offStageOrOnstage, setOffStageOrOnstage] = useState<string>(offStageOrOnstageProp ?? "");

  // Keep local state in sync if parent updates props
  useEffect(() => setEventId(eventIdProp ?? null), [eventIdProp]);
  useEffect(() => setEventName(eventNameProp ?? ""), [eventNameProp]);
  useEffect(() => setTeamId(teamIdProp ?? ""), [teamIdProp]);
  useEffect(() => setTeamName(teamNameProp ?? ""), [teamNameProp]);
  useEffect(() => setIsRegistrationOpen(!!isRegistrationOpenProp), [isRegistrationOpenProp]);
  useEffect(() => setOffStageOrOnstage(offStageOrOnstageProp ?? ""), [offStageOrOnstageProp]);

  // Form state
  const [contestantName, setContestantName] = useState("");
  const [dNo, setDNo] = useState("");
  const [secondContestant, setSecondContestant] = useState("");
  const [secondDno, setSecondDno] = useState("");
  const [lotNo, setLotNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // If you want to autofill eventName/teamName when prop arrives, useEffect above already does it.
  // Example: fetch lot number when teamId & eventName exist
  useEffect(() => {
    const getLotNumber = async () => {
      if (!teamId || !eventName) return;
      try {
        const res = await fetch("/api/get-lot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ eventName, teamId }),
        });
        if (!res.ok) return;
        const data = await res.json();
        setLotNo(data.lot?.lot_number || "");
      } catch (err) {
        // ignore optional error
        console.error("Lot fetch error", err);
      }
    };
    getLotNumber();
  }, [teamId, eventName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Basic validation (OFF_STAGE)
    if (!teamId || !teamName || !eventName) {
      setError("Missing team/event information. Please refresh.");
      return;
    }
    if (!contestantName.trim() || !dNo.trim()) {
      setError("Please fill contestant name and D.No");
      return;
    }
    if (eventName === "Quiz - Prelims" && (!secondContestant.trim() || !secondDno.trim())) {
      setError("Please fill both contestants for Quiz - Prelims");
      return;
    }

    setLoading(true);
    try {
      const payload: any = {
        eventId: eventId ?? undefined,
        eventName,
        teamName,
        teamId,
        contestantName: contestantName.trim(),
        dNo: dNo.trim(),
        secondContestant: secondContestant.trim() || undefined,
        secondDno: secondDno.trim() || undefined,
        lotNo: lotNo || undefined,
      };

      // POST to your offStage registration endpoint
      const method = "POST";
      const url = "/api/offStage-registration";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Registration failed");

      setSuccess("Registration successful");
      onSuccess?.(json);
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Off-stage Registration</h2>

      {eventId && <div className="mb-2 text-sm text-gray-600">Event ID: {eventId}</div>}
      {success && <div className="mb-4 text-green-700">{success}</div>}
      {error && <div className="mb-4 text-red-700">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input value={eventName} onChange={(e) => setEventName(e.target.value)} placeholder="Event name" className="px-3 py-2 border rounded" />
          <input value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="Team name" className="px-3 py-2 border rounded" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input value={contestantName} onChange={(e) => setContestantName(e.target.value)} placeholder="Contestant name" className="px-3 py-2 border rounded" />
          <input value={dNo} onChange={(e) => setDNo(e.target.value.toUpperCase())} placeholder="D.No" className="px-3 py-2 border rounded" />
        </div>

        {eventName === "Quiz - Prelims" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input value={secondContestant} onChange={(e) => setSecondContestant(e.target.value)} placeholder="Second contestant" className="px-3 py-2 border rounded" />
            <input value={secondDno} onChange={(e) => setSecondDno(e.target.value.toUpperCase())} placeholder="Second D.No" className="px-3 py-2 border rounded" />
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-gray-500">Lot: {lotNo || "—"}</div>
          <button type="submit" disabled={!isRegistrationOpen || loading} className={`px-4 py-2 rounded ${!isRegistrationOpen ? "bg-gray-400" : "bg-indigo-600 text-white"}`}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}
