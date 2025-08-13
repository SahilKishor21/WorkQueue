import React, { useState, useEffect } from 'react';
import AssignmentList from '../Admin/AssignmentList';
import DashboardLayout from '../dashboard/DashboardLayout';
import NotesList from '../cards/NotesList';
import LecturesList from '../cards/LectureList';
import TestsList from '../cards/TestList';
import { motion, AnimatePresence } from 'framer-motion';

const AdvancedBackground = () => {
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        const generateParticles = () => {
            return Array.from({ length: 50 }, (_, index) => ({
                id: index,
                shape: Math.random() > 0.5 ? 'circle' : 'square',
                size: Math.random() * 80 + 20,
                left: Math.random() * 120 - 10,
                top: Math.random() * 120 - 10,
                color: `rgba(${Math.random() * 50 + 120}, ${Math.random() * 30 + 30}, ${Math.random() * 50 + 50}, ${Math.random() * 0.3 + 0.1})`,
                movementType: Math.floor(Math.random() * 3)
            }));
        };

        setParticles(generateParticles());
    }, []);

    const getAnimationVariants = (movementType) => {
        const patterns = [
            {
                x: [0, Math.random() * 200 - 100, 0],
                y: [0, Math.random() * 200 - 100, 0],
                rotate: [0, 360, 0]
            },
            {
                x: [0, Math.random() * 150 - 75, 0],
                y: [0, Math.sin(Math.random() * 10) * 100, 0],
                scale: [1, 1.2, 1]
            },
            {
                x: [0, Math.random() * 300 - 150, 0],
                y: [0, Math.random() * 300 - 150, 0],
                opacity: [0.2, 0.7, 0.2]
            }
        ];

        return patterns[movementType];
    };

    return (
        <motion.div 
            className="fixed inset-0 overflow-hidden pointer-events-none z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-red-100/30 to-red-200/30 mix-blend-overlay"></div>
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className={`absolute ${particle.shape === 'circle' ? 'rounded-full' : 'rounded-lg'}`}
                    style={{
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                        left: `${particle.left}%`,
                        top: `${particle.top}%`,
                        backgroundColor: particle.color
                    }}
                    animate={getAnimationVariants(particle.movementType)}
                    transition={{
                        duration: Math.random() * 10 + 8,
                        repeat: Infinity,
                        repeatType: "mirror",
                        ease: "easeInOut"
                    }}
                />
            ))}

            <motion.div
                className="absolute inset-0 bg-white/5"
                animate={{
                    background: [
                        'linear-gradient(45deg, rgba(127,29,29,0.1), rgba(185,28,28,0.1))',
                        'linear-gradient(135deg, rgba(185,28,28,0.1), rgba(127,29,29,0.1))'
                    ]
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    repeatType: "reverse"
                }}
            />
        </motion.div>
    );
};

