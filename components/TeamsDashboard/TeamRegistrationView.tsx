"use client";

import { useRouter } from "next/navigation";
import { CalendarPlus, ArrowRight, Music, Mic2, Calendar, Info } from "lucide-react";

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
        return new Date(dateString).toLocaleDateString("en-US", {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };
    console.log(registrations)
    // Helper: Status Styles
    const getStatusStyle = (status: string) => {
        switch (status) {
            case "Approved": return "bg-green-100 text-green-700 border-green-200";
            case "Pending": return "bg-yellow-50 text-yellow-700 border-yellow-200";
            case "Correction Needed": return "bg-orange-100 text-orange-700 border-orange-200";
            case "Rejected": return "bg-red-100 text-red-700 border-red-200";
            default: return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Card */}
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 sm:p-8 rounded-2xl text-white shadow-lg">
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
                            <div key={row._id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                                {/* Card Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-bold text-gray-900 text-lg">{row.eventName}</h3>
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusStyle(row.status)}`}>
                                        {row.status}
                                    </span>
                                </div>

                                {/* Card Body */}
                                <div className="space-y-3 text-sm text-gray-600">
                                    <div className="flex items-center gap-3">
                                        <Mic2 className="w-4 h-4 text-gray-400 shrink-0" />
                                        <span className="font-medium text-gray-900">Song:</span>
                                        <span className="truncate">{row.songTitle || "N/A"}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Music className="w-4 h-4 text-gray-400 shrink-0" />
                                        <span className="font-medium text-gray-900">Tune:</span>
                                        <span className="truncate">{row.tune || "N/A"}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                                        <span className="font-medium text-gray-900">Date:</span>
                                        <span>{formatDate(row.registrationDate)}</span>
                                    </div>
                                </div>

                                {/* Remarks Footer */}
                                {row.remark && row.remark !== "-" && (
                                    <div className="mt-4 bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-start gap-2">
                                        <Info className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                                        <p className="text-xs text-gray-500 italic">{row.remark}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* --- DESKTOP VIEW (Table) --- */}
                    <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold text-gray-700">Event Name</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700">Song Title</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700">Tune</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700">Date</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700">Remarks</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {registrations.map((row) => (
                                        <tr key={row._id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900">{row.eventName}</td>
                                            <td className="px-6 py-4 text-gray-600">{row.songTitle || "-"}</td>
                                            <td className="px-6 py-4 text-gray-500">{row.tune || "-"}</td>
                                            <td className="px-6 py-4 text-gray-500">{formatDate(row.registrationDate)}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(row.status)}`}>
                                                    {row.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 italic">
                                                {row.remark === "-" ? "" : row.remark}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}