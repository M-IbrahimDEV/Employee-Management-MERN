import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './leavereq.css';

const Leavereq = () => {
    const navigate = useNavigate();
    const [date, setdate] = useState('');
    const [error, setError] = useState('');

    const userEmail = localStorage.getItem('email'); // Get the user ID from LocalStorage

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


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const response = await fetch(`http://localhost:8000/attendence/request-leave`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email:userEmail, date:date }),
            });

            if (!response.ok) {
                throw new Error('Failed to put leave req.');
            }
            HandleBackbtn();
            setError('');
        } catch (error) {
            console.error('Error put leave req:', error);
            setError('Failed to put leave req');
        }
    };

    const HandleBackbtn = () =>{
        window.location.href = '/userdashboard';        
    }

    return (
        <div className="Editing-Information">
            <h1>Edit Your Information</h1>
            {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit} className="form-container">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={userEmail}
                        required
                        readOnly
                        className='readOnly'
                    />

                    <label>Date</label>
                    <input
                        type="date"
                        name="date"
                        value={date}
                        onChange={(e) => setdate(e.target.value)}
                        required
                    />

                    <button type="submit">Update</button>
                    <button onClick={HandleBackbtn}>Back</button>
                </form>
        </div>
    );
};

export default Leavereq;
