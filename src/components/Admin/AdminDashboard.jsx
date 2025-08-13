import React, { useState, useEffect } from 'react';
import AssignmentList from './AssignmentList';
import ContentList from './ContentList';
import DashboardLayout from '../dashboard/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
    const [assignments, setAssignments] = useState([]); 
    const [recentAssignments, setRecentAssignments] = useState([]); 
    const [adminContent, setAdminContent] = useState({
        assignments: [],
        notes: [],
        lectures: [],
        tests: []
    });
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 
    const [activeTab, setActiveTab] = useState('student-assignments'); 
    const [adminName, setAdminName] = useState(''); 
    const navigate = useNavigate();

    const tabs = [
        { id: 'student-assignments', label: 'Student Assignments' },
        { id: 'student-recents', label: 'Previous Submissions' },
        { id: 'my-assignments', label: 'My Assignments' },
        { id: 'my-notes', label: 'My Notes' },
        { id: 'my-lectures', label: 'My Lectures' },
        { id: 'my-tests', label: 'My Tests' }
    ];

    const fetchStudentAssignments = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`http://localhost:5000/api/admins/assignments`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch assignments');
            }
            
            const data = await response.json();
            const allAssignments = data;
            const pendingAssignments = allAssignments.filter(assignment => assignment.status === 'Pending');
            const acceptedOrRejected = allAssignments.filter(
                assignment => assignment.status === 'Accepted' || assignment.status === 'Rejected'
            );

            setAssignments(pendingAssignments);
            setRecentAssignments(acceptedOrRejected);
        } catch (err) {
            console.error('Error fetching student assignments:', err);
            setError(err.message || 'Failed to fetch student assignments.');
        }
    };

    const fetchAdminContent = async (type) => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`http://localhost:5000/api/admins/content/${type}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (!response.ok) {
                throw new Error(`Failed to fetch ${type}`);
            }
            
            const data = await response.json();
            setAdminContent(prev => ({
                ...prev,
                [type]: data
            }));
        } catch (err) {
            console.error(`Error fetching ${type}:`, err);
        }
    };

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            setAdminName(decodedToken.name);
        
            // Fetch student assignments
            await fetchStudentAssignments();
            
            // Fetch all admin content types
            await Promise.all([
                fetchAdminContent('assignments'),
                fetchAdminContent('notes'),
                fetchAdminContent('lectures'),
                fetchAdminContent('tests')
            ]);
            
            setError(null);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError(err.message || 'Failed to fetch data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const handleUploadClick = () => {
        navigate('/admin/upload');
    };

    const getCurrentContent = () => {
        switch (activeTab) {
            case 'student-assignments':
                return assignments;
            case 'student-recents':
                return recentAssignments;
            case 'my-assignments':
                return adminContent.assignments;
            case 'my-notes':
                return adminContent.notes;
            case 'my-lectures':
                return adminContent.lectures;
            case 'my-tests':
                return adminContent.tests;
            default:
                return [];
        }
    };

    const getContentType = () => {
        if (activeTab.startsWith('student-')) {
            return 'student-assignment';
        }
        return activeTab.replace('my-', '').slice(0, -1); // Remove 's' from end
    };

    const currentContent = getCurrentContent();
    const contentType = getContentType();

    // Loading state
    if (loading) {
        return (
            <DashboardLayout 
                title="Admin Dashboard" 
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
                        className="w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-xl"
                    >
                        👨‍💼
                    </motion.div>
                    <motion.p 
                        className="text-2xl font-bold text-gray-700"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                        Loading admin dashboard...
                    </motion.p>
                    <motion.div 
                        className="w-64 h-2 bg-white/30 rounded-full overflow-hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <motion.div
                            className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
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
            title="Admin Dashboard" 
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
                    {activeTab.startsWith('student-') ? (
                        <AssignmentList 
                            assignments={currentContent} 
                        />
                    ) : (
                        <ContentList 
                            content={currentContent}
                            contentType={contentType}
                        />
                    )}
                </motion.div>
            </AnimatePresence>
            
            {/* Upload Button */}
            <motion.div 
                className="flex justify-center mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
            >
                <motion.button
                    className="py-4 px-8 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold rounded-2xl shadow-2xl border border-white/20 backdrop-blur-sm relative overflow-hidden"
                    onClick={handleUploadClick}
                    whileHover={{ 
                        scale: 1.05,
                        y: -3,
                        boxShadow: "0 15px 35px rgba(0,0,0,0.15)",
                        transition: { 
                            type: "spring", 
                            damping: 15, 
                            stiffness: 400 
                        }
                    }}
                    whileTap={{ 
                        scale: 0.95,
                        y: 0,
                        transition: { duration: 0.1 }
                    }}
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
                    
                    <span className="relative z-10 flex items-center space-x-2">
                        <span>📋</span>
                        <span>Create Content</span>
                    </span>
                </motion.button>
            </motion.div>

            {/* Quick Stats Section */}
            <motion.div 
                className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
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
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                        📊
                    </motion.div>
                    <h3 className="text-lg font-semibold text-gray-800">Pending</h3>
                    <p className="text-2xl font-bold text-orange-600">{assignments.length}</p>
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
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                        📚
                    </motion.div>
                    <h3 className="text-lg font-semibold text-gray-800">Notes</h3>
                    <p className="text-2xl font-bold text-orange-600">{adminContent.notes.length}</p>
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
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                        🎥
                    </motion.div>
                    <h3 className="text-lg font-semibold text-gray-800">Lectures</h3>
                    <p className="text-2xl font-bold text-orange-600">{adminContent.lectures.length}</p>
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
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                        📝
                    </motion.div>
                    <h3 className="text-lg font-semibold text-gray-800">Tests</h3>
                    <p className="text-2xl font-bold text-orange-600">{adminContent.tests.length}</p>
                </motion.div>
            </motion.div>
        </DashboardLayout>
    );
};

export default AdminDashboard;