import React, { useState } from 'react';
import { css } from '@emotion/react';
import Router from "next/router";
import Layout from '../components/layout/layout';
import { Formulario, Campo, InputSubmit, Error } from '../components/ui/Formulario';

import useValidacion from "../hooks/useValidacion";
import validarIniciarSesion from '../validacion/validarIniciarSesion';

// import { login } from '../firebase';
import firebase from '../firebase';

const STATE_INICIAL = {
    email: "",
    password: ""
}

export default function Login() {
    const [error, guardarError] = useState(false);

    const { valores, errores, handleChange, handleSubmit, handleBlur } = useValidacion(STATE_INICIAL, validarIniciarSesion, iniciarSesion);
    const { email, password } = valores;

    async function iniciarSesion() {
        try {
            const usuario = await firebase.login(email, password);
            Router.push("/");
        } catch (error) {
            console.error("Hubo un error al autenticar el usuario ", error.message);
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
                    >Iniciar Sesión</h1>

                    <Formulario
                        onSubmit={handleSubmit}
                        noValidate
                    >
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
                            value="Iniciar Sesión"
                        />
                    </Formulario>
                </>
            </Layout>
        </div>
    )
}