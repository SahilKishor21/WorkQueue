import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const AssignmentCard = ({ assignment, onFeedbackClick, handleDecision, index = 0 }) => {
  const [showAppealModal, setShowAppealModal] = useState(false);
  const [showAppealDetailsModal, setShowAppealDetailsModal] = useState(false);
  const [appealSubject, setAppealSubject] = useState("");
  const [appealDescription, setAppealDescription] = useState("");
  const [status, setStatus] = useState(assignment.status);

  let isAdmin = false;
  let isUser = false;
  let isHOD = false;
  let currentToken = null;
  
  try {
    const adminToken = localStorage.getItem("adminToken");
    const userToken = localStorage.getItem("userToken");
    const headToken = localStorage.getItem("headToken");
    
    // Count how many tokens exist
    const tokenCount = [headToken, adminToken, userToken].filter(Boolean).length;
    
    // If multiple tokens exist, we need to determine the active session
    // Priority: most recently set token, or explicit role indication
    let decodedToken = null;
    
    if (tokenCount > 1) {
      // Multiple tokens exist - this shouldn't happen in a clean system
      // Let's check which role is currently active by checking the page context
      // or use the userRole from localStorage as a hint
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
        // Fallback to original priority if userRole doesn't help
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
      // Single token - use original logic
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
    
    console.log('🔍 Role Detection Debug:', {
      tokenCount,
      hasHeadToken: !!headToken,
      hasAdminToken: !!adminToken, 
      hasUserToken: !!userToken,
      currentRole: localStorage.getItem("userRole"),
      isHOD,
      isAdmin,
      isUser
    });
    
  } catch (error) {
    console.error("Error decoding token:", error);
  }

  // Theme configuration based on actual logged-in user role
  const getTheme = () => {
    if (isUser) {
      return {
        primary: "from-emerald-600 to-teal-600",
        secondary: "from-emerald-500 to-teal-500", 
        tertiary: "from-teal-500 to-emerald-500",
        accent: "emerald",
        background: "from-emerald-50/30 to-teal-100/30",
        textGradient: "from-emerald-600 to-teal-600",
        buttonHover: "hover:from-emerald-700 hover:to-teal-700",
        statusColors: {
          accepted: "bg-emerald-100 text-emerald-800",
          rejected: "bg-red-100 text-red-800", 
          pending: "bg-teal-100 text-teal-800"
        }
      };
    } else if (isHOD) {
      // HOD gets the premium red/burgundy theme
      return {
        primary: "from-red-800 to-red-900",
        secondary: "from-red-700 to-red-800",
        tertiary: "from-red-600 to-red-700",
        accent: "red",
        background: "from-red-50/30 to-red-100/30",
        textGradient: "from-red-800 to-red-900",
        buttonHover: "hover:from-red-900 hover:to-red-950",
        statusColors: {
          accepted: "bg-green-100 text-green-800",
          rejected: "bg-red-100 text-red-800",
          pending: "bg-red-100 text-red-800"
        }
      };
    } else {
      // Admin gets orange/amber theme
      return {
        primary: "from-orange-600 to-amber-600",
        secondary: "from-amber-500 to-orange-600",
        tertiary: "from-orange-500 to-amber-500",
        accent: "orange",
        background: "from-orange-50/30 to-amber-100/30",
        textGradient: "from-orange-600 to-amber-600",
        buttonHover: "hover:from-orange-700 hover:to-amber-700",
        statusColors: {
          accepted: "bg-green-100 text-green-800",
          rejected: "bg-red-100 text-red-800",
          pending: "bg-amber-100 text-amber-800"
        }
      };
    }
  };

  const theme = getTheme();

  const onAccept = async (assignmentId) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.patch(
        `http://localhost:5000/api/assignments/${assignmentId}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus("Accepted");
      if (handleDecision) {
        handleDecision(assignmentId, "Accepted");
      }
    } catch (error) {
      console.error("Error accepting assignment:", error.response?.data?.message || error.message);
    }
  };

  const onReject = async (assignmentId) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.patch(
        `http://localhost:5000/api/assignments/${assignmentId}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus("Rejected");
      if (handleDecision) {
        handleDecision(assignmentId, "Rejected");
      }
    } catch (error) {
      console.error("Error rejecting assignment:", error.response?.data?.message || error.message);
    }
  };

  const onOverturnDecision = async (assignmentId) => {
    try {
      const headToken = localStorage.getItem("headToken");
      const newStatus = status === "Accepted" ? "Rejected" : "Accepted";
      
      const response = await axios.post(
        `http://localhost:5000/api/heads/assignments/${assignmentId}/overturn`,
        { headDecision: newStatus },
        { headers: { Authorization: `Bearer ${headToken}` } }
      );
      setStatus(newStatus);
      if (handleDecision) {
        handleDecision(assignmentId, newStatus);
      }
    } catch (error) {
      console.error("Error overturning assignment:", error.response?.data?.message || error.message);
    }
  };

  const onAppealSubmit = async () => {
    try {
      const token = localStorage.getItem("userToken");
      const assignmentId = assignment._id || assignment.id;
      const appealData = { subject: appealSubject, description: appealDescription };

      const response = await axios.post(
        `http://localhost:5000/api/users/${assignmentId}/appeal`,
        appealData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShowAppealModal(false);
      setAppealSubject("");
      setAppealDescription("");
    } catch (error) {
      console.error("Error submitting appeal:", error.response?.data?.message || error.message);
    }
  };

  const handleFeedbackClick = () => {
    if (onFeedbackClick) {
      onFeedbackClick(assignment, { isAdmin, isHOD });
    }
  };

  const hasAppealDetails = assignment.appealDetails && 
    (assignment.appealDetails.subject || assignment.appealDetails.description);

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

  // Animation variants
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
            ease: "easeInOut"
          }}
        />

        <motion.div variants={contentVariants} initial="hidden" animate="visible" className="relative z-10">
          <motion.h5 
            className={`text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${theme.textGradient}`}
            variants={itemVariants}
          >
            {assignment.title}
          </motion.h5>

          <motion.div className="space-y-2" variants={contentVariants}>
            <motion.p className="text-gray-700" variants={itemVariants}>
              <strong className="text-gray-900">User:</strong> {assignment.user}
            </motion.p>
            <motion.p className="text-gray-700" variants={itemVariants}>
              <strong className="text-gray-900">Assigned Admin:</strong> {assignment.admin}
            </motion.p>
            <motion.p className="text-gray-700" variants={itemVariants}>
              <strong className="text-gray-900">Status:</strong>{" "}
              <motion.span
                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(status)}`}
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", damping: 20, stiffness: 400 }}
              >
                {status}
              </motion.span>
            </motion.p>
            <motion.p className="text-gray-700" variants={itemVariants}>
              <strong className="text-gray-900">Submitted At:</strong>{" "}
              {new Date(assignment.createdAt).toLocaleString()}
            </motion.p>

            {/* Existing feedback display - Show for all users */}
            <AnimatePresence>
              {assignment.feedback && (assignment.feedback.adminFeedback || assignment.feedback.headFeedback) && (
                <motion.div 
                  className="mt-4 space-y-2"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {assignment.feedback.adminFeedback && (
                    <motion.div 
                      className={`p-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl`}
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", damping: 20, stiffness: 400 }}
                    >
                      <h6 className={`font-semibold mb-2 text-transparent bg-clip-text bg-gradient-to-r ${theme.textGradient}`}>
                        Admin Feedback:
                      </h6>
                      <p className="text-gray-700 text-sm leading-relaxed">{assignment.feedback.adminFeedback}</p>
                    </motion.div>
                  )}
                  {assignment.feedback.headFeedback && (
                    <motion.div 
                      className={`p-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl`}
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", damping: 20, stiffness: 400 }}
                    >
                      <h6 className={`font-semibold mb-2 text-transparent bg-clip-text bg-gradient-to-r ${theme.textGradient}`}>
                        Head Feedback:
                      </h6>
                      <p className="text-gray-700 text-sm leading-relaxed">{assignment.feedback.headFeedback}</p>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Appeal indicator - Show for all users */}
            <AnimatePresence>
              {hasAppealDetails && (
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
          </motion.div>

          {/* Download button - Show for all users */}
          <motion.div className="flex space-x-2 mt-4" variants={itemVariants}>
            <motion.a
              href={`${assignment.filePath}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex-grow text-center py-3 bg-gradient-to-r ${theme.secondary} text-white rounded-xl font-medium shadow-lg border border-white/20 backdrop-blur-sm relative overflow-hidden`}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
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
              <span className="relative z-10 flex items-center justify-center space-x-2">
                <motion.span
                  animate={{ y: [0, -2, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  📥
                </motion.span>
                <span>Download Task</span>
              </span>
            </motion.a>
          </motion.div>

          {/* Role-based action buttons */}
          <motion.div 
            className="grid grid-cols-2 gap-3 mt-4"
            variants={contentVariants}
          >
            {/* USER: Appeal to HOD button (only if status is rejected) */}
            <AnimatePresence>
              {isUser && status === "Rejected" && (
                <motion.button
                  className={`col-span-full py-3 bg-gradient-to-r ${theme.primary} text-white rounded-xl font-medium shadow-lg border border-white/20 backdrop-blur-sm relative overflow-hidden`}
                  onClick={() => setShowAppealModal(true)}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
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
                  <span className="relative z-10">📋 Appeal to HOD</span>
                </motion.button>
              )}
            </AnimatePresence>
            
            {/* ADMIN: Accept and Reject buttons */}
            <AnimatePresence>
              {isAdmin && (
                <>
                  <motion.button
                    className="py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium shadow-lg border border-white/20 backdrop-blur-sm relative overflow-hidden"
                    onClick={() => onAccept(assignment._id || assignment.id)}
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
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
                        repeatDelay: 5,
                        ease: "easeInOut"
                      }}
                    />
                    <span className="relative z-10">✅ Accept</span>
                  </motion.button>
                  <motion.button
                    className="py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl font-medium shadow-lg border border-white/20 backdrop-blur-sm relative overflow-hidden"
                    onClick={() => onReject(assignment._id || assignment.id)}
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
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
                        repeatDelay: 6,
                        ease: "easeInOut"
                      }}
                    />
                    <span className="relative z-10">❌ Reject</span>
                  </motion.button>
                </>
              )}
            </AnimatePresence>

            {/* ADMIN: Provide feedback button */}
            <AnimatePresence>
              {isAdmin && (
                <motion.button
                  className={`col-span-full py-3 bg-gradient-to-r ${theme.primary} text-white rounded-xl font-medium shadow-lg border border-white/20 backdrop-blur-sm relative overflow-hidden`}
                  onClick={handleFeedbackClick}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
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
                  <span className="relative z-10">💬 Provide Admin Feedback</span>
                </motion.button>
              )}
            </AnimatePresence>
            
            {/* HOD: Overturn decision button */}
            <AnimatePresence>
              {isHOD && (status === "Accepted" || status === "Rejected") && (
                <motion.button
                  className="col-span-full py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-medium shadow-lg border border-white/20 backdrop-blur-sm relative overflow-hidden"
                  onClick={() => onOverturnDecision(assignment._id || assignment.id)}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
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
                  <span className="relative z-10">
                    🔄 Overturn Decision ({status === "Accepted" ? "Reject" : "Accept"})
                  </span>
                </motion.button>
              )}
            </AnimatePresence>

            {/* HOD: Provide feedback button */}
            <AnimatePresence>
              {isHOD && (
                <motion.button
                  className={`col-span-full py-3 bg-gradient-to-r ${theme.primary} text-white rounded-xl font-medium shadow-lg border border-white/20 backdrop-blur-sm relative overflow-hidden`}
                  onClick={handleFeedbackClick}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
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
                  <span className="relative z-10">👑 Provide Head Feedback</span>
                </motion.button>
              )}
            </AnimatePresence>
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
                {assignment.appealDetails.subject && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                    <div className="p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30">
                      {assignment.appealDetails.subject}
                    </div>
                  </motion.div>
                )}
                {assignment.appealDetails.description && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <div className="p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30 max-h-32 overflow-y-auto">
                      {assignment.appealDetails.description}
                    </div>
                  </motion.div>
                )}
              </div>
              <motion.div 
                className="flex justify-end mt-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <motion.button
                  onClick={() => setShowAppealDetailsModal(false)}
                  className="py-2 px-6 bg-gray-200/50 backdrop-blur-sm text-gray-700 rounded-xl font-medium border border-white/30"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Close
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Appeal Submission Modal - Only for Users */}
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
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    value={appealSubject}
                    onChange={(e) => setAppealSubject(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white/70 backdrop-blur-sm"
                    placeholder="Enter subject"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={appealDescription}
                    onChange={(e) => setAppealDescription(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white/70 backdrop-blur-sm resize-none"
                    placeholder="Enter description"
                    rows={4}
                  />
                </motion.div>
              </div>
              <motion.div 
                className="flex justify-end mt-6 space-x-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <motion.button
                  onClick={() => {
                    setShowAppealModal(false);
                    setAppealSubject("");
                    setAppealDescription("");
                  }}
                  className="py-2 px-6 bg-gray-200/50 backdrop-blur-sm text-gray-700 rounded-xl font-medium border border-white/30"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={onAppealSubmit}
                  className={`py-2 px-6 bg-gradient-to-r ${theme.primary} text-white rounded-xl font-medium shadow-lg border border-white/20 backdrop-blur-sm relative overflow-hidden`}
                  whileHover={{ scale: 1.05 }}
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
                      repeatDelay: 3,
                      ease: "easeInOut"
                    }}
                  />
                  <span className="relative z-10">Submit</span>
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

AssignmentCard.propTypes = {
  assignment: PropTypes.shape({
    id: PropTypes.string,
    _id: PropTypes.string,
    title: PropTypes.string.isRequired,
    admin: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    overturnedBy: PropTypes.string,
    feedback: PropTypes.shape({
      adminFeedback: PropTypes.string,
      headFeedback: PropTypes.string,
    }),
    appealDetails: PropTypes.shape({
      subject: PropTypes.string,
      description: PropTypes.string,
    }),
  }),
  onFeedbackClick: PropTypes.func.isRequired, 
  handleDecision: PropTypes.func,
  index: PropTypes.number,
};

export default AssignmentCard;