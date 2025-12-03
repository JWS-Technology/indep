"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [data, setData] = useState(null);
  const [teams, setTeams] = useState([]);       // 👈 NEW STATE
  console.log(teams);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch Event
  useEffect(() => {
    if (!id) return;

    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/event/${id}`);
        if (!res.ok) throw new Error("Failed to fetch event");
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchEvent();
  }, [id]);

  // Fetch Teams
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await fetch(`/api/team`); // 👈 YOUR TEAM API
        if (!res.ok) throw new Error("Failed to fetch teams");

        const json = await res.json();
        setTeams(json.teams || []); // 👈 expecting { teams: [...] }
      } catch (err: any) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl text-red-600">
        Missing ID
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10">

      {/* Event Title */}
      <h1 className="text-4xl font-bold text-center mb-10">
        {data?.event?.title || "No Title Found"}
      </h1>

      {/* Lot / Theme / Team Table */}
      <div className="w-full max-w-4xl mx-auto">
        <table className="w-full border border-slate-300 rounded-lg overflow-hidden">
          <thead className="bg-slate-800 text-white">
            <tr>
              <th className="p-3 text-left">Lot</th>
              <th className="p-3 text-left">Theme</th>
              <th className="p-3 text-left">Team</th>
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: 28 }).map((_, i) => (
              <tr key={i} className="border-t border-slate-300">
                <td className="p-3">{i + 1}</td>
                <td className="p-3">{i + 1}</td>

                {/* Print Teams Count For Now */}
                <td className="p-3">
                  {teams.length > 0 ? `${teams.length} teams loaded` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
