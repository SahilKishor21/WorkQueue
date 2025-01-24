import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserAssignmentsByLabel = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAssignments = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('userToken'); 
            const response = await axios.get('http://localhost:5000/api/users/admin-assignments', {
                headers: { Authorization: `Bearer ${token}` }, 
            });
            console.log(response.data);

            setAssignments(response.data.assignments);
            setError(null);
        } catch (err) {
            console.error('Error fetching assignments:', err);
            setError(err.response?.data?.message || 'Failed to fetch assignments.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssignments();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <h1 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-8">
                Assignments for Your Label
            </h1>

            {loading ? (
                <div className="flex justify-center items-center h-96">
                    <svg
                        className="animate-spin h-12 w-12 text-purple-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-300 text-red-600 p-4 rounded-lg text-center">
                    {error}
                </div>
            ) : (
                <div className="space-y-4">
                    {assignments.map((assignment) => (
                        <div
                            key={assignment._id}
                            className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-all"
                        >
                            <h2 className="text-xl font-bold text-gray-800">{assignment.title}</h2>
                            <p className="text-gray-600 mt-2">
                                <strong>Description:</strong> {assignment.description}
                            </p>
                            <p className="text-gray-600 mt-2">
                                <strong>Assigned By:</strong> {assignment.admin}
                            </p>
                            <p className="text-gray-600 mt-2">
                                <strong>Deadline:</strong> {new Date(assignment.deadline).toLocaleDateString()}
                            </p>
                            <p className="text-gray-600 mt-2">
                                <strong>Created At:</strong> {new Date(assignment.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserAssignmentsByLabel;
