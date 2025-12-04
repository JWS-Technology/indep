"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  Music,
  Users,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";

// Matches your Mongoose Schema
interface Registration {
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

export default function CoordinatorEventsPage() {
  const router = useRouter();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Local state for remarks being edited
  const [remarks, setRemarks] = useState<{ [key: string]: string }>({});
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // ---------------- API CALL: Update Registration ----------------
  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);

    const currentRegistration = registrations.find((r) => r._id === id);
    const finalRemark = remarks[id] !== undefined ? remarks[id] : (currentRegistration?.remark || "");

    try {
      const res = await fetch("/api/coordinator/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          status,
          remark: finalRemark,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setRegistrations((prev) =>
          prev.map((r) =>
            r._id === id
              ? { ...r, status: status as any, remark: finalRemark }
              : r
          )
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  // ---------------- Fetch Events ----------------
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const meRes = await fetch("/api/coordinator/getMe");
        const meData = await meRes.json();

        if (!meRes.ok || !meData.success) {
          router.push("/coordinator/login");
          return;
        }

        const dNo = meData.coordinator?.dNo || meData.user?.dNo;

        const eventsRes = await fetch("/api/coordinator/get-events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dNo }),
        });

        const eventsData = await eventsRes.json();

        if (eventsData.success) {
          setRegistrations(eventsData.eventData);
        }
      } catch (error) {
        console.error("Failed to load events", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [router]);

  // ---------------- Helpers ----------------
  const getStatusBadge = (status: string) => {
    const styles = {
      approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
      correction: "bg-orange-100 text-orange-700 border-orange-200",
      pending: "bg-blue-50 text-blue-700 border-blue-200",
      default: "bg-slate-100 text-slate-600 border-slate-200"
    };

    const icons = {
      approved: <CheckCircle2 size={14} />,
      correction: <AlertCircle size={14} />,
      pending: <Clock size={14} />,
      default: <Clock size={14} />
    };

    const key = status as keyof typeof styles || "default";

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[key]}`}>
        {icons[key]}
        <span className="capitalize">{status}</span>
      </span>
    );
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-IN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // ---------------- Filtering ----------------
  const filteredData = registrations.filter((item) => {
    const matchesSearch =
      item.eventName.toLowerCase().includes(filter.toLowerCase()) ||
      item.teamName.toLowerCase().includes(filter.toLowerCase()) ||
      (item.songTitle &&
        item.songTitle.toLowerCase().includes(filter.toLowerCase()));

    const matchesStatus = statusFilter === "all" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Manage Registrations</h1>
        <p className="text-slate-500 text-sm mt-1">
          Review submissions, assign songs, and manage team statuses.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search team, event, or song..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
          />
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="correction">Correction</option>
          </select>
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-[22%]">
                  Details
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-[20%]">
                  Performance
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-[13%]">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-[25%]">
                  Remark
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right w-[20%]">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredData.length > 0 ? (
                filteredData.map((row) => (
                  <tr key={row._id} className="hover:bg-slate-50/80 transition-colors">

                    {/* Event & Team Details */}
                    <td className="px-6 py-4 align-top break-words">
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-slate-900 text-sm leading-tight">
                          {row.eventName}
                        </span>
                        <div className="flex flex-wrap items-center gap-1.5 text-slate-600 text-xs mt-1">
                          <Users size={12} className="shrink-0" />
                          <span className="font-medium">{row.teamName}</span>
                          <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] text-slate-500 border border-slate-200 whitespace-nowrap">
                            {row.teamId || "N/A"}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1">
                          {formatDateTime(row.registrationDate)}
                        </span>
                      </div>
                    </td>

                    {/* Song & Tune */}
                    <td className="px-6 py-4 align-top break-words">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-start gap-1.5 text-sm font-medium text-slate-800">
                          <Music size={14} className="text-indigo-500 mt-0.5 shrink-0" />
                          <span className="leading-tight">
                            {row.songTitle || <span className="text-slate-400 italic">No Title</span>}
                          </span>
                        </div>
                        {row.tune && (
                          <div className="text-xs text-slate-500 pl-5 leading-tight">
                            Tune: {row.tune}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4 align-top">
                      {getStatusBadge(row.status)}
                    </td>

                    {/* Remark Input */}
                    <td className="px-6 py-4 align-top">
                      <textarea
                        rows={3}
                        placeholder="Add specific instructions..."
                        value={remarks[row._id] !== undefined ? remarks[row._id] : (row.remark || "")}
                        onChange={(e) =>
                          setRemarks({ ...remarks, [row._id]: e.target.value })
                        }
                        className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none transition-all placeholder:text-slate-400"
                      />
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 align-top text-right">
                      <div className="flex flex-col xl:flex-row justify-end gap-2">

                        {/* APPROVE BUTTON - Disabled if already approved */}
                        <button
                          disabled={updatingId === row._id || row.status === "approved"}
                          onClick={() => updateStatus(row._id, "approved")}
                          className="flex items-center justify-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-xs font-medium transition-colors shadow-sm w-full xl:w-auto"
                        >
                          {updatingId === row._id ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <CheckCircle2 size={12} />
                          )}
                          {row.status === "approved" ? "Approved" : "Approve"}
                        </button>

                        <button
                          disabled={updatingId === row._id}
                          onClick={() => updateStatus(row._id, "correction")}
                          className="flex items-center justify-center gap-1 px-3 py-1.5 bg-white border border-orange-200 text-orange-700 hover:bg-orange-50 disabled:opacity-50 rounded-lg text-xs font-medium transition-colors w-full xl:w-auto"
                        >
                          {updatingId === row._id ? <Loader2 size={12} className="animate-spin" /> : <AlertCircle size={12} />}
                          Correction
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <Search className="w-8 h-8 mb-2 opacity-50" />
                      <p className="text-sm font-medium">No registrations match your filter.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}