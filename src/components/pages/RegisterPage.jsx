import React, { useState } from 'react';
import axios from 'axios';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
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
            const data = { name, email, password, label };
            if (role === 'User') data.label = label; 

            await axios.post(`http://localhost:5000/api/${role.toLowerCase()}s/register`, data);

            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            setError(error.response?.data?.message || 'Signup failed.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center overflow-hidden relative">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 space-y-6 transform transition-all hover:scale-105 duration-300">
                <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                    Create an Account
                </h2>

                {success && (
                    <div className="bg-green-50 border border-green-300 text-green-600 p-3 rounded-lg text-center">
                        Account created successfully! Redirecting to login...
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-300 text-red-600 p-3 rounded-lg text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSignup} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-gray-700 mb-2">Name</label>
                        <input 
                            type="text" 
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required 
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
                        <input 
                            type="email" 
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required 
                        />
                    </div>

                    <div>
                        <label htmlFor="role" className="block text-gray-700 mb-2">Role</label>
                        <select 
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="User">User</option>
                            <option value="Admin">Admin</option>
                            <option value="Head">Head</option>
                        </select>
                    </div>

                    {role === 'User' && (
                        <div>
                            <label htmlFor="label" className="block text-gray-700 mb-2">Label</label>
                            <input 
                                type="text" 
                                id="label"
                                value={label}
                                onChange={(e) => setLabel(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required 
                            />
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity duration-300 flex items-center justify-center"
                    >
                        {isLoading ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            'Sign Up'
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
                        Already have an account? <a href="/login" className="text-purple-600 hover:underline">Log In</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
