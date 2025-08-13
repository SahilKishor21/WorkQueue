import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';

// Theme configuration helper
const getThemeConfig = (userRole) => {
    if (userRole?.isHOD) {
        return {
            primary: "from-red-800 to-red-900",
            secondary: "from-red-700 to-red-800",
            textGradient: "from-red-800 to-red-900",
            focusRing: "focus:ring-2 focus:ring-red-500",
            bgGradient: "from-red-100/40 to-red-200/40",
            particleColors: () => `rgba(${Math.random() * 50 + 120}, ${Math.random() * 30 + 30}, ${Math.random() * 50 + 50}, ${Math.random() * 0.3 + 0.1})`,
            movingGradient: [
                'linear-gradient(45deg, rgba(127,29,29,0.15), rgba(185,28,28,0.15))',
                'linear-gradient(135deg, rgba(185,28,28,0.15), rgba(127,29,29,0.15))'
            ]
        };
    } else {
        return {
            primary: "from-orange-600 to-amber-600",
            secondary: "from-amber-500 to-orange-600",
            textGradient: "from-orange-600 to-amber-600",
            focusRing: "focus:ring-2 focus:ring-orange-500",
            bgGradient: "from-orange-50/40 to-amber-100/40",
            particleColors: () => `rgba(${Math.random() * 100 + 155}, ${Math.random() * 80 + 100}, ${Math.random() * 50 + 50}, ${Math.random() * 0.3 + 0.1})`,
            movingGradient: [
                'linear-gradient(45deg, rgba(251,146,60,0.15), rgba(245,158,11,0.15))',
                'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(251,146,60,0.15))'
            ]
        };
    }
};

const AdvancedBackground = ({ theme }) => {
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        const generateParticles = () => {
            return Array.from({ length: 40 }, (_, index) => ({
                id: index,
                shape: Math.random() > 0.5 ? 'circle' : 'square',
                size: Math.random() * 60 + 15,
                left: Math.random() * 120 - 10,
                top: Math.random() * 120 - 10,
                color: theme.particleColors(),
                movementType: Math.floor(Math.random() * 3)
            }));
        };

        setParticles(generateParticles());
    }, [theme]);

    const getAnimationVariants = (movementType) => {
        const patterns = [
            {
                x: [0, Math.random() * 150 - 75, 0],
                y: [0, Math.random() * 150 - 75, 0],
                rotate: [0, 360, 0]
            },
            {
                x: [0, Math.random() * 100 - 50, 0],
                y: [0, Math.sin(Math.random() * 10) * 80, 0],
                scale: [1, 1.2, 1]
            },
            {
                x: [0, Math.random() * 200 - 100, 0],
                y: [0, Math.random() * 200 - 100, 0],
                opacity: [0.2, 0.6, 0.2]
            }
        ];

        return patterns[movementType];
    };

    return (
        <motion.div 
            className="absolute inset-0 overflow-hidden pointer-events-none z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <div className={`absolute inset-0 bg-gradient-to-br ${theme.bgGradient} mix-blend-overlay`}></div>
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
                        duration: Math.random() * 8 + 6,
                        repeat: Infinity,
                        repeatType: "mirror",
                        ease: "easeInOut"
                    }}
                />
            ))}

            <motion.div
                className="absolute inset-0 bg-white/10"
                animate={{
                    background: theme.movingGradient
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    repeatType: "reverse"
                }}
            />
        </motion.div>
    );
};

