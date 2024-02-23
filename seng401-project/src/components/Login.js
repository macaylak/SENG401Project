// Login.js
import React, { useState } from 'react';
import './styles/Login.css';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize the navigate function using useNavigate

  const handleLogin = () => {
    // Implement login functionality here
    if (email === 'example@example.com' && password === 'password') {
      console.log('Login successful');
      // Redirect to the dashboard
      navigate('/dashboard'); // Use navigate function to redirect
    } else {
      console.log('Invalid credentials');
      // Display an error message or perform any other action
      console.alert('Invalid credentials');
    }
  };

  return (
    <div>
      
      <h2>Login</h2>
      {/* login form */}
      <div className="login-form">
        <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleLogin}>Login</button>
      </div>
      {/* back to home button */}
      <a href="/">Back to Home</a>
      <style>{`
        .about-container {
          display: none;
        }
      `}</style>
    </div>
  );
}

export default Login;