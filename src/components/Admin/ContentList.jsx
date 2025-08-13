import React from 'react';
import ContentCard from './ContentCard';
import { motion, AnimatePresence } from 'framer-motion';

const ContentList = ({ content, contentType }) => {
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

    const getEmptyStateConfig = () => {
        const configs = {
            'assignment': {
                icon: '📋',
                title: 'No assignments created',
                description: 'You haven\'t created any assignments yet. Click "Create Content" to add your first assignment.',
                color: 'from-orange-200 to-amber-200',
                iconColor: 'text-orange-400'
            },
            'note': {
                icon: '📚',
                title: 'No notes uploaded',
                description: 'You haven\'t uploaded any notes yet. Click "Create Content" to share your first notes.',
                color: 'from-blue-200 to-purple-200',
                iconColor: 'text-blue-400'
            },
            'lecture': {
                icon: '🎥',
                title: 'No lectures uploaded',
                description: 'You haven\'t uploaded any video lectures yet. Click "Create Content" to share your first lecture.',
                color: 'from-purple-200 to-pink-200',
                iconColor: 'text-purple-400'
            },
            'test': {
                icon: '📝',
                title: 'No tests created',
                description: 'You haven\'t created any tests yet. Click "Create Content" to add your first test.',
                color: 'from-green-200 to-teal-200',
                iconColor: 'text-green-400'
            }
        };
        return configs[contentType] || configs['assignment'];
    };

    const emptyConfig = getEmptyStateConfig();

    return (
        <motion.div 
            className="w-full"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div className="w-full" variants={gridVariants}>
                <AnimatePresence mode="wait">
                    {content.length > 0 ? (
                        <motion.div 
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
                            variants={gridVariants}
                            key="content-grid"
                        >
                            {content.map((item, index) => (
                                <motion.div 
                                    key={item._id || item.id} 
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
                                    <ContentCard
                                        content={item}
                                        contentType={contentType}
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
                                    className={`w-24 h-24 bg-gradient-to-r ${emptyConfig.color} rounded-full flex items-center justify-center`}
                                    animate={{ 
                                        rotate: 360,
                                        scale: [1, 1.1, 1]
                                    }}
                                    transition={{ 
                                        rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                                        scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                                    }}
                                >
                                    <div className={`text-4xl ${emptyConfig.iconColor}`}>
                                        {emptyConfig.icon}
                                    </div>
                                </motion.div>
                                <motion.h3 
                                    className="text-xl font-semibold text-gray-500"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    {emptyConfig.title}
                                </motion.h3>
                                <motion.p 
                                    className="text-gray-400 max-w-md text-center"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.7 }}
                                >
                                    {emptyConfig.description}
                                </motion.p>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
};

export default ContentList;