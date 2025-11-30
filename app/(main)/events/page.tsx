"use client";

import { useState } from "react";
import { events } from "@/data/events";
import { motion, AnimatePresence } from "framer-motion";
import {
  Music,
  Mic2,
  Drama,
  Paintbrush,
  Code,
  Lightbulb,
  Gamepad2,
  Users,
  User,
  Clock,
  Sparkles,
  Ticket
} from "lucide-react";

type FilterType = "ON_STAGE" | "OFF_STAGE";

const getEventIcon = (category: string) => {
  switch (category) {
    case "Music": return Music;
    case "Dance": return Drama;
    case "Drama": return Mic2;
    case "Art": return Paintbrush;
    case "Technical": return Code;
    case "Gaming": return Gamepad2;
    default: return Sparkles;
  }
};

export default function EventsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("ON_STAGE");
  const filteredEvents = events.filter((e) => e.stageType === activeFilter);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto">

        {/* --- Header & Filter Compact Row --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-indigo-600 font-bold tracking-wider uppercase text-xs mb-2">
              <Sparkles size={14} /> Official Lineup
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-none">
              Event <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Feed</span>
            </h1>
          </div>

          {/* Compact Filter Switch */}
          <div className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm flex w-full md:w-auto md:inline-flex">
            {[
              { key: "ON_STAGE" as FilterType, label: "On Stage" },
              { key: "OFF_STAGE" as FilterType, label: "Off Stage" }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`
        relative px-6 py-2 rounded-lg text-sm font-bold transition-all duration-300 z-10
        flex-1 md:w-32 text-center whitespace-nowrap
        ${activeFilter === filter.key ? "text-white" : "text-slate-500 hover:text-slate-700"}
      `}
              >
                {activeFilter === filter.key && (
                  <motion.div
                    layoutId="activePill"
                    className={`absolute inset-0 rounded-lg shadow-sm ${filter.key === "ON_STAGE"
                      ? "bg-indigo-600"
                      : "bg-pink-600"
                      }`}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    style={{ zIndex: -1 }}
                  />
                )}
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* --- Dense Ticket Grid --- */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            // Using a denser grid (up to 3 cols on large, 2 on medium)
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filteredEvents.map((event, idx) => {
              const Icon = getEventIcon(event.category);
              const isTeam = Math.random() > 0.5; // Dummy data
              const isActiveOn = activeFilter === "ON_STAGE";
              const themeColor = isActiveOn ? "text-indigo-600" : "text-pink-600";
              const bgColor = isActiveOn ? "bg-indigo-50" : "bg-pink-50";
              const borderColor = isActiveOn ? "group-hover:border-indigo-200" : "group-hover:border-pink-200";

              return (
                <motion.div
                  key={event.id}
                  variants={cardVariants}
                  className={`
                    group relative bg-white rounded-xl border border-slate-200 overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300
                    flex flex-row h-32 md:h-36 ${borderColor}
                  `}
                >
                  {/* Left Side: The "Stub" */}
                  <div className={`w-24 md:w-28 flex flex-col items-center justify-center border-r-2 border-dashed border-slate-200 relative ${bgColor}`}>
                    {/* Semi-circles for ticket punch holes */}
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-slate-50 rounded-full border border-slate-200 z-10" />
                    <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-slate-50 rounded-full border border-slate-200 z-10" />

                    <span className={`text-3xl font-black opacity-30 ${themeColor}`}>
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <Icon size={24} className={`mt-2 opacity-60 ${themeColor}`} />
                  </div>

                  {/* Right Side: Content */}
                  <div className="flex-1 p-4 flex flex-col justify-between relative">

                    {/* Category Tag */}
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-100 px-2 py-0.5 rounded-sm">
                        {event.category}
                      </span>
                      <Ticket size={16} className="text-slate-300 group-hover:text-slate-800 transition-colors" />
                    </div>

                    {/* Title */}
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 leading-tight line-clamp-2 group-hover:text-slate-900">
                        {event.title}
                      </h3>
                    </div>

                    {/* Footer Details */}
                    <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                      <div className="flex items-center gap-1">
                        {isTeam ? <Users size={12} /> : <User size={12} />}
                        <span>{isTeam ? "Team" : "Solo"}</span>
                      </div>
                      <div className="w-1 h-1 rounded-full bg-slate-300" />
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>2h</span>
                      </div>
                    </div>

                    {/* Hover Reveal Gradient */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 pointer-events-none transition-opacity duration-300 ${isActiveOn ? 'bg-indigo-600' : 'bg-pink-600'}`} />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* --- Empty State --- */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-20 opacity-50">
            <p className="text-xl font-bold text-slate-400">Updating schedule...</p>
          </div>
        )}

      </div>
    </div>
  );
}