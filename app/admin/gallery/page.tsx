"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Trash2,
    Plus,
    Filter,
    Loader2,
    AlertCircle,
    ImageIcon,
    Calendar,
    Tag,
    Pencil,
    X,
    Save
} from "lucide-react";

interface GalleryItem {
    _id: string;
    title: string;
    src: string;
    category: string;
    year: string;
    alt?: string; // Added optional alt since we are editing it
    createdAt: string;
}

export default function ManageGalleryPage() {
    const [images, setImages] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [filterCategory, setFilterCategory] = useState("all");

    // --- Edit State ---
    const [editingImage, setEditingImage] = useState<GalleryItem | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editForm, setEditForm] = useState({
        title: "",
        category: "",
        year: "",
        alt: ""
    });

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const res = await fetch("/api/gallery");
            const data = await res.json();
            if (data.success) {
                setImages(data.data);
            } else {
                setError(data.error || "Failed to fetch images");
            }
        } catch (err) {
            setError("An error occurred while fetching images");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this image? This cannot be undone.")) return;

        setDeletingId(id);
        try {
            const res = await fetch(`/api/gallery/${id}`, {
                method: "DELETE",
            });
            const data = await res.json();

            if (data.success) {
                setImages(prev => prev.filter(img => img._id !== id));
            } else {
                alert(data.error || "Failed to delete image");
            }
        } catch (err) {
            alert("Error deleting image");
        } finally {
            setDeletingId(null);
        }
    };

    // --- Edit Handlers ---
    const handleEditClick = (image: GalleryItem) => {
        setEditingImage(image);
        setEditForm({
            title: image.title || "",
            category: image.category || "on-stage",
            year: image.year || new Date().getFullYear().toString(),
            alt: image.alt || ""
        });
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingImage) return;

        setIsSubmitting(true);
        try {
            const res = await fetch(`/api/gallery/${editingImage._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editForm),
            });

            const data = await res.json();

            if (data.success) {
                // Update local state immediately
                setImages((prev) =>
                    prev.map((img) =>
                        img._id === editingImage._id ? { ...img, ...editForm } : img
                    )
                );
                setEditingImage(null); // Close modal
            } else {
                alert(data.error || "Failed to update image");
            }
        } catch (error) {
            alert("An error occurred while updating");
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredImages = filterCategory === "all"
        ? images
        : images.filter(img => img.category === filterCategory);

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Manage Gallery</h1>
                        <p className="text-gray-500 mt-1">View, manage, and delete gallery images</p>
                    </div>
                    <Link
                        href="/admin/upload-gallery"
                        className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add New Image
                    </Link>
                </div>

                {/* Filters & Stats */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <ImageIcon className="w-4 h-4" />
                        <span>Total Items: <span className="font-semibold text-gray-900">{images.length}</span></span>
                    </div>

                    <div className="flex items-center gap-3">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="text-sm border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">All Categories</option>
                            <option value="on-stage">On Stage</option>
                            <option value="off-stage">Off Stage</option>
                            <option value="special">Special Moments</option>
                        </select>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        {error}
                    </div>
                )}

                {/* Grid */}
                {filteredImages.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ImageIcon className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No images found</h3>
                        <p className="text-gray-500 mt-1">Upload items to populate the gallery</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredImages.map((image) => (
                            <div key={image._id} className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden flex flex-col">
                                {/* Image Area */}
                                <div className="aspect-video bg-gray-100 relative overflow-hidden">
                                    <img
                                        src={image.src}
                                        alt={image.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Image+Not+Found';
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                </div>

                                {/* Content */}
                                <div className="p-4 flex-1 flex flex-col">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 line-clamp-1" title={image.title}>
                                            {image.title}
                                        </h3>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium">
                                                <Tag className="w-3 h-3" />
                                                {image.category}
                                            </span>
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-medium">
                                                <Calendar className="w-3 h-3" />
                                                {image.year}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                                        <span className="text-xs text-gray-400">
                                            {new Date(image.createdAt).toLocaleDateString()}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => handleEditClick(image)}
                                                className="text-gray-400 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                                                title="Edit Image"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(image._id)}
                                                disabled={deletingId === image._id}
                                                className="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                                                title="Delete Image"
                                            >
                                                {deletingId === image._id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* --- Edit Modal --- */}
            {editingImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between p-4 border-b border-gray-100">
                            <h3 className="font-semibold text-gray-900">Edit Image Details</h3>
                            <button
                                onClick={() => setEditingImage(null)}
                                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleUpdate} className="p-4 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={editForm.title}
                                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Category</label>
                                    <select
                                        value={editForm.category}
                                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                                    >
                                        <option value="on-stage">On Stage</option>
                                        <option value="off-stage">Off Stage</option>
                                        <option value="special">Special Moments</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Year</label>
                                    <input
                                        type="number"
                                        required
                                        value={editForm.year}
                                        onChange={(e) => setEditForm({ ...editForm, year: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Alt Text</label>
                                <textarea
                                    rows={2}
                                    value={editForm.alt}
                                    onChange={(e) => setEditForm({ ...editForm, alt: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                                />
                            </div>

                            <div className="pt-2 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setEditingImage(null)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Save className="w-4 h-4" />
                                    )}
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}