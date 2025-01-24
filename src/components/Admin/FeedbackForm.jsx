import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const FeedbackForm = ({ assignmentId, onClose, role }) => {
    const [feedback, setFeedback] = useState('');
    const [existingFeedback, setExistingFeedback] = useState([]);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchFeedback = async () => {
            if (!assignmentId) {
                setError('Invalid assignment ID.');
                return;
            }


            try {
                console.log('Fetching feedback for assignment ID:', assignmentId);
                
                const response = await axios.get(
                    `http://localhost:5000/api/admins/feedback/${assignmentId}`,
                   
                );
                console.log('Fetched feedback:', response.data.feedback);
                setExistingFeedback(response.data.feedback || []);
            } catch (err) {
                console.error('Error fetching feedback:', err.message || err);
                setError('Failed to load feedback.');
            }
        };

        fetchFeedback();
    }, [assignmentId]);

    const handleFeedbackChange = (e) => {
        setFeedback(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const token = localStorage.getItem('adminToken');
            console.log('Assignment ID:', assignmentId);
            if (!assignmentId) {
                throw new Error('Assignment ID is missing.');
            }

            const route =
                role === 'Head'
                    ? `admins/feedback/head/${assignmentId}`
                    : `admins/feedback/admin/${assignmentId}`;
                    console.log('Generated Route:', route);

            await axios.put(`http://localhost:5000/api/${route}`, { feedback }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
           });
            setSuccess(true);
            setFeedback('');

            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err) {
            console.error('Error submitting feedback:', err.message || err);
            setError('Failed to submit feedback. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 space-y-6 transform transition-all hover:scale-105 duration-300">
                <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-4">
                    Feedback Details
                </h2>

                {/* Success Message */}
                {success && (
                    <div className="bg-green-50 border border-green-300 text-green-600 p-3 rounded-lg text-center">
                        Feedback submitted successfully!
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-300 text-red-600 p-3 rounded-lg text-center">
                        {error}
                    </div>
                )}

                {/* Existing Feedback Section */}
             <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Previous Feedback</h3>
                    {Object.keys(existingFeedback).length > 0 ? (
                    <div className="max-h-40 overflow-y-auto border rounded-lg p-3">
                       {Object.entries(existingFeedback)
                        .filter(([key, value]) => value) 
                        .map(([key, value], index) => (
                         <div key={index} className="border-b last:border-b-0 py-2">
                           <p className="text-gray-700">
                            <span className="font-medium text-gray-900">
                                {key === 'adminFeedback' ? 'Admin' : 'Head'}:
                            </span>{' '}
                            {value}
                         </p>
                     </div>
                     ))} 
              </div>
                   ) : (
                 <p className="text-gray-500 text-center">No previous feedback</p>
                  )}
                </div>

                {/* New Feedback Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="feedback" className="block text-gray-700 mb-2">
                            Your Feedback
                        </label>
                        <textarea
                            id="feedback"
                            value={feedback}
                            onChange={handleFeedbackChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            rows="4"
                            placeholder="Provide your detailed feedback here..."
                            required
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center"
                        >
                            {loading ? (
                                <svg
                                    className="animate-spin h-5 w-5 text-white"
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
                            ) : (
                                'Submit Feedback'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

FeedbackForm.propTypes = {
    assignmentId: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    role: PropTypes.string.isRequired,
};

export default FeedbackForm;
