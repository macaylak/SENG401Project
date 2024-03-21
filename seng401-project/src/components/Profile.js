import React, { useState } from 'react';
import { auth } from '../firebase';
import { updateEmail, sendPasswordResetEmail, reauthenticateWithCredential } from 'firebase/auth';
import './styles/Profile.css';

const Profile = () => {
  const [password, setPassword] = useState('');
  const [emailForm, setEmailForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [username, setUsername] = useState(''); // Added username state

  const handlePasswordChange = () => {
    sendPasswordResetEmail(auth, auth.currentUser.email)
      .then(() => {
        alert('Password reset email sent!');
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage('Failed to send password reset email. Please try again later.');
      });
  };

  const handleEmailChange = (e) => {
    e.preventDefault();
    const currentEmail = e.target.email[0].value;
    const newEmail = e.target.email[1].value;
    const newPassword = e.target.password.value;
    const newUsername = e.target.username.value; // Added username field

    if (currentEmail !== auth.currentUser.email) {
      setErrorMessage('Current email is incorrect');
      return;
    }

    updateEmail(auth.currentUser, newEmail)
      .then(() => {
        alert('Email updated successfully!');
        setEmailForm(false);
      })
      .catch((error) => {
        console.error(error);
        if (error.code === 'auth/requires-recent-login') {
          reauthenticateWithCredential(auth.currentUser, newPassword)
            .then(() => {
              updateEmail(auth.currentUser, newEmail)
                .then(() => {
                  alert('Email updated successfully!');
                  setEmailForm(false);
                })
                .catch((error) => {
                  console.error(error);
                  setErrorMessage('Failed to update email. Please try again later.');
                });
            })
            .catch((error) => {
              console.error(error);
              setErrorMessage('Failed to reauthenticate. Please try again later.');
            });
        } else {
          setErrorMessage('Failed to update email. Please try again later.');
        }
      });
  };

  const handleUsernameChange = (e) => {
    e.preventDefault();
    const newUsername = e.target.username.value;
    setUsername(newUsername);
  }

  return (
    <div id="profile-container">
      <h2>Profile</h2>
      <button onClick={() => setUsername(!username)}>Change Username?</button>
      <button onClick={handlePasswordChange}>Reset Password</button>
      <button onClick={() => setEmailForm(!emailForm)}>Change Email?</button>

      {emailForm && (
        <form onSubmit={handleEmailChange}>
          <label>
            Current Email:
            <input type="email" name="email" required />
          </label>
          <br />
          <label>
            New Email:
            <input type="email" name="email" required />
          </label>
          <input type="submit" value="Save" />
        </form>
      )}
      
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      {username && (
        <form onSubmit={handleUsernameChange}>
          <label>
            New Username:
            <input type="text" name="username" required />
          </label>
          <input type="submit" value="Save" />
        </form>
      )}
      
    </div>
  );
};

export default Profile;
