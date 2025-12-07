"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import {
    Search,
    Trash2,
    Edit2,
    X,
    Music,
    Mic2,
    CheckCircle2,
    AlertCircle,
    Clock,
    Filter,
    Download,
    Loader2,
    MessageSquare,
    Calendar,
    Users,
    BarChart3,
    PieChart as PieChartIcon,
    RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from "recharts";

// --- Types ---
interface RegistrationData {
    _id: string;
    eventName: string;
    teamName: string;
    teamId?: string;
    songTitle?: string;
    tune?: string;
    status: "pending" | "approved" | "correction";
    remark: string;
    registrationDate: string;
}

// --- SUB-COMPONENT: Status Badge ---
const StatusBadge = ({ status }: { status: string }) => {
    const styles: Record<string, { bg: string; text: string; border: string; icon: React.ReactElement }> = {

        approved: {
            bg: "bg-emerald-50",
            text: "text-emerald-700",
            border: "border-emerald-200",
            icon: <CheckCircle2 size={12} className="text-emerald-500" />
        },
        correction: {
            bg: "bg-amber-50",
            text: "text-amber-700",
            border: "border-amber-200",
            icon: <AlertCircle size={12} className="text-amber-500" />
        },
        pending: {
            bg: "bg-blue-50",
            text: "text-blue-700",
            border: "border-blue-200",
            icon: <Clock size={12} className="text-blue-500" />
        }
    };

    const style = styles[status] || styles.pending;

    return (
        <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${style.bg} ${style.border} ${style.text} capitalize`}>
            {style.icon}
            {status}
        </span>
    );
};

// --- CHART COLORS ---
const PIE_COLORS = {
    approved: "#10b981", // Emerald 500
    pending: "#3b82f6",  // Blue 500
    correction: "#f59e0b" // Amber 500
};

// --- MAIN COMPONENT ---
export default function RegistrationsPage() {
    const [registrations, setRegistrations] = useState<RegistrationData[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters State
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedEvent, setSelectedEvent] = useState("");
    const [selectedDept, setSelectedDept] = useState("");
    const [dateRange, setDateRange] = useState({ start: "", end: "" });
    const [showFilters, setShowFilters] = useState(false);
    const [showAnalytics, setShowAnalytics] = useState(false);

    // Modal State
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingReg, setEditingReg] = useState<Partial<RegistrationData> | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Derived Lists for Dropdowns
    const uniqueEvents = useMemo(() =>
        Array.from(new Set(registrations.map(r => r.eventName))).sort(),
        [registrations]);

    const uniqueDepts = useMemo(() =>
        Array.from(new Set(registrations.map(r => r.teamId?.slice(2, 5)).filter(Boolean))).sort(),
        [registrations]);

    // --- Fetch Data ---
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/registrations`);
            const data = await res.json();
            if (data.success && data.registrations) {
                setRegistrations(data.registrations);
            }
        } catch (error) {
            console.error("Failed to fetch registrations", error);
        } finally {
            setTimeout(() => setLoading(false), 500);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // --- Handlers ---
    const handleEdit = (reg: RegistrationData) => {
        setEditingReg({ ...reg });
        setIsEditOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this registration?")) return;
        try {
            const res = await fetch(`/api/admin/registrations/${id}`, { method: "DELETE" });
            if (res.ok) {
                setRegistrations(prev => prev.filter(r => r._id !== id));
            } else {
                alert("Failed to delete");
            }
        } catch (e) {
            alert("Error deleting");
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingReg || !editingReg._id) return;
        setIsSaving(true);

        try {
            const res = await fetch(`/api/admin/registrations/${editingReg._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editingReg),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to update");

            setRegistrations(prev =>
                prev.map(r => r._id === editingReg._id ? { ...r, ...data.registration } : r)
            );

            setIsEditOpen(false);
            setEditingReg(null);
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsSaving(false);
        }
    };

    // --- Filtering Logic ---
    const filteredList = useMemo(() => {
        return registrations.filter((r) => {
            // 1. Search Query
            const searchTerms = [
                r.eventName, r.teamName, r.teamId, r.songTitle, r.tune, r.status
            ].filter(Boolean).join(" ").toLowerCase();
            const matchesSearch = searchTerms.includes(searchQuery.toLowerCase());

            // 2. Event Filter
            const matchesEvent = selectedEvent ? r.eventName === selectedEvent : true;

            // 3. Dept Filter
            const matchesDept = selectedDept
                ? r.teamId?.slice(2, 5) === selectedDept
                : true;

            // 4. Date Range
            let matchesDate = true;
            if (dateRange.start) {
                matchesDate = matchesDate && new Date(r.registrationDate) >= new Date(dateRange.start);
            }
            if (dateRange.end) {
                // Set end date to end of day
                const endDate = new Date(dateRange.end);
                endDate.setHours(23, 59, 59, 999);
                matchesDate = matchesDate && new Date(r.registrationDate) <= endDate;
            }

            return matchesSearch && matchesEvent && matchesDept && matchesDate;
        });
    }, [registrations, searchQuery, selectedEvent, selectedDept, dateRange]);

    // --- Analytics Data Preparation ---
    const analyticsData = useMemo(() => {
        // Bar Chart: By Department
        const deptCounts: Record<string, number> = {};
        filteredList.forEach(r => {
            const dept = r.teamId?.slice(0, 3) || "Other";
            deptCounts[dept] = (deptCounts[dept] || 0) + 1;
        });
        const barData = Object.entries(deptCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);

        // Pie Chart: By Status
        const statusCounts: Record<string, number> = {};
        filteredList.forEach(r => {
            statusCounts[r.status] = (statusCounts[r.status] || 0) + 1;
        });
        const pieData = Object.entries(statusCounts)
            .map(([name, value]) => ({ name, value }));

        return { barData, pieData };
    }, [filteredList]);

    // --- Export Handler ---
    const handleExport = () => {
        const rows = filteredList.map(reg => ({
            "Team Name": reg.teamName,
            "Event": reg.eventName,
            "Team ID": reg.teamId || "N/A",
            "Song Title": reg.songTitle || "N/A",
            "Tune": reg.tune || "N/A",
            "Status": reg.status,
            "Remark": reg.remark,
            "Date": new Date(reg.registrationDate).toLocaleDateString(),
        }));

        if (rows.length === 0) {
            alert("No data to export");
            return;
        }

        const header = Object.keys(rows[0]).join(",");
        const csvRows = rows.map(r => Object.values(r).map(v => `"${v}"`).join(","));
        const csvContent = [header, ...csvRows].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `registrations_export_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const clearFilters = () => {
        setSearchQuery("");
        setSelectedEvent("");
        setSelectedDept("");
        setDateRange({ start: "", end: "" });
    };

    return (
        <div className="space-y-6 max-w-[1400px] mx-auto p-4 animate-in fade-in duration-500">

            {/* --- Header Section --- */}
            <div className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Event Registrations</h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Manage entries, analyze participation, and export data.
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowAnalytics(!showAnalytics)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${showAnalytics ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                        >
                            {showAnalytics ? <BarChart3 size={18} /> : <PieChartIcon size={18} />}
                            Analytics
                        </button>
                        <button
                            onClick={handleExport}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            <Download size={18} />
                            Export CSV
                        </button>
                    </div>
                </div>

                {/* --- Analytics Section (Toggleable) --- */}
                <AnimatePresence>
                    {showAnalytics && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                                {/* Bar Chart */}
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-[300px]">
                                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Registrations by Department</h3>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={analyticsData.barData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                                            <Tooltip
                                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                cursor={{ fill: '#f1f5f9' }}
                                            />
                                            <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Pie Chart */}
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-[300px] flex flex-col">
                                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Approval Status</h3>
                                    <div className="flex-1 w-full relative">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={analyticsData.pieData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                >
                                                    {analyticsData.pieData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={PIE_COLORS[entry.name as keyof typeof PIE_COLORS] || "#cbd5e1"} />
                                                    ))}
                                                </Pie>
                                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <div className="text-center">
                                                <span className="block text-2xl font-bold text-slate-700">{filteredList.length}</span>
                                                <span className="text-xs text-slate-400">Total</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* --- Filters Toolbar --- */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search by name, ID, or song..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                            />
                        </div>

                        {/* Toggle Advanced Filters */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${showFilters ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                        >
                            <Filter size={16} />
                            Filters
                            {(selectedEvent || selectedDept || dateRange.start) && (
                                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                            )}
                        </button>
                    </div>

                    {/* Advanced Filters Grid */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="pt-2 grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <select
                                        value={selectedEvent}
                                        onChange={(e) => setSelectedEvent(e.target.value)}
                                        className="p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                                    >
                                        <option value="">All Events</option>
                                        {uniqueEvents.map(evt => <option key={evt} value={evt}>{evt}</option>)}
                                    </select>

                                    <select
                                        value={selectedDept}
                                        onChange={(e) => setSelectedDept(e.target.value)}
                                        className="p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                                    >
                                        <option value="">All Departments</option>
                                        {uniqueDepts.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                                    </select>

                                    <input
                                        type="date"
                                        value={dateRange.start}
                                        onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                        className="p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                                        placeholder="Start Date"
                                    />

                                    <input
                                        type="date"
                                        value={dateRange.end}
                                        onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                        className="p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                                        placeholder="End Date"
                                    />

                                    <div className="md:col-span-4 flex justify-end">
                                        <button
                                            onClick={clearFilters}
                                            className="text-sm text-red-500 hover:text-red-700 font-medium flex items-center gap-1"
                                        >
                                            <RefreshCw size={14} /> Clear all filters
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* --- Table Card --- */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-12 flex justify-center items-center">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    </div>
                ) : (
                    <>
                        <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center text-xs text-slate-500">
                            <span>Showing <strong>{filteredList.length}</strong> results</span>
                            {(selectedEvent || selectedDept || dateRange.start || searchQuery) && (
                                <span className="text-blue-600 font-medium">Filtered View Active</span>
                            )}
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        <th className="px-6 py-4">Participant Details</th>
                                        <th className="px-6 py-4">Submission</th>
                                        <th className="px-6 py-4">Status & Remark</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    <AnimatePresence>
                                        {filteredList.map((reg, index) => (
                                            <motion.tr
                                                key={reg._id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.03 }}
                                                className="group hover:bg-slate-50/60 transition-colors"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-slate-900 text-sm">{reg.teamName}</span>
                                                        <span className="text-xs text-slate-500 mt-0.5">{reg.eventName}</span>
                                                        {reg.teamId && (
                                                            <span className="inline-flex mt-1 items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 w-fit">
                                                                ID: {reg.teamId}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-2 text-sm text-slate-700">
                                                            <Music size={13} className="text-slate-400" />
                                                            <span className="truncate max-w-[200px]">{reg.songTitle || "N/A"}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                                            <Mic2 size={13} className="text-slate-400" />
                                                            <span className="truncate max-w-[200px]">{reg.tune || "No tune specified"}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="space-y-2">
                                                        <StatusBadge status={reg.status} />
                                                        {reg.remark && (
                                                            <div className="flex items-start gap-1.5 text-xs text-slate-500 max-w-[200px]">
                                                                <MessageSquare size={10} className="mt-0.5 text-slate-400 shrink-0" />
                                                                <span className="truncate">{reg.remark}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-500">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar size={13} className="text-slate-400" />
                                                        {new Date(reg.registrationDate).toLocaleString("en-IN", {
                                                            day: "2-digit",
                                                            month: "2-digit",
                                                            year: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                            hour12: true
                                                        })}

                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => handleEdit(reg)}
                                                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                            title="Edit"
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(reg._id)}
                                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                    {filteredList.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="py-16 text-center text-slate-500">
                                                No registrations found matching the filters.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>

            {/* --- EDIT MODAL --- */}
            <AnimatePresence>
                {isEditOpen && editingReg && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col ring-1 ring-slate-900/5"
                        >
                            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <div>
                                    <h2 className="font-bold text-lg text-slate-900">Review Registration</h2>
                                    <p className="text-xs text-slate-500">Update status and provide feedback</p>
                                </div>
                                <button
                                    onClick={() => setIsEditOpen(false)}
                                    className="p-2 hover:bg-slate-200/50 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
                                <form id="editForm" onSubmit={handleSave} className="space-y-6">
                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-semibold text-slate-500 uppercase">Team Name</label>
                                                <p className="text-sm font-medium text-slate-900">{editingReg.teamName}</p>
                                            </div>
                                            <div>
                                                <label className="text-xs font-semibold text-slate-500 uppercase">Event</label>
                                                <p className="text-sm font-medium text-slate-900">{editingReg.eventName}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Submission Status</label>
                                            <select
                                                className="w-full border border-slate-200 p-2.5 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                                value={editingReg.status}
                                                onChange={(e) => setEditingReg({ ...editingReg, status: e.target.value as any })}
                                            >
                                                <option value="pending">Pending Review</option>
                                                <option value="approved">Approved</option>
                                                <option value="correction">Correction Needed</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Remarks / Feedback</label>
                                            <textarea
                                                className="w-full border border-slate-200 p-3 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all min-h-[80px]"
                                                value={editingReg.remark}
                                                onChange={(e) => setEditingReg({ ...editingReg, remark: e.target.value })}
                                                placeholder="Add notes for the participant..."
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Song Title</label>
                                                <input
                                                    className="w-full border border-slate-200 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                                    value={editingReg.songTitle || ""}
                                                    onChange={(e) => setEditingReg({ ...editingReg, songTitle: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Tune/Style</label>
                                                <input
                                                    className="w-full border border-slate-200 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                                    value={editingReg.tune || ""}
                                                    onChange={(e) => setEditingReg({ ...editingReg, tune: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>

                            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                                <button
                                    onClick={() => setIsEditOpen(false)}
                                    className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200/50 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    form="editForm"
                                    disabled={isSaving}
                                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm hover:shadow transition-all disabled:opacity-70"
                                >
                                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                                    Save Changes
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}