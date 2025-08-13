import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
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
                color: `rgba(${Math.random() * 100 + 100}, ${Math.random() * 100 + 100}, ${Math.random() * 255}, ${Math.random() * 0.3 + 0.1})`,
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
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 to-teal-100/30 mix-blend-overlay"></div>
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
                        'linear-gradient(45deg, rgba(16,185,129,0.1), rgba(20,184,166,0.1))',
                        'linear-gradient(135deg, rgba(20,184,166,0.1), rgba(16,185,129,0.1))'
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

const UserAssignmentsByLabel = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Added states for modal
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
    const buttonRefs = useRef({});

    const fetchAssignments = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('userToken'); 
            const response = await axios.get('https://workqueue-backend.onrender.com/api/users/admin-assignments', {
                headers: { Authorization: `Bearer ${token}` }, 
            });
            console.log(response.data);

            setAssignments(response.data.assignments);
            setError(null);
        } catch (err) {
            console.error('Error fetching assignments:', err);
            setError(err.response?.data?.message || 'Failed to fetch assignments.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssignments();
    }, []);

    // Added modal functions
    const openDetailsModal = (assignment, assignmentId) => {
        const buttonElement = buttonRefs.current[assignmentId];
        if (buttonElement) {
            const rect = buttonElement.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
            
            setModalPosition({
                x: rect.left + scrollLeft - 200, // Offset modal to the left of button
                y: rect.top + scrollTop - 100   // Offset modal above the button
            });
        }
        setSelectedAssignment(assignment);
    };

    const closeDetailsModal = () => {
        setSelectedAssignment(null);
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.2,
                staggerChildren: 0.1
            }
        }
    };

    const headerVariants = {
        hidden: { 
            opacity: 0, 
            y: -30,
            scale: 0.9
        },
        visible: { 
            opacity: 1, 
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                damping: 15,
                stiffness: 400,
                duration: 0.8
            }
        }
    };

    const cardVariants = {
        hidden: { 
            opacity: 0, 
            y: 30,
            scale: 0.95
        },
        visible: { 
            opacity: 1, 
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                damping: 20,
                stiffness: 300,
                duration: 0.6
            }
        }
    };

    const loadingVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { 
            opacity: 1, 
            scale: 1,
            transition: {
                type: "spring",
                damping: 15,
                stiffness: 400
            }
        }
    };

    const errorVariants = {
        hidden: { 
            opacity: 0, 
            scale: 0.8,
            y: -10
        },
        visible: { 
            opacity: 1, 
            scale: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 20,
                stiffness: 300
            }
        }
    };

    // Added modal variants
    const modalVariants = {
        hidden: { 
            opacity: 0, 
            scale: 0.8,
            y: 20
        },
        visible: { 
            opacity: 1, 
            scale: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 25,
                stiffness: 300
            }
        },
        exit: { 
            opacity: 0, 
            scale: 0.8,
            y: 20,
            transition: { duration: 0.2 }
        }
    };

    const getPriorityColor = (deadline) => {
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
        const deadlineDate = new Date(deadline);
        const now = new Date();
        const timeDiff = deadlineDate - now;
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        if (daysDiff < 0) return 'Overdue';
        if (daysDiff <= 2) return 'Urgent';
        if (daysDiff <= 7) return 'Due Soon';
        return 'Normal';
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Added functions for deadline with hours
    const formatDateWithTime = (date) => {
        return new Date(date).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
            <AdvancedBackground />
            
            <motion.div 
                className="relative z-10 p-6 max-w-6xl mx-auto"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Header Section */}
                <motion.div 
                    className="bg-gradient-to-r from-emerald-600/80 to-teal-600/80 backdrop-blur-sm text-white p-8 rounded-2xl shadow-2xl border border-white/20 relative overflow-hidden mb-8"
                    variants={headerVariants}
                    whileHover={{ 
                        scale: 1.02,
                        boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
                        transition: { 
                            type: "spring",
                            damping: 20,
                            stiffness: 400 
                        }
                    }}
                >
                    {/* Animated gradient overlay */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"
                        animate={{
                            x: ['-100%', '100%'],
                            opacity: [0, 0.5, 0]
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    
                    <div className="relative z-10 text-center">
                        <motion.h1 
                            className="text-4xl font-bold mb-2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                        >
                            Available Assignments
                            <motion.span
                                className="inline-block ml-2"
                                animate={{ rotate: [0, 15, -15, 0] }}
                                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                            >
                                🎯
                            </motion.span>
                        </motion.h1>
                        <motion.p 
                            className="text-lg text-white/90"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                        >
                            Discover new assignments assigned to your profile
                        </motion.p>
                    </div>
                </motion.div>

                {/* Content Section */}
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div 
                            key="loading"
                            className="flex flex-col justify-center items-center h-96 space-y-4"
                            variants={loadingVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                        >
                            <motion.div
                                animate={{ 
                                    rotate: 360,
                                    scale: [1, 1.1, 1]
                                }}
                                transition={{ 
                                    rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                                    scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                                }}
                            >
                                <svg 
                                    className="h-16 w-16 text-emerald-600" 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    fill="none" 
                                    viewBox="0 0 24 24"
                                >
                                    <circle 
                                        className="opacity-25" 
                                        cx="12" 
                                        cy="12" 
                                        r="10" 
                                        stroke="currentColor" 
                                        strokeWidth="4"
                                    />
                                    <path 
                                        className="opacity-75" 
                                        fill="currentColor" 
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                            </motion.div>
                            <motion.p 
                                className="text-emerald-600 font-medium text-xl"
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            >
                                Loading assignments...
                            </motion.p>
                        </motion.div>
                    ) : error ? (
                        <motion.div 
                            key="error"
                            className="bg-red-50/80 backdrop-blur-sm border border-red-300 text-red-700 p-6 rounded-2xl shadow-lg"
                            variants={errorVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                        >
                            <motion.div
                                className="flex items-center justify-center space-x-3"
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                            >
                                <motion.svg 
                                    className="w-6 h-6 text-red-500"
                                    fill="currentColor" 
                                    viewBox="0 0 20 20"
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <path 
                                        fillRule="evenodd" 
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
                                        clipRule="evenodd" 
                                    />
                                </motion.svg>
                                <span className="font-medium text-lg">{error}</span>
                            </motion.div>
                        </motion.div>
                    ) : assignments.length === 0 ? (
                        <motion.div
                            key="empty"
                            className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl p-12 border border-white/20 text-center"
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                        >
                            <motion.div
                                className="text-6xl mb-4"
                                animate={{ 
                                    y: [0, -10, 0],
                                    rotate: [0, 5, -5, 0]
                                }}
                                transition={{ 
                                    duration: 3, 
                                    repeat: Infinity, 
                                    ease: "easeInOut" 
                                }}
                            >
                                📭
                            </motion.div>
                            <h3 className="text-2xl font-bold text-gray-700 mb-2">No Assignments Found</h3>
                            <p className="text-gray-600">There are no assignments available for your profile at the moment.</p>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="assignments"
                            className="space-y-6"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {assignments.map((assignment, index) => (
                                <motion.div
                                    key={assignment._id}
                                    className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 relative overflow-hidden"
                                    variants={cardVariants}
                                    whileHover={{ 
                                        scale: 1.02,
                                        boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
                                        transition: { 
                                            type: "spring",
                                            damping: 20,
                                            stiffness: 400 
                                        }
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {/* Subtle animated overlay */}
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl"
                                        animate={{
                                            background: [
                                                'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%)',
                                                'linear-gradient(225deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
                                                'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%)'
                                            ]
                                        }}
                                        transition={{
                                            duration: 8,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                            delay: index * 0.5
                                        }}
                                    />

                                    {/* Priority Badge */}
                                    <motion.div
                                        className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getPriorityColor(assignment.deadline)}`}
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.3, type: "spring", damping: 15, stiffness: 400 }}
                                    >
                                        {getPriorityLabel(assignment.deadline)}
                                    </motion.div>

                                    <div className="relative z-10">
                                        {/* Title */}
                                        <motion.h2 
                                            className="text-2xl font-bold text-gray-800 mb-3 pr-20"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 }}
                                        >
                                            {assignment.title}
                                        </motion.h2>

                                        {/* Description */}
                                        <motion.div
                                            className="mb-4"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            <p className="text-gray-700 leading-relaxed">
                                                <span className="font-semibold text-emerald-600">Description:</span> {assignment.description}
                                            </p>
                                        </motion.div>

                                        {/* Assignment Details Grid */}
                                        <motion.div 
                                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            {/* Assigned By */}
                                            <div className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm rounded-lg p-3">
                                                <motion.div
                                                    className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold"
                                                    animate={{ rotate: [0, 360] }}
                                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                                >
                                                    👨‍🏫
                                                </motion.div>
                                                <div>
                                                    <p className="text-sm text-gray-600 font-medium">Assigned By</p>
                                                    <p className="font-semibold text-gray-800">{assignment.admin}</p>
                                                </div>
                                            </div>

                                            {/* Deadline - Updated to include time */}
                                            <div className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm rounded-lg p-3">
                                                <motion.div
                                                    className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold"
                                                    animate={{ scale: [1, 1.1, 1] }}
                                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                                >
                                                    ⏰
                                                </motion.div>
                                                <div>
                                                    <p className="text-sm text-gray-600 font-medium">Deadline</p>
                                                    <p className="font-semibold text-gray-800">{formatDateWithTime(assignment.deadline)}</p>
                                                </div>
                                            </div>

                                            {/* Created Date */}
                                            <div className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm rounded-lg p-3">
                                                <motion.div
                                                    className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold"
                                                    animate={{ y: [0, -5, 0] }}
                                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                                >
                                                    📅
                                                </motion.div>
                                                <div>
                                                    <p className="text-sm text-gray-600 font-medium">Created</p>
                                                    <p className="font-semibold text-gray-800">{formatDate(assignment.createdAt)}</p>
                                                </div>
                                            </div>

                                            {/* Status */}
                                            <div className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm rounded-lg p-3">
                                                <motion.div
                                                    className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold"
                                                    animate={{ rotate: [0, 10, -10, 0] }}
                                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                                >
                                                    ✨
                                                </motion.div>
                                                <div>
                                                    <p className="text-sm text-gray-600 font-medium">Status</p>
                                                    <p className="font-semibold text-emerald-600">Available</p>
                                                </div>
                                            </div>
                                        </motion.div>

                                        {/* Action Button - Updated to open modal */}
                                        <motion.div
                                            className="mt-6 flex justify-end"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 }}
                                        >
                                            <motion.button
                                                ref={el => buttonRefs.current[assignment._id] = el}
                                                onClick={() => openDetailsModal(assignment, assignment._id)}
                                                className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium rounded-lg shadow-lg border border-white/20 backdrop-blur-sm relative overflow-hidden"
                                                whileHover={{ 
                                                    scale: 1.05,
                                                    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                                                    transition: { 
                                                        type: "spring", 
                                                        damping: 15, 
                                                        stiffness: 400 
                                                    }
                                                }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                {/* Button shine effect */}
                                                <motion.div
                                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                                    animate={{
                                                        x: ['-100%', '100%']
                                                    }}
                                                    transition={{
                                                        duration: 2,
                                                        repeat: Infinity,
                                                        repeatDelay: 4,
                                                        ease: "easeInOut"
                                                    }}
                                                />
                                                
                                                <span className="relative z-10 flex items-center space-x-2">
                                                    <span>View Details</span>
                                                    <motion.span
                                                        animate={{ x: [0, 3, 0] }}
                                                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                                    >
                                                        →
                                                    </motion.span>
                                                </span>
                                            </motion.button>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Details Modal - Added */}
                <AnimatePresence>
                    {selectedAssignment && (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={closeDetailsModal}
                            />
                            
                            {/* Modal */}
                            <motion.div
                                className="fixed z-50 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20"
                                style={{
                                    left: Math.max(20, Math.min(modalPosition.x, window.innerWidth - 420)),
                                    top: Math.max(20, Math.min(modalPosition.y, window.innerHeight - 600)),
                                    width: '400px',
                                    maxHeight: '500px'
                                }}
                                variants={modalVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                {/* Header */}
                                <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 rounded-t-2xl">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-xl font-bold">Assignment Details</h3>
                                        <motion.button
                                            onClick={closeDetailsModal}
                                            className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            ✕
                                        </motion.button>
                                    </div>
                                </div>

                                {/* Content - No scrollbar */}
                                <div className="p-6 space-y-3" style={{ maxHeight: '350px', overflowY: 'hidden' }}>
                                    {/* Title */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <h4 className="font-semibold text-gray-700 mb-1 text-sm">Title</h4>
                                        <p className="text-gray-900 bg-gray-50 p-2 rounded-lg text-sm">{selectedAssignment.title}</p>
                                    </motion.div>

                                    {/* Description */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <h4 className="font-semibold text-gray-700 mb-1 text-sm">Description</h4>
                                        <p className="text-gray-900 bg-gray-50 p-2 rounded-lg leading-relaxed text-xs">{selectedAssignment.description}</p>
                                    </motion.div>

                                    {/* Details Grid */}
                                    <motion.div
                                        className="grid grid-cols-2 gap-3"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <div>
                                            <h4 className="font-semibold text-gray-700 mb-1 text-sm">Assigned By</h4>
                                            <p className="text-gray-900 bg-gray-50 p-2 rounded-lg text-xs">{selectedAssignment.admin}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-700 mb-1 text-sm">Priority</h4>
                                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getPriorityColor(selectedAssignment.deadline)}`}>
                                                {getPriorityLabel(selectedAssignment.deadline)}
                                            </span>
                                        </div>
                                    </motion.div>

                                    {/* Deadline with Full Date and Time */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        <h4 className="font-semibold text-gray-700 mb-1 text-sm">Deadline</h4>
                                        <div className="bg-red-50 border border-red-200 p-2 rounded-lg">
                                            <p className="text-red-800 font-semibold text-sm">{formatDateWithTime(selectedAssignment.deadline)}</p>
                                        </div>
                                    </motion.div>

                                    {/* Created Date */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <h4 className="font-semibold text-gray-700 mb-1 text-sm">Created</h4>
                                        <p className="text-gray-900 bg-gray-50 p-2 rounded-lg text-sm">{formatDateWithTime(selectedAssignment.createdAt)}</p>
                                    </motion.div>
                                </div>

                                {/* Footer */}
                                <div className="sticky bottom-0 bg-gray-50 p-4 rounded-b-2xl border-t border-gray-200">
                                    <motion.button
                                        onClick={closeDetailsModal}
                                        className="w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-medium hover:from-emerald-700 hover:to-teal-700 transition-all"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Close
                                    </motion.button>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default UserAssignmentsByLabel;