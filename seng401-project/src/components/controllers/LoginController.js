import LoginModel from '../models/LoginModel';

const LoginController = {
  
  //Query
  async login(email, password, onSuccess, onFailure) {
    try {
      await LoginModel.signIn(email, password);
      onSuccess();
    } catch (error) {
      console.error('Error logging in:', error.message);
      onFailure('Invalid credentials. Please try again.');
    }
  }

};

export default LoginController;