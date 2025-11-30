// app/events/page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
// Ensure EventSection and the 'events' data are correctly imported from their respective paths
import EventSection from "../../../components/ScheduleSection";
import { events } from "@/data/events";

type FilterType = "ON_STAGE" | "OFF_STAGE";

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<FilterType>("ON_STAGE");
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  const onStageEvents = events.filter((e) => e.stageType === "ON_STAGE");
  const offStageEvents = events.filter((e) => e.stageType === "OFF_STAGE");

  const handleEventClick = (eventId: string) => {
    setExpandedEventId(expandedEventId === eventId ? null : eventId);
  };

  // Define tabs for cleaner mapping and Framer Motion key
  const tabs = [
    { id: "ON_STAGE", label: "On Stage", color: "red" },
    { id: "OFF_STAGE", label: "Off Stage", color: "blue" },
  ];

  return (
    // Increased max-width on large screens for a wider layout
    <div className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 pt-30 max-w-4xl lg:max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-4 mb-4">
          {/* Left Diamond with gradient and shine effect */}
          <div className="relative">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg transform rotate-45 shadow-lg shadow-blue-500/30"></div>
            <div className="absolute inset-1 bg-gradient-to-br from-white/20 to-transparent rounded-lg transform rotate-45"></div>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Schedule</span>
          </h1>

          {/* Right Diamond with gradient and shine effect */}
          <div className="relative">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg transform rotate-45 shadow-lg shadow-purple-500/30"></div>
            <div className="absolute inset-1 bg-gradient-to-br from-white/20 to-transparent rounded-lg transform rotate-45"></div>
          </div>
        </div>

        {/* Subtitle with enhanced design */}
        <p className="text-gray-600 text-sm sm:text-base bg-gradient-to-r from-gray-50 to-blue-50 rounded-full py-3 px-8 inline-block border border-gray-200/80 shadow-sm">
          ✨ St. Joseph's College Cultural Events 2025
        </p>
      </div>

      {/* --- Desktop Tab Navigation - NEW BEAUTIFUL DESIGN --- */}
      <div className="hidden lg:flex justify-center mb-10">
        <div className="p-1 bg-white border border-gray-200 rounded-xl shadow-lg relative flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as FilterType);
                setExpandedEventId(null);
              }}
              className={`relative z-10 px-8 py-3 text-base font-semibold transition-colors duration-300 rounded-lg ${activeTab === tab.id
                  ? 'text-white' // Text is white when active (due to indicator)
                  : 'text-gray-600 hover:text-gray-800'
                }`}
              style={{ minWidth: '150px' }} // Ensure consistent button size
            >
              {/* This inner span is needed to ensure text stays visible above the sliding indicator */}
              <span className="relative z-20">{tab.label}</span>

              {/* Framer Motion Active Tab Indicator */}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="desktop-tab-indicator"
                  className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 shadow-md shadow-purple-500/40"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
      {/* --- END Desktop Tab Navigation --- */}

      {/* Mobile Filter Buttons - Smooth Switching */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="lg:hidden flex justify-center mb-6"
      >
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 border border-gray-200 shadow-sm">
          <div className="flex space-x-2 relative">
            {[
              { key: "ON_STAGE" as FilterType, label: "On Stage", color: "red" },
              { key: "OFF_STAGE" as FilterType, label: "Off Stage", color: "green" }
            ].map((filter) => {
              const isActive = activeTab === filter.key;
              const activeBg =
                filter.key === "ON_STAGE"
                  ? "bg-red-500"
                  : "bg-green-500";

              return (
                <button
                  key={filter.key}
                  onClick={() => {
                    setActiveTab(filter.key);
                    setExpandedEventId(null);
                  }}
                  className="relative px-8 py-3 rounded-xl font-medium transition-colors duration-300"
                >
                  {isActive && (
                    <motion.div
                      layoutId="mobileActiveTabIndicator"
                      className={`absolute inset-0 ${activeBg} rounded-xl shadow-md`}
                      transition={{ type: "spring", stiffness: 280, damping: 20 }}
                    />
                  )}

                  <span className={`relative z-10 ${isActive ? "text-white" : "text-gray-600"}`}>
                    {filter.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Events List - Only show events for active tab */}
      <div className="space-y-6">
        {/* Added motion.div wrapper for a smooth fade-in/out transition when switching tabs */}
        <motion.div
          key={activeTab} // Key changes when tab changes, triggering a remount/transition
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {activeTab === "ON_STAGE" && (
            <EventSection
              title="On-Stage Events"
              events={onStageEvents}
              onEventClick={handleEventClick}
            />
          )}

          {activeTab === "OFF_STAGE" && (
            <EventSection
              title="Off-Stage Events"
              events={offStageEvents}
              onEventClick={handleEventClick}
            />
          )}
        </motion.div>
      </div>



      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}