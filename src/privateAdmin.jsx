import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token'); 
    const location = useLocation();

    if (!token) {
        alert('Please login to access this page.');
        return <Navigate to="/login" state={{ from: location }} />;
    }

    return children;
};

export default PrivateRoute;