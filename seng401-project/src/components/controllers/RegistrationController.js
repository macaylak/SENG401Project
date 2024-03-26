import RegistrationModel from '../models/RegistrationModel';

const RegistrationController = {

  //Command: Register New User
  async register(email, password, confirmPassword, onSuccess, onFailure) {
    if (password !== confirmPassword) {
      onFailure('Passwords do not match.');
      return;
    }
    try {
      await RegistrationModel.register(email, password);
      onSuccess();
    } catch (error) {
      console.error('Error registering user:', error.message);
      onFailure('Error registering. Please try again.');
    }
  }
};

export default RegistrationController;