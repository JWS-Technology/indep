"use client";

import { useState } from "react";
import { 
  BookOpen, 
  Calendar, 
  Users, 
  Award, 
  AlertTriangle, 
  Mic, 
  Palette,
  Music,
  Camera,
  Film,
  Trophy,
  Clock,
  FileText,
  Hash,
  Download,
  ChevronDown,
  ChevronUp,
  Megaphone,
  DollarSign,
  UserCheck,
  Ban,
  Volume2,
  Type,
  Scissors,
  Image as ImageIcon,
  Puzzle,
  GraduationCap,
  Sparkles,
  XCircle
} from "lucide-react";

export default function RulesPage() {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    general: true,
    points: true,
    important: true,
    art: false,
    speech: false,
    dance: false,
    music: false,
    other: false,
    notes: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const downloadPDF = () => {
    // This would typically link to a PDF file
    window.open('/indep-2025-rules.pdf', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl mb-6 shadow-lg">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            St. Joseph's College (Autonomous)
          </h1>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent mb-2">
            INDEP 2025
          </h2>
          <p className="text-slate-600 text-lg">
            Rules & Regulations Handbook
          </p>
          <div className="mt-6 flex justify-center space-x-4">
            <button
              onClick={downloadPDF}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-200 flex items-center space-x-2 shadow-sm"
            >
              <Download className="w-5 h-5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        {/* Introduction */}
        <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Megaphone className="w-6 h-6 text-red-600" />
            <h3 className="text-xl font-semibold text-slate-900">
              Greetings from the Fine Arts Association!
            </h3>
          </div>
          <p className="text-slate-700 leading-relaxed">
            We take pleasure in presenting you with the Rules and Regulations for INDEP 2025. 
            We request the Heads of the Departments, the Team in-charges, and the secretaries 
            to take initiative in selecting the 'Cream' to represent their departments.
          </p>
        </div>

        {/* General Guidelines Section */}
        <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 shadow-sm mb-6 overflow-hidden">
          <button
            onClick={() => toggleSection('general')}
            className="w-full px-8 py-6 flex items-center justify-between hover:bg-slate-50 transition-colors duration-200"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-slate-900">Registration & Participation</h3>
                <p className="text-slate-600 text-sm">General guidelines and participation rules</p>
              </div>
            </div>
            {expandedSections.general ? (
              <ChevronUp className="w-6 h-6 text-slate-400" />
            ) : (
              <ChevronDown className="w-6 h-6 text-slate-400" />
            )}
          </button>

          {expandedSections.general && (
            <div className="px-8 pb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-slate-900">Registration Deadlines</h4>
                      <ul className="mt-2 space-y-2 text-slate-700">
                        <li className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span>Offline events: <span className="font-medium">07-12-2025, 5:00 PM</span></span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span>On-stage events: <span className="font-medium">10-12-2025, 5:00 PM</span></span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <UserCheck className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-slate-900">Team & Participation Rules</h4>
                      <ul className="mt-2 space-y-2 text-slate-700">
                        <li className="flex items-start space-x-2">
                          <Hash className="w-4 h-4 text-slate-400 mt-1" />
                          <span>One team per department for group events</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <Hash className="w-4 h-4 text-slate-400 mt-1" />
                          <span>Maximum 4 events per student</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <Hash className="w-4 h-4 text-slate-400 mt-1" />
                          <span>No-shows after lot drawing: <span className="text-red-600 font-medium">-2 Points</span></span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-slate-900">Important Notes</h4>
                      <ul className="mt-2 space-y-2 text-slate-700">
                        <li className="flex items-start space-x-2">
                          <Ban className="w-4 h-4 text-slate-400 mt-1" />
                          <span>ID cards mandatory for all participants</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <Ban className="w-4 h-4 text-slate-400 mt-1" />
                          <span>No outside choreographers or makeup artists</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <Ban className="w-4 h-4 text-slate-400 mt-1" />
                          <span>Accompanists must be college students only</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <DollarSign className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-slate-900">Financial Support</h4>
                      <p className="mt-2 text-slate-700">
                        Each department will be provided with <span className="font-bold text-green-700">₹1500</span> for event-related expenses including arrangements and refreshments.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Points System */}
        <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 shadow-sm mb-6 overflow-hidden">
          <button
            onClick={() => toggleSection('points')}
            className="w-full px-8 py-6 flex items-center justify-between hover:bg-slate-50 transition-colors duration-200"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-slate-900">Points System</h3>
                <p className="text-slate-600 text-sm">Scoring criteria and ranking</p>
              </div>
            </div>
            {expandedSections.points ? (
              <ChevronUp className="w-6 h-6 text-slate-400" />
            ) : (
              <ChevronDown className="w-6 h-6 text-slate-400" />
            )}
          </button>

          {expandedSections.points && (
            <div className="px-8 pb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-amber-900 mb-2">1st Place</h4>
                  <p className="text-5xl font-bold text-amber-700">5 Pts</p>
                </div>

                <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-slate-500 to-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-slate-900 mb-2">2nd Place</h4>
                  <p className="text-5xl font-bold text-slate-700">3 Pts</p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-orange-900 mb-2">3rd Place</h4>
                  <p className="text-5xl font-bold text-orange-700">1 Pt</p>
                </div>
              </div>
              <div className="mt-6 text-center">
                <p className="text-slate-700 italic">
                  <AlertTriangle className="w-5 h-5 text-amber-600 inline mr-2" />
                  Judges' decision will be final and binding
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Important Note */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-2xl p-8 mb-8">
          <div className="flex items-start space-x-4">
            <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold text-red-900 mb-3">⚠️ Important Note</h3>
              <div className="space-y-3 text-red-800">
                <p>
                  Dialogues containing double meaning, criticism of the college management, staff, 
                  departments, hostels, SHEPHERD activities, Canteen, mentioning names of government 
                  officials and any form of obscenity are to be avoided.
                </p>
                <p>
                  Sensitive political and religious situations and sentiments should not be brought 
                  on stage. The Presidents of the Associations will bear the responsibility. Any 
                  violation of this rule will lead to disqualification.
                </p>
                <p className="font-semibold">
                  All scripts/dialogues should be typed neatly for submission.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Event Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Art & Literary Events */}
          <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 shadow-sm">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Palette className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Art & Literary Events</h3>
                  <p className="text-slate-600 text-sm">Creative and artistic competitions</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[
                  { name: "Poetry Writing (Tamil)", date: "09.12.2025", time: "11:30 AM", venue: "Fr. K. P. Joseph Hall" },
                  { name: "Poetry Writing (English)", date: "09.12.2025", time: "11:30 AM", venue: "Fr. K. P. Joseph Hall" },
                  { name: "Cartooning", date: "09.12.2025", time: "11:30 AM", venue: "Fr. K. P. Joseph Hall" },
                  { name: "Dancing Brush", date: "09.12.2025", time: "2:30 PM", venue: "Fr. K. P. Joseph Hall" },
                  { name: "Poster Making", date: "10.12.2025", time: "11:30 AM", venue: "Fr. K. P. Joseph Hall" },
                  { name: "Rangoli", date: "11.12.2025", time: "2:00 PM", venue: "Front of Lawley Hall" }
                ].map((event, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200">
                    <div className="flex items-center space-x-3">
                      <Type className="w-5 h-5 text-purple-600" />
                      <div>
                        <h4 className="font-medium text-slate-900">{event.name}</h4>
                        <p className="text-slate-600 text-sm">{event.date} | {event.time}</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                      {event.venue}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Speech & Performance Events */}
          <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 shadow-sm">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Mic className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Speech & Performance</h3>
                  <p className="text-slate-600 text-sm">Oratory and theatrical competitions</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[
                  { name: "Elocution (Tamil)", date: "12.12.2025", time: "11:00 AM", venue: "Commerce AV Hall" },
                  { name: "Elocution (English)", date: "12.12.2025", time: "2:00 PM", venue: "Commerce AV Hall" },
                  { name: "Mimicry", date: "12.12.2025", time: "1:00 PM", venue: "Lawley Hall" },
                  { name: "Skit", date: "12.12.2025", time: "2:15 PM", venue: "Lawley Hall", note: "4-6 participants" },
                  { name: "Adz Up", date: "12.12.2025", time: "10:30 AM", venue: "Lawley Hall", note: "4-6 participants" }
                ].map((event, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200">
                    <div className="flex items-center space-x-3">
                      <Volume2 className="w-5 h-5 text-blue-600" />
                      <div>
                        <h4 className="font-medium text-slate-900">{event.name}</h4>
                        <p className="text-slate-600 text-sm">{event.date} | {event.time}</p>
                        {event.note && (
                          <p className="text-blue-600 text-xs font-medium">{event.note}</p>
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                      {event.venue}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Dance Events */}
          <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 shadow-sm">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Dance Events</h3>
                  <p className="text-slate-600 text-sm">Traditional and contemporary dance</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[
                  { name: "Classical Dance", date: "11.12.2025", time: "10:00 AM", venue: "Toulouse Arena", note: "Solo performance" },
                  { name: "Folk Dance", date: "12.12.2025", time: "11:30 AM", venue: "Toulouse Arena", note: "6-8 participants" },
                  { name: "Western Dance", date: "12.12.2025", time: "2:00 PM", venue: "Toulouse Arena", note: "6-8 participants" }
                ].map((event, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200">
                    <div className="flex items-center space-x-3">
                      <GraduationCap className="w-5 h-5 text-pink-600" />
                      <div>
                        <h4 className="font-medium text-slate-900">{event.name}</h4>
                        <p className="text-slate-600 text-sm">{event.date} | {event.time}</p>
                        {event.note && (
                          <p className="text-pink-600 text-xs font-medium">{event.note}</p>
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 bg-pink-100 text-pink-700 rounded-full">
                      {event.venue}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Music & Other Events */}
          <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 shadow-sm">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <Music className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Music & Other Events</h3>
                  <p className="text-slate-600 text-sm">Musical and miscellaneous competitions</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[
                  { name: "Group Song (Indian)", date: "12.12.2025", time: "1:30 PM", venue: "Fr K P Joseph Hall" },
                  { name: "Group Song (Western)", date: "12.12.2025", time: "10:30 AM", venue: "Fr K P Joseph Hall" },
                  { name: "Instrophony", date: "12.12.2025", time: "1:30 PM", venue: "SAIL Hall" },
                  { name: "Collage", date: "10.12.2025", time: "11:30 AM", venue: "Fr K P Joseph Hall" },
                  { name: "Quiz", date: "10.12.2025", time: "10:00 AM", venue: "JCICT Centre" },
                  { name: "Spot Photography", date: "11.12.2025", time: "3:00 PM", venue: "Arrupe Library" },
                  { name: "INDEP Director", date: "Submission", time: "Deadline", venue: "Online", note: "Short Film" }
                ].map((event, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200">
                    <div className="flex items-center space-x-3">
                      {event.name.includes("Song") || event.name.includes("Instrophony") ? (
                        <Music className="w-5 h-5 text-green-600" />
                      ) : event.name.includes("Collage") ? (
                        <Scissors className="w-5 h-5 text-green-600" />
                      ) : event.name.includes("Quiz") ? (
                        <Puzzle className="w-5 h-5 text-green-600" />
                      ) : event.name.includes("Photography") ? (
                        <Camera className="w-5 h-5 text-green-600" />
                      ) : event.name.includes("Director") ? (
                        <Film className="w-5 h-5 text-green-600" />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-green-600" />
                      )}
                      <div>
                        <h4 className="font-medium text-slate-900">{event.name}</h4>
                        <p className="text-slate-600 text-sm">{event.date} | {event.time}</p>
                        {event.note && (
                          <p className="text-green-600 text-xs font-medium">{event.note}</p>
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full">
                      {event.venue}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Important Dates & Notes */}
        <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 shadow-sm mb-8">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 mb-4">📋 Important Dates & Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-900">Registration Deadlines</h4>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span className="text-slate-700">Offline Events:</span>
                    <span className="font-medium">08-12-2025, 11:59 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-slate-700">On-stage Events:</span>
                    <span className="font-medium">10-12-2025, 11:59 PM</span>
                  </li>
                </ul>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  <h4 className="font-semibold text-purple-900">Portal Information</h4>
                </div>
                <p className="text-sm text-slate-700 mb-2">
                  Official portal for all registrations and submissions:
                </p>
                <a 
                  href="https://sites.google.com/mail.sjctni.edu/indep-2025/home"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-purple-600 hover:text-purple-800 font-medium break-all"
                >
                  https://sites.google.com/mail.sjctni.edu/indep-2025/home
                </a>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  <h4 className="font-semibold text-green-900">Lot Drawing</h4>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span className="text-slate-700">Off-stage Events:</span>
                    <span className="font-medium">08-12-2025, 3:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-slate-700">On-stage Events:</span>
                    <span className="font-medium">10-12-2025, 3:00 PM</span>
                  </li>
                  <li className="text-slate-700">
                    Venue: <span className="font-medium">TV Hall</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="p-6">
            <h4 className="font-bold text-slate-900 mb-4">ℹ️ PLEASE NOTE...</h4>
            <div className="space-y-3 text-slate-700">
              <div className="flex items-start space-x-2">
                <CheckIcon />
                <span>All registrations and submissions must be done through the INDEP web portal</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckIcon />
                <span>Official communications will be made through the INDEP 2025 WhatsApp group</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckIcon />
                <span>Songs, lyrics, tunes, and products are registered on a first-come-first-served basis</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckIcon />
                <span>Complete rules and event timings are available on the INDEP portal</span>
              </div>
              <div className="flex items-start space-x-2">
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span>Any form of obscenity or vulgarity will lead to immediate disqualification</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-slate-600 text-sm py-6 border-t border-slate-200">
          <p className="mb-2">
            For any queries, contact Fine Arts Association Coordinator:
          </p>
          <p className="font-semibold text-slate-900">
            Dr. A. Vimal Jerald - 9698111008
          </p>
          <p className="mt-4 text-slate-500">
            © 2025 St. Joseph's College (Autonomous) | INDEP 2025
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}