// Import necessary modules
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Registration.css';
import RegistrationController from './controllers/RegistrationController';

import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

function Registration() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();


  const handleRegister = () => {
    RegistrationController.register(
      email, 
      password, 
      confirmPassword,
      () => {
        console.log('Registration successful');
        navigate('/login');
      },
      (errorMessage) => {
        console.error(errorMessage);
        setError(errorMessage);
      }
    );
  };

  return (
    <div className='BackDrop'>
  
      <div className='SignUpBody'>

        <div className='SignUpthing'>
        <h2 className='signupheading'>Sign Up</h2>
        <div className="registration-form">
  <div className="input-container">
    <span className="icon">✉</span>
    <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
  </div>
  <div className="input-container">
    <span className="icon">🗝</span>
    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
  </div>
  <div className="input-container">
    <span className="icon">✔</span>
    <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
  </div>
  <button onClick={handleRegister}>Register</button>
</div>
        <a href="/">Back to Home</a>
      </div>

      </div>
      <footer className='SignUpFooter'>
        <p className='SF'>&copy; 2024 Recipes4You</p>
      </footer>
    
    </div>
  );
}

export default Registration;
