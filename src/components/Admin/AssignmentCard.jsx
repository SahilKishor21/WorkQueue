import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import FeedbackForm from './FeedbackForm';

const AssignmentCard = ({ assignment, onFeedbackClick, }) => {
    const [showAppealModal, setShowAppealModal] = useState(false);
    const [appealSubject, setAppealSubject] = useState('');
    const [appealDescription, setAppealDescription] = useState('');
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [status, setStatus] = useState(assignment.status);

    let isAdmin = false;
    let isUser = false;
    let isHOD = false;
    try {
        const token = localStorage.getItem('adminToken');
        if (token) {
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            const role = localStorage.getItem('userRole');
            console.log('Role:', role);
            isAdmin = role === 'admin' ? true : false;
            isUser = role === 'user' ? true : false;
            isHOD = role === 'hod' ? true : false;
        }
    } catch (error) {
        console.error('Error decoding token:', error);
    }

    const onAccept = async (assignmentId) => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.patch(
                `http://localhost:5000/api/assignments/${assignmentId}/accept`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setStatus('Accepted');
            console.log('Assignment accepted:', response.data);
        } catch (error) {
            console.error('Error accepting assignment:', error.response?.data?.message || error.message);
        }
    };

    const onReject = async (assignmentId) => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.patch(
                `http://localhost:5000/api/assignments/${assignmentId}/reject`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setStatus('Rejected');
            console.log('Assignment rejected:', response.data);
        } catch (error) {
            console.error('Error rejecting assignment:', error.response?.data?.message || error.message);
        }
    };

    const onOverturn = async (assignmentId, newStatus) => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.patch(
                `http://localhost:5000/api/assignments/${assignmentId}/overturn`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setStatus(newStatus);
            console.log('Assignment status overturned:', response.data);
        } catch (error) {
            console.error('Error overturning assignment:', error.response?.data?.message || error.message);
        }
    };

    const onAppealSubmit = async () => {
        try {
            const token = localStorage.getItem('userToken');
            const assignmentId = assignment._id || assignment.id;
            console.log('Assignment ID:', assignmentId);
            const appealData = {
                subject: appealSubject,
                description: appealDescription,
            };

            const response = await axios.post(
                `http://localhost:5000/api/users/${assignmentId}/appeal`,
                appealData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log('Appeal submitted successfully:', response.data);
            
            setShowAppealModal(false);
        } catch (error) {
            console.error('Error submitting appeal:', error.response?.data?.message || error.message);
        }
    };

    const handleAppealSubmit = () => {
        const appealData = {
            subject: appealSubject,
            description: appealDescription,
        };
        onAppealSubmit(assignment._id || assignment.id, appealData);
        setAppealSubject('');
        setAppealDescription('');
        setShowAppealModal(false);
    };

    const handleFeedbackSubmit = (feedbackData) => {
        onFeedbackClick(assignment._id || assignment.id, feedbackData);
        setShowFeedbackModal(false);
    };

    return (
        <div className="bg-white rounded-2xl shadow-2xl p-6 space-y-4 hover:shadow-xl transition-all duration-300">
            <h5 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                {assignment.title}
            </h5>

            <div className="space-y-2">
                <p className="text-gray-700">
                    <strong className="text-gray-900">User:</strong> {assignment.user}
                </p>
                <p className="text-gray-700">
                    <strong className="text-gray-900">Assigned Admin:</strong> {assignment.admin}
                </p>
                <p className="text-gray-700">
                    <strong className="text-gray-900">Status:</strong>{' '}
                    <span className={`inline-block px-2 py-1 rounded-full text-sm font-semibold ${getStatusBadge(status)}`}>
                        {status}
                    </span>
                </p>
                <p className="text-gray-700">
                    <strong className="text-gray-900">Submitted At:</strong>{' '}
                    {new Date(assignment.createdAt).toLocaleString()}
                </p>

                {assignment.overturnedBy && (
                    <p className="text-red-600 font-semibold">
                        Overturned By: {assignment.overturnedBy}
                    </p>
                )}
            </div>

            <div className="flex space-x-2 mt-4">
                <a
                    href={`${assignment.filePath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-grow text-center py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                    Download Task
                </a>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
                {isAdmin && (
                    <button
                        className="col-span-full py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                        onClick={() => setShowFeedbackModal(true)}
                    >
                        Provide Feedback
                    </button>
                )}
                {isUser && status === 'Rejected' && (
                    <button
                        className="col-span-full py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                        onClick={() => setShowAppealModal(true)}
                    >
                        Appeal to HOD
                    </button>
                )}
                {isAdmin && (
                    <>
                        <button
                            className="py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors mr-2"
                            onClick={() => onAccept(assignment._id || assignment.id)}
                        >
                            Accept
                        </button>
                        <button
                            className="py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors ml-2"
                            onClick={() => onReject(assignment._id || assignment.id)}
                        >
                            Reject
                        </button>
                    </>
                )}
            </div>
            { isHOD && (
                        <button
                            className="py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors ml-2"
                            onClick={() =>
                                onOverturn(assignment._id || assignment.id, status === 'Accepted' ? 'Rejected' : 'Accepted')
                            }
                        >
                            {status === 'Accepted' ? 'Overturn' : 'Restore'}
                        </button>)}

            {showAppealModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h3 className="text-xl font-bold mb-4 text-gray-800">Appeal to HOD</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Subject</label>
                                <input
                                    type="text"
                                    value={appealSubject}
                                    onChange={(e) => setAppealSubject(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                    placeholder="Enter subject"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    value={appealDescription}
                                    onChange={(e) => setAppealDescription(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                    placeholder="Enter description"
                                ></textarea>
                            </div>
                        </div>
                        <div className="flex justify-end mt-4 space-x-2">
                            <button
                                onClick={() => setShowAppealModal(false)}
                                className="py-2 px-4 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onAppealSubmit}
                                className="py-2 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showFeedbackModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <FeedbackForm
                            assignmentId={assignment._id || assignment.id}
                            onSubmit={handleFeedbackSubmit}
                            onClose={() => setShowFeedbackModal(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

// Function to determine badge color for status
const getStatusBadge = (status) => {
    switch (status) {
        case 'Accepted':
            return 'bg-green-100 text-green-800';
        case 'Rejected':
            return 'bg-red-100 text-red-800';
        case 'Pending':
            return 'bg-yellow-100 text-yellow-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

// PropTypes validation
AssignmentCard.propTypes = {
    assignment: PropTypes.shape({
        id: PropTypes.string,
        _id: PropTypes.string,
        title: PropTypes.string.isRequired,
        admin: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
        overturnedBy: PropTypes.string,
    }),
    onFeedbackClick: PropTypes.func,
    onAppealSubmit: PropTypes.func,
};

export default AssignmentCard;
