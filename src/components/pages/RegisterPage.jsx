import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

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

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('User');
    const [label, setLabel] = useState(''); 
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setIsLoading(true);

        try {
            const data = { name, email, password, role, username };
        
            if (role === 'User') {
                data.label = label; 
            }
        
            console.log('Signup data:', data); 
        
            const rolePath = role.toLowerCase();
            const response = await axios.post(`https://workqueue-backend.onrender.com/api/${rolePath}s/register`, data, {
                headers: { 'Content-Type': 'application/json' },
            });
            console.log('Signup response:', response.data); 
           
            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            console.error('Signup error:', error); 
        
            const errorMessage =
                error.response?.data?.msg || 
                error.response?.data?.message || 
                'Signup failed. Please try again.';
            setError(errorMessage); 
        } finally {
            setIsLoading(false); 
        }
    }

    return (
        <div className="relative min-h-screen w-screen overflow-hidden bg-white/ flex items-center justify-center py-8">
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
                className="relative z-10 bg-white/55 backdrop-blur-sm w-full max-w-md rounded-2xl shadow-2xl p-8 space-y-6 border border-white/20 my-8"
            >
                <motion.h2 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600"
                >
                    Create an Account
                </motion.h2>

                {success && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-green-50 border border-green-300 text-green-600 p-3 rounded-lg text-center"
                    >
                        Account created successfully! Redirecting to login...
                    </motion.div>
                )}

                {error && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-red-50 border border-red-300 text-red-600 p-3 rounded-lg text-center"
                    >
                        {error}
                    </motion.div>
                )}

                <motion.form 
                    onSubmit={handleSignup} 
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <label htmlFor="name" className="block text-gray-700 mb-2">Name</label>
                        <input 
                            type="text" 
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/70 backdrop-blur-sm"
                            required 
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.45 }}
                    >
                        <label htmlFor="username" className="block text-gray-700 mb-2">Username</label>
                        <input 
                            type="text" 
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/70 backdrop-blur-sm"
                            required 
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
                        <input 
                            type="email" 
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/70 backdrop-blur-sm"
                            required 
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.55 }}
                    >
                        <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
                        <input 
                            type="password" 
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/70 backdrop-blur-sm"
                            required 
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <label htmlFor="role" className="block text-gray-700 mb-2">Role</label>
                        <select 
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/70 backdrop-blur-sm"
                        >
                            <option value="User">User</option>
                            <option value="Admin">Admin</option>
                            <option value="Head">Head</option>
                        </select>
                    </motion.div>

                    {role === 'User' && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <label htmlFor="label" className="block text-gray-700 mb-2">Label</label>
                            <input 
                                type="text" 
                                id="label"
                                value={label}
                                onChange={(e) => setLabel(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/70 backdrop-blur-sm"
                                required 
                            />
                        </motion.div>
                    )}

                    <motion.button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity duration-300 flex items-center justify-center"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                    >
                        {isLoading ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            'Sign Up'
                        )}
                    </motion.button>
                </motion.form>

                <motion.div 
                    className="text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    <div className="flex items-center justify-center space-x-4 mt-4">
                        <motion.a 
                            href={'https://workqueue-backend.onrender.com/auth/google'} 
                            className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-colors duration-300"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <FaGoogle size={20} />
                        </motion.a>
                        <motion.a 
                            href={'https://workqueue-backend.onrender.com/auth/github'} 
                            className="bg-gray-800 text-white p-3 rounded-full hover:bg-gray-900 transition-colors duration-300"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <FaGithub size={20} />
                        </motion.a>
                    </div>
                    <p className="text-gray-600 mt-4">
                        Already have an account? <a href="/login" className="text-purple-600 hover:underline">Log In</a>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Signup;