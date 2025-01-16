import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FeedbackForm from './FeedbackForm'; 

const AssignmentCard = ({ assignment, onAccept, onReject, onOverturn, onFeedbackClick, onAppealSubmit }) => {
    const [showAppealModal, setShowAppealModal] = useState(false);
    const [appealSubject, setAppealSubject] = useState('');
    const [appealDescription, setAppealDescription] = useState('');
    const [showFeedbackModal, setShowFeedbackModal] = useState(false); 

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
                {assignment.task}
            </h5>

            <div className="space-y-2">
                <p className="text-gray-700">
                    <strong className="text-gray-900">User:</strong> {assignment.userName}
                </p>
                <p className="text-gray-700">
                    <strong className="text-gray-900">Assigned Admin:</strong> {assignment.adminName}
                </p>
                <p className="text-gray-700">
                    <strong className="text-gray-900">Status:</strong>{' '}
                    <span className={`inline-block px-2 py-1 rounded-full text-sm font-semibold ${getStatusBadge(assignment.status)}`}>
                        {assignment.status}
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
                    href={`/${assignment.filePath}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex-grow text-center py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                    Download Task
                </a>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4">
                {onAccept && (
                    <button
                        className="py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        onClick={() => onAccept(assignment._id || assignment.id)}
                    >
                        Accept
                    </button>
                )}
                {onReject && (
                    <button
                        className="py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        onClick={() => onReject(assignment._id || assignment.id)}
                    >
                        Reject
                    </button>
                )}
                {onOverturn && (
                    <button
                        className="py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                        onClick={() =>
                            onOverturn(assignment._id || assignment.id, assignment.status === 'Accepted' ? 'Rejected' : 'Accepted')
                        }
                    >
                        {assignment.status === 'Accepted' ? 'Overturn' : 'Restore'}
                    </button>
                )}
                {onFeedbackClick && (
                    <button
                        className="col-span-full py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                        onClick={() => setShowFeedbackModal(true)} // Open Feedback Modal
                    >
                        Provide Feedback
                    </button>
                )}
                {assignment.status === 'Rejected' && (
                    <button
                        className="col-span-full py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                        onClick={() => setShowAppealModal(true)}
                    >
                        Appeal to HOD
                    </button>
                )}
            </div>

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
                                onClick={handleAppealSubmit}
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
        task: PropTypes.string.isRequired,
        userName: PropTypes.string.isRequired,
        adminName: PropTypes.string.isRequired, 
        createdAt: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
        overturnedBy: PropTypes.string,
    }),
    onAccept: PropTypes.func,
    onReject: PropTypes.func,
    onOverturn: PropTypes.func,
    onFeedbackClick: PropTypes.func.isRequired, // Ensure it's passed
    onAppealSubmit: PropTypes.func.isRequired,
};

export default AssignmentCard;
