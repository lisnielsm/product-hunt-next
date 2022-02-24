import firebaseConfig from "./config";
import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signOut } from 'firebase/auth';

const app = initializeApp(firebaseConfig);

class Firebase {
    constructor() {
        this.db = getFirestore(app);
        this.storage = getStorage();
    }

    // Registra un usuario
    async registrar(nombre, email, password) {
        const authentication = getAuth();
        const nuevoUsuario = await createUserWithEmailAndPassword(authentication, email, password);

        return await updateProfile(nuevoUsuario.user, {
            displayName: nombre
        });
    }

    // Inicia sesion de un usuario
    async login(email, password) {
        const authentication = getAuth();
        return await signInWithEmailAndPassword(authentication, email, password);
    }

    // CIerra la sesion del usuario
    async cerrarSesion() {
        const authentication = getAuth();
        return await signOut(authentication);
    }
}

const firebase = new Firebase();

export default firebase;

