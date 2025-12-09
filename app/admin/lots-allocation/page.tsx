"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function TeamsLotPage() {
  const [lots, setLots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lotToDelete, setlotToDelete] = useState("");
  const [filterEvent, setFilterEvent] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // 🔍 NEW SEARCH
  const [events, setEvents] = useState<string[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);

  // Fetch lots
  const fetchLots = async () => {
    try {
      const res = await fetch("/api/lots/get-all");
      const data = await res.json();

      if (data.success) {
        setLots(data.lots);

        const uniqueEvents = Array.from(
          new Set(data.lots.map((lot: any) => lot.event))
        ) as string[];

        const uniqueDepartments = Array.from(
          new Set(data.lots.map((lot: any) => lot.department || "General"))
        ) as string[];

        setEvents(uniqueEvents);
        setDepartments(uniqueDepartments);
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

  // Delete lot
  useEffect(() => {
    const handleDelete = async () => {
      if (!lotToDelete) return;
      if (!confirm("Are you sure you want to delete this lot?")) return;

      try {
        const response = await axios.delete("/api/lots/delete", {
          data: {
            id: lotToDelete,
            reason: "User requested deletion",
            deletedBy: "Admin",
          },
        });

        if (response.data.success) {
          alert("Lot deleted successfully!");
          setLots((prev) => prev.filter((lot) => lot._id !== lotToDelete));
        } else {
          alert("Delete failed: " + response.data.message);
        }
      } catch (error) {
        console.error("Delete error:", error);
        alert("Something went wrong while deleting.");
      } finally {
        setlotToDelete("");
      }
    };

    handleDelete();
  }, [lotToDelete]);

  // Filter + Search
  const filteredLots = lots.filter((lot) => {
    const matchesEvent = !filterEvent || lot.event === filterEvent;
    const matchesDept =
      !filterDepartment || (lot.department || "General") === filterDepartment;
    const matchesSearch = lot.teamName
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesEvent && matchesDept && matchesSearch;
  });

  // Export PDF
  const exportPDF = async (lotsToExport: any[]) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    try {
      const logoUrl = "/sjc_logo.png";
      const res = await fetch(logoUrl);

      if (!res.ok) throw new Error("Logo not found");
      const blob = await res.blob();
      const reader = new FileReader();

      const logoBase64: string = await new Promise((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      doc.addImage(logoBase64, "PNG", pageWidth / 2 - 15, 8, 30, 30);
    } catch (err) {
      console.warn("Failed to load logo:", err);
    }

    // Centered Header
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(
      "St. JOSEPH’S COLLEGE (AUTONOMOUS)",
      pageWidth / 2,
      20,
      { align: "center" }
    );

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(
      "TIRUCHIRAPPALLI – 620 002",
      pageWidth / 2,
      28,
      { align: "center" }
    );
    doc.text("INDEP ‘25", pageWidth / 2, 35, { align: "center" });

    // Table
    const tableColumn = ["Event", "Department", "Lot Number", "Team Name", "Team ID"];
    const tableRows: any[] = lotsToExport.map((lot) => [
      lot.event,
      lot.department || "General",
      lot.lot_number,
      lot.teamName,
      lot.team_id,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 45,
      theme: "grid",
      headStyles: { fillColor: [63, 81, 181] },
      bodyStyles: { fillColor: [245, 245, 245] },
    });

    doc.save("Registered_Lots.pdf");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-5 text-gray-800">
        Registered Teams & Lots
      </h1>

      {/* Filters & Search */}
      <div className="flex gap-4 mb-4 flex-wrap">
        <select
          value={filterEvent}
          onChange={(e) => setFilterEvent(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2"
        >
          <option value="">All Events</option>
          {events.map((event) => (
            <option key={event} value={event}>
              {event}
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

        {/* 🔍 Search Box */}
        <input
          type="text"
          placeholder="Search by Team Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-64"
        />

        <button
          onClick={() => exportPDF(filteredLots)}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition shadow-sm"
        >
          Export PDF
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow-md rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading...</div>
        ) : filteredLots.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No registered teams found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="p-4 border-b font-semibold text-gray-700">Event</th>
                  <th className="p-4 border-b font-semibold text-gray-700">Lot Number</th>
                  <th className="p-4 border-b font-semibold text-gray-700">Team Name</th>
                  <th className="p-4 border-b font-semibold text-gray-700">Team ID</th>
                  <th className="p-4 border-b font-semibold text-gray-700 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLots.map((lot, index) => (
                  <tr
                    key={lot._id}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-indigo-50 transition duration-150`}
                  >
                    <td className="p-4 border-b text-gray-700">{lot.event}</td>
                    <td className="p-4 border-b">
                      <span className="px-3 py-1 rounded-lg bg-indigo-100 text-indigo-700 font-medium">
                        {lot.lot_number}
                      </span>
                    </td>
                    <td className="p-4 border-b text-gray-700">{lot.teamName}</td>
                    <td className="p-4 border-b text-gray-700">{lot.team_id}</td>
                    <td className="p-4 border-b text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() =>
                            (window.location.href = `/admin/lots/edit/${lot._id}`)
                          }
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition shadow-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setlotToDelete(lot._id)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition shadow-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
