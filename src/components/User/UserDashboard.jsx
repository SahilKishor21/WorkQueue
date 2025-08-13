import React, { useState, useEffect, useRef } from 'react';
import UploadAssignment from './UploadAssignment';
import UploadTestResponse from './UploadTestResponse';
import AssignmentList from '../Admin/AssignmentList';
import NotesList from '../cards/NotesList';
import LecturesList from '../cards/LectureList';
import TestsList from '../cards/TestList';
import DashboardLayout from '../dashboard/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';

// Search Bar Component with Category Filtering for User Dashboard
const SearchBar = ({ searchQuery, setSearchQuery, placeholder = "Search...", activeTab, selectedCategory, setSelectedCategory }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showCategories, setShowCategories] = useState(false);

    // Category options based on content type for User Dashboard
    const getCategoryOptions = () => {
        const baseCategories = [
            { id: 'all', label: 'All Fields', icon: '🔍' },
            { id: 'title', label: 'Title/Name', icon: '📝' },
            { id: 'description', label: 'Description', icon: '📋' }
        ];

        const contentSpecificCategories = {
            assignments: [
                { id: 'admin', label: 'Admin/Assigned By', icon: '👥' },
                { id: 'deadline', label: 'Deadline Date', icon: '📅' },
                { id: 'label', label: 'Label/Category', icon: '🏷️' },
                { id: 'status', label: 'Status', icon: '✅' }
            ],
            notes: [
                { id: 'author', label: 'Author', icon: '✍️' },
                { id: 'subject', label: 'Subject', icon: '📚' },
                { id: 'date', label: 'Created Date', icon: '📅' }
            ],
            lectures: [
                { id: 'instructor', label: 'Instructor', icon: '👨‍🏫' },
                { id: 'subject', label: 'Subject', icon: '🎥' },
                { id: 'date', label: 'Lecture Date', icon: '📅' }
            ],
            tests: [
                { id: 'instructor', label: 'Instructor', icon: '👨‍🎓' },
                { id: 'subject', label: 'Subject', icon: '📝' },
                { id: 'date', label: 'Test Date', icon: '📅' }
            ],
            'my-assignments': [
                { id: 'deadline', label: 'Deadline Date', icon: '📅' },
                { id: 'submitted', label: 'Submitted Date', icon: '📤' },
                { id: 'status', label: 'Status', icon: '✅' }
            ],
            'my-tests': [
                { id: 'date', label: 'Test Date', icon: '📅' },
                { id: 'submitted', label: 'Submitted Date', icon: '📤' },
                { id: 'status', label: 'Status', icon: '✅' }
            ]
        };

        return [...baseCategories, ...(contentSpecificCategories[activeTab] || [])];
    };

    const categories = getCategoryOptions();

    const handleCategorySelect = (categoryId) => {
        setSelectedCategory(categoryId);
        setShowCategories(false);
        // Clear search when changing category to avoid confusion
        if (searchQuery) {
            setSearchQuery('');
        }
    };

    const getPlaceholderForCategory = () => {
        switch (selectedCategory) {
            case 'title':
                return 'Search by title or name...';
            case 'description':
                return 'Search in description or content...';
            case 'admin':
            case 'author':
            case 'instructor':
                return 'Search by admin, author, or instructor name...';
            case 'deadline':
            case 'date':
                return 'Search by date (e.g., 12/25/2024, Dec 25, today, tomorrow)...';
            case 'submitted':
                return 'Search by submission date (e.g., 12/25/2024, Dec 25, today, tomorrow)...';
            case 'label':
            case 'subject':
                return 'Search by label, category, or subject...';
            case 'status':
                return 'Search by status (e.g., completed, pending, expired)...';
            default:
                return placeholder;
        }
    };

    return (
        <motion.div
            className="relative mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Category Filter Bar */}
            <motion.div 
                className="flex flex-wrap gap-3 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <div className="relative">
                    <motion.button
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                            selectedCategory === 'all' 
                                ? 'bg-emerald-500 text-white shadow-lg' 
                                : 'bg-white/20 text-gray-700 hover:bg-white/30'
                        }`}
                        onClick={() => setShowCategories(!showCategories)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span className="text-lg">
                            {categories.find(cat => cat.id === selectedCategory)?.icon || '🔍'}
                        </span>
                        <span>{categories.find(cat => cat.id === selectedCategory)?.label || 'All Fields'}</span>
                        <motion.span
                            animate={{ rotate: showCategories ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            ▼
                        </motion.span>
                    </motion.button>

                    {/* Category Dropdown */}
                    <AnimatePresence>
                        {showCategories && (
                            <motion.div
                                className="absolute top-full left-0 mt-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30 p-2 z-20 min-w-[200px]"
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            >
                                {categories.map((category) => (
                                    <motion.button
                                        key={category.id}
                                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all text-left ${
                                            selectedCategory === category.id
                                                ? 'bg-emerald-500 text-white'
                                                : 'hover:bg-emerald-50 text-gray-700'
                                        }`}
                                        onClick={() => handleCategorySelect(category.id)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <span className="text-lg">{category.icon}</span>
                                        <span className="font-medium">{category.label}</span>
                                    </motion.button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Active Filter Indicator */}
                {selectedCategory !== 'all' && (
                    <motion.div
                        className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-xl text-sm font-medium"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <span>Filtering by: {categories.find(cat => cat.id === selectedCategory)?.label}</span>
                        <motion.button
                            className="text-blue-500 hover:text-blue-700"
                            onClick={() => handleCategorySelect('all')}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            ✕
                        </motion.button>
                    </motion.div>
                )}
            </motion.div>

            {/* Search Input */}
            <div className={`relative transition-all duration-300 ${isFocused ? 'transform scale-105' : ''}`}>
                <motion.div
                    className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                    animate={{ scale: isFocused ? 1.1 : 1 }}
                    transition={{ duration: 0.2 }}
                >
                    <motion.span 
                        className="text-gray-400 text-xl"
                        animate={{ rotate: searchQuery ? 360 : 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        🔍
                    </motion.span>
                </motion.div>
                
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={getPlaceholderForCategory()}
                    className="w-full pl-12 pr-12 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300 text-lg font-medium shadow-lg"
                />
                
                {searchQuery && (
                    <motion.button
                        className="absolute inset-y-0 right-0 pr-4 flex items-center"
                        onClick={() => setSearchQuery('')}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                    >
                        <span className="text-gray-400 hover:text-gray-600 text-xl">❌</span>
                    </motion.button>
                )}
            </div>
            
            {/* Search Tips for Date Filtering */}
            {isFocused && !searchQuery && (selectedCategory === 'deadline' || selectedCategory === 'date' || selectedCategory === 'submitted') && (
                <motion.div
                    className="absolute top-full left-0 right-0 mt-2 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30 p-4 z-10"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                >
                    <p className="text-sm text-gray-600 mb-2 font-medium">Date search examples:</p>
                    <div className="flex flex-wrap gap-2 text-xs">
                        {['today', 'tomorrow', 'this week', '12/25/2024', 'Dec 25', 'next monday'].map((example) => (
                            <motion.button
                                key={example}
                                className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                                onClick={() => setSearchQuery(example)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {example}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

const AvailableAssignments = ({ assignments, onSubmit, searchQuery, selectedCategory }) => {
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleViewDetails = (assignment) => {
        setSelectedAssignment(assignment);
        setShowModal(true);
    };

    const handleSubmit = (assignment) => {
        if (onSubmit) {
            onSubmit(assignment);
        }
    };

    const truncateDescription = (description, maxLength = 100) => {
        if (!description) return '';
        return description.length > maxLength 
            ? description.substring(0, maxLength) + '...' 
            : description;
    };

    const isOverdue = (deadline) => {
        if (!deadline) return false;
        return new Date(deadline) < new Date();
    };

    const getAssignmentStatus = (deadline) => {
        if (!deadline) return 'Available';
        return isOverdue(deadline) ? 'Expired' : 'Available';
    };

    const getDaysRemaining = (deadline) => {
        if (!deadline) return null;
        const now = new Date();
        const dueDate = new Date(deadline);
        const timeDiff = dueDate.getTime() - now.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        
        if (daysDiff < 0) {
            return { 
                type: 'overdue', 
                days: Math.abs(daysDiff),
                text: `${Math.abs(daysDiff)} day${Math.abs(daysDiff) === 1 ? '' : 's'} overdue`
            };
        } else if (daysDiff === 0) {
            return { 
                type: 'today', 
                days: 0,
                text: 'Due today'
            };
        } else {
            return { 
                type: 'remaining', 
                days: daysDiff,
                text: `${daysDiff} day${daysDiff === 1 ? '' : 's'} remaining`
            };
        }
    };

    const formatDateWithTime = (date) => {
        if (!date) return 'No deadline';
        const dateObj = new Date(date);
        const dateStr = dateObj.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
        const timeStr = dateObj.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
        return `${dateStr} at ${timeStr}`;
    };

    // Remove the local filtering since it's now done in the main component
    const filteredAssignments = assignments;

    if (!filteredAssignments || filteredAssignments.length === 0) {
        return (
            <div className="text-center py-16">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20 max-w-md mx-auto"
                >
                    <div className="text-6xl mb-6">
                        {searchQuery ? '🔍' : '📭'}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-700 mb-3">
                        {searchQuery ? 'No Results Found' : 'No Assignments Available'}
                    </h3>
                    <p className="text-gray-600 text-lg">
                        {searchQuery 
                            ? `No assignments match "${searchQuery}". Try a different search term.`
                            : 'Check back later for new assignments.'
                        }
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6">
                {/* Header */}
                <motion.div 
                    className="bg-gradient-to-r from-emerald-500/90 to-teal-500/90 backdrop-blur-sm text-white p-8 rounded-3xl shadow-xl border border-white/20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="flex items-center gap-4">
                        <motion.div
                            whileHover={{ rotate: 10, scale: 1.1 }}
                            className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl"
                        >
                            🎯
                        </motion.div>
                        <div>
                            <h1 className="text-3xl font-bold">Available Assignments</h1>
                            <p className="text-emerald-100 mt-2 text-lg">
                                {searchQuery 
                                    ? `Found ${filteredAssignments.length} result${filteredAssignments.length === 1 ? '' : 's'}${selectedCategory !== 'all' ? ` in ${selectedCategory}` : ''} for "${searchQuery}"`
                                    : 'Discover new assignments assigned to your profile'
                                }
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Assignments List */}
                <div className="grid gap-6">
                    {filteredAssignments.map((assignment, index) => (
                        <motion.div
                            key={assignment.id || index}
                            className="bg-white/20 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/30 relative overflow-hidden"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            whileHover={{ 
                                scale: 1.02, 
                                boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                                transition: { duration: 0.3 }
                            }}
                        >
                            {/* Background Pattern */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/50 to-purple-100/50 rounded-full blur-2xl -translate-y-8 translate-x-8"></div>
                            
                            {/* Status Badges */}
                            {getAssignmentStatus(assignment.deadline) === 'Expired' && (
                                <motion.div 
                                    className="absolute top-6 right-6 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.5, type: "spring", damping: 15 }}
                                >
                                    Expired
                                </motion.div>
                            )}
                            
                            {getDaysRemaining(assignment.deadline)?.type === 'today' && (
                                <motion.div 
                                    className="absolute top-6 right-6 bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.5, type: "spring", damping: 15 }}
                                >
                                    <motion.span
                                        animate={{ opacity: [1, 0.5, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        Due Today
                                    </motion.span>
                                </motion.div>
                            )}

                            <div className="relative z-10 space-y-6">
                                {/* Assignment Title */}
                                <motion.h3 
                                    className="text-2xl font-bold text-gray-800"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    {assignment.title || assignment.name || `Assignment ${index + 1}`}
                                </motion.h3>

                                {/* Description */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <span className="text-emerald-600 font-semibold text-lg">Description: </span>
                                    <span className="text-gray-700 text-lg">
                                        {truncateDescription(assignment.description)}
                                    </span>
                                </motion.div>

                                {/* Assignment Details Grid */}
                                <motion.div 
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    {/* Assigned By */}
                                    <div className="flex items-center gap-4">
                                        <motion.div 
                                            className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg"
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                        >
                                            {assignment.assignedBy ? assignment.assignedBy.charAt(0).toUpperCase() : 'A'}
                                        </motion.div>
                                        <div>
                                            <p className="text-sm text-gray-500 font-medium">Assigned By</p>
                                            <p className="font-bold text-gray-800 text-lg">
                                                {assignment.assignedBy || assignment.admin || 'Admin'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Deadline */}
                                    <div className="flex items-center gap-4">
                                        <motion.div 
                                            className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center text-white shadow-lg"
                                            whileHover={{ scale: 1.1 }}
                                            animate={{ rotate: [0, 5, -5, 0] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            🕒
                                        </motion.div>
                                        <div>
                                            <p className="text-sm text-gray-500 font-medium">Deadline</p>
                                            <p className="font-bold text-gray-800 text-lg">
                                                {formatDateWithTime(assignment.deadline)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Created */}
                                    <div className="flex items-center gap-4">
                                        <motion.div 
                                            className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white shadow-lg"
                                            whileHover={{ scale: 1.1 }}
                                        >
                                            📅
                                        </motion.div>
                                        <div>
                                            <p className="text-sm text-gray-500 font-medium">Created</p>
                                            <p className="font-bold text-gray-800 text-lg">
                                                {assignment.createdAt 
                                                    ? new Date(assignment.createdAt).toLocaleDateString('en-US', { 
                                                        month: 'short', 
                                                        day: 'numeric', 
                                                        year: 'numeric' 
                                                    })
                                                    : 'Unknown'
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div className="flex items-center gap-4">
                                        <motion.div 
                                            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${
                                                getAssignmentStatus(assignment.deadline) === 'Expired' 
                                                    ? 'bg-gradient-to-r from-red-500 to-pink-500' 
                                                    : 'bg-gradient-to-r from-green-500 to-emerald-500'
                                            }`}
                                            whileHover={{ scale: 1.1 }}
                                            animate={{ 
                                                scale: getAssignmentStatus(assignment.deadline) === 'Expired' ? [1, 1.1, 1] : 1
                                            }}
                                            transition={{ duration: 1, repeat: getAssignmentStatus(assignment.deadline) === 'Expired' ? Infinity : 0 }}
                                        >
                                            {getAssignmentStatus(assignment.deadline) === 'Expired' ? '⏰' : '✨'}
                                        </motion.div>
                                        <div>
                                            <p className="text-sm text-gray-500 font-medium">Status</p>
                                            <p className={`font-bold text-lg ${
                                                getAssignmentStatus(assignment.deadline) === 'Expired' 
                                                    ? 'text-red-600' 
                                                    : 'text-green-600'
                                            }`}>
                                                {getAssignmentStatus(assignment.deadline)}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Action Buttons */}
                                <motion.div 
                                    className="flex flex-col sm:flex-row gap-4 pt-6"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    <motion.button
                                        className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center justify-center gap-3 shadow-xl"
                                        whileHover={{ scale: 1.05, boxShadow: "0 15px 30px rgba(16, 185, 129, 0.4)" }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleViewDetails(assignment)}
                                    >
                                        <span>View Details</span>
                                        <motion.span
                                            animate={{ x: [0, 5, 0] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                        >
                                            →
                                        </motion.span>
                                    </motion.button>
                                    
                                    <motion.button
                                        className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-xl ${
                                            getAssignmentStatus(assignment.deadline) === 'Expired'
                                                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
                                        }`}
                                        whileHover={getAssignmentStatus(assignment.deadline) !== 'Expired' ? { 
                                            scale: 1.05,
                                            boxShadow: "0 15px 30px rgba(59, 130, 246, 0.4)"
                                        } : {}}
                                        whileTap={getAssignmentStatus(assignment.deadline) !== 'Expired' ? { scale: 0.95 } : {}}
                                        onClick={() => getAssignmentStatus(assignment.deadline) !== 'Expired' && handleSubmit(assignment)}
                                        disabled={getAssignmentStatus(assignment.deadline) === 'Expired'}
                                    >
                                        {getAssignmentStatus(assignment.deadline) === 'Expired' ? (
                                            <>❌ Expired</>
                                        ) : (
                                            <>📤 Submit Assignment</>
                                        )}
                                    </motion.button>
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Assignment Details Modal */}
            <AnimatePresence>
                {showModal && selectedAssignment && (
                    <motion.div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/30"
                            style={{ 
                                width: '500px', 
                                maxHeight: '580px',
                                overflow: 'hidden' 
                            }}
                            initial={{ scale: 0.8, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 50 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-4 rounded-t-3xl -m-8 mb-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-bold">
                                        {selectedAssignment.title || selectedAssignment.name}
                                    </h2>
                                    <button
                                        className="text-white/80 hover:text-white text-2xl"
                                        onClick={() => setShowModal(false)}
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {/* Description */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-2">Description</h3>
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                        {selectedAssignment.description || 'No description available.'}
                                    </p>
                                </div>

                                {/* Assignment Details Grid */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-bold text-gray-800 mb-3">Assignment Details</h4>
                                        <div className="space-y-2">
                                            <div>
                                                <span className="text-gray-600 text-sm">Assigned By:</span>
                                                <div className="font-semibold">{selectedAssignment.assignedBy || selectedAssignment.admin || 'Admin'}</div>
                                            </div>
                                            <div>
                                                <span className="text-gray-600 text-sm">Status:</span>
                                                <div className={`font-semibold ${
                                                    getAssignmentStatus(selectedAssignment.deadline) === 'Expired' 
                                                        ? 'text-red-600' 
                                                        : 'text-green-600'
                                                }`}>
                                                    {getAssignmentStatus(selectedAssignment.deadline)}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-gray-600 text-sm">Priority:</span>
                                                <div className="font-semibold">{selectedAssignment.priority || 'Normal'}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-gray-800 mb-3">Timeline</h4>
                                        <div className="space-y-2">
                                            <div>
                                                <span className="text-gray-600 text-sm">Created:</span>
                                                <div className="font-semibold">
                                                    {selectedAssignment.createdAt 
                                                        ? new Date(selectedAssignment.createdAt).toLocaleDateString('en-US', {
                                                            month: 'numeric',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })
                                                        : 'Unknown'
                                                    }
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-gray-600 text-sm">Deadline:</span>
                                                <div className={`font-semibold ${isOverdue(selectedAssignment.deadline) ? 'text-red-600' : 'text-gray-800'}`}>
                                                    {formatDateWithTime(selectedAssignment.deadline)}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-gray-600 text-sm">Duration:</span>
                                                <div className="font-semibold">{selectedAssignment.duration || 'Not specified'}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Time Remaining Section */}
                                {selectedAssignment.deadline && (
                                    <div className={`p-3 rounded-xl border-2 ${
                                        getDaysRemaining(selectedAssignment.deadline)?.type === 'overdue' 
                                            ? 'bg-red-50 border-red-300' 
                                            : getDaysRemaining(selectedAssignment.deadline)?.type === 'today'
                                            ? 'bg-yellow-50 border-yellow-300'
                                            : 'bg-green-50 border-green-300'
                                    }`}>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${
                                                getDaysRemaining(selectedAssignment.deadline)?.type === 'overdue' 
                                                    ? 'bg-red-500' 
                                                    : getDaysRemaining(selectedAssignment.deadline)?.type === 'today'
                                                    ? 'bg-yellow-500'
                                                    : 'bg-green-500'
                                            }`}>
                                                {getDaysRemaining(selectedAssignment.deadline)?.type === 'overdue' 
                                                    ? '⚠️' 
                                                    : getDaysRemaining(selectedAssignment.deadline)?.type === 'today'
                                                    ? '🔥'
                                                    : '⏳'
                                                }
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-800">
                                                    {getDaysRemaining(selectedAssignment.deadline)?.type === 'overdue' 
                                                        ? 'Assignment Overdue' 
                                                        : getDaysRemaining(selectedAssignment.deadline)?.type === 'today'
                                                        ? 'Due Today!'
                                                        : 'Time Remaining'
                                                    }
                                                </div>
                                                <div className={`font-bold ${
                                                    getDaysRemaining(selectedAssignment.deadline)?.type === 'overdue' 
                                                        ? 'text-red-600' 
                                                        : getDaysRemaining(selectedAssignment.deadline)?.type === 'today'
                                                        ? 'text-yellow-600'
                                                        : 'text-green-600'
                                                }`}>
                                                    {getDaysRemaining(selectedAssignment.deadline)?.text}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-2">
                                    <button
                                        className={`flex-1 py-3 rounded-2xl font-bold text-white ${
                                            getAssignmentStatus(selectedAssignment.deadline) === 'Expired'
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                                        }`}
                                        onClick={() => {
                                            if (getAssignmentStatus(selectedAssignment.deadline) !== 'Expired') {
                                                handleSubmit(selectedAssignment);
                                                setShowModal(false);
                                            }
                                        }}
                                        disabled={getAssignmentStatus(selectedAssignment.deadline) === 'Expired'}
                                    >
                                        {getAssignmentStatus(selectedAssignment.deadline) === 'Expired' ? 'Assignment Expired' : '📤 Submit Assignment'}
                                    </button>
                                    <button
                                        className="bg-gray-300 text-gray-800 px-6 py-3 rounded-2xl font-bold hover:bg-gray-400 transition-all"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

const UserDashboard = () => {
    const [activeTab, setActiveTab] = useState('upload');
    const [assignments, setAssignments] = useState([]);
    const [testSubmissions, setTestSubmissions] = useState([]);
    const [studentContent, setStudentContent] = useState({
        assignments: [],
        notes: [],
        lectures: [],
        tests: []
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const tabs = [
        { id: 'upload', label: 'Upload Assignment' },
        { id: 'upload-test', label: 'Upload Test Response' },
        { id: 'my-assignments', label: 'My Assignment Submissions' },
        { id: 'my-tests', label: 'My Test Submissions' },
        { id: 'assignments', label: 'Available Assignments' },
        { id: 'notes', label: 'Notes' },
        { id: 'lectures', label: 'Lectures' },
        { id: 'tests', label: 'Tests' }
    ];

    // Enhanced search function with category-based filtering
    const filterContent = (content, query, selectedCategory = 'all') => {
        if (!query) return content;
        
        const searchTerm = query.toLowerCase();
        
        // Enhanced date parsing and matching function
        const matchesDate = (itemDate, searchQuery) => {
            if (!itemDate) return false;
            
            const itemDateObj = new Date(itemDate);
            const query = searchQuery.toLowerCase().trim();
            
            // Handle relative date terms first
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            
            switch (query) {
                case 'today':
                    return itemDateObj.toDateString() === today.toDateString();
                case 'tomorrow':
                    return itemDateObj.toDateString() === tomorrow.toDateString();
                case 'this week':
                    const startOfWeek = new Date(today);
                    startOfWeek.setDate(today.getDate() - today.getDay());
                    const endOfWeek = new Date(startOfWeek);
                    endOfWeek.setDate(startOfWeek.getDate() + 6);
                    return itemDateObj >= startOfWeek && itemDateObj <= endOfWeek;
            }
            
            // Create comprehensive list of date string representations
            const dateStrings = [
                // Basic formats
                itemDateObj.toLocaleDateString().toLowerCase(), // "8/16/2025"
                itemDateObj.toLocaleDateString('en-GB').toLowerCase(), // "16/8/2025" (DD/MM/YYYY)
                itemDateObj.toLocaleDateString('en-US').toLowerCase(), // "8/16/2025" (MM/DD/YYYY)
                itemDateObj.toDateString().toLowerCase(), // "fri aug 16 2025"
                
                // Month + Day formats
                itemDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toLowerCase(), // "aug 16"
                itemDateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }).toLowerCase(), // "august 16"
                itemDateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }).toLowerCase(), // "16 aug"
                itemDateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'long' }).toLowerCase(), // "16 august"
                
                // With year
                itemDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toLowerCase(), // "aug 16, 2025"
                itemDateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toLowerCase(), // "august 16, 2025"
                
                // Different numeric formats
                itemDateObj.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' }).toLowerCase(), // "8/16"
                itemDateObj.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }).toLowerCase(), // "08/16"
                itemDateObj.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }).toLowerCase(), // "8/16/2025"
                itemDateObj.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }).toLowerCase(), // "08/16/2025"
                
                // DD/MM/YYYY and MM/DD/YYYY variations
                `${itemDateObj.getDate()}/${itemDateObj.getMonth() + 1}/${itemDateObj.getFullYear()}`, // "16/8/2025"
                `${itemDateObj.getMonth() + 1}/${itemDateObj.getDate()}/${itemDateObj.getFullYear()}`, // "8/16/2025"
                `${String(itemDateObj.getDate()).padStart(2, '0')}/${String(itemDateObj.getMonth() + 1).padStart(2, '0')}/${itemDateObj.getFullYear()}`, // "16/08/2025"
                `${String(itemDateObj.getMonth() + 1).padStart(2, '0')}/${String(itemDateObj.getDate()).padStart(2, '0')}/${itemDateObj.getFullYear()}`, // "08/16/2025"
                
                // Individual components
                `${itemDateObj.getDate()}`, // "16"
                itemDateObj.toLocaleDateString('en-US', { month: 'short' }).toLowerCase(), // "aug"
                itemDateObj.toLocaleDateString('en-US', { month: 'long' }).toLowerCase(), // "august"
                
                // Alternative formats
                `${itemDateObj.toLocaleDateString('en-US', { month: 'short' }).toLowerCase()} ${itemDateObj.getDate()}`, // "aug 16"
                `${itemDateObj.toLocaleDateString('en-US', { month: 'long' }).toLowerCase()} ${itemDateObj.getDate()}`, // "august 16"
                `${itemDateObj.getDate()} ${itemDateObj.toLocaleDateString('en-US', { month: 'short' }).toLowerCase()}`, // "16 aug"
                `${itemDateObj.getDate()} ${itemDateObj.toLocaleDateString('en-US', { month: 'long' }).toLowerCase()}`, // "16 august"
            ];
            
            // Check if any of the date string representations contain the search query
            const matchFound = dateStrings.some(dateStr => {
                return dateStr.includes(query) || query.includes(dateStr);
            });
            
            // Also try parsing the search query as a date and comparing
            const currentYear = today.getFullYear();
            const possibleDates = [
                query,
                `${query} ${currentYear}`,
                `${query}, ${currentYear}`,
                // Handle DD/MM/YYYY format
                query.includes('/') && query.split('/').length === 3 ? query : null,
                // Convert DD/MM/YYYY to MM/DD/YYYY for parsing
                query.includes('/') && query.split('/').length === 3 ? 
                    (() => {
                        const parts = query.split('/');
                        if (parts.length === 3) {
                            // Try both DD/MM/YYYY and MM/DD/YYYY interpretations
                            return [`${parts[1]}/${parts[0]}/${parts[2]}`, `${parts[0]}/${parts[1]}/${parts[2]}`];
                        }
                        return null;
                    })() : null
            ].flat().filter(Boolean);
            
            for (const possibleDate of possibleDates) {
                const parsedDate = new Date(possibleDate);
                if (!isNaN(parsedDate.getTime())) {
                    if (itemDateObj.toDateString() === parsedDate.toDateString()) {
                        return true;
                    }
                }
            }
            
            return matchFound;
        };
        
        return content.filter(item => {
            // Common searchable fields across different content types
            const title = (item.title || item.name || item.subject || '').toLowerCase();
            const description = (item.description || item.content || '').toLowerCase();
            const admin = (item.assignedBy || item.admin || item.author || item.instructor || '').toLowerCase();
            const label = (item.label || item.category || item.tag || item.subject || '').toLowerCase();
            const status = (item.status || (item.deadline && new Date(item.deadline) < new Date() ? 'expired' : 'active') || '').toLowerCase();
            
            // Category-specific filtering
            switch (selectedCategory) {
                case 'title':
                    return title.includes(searchTerm);
                case 'description':
                    return description.includes(searchTerm);
                case 'admin':
                case 'author':
                case 'instructor':
                    return admin.includes(searchTerm);
                case 'label':
                case 'subject':
                    return label.includes(searchTerm);
                case 'deadline':
                    return item.deadline && matchesDate(item.deadline, searchTerm);
                case 'submitted':
                    // Check multiple possible field names for submitted date
                    const submittedDateFields = [
                        item.submittedAt,
                        item.submissionDate, 
                        item.submitted,
                        item.createdAt, // Sometimes submission date is stored as createdAt
                        item.updatedAt  // Or updatedAt for when it was last modified
                    ].filter(Boolean); // Remove null/undefined values
                    
                    return submittedDateFields.some(dateField => matchesDate(dateField, searchTerm));
                case 'date':
                    return (item.date && matchesDate(item.date, searchTerm)) ||
                           (item.createdAt && matchesDate(item.createdAt, searchTerm));
                case 'status':
                    return status.includes(searchTerm);
                case 'all':
                default:
                    // Search all fields for 'all' category
                    const deadline = item.deadline ? (matchesDate(item.deadline, searchTerm) || new Date(item.deadline).toLocaleDateString().toLowerCase().includes(searchTerm)) : false;
                    const date = item.date ? (matchesDate(item.date, searchTerm) || new Date(item.date).toLocaleDateString().toLowerCase().includes(searchTerm)) : false;
                    const createdAt = item.createdAt ? (matchesDate(item.createdAt, searchTerm) || new Date(item.createdAt).toLocaleDateString().toLowerCase().includes(searchTerm)) : false;
                    
                    const allSubmittedDateFields = [
                        item.submittedAt,
                        item.submissionDate, 
                        item.submitted,
                        item.createdAt,
                        item.updatedAt
                    ].filter(Boolean);
                    
                    const submitted = allSubmittedDateFields.some(dateField => 
                        matchesDate(dateField, searchTerm) || 
                        new Date(dateField).toLocaleDateString().toLowerCase().includes(searchTerm)
                    );
                    
                    return title.includes(searchTerm) || 
                           description.includes(searchTerm) || 
                           admin.includes(searchTerm) || 
                           label.includes(searchTerm) ||
                           status.includes(searchTerm) ||
                           deadline ||
                           date ||
                           createdAt ||
                           submitted;
            }
        });
    };

    // Handle assignment submission (for Available Assignments)
    const handleAssignmentSubmit = (assignment) => {
        console.log('Submitting assignment:', assignment);
        setActiveTab('upload');
    };

    const fetchStudentContent = async (type) => {
        try {
            const token = localStorage.getItem('userToken');
            const response = await fetch(`http://localhost:5000/api/users/content/${type}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (!response.ok) {
                throw new Error(`Failed to fetch ${type}`);
            }
            
            const data = await response.json();
            setStudentContent(prev => ({
                ...prev,
                [type]: data
            }));
        } catch (err) {
            console.error(`Error fetching ${type}:`, err);
        }
    };

    const fetchUserSubmissions = async (type) => {
        try {
            const token = localStorage.getItem('userToken');
            const response = await fetch(`http://localhost:5000/api/users/submissions/${type}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.ok) {
                const data = await response.json();
                if (type === 'assignments') {
                    setAssignments(data.submissions || []);
                } else if (type === 'tests') {
                    setTestSubmissions(data.submissions || []);
                }
            }
        } catch (err) {
            console.error(`Error fetching ${type} submissions:`, err);
        }
    };

    const fetchAllData = async () => {
        setLoading(true);
        try {
            // Fetch all student content types
            await Promise.all([
                fetchStudentContent('assignments'),
                fetchStudentContent('notes'),
                fetchStudentContent('lectures'),
                fetchStudentContent('tests')
            ]);

            // Fetch user submissions
            await Promise.all([
                fetchUserSubmissions('assignments'),
                fetchUserSubmissions('tests')
            ]);

            setError(null);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to fetch data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const getCurrentContent = () => {
        let content = [];
        switch (activeTab) {
            case 'assignments':
                content = studentContent.assignments;
                break;
            case 'notes':
                content = studentContent.notes;
                break;
            case 'lectures':
                content = studentContent.lectures;
                break;
            case 'tests':
                content = studentContent.tests;
                break;
            case 'my-assignments':
                content = assignments;
                break;
            case 'my-tests':
                content = testSubmissions;
                break;
            default:
                content = [];
        }
        
        // Apply search filter with category
        return filterContent(content, searchQuery, selectedCategory);
    };

    const currentContent = getCurrentContent();

    // Get search placeholder based on active tab
    const getSearchPlaceholder = () => {
        switch (activeTab) {
            case 'assignments':
                return 'Search assignments by title, admin, deadline, or label...';
            case 'notes':
                return 'Search notes by title, author, subject, or content...';
            case 'lectures':
                return 'Search lectures by title, instructor, subject, or date...';
            case 'tests':
                return 'Search tests by title, instructor, subject, or date...';
            case 'my-assignments':
                return 'Search your assignments by title, deadline, submission date, or status...';
            case 'my-tests':
                return 'Search your test submissions by title, test date, submission date, or status...';
            default:
                return 'Search...';
        }
    };

    // Show search bar for content tabs only
    const showSearchBar = ['assignments', 'notes', 'lectures', 'tests', 'my-assignments', 'my-tests'].includes(activeTab);

    // Loading state
    if (loading) {
        return (
            <DashboardLayout 
                title="Student Dashboard" 
                error={error}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                tabs={tabs}
            >
                <div className="flex flex-col justify-center items-center h-96 space-y-6">
                    <motion.div
                        animate={{ 
                            rotate: 360,
                            scale: [1, 1.2, 1]
                        }}
                        transition={{ 
                            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                            scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                        }}
                        className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-xl"
                    >
                        🎓
                    </motion.div>
                    <motion.p 
                        className="text-2xl font-bold text-gray-700"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                        Loading your dashboard...
                    </motion.p>
                    <motion.div 
                        className="w-64 h-2 bg-white/30 rounded-full overflow-hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <motion.div
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                            animate={{ x: [-100, 264] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </motion.div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout 
            title="Student Dashboard" 
            error={error}
            activeTab={activeTab}
            onTabChange={(tab) => {
                setActiveTab(tab);
                setSearchQuery(''); // Clear search when switching tabs
                setSelectedCategory('all'); // Reset category when switching tabs
            }}
            tabs={tabs}
        >
            {/* Search Bar - Only show for content tabs */}
            {showSearchBar && (
                <SearchBar 
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    placeholder={getSearchPlaceholder()}
                    activeTab={activeTab}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                />
            )}

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="min-h-[400px]"
                >
                    {activeTab === 'upload' && (
                        <UploadAssignment onUploadSuccess={() => setActiveTab('my-assignments')} />
                    )}
                    
                    {activeTab === 'upload-test' && (
                        <UploadTestResponse onUploadSuccess={() => setActiveTab('my-tests')} />
                    )}
                    
                    {(activeTab === 'my-assignments' || activeTab === 'my-tests') && (
                        <AssignmentList assignments={currentContent} searchQuery={searchQuery} selectedCategory={selectedCategory} />
                    )}
                    
                    {activeTab === 'assignments' && (
                        <AvailableAssignments 
                            assignments={currentContent} 
                            onSubmit={handleAssignmentSubmit}
                            searchQuery={searchQuery}
                            selectedCategory={selectedCategory}
                        />
                    )}
                    
                    {activeTab === 'notes' && (
                        <NotesList notes={currentContent} searchQuery={searchQuery} selectedCategory={selectedCategory} />
                    )}
                    
                    {activeTab === 'lectures' && (
                        <LecturesList lectures={currentContent} searchQuery={searchQuery} selectedCategory={selectedCategory} />
                    )}
                    
                    {activeTab === 'tests' && (
                        <TestsList tests={currentContent} searchQuery={searchQuery} selectedCategory={selectedCategory} />
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Dashboard Stats */}
            <motion.div 
                className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
            >
                <motion.div
                    className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl border border-white/30 text-center"
                    whileHover={{ 
                        scale: 1.05, 
                        boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
                        transition: { type: "spring", damping: 15, stiffness: 400 }
                    }}
                    whileTap={{ scale: 0.95 }}
                >
                    <motion.div className="text-4xl mb-3">📤</motion.div>
                    <h3 className="text-xl font-bold text-gray-800">Upload</h3>
                    <p className="text-gray-600 mt-1">Submit assignments</p>
                </motion.div>

                <motion.div
                    className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl border border-white/30 text-center"
                    whileHover={{ 
                        scale: 1.05, 
                        boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
                        transition: { type: "spring", damping: 15, stiffness: 400 }
                    }}
                    whileTap={{ scale: 0.95 }}
                >
                    <motion.div className="text-4xl mb-3">📚</motion.div>
                    <h3 className="text-xl font-bold text-gray-800">Notes</h3>
                    <p className="text-gray-600 mt-1">{studentContent.notes.length} available</p>
                </motion.div>

                <motion.div
                    className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl border border-white/30 text-center"
                    whileHover={{ 
                        scale: 1.05, 
                        boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
                        transition: { type: "spring", damping: 15, stiffness: 400 }
                    }}
                    whileTap={{ scale: 0.95 }}
                >
                    <motion.div className="text-4xl mb-3">🎥</motion.div>
                    <h3 className="text-xl font-bold text-gray-800">Lectures</h3>
                    <p className="text-gray-600 mt-1">{studentContent.lectures.length} available</p>
                </motion.div>

                <motion.div
                    className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl border border-white/30 text-center"
                    whileHover={{ 
                        scale: 1.05, 
                        boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
                        transition: { type: "spring", damping: 15, stiffness: 400 }
                    }}
                    whileTap={{ scale: 0.95 }}
                >
                    <motion.div className="text-4xl mb-3">📝</motion.div>
                    <h3 className="text-xl font-bold text-gray-800">Tests</h3>
                    <p className="text-gray-600 mt-1">{studentContent.tests.length} available</p>
                </motion.div>
            </motion.div>
        </DashboardLayout>
    );
};

export default UserDashboard;