"use client";

import { useEffect, useState } from "react";
import {
    Search,
    Filter,
    Loader2,
    Calendar,
    Users,
    FileDown,
    Download,
    FileText,
    PieChart,
    CheckCircle,
    XCircle,
    AlertCircle,
    ChevronDown,
    ChevronUp
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export default function AttendanceRecordPage() {
    const [eventName, setEventName] = useState("");
    const [loading, setLoading] = useState(false);
    const [attendanceData, setAttendanceData] = useState<any[]>([]);
    const [error, setError] = useState("");
    const [events, setEvents] = useState<any[]>([]);
    // console.log(events)
    const [eventsLoading, setEventsLoading] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedCard, setExpandedCard] = useState<number | null>(null);

    // Calculate statistics
    const stats = {
        total: attendanceData.length,
        present: attendanceData.filter(item => item.attendance === "PRESENT").length,
        absent: attendanceData.filter(item => item.attendance === "ABSENT").length,
        malpractice: attendanceData.filter(item => item.attendance === "MALPRACTICE").length,
    };

    // ----------------------------------------------
    // 🔥 Load Events from DB
    // ----------------------------------------------
    const fetchEvents = async () => {
        try {
            setEventsLoading(true);
            const res = await fetch("/api/get-events");
            const data = await res.json();
            console.log(data)
            if (data.success) {
                const names = data.events
                    .map((ev: any) => (typeof ev === "string" ? ev : ev?.eventName))
                    .filter(Boolean);
                const uniqueNames = Array.from(new Set(names));
                setEvents(uniqueNames);
            } else {
                setError("Failed to load events.");
            }
        } catch (err) {
            console.log("Error loading events:", err);
            setError("Something went wrong while loading events.");
        } finally {
            setEventsLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    // ----------------------------------------------
    // 🔥 Auto Fetch Attendance when event changes
    // ----------------------------------------------
    const fetchAttendance = async (selectedEvent: string) => {
        if (!selectedEvent) {
            setAttendanceData([]);
            return;
        }

        setLoading(true);
        setError("");
        setAttendanceData([]);

        try {
            const res = await fetch("/api/get-attendance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ filterEvent: selectedEvent }),
            });

            const data = await res.json();

            if (!data.success) {
                setError("Failed to fetch attendance.");
                return;
            }

            if (!Array.isArray(data.attendance) || data.attendance.length === 0) {
                setError("No attendance records found for this event.");
            }

            setAttendanceData(data.attendance || []);
        } catch (err) {
            setError("Something went wrong while fetching.");
            console.log("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    // AUTO TRIGGER API WHEN DROPDOWN CHANGES
    useEffect(() => {
        fetchAttendance(eventName);
    }, [eventName]);

    // Filter attendance based on search
    const filteredData = attendanceData.filter((item) => {
        const query = searchQuery.toLowerCase();
        return (
            item.contestantName?.toLowerCase().includes(query) ||
            item.teamName?.toLowerCase().includes(query) ||
            item.dNo?.toLowerCase().includes(query) ||
            item.lotNumber?.toLowerCase().includes(query)
        );
    });


    // ----------------------------------------------
    // ✅ Export helpers
    // ----------------------------------------------
    const formatForExport = (rows: any[]) =>
        rows.map((r) => ({
            Event: r.eventName ?? r.event ?? "",
            Contestant: r.contestantName ?? r.name ?? "",
            Team: r.teamName ?? "",
            TeamID: r.teamId ?? r.teamID ?? "",
            DNo: r.dNo ?? "",
            Lot: r.lotNumber ?? r.lot ?? "",
            Status: r.attendance ?? "",
            Malpractice: r.malpracticeDetails ?? "",
        }));

    const downloadExcel = (rows: any[], filename = "attendance.xlsx") => {
        const formatted = formatForExport(rows);
        const worksheet = XLSX.utils.json_to_sheet(formatted);
        const wscols = [
            { wch: 20 }, // Event
            { wch: 25 }, // Contestant
            { wch: 28 }, // Team
            { wch: 12 }, // TeamID
            { wch: 8 }, // DNo
            { wch: 8 }, // Lot
            { wch: 12 }, // Status
            { wch: 30 }, // Malpractice
        ];
        worksheet["!cols"] = wscols;

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
        const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([wbout], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    };

    const downloadPDF = (rows: any[], title = "Attendance Report") => {
        const doc = new jsPDF({
            orientation: "landscape",
            unit: "pt",
            format: "a4",
        });

        const now = new Date();
        const dateStr = now.toLocaleString();
        const headerText = title + " — " + dateStr;
        doc.setFontSize(14);
        doc.text(headerText, 40, 40);

        const formatted = formatForExport(rows);
        const columns = [
            { header: "Event", dataKey: "Event" },
            { header: "Contestant", dataKey: "Contestant" },
            { header: "Team", dataKey: "Team" },
            { header: "Team ID", dataKey: "TeamID" },
            { header: "D.No", dataKey: "DNo" },
            { header: "Lot", dataKey: "Lot" },
            { header: "Status", dataKey: "Status" },
            { header: "Malpractice", dataKey: "Malpractice" },
        ];

        autoTable(doc as any, {
            startY: 60,
            headStyles: { fillColor: [59, 130, 246], textColor: 255, halign: "left" },
            styles: { fontSize: 9, cellPadding: 6, overflow: "linebreak" },
            columnStyles: {
                Event: { cellWidth: 90 },
                Contestant: { cellWidth: 130 },
                Team: { cellWidth: 150 },
                TeamID: { cellWidth: 60 },
                DNo: { cellWidth: 40 },
                Lot: { cellWidth: 40 },
                Status: { cellWidth: 70 },
                Malpractice: { cellWidth: 200 },
            },
            columns,
            body: formatted,
            didDrawPage: (dataArg) => {
                const page = doc.getNumberOfPages();
                doc.setFontSize(9);
                doc.text(
                    `Page ${page}`,
                    doc.internal.pageSize.getWidth() - 60,
                    doc.internal.pageSize.getHeight() - 20
                );
            },
            margin: { left: 40, right: 40, top: 60, bottom: 40 },
            showHead: "everyPage",
        });

        doc.save(`${title.replace(/\s+/g, "_")}.pdf`);
    };

    // Export actions
    const exportCurrentAsPDF = () => {
        if (!attendanceData || attendanceData.length === 0) {
            setError("No records to export for selected event.");
            return;
        }
        setExporting(true);
        try {
            downloadPDF(attendanceData, eventName ? `${eventName} - Attendance` : "Filtered Attendance");
        } catch (err) {
            console.error("PDF export error:", err);
            setError("Failed to export PDF.");
        } finally {
            setExporting(false);
        }
    };

    const exportCurrentAsExcel = () => {
        if (!attendanceData || attendanceData.length === 0) {
            setError("No records to export for selected event.");
            return;
        }
        setExporting(true);
        try {
            const filename = eventName ? `${eventName}_Attendance.xlsx` : "filtered_attendance.xlsx";
            downloadExcel(attendanceData, filename);
        } catch (err) {
            console.error("Excel export error:", err);
            setError("Failed to export Excel.");
        } finally {
            setExporting(false);
        }
    };

    const exportAllAsPDF = async () => {
        setExporting(true);
        setError("");
        try {
            const res = await fetch("/api/get-attendance-all");
            const data = await res.json();
            if (!data.success) {
                setError("Failed to fetch all attendance for export.");
                return;
            }
            const rows = data.attendance || [];
            if (rows.length === 0) {
                setError("No attendance data available to export.");
                return;
            }
            downloadPDF(rows, "All_Attendance");
        } catch (err) {
            console.error("Export all PDF error:", err);
            setError("Failed to export all PDF.");
        } finally {
            setExporting(false);
        }
    };

    const exportAllAsExcel = async () => {
        setExporting(true);
        setError("");
        try {
            const res = await fetch("/api/get-attendance-all");
            const data = await res.json();
            if (!data.success) {
                setError("Failed to fetch all attendance for export.");
                return;
            }
            const rows = data.attendance || [];
            if (rows.length === 0) {
                setError("No attendance data available to export.");
                return;
            }
            downloadExcel(rows, "all_attendance.xlsx");
        } catch (err) {
            console.error("Export all Excel error:", err);
            setError("Failed to export all Excel.");
        } finally {
            setExporting(false);
        }
    };

    // ----------------------------------------------
    const statusColor = (s: string) => {
        switch (s) {
            case "PRESENT":
                return "bg-emerald-100 text-emerald-800 border border-emerald-200";
            case "ABSENT":
                return "bg-red-100 text-red-800 border border-red-200";
            case "MALPRACTICE":
                return "bg-amber-100 text-amber-800 border border-amber-200";
            default:
                return "bg-slate-100 text-slate-800 border border-slate-200";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "PRESENT":
                return <CheckCircle size={16} className="text-emerald-600" />;
            case "ABSENT":
                return <XCircle size={16} className="text-red-600" />;
            case "MALPRACTICE":
                return <AlertCircle size={16} className="text-amber-600" />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            {/* Header Section */}
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <Calendar className="w-8 h-8 text-indigo-600" />
                            Attendance Records
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            View and manage event-wise attendance data
                        </p>
                    </div>

                    <div className="flex flex-col xs:flex-row gap-2">
                        <button
                            onClick={exportCurrentAsPDF}
                            disabled={exporting || loading || attendanceData.length === 0}
                            className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all text-sm shadow-lg shadow-indigo-600/20 disabled:opacity-50"
                        >
                            {exporting ? <Loader2 className="animate-spin" size={16} /> : <FileText size={16} />}
                            <span>Export PDF</span>
                        </button>
                        <button
                            onClick={exportCurrentAsExcel}
                            disabled={exporting || loading || attendanceData.length === 0}
                            className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:from-emerald-700 hover:to-green-700 transition-all text-sm shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                        >
                            <FileDown size={16} />
                            <span>Export Excel</span>
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                {attendanceData.length > 0 && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <Users className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-lg">
                                    Total
                                </div>
                            </div>
                            <div className="mt-3">
                                <h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3>
                                <p className="text-sm text-gray-500">Records</p>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="p-2 bg-emerald-50 rounded-lg">
                                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                                </div>
                                <div className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-lg">
                                    {attendanceData.length > 0 ? Math.round((stats.present / stats.total) * 100) : 0}%
                                </div>
                            </div>
                            <div className="mt-3">
                                <h3 className="text-2xl font-bold text-gray-900">{stats.present}</h3>
                                <p className="text-sm text-gray-500">Present</p>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="p-2 bg-red-50 rounded-lg">
                                    <XCircle className="w-6 h-6 text-red-600" />
                                </div>
                                <div className="text-xs text-red-600 font-medium bg-red-50 px-2 py-1 rounded-lg">
                                    {attendanceData.length > 0 ? Math.round((stats.absent / stats.total) * 100) : 0}%
                                </div>
                            </div>
                            <div className="mt-3">
                                <h3 className="text-2xl font-bold text-gray-900">{stats.absent}</h3>
                                <p className="text-sm text-gray-500">Absent</p>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="p-2 bg-amber-50 rounded-lg">
                                    <AlertCircle className="w-6 h-6 text-amber-600" />
                                </div>
                                <div className="text-xs text-amber-600 font-medium bg-amber-50 px-2 py-1 rounded-lg">
                                    {attendanceData.length > 0 ? Math.round((stats.malpractice / stats.total) * 100) : 0}%
                                </div>
                            </div>
                            <div className="mt-3">
                                <h3 className="text-2xl font-bold text-gray-900">{stats.malpractice}</h3>
                                <p className="text-sm text-gray-500">Malpractice</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Filter & Search Section */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Filter size={20} className="text-gray-500" />
                            <span className="font-semibold text-gray-700">Event Filter</span>
                        </div>

                        <select
                            className="px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm w-full sm:w-64"
                            value={eventName}
                            onChange={(e) => {
                                setEventName(e.target.value);
                                setError("");
                            }}
                            disabled={eventsLoading}
                        >
                            <option value="">{eventsLoading ? "Loading events..." : "Choose Event"}</option>
                            {events.map((name: any, idx: number) => (
                                <option key={idx} value={name}>
                                    {name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="relative w-full lg:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search contestant, team, or D-No..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Export All Section */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                            <Download size={16} />
                            <span>Export all attendance data:</span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={exportAllAsPDF}
                                disabled={exporting}
                                className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm shadow-sm disabled:opacity-50"
                            >
                                {exporting ? <Loader2 className="animate-spin" size={14} /> : <FileText size={14} />}
                                <span>All PDF</span>
                            </button>
                            <button
                                onClick={exportAllAsExcel}
                                disabled={exporting}
                                className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm shadow-sm disabled:opacity-50"
                            >
                                <FileDown size={14} />
                                <span>All Excel</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
                    <div className="flex items-center gap-2">
                        <AlertCircle size={18} />
                        <span className="font-medium">{error}</span>
                    </div>
                </div>
            )}

            {/* Results Section */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Desktop Table View */}
                <div className="hidden lg:block">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Contestant Details
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Team Information
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        D-No & Lot
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Malpractice Details
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <Loader2 className="animate-spin text-gray-400 mb-4" size={32} />
                                                <p className="text-gray-500">Loading attendance data...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredData.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center text-gray-400">
                                                <Search size={48} className="mb-4 opacity-20" />
                                                <p className="text-lg font-medium text-gray-900">No records found</p>
                                                <p className="text-sm">
                                                    {searchQuery
                                                        ? `No results for "${searchQuery}"`
                                                        : eventName
                                                            ? "No attendance records for this event yet"
                                                            : "Please select an event to view attendance"
                                                    }
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredData.map((item: any, idx: number) => (
                                        <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                                        {item.contestantName?.charAt(0) || "?"}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-900">{item.contestantName}</p>
                                                        <p className="text-xs text-gray-500">Event: {eventName}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{item.teamName}</p>
                                                    <p className="text-xs text-gray-500 font-mono">{item.teamId}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium text-gray-600">D-No:</span>
                                                        <span className="text-sm font-semibold text-gray-900">{item.dNo}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium text-gray-600">Lot:</span>
                                                        <span className="text-sm font-bold text-indigo-700">{item.lotNumber}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {getStatusIcon(item.attendance)}
                                                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${statusColor(item.attendance)}`}>
                                                        {item.attendance}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.malpracticeDetails ? (
                                                    <div className="text-sm">
                                                        <p className="text-red-600 font-medium">{item.malpracticeDetails}</p>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400">—</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden">
                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="flex flex-col items-center justify-center">
                                <Loader2 className="animate-spin text-gray-400 mb-4" size={32} />
                                <p className="text-gray-500">Loading attendance data...</p>
                            </div>
                        </div>
                    ) : filteredData.length === 0 ? (
                        <div className="p-8 text-center">
                            <div className="flex flex-col items-center justify-center text-gray-400">
                                <Search size={48} className="mb-4 opacity-20" />
                                <p className="text-lg font-medium text-gray-900">No records found</p>
                                <p className="text-sm">
                                    {searchQuery
                                        ? `No results for "${searchQuery}"`
                                        : eventName
                                            ? "No attendance records for this event yet"
                                            : "Please select an event to view attendance"
                                    }
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 space-y-3">
                            {filteredData.map((item: any, idx: number) => (
                                <div
                                    key={idx}
                                    className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow"
                                >

                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-3 flex-1">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                                                {item.contestantName?.charAt(0) || "?"}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-gray-900 text-sm truncate">
                                                    {item.contestantName}
                                                </h3>
                                                <h3 className="font-semibold text-gray-900 text-sm truncate">
                                                    {item.secondContestantName
                                                    }
                                                </h3>
                                                <p className="text-xs text-gray-500 mt-1 truncate">
                                                    Event: {eventName}
                                                </p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    {getStatusIcon(item.attendance)}
                                                    <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${statusColor(item.attendance)}`}>
                                                        {item.attendance}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setExpandedCard(expandedCard === idx ? null : idx)}
                                            className="text-gray-400 hover:text-gray-600 p-1"
                                        >
                                            {expandedCard === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                        </button>
                                    </div>

                                    <div className="mt-3 space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">Team:</span>
                                            <span className="font-medium text-gray-900 truncate ml-2">{item.teamName}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">Team ID:</span>
                                            <span className="font-mono text-gray-700">{item.teamId}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">D-No:</span>
                                            <span className="font-semibold text-gray-900">{item.dNo}</span>
                                        </div>
                                        {item.secondDno && (
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500">Secord D-No:</span>
                                                <span className="font-semibold text-gray-900">{item.secondDno}</span>
                                            </div>
                                        )}

                                        {/* Cartooning */}
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">Lot Number:</span>
                                            <span className="font-bold text-indigo-700">{item.lotNumber}</span>
                                        </div>
                                    </div>

                                    {expandedCard === idx && item.malpracticeDetails && (
                                        <div className="mt-3 pt-3 border-t border-gray-100">
                                            <div className="text-sm">
                                                <div className="flex items-center gap-1 text-red-600 font-medium mb-1">
                                                    <AlertCircle size={14} />
                                                    <span>Malpractice Record:</span>
                                                </div>
                                                <p className="text-red-600 text-sm bg-red-50 p-2 rounded-lg">
                                                    {item.malpracticeDetails}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
}