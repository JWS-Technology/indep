// app/events/page.tsx
"use client";

import { useState } from "react";
import { events } from "@/data/events";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Theater, 
  Palette, 
  Tag,
  Music,
  Mic2,
  Drama,
  Paintbrush,
  Code,
  Lightbulb,
  Gamepad2
} from "lucide-react";

type FilterType = "ON_STAGE" | "OFF_STAGE";

// Category color and icon mapping
const categoryConfig = {
  // On Stage Categories
  "Music": { color: "from-purple-600 to-pink-500", icon: Music, bg: "bg-purple-100", text: "text-purple-800", border: "border-purple-200" },
  "Dance": { color: "from-orange-600 to-red-500", icon: Drama, bg: "bg-orange-100", text: "text-orange-800", border: "border-orange-200" },
  "Drama": { color: "from-blue-600 to-cyan-500", icon: Mic2, bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-200" },
  "Singing": { color: "from-green-600 to-emerald-500", icon: Music, bg: "bg-green-100", text: "text-green-800", border: "border-green-200" },
  
  // Off Stage Categories
  "Art": { color: "from-rose-600 to-pink-500", icon: Paintbrush, bg: "bg-rose-100", text: "text-rose-800", border: "border-rose-200" },
  "Technical": { color: "from-indigo-600 to-purple-500", icon: Code, bg: "bg-indigo-100", text: "text-indigo-800", border: "border-indigo-200" },
  "Creative": { color: "from-yellow-600 to-amber-500", icon: Lightbulb, bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-200" },
  "Gaming": { color: "from-lime-600 to-green-500", icon: Gamepad2, bg: "bg-lime-100", text: "text-lime-800", border: "border-lime-200" },
  
  // Default fallback
  "default": { color: "from-gray-600 to-gray-500", icon: Tag, bg: "bg-gray-100", text: "text-gray-800", border: "border-gray-200" }
};

const getCategoryConfig = (category: string) => {
  return categoryConfig[category as keyof typeof categoryConfig] || categoryConfig.default;
};

export default function EventsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("ON_STAGE");
  
  const onStageEvents = events.filter((e) => e.stageType === "ON_STAGE");
  const offStageEvents = events.filter((e) => e.stageType === "OFF_STAGE");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4
      }
    },
    hover: {
      scale: 1.02,
      y: -5,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-5 mt-15">
      <div className="max-w-7xl mx-auto">
 
        {/* Header */}
        <div className="text-center mb-16 pt-4">
          {/* Green Blinking Events Indicator */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex justify-center mb-6"
          >
            <span className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest shadow-sm hover:shadow-md transition-all duration-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Events 
            </span>
          </motion.div>

       
        </div>

        {/* Mobile Filter Buttons - Only show on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="lg:hidden flex justify-center mb-12"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 border border-gray-200 shadow-sm">
            <div className="flex space-x-2 ">
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
                  onClick={() => setActiveFilter(filter.key)}
                  className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeFilter === filter.key
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

        {/* Events Grid Wrapper */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full  items-start">
          
          {/* Desktop Layout - Always show both columns */}
          <div className="hidden lg:block">
            {/* On Stage Events Card - Green Theme */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="hover-lift bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl shadow-green-900/5 border border-white"
            >
              {/* Column Header */}
              <div className="flex items-center mb-8 gap-4">
                <div className="h-10 w-1.5 rounded-full bg-gradient-to-b from-green-600 to-emerald-500"></div>
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">On Stage Events</h2>
              </div>

              {/* Events Grid with Number System */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {onStageEvents.map((event, idx) => {
                  const categoryConfig = getCategoryConfig(event.category);
                  const IconComponent = categoryConfig.icon;
                  
                  return (
                    <motion.div
                      key={event.id}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      className="group relative flex items-center p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-green-100 transition-all duration-300 hover:-translate-y-1"
                    >
                      {/* Large Gradient Number */}
                      <span className="
                        text-3xl font-black italic mr-4
                        bg-gradient-to-br from-green-600 to-emerald-500 bg-clip-text text-transparent
                        opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300
                        w-11 text-center flex-shrink-0
                      ">
                        {String(idx + 1).padStart(2, '0')}
                      </span>

                      <div className="flex flex-col border-l border-gray-100 pl-4 h-full justify-center flex-1">
                        <span className="text-base font-bold text-gray-700 group-hover:text-gray-900 transition-colors leading-tight">
                          {event.title}
                        </span>
                        
                        {/* Unique Category Badge */}
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${categoryConfig.bg} ${categoryConfig.border} ${categoryConfig.text} mt-2 w-fit group-hover:scale-105 transition-transform duration-300`}>
                          <IconComponent className="w-3 h-3" />
                          <span className="text-xs font-bold tracking-wide">
                            {event.category}
                          </span>
                        </div>
                      </div>

                      {/* Subtle decorative glow on hover */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none"></div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Empty State */}
              {onStageEvents.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-gray-200">
                    <Theater className="w-12 h-12 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-xl font-bold">No on-stage events scheduled yet</p>
                  <p className="text-gray-400 text-sm mt-2">Check back later for updates</p>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Desktop Layout - Off Stage Column */}
          <div className="hidden lg:block">
            {/* Off Stage Events Card - Red Theme */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="hover-lift bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl shadow-red-900/5 border border-white"
            >
              {/* Column Header */}
              <div className="flex items-center mb-8 gap-4">
                <div className="h-10 w-1.5 rounded-full bg-gradient-to-b from-red-600 to-rose-500"></div>
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Off Stage Events</h2>
              </div>

              {/* Events Grid with Number System */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {offStageEvents.map((event, idx) => {
                  const categoryConfig = getCategoryConfig(event.category);
                  const IconComponent = categoryConfig.icon;
                  
                  return (
                    <motion.div
                      key={event.id}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      className="group relative flex items-center p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-red-100 transition-all duration-300 hover:-translate-y-1"
                    >
                      {/* Large Gradient Number */}
                      <span className="
                        text-3xl font-black italic mr-4
                        bg-gradient-to-br from-red-600 to-rose-500 bg-clip-text text-transparent
                        opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300
                        w-11 text-center flex-shrink-0
                      ">
                        {String(idx + 1).padStart(2, '0')}
                      </span>

                      <div className="flex flex-col border-l border-gray-100 pl-4 h-full justify-center flex-1">
                        <span className="text-base font-bold text-gray-700 group-hover:text-gray-900 transition-colors leading-tight">
                          {event.title}
                        </span>
                        
                        {/* Unique Category Badge */}
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${categoryConfig.bg} ${categoryConfig.border} ${categoryConfig.text} mt-2 w-fit group-hover:scale-105 transition-transform duration-300`}>
                          <IconComponent className="w-3 h-3" />
                          <span className="text-xs font-bold tracking-wide">
                            {event.category}
                          </span>
                        </div>
                      </div>

                      {/* Subtle decorative glow on hover */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-600 to-rose-500 opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none"></div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Empty State */}
              {offStageEvents.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-gray-200">
                    <Palette className="w-12 h-12 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-xl font-bold">No off-stage events scheduled yet</p>
                  <p className="text-gray-400 text-sm mt-2">Check back later for updates</p>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Mobile Layout - Filtered view */}
          <div className="lg:hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFilter}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                {/* Mobile Card Container */}
                <div className={`hover-lift bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border border-white ${
                  activeFilter === "ON_STAGE" 
                    ? "shadow-green-900/5" 
                    : "shadow-red-900/5"
                }`}>
                  
                  {/* Mobile Header */}
                  <div className="flex items-center mb-8 gap-4">
                    <div className={`h-10 w-1.5 rounded-full bg-gradient-to-b ${
                      activeFilter === "ON_STAGE" 
                        ? " from-red-600 to-rose-500" 
                        : "from-green-600 to-emerald-500"
                    }`}></div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                      {activeFilter === "ON_STAGE" ? "On Stage Events" : "Off Stage Events"}
                    </h2>
                  </div>

                  {/* Events Grid with Number System */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(activeFilter === "ON_STAGE" ? onStageEvents : offStageEvents).map((event, idx) => {
                      const categoryConfig = getCategoryConfig(event.category);
                      const IconComponent = categoryConfig.icon;
                      
                      return (
                        <motion.div
                          key={event.id}
                          variants={cardVariants}
                          whileHover="hover"
                          className={`group relative flex items-center p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                            activeFilter === "ON_STAGE" 
                              ? "hover:border-green-100" 
                              : "hover:border-red-100"
                          }`}
                        >
                          {/* Large Gradient Number */}
                          <span className={`
                            text-3xl font-black italic mr-4
                            bg-clip-text text-transparent
                            opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300
                            w-11 text-center flex-shrink-0
                            ${activeFilter === "ON_STAGE" 
                              ? "bg-gradient-to-br  from-red-600 to-rose-500" 
                              : "bg-gradient-to-br from-green-600 to-emerald-500  "
                            }
                          `}>
                            {String(idx + 1).padStart(2, '0')}
                          </span>

                          <div className="flex flex-col border-l border-gray-100 pl-4 h-full justify-center flex-1">
                            <span className="text-base font-bold text-gray-700 group-hover:text-gray-900 transition-colors leading-tight">
                              {event.title}
                            </span>
                            
                            {/* Unique Category Badge */}
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${categoryConfig.bg} ${categoryConfig.border} ${categoryConfig.text} mt-2 w-fit group-hover:scale-105 transition-transform duration-300`}>
                              <IconComponent className="w-3 h-3" />
                              <span className="text-xs font-bold tracking-wide">
                                {event.category}
                              </span>
                            </div>
                          </div>

                          {/* Subtle decorative glow on hover */}
                          <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none ${
                            activeFilter === "ON_STAGE" 
                              ? "bg-gradient-to-r from-green-600 to-emerald-500" 
                              : "bg-gradient-to-r from-red-600 to-rose-500"
                          }`}></div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Empty State for Mobile */}
                  {(activeFilter === "ON_STAGE" ? onStageEvents : offStageEvents).length === 0 && (
                    <motion.div
                      variants={itemVariants}
                      className="text-center py-12"
                    >
                      <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-gray-200">
                        {activeFilter === "ON_STAGE" ? 
                          <Theater className="w-12 h-12 text-gray-400" /> : 
                          <Palette className="w-12 h-12 text-gray-400" />
                        }
                      </div>
                      <p className="text-gray-500 text-xl font-bold">
                        No {activeFilter === "ON_STAGE" ? "on-stage" : "off-stage"} events scheduled yet
                      </p>
                      <p className="text-gray-400 text-sm mt-2">Check back later for updates</p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* CTA / Info Card */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-10 text-white text-center shadow-2xl shadow-blue-900/20 relative overflow-hidden group">
          {/* Decorative circles */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full translate-x-1/2 translate-y-1/2 group-hover:scale-150 transition-transform duration-700"></div>

          <div className="relative z-10">
            <h3 className="text-3xl font-bold mb-4">Ready to Compete?</h3>
            <p className="text-blue-50 text-lg mb-8 max-w-2xl mx-auto">
              Join your favorite events and be part of the biggest cultural extravaganza of the year!
            </p>
            <a
              href="/register"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-700 rounded-xl font-bold text-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              Register Now
              <svg className="w-5 h-5 ml-2 -mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}