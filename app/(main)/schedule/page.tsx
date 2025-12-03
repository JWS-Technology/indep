"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, AlertCircle } from "lucide-react";
import EventSection from "@/components/schedule/ScheduleSection"; // Keep your existing path

// Define the shape of data coming from your DB
type FilterType = "ON_STAGE" | "OFF_STAGE";

interface EventItem {
  _id: string; // MongoDB uses _id, not id
  title: string;
  category: string;
  stageType: FilterType;
  venue: string;
  startTime: string; // or 'time' depending on your DB schema
  date: string;
  description?: string;
  status?: string;
}

export default function EventsPage() {
  // 1. State for Data & UI
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<FilterType>("ON_STAGE");
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  // 2. Fetch Data on Component Mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/events');

        if (!res.ok) {
          throw new Error('Failed to fetch schedule');
        }

        const data = await res.json();
        setEvents(data.events || []);
      } catch (err) {
        setError("Could not load the schedule. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // 3. Filter Logic (Now uses the 'events' state, not the imported file)
  const onStageEvents = events.filter((e) => e.stageType === "ON_STAGE");
  const offStageEvents = events.filter((e) => e.stageType === "OFF_STAGE");

  const handleEventClick = (eventId: string) => {
    setExpandedEventId(expandedEventId === eventId ? null : eventId);
  };

  const tabs = [
    { id: "ON_STAGE", label: "On Stage", color: "red" },
    { id: "OFF_STAGE", label: "Off Stage", color: "blue" },
  ];

  // 4. Loading State UI
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading Schedule...</p>
      </div>
    );
  }

  // 5. Error State UI
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl flex flex-col items-center max-w-md text-center">
          <AlertCircle className="w-12 h-12 mb-2" />
          <h3 className="font-bold text-lg">Unable to connect</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // 6. Main Render (Mostly unchanged, just uses state data now)
  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 pt-30 max-w-4xl lg:max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-4 mb-4">
          {/* Left Diamond */}
          <div className="relative">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg transform rotate-45 shadow-lg shadow-blue-500/30"></div>
            <div className="absolute inset-1 bg-gradient-to-br from-white/20 to-transparent rounded-lg transform rotate-45"></div>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Schedule</span>
          </h1>

          {/* Right Diamond */}
          <div className="relative">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg transform rotate-45 shadow-lg shadow-purple-500/30"></div>
            <div className="absolute inset-1 bg-gradient-to-br from-white/20 to-transparent rounded-lg transform rotate-45"></div>
          </div>
        </div>

        <p className="text-gray-600 text-sm sm:text-base bg-gradient-to-r from-gray-50 to-blue-50 rounded-full py-3 px-8 inline-block border border-gray-200/80 shadow-sm">
          ✨ St. Joseph's College Cultural Events 2025
        </p>
      </div>

      {/* Desktop Tab Navigation */}
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
                ? 'text-white'
                : 'text-gray-600 hover:text-gray-800'
                }`}
              style={{ minWidth: '150px' }}
            >
              <span className="relative z-20">{tab.label}</span>
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

      {/* Mobile Filter Buttons */}
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
              const activeBg = filter.key === "ON_STAGE" ? "bg-red-500" : "bg-green-500";

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

      {/* Events List */}
      <div className="space-y-6">
        <motion.div
          key={activeTab}
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

          {/* Empty State Check */}
          {activeTab === "ON_STAGE" && onStageEvents.length === 0 && (
            <div className="text-center py-10 text-gray-400">No On-Stage events scheduled yet.</div>
          )}
          {activeTab === "OFF_STAGE" && offStageEvents.length === 0 && (
            <div className="text-center py-10 text-gray-400">No Off-Stage events scheduled yet.</div>
          )}
        </motion.div>
      </div>
    </div>
  );
}