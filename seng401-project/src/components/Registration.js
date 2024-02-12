// Registration.js
import React, { useState } from 'react';
import './styles/Registration.css';

function Registration() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    // Implement registration functionality here
    if (password === confirmPassword) {
        // Registration logic
        console.log('Registration successful');
    } else {
        console.log('Passwords do not match');
    }
};

  return (
    <div className='body'>
      <h2>Let's Get Started!</h2>
        {/* resitration form */}
       <div className="registration-form">
        <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        <button onClick={handleRegister}>Register</button>
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

export default Registration;
