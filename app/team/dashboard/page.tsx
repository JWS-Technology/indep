"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import ForcePasswordChange from "@/components/TeamsDashboard/ForcePasswordChange";
import UserCreationSection from "@/components/TeamsDashboard/UserCreationSection";

export default function TeamDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [teamData, setTeamData] = useState<any>(null);

    const fetchTeamStatus = async () => {
        try {
            const res = await fetch("/api/me");
            const data = await res.json();

            if (!data.success) return router.push("/login");
            setTeamData(data.team);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeamStatus();
    }, []);

    if (loading)
        return (
            <div className="h-[80vh] flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
            </div>
        );

    if (!teamData?.isPasswordChanged)
        return <ForcePasswordChange onPasswordUpdated={() => router.push("/login")} />;

    return (
        <div className="space-y-8">
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-8 rounded-2xl text-white shadow-lg">
                <h1 className="text-3xl font-bold">User Creation - {teamData.teamName}</h1>
                <p className="opacity-80">Create your Team Manager and Secretary</p>
            </div>

            <UserCreationSection teamData={teamData} refresh={fetchTeamStatus} />
        </div>
    );
}
