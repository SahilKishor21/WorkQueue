// HeadDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AssignmentList from '../Admin/AssignmentList';
import DashboardLayout from '../dashboard/DashboardLayout';
import DashboardNav from '../dashboard/DashboardNav';

const HeadDashboard = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('latest');

    const tabs = [
        { id: 'latest', label: 'Latest Assignments' },
        { id: 'all', label: 'All Assignments' }
    ];

    const fetchAssignments = async (endpoint) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('headToken');
            const response = await axios.get(`http://localhost:5000/api/head/assignments${endpoint}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAssignments(response.data.assignments);
            setError(null);
        } catch (error) {
            console.error('Error fetching assignments:', error);
            setError(error.response?.data?.message || 'Failed to fetch assignments');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssignments(activeTab === 'latest' ? '/latest' : '');
    }, [activeTab]);

    const handleDecision = async (id, decision) => {
        try {
            const token = localStorage.getItem('headToken');
            await axios.post(
                `http://localhost:5000/api/head/assignments/${id}/overturn`, 
                { headDecision: decision },
                { headers: { Authorization: `Bearer ${token}` }}
            );
            fetchAssignments(activeTab === 'latest' ? '/latest' : '');
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
                            assignments={assignments}
                            handleDecision={handleDecision}
                        />
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default HeadDashboard;