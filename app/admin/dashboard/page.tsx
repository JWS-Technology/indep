"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Users,
    GraduationCap,
    School,
    Search,
    MoreHorizontal,
    UserPlus,
    Mail,
    Building,
    Eye,
    Edit,
    Trash2,
    Download,
    UserCheck,
    Shield,
    Calendar,
    Filter,
    ChevronRight,
    User as UserIcon,
    TrendingUp,
    FileText
} from "lucide-react";

export default function AdminDashboard() {
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");

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

    // Filter users
    const filteredUsers = users.filter((u: any) => {
        const matchesSearch = 
            u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.collegeId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesRole = 
            activeFilter === "all" || 
            u.role === activeFilter;

        return matchesSearch && matchesRole;
    });

    // Stats data with indigo/purple colors
    const stats = [
        { 
            label: "Total Users", 
            value: users.length, 
            icon: Users, 
            color: "text-indigo-600", 
            bg: "bg-indigo-50",
            border: "border-indigo-100",
            trend: "+12%",
            role: "all"
        },
        { 
            label: "Students", 
            value: users.filter((u: any) => u.role === 'student').length, 
            icon: GraduationCap, 
            color: "text-emerald-600", 
            bg: "bg-emerald-50",
            border: "border-emerald-100",
            trend: "+8%",
            role: "student"
        },
        { 
            label: "Faculty", 
            value: users.filter((u: any) => u.role === 'faculty').length, 
            icon: School, 
            color: "text-purple-600", 
            bg: "bg-purple-50",
            border: "border-purple-100",
            trend: "+5%",
            role: "faculty"
        },
        { 
            label: "Admins", 
            value: users.filter((u: any) => u.role === 'admin').length, 
            icon: Shield, 
            color: "text-amber-600", 
            bg: "bg-amber-50",
            border: "border-amber-100",
            trend: "+2%",
            role: "admin"
        },
    ];

    // Mobile Card Component
    const UserCard = ({ user }: { user: any }) => {
        const getRoleColor = (role: string) => {
            switch(role) {
                case 'admin': return 'bg-amber-50 text-amber-700 border border-amber-200';
                case 'faculty': return 'bg-purple-50 text-purple-700 border border-purple-200';
                case 'student': return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
                default: return 'bg-slate-50 text-slate-700 border border-slate-200';
            }
        };

        return (
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                                {user.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white border-2 border-white flex items-center justify-center">
                                <UserIcon size={10} className="text-slate-600" />
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-slate-900 text-sm truncate">{user.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-semibold ${getRoleColor(user.role)}`}>
                                    {user.role}
                                </span>
                                <span className="text-xs text-slate-500 font-mono truncate">
                                    {user.collegeId}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button className="text-slate-400 hover:text-slate-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal size={18} />
                    </button>
                </div>

                <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                        <Mail size={14} className="text-slate-400 flex-shrink-0" />
                        <span className="text-xs text-slate-600 truncate">{user.email || "No email"}</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                        <Building size={14} className="text-slate-400 flex-shrink-0" />
                        <span className="text-xs text-slate-600 truncate">{user.department || "—"}</span>
                    </div>
                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Calendar size={12} />
                        <span>Joined {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    </div>
                    <div className="flex gap-1">
                        <button className="p-1.5 hover:bg-indigo-50 rounded-lg text-indigo-600 transition-colors" title="View">
                            <Eye size={14} />
                        </button>
                        <button className="p-1.5 hover:bg-emerald-50 rounded-lg text-emerald-600 transition-colors" title="Edit">
                            <Edit size={14} />
                        </button>
                        <button className="p-1.5 hover:bg-red-50 rounded-lg text-red-600 transition-colors" title="Delete">
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                <p className="text-slate-500">Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="pt-16 lg:pt-0">
            {/* Header */}
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Dashboard Overview</h1>
                        <p className="text-slate-500 text-sm mt-1">Welcome back, Admin</p>
                    </div>
                    
                    <div className="flex flex-col xs:flex-row gap-3">
                        <button className="flex items-center justify-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2.5 rounded-xl font-medium hover:bg-slate-50 transition-colors text-sm shadow-sm">
                            <Download size={18} />
                            <span>Export Data</span>
                        </button>
                        <button
                            onClick={() => router.push('/admin/create-user')}
                            className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-4 py-2.5 rounded-xl font-semibold hover:from-indigo-700 hover:to-indigo-800 transition-all text-sm shadow-lg shadow-indigo-600/20"
                        >
                            <UserPlus size={18} />
                            <span>Create User</span>
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        const isActive = activeFilter === stat.role;
                        return (
                            <button 
                                key={index}
                                onClick={() => setActiveFilter(stat.role)}
                                className={`bg-white p-4 rounded-2xl border transition-all duration-300 hover:shadow-lg group ${isActive 
                                    ? `${stat.border} ring-2 ring-offset-2 ring-opacity-50 ring-indigo-200`
                                    : 'border-slate-100 hover:border-slate-200'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className={`p-3 rounded-xl ${stat.bg}`}>
                                        <Icon className={`w-6 h-6 ${stat.color}`} />
                                    </div>
                                    <div className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                                        <TrendingUp size={12} />
                                        <span>{stat.trend}</span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">{stat.value}</h3>
                                    <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                                </div>
                                {isActive && (
                                    <div className="mt-3 h-1 w-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"></div>
                                )}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Users Section */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
                {/* Section Header */}
                <div className="p-4 sm:p-6 border-b border-slate-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg sm:text-xl font-bold text-slate-900">Registered Users</h2>
                            <p className="text-slate-500 text-sm mt-1">
                                Showing {filteredUsers.length} of {users.length} users
                            </p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-3">
                            {/* Filter Buttons */}
                            <div className="flex flex-wrap gap-2">
                                {['all', 'student', 'faculty', 'admin'].map((role) => (
                                    <button
                                        key={role}
                                        onClick={() => setActiveFilter(role)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeFilter === role 
                                            ? 'bg-indigo-600 text-white shadow-sm' 
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                    >
                                        {role.charAt(0).toUpperCase() + role.slice(1)}
                                    </button>
                                ))}
                            </div>
                            
                            {/* Search Bar */}
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div>
                    {/* Mobile Card View */}
                    <div className="lg:hidden p-4">
                        {filteredUsers.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4">
                                {filteredUsers.map((user: any) => (
                                    <UserCard key={user._id} user={user} />
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <UserCheck size={28} className="text-slate-400" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-700 mb-2">No users found</h3>
                                <p className="text-slate-500 text-sm">
                                    {searchQuery ? 'Try a different search term' : 'No users registered yet'}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden lg:block">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Department</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredUsers.map((u: any) => (
                                        <tr key={u._id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-sm">
                                                        {u.name.charAt(0)}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-bold text-slate-900 truncate">{u.name}</p>
                                                        <p className="text-xs text-slate-500 truncate">{u.email || "No email"}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold capitalize
                                                    ${u.role === 'admin' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                                        u.role === 'faculty' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                                                        'bg-emerald-50 text-emerald-700 border border-emerald-200'
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
                                            <td className="px-6 py-4 text-sm text-slate-600 truncate max-w-xs">
                                                {u.email || "—"}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-2 hover:bg-indigo-50 rounded-lg text-indigo-600 transition-colors">
                                                        <Eye size={16} />
                                                    </button>
                                                    <button className="p-2 hover:bg-emerald-50 rounded-lg text-emerald-600 transition-colors">
                                                        <Edit size={16} />
                                                    </button>
                                                    <button className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {filteredUsers.length === 0 && (
                                <div className="py-16 text-center">
                                    <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                        <UserCheck size={32} className="text-slate-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-700 mb-2">No users found</h3>
                                    <p className="text-slate-500">
                                        {searchQuery ? 'Try a different search term' : 'No users registered yet'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Pagination */}
                    {filteredUsers.length > 0 && (
                        <div className="p-4 sm:p-6 border-t border-slate-100">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
                                <span className="text-slate-500">
                                    Showing 1 to {Math.min(filteredUsers.length, 10)} of {filteredUsers.length} entries
                                </span>
                                <div className="flex gap-2">
                                    <button className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors text-sm font-medium">
                                        Previous
                                    </button>
                                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}