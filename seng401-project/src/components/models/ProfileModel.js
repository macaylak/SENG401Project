import { auth } from '../../firebase';
import { sendPasswordResetEmail, updateEmail, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";

const ProfileModel = {
    sendPasswordResetEmail: async (email) => {
      return sendPasswordResetEmail(auth, email);
    },
    updateEmail: async (newEmail) => {
      return updateEmail(auth.currentUser, newEmail);
    },
    reauthenticate: async (email, password) => {
      const credential = EmailAuthProvider.credential(email, password);
      return reauthenticateWithCredential(auth.currentUser, credential);
    }
  };

export default ProfileModel;