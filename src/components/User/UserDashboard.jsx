import React, { useState, useEffect, useRef } from 'react';
import UploadAssignment from './UploadAssignment';
import UploadTestResponse from './UploadTestResponse';
import AssignmentList from '../Admin/AssignmentList';
import NotesList from '../cards/NotesList';
import LecturesList from '../cards/LectureList';
import TestsList from '../cards/TestList';
import DashboardLayout from '../dashboard/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';

const AvailableAssignments = ({ assignments, onSubmit }) => {
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

    // Added function to format date with time - improved formatting
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

    if (!assignments || assignments.length === 0) {
        return (
            <div className="text-center py-16">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20 max-w-md mx-auto"
                >
                    <div className="text-6xl mb-6">📭</div>
                    <h3 className="text-2xl font-bold text-gray-700 mb-3">No Assignments Available</h3>
                    <p className="text-gray-600 text-lg">Check back later for new assignments.</p>
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
                            <p className="text-emerald-100 mt-2 text-lg">Discover new assignments assigned to your profile</p>
                        </div>
                    </div>
                </motion.div>

                {/* Assignments List */}
                <div className="grid gap-6">
                    {assignments.map((assignment, index) => (
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

                                    {/* Deadline - Updated to include time */}
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

            {/* Assignment Details Modal - Back to original positioning */}
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
                            {/* Header with green background like original */}
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

                                {/* Assignment Details Grid - Compact like original */}
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

                                {/* Time Remaining Section - Like original */}
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

                                {/* Action Buttons - Like original */}
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
        switch (activeTab) {
            case 'assignments':
                return studentContent.assignments;
            case 'notes':
                return studentContent.notes;
            case 'lectures':
                return studentContent.lectures;
            case 'tests':
                return studentContent.tests;
            case 'my-assignments':
                return assignments;
            case 'my-tests':
                return testSubmissions;
            default:
                return [];
        }
    };

    const currentContent = getCurrentContent();

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
            onTabChange={setActiveTab}
            tabs={tabs}
        >
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
                        <AssignmentList assignments={currentContent} />
                    )}
                    
                    {activeTab === 'assignments' && (
                        <AvailableAssignments 
                            assignments={currentContent} 
                            onSubmit={handleAssignmentSubmit}
                        />
                    )}
                    
                    {activeTab === 'notes' && (
                        <NotesList notes={currentContent} />
                    )}
                    
                    {activeTab === 'lectures' && (
                        <LecturesList lectures={currentContent} />
                    )}
                    
                    {activeTab === 'tests' && (
                        <TestsList tests={currentContent} />
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
                    <motion.div
                        className="text-4xl mb-3"
                    >
                        📤
                    </motion.div>
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
                    <motion.div
                        className="text-4xl mb-3"
                    >
                        📚
                    </motion.div>
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
                    <motion.div
                        className="text-4xl mb-3"
                    >
                        🎥
                    </motion.div>
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
                    <motion.div
                        className="text-4xl mb-3"
                        
                    >
                        📝
                    </motion.div>
                    <h3 className="text-xl font-bold text-gray-800">Tests</h3>
                    <p className="text-gray-600 mt-1">{studentContent.tests.length} available</p>
                </motion.div>
            </motion.div>
        </DashboardLayout>
    );
};

export default UserDashboard;