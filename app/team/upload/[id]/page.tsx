"use client"
import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { useParams } from 'next/navigation';

// --- Configuration ---
const MAX_RETRIES = 3;

// --- Helper function for Exponential Backoff ---
const sleep = (ms: number): Promise<void> =>
    new Promise<void>((resolve) => setTimeout(resolve, ms));


// --- Main Application Component ---
const App = () => {
    const [fileType, setfileType] = useState("")
    const [fileSize, setfileSize] = useState(0);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [attemptCount, setAttemptCount] = useState(0);
    const [teamData, setteamData] = useState('')
    const [eventName, seteventName] = useState("")

    const params = useParams();


    useEffect(() => {
        const getMe = async () => {
            const response = await axios.get("/api/me")
            setteamData(response.data.team);
        }
        getMe();
    }, [])

    useEffect(() => {
        const getEvent = async () => {
            const response = await axios.get(`/api/events/${params.id}`)
            // setteamData(response.data.team);
            // console.log(response.data.event.title)
            seteventName(response.data.event.title);
        }
        getEvent();
    }, [params.id])

    // --- 1. The Core Upload Logic (using Axios and Retry) ---
    const uploadFileToServer = async (file: File) => {
        setUploadStatus("loading");
        setErrorMessage("");

        const base64String = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve((reader.result as string).split(",")[1]);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
        console.log("Sending req")
        try {
            const response = await axios.post(`/api/upload/`, {
                fileType: fileType,
                fileSize: fileSize,
                fileName: file.name,
                teamData: teamData,
                data: base64String,     // <-- BASE64 JSON
                eventName: eventName
            });

            console.log("Success:", response.data);
            setUploadStatus("success");
        } catch (err: any) {
            console.log(err);
            console.log(err.message);
            setUploadStatus("error");
        }
    };

    // --- 2. Handle file drop/selection ---
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file: File = acceptedFiles[0];
            setfileSize(file.size)
            setfileType(file.type)
            setUploadedFile(file);
            setUploadStatus('idle'); // wait for user to press Upload
            setErrorMessage('');
        }
    }, []);

    // --- 3. Configure the dropzone hook ---
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        accept: {
            'image/*': ['.jpeg', '.png', '.jpg'],
            'application/pdf': ['.pdf'],
            'audio/*': ['.mp3'],                         // Allow MP3
            'video/*': ['.mp4', '.mov', '.avi', '.mkv'], // Allow all common video formats
        },
        onDropRejected: (rejectedFiles) => {
            if (rejectedFiles.length > 0) {
                const file = rejectedFiles[0].file;
                let rejectReason = "File rejected.";

                if (rejectedFiles[0].errors.some(e => e.code === 'file-invalid-type')) {
                    rejectReason = "Invalid file type. Only JPG, PNG, and PDF are allowed.";
                } else {
                    rejectReason = `File rejected: ${rejectedFiles[0].errors.map(e => e.message).join(', ')}`;
                }

                setUploadedFile(file);
                setErrorMessage(rejectReason);
                setUploadStatus('error');
            }
        }
    });

    // --- 4. Determine the dynamic styling and content ---
    let zoneClasses = 'p-10 border-4 rounded-xl transition-colors duration-300 cursor-pointer text-center w-full ';

    if (isDragActive) {
        zoneClasses += 'border-green-500 bg-green-50 text-green-700';
    } else if (uploadStatus === 'success') {
        zoneClasses += 'border-emerald-500 bg-emerald-100 text-emerald-700 shadow-lg';
    } else if (uploadStatus === 'error') {
        zoneClasses += 'border-red-500 bg-red-100 text-red-700 shadow-lg';
    } else {
        zoneClasses += 'border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50';
    }

    // --- 5. Render content based on status ---
    const renderContent = () => {
        if (uploadStatus === 'loading') {
            return (
                <>
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
                    <p className="font-semibold text-blue-700">Uploading... {uploadedFile?.name ?? 'File'}</p>
                    <p className="text-xs text-gray-500 mt-1">Attempt {attemptCount} of {MAX_RETRIES}. Please wait.</p>
                </>
            );
        }

        if (uploadStatus === 'success' && uploadedFile) {
            return (
                <>
                    <svg className="w-10 h-10 mx-auto mb-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <p className="text-xl font-bold">Upload Successful!</p>
                    <p className="text-sm text-gray-700 mt-1 truncate max-w-full">File: <span className="font-mono">{uploadedFile.name}</span></p>
                    <div className="flex items-center justify-center gap-3 mt-4">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setUploadedFile(null);
                                setUploadStatus('idle');
                                setErrorMessage('');
                            }}
                            className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg shadow-md hover:bg-emerald-700 transition"
                        >
                            Upload Another File
                        </button>
                    </div>
                </>
            );
        }

        if (uploadStatus === 'error' && uploadedFile) {
            return (
                <>
                    <svg className="w-10 h-10 mx-auto mb-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <p className="text-xl font-bold">Upload Failed!</p>
                    <p className="text-sm text-red-800 mt-2 font-mono break-words max-w-full">
                        {errorMessage || "An unexpected error occurred."}
                    </p>
                    <div className="flex items-center justify-center gap-3 mt-4">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setUploadStatus('idle');
                                setErrorMessage('');
                            }}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg shadow-md hover:bg-red-700 transition"
                        >
                            Try Again
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setUploadedFile(null);
                                setUploadStatus('idle');
                                setErrorMessage('');
                            }}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg shadow-sm hover:bg-gray-300 transition"
                        >
                            Choose Another
                        </button>
                    </div>
                </>
            );
        }

        // Default or Drag Active state
        return (
            <>
                <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.885-3.885M17 16a4 4 0 00.885-3.885M12 16h.01M12 16V4M12 4L8 8M12 4l4 4"></path></svg>
                <p className="mb-2 text-lg font-semibold text-gray-700">
                    {isDragActive ? 'Drop the file here...' : 'Drag & Drop your file here'}
                </p>
                <p className="text-sm text-gray-500">
                    or <strong>click to select</strong> from your device
                </p>
            </>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-2xl">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
                    Universal File Uploader
                </h1>

                <div {...getRootProps()} className={zoneClasses}>
                    <input {...getInputProps()} />
                    {renderContent()}

                    {/* Show selected file name and Upload button when a file is chosen and status is idle */}
                    {uploadedFile && uploadStatus === 'idle' && (
                        <div className="mt-4 flex flex-col items-center gap-3">
                            <p className="text-sm text-gray-700 truncate max-w-full">Selected: <span className="font-mono">{uploadedFile.name}</span></p>
                            <div className="flex gap-3">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // start upload
                                        uploadFileToServer(uploadedFile);
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition"
                                >
                                    Upload File
                                </button>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setUploadedFile(null);
                                        setUploadStatus('idle');
                                        setErrorMessage('');
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg shadow-sm hover:bg-gray-300 transition"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default App;
