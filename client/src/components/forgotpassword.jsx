


// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './Login.css';

// const Login = () => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');
//     const navigate = useNavigate();

//     const handleLogin = async (e) => {
//         e.preventDefault();

//         try {
//             const response = await fetch('http://localhost:8000/login', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ email, password }),
//             });

//             const data = await response.json();

//             console.log(data);

//             if (!response.ok) {
//                 throw new Error(data.message || 'Login failed. Please try again.');
//             }

//             // Store only the user ID in Local Storage
//             console.log("data in the log:");
//             console.log(data.email);
//             localStorage.setItem('email', email);

//             if (data.isApproved) {
//                 navigate('/userdashboard'); // Redirect to home if approved
//             } else {
//                 navigate('/waiting-approval'); // Redirect to waiting approval page
//             }
//         } catch (error) {
//             console.error('Error during login:', error);
//             setError(error.message);
//         }
//     };

//     return (
//         <div className="login-cont">
//             <div className="login">
//                 <h1>Login</h1>
//                 {error && <p className="error">{error}</p>}
//                 <form onSubmit={handleLogin}>
//                     <input
//                         type="email"
//                         placeholder="Email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         required
//                     />
//                     <input
//                         type="password"
//                         placeholder="Password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         required
//                     />
//                     <button type="submit">Login</button>
//                 </form>
//                 <button className="signup-button" onClick={() => navigate('/signup')}>
//                     Sign Up
//                 </button>
//             </div>
//         </div>
//     );
// };

