import React, { useState } from 'react';
import axios from 'axios';

const UploadAssignment = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [label, setLabel] = useState('');
    const [deadline, setDeadline] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('adminToken');
            console.log(localStorage.getItem('adminToken')); 

            const response = await axios.post(
                'http://localhost:5000/api/admins/assignments/upload',
                {
                    title,
                    description,
                    label,
                    deadline,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`, 
                    },
                }
            );

            alert(response.data.message); 
            
            
            setTitle('');
            setDescription('');
            setLabel('');
            setDeadline('');
        } catch (error) {
            console.error('Error uploading assignment:', error.response?.data?.message);
            alert(error.response?.data?.message || 'Failed to upload assignment.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center overflow-hidden relative">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 space-y-6 transform transition-all hover:scale-105 duration-300">
                <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                    Upload Assignment
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-gray-700 mb-2">Title</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-gray-700 mb-2">Description</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                        ></textarea>
                    </div>

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

                    <div>
                        <label htmlFor="deadline" className="block text-gray-700 mb-2">Deadline</label>
                        <input
                            type="date"
                            id="deadline"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity duration-300 flex items-center justify-center"
                    >
                        Upload Assignment
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UploadAssignment;
