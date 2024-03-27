import ProfileModel from '../models/ProfileModel';
import ProfileController from './ProfileController';


jest.mock('../models/ProfileModel'); // This mocks the ProfileModel module.


describe('ProfileController', () => {


  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    jest.clearAllMocks();
  });


  describe('resetPassword', () => {
    it('should send a password reset email successfully', async () => {
      ProfileModel.sendPasswordResetEmail.mockResolvedValue();


      const onSuccess = jest.fn();
      const onError = jest.fn();


      await ProfileController.resetPassword('test@example.com', onSuccess, onError);


      expect(ProfileModel.sendPasswordResetEmail).toHaveBeenCalledWith('test@example.com');
      expect(onSuccess).toHaveBeenCalledWith('Password reset email sent!');
      expect(onError).not.toHaveBeenCalled();
    });


    it('should handle error when sending a password reset email fails', async () => {
      ProfileModel.sendPasswordResetEmail.mockRejectedValue(new Error('Failed to send email'));


      const onSuccess = jest.fn();
      const onError = jest.fn();


      await ProfileController.resetPassword('test@example.com', onSuccess, onError);


      expect(ProfileModel.sendPasswordResetEmail).toHaveBeenCalledWith('test@example.com');
      expect(onError).toHaveBeenCalled();
      expect(onSuccess).not.toHaveBeenCalled();
    });
  });


  describe('updateEmail', () => {
    it('should update email successfully', async () => {
      // Mocking the methods to simulate success
      ProfileModel.reauthenticate.mockResolvedValue();
      ProfileModel.updateEmail.mockResolvedValue();


      const onSuccess = jest.fn();
      const onError = jest.fn();


      await ProfileController.updateEmail('current@example.com', 'new@example.com', 'password123', onSuccess, onError);


      expect(ProfileModel.reauthenticate).toHaveBeenCalledWith('current@example.com', 'password123');
      expect(ProfileModel.updateEmail).toHaveBeenCalledWith('new@example.com');
      expect(onSuccess).toHaveBeenCalledWith('Email successfully updated!');
      expect(onError).not.toHaveBeenCalled();
    });


    it('should handle error when email update fails', async () => {
      ProfileModel.reauthenticate.mockResolvedValue();
      ProfileModel.updateEmail.mockRejectedValue(new Error('Failed to update email'));


      const onSuccess = jest.fn();
      const onError = jest.fn();


      await ProfileController.updateEmail('current@example.com', 'new@example.com', 'password123', onSuccess, onError);


      expect(ProfileModel.updateEmail).toHaveBeenCalledWith('new@example.com');
      expect(onError).toHaveBeenCalled();
      expect(onSuccess).not.toHaveBeenCalled();
    });
  });
});
