// client/src/pages/AdminApproval.jsx
import React, { useEffect, useState } from 'react';

const AdminApproval = () => {
    const [pendingUsers, setPendingUsers] = useState([]);

    useEffect(() => {
        // Fetch pending users for approval
    }, []);

    const handleApproval = (userId) => {
        // Implement approval logic
    };

    return (
        <div>
            <h1>Pending Approvals</h1>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {pendingUsers.map(user => (
                        <tr key={user._id}>
                            <td>{user.firstname} {user.lastname}</td>
                            <td>{user.email}</td>
                            <td>
                                <button onClick={() => handleApproval(user._id)}>Approve</button>
                                <button onClick={() => handleRejection(user._id)}>Reject</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminApproval;