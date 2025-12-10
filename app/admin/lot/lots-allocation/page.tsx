// "use client";

// import axios from "axios";
// import { useEffect, useMemo, useState } from "react";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import * as XLSX from "xlsx";

// // <-- adjust this path to where you keep your exported arrays
// import { allTeams } from "@/data/teams";

// export default function page() {
//   const [lots, setLots] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [lotToDelete, setLotToDelete] = useState("");
//   const [filterEvent, setFilterEvent] = useState("");
//   const [filterDepartment, setFilterDepartment] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [events, setEvents] = useState<string[]>([]);
//   const [departments, setDepartments] = useState<string[]>([]);

//   // Fetch lots
//   const fetchLots = async () => {
//     try {
//       const res = await fetch("/api/lots/get-all");
//       const data = await res.json();

//       if (data.success) {
//         console.log("LOTS -->", data.lots);
//         setLots(data.lots);

//         // Set unique events & departments
//         setEvents([...new Set(data.lots.map((lot: any) => lot.event))] as string[]);
//         setDepartments([
//           ...new Set(data.lots.map((lot: any) => lot.department || "General")),
//         ] as string[]);
//       }
//     } catch (error) {
//       console.error("Error fetching lots:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchLots();
//   }, []);

//   // Delete lot handler
//   useEffect(() => {
//     const deleteLot = async () => {
//       if (!lotToDelete) return;
//       if (!confirm("Are you sure you want to delete this lot?")) return;

//       try {
//         const response = await axios.delete("/api/lots/delete", {
//           data: {
//             id: lotToDelete,
//             reason: "Admin deleted",
//             deletedBy: "Admin",
//           },
//         });

//         if (response.data.success) {
//           alert("Lot deleted successfully");
//           setLots((prev) => prev.filter((lot) => lot._id !== lotToDelete));
//         } else {
//           alert("Delete failed: " + response.data.message);
//         }
//       } catch (error) {
//         console.error("Delete error:", error);
//         alert("Something went wrong.");
//       } finally {
//         setLotToDelete("");
//       }
//     };

//     deleteLot();
//   }, [lotToDelete]);

//   // Create a lookup map for ordering teams according to allTeams
//   const teamOrder = useMemo(() => {
//     const map = new Map<string, number>();
//     allTeams.forEach((t, i) => map.set(String(t).toLowerCase(), i));
//     return map;
//   }, []);

//   // Filter & Search -> then sort according to allTeams order, then by lot_number
//   const filteredLotsSorted = useMemo(() => {
//     const filtered = lots.filter((lot) => {
//       const matchesEvent = !filterEvent || lot.event === filterEvent;
//       const matchesDept =
//         !filterDepartment || (lot.department || "General") === filterDepartment;

//       const matchesSearch =
//         !searchQuery ||
//         String(lot.teamName || "")
//           .toLowerCase()
//           .includes(searchQuery.toLowerCase());

//       return matchesEvent && matchesDept && matchesSearch;
//     });

//     // Sort by team order (teams not in allTeams go to the end), then numeric lot_number if present
//     return filtered.sort((a: any, b: any) => {
//       const aName = String(a.teamName || "").toLowerCase();
//       const bName = String(b.teamName || "").toLowerCase();

//       const aIndex = teamOrder.has(aName) ? teamOrder.get(aName)! : Number.POSITIVE_INFINITY;
//       const bIndex = teamOrder.has(bName) ? teamOrder.get(bName)! : Number.POSITIVE_INFINITY;

//       if (aIndex !== bIndex) return aIndex - bIndex;

//       // If same team order (or both not in list), fall back to lot_number numeric compare
//       const aLot = parseInt(String(a.lot_number || ""), 10);
//       const bLot = parseInt(String(b.lot_number || ""), 10);

//       if (!isNaN(aLot) && !isNaN(bLot)) return aLot - bLot;

//       // final fallback: alphabetical on teamName
//       return aName.localeCompare(bName);
//     });
//   }, [lots, filterEvent, filterDepartment, searchQuery, teamOrder]);

//   // Export PDF
//   const exportPDF = async (lotsToExport: any[]) => {
//     const doc = new jsPDF();
//     const pageWidth = doc.internal.pageSize.getWidth();

