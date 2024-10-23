import { Toolbar, IconButton, Typography, Box, Dialog, Tooltip, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import Logout from '@mui/icons-material/Logout'
import AccountCircle from '@mui/icons-material/AccountCircle'
import { useSelector } from 'react-redux'
import { UserState } from '../../hooks/users/userSlice'
import { Link } from 'react-router-dom'
import { NotificationsActive, NotificationsPaused } from '@mui/icons-material'
import { PushNotificationsService } from '../../api/PushNotifications'
import axios from 'axios'
import { useEffect, useState } from 'react'
import NotifyExample from '../../assets/images/NotifyRequestExample.jpg'
import { toast } from 'react-toastify'
import { LoadingButton } from '@mui/lab'

interface TopBarProps {
    handleDrawerToggle: () => void;
    handleLogout: () => void;
}

const TopBar = ({ handleDrawerToggle, handleLogout }: TopBarProps) => {
    const user = useSelector((state: { user: UserState }) => state.user);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [openNotifications, setOpenNotifications] = useState(false);
    const [changeSubscription, setChangeSubscription] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const title = 'WeTo';

    const urlBase64ToUint8Array = (base64String: string) => {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    };


    useEffect(() => {
        const checkNotificationPermission = async () => {
            try {
                const permissionStatus = await navigator.permissions.query({ name: 'notifications' });
                const isSubscribed = await navigator.serviceWorker.ready.then(registration => registration.pushManager.getSubscription());

                if (permissionStatus.state === 'granted' && isSubscribed) {
                    setIsSubscribed(true);
                }
            } catch (error) {
                return console.error('Failed to check notification permission:', (error as any).message);
            }
        };

        checkNotificationPermission();
    }, [user._id, changeSubscription]);


    const subscribeUserToPush = async () => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            setIsLoading(true);
            if (Notification.permission !== 'granted') {
                const permission = await Notification.requestPermission();
                if (permission !== 'granted') {
                    setIsSubscribed(false);
                    setOpenNotifications(false);
                    setIsLoading(false);
                    toast.error('El usuario ha bloqueado las notificaciones');
                    return;
                }
            }

            const covertedVapidKey = urlBase64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY);

            try {
                const registration = await navigator.serviceWorker.ready;
                if (!registration) {
                    setIsSubscribed(false);
                    return;
                }

                const alreadySubscribed = await registration.pushManager.getSubscription();

                if (alreadySubscribed) {
                    toast.info('Ya estás suscrito a las notificaciones');
                    setIsSubscribed(true);
                    return;
                }

                const subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: covertedVapidKey
                });

                const subscriptionObject = subscription.toJSON();

                const subscriptionWithUserData = {
                    ...subscriptionObject,
                    userName: user.userName,
                    userRole: user.role,
                    userId: user._id,
                    userComplex: user.idComplex,
                };

                if (!subscriptionObject) {
                    toast.info('Ya estás suscrito a las notificaciones');
                } else {
                    const response = await axios.post(
                        `${PushNotificationsService.baseUrl}${PushNotificationsService.endpoints.subscribe}`,
                        subscriptionWithUserData
                    );
                    console.info(response.data);
                    toast.success('Notificaciones activadas correctamente');
                    setIsSubscribed(true);
                    setChangeSubscription(!changeSubscription);
                }
            } catch (error) {
                setIsSubscribed(false);
                setOpenNotifications(false);

                handleDeactiveNotifications();

                toast.error('No se pudo activar las notificaciones debido a un error');
                toast.info('Por favor intenta instalar la aplicación en otro navegador');
            } finally {
                setIsSubscribed(false);
                setOpenNotifications(false);
                setIsLoading(false);
            }
        } else {
            toast.error('Tu navegador no soporta notificaciones push');
            toast.info('Por favor intenta instalando la aplicación en otro navegador');
        }
    };

    const handleActiveNotifications = async () => {
        if (isSubscribed) return;
        setOpenNotifications(true);
    }

    const handleDeactiveNotifications = async () => {
        if (!isSubscribed) return;

        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        if (subscription) {
            const isUnsubscribed = await subscription.unsubscribe();
            if (isUnsubscribed) {
                await axios.post(`${PushNotificationsService.baseUrl}${PushNotificationsService.endpoints.unsubscribe}/${user._id}`);
                setIsSubscribed(false);
                toast.info('Notificaciones desactivadas correctamente');
            } else {
                toast.error('No se pudo desactivar las suscripción a las notificaciones');
            }
        }
    }

    return (
        <Toolbar>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ display: { xs: 'none', sm: 'block' } }}>
                        {title}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography color="inherit" noWrap sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}>
                        {user.userName}
                    </Typography>
                    <Tooltip title={isSubscribed ? "Notificaciones activas en este dispositivo" : "Notificaciones pausadas, toca el icono para activarlas"} arrow>
                        <IconButton
                            color="inherit"
                            onClick={isSubscribed ? handleDeactiveNotifications : handleActiveNotifications}
                        >
                            {isSubscribed ? <NotificationsActive /> : <NotificationsPaused />}
                        </IconButton>
                    </Tooltip>
                    <IconButton color="inherit" component={Link} to={`/app/profile/${user._id}`}>
                        <AccountCircle />
                    </IconButton>
                    <IconButton color="inherit" onClick={handleLogout}>
                        <Logout />
                    </IconButton>
                </Box>
            </Box>


            <Dialog open={openNotifications} onClose={() => setOpenNotifications(false)}>
                <DialogTitle>
                    ¿Deseas activar las notificaciones?
                </DialogTitle>
                <DialogContent>
                    <Typography mb={2}>
                        Activar las notificaciones te permitirá recibir alertas sobre los anuncios de administración, actualización de tus casos y más.
                        <br /><br />
                        Deberás <b>aceptar</b> las notificaciones en tu navegador.
                        <br />
                    </Typography>
                    <Typography>
                        Si tienes el modo no molestar activado, no recibirás las alertas pero podrás ver las notificaciones en tu bandeja de notificaciones.
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <img src={NotifyExample} alt="Ejemplo de notificación" style={{ width: '80%', marginTop: '5px' }} />
                    </Box>
                    <Typography mt={2}>
                        <b>Nota:</b> Solo puedes activar las notificaciones en un dispositivo a la vez.
                        <br />
                    </Typography>
                    <Typography variant="body2" sx={{ marginTop: 2 }}>
                        <b>ATENCIÓN SI USAS BRAVE EN COMPUTADOR:</b> para este navegador debes copiar y pegar el siguiente enlace en tu barra de búsqueda <b>brave://settings/privacy</b> y activar la opción <b>Usar servicios de Google para mensajes de inserción/push </b> para poder recibir notificaciones.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" color="secondary" onClick={() => setOpenNotifications(false)}>
                        Cancelar
                    </Button>
                    <LoadingButton
                        variant="contained"
                        color="primary"
                        loading={isLoading}
                        onClick={subscribeUserToPush}
                    >
                        Activar
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </Toolbar>
    )
}

export default TopBar;