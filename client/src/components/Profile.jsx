import React, { useState, useEffect } from 'react';
import './Profile.css';

const Profile = () => {
    const [user, setUser ] = useState({
        firstname: '',
        lastname: '',
        email: '',
        profilePicture: '',
    });

    useEffect(() => {
        // Fetch user data from the backend
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        // Implement update logic
    };

    return (
        <div className="profile">
            <h1>Profile Management</h1>
            <form onSubmit={handleUpdate}>
                <label>First Name</label>
                <input type="text" value={user.firstname} onChange={(e) => setUser ({ ...user, firstname: e.target.value })} />
                <label>Last Name</label>
                <input type="text" value={user.lastname} onChange={(e) => setUser ({ ...user, lastname: e.target.value })} />
                <label>Email</label>
                <input type="email" value={user.email} onChange={(e) => setUser ({ ...user, email: e.target.value })} />
                <label>Profile Picture</label>
                <input type="file" onChange={(e) => setUser ({ ...user, profilePicture: e.target.files[0] })} />
                <button type="submit">Update Profile</button>
            </form>
        </div>
    );
};

export default Profile;