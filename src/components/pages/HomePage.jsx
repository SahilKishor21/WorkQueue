import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    RocketLaunchOutlined, 
    LoginOutlined, 
    AssignmentOutlined,
    CloudUploadOutlined,
    CodeOutlined
} from '@mui/icons-material';


const AdvancedBackground = () => {
    const [particles, setParticles] = useState([]);

    useEffect(() => {
       
        const generateParticles = () => {
            return Array.from({ length: 50 }, (_, index) => ({
                id: index,
                shape: Math.random() > 0.5 ? 'circle' : 'square',
                size: Math.random() * 80 + 20,
                left: Math.random() * 120 - 10, // Extend beyond 100%
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

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            delayChildren: 0.3,
            staggerChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { 
        y: 50, 
        opacity: 0,
        scale: 0.9 
    },
    visible: { 
        y: 0, 
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            damping: 12,
            stiffness: 100
        }
    }
};

const HomePage = () => {
    return (
        <div className="relative h-screen w-screen overflow-hidden bg-white flex items-center justify-center">
            
            <AdvancedBackground />
            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="relative z-10 text-center max-w-4xl px-6"
            >
                <motion.h1 
                    variants={itemVariants}
                    className="text-6xl font-black mb-4 p-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
                >
                   WorkQueue
                </motion.h1>

                <motion.p 
                    variants={itemVariants}
                    className="text-xl text-gray-700 mb-10 max-w-2xl mx-auto leading-relaxed"
                >
                    Revolutionize your assignment management with intelligent collaboration, 
                    seamless workflows, and powerful tracking tools.
                </motion.p>

                <motion.div 
                    variants={itemVariants}
                    className="flex justify-center space-x-6"
                >
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link 
                            to="/register" 
                            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-2xl hover:shadow-xl text-lg"
                        >
                            <RocketLaunchOutlined />
                            Get Started
                        </Link>
                    </motion.div>
                    
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link 
                            to="/login" 
                            className="flex items-center gap-3 px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition-colors duration-300 text-lg"
                        >
                            <LoginOutlined />
                            Log In
                        </Link>
                    </motion.div>
                </motion.div>

                <motion.div 
                    variants={itemVariants}
                    className="mt-12 flex justify-center space-x-8 opacity-70"
                >
                    {[
                        { 
                            icon: <AssignmentOutlined />, 
                            text: "Secure Submissions" 
                        },
                        { 
                            icon: <CodeOutlined />, 
                            text: "Smart Tracking" 
                        },
                        { 
                            icon: <CloudUploadOutlined />, 
                            text: "Instant Feedback" 
                        }
                    ].map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="flex items-center gap-3 text-gray-600"
                        >
                            {feature.icon}
                            <span className="text-md">{feature.text}</span>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </div>
    );
};

export default HomePage;