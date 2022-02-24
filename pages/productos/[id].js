import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { doc, getDoc } from "firebase/firestore";

import { FirebaseContext } from '../../firebase';

const Producto = () => {

    // state del componente
    const [producto, guardarProducto] = useState({});

    // Routing para obtener el id actual
    const router = useRouter();
    const { query: { id } } = router;

    // context con las operaciones crud de firebase
    const { usuario, firebase } = useContext(FirebaseContext);

    useEffect(() => {
        if (id) {
            const obtenerProducto = async () => {
                const productoQuery = doc(firebase.db, "productos", id);
                const productoDoc = await getDoc(productoQuery);

                if (productoDoc.exists()) {
                    guardarProducto(productoDoc.data());
                }
            }

            obtenerProducto();
        }
    }, [id])

    return (
        <h1>Desde {id}</h1>
    );
}

export default Producto;