import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './WaitingApproval.css';

const WaitingApproval = () => {
    const navigate = useNavigate();
    const [userData, setuserData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        profilePicture: null,
    });
    const [error, setError] = useState('');

    const userEmail = localStorage.getItem('email'); // Get the user ID from LocalStorage


    useEffect(() => {
        if (!userEmail) {
            navigate('/');
        }
    }, [])

    useEffect(() => {
        const checkapproved = async () => {
            if (userEmail) {
                try {
                    console.log(userEmail);
                    const response = await fetch(`http://localhost:8000/isapproved/`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email: userEmail })
                    });
                    const data = await response.json();

                    if (data.isApproved) {
                        navigate('/userdashboard');
                    }
                } catch (error) {
                    console.error('Error retrieving user data:', error);
                    setError('Failed to retrieve user data.');
                }
            }
        }
        checkapproved();

    }, [])

    useEffect(() => {
        const updateerror = async () => {
            setError('');
        }
        updateerror();
    }, [userEmail]);

    useEffect(() => {
        const fetchUserData = async () => {
            if (userEmail) {
                try {
                    const response = await fetch(`http://localhost:8000/getemployee/`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email: userEmail })
                    });
                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error('Failed to retrieve user data.');
                    }

                    setuserData({
                        firstname: data.firstname,
                        lastname: data.lastname,
                        email: data.email,
                        phone: data.phone,
                        profilePicture: data.image, // Update to include the image path
                    });
                } catch (error) {
                    console.error('Error retrieving user data:', error);
                    setError('Failed to retrieve user data.');
                }
            }
        };

        fetchUserData();
    }, [userEmail]);

    

    return (
        <div className="waiting-approval">
            <h1>Waiting for Approval</h1>
            {error && <p className="error">{error}</p>}

            
                <div className="user-details">
                    <div className="user-image">
                        {userData.profilePicture && (
                            <img src={`http://localhost:8000${userData.profilePicture}`} alt="Profile" />
                        )}
                    </div>
                    <div className="user-info">
                        <p><b>Name:</b> {userData.firstname} {userData.lastname}</p>
                        <p><b>Email:</b> {userData.email}</p>
                        <p><b>Phone:</b> {userData.phone}</p>
                    </div>
                    <button onClick={() => window.location.href = '/edit-information'}>Edit</button>
                </div>


        </div>
    );
};

export default WaitingApproval;
