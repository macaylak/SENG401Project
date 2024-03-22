import React, { useState } from 'react';
import { auth } from '../firebase';
import './styles/Profile.css';
import { updatePassword, updateEmail, reauthenticateWithCredential } from "firebase/auth";
import ProfileController from './controllers/ProfileController';

const Profile = () => {
  const [password, setPassword] = useState('');
  const [emailForm, setEmailForm] = useState(false);
  const [changePasswordForm, setChangePasswordForm] = useState(false);
  const [error, setError] = useState('');

  const handlePasswordChange = () => {
    ProfileController.resetPassword(
      auth.currentUser.email,
      (message) => alert(message),
      (error) => {
        console.log(error.code, error.message);
        setError(error.message);
      }
    );
  };

  const handleEmailChange = (e) => {
    e.preventDefault();
    if (e.target.email[0].value !== auth.currentUser.email) {
      alert('Current email is incorrect');
      return;
    }
    updateEmail(auth.currentUser, e.target.email[1].value).then(() => {
      alert('Email updated!');
      e.target.email[0].value = '';
      e.target.email[1].value = '';
      e.target.password.value = '';
    })
    .catch((error) => {
      const errorMessage = error.message;
      if (errorMessage === 'auth/requires-recent-login') {
        reauthenticateWithCredential(auth.currentUser, e.target.password.value)
        .then(() => {
          updateEmail(auth.currentUser, e.target.email[1].value)
          .catch((error) => {
            const errorMessage = error.message;
            alert(errorMessage);
          });
        })
        .catch((error) => {
          const errorMessage = error.message;
          alert(errorMessage);
        });
      }
    });
  }


  const handlePasswordButtonClick = () => {
    setChangePasswordForm(true);
    setEmailForm(false); // Hide email form if it's currently displayed
  };
  
  const handleEmailButtonClick = () => {
    setEmailForm(true);
    setChangePasswordForm(false); // Hide change password form if it's currently displayed
  };


  const handleBackButtonClick = () => {
    window.location.href = '/dashboard';
  }

  return (

    
<div className="profile-container">
  <div className="sidebar">
  <button onClick={handleEmailButtonClick}>CHANGE EMAIL</button>
    <button onClick={handlePasswordButtonClick}>CHANGE PASSWORD</button>
    <button onClick={handleBackButtonClick}>BACK TO DASHBOARD</button>
  </div>
      <div className="main-content">
        <h2 className="PH">Profile</h2>
        { changePasswordForm && 
          <form className="centered-form" onSubmit={handlePasswordChange}>
            <label>
              Enter your current password:
              <input type="password" name="password" />
            </label>
            <input type="submit" value="Reset Password" />
          </form>
        }
        { emailForm && 
          <form className="centered-form" onSubmit={handleEmailChange}>
            <label>
              Current Email:
              <input type="email" name="email" />
            </label>
            <label>
              New Email:
              <input type="email" name="email" />
            </label>
            <label>
              Enter your password to confirm changes:
              <input type="password" name="password" />
            </label>
            <input type="submit" value="Save" />
          </form>
        }
      </div>
    </div>
  );
}

export default Profile;
