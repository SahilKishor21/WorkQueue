import React from 'react';
import NotesCard from './NotesCard';
import { motion, AnimatePresence } from 'framer-motion';

const NotesList = ({ notes }) => {
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
                    {notes.length > 0 ? (
                        <motion.div 
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
                            variants={gridVariants}
                            key="notes-grid"
                        >
                            {notes.map((note, index) => (
                                <motion.div 
                                    key={note._id || note.id} 
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
                                    <NotesCard
                                        notes={note}
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
                                    className="w-24 h-24 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full flex items-center justify-center"
                                    animate={{ 
                                        rotate: 360,
                                        scale: [1, 1.1, 1]
                                    }}
                                    transition={{ 
                                        rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                                        scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                                    }}
                                >
                                    <div className="text-4xl text-blue-400">📚</div>
                                </motion.div>
                                <motion.h3 
                                    className="text-xl font-semibold text-gray-500"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    No Notes Available
                                </motion.h3>
                                <motion.p 
                                    className="text-gray-400 max-w-md text-center"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.7 }}
                                >
                                    There are no study notes available at the moment. Check back later for new materials.
                                </motion.p>
                                <motion.button
                                    className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium shadow-lg"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => window.location.reload()}
                                >
                                    🔄 Refresh
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
};

export default NotesList;