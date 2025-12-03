"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import ForcePasswordChange from "@/components/TeamsDashboard/ForcePasswordChange";
// Import the new component
import TeamRegistrationView from "@/components/TeamsDashboard/TeamRegistrationView";

export default function TeamDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [teamData, setTeamData] = useState<any>(null);

    // --- MOCK DATA ---
    const registrations = [
        {
            _id: "6541",
            eventName: "Western Singing",
            teamName: "Titans",
            songTitle: "My Heart Will Go On",
            tune: "Original Key (E Major)",
            registrationDate: "2024-10-01T10:00:00Z",
            status: "Pending",
            remarks: "Under review",
        },
        {
            _id: "6542",
            eventName: "Group Song (Indian)",
            teamName: "Titans",
            songTitle: "Jai Ho",
            tune: "Acoustic Version",
            registrationDate: "2024-10-02T14:30:00Z",
            status: "Approved",
            remarks: "Good to go",
        },
        {
            _id: "6543",
            eventName: "Folk Dance",
            teamName: "Titans",
            songTitle: "Ghoomar",
            tune: "Traditional Rajasthan Folk",
            registrationDate: "2024-10-05T09:15:00Z",
            status: "Correction Needed",
            remarks: "Song duration exceeds 5 minutes",
        },
        {
            _id: "6544",
            eventName: "Western Dance",
            teamName: "Titans",
            songTitle: "Uptown Funk",
            tune: "Remix V2",
            registrationDate: "2024-10-06T11:20:00Z",
            status: "Rejected",
            remarks: "Tune already taken by another team",
        },
    ];

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
        return (
            <ForcePasswordChange onPasswordUpdated={() => router.push("/login")} />
        );

    return (
        <div className="max-w-7xl mx-auto pb-10 px-4 sm:px-6 lg:px-8">
            {/* Simply pass the data to the new component */}
            <TeamRegistrationView
                teamName={teamData.teamName}
                registrations={registrations}
            />
        </div>
    );
}
