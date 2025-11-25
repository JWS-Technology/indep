// app/events/page.tsx
"use client";

import { useState } from "react";
import { events } from "@/data/events";
import { motion, AnimatePresence } from "framer-motion";

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<"ALL" | "ON_STAGE" | "OFF_STAGE">("ALL");

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
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-4 px-4">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">INDEP Events</h1>
        <p className="text-gray-600">St. Joseph's College 2025</p>
      </motion.div>

      {/* Mobile Filter Tabs - Only show on mobile */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="lg:hidden flex border-b border-gray-200 mb-6"
      >
        <button
          onClick={() => setActiveTab("ALL")}
          className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-all duration-300 ${
            activeTab === "ALL" 
              ? "border-blue-500 text-blue-600 bg-blue-50" 
              : "border-transparent text-gray-500 hover:bg-gray-50"
          }`}
        >
          All ({events.length})
        </button>
        <button
          onClick={() => setActiveTab("ON_STAGE")}
          className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-all duration-300 ${
            activeTab === "ON_STAGE" 
              ? "border-red-500 text-red-600 bg-red-50" 
              : "border-transparent text-gray-500 hover:bg-gray-50"
          }`}
        >
          On Stage ({onStageEvents.length})
        </button>
        <button
          onClick={() => setActiveTab("OFF_STAGE")}
          className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-all duration-300 ${
            activeTab === "OFF_STAGE" 
              ? "border-green-500 text-green-600 bg-green-50" 
              : "border-transparent text-gray-500 hover:bg-gray-50"
          }`}
        >
          Off Stage ({offStageEvents.length})
        </button>
      </motion.div>

      {/* Desktop Layout - Two Columns */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* On Stage Events Column */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-red-600 mb-2 flex items-center justify-center">
                <span className="w-3 h-3 bg-red-500 rounded-full mr-3"></span>
                🎭 On Stage Events
                <span className="ml-3 text-sm bg-red-100 text-red-700 px-3 py-1 rounded-full">
                  {onStageEvents.length} events
                </span>
              </h2>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-3"
            >
              {onStageEvents.map((event) => (
                <motion.div
                  key={event.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, x: 10 }}
                  className="bg-white rounded-lg p-4 border border-red-200 shadow-sm cursor-pointer hover:shadow-md transition-all duration-300"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {event.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {event.category}
                        </p>
                      </div>
                    </div>
                    <span className="text-red-600 text-lg">🎭</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Off Stage Events Column */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-green-600 mb-2 flex items-center justify-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                🎨 Off Stage Events
                <span className="ml-3 text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
                  {offStageEvents.length} events
                </span>
              </h2>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
              className="space-y-3"
            >
              {offStageEvents.map((event) => (
                <motion.div
                  key={event.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, x: 10 }}
                  className="bg-white rounded-lg p-4 border border-green-200 shadow-sm cursor-pointer hover:shadow-md transition-all duration-300"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {event.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {event.category}
                        </p>
                      </div>
                    </div>
                    <span className="text-green-600 text-lg">🎨</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Mobile Layout - Filtered List */}
      <div className="lg:hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-2"
          >
            {(activeTab === "ALL" ? events : activeTab === "ON_STAGE" ? onStageEvents : offStageEvents).map((event, index) => (
              <motion.div
                key={event.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02, x: 10 }}
                whileTap={{ scale: 0.98 }}
                className={`bg-white rounded-lg p-4 border shadow-sm cursor-pointer hover:shadow-md transition-all duration-300 ${
                  event.stageType === "ON_STAGE" ? "border-red-200" : "border-green-200"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      event.stageType === "ON_STAGE" ? "bg-red-500" : "bg-green-500"
                    }`}></div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {event.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {event.category}
                      </p>
                    </div>
                  </div>
                  <span className={`text-lg ${
                    event.stageType === "ON_STAGE" ? "text-red-600" : "text-green-600"
                  }`}>
                    {event.stageType === "ON_STAGE" ? "🎭" : "🎨"}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State for Mobile */}
        {(activeTab === "ALL" ? events : activeTab === "ON_STAGE" ? onStageEvents : offStageEvents).length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-500">No events found</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}