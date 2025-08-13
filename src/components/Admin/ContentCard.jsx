import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

const ContentCard = ({ content, contentType, index = 0 }) => {
  const getThemeConfig = () => {
    const configs = {
      assignment: {
        gradient: "from-orange-600 to-amber-600",
        secondaryGradient: "from-amber-500 to-orange-600",
        background: "from-orange-50/30 to-amber-100/30",
        textGradient: "from-orange-600 to-amber-600",
        icon: "📋",
        downloadText: "View Assignment"
      },
      note: {
        gradient: "from-blue-600 to-purple-600",
        secondaryGradient: "from-purple-500 to-blue-600",
        background: "from-blue-50/30 to-purple-100/30",
        textGradient: "from-blue-600 to-purple-600",
        icon: "📚",
        downloadText: "Download Notes"
      },
      lecture: {
        gradient: "from-purple-600 to-pink-600",
        secondaryGradient: "from-pink-500 to-purple-600",
        background: "from-purple-50/30 to-pink-100/30",
        textGradient: "from-purple-600 to-pink-600",
        icon: "🎥",
        downloadText: "Watch Lecture"
      },
      test: {
        gradient: "from-green-600 to-teal-600",
        secondaryGradient: "from-teal-500 to-green-600",
        background: "from-green-50/30 to-teal-100/30",
        textGradient: "from-green-600 to-teal-600",
        icon: "📝",
        downloadText: "Take Test"
      }
    };
    return configs[contentType] || configs.assignment;
  };

  const theme = getThemeConfig();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatDeadline = (dateString) => {
    const deadline = new Date(dateString);
    const now = new Date();
    const diffTime = deadline - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { text: "Expired", color: "text-red-600" };
    } else if (diffDays === 0) {
      return { text: "Today", color: "text-orange-600" };
    } else if (diffDays === 1) {
      return { text: "Tomorrow", color: "text-yellow-600" };
    } else if (diffDays <= 7) {
      return { text: `${diffDays} days left`, color: "text-yellow-600" };
    } else {
      return { text: `${diffDays} days left`, color: "text-green-600" };
    }
  };

  const handleContentAccess = () => {
    if (contentType === 'test' && content.testUrl) {
      window.open(content.testUrl, '_blank', 'noopener,noreferrer');
    } else if ((contentType === 'note' || contentType === 'lecture') && (content.fileUrl || content.filePath)) {
      window.open(content.fileUrl || content.filePath, '_blank', 'noopener,noreferrer');
    }
  };

  const cardVariants = {
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
        delay: index * 0.1,
        duration: 0.6
      }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2 + (index * 0.1),
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { type: "spring", damping: 20, stiffness: 300 }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.05, 
      boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
      transition: { type: "spring", damping: 15, stiffness: 400 }
    },
    tap: { scale: 0.95 }
  };

  const deadline = content.deadline ? formatDeadline(content.deadline) : null;

  return (
    <motion.div 
      className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl p-6 space-y-4 border border-white/20 relative overflow-hidden"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
        transition: { type: "spring", damping: 20, stiffness: 400 }
      }}
      style={{ perspective: "1000px" }}
    >
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

      <motion.div variants={contentVariants} initial="hidden" animate="visible" className="relative z-10">
        {/* Header with Icon and Title */}
        <motion.div className="flex items-start space-x-3 mb-4" variants={itemVariants}>
          <motion.div 
            className="text-3xl"
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            {theme.icon}
          </motion.div>
          <div className="flex-1 min-w-0">
            <motion.h5 
              className={`text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${theme.textGradient} leading-tight`}
              variants={itemVariants}
            >
              {content.title}
            </motion.h5>
            <motion.p 
              className="text-sm text-gray-600 capitalize font-medium"
              variants={itemVariants}
            >
              {contentType}
            </motion.p>
          </div>
        </motion.div>

        {/* Description */}
        <motion.div className="mb-4" variants={itemVariants}>
          <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
            {content.description}
          </p>
        </motion.div>

        {/* Metadata */}
        <motion.div className="space-y-2 mb-4" variants={contentVariants}>
          <motion.div className="flex justify-between items-center" variants={itemVariants}>
            <span className="text-xs text-gray-600 font-medium">Label:</span>
            <motion.span
              className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${theme.gradient} text-white`}
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", damping: 20, stiffness: 400 }}
            >
              {content.label}
            </motion.span>
          </motion.div>
          
          <motion.div className="flex justify-between items-center" variants={itemVariants}>
            <span className="text-xs text-gray-600 font-medium">Created:</span>
            <span className="text-xs text-gray-700">
              {formatDate(content.createdAt)}
            </span>
          </motion.div>

          {/* Deadline for assignments and tests */}
          {deadline && (
            <motion.div className="flex justify-between items-center" variants={itemVariants}>
              <span className="text-xs text-gray-600 font-medium">Deadline:</span>
              <motion.span
                className={`text-xs font-semibold ${deadline.color}`}
                animate={{ scale: deadline.text === "Today" ? [1, 1.1, 1] : 1 }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {deadline.text}
              </motion.span>
            </motion.div>
          )}
        </motion.div>

        {/* Action Button */}
        <motion.div className="flex space-x-2 mt-4" variants={itemVariants}>
          {contentType === 'assignment' ? (
            <motion.div
              className={`flex-grow text-center py-3 bg-gradient-to-r ${theme.secondaryGradient} text-white rounded-xl font-medium shadow-lg border border-white/20 backdrop-blur-sm relative overflow-hidden`}
            >
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
              <span className="relative z-10 flex items-center justify-center space-x-2">
                <span>{theme.downloadText}</span>
              </span>
            </motion.div>
          ) : (
            <motion.button
              onClick={handleContentAccess}
              className={`flex-grow text-center py-3 bg-gradient-to-r ${theme.secondaryGradient} text-white rounded-xl font-medium shadow-lg border border-white/20 backdrop-blur-sm relative overflow-hidden`}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
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
              <span className="relative z-10 flex items-center justify-center space-x-2">
                <span>{theme.downloadText}</span>
                <motion.span
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </span>
            </motion.button>
          )}
        </motion.div>

        {/* Additional Info */}
        <motion.div 
          className="pt-3 border-t border-white/20"
          variants={itemVariants}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              Created by: <span className="font-medium text-gray-700">{content.admin}</span>
            </span>
            <motion.div
              className={`w-2 h-2 rounded-full bg-gradient-to-r ${theme.gradient}`}
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

ContentCard.propTypes = {
  content: PropTypes.shape({
    _id: PropTypes.string,
    id: PropTypes.string,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    admin: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    deadline: PropTypes.string,
    fileUrl: PropTypes.string,
    filePath: PropTypes.string,
    testUrl: PropTypes.string,
  }).isRequired,
  contentType: PropTypes.oneOf(['assignment', 'note', 'lecture', 'test']).isRequired,
  index: PropTypes.number,
};

export default ContentCard;