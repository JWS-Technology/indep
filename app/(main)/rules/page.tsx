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
  XCircle,
  Check,
  AlertCircle,
  FileEdit,
  Brush,
  Square,
  Music2,
  Video,
  MapPin,
  User,
  FileMusic,
  Film as FilmIcon,
  Compass,
  HelpCircle,
  PenTool,
  Layers,
  File,
  Upload,
  Phone
} from "lucide-react";

export default function RulesPage() {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    general: true,
    points: true,
    important: true,
    poetryTamil: false,
    poetryEnglish: false,
    cartooning: false,
    dancingBrush: false,
    posterMaking: false,
    rangoli: false,
    elocutionTamil: false,
    elocutionEnglish: false,
    mimicry: false,
    skit: false,
    adzup: false,
    classicalDance: false,
    folkDance: false,
    westernDance: false,
    groupSongIndian: false,
    groupSongWestern: false,
    instrophony: false,
    collage: false,
    quiz: false,
    spotPhotography: false,
    indepDirector: false,
    notes: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const downloadPDF = () => {
    window.open('/Rules & Regulations INDEP 2025.pdf', '_blank');
  };

  return (
    <div className="min-h-screen mt-20 bg-gradient-to-br from-slate-50 via-white to-slate-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent mb-2">
            Rules & Regulations
          </h2>
          <div className="mt-6 flex justify-center space-x-4">
            <button
              onClick={downloadPDF}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-200 flex items-center space-x-2 shadow-sm"
            >
              <Download className="w-5 h-5" />
              <span>Download Complete Rules PDF</span>
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

        {/* GENERAL GUIDELINES - Complete Section */}
        <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 shadow-sm mb-6 overflow-hidden">
          <button
            onClick={() => toggleSection('general')}
            className="w-full px-8 py-6 flex items-center justify-between hover:bg-slate-50 transition-colors duration-200"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-slate-900">General Guidelines</h3>
                <p className="text-slate-600 text-sm">Complete registration & participation rules</p>
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
              <div className="space-y-6">
                {/* Registration Deadlines */}
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <h4 className="font-bold text-blue-900 text-lg mb-4 flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>Registration & Participation</span>
                  </h4>
                  <div className="space-y-3 text-slate-700">
                    <p className="flex items-start space-x-2">
                      <Clock className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                      <span>The final registration of participants should be done online on or before <span className="font-bold text-blue-800">05:00 p.m, 07-12-2025 (Offline events)</span> and <span className="font-bold text-blue-800">10-12-2025 (On-stage events)</span>.</span>
                    </p>
                    <p className="flex items-start space-x-2">
                      <Hash className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                      <span>Only <span className="font-bold">one team</span> should represent their department for group events. The teams will participate in the order of lots drawn for the events. Only the Presidents or Secretaries of the Departments are allowed for drawing the lots.</span>
                    </p>
                    <p className="flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 mt-1 flex-shrink-0" />
                      <span>The teams which do not participate in any event after drawing lots will lose <span className="font-bold text-red-600">2 Points</span>.</span>
                    </p>
                    <p className="flex items-start space-x-2">
                      <User className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                      <span>One student can participate in a maximum of <span className="font-bold">FOUR (04) events</span> only.</span>
                    </p>
                  </div>
                </div>

                {/* Replacement Rules */}
                <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                  <h4 className="font-bold text-amber-900 text-lg mb-4 flex items-center space-x-2">
                    <UserCheck className="w-5 h-5" />
                    <span>Participant Replacement Rules</span>
                  </h4>
                  <div className="space-y-3 text-slate-700">
                    <p className="flex items-start space-x-2">
                      <Ban className="w-4 h-4 text-amber-600 mt-1 flex-shrink-0" />
                      <span>Other than the registered participant appearing for events without any prior notice at the registration desk, the team concerned will be <span className="font-bold text-red-600">DISQUALIFIED</span>.</span>
                    </p>
                    <p className="flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 mt-1 flex-shrink-0" />
                      <span>In general, replacements of participants are not permitted. In an emergency, the Team Manager of the particular Teams may get permission from the Coordinator of Fine Arts Assn. <span className="font-bold">Dr. A. Vimal Jerald (9698111008)</span> for the replacement in writing.</span>
                    </p>
                  </div>
                </div>

                {/* ID Card & Attendance */}
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                  <h4 className="font-bold text-slate-900 text-lg mb-4 flex items-center space-x-2">
                    <File className="w-5 h-5" />
                    <span>ID Card & Attendance Rules</span>
                  </h4>
                  <div className="space-y-3 text-slate-700">
                    <p className="flex items-start space-x-2">
                      <Check className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                      <span>Participants should produce their <span className="font-bold">IDENTITY CARDS</span> before each event for scrutiny.</span>
                    </p>
                    <p className="flex items-start space-x-2">
                      <Clock className="w-4 h-4 text-slate-600 mt-1 flex-shrink-0" />
                      <span>They must be present at the backstage immediately after the first announcement of the events.</span>
                    </p>
                    <p className="flex items-start space-x-2">
                      <Check className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                      <span>The submitted ID cards should be collected once after the performance by the respective team.</span>
                    </p>
                    <p className="flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                      <span>If a team doesn't turn up even after three consecutive calls, the team concerned will be <span className="font-bold text-red-600">DISQUALIFIED</span> from the event and it may lead to a loss of <span className="font-bold text-red-600">TWO POINTS</span>. No second chance will be given at any cost.</span>
                    </p>
                  </div>
                </div>

                {/* Accompanists Rules */}
                <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                  <h4 className="font-bold text-purple-900 text-lg mb-4 flex items-center space-x-2">
                    <Music2 className="w-5 h-5" />
                    <span>Accompanists Rules</span>
                  </h4>
                  <div className="space-y-3 text-slate-700">
                    <p className="flex items-start space-x-2">
                      <Ban className="w-4 h-4 text-purple-600 mt-1 flex-shrink-0" />
                      <span>No prizes will be given to the accompanists. Accompanists should only be students of our college.</span>
                    </p>
                    <p className="flex items-start space-x-2">
                      <Check className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                      <span>Accompanists from other departments of our college are allowed. They should produce ID card for scrutiny.</span>
                    </p>
                    <p className="flex items-start space-x-2">
                      <Ban className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                      <span>No outside Choreographers / Makeup Artists are allowed. If any team found fixing them, the team will be disqualified for the event concern.</span>
                    </p>
                    <p className="flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 mt-1 flex-shrink-0" />
                      <span>Boys and girls should avoid close proximity to each other during the performance on stage.</span>
                    </p>
                  </div>
                </div>

                {/* Financial Support */}
                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <h4 className="font-bold text-green-900 text-lg mb-4 flex items-center space-x-2">
                    <DollarSign className="w-5 h-5" />
                    <span>Financial Support</span>
                  </h4>
                  <p className="text-slate-700">
                    Each Department will be given <span className="font-bold text-green-700 text-xl">Rs.2000/-</span> to meet the expenses related to arrangements, including refreshments.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* POINTS SYSTEM - Complete Section */}
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
                <p className="text-slate-600 text-sm">Complete scoring criteria and ranking system</p>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <p className="text-center text-slate-700 text-lg italic">
                  <AlertTriangle className="w-6 h-6 text-amber-600 inline mr-2 align-middle" />
                  <span className="font-semibold">Judges' decision will be final</span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* IMPORTANT NOTE - Complete Section */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-2xl p-8 mb-8">
          <div className="flex items-start space-x-4">
            <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold text-red-900 mb-4">Important Note</h3>
              <div className="space-y-4 text-red-800">
                <p className="leading-relaxed">
                  Dialogues containing double meaning, criticism of the college management, staff,
                  departments, hostels, SHEPHERD activities, Canteen, mentioning names of the government
                  officials and any form of obscenity are to be avoided.
                </p>
                <p className="leading-relaxed">
                  The sensitive political and religious situation and sentiments should not be brought on the stage.
                  The Presidents of the Associations will bear the responsibility. Any violation of this rule will
                  lead to disqualification. The Presidents are requested to extend their full cooperation.
                </p>
                <p className="leading-relaxed font-bold">
                  All the scripts/ dialogues should be typed neatly for the submission.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ART & LITERARY EVENTS - Complete Details */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center space-x-3">
            <Palette className="w-8 h-8 text-purple-600" />
            <span>Art & Literary Events</span>
          </h2>

          {/* Poetry Writing Tamil */}
          <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 shadow-sm mb-4 overflow-hidden">
            <button
              onClick={() => toggleSection('poetryTamil')}
              className="w-full px-8 py-6 flex items-center justify-between hover:bg-slate-50 transition-colors duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <FileEdit className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-slate-900">POETRY WRITING IN TAMIL</h3>
                  <div className="flex items-center space-x-4 text-sm text-slate-600">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>09.12.2025</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>11:30 AM</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>Rev. Fr. K. P. Joseph Hall</span>
                    </span>
                  </div>
                </div>
              </div>
              {expandedSections.poetryTamil ? (
                <ChevronUp className="w-6 h-6 text-slate-400" />
              ) : (
                <ChevronDown className="w-6 h-6 text-slate-400" />
              )}
            </button>

            {expandedSections.poetryTamil && (
              <div className="px-8 pb-8">
                <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                  <div className="space-y-4 text-slate-700">
                    <div className="flex items-start space-x-3">
                      <User className="w-5 h-5 text-purple-600 mt-0.5" />
                      <p>Only <span className="font-bold">one participant</span> is permitted from a department.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-purple-600 mt-0.5" />
                      <p>The time duration is <span className="font-bold">01 hour</span>.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <FileEdit className="w-5 h-5 text-purple-600 mt-0.5" />
                      <p>Topic will be given <span className="font-bold">on the spot</span>.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Poetry Writing English */}
          <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 shadow-sm mb-4 overflow-hidden">
            <button
              onClick={() => toggleSection('poetryEnglish')}
              className="w-full px-8 py-6 flex items-center justify-between hover:bg-slate-50 transition-colors duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <FileEdit className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-slate-900">POETRY WRITING IN ENGLISH</h3>
                  <div className="flex items-center space-x-4 text-sm text-slate-600">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>09.12.2025</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>11:30 AM</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>Rev. Fr. K. P. Joseph Hall</span>
                    </span>
                  </div>
                </div>
              </div>
              {expandedSections.poetryEnglish ? (
                <ChevronUp className="w-6 h-6 text-slate-400" />
              ) : (
                <ChevronDown className="w-6 h-6 text-slate-400" />
              )}
            </button>

            {expandedSections.poetryEnglish && (
              <div className="px-8 pb-8">
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <div className="space-y-4 text-slate-700">
                    <div className="flex items-start space-x-3">
                      <User className="w-5 h-5 text-blue-600 mt-0.5" />
                      <p>Only <span className="font-bold">one participant</span> is permitted from a department.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                      <p>The time duration is <span className="font-bold">01 hour</span>.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <FileEdit className="w-5 h-5 text-blue-600 mt-0.5" />
                      <p>Topic will be given <span className="font-bold">on the spot</span>.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Cartooning */}
          <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 shadow-sm mb-4 overflow-hidden">
            <button
              onClick={() => toggleSection('cartooning')}
              className="w-full px-8 py-6 flex items-center justify-between hover:bg-slate-50 transition-colors duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
                  <PenTool className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-slate-900">CARTOONING</h3>
                  <div className="flex items-center space-x-4 text-sm text-slate-600">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>09.12.2025</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>11:30 AM</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>Rev. Fr. K. P. Joseph Hall</span>
                    </span>
                  </div>
                </div>
              </div>
              {expandedSections.cartooning ? (
                <ChevronUp className="w-6 h-6 text-slate-400" />
              ) : (
                <ChevronDown className="w-6 h-6 text-slate-400" />
              )}
            </button>

            {expandedSections.cartooning && (
              <div className="px-8 pb-8">
                <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                  <div className="space-y-4 text-slate-700">
                    <div className="flex items-start space-x-3">
                      <User className="w-5 h-5 text-amber-600 mt-0.5" />
                      <p>Only <span className="font-bold">one participant</span> is permitted from a department.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Square className="w-5 h-5 text-amber-600 mt-0.5" />
                      <p>Only <span className="font-bold">chart</span> will be provided.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                      <p>The participant should bring the <span className="font-bold">other necessary things</span>.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <FileEdit className="w-5 h-5 text-amber-600 mt-0.5" />
                      <p>Theme will be announced <span className="font-bold">on the spot</span>.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-amber-600 mt-0.5" />
                      <p>The time duration is <span className="font-bold">01 hour</span>.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Dancing Brush */}
          <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 shadow-sm mb-4 overflow-hidden">
            <button
              onClick={() => toggleSection('dancingBrush')}
              className="w-full px-8 py-6 flex items-center justify-between hover:bg-slate-50 transition-colors duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <Brush className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-slate-900">DANCING BRUSH</h3>
                  <div className="flex items-center space-x-4 text-sm text-slate-600">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>09.12.2025</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>2:30 PM</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>Rev. Fr. K. P. Joseph Hall</span>
                    </span>
                  </div>
                </div>
              </div>
              {expandedSections.dancingBrush ? (
                <ChevronUp className="w-6 h-6 text-slate-400" />
              ) : (
                <ChevronDown className="w-6 h-6 text-slate-400" />
              )}
            </button>

            {expandedSections.dancingBrush && (
              <div className="px-8 pb-8">
                <div className="bg-pink-50 rounded-xl p-6 border border-pink-200">
                  <div className="space-y-4 text-slate-700">
                    <div className="flex items-start space-x-3">
                      <User className="w-5 h-5 text-pink-600 mt-0.5" />
                      <p>Only <span className="font-bold">one participant</span> is allowed.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-pink-600 mt-0.5" />
                      <p>The time duration is <span className="font-bold">02 hours</span>.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-pink-600 mt-0.5" />
                      <p>Participants have to bring <span className="font-bold">necessary materials on their own</span>. (Only watercolors should be used).</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Square className="w-5 h-5 text-pink-600 mt-0.5" />
                      <p>Only <span className="font-bold">chart paper</span> will be given.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <FileEdit className="w-5 h-5 text-pink-600 mt-0.5" />
                      <p>Topics will be given <span className="font-bold">on the spot</span>.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Poster Making */}
          <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 shadow-sm mb-4 overflow-hidden">
            <button
              onClick={() => toggleSection('posterMaking')}
              className="w-full px-8 py-6 flex items-center justify-between hover:bg-slate-50 transition-colors duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Layers className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-slate-900">POSTER MAKING</h3>
                  <div className="flex items-center space-x-4 text-sm text-slate-600">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>10.12.2025</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>11:30 AM</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>Rev. Fr. K. P. Joseph Hall</span>
                    </span>
                  </div>
                </div>
              </div>
              {expandedSections.posterMaking ? (
                <ChevronUp className="w-6 h-6 text-slate-400" />
              ) : (
                <ChevronDown className="w-6 h-6 text-slate-400" />
              )}
            </button>

            {expandedSections.posterMaking && (
              <div className="px-8 pb-8">
                <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-200">
                  <div className="space-y-4 text-slate-700">
                    <div className="flex items-start space-x-3">
                      <User className="w-5 h-5 text-indigo-600 mt-0.5" />
                      <p>Only <span className="font-bold">one participant</span> is permitted from each department.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-indigo-600 mt-0.5" />
                      <p>The time duration is <span className="font-bold">2 hours</span>.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-indigo-600 mt-0.5" />
                      <p>Participants should bring <span className="font-bold">necessary materials on their own</span>.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Square className="w-5 h-5 text-indigo-600 mt-0.5" />
                      <p>Only <span className="font-bold">chart paper</span> will be provided.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <FileEdit className="w-5 h-5 text-indigo-600 mt-0.5" />
                      <p>Topic will be given <span className="font-bold">on the spot</span>.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-indigo-600 mt-0.5" />
                      <p>It is different from dancing brush and it is only to attract and advertise a particular cause.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Ban className="w-5 h-5 text-red-600 mt-0.5" />
                      <p>Paper cuttings are not allowed.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Award className="w-5 h-5 text-indigo-600 mt-0.5" />
                      <p>The judgment will be based on Caption, Presentation, and Creativity & Overall effect.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Rangoli */}
          <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 shadow-sm mb-4 overflow-hidden">
            <button
              onClick={() => toggleSection('rangoli')}
              className="w-full px-8 py-6 flex items-center justify-between hover:bg-slate-50 transition-colors duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Compass className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-slate-900">RANGOLI</h3>
                  <div className="flex items-center space-x-4 text-sm text-slate-600">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>11.12.2025</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>2:00 PM</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>In-front of Lawley Hall</span>
                    </span>
                  </div>
                </div>
              </div>
              {expandedSections.rangoli ? (
                <ChevronUp className="w-6 h-6 text-slate-400" />
              ) : (
                <ChevronDown className="w-6 h-6 text-slate-400" />
              )}
            </button>

            {expandedSections.rangoli && (
              <div className="px-8 pb-8">
                <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                  <div className="space-y-4 text-slate-700">
                    <div className="flex items-start space-x-3">
                      <User className="w-5 h-5 text-orange-600 mt-0.5" />
                      <p>Only <span className="font-bold">one participant</span> is permitted from a department.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                      <p>The participant should bring the <span className="font-bold">necessary things</span>.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <FileEdit className="w-5 h-5 text-orange-600 mt-0.5" />
                      <p>Theme will be announced <span className="font-bold">on the spot</span>.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-orange-600 mt-0.5" />
                      <p>The time duration is <span className="font-bold">01 hour</span>.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SPEECH & PERFORMANCE EVENTS - Complete Details */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center space-x-3">
            <Mic className="w-8 h-8 text-blue-600" />
            <span>Speech & Performance Events</span>
          </h2>

          {/* Elocution Tamil */}
          <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 shadow-sm mb-4 overflow-hidden">
            <button
              onClick={() => toggleSection('elocutionTamil')}
              className="w-full px-8 py-6 flex items-center justify-between hover:bg-slate-50 transition-colors duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Volume2 className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-slate-900">ELOCUTION IN TAMIL</h3>
                  <div className="flex items-center space-x-4 text-sm text-slate-600">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>12.12.2025</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>11:00 AM</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>Commerce AV Hall</span>
                    </span>
                  </div>
                </div>
              </div>
              {expandedSections.elocutionTamil ? (
                <ChevronUp className="w-6 h-6 text-slate-400" />
              ) : (
                <ChevronDown className="w-6 h-6 text-slate-400" />
              )}
            </button>

            {expandedSections.elocutionTamil && (
              <div className="px-8 pb-8">
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <div className="space-y-4 text-slate-700">
                    <div className="flex items-start space-x-3">
                      <User className="w-5 h-5 text-blue-600 mt-0.5" />
                      <p>Only <span className="font-bold">one participant</span> is permitted from a department.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                      <p>Time duration is <span className="font-bold">03 minutes</span>.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <FileEdit className="w-5 h-5 text-blue-600 mt-0.5" />
                      <p>The topic will be sent in the Official WhatsApp Group at 9:30 am on the same day.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Elocution English */}
          <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 shadow-sm mb-4 overflow-hidden">
            <button
              onClick={() => toggleSection('elocutionEnglish')}
              className="w-full px-8 py-6 flex items-center justify-between hover:bg-slate-50 transition-colors duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Volume2 className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-slate-900">ELOCUTION IN ENGLISH</h3>
                  <div className="flex items-center space-x-4 text-sm text-slate-600">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>12.12.2025</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>2:00 PM</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>Commerce AV Hall</span>
                    </span>
                  </div>
                </div>
              </div>
              {expandedSections.elocutionEnglish ? (
                <ChevronUp className="w-6 h-6 text-slate-400" />
              ) : (
                <ChevronDown className="w-6 h-6 text-slate-400" />
              )}
            </button>

            {expandedSections.elocutionEnglish && (
              <div className="px-8 pb-8">
                <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-200">
                  <div className="space-y-4 text-slate-700">
                    <div className="flex items-start space-x-3">
                      <User className="w-5 h-5 text-indigo-600 mt-0.5" />
                      <p>Only <span className="font-bold">one participant</span> is permitted from a department.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-indigo-600 mt-0.5" />
                      <p>Time duration is <span className="font-bold">03 minutes</span>.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <FileEdit className="w-5 h-5 text-indigo-600 mt-0.5" />
                      <p>The topic will be sent in the Official WhatsApp Group at 12:30 pm on the same day.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mimicry */}
          <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 shadow-sm mb-4 overflow-hidden">
            <button
              onClick={() => toggleSection('mimicry')}
              className="w-full px-8 py-6 flex items-center justify-between hover:bg-slate-50 transition-colors duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-slate-900">MIMICRY</h3>
                  <div className="flex items-center space-x-4 text-sm text-slate-600">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>12.12.2025</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>1:00 PM</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>Lawley Hall</span>
                    </span>
                  </div>
                </div>
              </div>
              {expandedSections.mimicry ? (
                <ChevronUp className="w-6 h-6 text-slate-400" />
              ) : (
                <ChevronDown className="w-6 h-6 text-slate-400" />
              )}
            </button>

            {expandedSections.mimicry && (
              <div className="px-8 pb-8">
                <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                  <div className="space-y-4 text-slate-700">
                    <div className="flex items-start space-x-3">
                      <User className="w-5 h-5 text-amber-600 mt-0.5" />
                      <p>Only <span className="font-bold">one participant</span> is allowed.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-amber-600 mt-0.5" />
                      <p>The time duration is <span className="font-bold">03 minutes</span>.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Award className="w-5 h-5 text-amber-600 mt-0.5" />
                      <p>The judgement is based on Creativity, Imitation and Overall effect.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                      <p>Criticizing others particularly the leaders in any form leads to disqualification.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Skit */}
          <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 shadow-sm mb-4 overflow-hidden">
            <button
              onClick={() => toggleSection('skit')}
              className="w-full px-8 py-6 flex items-center justify-between hover:bg-slate-50 transition-colors duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Video className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-slate-900">SKIT</h3>
                  <div className="flex items-center space-x-4 text-sm text-slate-600">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>12.12.2025</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>2:15 PM</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>Lawley Hall</span>
                    </span>
                  </div>
                </div>
              </div>
              {expandedSections.skit ? (
                <ChevronUp className="w-6 h-6 text-slate-400" />
              ) : (
                <ChevronDown className="w-6 h-6 text-slate-400" />
              )}
            </button>

            {expandedSections.skit && (
              <div className="px-8 pb-8">
                <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                  <div className="space-y-4 text-slate-700">
                    <div className="flex items-start space-x-3">
                      <Users className="w-5 h-5 text-purple-600 mt-0.5" />
                      <p>A maximum of <span className="font-bold">06 students</span> makes a team and a minimum of <span className="font-bold">04</span>.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <User className="w-5 h-5 text-purple-600 mt-0.5" />
                      <p>Only <span className="font-bold">one team</span> from each Department is allowed.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-purple-600 mt-0.5" />
                      <p>Duration of the skit is <span className="font-bold">5 minutes</span>.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Music className="w-5 h-5 text-purple-600 mt-0.5" />
                      <p>Recorded background music is allowed, and Recorded dialogues and songs are not allowed. Voice from the backstage is not allowed.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Type className="w-5 h-5 text-purple-600 mt-0.5" />
                      <p>Medium of communication can be either in Tamil or English.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Award className="w-5 h-5 text-purple-600 mt-0.5" />
                      <p>The judgement is based on Qualities like Imagination, Presentation, Novelty, and Overall effect and Social Relevance.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <FileEdit className="w-5 h-5 text-purple-600 mt-0.5" />
                      <p>Lot for the theme selection will be drawn on 3.12.2025.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <FileText className="w-5 h-5 text-purple-600 mt-0.5" />
                      <p>The script should be uploaded into the portal on or before 07.12.2025 upto 11.59 p.m. Corrections if any will be intimated latest by 08-12-2025.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Adz Up */}
          <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 shadow-sm mb-4 overflow-hidden">
            <button
              onClick={() => toggleSection('adzup')}
              className="w-full px-8 py-6 flex items-center justify-between hover:bg-slate-50 transition-colors duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <Megaphone className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-slate-900">ADZ UP</h3>
                  <div className="flex items-center space-x-4 text-sm text-slate-600">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>12.12.2025</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>10:30 AM</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>Lawley Hall</span>
                    </span>
                  </div>
                </div>
              </div>
              {expandedSections.adzup ? (
                <ChevronUp className="w-6 h-6 text-slate-400" />
              ) : (
                <ChevronDown className="w-6 h-6 text-slate-400" />
              )}
            </button>

            {expandedSections.adzup && (
              <div className="px-8 pb-8">
                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <div className="space-y-4 text-slate-700">
                    <div className="flex items-start space-x-3">
                      <Users className="w-5 h-5 text-green-600 mt-0.5" />
                      <p>A team of maximum <span className="font-bold">06 participants</span> and minimum <span className="font-bold">04 participants</span> from each department can participate.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-green-600 mt-0.5" />
                      <p>The time duration is <span className="font-bold">03 minutes</span>.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Award className="w-5 h-5 text-green-600 mt-0.5" />
                      <p>The judgment is based on qualities like Creativity, Presentation and Overall effect.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <FileEdit className="w-5 h-5 text-green-600 mt-0.5" />
                      <p>Drawing of lots of the product will be done on 3.12.2025 at 2:30 pm.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <FileText className="w-5 h-5 text-green-600 mt-0.5" />
                      <p>The Script for the Adzup should be submitted in the INDEP Portal on or before 07-12-2025 at 11.59 p.m. Corrections if any will be intimated latest by 08-12-2025.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* DANCE EVENTS - Complete Details */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center space-x-3">
            <Sparkles className="w-8 h-8 text-pink-600" />
            <span>Dance Events</span>
          </h2>

          {/* Classical Dance */}
          <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 shadow-sm mb-4 overflow-hidden">
            <button
              onClick={() => toggleSection('classicalDance')}
              className="w-full px-8 py-6 flex items-center justify-between hover:bg-slate-50 transition-colors duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-slate-900">CLASSICAL DANCE</h3>
                  <div className="flex items-center space-x-4 text-sm text-slate-600">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>12.12.2025</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>10:00 AM</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>Toulouse Arena</span>
                    </span>
                  </div>
                </div>
              </div>
              {expandedSections.classicalDance ? (
                <ChevronUp className="w-6 h-6 text-slate-400" />
              ) : (
                <ChevronDown className="w-6 h-6 text-slate-400" />
              )}
            </button>

            {expandedSections.classicalDance && (
              <div className="px-8 pb-8">
                <div className="bg-pink-50 rounded-xl p-6 border border-pink-200">
                  <div className="space-y-4 text-slate-700">
                    <div className="flex items-start space-x-3">
                      <User className="w-5 h-5 text-pink-600 mt-0.5" />
                      <p>Only <span className="font-bold">one dancer per team</span> is allowed.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-pink-600 mt-0.5" />
                      <p>Duration for each team is <span className="font-bold">4 minutes</span>.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Award className="w-5 h-5 text-pink-600 mt-0.5" />
                      <p>Judgment will be based on the qualities like Properties and costumes used, abinaya, expression and general impression.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Ban className="w-5 h-5 text-red-600 mt-0.5" />
                      <p>No film song should be used.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <FileMusic className="w-5 h-5 text-pink-600 mt-0.5" />
                      <p>The music should be uploaded in the portal on or before 7-12-2025 upto 11.59 p.m. Corrections if any will be intimated latest by 8-12-2025.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Folk Dance */}
          <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 shadow-sm mb-4 overflow-hidden">
            <button
              onClick={() => toggleSection('folkDance')}
              className="w-full px-8 py-6 flex items-center justify-between hover:bg-slate-50 transition-colors duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-slate-900">FOLK DANCE</h3>
                  <div className="flex items-center space-x-4 text-sm text-slate-600">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>12.12.2025</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>11:30 AM</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>Toulouse Arena</span>
                    </span>
                  </div>
                </div>
              </div>
              {expandedSections.folkDance ? (
                <ChevronUp className="w-6 h-6 text-slate-400" />
              ) : (
                <ChevronDown className="w-6 h-6 text-slate-400" />
              )}
            </button>

            {expandedSections.folkDance && (
              <div className="px-8 pb-8">
                <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                  <div className="space-y-4 text-slate-700">
                    <div className="flex items-start space-x-3">
                      <Users className="w-5 h-5 text-orange-600 mt-0.5" />
                      <p>A team will have maximum of <span className="font-bold">8</span> and minimum <span className="font-bold">6 students</span>.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Ban className="w-5 h-5 text-orange-600 mt-0.5" />
                      <p>Accompanists are not allowed and no professionals are also permitted.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-orange-600 mt-0.5" />
                      <p><span className="font-bold">04 minutes</span> duration for each team. The Teams may choose a variety of Indian folk such as Karakam, Mayilattam, Oyil, Bangra, Thandia, Kavadiattam etc.,</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                      <p>Only <span className="font-bold">4 teams</span> are permitted to dance for a particular variety of folk on FCFS basis.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <FileEdit className="w-5 h-5 text-orange-600 mt-0.5" />
                      <p>Each team should register the variety of dance, song on before 05.12.2025 at 4.00pm.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <FileMusic className="w-5 h-5 text-orange-600 mt-0.5" />
                      <p>The Song in MP3 format should be uploaded in the portal on or before 07-12-2025 upto 11.59 p.m. Corrections if any will be intimated latest by 08-12-2025.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Award className="w-5 h-5 text-orange-600 mt-0.5" />
                      <p>The judgment will be based on the Rhythm, Formation, Costumes and Overall effect.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Western Dance */}
          <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 shadow-sm mb-4 overflow-hidden">
            <button
              onClick={() => toggleSection('westernDance')}
              className="w-full px-8 py-6 flex items-center justify-between hover:bg-slate-50 transition-colors duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Music className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-slate-900">WESTERN DANCE</h3>
                  <div className="flex items-center space-x-4 text-sm text-slate-600">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>12.12.2025</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>2:00 PM</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>Toulouse Arena</span>
                    </span>
                  </div>
                </div>
              </div>
              {expandedSections.westernDance ? (
                <ChevronUp className="w-6 h-6 text-slate-400" />
              ) : (
                <ChevronDown className="w-6 h-6 text-slate-400" />
              )}
            </button>

            {expandedSections.westernDance && (
              <div className="px-8 pb-8">
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <div className="space-y-4 text-slate-700">
                    <div className="flex items-start space-x-3">
                      <Users className="w-5 h-5 text-blue-600 mt-0.5" />
                      <p>A maximum of <span className="font-bold">08</span> and minimum of <span className="font-bold">6 students</span> will make a team.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                      <p><span className="font-bold">04 minutes</span> will be duration for each team.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <FileMusic className="w-5 h-5 text-blue-600 mt-0.5" />
                      <p>The team should register the song (non-film) online on or before 5.12.2025 upto 11.59 p.m. in the portal. If the track is a fusion of different songs, register the entire part of all the songs chosen. For a single song repetition is not allowed.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <FileMusic className="w-5 h-5 text-blue-600 mt-0.5" />
                      <p>The music for the western dance should be uploaded on or before 07-12-2025 upto 11.59 p.m. Corrections if any will be intimated latest by 08.12.2025.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Award className="w-5 h-5 text-blue-600 mt-0.5" />
                      <p>The judgment will be based on Formation & coordination, Dance movements, Expression and Overall effect.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MUSIC EVENTS - Complete Details */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center space-x-3">
            <Music className="w-8 h-8 text-green-600" />
            <span>Music Events</span>
          </h2>

          {/* Group Song Indian */}
          <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 shadow-sm mb-4 overflow-hidden">
            <button
              onClick={() => toggleSection('groupSongIndian')}
              className="w-full px-8 py-6 flex items-center justify-between hover:bg-slate-50 transition-colors duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <Music2 className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-slate-900">GROUP SONG - INDIAN</h3>
                  <div className="flex items-center space-x-4 text-sm text-slate-600">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>12.12.2025</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>1:30 PM</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>Fr K P Joseph Hall</span>
                    </span>
                  </div>
                </div>
              </div>
              {expandedSections.groupSongIndian ? (
                <ChevronUp className="w-6 h-6 text-slate-400" />
              ) : (
                <ChevronDown className="w-6 h-6 text-slate-400" />
              )}
            </button>

            {expandedSections.groupSongIndian && (
              <div className="px-8 pb-8">
                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <div className="space-y-4 text-slate-700">
                    <div className="flex items-start space-x-3">
                      <Users className="w-5 h-5 text-green-600 mt-0.5" />
                      <p>Only <span className="font-bold">one team</span> from each Department is permitted.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <User className="w-5 h-5 text-green-600 mt-0.5" />
                      <p><span className="font-bold">04 singers</span> and <span className="font-bold">03 accompanists</span> are allowed to perform.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-green-600 mt-0.5" />
                      <p>The Time duration is <span className="font-bold">05 minutes</span> including the arrangements.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <FileEdit className="w-5 h-5 text-green-600 mt-0.5" />
                      <p>Themes such as National Integration, Human Rights and any socially relevant themes can be presented.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Music className="w-5 h-5 text-green-600 mt-0.5" />
                      <p>Tune of a popular Film music can be used and your own tune can also be used.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <FileMusic className="w-5 h-5 text-green-600 mt-0.5" />
                      <p>The song and the tune should be registered in the portal on or before 5.12.2025 at 11.59 p.m.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <FileText className="w-5 h-5 text-green-600 mt-0.5" />
                      <p>The lyrics of the song should be uploaded on or before 07-12-2025 at 11.59 p.m. Corrections if any will be intimated latest by 08-12-2025.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Group Song Western */}
          <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 shadow-sm mb-4 overflow-hidden">
            <button
              onClick={() => toggleSection('groupSongWestern')}
              className="w-full px-8 py-6 flex items-center justify-between hover:bg-slate-50 transition-colors duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <Music2 className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-slate-900">GROUP SONG WESTERN</h3>
                  <div className="flex items-center space-x-4 text-sm text-slate-600">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>12.12.2025</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>10:30 AM</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>Fr K P Joseph Hall</span>
                    </span>
                  </div>
                </div>
              </div>
              {expandedSections.groupSongWestern ? (
                <ChevronUp className="w-6 h-6 text-slate-400" />
              ) : (
                <ChevronDown className="w-6 h-6 text-slate-400" />
              )}
            </button>

            {expandedSections.groupSongWestern && (
              <div className="px-8 pb-8">
                <div className="bg-teal-50 rounded-xl p-6 border border-teal-200">
                  <div className="space-y-4 text-slate-700">
                    <div className="flex items-start space-x-3">
                      <User className="w-5 h-5 text-teal-600 mt-0.5" />
                      <p><span className="font-bold">04 singers</span> and <span className="font-bold">03 accompanists</span> are permitted for a team.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-teal-600 mt-0.5" />
                      <p>The duration is <span className="font-bold">5 minutes</span> including stage arrangements.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Type className="w-5 h-5 text-teal-600 mt-0.5" />
                      <p>The song should be in ENGLISH.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <FileMusic className="w-5 h-5 text-teal-600 mt-0.5" />
                      <p>The song and the tune should be registered in the portal on or before 05.12.2025 at 11.59 p.m.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <FileText className="w-5 h-5 text-teal-600 mt-0.5" />
                      <p>The lyrics of the song should be uploaded on or before 07-12-2025 at 11.59 p.m. Corrections if any will be intimated latest by 08-12-2025.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Instrophony */}
          <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 shadow-sm mb-4 overflow-hidden">
            <button
              onClick={() => toggleSection('instrophony')}
              className="w-full px-8 py-6 flex items-center justify-between hover:bg-slate-50 transition-colors duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Music className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-slate-900">INSTR0PHONY</h3>
                  <div className="flex items-center space-x-4 text-sm text-slate-600">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>12.12.2025</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>1:30 PM</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>SAIL Hall</span>
                    </span>
                  </div>
                </div>
              </div>
              {expandedSections.instrophony ? (
                <ChevronUp className="w-6 h-6 text-slate-400" />
              ) : (
                <ChevronDown className="w-6 h-6 text-slate-400" />
              )}
            </button>

            {expandedSections.instrophony && (
              <div className="px-8 pb-8">
                <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
                  <div className="space-y-4 text-slate-700">
                    <div className="flex items-start space-x-3">
                      <User className="w-5 h-5 text-emerald-600 mt-0.5" />
                      <p>Only <span className="font-bold">one participant</span> is permitted from a department.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-emerald-600 mt-0.5" />
                      <p><span className="font-bold">04 minutes</span> will be duration for each Department.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Music className="w-5 h-5 text-emerald-600 mt-0.5" />
                      <p>It can be presented in any style (Carnatic, Hindustani, Western, etc.)</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Ban className="w-5 h-5 text-red-600 mt-0.5" />
                      <p>Pre-recorded music pieces in keyboards are not allowed.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Award className="w-5 h-5 text-emerald-600 mt-0.5" />
                      <p>Judgment will be based on the qualities like selection of Raga, Taal and General impression.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* OTHER EVENTS - Complete Details */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center space-x-3">
            <Layers className="w-8 h-8 text-indigo-600" />
            <span>Other Events</span>
          </h2>

          {/* Collage */}
          <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 shadow-sm mb-4 overflow-hidden">
            <button
              onClick={() => toggleSection('collage')}
              className="w-full px-8 py-6 flex items-center justify-between hover:bg-slate-50 transition-colors duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Scissors className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-slate-900">COLLAGE</h3>
                  <div className="flex items-center space-x-4 text-sm text-slate-600">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>10.12.2025</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>11:30 AM</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>Fr K P Joseph Hall</span>
                    </span>
                  </div>
                </div>
              </div>
              {expandedSections.collage ? (
                <ChevronUp className="w-6 h-6 text-slate-400" />
              ) : (
                <ChevronDown className="w-6 h-6 text-slate-400" />
              )}
            </button>

            {expandedSections.collage && (
              <div className="px-8 pb-8">
                <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-200">
                  <div className="space-y-4 text-slate-700">
                    <div className="flex items-start space-x-3">
                      <User className="w-5 h-5 text-indigo-600 mt-0.5" />
                      <p>Only <span className="font-bold">one participant</span> is permitted from a department.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-indigo-600 mt-0.5" />
                      <p>The time duration is <span className="font-bold">02 hours</span>.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-indigo-600 mt-0.5" />
                      <p>Participants have to bring the necessary articles like Blade, Gum, Pair of Scissors, etc.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Square className="w-5 h-5 text-indigo-600 mt-0.5" />
                      <p>Only <span className="font-bold">chart paper</span> will be provided. Only Paper materials should be used.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <FileEdit className="w-5 h-5 text-indigo-600 mt-0.5" />
                      <p>Topic will be given <span className="font-bold">on the spot</span>.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-indigo-600 mt-0.5" />
                      <p>Only paper materials should be used.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quiz */}
          <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 shadow-sm mb-4 overflow-hidden">
            <button
              onClick={() => toggleSection('quiz')}
              className="w-full px-8 py-6 flex items-center justify-between hover:bg-slate-50 transition-colors duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <HelpCircle className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-slate-900">QUIZ - PRELIMS</h3>
                  <div className="flex items-center space-x-4 text-sm text-slate-600">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>10.12.2025</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>10:00 AM</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>JCICT Centre</span>
                    </span>
                  </div>
                </div>
              </div>
              {expandedSections.quiz ? (
                <ChevronUp className="w-6 h-6 text-slate-400" />
              ) : (
                <ChevronDown className="w-6 h-6 text-slate-400" />
              )}
            </button>

            {expandedSections.quiz && (
              <div className="px-8 pb-8">
                <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                  <div className="space-y-4 text-slate-700">
                    <div className="flex items-start space-x-3">
                      <Users className="w-5 h-5 text-purple-600 mt-0.5" />
                      <p><span className="font-bold">Two candidates</span> are permitted from each team.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <FileText className="w-5 h-5 text-purple-600 mt-0.5" />
                      <p>Computer Based Test (CBT) will be conducted for <span className="font-bold">100 marks</span>.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <BookOpen className="w-5 h-5 text-purple-600 mt-0.5" />
                      <p>Questions from General Knowledge of degree standard will be asked.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-purple-600 mt-0.5" />
                      <p>Based on the scores in CBT three teams from Shift I and three teams from Shift II will be short listed.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-purple-600 mt-0.5" />
                      <p>The results will be intimated to you immediately after the test.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Award className="w-5 h-5 text-purple-600 mt-0.5" />
                      <p>Finals will be held on the same day at 3.30 pm in Commerce AV Hall.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Spot Photography */}
          <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 shadow-sm mb-4 overflow-hidden">
            <button
              onClick={() => toggleSection('spotPhotography')}
              className="w-full px-8 py-6 flex items-center justify-between hover:bg-slate-50 transition-colors duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-slate-900">SPOT PHOTOGRAPHY</h3>
                  <div className="flex items-center space-x-4 text-sm text-slate-600">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>11.12.2025</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>3:00 PM</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>In front of Arrupe Library Building</span>
                    </span>
                  </div>
                </div>
              </div>
              {expandedSections.spotPhotography ? (
                <ChevronUp className="w-6 h-6 text-slate-400" />
              ) : (
                <ChevronDown className="w-6 h-6 text-slate-400" />
              )}
            </button>

            {expandedSections.spotPhotography && (
              <div className="px-8 pb-8">
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <div className="space-y-4 text-slate-700">
                    <div className="flex items-start space-x-3">
                      <User className="w-5 h-5 text-blue-600 mt-0.5" />
                      <p>Only <span className="font-bold">one participant</span> is permitted from each team.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Camera className="w-5 h-5 text-blue-600 mt-0.5" />
                      <p>The <span className="font-bold">camera should be brought by the participant</span>.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                      <p>Before the event begins, the participants need to show the camera storage to ensure no preloaded photos or photos taken already are stored in the camera.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <FileEdit className="w-5 h-5 text-blue-600 mt-0.5" />
                      <p>Topic will be given on the spot. Based the topic the participants have click the photograph within the area given and in the presence of the event in-charge.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                      <p>After the given time all the participants should bring the camera to the organisers to share the photo taken.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <ImageIcon className="w-5 h-5 text-blue-600 mt-0.5" />
                      <p>Only <span className="font-bold">one photo</span> has to be submitted finally for judging by each participant.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Award className="w-5 h-5 text-blue-600 mt-0.5" />
                      <p>Judgement will be based on the Theme, clarity of the photo, elegance, aesthetic sense and overall impression.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* INDEP Director */}
          <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 shadow-sm mb-4 overflow-hidden">
            <button
              onClick={() => toggleSection('indepDirector')}
              className="w-full px-8 py-6 flex items-center justify-between hover:bg-slate-50 transition-colors duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                  <FilmIcon className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-slate-900">INDEP DIRECTOR (Screened only for Judges)</h3>
                  <div className="flex items-center space-x-4 text-sm text-slate-600">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Submission Deadline</span>
                    </span>
                  </div>
                </div>
              </div>
              {expandedSections.indepDirector ? (
                <ChevronUp className="w-6 h-6 text-slate-400" />
              ) : (
                <ChevronDown className="w-6 h-6 text-slate-400" />
              )}
            </button>

            {expandedSections.indepDirector && (
              <div className="px-8 pb-8">
                <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                  <div className="space-y-4 text-slate-700">
                    <div className="flex items-start space-x-3">
                      <User className="w-5 h-5 text-red-600 mt-0.5" />
                      <p>Only <span className="font-bold">one participant (Director of the film)</span> from each department.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Film className="w-5 h-5 text-red-600 mt-0.5" />
                      <p>The short film must be original. The film should have not been sent for any competition outside.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-red-600 mt-0.5" />
                      <p>The duration for the short film is <span className="font-bold">5 minutes</span>.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Type className="w-5 h-5 text-red-600 mt-0.5" />
                      <p>The language can be Tamil or English.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Video className="w-5 h-5 text-red-600 mt-0.5" />
                      <p>The short film has to be uploaded in YouTube in Private mode shared with indep@mail.sjctni.edu and the youtube link should be uploaded in the portal on or before 08-12-2025 on or before 5:00 p.m. Corrections (if any) will be informed on 09-12-2025.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Ban className="w-5 h-5 text-red-600 mt-0.5" />
                      <p>Presence of any form of vulgarity or obscenity will not be tolerated and will lead to direct disqualification.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Award className="w-5 h-5 text-red-600 mt-0.5" />
                      <p>The judgement will be based on theme, clarity, creativity and overall effect.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Calendar className="w-5 h-5 text-red-600 mt-0.5" />
                      <p>Last date for submission with correction (if any intimated) is 10.12.2025 at 5.00pm.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* PLEASE NOTE Section */}
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200 shadow-sm p-8 mb-8">
          <h3 className="text-xl font-bold text-slate-900 mb-6">PLEASE NOTE...</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-900">INDEP Portal URL</h4>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm break-all"
                  >
                    To be announced
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-green-600 mt-0.5" />
                <p className="text-slate-700">Registration and submission of contents for any event will be done only through the INDEP web portal.</p>
              </div>
              <div className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-green-600 mt-0.5" />
                <p className="text-slate-700">Official communication will be made through Whatsapp group created for INDEP 2025.</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-green-600 mt-0.5" />
                <p className="text-slate-700">Songs, Lyrics, Tunes, Products are registered on the basis of first come first served.</p>
              </div>
              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                <p className="text-slate-700">Drawing of Events lot will be held on 8-12-2025 (off-stage events) and 10.12.2025 (on stage events) at 3.00 p.m. in TV Hall.</p>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                <p className="text-slate-700">The final registration of participants should be done in the portal on or before 11:59 p.m, 08-12-2025 (Offline events) and 10-12-2025 (On-stage events).</p>
              </div>
              <div className="flex items-start space-x-3">
                <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                <p className="text-slate-700">Rules and Regulations, Events Timing is available on the INDEP portal.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-slate-600 text-sm py-6 border-t border-slate-200">
          <p className="mb-2">
            For any queries, contact Fine Arts Association Coordinator:
          </p>
          <div className="flex items-center justify-center space-x-2">
            <Phone className="w-4 h-4" />
            <p className="font-semibold text-slate-900 text-lg">
              Dr. A. Vimal Jerald - 9698111008
            </p>
          </div>
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