"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function INDEPDirectorPage() {
    const params = useParams();
    const eventId = Array.isArray(params?.id) ? params.id[0] : params?.id;

    const [eventName, setEventName] = useState("");

    // submission state
    const [title, setTitle] = useState("");
    const [youtubeLink, setYoutubeLink] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const [previoslySubmitted, setPrevioslySubmitted] = useState(false);
    const [submissionId, setSubmissionId] = useState("");

    const [teamId, setTeamId] = useState("");

    // -------------------------------------------------------
    // Fetch logged in user team ID
    // -------------------------------------------------------
    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const res = await fetch("/api/me");
                const data = await res.json();

                setTeamId(data.team.teamId);
            } catch (err) {
                console.log("Failed loading team");
            }
        };

        fetchTeam();
    }, []);

    // -------------------------------------------------------
    // Fetch Event Details
    // -------------------------------------------------------
    useEffect(() => {
        if (!eventId) return;

        const fetchEvent = async () => {
            try {
                const res = await fetch(`/api/events/${eventId}`);
                const data = await res.json();

                if (!res.ok) throw new Error(data.error);

                setEventName(data.event.title);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [eventId]);

    // -------------------------------------------------------
    // Fetch Previous Submission
    // -------------------------------------------------------
    useEffect(() => {
        if (!teamId || !eventId) return;

        const fetchPrev = async () => {
            try {
                const res = await fetch("/api/director-submission/get", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ eventId, teamId }),
                });

                const data = await res.json();
                console.log("data", data)

                if (data.submission) {
                    setPrevioslySubmitted(true);
                    setSubmissionId(data.submission._id);

                    setTitle(data.submission.title);
                    setYoutubeLink(data.submission.youtubeLink);
                }
            } catch (err) {
                console.log("Failed to load previous submission");
            }
        };

        fetchPrev();
    }, [teamId, eventId]);

    // -------------------------------------------------------
    // Submit / Update
    // -------------------------------------------------------
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setSuccess("");
        setError("");

        try {
            const payload: any = {
                eventId,
                teamId,
                title,
                youtubeLink,
            };
            console.log("payload", payload)
            let method = "POST";
            let url = "/api/director-submission";

            if (previoslySubmitted && submissionId) {
                method = "PATCH";
                payload.submissionId = submissionId;
            }

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await res.json();

            if (!res.ok) throw new Error(result.error);

            setSuccess(
                previoslySubmitted
                    ? "Submission updated successfully!"
                    : "Submission saved successfully!"
            );
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-8 flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-lg bg-white p-6 rounded-xl shadow-lg border"
            >
                <h1 className="text-2xl font-bold mb-6 text-gray-800">
                    INDEP Director Submission
                </h1>

                {previoslySubmitted && (
                    <p className="mb-4 p-3 bg-yellow-100 text-yellow-700 rounded">
                        You have already submitted. You can update the details below.
                    </p>
                )}

                {/* Event */}
                <div className="mb-4">
                    <label className="block font-medium text-gray-700 mb-1">
                        Event Name
                    </label>
                    <input
                        value={eventName || "Loading..."}
                        readOnly
                        className="w-full border rounded-lg px-3 py-2 bg-gray-100"
                    />
                </div>

                {/* Title */}
                <div className="mb-4">
                    <label className="block font-medium text-gray-700 mb-1">
                        Title *
                    </label>
                    <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2"
                        placeholder="Enter the title of the film"
                    />
                </div>

                {/* YouTube Link */}
                <div className="mb-6">
                    <label className="block font-medium text-gray-700 mb-1">
                        YouTube Link *
                    </label>
                    <input
                        type="text"
                        required
                        value={youtubeLink}
                        onChange={(e) => setYoutubeLink(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2"
                        placeholder="https://youtube.com/watch?v=..."
                    />
                </div>

                {success && <p className="text-green-600 mb-3">{success}</p>}
                {error && <p className="text-red-600 mb-3">{error}</p>}

                <button
                    disabled={saving}
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-60"
                >
                    {saving
                        ? "Saving..."
                        : previoslySubmitted
                            ? "Update Submission"
                            : "Submit"}
                </button>
            </form>
        </div>
    );
}
