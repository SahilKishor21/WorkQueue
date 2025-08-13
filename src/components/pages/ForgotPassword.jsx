import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

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
            className="absolute inset-0 overflow-hidden pointer-events-none z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-100/50 mix-blend-overlay"></div>
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
                        'linear-gradient(45deg, rgba(59,130,246,0.2), rgba(99,102,241,0.2))',
                        'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(59,130,246,0.2))'
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

const ForgotPassword = () => {
    const [currentStep, setCurrentStep] = useState('email'); // 'email', 'otp', 'reset'
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [passwords, setPasswords] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [resetToken, setResetToken] = useState('');
    
    const navigate = useNavigate();
    const location = useLocation();
    const userType = location.state?.userType || 'user';

    // Get API base URL based on user type
    const getApiBaseUrl = () => {
        return userType === 'user' ? '/api/users' : '/api/admin';
    };

    // Clear message after 5 seconds
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    // Step 1: Send OTP to email
    const sendOTP = async (e) => {
        e.preventDefault();
        if (!email || !email.includes('@')) {
            setMessage('Please enter a valid email address');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`${getApiBaseUrl()}/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();
            
            if (response.ok) {
                setMessage('OTP sent to your email successfully');
                setCurrentStep('otp');
            } else {
                setMessage(data.message || 'Failed to send OTP');
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
            setMessage('Error sending OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP
    const verifyOTP = async (e) => {
        e.preventDefault();
        if (!otp || otp.length !== 6) {
            setMessage('Please enter a valid 6-digit OTP');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`${getApiBaseUrl()}/verify-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, otp })
            });

            const data = await response.json();
            
            if (response.ok) {
                setResetToken(data.resetToken);
                setMessage('OTP verified successfully');
                setCurrentStep('reset');
            } else {
                setMessage(data.message || 'Invalid or expired OTP');
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            setMessage('Error verifying OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Reset password
    const resetPassword = async (e) => {
        e.preventDefault();
        if (!passwords.newPassword || passwords.newPassword.length < 6) {
            setMessage('Password must be at least 6 characters long');
            return;
        }

        if (passwords.newPassword !== passwords.confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`${getApiBaseUrl()}/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    resetToken,
                    newPassword: passwords.newPassword
                })
            });

            const data = await response.json();
            
            if (response.ok) {
                setMessage('Password reset successfully! Redirecting to login...');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setMessage(data.message || 'Failed to reset password');
            }
        } catch (error) {
            console.error('Error resetting password:', error);
            setMessage('Error resetting password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getStepTitle = () => {
        switch (currentStep) {
            case 'email': return 'Reset Password';
            case 'otp': return 'Verify OTP';
            case 'reset': return 'New Password';
            default: return 'Reset Password';
        }
    };

    const getStepSubtitle = () => {
        switch (currentStep) {
            case 'email': return 'Enter your email to receive a reset code';
            case 'otp': return `Enter the 6-digit code sent to ${email}`;
            case 'reset': return 'Create your new password';
            default: return '';
        }
    };

    return (
        <div className="relative min-h-screen w-screen overflow-hidden bg-white flex items-center justify-center">
            <AdvancedBackground />
            
            <motion.div 
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                    type: "spring",
                    damping: 12,
                    stiffness: 100,
                    duration: 0.6 
                }}
                className="relative z-10 bg-white/55 backdrop-blur-sm w-full max-w-md rounded-2xl shadow-2xl p-8 space-y-6 border border-white/20"
            >
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center"
                >
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                        {getStepTitle()}
                    </h2>
                    <p className="text-gray-600 mt-2">{getStepSubtitle()}</p>
                    <p className="text-sm text-gray-500 mt-1">
                        {userType === 'user' ? 'Student' : userType === 'admin' ? 'Admin' : 'HOD'} Account
                    </p>
                </motion.div>

                {/* Progress Steps */}
                <div className="flex items-center justify-between px-4">
                    <div className={`flex items-center ${currentStep === 'email' ? 'text-blue-600 font-semibold' : currentStep !== 'email' ? 'text-green-600' : 'text-gray-400'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                            currentStep === 'email' ? 'bg-blue-600 text-white' : 
                            currentStep !== 'email' ? 'bg-green-500 text-white' : 'bg-gray-200'
                        }`}>
                            {currentStep !== 'email' ? '✓' : '1'}
                        </div>
                        <span className="ml-2 text-sm">Email</span>
                    </div>
                    <div className={`flex-1 h-1 mx-4 rounded ${currentStep !== 'email' ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                    <div className={`flex items-center ${currentStep === 'otp' ? 'text-blue-600 font-semibold' : currentStep === 'reset' ? 'text-green-600' : 'text-gray-400'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                            currentStep === 'otp' ? 'bg-blue-600 text-white' : 
                            currentStep === 'reset' ? 'bg-green-500 text-white' : 'bg-gray-200'
                        }`}>
                            {currentStep === 'reset' ? '✓' : '2'}
                        </div>
                        <span className="ml-2 text-sm">Verify</span>
                    </div>
                    <div className={`flex-1 h-1 mx-4 rounded ${currentStep === 'reset' ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                    <div className={`flex items-center ${currentStep === 'reset' ? 'text-blue-600 font-semibold' : 'text-gray-400'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                            currentStep === 'reset' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                        }`}>
                            3
                        </div>
                        <span className="ml-2 text-sm">Reset</span>
                    </div>
                </div>
                
                {/* Message */}
                {message && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`p-3 rounded-lg text-center text-sm font-medium ${
                            message.includes('successfully') || message.includes('sent') 
                                ? 'bg-green-50 border border-green-300 text-green-600' 
                                : 'bg-red-50 border border-red-300 text-red-600'
                        }`}
                    >
                        {message}
                    </motion.div>
                )}

                <AnimatePresence mode="wait">
                    {/* Step 1: Email */}
                    {currentStep === 'email' && (
                        <motion.form 
                            key="email"
                            onSubmit={sendOTP} 
                            className="space-y-4"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <label htmlFor="email" className="block text-gray-700 mb-2">Email Address</label>
                                <input 
                                    type="email" 
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/70 backdrop-blur-sm"
                                    placeholder="Enter your email address"
                                    required 
                                    disabled={loading}
                                />
                            </motion.div>
                            
                            <motion.button 
                                type="submit" 
                                disabled={loading || !email}
                                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity duration-300 flex items-center justify-center disabled:opacity-50"
                                whileHover={{ scale: loading ? 1 : 1.02 }}
                                whileTap={{ scale: loading ? 1 : 0.98 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                {loading ? (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    'Send Verification Code'
                                )}
                            </motion.button>
                        </motion.form>
                    )}

                    {/* Step 2: OTP */}
                    {currentStep === 'otp' && (
                        <motion.form 
                            key="otp"
                            onSubmit={verifyOTP} 
                            className="space-y-4"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <label htmlFor="otp" className="block text-gray-700 mb-2">Verification Code</label>
                                <input 
                                    type="text" 
                                    id="otp"
                                    value={otp}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                        setOtp(value);
                                    }}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/70 backdrop-blur-sm text-center text-2xl font-mono tracking-widest"
                                    placeholder="000000"
                                    maxLength="6"
                                    required 
                                    disabled={loading}
                                />
                                <p className="text-xs text-gray-500 mt-2 text-center">
                                    Code expires in 10 minutes
                                </p>
                            </motion.div>
                            
                            <div className="flex gap-3">
                                <motion.button
                                    type="button"
                                    onClick={() => setCurrentStep('email')}
                                    className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={loading}
                                >
                                    Back
                                </motion.button>
                                
                                <motion.button 
                                    type="submit" 
                                    disabled={loading || otp.length !== 6}
                                    className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity duration-300 flex items-center justify-center disabled:opacity-50"
                                    whileHover={{ scale: loading || otp.length !== 6 ? 1 : 1.02 }}
                                    whileTap={{ scale: loading || otp.length !== 6 ? 1 : 0.98 }}
                                >
                                    {loading ? (
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        'Verify Code'
                                    )}
                                </motion.button>
                            </div>
                        </motion.form>
                    )}

                    {/* Step 3: Reset Password */}
                    {currentStep === 'reset' && (
                        <motion.form 
                            key="reset"
                            onSubmit={resetPassword} 
                            className="space-y-4"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <label htmlFor="newPassword" className="block text-gray-700 mb-2">New Password</label>
                                <input 
                                    type="password" 
                                    id="newPassword"
                                    value={passwords.newPassword}
                                    onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/70 backdrop-blur-sm"
                                    placeholder="Enter new password"
                                    required 
                                    disabled={loading}
                                />
                            </motion.div>
                            
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">Confirm Password</label>
                                <input 
                                    type="password" 
                                    id="confirmPassword"
                                    value={passwords.confirmPassword}
                                    onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/70 backdrop-blur-sm"
                                    placeholder="Confirm new password"
                                    required 
                                    disabled={loading}
                                />
                            </motion.div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <p className="text-xs text-blue-800">
                                    <strong>Password Requirements:</strong><br />
                                    • At least 6 characters long<br />
                                    • Include letters, numbers, and symbols for better security
                                </p>
                            </div>
                            
                            <motion.button 
                                type="submit" 
                                disabled={loading || !passwords.newPassword || !passwords.confirmPassword || passwords.newPassword !== passwords.confirmPassword}
                                className="w-full py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity duration-300 flex items-center justify-center disabled:opacity-50"
                                whileHover={{ scale: loading ? 1 : 1.02 }}
                                whileTap={{ scale: loading ? 1 : 0.98 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                {loading ? (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    'Reset Password'
                                )}
                            </motion.button>
                        </motion.form>
                    )}
                </AnimatePresence>
                
                <motion.div 
                    className="text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    <p className="text-gray-600">
                        Remember your password? <button onClick={() => navigate('/login')} className="text-blue-600 hover:underline">Back to Login</button>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;