import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { es } from "date-fns/locale";

import { FirebaseContext } from '../../firebase';
import Error404 from '../../components/layout/404';
import Layout from '../../components/layout/layout';
import { Campo, InputSubmit } from '../../components/ui/Formulario';
import Boton from '../../components/ui/Boton';

const ContenedorProducto = styled.div`
    @media (min-width: 768px) {
        display: grid;
        grid-template-columns: 2fr 1fr;
        column-gap: 2rem;
    }
`;

const CreadorProducto = styled.p`
    padding: .5rem 2rem;
    background-color: #DA552F;
    color: #fff;
    text-transform: uppercase;
    font-weight: bold;
    display: inline-block;
    text-align: center;
`;

const Producto = () => {

    // state del componente
    const [producto, guardarProducto] = useState({});
    const [error, guardarError] = useState(false);
    const [comentario, guardarComentario] = useState({});    
    const [consultarDB, guardarconsultarDB] = useState(true);


    // Routing para obtener el id actual
    const router = useRouter();
    const { query: { id } } = router;

    // context con las operaciones crud de firebase
    const { usuario, firebase } = useContext(FirebaseContext);

    useEffect(() => {
        if (id && consultarDB) {
            const obtenerProducto = async () => {
                const productoQuery = doc(firebase.db, "productos", id);
                const productoDoc = await getDoc(productoQuery);

                if (productoDoc.exists()) {
                    guardarProducto(productoDoc.data());
                    guardarconsultarDB(false);
                }
                else {
                    guardarError(true);
                    guardarconsultarDB(false);
                }
            }

            obtenerProducto();
        }
    }, [id])

    const { idproducto, comentarios, creado, descripcion, empresa, nombre, url, urlimagen, votos, creador, haVotado } = producto;

    // Administrar y validar los votos
    const votarProducto = async () => {
        if (!usuario) {
            return router.push("/login");
        }

        // obtener y sumar un nuevo voto
        const nuevoTotal = votos + 1

        // verificar si el usuario actual ha votado
        if (haVotado.includes(usuario.uid)) return;

        // guardar el id del usuario que ha votado
        const NuevoHaVotado = [...haVotado, usuario.uid];

        // actualizar en la BD
        const productoQuery = doc(firebase.db, "productos", id);
        await updateDoc(productoQuery, {
            votos: nuevoTotal,
            haVotado: NuevoHaVotado
        });

        // actualizar el state
        guardarProducto({
            ...producto,
            votos: nuevoTotal,
            haVotado: NuevoHaVotado
        })

        guardarconsultarDB(true);
    }

    // funciones para crear comentarios
    const comentarioChange = e => {
        guardarComentario({
            ...comentario,
            [e.target.name]: e.target.value
        })
    }

    const agregarComentario = e => {
        e.preventDefault();

        if (!usuario) {
            return router.push("/login");
        }

        // informacion extra al comentario
        comentario.usuarioId = usuario.uid;
        comentario.usuarioNombre = usuario.displayName;

        // tomar copia de comentarios y agregarlos al arreglo
        const nuevosComentarios = [...comentarios, comentario];

        // actualizar la BD
        const productoQuery = doc(firebase.db, "productos", id);
        updateDoc(productoQuery, {
            comentarios: nuevosComentarios
        });

        // actualizar el state
        guardarProducto({
            ...producto,
            comentarios: nuevosComentarios
        })

        guardarconsultarDB(true);
    }

    // identifica si el comentarios es del creador del producto
    const esCreador = id => {
        if(creador.id === id) {
            return true;
        }
    }

    // funcion que revisa si el creador del producto es el mismo que esta autenticado
    const puedeBorrar = () => {
        if(!usuario) return false;

        if(creador.id === usuario.uid) {
            return true;
        }
    }

    // elimina un prodcto de la BD
    const eliminarProducto = async () => {
        if (!usuario) {
            return router.push("/login");
        }

        if (creador.id === usuario.uid) {
            return router.push("/");
        }

        try {
            // const productoQuery = doc(firebase.db, "productos", id);
            // await deleteDoc(productoQuery);
            await deleteDoc(doc(firebase.db, "productos", id));

            router.push("/");
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Layout>
            <>
                {error ? <Error404 /> : (
                    <div className="contenedor">
                        {(Object.keys(producto).length === 0 && !error) ?
                            (<p css={css`
                            text-align: center;
                        `}>Cargando...</p>)
                            :
                            (
                                <>
                                    <h1 css={css`
                                margin-top: 5rem;
                                text-align: center;
                                `}>
                                        {nombre}
                                    </h1>

                                    <ContenedorProducto>
                                        <div>
                                            <p>Publicado hace: {formatDistanceToNow(new Date(creado), { locale: es })}</p>
                                            <p>Por: {creador.nombre} de {empresa}</p>
                                            <img src={urlimagen} />
                                            <p>{descripcion}</p>

                                            {usuario && (
                                                <>
                                                    <h2>Agrega tu comentario</h2>
                                                    <form
                                                        onSubmit={agregarComentario}
                                                    >
                                                        <Campo>
                                                            <input
                                                                type="text"
                                                                name="mensaje"
                                                                onChange={comentarioChange}
                                                            />
                                                        </Campo>
                                                        <InputSubmit
                                                            type="submit"
                                                            value="Agregar Comentario"
                                                        />
                                                    </form>
                                                </>
                                            )}

                                            <h2 css={css`
                                            margin-top: 2rem;
                                        `}>Comentarios</h2>

                                            {comentarios.length === 0 ? "Aun no hay comentarios" : (
                                                <ul>
                                                    {comentarios.map((comentario, i) => (
                                                        <li
                                                            key={`${comentario.usuarioId}-${i}`}
                                                            css={css`
                                                            border: 1px solid #e1e1e1;
                                                            padding: 2rem;
                                                            margin-top: 1rem;
                                                        `}
                                                        >
                                                            <p>{comentario.mensaje}</p>
                                                            <p>Escrito por:
                                                                <span
                                                                    css={css`
                                                                    font-weight: bold;
                                                                `}
                                                                >
                                                                    {""} {comentario.usuarioNombre}
                                                                </span>
                                                            </p>
                                                            {esCreador(comentario.usuarioId) && <CreadorProducto>Es Creador</CreadorProducto>}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>

                                        <aside>
                                            <Boton
                                                target="_blank"
                                                bgColor="true"
                                                href={url}
                                            >
                                                Visitar URL
                                            </Boton>

                                            <div css={css`
                                            margin-top: 5rem;
                                        `}>
                                                <p css={css`
                                                text-align: center;
                                            `}>{votos} Votos</p>

                                                {usuario && (
                                                    <Boton
                                                        onClick={votarProducto}
                                                    >
                                                        Votar
                                                    </Boton>
                                                )}
                                            </div>
                                        </aside>
                                    </ContenedorProducto>

                                    {puedeBorrar() &&
                                        <Boton
                                            onClick={eliminarProducto}
                                        >Eliminar Producto</Boton>
                                    }
                                </>
                            )
                        }
                    </div>
                )}
            </>
        </Layout>
    );
}

export default Producto;