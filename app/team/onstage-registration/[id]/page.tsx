"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

type ContestantForm = { name: string; dno: string };

export default function page() {
  const { id } = useParams();

  const [teamName, setTeamName] = useState<string>("");
  const [teamId, setTeamId] = useState<string>("");
  const [eventName, setEventName] = useState<string>("");
  const [contestantCount, setcontestantCount] = useState("")
  const [offStageOrOnStage, setoffStageOrOnStage] = useState("")


  const [registeredData, setregisteredData] = useState("");

  const [contestants, setContestants] = useState<ContestantForm[]>([
    { name: "", dno: "" },
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (!id) return;

    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events/${id}`, {
          method: "GET",
          cache: "no-cache",
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(
            errorData.message || `HTTP ${res.status}: Failed to load event data`
          );
        }

        const data = await res.json();
        const event = data.event || {};
        setEventName(event.title || "");
        console.log(data.event.stageType)
        setoffStageOrOnStage(data.event.stageType);
      } catch (err: any) {
        console.error("Error fetching event data:", err);
        setMessage("Failed to load event data.");
      }
    };

    fetchEvent();
  }, [id]);

  useEffect(() => {
    if (!teamId) return;
    if (!teamName) return;

    console.log("this req sent")
    const fetchEvent = async () => {
      try {
        const res = await axios.post("/api/get-onstage-registration", {
          teamId,
          eventName,
        });

        console.log(res.data)
        // setContestants(res.data.registeredData.contestants)
        setregisteredData("");
      } catch (err) {
        console.error("Error fetching event data:", err);
        setMessage("Failed to load event data.");
      }
    };

    fetchEvent();
  }, [teamName, teamId]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me", {
          method: "GET",
          cache: "no-cache",
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(
            errorData.message || `HTTP ${res.status}: Failed to load user data`
          );
        }

        const data = await res.json();
        const teamName = data.team?.teamName || "";
        const teamId = data.team?.teamId || "";

        setTeamName(teamName);
        setTeamId(teamId);
      } catch (err) {
        console.error("Error fetching user data:", err);
        // keep UX quiet unless you want to surface this
      }
    };

    fetchUser();
  }, []);

  const updateContestant = (index: number, key: keyof ContestantForm, value: string) => {
    setContestants((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [key]: value } : c))
    );
  };

  const addContestant = () => setContestants((p) => [...p, { name: "", dno: "" }]);
  const removeContestant = (index: number) =>
    setContestants((p) => (p.length > 1 ? p.filter((_, i) => i !== index) : p));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!teamName.trim() || !teamId.trim() || !eventName.trim()) {
      setMessage("Please fill Team Name, Team ID and Event Name.");
      return;
    }

    for (let i = 0; i < contestants.length; i++) {
      if (!contestants[i].name.trim() || !contestants[i].dno.trim()) {
        setMessage(`Please fill all contestant fields (row ${i + 1}).`);
        return;
      }
    }

    // transform contestants to backend shape { contestantName, dNo }
    const transformedContestants = contestants.map((c) => ({
      contestantName: c.name.trim(),
      dNo: c.dno.trim(),
    }));

    const payload = {
      teamId: teamId.trim(),
      teamName: teamName.trim(),
      eventName: eventName.trim(),
      contestants: transformedContestants,
    };

    try {
      setLoading(true);
      const res = await fetch("/api/onStage-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || "Server error");
      console.log(json.success)
      setMessage(json?.message || "Registered successfully");
      setContestants([{ name: "", dno: "" }]);
    } catch (err: any) {
      console.error(err);
      setMessage(typeof err === "string" ? err : err?.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4 text-center">On-Stage Registration</h2>


      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Team Name</label>
          <input
            value={teamName}
            readOnly
            className="w-full px-3 py-2 border rounded"
            placeholder="Testing Team"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Team ID</label>
          <input
            value={teamId}
            readOnly
            className="w-full px-3 py-2 border rounded"
            placeholder="25ITE01"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Event Name</label>
          <input
            value={eventName}
            readOnly
            className="w-full px-3 py-2 border rounded"
            placeholder="Group Dance"
          />
        </div>

        <div>
          <label className="block text-sm mb-2">Contestants</label>
          <div className="space-y-2">
            {contestants.map((c, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={c.name}
                  onChange={(e) => updateContestant(i, "name", e.target.value)}
                  placeholder={`Name ${i + 1}`}
                  className="flex-1 px-2 py-2 border rounded"
                />
                <input
                  value={c.dno}
                  onChange={(e) => updateContestant(i, "dno", e.target.value)}
                  placeholder="D-No"
                  className="w-24 px-2 py-2 border rounded"
                />
                <button
                  type="button"
                  onClick={() => removeContestant(i)}
                  className="px-2 py-1 rounded border"
                >
                  X
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addContestant}
              className="mt-1 px-3 py-2 rounded border"
            >
              Add Contestant
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded bg-indigo-600 text-white disabled:opacity-60"
        >
          {loading ? "Submitting..." : "Register"}
        </button>
      </form>
    </div>
  );
}
