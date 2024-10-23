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
import { Button, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemText } from '@mui/material';
import { toast } from 'react-toastify';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => void;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const SignIn = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    //Estos estados se utilizan para manejar los inputs del formulario
    const [emailInput, setEmailInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [checkedRemember, setCheckedRemember] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showRecommendedBrowsers, setShowRecommendedBrowsers] = useState(false);
    const [openModal, setOpenModal] = useState(false);


    //Estados para almacenar si el usuario está autenticado y si se debe recordar
    const { isLogged, role } = useSelector((state: { user: UserState }) => state.user);

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

    // Manejador del evento beforeinstallprompt
    useEffect(() => {
        const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        // @ts-ignore
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            // @ts-ignore
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    // Función para mostrar el prompt de instalación
    const handleInstallClick = () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    setOpenModal(true);
                } else {
                    toast.info('Has cancelado la instalación de la aplicación, seguirás utilizando la versión web');
                }
                setDeferredPrompt(null);
            });
        }
    };

    //Si el usuario ya está logueado y marcó la casilla de recordar previamente, se redirige al dashboard
    useEffect(() => {
        const loggedUser = JSON.parse(localStorage.getItem('user') as string);

        if (loggedUser) {
            dispatch(setUser(loggedUser));
        }

        if (isLogged) {
            if (role === 'RESIDENT') {
                navigate('/app/announcements');
            } else {
                navigate('/app/dashboard');
            }
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
                    <Typography variant="body2" sx={{ mt: 2 }}>
                        Si tu navegadador te lo permite, abajo podrás instalar la aplicación de WeTo en tu dispositivo.
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
                        {deferredPrompt && (
                            <>
                                <Typography variant="body2">
                                    ¡Buenas noticias!
                                    Puedes instalar la aplicación de WeTo en tu dispositivo.
                                    Solo debes tener en cuenta que tu navegador la alojará.
                                    Esto quiere decir no ocupará espacio en tu dispositivo,
                                    y podrás acceder a ella desde tu escritorio o menú de aplicaciones nativo.
                                    Si borras el navegador, la aplicación se eliminará.
                                </Typography>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    sx={{ mt: 2 }}
                                    onClick={handleInstallClick}
                                    disabled={!deferredPrompt}
                                >
                                    Instalar aplicación
                                </Button>
                            </>
                        )}
                        <Collapse in={showRecommendedBrowsers}>
                            <List>
                                <ListItem>
                                    <ListItemText primary="Google Chrome" secondary="Sugerido por WeTo" />
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary="Microsoft Edge" />
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary="Safari" />
                                </ListItem>
                            </List>
                        </Collapse>
                        {!showRecommendedBrowsers && <Button
                            fullWidth
                            variant="text"
                            onClick={() => setShowRecommendedBrowsers(!showRecommendedBrowsers)}
                        >
                            Ver navegadores recomendados
                        </Button>}
                        {/* <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    ¿Olvidó su contraseña?
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

            <Dialog open={openModal} onClose={() => setOpenModal(false)}>
                <DialogTitle>
                    Instalación exitosa
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        La aplicación de WeTo se ha instalado correctamente en tu dispositivo.
                        Ahora podrás acceder a ella desde tu escritorio o menú de aplicaciones nativo.
                        No te preocupes por actualizarla, siempre tendrás la última versión disponible.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="primary" onClick={() => setOpenModal(false)}>
                        ¡Listo!
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    )
}

export default SignIn