//     // Add Logo (left side)
//     try {
//       const res = await fetch("/sjc_logo.png");
//       const blob = await res.blob();
//       const reader = new FileReader();

//       const base64 = await new Promise<string>((resolve, reject) => {
//         reader.onloadend = () => resolve(reader.result as string);
//         reader.onerror = reject;
//         reader.readAsDataURL(blob);
//       });

//       doc.addImage(base64, "PNG", 14, 10, 20, 20); // left aligned, smaller
//     } catch (e) {
//       console.warn("Logo load failed");
//     }

//     // Header Text
//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(14);
//     doc.text("St. JOSEPH’S COLLEGE (AUTONOMOUS)", pageWidth / 2, 16, {
//       align: "center",
//     });

//     doc.setFontSize(11);
//     doc.setFont("helvetica", "normal");
//     doc.text("TIRUCHIRAPPALLI – 620 002", pageWidth / 2, 22, {
//       align: "center",
//     });

//     doc.text("INDEP ‘25", pageWidth / 2, 28, {
//       align: "center",
//     });

//     // Horizontal Line
//     doc.setDrawColor(0);
//     doc.setLineWidth(0.5);
//     doc.line(10, 34, pageWidth - 10, 34);

//     // Table Content
//     const tableColumn = [
//       "Event",
//       "Lot Number",
//       "Team Name",
//       "Team ID",
//       "Signature"
//     ];

//     const tableRows = lotsToExport.map((lot) => [
//       lot.event,
//       lot.lot_number,
//       lot.teamName,
//       lot.team_id,
//     ]);

//     autoTable(doc, {
//       head: [tableColumn],
//       body: tableRows,
//       startY: 40, // start below the line
//       theme: "grid",
//       styles: { fontSize: 10 },
//       headStyles: { fillColor: [93, 135, 255] }, // soft blue header
//     });

//     doc.save("Registered_Lots.pdf");
//   };

//   // Export Excel
//   const exportExcel = (lotsToExport: any[]) => {
//     const worksheet = XLSX.utils.json_to_sheet(
//       lotsToExport.map((lot) => ({
//         Event: lot.event,
//         Lot_Number: lot.lot_number,
//         Team_Name: lot.teamName,
//         Team_ID: lot.team_id,
//         Signature: ""
//       }))
//     );

//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Registered Lots");
//     XLSX.writeFile(workbook, "Registered_Lots.xlsx");
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-5 text-gray-800">
//         Registered Teams & Lots
//       </h1>

//       {/* Filters & Search */}
//       <div className="flex gap-4 mb-4 flex-wrap">
//         {/* Event Filter */}
//         <select
//           value={filterEvent}
//           onChange={(e) => setFilterEvent(e.target.value)}
//           className="border border-gray-300 rounded-lg px-3 py-2"
//         >
//           <option value="">All Events</option>
//           {events.map((ev) => (
//             <option key={ev} value={ev}>
//               {ev}
//             </option>
//           ))}
//         </select>

//         {/* Department Filter */}
//         <select
//           value={filterDepartment}
//           onChange={(e) => setFilterDepartment(e.target.value)}
//           className="border border-gray-300 rounded-lg px-3 py-2"
//         >
//           <option value="">All Departments</option>
//           {departments.map((dep) => (
//             <option key={dep} value={dep}>
//               {dep}
//             </option>
//           ))}
//         </select>

//         {/* Search */}
//         <input
//           type="text"
//           placeholder="Search by Team Name"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           className="border border-gray-300 rounded-lg px-3 py-2 w-64"
//         />

//         {/* PDF */}
//         <button
//           onClick={() => exportPDF(filteredLotsSorted)}
//           className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
//         >
//           Export PDF
//         </button>

//         {/* Excel */}
//         <button
//           onClick={() => exportExcel(filteredLotsSorted)}
//           className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
//         >
//           Export Excel
//         </button>
//       </div>

