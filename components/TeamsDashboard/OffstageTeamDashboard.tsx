"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Search,
  Calendar,
  Users,
  User,
  Trophy,
  LayoutDashboard,
  Hash,
  Smartphone,
  Monitor,
} from "lucide-react";

interface OffstageReg {
  _id: string;
  eventName: string;
  contestantName: string;
  dNo: string;
  secondContestantName?: string;
  secondDno?: string;
  createdAt: string;
  lotNo?: string;
}

interface LotResponse {
  lot: { lot_number: string } | null;
}

const LOT_API_URL = "/api/get-lot";

export default function OffstageTeamDashboard({
  teamId,
  teamName,
}: {
  teamId: string;
  teamName: string;
}) {
  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState<OffstageReg[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!teamId) {
      setRegistrations([]);
      setLoading(false);
      return;
    }

    let mounted = true;

    const fetchRegistrationsAndLots = async () => {
      setLoading(true);
      setError(null);

      try {
        // 1) fetch registrations
        const res = await fetch(`/api/offstage/registrations/${teamId}`);
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`Failed to load registrations: ${res.status} ${txt}`);
        }
        const data = await res.json();
        const fetched: OffstageReg[] = (data.registrations || []).map(
          (r: any) =>
            ({
              _id: r._id,
              eventName: r.eventName,
              contestantName: r.contestantName,
              dNo: r.dNo,
              secondContestantName: r.secondContestantName,
              secondDno: r.secondDno,
              createdAt: r.createdAt,
              lotNo: undefined,
            } as OffstageReg)
        );

        // 2) batch fetch lot numbers in parallel (one call per unique event)
        const uniqueEvents = Array.from(
          new Set(fetched.map((f) => f.eventName))
        );

        // map eventName -> lot_number or null
        const eventToLotMap: Record<string, string | null> = {};

        await Promise.all(
          uniqueEvents.map(async (eventName) => {
            try {
              const lotRes = await fetch(LOT_API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ teamId, eventName }),
              });

              if (!lotRes.ok) {
                eventToLotMap[eventName] = null;
                return;
              }

              const lotData: LotResponse = await lotRes.json();
              eventToLotMap[eventName] = lotData?.lot?.lot_number ?? null;
            } catch (e) {
              console.error("lot fetch error for", eventName, e);
              eventToLotMap[eventName] = null;
            }
          })
        );

        // 3) attach lot numbers to registrations
        const withLots = fetched.map((r) => ({
          ...r,
          lotNo: eventToLotMap[r.eventName] ?? "N/A",
        }));

        if (mounted) {
          setRegistrations(withLots);
        }
      } catch (err: any) {
        console.error(err);
        if (mounted) {
          setError(err.message ?? "Failed to fetch registrations");
          setRegistrations([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchRegistrationsAndLots();

    return () => {
      mounted = false;
    };
  }, [teamId]);

  const filteredRegistrations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return registrations;
    return registrations.filter((r) => {
      return (
        r.eventName.toLowerCase().includes(q) ||
        r.contestantName.toLowerCase().includes(q) ||
        r.dNo.toLowerCase().includes(q) ||
        (r.lotNo || "").toLowerCase().includes(q)
      );
    });
  }, [registrations, searchQuery]);

  const formatDate = (date: string) =>
    new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  // Mobile Card Component
  const MobileCardView = ({ registrations }: { registrations: OffstageReg[] }) => (
    <div className="space-y-4 p-2">
      {registrations.map((r) => (
        <div
          key={r._id}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-4"
        >
          {/* Event and Lot Header */}
          <div className="flex justify-between items-start border-b pb-3">
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-lg leading-tight">
                {r.eventName}
              </h3>
              <p className="text-xs text-gray-400 mt-1 font-mono">
                ID: {r._id.slice(-6)}
              </p>
            </div>
            <div className="flex items-center gap-2 ml-3">
              <Hash size={16} className="text-indigo-400" />
              <span className="font-bold text-lg text-indigo-700">
                {r.lotNo ?? "N/A"}
              </span>
            </div>
          </div>

          {/* Participants Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 flex-shrink-0">
                <User size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {r.contestantName}
                </p>
                <p className="text-sm text-gray-500 mt-0.5">{r.dNo}</p>
              </div>
            </div>

            {r.secondContestantName && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 flex-shrink-0">
                  <Users size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {r.secondContestantName}
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {r.secondDno}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Registration Time */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2 text-gray-500">
              <Calendar size={16} />
              <span className="text-sm">{formatDate(r.createdAt)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Desktop Table View
  const DesktopTableView = ({ registrations }: { registrations: OffstageReg[] }) => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
          <tr>
            <th className="px-6 py-4">Event Details</th>
            <th className="px-6 py-4">Lot No.</th>
            <th className="px-6 py-4">Participants</th>
            <th className="px-6 py-4">Registration Time</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {registrations.map((r) => (
            <tr
              key={r._id}
              className="hover:bg-indigo-50/30 transition-colors group"
            >
              <td className="px-6 py-4 align-top">
                <div className="font-semibold text-gray-900 text-base">
                  {r.eventName}
                </div>
                <div className="text-xs text-gray-400 mt-1 font-mono uppercase tracking-wider">
                  ID: {r._id.slice(-6)}
                </div>
              </td>

              <td className="px-6 py-4 align-top">
                <div className="flex items-center gap-2 font-bold text-lg text-indigo-700">
                  <Hash size={18} className="text-indigo-400" />
                  <span>{r.lotNo ?? "N/A"}</span>
                </div>
              </td>

              <td className="px-6 py-4 align-top">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700">
                      <User size={16} />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {r.contestantName}
                      </div>
                      <div className="text-xs text-gray-500 bg-gray-100 inline-block px-1.5 rounded mt-0.5">
                        {r.dNo}
                      </div>
                    </div>
                  </div>

                  {r.secondContestantName && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700">
                        <Users size={16} />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {r.secondContestantName}
                        </div>
                        <div className="text-xs text-gray-500 bg-gray-100 inline-block px-1.5 rounded mt-0.5">
                          {r.secondDno}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </td>

              <td className="px-6 py-4 align-top">
                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar size={16} />
                  <span>{formatDate(r.createdAt)}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-3 md:p-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div>
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-7 h-7 md:w-8 md:h-8 text-indigo-600" />
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                Offstage Dashboard
              </h1>
            </div>
            <p className="text-gray-500 mt-2 flex flex-wrap items-center gap-2">
              Managing registrations for{" "}
              <span className="font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                {teamName}
              </span>
            </p>
          </div>

          {/* View Toggle (Mobile Only) */}
          {!loading && registrations.length > 0 && (
            <div className="md:hidden flex items-center gap-2 self-end">
              <div className="flex items-center gap-1 text-sm text-gray-500">
                {isMobile ? (
                  <>
                    <Smartphone size={16} />
                    <span>Cards</span>
                  </>
                ) : (
                  <>
                    <Monitor size={16} />
                    <span>Table</span>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="bg-white p-3 md:p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3 md:gap-4 w-full md:w-auto">
            <div className="p-2 md:p-3 bg-indigo-100 rounded-full text-indigo-600">
              <Trophy size={20} className="md:w-6 md:h-6" />
            </div>
            <div className="flex-1 md:flex-none">
              <p className="text-xs md:text-sm text-gray-500 font-medium">Total Entries</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900">
                {loading ? "..." : registrations.length}
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search event, contestant, D-No or Lot..."
            className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {error ? (
          <div className="p-6 text-center text-red-600">{error}</div>
        ) : loading ? (
          <TableSkeleton isMobile={isMobile} />
        ) : filteredRegistrations.length > 0 ? (
          <>
            {/* Mobile View */}
            {isMobile ? (
              <MobileCardView registrations={filteredRegistrations} />
            ) : (
              <DesktopTableView registrations={filteredRegistrations} />
            )}
          </>
        ) : (
          <div className="px-6 py-12 text-center">
            <div className="flex flex-col items-center justify-center text-gray-400">
              <Search size={48} className="mb-4 opacity-20" />
              <p className="text-lg font-medium text-gray-900">
                No registrations found
              </p>
              <p className="text-sm mt-1">
                {searchQuery
                  ? `No results for "${searchQuery}"`
                  : "This team hasn't registered for any events yet."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TableSkeleton({ isMobile }: { isMobile: boolean }) {
  if (isMobile) {
    return (
      <div className="animate-pulse p-4 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-50 rounded-xl p-4 space-y-4">
            <div className="flex justify-between">
              <div className="space-y-2 flex-1">
                <div className="h-5 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/3" />
              </div>
              <div className="h-6 bg-gray-200 rounded w-12 ml-4" />
            </div>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-100 rounded w-1/4" />
                </div>
              </div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="animate-pulse">
      <div className="h-12 bg-gray-100 border-b border-gray-200" />
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex border-b border-gray-100 p-6">
          <div className="w-1/4 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-100 rounded w-1/4" />
          </div>
          <div className="w-1/12">
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
          <div className="w-4/12 space-y-3">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-3 bg-gray-100 rounded w-1/4" />
              </div>
            </div>
          </div>
          <div className="w-3/12">
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}