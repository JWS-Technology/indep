"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import ForcePasswordChange from "@/components/TeamsDashboard/ForcePasswordChange";
// Import the new component
import TeamRegistrationView from "@/components/TeamsDashboard/TeamRegistrationView";
import TeamFilesWidget from "@/components/TeamsDashboard/TeamFilesWidget";
export default function TeamDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [teamData, setTeamData] = useState<any>(null);
    const [registrations, setRegistrations] = useState<any[]>([]); // State for the events list

    const fetchDashboardData = async () => {
        try {
            // 1. Get Logged-in Team Details
            const meRes = await fetch("/api/me");
            const meData = await meRes.json();

            if (!meData.success) {
                router.push("/login");
                return;
            }

            const team = meData.team;
            setTeamData(team);

            // 2. If we have a Team ID, fetch their registered events
            // Assuming your team object has a 'teamId' or '_id' field used for linking
            // Adjust 'team.teamId' below to match your actual database field name for the ID
            if (team.teamId) {
                const eventsRes = await fetch(`/api/events/get-by-team?teamId=${team.teamId}`);
                const eventsData = await eventsRes.json();
                console.log(eventsData)
                if (eventsData.success) {
                    setRegistrations(eventsData.registrations);
                }
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

    if (loading)
        return (
            <div className="h-[80vh] flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
            </div>
        );

    // Force Password Change Check
    if (!teamData?.isPasswordChanged)
        return <ForcePasswordChange onPasswordUpdated={() => router.push("/login")} />;
    return (
        <div className="max-w-7xl mx-auto pb-10 px-4 sm:px-6 lg:px-8">
            {/* Simply pass the data to the new component */}
            <div className="my-6">
                <button
                    onClick={() =>
                        router.push("registration/director/692bdcc333d496ae7261cc25")
                    }
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                    Submit INDEP Director Entry
                </button>
            </div>
            <TeamFilesWidget />

            {/* <TeamRegistrationView
                teamName={teamData.teamName}
                registrations={registrations}
            /> */}
        </div>
    );
}