//       {/* Table */}
//       <div className="bg-white shadow-md rounded-xl border border-gray-200 overflow-hidden">
//         {loading ? (
//           <div className="p-6 text-center text-gray-500">Loading...</div>
//         ) : filteredLotsSorted.length === 0 ? (
//           <div className="p-6 text-center text-gray-500">
//             No registered teams found.
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-left border-collapse">
//               <thead className="bg-gray-50 sticky top-0 z-10">
//                 <tr>
//                   <th className="p-4 border-b font-semibold text-gray-700">
//                     Event
//                   </th>
//                   <th className="p-4 border-b font-semibold text-gray-700">
//                     Lot No
//                   </th>
//                   <th className="p-4 border-b font-semibold text-gray-700">
//                     Team Name
//                   </th>
//                   <th className="p-4 border-b font-semibold text-gray-700">
//                     Team ID
//                   </th>
//                   <th className="p-4 border-b font-semibold text-gray-700">
//                     Contestant
//                   </th>
//                   <th className="p-4 border-b font-semibold text-gray-700">
//                     D.No
//                   </th>
//                   <th className="p-4 border-b font-semibold text-gray-700 text-center">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {filteredLotsSorted.map((lot, index) => (
//                   <tr
//                     key={lot._id}
//                     className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"
//                       } hover:bg-indigo-50 transition`}
//                   >
//                     <td className="p-4 border-b">{lot.event}</td>

//                     <td className="p-4 border-b">
//                       <span className="px-3 py-1 rounded-lg bg-indigo-100 text-indigo-700 font-medium">
//                         {lot.lot_number}
//                       </span>
//                     </td>

//                     <td className="p-4 border-b">{lot.teamName}</td>
//                     <td className="p-4 border-b">{lot.team_id}</td>

//                     {/* Contestant Name */}
//                     <td className="p-4 border-b">
//                       {lot.registration?.contestantName || "N/A"}
//                     </td>

//                     {/* D.No */}
//                     <td className="p-4 border-b">
//                       {lot.registration?.dNo || "N/A"}
//                     </td>

