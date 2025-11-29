// app/events/page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import EventSection from "../../components/ScheduleSection";
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

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 pt-30 max-w-4xl mx-auto">
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

      {/* Desktop Tab Navigation - Hidden on mobile */}
      <div className="hidden lg:flex border-b border-gray-200 mb-6 overflow-x-auto">
        <button
          onClick={() => {
            setActiveTab("ON_STAGE");
            setExpandedEventId(null);
          }}
          className={`flex-1 sm:flex-none px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "ON_STAGE"
              ? "border-red-500 text-red-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          On Stage
        </button>
        <button
          onClick={() => {
            setActiveTab("OFF_STAGE");
            setExpandedEventId(null);
          }}
          className={`flex-1 sm:flex-none px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "OFF_STAGE"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Off Stage
        </button>
      </div>

      {/* Mobile Filter Buttons - Only show on mobile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="lg:hidden flex justify-center mb-6"
      >
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 border border-gray-200 shadow-sm">
          <div className="flex space-x-2">
            {[
              { 
                key: "ON_STAGE" as FilterType, 
                label: "On Stage", 
                color: "red"
              },
              { 
                key: "OFF_STAGE" as FilterType, 
                label: "Off Stage", 
                color: "green"
              }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => {
                  setActiveTab(filter.key);
                  setExpandedEventId(null);
                }}
                className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === filter.key
                    ? filter.key === "ON_STAGE"
                      ? "bg-red-500 text-white shadow-md"
                      : "bg-green-500 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Events List - Only show events for active tab */}
      <div className="space-y-6">
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
      </div>

      {/* Footer Note */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          💡 Click on any event to see more details
        </p>
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