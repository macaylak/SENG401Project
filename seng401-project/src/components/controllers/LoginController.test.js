import LoginModel from '../models/LoginModel';
import LoginController from './LoginController';


jest.mock('../models/LoginModel'); // This mocks the LoginModel module.


describe('LoginController', () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    jest.clearAllMocks();
  });


  describe('login', () => {
    it('should call onSuccess callback when signIn is successful', async () => {
      // Mock the signIn function to simulate a successful login
      LoginModel.signIn.mockResolvedValue();


      const onSuccess = jest.fn();
      const onFailure = jest.fn();


      await LoginController.login('user@example.com', 'password123', onSuccess, onFailure);


      expect(LoginModel.signIn).toHaveBeenCalledWith('user@example.com', 'password123');
      expect(onSuccess).toHaveBeenCalled();
      expect(onFailure).not.toHaveBeenCalled();
    });


    it('should call onFailure callback with error message when signIn fails', async () => {
      // Mock the signIn function to simulate a failed login
      LoginModel.signIn.mockRejectedValue(new Error('Login failed'));


      const onSuccess = jest.fn();
      const onFailure = jest.fn();


      await LoginController.login('user@example.com', 'wrongpassword', onSuccess, onFailure);


      expect(LoginModel.signIn).toHaveBeenCalledWith('user@example.com', 'wrongpassword');
      expect(onSuccess).not.toHaveBeenCalled();
      expect(onFailure).toHaveBeenCalledWith('Invalid credentials. Please try again.');
    });
  });
});
