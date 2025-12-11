"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Loader2,
    FileText,
    ExternalLink,
    FolderOpen,
    AlertCircle,
    LayoutDashboard,
    Building2,
    LogOut
} from "lucide-react";
import ForcePasswordChange from "@/components/TeamsDashboard/ForcePasswordChange";
import OnstageTeamDashboard from "@/components/TeamsDashboard/OnstageTeamDashboard";
import axios from "axios";

export default function TeamDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [teamData, setTeamData] = useState<any>(null);
    const [teamId, setTeamId] = useState("");
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
            <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
                <p className="text-slate-500 text-sm font-medium animate-pulse">Loading Dashboard...</p>
            </div>
        );

    // Force Password Change Check
    if (!teamData?.isPasswordChanged)
        return <ForcePasswordChange onPasswordUpdated={() => router.push("/login")} />;

    return (
        <div className="min-h-screen bg-slate-50/50 pb-12 font-sans">
            {/* Header Section */}
            <div className="bg-white border-b border-slate-200 rounded-2xl top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 hidden sm:block">
                                <LayoutDashboard className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                                    Team Dashboard
                                </h1>
                                <p className="text-slate-500 text-sm mt-0.5">
                                    Welcome back, <span className="font-semibold text-indigo-600">{teamData?.teamName}</span>
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
                            <div className="text-xs font-mono bg-indigo-500 text-gray-100 px-3 py-1.5 rounded-md border border-slate-200 truncate max-w-[200px]">
                                ID: <span className="select-all text-gray-100 font-semibold">{teamData?.teamId}</span>
                            </div>
                            {/* Optional Logout placeholder if needed */}
                            {/* <button className="p-2 text-slate-400 hover:text-red-500 transition-colors md:hidden">
                                <LogOut size={20} />
                            </button> */}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">

                {/* Quick Actions Grid (Commented out but responsive structure preserved) */}
                {/* <section>
                    <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        Quick Actions
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div onClick={() => router.push("registration/director/...")} ... className="cursor-pointer ...">
                             ... content ...
                        </div>
                        
                        {driveLink ? (
                             <a href={driveLink} ... className="block ..."> ... </a>
                        ) : (
                             <div className="..."> ... </div>
                        )}
                    </div>
                </section> 
                */}

                {/* Dashboard Content */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between px-1 sm:px-0">
                        <h2 className="text-lg font-bold text-slate-800 tracking-tight">
                            Event Overview
                        </h2>
                        {/* You could add a 'Refresh' button here if needed */}
                    </div>

                    {/* Responsive Wrapper:
                        - On mobile: minimal padding (p-2) so cards go nearly full width.
                        - On desktop: larger padding (p-6) for a boxed look.
                    */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden p-2 sm:p-6 transition-all">
                        <OnstageTeamDashboard
                            teamId={teamData.teamId}
                            teamName={teamData.teamName}
                        />
                    </div>
                </section>
            </div>
        </div>
    );
}