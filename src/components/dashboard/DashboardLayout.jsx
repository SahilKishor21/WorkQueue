import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileDropdown from './ProfileDropdown'; 

const AdvancedBackground = ({ theme }) => {
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
            <div className={`absolute inset-0 bg-gradient-to-br ${theme.background} mix-blend-overlay`}></div>
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
                    background: theme.backgroundGradient
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

const DashboardLayout = ({ title, children, error, activeTab, onTabChange, tabs = [] }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [notifications, setNotifications] = useState([
        { id: 1, title: "New Assignment Available", message: "Math homework due tomorrow", time: "2 min ago", type: "info", unread: true },
        { id: 2, title: "Test Reminder", message: "Physics test scheduled for Friday", time: "1 hour ago", type: "warning", unread: true },
        { id: 3, title: "Grade Updated", message: "Your English essay has been graded", time: "3 hours ago", type: "success", unread: false }
    ]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [userName, setUserName] = useState('Sahil');
    const [userAvatar, setUserAvatar] = useState('SK');

    // Role detection logic
    const [userRole, setUserRole] = useState('user');

    // Refs for click outside detection
    const profileRef = useRef(null);
    const notificationRef = useRef(null);
    
    useEffect(() => {
        let isAdmin = false;
        let isUser = false;
        let isHOD = false;
        
        try {
            const adminToken = localStorage.getItem("adminToken");
            const userToken = localStorage.getItem("userToken");
            const headToken = localStorage.getItem("headToken");
            
            const tokenCount = [headToken, adminToken, userToken].filter(Boolean).length;
            let decodedToken = null;
            
            if (tokenCount > 1) {
                const currentRole = localStorage.getItem("userRole");
                
                if (currentRole === "user" && userToken) {
                    decodedToken = JSON.parse(atob(userToken.split(".")[1]));
                    isUser = true;
                } else if (currentRole === "admin" && adminToken) {
                    decodedToken = JSON.parse(atob(adminToken.split(".")[1]));
                    isAdmin = true;
                } else if ((currentRole === "HOD" || currentRole === "Head") && headToken) {
                    decodedToken = JSON.parse(atob(headToken.split(".")[1]));
                    isHOD = true;
                } else {
                    if (headToken) {
                        decodedToken = JSON.parse(atob(headToken.split(".")[1]));
                        isHOD = decodedToken.role === "HOD" || decodedToken.role === "Head";
                    } else if (adminToken) {
                        decodedToken = JSON.parse(atob(adminToken.split(".")[1]));
                        isAdmin = decodedToken.role === "admin";
                    } else if (userToken) {
                        decodedToken = JSON.parse(atob(userToken.split(".")[1]));
                        isUser = decodedToken.role === "user";
                    }
                }
            } else {
                if (headToken) {
                    decodedToken = JSON.parse(atob(headToken.split(".")[1]));
                    isHOD = decodedToken.role === "HOD" || decodedToken.role === "Head";
                } else if (adminToken) {
                    decodedToken = JSON.parse(atob(adminToken.split(".")[1]));
                    const role = localStorage.getItem("userRole");
                    isAdmin = role === "admin" || decodedToken.role === "admin";
                } else if (userToken) {
                    decodedToken = JSON.parse(atob(userToken.split(".")[1]));
                    const role = localStorage.getItem("userRole");
                    isUser = role === "user" || decodedToken.role === "user";
                }
            }
            
            if (isUser) {
                setUserRole('user');
            } else if (isHOD) {
                setUserRole('hod');
            } else {
                setUserRole('admin');
            }
            
            if (decodedToken && decodedToken.name) {
                setUserName(decodedToken.name);
                setUserAvatar(decodedToken.name.split(' ').map(n => n[0]).join('').toUpperCase());
            }
            
        } catch (error) {
            console.error("Error decoding token:", error);
        }
    }, []);

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfile(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Theme configuration based on user role
    const getTheme = () => {
        if (userRole === 'user') {
            return {
                primary: "from-emerald-600 to-teal-600",
                secondary: "from-emerald-500 to-teal-500", 
                tertiary: "from-teal-500 to-emerald-500",
                accent: "emerald",
                background: "from-emerald-50/30 to-teal-100/30",
                textGradient: "from-emerald-600 to-teal-600",
                backgroundGradient: [
                    'linear-gradient(45deg, rgba(16,185,129,0.1), rgba(20,184,166,0.1))',
                    'linear-gradient(135deg, rgba(20,184,166,0.1), rgba(16,185,129,0.1))'
                ]
            };
        } else if (userRole === 'hod') {
            return {
                primary: "from-red-800 to-red-900",
                secondary: "from-red-700 to-red-800",
                tertiary: "from-red-600 to-red-700",
                accent: "red",
                background: "from-red-50/30 to-red-100/30",
                textGradient: "from-red-800 to-red-900",
                backgroundGradient: [
                    'linear-gradient(45deg, rgba(127,29,29,0.1), rgba(185,28,28,0.1))',
                    'linear-gradient(135deg, rgba(185,28,28,0.1), rgba(127,29,29,0.1))'
                ]
            };
        } else {
            return {
                primary: "from-orange-600 to-amber-600",
                secondary: "from-amber-500 to-orange-600",
                tertiary: "from-orange-500 to-amber-500",
                accent: "orange",
                background: "from-orange-50/30 to-amber-100/30",
                textGradient: "from-orange-600 to-amber-600",
                backgroundGradient: [
                    'linear-gradient(45deg, rgba(251,146,60,0.1), rgba(245,158,11,0.1))',
                    'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(251,146,60,0.1))'
                ]
            };
        }
    };

    const theme = getTheme();

    // Update time every minute
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const unreadCount = notifications.filter(n => n.unread).length;

    // Updated animation variants for better performance
    const sidebarVariants = {
        open: { 
            width: "280px",
            transition: { 
                type: "tween", 
                duration: 0.2,
                ease: "easeOut"
            }
        },
        closed: { 
            width: "80px",
            transition: { 
                type: "tween", 
                duration: 0.2,
                ease: "easeOut"
            }
        }
    };

    const contentVariants = {
        expanded: { 
            marginLeft: "80px",
            transition: { 
                type: "tween", 
                duration: 0.2,
                ease: "easeOut"
            }
        },
        normal: { 
            marginLeft: "280px",
            transition: { 
                type: "tween", 
                duration: 0.2,
                ease: "easeOut"
            }
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.1,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: {
                type: "spring",
                damping: 20,
                stiffness: 300
            }
        }
    };

    const markAsRead = (id) => {
        setNotifications(notifications.map(n => 
            n.id === id ? { ...n, unread: false } : n
        ));
    };

    const getGreeting = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        return "Good Evening";
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'success': return '✅';
            case 'warning': return '⚠️';
            case 'error': return '❌';
            default: return '📢';
        }
    };

    const quickActions = [
        { id: 'upload', icon: '📤', label: 'Upload' },
        { id: 'assignments', icon: '📋', label: 'Assignments' },
        { id: 'notes', icon: '📚', label: 'Notes' },
        { id: 'tests', icon: '📝', label: 'Tests' }
    ];

    const handleProfileClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Profile clicked, current state:', showProfile); // Debug log
        setShowProfile(!showProfile);
        setShowNotifications(false); // Close notifications if open
    };

    const handleNotificationClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowNotifications(!showNotifications);
        setShowProfile(false); // Close profile if open
    };

    return (
        <div className={`relative min-h-screen bg-gradient-to-br ${theme.background}`}>
            <AdvancedBackground theme={theme} />
            
            {/* Hide scrollbar styles */}
            <style jsx>{`
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10"
            >
                {/* Sidebar - Updated for better performance and design */}
                <motion.div
                    className="fixed left-0 top-0 h-full bg-white/10 backdrop-blur-md shadow-2xl border-r border-white/20 z-30 overflow-hidden"
                    variants={sidebarVariants}
                    animate={sidebarOpen ? "open" : "closed"}
                >
                    <div className="p-6 h-full flex flex-col overflow-hidden">
                        <div className="flex-1 overflow-y-auto scrollbar-hide">
                            {/* Logo/Brand */}
                            <motion.div 
                                className={`flex items-center mb-8 relative group ${sidebarOpen ? 'gap-3' : 'justify-center'}`}
                                variants={itemVariants}
                            >
                                <motion.div
                                    className={`w-10 h-10 bg-gradient-to-br ${theme.primary} rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0`}
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    🎓
                                </motion.div>
                                <AnimatePresence>
                                    {sidebarOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{ opacity: 1, width: "auto" }}
                                            exit={{ opacity: 0, width: 0 }}
                                            transition={{ duration: 0.15 }}
                                            className={`text-xl font-bold bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent whitespace-nowrap`}
                                        >
                                            WorkQueue
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                
                                {/* Tooltip for collapsed state */}
                                {!sidebarOpen && (
                                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                        WorkQueue
                                    </div>
                                )}
                            </motion.div>

                            {/* Navigation */}
                            <div className="space-y-2">
                                <AnimatePresence>
                                    {sidebarOpen && (
                                        <motion.h3
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{ opacity: 1, width: "auto" }}
                                            exit={{ opacity: 0, width: 0 }}
                                            transition={{ duration: 0.15 }}
                                            className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4 px-3"
                                        >
                                            Navigation
                                        </motion.h3>
                                    )}
                                </AnimatePresence>

                                {/* Add spacing when collapsed */}
                                {!sidebarOpen && <div className="mb-4"></div>}

                                {tabs.map((tab, index) => (
                                    <motion.button
                                        key={tab.id}
                                        className={`w-full flex items-center rounded-xl transition-all relative group ${
                                            sidebarOpen ? 'gap-3 p-3' : 'justify-center p-3'
                                        } ${
                                            activeTab === tab.id 
                                                ? `bg-gradient-to-r ${theme.primary} text-white shadow-lg` 
                                                : 'text-gray-700 hover:bg-white/20'
                                        }`}
                                        onClick={() => onTabChange && onTabChange(tab.id)}
                                        variants={itemVariants}
                                        whileHover={{ scale: 1.02, x: sidebarOpen ? 5 : 0 }}
                                        whileTap={{ scale: 0.98 }}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05, duration: 0.2 }}
                                    >
                                        <motion.div
                                            className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                                activeTab === tab.id ? 'bg-white/20' : 'bg-white/30'
                                            }`}
                                            whileHover={{ rotate: 5 }}
                                        >
                                            {quickActions.find(a => a.id === tab.id)?.icon || '📄'}
                                        </motion.div>
                                        <AnimatePresence>
                                            {sidebarOpen && (
                                                <motion.span
                                                    initial={{ opacity: 0, width: 0 }}
                                                    animate={{ opacity: 1, width: "auto" }}
                                                    exit={{ opacity: 0, width: 0 }}
                                                    transition={{ duration: 0.15 }}
                                                    className="font-medium truncate"
                                                >
                                                    {tab.label}
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                        
                                        {/* Tooltip for collapsed state */}
                                        {!sidebarOpen && (
                                            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                                {tab.label}
                                            </div>
                                        )}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* User Profile Section */}
                        <motion.div
                            className="border-t border-white/20 pt-4 mt-4"
                            variants={itemVariants}
                        >
                            <motion.button
                                className={`w-full flex items-center rounded-xl hover:bg-white/20 transition-all group ${
                                    sidebarOpen ? 'gap-3 p-3' : 'justify-center p-3'
                                }`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleProfileClick}
                            >
                                <motion.div
                                    className={`w-10 h-10 bg-gradient-to-br ${theme.secondary} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg flex-shrink-0`}
                                    whileHover={{ scale: 1.1 }}
                                >
                                    {userAvatar}
                                </motion.div>
                                <AnimatePresence>
                                    {sidebarOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{ opacity: 1, width: "auto" }}
                                            exit={{ opacity: 0, width: 0 }}
                                            transition={{ duration: 0.15 }}
                                            className="flex-1 text-left min-w-0"
                                        >
                                            <div className="font-medium text-gray-800 truncate">{userName}</div>
                                            <div className="text-sm text-gray-600 truncate">
                                                {userRole === 'user' ? 'Student' : userRole === 'hod' ? 'HOD' : 'Admin'}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                
                                {/* Tooltip for collapsed state */}
                                {!sidebarOpen && (
                                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                        {userName} ({userRole === 'user' ? 'Student' : userRole === 'hod' ? 'HOD' : 'Admin'})
                                    </div>
                                )}
                            </motion.button>
                        </motion.div>

                        {/* Sidebar Toggle */}
                        <motion.button
                            className={`mt-4 w-full flex rounded-xl hover:bg-white/20 transition-all group p-2 ${
                                sidebarOpen ? 'justify-center' : 'justify-center'
                            }`}
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            variants={itemVariants}
                        >
                            <motion.div
                                animate={{ rotate: sidebarOpen ? 0 : 180 }}
                                transition={{ type: "tween", duration: 0.2 }}
                                className="text-lg"
                            >
                                ←
                            </motion.div>
                            
                            {/* Tooltip for collapsed state */}
                            {!sidebarOpen && (
                                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                    Expand sidebar
                                </div>
                            )}
                        </motion.button>
                    </div>
                </motion.div>

                {/* Main Content */}
                <motion.div
                    className="transition-all duration-200"
                    variants={contentVariants}
                    animate={sidebarOpen ? "normal" : "expanded"}
                >
                    {/* Header */}
                    <motion.header
                        className="bg-white/10 backdrop-blur-md shadow-lg border-b border-white/20 p-6 sticky top-0 z-20"
                        variants={itemVariants}
                    >
                        <div className="flex items-center justify-between">
                            <div className='flex flex-col items-start'>
                                <motion.h1
                                    className={`text-3xl font-bold bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent`}
                                    variants={itemVariants}
                                >
                                    {title}
                                </motion.h1>
                                <motion.p
                                    className="text-gray-700 mt-1 text-lg font-medium"
                                    variants={itemVariants}
                                >
                                    {getGreeting()}, {userName}! • {currentTime.toLocaleDateString('en-US', { 
                                        weekday: 'long', 
                                        month: 'long', 
                                        day: 'numeric' 
                                    })}
                                </motion.p>
                            </div>

                            <div className="flex items-center gap-4">
                                {/* Quick Actions */}
                                <div className="hidden md:flex items-center gap-2">
                                    {quickActions.slice(0, 3).map((action) => (
                                        <motion.button
                                            key={action.id}
                                            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${theme.primary} text-white flex items-center justify-center shadow-lg`}
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => onTabChange && onTabChange(action.id)}
                                            title={action.label}
                                        >
                                            {action.icon}
                                        </motion.button>
                                    ))}
                                </div>

                                {/* Notifications */}
                                <div className="relative" ref={notificationRef}>
                                    <motion.button
                                        className="relative w-10 h-10 bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/40 transition-colors"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleNotificationClick}
                                    >
                                        🔔
                                        {unreadCount > 0 && (
                                            <motion.div
                                                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                whileHover={{ scale: 1.1 }}
                                            >
                                                {unreadCount}
                                            </motion.div>
                                        )}
                                    </motion.button>

                                    <AnimatePresence>
                                        {showNotifications && (
                                            <motion.div
                                                className="absolute right-0 top-12 w-80 bg-white/20 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-4 z-50"
                                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                            >
                                                <h3 className="font-bold text-gray-800 mb-4">Notifications</h3>
                                                <div className="space-y-3 max-h-80 overflow-y-auto">
                                                    {notifications.map((notification) => (
                                                        <motion.div
                                                            key={notification.id}
                                                            className={`p-3 rounded-xl border-l-4 ${
                                                                notification.unread 
                                                                    ? 'bg-white/30 border-blue-500' 
                                                                    : 'bg-white/20 border-gray-300'
                                                            } cursor-pointer backdrop-blur-sm`}
                                                            whileHover={{ scale: 1.02, x: 5 }}
                                                            onClick={() => markAsRead(notification.id)}
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <span className="text-lg">
                                                                    {getNotificationIcon(notification.type)}
                                                                </span>
                                                                <div className="flex-1">
                                                                    <h4 className="font-medium text-gray-800 text-sm">
                                                                        {notification.title}
                                                                    </h4>
                                                                    <p className="text-gray-600 text-xs mt-1">
                                                                        {notification.message}
                                                                    </p>
                                                                    <p className="text-gray-500 text-xs mt-2">
                                                                        {notification.time}
                                                                    </p>
                                                                </div>
                                                                {notification.unread && (
                                                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* User Avatar with Profile Dropdown */}
                                <div className="relative" ref={profileRef}>
                                    <motion.div
                                        className={`w-10 h-10 bg-gradient-to-br ${theme.primary} rounded-xl flex items-center justify-center text-white font-bold cursor-pointer shadow-lg`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleProfileClick}
                                    >
                                        {userAvatar}
                                    </motion.div>

                                    {/* Profile Dropdown */}
                                    <ProfileDropdown 
                                        showProfile={showProfile}
                                        setShowProfile={setShowProfile}
                                        theme={theme}
                                        userRole={userRole}
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.header>

                    {/* Error Message */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                className="mx-6 mt-6 bg-red-50/60 backdrop-blur-sm border border-red-300 text-red-600 p-4 rounded-2xl shadow-lg"
                                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                whileHover={{ scale: 1.01 }}
                            >
                                <div className="flex items-center gap-3">
                                    <motion.div
                                        animate={{ rotate: [0, 10, -10, 0] }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        ⚠️
                                    </motion.div>
                                    <span className="font-medium">{error}</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Main Content Area */}
                    <motion.main
                        className="p-6"
                        variants={itemVariants}
                    >
                        <motion.div
                            className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl min-h-[calc(100vh-3rem)] p-6 border border-white/20 relative overflow-hidden"
                            variants={itemVariants}
                            whileHover={{ 
                                boxShadow: "0 25px 60px rgba(0,0,0,0.12)",
                                scale: 1.001 
                            }}
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

                            <div className="relative z-10">
                                {children}
                            </div>

                            {/* Floating corner elements for visual interest */}
                            <motion.div
                                className="absolute top-4 right-4 w-3 h-3 bg-purple-400/30 rounded-full"
                                animate={{
                                    scale: [1, 1.5, 1],
                                    opacity: [0.3, 0.6, 0.3]
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                            <motion.div
                                className="absolute bottom-4 left-4 w-2 h-2 bg-blue-400/30 rounded-full"
                                animate={{
                                    scale: [1, 1.3, 1],
                                    opacity: [0.4, 0.7, 0.4]
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: 1.5
                                }}
                            />
                        </motion.div>
                    </motion.main>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default DashboardLayout;