import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './components/pages/HomePage';
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import UserDashboard from './components/User/UserDashboard';
import AdminDashboard from './components/Admin/AdminDashboard';
import HeadDashboard from './components/Head/headDashboard';
import AdminUpload from './components/Admin/AdminUpload';
import ForgotPassword from './components/pages/ForgotPassword';

// Import protection component
import PrivateRoute from './privateAdmin'

function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                
                <Route 
                    path="/user/dashboard" 
                    element={
                        <PrivateRoute>
                            <UserDashboard />
                        </PrivateRoute>
                    } 
                />
                
                <Route 
                    path="/admin/dashboard" 
                    element={
                        <PrivateRoute>
                            <AdminDashboard />
                        </PrivateRoute>
                    } 
                />
                
                <Route 
                    path="/admin/upload" 
                    element={
                        <PrivateRoute>
                            <AdminUpload />
                        </PrivateRoute>
                    } 
                />
                
                <Route 
                    path="/head/dashboard" 
                    element={
                        <PrivateRoute>
                            <HeadDashboard />
                        </PrivateRoute>
                    } 
                />
            </Routes>
    );
}

export default App;