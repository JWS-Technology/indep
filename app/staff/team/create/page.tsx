"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Import your department data and events data
import { shiftOne, shiftTwo } from "@/data/teams";
import { events } from "@/data/events";

interface TeamFormData {
  event: string;
  department: string;
  lotNumber: string;
  name: string;
  dNumber: string;
  shift?: "SHIFT_ONE" | "SHIFT_TWO";
}

export default function CreateTeam() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedShift, setSelectedShift] = useState<"SHIFT_ONE" | "SHIFT_TWO" | "">("");
  const [formData, setFormData] = useState<TeamFormData>({
    event: "",
    department: "",
    lotNumber: "",
    name: "",
    dNumber: "",
    shift: undefined,
  });

  // Get unique events from the events data
  const availableEvents = Array.from(new Set(events.map(event => event.title))).sort();

  // Filter departments based on selected shift
  const getDepartmentsByShift = () => {
    if (selectedShift === "SHIFT_ONE") {
      return shiftOne;
    } else if (selectedShift === "SHIFT_TWO") {
      return shiftTwo;
    }
    return [];
  };

  const handleShiftChange = (shift: "SHIFT_ONE" | "SHIFT_TWO") => {
    setSelectedShift(shift);
    setFormData(prev => ({
      ...prev,
      shift: shift
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNextStep = () => {
    if (currentStep === 1 && selectedShift) {
      setCurrentStep(2);
    } else if (currentStep === 2 && formData.event && formData.department && formData.name && formData.dNumber) {
      setCurrentStep(3);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically make an API call to create the team
      console.log("Team created:", formData);
      
      // Redirect to dashboard or show success message
      router.push("/staff/dashboard");
    } catch (error) {
      console.error("Error creating team:", error);
    } finally {
      setLoading(false);
    }
  };

  const currentDepartments = getDepartmentsByShift();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        

        {/* Progress Steps - Mobile Optimized */}
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
          <div className="flex items-center justify-between">
            {/* Step 1 */}
            <div className="flex flex-col items-center flex-1">
              <div className={`w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white text-sm md:text-base font-semibold mb-2 ${
                currentStep >= 1 ? 'bg-blue-600' : 'bg-gray-300'
              }`}>
                1
              </div>
              <span className={`text-xs md:text-sm font-medium text-center ${
                currentStep >= 1 ? 'text-blue-600' : 'text-gray-500'
              }`}>
                Shift
              </span>
            </div>

            {/* Connector */}
            <div className={`flex-1 h-1 mx-1 md:mx-4 ${
              currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'
            }`}></div>

            {/* Step 2 */}
            <div className="flex flex-col items-center flex-1">
              <div className={`w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white text-sm md:text-base font-semibold mb-2 ${
                currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'
              }`}>
                2
              </div>
              <span className={`text-xs md:text-sm font-medium text-center ${
                currentStep >= 2 ? 'text-blue-600' : 'text-gray-500'
              }`}>
                Details
              </span>
            </div>

            {/* Connector */}
            <div className={`flex-1 h-1 mx-1 md:mx-4 ${
              currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-300'
            }`}></div>

            {/* Step 3 */}
            <div className="flex flex-col items-center flex-1">
              <div className={`w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white text-sm md:text-base font-semibold mb-2 ${
                currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-300'
              }`}>
                3
              </div>
              <span className={`text-xs md:text-sm font-medium text-center ${
                currentStep >= 3 ? 'text-blue-600' : 'text-gray-500'
              }`}>
                Review
              </span>
            </div>
          </div>
        </div>

        {/* Step 1: Shift Selection */}
        {currentStep === 1 && (
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-8">
            <div className="text-center mb-6 md:mb-8">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
                <span className="text-xl md:text-2xl text-blue-600">🎓</span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Select Your Shift</h2>
              <p className="text-gray-600 text-sm md:text-base">Choose the shift your department belongs to</p>
            </div>

            <div className="space-y-4 md:space-y-6 max-w-2xl mx-auto">
              <button
                type="button"
                onClick={() => handleShiftChange("SHIFT_ONE")}
                className={`w-full p-4 md:p-6 border-2 rounded-xl text-left transition-all duration-300 ${
                  selectedShift === "SHIFT_ONE"
                    ? "border-blue-500 bg-blue-50 shadow-lg"
                    : "border-gray-300 hover:border-blue-300 hover:bg-blue-50"
                }`}
              >
                <div className="flex items-start">
                  <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 mr-3 md:mr-4 mt-0.5 ${
                    selectedShift === "SHIFT_ONE" 
                      ? "border-blue-500 bg-blue-500" 
                      : "border-gray-400"
                  }`}></div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-base md:text-lg mb-1 md:mb-2">Shift One</h3>
                    <p className="text-gray-600 text-xs md:text-sm mb-2 md:mb-3">
                      Traditional departments with established programs
                    </p>
                    <div className="text-blue-600 font-semibold text-sm md:text-base">
                      {shiftOne.length} departments available
                    </div>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleShiftChange("SHIFT_TWO")}
                className={`w-full p-4 md:p-6 border-2 rounded-xl text-left transition-all duration-300 ${
                  selectedShift === "SHIFT_TWO"
                    ? "border-green-500 bg-green-50 shadow-lg"
                    : "border-gray-300 hover:border-green-300 hover:bg-green-50"
                }`}
              >
                <div className="flex items-start">
                  <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 mr-3 md:mr-4 mt-0.5 ${
                    selectedShift === "SHIFT_TWO" 
                      ? "border-green-500 bg-green-500" 
                      : "border-gray-400"
                  }`}></div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-base md:text-lg mb-1 md:mb-2">Shift Two</h3>
                    <p className="text-gray-600 text-xs md:text-sm mb-2 md:mb-3">
                      Modern departments with specialized programs
                    </p>
                    <div className="text-green-600 font-semibold text-sm md:text-base">
                      {shiftTwo.length} departments available
                    </div>
                  </div>
                </div>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center mt-6 md:mt-8">
              <button
                onClick={handleNextStep}
                disabled={!selectedShift}
                className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold text-sm md:text-base"
              >
                Continue to Team Details →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Team Details */}
        {currentStep === 2 && (
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-8">
            <div className="text-center mb-6 md:mb-8">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
                <span className="text-xl md:text-2xl text-green-600">👥</span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Team Details</h2>
              <p className="text-gray-600 text-sm md:text-base">Fill in your team information</p>
            </div>

            <form className="space-y-4 md:space-y-6 max-w-2xl mx-auto">
              <div className="space-y-4 md:space-y-6">
                {/* Event Selection */}
                <div>
                  <label htmlFor="event" className="block text-sm font-medium text-gray-700 mb-2">
                    Event *
                  </label>
                  <select
                    id="event"
                    name="event"
                    value={formData.event}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm md:text-base"
                  >
                    <option value="">Select an event</option>
                    {availableEvents.map(event => (
                      <option key={event} value={event}>{event}</option>
                    ))}
                  </select>
                </div>

                {/* Department Selection */}
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                    Department *
                  </label>
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm md:text-base"
                  >
                    <option value="">Select department</option>
                    {currentDepartments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                {/* Team Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Team Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your team name"
                    className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm md:text-base"
                  />
                </div>

                {/* D.Number */}
                <div>
                  <label htmlFor="dNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    D.Number *
                  </label>
                  <input
                    type="text"
                    id="dNumber"
                    name="dNumber"
                    value={formData.dNumber}
                    onChange={handleChange}
                    required
                    placeholder="23UBC512"
                    className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm md:text-base font-mono"
                  />
                  <p className="mt-1 text-xs md:text-sm text-gray-500">
                    Enter your college D.Number (e.g., 23UBC512)
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 md:pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="flex-1 px-4 py-2 md:px-6 md:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm md:text-base order-2 sm:order-1"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={!formData.event || !formData.department || !formData.name || !formData.dNumber}
                  className="flex-1 px-4 py-2 md:px-6 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold text-sm md:text-base order-1 sm:order-2"
                >
                  Continue to Review →
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 3: Finalize */}
        {currentStep === 3 && (
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-8">
            <div className="text-center mb-6 md:mb-8">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
                <span className="text-xl md:text-2xl text-purple-600">✅</span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Review & Create</h2>
              <p className="text-gray-600 text-sm md:text-base">Review your team information before submission</p>
            </div>

            {/* Review Card */}
            <div className="bg-gray-50 rounded-xl p-4 md:p-6 mb-6 md:mb-8 max-w-2xl mx-auto">
              <div className="grid grid-cols-1 gap-3 md:gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-gray-200">
                  <span className="font-semibold text-gray-700 text-sm md:text-base">Shift:</span>
                  <span className="text-gray-900 text-sm md:text-base mt-1 sm:mt-0">
                    {selectedShift === "SHIFT_ONE" ? "Shift One" : "Shift Two"}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-gray-200">
                  <span className="font-semibold text-gray-700 text-sm md:text-base">Event:</span>
                  <span className="text-gray-900 text-sm md:text-base mt-1 sm:mt-0">{formData.event}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-gray-200">
                  <span className="font-semibold text-gray-700 text-sm md:text-base">Department:</span>
                  <span className="text-gray-900 text-sm md:text-base mt-1 sm:mt-0">{formData.department}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-gray-200">
                  <span className="font-semibold text-gray-700 text-sm md:text-base">Team Name:</span>
                  <span className="text-gray-900 text-sm md:text-base mt-1 sm:mt-0">{formData.name}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-gray-200">
                  <span className="font-semibold text-gray-700 text-sm md:text-base">D.Number:</span>
                  <span className="text-gray-900 font-mono text-sm md:text-base mt-1 sm:mt-0">{formData.dNumber}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2">
                  <span className="font-semibold text-gray-700 text-sm md:text-base">Lot Number:</span>
                  <span className="text-blue-600 font-semibold text-sm md:text-base mt-1 sm:mt-0">Auto-generated</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
              <button
                type="button"
                onClick={handlePrevStep}
                className="flex-1 px-4 py-2 md:px-6 md:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm md:text-base order-2 sm:order-1"
              >
                ← Back
              </button>
              <div className="flex flex-col sm:flex-row gap-3 order-1 sm:order-2">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 px-4 py-2 md:px-6 md:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm md:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 px-4 py-2 md:px-8 md:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors font-semibold text-sm md:text-base"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating...
                    </div>
                  ) : (
                    "Create Team 🎯"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}