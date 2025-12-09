"use client";

import React, { useState, useRef } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { CloudUpload, Download, RefreshCw, FileText, CheckCircle, AlertTriangle } from 'lucide-react';

// Helper function to format file size
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default function ZipDownloadPage() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isZipping, setIsZipping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function onFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFiles(e.target.files);
    setStatus(e.target.files?.length ? `Selected ${e.target.files.length} file(s). Ready to zip.` : null);
  }

  const sanitize = (n: string) => n.replace(/[/\\?%*:|"<>]/g, "_").replace(/\s+/g, "_");

  async function handleZip() {
    if (!files || files.length === 0) {
      setStatus("🚨 Please select files first.");
      return;
    }

    try {
      setIsZipping(true);
      setStatus("Creating zip...");
      const zip = new JSZip();

      for (const f of Array.from(files)) {
        const safeName = sanitize(f.name);
        // Extract teamId: Assumes it's the part before the first underscore or 'unknown'
        const teamId = safeName.includes("_") ? safeName.split("_")[0] : "unknown";

        // Add file under folder <teamId>/<filename>
        const folder = zip.folder(teamId)!;
        folder.file(safeName, await f.arrayBuffer());
      }

      const content = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: {
          level: 9
        }
      }, (meta) => {
        setStatus(`📦 Zipping... ${Math.round(meta.percent)}%`);
      });

      saveAs(content, `uploads_by_team_${Date.now()}.zip`);
      setStatus("✅ Download started successfully.");
    } catch (err: any) {
      console.error(err);
      setStatus("❌ Error: " + (err?.message || String(err)));
    } finally {
      setIsZipping(false);
    }
  }

  const handleReset = () => {
    setFiles(null);
    setStatus(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  // Determine status display style
  const statusClasses = status?.startsWith("✅") ? "bg-green-100 text-green-800 border-green-300" :
                        status?.startsWith("❌") || status?.startsWith("🚨") ? "bg-red-100 text-red-800 border-red-300" :
                        isZipping ? "bg-blue-100 text-blue-800 border-blue-300" :
                        "bg-gray-100 text-gray-700 border-gray-300";

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center p-8">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-xl p-8 space-y-6 border border-gray-200">
        
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Download className="w-6 h-6 mr-3 text-sky-600" />
          Team Upload Zipper
        </h1>

        <p className="text-gray-600">
          Upload files to automatically group them into folders based on the Team ID (the first part of the filename before the first underscore) and download as a single ZIP archive.
        </p>

        {/* --- File Input Section --- */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-sky-500 transition duration-150 relative">
            <input 
                ref={fileInputRef}
                type="file" 
                multiple 
                onChange={onFilesChange} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                aria-label="Upload files"
            />
            <div className="flex flex-col items-center justify-center text-center">
                <CloudUpload className="w-10 h-10 text-gray-400 mb-3" />
                <p className="text-lg font-medium text-gray-900">
                    Drag and drop files here, or <span className="text-sky-600 font-semibold cursor-pointer">click to browse</span>
                </p>
                <p className="text-sm text-gray-500 mt-1">Select multiple files (e.g., TeamA_file1.pdf, TeamB_report.docx)</p>
            </div>
        </div>
        
        {/* --- Controls and Status --- */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex gap-4">
            <button 
              onClick={handleZip} 
              disabled={!files || files.length === 0 || isZipping}
              className={`
                px-6 py-3 rounded-lg text-white font-semibold transition duration-150 shadow-md flex items-center justify-center
                ${!files || files.length === 0 || isZipping 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-sky-600 hover:bg-sky-700 active:bg-sky-800'}
              `}
            >
              {isZipping ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Zipping...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 mr-2" />
                  Download Grouped ZIP
                </>
              )}
            </button>
            <button 
              onClick={handleReset} 
              className="px-4 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition duration-150 flex items-center justify-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </button>
          </div>
          
          {status && (
            <div 
              className={`p-3 rounded-lg text-sm font-medium border w-full sm:w-auto mt-4 sm:mt-0 ${statusClasses}`}
            >
              {status}
            </div>
          )}
        </div>

        {/* --- Selected Files List --- */}
        {files && files.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
              <FileText className="w-4 h-4 inline mr-2 text-sky-600" />
              Selected Files ({files.length})
            </h2>
            <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {Array.from(files).map((f, i) => (
                <li key={i} className="flex justify-between items-center text-gray-700 text-sm p-2 rounded-md transition duration-100 hover:bg-gray-50">
                  <span className="truncate flex-1">{f.name}</span>
                  <span className="ml-4 font-mono text-xs bg-gray-100 px-2 py-1 rounded-full">{formatFileSize(f.size)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}