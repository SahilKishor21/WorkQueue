import React, { useState } from 'react';
import AssignmentCard from '../Admin/AssignmentCard';
import FeedbackForm from '../Admin/FeedbackForm'; 

const AssignmentList = ({ assignments, handleDecision, handleFeedbackSubmit }) => {
    const [selectedAssignment, setSelectedAssignment] = useState(null);

    const openFeedbackForm = (assignment) => {
        setSelectedAssignment(assignment);
    };

    const closeFeedbackForm = () => {
        setSelectedAssignment(null);
    };

    return (
        <div className="w-full">
            <div className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                    {assignments.length > 0 ? (
                        assignments.map((assignment) => (
                            <div key={assignment._id} className="w-full">
                                <AssignmentCard
                                    assignment={assignment}
                                    handleDecision={handleDecision}
                                    onFeedbackClick={() => openFeedbackForm(assignment)}
                                />
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center text-gray-600 w-full">
                            No assignments found.
                        </div>
                    )}
                </div>

                {selectedAssignment && (
                    <FeedbackForm
                        assignment={selectedAssignment}
                        onClose={closeFeedbackForm}
                        onSubmit={handleFeedbackSubmit}
                    />
                )}
            </div>
        </div>
    );
};

export default AssignmentList;