"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Loader2,
    FileText,
    ExternalLink,
    FolderOpen,
    AlertCircle,
    LayoutDashboard
} from "lucide-react";
import ForcePasswordChange from "@/components/TeamsDashboard/ForcePasswordChange";
import OffstageTeamDashboard from "@/components/TeamsDashboard/OffstageTeamDashboard";
import axios from "axios";

export default function TeamDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [teamData, setTeamData] = useState<any>(null);
    const [teamId, setTeamId] = useState("");
    // const [registrations, setRegistrations] = useState<any[]>([]); 
    const [driveLink, setDriveLink] = useState<string | null>(null);

    const fetchDashboardData = async () => {
        try {
            const meRes = await fetch("/api/me");
            const meData = await meRes.json();

            if (!meData.success) {
                router.push("/login");
                return;
            }

            const team = meData.team;
            setTeamData(team);
            setTeamId(team.teamId);

            // Fetch registrations if needed
            if (team.teamId) {
                const eventsRes = await fetch(`/api/events/get-by-team?teamId=${team.teamId}`);
                const eventsData = await eventsRes.json();
                // if (eventsData.success) setRegistrations(eventsData.registrations);
            }

        } catch (error) {
            console.error("Failed to load dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    useEffect(() => {
        if (!teamId) return;

        const fetchLink = async () => {
            try {
                const res = await axios.get(`/api/upload-links/${teamId}`);
                const data = res.data;
                if (data.success) {
                    setDriveLink(data.drivelink);
                }
            } catch (err) {
                console.error("Error fetching drive link", err);
            }
        };
        fetchLink();
    }, [teamId]);

    if (loading)
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
                <p className="text-gray-500 text-sm font-medium animate-pulse">Loading Dashboard...</p>
            </div>
        );

    // Force Password Change Check
    if (!teamData?.isPasswordChanged)
        return <ForcePasswordChange onPasswordUpdated={() => router.push("/login")} />;

    return (
        <div className="min-h-screen bg-gray-50/50 pb-12">
            {/* Header Section */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <LayoutDashboard className="w-6 h-6 text-indigo-600" />
                                Team Dashboard
                            </h1>
                            <p className="text-gray-500 mt-1">
                                Welcome back, <span className="font-semibold text-indigo-600">{teamData?.teamName}</span>
                            </p>
                        </div>
                        <div className="text-sm text-gray-400 font-mono bg-gray-100 px-3 py-1 rounded-md self-start md:self-center">
                            ID: {teamData?.teamId}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* Quick Actions Grid */}
                <section>
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* Action Card 1: Director Entry */}
                        <div
                            onClick={() => router.push("registration/director/692bdcc333d496ae7261cc25")}
                            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Submit Director Entry</h3>
                                        <p className="text-sm text-gray-500 mt-1">Register for the INDEP Director event</p>
                                    </div>
                                </div>
                                <ExternalLink className="w-5 h-5 text-gray-300 group-hover:text-indigo-600 transition-colors" />
                            </div>
                        </div>

                        {/* Action Card 2: Drive Link */}
                        {driveLink ? (
                            <a
                                href={driveLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-green-200 transition-all cursor-pointer group block"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-green-50 text-green-600 rounded-lg group-hover:bg-green-600 group-hover:text-white transition-colors">
                                            <FolderOpen className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Team Drive Folder</h3>
                                            <p className="text-sm text-gray-500 mt-1">Access your shared files and uploads</p>
                                        </div>
                                    </div>
                                    <ExternalLink className="w-5 h-5 text-gray-300 group-hover:text-green-600 transition-colors" />
                                </div>
                            </a>
                        ) : (
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 border-dashed flex items-center gap-4 opacity-75">
                                <div className="p-3 bg-gray-200 text-gray-400 rounded-lg">
                                    <AlertCircle className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-500">No Drive Link</h3>
                                    <p className="text-sm text-gray-400 mt-1">A drive link has not been assigned yet.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* Dashboard Content */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-800">Event Overview</h2>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden px-6 py-4">
                        <OffstageTeamDashboard
                            teamId={teamData.teamId}
                            teamName={teamData.teamName}
                        />
                    </div>
                </section>
            </div>
        </div>
    );
}