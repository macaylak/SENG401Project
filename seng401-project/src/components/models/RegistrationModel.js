import { auth } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const RegistrationModel = {
  async register(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }
};

export default RegistrationModel;
