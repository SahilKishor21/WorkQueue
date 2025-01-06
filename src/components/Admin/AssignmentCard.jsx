import React from 'react';
import PropTypes from 'prop-types';

const AssignmentCard = ({ assignment, onAccept, onReject, onOverturn, onFeedbackClick }) => {
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
                        onClick={() => onFeedbackClick(assignment)}
                    >
                        Provide Feedback
                    </button>
                )}
            </div>
        </div>
    );
};

// function to determine badge color for status
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
    onFeedbackClick: PropTypes.func,
};

export default AssignmentCard;
