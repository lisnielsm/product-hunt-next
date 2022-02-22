import React, { useState } from 'react';
import { css } from '@emotion/react';
import Router from "next/router";
import Layout from '../components/layout/layout';
import { Formulario, Campo, InputSubmit, Error } from '../components/ui/Formulario';

import useValidacion from "../hooks/useValidacion";
import validarCrearCuenta from '../validacion/validarCrearCuenta';

import firebase from '../firebase';
import { registrar } from '../firebase';

const STATE_INICIAL = {
    nombre: "",
    email: "",
    password: ""
}

export default function CrearCuenta() {

    const [error, guardarError] = useState(false);

    const { valores, errores, handleChange, handleSubmit, handleBlur } = useValidacion(STATE_INICIAL, validarCrearCuenta, crearCuenta);
    const { nombre, email, password } = valores;

    async function crearCuenta() {
        try {
            await registrar(nombre, email, password);
            Router.push("/");
        } catch (error) {
            console.error("Hubo un error al crear el usuario ", error.message);
            guardarError(error.message);
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
                    >Crear Cuenta</h1>

                    <Formulario
                        onSubmit={handleSubmit}
                        noValidate
                    >
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

                        { errores.nombre && <Error>{errores.nombre}</Error> }

                        <Campo>
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Tu Email"
                                value={email}
                                onChange={handleChange}
                            />
                        </Campo>

                        {errores.email && <Error>{errores.email}</Error>}

                        <Campo>
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Tu Password"
                                value={password}
                                onChange={handleChange}
                            />
                        </Campo>

                        {errores.password && <Error>{errores.password}</Error>}

                        {error && <Error>{error}</Error>}

                        <InputSubmit
                            type="submit"
                            value="Crear Cuenta"
                        />
                    </Formulario>
                </>
            </Layout>
        </div>
    )
}