"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Search,
    UserPlus,
    Filter,
    Download,
    Trash2,
    Edit
} from "lucide-react";
import Image from "next/image";

export default function AllUsersPage() {
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");

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
                    router.push("/unauthorized");
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

    // Filter logic
    const filteredUsers = users.filter((u: any) => {
        const matchesSearch =
            u.name.toLowerCase().includes(filter.toLowerCase()) ||
            u.collegeId.toLowerCase().includes(filter.toLowerCase()) ||
            u.department.toLowerCase().includes(filter.toLowerCase());

        const matchesRole = roleFilter === "all" || u.role === roleFilter;

        return matchesSearch && matchesRole;
    });

    // Export Function
    const handleExport = () => {
        if (!filteredUsers.length) {
            alert("No users to export");
            return;
        }

        // 1. Define CSV Headers
        const headers = ["Name", "College ID", "Role", "Department", "Email"];

        // 2. Convert Data to CSV Rows
        const csvRows = filteredUsers.map((u: any) => {
            return [
                `"${u.name}"`,       // Escape quotes for safety
                `"${u.collegeId}"`,
                `"${u.role}"`,
                `"${u.department}"`,
                `"${u.email || ''}"`
            ].join(",");
        });

        // 3. Combine Headers and Rows
        const csvContent = [headers.join(","), ...csvRows].join("\n");

        // 4. Create Blob and Trigger Download
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `indep_users_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
                    <p className="text-slate-500 text-sm">View, edit, and manage all registered accounts.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleExport}
                        className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-sm font-medium shadow-sm transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        Export CSV
                    </button>
                    <button
                        onClick={() => router.push('/admin/create-user')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm font-medium shadow-sm shadow-blue-200"
                    >
                        <UserPlus className="w-4 h-4" />
                        Add User
                    </button>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">

                {/* Search Bar */}
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search by name, ID, or department..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>

                {/* Filters */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
                        <Filter className="w-4 h-4 text-slate-500" />
                        <select
                            className="bg-transparent text-sm text-slate-700 focus:outline-none cursor-pointer"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <option value="all">All Roles</option>
                            <option value="student">Students</option>
                            <option value="faculty">Faculty</option>
                            <option value="admin">Admins</option>
                            <option value="judge">Judges</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">User Profile</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Department</th>
                                <th className="px-6 py-4">College ID</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((u: any) => (
                                    <tr key={u._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm border-2 border-white shadow-sm overflow-hidden relative">
                                                    <Image
                                                        src={`https://sjctni.edu/images/SPhotos/${u.collegeId?.substring(0, 2)}/${u.collegeId?.toLowerCase()}.jpg`}
                                                        alt={u.name}
                                                        className="w-full h-full object-top"
                                                        fill
                                                        onError={(e) => {
                                                            e.currentTarget.onerror = null;
                                                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=random`;
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-900">{u.name}</p>
                                                    <p className="text-xs text-slate-500">{u.email || "No email linked"}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize border
                                                ${u.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                                    u.role === 'faculty' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                        u.role === 'judge' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                                            'bg-green-50 text-green-700 border-green-200'
                                                }
                                            `}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-slate-700 font-medium">
                                                {u.department}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded text-slate-600 border border-slate-200">
                                                {u.collegeId}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                <span className="text-xs font-medium text-slate-600">Active</span>
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit User">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete User">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-400">
                                            <Search className="w-12 h-12 mb-3 text-slate-200" />
                                            <p className="text-lg font-medium text-slate-900">No users found</p>
                                            <p className="text-sm">Try adjusting your search or filter to find what you're looking for.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
                    <p className="text-sm text-slate-500">
                        Showing <span className="font-medium text-slate-900">{filteredUsers.length}</span> users
                    </p>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed">
                            Previous
                        </button>
                        <button className="px-3 py-1 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}