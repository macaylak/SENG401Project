import React, { useState } from 'react';
import { auth } from '../firebase';
import './styles/Profile.css';
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { handlePasswordChange, handleEmailChange } from './controllers/ProfileController';

const Profile = () => {
  const [emailForm, setEmailForm] = useState(false);
  const [changePasswordForm, setChangePasswordForm] = useState(false);
  const navigate = useNavigate();

  const handlePasswordButtonClick = () => {
    setChangePasswordForm(true);
    setEmailForm(false); 
  };
  
  const handleEmailButtonClick = () => {
    setEmailForm(true);
    setChangePasswordForm(false); 
  };

  const handleBackButtonClick = () => {
    navigate('/dashboard');
  }

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      console.log('user logged out');
      navigate('/login');
    }
  })

  return (
<div className="profile-container">
  <div className="sidebar">
  <button onClick={handleEmailButtonClick}>✉  CHANGE EMAIL</button>
    <button onClick={handlePasswordButtonClick}>🗝  CHANGE PASSWORD</button>
    <button onClick={handleBackButtonClick}>◀ BACK TO RECIPES</button>
  </div>
      <div className="main-content">
        <h2 className="PH">Profile</h2>

        { changePasswordForm &&
        
          <form className="centered-form" onSubmit={handlePasswordChange}>
            <label>
              <input type="password" placeholder='Current Password' name="password" />
            </label>
            <label>
              <input type="password" placeholder='New Password' name="password" />
            </label>
            <label>
              <input type="password" placeholder='Re-enter New Password' name="password" />
            </label>
            <input type="submit" value="Reset Password"  />
          </form>
        }

       
        { emailForm && 
          <form className="centered-form" onSubmit={handleEmailChange}>
            <label>
              <input type="email" placeholder='Current Email' name="email"  />
            </label>
            <label>
              <input type="email" placeholder='New Email' name="email" />
            </label>
            <label>
              <input type="email" placeholder='Re-enter New Email' name="email" />
            </label>
            <label>
              <input type="password" placeholder = 'Enter password to confirm' name="password" />
            </label>
            <input type="submit" value="Save" />
          </form>
        }
        </div>
      </div>
  );
}

export default Profile;
