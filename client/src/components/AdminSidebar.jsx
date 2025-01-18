import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Sidebar from '../components/AdminSidebar';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="admin-dashboard">
            <NavBar onLogout={handleLogout} />
            <div className="dashboard-content">
                <Sidebar />
                <div className="main-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;