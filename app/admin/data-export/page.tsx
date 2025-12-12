"use client";

import Link from "next/link";
import { FaFileExcel, FaUsers, FaClipboardList } from "react-icons/fa";

// Reusable Card Component
const ExportCard = ({
  href,
  icon: Icon,
  title,
  description,
  borderColor,
}: {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
  borderColor: string; // Tailwind color e.g., 'indigo', 'green', 'pink'
}) => (
  <Link
    href={href}
    className={`bg-white border border-gray-200 rounded-xl shadow-lg p-8 flex flex-col items-center
      transition-all duration-300 ease-in-out transform
      hover:shadow-2xl hover:scale-[1.02] hover:border-${borderColor}-400 focus:outline-none focus:ring-4 focus:ring-${borderColor}-300`}
  >
    <div className={`text-6xl text-${borderColor}-600 mb-4`}>
      <Icon />
    </div>
    <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
    <p className="text-base text-gray-500 text-center">{description}</p>
  </Link>
);

export default function DataExportHome() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 flex flex-col items-center">
      
      {/* Title Section */}
      <h1 className="text-4xl font-extrabold text-gray-800 mb-4 border-b-4 border-indigo-500 pb-2">
        Admin Data Export Center
      </h1>
      <p className="text-lg text-gray-500 mb-12">
        Select a data category to download the respective reports.
      </p>

      {/* Grid for Export Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        <ExportCard
          href="/admin/data-export/lot"
          icon={FaFileExcel}
          title="Lots Data Export"
          description="Download the comprehensive list of all existing lots data as an Excel spreadsheet (.xlsx)."
          borderColor="indigo"
        />

        <ExportCard
          href="/admin/data-export/attendance"
          icon={FaUsers}
          title="Attendance Reports"
          description="Export detailed attendance reports, filterable event-wise, in a structured Excel format."
          borderColor="green"
        />

        <ExportCard
          href="/admin/data-export/onstageregrecord"
          icon={FaClipboardList}
          title="On-Stage Registration"
          description="Export all registered on-stage event data, including contestants, DNos, and lot numbers, in an Excel sheet."
          borderColor="pink"
        />

        <ExportCard
          href="/admin/data-export/offstageregrecord"
          icon={FaClipboardList}
          title="Off-Stage Registration"
          description="Export all registered off-stage event data, including contestants, DNos, and lot numbers, in an Excel sheet."
          borderColor="purple"
        />
      </div>
    </div>
  );
}
