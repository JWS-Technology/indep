"use client";
import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

interface FileUploaderProps {
    teamId: string;
    teamName: string;
    eventName: string;
    eventId: string | null;
}

const FileUploader: React.FC<FileUploaderProps> = ({
    teamId,
    teamName,
    eventName,
    eventId,
}) => {
    console.log(teamId, teamName, eventName, eventId);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState<
        "idle" | "loading" | "success" | "error"
    >("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const [fileType, setFileType] = useState("");
    const [fileSize, setFileSize] = useState(0);

    // 📌 Upload function moved into component
    const uploadFileToServer = async (file: File) => {
        setUploadStatus("loading");
        setErrorMessage("");

        try {
            const form = new FormData();
            form.append("file", file);
            form.append("teamId", teamId);
            form.append("teamName", teamName);
            form.append("eventName", eventName);

            const response = await axios.post(
                "/api/upload",
                form,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            console.log(response.data);
            setUploadStatus("success");

        } catch (err: any) {
            console.log(err);
            setUploadStatus("error");
            setErrorMessage(err.message || "Upload failed");
        }
    };

    // 📌 Dropzone
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setUploadedFile(file);
            setFileType(file.type);
            setFileSize(file.size);
            setUploadStatus("idle");
            setErrorMessage("");
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: true,
        // accept: {
        //     "image/*": [".jpg", ".jpeg", ".png"],
        //     "application/pdf": [".pdf"],
        //     "audio/*": [".mp3"],
        //     "video/*": [".mp4", ".mov", ".avi", ".mkv"],
        // },
    });

    // --- Dynamic UI Classes ---
    let zoneClasses =
        "p-10 border-4 rounded-xl transition-colors duration-300 cursor-pointer text-center w-full ";

    if (isDragActive)
        zoneClasses += "border-green-500 bg-green-50 text-green-700";
    else if (uploadStatus === "success")
        zoneClasses += "border-emerald-500 bg-emerald-100 text-emerald-700 shadow";
    else if (uploadStatus === "error")
        zoneClasses += "border-red-500 bg-red-100 text-red-700 shadow";
    else
        zoneClasses +=
            "border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50";

    return (
        <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-xl mx-auto">
            <h2 className="text-xl font-bold mb-5 text-center">
                Upload File for {eventName}
            </h2>

            <div {...getRootProps()} className={zoneClasses}>
                <input {...getInputProps()} />

                {/* --- Upload Status UI --- */}
                {uploadStatus === "loading" && (
                    <p className="text-blue-600 font-semibold">Uploading...</p>
                )}

                {uploadStatus === "success" && (
                    <p className="text-green-600 font-semibold">Upload Successful!</p>
                )}

                {uploadStatus === "error" && (
                    <p className="text-red-600 font-semibold">{errorMessage}</p>
                )}

                {/* Default UI */}
                {uploadStatus === "idle" && (
                    <p className="text-gray-700">
                        {isDragActive
                            ? "Drop your file here…"
                            : "Drag & Drop file or click to select"}
                    </p>
                )}

                {/* Upload Button */}
                {uploadedFile && uploadStatus === "idle" && (
                    <div className="mt-4 flex flex-col gap-3">
                        <p className="text-sm text-gray-600 text-center truncate">
                            Selected: <strong>{uploadedFile.name}</strong>
                        </p>

                        <button
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg w-full hover:bg-blue-700"
                            onClick={(e) => {
                                e.stopPropagation();
                                uploadFileToServer(uploadedFile);
                            }}
                        >
                            Upload File
                        </button>

                        <button
                            className="px-4 py-2 bg-gray-200 rounded-lg w-full hover:bg-gray-300"
                            onClick={(e) => {
                                e.stopPropagation();
                                setUploadedFile(null);
                                setUploadStatus("idle");
                            }}
                        >
                            Remove
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileUploader;
