import React, { useState, useEffect } from 'react';
import AssignmentList from '../Admin/AssignmentList';
import axios from 'axios';
import DashboardLayout from '../dashboard/DashboardLayout';
import DashboardNav from '../dashboard/DashboardNav';

const HeadDashboard = () => {
    const [assignments, setAssignments] = useState([]);
    const [recentAssignments, setRecentAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('latest');

    const tabs = [
        { id: 'latest', label: 'Latest Appeals' },
        { id: 'acceptedRejected', label: 'Accepted/Rejected Assignments' }
    ];

    const fetchAssignments = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('headToken');
            console.log('Head Token:', token);
            
            // API call to fetch assignments
            const response = await axios.get('http://localhost:5000/api/heads/assignments', {
            });
    
            // Destructure the response to get appeals and acceptedOrRejected
            const { appeals, acceptedOrRejected } = response.data;
    
            console.log('Appeals:', appeals);
            console.log('Accepted or Rejected:', acceptedOrRejected);
    
            // Filter based on active tab
            if (activeTab === 'latest') {
                setAssignments(appeals); // Set assignments that have appeals
            } else {
                setRecentAssignments(acceptedOrRejected); // Set assignments that are accepted or rejected
            }
    
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
    }, [activeTab]);

    const handleDecision = async (id, decision) => {
        try {
            const token = localStorage.getItem('headToken');
            await axios.post(
                `http://localhost:5000/api/heads/assignments/${id}/overturn`, 
                { headDecision: decision },
                { headers: { Authorization: `Bearer ${token}` }}
            );
            fetchAssignments();
        } catch (error) {
            console.error('Error updating decision:', error);
            setError('Failed to update decision. Please try again.');
        }
    };

    return (
        <DashboardLayout title="Head Dashboard" error={error}>
            <div className="space-y-8">
                <DashboardNav 
                    tabs={tabs} 
                    activeTab={activeTab} 
                    onTabChange={setActiveTab} 
                />

                <div className="bg-white rounded-xl shadow-md min-h-[600px]">
                    {loading ? (
                        <div className="flex justify-center items-center h-[600px]">
                            <svg className="animate-spin h-12 w-12 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    ) : (
                        <AssignmentList 
                            assignments={activeTab === 'latest' ? assignments : recentAssignments}
                            handleDecision={handleDecision}
                        />
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default HeadDashboard;
