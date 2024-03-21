
// Import necessary modules
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { auth } from '../firebase'; 
import { signInWithEmailAndPassword } from 'firebase/auth';
import './styles/Login.css';
import LoginController from './controllers/LoginController';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    LoginController.login(email, password, 
      () => navigate('/dashboard'),
      (errorMessage) => {
        alert(errorMessage);
        setError(errorMessage); // Use setError in your UI to show error messages
      }
    );
  };
    return (
      <div className='BackDropLogin'>
    
        <div className='LoginBody'>
  
          <div className='LoginThing'>
          <h2 className='LoginHeading'>Login</h2>
          <div className="login-form">


          <div className="input-container">
    <span className="icon">✉</span>
    <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
  </div>
  <div className="input-container">
    <span className="icon">🗝</span>
    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
  </div> 
  
      <button className = "LoginButton" onClick={handleLogin}>Login</button>
    </div>
          <a href="/">Back to Home</a>
    </div>
  
    </div>

        <footer className='LoginFooter'>
          <p className='LF'>&copy; 2024 Recipes4You</p>
        </footer>
      
      </div>
    );
}

export default Login;