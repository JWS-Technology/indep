"use client";

import axios from "axios";
import { ClockFading, Search, Users, User, Hash, CheckCircle, XCircle, AlertCircle, ChevronDown, Filter, Calendar, Edit } from "lucide-react";
import { useEffect, useState } from "react";

export default function AttendancePage() {
  const [lots, setLots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterEvent, setFilterEvent] = useState("Cartooning");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState<string[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [malpracticeLot, setMalpracticeLot] = useState<any>(null);
  const [malpracticeText, setMalpracticeText] = useState("");

  const [eventName, seteventName] = useState("");
  const [teamName, setteamName] = useState("");
  const [teamId, setteamId] = useState("");
  const [contestantName, setcontestantName] = useState("");
  const [dNo, setdNo] = useState("");
  const [lotNo, setlotNo] = useState("");
  const [attendance, setattendance] = useState("");
  const [malpracticeDetails, setmalpracticeDetails] = useState("");

  const [getAttendanceData, setgetAttendanceData] = useState(true);
  const [takenAttendanceData, settakenAttendanceData] = useState<any[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // EDITING STATES
  const [editingLotId, setEditingLotId] = useState<string | null>(null);
  const [editContestantName, setEditContestantName] = useState("");

  // NEW: Map dNo -> attendance
  const attendanceMap = new Map(
    takenAttendanceData?.map((a: any) => [a.dNo?.trim(), a.attendance]) ?? []
  );

  const dNosTaken = new Set(
    takenAttendanceData?.map((a: any) => a.dNo?.trim()) ?? []
  );

  const saveAttendance = async (lot: any, attendance: string, malpracticeDetails = "") => {
    try {
      const res = await axios.post("/api/save-attendance", {
        eventName: lot.event,
        teamName: lot.teamName,
        teamId: lot.team_id,
        contestantName: lot.registration.contestantName,
        secondContestantName: lot.registration.secondContestantName,
        dNo: lot.registration.dNo,
        secondDno: lot.registration.secondDno,
        lotNo: lot.lot_number,
        attendance,
        malpracticeDetails,
      });
    } catch (error) {
      console.log(error);
    } finally {
      seteventName("");
      setteamName("");
      setteamId("");
      setcontestantName("");
      setdNo("");
      setlotNo("");
      setattendance("");
      setmalpracticeDetails("");
      setMalpracticeLot(null);
      setgetAttendanceData(true);
    }
  };

  const emptyAllFileds = () => {
    seteventName("");
    setteamName("");
    setteamId("");
    setcontestantName("");
    setdNo("");
    setlotNo("");
    setattendance("");
    setmalpracticeDetails("");
  };

  const fetchLots = async () => {
    try {
      const res = await fetch("/api/lots/get-all");
      const data = await res.json();

      if (data.success) {
        setLots(data.lots);

        setEvents([
          ...new Set(data.lots.map((lot: any) => lot.event)),
        ] as string[]);
        setDepartments([
          ...new Set(data.lots.map((lot: any) => lot.department || "General")),
        ] as string[]);
      }
    } catch (error) {
      console.error("Error fetching lots:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLots();
  }, []);

  useEffect(() => {
    const getAttendance = async () => {
      if (!getAttendanceData) return;
      if (filterEvent === "") return;
      try {
        const res = await axios.post("/api/get-attendance", { filterEvent });
        settakenAttendanceData(res.data.attendance);
      } catch (error) {
        console.log(error);
      } finally {
        setgetAttendanceData(false);
      }
    };
    getAttendance();
  }, [getAttendanceData, filterEvent]);

  const filteredLots = lots.filter((lot) => {
    const matchesEvent = !filterEvent || lot.event === filterEvent;
    const matchesDept =
      !filterDepartment || (lot.department || "General") === filterDepartment;

    const matchesSearch = lot.teamName
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesEvent && matchesDept && matchesSearch;
  });
  console.log(filteredLots)

  const markAttendance = async (
    lotId: string,
    status: "Present" | "Absent",
    malpractice = ""
  ) => {
    try {
      const res = await axios.post("/api/attendance/mark", {
        lotId,
        status,
        malpractice,
      });

      if (res.data.success) {
        alert("Attendance Updated");
        fetchLots();
      } else {
        alert("Error: " + res.data.message);
      }
    } catch (e) {
      alert("Something went wrong.");
    }
  };

  const saveMalpractice = async () => {
    if (!malpracticeLot) return;

    await markAttendance(malpracticeLot._id, "Absent", malpracticeText);

    setMalpracticeLot(null);
    setMalpracticeText("");
  };

  const getAttendanceColor = (dno: string) => {
    const status = attendanceMap.get(dno?.trim());
    switch (status) {
      case "PRESENT":
        return "bg-green-100 border-green-200";
      case "ABSENT":
        return "bg-red-100 border-red-200";
      case "MALPRACTICE":
        return "bg-yellow-100 border-yellow-200";
      default:
        return "bg-white border-gray-200";
    }
  };

  const getAttendanceStatus = (dno: string) => {
    const status = attendanceMap.get(dno?.trim());
    switch (status) {
      case "PRESENT":
        return { text: "Present", color: "bg-green-100 text-green-800" };
      case "ABSENT":
        return { text: "Absent", color: "bg-red-100 text-red-800" };
      case "MALPRACTICE":
        return { text: "Malpractice", color: "bg-yellow-100 text-yellow-800" };
      default:
        return { text: "Pending", color: "bg-gray-100 text-gray-800" };
    }
  };

  // START EDIT HANDLERS
  const startEditing = (lot: any) => {
    setEditingLotId(lot._id);
    setEditContestantName(lot.registration?.contestantName || "");
  };

  const cancelEditing = () => {
    setEditingLotId(null);
    setEditContestantName("");
  };

  const updateContestant = async (lot: any) => {
    try {
      // API payload expected by you: { teamId, event, name }
      const payload = {
        teamId: lot.team_id,
        eventName: lot.event,
        teamName: lot.teamName,
        contestantName: editContestantName,
        dNo: lot.registration.dNo,
        secondContestantName: lot.registration.secondContestantName,
        secondDno: lot.registration.secondDno,
      };

      // call the update API contestant name - replace endpoint as needed
      const res = await axios.patch("/api/offStage-registration", payload);

      if (res.data?.success) {
        // refresh local data
        await fetchLots();
        setEditingLotId(null);
        setEditContestantName("");
      } else {
        alert("Update failed: " + (res.data?.message || "Unknown"));
      }
      window.location.reload()
    } catch (err) {
      console.error(err);
      alert("Something went wrong while updating.");
    }
  };
  // END EDIT HANDLERS

  return (
    <div className="p-4 lg:p-6">
      <h1 className="text-2xl font-bold mb-5 text-gray-800">Attendance Marking</h1>

      {/* Mobile Search and Filters */}
      <div className="lg:hidden mb-4">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full flex items-center justify-center gap-2 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
        </button>

        {showFilters && (
          <div className="mt-3 p-4 border border-gray-300 rounded-lg bg-gray-50 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event</label>
              <select
                value={filterEvent}
                onChange={(e) => {
                  setFilterEvent(e.target.value);
                  setgetAttendanceData(true);
                }}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              >
                {events.map((ev) => (
                  <option key={ev} value={ev}>
                    {ev}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              >
                <option value="">All Departments</option>
                {departments.map((dep) => (
                  <option key={dep} value={dep}>
                    {dep}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Filters - UNCHANGED */}
      <div className="hidden lg:flex gap-4 mb-4 flex-wrap">
        <select
          value={filterEvent}
          onChange={(e) => {
            setFilterEvent(e.target.value);
            setgetAttendanceData(true);
          }}
          className="border border-gray-300 rounded-lg px-3 py-2"
        >
          {events.map((ev) => (
            <option key={ev} value={ev}>
              {ev}
            </option>
          ))}
        </select>

        <select
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2"
        >
          <option value="">All Departments</option>
          {departments.map((dep) => (
            <option key={dep} value={dep}>
              {dep}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search by Team Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-64"
        />
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : filteredLots.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No teams found.</div>
        ) : (
          <div className="space-y-3">
            {filteredLots.map((lot, index) => {
              const dno = lot.registration?.dNo?.trim();
              const status = attendanceMap.get(dno);
              const attendanceStatus = getAttendanceStatus(dno);

              return (
                <div
                  key={lot._id}
                  className={`border rounded-xl overflow-hidden ${getAttendanceColor(dno)} transition-all duration-200`}>
                  <div
                    className="p-4 flex items-center justify-between cursor-pointer"
                    onClick={() => setExpandedCard(expandedCard === lot._id ? null : lot._id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-lg flex items-center justify-center">
                        <span className="font-bold">{lot.lot_number}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{lot.teamName}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${attendanceStatus.color}`}>
                            {attendanceStatus.text}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expandedCard === lot._id ? "rotate-180" : ""}`} />
                  </div>

                  {/* Expanded Content */}
                  {expandedCard === lot._id && (
                    <div className="px-4 pb-4 border-t pt-4">
                      <div className="space-y-3 mb-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-sm text-gray-600">Event</p>
                            <p className="font-medium">{lot.event}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Team ID</p>
                            <p className="font-medium">{lot.team_id}</p>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-gray-600">Contestants</p>

                          {editingLotId === lot._id ? (
                            <div className="mt-2 flex gap-2">
                              <input
                                value={editContestantName}
                                onChange={(e) => setEditContestantName(e.target.value)}
                                className="border rounded px-2 py-1 w-full"
                              />
                              <button onClick={() => updateContestant(lot)} className="px-3 py-1 bg-blue-600 text-white rounded">Update</button>
                              <button onClick={cancelEditing} className="px-3 py-1 bg-gray-300 rounded">Cancel</button>
                            </div>
                          ) : (
                            <div className="mt-2 flex items-center justify-between">
                              <div>
                                <p className="font-medium">{lot.registration?.contestantName || "N/A"}</p>
                                {lot.registration?.secondContestantName && (
                                  <p className="font-medium mt-1">{lot.registration.secondContestantName}</p>
                                )}
                              </div>

                              <button onClick={() => startEditing(lot)} className="p-2 rounded hover:bg-gray-100">
                                <Edit className="w-4 h-4 text-gray-600" />
                              </button>
                            </div>
                          )}
                        </div>

                        <div>
                          <p className="text-sm text-gray-600">D Numbers</p>
                          <p className="font-medium">{lot.registration?.dNo || "N/A"}</p>
                          {lot.registration?.secondDno && (
                            <p className="font-medium mt-1">{lot.registration.secondDno}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => saveAttendance(lot, "PRESENT")}
                          className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-1"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Present
                        </button>

                        <button
                          onClick={() => saveAttendance(lot, "ABSENT")}
                          className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-1"
                        >
                          <XCircle className="w-4 h-4" />
                          Absent
                        </button>

                        <button
                          onClick={() => setMalpracticeLot(lot)}
                          className="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-1"
                        >
                          <AlertCircle className="w-4 h-4" />
                          Malpractice
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Desktop Table - EXACTLY AS IN ORIGINAL CODE WITH EDIT BUTTON*/}
      <div className="hidden lg:block bg-white w-[60rem] shadow-md rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading...</div>
        ) : filteredLots.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No teams found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 border-b font-semibold text-gray-700">Event</th>
                  <th className="p-4 border-b font-semibold text-gray-700">Lot No</th>
                  <th className="p-4 border-b font-semibold text-gray-700">Team Name</th>
                  <th className="p-4 border-b font-semibold text-gray-700">Team ID</th>
                  <th className="p-4 border-b font-semibold text-gray-700">Contestant</th>
                  <th className="p-4 border-b font-semibold text-gray-700">D.No</th>
                  <th className="p-4 border-b font-semibold text-gray-700 text-center">Attendance</th>
                </tr>
              </thead>

              <tbody>
                {filteredLots.map((lot, index) => {
                  const dno = lot.registration?.dNo?.trim();
                  const status = attendanceMap.get(dno);

                  let rowColor = "";
                  if (status === "PRESENT") rowColor = "bg-green-200 hover:bg-green-300";
                  else if (status === "ABSENT") rowColor = "bg-red-200 hover:bg-red-300";
                  else if (status === "MALPRACTICE")
                    rowColor = "bg-yellow-200 hover:bg-yellow-300";
                  else
                    rowColor =
                      index % 2 === 0
                        ? "bg-white hover:bg-indigo-50"
                        : "bg-gray-50 hover:bg-indigo-50";

                  return (
                    <tr key={lot._id} className={rowColor}>
                      <td className="p-4 border-b">{lot.event}</td>

                      <td className="p-4 border-b">
                        <span className="px-3 py-1 rounded-lg bg-indigo-100 text-indigo-700 font-medium">
                          {lot.lot_number}
                        </span>
                      </td>

                      <td className="p-4 border-b">{lot.teamName}</td>
                      <td className="p-4 border-b">{lot.team_id}</td>

                      <td className="p-4 border-b">
                        {editingLotId === lot._id ? (
                          <div className="flex gap-2 items-center">
                            <input value={editContestantName} onChange={(e) => setEditContestantName(e.target.value.toUpperCase())} className="border rounded px-2 py-1 w-64" />
                            <button onClick={() => updateContestant(lot)} className="px-3 py-1 bg-blue-600 text-white rounded">Update</button>
                            <button onClick={cancelEditing} className="px-3 py-1 bg-gray-300 rounded">Cancel</button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div>
                              {lot.registration?.contestantName || "N/A"}
                              <br />
                              {lot.registration?.secondContestantName}
                            </div>

                            <button onClick={() => startEditing(lot)} className="p-2 rounded hover:bg-gray-100 ml-4">
                              <Edit className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                        )}
                      </td>

                      <td className="p-4 border-b">
                        {lot.registration?.dNo || "N/A"}
                        <br />
                        {lot.registration?.secondDno}
                      </td>

                      <td className="p-4 border-b text-center">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => saveAttendance(lot, "PRESENT")}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                          >
                            P
                          </button>

                          <button
                            onClick={() => saveAttendance(lot, "ABSENT")}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700  text-white rounded-lg"
                          >
                            A
                          </button>

                          <button
                            onClick={() => setMalpracticeLot(lot)}
                            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700  text-white rounded-lg"
                          >
                            M
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Malpractice Modal - Updated for mobile */}
      {malpracticeLot && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
            <h2 className="text-lg font-bold mb-3">Malpractice: {malpracticeLot.teamName}</h2>

            <textarea
              value={malpracticeDetails}
              onChange={(e) => setmalpracticeDetails(e.target.value)}
              placeholder="Enter malpractice details…"
              className="w-full border p-3 rounded-lg h-28"
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => {
                  emptyAllFileds();
                  setMalpracticeLot(null);
                }}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={() =>
                  saveAttendance(
                    malpracticeLot,
                    "MALPRACTICE",
                    malpracticeDetails
                  )
                }
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
