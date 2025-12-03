"use client";

import React, { useState } from "react";

export default function Page() {
  const [formData, setFormData] = useState({
    eventName: "",
    teamName: "",
    songTitle: "",
    tune: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Registration failed");

      setSuccess("Registration successful!");
      setFormData({
        eventName: "",
        teamName: "",
        songTitle: "",
        tune: "",
      });
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
            value={formData.eventName}
            onChange={handleChange}
            required
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
            value={formData.teamName}
            onChange={handleChange}
            required
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

        {/* Status Messages */}
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
