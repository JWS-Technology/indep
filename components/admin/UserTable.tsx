"use client";

import { useEffect, useState, useCallback } from "react";
import {
    Search,
    Trash2,
    Edit2,
    X,
    User,
    Mail,
    Phone,
    Shield,
    Briefcase,
    Building2,
    CheckCircle2,
    ChevronRight,
    Filter,
    Download,
    MoreVertical,
    AlertCircle,
    Loader2
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// --- Types ---
interface UserData {
    _id: string;
    name: string;
    collegeId: string;
    email: string;
    phone: string;
    role: "student" | "faculty" | "admin" | string;
    department: string;
    password?: string;
    createdAt?: string;
    lastActive?: string;
}

interface UserTableProps {
    role: "student" | "faculty" | "admin" | "all";
}

// --- SUB-COMPONENT: Role Badge ---
const RoleBadge = ({ role }: { role: string }) => {
    const styles: Record<string, { bg: string; text: string; border: string; icon: React.ReactNode }> = {
        admin: {
            bg: "bg-gradient-to-r from-purple-50 to-pink-50",
            text: "text-purple-700",
            border: "border-purple-200",
            icon: <Shield size={12} className="text-purple-500" />
        },
        faculty: {
            bg: "bg-gradient-to-r from-blue-50 to-cyan-50",
            text: "text-blue-700",
            border: "border-blue-200",
            icon: <Briefcase size={12} className="text-blue-500" />
        },
        student: {
            bg: "bg-gradient-to-r from-emerald-50 to-teal-50",
            text: "text-emerald-700",
            border: "border-emerald-200",
            icon: <User size={12} className="text-emerald-500" />
        }
    };

    const style = styles[role.toLowerCase()] || {
        bg: "bg-gradient-to-r from-slate-50 to-gray-50",
        text: "text-slate-700",
        border: "border-slate-200",
        icon: <User size={12} className="text-slate-500" />
    };

    return (
        <span className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border ${style.bg} ${style.border} ${style.text} capitalize transition-all hover:scale-105 cursor-default`}>
            {style.icon}
            {role}
        </span>
    );
};

// --- SUB-COMPONENT: UserAvatar ---
const UserAvatar = ({ user }: { user: UserData }) => {
    const primarySrc = `https://sjctni.edu/images/SPhotos/${user.collegeId.substring(0, 2)}/${user.collegeId.toLowerCase()}.jpg`;
    const fallbackSrc = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}&backgroundType=gradientLinear&backgroundColor=b6e3f4,c0aede,d1d4f9`;
    const [src, setSrc] = useState(primarySrc);

    return (
        <div className="relative group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-slate-50 to-gray-100 border border-slate-200/50 overflow-hidden shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:scale-105">
                <Image
                    src={src}
                    alt={user.name}
                    fill
                    sizes="44px"
                    className="object-cover"
                    onError={() => setSrc(fallbackSrc)}
                />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full shadow-sm"></div>
        </div>
    );
};

// --- SUB-COMPONENT: Table Skeleton ---
const TableSkeleton = () => (
    <div className="space-y-3">
        {[...Array(6)].map((_, i) => (
            <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="flex items-center justify-between p-5 bg-white rounded-xl border border-slate-100"
            >
                <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl animate-pulse"></div>
                    <div className="space-y-2">
                        <div className="h-4 w-40 bg-gradient-to-r from-slate-100 to-slate-200 rounded animate-pulse"></div>
                        <div className="h-3 w-28 bg-gradient-to-r from-slate-100 to-slate-200 rounded animate-pulse"></div>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="h-6 w-24 bg-gradient-to-r from-slate-100 to-slate-200 rounded-lg animate-pulse"></div>
                </div>
                <div className="space-y-1">
                    <div className="h-4 w-32 bg-gradient-to-r from-slate-100 to-slate-200 rounded animate-pulse"></div>
                    <div className="h-3 w-28 bg-gradient-to-r from-slate-100 to-slate-200 rounded animate-pulse"></div>
                </div>
                <div className="h-8 w-32 bg-gradient-to-r from-slate-100 to-slate-200 rounded-lg animate-pulse"></div>
                <div className="h-10 w-24 bg-gradient-to-r from-slate-100 to-slate-200 rounded-lg animate-pulse"></div>
            </motion.div>
        ))}
    </div>
);

// --- MAIN COMPONENT ---
export default function UserTable({ role }: UserTableProps) {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("");

    // Modal State
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<Partial<UserData> | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // --- Fetch Data ---
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const queryParams = role !== 'all' ? `?role=${role}` : '';
            const res = await fetch(`/api/admin/users${queryParams}`);
            const data = await res.json();

            if (data.success && data.users) {
                setUsers(data.users);
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setTimeout(() => setLoading(false), 500); // Smooth loading
        }
    }, [role]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // --- Handlers ---
    const handleEdit = (user: UserData) => {
        setEditingUser({ ...user, password: "" });
        setIsEditOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
        try {
            const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
            if (res.ok) {
                setUsers(users.filter(u => u._id !== id));
            } else {
                alert("Failed to delete user");
            }
        } catch (e) {
            alert("Error deleting user");
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser || !editingUser._id) return;
        setIsSaving(true);

        try {
            const res = await fetch(`/api/admin/users/${editingUser._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editingUser),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to update");

            setUsers(prev => prev.map(u => u._id === editingUser._id ? { ...u, ...data.user } : u));
            if (role !== 'all' && data.user.role !== role) {
                setUsers(prev => prev.filter(u => u._id !== editingUser._id));
            }
            setIsEditOpen(false);
            setEditingUser(null);
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsSaving(false);
        }
    };

    // --- Search Logic ---
    const filteredList = users.filter((u) =>
        u.name.toLowerCase().includes(filter.toLowerCase()) ||
        u.collegeId.toLowerCase().includes(filter.toLowerCase()) ||
        u.department.toLowerCase().includes(filter.toLowerCase())
    );

    const getTitle = () => {
        switch (role) {
            case 'student': return 'Student Directory';
            case 'faculty': return 'Faculty Members';
            case 'admin': return 'Administrators';
            default: return 'All Users';
        }
    };

    const getStats = () => {
        const total = users.length;
        const active = users.filter(u => u.lastActive).length;
        return { total, active };
    };

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <span>User Management</span>
                            <ChevronRight size={14} />
                            <span className="font-medium text-slate-700">{getTitle()}</span>
                        </div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
                            {getTitle()}
                            <span className="ml-3 text-sm font-normal bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 px-3 py-1 rounded-full">
                                {getStats().total} users
                            </span>
                        </h1>
                        <p className="text-slate-500 text-sm max-w-2xl">
                            Manage and view {role === 'all' ? 'all registered users' : `${role} accounts`} in the system.
                            {getStats().active > 0 && ` ${getStats().active} active recently.`}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Search Bar */}
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-blue-500 transition-colors duration-200" />
                            <input
                                type="text"
                                placeholder="Search by name, ID, or dept..."
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-300"
                            />
                        </div>

                        <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-300">
                            <Filter size={16} />
                            Filters
                        </button>

                        <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
                            <Download size={16} />
                            Export
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-2xl p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Total Users</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{users.length}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                                <User className="text-blue-600" size={20} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-white to-emerald-50 border border-emerald-100 rounded-2xl p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Active Today</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{getStats().active}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-white to-purple-50 border border-purple-100 rounded-2xl p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">New This Week</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">12</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                                <Shield className="text-purple-600" size={20} />
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Table Section */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="space-y-4"
            >
                {loading ? (
                    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                        <TableSkeleton />
                    </div>
                ) : (
                    <>
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gradient-to-r from-slate-50 to-gray-50 border-b border-slate-100">
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                                <div className="flex items-center gap-2">
                                                    <User size={14} />
                                                    User Details
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                                <div className="flex items-center gap-2">
                                                    <Shield size={14} />
                                                    Role & Status
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                                <div className="flex items-center gap-2">
                                                    <Mail size={14} />
                                                    Contact
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                                <div className="flex items-center gap-2">
                                                    <Building2 size={14} />
                                                    Department
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        <AnimatePresence>
                                            {filteredList.map((user, index) => (
                                                <motion.tr
                                                    key={user._id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.2, delay: index * 0.02 }}
                                                    className="hover:bg-gradient-to-r hover:from-slate-50/50 hover:to-gray-50/50 transition-all duration-300"
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-4">
                                                            <UserAvatar user={user} />
                                                            <div>
                                                                <div className="font-semibold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                                                                    {user.name}
                                                                </div>
                                                                <div className="text-xs font-medium text-slate-500 mt-0.5">
                                                                    {user.collegeId}
                                                                </div>
                                                                {user.createdAt && (
                                                                    <div className="text-xs text-slate-400 mt-1">
                                                                        Joined {new Date(user.createdAt).toLocaleDateString()}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col gap-2">
                                                            <RoleBadge role={user.role} />
                                                            {user.lastActive && (
                                                                <div className="text-xs text-slate-500 flex items-center gap-1">
                                                                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                                                                    Active today
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col gap-2">
                                                            <div className="flex items-center gap-2 text-sm text-slate-600 group-hover:text-blue-600 transition-colors">
                                                                <Mail size={12} className="text-slate-400" />
                                                                {user.email}
                                                            </div>
                                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                                <Phone size={12} className="text-slate-400" />
                                                                {user.phone}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2 text-sm text-slate-700 bg-gradient-to-r from-slate-50 to-gray-50 px-3 py-1.5 rounded-lg border border-slate-200/50 w-fit">
                                                            <Building2 size={12} className="text-slate-500" />
                                                            {user.department}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex justify-end gap-2">
                                                            <motion.button
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                onClick={() => handleEdit(user)}
                                                                className="p-2 text-slate-500 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 rounded-lg border border-transparent hover:border-blue-100 transition-all duration-300"
                                                                title="Edit User"
                                                            >
                                                                <Edit2 size={16} />
                                                            </motion.button>
                                                            <motion.button
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                onClick={() => handleDelete(user._id)}
                                                                className="p-2 text-slate-500 hover:text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 rounded-lg border border-transparent hover:border-red-100 transition-all duration-300"
                                                                title="Delete User"
                                                            >
                                                                <Trash2 size={16} />
                                                            </motion.button>
                                                            <motion.button
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-gray-50 rounded-lg border border-transparent hover:border-slate-100 transition-all duration-300"
                                                                title="More options"
                                                            >
                                                                <MoreVertical size={16} />
                                                            </motion.button>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </AnimatePresence>
                                    </tbody>
                                </table>

                                {filteredList.length === 0 && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="py-16 text-center"
                                    >
                                        <div className="flex flex-col items-center justify-center text-slate-400">
                                            <div className="w-20 h-20 bg-gradient-to-br from-slate-50 to-gray-50 rounded-full flex items-center justify-center mb-4">
                                                <Search size={32} className="opacity-30" />
                                            </div>
                                            <p className="text-lg font-medium text-slate-600">No users found</p>
                                            <p className="text-sm mt-1">Try adjusting your search terms or filters.</p>
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="bg-gradient-to-r from-slate-50 to-gray-50 border-t border-slate-100 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-3">
                                <div className="text-sm text-slate-600">
                                    Showing <span className="font-semibold text-slate-900">{filteredList.length}</span> of <span className="font-semibold text-slate-900">{users.length}</span> users
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    Last updated just now
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </motion.div>

            {/* --- MODERN EDIT MODAL --- */}
            <AnimatePresence>
                {isEditOpen && editingUser && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsEditOpen(false)}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] ring-1 ring-slate-900/5"
                        >
                            {/* Modal Header */}
                            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-white to-slate-50 sticky top-0 z-10">
                                <div className="space-y-1">
                                    <h2 className="font-bold text-xl text-slate-900">Edit User Profile</h2>
                                    <p className="text-sm text-slate-500">Update user details and permissions</p>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setIsEditOpen(false)}
                                    className="p-2 hover:bg-slate-100 rounded-xl transition-colors duration-200 text-slate-400 hover:text-slate-600"
                                >
                                    <X size={20} />
                                </motion.button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-8 overflow-y-auto">
                                <form id="editForm" onSubmit={handleSave} className="space-y-8">
                                    {/* Section: Personal Info */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
                                            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Personal Information</h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                                                <div className="relative">
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                                    <input
                                                        className="w-full pl-12 border border-slate-200 p-3 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none transition-all duration-300 bg-white"
                                                        value={editingUser.name}
                                                        onChange={e => setEditingUser({ ...editingUser, name: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">User ID</label>
                                                <input
                                                    className="w-full border border-slate-200 p-3 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none transition-all duration-300 bg-white"
                                                    value={editingUser.collegeId}
                                                    onChange={e => setEditingUser({ ...editingUser, collegeId: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Department</label>
                                                <div className="relative">
                                                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                                    <input
                                                        className="w-full pl-12 border border-slate-200 p-3 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none transition-all duration-300 bg-white"
                                                        value={editingUser.department}
                                                        onChange={e => setEditingUser({ ...editingUser, department: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent"></div>

                                    {/* Section: Contact & Role */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                                            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Account Settings</h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                                                <div className="relative">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                                    <input
                                                        className="w-full pl-12 border border-slate-200 p-3 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none transition-all duration-300 bg-white"
                                                        value={editingUser.email}
                                                        onChange={e => setEditingUser({ ...editingUser, email: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                                                <div className="relative">
                                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                                    <input
                                                        className="w-full pl-12 border border-slate-200 p-3 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none transition-all duration-300 bg-white"
                                                        value={editingUser.phone}
                                                        onChange={e => setEditingUser({ ...editingUser, phone: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">System Role</label>
                                                <select
                                                    className="w-full border border-slate-200 p-3 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none transition-all duration-300 appearance-none cursor-pointer"
                                                    value={editingUser.role}
                                                    onChange={e => setEditingUser({ ...editingUser, role: e.target.value })}
                                                >
                                                    <option value="student">Student</option>
                                                    <option value="faculty">Faculty</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                                    New Password
                                                    <span className="ml-2 text-xs font-normal text-slate-400">(Optional)</span>
                                                </label>
                                                <input
                                                    className="w-full border border-slate-200 p-3 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none transition-all duration-300 bg-white"
                                                    type="password"
                                                    placeholder="••••••••"
                                                    value={editingUser.password}
                                                    onChange={e => setEditingUser({ ...editingUser, password: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>

                            {/* Modal Footer */}
                            <div className="px-8 py-6 border-t border-slate-100 bg-gradient-to-r from-slate-50 to-gray-50 flex justify-end gap-4 sticky bottom-0">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setIsEditOpen(false)}
                                    className="px-6 py-3 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all duration-300"
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    form="editForm"
                                    disabled={isSaving}
                                    className="flex items-center gap-3 px-8 py-3 text-sm font-medium bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 size={16} />
                                            Save Changes
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}