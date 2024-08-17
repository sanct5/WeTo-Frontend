import { setUser } from "./userSlice";
import { toast } from 'react-toastify';
import { AuthService } from "../../api/AuthService";
import axios, { AxiosError } from 'axios';
import { Dispatch } from "@reduxjs/toolkit";

// POST
//LoginUser es un thunk que se encarga de realizar la petición POST al backend para iniciar sesión
export const LoginUser = (data: FormData) => {
    return async (dispatch: Dispatch, getState: any) => {
        const email = (data.get('email') as string).trim();
        const password = (data.get('password') as string).trim();

        //Validaciones de los campos del formulario
        if (!email || !email.includes('@') || !email.includes('.')) {
            toast.warn('El campo de correo electrónico no es válido y no puede estar vacío');
            return;
        }
        if (!password) {
            toast.warn('El campo de contraseña no puede estar vacío');
            return;
        }

        //Petición POST al backend
        try {
            const response = await axios.post(`${AuthService.baseUrl}${AuthService.endpoints.login}`, {
                email: email,
                password: password,
            });

            const loginResponse = response.data;

            const user = {
                idDocument: loginResponse.userData.idDocument,
                name: loginResponse.userData.fullName,
                email: loginResponse.userData.email,
                phone: loginResponse.userData.phoneNumber,
                config: loginResponse.userData.userConfig,
                isLogged: true,
            }

            dispatch(setUser(user));

            const token = 'Bearer ' + loginResponse.accessToken;
            localStorage.setItem('token', token);

            const { stayLogged } = getState().user;

            if (stayLogged) {
                localStorage.setItem('user', JSON.stringify(user));
            }

            toast.success(`Bienvenid@ ${user.name}`);
        } catch (error) {
            const res = (error as AxiosError).response?.status;
            if (res === 400) {
                if ((error as AxiosError).response?.data === 'User is not active') {
                    toast.warn('Tu cuenta no está activa, contacta al administrador del sitio');
                } else {
                    toast.warn('Correo electrónico o contraseña incorrectos');
                }
            } else if (res === 404) {
                toast.info('No se encontró el recurso solicitado');
            } else {
                toast.warn('Algo salió mal, no eres tu, somos nosotros, inténtalo de nuevo más tarde');
            }
        }
    };
};