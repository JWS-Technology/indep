"use client";

import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { FaFileExcel } from "react-icons/fa";

type ButtonProps = {
  children: React.ReactNode;
  loading?: boolean;
  onClick: () => void;
  disabled?: boolean;
};

const Button: React.FC<ButtonProps> = ({ children, loading, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={loading || disabled}
    className="w-full py-3 rounded-xl text-lg font-semibold bg-green-600 hover:bg-green-700 text-white transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
  >
    {loading ? (
      <>
        <svg
          className="animate-spin h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <span>Preparing Excel...</span>
      </>
    ) : (
      <>
        <FaFileExcel className="w-5 h-5" />
        <span>{children}</span>
      </>
    )}
  </button>
);

export default function OffStageExportPage() {
  const [loading, setLoading] = useState(false);

  // Fetch all registrations
  const fetchRegistrations = async () => {
    try {
      const res = await fetch("/api/offstage/get-registrations-all"); // a GET endpoint that returns all registrations
      const json = await res.json();
      return json.success ? json.registrations : [];
    } catch (err) {
      console.error("Error fetching registrations:", err);
      return [];
    }
  };

  const formatForExport = (rows: any[]) =>
    rows.map((r) => ({
      Event: r.eventName ?? "",
      Team: r.teamName ?? "",
      TeamID: r.teamId ?? "",
      Contestant: r.contestantName ?? "",
      SecondContestant: r.secondContestantName ?? "",
      DNo: r.dNo ?? "",
      SecondDno: r.secondDno ?? "",
      Lot: r.lot?.name ?? r.lot ?? "", // assuming lot has a `name` field
      CreatedAt: new Date(r.createdAt).toLocaleString(),
    }));

  const downloadExcel = async () => {
    setLoading(true);
    try {
      const rows = await fetchRegistrations();
      if (!rows.length) {
        setLoading(false);
        return alert("No registrations found in the database.");
      }

      const formatted = formatForExport(rows);
      const worksheet = XLSX.utils.json_to_sheet(formatted);

      worksheet["!cols"] = [
        { wch: 20 },
        { wch: 25 },
        { wch: 15 },
        { wch: 25 },
        { wch: 25 },
        { wch: 10 },
        { wch: 10 },
        { wch: 15 },
        { wch: 20 },
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "OffStageRegistrations");
      XLSX.writeFile(workbook, `offstage_all_registrations.xlsx`);
    } catch (err) {
      console.error("Excel download error:", err);
      alert("Error creating Excel file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-2xl border-t-4 border-green-500">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4 text-center">
          Off-Stage Registration Export
        </h1>
        <p className="text-gray-500 text-center mb-8">
          Download all off-stage registrations including lot numbers, contestant info, and team IDs.
        </p>

        <Button onClick={downloadExcel} loading={loading}>
          Download All Registrations Excel
        </Button>
      </div>
    </div>
  );
}
