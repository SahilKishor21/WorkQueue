import React, { useState } from 'react';
import axios from 'axios';

const UploadAssignment = () => {
    const [assignment, setAssignment] = useState({ title: '', adminName: '' });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAssignment({ ...assignment, [name]: value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);
        setError(null);

        const formData = new FormData();
        formData.append('title', assignment.title);
        formData.append('adminName', assignment.adminName); // Send Admin Name
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:5000/api/assignments/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setSuccess(true);
            setAssignment({ title: '', adminName: '' }); // Reset form
            setFile(null);
        } catch (err) {
            setError('Failed to upload the assignment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center overflow-hidden relative">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 space-y-6 transform transition-all hover:scale-105 duration-300">
                <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                    Upload Assignment
                </h2>
                
                {success && (
                    <div className="bg-green-50 border border-green-300 text-green-600 p-3 rounded-lg text-center">
                        Assignment uploaded successfully!
                    </div>
                )}
                
                {error && (
                    <div className="bg-red-50 border border-red-300 text-red-600 p-3 rounded-lg text-center">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-gray-700 mb-2">Title</label>
                        <input 
                            type="text" 
                            id="title"
                            name="title"
                            value={assignment.title}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required 
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="adminName" className="block text-gray-700 mb-2">Admin Name</label>
                        <input 
                            type="text" 
                            id="adminName"
                            name="adminName"
                            value={assignment.adminName}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required 
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="file" className="block text-gray-700 mb-2">Upload File</label>
                        <input
                            type="file"
                            id="file"
                            accept=".pdf,.ppt,.csv"
                            onChange={handleFileChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required 
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={loading || !file}
                        className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity duration-300 flex items-center justify-center"
                    >
                        {loading ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            'Upload Assignment'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UploadAssignment;
