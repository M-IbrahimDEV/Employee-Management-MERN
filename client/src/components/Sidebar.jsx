import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <h2>User  Dashboard</h2>
            <ul>
                <li><Link to="/dashboard/profile">Profile</Link></li>
                <li><Link to="/dashboard/salary">Salary & Bonuses</Link></li>
                <li><Link to="/dashboard/attendance">Attendance</Link></li>
            </ul>
        </div>
    );
};

export default Sidebar;