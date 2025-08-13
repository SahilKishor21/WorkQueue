import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ProfileDropdown = ({ showProfile, setShowProfile, theme, userRole }) => {
    const [activeTab, setActiveTab] = useState('profile');
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    // Label management states (only for users)
    const [newLabel, setNewLabel] = useState('');
    const [labels, setLabels] = useState([]);

    // Get API base URL based on user role
    const getApiBaseUrl = () => {
        const backendURL = 'https://workqueue-backend.onrender.com';
        if (userRole === 'user') {
            return `${backendURL}/api/users`;
        } else {
            return `${backendURL}/api/admins`;
        }
    };

    // Get token
    const getAuthToken = () => {
        let token = null;
        
        if (userRole === 'user') {
            token = localStorage.getItem('userToken');
        } else if (userRole === 'admin') {
            token = localStorage.getItem('adminToken');
        } else if (userRole === 'hod') {
            token = localStorage.getItem('headToken');
        }
        
        console.log('=== TOKEN DEBUG ===');
        console.log('User role:', userRole);
        console.log('Token found:', token ? 'Yes' : 'No');
        console.log('==================');
        
        return token;
    };

    // Enhanced profile loading with comprehensive label handling for users
    const loadProfile = async () => {
        try {
            setLoading(true);
            setMessage('');
            
            const token = getAuthToken();
            
            if (!token) {
                setMessage('No authentication token found. Please login again.');
                console.error('No token found');
                return;
            }

            const apiUrl = `${getApiBaseUrl()}/profile`;
            console.log('=== MAKING API CALL ===');
            console.log('URL:', apiUrl);

            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('=== API RESPONSE ===');
            console.log('Status:', response.status);

            const responseText = await response.text();
            
            if (response.ok) {
                try {
                    const data = JSON.parse(responseText);
                    console.log('=== PARSED PROFILE DATA ===');
                    console.log('Complete API response:', data);
                    console.log('Profile object:', data.profile);
                    
                    if (data.profile) {
                        setUserProfile(data.profile);
                        
                        // Handle labels only for users
                        if (userRole === 'user') {
                            let finalLabels = [];
                            
                            // Get labels from the labels array (new format)
                            if (data.profile.labels && Array.isArray(data.profile.labels)) {
                                finalLabels = [...data.profile.labels];
                                console.log('Found labels array:', finalLabels);
                            }
                            
                            // Get label from single label field (old format) - for backward compatibility
                            if (data.profile.label && !finalLabels.includes(data.profile.label)) {
                                finalLabels.push(data.profile.label);
                                console.log('Added single label:', data.profile.label);
                            }
                            
                            // Remove duplicates and empty values
                            finalLabels = [...new Set(finalLabels.filter(label => label && label.trim()))];
                            
                            console.log('=== FINAL LABELS PROCESSING ===');
                            console.log('Final labels after processing:', finalLabels);
                            console.log('Final labels count:', finalLabels.length);
                            
                            setLabels(finalLabels);
                        }
                        
                        setMessage('');
                        console.log('✅ Profile loaded successfully');
                    } else {
                        setMessage('No profile data in server response');
                        console.error('Response missing profile property:', data);
                    }
                } catch (parseError) {
                    console.error('JSON parse error:', parseError);
                    setMessage(`JSON parse error: ${parseError.message}`);
                }
            } else {
                console.error('❌ API Error - Status:', response.status);
                setMessage(`API Error (${response.status})`);
            }
        } catch (error) {
            console.error('❌ Network/Fetch error:', error);
            setMessage(`Network error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Enhanced add label function (only for users)
    const addLabel = async () => {
        if (userRole !== 'user') return;
        
        if (!newLabel.trim()) {
            setMessage('Please enter a valid label');
            return;
        }

        try {
            setLoading(true);
            const token = getAuthToken();
            
            if (!token) {
                setMessage('Authentication required. Please login again.');
                return;
            }

            console.log('Adding label:', newLabel.trim());

            const response = await fetch(`${getApiBaseUrl()}/labels/add`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ label: newLabel.trim() })
            });

            const responseText = await response.text();
            console.log('Add label response:', responseText);

            if (response.ok) {
                try {
                    const data = JSON.parse(responseText);
                    console.log('=== ADD LABEL SUCCESS ===');
                    console.log('New labels from API:', data.labels);
                    
                    // Update labels in state immediately
                    if (data.labels && Array.isArray(data.labels)) {
                        setLabels(data.labels);
                        console.log('Updated labels state to:', data.labels);
                    }
                    
                    setNewLabel('');
                    setMessage('Label added successfully');
                    
                    // Update token in localStorage if provided
                    if (data.token && userRole === 'user') {
                        console.log('Updating localStorage with new token');
                        localStorage.setItem('userToken', data.token);
                    }
                    
                    // Reload profile to ensure everything is in sync
                    setTimeout(() => {
                        console.log('Reloading profile after label add...');
                        loadProfile();
                    }, 1000);
                    
                } catch (parseError) {
                    console.error('Error parsing add label response:', parseError);
                    setMessage('Error parsing add label response');
                }
            } else {
                try {
                    const errorData = JSON.parse(responseText);
                    setMessage(errorData.message || 'Failed to add label');
                } catch (e) {
                    setMessage(`Failed to add label (${response.status})`);
                }
            }
        } catch (error) {
            console.error('Error adding label:', error);
            setMessage('Network error while adding label');
        } finally {
            setLoading(false);
        }
    };

    // Enhanced remove label function (only for users)
    const removeLabel = async (labelToRemove) => {
        if (userRole !== 'user') return;
        
        try {
            setLoading(true);
            const token = getAuthToken();
            
            if (!token) {
                setMessage('Authentication required. Please login again.');
                return;
            }

            console.log('Removing label:', labelToRemove);

            const response = await fetch(`${getApiBaseUrl()}/labels/remove`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ label: labelToRemove })
            });

            const responseText = await response.text();
            console.log('Remove label response:', responseText);

            if (response.ok) {
                try {
                    const data = JSON.parse(responseText);
                    console.log('=== REMOVE LABEL SUCCESS ===');
                    console.log('Updated labels from API:', data.labels);
                    
                    // Update labels in state immediately
                    if (data.labels && Array.isArray(data.labels)) {
                        setLabels(data.labels);
                        console.log('Updated labels state to:', data.labels);
                    }
                    
                    setMessage('Label removed successfully');
                    
                    // Update token in localStorage if provided
                    if (data.token && userRole === 'user') {
                        console.log('Updating localStorage with new token');
                        localStorage.setItem('userToken', data.token);
                    }
                    
                    // Reload profile to ensure everything is in sync
                    setTimeout(() => {
                        console.log('Reloading profile after label remove...');
                        loadProfile();
                    }, 1000);
                    
                } catch (parseError) {
                    console.error('Error parsing remove label response:', parseError);
                    setMessage('Error parsing remove label response');
                }
            } else {
                try {
                    const errorData = JSON.parse(responseText);
                    setMessage(errorData.message || 'Failed to remove label');
                } catch (e) {
                    setMessage(`Failed to remove label (${response.status})`);
                }
            }
        } catch (error) {
            console.error('Error removing label:', error);
            setMessage('Network error while removing label');
        } finally {
            setLoading(false);
        }
    };

    // Handle forgot password redirect
    const handleForgotPassword = () => {
        setShowProfile(false);
        navigate('/forgot-password', { state: { userType: userRole } });
    };

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('headToken');
        localStorage.removeItem('token');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        navigate('/login');
    };

    // Load profile when dropdown opens
    useEffect(() => {
        if (showProfile) {
            console.log('=== PROFILE DROPDOWN OPENED ===');
            console.log('User role:', userRole);
            console.log('Current labels state:', labels);
            
            if (!userProfile) {
                console.log('Loading profile...');
                loadProfile();
            } else {
                console.log('Profile already loaded, current labels:', labels);
            }
        }
    }, [showProfile]);

    // Debug effect to monitor labels state changes (only for users)
    useEffect(() => {
        if (userRole === 'user') {
            console.log('=== LABELS STATE CHANGED ===');
            console.log('New labels state:', labels);
            console.log('Labels count:', labels?.length || 0);
            console.log('========================');
        }
    }, [labels]);

    // Clear message after 5 seconds
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    if (!showProfile) return null;

    // Dynamic tabs based on user role
    const tabs = [
        { id: 'profile', label: 'Profile', icon: '👤' },
        { id: 'security', label: 'Security', icon: '🔒' },
        ...(userRole === 'user' ? [{ id: 'labels', label: 'Labels', icon: '🏷️' }] : [])
    ];

    return (
        <AnimatePresence>
            <motion.div
                className="absolute right-0 top-12 w-96 bg-white/20 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 z-50 overflow-hidden"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
            >
                {/* Header */}
                <div className={`bg-gradient-to-r ${theme.primary} p-4 text-white`}>
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold">
                            {userRole === 'admin' ? 'Admin Profile Settings' : 
                             userRole === 'hod' ? 'HOD Profile Settings' : 'Profile Settings'}
                        </h3>
                        <motion.button
                            onClick={() => setShowProfile(false)}
                            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            ✕
                        </motion.button>
                    </div>
                </div>

                {/* Message */}
                <AnimatePresence>
                    {message && (
                        <motion.div
                            className={`mx-4 mt-4 p-3 rounded-lg text-sm font-medium ${
                                message.includes('successfully') 
                                    ? 'bg-green-100 text-green-700 border border-green-200' 
                                    : 'bg-red-100 text-red-700 border border-red-200'
                            }`}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            {message}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Tabs */}
                <div className="flex border-b border-white/20">
                    {tabs.map((tab) => (
                        <motion.button
                            key={tab.id}
                            className={`flex-1 px-4 py-3 text-sm font-medium transition-all ${
                                activeTab === tab.id
                                    ? `text-${theme.accent}-600 border-b-2 border-${theme.accent}-500 bg-white/10`
                                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/5'
                            }`}
                            onClick={() => setActiveTab(tab.id)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <span className="hidden sm:inline">{tab.label}</span>
                            </div>
                        </motion.button>
                    ))}
                </div>

                {/* Content */}
                <div className="p-4 max-h-96 overflow-y-auto">
                    {loading && (
                        <div className="flex justify-center py-8">
                            <motion.div
                                className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                        </div>
                    )}

                    {/* Profile Tab */}
                    {activeTab === 'profile' && !loading && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            {userProfile ? (
                                <div className="space-y-4">
                                    <div className="bg-white/30 rounded-lg p-4 space-y-3">
                                        <h4 className="text-lg font-semibold text-gray-800 mb-3">
                                            {userRole === 'admin' ? 'Admin Information' : 
                                             userRole === 'hod' ? 'HOD Information' : 'Account Information'}
                                        </h4>
                                        
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium text-gray-600">Name:</span>
                                                <span className="text-sm font-semibold text-gray-800">{userProfile.name}</span>
                                            </div>
                                            
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium text-gray-600">Email:</span>
                                                <span className="text-sm font-semibold text-gray-800">{userProfile.email || 'Not available'}</span>
                                            </div>
                                            
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium text-gray-600">Role:</span>
                                                <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                                                    userRole === 'user' ? 'bg-green-100 text-green-700' :
                                                    userRole === 'admin' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                    {userRole === 'user' ? 'Student' : userRole === 'hod' ? 'HOD' : 'Admin'}
                                                </span>
                                            </div>

                                            {/* Admin-specific fields */}
                                            {(userRole === 'admin' || userRole === 'hod') && userProfile.department && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-medium text-gray-600">Department:</span>
                                                    <span className="text-sm font-semibold text-gray-800">{userProfile.department}</span>
                                                </div>
                                            )}

                                            {/* Admin permissions */}
                                            {(userRole === 'admin' || userRole === 'hod') && userProfile.permissions && userProfile.permissions.length > 0 && (
                                                <div>
                                                    <span className="text-sm font-medium text-gray-600 block mb-2">
                                                        Permissions ({userProfile.permissions.length}):
                                                    </span>
                                                    <div className="flex flex-wrap gap-1">
                                                        {userProfile.permissions.map((permission, index) => (
                                                            <span
                                                                key={index}
                                                                className={`px-2 py-1 text-xs bg-gradient-to-r ${theme.secondary} text-white rounded-full`}
                                                                title={permission}
                                                            >
                                                                {permission}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {userProfile.createdAt && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-medium text-gray-600">Member Since:</span>
                                                    <span className="text-sm font-semibold text-gray-800">
                                                        {new Date(userProfile.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            )}
                                            
                                            {userProfile.lastLogin && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-medium text-gray-600">Last Login:</span>
                                                    <span className="text-sm font-semibold text-gray-800">
                                                        {new Date(userProfile.lastLogin).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            )}
                                            
                                            {/* Enhanced Labels Display - Only for Users */}
                                            {userRole === 'user' && labels && labels.length > 0 && (
                                                <div>
                                                    <span className="text-sm font-medium text-gray-600 block mb-2">
                                                        Current Labels ({labels.length}):
                                                    </span>
                                                    <div className="flex flex-wrap gap-1">
                                                        {labels.map((label, index) => (
                                                            <span
                                                                key={index}
                                                                className={`px-2 py-1 text-xs bg-gradient-to-r ${theme.secondary} text-white rounded-full`}
                                                                title={label}
                                                            >
                                                                {label}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {/* Show when no labels - Only for Users */}
                                            {userRole === 'user' && (!labels || labels.length === 0) && (
                                                <div>
                                                    <span className="text-sm font-medium text-gray-600 block mb-2">Current Labels:</span>
                                                    <span className="text-xs text-gray-500 italic">No labels assigned yet</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="text-gray-500 mb-4">No profile data available</div>
                                    <motion.button
                                        onClick={loadProfile}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Load Profile
                                    </motion.button>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && !loading && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <div className="space-y-4">
                                <div className="bg-white/30 rounded-lg p-4">
                                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Security Options</h4>
                                    
                                    <div className="space-y-3">
                                        <motion.button
                                            onClick={handleForgotPassword}
                                            className={`w-full py-3 px-4 bg-gradient-to-r ${theme.primary} text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2`}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                             Reset Password
                                        </motion.button>
                                        
                                        <motion.button
                                            onClick={handleLogout}
                                            className="w-full py-3 px-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                             Logout
                                        </motion.button>
                                    </div>
                                </div>
                                
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                    <p className="text-xs text-yellow-800">
                                        <strong>Security Tip:</strong> Reset your password if you suspect unauthorized access to your account.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Labels Tab - Only for Users */}
                    {activeTab === 'labels' && userRole === 'user' && !loading && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-700 mb-3">
                                        Current Labels ({labels?.length || 0})
                                    </h4>
                                    {labels && labels.length > 0 ? (
                                        <div className="space-y-2">
                                            {labels.map((label, index) => (
                                                <motion.div
                                                    key={`${label}-${index}`}
                                                    className="flex items-center justify-between bg-white/30 rounded-lg p-2"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                >
                                                    <span className={`px-2 py-1 text-xs bg-gradient-to-r ${theme.secondary} text-white rounded-full`}>
                                                        {label}
                                                    </span>
                                                    <motion.button
                                                        onClick={() => removeLabel(label)}
                                                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                    >
                                                        Remove
                                                    </motion.button>
                                                </motion.div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500 italic">No labels assigned yet</p>
                                    )}
                                </div>

                                <div>
                                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Add New Label</h4>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newLabel}
                                            onChange={(e) => setNewLabel(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && addLabel()}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50 backdrop-blur-sm text-sm"
                                            placeholder="Enter new label"
                                        />
                                        <motion.button
                                            onClick={addLabel}
                                            className={`px-4 py-2 bg-gradient-to-r ${theme.primary} text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity`}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            disabled={loading || !newLabel.trim()}
                                        >
                                            Add
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ProfileDropdown;