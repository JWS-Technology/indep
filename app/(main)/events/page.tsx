"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Music,
  Mic2,
  Drama,
  Paintbrush,
  Code,
  Gamepad2,
  Users,
  User,
  Clock,
  Sparkles,
  Ticket,
  MapPin,
  Loader2,
  AlertCircle,
} from "lucide-react";

// ------------------ TYPES (MATCHING ADMIN PAGE) ------------------
type FilterType = "ON_STAGE" | "OFF_STAGE";

interface Incharge {
  name: string;
  department: string;
}

interface EventItem {
  _id: string;
  title: string;
  category: string;
  stageType: FilterType;
  venue: string;
  date: string;
  time: string;
  incharge?: Incharge[];
  status?: string;
}

// ------------------ ICONS ------------------
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

  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>("ON_STAGE");

  // ------------------ FETCH EVENTS (MATCHING ADMIN PAGE EXACTLY) ------------------
  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events");
      const data = await res.json();

      if (data.events) {
        setEvents(data.events);
      } else {
        setEvents([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Unable to load events.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // ------------------ FILTER ------------------
  const filteredEvents = events.filter((e) => e.stageType === activeFilter);

  // ------------------ ANIMATIONS ------------------
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  // ------------------ LOADING ------------------
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-3" />
        <p className="text-slate-500 font-medium">Loading events…</p>
      </div>
    );
  }

  // ------------------ ERROR ------------------
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <div className="bg-red-50 border border-red-200 p-6 rounded-xl max-w-md text-center text-red-600">
          <AlertCircle className="w-10 h-10 mx-auto mb-3" />
          <h1 className="text-lg font-bold">Error</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // ------------------ UI ------------------
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-indigo-600 font-bold tracking-wider uppercase text-xs mb-2">
              <Sparkles size={14} /> Official Lineup
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900">
              Event <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">Feed</span>
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



        {/* Event Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filteredEvents.map((event, idx) => {
              const Icon = getEventIcon(event.category);

              return (
                <motion.div
                  key={event._id}
                  variants={cardVariants}
                  className="group flex bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all h-36"
                >
                  {/* Left Side */}
                  <div className="w-28 bg-slate-50 flex flex-col items-center justify-center border-r border-slate-200">
                    <span className="text-3xl font-black opacity-30 text-indigo-600">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <Icon size={26} className="opacity-60 text-indigo-600 mt-2" />
                  </div>

                  {/* Right */}
                  <div className="flex-1 p-4 flex flex-col justify-between relative">

                    {/* Tag Row */}
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-bold uppercase tracking-widest text-slate-500">
                        {event.category}
                      </span>
                      <Ticket size={16} className="text-slate-300" />
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold leading-tight text-slate-800">
                      {event.title}
                    </h3>

                    {/* Venue + Time */}
                    <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                      <div className="flex items-center gap-1">
                        <MapPin size={12} />
                        <span>{event.venue || "No venue"}</span>
                      </div>

                      <div className="w-1 h-1 bg-slate-300 rounded-full" />

                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{event.time || "TBA"}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Empty */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-20 opacity-50">
            <p className="text-xl font-bold text-slate-400">No events found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
