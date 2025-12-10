"use client";

import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

type BankDetail = {
  _id?: string;
  teamName?: string;
  teamId?: string;
  managerName?: string;
  accountNumber?: string;
  bankName?: string;
  ifscCode?: string;
};

export default function page() {
  const [bankDetails, setBankDetails] = useState<BankDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/admin/get-bank-details");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setBankDetails(json.bankDetails || []);
      } catch (err: any) {
        setError(err?.message || "Failed to fetch");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  function exportToPDF() {
    if (!bankDetails.length) return;
    const doc = new jsPDF({ unit: "pt", format: "a4" });

    const head = [["Team Name", "Team ID", "Manager", "Account No.", "Bank", "IFSC"]];
    const body = bankDetails.map((b) => [
      b.teamName ?? "-",
      b.teamId ?? "-",
      b.managerName ?? "-",
      b.accountNumber ?? "-",
      b.bankName ?? "-",
      b.ifscCode ?? "-",
    ]);

    // Title
    doc.setFontSize(14);
    doc.text("Bank Details", 40, 40);

    // Use autoTable as a function and pass the doc as first argument
    // `autoTable` typing might not perfectly match — cast to any to avoid TS errors
    (autoTable as any)(doc, {
      head,
      body,
      startY: 60,
      margin: { left: 20, right: 20 },
      styles: { fontSize: 10 },
      headStyles: { fillColor: [22, 78, 99] },
      theme: "grid",
    });

    doc.save("bank-details.pdf");
  }

  function exportToExcel() {
    if (!bankDetails.length) return;
    const data = bankDetails.map((b) => ({
      teamName: b.teamName ?? "",
      teamId: b.teamId ?? "",
      managerName: b.managerName ?? "",
      accountNumber: b.accountNumber ?? "",
      bankName: b.bankName ?? "",
      ifscCode: b.ifscCode ?? "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "BankDetails");
    XLSX.writeFile(workbook, "bank-details.xlsx");
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Bank Details</h1>
        <div className="flex gap-2">
          <button
            onClick={exportToExcel}
            className="px-4 py-2 rounded-md border hover:shadow-sm text-sm"
            aria-label="Export to Excel"
          >
            Export Excel
          </button>
          <button
            onClick={exportToPDF}
            className="px-4 py-2 rounded-md border hover:shadow-sm text-sm"
            aria-label="Export to PDF"
          >
            Export PDF
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-sm text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-sm text-red-500">Error: {error}</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
          <table className="min-w-full divide-y">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium">Team Name</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Team ID</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Manager</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Account No.</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Bank</th>
                <th className="px-4 py-2 text-left text-sm font-medium">IFSC</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {bankDetails.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-500">
                    No bank details found.
                  </td>
                </tr>
              ) : (
                bankDetails.map((b) => (
                  <tr key={b._id}>
                    <td className="px-4 py-3 text-sm">{b.teamName}</td>
                    <td className="px-4 py-3 text-sm">{b.teamId}</td>
                    <td className="px-4 py-3 text-sm">{b.managerName}</td>
                    <td className="px-4 py-3 text-sm">{b.accountNumber}</td>
                    <td className="px-4 py-3 text-sm">{b.bankName}</td>
                    <td className="px-4 py-3 text-sm">{b.ifscCode}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