// All Admin Assignments Component for HEAD
const AllAdminAssignments = ({ assignments, onDeadlineChange, onFeedbackSubmit }) => {
    const [showDeadlineModal, setShowDeadlineModal] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [newDeadline, setNewDeadline] = useState("");
    const [newDeadlineTime, setNewDeadlineTime] = useState("23:59");
    const [useSpecificTime, setUseSpecificTime] = useState(false);
    const [deadlineReason, setDeadlineReason] = useState("");

    // Get current date and time for minimum values
    const getCurrentDateTime = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        
        return {
            date: `${year}-${month}-${day}`,
            time: `${hours}:${minutes}`,
            datetime: `${year}-${month}-${day}T${hours}:${minutes}`
        };
    };

    const currentDateTime = getCurrentDateTime();

    // Helper function to format deadline
    const formatDeadline = (deadline, hasTimeComponent = true) => {
        if (!deadline) return 'No deadline set';
        
        const deadlineDate = new Date(deadline);
        if (isNaN(deadlineDate.getTime())) return 'Invalid deadline';
        
        if (hasTimeComponent) {
            return deadlineDate.toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        } else {
            return deadlineDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }
    };

    // Helper function to check if deadline is approaching
    const isDeadlineApproaching = (deadline) => {
        if (!deadline) return false;
        const now = new Date();
        const deadlineDate = new Date(deadline);
        const timeDiff = deadlineDate.getTime() - now.getTime();
        const hoursUntilDeadline = timeDiff / (1000 * 60 * 60);
        return hoursUntilDeadline <= 24 && hoursUntilDeadline > 0;
    };

    // Helper function to check if deadline has passed
    const isOverdue = (deadline) => {
        if (!deadline) return false;
        return new Date() > new Date(deadline);
    };

    const getPriorityColor = (deadline) => {
        if (!deadline) return 'from-gray-500 to-gray-600';
        const deadlineDate = new Date(deadline);
        const now = new Date();
        const timeDiff = deadlineDate - now;
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        if (daysDiff < 0) return 'from-red-500 to-red-600'; // Overdue
        if (daysDiff <= 2) return 'from-orange-500 to-red-500'; // Urgent
        if (daysDiff <= 7) return 'from-yellow-500 to-orange-500'; // Soon
        return 'from-emerald-500 to-teal-500'; // Normal
    };

    const getPriorityLabel = (deadline) => {
        if (!deadline) return 'No Deadline';
        const deadlineDate = new Date(deadline);
        const now = new Date();
        const timeDiff = deadlineDate - now;
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        if (daysDiff < 0) return 'Overdue';
        if (daysDiff <= 2) return 'Urgent';
        if (daysDiff <= 7) return 'Due Soon';
        return 'Normal';
    };

    const handleChangeDeadline = (assignment) => {
        setSelectedAssignment(assignment);
        setShowDeadlineModal(true);
        setNewDeadline("");
        setNewDeadlineTime("23:59");
        setUseSpecificTime(false);
        setDeadlineReason("");
    };

    const handleDeadlineSubmit = async () => {
        try {
            const headToken = localStorage.getItem("headToken");
            const assignmentId = selectedAssignment._id || selectedAssignment.id;
            
            let finalDeadline;
            if (useSpecificTime && newDeadlineTime) {
                finalDeadline = `${newDeadline}T${newDeadlineTime}`;
            } else {
                finalDeadline = newDeadline;
            }

            const response = await fetch(
                `http://localhost:5000/api/assignments/${assignmentId}/change-deadline`,
                {
                    method: 'PUT',
                    headers: { 
                        'Authorization': `Bearer ${headToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        newDeadline: finalDeadline,
                        reason: deadlineReason
                    })
                }
            );

            if (response.ok) {
                const data = await response.json();
                setShowDeadlineModal(false);
                
                if (onDeadlineChange) {
                    onDeadlineChange(assignmentId, data.assignment);
                }
                
                alert("Deadline updated successfully!");
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to change deadline');
            }
            
        } catch (error) {
            console.error("Error changing deadline:", error.message);
            alert("Error changing deadline: " + error.message);
        }
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
                    <div className="text-6xl mb-6">📋</div>
                    <h3 className="text-2xl font-bold text-gray-700 mb-3">No Assignments Found</h3>
                    <p className="text-gray-600 text-lg">No assignments have been posted by admins yet.</p>
                </motion.div>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6">
                {/* Header */}
                <motion.div 
                    className="bg-gradient-to-r from-red-600/90 to-red-700/90 backdrop-blur-sm text-white p-8 rounded-3xl shadow-xl border border-white/20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold">All Admin Assignments</h1>
                            <p className="text-red-100 mt-2 text-lg">Manage all assignments posted by admins across all labels</p>
                        </div>
                    </div>
                </motion.div>

                {/* Assignments List */}
                <div className="grid gap-6">
                    {assignments.map((assignment, index) => (
                        <motion.div
                            key={assignment._id || assignment.id}
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
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-100/50 to-pink-100/50 rounded-full blur-2xl -translate-y-8 translate-x-8"></div>
                            
                            {/* Priority Badge */}
                            <motion.div
                                className={`absolute top-6 right-6 px-4 py-2 rounded-full text-sm font-bold text-white bg-gradient-to-r ${getPriorityColor(assignment.deadline)}`}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3, type: "spring", damping: 15, stiffness: 400 }}
                            >
                                {getPriorityLabel(assignment.deadline)}
                            </motion.div>

                            <div className="relative z-10 space-y-6">
                                {/* Assignment Title */}
                                <motion.h3 
                                    className="text-2xl font-bold text-gray-800 pr-24"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    {assignment.title}
                                </motion.h3>

                                {/* Description */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <span className="text-red-600 font-semibold text-lg">Description: </span>
                                    <span className="text-gray-700 text-lg">
                                        {assignment.description}
                                    </span>
                                </motion.div>

                                {/* Assignment Details Grid */}
                                <motion.div 
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    {/* Admin */}
                                    <div className="flex items-center gap-4">
                                        <motion.div 
                                            className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg"
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                        >
                                            {assignment.admin ? assignment.admin.charAt(0).toUpperCase() : 'A'}
                                        </motion.div>
                                        <div>
                                            <p className="text-sm text-gray-500 font-medium">Created By</p>
                                            <p className="font-bold text-gray-800 text-lg">
                                                {assignment.admin || 'Admin'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Label */}
                                    <div className="flex items-center gap-4">
                                        <motion.div 
                                            className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white shadow-lg"
                                            whileHover={{ scale: 1.1 }}
                                        >
                                            🏷️
                                        </motion.div>
                                        <div>
                                            <p className="text-sm text-gray-500 font-medium">Label</p>
                                            <p className="font-bold text-gray-800 text-lg">
                                                {assignment.label || 'No Label'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Deadline */}
                                    <div className="flex items-center gap-4">
                                        <motion.div 
                                            className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center text-white shadow-lg"
                                            whileHover={{ scale: 1.1 }}
                                            animate={{ 
                                                scale: isOverdue(assignment.deadline) ? [1, 1.1, 1] : 1,
                                                rotate: isDeadlineApproaching(assignment.deadline) ? [0, 5, -5, 0] : 0
                                            }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            🕒
                                        </motion.div>
                                        <div>
                                            <p className="text-sm text-gray-500 font-medium">Deadline</p>
                                            <p className={`font-bold text-lg ${
                                                isOverdue(assignment.deadline) 
                                                    ? 'text-red-600' 
                                                    : isDeadlineApproaching(assignment.deadline) 
                                                        ? 'text-orange-600' 
                                                        : 'text-gray-800'
                                            }`}>
                                                {formatDeadline(assignment.deadline, assignment.hasTimeComponent)}
                                            </p>
                                            {isOverdue(assignment.deadline) && (
                                                <motion.span 
                                                    className="text-red-500 text-xs font-bold"
                                                    animate={{ opacity: [1, 0.5, 1] }}
                                                    transition={{ duration: 1, repeat: Infinity }}
                                                >
                                                    OVERDUE
                                                </motion.span>
                                            )}
                                            {isDeadlineApproaching(assignment.deadline) && !isOverdue(assignment.deadline) && (
                                                <motion.span 
                                                    className="text-orange-500 text-xs font-bold"
                                                    animate={{ scale: [1, 1.05, 1] }}
                                                    transition={{ duration: 1, repeat: Infinity }}
                                                >
                                                    DUE SOON
                                                </motion.span>
                                            )}
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
                                </motion.div>

                                {/* Action Buttons */}
                                <motion.div 
                                    className="flex flex-col sm:flex-row gap-4 pt-6"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    <motion.button
                                        className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-xl flex-1"
                                        whileHover={{ scale: 1.05, }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleChangeDeadline(assignment)}
                                    >
                                        <span> Change Deadline</span>
                                    </motion.button>
                                    
                                    <motion.button
                                        className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-xl flex-1"
                                        whileHover={{ scale: 1.05,  }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => onFeedbackSubmit && onFeedbackSubmit(assignment, { isHOD: true })}
                                    >
                                        <span>Provide HOD Feedback</span>
                                    </motion.button>
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Change Deadline Modal */}
            <AnimatePresence>
                {showDeadlineModal && selectedAssignment && (
                    <motion.div 
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div 
                            className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 w-96 max-w-90vw shadow-2xl border border-white/20"
                            initial={{ scale: 0.8, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 50 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        >
                            <h3 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-700">
                                Change Assignment Deadline
                            </h3>
                            
                            <div className="space-y-4">
                                {/* Current Deadline Display */}
                                <motion.div
                                    className="p-4 bg-gray-50/70 backdrop-blur-sm rounded-xl border border-gray-200/30"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Deadline</label>
                                    <p className="text-gray-800 font-medium">
                                        {formatDeadline(selectedAssignment.deadline, selectedAssignment.hasTimeComponent)}
                                    </p>
                                </motion.div>

                                {/* New Date */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <label className="block text-sm font-medium text-gray-700 mb-2">New Date</label>
                                    <input
                                        type="date"
                                        value={newDeadline}
                                        onChange={(e) => setNewDeadline(e.target.value)}
                                        min={currentDateTime.date}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 bg-white/70 backdrop-blur-sm"
                                        required
                                    />
                                </motion.div>

                                {/* Time Toggle */}
                                <motion.div
                                    className="flex items-center space-x-3"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <input
                                        type="checkbox"
                                        id="useSpecificTimeModal"
                                        checked={useSpecificTime}
                                        onChange={(e) => setUseSpecificTime(e.target.checked)}
                                        className="w-4 h-4 text-red-500 focus:ring-red-400"
                                    />
                                    <label htmlFor="useSpecificTimeModal" className="text-sm text-gray-700">
                                        Set specific time (otherwise defaults to end of day)
                                    </label>
                                </motion.div>

                                {/* Time Field - Conditionally Visible */}
                                <AnimatePresence>
                                    {useSpecificTime && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Specific Time</label>
                                            <input
                                                type="time"
                                                value={newDeadlineTime}
                                                onChange={(e) => setNewDeadlineTime(e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 bg-white/70 backdrop-blur-sm"
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Reason */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Change</label>
                                    <textarea
                                        value={deadlineReason}
                                        onChange={(e) => setDeadlineReason(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 bg-white/70 backdrop-blur-sm resize-none"
                                        placeholder="Optional: Explain why the deadline is being changed"
                                        rows={3}
                                    />
                                </motion.div>

                                {/* Deadline Preview */}
                                {newDeadline && (
                                    <motion.div
                                        className="text-sm text-red-700 bg-red-50/70 p-3 rounded-xl border border-red-200/30"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <strong>New Deadline Preview:</strong><br />
                                        {useSpecificTime 
                                            ? `${new Date(`${newDeadline}T${newDeadlineTime}`).toLocaleString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: true
                                            })}`
                                            : `${new Date(`${newDeadline}T23:59`).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })} (End of day)`
                                        }
                                    </motion.div>
                                )}
                            </div>

                            <motion.div 
                                className="flex justify-end mt-6 space-x-3"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <motion.button
                                    onClick={() => {
                                        setShowDeadlineModal(false);
                                        setSelectedAssignment(null);
                                        setNewDeadline("");
                                        setNewDeadlineTime("23:59");
                                        setUseSpecificTime(false);
                                        setDeadlineReason("");
                                    }}
                                    className="py-2 px-6 bg-gray-200/50 backdrop-blur-sm text-gray-700 rounded-xl font-medium border border-white/30"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    onClick={handleDeadlineSubmit}
                                    disabled={!newDeadline}
                                    className="py-2 px-6 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-medium shadow-lg border border-white/20 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    whileHover={newDeadline ? { scale: 1.05 } : {}}
                                    whileTap={newDeadline ? { scale: 0.95 } : {}}
                                >
                                    Update Deadline
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

const HeadDashboard = () => {
    const [assignments, setAssignments] = useState([]);
    const [recentAssignments, setRecentAssignments] = useState([]);
    const [allAdminAssignments, setAllAdminAssignments] = useState([]);
    const [headContent, setHeadContent] = useState({
        notes: [],
        lectures: [],
        tests: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('latest');
    const [headName, setHeadName] = useState('');

    const tabs = [
        { id: 'latest', label: 'Latest Appeals' },
        { id: 'acceptedRejected', label: 'Accepted/Rejected Assignments' },
        { id: 'all-assignments', label: 'All Admin Assignments' },
        { id: 'notes', label: 'All Notes' },
        { id: 'lectures', label: 'All Lectures' },
        { id: 'tests', label: 'All Tests' }
    ];

    const fetchHeadContent = async (type) => {
        try {
            const token = localStorage.getItem('headToken');
            const response = await fetch(`http://localhost:5000/api/heads/content/${type}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (!response.ok) {
                throw new Error(`Failed to fetch ${type}`);
            }
            
            const data = await response.json();
            setHeadContent(prev => ({
                ...prev,
                [type]: data[type] || data
            }));
        } catch (err) {
            console.error(`Error fetching ${type}:`, err);
        }
    };

    const fetchAssignments = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('headToken');
            console.log('Head Token:', token);
            
            if (!token) {
                setError('No authentication token found. Please login again.');
                setLoading(false);
                return;
            }

            // Get head name from token
            try {
                const decodedToken = JSON.parse(atob(token.split('.')[1]));
                setHeadName(decodedToken.name || 'Head');
            } catch (e) {
                console.log('Could not decode token for name');
            }
            
            if (activeTab === 'all-assignments') {
                // Fetch all admin assignments
                const response = await fetch('http://localhost:5000/api/heads/admin-assignments/all', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
        
                if (!response.ok) {
                    throw new Error('Failed to fetch all admin assignments');
                }

                const data = await response.json();
                console.log('All Admin Assignments:', data);
                setAllAdminAssignments(data.assignments || []);
            } else if (['notes', 'lectures', 'tests'].includes(activeTab)) {
                // Fetch specific content type
                await fetchHeadContent(activeTab);
            } else {
                // Fetch regular assignments (appeals and accepted/rejected)
                const response = await fetch('http://localhost:5000/api/heads/assignments', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
        
                if (!response.ok) {
                    throw new Error('Failed to fetch assignments');
                }

                const data = await response.json();
                const { appeals, acceptedOrRejected } = data;
        
                console.log('Appeals:', appeals);
                console.log('Accepted or Rejected:', acceptedOrRejected);
        
                if (activeTab === 'latest') {
                    setAssignments(appeals || []);
                } else {
                    setRecentAssignments(acceptedOrRejected || []);
                }
            }
    
            setError(null);
        } catch (err) {
            console.error('Error fetching assignments:', err);
            
            if (err.status === 401) {
                setError('Authentication failed. Please login again.');
                localStorage.removeItem('headToken');
            } else if (err.status === 403) {
                setError('Access denied. You do not have permission to view these assignments.');
            } else {
                setError(err.message || 'Failed to fetch assignments.');
            }
        } finally {
            setLoading(false);
        }
    };

    const checkTokenExpiry = () => {
        const token = localStorage.getItem('headToken');
        if (token) {
            try {
                const decodedToken = JSON.parse(atob(token.split('.')[1]));
                const currentTime = Date.now() / 1000;
                
                if (decodedToken.exp - currentTime < 300) {
                    console.warn('Token expiring soon, please login again');
                    setError('Session expiring soon. Please login again.');
                }
            } catch (error) {
                console.error('Error checking token expiry:', error);
            }
        }
    };

    useEffect(() => {
        checkTokenExpiry();
        const interval = setInterval(checkTokenExpiry, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        fetchAssignments();
    }, [activeTab]);

    const handleDecision = async (id, decision) => {
        try {
            const token = localStorage.getItem('headToken');
            
            if (!token) {
                setError('No authentication token found. Please login again.');
                return;
            }
            
            const response = await fetch(`http://localhost:5000/api/heads/assignments/${id}/overturn`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ headDecision: decision })
            });

            if (!response.ok) {
                throw new Error('Failed to update decision');
            }

            fetchAssignments();
        } catch (error) {
            console.error('Error updating decision:', error);
            
            if (error.status === 401) {
                setError('Authentication failed. Please login again.');
                localStorage.removeItem('headToken');
            } else {
                setError('Failed to update decision. Please try again.');
            }
        }
    };

    const handleFeedbackSubmit = (feedbackResult) => {
        console.log('Head Dashboard - Feedback result:', feedbackResult);
        
        if (feedbackResult.success) {
            console.log('Feedback submitted successfully');
            fetchAssignments();
            setError(null);
        } else {
            console.error('Feedback submission failed:', feedbackResult.error);
            setError('Failed to submit feedback: ' + feedbackResult.error);
        }
    };

    const handleDeadlineChange = (assignmentId, updatedAssignment) => {
        // Update the local state with the new deadline
        setAllAdminAssignments(prev => prev.map(assignment => 
            assignment._id === assignmentId ? { ...assignment, ...updatedAssignment } : assignment
        ));
    };

    // Loading state
    if (loading) {
        return (
            <div className="relative min-h-screen bg-gradient-to-br from-red-50 to-red-200">
                <AdvancedBackground />
                
                <DashboardLayout 
                    title="Head of Department Dashboard" 
                    error={error}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    tabs={tabs}
                >
                    <div className="flex flex-col justify-center items-center h-96 space-y-6">
                        <motion.p 
                            className="text-2xl font-bold text-gray-700"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                            Loading HOD dashboard...
                        </motion.p>
                        <motion.div 
                            className="w-64 h-2 bg-white/30 rounded-full overflow-hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <motion.div
                                className="h-full bg-gradient-to-r from-red-800 to-red-900 rounded-full"
                                animate={{ x: [-100, 264] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            />
                        </motion.div>
                    </div>
                </DashboardLayout>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-red-50 to-red-200">
            <AdvancedBackground />
            
            <DashboardLayout 
                title="Head of Department Dashboard" 
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
                        {activeTab === 'all-assignments' ? (
                            <AllAdminAssignments 
                                assignments={allAdminAssignments}
                                onDeadlineChange={handleDeadlineChange}
                                onFeedbackSubmit={handleFeedbackSubmit}
                            />
                        ) : activeTab === 'notes' ? (
                            <NotesList notes={headContent.notes} />
                        ) : activeTab === 'lectures' ? (
                            <LecturesList lectures={headContent.lectures} />
                        ) : activeTab === 'tests' ? (
                            <TestsList 
                                tests={headContent.tests} 
                                handleDecision={handleDecision}
                                handleFeedbackSubmit={handleFeedbackSubmit}
                                isSubmissions={false}
                            />
                        ) : (
                            <AssignmentList 
                                assignments={activeTab === 'latest' ? assignments : recentAssignments}
                                handleDecision={handleDecision}
                                handleFeedbackSubmit={handleFeedbackSubmit}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Quick Stats Section */}
                <motion.div 
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mt-12"
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
                            className="text-3xl mb-2"
                           
                        >
                            📋
                        </motion.div>
                        <h3 className="text-lg font-semibold text-gray-800">Latest Appeals</h3>
                        <p className="text-2xl font-bold text-red-800">{assignments.length}</p>
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
                            className="text-3xl mb-2"
                        >
                            🧑‍🏫
                        </motion.div>
                        <h3 className="text-lg font-semibold text-gray-800">Decisions Made</h3>
                        <p className="text-2xl font-bold text-red-800">{recentAssignments.length}</p>
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
                            className="text-3xl mb-2"
                        >
                            📋
                        </motion.div>
                        <h3 className="text-lg font-semibold text-gray-800">All Assignments</h3>
                        <p className="text-2xl font-bold text-red-800">{allAdminAssignments.length}</p>
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
                            className="text-3xl mb-2"
                        >
                            📚
                        </motion.div>
                        <h3 className="text-lg font-semibold text-gray-800">All Notes</h3>
                        <p className="text-2xl font-bold text-red-800">{headContent.notes.length}</p>
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
                            className="text-3xl mb-2"
                        >
                            🎥
                        </motion.div>
                        <h3 className="text-lg font-semibold text-gray-800">All Lectures</h3>
                        <p className="text-2xl font-bold text-red-800">{headContent.lectures.length}</p>
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
                            className="text-3xl mb-2"
                        >
                            📝
                        </motion.div>
                        <h3 className="text-lg font-semibold text-gray-800">All Tests</h3>
                        <p className="text-2xl font-bold text-red-800">{headContent.tests.length}</p>
                    </motion.div>
                </motion.div>
            </DashboardLayout>
        </div>
    );
};

export default HeadDashboard;