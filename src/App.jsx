import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './components/pages/HomePage';
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import UserDashboard from './components/User/UserDashboard';
import AdminDashboard from './components/Admin/AdminDashboard';
import HeadDashboard from './components/Head/headDashboard';
import AdminUpload from './components/Admin/AdminUpload';

function App() {
    return (
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/user/dashboard" element={<UserDashboard />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/upload" element={<AdminUpload />} />
                <Route path="/head/dashboard" element={<HeadDashboard />} />
            </Routes>
    );
}

export default App;