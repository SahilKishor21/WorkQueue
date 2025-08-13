import React, { useState, useEffect } from 'react';
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
                color: `rgba(${Math.random() * 100 + 155}, ${Math.random() * 80 + 100}, ${Math.random() * 50 + 50}, ${Math.random() * 0.3 + 0.1})`,
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
            className="absolute inset-0 overflow-hidden pointer-events-none z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-amber-100/50 mix-blend-overlay"></div>
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
                className="absolute inset-0 bg-white/10"
                animate={{
                    background: [
                        'linear-gradient(45deg, rgba(251,146,60,0.2), rgba(245,158,11,0.2))',
                        'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(251,146,60,0.2))'
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

const UploadAssignment = () => {
    const [uploadType, setUploadType] = useState('assignment');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [label, setLabel] = useState('');
    const [deadline, setDeadline] = useState('');
    const [deadlineTime, setDeadlineTime] = useState('23:59'); // Default to end of day
    const [useSpecificTime, setUseSpecificTime] = useState(false);
    const [testUrl, setTestUrl] = useState('');
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const uploadTypes = [
        { value: 'assignment', label: '📋 Assignment', icon: '📋' },
        { value: 'notes', label: '📚 Notes', icon: '📚' },
        { value: 'lecture', label: '🎥 Video Lecture', icon: '🎥' },
        { value: 'test', label: '📝 Test', icon: '📝' }
    ];

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

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleCreateTest = () => {
        window.open('https://form-craft-five.vercel.app/create', '_blank');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess(false);

        try {
            const token = localStorage.getItem('adminToken');
            
            let endpoint = '';
            let requestData = {};
            
            // Common fields
            requestData.title = title;
            requestData.description = description;
            requestData.label = label;

            switch (uploadType) {
                case 'assignment':
                    endpoint = 'https://workqueue-backend.onrender.com/api/admins/assignments/upload';
                    
                    // Handle deadline with optional time
                    if (useSpecificTime && deadlineTime) {
                        requestData.deadline = `${deadline}T${deadlineTime}`;
                    } else {
                        requestData.deadline = deadline;
                        requestData.deadlineTime = deadlineTime; // fallback time
                    }
                    break;
                
                case 'notes':
                    endpoint = 'https://workqueue-backend.onrender.com/api/admins/notes/upload';
                    if (!file) {
                        throw new Error('Please select a file for notes upload');
                    }
                    break;
                
                case 'lecture':
                    endpoint = 'https://workqueue-backend.onrender.com/api/admins/lectures/upload';
                    if (!file) {
                        throw new Error('Please select a video file for lecture upload');
                    }
                    break;
                
                case 'test':
                    endpoint = 'https://workqueue-backend.onrender.com/api/admins/tests/upload';
                    if (!testUrl) {
                        throw new Error('Please provide test URL');
                    }
                    requestData.testUrl = testUrl;
                    
                    // Handle deadline for tests
                    if (useSpecificTime && deadlineTime) {
                        requestData.deadline = `${deadline}T${deadlineTime}`;
                    } else {
                        requestData.deadline = deadline;
                        requestData.deadlineTime = deadlineTime;
                    }
                    break;
                
                default:
                    throw new Error('Invalid upload type');
            }

            let response;

            // For files, use FormData
            if (uploadType === 'notes' || uploadType === 'lecture') {
                const formData = new FormData();
                Object.keys(requestData).forEach(key => {
                    formData.append(key, requestData[key]);
                });
                formData.append('file', file);

                response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData
                });
            } else {
                // For assignments and tests, use JSON
                response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(requestData)
                });
            }
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Upload failed');
            }

            setSuccess(true);
            
            // Clear form
            setTitle('');
            setDescription('');
            setLabel('');
            setDeadline('');
            setDeadlineTime('23:59');
            setUseSpecificTime(false);
            setTestUrl('');
            setFile(null);

            // Reset file input
            const fileInput = document.getElementById('file-upload');
            if (fileInput) fileInput.value = '';

            // Hide success message after 3 seconds
            setTimeout(() => {
                setSuccess(false);
            }, 3000);

        } catch (error) {
            console.error('Error uploading content:', error.message);
            setError(error.message || 'Failed to upload content.');
        } finally {
            setIsLoading(false);
        }
    };

    const getTypeConfig = () => {
        const configs = {
            assignment: {
                title: 'Create Assignment',
                gradient: 'from-orange-600 to-amber-600',
                needsFile: false,
                needsDeadline: true,
                needsTestUrl: false,
                fileTypes: '',
                placeholder: 'Assignment details...'
            },
            notes: {
                title: 'Upload Notes',
                gradient: 'from-blue-600 to-purple-600',
                needsFile: true,
                needsDeadline: false,
                needsTestUrl: false,
                fileTypes: '.pdf,.doc,.docx,.ppt,.pptx',
                placeholder: 'Notes description...'
            },
            lecture: {
                title: 'Upload Video Lecture',
                gradient: 'from-purple-600 to-pink-600',
                needsFile: true,
                needsDeadline: false,
                needsTestUrl: false,
                fileTypes: '.mp4,.avi,.mov,.wmv,.mkv',
                placeholder: 'Lecture description...'
            },
            test: {
                title: 'Create Test',
                gradient: 'from-green-600 to-teal-600',
                needsFile: false,
                needsDeadline: true,
                needsTestUrl: true,
                fileTypes: '',
                placeholder: 'Test instructions...'
            }
        };
        return configs[uploadType];
    };

    const config = getTypeConfig();

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

    const formVariants = {
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
                duration: 0.8
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { 
            opacity: 1, 
            x: 0,
            transition: {
                type: "spring",
                damping: 20,
                stiffness: 300
            }
        }
    };

    const buttonVariants = {
        hover: { 
            scale: 1.02,
            boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
            transition: { 
                type: "spring", 
                damping: 15, 
                stiffness: 400 
            }
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
        <div className="relative min-h-screen w-screen overflow-hidden bg-white flex items-center justify-center py-8">
            <AdvancedBackground />
            
            <motion.div 
                className="relative z-10 w-full max-w-md px-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div 
                    className="bg-white/55 backdrop-blur-sm rounded-2xl shadow-2xl p-8 space-y-6 border border-white/20"
                    variants={formVariants}
                    whileHover={{ 
                        scale: 1.01,
                        boxShadow: "0 25px 50px rgba(0,0,0,0.12)",
                        transition: { duration: 0.3 }
                    }}
                >
                    {/* Header */}
                    <motion.div 
                        className="text-center"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                    >
                        <motion.h2 
                            className={`text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${config.gradient} mb-2`}
                            whileHover={{ 
                                scale: 1.05,
                                transition: { 
                                    type: "spring",
                                    damping: 15,
                                    stiffness: 400 
                                }
                            }}
                        >
                            {config.title}
                        </motion.h2>
                        <motion.div 
                            className={`h-1 w-20 bg-gradient-to-r ${config.gradient} rounded-full mx-auto`}
                            initial={{ width: 0 }}
                            animate={{ width: "5rem" }}
                            transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
                        />
                    </motion.div>

                    {/* Upload Type Selection */}
                    <motion.div variants={itemVariants}>
                        <label className="block text-gray-700 mb-2 font-medium">
                            Upload Type
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {uploadTypes.map((type) => (
                                <motion.button
                                    key={type.value}
                                    type="button"
                                    onClick={() => setUploadType(type.value)}
                                    className={`p-3 rounded-lg border-2 transition-all ${
                                        uploadType === type.value
                                            ? `border-orange-500 bg-orange-50 text-orange-700`
                                            : 'border-gray-300 bg-white text-gray-700 hover:border-orange-300'
                                    }`}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <div className="text-xl mb-1">{type.icon}</div>
                                    <div className="text-xs font-medium">{type.label.split(' ')[1]}</div>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Success Message */}
                    <AnimatePresence>
                        {success && (
                            <motion.div 
                                className="bg-green-50/80 backdrop-blur-sm border border-green-300 text-green-700 p-4 rounded-lg text-center"
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
                                        className="w-5 h-5 text-green-600"
                                        fill="currentColor" 
                                        viewBox="0 0 20 20"
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 0.6 }}
                                    >
                                        <path 
                                            fillRule="evenodd" 
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                                            clipRule="evenodd" 
                                        />
                                    </motion.svg>
                                    <span className="font-medium">{config.title.split(' ')[0]} created successfully!</span>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Error Message */}
                    <AnimatePresence>
                        {error && (
                            <motion.div 
                                className="bg-red-50/80 backdrop-blur-sm border border-red-300 text-red-700 p-4 rounded-lg"
                                variants={messageVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                <motion.div
                                    className="flex items-center space-x-2"
                                    initial={{ x: -10, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <motion.svg 
                                        className="w-5 h-5 text-red-500"
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
                                    <span>{error}</span>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Form */}
                    <motion.form 
                        onSubmit={handleSubmit} 
                        className="space-y-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        {/* Title Field */}
                        <motion.div variants={itemVariants}>
                            <label htmlFor="title" className="block text-gray-700 mb-2 font-medium">
                                Title
                            </label>
                            <motion.input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white/70 backdrop-blur-sm transition-all duration-200"
                                placeholder={`Enter ${uploadType} title...`}
                                required
                                whileFocus={{ scale: 1.02 }}
                                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                            />
                        </motion.div>

                        {/* Description Field */}
                        <motion.div variants={itemVariants}>
                            <label htmlFor="description" className="block text-gray-700 mb-2 font-medium">
                                Description
                            </label>
                            <motion.textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows="4"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white/70 backdrop-blur-sm resize-none transition-all duration-200"
                                placeholder={config.placeholder}
                                required
                                whileFocus={{ scale: 1.02 }}
                                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                            />
                        </motion.div>

                        {/* Label Field */}
                        <motion.div variants={itemVariants}>
                            <label htmlFor="label" className="block text-gray-700 mb-2 font-medium">
                                Label/Category
                            </label>
                            <motion.input
                                type="text"
                                id="label"
                                value={label}
                                onChange={(e) => setLabel(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white/70 backdrop-blur-sm transition-all duration-200"
                                placeholder="e.g., Programming, Mathematics..."
                                required
                                whileFocus={{ scale: 1.02 }}
                                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                            />
                        </motion.div>

                        {/* File Upload Field */}
                        <AnimatePresence>
                            {config.needsFile && (
                                <motion.div 
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                >
                                    <label htmlFor="file-upload" className="block text-gray-700 mb-2 font-medium">
                                        {uploadType === 'lecture' ? 'Video File' : 'File'}
                                    </label>
                                    <motion.input
                                        type="file"
                                        id="file-upload"
                                        accept={config.fileTypes}
                                        onChange={handleFileChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white/70 backdrop-blur-sm transition-all duration-200"
                                        required
                                        whileFocus={{ scale: 1.02 }}
                                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                                    />
                                    {file && (
                                        <motion.p 
                                            className="text-sm text-gray-600 mt-2"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                        >
                                            Selected: {file.name}
                                        </motion.p>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Test URL and Create Test Button */}
                        <AnimatePresence>
                            {config.needsTestUrl && (
                                <motion.div 
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                    className="space-y-4"
                                >
                                    <div>
                                        <label className="block text-gray-700 mb-2 font-medium">
                                            Create Test
                                        </label>
                                        <motion.button
                                            type="button"
                                            onClick={handleCreateTest}
                                            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium shadow-lg border border-white/20 backdrop-blur-sm"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            🔗 Create Test on FormCraft
                                        </motion.button>
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="testUrl" className="block text-gray-700 mb-2 font-medium">
                                            Test URL
                                        </label>
                                        <motion.input
                                            type="url"
                                            id="testUrl"
                                            value={testUrl}
                                            onChange={(e) => setTestUrl(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white/70 backdrop-blur-sm transition-all duration-200"
                                            placeholder="Paste the test URL from FormCraft..."
                                            required
                                            whileFocus={{ scale: 1.02 }}
                                            transition={{ type: "spring", damping: 20, stiffness: 300 }}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Enhanced Deadline Field with Time Support */}
                        <AnimatePresence>
                            {config.needsDeadline && (
                                <motion.div 
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                    className="space-y-3"
                                >
                                    <label className="block text-gray-700 mb-2 font-medium">
                                        Deadline
                                    </label>
                                    
                                    {/* Date Field */}
                                    <motion.input
                                        type="date"
                                        id="deadline"
                                        value={deadline}
                                        onChange={(e) => setDeadline(e.target.value)}
                                        min={currentDateTime.date}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white/70 backdrop-blur-sm transition-all duration-200"
                                        required
                                        whileFocus={{ scale: 1.02 }}
                                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                                    />

                                    {/* Time Toggle */}
                                    <div className="flex items-center space-x-3">
                                        <input
                                            type="checkbox"
                                            id="useSpecificTime"
                                            checked={useSpecificTime}
                                            onChange={(e) => setUseSpecificTime(e.target.checked)}
                                            className="w-4 h-4 text-orange-500 focus:ring-orange-400"
                                        />
                                        <label htmlFor="useSpecificTime" className="text-sm text-gray-700">
                                            Set specific time (otherwise defaults to end of day)
                                        </label>
                                    </div>

                                    {/* Time Field - Conditionally Visible */}
                                    <AnimatePresence>
                                        {useSpecificTime && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <label htmlFor="deadlineTime" className="block text-gray-600 mb-2 text-sm">
                                                    Specific Time
                                                </label>
                                                <motion.input
                                                    type="time"
                                                    id="deadlineTime"
                                                    value={deadlineTime}
                                                    onChange={(e) => setDeadlineTime(e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white/70 backdrop-blur-sm transition-all duration-200"
                                                    whileFocus={{ scale: 1.02 }}
                                                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Deadline Preview */}
                                    {deadline && (
                                        <motion.div
                                            className="text-sm text-gray-600 bg-gray-50/70 p-3 rounded-lg border"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                        >
                                            <strong>Deadline Preview:</strong><br />
                                            {useSpecificTime 
                                                ? `${new Date(`${deadline}T${deadlineTime}`).toLocaleString('en-US', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: true
                                                })}`
                                                : `${new Date(`${deadline}T23:59`).toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })} (End of day)`
                                            }
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-3 bg-gradient-to-r ${config.gradient} text-white rounded-lg font-medium shadow-lg border border-white/20 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden`}
                            variants={buttonVariants}
                            whileHover={!isLoading ? "hover" : {}}
                            whileTap={!isLoading ? "tap" : {}}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
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
                                {isLoading ? (
                                    <>
                                        <motion.svg
                                            className="animate-spin h-5 w-5 text-white"
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
                                        </motion.svg>
                                        <span>Creating...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>{config.title}</span>
                                    </>
                                )}
                            </div>
                        </motion.button>
                    </motion.form>

                    {/* Back Link */}
                    <motion.div 
                        className="text-center pt-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9 }}
                    >
                        <motion.a
                            href="/admin/dashboard"
                            className="text-orange-600 hover:text-orange-800 font-medium text-sm hover:underline"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            ← Back to Dashboard
                        </motion.a>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default UploadAssignment;