"use client";

import axios from "axios";
import {
    Search,
    CheckCircle,
    XCircle,
    AlertCircle,
    ChevronDown,
    Filter,
    Edit2,
    Save,
    X,
    MoreVertical,
    Users,
    Calendar,
    UserCheck,
    UserX,
    ShieldAlert,
    CheckSquare,
    Clock,
    Hash,
    Building,
    Crown,
    Trophy
} from "lucide-react";
import { useEffect, useState } from "react";

export default function OnStageAttendancePage() {
    // --- STATE MANAGEMENT ---
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [filterEvent, setFilterEvent] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [events, setEvents] = useState<string[]>([]);

    // UI State
    const [expandedCard, setExpandedCard] = useState<string | null>(null);

    // Malpractice Modal State
    const [malpracticeTarget, setMalpracticeTarget] = useState<{ reg: any, contestant: any, index: number } | null>(null);
    const [malpracticeText, setMalpracticeText] = useState("");

    // Editing State
    const [editing, setEditing] = useState({ regId: null, index: null, name: "" });

    // Stats
    const [stats, setStats] = useState({
        total: 0,
        present: 0,
        absent: 0,
        malpractice: 0,
        pending: 0
    });

    // --- API CALLS ---
    const fetchData = async () => {
        try {
            const res = await fetch("/api/onstage/get-lotwise");
            const json = await res.json();

            if (json.data) {
                // Sort data by Lot Number for easier reading
                const sortedData = json.data.sort((a: any, b: any) => a.lot_number - b.lot_number);
                setData(sortedData);

                // Extract unique events for the dropdown
                const uniqueEvents = [...new Set(sortedData.map((item: any) => item.event))];
                setEvents(uniqueEvents as string[]);

                if (!filterEvent && uniqueEvents.length > 0) {
                    setFilterEvent(uniqueEvents[0] as string);
                }

                // Calculate stats
                const allContestants = sortedData.flatMap((item: any) => item.contestants);
                const newStats = {
                    total: allContestants.length,
                    present: allContestants.filter((c: any) => c.status === "PRESENT").length,
                    absent: allContestants.filter((c: any) => c.status === "ABSENT").length,
                    malpractice: allContestants.filter((c: any) => c.status === "MALPRACTICE").length,
                    pending: allContestants.filter((c: any) => !c.status || c.status === "PENDING").length
                };
                setStats(newStats);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const saveAttendance = async (contestant: any, status: string, reg: any, malpracticeDetails = "") => {
        // Optimistic UI update
        const originalData = [...data];
        const updatedData = data.map(item => {
            if (item._id === reg._id) {
                const updatedContestants = [...item.contestants];
                const contestantIndex = updatedContestants.findIndex(c => c.dNo === contestant.dNo);
                if (contestantIndex > -1) {
                    updatedContestants[contestantIndex] = { ...updatedContestants[contestantIndex], status };
                }
                return { ...item, contestants: updatedContestants };
            }
            return item;
        });
        setData(updatedData);

        try {
            await axios.post("/api/onstage/save-attendance", {
                eventName: reg.eventName,
                teamId: reg.teamId,
                contestantName: contestant.contestantName,
                dNo: contestant.dNo,
                status,
                malpracticeDetails,
            });
            fetchData();
            setMalpracticeTarget(null);
            setMalpracticeText("");
        } catch (error) {
            alert("Error updating attendance");
            setData(originalData);
            console.error(error);
        }
    };

    const updateName = async () => {
        try {
            await axios.patch("/api/onstage/update-contestant", {
                regId: editing.regId,
                contestantIndex: editing.index,
                newName: editing.name,
            });
            setEditing({ regId: null, index: null as any, name: "" });
            fetchData();
        } catch (error) {
            alert("Error updating name");
        }
    };

    // --- FILTERING LOGIC ---
    const filteredData = data.filter((reg) => {
        const matchesEvent = !filterEvent || reg.eventName === filterEvent;
        const matchesSearch =
            reg.teamName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            reg.teamId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            reg.lot_number?.toString().includes(searchQuery);

        return matchesEvent && matchesSearch;
    });

    // --- HELPER FUNCTIONS ---
    const getStatusBadge = (status: string) => {
        const config = {
            "PRESENT": { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", icon: CheckCircle },
            "ABSENT": { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", icon: XCircle },
            "MALPRACTICE": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", icon: ShieldAlert },
            "PENDING": { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", icon: Clock }
        }[status] || { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200", icon: Clock };

        const Icon = config.icon;
        return (
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${config.bg} ${config.border} border`}>
                <Icon className="w-3 h-3" />
                <span className="text-xs font-semibold uppercase tracking-wide">{status}</span>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/30">
            {/* --- HEADER --- */}
            <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-gray-200/50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between py-4 gap-4">
                        <div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-sm">
                                    <Users className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">On-Stage Attendance</h1>
                                    <p className="text-sm text-gray-500 mt-1">Manage contestants and track attendance efficiently</p>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex flex-wrap gap-3">
                            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white px-4 py-2 rounded-xl shadow-sm">
                                <div className="text-2xl font-bold">{stats.present}</div>
                                <div className="text-xs opacity-90">Present</div>
                            </div>
                            <div className="bg-gradient-to-br from-rose-500 to-rose-600 text-white px-4 py-2 rounded-xl shadow-sm">
                                <div className="text-2xl font-bold">{stats.absent}</div>
                                <div className="text-xs opacity-90">Absent</div>
                            </div>
                            <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white px-4 py-2 rounded-xl shadow-sm">
                                <div className="text-2xl font-bold">{stats.malpractice}</div>
                                <div className="text-xs opacity-90">Reported</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- CONTROLS --- */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Event Filter */}
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <div className="flex items-center gap-2">
                                    <Trophy className="w-4 h-4 text-indigo-500" />
                                    Select Event
                                </div>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Filter className="h-4 w-4 text-gray-400" />
                                </div>
                                <select
                                    value={filterEvent}
                                    onChange={(e) => setFilterEvent(e.target.value)}
                                    className="block w-full pl-10 pr-8 py-3 text-sm border-gray-300 bg-gray-50 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 cursor-pointer appearance-none border"
                                >
                                    <option value="" disabled>Select an event</option>
                                    {events.map((ev) => (
                                        <option key={ev} value={ev}>{ev}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Search */}
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <div className="flex items-center gap-2">
                                    <Search className="w-4 h-4 text-indigo-500" />
                                    Search Teams
                                </div>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search by Team Name, ID, or Lot Number..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="block w-full pl-10 pr-4 py-3 text-sm border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 border shadow-sm transition-all duration-200"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- CONTENT --- */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-[3px] border-indigo-500 border-t-transparent mb-4"></div>
                        <p className="text-gray-500 animate-pulse">Loading attendance data...</p>
                    </div>
                ) : filteredData.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-300">
                        <Users className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No teams found</h3>
                        <p className="text-gray-500 max-w-md mx-auto">Try adjusting your filters or search terms.</p>
                    </div>
                ) : (
                    <>
                        {/* MOBILE VIEW */}
                        <div className="lg:hidden space-y-4">
                            {filteredData.map((reg) => (
                                <div
                                    key={reg._id}
                                    className={`bg-white rounded-2xl shadow-sm border transition-all duration-300 overflow-hidden ${expandedCard === reg._id ? 'ring-2 ring-indigo-500 shadow-md' : 'border-gray-200 hover:border-gray-300 hover:shadow'}`}
                                >
                                    {/* Card Header */}
                                    <div
                                        className="p-5 flex items-center justify-between cursor-pointer active:bg-gray-50/50"
                                        onClick={() => setExpandedCard(expandedCard === reg._id ? null : reg._id)}
                                    >
                                        <div className="flex items-center gap-4">
                                            {/* Lot Badge */}
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl opacity-10"></div>
                                                <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold rounded-xl w-14 h-14 flex flex-col items-center justify-center shadow-sm">
                                                    <span className="text-[10px] opacity-90">LOT</span>
                                                    <span className="text-xl">{reg.lot_number}</span>
                                                </div>
                                            </div>

                                            {/* Team Info */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-gray-900 truncate">{reg.teamName}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Building className="w-3 h-3 text-gray-400" />
                                                    <span className="text-xs text-gray-500 font-mono truncate">{reg.teamId}</span>
                                                </div>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="inline-block px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs rounded-full font-medium">
                                                        {reg.eventName}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${expandedCard === reg._id ? "rotate-180 text-indigo-600" : ""}`} />
                                    </div>

                                    {/* Expanded Content */}
                                    {expandedCard === reg._id && (
                                        <div className="border-t border-gray-100 p-5 space-y-4">
                                            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                                <UserCheck className="w-4 h-4 text-indigo-500" />
                                                Contestants ({reg.contestants.length})
                                            </h4>

                                            {reg.contestants.map((c: any, idx: number) => (
                                                <div key={idx} className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl p-4 shadow-sm">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <Hash className="w-3 h-3 text-gray-400" />
                                                                <span className="text-xs font-mono text-gray-500">{c.dNo}</span>
                                                            </div>
                                                            {editing.regId === reg._id && editing.index === idx ? (
                                                                <div className="flex items-center gap-2">
                                                                    <input
                                                                        className="border border-indigo-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                        value={editing.name}
                                                                        autoFocus
                                                                        onClick={(e) => e.stopPropagation()}
                                                                        onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                                                                    />
                                                                    <button
                                                                        onClick={updateName}
                                                                        className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                                                                    >
                                                                        <Save size={16} />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => setEditing({ regId: null, index: null as any, name: "" })}
                                                                        className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                                                                    >
                                                                        <X size={16} />
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center gap-2 group">
                                                                    <span className="text-sm font-medium text-gray-900">{c.contestantName}</span>
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setEditing({ regId: reg._id, index: idx as any, name: c.contestantName });
                                                                        }}
                                                                        className="text-gray-300 opacity-0 group-hover:opacity-100 hover:text-indigo-600 p-1 transition-all"
                                                                    >
                                                                        <Edit2 className="w-3 h-3" />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="ml-2">
                                                            {c.status && getStatusBadge(c.status)}
                                                        </div>
                                                    </div>

                                                    {/* Action Buttons */}
                                                    <div className="grid grid-cols-3 gap-2">
                                                        <button
                                                            onClick={() => saveAttendance(c, "PRESENT", reg)}
                                                            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${c.status === "PRESENT"
                                                                ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-200"
                                                                : "bg-white border border-gray-200 text-gray-600 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700"
                                                                }`}
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                            Present
                                                        </button>
                                                        <button
                                                            onClick={() => saveAttendance(c, "ABSENT", reg)}
                                                            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${c.status === "ABSENT"
                                                                ? "bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-md shadow-rose-200"
                                                                : "bg-white border border-gray-200 text-gray-600 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700"
                                                                }`}
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                            Absent
                                                        </button>
                                                        <button
                                                            onClick={() => setMalpracticeTarget({ reg, contestant: c, index: idx })}
                                                            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${c.status === "MALPRACTICE"
                                                                ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md shadow-amber-200"
                                                                : "bg-white border border-gray-200 text-gray-600 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700"
                                                                }`}
                                                        >
                                                            <ShieldAlert className="w-4 h-4" />
                                                            Report
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* DESKTOP VIEW */}
                        <div className="hidden lg:block">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200">
                                                <th className="px-8 py-4 text-left">
                                                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Lot</div>
                                                </th>
                                                <th className="px-8 py-4 text-left">
                                                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Team Details</div>
                                                </th>
                                                <th className="px-8 py-4 text-left">
                                                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Contestants</div>
                                                </th>
                                                <th className="px-8 py-4 text-left">
                                                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {filteredData.map((reg) => (
                                                <tr key={reg._id} className="hover:bg-gray-50/50 transition-colors duration-200">
                                                    {/* Lot Number */}
                                                    <td className="px-8 py-6">
                                                        <div className="relative">
                                                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl opacity-10"></div>
                                                            <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold rounded-xl w-16 h-16 flex flex-col items-center justify-center shadow-sm">
                                                                <span className="text-[10px] opacity-90">LOT</span>
                                                                <span className="text-2xl">{reg.lot_number}</span>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Team Details */}
                                                    <td className="px-8 py-6">
                                                        <div>
                                                            <h3 className="font-bold text-gray-900 text-lg mb-1">{reg.teamName}</h3>
                                                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                                                <Building className="w-4 h-4" />
                                                                <span className="font-mono">{reg.teamId}</span>
                                                            </div>
                                                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium">
                                                                <Trophy className="w-4 h-4" />
                                                                {reg.eventName}
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Contestants */}
                                                    <td className="px-8 py-6">
                                                        <div className="space-y-3">
                                                            {reg.contestants.map((c: any, idx: number) => (
                                                                <div key={idx} className="flex items-center justify-between group">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="text-sm font-mono text-gray-400 min-w-[60px]">
                                                                            {c.dNo}
                                                                        </div>
                                                                        <div className="flex items-center gap-2">
                                                                            {editing.regId === reg._id && editing.index === idx ? (
                                                                                <div className="flex items-center gap-2">
                                                                                    <input
                                                                                        className="border border-indigo-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                                        value={editing.name}
                                                                                        onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                                                                                    />
                                                                                    <button
                                                                                        onClick={updateName}
                                                                                        className="p-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                                                                                    >
                                                                                        <Save size={14} />
                                                                                    </button>
                                                                                    <button
                                                                                        onClick={() => setEditing({ regId: null, index: null as any, name: "" })}
                                                                                        className="p-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                                                                                    >
                                                                                        <X size={14} />
                                                                                    </button>
                                                                                </div>
                                                                            ) : (
                                                                                <>
                                                                                    <span className="text-sm font-medium text-gray-900">{c.contestantName}</span>
                                                                                    <button
                                                                                        onClick={() => setEditing({ regId: reg._id, index: idx as any, name: c.contestantName })}
                                                                                        className="text-gray-300 opacity-0 group-hover:opacity-100 hover:text-indigo-600 p-1 transition-all"
                                                                                    >
                                                                                        <Edit2 size={12} />
                                                                                    </button>
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="min-w-[120px]">
                                                                        {c.status && getStatusBadge(c.status)}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </td>

                                                    {/* Actions */}
                                                    <td className="px-8 py-6">
                                                        <div className="space-y-3">
                                                            {reg.contestants.map((c: any, idx: number) => (
                                                                <div key={idx} className="flex items-center gap-2">
                                                                    <button
                                                                        onClick={() => saveAttendance(c, "PRESENT", reg)}
                                                                        className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${c.status === 'PRESENT'
                                                                            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md'
                                                                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700'
                                                                            }`}
                                                                    >
                                                                        <CheckCircle className="w-4 h-4" />
                                                                        Present
                                                                    </button>
                                                                    <button
                                                                        onClick={() => saveAttendance(c, "ABSENT", reg)}
                                                                        className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${c.status === 'ABSENT'
                                                                            ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-md'
                                                                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700'
                                                                            }`}
                                                                    >
                                                                        <XCircle className="w-4 h-4" />
                                                                        Absent
                                                                    </button>
                                                                    <button
                                                                        onClick={() => setMalpracticeTarget({ reg, contestant: c, index: idx })}
                                                                        className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${c.status === 'MALPRACTICE'
                                                                            ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md'
                                                                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700'
                                                                            }`}
                                                                    >
                                                                        <ShieldAlert className="w-4 h-4" />
                                                                        Report
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* --- MALPRACTICE MODAL --- */}
            {malpracticeTarget && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-200/50 overflow-hidden">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-orange-50">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl shadow-sm">
                                    <ShieldAlert className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Report Malpractice</h2>
                                    <p className="text-sm text-gray-600 mt-1">This action will be permanently logged</p>
                                </div>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                            <div className="bg-gray-50 rounded-xl p-4 mb-5">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Building className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm font-medium text-gray-900">{malpracticeTarget.reg.teamName}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <UserCheck className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm text-gray-700">
                                            {malpracticeTarget.contestant.contestantName} <span className="text-gray-500">({malpracticeTarget.contestant.dNo})</span>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <label className="block text-sm font-medium text-gray-700 mb-3">Details / Remarks</label>
                            <textarea
                                value={malpracticeText}
                                onChange={(e) => setMalpracticeText(e.target.value)}
                                placeholder="Describe the incident in detail..."
                                className="w-full border border-gray-300 p-4 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none h-32 resize-none transition-all"
                                autoFocus
                            />

                            <div className="flex gap-3 mt-8">
                                <button
                                    onClick={() => {
                                        setMalpracticeTarget(null);
                                        setMalpracticeText("");
                                    }}
                                    className="flex-1 px-5 py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-medium transition-all hover:shadow-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => saveAttendance(malpracticeTarget.contestant, "MALPRACTICE", malpracticeTarget.reg, malpracticeText)}
                                    disabled={!malpracticeText.trim()}
                                    className="flex-1 px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition-all shadow-sm hover:shadow"
                                >
                                    Submit Report
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}