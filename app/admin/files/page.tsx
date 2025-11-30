"use client"
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Define the expected structure of a file record from the backend
interface FileData {
    _id: string;
    originalName: string;
    filename: string;
    fileType: string;
    size: number; // in bytes
    url: string; // e.g., /uploads/unique-name.pdf
    uploadedAt?: string;
}

// Configuration for the API endpoint (as defined in your system)
const API_ENDPOINT = '/api/admin/getFiles'; 

const App = () => {
    const [files, setFiles] = useState<FileData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // --- Helper Functions ---
    const formatBytes = (bytes: number, decimals = 2): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    /**
     * Fetches file data from the backend using Axios.
     */
    const fetchFiles = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // --- AXIOS IMPLEMENTATION ---
            const response = await axios.get(API_ENDPOINT);
            
            // Axios response data is directly accessible via response.data
            const data = response.data; 
            
            if (data.files && Array.isArray(data.files)) {
                setFiles(data.files);
            } else {
                setFiles([]);
            }

        } catch (err) {
            let errorMsg: string;

            if (axios.isAxiosError(err)) {
                // If it's an Axios error, get status and response message if available
                const status = err.response?.status;
                const message = err.response?.data?.message || err.message;
                errorMsg = `Fetch failed (Status: ${status || 'N/A'}): ${message}`;
            } else {
                // General error handling
                errorMsg = err instanceof Error ? err.message : 'An unknown error occurred while fetching files.';
            }

            setError(errorMsg);
            console.error('Axios Fetch Error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch data when the component mounts
    useEffect(() => {
        fetchFiles();
    }, [fetchFiles]);

    // --- Render Content ---

    const renderFileRows = () => {
        if (loading) {
            return (
                <tr>
                    <td colSpan={5} className="p-4 text-center text-gray-500">
                        <div className="flex items-center justify-center space-x-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                            <span>Loading file data...</span>
                        </div>
                    </td>
                </tr>
            );
        }

        if (error) {
            return (
                <tr>
                    <td colSpan={5} className="p-4 text-center text-red-600 font-medium bg-red-50 rounded-b-lg">
                        Error fetching data: {error}
                    </td>
                </tr>
            );
        }

        if (files.length === 0) {
            return (
                <tr>
                    <td colSpan={5} className="p-4 text-center text-gray-500 italic rounded-b-lg">
                        No files found in the database. Upload a file to see it here!
                    </td>
                </tr>
            );
        }

        return files.map((file) => (
            <tr key={file._id} className="border-b border-gray-100 hover:bg-gray-50 transition duration-150">
                <td className="p-4 text-gray-900 font-medium truncate max-w-xs">{file.originalName}</td>
                <td className="p-4 text-sm text-gray-500">{file.fileType.split('/')[1] || 'Unknown'}</td>
                <td className="p-4 text-sm text-gray-500">{formatBytes(file.size)}</td>
                <td className="p-4 text-sm text-gray-500">
                    {/* Display date if available, otherwise hide it or show fallback */}
                    {file.uploadedAt ? new Date(file.uploadedAt).toLocaleDateString() : 'N/A'}
                </td>
                <td className="p-4 text-right">
                    <a 
                        href={file.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-600 hover:text-blue-800 text-sm font-semibold transition"
                        // Prevents the link click from interfering with table interactions
                        onClick={(e) => e.stopPropagation()} 
                    >
                        View File
                    </a>
                </td>
            </tr>
        ));
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
            <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                <header className="p-6 border-b border-gray-200">
                    <h1 className="text-3xl font-extrabold text-gray-900">
                        Database File Explorer
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Viewing {files.length} files from the MongoDB storage.
                    </p>
                </header>
                
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">File Name</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded On</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {renderFileRows()}
                        </tbody>
                    </table>
                </div>

             
            </div>
        </div>
    );
};

export default App;