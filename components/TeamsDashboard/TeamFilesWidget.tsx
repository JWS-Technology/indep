"use client";

import { useEffect, useState } from "react";
import { Folder, FileText, FileImage, FileAudio, ArrowRight } from "lucide-react";

interface FileItem {
    name: string;
    url: string;
}

export default function TeamFilesWidget() {
    const [team, setTeam] = useState<any>(null);
    const [latestFiles, setLatestFiles] = useState<FileItem[]>([]);
    const [loading, setLoading] = useState(true);

    /** GET TEAM DETAILS */
    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const res = await fetch("/api/me");
                const json = await res.json();
                if (json.success && json.team) setTeam(json.team);
            } catch (err) {
                console.error("Failed to load team", err);
            }
        };
        fetchTeam();
    }, []);

    /** FETCH FILES */
    useEffect(() => {
        if (team?.teamId) loadFiles(team.teamId);
    }, [team]);

    const loadFiles = async (teamId: string) => {
        try {
            const res = await fetch("/api/team-files", {
                method: "POST",
                body: JSON.stringify({ teamId }),
            });
            const json = await res.json();

            const allFiles: FileItem[] = [];
            json.files?.forEach((eventBlock: any) => {
                eventBlock.files.forEach((f: FileItem) => allFiles.push(f));
            });

            setLatestFiles(allFiles.slice(0, 3)); // Top 3
        } catch (err) {
            console.error("File load failed", err);
        } finally {
            setLoading(false);
        }
    };

    /** FILE ICON HANDLER */
    const getIcon = (file: string) => {
        const ext = file.split(".").pop()?.toLowerCase() || "";

        if (["mp3", "wav", "m4a"].includes(ext))
            return <FileAudio className="w-5 h-5 text-blue-600 shrink-0" />;
        if (["jpg", "jpeg", "png"].includes(ext))
            return <FileImage className="w-5 h-5 text-green-600 shrink-0" />;

        return <FileText className="w-5 h-5 text-gray-600 shrink-0" />;
    };

    if (loading) {
        return (
            <div className="p-4 md:p-6 bg-white rounded-xl shadow-md border">
                <p className="text-gray-500 text-sm md:text-base">Loading files...</p>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 bg-white rounded-xl shadow-md border w-full">
            {/* Title */}
            <h2 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
                <Folder className="w-5 h-5 text-blue-600" />
                Latest Uploaded Files
            </h2>

            {/* File List */}
            {latestFiles.length === 0 ? (
                <p className="text-gray-500 text-sm md:text-base">No files uploaded yet.</p>
            ) : (
                <div className="space-y-3">
                    {latestFiles.map((file, idx) => (
                        <a
                            key={idx}
                            href={file.url}
                            target="_blank"
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition w-full"
                        >
                            {getIcon(file.name)}

                            <span
                                className="text-xs md:text-sm text-gray-800 break-all line-clamp-2"
                            >
                                {file.name}
                            </span>
                        </a>
                    ))}
                </div>
            )}

            {/* View All Button */}
            <div className="mt-4 text-right">
                <a
                    href="/team/my-files"
                    className="inline-flex items-center text-blue-600 font-medium text-sm md:text-base hover:underline"
                >
                    View All
                    <ArrowRight className="w-4 h-4 ml-1" />
                </a>
            </div>
        </div>
    );
}
