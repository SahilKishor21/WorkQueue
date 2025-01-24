import React, { useState, useEffect } from 'react';
import UploadAssignment from './UploadAssignment';
import AssignmentList from '../Admin/AssignmentList';
import UserAssignmentsByLabel from './UserAssignmentsByLabel'; 
import axios from 'axios';
import DashboardLayout from '../dashboard/DashboardLayout';
import DashboardNav from '../dashboard/DashboardNav';

const UserDashboard = () => {
    const [activeTab, setActiveTab] = useState('upload');
    const [previousSubmissions, setPreviousSubmissions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const tabs = [
        { id: 'upload', label: 'Upload Assignment' },
        { id: 'submissions', label: 'Previous Submissions' },
        { id: 'new-assignments', label: 'New Assignments Assigned' }, 
    ];

    const fetchPreviousSubmissions = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('userToken');
            const response = await axios.get('http://localhost:5000/api/users/submissions', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPreviousSubmissions(response.data.submissions || []);
            setError(null);
        } catch (err) {
            console.error('Error fetching submissions:', err);
            setError('Failed to fetch previous submissions. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'submissions') {
            fetchPreviousSubmissions();
        }
    }, [activeTab]);

    return (
        <DashboardLayout title="User Dashboard" error={error}>
            <div className="space-y-8">
                <DashboardNav 
                    tabs={tabs} 
                    activeTab={activeTab} 
                    onTabChange={setActiveTab} 
                />

                <div className="bg-white rounded-xl shadow-md min-h-[600px]">
                    {loading ? (
                        <div className="flex justify-center items-center h-[600px]">
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
                    ) : (
                        <div className="p-6">
                            {activeTab === 'upload' && <UploadAssignment onUploadSuccess={() => setActiveTab('submissions')} />}
                            {activeTab === 'submissions' && <AssignmentList assignments={previousSubmissions} />}
                            {activeTab === 'new-assignments' && <UserAssignmentsByLabel />} {/* Render new assignments */}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default UserDashboard;
