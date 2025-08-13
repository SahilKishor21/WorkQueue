import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

const NotesCard = ({ notes, index = 0 }) => {
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
                primary: "from-blue-600 to-purple-600",
                secondary: "from-purple-500 to-blue-600", 
                textGradient: "from-blue-600 to-purple-600",
                background: "from-blue-50/30 to-purple-100/30"
            };
        } else if (isHOD) {
            return {
                primary: "from-purple-600 to-violet-600",
                secondary: "from-violet-500 to-purple-600",
                textGradient: "from-purple-600 to-violet-600",
                background: "from-purple-50/30 to-violet-100/30"
            };
        } else {
            return {
                primary: "from-blue-600 to-purple-600",
                secondary: "from-purple-500 to-blue-600",
                textGradient: "from-blue-600 to-purple-600",
                background: "from-blue-50/30 to-purple-100/30"
            };
        }
    };

    const theme = getTheme();

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

    return (
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
                {/* Header with Icon and Title */}
                <motion.div className="flex items-start space-x-3 mb-4" variants={itemVariants}>
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
                        📚
                    </motion.div>
                    <div className="flex-1 min-w-0">
                        <motion.h5 
                            className={`text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${theme.textGradient} leading-tight`}
                            variants={itemVariants}
                        >
                            {notes.title}
                        </motion.h5>
                        <motion.p 
                            className="text-sm text-gray-600 font-medium"
                            variants={itemVariants}
                        >
                            Notes by {notes.admin}
                        </motion.p>
                    </div>
                </motion.div>

                {/* Description */}
                <motion.div className="mb-4" variants={itemVariants}>
                    <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                        {notes.description}
                    </p>
                </motion.div>

                {/* Metadata */}
                <motion.div className="space-y-2 mb-4" variants={contentVariants}>
                    <motion.div className="flex justify-between items-center" variants={itemVariants}>
                        <span className="text-md text-gray-600 font-medium pr-2">Category:</span>
                        <motion.span
                            className={`pl-4 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${theme.primary} text-white`}
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: "spring", damping: 20, stiffness: 400 }}
                        >
                            {notes.label}
                        </motion.span>
                    </motion.div>
                    
                    <motion.div className="flex justify-between items-center" variants={itemVariants}>
                        <span className="text-xs text-gray-600 font-medium">Uploaded:</span>
                        <span className="text-xs text-gray-700">
                            {new Date(notes.createdAt).toLocaleString()}
                        </span>
                    </motion.div>

                    <motion.div className="flex justify-between items-center" variants={itemVariants}>
                        <span className="text-xs text-gray-600 font-medium">Type:</span>
                        <span className="text-xs text-gray-700 font-semibold">
                            Study Material
                        </span>
                    </motion.div>
                </motion.div>

                {/* Download Button */}
                <motion.div className="flex space-x-2 mt-4" variants={itemVariants}>
                    <motion.a
                        href={notes.fileUrl || notes.filePath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex-grow text-center py-3 bg-gradient-to-r ${theme.secondary} text-white rounded-xl font-medium shadow-lg border border-white/20 backdrop-blur-sm relative overflow-hidden`}
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
                            <span>Download Notes</span>
                        </span>
                    </motion.a>
                </motion.div>

                {/* Additional Info */}
                <motion.div 
                    className="pt-3 border-t border-white/20"
                    variants={itemVariants}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                            Format: <span className="font-medium text-gray-700">Study Material</span>
                        </span>
                        <motion.div
                            className={`w-2 h-2 rounded-full bg-gradient-to-r ${theme.primary}`}
                            animate={{ 
                                scale: [1, 1.3, 1],
                                opacity: [0.5, 1, 0.5]
                            }}
                            transition={{ 
                                duration: 2, 
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    </div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

NotesCard.propTypes = {
    notes: PropTypes.shape({
        _id: PropTypes.string,
        id: PropTypes.string,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        admin: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
        fileUrl: PropTypes.string,
        filePath: PropTypes.string,
    }).isRequired,
    index: PropTypes.number,
};

export default NotesCard;