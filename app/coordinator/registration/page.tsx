"use client";

import { useEffect, useState } from "react";
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Calendar,
  Users,
  Music,
  RefreshCw
} from "lucide-react";

interface RegistrationType {
    _id: string;
    eventName: string;
    teamName: string;
    teamId?: string;
    songTitle?: string;
    tune?: string;
    status: "pending" | "approved" | "correction";
    remark?: string;
    registrationDate: string;
}

export default function EventsPage() {
    const [registrations, setRegistrations] = useState<RegistrationType[]>([]);
    const [filteredRegistrations, setFilteredRegistrations] = useState<RegistrationType[]>([]);
    const [remarks, setRemarks] = useState<{ [key: string]: string }>({});
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [loading, setLoading] = useState(true);
    const [activeCorrection, setActiveCorrection] = useState<string | null>(null);

    useEffect(() => {
        fetchRegistrations();
    }, []);

    useEffect(() => {
        filterRegistrations();
    }, [registrations, searchTerm, statusFilter]);

    const fetchRegistrations = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/cooardinator/registrations");
            const data = await res.json();
            setRegistrations(data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const filterRegistrations = () => {
        let filtered = registrations;

        // Search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(r =>
                r.eventName.toLowerCase().includes(term) ||
                r.teamName.toLowerCase().includes(term) ||
                r.teamId?.toLowerCase().includes(term) ||
                r.songTitle?.toLowerCase().includes(term)
            );
        }

        // Status filter
        if (statusFilter !== "all") {
            filtered = filtered.filter(r => r.status === statusFilter);
        }

        setFilteredRegistrations(filtered);
    };

    const handleCorrectionSubmit = async (id: string) => {
        if (!remarks[id]?.trim()) {
            alert("Please enter a correction remark.");
            return;
        }

        try {
            const response = await fetch(`/api/cooardinator/registrations/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    remark: remarks[id],
                    status: "correction",
                }),
            });

            if (response.ok) {
                // Update local state
                setRegistrations(prev =>
                    prev.map(item =>
                        item._id === id
                            ? { ...item, remark: remarks[id], status: "correction" }
                            : item
                    )
                );
                
                setRemarks(prev => ({ ...prev, [id]: "" }));
                setActiveCorrection(null);
                
                // Show success feedback
                alert("Correction submitted successfully!");
            }
        } catch (err) {
            console.error(err);
            alert("Failed to submit correction. Please try again.");
        }
    };

    const handleApprove = async (id: string) => {
        if (!confirm("Are you sure you want to approve this registration?")) return;

        try {
            const response = await fetch(`/api/cooardinator/registrations/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "approved" }),
            });

            if (response.ok) {
                setRegistrations(prev =>
                    prev.map(item =>
                        item._id === id ? { ...item, status: "approved" } : item
                    )
                );
                alert("Registration approved!");
            }
        } catch (err) {
            console.error(err);
            alert("Failed to approve registration.");
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "approved": return "bg-green-100 text-green-800";
            case "correction": return "bg-red-100 text-red-800";
            case "pending": return "bg-yellow-100 text-yellow-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "approved": return <CheckCircle className="w-4 h-4" />;
            case "correction": return <XCircle className="w-4 h-4" />;
            case "pending": return <AlertCircle className="w-4 h-4" />;
            default: return null;
        }
    };

    // Statistics
    const stats = {
        total: registrations.length,
        pending: registrations.filter(r => r.status === "pending").length,
        approved: registrations.filter(r => r.status === "approved").length,
        correction: registrations.filter(r => r.status === "correction").length,
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <RefreshCw className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-600 font-medium">Loading registrations...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Event Registrations</h1>
                            <p className="text-gray-600 mt-2">Manage and review all event registrations</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={fetchRegistrations}
                                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm font-medium"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Refresh
                            </button>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm font-medium">
                                <Download className="w-4 h-4" />
                                Export
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Total Registrations</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                                </div>
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <Users className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Pending</p>
                                    <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                                </div>
                                <div className="p-2 bg-yellow-50 rounded-lg">
                                    <AlertCircle className="w-6 h-6 text-yellow-600" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Approved</p>
                                    <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                                </div>
                                <div className="p-2 bg-green-50 rounded-lg">
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Needs Correction</p>
                                    <p className="text-2xl font-bold text-red-600">{stats.correction}</p>
                                </div>
                                <div className="p-2 bg-red-50 rounded-lg">
                                    <XCircle className="w-6 h-6 text-red-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search by event, team, or song..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="relative">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="appearance-none bg-white border border-gray-300 rounded-lg pl-10 pr-8 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                >
                                    <option value="all">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="correction">Needs Correction</option>
                                </select>
                                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-4 flex justify-between items-center">
                    <p className="text-gray-600">
                        Showing <span className="font-semibold">{filteredRegistrations.length}</span> of{" "}
                        <span className="font-semibold">{registrations.length}</span> registrations
                    </p>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Event Details
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Team Details
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Song Info
                                    </th>
                                    <th className="px6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Remark/Action
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredRegistrations.length > 0 ? (
                                    filteredRegistrations.map((r) => (
                                        <tr key={r._id} className="hover:bg-gray-50 transition-colors">
                                            {/* Event Details */}
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <p className="font-medium text-gray-900">{r.eventName}</p>
                                                    <p className="text-xs text-gray-500">Event Registration</p>
                                                </div>
                                            </td>

                                            {/* Team Details */}
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <p className="font-medium text-gray-900">{r.teamName}</p>
                                                    {r.teamId && (
                                                        <p className="text-xs text-gray-500">
                                                            ID: <span className="font-mono">{r.teamId}</span>
                                                        </p>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Song Info */}
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    {r.songTitle ? (
                                                        <>
                                                            <div className="flex items-center gap-2">
                                                                <Music className="w-4 h-4 text-gray-400" />
                                                                <p className="font-medium text-gray-900">{r.songTitle}</p>
                                                            </div>
                                                            {r.tune && (
                                                                <p className="text-xs text-gray-500">
                                                                    Tune: {r.tune}
                                                                </p>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <p className="text-gray-400 text-sm">No song info</p>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Status */}
                                            <td className="px-6 py-4">
                                                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(r.status)}`}>
                                                    {getStatusIcon(r.status)}
                                                    {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                                                </div>
                                            </td>

                                            {/* Remark/Action */}
                                            <td className="px-6 py-4">
                                                {r.status === "correction" || activeCorrection === r._id ? (
                                                    <div className="space-y-2">
                                                        <textarea
                                                            placeholder="Enter correction remark..."
                                                            value={remarks[r._id] || ""}
                                                            onChange={(e) =>
                                                                setRemarks({
                                                                    ...remarks,
                                                                    [r._id]: e.target.value,
                                                                })
                                                            }
                                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                                                            rows={2}
                                                        />
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleCorrectionSubmit(r._id)}
                                                                className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex-1"
                                                            >
                                                                Submit Correction
                                                            </button>
                                                            {activeCorrection === r._id && (
                                                                <button
                                                                    onClick={() => setActiveCorrection(null)}
                                                                    className="px-3 py-1.5 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-1">
                                                        <p className="text-gray-700 text-sm">{r.remark || "No remarks"}</p>
                                                        {r.status === "pending" && (
                                                            <button
                                                                onClick={() => setActiveCorrection(r._id)}
                                                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                            >
                                                                Add correction
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </td>

                                            {/* Date */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-gray-400" />
                                                    <span className="text-gray-700 text-sm">
                                                        {new Date(r.registrationDate).toLocaleDateString('en-IN', {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {r.status === "pending" && (
                                                        <button
                                                            onClick={() => handleApprove(r._id)}
                                                            className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                                                        >
                                                            Approve
                                                        </button>
                                                    )}
                                                    <button className="p-1.5 border border-gray-300 rounded-lg hover:bg-gray-50">
                                                        <Eye className="w-4 h-4 text-gray-600" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center text-gray-400">
                                                <Users className="w-12 h-12 mb-4 opacity-40" />
                                                <p className="text-lg font-medium text-gray-500">No registrations found</p>
                                                <p className="text-sm mt-1">
                                                    {registrations.length === 0
                                                        ? "No registrations available yet."
                                                        : "Try adjusting your search or filters."}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer */}
                    {filteredRegistrations.length > 0 && (
                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-gray-600">
                                    Showing {filteredRegistrations.length} registration(s)
                                </p>
                                <div className="flex items-center gap-4">
                                    <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                                        Previous
                                    </button>
                                    <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
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