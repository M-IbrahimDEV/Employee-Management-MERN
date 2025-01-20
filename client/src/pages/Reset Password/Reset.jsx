import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Reset.css';

const Reset = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        oldpassword: '',
        newpassword1: '',
        newpassword2: ''
    });
    const [error, setError] = useState('');

    const userEmail = localStorage.getItem('email'); 


    useEffect(() => {
        if (!userEmail) {
            navigate('/login');
        }
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

                    setFormData({
                        email: data.email
                    });
                } catch (error) {
                    console.error('Error retrieving user data:', error);
                    setError('Failed to retrieve user data.');
                }
            }
        };

        fetchUserData();
    }, [userEmail]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if(formData.newpassword1 != formData.newpassword2){
            setError("New passwords don't match");
            return error;
        }
        try {
            const response = await fetch(`http://localhost:8000/passwordreset`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: formData.email,
                    oldpassword: formData.oldpassword,
                    newpassword: formData.newpassword1,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update user data.');
            }
            HandleBackbtn();
            setError('');
        } catch (error) {
            console.error('Error updating user data:', error);
            setError('Failed to update user data.');
        }
    };

    const HandleBackbtn = () =>{
        window.location.href = '/userdashboard';        
    }

    return (
        <div className="Editing-Password">
            <h1>Reset Your Password</h1>
            {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit} className="form-container">

                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        required
                        readOnly
                        className='readOnly'
                    />

                    <label>Old Password</label>
                    <input
                        type="password"
                        name="oldpassword"
                        value={formData.oldpassword}
                        onChange={handleInputChange}
                        required
                    />

                    <label>New Password</label>
                    <input
                        type="password"
                        name="newpassword1"
                        value={formData.newpassword1}
                        onChange={handleInputChange}
                        required
                    />

                    <label>Repeat Password</label>
                    <input
                        type="password"
                        name="newpassword2"
                        value={formData.newpassword2}
                        onChange={handleInputChange}
                        required
                    />

                    <button type="submit">Update</button>
                    <button onClick={HandleBackbtn}>Back</button>
                </form>
        </div>
    );
};

export default Reset;
