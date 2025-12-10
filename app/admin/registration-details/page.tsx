"use client";

import React, { useEffect, useState } from "react";

// Types
interface Contestant {
  contestantName: string;
  dNo: string;
}

interface RegistrationData {
  _id: string;
  teamId: string;
  teamName: string;
  eventName: string;
  contestantCount: number;
  contestants: Contestant[];
}

type RegistrationList = RegistrationData[];

export default function AllRegistrationsPage() {
  const [registrations, setRegistrations] = useState<RegistrationList>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/get-onstage-registration");
        const data = await res.json();
        if (data.success) {
          setRegistrations(Array.isArray(data.registeredData) ? data.registeredData : []);
        } else {
          throw new Error(data.message || "Failed to fetch registrations");
        }
      } catch (err) {
        console.error(err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchRegistrations();
  }, []);

  const handleUpdate = async (id: string, updatedData: Partial<RegistrationData>) => {
    try {
      const res = await fetch("/api/get-onstage-registration", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updatedData }),
      });

      const data = await res.json();
      if (data.success && data.updatedData) {
        setRegistrations((prev) =>
          prev.map((reg) => (reg._id === id ? data.updatedData : reg))
        );
      } else {
        alert(data.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      alert("Network error while updating");
    }
  };

  if (loading) return <div className="p-8">Loading all registrations...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;
  if (registrations.length === 0)
    return <div className="p-8">No registrations found in the database.</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto bg-white shadow-lg rounded-lg space-y-8">
      <h1 className="text-3xl font-bold text-indigo-700 border-b pb-2 mb-6">
        🏆 All On-Stage Event Registrations
      </h1>

      {registrations.map((reg) => (
        <EditableRegistration
          key={reg._id}
          registration={reg}
          onSave={handleUpdate}
        />
      ))}
    </div>
  );
}

// --- Editable Registration Component ---
function EditableRegistration({
  registration,
  onSave,
}: {
  registration: RegistrationData;
  onSave: (id: string, updatedData: Partial<RegistrationData>) => void;
}) {
  const [teamName, setTeamName] = useState(registration.teamName);
  const [eventName, setEventName] = useState(registration.eventName);
  const [contestants, setContestants] = useState<Contestant[]>(registration.contestants);

  const handleContestantChange = (index: number, field: "contestantName" | "dNo", value: string) => {
    const updated = [...contestants];
    updated[index][field] = value;
    setContestants(updated);
  };

  const addContestant = () => {
    setContestants([...contestants, { contestantName: "", dNo: "" }]);
  };

  const removeContestant = (index: number) => {
    const updated = [...contestants];
    updated.splice(index, 1);
    setContestants(updated);
  };

  return (
    <div className="border p-6 rounded-lg shadow-md bg-gray-50 space-y-4">
      <h2 className="text-2xl font-bold text-indigo-600 border-b pb-2">
        {registration.eventName}
      </h2>

      <div className="flex flex-col gap-2">
        <label className="font-semibold">Team Name:</label>
        <input
          type="text"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          className="border rounded px-3 py-1 w-full"
        />

        <label className="font-semibold">Event Name:</label>
        <input
          type="text"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          className="border rounded px-3 py-1 w-full"
        />
      </div>

      <div className="mt-2">
        <label className="font-semibold">Contestants:</label>
        <div className="space-y-2 mt-1">
          {contestants.map((c, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="Name"
                value={c.contestantName}
                onChange={(e) => handleContestantChange(idx, "contestantName", e.target.value)}
                className="border rounded px-2 py-1 flex-1"
              />
              <input
                type="text"
                placeholder="DNo"
                value={c.dNo}
                onChange={(e) => handleContestantChange(idx, "dNo", e.target.value)}
                className="border rounded px-2 py-1 w-24"
              />
              <button
                className="text-red-500 font-bold"
                onClick={() => removeContestant(idx)}
              >
                ❌
              </button>
            </div>
          ))}
        </div>
        <button
          className="mt-2 text-blue-600 font-semibold"
          onClick={addContestant}
        >
          + Add Contestant
        </button>
      </div>

      <button
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        onClick={() => onSave(registration._id, { teamName, eventName, contestants })}
      >
        Save Changes
      </button>
    </div>
  );
}
