import React, { useState } from 'react';
import AssignmentCard from './AssignmentCard';
import FeedbackForm from './FeedbackForm';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const AssignmentList = ({ assignments, handleDecision, handleFeedbackSubmit }) => {
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [userRoleInfo, setUserRoleInfo] = useState(null);

    const openFeedbackForm = (assignment, roleInfo) => {
        console.log('🔍 ASSIGNMENT LIST - Opening feedback for:', assignment);
        setSelectedAssignment(assignment);
        setUserRoleInfo(roleInfo);
    };

    const closeFeedbackForm = () => {
        setSelectedAssignment(null);
        setUserRoleInfo(null);
    };

    const handleFeedbackSubmitWrapper = async (feedbackData) => {
        try {
            let apiEndpoint;
            let token;
            
            const headToken = localStorage.getItem('headToken');
            const adminToken = localStorage.getItem('adminToken');
            
            if (userRoleInfo?.isHOD && headToken) {
                apiEndpoint = `http://localhost:5000/api/heads/feedback/${feedbackData.assignmentId}`;
                token = headToken;
            } else if (userRoleInfo?.isAdmin && adminToken) {
                apiEndpoint = `http://localhost:5000/api/admin/feedback/${feedbackData.assignmentId}`;
                token = adminToken;
            } else {
                throw new Error('Authentication token not found or role mismatch. Please login again.');
            }

            if (!token) {
                throw new Error('No valid authentication token found.');
            }

            try {
                const decoded = JSON.parse(atob(token.split('.')[1]));
                if (decoded.exp * 1000 <= Date.now()) {
                    throw new Error('Token has expired. Please login again.');
                }
            } catch (tokenError) {
                throw new Error('Invalid token. Please login again.');
            }

            const response = await axios.put(
                apiEndpoint,
                { feedback: feedbackData.feedback },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (handleFeedbackSubmit) {
                handleFeedbackSubmit({
                    ...feedbackData,
                    success: true,
                    result: response.data
                });
            }
            
            setTimeout(() => {
                closeFeedbackForm();
            }, 1500);
            
        } catch (error) {
            let errorMessage = error.message || 'Unknown error occurred';
            
            if (error.response?.status === 401) {
                errorMessage = 'Authentication failed. Please login again.';
                localStorage.removeItem('headToken');
                localStorage.removeItem('adminToken');
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            
            if (handleFeedbackSubmit) {
                handleFeedbackSubmit({
                    ...feedbackData,
                    success: false,
                    error: errorMessage
                });
            }
            
            alert('Error submitting feedback: ' + errorMessage);
        }
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.1,
                staggerChildren: 0.08
            }
        }
    };

    const gridVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: {
                type: "spring",
                damping: 20,
                stiffness: 300,
                staggerChildren: 0.05
            }
        }
    };

    const emptyStateVariants = {
        hidden: { 
            opacity: 0, 
            scale: 0.8,
            y: 50 
        },
        visible: { 
            opacity: 1, 
            scale: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 20,
                stiffness: 300,
                delay: 0.2
            }
        }
    };

    return (
        <motion.div 
            className="w-full"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div className="w-full" variants={gridVariants}>
                <AnimatePresence mode="wait">
                    {assignments.length > 0 ? (
                        <motion.div 
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
                            variants={gridVariants}
                            key="assignments-grid"
                        >
                            {assignments.map((assignment, index) => (
                                <motion.div 
                                    key={assignment._id || assignment.id} 
                                    className="w-full"
                                    variants={{
                                        hidden: { 
                                            opacity: 0, 
                                            y: 50,
                                            scale: 0.9 
                                        },
                                        visible: { 
                                            opacity: 1, 
                                            y: 0,
                                            scale: 1,
                                            transition: {
                                                type: "spring",
                                                damping: 20,
                                                stiffness: 300,
                                                delay: index * 0.05
                                            }
                                        }
                                    }}
                                >
                                    <AssignmentCard
                                        assignment={assignment}
                                        handleDecision={handleDecision}
                                        onFeedbackClick={(assignment, roleInfo) => openFeedbackForm(assignment, roleInfo)}
                                        index={index}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div 
                            className="col-span-full text-center text-gray-600 w-full py-16"
                            variants={emptyStateVariants}
                            key="empty-state"
                        >
                            <motion.div
                                className="flex flex-col items-center space-y-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <motion.div
                                    className="w-24 h-24 bg-gradient-to-r from-purple-200 to-blue-200 rounded-full flex items-center justify-center"
                                    animate={{ 
                                        rotate: 360,
                                        scale: [1, 1.1, 1]
                                    }}
                                    transition={{ 
                                        rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                                        scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                                    }}
                                >
                                    <svg 
                                        className="w-12 h-12 text-purple-400" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth="2" 
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                                        />
                                    </svg>
                                </motion.div>
                                <motion.h3 
                                    className="text-xl font-semibold text-gray-500"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    No assignments found
                                </motion.h3>
                                <motion.p 
                                    className="text-gray-400 max-w-md text-center"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.7 }}
                                >
                                    There are currently no assignments to display. Check back later or refresh the page.
                                </motion.p>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Feedback Form Modal */}
                <AnimatePresence>
                    {selectedAssignment && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <FeedbackForm
                                assignmentId={String(selectedAssignment._id || selectedAssignment.id)}
                                assignment={selectedAssignment}
                                userRole={userRoleInfo}
                                onClose={closeFeedbackForm}
                                onSubmit={handleFeedbackSubmitWrapper}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
};

export default AssignmentList;