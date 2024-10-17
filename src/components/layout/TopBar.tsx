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

interface TopBarProps {
    handleDrawerToggle: () => void;
    handleLogout: () => void;
}

const TopBar = ({ handleDrawerToggle, handleLogout }: TopBarProps) => {
    const user = useSelector((state: { user: UserState }) => state.user);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [openNotifications, setOpenNotifications] = useState(false);

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
    }, [user._id]);

    const subscribeUserToPush = async () => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            if (Notification.permission !== 'granted') {
                const permission = await Notification.requestPermission();
                if (permission !== 'granted') {
                    setIsSubscribed(false);
                    setOpenNotifications(false);
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

                const subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: covertedVapidKey
                });

                console.log('User is subscribed:', subscription);

                const response = await axios.post(
                    `${PushNotificationsService.baseUrl}${PushNotificationsService.endpoints.subscribe}`,
                    JSON.stringify(subscription)
                );

                toast.success('Notificaciones activadas correctamente');
                console.log('User subscription response from server:', response);

            } catch (error) {
                console.error('Failed to subscribe the user:', (error as any).message);
                console.error('Error details:', error);
                setIsSubscribed(false);
                setOpenNotifications(false);
                toast.error('No se pudo activar las notificaciones, por favor intenta nuevamente');
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
                    <Tooltip title={isSubscribed ? "Notificaciones activas" : "Notificaciones pausadas, toca el icono para activarlas"} arrow>
                        <IconButton color="inherit" onClick={handleActiveNotifications}>
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
                    <Typography>
                        Activar las notificaciones te permitirá recibir alertas sobre los anuncios de administración, actualización de tus casos y más.
                        <br /><br />
                        Deberás <b>aceptar</b> las notificaciones en tu navegador.
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <img src={NotifyExample} alt="Ejemplo de notificación" style={{ width: '80%', marginTop: '5px' }} />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" color="secondary" onClick={() => setOpenNotifications(false)}>
                        No
                    </Button>
                    <Button variant="contained" color="primary" onClick={subscribeUserToPush}>
                        Sí
                    </Button>
                </DialogActions>
            </Dialog>
        </Toolbar>
    )
}

export default TopBar;