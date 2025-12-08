"use client";

import { useEffect, useState } from "react";
import {
    Search,
    Folder,
    FileAudio,
    FileImage,
    FileText,
    Music2,
} from "lucide-react";

interface FileItem {
    name: string;
    url: string;
}

interface EventFiles {
    event: string;
    files: FileItem[];
}

export default function TeamMyFiles() {
    const [team, setTeam] = useState<any>(null);
    const [data, setData] = useState<EventFiles[]>([]);
    const [filtered, setFiltered] = useState<EventFiles[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    /** ------------------------------------------
     *  FETCH TEAM DETAILS (/api/me)
     -------------------------------------------*/
    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const res = await fetch("/api/me");
                const json = await res.json();

                if (json.success && json.team) {
                    setTeam(json.team);
                }
            } catch (err) {
                console.error("Failed to load team data", err);
            }
        };

        fetchTeam();
    }, []);

    /** ------------------------------------------
     * FETCH FILES AFTER TEAM INFO IS LOADED
     -------------------------------------------*/
    useEffect(() => {
        if (team?.teamId) {
            fetchFiles(team.teamId);
        }
    }, [team]);

    const fetchFiles = async (teamId: string) => {
        try {
            setLoading(true);

            const res = await fetch("/api/team-files", {
                method: "POST",
                body: JSON.stringify({ teamId }),
            });

            const json = await res.json();

            setData(json.files || []);
            setFiltered(json.files || []);
        } catch (e) {
            console.error("File fetch failed", e);
        } finally {
            setLoading(false);
        }
    };

    /** ------------------------------------------
     * SEARCH FILTER
     -------------------------------------------*/
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFiltered(data);
            return;
        }

        const term = searchTerm.toLowerCase();

        const filteredData = data
            .map((ev) => ({
                ...ev,
                files: ev.files.filter((f) =>
                    f.name.toLowerCase().includes(term)
                )
            }))
            .filter((ev) => ev.files.length > 0);

        setFiltered(filteredData);
    }, [searchTerm, data]);

    /** ------------------------------------------
     * FILE ICONS
     -------------------------------------------*/
    const getFileIcon = (name: string) => {
        const ext = (name.split(".").pop() || "").toLowerCase();

        if (["mp3", "wav", "m4a", "mpeg"].includes(ext))
            return <FileAudio className="w-5 h-5 text-blue-600" />;

        if (["jpg", "jpeg", "png"].includes(ext))
            return <FileImage className="w-5 h-5 text-green-600" />;

        return <FileText className="w-5 h-5 text-gray-600" />;
    };

    /** ------------------------------------------
     * LOADING UI
     -------------------------------------------*/
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg text-gray-600">Loading your files...</p>
            </div>
        );
    }

    /** ------------------------------------------
     * MAIN UI
     -------------------------------------------*/
    return (
        <div className="min-h-screen bg-gray-50 py-8 px-6">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-4xl font-bold text-gray-900">Uploaded Files</h1>
                    <p className="text-gray-600 mt-2 text-lg">
                        Check your files
                    </p>
                </div>

                {/* Search */}
                {/* <div className="bg-white p-4 rounded-xl shadow-md border mb-8">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search files..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div> */}

                {/* File List */}
                <div className="space-y-10">
                    {filtered.map((ev) => (
                        <div key={ev.event} className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition">

                            <div className="flex items-center gap-3 mb-4">
                                <Folder className="w-6 h-6 text-blue-600" />
                                <h2 className="text-2xl font-semibold">{ev.event}</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                                {ev.files.map((file) => (
                                    <div
                                        key={file.name}
                                        className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition cursor-pointer"
                                    >
                                        {getFileIcon(file.name)}

                                        <a
                                            href={file.url}
                                            target="_blank"
                                            className="flex-1 text-[0.7rem] md:text-sm text-gray-800 break-words hover:text-blue-600 font-medium"
                                        >
                                            {file.name}
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {filtered.length === 0 && (
                        <div className="text-center text-gray-500 mt-20">
                            <Music2 className="h-10 w-10 mx-auto mb-3 opacity-50" />
                            <p className="text-lg">No files found for your team.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
