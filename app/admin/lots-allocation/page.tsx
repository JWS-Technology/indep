"use client";

import { useEffect, useState } from "react";

export default function TeamsLotPage() {
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLots = async () => {
    try {
      const res = await fetch("/api/lots/get-all");
      const data = await res.json();

      if (data.success) {
        setLots(data.lots);
      }
    } catch (error) {
      console.log("Error fetching lots:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLots();
  }, []);

  const handleDelete = async (id: string) => {
  if (!confirm("Are you sure you want to delete this lot?")) return;

  try {
    const res = await fetch(`/api/lots/delete/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();
    console.log("Delete response:", data);

    if (data.success) {
      alert("Lot deleted successfully!");
      setLots((prev) => prev.filter((lot: any) => lot._id !== id));
    } else {
      alert("Delete failed: " + data.message);
    }
  } catch (error) {
    console.error("Delete error:", error);
    alert("Something went wrong while deleting.");
  }
};



  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-5 text-gray-800">
        Registered Teams & Lots
      </h1>

      <div className="bg-white shadow-md rounded-xl border border-gray-200 overflow-hidden">
        {/* Loading State */}
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading...</div>
        ) : lots.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No registered teams found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="p-4 border-b font-semibold text-gray-700">Event</th>
                  <th className="p-4 border-b font-semibold text-gray-700">Lot Number</th>
                  <th className="p-4 border-b font-semibold text-gray-700">Team Name</th>
                  <th className="p-4 border-b font-semibold text-gray-700">Team ID</th>
                  <th className="p-4 border-b font-semibold text-gray-700 text-center">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {lots.map((lot: any, index: number) => (
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

                    {/* ACTION BUTTONS */}
                    <td className="p-4 border-b text-center">
                      <div className="flex items-center justify-center gap-3">

                        {/* EDIT BUTTON */}
                        <button
                          onClick={() =>
                            (window.location.href = `/admin/lots/edit/${lot._id}`)
                          }
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition shadow-sm"
                        >
                          Edit
                        </button>

                        {/* DELETE BUTTON */}
                        <button
                          onClick={() => handleDelete(lot._id)}
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
