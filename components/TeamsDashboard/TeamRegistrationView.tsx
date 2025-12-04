"use client";

import { useRouter } from "next/navigation";
import { CalendarPlus, ArrowRight, Music, Mic2, Calendar, Info, Eye, MoreHorizontal, ExternalLink } from "lucide-react";

interface Registration {
    _id: string;
    eventName: string;
    songTitle?: string;
    tune?: string;
    registrationDate: string;
    status: string;
    remark?: string;
}

interface TeamRegistrationViewProps {
    teamName: string;
    registrations: Registration[];
}

export default function TeamRegistrationView({ teamName, registrations }: TeamRegistrationViewProps) {
    const router = useRouter();

    // Helper: Format Date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            timeZone: "Asia/Kolkata"
        });
    };

    // Helper: Status Styles
    const getStatusStyle = (status: string) => {
        switch (status) {
            case "approved": return "bg-green-100 text-green-700 border-green-200";
            case "pending": return "bg-yellow-50 text-yellow-700 border-yellow-200";
            case "correction": return "bg-orange-100 text-orange-700 border-orange-200";
            default: return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    // Helper: Truncate text with ellipsis
    const truncateText = (text: string, maxLength: number) => {
        if (!text) return "-";
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + "...";
    };

    // Helper: Format time from date
    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            timeZone: "Asia/Kolkata"
        });
    };

    return (
        <div className="space-y-6">
            {/* Header Card */}
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 sm:p-8 rounded-2xl text-white shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold">Event Registration</h1>
                        <p className="text-indigo-100 mt-2 text-sm sm:text-base">
                            Team: <span className="font-semibold">{teamName}</span>
                        </p>
                        <p className="opacity-80 mt-1 text-sm sm:text-base">
                            {registrations.length > 0
                                ? "View your submitted events and approval status below."
                                : "You haven't registered for any events yet."}
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <div className="flex items-center gap-4">
                            <div className="text-center px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm">
                                <div className="text-2xl font-bold">{registrations.length}</div>
                                <div className="text-xs text-indigo-200">Total Registrations</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CONDITIONAL RENDER: Empty State vs Data */}
            {registrations.length === 0 ? (
                // --- EMPTY STATE UI ---
                <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-8 sm:p-12 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors">
                    <div className="bg-indigo-50 p-4 rounded-full mb-4">
                        <CalendarPlus className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-600" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Registration is Open!</h3>
                    <p className="text-gray-500 max-w-md mb-6 text-sm sm:text-base">
                        No events found. Visit the registration page to view the list of available events and fill in your details.
                    </p>
                    <button
                        onClick={() => router.push('./registration')}
                        className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm transition-all transform hover:scale-105"
                    >
                        Register for Events
                        <ArrowRight className="ml-2 w-4 h-4" />
                    </button>
                </div>
            ) : (
                <>
                    {/* --- MOBILE VIEW (Cards) --- */}
                    <div className="grid grid-cols-1 gap-4 md:hidden">
                        {registrations.map((row) => (
                            <div key={row._id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                                {/* Card Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1 min-w-0 mr-2">
                                        <h3 className="font-bold text-gray-900 text-lg truncate" title={row.eventName}>
                                            {truncateText(row.eventName, 30)}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                            <Calendar className="w-3 h-3" />
                                            {formatDate(row.registrationDate)}
                                        </div>
                                    </div>
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border shrink-0 ${getStatusStyle(row.status)}`}>
                                        {row.status}
                                    </span>
                                </div>

                                {/* Card Body */}
                                <div className="space-y-3 text-sm text-gray-600">
                                    <div className="flex items-start gap-3">
                                        <Mic2 className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                                        <div className="flex-1 min-w-0">
                                            <span className="font-medium text-gray-900">Song: </span>
                                            <span className="break-words">{row.songTitle || "N/A"}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Music className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                                        <div className="flex-1 min-w-0">
                                            <span className="font-medium text-gray-900">Tune: </span>
                                            <span className="break-words">{row.tune || "N/A"}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Remarks Footer */}
                                {row.remark && row.remark !== "-" && (
                                    <div className="mt-4 bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-start gap-2">
                                        <Info className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                                        <p className="text-xs text-gray-500 italic line-clamp-2">{row.remark}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* --- DESKTOP VIEW (Table with Column Limits) --- */}
                    <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold text-gray-700 min-w-[180px] max-w-[250px]">Event Name</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700 min-w-[120px] max-w-[180px]">Song Title</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700 min-w-[100px] max-w-[150px]">Tune</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700 min-w-[120px]">Date & Time</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700 min-w-[100px]">Status</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700 min-w-[150px] max-w-[250px]">Remarks</th>
                                        {/* <th className="px-6 py-4 font-semibold text-gray-700 min-w-[80px]">Action</th> */}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {registrations.map((row) => (
                                        <tr key={row._id} className="hover:bg-gray-50/50 transition-colors group">
                                            {/* Event Name - with truncation */}
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900 truncate max-w-[250px]" title={row.eventName}>
                                                    {row.eventName}
                                                </div>
                                            </td>
                                            
                                            {/* Song Title - with word wrapping */}
                                            <td className="px-6 py-4">
                                                <div className="text-gray-600 break-words max-w-[180px] min-h-[24px] " title={row.songTitle || "N/A"}>
                                                    {row.songTitle || "-"}
                                                </div>
                                            </td>
                                            
                                            {/* Tune - with truncation */}
                                            <td className="px-6 py-4">
                                                <div className="text-gray-500 break-words max-w-[180px] min-h-[24px]" title={row.tune || "N/A"}>
                                                    {row.tune || "-"}
                                                </div>
                                            </td>
                                            
                                            {/* Date & Time - in two lines */}
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <div className="text-gray-700 font-medium whitespace-nowrap">
                                                        {formatDate(row.registrationDate).split(',')[0]}
                                                    </div>
                                                    <div className="text-xs text-gray-500 whitespace-nowrap">
                                                        {formatTime(row.registrationDate)}
                                                    </div>
                                                </div>
                                            </td>
                                            
                                            {/* Status */}
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(row.status)}`}>
                                                    {row.status}
                                                </span>
                                            </td>
                                            
                                            {/* Remarks - with multiline handling */}
                                            <td className="px-6 py-4">
                                                <div className="text-gray-500 italic line-clamp-2 max-w-[250px]" title={row.remark || ""}>
                                                    {row.remark === "-" ? "" : row.remark || "No remarks"}
                                                </div>
                                            </td>
                                            
                                            {/* Actions
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button 
                                                        className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                                        title="More Options"
                                                    >
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td> */}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Table Footer
                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
                            <div className="text-sm text-gray-600">
                                Showing <span className="font-semibold">{registrations.length}</span> registration{registrations.length !== 1 ? 's' : ''}
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1 rounded hover:bg-gray-200 transition-colors">
                                    ← Previous
                                </button>
                                <span className="px-3 py-1 bg-white border border-gray-300 rounded text-sm font-medium">1</span>
                                <button className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1 rounded hover:bg-gray-200 transition-colors">
                                    Next →
                                </button>
                            </div>
                        </div> */}
                    </div>
                    
                    {/* Summary Stats */}
                    <div className="bg-gradient-to-r from-gray-50 to-indigo-50 rounded-xl p-6 border border-gray-200">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Info className="w-5 h-5 text-indigo-600" />
                            Registration Summary
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                                <div className="text-sm text-gray-500">Approved</div>
                                <div className="text-2xl font-bold text-green-600">
                                    {registrations.filter(r => r.status === 'approved').length}
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                                <div className="text-sm text-gray-500">Pending</div>
                                <div className="text-2xl font-bold text-yellow-600">
                                    {registrations.filter(r => r.status === 'pending').length}
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                                <div className="text-sm text-gray-500">Needs Correction</div>
                                <div className="text-2xl font-bold text-orange-600">
                                    {registrations.filter(r => r.status === 'correction').length}
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                                <div className="text-sm text-gray-500">Total</div>
                                <div className="text-2xl font-bold text-indigo-600">
                                    {registrations.length}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}