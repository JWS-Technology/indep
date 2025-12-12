"use client";

import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { Download } from "lucide-react";

export default function OnStageRegistrationExport() {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch all registered on-stage data
  const fetchRegistrations = async () => {
    try {
      const res = await fetch("/api/onstage/get-registrations");
      const data = await res.json();
      if (data.success) {
        setRegistrations(data.data || []);
      } else {
        alert("Failed to fetch registrations");
      }
    } catch (error) {
      console.error("Error fetching registrations:", error);
      alert("Error fetching registrations");
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  // Format the data for Excel
  const formatForExcel = () => {
    const rows: any[] = [];
    registrations.forEach((reg) => {
      reg.contestants.forEach((contestant: any, idx: number) => {
        rows.push({
          Event: reg.eventName || "",
          Team: reg.teamName || "",
          TeamID: reg.teamId || "",
          Contestant: contestant.contestantName || "",
          DNo: contestant.dNo || "",
          ContestantIndex: idx + 1,
        });
      });
    });
    return rows;
  };

  // Export to Excel
  const downloadExcel = () => {
    if (registrations.length === 0) {
      alert("No registration data available");
      return;
    }

    setLoading(true);
    const formatted = formatForExcel();
    const worksheet = XLSX.utils.json_to_sheet(formatted);

    // Optional: define column widths
    worksheet["!cols"] = [
      { wch: 25 }, // Event
      { wch: 25 }, // Team
      { wch: 15 }, // TeamID
      { wch: 25 }, // Contestant
      { wch: 10 }, // DNo
      { wch: 12 }, // Contestant Index
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "OnStageRegistrations");
    XLSX.writeFile(workbook, `onstage_registrations.xlsx`);

    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-xl rounded-xl">
      <h1 className="text-3xl font-bold mb-4 text-center">
        On-Stage Registration Export
      </h1>
      <p className="text-center text-gray-500 mb-6">
        Download all registered on-stage event data with contestant details.
      </p>

      <div className="flex justify-center">
        <button
          onClick={downloadExcel}
          disabled={loading || registrations.length === 0}
          className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-5 h-5" />
          <span>{loading ? "Preparing Excel..." : "Download Excel"}</span>
        </button>
      </div>

      {registrations.length === 0 && !loading && (
        <p className="mt-4 text-center text-gray-400">
          No registration data available.
        </p>
      )}
    </div>
  );
}
