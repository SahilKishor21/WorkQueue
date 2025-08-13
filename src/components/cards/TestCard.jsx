import React, { useState } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";

const TestCard = ({ test, handleDecision, onFeedbackClick, index = 0, isSubmission = false }) => {
    const [showAppealModal, setShowAppealModal] = useState(false);
    const [showAppealDetailsModal, setShowAppealDetailsModal] = useState(false);
    const [appealSubject, setAppealSubject] = useState("");
    const [appealDescription, setAppealDescription] = useState("");
    const [status, setStatus] = useState(test.status);

    let isAdmin = false;
    let isUser = false;
    let isHOD = false;
    let currentToken = null;
    
    try {
        const adminToken = localStorage.getItem("adminToken");
        const userToken = localStorage.getItem("userToken");
        const headToken = localStorage.getItem("headToken");
        
        const tokenCount = [headToken, adminToken, userToken].filter(Boolean).length;
        
        let decodedToken = null;
        
        if (tokenCount > 1) {
            const currentRole = localStorage.getItem("userRole");
            
            if (currentRole === "user" && userToken) {
                currentToken = userToken;
                decodedToken = JSON.parse(atob(userToken.split(".")[1]));
                isUser = true;
            } else if (currentRole === "admin" && adminToken) {
                currentToken = adminToken;
                decodedToken = JSON.parse(atob(adminToken.split(".")[1]));
                isAdmin = true;
            } else if ((currentRole === "HOD" || currentRole === "Head") && headToken) {
                currentToken = headToken;
                decodedToken = JSON.parse(atob(headToken.split(".")[1]));
                isHOD = true;
            } else {
                if (headToken) {
                    currentToken = headToken;
                    decodedToken = JSON.parse(atob(headToken.split(".")[1]));
                    isHOD = decodedToken.role === "HOD" || decodedToken.role === "Head";
                } else if (adminToken) {
                    currentToken = adminToken;
                    decodedToken = JSON.parse(atob(adminToken.split(".")[1]));
                    isAdmin = decodedToken.role === "admin";
                } else if (userToken) {
                    currentToken = userToken;
                    decodedToken = JSON.parse(atob(userToken.split(".")[1]));
                    isUser = decodedToken.role === "user";
                }
            }
        } else {
            if (headToken) {
                currentToken = headToken;
                decodedToken = JSON.parse(atob(headToken.split(".")[1]));
                isHOD = decodedToken.role === "HOD" || decodedToken.role === "Head";
            } else if (adminToken) {
                currentToken = adminToken;
                decodedToken = JSON.parse(atob(adminToken.split(".")[1]));
                const role = localStorage.getItem("userRole");
                isAdmin = role === "admin" || decodedToken.role === "admin";
            } else if (userToken) {
                currentToken = userToken;
                decodedToken = JSON.parse(atob(userToken.split(".")[1]));
                const role = localStorage.getItem("userRole");
                isUser = role === "user" || decodedToken.role === "user";
            }
        }
    } catch (error) {
        console.error("Error decoding token:", error);
    }

    const getTheme = () => {
        if (isUser) {
            return {
                primary: "from-green-600 to-teal-600",
                secondary: "from-teal-500 to-green-600", 
                textGradient: "from-green-600 to-teal-600",
                statusColors: {
                    accepted: "bg-green-100 text-green-800",
                    rejected: "bg-red-100 text-red-800", 
                    pending: "bg-teal-100 text-teal-800"
                }
            };
        } else if (isHOD) {
            return {
                primary: "from-purple-600 to-violet-600",
                secondary: "from-violet-500 to-purple-600",
                textGradient: "from-purple-600 to-violet-600",
                statusColors: {
                    accepted: "bg-green-100 text-green-800",
                    rejected: "bg-red-100 text-red-800",
                    pending: "bg-purple-100 text-purple-800"
                }
            };
        } else {
            return {
                primary: "from-green-600 to-teal-600",
                secondary: "from-teal-500 to-green-600",
                textGradient: "from-green-600 to-teal-600",
                statusColors: {
                    accepted: "bg-green-100 text-green-800",
                    rejected: "bg-red-100 text-red-800",
                    pending: "bg-amber-100 text-amber-800"
                }
            };
        }
    };

    const theme = getTheme();

    const formatDeadline = (dateString) => {
        if (!dateString) return null;
        const deadline = new Date(dateString);
        const now = new Date();
        const diffTime = deadline - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) {
            return { text: "Expired", color: "text-red-600" };
        } else if (diffDays === 0) {
            return { text: "Due Today", color: "text-orange-600" };
        } else if (diffDays === 1) {
            return { text: "Due Tomorrow", color: "text-yellow-600" };
        } else if (diffDays <= 7) {
            return { text: `${diffDays} days left`, color: "text-yellow-600" };
        } else {
            return { text: `${diffDays} days left`, color: "text-green-600" };
        }
    };

    const deadline = test.deadline ? formatDeadline(test.deadline) : null;

    const onAccept = async (testId) => {
        try {
            const token = localStorage.getItem("adminToken");
            const response = await fetch(
                `https://workqueue-backend.onrender.com/api/assignments/${testId}/accept`,
                {
                    method: "PATCH",
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setStatus("Accepted");
            if (handleDecision) {
                handleDecision(testId, "Accepted");
            }
        } catch (error) {
            console.error("Error accepting test:", error.message);
        }
    };

    const onReject = async (testId) => {
        try {
            const token = localStorage.getItem("adminToken");
            const response = await fetch(
                `https://workqueue-backend.onrender.com/api/assignments/${testId}/reject`,
                {
                    method: "PATCH",
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setStatus("Rejected");
            if (handleDecision) {
                handleDecision(testId, "Rejected");
            }
        } catch (error) {
            console.error("Error rejecting test:", error.message);
        }
    };

    const onOverturnDecision = async (testId) => {
        try {
            const headToken = localStorage.getItem("headToken");
            const newStatus = status === "Accepted" ? "Rejected" : "Accepted";
            
            const response = await fetch(
                `https://workqueue-backend.onrender.com/api/heads/assignments/${testId}/overturn`,
                {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${headToken}` 
                    },
                    body: JSON.stringify({ headDecision: newStatus })
                }
            );
            setStatus(newStatus);
            if (handleDecision) {
                handleDecision(testId, newStatus);
            }
        } catch (error) {
            console.error("Error overturning test decision:", error.message);
        }
    };

    const onAppealSubmit = async () => {
        try {
            const token = localStorage.getItem("userToken");
            const testId = test._id || test.id;
            const appealData = { subject: appealSubject, description: appealDescription };

            const response = await fetch(
                `https://workqueue-backend.onrender.com/api/users/${testId}/appeal`,
                {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}` 
                    },
                    body: JSON.stringify(appealData)
                }
            );

            setShowAppealModal(false);
            setAppealSubject("");
            setAppealDescription("");
        } catch (error) {
            console.error("Error submitting appeal:", error.message);
        }
    };

    const handleFeedbackClick = () => {
        if (onFeedbackClick) {
            onFeedbackClick(test, { isAdmin, isHOD });
        }
    };

    const handleTakeTest = () => {
        if (test.testUrl) {
            window.open(test.testUrl, '_blank');
        }
    };

    const hasAppealDetails = test.appealDetails && 
        (test.appealDetails.subject || test.appealDetails.description);

    const getStatusBadge = (status) => {
        switch (status) {
            case "Accepted":
                return theme.statusColors.accepted;
            case "Rejected":
                return theme.statusColors.rejected;
            case "Pending":
                return theme.statusColors.pending;
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const cardVariants = {
        hidden: { 
            opacity: 0, 
            y: 50, 
            scale: 0.9,
            rotateX: -15
        },
        visible: { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            rotateX: 0,
            transition: {
                type: "spring",
                damping: 20,
                stiffness: 300,
                delay: index * 0.1,
                duration: 0.6
            }
        }
    };

    const contentVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.2 + (index * 0.1),
                staggerChildren: 0.08
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
            scale: 1.05, 
            boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
            transition: { type: "spring", damping: 15, stiffness: 400 }
        },
        tap: { scale: 0.95 }
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
                stiffness: 300
            }
        },
        exit: { 
            opacity: 0, 
            scale: 0.8, 
            y: 50,
            transition: { duration: 0.2 }
        }
    };

    return (
        <>
            <motion.div 
                className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl p-6 space-y-4 border border-white/20 relative overflow-hidden"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ 
                    y: -8, 
                    scale: 1.02,
                    boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
                    transition: { type: "spring", damping: 20, stiffness: 400 }
                }}
                style={{ perspective: "1000px" }}
            >
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
                        ease: "easeInOut"
                    }}
                />

                <motion.div variants={contentVariants} initial="hidden" animate="visible" className="relative z-10">
                    {/* Header */}
                    <motion.div className="flex items-start justify-between mb-4" variants={itemVariants}>
                        <div className="flex items-start space-x-3 flex-1">
                            <motion.div 
                                className="text-3xl"
                                animate={{ 
                                    rotate: [0, 10, -10, 0],
                                    scale: [1, 1.1, 1]
                                }}
                                transition={{ 
                                    duration: 4, 
                                    repeat: Infinity, 
                                    ease: "easeInOut" 
                                }}
                            >
                                📝
                            </motion.div>
                            <div className="flex-1 min-w-0">
                                <motion.h5 
                                    className={`text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${theme.textGradient} leading-tight`}
                                    variants={itemVariants}
                                >
                                    {isSubmission ? test.title : test.title}
                                </motion.h5>
                                <motion.p 
                                    className="text-sm text-gray-600 font-medium"
                                    variants={itemVariants}
                                >
                                    {isSubmission ? `Test Submission by ${test.user}` : `Test by ${test.admin}`}
                                </motion.p>
                            </div>
                        </div>
                        
                        {/* Status Badge or Deadline */}
                        {isSubmission ? (
                            <motion.span
                                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(status)}`}
                                whileHover={{ scale: 1.1 }}
                                transition={{ type: "spring", damping: 20, stiffness: 400, delay: 0.3 }}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                {status}
                            </motion.span>
                        ) : deadline && (
                            <motion.div
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${deadline.color} bg-white/20 border border-current/20`}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3, type: "spring", damping: 15, stiffness: 400 }}
                                whileHover={{ scale: 1.1 }}
                            >
                                {deadline.text}
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Description */}
                    {!isSubmission && (
                        <motion.div className="mb-4" variants={itemVariants}>
                            <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                                {test.description}
                            </p>
                        </motion.div>
                    )}

                    {/* Metadata */}
                    <motion.div className="space-y-2 mb-4" variants={contentVariants}>
                        {isSubmission ? (
                            <>
                                <motion.p className="text-gray-700" variants={itemVariants}>
                                    <strong className="text-gray-900">Student:</strong> {test.user}
                                </motion.p>
                                <motion.p className="text-gray-700" variants={itemVariants}>
                                    <strong className="text-gray-900">Assigned Admin:</strong> {test.admin}
                                </motion.p>
                                <motion.p className="text-gray-700" variants={itemVariants}>
                                    <strong className="text-gray-900">Submitted At:</strong>{" "}
                                    {new Date(test.createdAt).toLocaleString()}
                                </motion.p>
                            </>
                        ) : (
                            <>
                                <motion.div className="flex justify-between items-center" variants={itemVariants}>
                                    <span className="text-xs text-gray-600 font-medium">Category:</span>
                                    <motion.span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${theme.primary} text-white`}
                                        whileHover={{ scale: 1.1 }}
                                        transition={{ type: "spring", damping: 20, stiffness: 400 }}
                                    >
                                        {test.label}
                                    </motion.span>
                                </motion.div>
                                
                                <motion.div className="flex justify-between items-center" variants={itemVariants}>
                                    <span className="text-xs text-gray-600 font-medium">Created:</span>
                                    <span className="text-xs text-gray-700">
                                        {new Date(test.createdAt).toLocaleString()}
                                    </span>
                                </motion.div>

                                {deadline && (
                                    <motion.div className="flex justify-between items-center" variants={itemVariants}>
                                        <span className="text-xs text-gray-600 font-medium">Deadline:</span>
                                        <span className={`text-xs font-semibold ${deadline.color}`}>
                                            {new Date(test.deadline).toLocaleString()}
                                        </span>
                                    </motion.div>
                                )}
                            </>
                        )}
                    </motion.div>

                    {/* Feedback Display */}
                    <AnimatePresence>
                        {isSubmission && test.feedback && (test.feedback.adminFeedback || test.feedback.headFeedback) && (
                            <motion.div 
                                className="mt-4 space-y-2"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {test.feedback.adminFeedback && (
                                    <motion.div 
                                        className="p-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl"
                                        whileHover={{ scale: 1.02 }}
                                        transition={{ type: "spring", damping: 20, stiffness: 400 }}
                                    >
                                        <h6 className={`font-semibold mb-2 text-transparent bg-clip-text bg-gradient-to-r ${theme.textGradient}`}>
                                            Admin Feedback:
                                        </h6>
                                        <p className="text-gray-700 text-sm leading-relaxed">{test.feedback.adminFeedback}</p>
                                    </motion.div>
                                )}
                                {test.feedback.headFeedback && (
                                    <motion.div 
                                        className="p-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl"
                                        whileHover={{ scale: 1.02 }}
                                        transition={{ type: "spring", damping: 20, stiffness: 400 }}
                                    >
                                        <h6 className={`font-semibold mb-2 text-transparent bg-clip-text bg-gradient-to-r ${theme.textGradient}`}>
                                            Head Feedback:
                                        </h6>
                                        <p className="text-gray-700 text-sm leading-relaxed">{test.feedback.headFeedback}</p>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Appeal Details */}
                    <AnimatePresence>
                        {isSubmission && hasAppealDetails && (
                            <motion.div 
                                className="flex items-center justify-between p-4 bg-yellow-50/20 backdrop-blur-sm border border-yellow-200/30 rounded-xl"
                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                                whileHover={{ scale: 1.02 }}
                                transition={{ type: "spring", damping: 20, stiffness: 400 }}
                            >
                                <div className="flex items-center">
                                    <motion.span 
                                        className="w-3 h-3 bg-yellow-500 rounded-full mr-3"
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                    <span className="text-yellow-800 font-medium">Appeal Submitted</span>
                                </div>
                                <motion.button
                                    onClick={() => setShowAppealDetailsModal(true)}
                                    className="text-yellow-600 hover:text-yellow-800 font-medium text-sm hover:underline"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    View Details
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Action Buttons */}
                    <motion.div className="space-y-3 mt-4" variants={itemVariants}>
                        {/* Download/Take Test Button */}
                        {!isSubmission && (
                            <motion.button
                                onClick={handleTakeTest}
                                className={`w-full py-3 bg-gradient-to-r ${theme.secondary} text-white rounded-xl font-medium shadow-lg border border-white/20 backdrop-blur-sm relative overflow-hidden`}
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                            >
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
                                <span className="relative z-10 flex items-center justify-center space-x-2">
                                    <span>📝</span>
                                    <span>Take Test</span>
                                </span>
                            </motion.button>
                        )}

                        {/* Download Task Button for submissions */}
                        {isSubmission && (
                            <motion.a
                                href={test.filePath}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`block w-full text-center py-3 bg-gradient-to-r ${theme.secondary} text-white rounded-xl font-medium shadow-lg border border-white/20 backdrop-blur-sm relative overflow-hidden`}
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                            >
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
                                <span className="relative z-10 flex items-center justify-center space-x-2">
                                    <span>📥</span>
                                    <span>Download Submission</span>
                                </span>
                            </motion.a>
                        )}

                        {/* Admin/HOD Actions for submissions */}
                        {isSubmission && (
                            <motion.div className="grid grid-cols-1 gap-2">
                                {/* Admin Actions */}
                                <AnimatePresence>
                                    {isAdmin && (
                                        <motion.div className="grid grid-cols-2 gap-2">
                                            <motion.button
                                                className="py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium shadow-lg border border-white/20 backdrop-blur-sm"
                                                onClick={() => onAccept(test._id || test.id)}
                                                variants={buttonVariants}
                                                whileHover="hover"
                                                whileTap="tap"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                            >
                                                Accept
                                            </motion.button>
                                            <motion.button
                                                className="py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl font-medium shadow-lg border border-white/20 backdrop-blur-sm"
                                                onClick={() => onReject(test._id || test.id)}
                                                variants={buttonVariants}
                                                whileHover="hover"
                                                whileTap="tap"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                            >
                                                Reject
                                            </motion.button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Feedback Buttons */}
                                <AnimatePresence>
                                    {isAdmin && (
                                        <motion.button
                                            className={`w-full py-3 bg-gradient-to-r ${theme.primary} text-white rounded-xl font-medium shadow-lg border border-white/20 backdrop-blur-sm`}
                                            onClick={handleFeedbackClick}
                                            variants={buttonVariants}
                                            whileHover="hover"
                                            whileTap="tap"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                        >
                                            Provide Admin Feedback
                                        </motion.button>
                                    )}
                                </AnimatePresence>

                                {/* HOD Actions */}
                                <AnimatePresence>
                                    {isHOD && (status === "Accepted" || status === "Rejected") && (
                                        <motion.button
                                            className="w-full py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-medium shadow-lg border border-white/20 backdrop-blur-sm"
                                            onClick={() => onOverturnDecision(test._id || test.id)}
                                            variants={buttonVariants}
                                            whileHover="hover"
                                            whileTap="tap"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                        >
                                            Overturn Decision ({status === "Accepted" ? "Reject" : "Accept"})
                                        </motion.button>
                                    )}
                                </AnimatePresence>

                                <AnimatePresence>
                                    {isHOD && (
                                        <motion.button
                                            className={`w-full py-3 bg-gradient-to-r ${theme.primary} text-white rounded-xl font-medium shadow-lg border border-white/20 backdrop-blur-sm`}
                                            onClick={handleFeedbackClick}
                                            variants={buttonVariants}
                                            whileHover="hover"
                                            whileTap="tap"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                        >
                                            Provide Head Feedback
                                        </motion.button>
                                    )}
                                </AnimatePresence>

                                {/* User Appeal Button */}
                                <AnimatePresence>
                                    {isUser && status === "Rejected" && isSubmission && (
                                        <motion.button
                                            className={`w-full py-3 bg-gradient-to-r ${theme.primary} text-white rounded-xl font-medium shadow-lg border border-white/20 backdrop-blur-sm`}
                                            onClick={() => setShowAppealModal(true)}
                                            variants={buttonVariants}
                                            whileHover="hover"
                                            whileTap="tap"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                        >
                                            Appeal to HOD
                                        </motion.button>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* Appeal Details Modal */}
            <AnimatePresence>
                {showAppealDetailsModal && hasAppealDetails && (
                    <motion.div 
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div 
                            className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 w-96 max-w-90vw shadow-2xl border border-white/20"
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <h3 className={`text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r ${theme.textGradient}`}>
                                Appeal Details
                            </h3>
                            <div className="space-y-4">
                                {test.appealDetails.subject && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                                        <div className="p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30">
                                            {test.appealDetails.subject}
                                        </div>
                                    </div>
                                )}
                                {test.appealDetails.description && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                        <div className="p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30 max-h-32 overflow-y-auto">
                                            {test.appealDetails.description}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-end mt-6">
                                <button
                                    onClick={() => setShowAppealDetailsModal(false)}
                                    className="py-2 px-6 bg-gray-200/50 backdrop-blur-sm text-gray-700 rounded-xl font-medium border border-white/30"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Appeal Modal */}
            <AnimatePresence>
                {showAppealModal && isUser && (
                    <motion.div 
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div 
                            className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 w-96 shadow-2xl border border-white/20"
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <h3 className={`text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r ${theme.textGradient}`}>
                                Appeal to HOD
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                                    <input
                                        type="text"
                                        value={appealSubject}
                                        onChange={(e) => setAppealSubject(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 bg-white/70 backdrop-blur-sm"
                                        placeholder="Enter subject"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                    <textarea
                                        value={appealDescription}
                                        onChange={(e) => setAppealDescription(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 bg-white/70 backdrop-blur-sm resize-none"
                                        placeholder="Enter description"
                                        rows={4}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end mt-6 space-x-3">
                                <button
                                    onClick={() => {
                                        setShowAppealModal(false);
                                        setAppealSubject("");
                                        setAppealDescription("");
                                    }}
                                    className="py-2 px-6 bg-gray-200/50 backdrop-blur-sm text-gray-700 rounded-xl font-medium border border-white/30"
                                >
                                    Cancel
                                </button>
                                <motion.button
                                    onClick={onAppealSubmit}
                                    className={`py-2 px-6 bg-gradient-to-r ${theme.primary} text-white rounded-xl font-medium shadow-lg border border-white/20 backdrop-blur-sm`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Submit
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

TestCard.propTypes = {
    test: PropTypes.shape({
        id: PropTypes.string,
        _id: PropTypes.string,
        title: PropTypes.string.isRequired,
        admin: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
        status: PropTypes.string,
        user: PropTypes.string,
        deadline: PropTypes.string,
        description: PropTypes.string,
        label: PropTypes.string,
        testUrl: PropTypes.string,
        filePath: PropTypes.string,
        feedback: PropTypes.shape({
            adminFeedback: PropTypes.string,
            headFeedback: PropTypes.string,
        }),
        appealDetails: PropTypes.shape({
            subject: PropTypes.string,
            description: PropTypes.string,
        }),
    }).isRequired,
    handleDecision: PropTypes.func,
    onFeedbackClick: PropTypes.func,
    index: PropTypes.number,
    isSubmission: PropTypes.bool,
};

export default TestCard;