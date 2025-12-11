
"use client";

import Link from "next/link";
import { FaFileExcel, FaUsers } from "react-icons/fa"; // Using react-icons for a professional touch

export default function DataExportHome() {
  return (
    // Outer container with subtle background and centering
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 flex flex-col items-center">
      
      {/* Title Section */}
      <h1 className="text-4xl font-extrabold text-gray-800 mb-4 border-b-4 border-indigo-500 pb-2">
        Admin Data Export Center
      </h1>
      <p className="text-lg text-gray-500 mb-12">
        Select a data category to download the respective reports.
      </p>

      {/* Grid for Export Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        
        {/* LOTS EXPORT CARD */}
        <Link
          href="/admin/data-export/lot"
          // Enhanced Card Styling: background, border, shadow, and transition
          className="bg-white border border-gray-200 rounded-xl shadow-lg p-8 flex flex-col items-center 
                     transition-all duration-300 ease-in-out transform 
                     hover:shadow-2xl hover:scale-[1.02] hover:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-300"
        >
          {/* Icon */}
          <div className="text-6xl text-indigo-600 mb-4">
            <FaFileExcel />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Lots Data Export</h2>
          
          <p className="text-base text-gray-500 text-center">
            Download the comprehensive list of all existing lots data as an Excel spreadsheet (.xlsx).
          </p>
        </Link>

        {/* ATTENDANCE EXPORT CARD */}
        <Link
          href="/admin/data-export/attendance"
          // Enhanced Card Styling: background, border, shadow, and transition
          className="bg-white border border-gray-200 rounded-xl shadow-lg p-8 flex flex-col items-center 
                     transition-all duration-300 ease-in-out transform 
                     hover:shadow-2xl hover:scale-[1.02] hover:border-green-400 focus:outline-none focus:ring-4 focus:ring-green-300"
        >
          {/* Icon */}
          <div className="text-6xl text-green-600 mb-4">
            <FaUsers /> {/* Changed the icon to represent attendance/people */}
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Attendance Reports</h2>
          
          <p className="text-base text-gray-500 text-center">
            Export detailed attendance reports, filterable event-wise, in a structured Excel format.
          </p>
        </Link>
        
        {/* You can easily add more export cards here */}
        
      </div>
    </div>
  );
}