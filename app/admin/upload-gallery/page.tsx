"use client";

import { useState, useCallback } from "react";
// Removed next/navigation to ensure compatibility with the preview environment
// import { useRouter } from "next/navigation"; 
import { useDropzone } from "react-dropzone";
import axios from "axios";
import {
    Image as ImageIcon,
    Link as LinkIcon,
    UploadCloud,
    Check,
    Loader2,
    ChevronLeft,
    AlertCircle
} from "lucide-react";

export default function UploadGalleryPage() {
    // const router = useRouter(); // Replaced with window.history for standalone compatibility
    const [activeTab, setActiveTab] = useState<"link" | "upload">("link");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        category: "on-stage",
        year: "2024",
        alt: "",
        src: "",
    });

    // File Upload State
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    // --- Handlers ---

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            setUploadedFile(file);
            if (!formData.title) {
                const name = file.name.split('.')[0].replace(/[_-]/g, ' ');
                setFormData(prev => ({ ...prev, title: name }));
            }
        }
    }, [formData.title]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpeg', '.png', '.jpg', '.webp'] },
        multiple: false
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            let finalImageUrl = formData.src;

            // 1. Handle File Upload (if active)
            if (activeTab === "upload") {
                if (!uploadedFile) {
                    throw new Error("Please select an image file to upload");
                }

                const uploadData = new FormData();
                uploadData.append("mediaFile", uploadedFile);

                console.log("Starting upload...");

                // Upload to /api/upload
                const uploadRes = await axios.post("/api/upload", uploadData, {
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
                        setUploadProgress(percentCompleted);
                    },
                });

                console.log("Upload Response Data:", uploadRes.data);
                const responseData = uploadRes.data;

                // ROBUST URL DETECTION:
                // We check multiple common keys. We also handle if responseData.data is the URL itself or an object.

                // 1. Try flat keys
                finalImageUrl = responseData.url ||
                    responseData.secure_url ||
                    responseData.link ||
                    responseData.fileUrl ||
                    responseData.path;

                // 2. Check inside 'file' object (Matches your API structure: { message: "...", file: { url: "..." } })
                if (!finalImageUrl && responseData.file) {
                    finalImageUrl = responseData.file.url || responseData.file.path || responseData.file.link;
                }

                // 3. Check inside 'data' object (Common convention)
                if ((!finalImageUrl || typeof finalImageUrl === 'object') && responseData.data) {
                    if (typeof responseData.data === 'string') {
                        finalImageUrl = responseData.data;
                    } else if (typeof responseData.data === 'object') {
                        // Nested inside data: { url: "..." }
                        finalImageUrl = responseData.data.url ||
                            responseData.data.link ||
                            responseData.data.secure_url ||
                            responseData.data.fileUrl ||
                            responseData.data.path;
                    }
                }

                if (!finalImageUrl) {
                    console.error("Could not find URL in response:", responseData);
                    // Include the response in the error message for easy debugging
                    throw new Error(`Upload successful, but failed to retrieve URL. Server Response: ${JSON.stringify(responseData).substring(0, 150)}...`);
                }

                console.log("Extracted Image URL:", finalImageUrl);
            } else {
                // Validate Link
                if (!formData.src) throw new Error("Please enter an image URL");
            }

            // 2. Save Metadata to /api/gallery
            const galleryData = {
                ...formData,
                src: finalImageUrl,
                alt: formData.alt || formData.title, // Fallback if alt is empty
            };

            console.log("Submitting Gallery Data:", galleryData);

            const res = await fetch("/api/gallery", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(galleryData),
            });

            const data = await res.json();

            // Check for API errors
            if (!res.ok || !data.success) {
                // If the error contains validation details, show them
                if (data.details && data.details.src) {
                    throw new Error(`Server Validation: ${data.details.src.message}`);
                }
                throw new Error(data.error || "Failed to save gallery item (Server Error)");
            }

            setMessage({ type: "success", text: "Image added to gallery successfully!" });

            // Reset Form
            setFormData({
                title: "",
                category: "on-stage",
                year: "2024",
                alt: "",
                src: "",
            });
            setUploadedFile(null);
            setUploadProgress(0);

            // Optional: Redirect
            // setTimeout(() => router.push('/admin/gallery'), 1500);

        } catch (error: any) {
            console.error("Submission error:", error);
            const errorMsg = error.response?.data?.message || error.message || "An unexpected error occurred";
            setMessage({ type: "error", text: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
            <div className="max-w-3xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <button
                            onClick={() => window.history.back()}
                            className="flex items-center text-gray-500 hover:text-gray-700 transition-colors mb-2"
                        >
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Back
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900">Upload to Gallery</h1>
                        <p className="text-gray-500 mt-1">Add new memories to the INDEP gallery</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">

                    {/* Tabs */}
                    <div className="flex border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab("link")}
                            className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-all
                ${activeTab === "link"
                                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                }`}
                        >
                            <LinkIcon className="w-4 h-4" />
                            Provide URL
                        </button>
                        <button
                            onClick={() => setActiveTab("upload")}
                            className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-all
                ${activeTab === "upload"
                                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                }`}
                        >
                            <UploadCloud className="w-4 h-4" />
                            Upload File
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-8">

                        {/* Image Input Section */}
                        <div className="space-y-4">
                            <label className="block text-sm font-semibold text-gray-700">Image Source</label>

                            {activeTab === "link" ? (
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <LinkIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="url"
                                        name="src"
                                        value={formData.src}
                                        onChange={handleInputChange}
                                        placeholder="https://example.com/image.jpg"
                                        className="pl-10 block w-full rounded-xl border-gray-300 bg-gray-50 border focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent py-3 transition-all"
                                    />
                                </div>
                            ) : (
                                <div
                                    {...getRootProps()}
                                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
                    ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"}
                    ${uploadedFile ? "bg-green-50 border-green-500" : ""}
                  `}
                                >
                                    <input {...getInputProps()} />
                                    {uploadedFile ? (
                                        <div className="flex flex-col items-center">
                                            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-3">
                                                <Check className="w-6 h-6" />
                                            </div>
                                            <p className="font-medium text-green-800">{uploadedFile.name}</p>
                                            <p className="text-xs text-green-600 mt-1">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); setUploadedFile(null); }}
                                                className="mt-3 text-xs text-red-500 hover:text-red-700 font-medium underline"
                                            >
                                                Remove file
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center text-gray-500">
                                            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 mb-3">
                                                <ImageIcon className="w-6 h-6" />
                                            </div>
                                            <p className="font-medium text-gray-700">Click to upload or drag and drop</p>
                                            <p className="text-xs mt-1">SVG, PNG, JPG or GIF (max. 10MB)</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Metadata Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Title / Caption</label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Cultural Dance Performance"
                                    className="w-full rounded-xl border-gray-300 bg-gray-50 border focus:bg-white focus:ring-2 focus:ring-blue-500 py-2.5 px-4 transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Alt Text</label>
                                <input
                                    type="text"
                                    name="alt"
                                    value={formData.alt}
                                    onChange={handleInputChange}
                                    placeholder="Describe image for accessibility"
                                    className="w-full rounded-xl border-gray-300 bg-gray-50 border focus:bg-white focus:ring-2 focus:ring-blue-500 py-2.5 px-4 transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full rounded-xl border-gray-300 bg-gray-50 border focus:bg-white focus:ring-2 focus:ring-blue-500 py-2.5 px-4 transition-all"
                                >
                                    <option value="on-stage">On Stage</option>
                                    <option value="off-stage">Off Stage</option>
                                    <option value="special">Special Moments</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Event Year</label>
                                <select
                                    name="year"
                                    value={formData.year}
                                    onChange={handleInputChange}
                                    className="w-full rounded-xl border-gray-300 bg-gray-50 border focus:bg-white focus:ring-2 focus:ring-blue-500 py-2.5 px-4 transition-all"
                                >
                                    <option value="2025">2025</option>
                                    <option value="2024">2024</option>
                                    <option value="2023">2023</option>
                                    <option value="2022">2022</option>
                                </select>
                            </div>

                        </div>

                        {/* Submit Button & Messages */}
                        <div className="pt-4 border-t border-gray-100">

                            {message && (
                                <div className={`p-4 rounded-xl flex items-center gap-3 mb-6 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                    }`}>
                                    {message.type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                    <p className="font-medium text-sm">{message.text}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        {activeTab === 'upload' && uploadProgress > 0 && uploadProgress < 100
                                            ? `Uploading ${uploadProgress}%...`
                                            : "Processing..."}
                                    </>
                                ) : (
                                    <>
                                        <UploadCloud className="w-5 h-5" />
                                        Upload to Gallery
                                    </>
                                )}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}