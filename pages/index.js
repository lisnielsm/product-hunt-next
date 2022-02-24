import React, { useContext, useEffect, useState } from 'react';
import Layout from '../components/layout/layout';
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { FirebaseContext } from '../firebase';
import DetallesProducto from '../components/layout/DetallesProducto';

export default function Home() {

	const [productos, guardarProductos] = useState([]);
	const { firebase } = useContext(FirebaseContext);

	useEffect(() => {
		const obtenerProductos = async () => {
			const q = query(collection(firebase.db, "productos"), orderBy("creado", "desc"));
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

	return (
		<div>
			<Layout>
				<div className="listado-productos">
					<div className="contenedor">
						<ul className="bg-white">
							{productos.map(producto => (
								<DetallesProducto
									key={producto.id}
									producto={producto}
								/>
							))}
						</ul>
					</div>
				</div>
			</Layout>
		</div>
	)
}
