import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Copyright } from '../common/Copyright';
import ImagotipoSinFondo from '../../assets/images/ImagotipoSinFondo.png';
import IsologoSinFondo from '../../assets/images/IsologoSinFondo.png';
import { useDispatch, useSelector } from 'react-redux';
import { setStayLogged, setUser, UserState } from '../../hooks/users/userSlice';
import { LoginUser } from '../../hooks/users/userThunks';
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';

const SignIn = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    //Estos estados se utilizan para manejar los inputs del formulario
    const [emailInput, setEmailInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [checkedRemember, setCheckedRemember] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    //Estados para almacenar si el usuario está autenticado y si se debe recordar
    const { isLogged } = useSelector((state: { user: UserState }) => state.user);

    //Verifica si el checkbox de recordar está marcado
    const handleChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCheckedRemember(event.target.checked);
    };

    //Función que se ejecuta al enviar el formulario
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        dispatch(setStayLogged(checkedRemember));
        const data = new FormData(e.currentTarget);
        // @ts-ignore
        await dispatch(LoginUser(data));
        setIsLoading(false);
    }

    //Si el usuario ya está logueado y marcó la casilla de recordar previamente, se redirige al dashboard
    useEffect(() => {
        const loggedUser = JSON.parse(localStorage.getItem('user') as string);

        if (loggedUser) {
            dispatch(setUser(loggedUser));
        }

        if (isLogged) {
            navigate('/app/announcements');
        }
    }, [isLogged]);

    return (
        <Grid container component="main" sx={{ minHeight: '100vh' }}>
            <Grid item xs={12} sm={12} md={6} component={Paper} elevation={6} square sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                    sx={{
                        my: 8,
                        mx: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'transparent', width: '50px', height: 'auto' }}>
                        <img src={IsologoSinFondo} alt="Isologo" />
                    </Avatar>
                    <Typography component="h2" variant="h5" sx={{ fontWeight: 'bold' }}>
                        ¡Bienvenid@!
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 3, maxWidth: { xs: '90%', sm: '70%' }, textAlign: 'justify' }}>
                        Inicia sesión con tu cuenta de correo electrónico y contraseña
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, maxWidth: { xs: '90%', sm: '70%' } }}>
                        <TextField
                            margin="normal"
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            fullWidth
                            id="email"
                            label="Correo electrónico"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            sx={{ backgroundColor: '#f4f4f4' }}
                        />
                        <TextField
                            margin="normal"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            fullWidth
                            name="password"
                            label="Contraseña"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            sx={{ backgroundColor: '#f4f4f4' }}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    onChange={handleChecked}
                                    color="primary"
                                />
                            }
                            label="Recuérdame"
                        />
                        <LoadingButton
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 4, height: '50px' }}
                            loading={isLoading}
                            loadingPosition="center"
                        >
                            Iniciar sesión
                        </LoadingButton>
                        {/* <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    ¿Olvidó su contraseña?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="#" variant="body2">
                                    {"¿No tienes una cuenta? Regístrate"}
                                </Link>
                            </Grid>
                        </Grid> */}
                        <Copyright sx={{ mt: 5 }} />
                    </Box>
                </Box>
            </Grid>
            <Grid
                item
                xs={0}
                sm={0}
                md={6}
                sx={{
                    backgroundImage: `url(${ImagotipoSinFondo})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: '#F0F0F0',
                    backgroundPosition: 'center',
                }}
            />
        </Grid>
    )
}

export default SignIn