const FeedbackForm = ({ assignmentId, assignment, userRole, onClose, onSubmit }) => {
    const [feedback, setFeedback] = useState('');
    const [existingFeedback, setExistingFeedback] = useState({});
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetchingFeedback, setFetchingFeedback] = useState(true);
    const [currentUserRole, setCurrentUserRole] = useState('');
    const [userName, setUserName] = useState('');

    // Get theme configuration
    const theme = getThemeConfig(userRole);

    useEffect(() => {
        console.log('🔍 FeedbackForm Debug Info:');
        console.log('Assignment ID prop:', assignmentId);
        console.log('User Role prop:', userRole);
        console.log('Assignment prop:', assignment);

        // Initialize user data based on role
        const initializeUserData = () => {
            let token = null;
            let role = '';
            
            // Check which token exists based on user role
            if (userRole?.isHOD) {
                token = localStorage.getItem('headToken');
                role = 'Head';
                console.log('🔍 HEAD user detected, using headToken');
            } else if (userRole?.isAdmin) {
                token = localStorage.getItem('adminToken');
                role = 'Admin';
                console.log('🔍 ADMIN user detected, using adminToken');
            } else {
                // Fallback: check both tokens
                const headToken = localStorage.getItem('headToken');
                const adminToken = localStorage.getItem('adminToken');
                
                if (headToken) {
                    token = headToken;
                    role = 'Head';
                } else if (adminToken) {
                    token = adminToken;
                    role = 'Admin';
                }
            }
            
            console.log('Token found:', !!token);
            console.log('Role determined:', role);
            
            if (token) {
                try {
                    const decodedToken = JSON.parse(atob(token.split('.')[1]));
                    console.log('Decoded token:', decodedToken);
                    setUserName(decodedToken.name || role);
                    setCurrentUserRole(decodedToken.role || role);
                } catch (e) {
                    console.log('Could not decode token:', e);
                    setCurrentUserRole(role);
                }
            } else {
                setCurrentUserRole(role);
            }
        };

        const fetchFeedback = async () => {
            if (!assignmentId || assignmentId === 'undefined') {
                console.error('❌ Invalid assignment ID:', assignmentId);
                setError(`Invalid assignment ID: ${assignmentId}`);
                setFetchingFeedback(false);
                return;
            }

            try {
                console.log('📡 Fetching feedback for assignment ID:', assignmentId);
                
                // Get the appropriate token
                let token = null;
                let baseUrl = '';
                
                if (userRole?.isHOD) {
                    token = localStorage.getItem('headToken');
                    baseUrl = 'https://workqueue-backend.onrender.com/api/heads';
                } else {
                    token = localStorage.getItem('adminToken');
                    baseUrl = 'https://workqueue-backend.onrender.com/api/admin';
                }
                
                if (!token) {
                    setError('No authentication token found. Please login again.');
                    setFetchingFeedback(false);
                    return;
                }

                console.log('✅ Skipping feedback fetch, using assignment data');
                if (assignment?.feedback) {
                    setExistingFeedback(assignment.feedback);
                }
                setError(null);

            } catch (err) {
                console.error('❌ Error fetching feedback:', err);
                setError('Failed to load existing feedback');
            } finally {
                setFetchingFeedback(false);
            }
        };

        initializeUserData();
        fetchFeedback();
    }, [assignmentId, userRole, assignment]);

    const handleFeedbackChange = (e) => {
        setFeedback(e.target.value);
        if (error) setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        console.log('🚀 FEEDBACK SUBMISSION - Starting...');
        console.log('Assignment ID:', assignmentId);
        console.log('Feedback:', feedback);
        console.log('User Role Info:', userRole);

        if (!feedback.trim()) {
            setError('Please enter feedback before submitting.');
            setLoading(false);
            return;
        }

        try {
            // Use the parent component's submission handler which already has the correct logic
            if (onSubmit) {
                console.log('📞 Using parent submission handler...');
                await onSubmit({
                    assignmentId: assignmentId,
                    feedback: feedback.trim(),
                    userRole: currentUserRole
                });
                
                // If we get here, submission was successful
                setSuccess('Feedback submitted successfully!');
                setFeedback('');
                
                // Update existing feedback display
                const newFeedback = {
                    ...existingFeedback,
                    [userRole?.isHOD ? 'headFeedback' : 'adminFeedback']: feedback.trim()
                };
                setExistingFeedback(newFeedback);
                
            } else {
                throw new Error('No submission handler provided');
            }

        } catch (err) {
            console.error('❌ FEEDBACK SUBMISSION ERROR:', err);
            setError(err.message || 'Failed to submit feedback. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFeedback('');
        setError(null);
        setSuccess(false);
        onClose();
    };

    // Animation variants
    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { duration: 0.3 }
        },
        exit: { 
            opacity: 0,
            transition: { duration: 0.2 }
        }
    };

    const modalVariants = {
        hidden: { 
            opacity: 0, 
            scale: 0.8, 
            y: 50,
            rotateX: -15
        },
        visible: { 
            opacity: 1, 
            scale: 1, 
            y: 0,
            rotateX: 0,
            transition: {
                type: "spring",
                damping: 25,
                stiffness: 300,
                duration: 0.6
            }
        },
        exit: { 
            opacity: 0, 
            scale: 0.8, 
            y: 50,
            rotateX: -15,
            transition: { duration: 0.3 }
        }
    };

    const contentVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.2,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { 
            opacity: 1, 
            x: 0,
            transition: { type: "spring", damping: 20, stiffness: 300 }
        }
    };

    const buttonVariants = {
        hover: { 
            scale: 1.02,
            boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
            transition: { type: "spring", damping: 15, stiffness: 400 }
        },
        tap: { scale: 0.98 }
    };

    const messageVariants = {
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
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            y: -10,
            transition: { duration: 0.2 }
        }
    };

    return (
        <AnimatePresence>
            <motion.div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                variants={overlayVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={(e) => e.target === e.currentTarget && handleCancel()}
            >
                <motion.div 
                    className="bg-white/15 backdrop-blur-sm w-full max-w-2xl rounded-2xl shadow-2xl border border-white/20 relative overflow-hidden max-h-[90vh] overflow-y-auto"
                    variants={modalVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onClick={(e) => e.stopPropagation()}
                >
                    <AdvancedBackground theme={theme} />
                    
                    <motion.div 
                        className="relative z-10 p-8 space-y-6"
                        variants={contentVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* Header */}
                        <motion.div 
                            className="flex justify-between items-center"
                            variants={itemVariants}
                        >
                            <motion.h2 
                                className={`text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${theme.textGradient}`}
                                whileHover={{ 
                                    scale: 1.05,
                                    transition: { type: "spring", damping: 15, stiffness: 400 }
                                }}
                            >
                                Feedback Management
                            </motion.h2>
                            <motion.button 
                                onClick={handleCancel}
                                className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                transition={{ type: "spring", damping: 15, stiffness: 400 }}
                            >
                                ×
                            </motion.button>
                        </motion.div>

                        {/* User Info */}
                        <motion.div 
                            className={`bg-gradient-to-r ${theme.secondary}/20 backdrop-blur-sm border border-white/30 rounded-xl p-4`}
                            variants={itemVariants}
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", damping: 20, stiffness: 400 }}
                        >
                            <div className="flex items-center space-x-3">
                                <motion.div
                                    className={`w-10 h-10 bg-gradient-to-r ${theme.secondary} rounded-full flex items-center justify-center text-white font-bold`}
                                    animate={{ rotate: [0, 360] }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                >
                                    {userRole?.isHOD ? '👑' : '👨‍💼'}
                                </motion.div>
                                <div>
                                    <p className="text-white font-medium">
                                        <span className="text-white/80">Logged in as:</span> {userName || 'User'}
                                    </p>
                                    <p className="text-white/70 text-sm">
                                        Role: {userRole?.isHOD ? 'Head of Department' : 'Administrator'}
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Success Message */}
                        <AnimatePresence>
                            {success && (
                                <motion.div 
                                    className="bg-green-50/20 backdrop-blur-sm border border-green-300/30 text-green-100 p-4 rounded-xl"
                                    variants={messageVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                >
                                    <motion.div
                                        className="flex items-center justify-center space-x-2"
                                        initial={{ x: -10, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <motion.svg 
                                            className="w-6 h-6 text-green-400"
                                            fill="currentColor" 
                                            viewBox="0 0 20 20"
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 0.6 }}
                                        >
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </motion.svg>
                                        <span className="font-medium">{success}</span>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Error Message */}
                        <AnimatePresence>
                            {error && (
                                <motion.div 
                                    className="bg-red-50/20 backdrop-blur-sm border border-red-300/30 text-red-100 p-4 rounded-xl"
                                    variants={messageVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                >
                                    <motion.div
                                        className="flex items-start space-x-3"
                                        initial={{ x: -10, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <motion.svg 
                                            className="w-6 h-6 text-red-400 mt-0.5 flex-shrink-0"
                                            fill="currentColor" 
                                            viewBox="0 0 20 20"
                                            animate={{ rotate: [0, 10, -10, 0] }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </motion.svg>
                                        <span>{error}</span>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Existing Feedback Section */}
                        <motion.div variants={itemVariants}>
                            <motion.h3 
                                className="text-xl font-semibold text-white mb-4 flex items-center"
                                whileHover={{ x: 5 }}
                                transition={{ type: "spring", damping: 20, stiffness: 400 }}
                            >
                                <motion.svg 
                                    className="w-6 h-6 mr-3 text-orange-400"
                                    fill="currentColor" 
                                    viewBox="0 0 20 20"
                                    animate={{ rotate: [0, 5, -5, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                                </motion.svg>
                                Previous Feedback History
                            </motion.h3>
                            
                            {existingFeedback && (existingFeedback.adminFeedback || existingFeedback.headFeedback) ? (
                                <motion.div 
                                    className="max-h-48 overflow-y-auto bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 space-y-4"
                                    whileHover={{ scale: 1.01 }}
                                    transition={{ type: "spring", damping: 20, stiffness: 400 }}
                                >
                                    {existingFeedback.adminFeedback && (
                                        <motion.div 
                                            className="border-b border-white/20 pb-4"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 }}
                                        >
                                            <motion.div 
                                                className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-200 inline-block mb-3"
                                                whileHover={{ scale: 1.05 }}
                                            >
                                                👨‍💼 Admin Feedback
                                            </motion.div>
                                            <p className="text-white/90 leading-relaxed">{existingFeedback.adminFeedback}</p>
                                        </motion.div>
                                    )}
                                    {existingFeedback.headFeedback && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            <motion.div 
                                                className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-200 inline-block mb-3"
                                                whileHover={{ scale: 1.05 }}
                                            >
                                                👑 Head Feedback
                                            </motion.div>
                                            <p className="text-white/90 leading-relaxed">{existingFeedback.headFeedback}</p>
                                        </motion.div>
                                    )}
                                </motion.div>
                            ) : (
                                <motion.div 
                                    className="text-center py-8 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl"
                                    whileHover={{ scale: 1.01 }}
                                    transition={{ type: "spring", damping: 20, stiffness: 400 }}
                                >
                                    <motion.svg 
                                        className="w-16 h-16 text-white/30 mx-auto mb-3"
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                        animate={{ y: [0, -5, 0] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </motion.svg>
                                    <p className="text-white/60 font-medium">No previous feedback available</p>
                                    <p className="text-white/40 text-sm mt-1">Be the first to provide feedback for this assignment</p>
                                </motion.div>
                            )}
                        </motion.div>

                        {/* New Feedback Form */}
                        <motion.form 
                            onSubmit={handleSubmit} 
                            className="space-y-6"
                            variants={itemVariants}
                        >
                            <div>
                                <motion.label 
                                    htmlFor="feedback" 
                                    className="block text-white mb-3 font-medium text-lg"
                                    whileHover={{ x: 5 }}
                                    transition={{ type: "spring", damping: 20, stiffness: 400 }}
                                >
                                    Your Feedback as {userRole?.isHOD ? 'Head of Department' : 'Administrator'} 
                                    <motion.span 
                                        className="ml-2"
                                        animate={{ rotate: [0, 15, -15, 0] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    >
                                        ✍️
                                    </motion.span>
                                </motion.label>
                                <motion.textarea
                                    id="feedback"
                                    value={feedback}
                                    onChange={handleFeedbackChange}
                                    className={`w-full px-4 py-4 border border-white/30 rounded-xl focus:outline-none ${theme.focusRing} focus:border-transparent resize-none transition-all duration-200 bg-white/10 backdrop-blur-sm text-white placeholder-white/50`}
                                    rows="6"
                                    placeholder="Provide your detailed feedback here..."
                                    disabled={loading}
                                    required
                                    whileFocus={{ scale: 1.02 }}
                                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                                />
                            </div>

                            {/* Action Buttons */}
                            <motion.div 
                                className="flex space-x-4 pt-2"
                                variants={itemVariants}
                            >
                                <motion.button
                                    type="button"
                                    onClick={handleCancel}
                                    disabled={loading}
                                    className="flex-1 py-3 border border-white/30 text-white rounded-xl font-medium bg-white/5 backdrop-blur-sm disabled:opacity-50 relative overflow-hidden"
                                    variants={buttonVariants}
                                    whileHover="hover"
                                    whileTap="tap"
                                >
                                    {/* Button shine effect */}
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
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
                                    <span className="relative z-10">Cancel</span>
                                </motion.button>
                                
                                <motion.button
                                    type="submit"
                                    disabled={loading || !feedback.trim()}
                                    className={`flex-1 py-3 bg-gradient-to-r ${theme.primary} text-white rounded-xl font-medium shadow-lg border border-white/20 backdrop-blur-sm disabled:opacity-50 relative overflow-hidden`}
                                    variants={buttonVariants}
                                    whileHover={!loading ? "hover" : {}}
                                    whileTap={!loading ? "tap" : {}}
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
                                            repeatDelay: 3,
                                            ease: "easeInOut"
                                        }}
                                    />
                                    
                                    <div className="relative z-10 flex items-center justify-center space-x-2">
                                        {loading ? (
                                            <>
                                                <motion.svg 
                                                    className="h-5 w-5 text-white"
                                                    fill="none" 
                                                    viewBox="0 0 24 24"
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                >
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </motion.svg>
                                                <span>Submitting...</span>
                                            </>
                                        ) : (
                                            <>
                                                <motion.span
                                                    animate={{ rotate: [0, 15, -15, 0] }}
                                                    transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                                                >
                                                    📝
                                                </motion.span>
                                                <span>Submit Feedback</span>
                                            </>
                                        )}
                                    </div>
                                </motion.button>
                            </motion.div>
                        </motion.form>
                    </motion.div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

FeedbackForm.propTypes = {
    assignmentId: PropTypes.string.isRequired,
    assignment: PropTypes.object,
    userRole: PropTypes.object,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func,
};

export default FeedbackForm;