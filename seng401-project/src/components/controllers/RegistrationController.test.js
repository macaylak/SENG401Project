import RegistrationModel from '../models/RegistrationModel';
import RegistrationController from './RegistrationController';


jest.mock('../models/RegistrationModel'); // Mock the RegistrationModel module


describe('RegistrationController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });


  describe('register', () => {
    const email = 'newuser@example.com';
    const password = 'password123';
    const confirmPassword = 'password123';


    it('should call onSuccess when registration is successful', async () => {
      RegistrationModel.register.mockResolvedValue(); // Simulate successful registration


      const onSuccess = jest.fn();
      const onFailure = jest.fn();


      await RegistrationController.register(email, password, confirmPassword, onSuccess, onFailure);


      expect(RegistrationModel.register).toHaveBeenCalledWith(email, password);
      expect(onSuccess).toHaveBeenCalled();
      expect(onFailure).not.toHaveBeenCalled();
    });


    it('should call onFailure when passwords do not match', async () => {
      const onFailure = jest.fn();


      await RegistrationController.register(email, password, 'wrongconfirm', () => {}, onFailure);


      expect(RegistrationModel.register).not.toHaveBeenCalled(); // Should not attempt to register
      expect(onFailure).toHaveBeenCalledWith('Passwords do not match.');
    });


    it('should call onFailure when registration fails', async () => {
      RegistrationModel.register.mockRejectedValue(new Error('Registration failed')); // Simulate registration failure


      const onSuccess = jest.fn();
      const onFailure = jest.fn();


      await RegistrationController.register(email, password, confirmPassword, onSuccess, onFailure);


      expect(RegistrationModel.register).toHaveBeenCalledWith(email, password);
      expect(onSuccess).not.toHaveBeenCalled();
      expect(onFailure).toHaveBeenCalledWith('Error registering. Please try again.');
    });
  });
});


