import ProfileModel from '../models/ProfileModel';

const ProfileController = {

  //Command
  resetPassword: async (email, onSuccess, onError) => {
    try {
      await ProfileModel.sendPasswordResetEmail(email);
      onSuccess('Password reset email sent!');
    } catch (error) {
      onError(error);
    }
  },

  //Command
  updateEmail: async (currentEmail, newEmail, password, onSuccess, onError) => {
    try {
      // First, re-authenticate the user
      await ProfileModel.reauthenticate(currentEmail, password);
      // Then, update the email
      await ProfileModel.updateEmail(newEmail);
      onSuccess('Email successfully updated!');
    } catch (error) {
      onError(error);
    }
  }
};

export default ProfileController;
