"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Users,
    GraduationCap,
    School,
    Search,
    MoreHorizontal,
    ArrowUpRight
} from "lucide-react";

export default function AdminDashboard() {
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("");

    useEffect(() => {
        async function loadData() {
            try {
                const res = await fetch("/api/users", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                if (res.status === 401) {
                    router.push("/login");
                    return;
                }

                const data = await res.json();
                if (data.role !== "admin") {
                    router.push("/unauthorized"); // Or redirect to student dashboard
                    return;
                }

                setUsers(data.users);
            } catch (error) {
                console.error("Failed to load users", error);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [router]);

    // Filter users based on search
    const filteredUsers = users.filter((u: any) =>
        u.name.toLowerCase().includes(filter.toLowerCase()) ||
        u.collegeId.toLowerCase().includes(filter.toLowerCase()) ||
        u.department.toLowerCase().includes(filter.toLowerCase())
    );

    // Calculate Stats
    const stats = [
        { label: "Total Users", value: users.length, icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
        { label: "Students", value: users.filter((u: any) => u.role === 'student').length, icon: GraduationCap, color: "text-green-600", bg: "bg-green-100" },
        { label: "Faculty", value: users.filter((u: any) => u.role === 'faculty').length, icon: School, color: "text-purple-600", bg: "bg-purple-100" },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">

            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
                    <p className="text-slate-500 mt-1">Welcome back, Admin</p>
                </div>
                <button
                    onClick={() => router.push('/admin/create-user')}
                    className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-lg shadow-slate-900/20"
                >
                    + Add New User
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-xl ${stat.bg}`}>
                                    <Icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                                <span className="text-xs font-bold px-2 py-1 bg-slate-50 rounded-md text-slate-500">+2.5%</span>
                            </div>
                            <div>
                                <h3 className="text-4xl font-bold text-slate-900 mb-1">{stat.value}</h3>
                                <p className="text-slate-500 font-medium">{stat.label}</p>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Users Table Section */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

                {/* Table Header / Filter */}
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h3 className="text-lg font-bold text-slate-800">Registered Users</h3>
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">User Profile</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Department</th>
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredUsers.map((u: any) => (
                                <tr key={u._id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                                                {u.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">{u.name}</p>
                                                <p className="text-xs text-slate-500">{u.email || "No Email"}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize
                                            ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                                u.role === 'faculty' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-green-100 text-green-700'
                                            }
                                        `}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                                        {u.department || "—"}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500 font-mono">
                                        {u.collegeId}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-slate-400 hover:text-blue-600 transition-colors">
                                            <MoreHorizontal className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Empty State */}
                {filteredUsers.length === 0 && (
                    <div className="p-12 text-center text-slate-500">
                        <p>No users found matching your search.</p>
                    </div>
                )}

                {/* Pagination (Static for visual) */}
                <div className="p-4 border-t border-slate-100 flex justify-between items-center text-sm text-slate-500">
                    <span>Showing 1 to {filteredUsers.length} of {filteredUsers.length} entries</span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50">Prev</button>
                        <button className="px-3 py-1 border border-slate-200 rounded-lg hover:bg-slate-50">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}