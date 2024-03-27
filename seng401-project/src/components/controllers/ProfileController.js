import { auth, colRef, logOut } from '../../firebase';
import { updatePassword, updateEmail, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { query, where, getDocs, updateDoc } from 'firebase/firestore';

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
      console.log(errorMessage);
    });
  })
  .catch((error) => {
    const errorMessage = error.message;
    alert(errorMessage);
  });
};

const handleEmailChange = (e) => {
  e.preventDefault();
  console.log(e);
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
    changeRecipeUser(e.target.email[0].value, e.target.email[1].value);
    logOut();
  })
  .catch((error) => {
    const errorMessage = error.message;

    if (errorMessage.includes('auth/requires-recent-login')) {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        e.target.password.value
      );

      reauthenticateWithCredential(auth.currentUser, credential)
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

const changeRecipeUser = (oldEmail, newEmail) => {
  console.log('Changing user email from ' + oldEmail + ' to ' + newEmail);
  const q = query(colRef, where("user", "==", oldEmail));
  getDocs(q)
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.data().title);
        updateDoc(doc.ref, { user: newEmail });
      });
    })
    .catch((err) => {
      console.log(err.message);
    });
}

export { handlePasswordChange, handleEmailChange };