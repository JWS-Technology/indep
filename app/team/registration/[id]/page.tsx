"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function Page() {


  const [teamName, setteamName] = useState<any>(null);
  const [teamId, setteamId] = useState<any>(null);
  const [eventName, seteventName] = useState<any>(null);
  const [userLoading, setUserLoading] = useState(true); // NEW
  const [userError, setUserError] = useState(""); // NEW

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // NEW: eventId state (store id from params)
  const [eventId, setEventId] = useState<string | null>(null);
  const params = useParams();

  const [formData, setFormData] = useState({
    eventName: "",
    teamName: "",
    songTitle: "",
    tune: "",
  });

  // ----------------------------------------------------------
  // FETCH USER DATA ON PAGE LOAD
  // ----------------------------------------------------------
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me", { method: "GET" });
        if (!res.ok) throw new Error("Failed to load user data");

        const data = await res.json();
        const teamName = data.team.teamName;
        const teamId = data.team.teamId;
        setteamName(teamName);
        setteamId(teamId)
      } catch (err: any) {
        setUserError(err.message || "Something went wrong");
      } finally {
        setUserLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/events/${eventId}`, { method: "GET" });
        if (!res.ok) throw new Error("Failed to load user data");

        const data = await res.json();
        seteventName(data.event.title)
      } catch (err: any) {
        setUserError(err.message || "Something went wrong");
      } finally {
        setUserLoading(false);
      }
    };

    fetchUser();
  }, [eventId]);

  // Put params id into eventId state
  useEffect(() => {
    // params can be undefined in some environments; guard it
    try {
      const incoming = (params as any)?.id;
      const resolved = Array.isArray(incoming) ? incoming[0] : incoming ?? null;
      setEventId(resolved);
    } catch {
      setEventId(null);
    }
  }, [params]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const payload = {
        eventId: eventId,        // <-- include the event id
        eventName: eventName,    // from fetched event
        teamName: teamName,      // from /api/me
        teamId: teamId,      // from /api/me
        songTitle: formData.songTitle,
        tune: formData.tune,
      };

      const res = await fetch("/api/event-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Registration failed");

      setSuccess("Registration successful!");

      // Reset only editable fields
      setFormData({
        eventName: "",
        teamName: "",
        songTitle: "",
        tune: "",
      });
      window.location.href = "/team/dashboard";
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };





  return (
    <div className="min-h-screen p-8 flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg border"
      >
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Event Registration</h1>



        {/* Event Name */}
        <div className="mb-4">
          <label className="block font-medium text-gray-700 mb-1">Event Name *</label>
          <input
            type="text"
            name="eventName"
            value={eventName ? eventName : "loading"}
            // onChange={handleChange}
            required
            readOnly
            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter event name"
          />
        </div>

        {/* Team Name */}
        <div className="mb-4">
          <label className="block font-medium text-gray-700 mb-1">Team Name *</label>
          <input
            type="text"
            name="teamName"
            value={teamName ?? formData.teamName}
            onChange={handleChange}
            required
            readOnly
            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter team/participant name"
          />
        </div>

        {/* Song Title */}
        <div className="mb-4">
          <label className="block font-medium text-gray-700 mb-1">Song Title</label>
          <input
            type="text"
            name="songTitle"
            value={formData.songTitle}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter song title"
          />
        </div>

        {/* Tune */}
        <div className="mb-6">
          <label className="block font-medium text-gray-700 mb-1">Tune</label>
          <input
            type="text"
            name="tune"
            value={formData.tune}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter tune"
          />
        </div>

        {/* Status */}
        {success && <p className="text-green-600 mb-3">{success}</p>}
        {error && <p className="text-red-600 mb-3">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
        >
          {loading ? "Submitting..." : "Submit Registration"}
        </button>
      </form>
    </div>
  );
}
