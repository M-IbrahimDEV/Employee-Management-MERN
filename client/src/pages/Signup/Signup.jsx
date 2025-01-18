import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        phone: '',
        profilePicture: null,
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();


    useEffect(()=>{
        localStorage.clear();
    }, [])

    const handleSignup = async (e) => {
        e.preventDefault();

        // Create a FormData object to handle file uploads
        const formDataToSend = new FormData();
        formDataToSend.append('firstname', formData.firstname);
        formDataToSend.append('lastname', formData.lastname);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('password', formData.password);
        formDataToSend.append('phone', formData.phone);
        if (formData.profilePicture) {
            formDataToSend.append('profilePicture', formData.profilePicture);
        }

        try {
            const response = await fetch('http://localhost:8000/signup', {
                method: 'POST',
                body: formDataToSend, // Send FormData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Signup failed. Please try again.');
            }

            const data = await response.json();
            console.log('Signup successful:', data);
            navigate('/'); // Redirect to login page after successful signup
        } catch (error) {
            console.error('Error during signup:', error);
            setError(error.message);
        }
    };

    return (
        <div className="signup-cont">
            <div className ="signup">
                <h1>Sign Up</h1>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSignup}>
                    <input
                        type="text"
                        placeholder="First Name"
                        value={formData.firstname}
                        onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        value={formData.lastname}
                        onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />
                    <input
                        type="tel"
                        placeholder="Phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFormData({ ...formData, profilePicture: e.target.files[0] })}
                    />
                    <button type="submit">Sign Up</button>
                </form>
                <button className="login-button" onClick={() => navigate('/')}>
                    Log In
                </button>
            </div>
        </div>
    );
};

export default Signup;