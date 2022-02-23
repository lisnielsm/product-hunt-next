import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth"

function useAutenticacion() {
    const [usuarioAutenticado, guardarUsuarioAutenticado] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        const unsuscribe = onAuthStateChanged(auth, usuario => {
            if(usuario) {
                guardarUsuarioAutenticado(usuario);
            }
            else {
                guardarUsuarioAutenticado(null);
            }
        });

        return () => unsuscribe();
    }, []);

    return usuarioAutenticado;
}

export default useAutenticacion;