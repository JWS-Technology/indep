'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Loader2, Calendar, Tag } from 'lucide-react';

// ---------------- TYPES -----------------

type GalleryImage = {
    _id: string;
    src: string;
    alt: string;
    category: string;
    title: string;
    year: string;
};

const years = ['2025', '2024', '2023', '2022'];

export default function Gallery() {
    // Data State
    const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);

    // UI State
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedYear, setSelectedYear] = useState<string>('all');
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

    // Mobile Swipe State
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    // ---------------- FETCH DATA -----------------
    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await fetch('/api/gallery');
                const result = await response.json();
                if (result.success) {
                    setGalleryImages(result.data);
                }
            } catch (error) {
                console.error('Failed to fetch gallery:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchImages();
    }, []);

    // ---------------- CALCULATIONS -----------------

    const categories = [
        { id: 'all', name: 'All Events', count: galleryImages.length },
        { id: 'on-stage', name: 'On Stage', count: galleryImages.filter(img => img.category === 'on-stage').length },
        { id: 'off-stage', name: 'Off Stage', count: galleryImages.filter(img => img.category === 'off-stage').length },
        { id: 'special', name: 'Special Moments', count: galleryImages.filter(img => img.category === 'special').length },
    ];

    const filteredImages = galleryImages.filter(image => {
        const categoryMatch = selectedCategory === 'all' || image.category === selectedCategory;
        const yearMatch = selectedYear === 'all' || image.year === selectedYear;
        return categoryMatch && yearMatch;
    });

    // ---------------- NAVIGATION LOGIC -----------------

    const openModal = (image: GalleryImage) => {
        setSelectedImage(image);
        const index = filteredImages.findIndex(img => img._id === image._id);
        setCurrentImageIndex(index);
        document.body.style.overflow = 'hidden'; // Prevent scrolling background
    };

    const closeModal = useCallback(() => {
        setSelectedImage(null);
        setCurrentImageIndex(0);
        document.body.style.overflow = 'unset'; // Restore scrolling
    }, []);

    const goToPrevious = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        const newIndex = currentImageIndex === 0 ? filteredImages.length - 1 : currentImageIndex - 1;
        setCurrentImageIndex(newIndex);
        setSelectedImage(filteredImages[newIndex]);
    }, [currentImageIndex, filteredImages]);

    const goToNext = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        const newIndex = currentImageIndex === filteredImages.length - 1 ? 0 : currentImageIndex + 1;
        setCurrentImageIndex(newIndex);
        setSelectedImage(filteredImages[newIndex]);
    }, [currentImageIndex, filteredImages]);

    // ---------------- KEYBOARD & SWIPE -----------------

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!selectedImage) return;
            if (e.key === 'Escape') closeModal();
            if (e.key === 'ArrowLeft') goToPrevious();
            if (e.key === 'ArrowRight') goToNext();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedImage, goToNext, goToPrevious, closeModal]);

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) goToNext();
        if (isRightSwipe) goToPrevious();
    };

    // ---------------- RENDER -----------------

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br mt-20 from-gray-50 to-blue-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* HEADER */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
                        INDEP <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Gallery</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Relive the magical moments from past INDEP editions.
                    </p>
                </div>

                {/* FILTERS */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100 mb-8  top-20 z-10">
                    <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                        {/* Categories */}
                        <div className="flex-1 w-full overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
                            <div className="flex gap-2 min-w-max">
                                {categories.map(category => (
                                    <button
                                        key={category.id}
                                        onClick={() => setSelectedCategory(category.id)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border
                                            ${selectedCategory === category.id
                                                ? 'bg-gray-900 text-white border-gray-900'
                                                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}
                                    >
                                        {category.name}
                                        <span className={`ml-2 text-xs opacity-60`}>
                                            {category.count}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Years */}
                        <div className="w-full lg:w-48">
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer hover:border-gray-400 transition-colors"
                            >
                                <option value="all">All Years</option>
                                {years.map(year => (
                                    <option key={year} value={year}>INDEP {year}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* GALLERY GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-12">
                    {filteredImages.map((image) => (
                        <div
                            key={image._id}
                            className="group cursor-pointer relative aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                            onClick={() => openModal(image)}
                        >
                            <Image
                                src={image.src}
                                alt={image.alt}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                <h3 className="text-white font-medium text-sm truncate">{image.title}</h3>
                                <p className="text-white/80 text-xs mt-1 capitalize">{image.category.replace('-', ' ')}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* EMPTY STATE */}
                {filteredImages.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <SearchIcon className="w-6 h-6 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">No images found</h3>
                        <p className="text-gray-500 text-sm mb-6">Try adjusting your filters</p>
                        <button
                            onClick={() => { setSelectedCategory('all'); setSelectedYear('all'); }}
                            className="px-5 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                        >
                            Reset Filters
                        </button>
                    </div>
                )}
            </div>

            {/* IMMERSIVE MODAL */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md animate-in fade-in duration-200"
                    onClick={closeModal}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {/* Close Button - Floating Top Right */}
                    <button
                        onClick={closeModal}
                        className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-sm"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* Navigation Buttons (Hidden on Mobile) */}
                    {filteredImages.length > 1 && (
                        <>
                            <button
                                onClick={goToPrevious}
                                className="hidden md:flex absolute left-4 z-50 p-3 bg-black/20 hover:bg-white/10 text-white rounded-full transition-all backdrop-blur-sm group"
                            >
                                <ChevronLeft className="w-8 h-8 group-hover:-translate-x-0.5 transition-transform" />
                            </button>
                            <button
                                onClick={goToNext}
                                className="hidden md:flex absolute right-4 z-50 p-3 bg-black/20 hover:bg-white/10 text-white rounded-full transition-all backdrop-blur-sm group"
                            >
                                <ChevronRight className="w-8 h-8 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        </>
                    )}

                    {/* Main Image Container */}
                    <div
                        className="relative w-full h-full max-w-7xl max-h-screen p-4 flex flex-col items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative w-full h-full flex items-center justify-center">
                            <Image
                                src={selectedImage.src}
                                alt={selectedImage.alt}
                                width={1920}
                                height={1080}
                                className="max-w-full max-h-[85vh] w-auto md:w-[80vw] h-auto object-contain shadow-2xl rounded-sm select-none"
                                priority
                            />
                        </div>

                        {/* Caption Overlay (Bottom) */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-white backdrop-blur-[1px]">
                            <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
                                <div>
                                    <h2 className="text-xl md:text-2xl font-bold mb-2">{selectedImage.title}</h2>
                                    <div className="flex items-center gap-4 text-sm text-gray-300">
                                        <span className="flex items-center gap-1.5 capitalize bg-white/10 px-3 py-1 rounded-full">
                                            <Tag className="w-3.5 h-3.5" />
                                            {selectedImage.category.replace('-', ' ')}
                                        </span>
                                        <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {selectedImage.year}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-400 font-mono">
                                    {currentImageIndex + 1} / {filteredImages.length}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Helper Icon for empty state
function SearchIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    )
}