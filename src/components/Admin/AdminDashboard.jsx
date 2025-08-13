import React, { useState, useEffect } from 'react';
import AssignmentList from './AssignmentList';
import ContentList from './ContentList';
import DashboardLayout from '../dashboard/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Search Bar Component with Category Filtering for Admin Dashboard
const SearchBar = ({ searchQuery, setSearchQuery, placeholder = "Search...", activeTab, selectedCategory, setSelectedCategory }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showCategories, setShowCategories] = useState(false);

    // Category options based on content type for Admin Dashboard
    const getCategoryOptions = () => {
        const baseCategories = [
            { id: 'all', label: 'All Fields', icon: '🔍' },
            { id: 'title', label: 'Title/Name', icon: '📝' },
            { id: 'description', label: 'Description', icon: '📋' }
        ];

        const contentSpecificCategories = {
            'student-assignments': [
                { id: 'student', label: 'Student Name', icon: '👥' },
                { id: 'deadline', label: 'Deadline Date', icon: '📅' },
                { id: 'submitted', label: 'Submitted Date', icon: '📤' },
                { id: 'label', label: 'Label/Category', icon: '🏷️' },
                { id: 'status', label: 'Status', icon: '✅' }
            ],
            'student-recents': [
                { id: 'student', label: 'Student Name', icon: '👥' },
                { id: 'deadline', label: 'Deadline Date', icon: '📅' },
                { id: 'submitted', label: 'Submitted Date', icon: '📤' },
                { id: 'status', label: 'Status', icon: '✅' }
            ],
            'my-assignments': [
                { id: 'admin', label: 'Created By', icon: '👥' },
                { id: 'deadline', label: 'Deadline Date', icon: '📅' },
                { id: 'label', label: 'Label/Category', icon: '🏷️' },
                { id: 'priority', label: 'Priority', icon: '⭐' }
            ],
            'my-notes': [
                { id: 'author', label: 'Author', icon: '✍️' },
                { id: 'subject', label: 'Subject', icon: '📚' },
                { id: 'date', label: 'Created Date', icon: '📅' }
            ],
            'my-lectures': [
                { id: 'instructor', label: 'Instructor', icon: '👨‍🏫' },
                { id: 'subject', label: 'Subject', icon: '🎥' },
                { id: 'date', label: 'Lecture Date', icon: '📅' }
            ],
            'my-tests': [
                { id: 'instructor', label: 'Instructor', icon: '👨‍🎓' },
                { id: 'subject', label: 'Subject', icon: '📝' },
                { id: 'date', label: 'Test Date', icon: '📅' },
                { id: 'submitted', label: 'Submitted Date', icon: '📤' }
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
            case 'student':
                return 'Search by student name...';
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
                return 'Search by status (e.g., pending, accepted, rejected)...';
            case 'priority':
                return 'Search by priority (e.g., urgent, normal, high)...';
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
                                ? 'bg-orange-500 text-white shadow-lg' 
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
                                                ? 'bg-orange-500 text-white'
                                                : 'hover:bg-orange-50 text-gray-700'
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
                    className="w-full pl-12 pr-12 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-300 text-lg font-medium shadow-lg"
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
                                className="px-2 py-1 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
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
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const navigate = useNavigate();

    const tabs = [
        { id: 'student-assignments', label: 'Student Assignments' },
        { id: 'student-recents', label: 'Previous Submissions' },
        { id: 'my-assignments', label: 'My Assignments' },
        { id: 'my-notes', label: 'My Notes' },
        { id: 'my-lectures', label: 'My Lectures' },
        { id: 'my-tests', label: 'My Tests' }
    ];

    // Enhanced search function with category-based filtering for Admin Dashboard
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
            // Get all searchable fields for Admin Dashboard
            const title = (item.title || item.name || item.subject || '').toLowerCase();
            const description = (item.description || item.content || '').toLowerCase();
            const admin = (item.admin || item.assignedBy || item.author || item.instructor || '').toLowerCase();
            const student = (item.student || item.submittedBy || '').toLowerCase();
            const label = (item.label || item.category || item.tag || item.subject || '').toLowerCase();
            const status = (item.status || item.adminDecision || (item.deadline && new Date(item.deadline) < new Date() ? 'expired' : 'active') || '').toLowerCase();
            const priority = (item.priority || 'normal').toLowerCase();
            
            // Category-specific filtering
            switch (selectedCategory) {
                case 'title':
                    return title.includes(searchTerm);
                case 'description':
                    return description.includes(searchTerm);
                case 'student':
                    return student.includes(searchTerm);
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
                case 'priority':
                    return priority.includes(searchTerm);
                case 'all':
                default:
                    // Search all fields for 'all' category
                    const deadline = item.deadline ? (matchesDate(item.deadline, searchTerm) || new Date(item.deadline).toLocaleDateString().toLowerCase().includes(searchTerm)) : false;
                    const date = item.date ? (matchesDate(item.date, searchTerm) || new Date(item.date).toLocaleDateString().toLowerCase().includes(searchTerm)) : false;
                    const createdAt = item.createdAt ? (matchesDate(item.createdAt, searchTerm) || new Date(item.createdAt).toLocaleDateString().toLowerCase().includes(searchTerm)) : false;
                    
                    // Check multiple submitted date fields for 'all' search
                    const allSubmittedFields = [
                        item.submittedAt,
                        item.submissionDate, 
                        item.submitted,
                        item.createdAt,
                        item.updatedAt
                    ].filter(Boolean);
                    
                    const submitted = allSubmittedFields.some(dateField => 
                        matchesDate(dateField, searchTerm) || 
                        new Date(dateField).toLocaleDateString().toLowerCase().includes(searchTerm)
                    );
                    
                    return title.includes(searchTerm) || 
                           description.includes(searchTerm) || 
                           admin.includes(searchTerm) || 
                           student.includes(searchTerm) ||
                           label.includes(searchTerm) ||
                           status.includes(searchTerm) ||
                           priority.includes(searchTerm) ||
                           deadline ||
                           date ||
                           createdAt ||
                           submitted;
            }
        });
    };

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
        let content = [];
        switch (activeTab) {
            case 'student-assignments':
                content = assignments;
                break;
            case 'student-recents':
                content = recentAssignments;
                break;
            case 'my-assignments':
                content = adminContent.assignments;
                break;
            case 'my-notes':
                content = adminContent.notes;
                break;
            case 'my-lectures':
                content = adminContent.lectures;
                break;
            case 'my-tests':
                content = adminContent.tests;
                break;
            default:
                content = [];
        }
        
        // Apply search filter with category
        return filterContent(content, searchQuery, selectedCategory);
    };

    const getContentType = () => {
        if (activeTab.startsWith('student-')) {
            return 'student-assignment';
        }
        return activeTab.replace('my-', '').slice(0, -1); // Remove 's' from end
    };

    const currentContent = getCurrentContent();
    const contentType = getContentType();

    // Get search placeholder based on active tab
    const getSearchPlaceholder = () => {
        switch (activeTab) {
            case 'student-assignments':
                return 'Search student assignments by title, student name, deadline, submission date, or status...';
            case 'student-recents':
                return 'Search previous submissions by title, student, deadline, submission date, or status...';
            case 'my-assignments':
                return 'Search my assignments by title, label, deadline, or priority...';
            case 'my-notes':
                return 'Search my notes by title, subject, content, or date...';
            case 'my-lectures':
                return 'Search my lectures by title, subject, instructor, or date...';
            case 'my-tests':
                return 'Search my tests by title, subject, instructor, date, or submission date...';
            default:
                return 'Search...';
        }
    };

    // Show search bar for all content tabs
    const showSearchBar = true;

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
            onTabChange={(tab) => {
                setActiveTab(tab);
                setSearchQuery(''); // Clear search when switching tabs
                setSelectedCategory('all'); // Reset category when switching tabs
            }}
            tabs={tabs}
        >
            {/* Search Bar - Show for all tabs */}
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
                    {activeTab.startsWith('student-') ? (
                        <AssignmentList 
                            assignments={currentContent} 
                            searchQuery={searchQuery}
                            selectedCategory={selectedCategory}
                        />
                    ) : (
                        <ContentList 
                            content={currentContent}
                            contentType={contentType}
                            searchQuery={searchQuery}
                            selectedCategory={selectedCategory}
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