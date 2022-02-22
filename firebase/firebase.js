import { initializeApp } from 'firebase/app';
import firebaseConfig from "./config";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

const app = initializeApp(firebaseConfig);

// Registra un usuario
async function registrar(nombre, email, password) {
    const authentication = getAuth();
    const nuevoUsuario = await createUserWithEmailAndPassword(authentication, email, password);

    console.log(nuevoUsuario);

    return await updateProfile(nuevoUsuario.user, {
        displayName: nombre
    });
}

export {registrar};
export default app;

