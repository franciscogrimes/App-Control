import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut 
} from 'firebase/auth';
import { auth } from './config';

export async function signUpWithEmailAndPassword(email, senha) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;
    console.log("Usuário criado com sucesso:", user);
    return { success: true, user };
  } catch (error) {
    console.error("Erro ao criar usuário:", error.code, error.message);
    return { success: false, error: error.code };
  }
}

export async function signInWithEmailAndPasswordAuth(email, senha) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;
    console.log("Login efetuado com sucesso:", user);
    return { success: true, user };
  } catch (error) {
    console.error("Não foi possível efetuar o login:", error.code, error.message);
    return { success: false, error: error.code };
  }
}

export async function logout() {
  try {
    await signOut(auth);
    console.log("Logout efetuado com sucesso");
    return { success: true };
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    return { success: false, error: error.code };
  }
}