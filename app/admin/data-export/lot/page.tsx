"use client";

import { useState } from "react";
import * as XLSX from "xlsx";

export default function DataExportPage() {
  const [loading, setLoading] = useState(false);

  // Export Excel ONLY
  const exportExcel = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/lots/get-all");
      const data = await res.json();

      if (!data.success) {
        alert("Failed to fetch lots");
        return;
      }

      const lots = data.lots;

      // Only selected fields
      const excelData = lots.map((lot: any) => ({
        Event: lot.event,
        Lot_Number: lot.lot_number,
        Team_Name: lot.teamName,
        Team_ID: lot.team_id,
      }));

      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Lots");

      XLSX.writeFile(wb, "lots_export.xlsx");
    } catch (err) {
      console.error(err);
      alert("Something went wrong exporting Excel");
    }

    setLoading(false);
  };

  return (
    <div className="p-8 min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold mb-6">Export All Lots</h1>

      <button
        onClick={exportExcel}
        disabled={loading}
        className="px-6 py-3 bg-green-600 text-white rounded text-lg shadow hover:bg-green-700"
      >
        {loading ? "Preparing Excel..." : "Download Excel"}
      </button>
    </div>
  );
}
