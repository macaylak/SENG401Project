import React, { useState } from 'react';
import { auth } from '../firebase';
import './styles/Profile.css';
import { updatePassword, updateEmail, reauthenticateWithCredential, EmailAuthProvider, signOut } from "firebase/auth";
import ProfileController from './controllers/ProfileController';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [password, setPassword] = useState('');
  const [emailForm, setEmailForm] = useState(false);
  const [changePasswordForm, setChangePasswordForm] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();


  const handlePasswordChange = (e) => {
    e.preventDefault();
    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      e.target.password[0].value
     );
    reauthenticateWithCredential(auth.currentUser, credential)
    .then(() => {
      if (e.target.password[1].value !== e.target.password[2].value) {
        alert('New passwords do not match');
        return;
      }
      updatePassword(auth.currentUser, e.target.password[1].value).then(() => {
        alert('Password updated!');
        logOut();
      })
      .catch((error) => {
        const errorMessage = error.message;
        // alert(errorMessage);
        console.log(errorMessage);
      });
    })
    .catch((error) => {
      const errorMessage = error.message;
      alert(errorMessage);
    });
  };

  const logOut = () => {
    signOut(auth)
      .then(() => {
        console.log("user signed out");
        navigate('/login');
      })
      .catch((err) => {
        console.error(err.message);
      })
  }

  const handleEmailChange = (e) => {
    e.preventDefault();
    if (e.target.email[0].value !== auth.currentUser.email) {
      alert('Current email is incorrect');
      return;
    }
    if (e.target.email[1].value !== e.target.email[2].value) {
      alert('New emails do not match');
      return;
    }
    updateEmail(auth.currentUser, e.target.email[1].value).then(() => {
      alert('Email updated!');
      logOut();
      // e.target.email[0].value = '';
      // e.target.email[1].value = '';
      // e.target.email[2].value = '';
      // e.target.password.value = '';
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
              <input type="password" placeholder = 'Enter password to confirm changes' name="password" />
            </label>
            <input type="submit" value="Save" />
          </form>
        }
        </div>
      </div>
  );
}

export default Profile;
