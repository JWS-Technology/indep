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
  Loader2,
  AlertCircle,
} from "lucide-react";

// --- Types matching your Database ---
type FilterType = "ON_STAGE" | "OFF_STAGE";

interface EventItem {
  _id: string;
  title: string;
  category: string;
  stageType: FilterType;
  venue: string;
  date: string;
  time: string;
  incharge?: { name: string; department: string }[];
  status?: string;
}

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
  // State
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeFilter, setActiveFilter] = useState<FilterType>("ON_STAGE");

  // --- Fetch Data EXACTLY like your working admin file ---
  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events");
      const data = await res.json();

      if (data.events) {
        setEvents(data.events); // SAME as working admin code
      } else {
        setEvents([]);
      }
    } catch (err) {
      console.error("Error fetching:", err);
      setError("Could not load the official lineup.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Filter events
  const filteredEvents = events.filter((e) => e.stageType === activeFilter);

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  // Loading Screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Loading lineup...</p>
      </div>
    );
  }

  // Error Screen
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl flex flex-col items-center max-w-md text-center border border-red-100">
          <AlertCircle className="w-10 h-10 mb-2" />
          <h3 className="font-bold text-lg">Unable to connect</h3>
          <p className="text-sm opacity-80">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
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


        {/* Event Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filteredEvents.map((event, idx) => {
              const Icon = getEventIcon(event.category);
              const isActiveOn = activeFilter === "ON_STAGE";
              const themeColor = isActiveOn ? "text-indigo-600" : "text-pink-600";
              const bgColor = isActiveOn ? "bg-indigo-50" : "bg-pink-50";
              const borderColor = isActiveOn ? "group-hover:border-indigo-200" : "group-hover:border-pink-200";

              return (
                <motion.div
                  key={event._id}
                  variants={cardVariants}
                  className={`
                    group relative bg-white rounded-xl border border-slate-200 overflow-hidden cursor-pointer hover:shadow-lg transition-all flex flex-row h-32 md:h-36 ${borderColor}
                  `}
                >
                  {/* Left stub */}
                  <div className={`w-24 md:w-28 flex flex-col items-center justify-center border-r-2 border-dashed border-slate-200 relative ${bgColor}`}>
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-slate-50 rounded-full border border-slate-200" />
                    <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-slate-50 rounded-full border border-slate-200" />

                    <span className={`text-3xl font-black opacity-30 ${themeColor}`}>
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <Icon size={24} className={`mt-2 opacity-60 ${themeColor}`} />
                  </div>

                  {/* Right content */}
                  <div className="flex-1 p-4 flex flex-col justify-between relative">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-100 px-2 py-0.5 rounded-sm">
                        {event.category}
                      </span>
                      <Ticket size={16} className="text-slate-300 group-hover:text-slate-800 transition-colors" />
                    </div>

                    <h3 className="text-lg font-bold text-slate-800 leading-tight line-clamp-2 group-hover:text-slate-900">
                      {event.title}
                    </h3>

                    <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
<<<<<<< HEAD
                      {/* <div className="flex items-center gap-1">
                        <User size={12} />
                        <span>Solo</span>
                      </div> */}
=======
                      <div className="flex items-center gap-1">
                        {/* You can make this dynamic if your DB has 'isTeam' */}
                        {isTeam ? <Users size={12} /> : <User size={12} />}
                        <span>{isTeam ? "Team" : "Solo"}</span>
                      </div>

>>>>>>> 088d291dfb92706edffe7121f28db7cd6dc139dc
                      <div className="w-1 h-1 rounded-full bg-slate-300" />
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{event.time || "TBA"}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-medium text-slate-500">

<<<<<<< HEAD
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity ${isActiveOn ? "bg-indigo-600" : "bg-pink-600"}`} />
=======
                      <div className="flex items-center gap-1">
                        <Lightbulb size={12} />
                        {/* Displaying dynamic time from DB */}
                        <span>{event.venue || "TBA"}</span>
                      </div>
                    </div>
                    {/* Hover Reveal Gradient */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 pointer-events-none transition-opacity duration-300 ${isActiveOn ? 'bg-indigo-600' : 'bg-pink-600'}`} />
>>>>>>> 088d291dfb92706edffe7121f28db7cd6dc139dc
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Empty */}
        {!isLoading && filteredEvents.length === 0 && (
          <div className="text-center py-20 opacity-50">
            <p className="text-xl font-bold text-slate-400">No events found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