//                     <td className="p-4 border-b text-center">
//                       <div className="flex justify-center gap-3">
//                         <button
//                           onClick={() => setLotToDelete(lot._id)}
//                           className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
//                         >
//                           Delete
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export default function TeamsLotPage() {
  const [lots, setLots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lotToDelete, setLotToDelete] = useState("");
  const [filterEvent, setFilterEvent] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState<string[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);

  // Fetch lots
  const fetchLots = async () => {
    try {
      const res = await fetch("/api/lots/get-all");
      const data = await res.json();

      if (data.success) {
        console.log("LOTS -->", data.lots);
        setLots(data.lots);

        // Set unique events & departments
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

  // Delete lot handler
  useEffect(() => {
    const deleteLot = async () => {
      if (!lotToDelete) return;
      if (!confirm("Are you sure you want to delete this lot?")) return;

      try {
        const response = await axios.delete("/api/lots/delete", {
          data: {
            id: lotToDelete,
            reason: "Admin deleted",
            deletedBy: "Admin",
          },
        });

        if (response.data.success) {
          alert("Lot deleted successfully");
          setLots((prev) => prev.filter((lot) => lot._id !== lotToDelete));
        } else {
          alert("Delete failed: " + response.data.message);
        }
      } catch (error) {
        console.error("Delete error:", error);
        alert("Something went wrong.");
      } finally {
        setLotToDelete("");
      }
    };

    deleteLot();
  }, [lotToDelete]);

  // Filter & Search
  const filteredLots = lots.filter((lot) => {
    const matchesEvent = !filterEvent || lot.event === filterEvent;
    const matchesDept =
      !filterDepartment ||
      (lot.department || "General") === filterDepartment;

    const matchesSearch =
      lot.teamName?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesEvent && matchesDept && matchesSearch;
  });

  // Export PDF
  const exportPDF = async (lotsToExport: any[]) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Add Logo (left side)
    try {
      const res = await fetch("/sjc_logo.png");
      const blob = await res.blob();
      const reader = new FileReader();

      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      doc.addImage(base64, "PNG", 14, 10, 20, 20); // left aligned, smaller
    } catch (e) {
      console.warn("Logo load failed");
    }

    // Header Text
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("St. JOSEPH’S COLLEGE (AUTONOMOUS)", pageWidth / 2, 16, {
      align: "center",
    });

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("TIRUCHIRAPPALLI – 620 002", pageWidth / 2, 22, {
      align: "center",
    });

    doc.text("INDEP ‘25", pageWidth / 2, 28, {
      align: "center",
    });

    // Horizontal Line
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(10, 34, pageWidth - 10, 34);

    // Table Content
    const tableColumn = [
      "Event",
      // "Department",
      "Lot Number",
      "Team Name",
      "Team ID",
      // "Contestant Name",
      // "D.No",
      "Signature"
    ];

    const tableRows = lotsToExport.map((lot) => [
      lot.event,
      // lot.department || "General",
      lot.lot_number,
      lot.teamName,
      lot.team_id,
      // lot.registration?.contestantName || "-",
      // lot.registration?.dNo || "-",
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40, // start below the line
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [93, 135, 255] }, // soft blue header
    });

    doc.save("Registered_Lots.pdf");
  };


  // Export Excel
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredLots.map((lot) => ({
        Event: lot.event,
        // Department: lot.department || "General",
        // Contestant_Name: lot.registration?.contestantName || "N/A",
        // DNo: lot.registration?.dNo || "N/A",
        Lot_Number: lot.lot_number,
        Team_Name: lot.teamName,
        Team_ID: lot.team_id,
        Signature: ""
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registered Lots");
    XLSX.writeFile(workbook, "Registered_Lots.xlsx");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-5 text-gray-800">
        Registered Teams & Lots
      </h1>

      {/* Filters & Search */}
      <div className="flex gap-4 mb-4 flex-wrap">
        {/* Event Filter */}
        <select
          value={filterEvent}
          onChange={(e) => setFilterEvent(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2"
        >
          <option value="">All Events</option>
          {events.map((ev) => (
            <option key={ev} value={ev}>
              {ev}
            </option>
          ))}
        </select>

        {/* Department Filter */}
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

        {/* Search */}
        <input
          type="text"
          placeholder="Search by Team Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-64"
        />

        {/* PDF */}
        <button
          onClick={() => exportPDF(filteredLots)}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
        >
          Export PDF
        </button>

        {/* Excel */}
        <button
          onClick={exportExcel}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          Export Excel
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow-md rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading...</div>
        ) : filteredLots.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No registered teams found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="p-4 border-b font-semibold text-gray-700">
                    Event
                  </th>
                  <th className="p-4 border-b font-semibold text-gray-700">
                    Lot No
                  </th>
                  <th className="p-4 border-b font-semibold text-gray-700">
                    Team Name
                  </th>
                  <th className="p-4 border-b font-semibold text-gray-700">
                    Team ID
                  </th>
                  <th className="p-4 border-b font-semibold text-gray-700">
                    Contestant
                  </th>
                  <th className="p-4 border-b font-semibold text-gray-700">
                    D.No
                  </th>
                  <th className="p-4 border-b font-semibold text-gray-700 text-center">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredLots.map((lot, index) => (
                  <tr
                    key={lot._id}
                    className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-indigo-50 transition`}
                  >
                    <td className="p-4 border-b">{lot.event}</td>

                    <td className="p-4 border-b">
                      <span className="px-3 py-1 rounded-lg bg-indigo-100 text-indigo-700 font-medium">
                        {lot.lot_number}
                      </span>
                    </td>

                    <td className="p-4 border-b">{lot.teamName}</td>
                    <td className="p-4 border-b">{lot.team_id}</td>

                    {/* Contestant Name */}
                    <td className="p-4 border-b">
                      {lot.registration?.contestantName || "N/A"}
                    </td>

                    {/* D.No */}
                    <td className="p-4 border-b">
                      {lot.registration?.dNo || "N/A"}
                    </td>

                    <td className="p-4 border-b text-center">
                      <div className="flex justify-center gap-3">
                        {/* <button
                          onClick={() =>
                            (window.location.href = `/admin/lots/edit/${lot._id}`)
                          }
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                        >
                          Edit
                        </button> */}

                        <button
                          onClick={() => setLotToDelete(lot._id)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
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
