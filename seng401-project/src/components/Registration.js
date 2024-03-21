// Import necessary modules
import React, { useState } from 'react';
import './styles/Registration.css';

import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

function Registration() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    if (password === confirmPassword) {
      try {
        await createUserWithEmailAndPassword(auth, email, password); // WHAT THE FUCK WAS WRONG WITH THS
        console.log('Registration successful');
        window.location.reload();
      } catch (error) {
        console.error('Error registering user:', error.message);
      }
    } else {
      console.log('Passwords do not match');
    }
  };

  return (
    <div className='body'>
      <h2>Let's Get Started!</h2>
      <div className="registration-form">
        <input type='text' placeholder="Username" value={username} onChange={(e) =>setUsername(e.target.value)} />
        <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        <button onClick={handleRegister}>Register</button>
      </div>
      <a href="/">Back to Home</a>
    </div>
  );
}

export default Registration;
