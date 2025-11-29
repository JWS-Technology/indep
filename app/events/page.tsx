// app/events/page.tsx
"use client";

import { useState } from "react";
import { events } from "@/data/events";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Theater, 
  Palette, 
  Calendar,
  BarChart3,
  Trophy,
  Users,
  Tag
} from "lucide-react";

type FilterType = "ON_STAGE" | "OFF_STAGE";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 pt-28">
      {/* Header */}
      

      {/* Mobile Filter Buttons - Only show on mobile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="lg:hidden flex justify-center mb-8"
      >
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 border border-gray-200 shadow-sm">
          <div className="flex space-x-2">
            {[
              { 
                key: "ON_STAGE" as FilterType, 
                label: "On Stage", 
                count: onStageEvents.length, 
                color: "red",
                icon: Theater
              },
              { 
                key: "OFF_STAGE" as FilterType, 
                label: "Off Stage", 
                count: offStageEvents.length, 
                color: "green",
                icon: Palette
              }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeFilter === filter.key
                    ? filter.key === "ON_STAGE"
                      ? "bg-red-500 text-white shadow-md"
                      : "bg-green-500 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="flex items-center space-x-2">
                  <filter.icon className="w-4 h-4" />
                  <span>{filter.label}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    activeFilter === filter.key
                      ? "bg-white/20 text-white"
                      : filter.key === "ON_STAGE"
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"
                  }`}>
                    {filter.count}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Desktop Layout - Always show both columns */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* On Stage Events Column */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            {/* Column Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-red-500 rounded-xl mb-3 shadow-md">
                <Theater className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                On Stage Events
              </h2>
              <div className="inline-flex items-center px-4 py-2 bg-red-50 border border-red-200 rounded-full">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                <span className="text-red-700 font-medium text-sm">
                  {onStageEvents.length} Spectacular Performances
                </span>
              </div>
            </motion.div>

            {/* Events List */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {onStageEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  custom={index}
                  className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-red-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden"
                >
                  {/* Background Gradient Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-red-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-1">
                          <div className="flex-shrink-0 w-3 h-3 bg-red-400 rounded-full group-hover:bg-red-500 transition-colors duration-300"></div>
                          <h3 className="font-bold text-gray-800 text-lg group-hover:text-gray-900 transition-colors duration-300">
                            {event.title}
                          </h3>
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0 ml-4">
                        <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                          {event.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Empty State */}
            {onStageEvents.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Theater className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg">No on-stage events scheduled yet</p>
                <p className="text-gray-400 text-sm mt-1">Check back later for updates</p>
              </motion.div>
            )}
          </motion.div>

          {/* Off Stage Events Column */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Column Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-500 rounded-xl mb-3 shadow-md">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Off Stage Events
              </h2>
              <div className="inline-flex items-center px-4 py-2 bg-green-50 border border-green-200 rounded-full">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <span className="text-green-700 font-medium text-sm">
                  {offStageEvents.length} Creative Competitions
                </span>
              </div>
            </motion.div>

            {/* Events List */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              {offStageEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  custom={index}
                  className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-green-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden"
                >
                  {/* Background Gradient Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-1">
                          <div className="flex-shrink-0 w-3 h-3 bg-green-400 rounded-full group-hover:bg-green-500 transition-colors duration-300"></div>
                          <h3 className="font-bold text-gray-800 text-lg group-hover:text-gray-900 transition-colors duration-300">
                            {event.title}
                          </h3>
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0 ml-4">
                        <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          {event.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Empty State */}
            {offStageEvents.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Palette className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg">No off-stage events scheduled yet</p>
                <p className="text-gray-400 text-sm mt-1">Check back later for updates</p>
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
              className="space-y-6"
            >
              {/* Show filtered events based on active filter */}
              {(activeFilter === "ON_STAGE" ? onStageEvents : offStageEvents).map((event, index) => (
                <motion.div
                  key={event.id}
                  variants={cardVariants}
                  whileHover="hover"
                  custom={index}
                  className={`group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden ${
                    event.stageType === "ON_STAGE" 
                      ? "border-red-100" 
                      : "border-green-100"
                  }`}
                >
                  {/* Background Gradient Effect */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    event.stageType === "ON_STAGE"
                      ? "bg-gradient-to-r from-red-50 to-pink-50"
                      : "bg-gradient-to-r from-green-50 to-emerald-50"
                  }`}></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-1">
                          <div className={`flex-shrink-0 w-3 h-3 rounded-full group-hover:transition-colors duration-300 ${
                            event.stageType === "ON_STAGE"
                              ? "bg-red-400 group-hover:bg-red-500"
                              : "bg-green-400 group-hover:bg-green-500"
                          }`}></div>
                          <h3 className="font-bold text-gray-800 text-lg group-hover:text-gray-900 transition-colors duration-300">
                            {event.title}
                          </h3>
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0 ml-4 flex items-center space-x-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          event.stageType === "ON_STAGE"
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}>
                          {event.category}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                          event.stageType === "ON_STAGE"
                            ? "bg-red-50 text-red-600"
                            : "bg-green-50 text-green-600"
                        }`}>
                          {event.stageType === "ON_STAGE" ? 
                            <Theater className="w-3 h-3" /> : 
                            <Palette className="w-3 h-3" />
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Empty State for Mobile */}
              {(activeFilter === "ON_STAGE" ? onStageEvents : offStageEvents).length === 0 && (
                <motion.div
                  variants={itemVariants}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    {activeFilter === "ON_STAGE" ? 
                      <Theater className="w-8 h-8 text-gray-400" /> : 
                      <Palette className="w-8 h-8 text-gray-400" />
                    }
                  </div>
                  <p className="text-gray-500 text-lg">
                    No {activeFilter === "ON_STAGE" ? "on-stage" : "off-stage"} events scheduled yet
                  </p>
                  <p className="text-gray-400 text-sm mt-1">Check back later for updates</p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Stats with Lucide Icons */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
          className="relative mt-20 pt-12"
        >
          {/* Background Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-10 left-1/4 w-20 h-20 bg-blue-200 rounded-full blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute top-5 right-1/3 w-16 h-16 bg-purple-200 rounded-full blur-lg opacity-30 animate-pulse delay-75"></div>
            <div className="absolute -bottom-5 left-1/3 w-24 h-24 bg-green-200 rounded-full blur-xl opacity-20 animate-pulse delay-150"></div>
          </div>

          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="text-center mb-12"
          >
            <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent mb-3">
              Event Statistics
            </h3>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {/* Total Events Stat */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 1.1, duration: 0.6 }}
              whileHover={{ 
                y: -8,
                scale: 1.05,
                transition: { duration: 0.3 }
              }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl transform group-hover:scale-105 transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-sm group-hover:shadow-2xl transition-all duration-300 cursor-pointer">
                <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500 rounded-full blur-xl opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
                
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg mb-4 mx-auto"
                >
                  <BarChart3 className="w-6 h-6 text-white" />
                </motion.div>
                
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.3, type: "spring", stiffness: 200 }}
                  className="text-3xl font-bold text-gray-800 mb-2"
                >
                  {events.length}
                </motion.div>
                
                <div className="text-gray-600 font-medium">Total Events</div>
                
                <div className="mt-3 w-full bg-gray-200 rounded-full h-1">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 1.4, duration: 1, ease: "easeOut" }}
                    className="bg-blue-500 h-1 rounded-full"
                  ></motion.div>
                </div>
              </div>
            </motion.div>

            {/* On Stage Events Stat */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              whileHover={{ 
                y: -8,
                scale: 1.05,
                transition: { duration: 0.3 }
              }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-pink-100 rounded-2xl transform group-hover:scale-105 transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-sm group-hover:shadow-2xl transition-all duration-300 cursor-pointer">
                <div className="absolute top-0 right-0 w-16 h-16 bg-red-500 rounded-full blur-xl opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
                
                <motion.div
                  whileHover={{ rotate: -15, scale: 1.1 }}
                  className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg mb-4 mx-auto"
                >
                  <Theater className="w-6 h-6 text-white" />
                </motion.div>
                
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.4, type: "spring", stiffness: 200 }}
                  className="text-3xl font-bold text-red-600 mb-2"
                >
                  {onStageEvents.length}
                </motion.div>
                
                <div className="text-gray-600 font-medium">On Stage</div>
                
                <div className="mt-3 w-full bg-gray-200 rounded-full h-1">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(onStageEvents.length / events.length) * 100}%` }}
                    transition={{ delay: 1.5, duration: 1, ease: "easeOut" }}
                    className="bg-red-500 h-1 rounded-full"
                  ></motion.div>
                </div>
              </div>
            </motion.div>

            {/* Off Stage Events Stat */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 1.3, duration: 0.6 }}
              whileHover={{ 
                y: -8,
                scale: 1.05,
                transition: { duration: 0.3 }
              }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl transform group-hover:scale-105 transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-sm group-hover:shadow-2xl transition-all duration-300 cursor-pointer">
                <div className="absolute top-0 right-0 w-16 h-16 bg-green-500 rounded-full blur-xl opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
                
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg mb-4 mx-auto"
                >
                  <Palette className="w-6 h-6 text-white" />
                </motion.div>
                
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
                  className="text-3xl font-bold text-green-600 mb-2"
                >
                  {offStageEvents.length}
                </motion.div>
                
                <div className="text-gray-600 font-medium">Off Stage</div>
                
                <div className="mt-3 w-full bg-gray-200 rounded-full h-1">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(offStageEvents.length / events.length) * 100}%` }}
                    transition={{ delay: 1.6, duration: 1, ease: "easeOut" }}
                    className="bg-green-500 h-1 rounded-full"
                  ></motion.div>
                </div>
              </div>
            </motion.div>

            {/* Categories Stat */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 1.4, duration: 0.6 }}
              whileHover={{ 
                y: -8,
                scale: 1.05,
                transition: { duration: 0.3 }
              }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-indigo-100 rounded-2xl transform group-hover:scale-105 transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-sm group-hover:shadow-2xl transition-all duration-300 cursor-pointer">
                <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500 rounded-full blur-xl opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
                
                <motion.div
                  whileHover={{ rotate: -15, scale: 1.1 }}
                  className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg mb-4 mx-auto"
                >
                  <Tag className="w-6 h-6 text-white" />
                </motion.div>
                
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.6, type: "spring", stiffness: 200 }}
                  className="text-3xl font-bold text-purple-600 mb-2"
                >
                  {new Set(events.map(e => e.category)).size}
                </motion.div>
                
                <div className="text-gray-600 font-medium">Categories</div>
                
                <div className="mt-3 w-full bg-gray-200 rounded-full h-1">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "85%" }}
                    transition={{ delay: 1.7, duration: 1, ease: "easeOut" }}
                    className="bg-purple-500 h-1 rounded-full"
                  ></motion.div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Decoration */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 1.8, duration: 1, ease: "easeOut" }}
            className="flex justify-center items-center mt-12 pt-8 border-t border-gray-200"
          >
            <div className="text-center">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 0.6 }}
                className="text-gray-500 text-sm"
              >
                Join us for an unforgettable experience at{" "}
                <span className="font-semibold text-gray-700">INDEP 2025</span>
              </motion.p>
              
              {/* Animated dots */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.2, duration: 0.6 }}
                className="flex justify-center space-x-1 mt-3"
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                    className="w-2 h-2 bg-blue-500 rounded-full"
                  />
                ))}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}