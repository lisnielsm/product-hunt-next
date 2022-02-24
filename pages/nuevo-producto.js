import React, { useContext, useState } from 'react';
import { css } from '@emotion/react';
import Router, { useRouter } from "next/router";
import Layout from '../components/layout/layout';
import { v4 as uuidv4 } from 'uuid';
import { Formulario, Campo, InputSubmit, Error } from '../components/ui/Formulario';
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadString, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import useValidacion from "../hooks/useValidacion";
import validarCrearProducto from '../validacion/validarCrearProducto';

import { FirebaseContext } from '../firebase';

const STATE_INICIAL = {
    nombre: "",
    empresa: "",
    // imagen: "",
    url: "",
    descripcion: ""
}

export default function NuevoProducto() {

    // states de las imagenes
    const [nombreimagen, guardarNombreImagen] = useState("");
    const [subiendo, guardarSubiendo] = useState(false);
    const [progreso, guardarProgreso] = useState(0);
    const [urlimagen, guardarUrlImagen] = useState("");
    const [imageAsFile, setImageAsFile] = useState("");
    const [file, setFile] = useState(null);
    const [imageurl, setURL] = useState("");

    const [error, guardarError] = useState(false);

    const { valores, errores, handleChange, handleSubmit } = useValidacion(STATE_INICIAL, validarCrearProducto, crearProducto);
    const { nombre, empresa, imagen, url, descripcion } = valores;

    // hook de routing para redireccionar
    const router = useRouter();

    // context con las operaciones crud de firebase
    const { usuario, firebase } = useContext(FirebaseContext);

    async function crearProducto() {
        // si el usuario no esta autenticado llevar al login
        if (!usuario) {
            return router.push("/login");
        }

        // crea el objeto de nuevo producto
        const producto = {
            nombre,
            empresa,
            url,
            urlimagen,
            descripcion,
            votos: 0,
            comentarios: [],
            creado: Date.now()
        }

        // insertarlo en la base de datos
        try {
            await addDoc(collection(firebase.db, "productos"), producto);

            return router.push("/");

        } catch (error) {
            console.error("Error adding document: ", error);
        }
    }

    const salvarEnFirestore = async () => {
        // insertarlo en la base de datos
        try {
            if (file) {
                const id = uuidv4();
                const storageRef = ref(firebase.storage, `productos/${id}`);
                const uploadTask = await uploadBytesResumable(storageRef, file, 'data_url');

                const url = await getDownloadURL(uploadTask.ref);
                console.log("URL****", url)

                guardarUrlImagen(url);
            }
            else {
                console.log("Todavia no existe el archivo")
            }
        } catch (error) {
            console.error("Error saving document: ", error);
        }
    };

    async function handleFileChange(e) {
        setFile(e.target.files[0]);

        try {
            if (e.target.files[0]) {
                const id = uuidv4();
                const storageRef = ref(firebase.storage, `productos/${id}`);
                const uploadTask = await uploadBytesResumable(storageRef, e.target.files[0], 'data_url');

                const url = await getDownloadURL(uploadTask.ref);

                guardarUrlImagen(url);
            }
            else {
                console.log("Todavia no existe el archivo")
            }
        } catch (error) {
            console.error("Error saving document: ", error);
        }
    }

    return (
        <div>
            <Layout>
                <>
                    <h1
                        css={css`
                            text-align: center;
                            margin-top: 5rem;
                        `}
                    >Nuevo Producto</h1>

                    <Formulario
                        onSubmit={handleSubmit}
                        noValidate
                    >
                        <fieldset>
                            <legend>Información General</legend>

                            <Campo>
                                <label htmlFor="nombre">Nombre</label>
                                <input
                                    type="text"
                                    id="nombre"
                                    name="nombre"
                                    placeholder="Tu Nombre"
                                    value={nombre}
                                    onChange={handleChange}
                                />
                            </Campo>

                            {errores.nombre && <Error>{errores.nombre}</Error>}

                            <Campo>
                                <label htmlFor="empresa">Empresa</label>
                                <input
                                    type="text"
                                    id="empresa"
                                    name="empresa"
                                    placeholder="Nombre Empresa o Compañia"
                                    value={empresa}
                                    onChange={handleChange}
                                />
                            </Campo>

                            {errores.empresa && <Error>{errores.empresa}</Error>}

                            <Campo>
                                <label htmlFor="imagen">Imagen</label>
                                <input
                                    type="file"
                                    id="imagen"
                                    name="imagen"
                                    onChange={handleFileChange}
                                />

                            </Campo>

                            {errores.imagen && <Error>{errores.imagen}</Error>}

                            <Campo>
                                <label htmlFor="url">URL</label>
                                <input
                                    type="url"
                                    id="url"
                                    name="url"
                                    placeholder="URL de tu producto"
                                    value={url}
                                    onChange={handleChange}
                                />
                            </Campo>

                            {errores.url && <Error>{errores.url}</Error>}
                        </fieldset>

                        <fieldset>
                            <legend>Sobre tu Producto</legend>

                            <Campo>
                                <label htmlFor="descripcion">Descripción</label>
                                <textarea
                                    id="descripcion"
                                    name="descripcion"
                                    value={descripcion}
                                    onChange={handleChange}
                                />
                            </Campo>

                            {errores.descripcion && <Error>{errores.descripcion}</Error>}
                        </fieldset>

                        {error && <Error>{error}</Error>}

                        <InputSubmit
                            type="submit"
                            value="Crear Producto"
                        />
                    </Formulario>
                </>
            </Layout>
        </div>
    )
}