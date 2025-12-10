
"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import FileUploader from "@/components/TeamsDashboard/FileUploader";
import axios from "axios";

export default function Page() {
  // State for user data
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState("");
  const [teamId, setteamId] = useState("");
  const [teamName, setteamName] = useState("");

  // State for event data
  const [eventId, setEventId] = useState<string | null>(null);
  const [eventName, seteventName] = useState("");
  const [isRegistrationOpen, setisRegistrationOpen] = useState(false);
  const [offStageOrOnStage, setoffStageOrOnStage] = useState("");

  // State for registration data
  const [registeredDataId, setregisteredDataId] = useState("");
  const [previoslyCreated, setprevioslyCreated] = useState(false);
  const [songTitle, setsongTitle] = useState("");
  const [tune, settune] = useState("");
  const [contestantName, setcontestantName] = useState("");
  const [secondContestant, setsecondContestant] = useState("");
  const [secondDno, setsecondDno] = useState("");
  const [dNo, setdNo] = useState("");
  const [lotNo, setlotNo] = useState("");

  // State for form submission
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const params = useParams();

  // ----------------------------------------------------------
  // 1. FIRST: Get event ID from params
  // ----------------------------------------------------------
  useEffect(() => {
    try {
      const incoming = (params as any)?.id;
      const resolved = Array.isArray(incoming) ? incoming[0] : incoming ?? null;
      console.log("Event ID from params:", resolved);
      setEventId(resolved);
    } catch (error) {
      console.error("Error getting event ID from params:", error);
      setEventId(null);
    }
  }, [params]);

  // ----------------------------------------------------------
  // 2. Get user data (team info) - runs once on mount
  // ----------------------------------------------------------
  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log("Fetching user data...");
        setUserLoading(true);
        const res = await fetch("/api/me", {
          method: "GET",
          cache: "no-cache"
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || `HTTP ${res.status}: Failed to load user data`);
        }

        const data = await res.json();
        console.log("User data received:", data);

        const teamName = data.team?.teamName || "";
        const teamId = data.team?.teamId || "";

        setteamName(teamName);
        setteamId(teamId);
        setUserError("");
      } catch (err: any) {
        console.error("Error fetching user data:", err);
        setUserError(err.message || "Failed to load user data");
      } finally {
        setUserLoading(false);
      }
    };

    fetchUser();
  }, []);

  // ----------------------------------------------------------
  // 3. Get event details - runs when eventId is available
  // ----------------------------------------------------------
  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) {
        console.log("No eventId available, skipping event fetch");
        return;
      }

      try {
        console.log(`Fetching event details for ID: ${eventId}`);
        const res = await fetch(`/api/events/${eventId}`, {
          method: "GET",
          cache: "no-cache"
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || `HTTP ${res.status}: Failed to load event data`);
        }

        const data = await res.json();
        console.log("Event data received:", data.event);

        const event = data.event || {};
        setisRegistrationOpen(event.openRegistration || false);
        setoffStageOrOnStage(event.stageType || "");
        seteventName(event.title || "");
        setUserError("");
      } catch (err: any) {
        console.error("Error fetching event data:", err);
        setUserError(err.message || "Failed to load event details");
      }
    };

    fetchEvent();
  }, [eventId]);

  // ----------------------------------------------------------
  // 4. Get registered data - runs when teamId, eventName, and stageType are available
  // ----------------------------------------------------------
  useEffect(() => {
    const fetchregisteredData = async () => {
      if (!teamId || !eventName || !offStageOrOnStage) {
        console.log("Missing required data for registration fetch:", { teamId, eventName, offStageOrOnStage });
        return;
      }

      try {
        console.log("Fetching registered data for:", { teamId, eventName, offStageOrOnStage });
        setLoading(true);
        setprevioslyCreated(false);

        const payload = {
          eventName,
          teamId,
          offStageOrOnStage
        };

        const res = await fetch("/api/event-registration/get-registered-data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          cache: "no-cache"
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || `HTTP ${res.status}: Failed to load registered data`);
        }

        const data = await res.json();
        console.log("Registered data received:", data);

        if (!data.registeredData) {
          console.log("No previous registration found");
          setregisteredDataId("");
          setsongTitle("");
          settune("");
          setcontestantName("");
          setdNo("");
          setsecondContestant("");
          setsecondDno("");
          setprevioslyCreated(false);
          return;
        }

        // Registration exists
        console.log("Previous registration found:", data.registeredData);
        setsecondContestant(data.registeredData.secondContestantName || "");
        setsecondDno(data.registeredData.secondDno || "");
        setcontestantName(data.registeredData.contestantName || "");
        setdNo(data.registeredData.dNo || "");
        setprevioslyCreated(true);
        setregisteredDataId(String(data.registeredData._id) || "");
        setsongTitle(data.registeredData.songTitle || "");
        settune(data.registeredData.tune || "");
        setUserError("");
      } catch (err: any) {
        console.error("Error fetching registered data:", err);
        setUserError(err.message || "Failed to load registration data");
      } finally {
        setLoading(false);
      }
    };

    // Add a small delay to ensure all data is loaded
    const timer = setTimeout(() => {
      fetchregisteredData();
    }, 100);

    return () => clearTimeout(timer);
  }, [teamId, eventName, offStageOrOnStage]);

  // ----------------------------------------------------------
  // 5. Get lot number - runs when teamId and eventName are available
  // ----------------------------------------------------------
  useEffect(() => {
    const getLotNumber = async () => {
      if (!teamId || !eventName) {
        console.log("Missing teamId or eventName for lot number fetch");
        return;
      }

      try {
        console.log("Fetching lot number for:", { teamId, eventName });
        const res = await axios.post("/api/get-lot", {
          eventName,
          teamId
        }, {
          headers: { "Content-Type": "application/json" }
        });

        console.log("Lot number received:", res.data);
        setlotNo(res.data.lot?.lot_number || "");
      } catch (error: any) {
        console.error("Error fetching lot number:", error);
        // Don't set error state for lot number as it's optional
      }
    };

    getLotNumber();
  }, [teamId, eventName]);

  // ----------------------------------------------------------
  // Handle form submission
  // ----------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!eventId || !eventName || !teamId || !teamName) {
      setError("Missing required information. Please refresh the page.");
      return;
    }

    // For OFF_STAGE events, validate contestant fields
    if (offStageOrOnStage === "OFF_STAGE") {
      if (!contestantName.trim() || !dNo.trim()) {
        setError("Please fill in contestant name and D.No");
        return;
      }

      // If this is Quiz - Prelims, validate second contestant
      if (eventName === "Quiz - Prelims" && (!secondContestant.trim() || !secondDno.trim())) {
        setError("Please fill in both contestant details for Quiz Prelims");
        return;
      }
    }

    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const payload: any = {
        eventId: eventId,
        eventName: eventName,
        teamName: teamName,
        teamId: teamId,
        songTitle: songTitle,
        tune: tune,
        contestantName: contestantName,
        dNo: dNo,
        secondContestant: secondContestant,
        secondDno: secondDno,
      };

      console.log("Submitting payload:", payload);

      let method = "POST";
      const url =
        offStageOrOnStage === "ON_STAGE"
          ? "/api/event-registration"
          : "/api/offStage-registration";

      // If previously created, switch to PATCH
      if (previoslyCreated && registeredDataId) {
        method = "PATCH";
        payload.registeredDataId = registeredDataId;
      }

      console.log(`Making ${method} request to ${url}`);

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      console.log("Response received:", result);

      if (!res.ok) {
        throw new Error(
          result?.error || result?.message || "Registration failed"
        );
      }

      if (method === "POST") {
        setSuccess("Registration successful!");
      } else {
        setSuccess("Registration updated successfully!");
      }

      // Refresh registration data after successful submission
      if (method === "PATCH") {
        // Force a re-fetch of registered data
        const refreshPayload = { eventName, teamId, offStageOrOnStage };
        const refreshRes = await fetch("/api/event-registration/get-registered-data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(refreshPayload),
        });

        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
          if (refreshData.registeredData) {
            setregisteredDataId(String(refreshData.registeredData._id));
          }
        }
      }

      // Redirect after a delay
      setTimeout(() => {
        window.location.href = "/team/dashboard";
      }, 2000);

    } catch (err: any) {
      console.error("Submission error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------------
  // Loading state component
  // ----------------------------------------------------------
  if (userLoading) {
    return (
      <div className="p-4 md:p-8 flex items-center justify-center bg-gray-100 min-h-screen">
        <div className="w-full max-w-2xl">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 mb-8 shadow-xl animate-pulse">
            <div className="h-8 bg-white/20 rounded w-1/2 mb-4"></div>
            <div className="flex gap-4">
              <div className="h-6 bg-white/20 rounded w-32"></div>
              <div className="h-6 bg-white/20 rounded w-40"></div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="space-y-6">
              {[...Array(4)].map((_, i) => (
                <div key={i}>
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
                  <div className="h-12 bg-gray-100 rounded-xl"></div>
                </div>
              ))}
              <div className="h-14 bg-gray-200 rounded-xl mt-8"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------
  // Error state component
  // ----------------------------------------------------------
  if (userError) {
    return (
      <div className="p-4 md:p-8 flex items-center justify-center bg-gray-100 min-h-screen">
        <div className="w-full max-w-2xl">
          <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl p-6 mb-8 shadow-xl">
            <h1 className="text-3xl font-bold text-white mb-2">Error Loading Data</h1>
            <p className="text-white/80">There was a problem loading the registration page</p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-red-800 font-semibold text-lg">Error Details</h3>
                  <p className="text-red-600 mt-1">{userError}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition"
              >
                Refresh Page
              </button>
              <Link href="/team/dashboard">
                <button className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition">
                  Return to Dashboard
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------
  // Main render
  // ----------------------------------------------------------
  return (
    <div className="p-4 md:p-8 flex items-center justify-center bg-gray-100 min-h-screen">
      <div className="w-full max-w-2xl">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 mb-8 shadow-xl">
          <h1 className="text-3xl font-bold text-white mb-2">
            Event Registration
          </h1>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="bg-white/20 px-4 py-2 rounded-full">
              <span className="text-white font-semibold">
                {eventName || "Loading event..."}
              </span>
            </div>
            <div className={`px-4 py-2 rounded-full ${isRegistrationOpen ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
              <span className={`font-semibold ${isRegistrationOpen ? 'text-green-100' : 'text-red-100'}`}>
                {isRegistrationOpen ? "Registration Open" : "Registration Closed"}
              </span>
            </div>
            {previoslyCreated && (
              <div className="bg-yellow-500/20 px-4 py-2 rounded-full">
                <span className="text-yellow-100 font-semibold">
                  Previously Registered
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <div className="p-2 bg-gradient-to-r from-indigo-50 to-purple-50"></div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            {/* Success/Error Messages */}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl animate-fadeIn">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-green-800 font-semibold">{success}</h3>
                    <p className="text-green-600 text-sm mt-1">Redirecting to dashboard...</p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl animate-fadeIn">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-red-800 font-semibold">Registration Error</h3>
                    <p className="text-red-600 text-sm mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Grid Layout for Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Event Name */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Event Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="eventName"
                    value={eventName || "Loading..."}
                    required
                    readOnly
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 cursor-not-allowed"
                    placeholder="Event name"
                  />
                </div>
              </div>

              {/* Team Name */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Team Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="teamName"
                    value={teamName || "Loading..."}
                    required
                    readOnly
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 cursor-not-allowed"
                    placeholder="Team name"
                  />
                </div>
              </div>

              {/* Song Title (ON_STAGE only) */}
              {offStageOrOnStage === "ON_STAGE" && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Song Title
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path>
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="songTitle"
                      value={songTitle}
                      onChange={(e) => setsongTitle(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                      placeholder="Enter song title"
                      disabled={!isRegistrationOpen}
                    />
                  </div>
                </div>
              )}

              {/* Tune (ON_STAGE only) */}
              {offStageOrOnStage === "ON_STAGE" && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Tune
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="tune"
                      value={tune}
                      onChange={(e) => settune(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                      placeholder="Enter tune"
                      disabled={!isRegistrationOpen}
                    />
                  </div>
                </div>
              )}

              {/* Contestant Name (OFF_STAGE only) */}
              {offStageOrOnStage === "OFF_STAGE" && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    {eventName === "Quiz - Prelims"
                      ? "First Contestant Name"
                      : "Contestant Name"}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="contestantName"
                      value={contestantName}
                      onChange={(e) => {
                        const cleaned = e.target.value.replace(/[^A-Za-z ]/g, "");
                        setcontestantName(cleaned.toUpperCase());
                      }}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition disabled:bg-gray-100"
                      placeholder="Enter name"
                      required={offStageOrOnStage === "OFF_STAGE"}
                      disabled={!isRegistrationOpen}
                    />
                  </div>
                  <p className="text-xs text-gray-500">Format: ADAM BEN A</p>
                </div>
              )}

              {/* D.No (OFF_STAGE only) */}
              {offStageOrOnStage === "OFF_STAGE" && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    {eventName === "Quiz - Prelims"
                      ? "First Contestant D.No"
                      : "Contestant D.No"}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path>
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="dNo"
                      maxLength={8}
                      value={dNo}
                      onChange={(e) => setdNo(e.target.value.toUpperCase())}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition disabled:bg-gray-100"
                      placeholder="Enter D.No"
                      required={offStageOrOnStage === "OFF_STAGE"}
                      disabled={!isRegistrationOpen}
                    />
                  </div>
                </div>
              )}

              {/* Second Contestant (Quiz - Prelims only) */}
              {eventName === "Quiz - Prelims" && offStageOrOnStage === "OFF_STAGE" && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Second Contestant Name
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="secondContestant"
                      value={secondContestant}
                      onChange={(e) => {
                        const cleaned = e.target.value.replace(/[^A-Za-z ]/g, "");
                        setsecondContestant(cleaned.toUpperCase());
                      }}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition disabled:bg-gray-100"
                      placeholder="Enter name"
                      required={eventName === "Quiz - Prelims"}
                      disabled={!isRegistrationOpen}
                    />
                  </div>
                  <p className="text-xs text-gray-500">Format: ADAM BEN A</p>
                </div>
              )}

              {/* Second D.No (Quiz - Prelims only) */}
              {eventName === "Quiz - Prelims" && offStageOrOnStage === "OFF_STAGE" && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Second Contestant D.No
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path>
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="secondDno"
                      maxLength={8}
                      value={secondDno}
                      onChange={(e) => setsecondDno(e.target.value.toUpperCase())}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition disabled:bg-gray-100"
                      placeholder="Enter D.No"
                      required={eventName === "Quiz - Prelims"}
                      disabled={!isRegistrationOpen}
                    />
                  </div>
                </div>
              )}

              {/* Lot Number */}
              <div className="mb-6">
  <label className="block font-medium text-gray-700 mb-2">
    Lot Number
  </label>

  <div className="
    flex
    items-center
    justify-between
    bg-indigo-50
    border
    border-indigo-200
    rounded-xl
    p-3
    shadow-sm
  ">
    <span className="text-indigo-700 font-semibold text-lg text-center w-full">
      {loading ? "Loading..." : lotNo}
    </span>
  </div>
</div>

            </div>

            {/* Submit Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={!isRegistrationOpen || loading}
                className={`
                  w-full py-4 px-6 rounded-xl font-bold text-white
                  transition-all duration-300 transform hover:scale-[1.02]
                  focus:outline-none focus:ring-4 focus:ring-opacity-50
                  ${!isRegistrationOpen
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:ring-indigo-500'
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                `}
              >
                <div className="flex items-center justify-center">
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      {previoslyCreated ? (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                          </svg>
                          Update Registration
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          Complete Registration
                        </>
                      )}
                    </>
                  )}
                </div>
              </button>

              {!isRegistrationOpen && (
                <p className="mt-4 text-center text-red-600 font-medium">
                  <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Registration is currently closed. Please check back later.
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 