"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver"; 

export default function AttendancePage() {
  const [lots, setLots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterEvent, setFilterEvent] = useState("Cartooning");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState<string[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [malpracticeLot, setMalpracticeLot] = useState<any>(null);
  const [malpracticeDetails, setmalpracticeDetails] = useState("");

  const [takenAttendanceData, settakenAttendanceData] = useState<any[]>([]);
  const [getAttendanceData, setgetAttendanceData] = useState(true);

  const attendanceMap = new Map(
    takenAttendanceData?.map((a: any) => [a.dNo?.trim(), a.attendance]) ?? []
  );

  // ---------------------- EXPORT EXCEL --------------------------
  const exportExcel = () => {
    const exportData = filteredLots.map((lot: any) => ({
      Event: lot.event,
      Lot: lot.lot_number,
      Team_Name: lot.teamName,
      Team_ID: lot.team_id,
      Contestant_1: lot.registration?.contestantName || "",
      Contestant_2: lot.registration?.secondContestantName || "",
      DNo_1: lot.registration?.dNo || "",
      DNo_2: lot.registration?.secondDno || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const dataBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(dataBlob, `${filterEvent}-attendance.xlsx`);
  };
  // --------------------------------------------------------------

  const fetchLots = async () => {
    try {
      const res = await fetch("/api/lots/get-all");
      const data = await res.json();

      if (data.success) {
        setLots(data.lots);
        setEvents([...new Set(data.lots.map((lot: any) => lot.event))] as string[]);
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

  const saveAttendance = async (lot: any, attendance: string, malpracticeDetails = "") => {
    try {
      await axios.post("/api/save-attendance", {
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
      setMalpracticeLot(null);
      setmalpracticeDetails("");
      setgetAttendanceData(true);
    }
  };

  const filteredLots = lots.filter((lot) => {
    const matchesEvent = !filterEvent || lot.event === filterEvent;
    const matchesDept =
      !filterDepartment || (lot.department || "General") === filterDepartment;

    const matchesSearch = lot.teamName
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesEvent && matchesDept && matchesSearch;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-5 text-gray-800">Attendance Marking</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-4 flex-wrap">
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

        {/* Export Button */}
        <button
          onClick={exportExcel}
          className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
        >
          Export Excel
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white w-[60rem] shadow-md rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading...</div>
        ) : filteredLots.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No teams found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 border-b">Event</th>
                  <th className="p-4 border-b">Lot</th>
                  <th className="p-4 border-b">Team Name</th>
                  <th className="p-4 border-b">Team ID</th>
                  <th className="p-4 border-b">Contestants</th>
                  <th className="p-4 border-b">D.No</th>
                  <th className="p-4 border-b text-center">Attendance</th>
                </tr>
              </thead>

              <tbody>
                {filteredLots.map((lot, index) => {
                  const status = attendanceMap.get(lot.registration?.dNo?.trim());

                  let rowColor = "";
                  if (status === "PRESENT") rowColor = "bg-green-200";
                  else if (status === "ABSENT") rowColor = "bg-red-200";
                  else if (status === "MALPRACTICE") rowColor = "bg-yellow-200";
                  else rowColor = index % 2 === 0 ? "bg-white" : "bg-gray-50";

                  return (
                    <tr key={lot._id} className={rowColor}>
                      <td className="p-4 border-b">{lot.event}</td>

                      <td className="p-4 border-b">
                        <span className="px-3 py-1 rounded-lg bg-indigo-100 text-indigo-700">
                          {lot.lot_number}
                        </span>
                      </td>

                      <td className="p-4 border-b">{lot.teamName}</td>
                      <td className="p-4 border-b">{lot.team_id}</td>

                      <td className="p-4 border-b">
                        {lot.registration?.contestantName}
                        <br />
                        {lot.registration?.secondContestantName}
                      </td>

                      <td className="p-4 border-b">
                        {lot.registration?.dNo}
                        <br />
                        {lot.registration?.secondDno}
                      </td>

                      <td className="p-4 border-b text-center">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => saveAttendance(lot, "PRESENT")}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg"
                          >
                            P
                          </button>

                          <button
                            onClick={() => saveAttendance(lot, "ABSENT")}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg"
                          >
                            A
                          </button>

                          <button
                            onClick={() => setMalpracticeLot(lot)}
                            className="px-4 py-2 bg-yellow-600 text-white rounded-lg"
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

      {/* MALPRACTICE MODAL */}
      {malpracticeLot && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96">
            <h2 className="text-lg font-bold mb-3">
              Malpractice: {malpracticeLot.teamName}
            </h2>

            <textarea
              value={malpracticeDetails}
              onChange={(e) => setmalpracticeDetails(e.target.value)}
              placeholder="Enter malpractice details…"
              className="w-full border p-3 rounded-lg h-28"
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setMalpracticeLot(null)}
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
