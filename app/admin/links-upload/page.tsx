"use client";

import axios from "axios";
import { useEffect, useState } from "react";

const Page = () => {
    const [teams, setTeams] = useState<any[]>([]);
    const [teamId, setTeamId] = useState("");
    const [drivelink, setDrivelink] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const res = await fetch("/api/team");
                const data = await res.json();
                console.log(data.teams);
                if (data.success) {
                    const sorted = [...data.teams].sort((a, b) =>
                        a.teamId.localeCompare(b.teamId)
                    );
                    setTeams(sorted);
                }
            } catch (err) {
                console.log("Error Fetching teams:", err);
            }
        };

        fetchTeams();
    }, []);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setMessage("");
        try {
            const res = await axios.post("/api/upload-links", {
                teamId,
                drivelink,
            });

            console.log(res.data);
            if (res.data.success) {
                setMessage("Drive Link saved successfully!");
                setTeamId("");
                setDrivelink("");
            } else {
                setMessage(res.data.message || "Failed to save");
            }
        } catch (err) {
            console.error(err);
            setMessage("Something went wrong");
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-xl shadow">
            <h1 className="text-2xl font-semibold mb-4">Upload Drive Link</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Dropdown */}
                <div>
                    <label className="block text-sm font-medium mb-1">Select Team</label>
                    <select
                        value={teamId}
                        onChange={(e) => setTeamId(e.target.value)}
                        className="w-full p-2 border rounded-md"
                        required
                    >
                        <option value="">-- Select Team --</option>
                        {teams.map((team) => (
                            <option key={team.teamId} value={team.teamId}>
                                {team.teamId} — {team.teamName}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Drive Link Input */}
                <div>
                    <label className="block text-sm font-medium mb-1">Drive Link</label>
                    <input
                        type="text"
                        placeholder="Enter Google Drive link"
                        value={drivelink}
                        onChange={(e) => setDrivelink(e.target.value)}
                        className="w-full p-2 border rounded-md"
                        required
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium"
                >
                    Save Link
                </button>

                {/* Status Message */}
                {message && (
                    <p className="text-center text-sm text-green-600 mt-2">{message}</p>
                )}
            </form>
        </div>
    );
};

export default Page;
