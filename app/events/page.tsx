// app/events/page.tsx
"use client";

import { useState } from "react";
import EventSection from "./EventSection";
import { events } from "@/data/events";

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<"ALL" | "ON_STAGE" | "OFF_STAGE">("ALL");
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  const onStageEvents = events.filter((e) => e.stageType === "ON_STAGE");
  const offStageEvents = events.filter((e) => e.stageType === "OFF_STAGE");

  const handleEventClick = (eventId: string) => {
    setExpandedEventId(expandedEventId === eventId ? null : eventId);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          INDEP Events
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          St. Joseph's College Cultural Events 2025
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        <button
          onClick={() => {
            setActiveTab("ALL");
            setExpandedEventId(null);
          }}
          className={`flex-1 sm:flex-none px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "ALL"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          All Events ({events.length})
        </button>
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
          On Stage ({onStageEvents.length})
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
          Off Stage ({offStageEvents.length})
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-lg p-3 text-center shadow-sm border border-gray-200">
          <div className="text-lg font-bold text-gray-800">{events.length}</div>
          <div className="text-xs text-gray-500">Total</div>
        </div>
        <div className="bg-white rounded-lg p-3 text-center shadow-sm border border-gray-200">
          <div className="text-lg font-bold text-red-600">{onStageEvents.length}</div>
          <div className="text-xs text-gray-500">On Stage</div>
        </div>
        <div className="bg-white rounded-lg p-3 text-center shadow-sm border border-gray-200">
          <div className="text-lg font-bold text-blue-600">{offStageEvents.length}</div>
          <div className="text-xs text-gray-500">Off Stage</div>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-6">
        {activeTab === "ALL" && (
          <>
            <EventSection 
              title="On-Stage Events" 
              events={onStageEvents}
              expandedEventId={expandedEventId}
              onEventClick={handleEventClick}
            />
            <EventSection 
              title="Off-Stage Events" 
              events={offStageEvents}
              expandedEventId={expandedEventId}
              onEventClick={handleEventClick}
            />
          </>
        )}

        {activeTab === "ON_STAGE" && (
          <EventSection 
            title="On-Stage Events" 
            events={onStageEvents}
            expandedEventId={expandedEventId}
            onEventClick={handleEventClick}
          />
        )}

        {activeTab === "OFF_STAGE" && (
          <EventSection 
            title="Off-Stage Events" 
            events={offStageEvents}
            expandedEventId={expandedEventId}
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