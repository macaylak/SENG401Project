// Profile.js
import React from 'react';
import {auth} from '../firebase';
import { updatePassword, sendPasswordResetEmail, updateEmail, reauthenticateWithCredential } from "firebase/auth";
import { useState } from 'react';


const Profile = () => {
  const [password, setPassword] = useState('');
  const [emailForm, setEmailForm] = useState(false);

  // // const auth = getAuth();
  // sendPasswordResetEmail(auth, email)
  //   .then(() => {
  //     // Password reset email sent!
  //     // ..
  //   })
  //   .catch((error) => {
  //     const errorCode = error.code;
  //     const errorMessage = error.message;
  //     // ..
  // });

  const handlePasswordChange = () => {
    sendPasswordResetEmail(auth, auth.currentUser.email)
    .then(() => {
      alert('Password reset email sent!');
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
  }

  const handleEmailChange = (e) => {
    e.preventDefault();
    console.log(e.target.email[0].value); 
    console.log(e.target.email[1].value);
    // console.log(e.target.email[2].value);   
    if(e.target.email[0].value !== auth.currentUser.email){
      alert('Current email is incorrect');
      return;
    }
    // if(e.target.email[1].value !== e.target.email[2].value){
    //   alert('New email does not match');
    //   return;
    // }
    updateEmail(auth.currentUser, e.target.email[1].value).then(() => {
      alert('Email updated!');
      e.target.email[0].value = '';
      e.target.email[1].value = '';
      // e.target.email[2].value = '';
      e.target.password.value = '';
    })
    .catch((error) => {
      const errorMessage = error.message;
      if(errorMessage === 'auth/requires-recent-login'){
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
  
  return (
    <div>
      <a href="/dashboard">Back to Dashboard</a>
      <h2>Profile</h2>
      <button onClick={() => handlePasswordChange()}>Reset Password</button>
      <button onClick={() => setEmailForm(!emailForm)}>Change Email?</button>

        { emailForm? 
        <form onSubmit={handleEmailChange}>
          <label>
            Current Email:
            <input type="email" name="email" />
          </label>
          <br/>
          <label>
            New Email:
            <input type="email" name="email" />
          </label>
          <br/>
          {/* <label>
            Confirm New Email:
            <input type="email" name="email" />
          </label>
          <br/> */}
          <label>
            Enter your password to confirm changes:
            <input type="password" name="password" />
          </label>
          <input type="submit" value="Save" />
          
        </form>
        : null
        }
    </div>
  );
}

export default Profile;
