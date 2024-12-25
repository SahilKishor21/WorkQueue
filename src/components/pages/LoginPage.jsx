import React, { useState } from 'react';
import axios from 'axios';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Function to handle dashboard redirects based on role
    const handleRedirect = (role) => {
        const redirectPaths = {
            user: '/user/dashboard',
            admin: '/admin/dashboard',
            head: '/head/dashboard'
        };

        const path = redirectPaths[role.toLowerCase()];
        if (path) {
            navigate(path);
        } else {
            console.error('Invalid role for redirect');
            setError('Invalid role specified');
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
    
        try {
            const rolePath = role.toLowerCase();
            const response = await axios.post(`http://localhost:5000/api/${rolePath}s/login`, { 
                email, 
                password
            });
            
            console.log('Login response:', response.data);
            // Store token with role-specific key
            localStorage.setItem(`${rolePath}Token`, response.data.token);
            // Store role for future reference
            localStorage.setItem('userRole', rolePath);
            console.log(`${role} login successful`);
            
            if(onLoginSuccess) {
                onLoginSuccess(response.data);
            }

            // Redirect to the appropriate dashboard
            handleRedirect(role);
            
        } catch (error) {
            console.error('Full error object:', error);
            console.error('Error name:', error.name);
            console.error('Error message:', error.message);
            
            if (error.response) {
                console.error('Error response data:', error.response.data);
                console.error('Error response status:', error.response.status);
                console.error('Error response headers:', error.response.headers);
                
                setError(error.response.data?.msg || 'Login failed. Please try again.');
            } else if (error.request) {
                console.error('No response received:', error.request);
                setError('No response from server. Please check your network connection.');
            } else {
                console.error('Error setting up request:', error.message);
                setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center overflow-hidden relative">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 space-y-6 transform transition-all hover:scale-105 duration-300">
                <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    Welcome Back
                </h2>
                
                {error && (
                    <div className="bg-red-50 border border-red-300 text-red-600 p-3 rounded-lg text-center">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
                        <input 
                            type="email" 
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required 
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
                        <input 
                            type="password" 
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required 
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="role" className="block text-gray-700 mb-2">Role</label>
                        <select 
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                            <option value="head">Head</option>
                        </select>
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity duration-300 flex items-center justify-center"
                    >
                        {isLoading ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            'Login'
                        )}
                    </button>
                </form>
                
                <div className="text-center">
                    <div className="flex items-center justify-center space-x-4 mt-4">
                        <a 
                            href={'http://localhost:5000/auth/google'} 
                            className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-colors duration-300"
                        >
                            <FaGoogle size={20} />
                        </a>
                        <a 
                            href={'http://localhost:5000/auth/github'} 
                            className="bg-gray-800 text-white p-3 rounded-full hover:bg-gray-900 transition-colors duration-300"
                        >
                            <FaGithub size={20} />
                        </a>
                    </div>
                    <p className="text-gray-600 mt-4">
                        Don't have an account? <a href="/register" className="text-blue-600 hover:underline">Sign Up</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;