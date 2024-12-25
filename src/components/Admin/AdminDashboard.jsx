// AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import AssignmentList from './AssignmentList';
import axios from 'axios';
import DashboardLayout from '../dashboard/DashboardLayout';
import DashboardNav from '../dashboard/DashboardNav';

const AdminDashboard = () => {
    const [assignments, setAssignments] = useState([]); 
    const [recentAssignments, setRecentAssignments] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 
    const [activeTab, setActiveTab] = useState('assignments'); 

    const tabs = [
        { id: 'assignments', label: 'All Assignments' },
        { id: 'recents', label: 'Recent Assignments' }
    ];

    const fetchAssignments = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get('http://localhost:5000/api/admins/assignments', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const allAssignments = response.data;
            setAssignments(allAssignments);
            
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            const recent = allAssignments.filter(assignment => {
                const assignmentDate = new Date(assignment.createdAt);
                return assignmentDate >= oneWeekAgo;
            });
            setRecentAssignments(recent);
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
        <DashboardLayout title="Admin Dashboard" error={error}>
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
                            assignments={activeTab === 'assignments' ? assignments : recentAssignments} 
                        />
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminDashboard;