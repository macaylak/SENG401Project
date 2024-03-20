
// Import necessary modules
import React, { useState } from 'react';
import './styles/Login.css';
import { useNavigate } from 'react-router-dom'; 
import { auth } from '../firebase'; 
import { signInWithEmailAndPassword } from 'firebase/auth';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); 

  const handleLogin = async () => {
    try {
      // Sign in user with email and password
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error logging in:', error.message);
      alert('Invalid credentials. Please try again.');
    }
  };

  return (
    <div> 
      
      <header className='loginHeader'></header>
      <h2 className>Login</h2>
    
      <div className="login-form">
        <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleLogin}>Login</button>
      </div>
      
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