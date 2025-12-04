"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Calendar,
    Users,
    Clock,
    TrendingUp,
    MoreVertical,
    ArrowRight,
    Loader2
} from "lucide-react";

export default function CoordinatorDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [coordinator, setCoordinator] = useState<any>(null);

    // Mock data for the chart/stats (replace with real API calls later)
    const stats = [
        { label: "Assigned Events", value: coordinator?.assignedEvents?.length || 0, icon: Calendar, color: "bg-blue-500" },
        { label: "Total Registrations", value: 124, icon: Users, color: "bg-purple-500" }, // Mock
        { label: "Pending Approvals", value: 12, icon: Clock, color: "bg-orange-500" },   // Mock
        { label: "Completion Rate", value: "85%", icon: TrendingUp, color: "bg-emerald-500" }, // Mock
    ];

    useEffect(() => {
        // Fetch current coordinator details
        const fetchProfile = async () => {
            try {
                // Assuming you have an endpoint that returns the logged-in user's info based on the cookie
                // You might need to create a specific /api/coordinator/me endpoint
                // or ensure /api/me handles the coordinator role correctly.
                const res = await fetch("/api/me");
                const data = await res.json();

                if (!res.ok) {
                    router.push("/coordinator/login");
                    return;
                }

                // Basic check to ensure it's a coordinator
                if (data.role !== 'coordinator') {
                    // Handle unauthorized or redirect
                }

                setCoordinator(data.user || data.coordinator); // Adjust based on your API response structure
            } catch (error) {
                console.error("Failed to load profile", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [router]);

    if (loading) {
        return (
            <div className="h-[80vh] flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                        Welcome back, {coordinator?.name?.split(' ')[0] || 'Coordinator'}! 👋
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Here is what's happening with your assigned events today.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 shadow-sm">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                                    <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
                                </div>
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg shadow-opacity-20 ${stat.color}`}>
                                    <Icon size={24} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                {/* Assigned Events List */}
                <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-slate-900">Your Assigned Events</h2>
                        <button onClick={() => router.push('/coordinator/events')} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                            View All <ArrowRight size={16} />
                        </button>
                    </div>

                    <div className="p-6 flex-1">
                        {coordinator?.assignedEvents?.length > 0 ? (
                            <div className="space-y-4">
                                {coordinator.assignedEvents.map((event: string, idx: number) => (
                                    <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg">
                                                {event.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-slate-900">{event}</h3>
                                                <p className="text-xs text-slate-500 mt-0.5">Status: <span className="text-emerald-600 font-medium">Active</span></p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50">
                                                Details
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-slate-600">
                                                <MoreVertical size={20} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center py-12 text-slate-400">
                                <Calendar size={48} className="mb-4 opacity-20" />
                                <p>No events assigned yet.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions / Notifications */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-6">Quick Actions</h2>
                    <div className="space-y-3">
                        <button className="w-full text-left p-4 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 transition-all group">
                            <h3 className="font-semibold text-slate-900 group-hover:text-indigo-700">Verify Participants</h3>
                            <p className="text-xs text-slate-500 mt-1">Review pending student registrations.</p>
                        </button>
                        <button className="w-full text-left p-4 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 transition-all group">
                            <h3 className="font-semibold text-slate-900 group-hover:text-indigo-700">Update Results</h3>
                            <p className="text-xs text-slate-500 mt-1">Post scores for completed rounds.</p>
                        </button>
                        <button className="w-full text-left p-4 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 transition-all group">
                            <h3 className="font-semibold text-slate-900 group-hover:text-indigo-700">Download Reports</h3>
                            <p className="text-xs text-slate-500 mt-1">Get attendance and score sheets.</p>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}