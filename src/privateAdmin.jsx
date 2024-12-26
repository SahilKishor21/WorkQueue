import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateAdminRoute = ({ children }) => {
    const role = localStorage.getItem('role'); // Check role from localStorage
    const location = useLocation();

    if (role !== 'Admin') {
        alert('You are logged in as a User. Please login as Admin to access this page.');
        return <Navigate to="/login" state={{ from: location }} />;
    }

    return children;
};

export default PrivateAdminRoute;
