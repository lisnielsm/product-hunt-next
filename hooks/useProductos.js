import React, {useState, useEffect, useContext} from 'react';
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { FirebaseContext } from '../firebase';

const useProductos = orden => {
    const [productos, guardarProductos] = useState([]);
    const { firebase } = useContext(FirebaseContext);

    useEffect(() => {
        const obtenerProductos = async () => {
            const q = query(collection(firebase.db, "productos"), orderBy(orden, "desc"));
            const querySnapshot = await getDocs(q);

            const productos = querySnapshot.docs.map(doc => {
                return {
                    id: doc.id,
                    ...doc.data()
                }
            });

            guardarProductos(productos);
        };

        obtenerProductos();
    }, [])

    return {
        productos
    }
}

export default useProductos;

