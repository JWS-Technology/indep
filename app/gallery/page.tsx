'use client';
import { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

// Mock gallery data - replace with actual images from your event
const galleryImages = [
    {
        id: 1,
        src: 'https://www.sjctni.edu/img/EventGallery/images/24_Indep2k24/P1219056.jpg',
        alt: 'Cultural Performance 2024',
        category: 'on-stage',
        title: 'Classical Dance Performance',
        year: '2024'
    },
    {
        id: 2,
        src: 'https://www.sjctni.edu/img/EventGallery/images/24_Indep2k24/P1229475.jpg',
        alt: 'Music Band Performance',
        category: 'on-stage',
        title: 'Rock Band Competition',
        year: '2024'
    },
    {
        id: 3,
        src: 'https://www.sjctni.edu/img/EventGallery/images/24_Indep2k24/IMG_8706.jpg',
        alt: 'Drama Scene',
        category: 'on-stage',
        title: 'Street Play Finals',
        year: '2024'
    },
    {
        id: 4,
        src: 'https://www.sjctni.edu/img/EventGallery/images/24_Indep2k24/IMG_8805.jpg',
        alt: 'Art Exhibition',
        category: 'off-stage',
        title: 'Fine Arts Display',
        year: '2024'
    },
];

const categories = [
    { id: 'all', name: 'All Events', count: galleryImages.length },
    { id: 'on-stage', name: 'On Stage', count: galleryImages.filter(img => img.category === 'on-stage').length },
    { id: 'off-stage', name: 'Off Stage', count: galleryImages.filter(img => img.category === 'off-stage').length },
    { id: 'special', name: 'Special Moments', count: galleryImages.filter(img => img.category === 'special').length }
];

const years = ['2024', '2023', '2022'];

export default function Gallery() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedYear, setSelectedYear] = useState('2024');
    const [selectedImage, setSelectedImage] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const filteredImages = galleryImages.filter(image => {
        const categoryMatch = selectedCategory === 'all' || image.category === selectedCategory;
        const yearMatch = selectedYear === 'all' || image.year === selectedYear;
        return categoryMatch && yearMatch;
    });

    const openModal = (image) => {
        setSelectedImage(image);
        const index = filteredImages.findIndex(img => img.id === image.id);
        setCurrentImageIndex(index);
    };

    const closeModal = () => {
        setSelectedImage(null);
        setCurrentImageIndex(0);
    };

    const goToPrevious = () => {
        const newIndex = currentImageIndex === 0 ? filteredImages.length - 1 : currentImageIndex - 1;
        setCurrentImageIndex(newIndex);
        setSelectedImage(filteredImages[newIndex]);
    };

    const goToNext = () => {
        const newIndex = currentImageIndex === filteredImages.length - 1 ? 0 : currentImageIndex + 1;
        setCurrentImageIndex(newIndex);
        setSelectedImage(filteredImages[newIndex]);
    };

    // Handle keyboard navigation
    const handleKeyDown = (e) => {
        if (!selectedImage) return;

        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowLeft') goToPrevious();
        if (e.key === 'ArrowRight') goToNext();
    };

    // Add event listener for keyboard navigation
    useState(() => {
        if (selectedImage) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [selectedImage]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-black text-gray-800 mb-4">
                        INDEP <span className="gradient-text">Gallery</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Relive the magical moments from past INDEP editions.
                        A visual journey through creativity, talent, and unforgettable memories.
                    </p>
                </div>

                {/* Filters Section */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
                    <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">

                        {/* Category Filter */}
                        <div className="flex-1 w-full">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Filter by Category
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {categories.map(category => (
                                    <button
                                        key={category.id}
                                        onClick={() => setSelectedCategory(category.id)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedCategory === category.id
                                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {category.name}
                                        <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${selectedCategory === category.id ? 'bg-white/20' : 'bg-gray-300'
                                            }`}>
                                            {category.count}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Year Filter */}
                        <div className="lg:w-48">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Filter by Year
                            </label>
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            >
                                <option value="all">All Years</option>
                                {years.map(year => (
                                    <option key={year} value={year}>INDEP {year}</option>
                                ))}
                            </select>
                        </div>

                    </div>
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                    {filteredImages.map((image) => (
                        <div
                            key={image.id}
                            className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover-lift transition-all duration-300"
                            onClick={() => openModal(image)}
                        >
                            {/* Image Container */}
                            <div className="relative overflow-hidden aspect-[4/3] bg-gradient-to-br from-gray-200 to-gray-300">
                                <div className="relative w-full h-full">
                                    <Image
                                        src={image.src}
                                        alt={image.alt}
                                        fill
                                        className="object-cover transform group-hover:scale-110 transition-transform duration-500"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                </div>

                                {/* Overlay on Hover */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                                    <div className="p-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        <h3 className="font-bold text-lg mb-1">{image.title}</h3>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="capitalize">{image.category.replace('-', ' ')}</span>
                                            <span className="bg-white/20 px-2 py-1 rounded-full">INDEP {image.year}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick View Indicator */}
                                <div className="absolute top-4 right-4 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <span className="text-lg">🔍</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredImages.length === 0 && (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">📷</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-700 mb-2">No images found</h3>
                        <p className="text-gray-500 mb-6">Try adjusting your filters to see more results.</p>
                        <button
                            onClick={() => {
                                setSelectedCategory('all');
                                setSelectedYear('all');
                            }}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover-lift"
                        >
                            Reset Filters
                        </button>
                    </div>
                )}

                {/* Call to Action */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
                    <h2 className="text-3xl font-bold mb-4">Share Your INDEP Moments!</h2>
                    <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                        Have photos from previous INDEP events? Contribute to our gallery and help us preserve these precious memories.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="px-8 py-3 bg-white text-blue-600 rounded-xl font-semibold hover-lift">
                            Submit Photos
                        </button>
                        <button className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-colors">
                            Follow on Instagram
                        </button>
                    </div>
                </div>

            </div>

            {/* Image Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
                    onClick={closeModal}
                >
                    <div
                        className="relative max-w-6xl w-full max-h-[90vh] bg-white rounded-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header Bar */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
                            <div className="flex items-center space-x-4">
                                <h3 className="text-xl font-bold text-gray-800">
                                    {selectedImage.title}
                                </h3>
                                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                                    INDEP {selectedImage.year}
                                </span>
                            </div>

                            {/* Close Button */}
                            <button
                                onClick={closeModal}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                            >
                                <X className="w-6 h-6 text-gray-600 group-hover:text-gray-800" />
                            </button>
                        </div>

                        {/* Image Viewer */}
                        <div className="relative bg-black flex items-center justify-center min-h-[400px] max-h-[70vh]">
                            {/* Navigation Arrows */}
                            {filteredImages.length > 1 && (
                                <>
                                    <button
                                        onClick={goToPrevious}
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110 z-10"
                                    >
                                        <ChevronLeft className="w-6 h-6 text-gray-800" />
                                    </button>

                                    <button
                                        onClick={goToNext}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110 z-10"
                                    >
                                        <ChevronRight className="w-6 h-6 text-gray-800" />
                                    </button>
                                </>
                            )}

                            {/* Main Image */}
                            <div className="relative w-full h-full max-w-4xl max-h-[70vh] flex items-center justify-center">
                                <Image
                                    src={selectedImage.src}
                                    alt={selectedImage.alt}
                                    width={1200}
                                    height={800}
                                    className="max-w-full max-h-full object-contain"
                                    priority
                                />
                            </div>

                            {/* Image Counter */}
                            {filteredImages.length > 1 && (
                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium">
                                    {currentImageIndex + 1} / {filteredImages.length}
                                </div>
                            )}
                        </div>

                        {/* Image Info */}
                        <div className="p-6 bg-white">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <span className="capitalize bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                                        {selectedImage.category.replace('-', ' ')}
                                    </span>
                                </div>

                                {/* Keyboard Hint */}
                                <div className="text-sm text-gray-500 hidden md:block">
                                    Press ← → to navigate, ESC to close
                                </div>
                            </div>

                            <p className="text-gray-600 leading-relaxed">
                                Beautiful moment captured during INDEP {selectedImage.year}.
                                This image showcases the incredible talent and spirit of our students
                                participating in cultural events and competitions.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}