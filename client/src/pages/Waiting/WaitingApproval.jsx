import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './WaitingApproval.css';

const WaitingApproval = () => {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
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
        const updateerror = async () => {
            setError('');
        }
        updateerror();
    }, [userEmail, isEditing]);
    // Fetch user data from the backend using the user ID
    useEffect(() => {
        const fetchUserData = async () => {
            if (userEmail) {
                try {
                    const response = await fetch(`http://localhost:8000/employee/email/${userEmail}`);
                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error('Failed to retrieve user data.');
                    }

                    setFormData({
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
    }, [userEmail, isEditing]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle profile picture change
    const handleFileChange = (e) => {
        setFormData({ ...formData, profilePicture: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('firstname', formData.firstname);
            formDataToSend.append('lastname', formData.lastname);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('phone', formData.phone);
            if (formData.profilePicture) {
                formDataToSend.append('image', formData.profilePicture);  // Correct field name
            }
    
            const response = await fetch(`http://localhost:8000/employee/email/${userEmail}`, {
                method: 'PUT',
                body: formDataToSend,
            });
    
            if (!response.ok) {
                throw new Error('Failed to update user data.');
            }
    
            const updatedUser = await response.json();
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setIsEditing(false);
            setError('');
        } catch (error) {
            console.error('Error updating user data:', error);
            setError('Failed to update user data.');
        }
    };
    
    return (
        <div className="waiting-approval">
            <h1>Waiting for Approval</h1>
            {error && <p className="error">{error}</p>}

            {isEditing ? (
                <form onSubmit={handleSubmit} className="form-container">
                    <label>First Name</label>
                    <input
                        type="text"
                        name="firstname"
                        value={formData.firstname}
                        onChange={handleInputChange}
                        required
                    />

                    <label>Last Name</label>
                    <input
                        type="text"
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleInputChange}
                        required
                    />

                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        required
                        readOnly
                        className='readOnly'
                    />

                    <label>Phone</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                    />

                    <label>Profile Picture</label>
                    <input
                        type="file"
                        onChange={handleFileChange}
                    />

                    <button type="submit">Update</button>
                    <button onClick={() => setIsEditing(false)}>Back</button>
                </form>
            ) : (
                <div className="user-details">
                    <div className="user-image">
                        {formData.profilePicture && (
                            <img src={`http://localhost:8000${formData.profilePicture}`} alt="Profile" />
                        )}
                    </div>
                    <div className="user-info">
                        <p><b>Name:</b> {formData.firstname} {formData.lastname}</p>
                        <p><b>Email:</b> {formData.email}</p>
                        <p><b>Phone:</b> {formData.phone}</p>
                    </div>
                    <button onClick={() => setIsEditing(true)}>Edit</button>
                </div>
            )}
        </div>
    );
};

export default WaitingApproval;
