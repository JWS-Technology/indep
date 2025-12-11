"use client";

import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

export default function AttendanceExportPage() {
  const [events, setEvents] = useState<string[]>([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [loading, setLoading] = useState(false);

  // ----------------------------------------------
  // 🔥 Fetch all events (reusing lots API)
  // ----------------------------------------------
  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/lots/get-all");
      const data = await res.json();

      if (data.success) {
        const eventList = [...new Set(data.lots.map((lot: any) => lot.event))] as string[];
        setEvents(eventList);
      }
    } catch (err) {
      console.error("Event fetch error:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // ----------------------------------------------
  // 🔥 Fetch Attendance Data
  // ----------------------------------------------
  const fetchAttendance = async () => {
    if (!selectedEvent) {
      alert("Please select an event.");
      return [];
    }

    try {
      const res = await fetch("/api/get-attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filterEvent: selectedEvent }),
      });

      const data = await res.json();

      if (!data.success) {
        alert("Failed to fetch attendance");
        return [];
      }

      return data.attendance || [];
    } catch (err) {
      console.error("Attendance fetch error", err);
      alert("Something went wrong.");
      return [];
    }
  };

  // ----------------------------------------------
  // 🔥 Format data
  // ----------------------------------------------
  const formatForExport = (rows: any[]) =>
    rows.map((r) => ({
      Event: r.eventName ?? r.event ?? "",
      Contestant: r.contestantName ?? "",
      SecondContestant: r.secondContestantName ?? "",
      Team: r.teamName ?? "",
      TeamID: r.teamId ?? r.teamID ?? "",
      DNo: r.dNo ?? "",
      SecondDno: r.secondDno ?? "",
      Lot: r.lotNumber ?? r.lot ?? "",
      Status: r.attendance ?? "",
      Malpractice: r.malpracticeDetails ?? "",
    }));

  // ----------------------------------------------
  // 🔥 Export Excel
  // ----------------------------------------------
  const downloadExcel = async () => {
    setLoading(true);

    const rows = await fetchAttendance();
    if (rows.length === 0) {
      setLoading(false);
      return;
    }

    const formatted = formatForExport(rows);
    const worksheet = XLSX.utils.json_to_sheet(formatted);

    worksheet["!cols"] = [
      { wch: 20 }, // Event
      { wch: 25 }, // Contestant
      { wch: 25 }, // Second Contestant
      { wch: 28 }, // Team
      { wch: 12 }, // TeamID
      { wch: 8 }, // DNo
      { wch: 8 }, // SecondDno
      { wch: 8 }, // Lot
      { wch: 12 }, // Status
      { wch: 30 }, // Malpractice
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
    XLSX.writeFile(workbook, "attendance_export.xlsx");

    setLoading(false);
  };

  return (
    <div className="p-10 min-h-screen flex flex-col items-center justify-center">
      <div className="bg-white border rounded-xl shadow p-8 w-full max-w-xl text-center">
        <h2 className="text-2xl font-bold mb-4">Attendance Export</h2>

        {/* Event Dropdown */}
        <select
          className="border p-3 rounded w-full mb-4"
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
        >
          <option value="">Select Event</option>
          {events.map((ev) => (
            <option key={ev} value={ev}>
              {ev}
            </option>
          ))}
        </select>

        {/* Export Button */}
        <button
          onClick={downloadExcel}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded text-lg shadow hover:bg-blue-700 w-full"
        >
          {loading ? "Preparing Excel..." : "Download Attendance Excel"}
        </button>
      </div>
    </div>
  );
}
