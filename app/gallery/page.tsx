'use client';
import { useState } from 'react';

// Mock gallery data - replace with actual images from your event
const galleryImages = [
    {
        id: 1,
        src: '/api/placeholder/400/300',
        alt: 'Cultural Performance 2024',
        category: 'on-stage',
        title: 'Classical Dance Performance',
        year: '2024'
    },
    {
        id: 2,
        src: '/api/placeholder/400/300',
        alt: 'Music Band Performance',
        category: 'on-stage',
        title: 'Rock Band Competition',
        year: '2024'
    },
    {
        id: 3,
        src: '/api/placeholder/400/300',
        alt: 'Drama Scene',
        category: 'on-stage',
        title: 'Street Play Finals',
        year: '2024'
    },
    {
        id: 4,
        src: '/api/placeholder/400/300',
        alt: 'Art Exhibition',
        category: 'off-stage',
        title: 'Fine Arts Display',
        year: '2024'
    },
    {
        id: 5,
        src: '/api/placeholder/400/300',
        alt: 'Photography Contest',
        category: 'off-stage',
        title: 'Photography Exhibition',
        year: '2024'
    },
    {
        id: 6,
        src: '/api/placeholder/400/300',
        alt: 'Literary Event',
        category: 'off-stage',
        title: 'Debate Competition',
        year: '2024'
    },
    {
        id: 7,
        src: '/api/placeholder/400/300',
        alt: 'Fashion Show',
        category: 'on-stage',
        title: 'Ramp Walk',
        year: '2023'
    },
    {
        id: 8,
        src: '/api/placeholder/400/300',
        alt: 'Quiz Competition',
        category: 'off-stage',
        title: 'General Quiz Finals',
        year: '2023'
    },
    {
        id: 9,
        src: '/api/placeholder/400/300',
        alt: 'Dance Group',
        category: 'on-stage',
        title: 'Western Dance',
        year: '2023'
    },
    {
        id: 10,
        src: '/api/placeholder/400/300',
        alt: 'Creative Writing',
        category: 'off-stage',
        title: 'Poetry Writing',
        year: '2023'
    },
    {
        id: 11,
        src: '/api/placeholder/400/300',
        alt: 'Singing Competition',
        category: 'on-stage',
        title: 'Solo Singing',
        year: '2023'
    },
    {
        id: 12,
        src: '/api/placeholder/400/300',
        alt: 'Prize Distribution',
        category: 'special',
        title: 'Winner Celebration',
        year: '2024'
    }
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
    const [selectedImage, setSelectedImage] = useState<any>(null);

    const filteredImages = galleryImages.filter(image => {
        const categoryMatch = selectedCategory === 'all' || image.category === selectedCategory;
        const yearMatch = selectedYear === 'all' || image.year === selectedYear;
        return categoryMatch && yearMatch;
    });

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
                            onClick={() => setSelectedImage(image)}
                        >
                            {/* Image Container */}
                            <div className="relative overflow-hidden aspect-[4/3] bg-gradient-to-br from-gray-200 to-gray-300">
                                {/* Placeholder for image - replace with actual Image component */}
                                <div className="w-full h-full flex items-center justify-center text-gray-500">
                                    🖼️ Image
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
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
                    <div className="relative max-w-4xl max-h-full">
                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute -top-12 right-0 text-white text-2xl hover:text-gray-300 transition-colors"
                        >
                            ✕
                        </button>

                        {/* Modal Content */}
                        <div className="bg-white rounded-2xl overflow-hidden">
                            <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                <div className="text-gray-500 text-lg">🖼️ {selectedImage.title}</div>
                            </div>

                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-800 mb-2">{selectedImage.title}</h3>
                                        <div className="flex items-center gap-4 text-gray-600">
                                            <span className="capitalize bg-gray-100 px-3 py-1 rounded-full text-sm">
                                                {selectedImage.category.replace('-', ' ')}
                                            </span>
                                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                                                INDEP {selectedImage.year}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-gray-600">
                                    Beautiful moment captured during INDEP {selectedImage.year}.
                                    This image showcases the incredible talent and spirit of our students.
                                </p>

                                <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                                    <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                                        ← Previous
                                    </button>
                                    <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                                        Next →
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}