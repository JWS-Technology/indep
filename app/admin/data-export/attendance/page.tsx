"use client";

import { useEffect, useState, useCallback } from "react";
import * as XLSX from "xlsx";
import { Download, Users, Lightbulb } from "lucide-react";

// --- INTERFACE DEFINITIONS TO PREVENT TYPESCRIPT REDLINES ---
interface ButtonProps {
  children: React.ReactNode;
  loading: boolean;
  onClick: () => void;
  className?: string;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

interface TabCardProps {
  title: string;
  description: string;
  // icon: React.ComponentType<{ className: string }> is the type for Lucide icons
  icon: React.ComponentType<{ className: string }>;
  onClick: () => void;
  isActive: boolean;
  color: 'indigo' | 'pink';
}
// -----------------------------------------------------------

/**
 * 1. The Button Component Definition (Fixed Redlines)
 */
const Button: React.FC<ButtonProps> = ({ 
  children, 
  loading, 
  onClick, 
  className = "", // Default empty string to avoid errors
  variant = 'primary', 
  disabled = false 
}) => {
  const baseStyle = "w-full py-3 rounded-xl text-lg font-semibold transition duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2";
  
  // Explicit, static styles to prevent Tailwind JIT/PurgeCSS errors
  const primaryStyle = "bg-indigo-600 hover:bg-indigo-700 text-white";
  const secondaryStyle = "bg-pink-600 hover:bg-pink-700 text-white";

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      // Ensure className is always a string
      className={`${baseStyle} ${variant === 'primary' ? primaryStyle : secondaryStyle} ${className}`}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Preparing Excel...</span>
        </>
      ) : (
        <>
          <Download className="w-5 h-5" />
          <span>{children}</span>
        </>
      )}
    </button>
  );
};


