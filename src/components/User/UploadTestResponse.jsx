import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AdvancedBackground = () => {
    const [particles, setParticles] = useState([]);

    React.useEffect(() => {
        const generateParticles = () => {
            return Array.from({ length: 50 }, (_, index) => ({
                id: index,
                shape: Math.random() > 0.5 ? 'circle' : 'square',
                size: Math.random() * 80 + 20,
                left: Math.random() * 120 - 10,
                top: Math.random() * 120 - 10,
                color: `rgba(${Math.random() * 100 + 100}, ${Math.random() * 100 + 155}, ${Math.random() * 100 + 100}, ${Math.random() * 0.3 + 0.1})`,
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
            <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-teal-100/50 mix-blend-overlay"></div>
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
                        'linear-gradient(45deg, rgba(16,185,129,0.2), rgba(20,184,166,0.2))',
                        'linear-gradient(135deg, rgba(20,184,166,0.2), rgba(16,185,129,0.2))'
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

const UploadTestResponse = ({ test, onUploadSuccess }) => {
    const [testResponse, setTestResponse] = useState({ title: test?.title || '', adminName: test?.admin || '', testId: test?._id || '' });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [dragActive, setDragActive] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTestResponse({ ...testResponse, [name]: value });
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);
        setError(null);

        const formData = new FormData();
        formData.append('title', testResponse.title);
        formData.append('adminName', testResponse.adminName);
        formData.append('testId', testResponse.testId);
        formData.append('taskFile', file);

        try {
            const token = localStorage.getItem('userToken');
            console.log('Token retrieved from localStorage:', token);

            const response = await fetch('http://localhost:5000/api/users/upload-test', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Upload failed');
            }

            const data = await response.json();
            console.log('Upload response:', data);

            setSuccess(true);
            setTestResponse({ title: '', adminName: '', testId: '' });
            setFile(null);

            // Call success callback if provided
            if (onUploadSuccess) {
                setTimeout(() => {
                    onUploadSuccess();
                }, 2000);
            }

            // Hide success message after 3 seconds
            setTimeout(() => {
                setSuccess(false);
            }, 3000);

        } catch (err) {
            console.error('Error uploading test response:', err.message || err);
            setError(err.message || 'Failed to upload the test response. Please try again.');
        } finally {
            setLoading(false);
        }
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

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-white flex items-center justify-center py-8">
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
                            className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600 mb-2"
                            whileHover={{ 
                                scale: 1.05,
                                transition: { 
                                    type: "spring",
                                    damping: 15,
                                    stiffness: 400 
                                }
                            }}
                        >
                            Submit Test Response
                        </motion.h2>
                        <motion.div 
                            className="h-1 w-20 bg-gradient-to-r from-green-600 to-teal-600 rounded-full mx-auto"
                            initial={{ width: 0 }}
                            animate={{ width: "5rem" }}
                            transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
                        />
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
                                    <span className="font-medium">Test response submitted successfully!</span>
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
                                Test Title
                            </label>
                            <motion.input
                                type="text"
                                id="title"
                                name="title"
                                value={testResponse.title}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white/70 backdrop-blur-sm transition-all duration-200"
                                placeholder="Enter test title..."
                                required
                                whileFocus={{ scale: 1.02 }}
                                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                            />
                        </motion.div>

                        {/* Admin Name Field */}
                        <motion.div variants={itemVariants}>
                            <label htmlFor="adminName" className="block text-gray-700 mb-2 font-medium">
                                Admin/Teacher Name
                            </label>
                            <motion.input
                                type="text"
                                id="adminName"
                                name="adminName"
                                value={testResponse.adminName}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white/70 backdrop-blur-sm transition-all duration-200"
                                placeholder="Enter admin/teacher name..."
                                required
                                whileFocus={{ scale: 1.02 }}
                                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                            />
                        </motion.div>

                        {/* Test ID Field (Hidden if coming from test) */}
                        {!test && (
                            <motion.div variants={itemVariants}>
                                <label htmlFor="testId" className="block text-gray-700 mb-2 font-medium">
                                    Test ID (Optional)
                                </label>
                                <motion.input
                                    type="text"
                                    id="testId"
                                    name="testId"
                                    value={testResponse.testId}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white/70 backdrop-blur-sm transition-all duration-200"
                                    placeholder="Enter test ID if available..."
                                    whileFocus={{ scale: 1.02 }}
                                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                                />
                            </motion.div>
                        )}

                        {/* File Upload Field */}
                        <motion.div variants={itemVariants}>
                            <label htmlFor="file" className="block text-gray-700 mb-2 font-medium">
                                Upload Test Response File
                            </label>
                            
                            {/* File Drop Zone */}
                            <motion.div
                                className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 bg-white/50 backdrop-blur-sm ${
                                    dragActive 
                                        ? 'border-green-500 bg-green-50/50' 
                                        : file 
                                            ? 'border-green-400 bg-green-50/50' 
                                            : 'border-gray-300 hover:border-green-400'
                                }`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                            >
                                <input
                                    type="file"
                                    id="taskFile"
                                    name="taskFile"
                                    accept=".pdf,.ppt,.pptx,.doc,.docx,.csv,.txt"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    required
                                />
                                
                                {file ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="space-y-2"
                                    >
                                        <motion.div
                                            className="text-green-600 text-2xl"
                                            animate={{ scale: [1, 1.1, 1] }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            ✅
                                        </motion.div>
                                        <p className="font-medium text-green-700">{file.name}</p>
                                        <p className="text-sm text-gray-600">{formatFileSize(file.size)}</p>
                                        <p className="text-xs text-gray-500">Click to change file</p>
                                    </motion.div>
                                ) : (
                                    <motion.div className="space-y-3">
                                        <motion.div
                                            className="text-4xl text-gray-400"
                                            animate={{ y: [0, -5, 0] }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                        >
                                            📎
                                        </motion.div>
                                        <div>
                                            <p className="font-medium text-gray-700">
                                                {dragActive ? 'Drop your test response here' : 'Click to browse or drag & drop'}
                                            </p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                PDF, PPT, DOC, CSV, TXT files supported
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        </motion.div>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={loading || !file}
                            className="w-full py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg font-medium shadow-lg border border-white/20 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                            variants={buttonVariants}
                            whileHover={!loading && file ? "hover" : {}}
                            whileTap={!loading && file ? "tap" : {}}
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
                                {loading ? (
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
                                        <span>Uploading...</span>
                                    </>
                                ) : (
                                    <>
                                        <motion.span
                                            animate={{ rotate: [0, 15, -15, 0] }}
                                            transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                                        >
                                            📤
                                        </motion.span>
                                        <span>Submit Test Response</span>
                                    </>
                                )}
                            </div>
                        </motion.button>
                    </motion.form>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default UploadTestResponse;