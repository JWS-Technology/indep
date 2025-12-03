"use client";

import { Navbar } from "@/components/TeamsDashboard/Navbar";
import { Sidebar } from "@/components/TeamsDashboard/Sidebar";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [teamData, setTeamData] = useState<any>(null);
    const [data, setdata] = useState()
    const fetchTeamStatus = async () => {
        try {
            const res = await fetch("/api/me");
            const data = await res.json();

            if (!data.success) return router.push("/login");
            setTeamData(data.team);
            console.log(data)
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchTeamStatus();
    }, []);
    console.log("team", teamData)

    return (
        <div className="min-h-screen bg-gray-50/50 flex">
            <Sidebar open={open} setOpen={setOpen} />
            <div className="flex-1 flex flex-col md:ml-64 min-h-screen transition-all duration-300">
                <Navbar setOpen={setOpen} teamName={teamData?.teamName} />
                <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
                    {children}
                </main>
            </div>
        </div>
    );
}