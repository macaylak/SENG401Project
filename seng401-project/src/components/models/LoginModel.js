import { auth } from '../../firebase'; 
import { signInWithEmailAndPassword } from 'firebase/auth';

const LoginModel = {
  async signIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }
};

export default LoginModel;