export default function AttendanceMasterExportPage() {
  const [activeTab, setActiveTab] = useState<"" | "off" | "on">("");

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <header className="max-w-7xl mx-auto mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 text-center">
          📊 Event Attendance Export
        </h1>
        <p className="mt-4 text-xl text-gray-500 text-center">
          Select an event category to download the master attendance record.
        </p>
      </header>

      {/* ----------- TWO CARDS (TAB SELECTION) ----------- */}
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
        <TabCard
          title="Off-Stage Attendance Export"
          description="Export attendance data for all non-performance/off-stage events, including Lot Number."
          icon={Lightbulb}
          onClick={() => setActiveTab("off")}
          isActive={activeTab === "off"}
          color="indigo"
        />
        <TabCard
          title="On-Stage Attendance Export"
          description="Export attendance data for all performance/on-stage events, sorted by Lot Number."
          icon={Users}
          onClick={() => setActiveTab("on")}
          isActive={activeTab === "on"}
          color="pink"
        />
      </div>

      {/* ----------- SHOW SELECTED PANEL ----------- */}
      <div className="max-w-4xl mx-auto">
        {activeTab === "off" && <OffStageAttendanceExport />}
        {activeTab === "on" && <OnStageAttendanceExport />}
        {activeTab === "" && (
          <div className="text-center p-12 border-2 border-dashed border-gray-300 rounded-2xl bg-white shadow-inner">
            <p className="text-xl text-gray-500 font-medium">
              👆 Please select an event category above to continue.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * 2. The TabCard Component Definition (Fixed Redlines)
 */
const TabCard: React.FC<TabCardProps> = ({ 
  title, 
  description, 
  icon: Icon, 
  onClick, 
  isActive, 
  color 
}) => {
  // Use explicit conditional styling (Redline Safe)
  const baseClasses = "cursor-pointer bg-white rounded-2xl border-2 p-8 transition transform duration-300 hover:shadow-lg hover:border-gray-300";
  
  let activeStyle = 'shadow-md border-gray-200';
  let iconBg = 'bg-gray-100 text-gray-600';

  if (isActive) {
    if (color === 'indigo') {
      activeStyle = 'ring-4 ring-indigo-400 border-indigo-500 shadow-xl scale-[1.02]';
      iconBg = 'bg-indigo-100 text-indigo-600';
    } else if (color === 'pink') {
      activeStyle = 'ring-4 ring-pink-400 border-pink-500 shadow-xl scale-[1.02]';
      iconBg = 'bg-pink-100 text-pink-600';
    }
  }

  return (
    <div
      onClick={onClick}
      className={`${baseClasses} ${activeStyle}`}
    >
      <div className={`p-3 rounded-full inline-flex mb-4 ${iconBg}`}>
        <Icon className="w-6 h-6" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
};


/* ========================================================= */
/* === OFF-STAGE COMPONENT WITH LOT NUMBER ================ */
/* ========================================================= */
function OffStageAttendanceExport() {
  const [events, setEvents] = useState<string[]>([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setFetchError(null);
    try {
      const res = await fetch("/api/lots/get-all");
      const data = await res.json();
      if (data.success) {
        // Extract unique event names
        const eventList = [...new Set(data.lots.map((lot: any) => lot.event))];
        setEvents(eventList.filter(Boolean).sort() as string[]); // Filter out falsy values and sort
      } else {
         setFetchError("Failed to load events. API error.");
      }
    } catch (err) {
      console.error("Event fetch error:", err);
      setFetchError("Could not connect to the event server.");
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const fetchAttendance = async () => {
    if (!selectedEvent) return [];
    try {
      const res = await fetch("/api/get-attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filterEvent: selectedEvent }),
      });
      const data = await res.json();
      if (!data.success) return [];
      return data.attendance || [];
    } catch (err) {
      console.error("Attendance fetch error", err);
      return [];
    }
  };

  // ✅ Format for Excel with Lot Number
  const formatForExport = (rows: any[]) =>
    rows.map((r) => ({
      Event: r.eventName ?? r.event ?? "",
      Contestant: r.contestantName ?? "",
      SecondContestant: r.secondContestantName ?? "",
      Team: r.teamName ?? "",
      TeamID: r.teamId ?? r.teamID ?? "",
      DNo: r.dNo ?? "",
      SecondDno: r.secondDno ?? "",
      Lot: r.lotNumber ?? r.lot ?? "", // <-- Lot included
      Status: r.attendance ?? "",
      Malpractice: r.malpracticeDetails ?? "",
    }));

  const downloadExcel = async () => {
    if (!selectedEvent) return;
    setLoading(true);
    try {
      const rows = await fetchAttendance();
      if (rows.length === 0) {
        alert("No attendance data found for the selected event.");
        setLoading(false);
        return;
      }
      
      const formatted = formatForExport(rows);
      const worksheet = XLSX.utils.json_to_sheet(formatted);

      // Define column widths for better Excel readability
      worksheet["!cols"] = [
        { wch: 20 }, { wch: 25 }, { wch: 25 }, 
        { wch: 28 }, { wch: 12 }, { wch: 8 }, 
        { wch: 8 }, { wch: 8 }, { wch: 12 }, 
        { wch: 30 },
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "OffStageAttendance");
      XLSX.writeFile(workbook, `offstage_${selectedEvent.replace(/[^a-z0-9]/gi, '_')}_attendance_export.xlsx`);
      
    } catch (error) {
       console.error("Excel download error:", error);
       alert("An error occurred during the Excel creation process.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10 border-t-4 border-indigo-500">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Off-Stage Export</h2>
        <p className="text-gray-500">
          Select an event to download the detailed attendance sheet.
        </p>
      </div>

      {fetchError && (
         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
           <strong className="font-bold">Error:</strong>
           <span className="block sm:inline"> {fetchError}</span>
         </div>
      )}

      <div className="mb-8">
        <label htmlFor="off-stage-event-select" className="block text-sm font-medium text-gray-700 mb-2">
          Select Off-Stage Event
        </label>
        <select
          id="off-stage-event-select"
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition"
          disabled={loading || events.length === 0}
        >
          <option value="" disabled>
            {events.length === 0 ? "Loading events..." : "--- Select Event ---"}
          </option>
          {events.map((event) => (
            <option key={event} value={event}>{event}</option>
          ))}
        </select>
        {events.length > 0 && selectedEvent && (
          <p className="mt-2 text-sm text-gray-500">Selected: **{selectedEvent}**</p>
        )}
      </div>

      {/* 3. The Button Usage (Fixed Redlines) */}
      <Button 
        onClick={downloadExcel} 
        loading={loading}
        disabled={!selectedEvent || events.length === 0}
        variant="primary"
      >
        Download Off-Stage Attendance Excel
      </Button>
    </div>
  );
}

/* ========================================================= */
/* === ON-STAGE COMPONENT WITH LOT NUMBER ================= */
/* ========================================================= */
function OnStageAttendanceExport() {
  const [events, setEvents] = useState<string[]>([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setFetchError(null);
    try {
      const res = await fetch("/api/onstage/get-lotwise");
      const json = await res.json();
      if (json.data) {
        // Sort by lot number first (optional, but good practice if data is used elsewhere)
        const sortedData = json.data.sort(
          (a: any, b: any) => a.lot_number - b.lot_number
        );
        // Extract unique event names
        const uniqueEvents = [...new Set(sortedData.map((item: any) => item.event))];
        setEvents(uniqueEvents.filter(Boolean).sort() as string[]); // Filter out falsy values and sort
      } else {
        setFetchError("Failed to load events. API error.");
      }
    } catch (error) {
      console.error("Error fetching onstage events:", error);
      setFetchError("Could not connect to the event server.");
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const fetchOnStageAttendance = async () => {
    if (!selectedEvent) return [];
    try {
      const res = await fetch("/api/onstage/get-attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventName: selectedEvent }),
      });
      const data = await res.json();
      if (!data.success) return [];
      return data.attendance || [];
    } catch (err) {
      console.error("Onstage attendance fetch error", err);
      return [];
    }
  };

  // ✅ Include lot_number in export
  const formatForExport = (rows: any[]) =>
    rows.map((r) => ({
      Event: r.eventName ?? "",
      Contestant: r.contestantName ?? "",
      Team: r.teamName ?? "",
      TeamID: r.teamId ?? "",
      DNo: r.dNo ?? "",
      Lot: r.lot_number ?? r.lot ?? "", // <-- Lot included
      Status: r.status ?? "",
      Malpractice: r.malpracticeDetails ?? "",
    }));

  const downloadExcel = async () => {
    if (!selectedEvent) return;
    setLoading(true);
    try {
      const rows = await fetchOnStageAttendance();
      if (rows.length === 0) {
        alert("No attendance data found for the selected event.");
        setLoading(false);
        return;
      }
      
      const formatted = formatForExport(rows);
      const worksheet = XLSX.utils.json_to_sheet(formatted);

      // Define column widths for better Excel readability
      worksheet["!cols"] = [
        { wch: 20 }, { wch: 25 }, { wch: 28 }, 
        { wch: 12 }, { wch: 10 }, { wch: 8 }, 
        { wch: 12 }, { wch: 30 }, 
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "OnStageAttendance");
      XLSX.writeFile(workbook, `onstage_${selectedEvent.replace(/[^a-z0-9]/gi, '_')}_attendance_export.xlsx`);
      
    } catch (error) {
       console.error("Excel download error:", error);
       alert("An error occurred during the Excel creation process.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10 border-t-4 border-pink-500">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">On-Stage Export</h2>
        <p className="text-gray-500">
          Select an event to download the detailed attendance sheet.
        </p>
      </div>

      {fetchError && (
         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
           <strong className="font-bold">Error:</strong>
           <span className="block sm:inline"> {fetchError}</span>
         </div>
      )}

      <div className="mb-8">
        <label htmlFor="on-stage-event-select" className="block text-sm font-medium text-gray-700 mb-2">
          Select On-Stage Event
        </label>
        <select
          id="on-stage-event-select"
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-pink-500 focus:border-pink-500 transition"
          disabled={loading || events.length === 0}
        >
          <option value="" disabled>
            {events.length === 0 ? "Loading events..." : "--- Select Event ---"}
          </option>
          {events.map((event) => (
            <option key={event} value={event}>{event}</option>
          ))}
        </select>
         {events.length > 0 && selectedEvent && (
          <p className="mt-2 text-sm text-gray-500">Selected: **{selectedEvent}**</p>
        )}
      </div>

      {/* 3. The Button Usage (Fixed Redlines) */}
      <Button 
        onClick={downloadExcel} 
        loading={loading}
        disabled={!selectedEvent || events.length === 0}
        variant="secondary"
      >
        Download On-Stage Attendance Excel
      </Button>
    </div>
  );
}