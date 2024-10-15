import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
    AppBar,
    Box,
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import TopBar from './TopBar';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, UserState, resetUser, setComplexColors } from '../../hooks/users/userSlice';
import { toast } from 'react-toastify';
import { userOptions } from './NavOptions';
import { Role } from '../../hooks/users/userSlice';
import axios from 'axios';
import { ComplexService } from '../../api/ComplexService';
import { PushNotificationsService } from '../../api/PushNotifications';

const drawerWidth = 200;

export default function SideBar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [mobileOpen, setMobileOpen] = useState(false);
    const [desktopOpen, setDesktopOpen] = useState(true);
    const [isClosing, setIsClosing] = useState(false);

    const handleDrawerClose = () => {
        setIsClosing(true);
        setMobileOpen(false);
    }

    const handleDrawerTransitionEnd = () => {
        setIsClosing(false);
    };

    const handleDrawerToggle = () => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen);
            setDesktopOpen(!desktopOpen);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        dispatch(resetUser());
        dispatch(setComplexColors({
            primaryColor: '#0097b2',
            secondaryColor: '#ff914d',
        }));
        navigate("/login");
    }

    const user = useSelector((state: { user: UserState }) => state.user);

    const loggedUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') as string);

    const fetchComplexColors = async () => {
        try {
            const response = await axios.get(`${ComplexService.baseUrl}${ComplexService.endpoints.ComplexColors}/${user.idComplex}`);
            dispatch(setComplexColors({ primaryColor: response.data.config.primaryColor, secondaryColor: response.data.config.secondaryColor }));
            if (user.stayLogged) {
                localStorage.setItem('user', JSON.stringify({ ...user, config: response.data.config }));
            } else {
                sessionStorage.setItem('user', JSON.stringify({ ...user, config: response.data.config }));
            }
        } catch (error) {
            return;
        }
    };

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

    const subscribeUserToPush = async () => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            const covertedVapidKey = urlBase64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY);
            try {
                const registration = await navigator.serviceWorker.ready;
                
                const subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: covertedVapidKey
                });

                console.log('User is subscribed:', subscription);

                const response = await axios.post(`${PushNotificationsService.baseUrl}${PushNotificationsService.endpoints.subscribe}`, JSON.stringify(subscription));
                
                console.log('User is subscribed:', response);

            } catch (error) {
                console.error('Failed to subscribe the user: ', error);
            }
        }
    };

    useEffect(() => {
        if (loggedUser) {
            dispatch(setUser(loggedUser));
            fetchComplexColors();
            subscribeUserToPush();
        }

        if (!user.isLogged && !loggedUser) {
            localStorage.clear();
            toast.error('Por favor inicia sesión nuevamente');
            navigate('/login');
        }
    }, [user.isLogged])

    const drawer = (
        <div>
            <Toolbar />
            <Divider />
            <List>
                {userOptions.map((item) => item.role.includes(user.role as Role) && (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton component={Link} to={item.link} onClick={handleDrawerClose}>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </div>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${desktopOpen ? drawerWidth : 0}px)` },
                    ml: { sm: `${desktopOpen ? drawerWidth : 0}px` },
                }}
            >
                <TopBar handleDrawerToggle={handleDrawerToggle} handleLogout={handleLogout} />
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: desktopOpen ? drawerWidth : 0 }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                {isMobile ? (
                    <Drawer
                        variant="temporary"
                        open={mobileOpen}
                        onTransitionEnd={handleDrawerTransitionEnd}
                        onClose={handleDrawerClose}
                        ModalProps={{
                            keepMounted: true,
                        }}
                        sx={{
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                        }}
                    >
                        {drawer}
                    </Drawer>
                ) : (
                    <Drawer
                        variant="persistent"
                        onTransitionEnd={handleDrawerTransitionEnd}
                        onClose={handleDrawerClose}
                        ModalProps={{
                            keepMounted: true,
                        }}
                        sx={{
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                        }}
                        open={desktopOpen}
                    >
                        {drawer}
                    </Drawer>
                )}
            </Box>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: { xs: 0, md: 3 },
                    width: { sm: `calc(100% - ${desktopOpen ? drawerWidth : 0}px)` },
                    ".MuiToolbar-root": {
                        display: 'flex',
                    },
                    backgroundColor: { sm: '#FFFFFF', md: '#F0F0F0' },
                    height: 'max-content',
                    minHeight: '100vh',
                }}
            >
                <Toolbar sx={{ marginBottom: 2 }} />
                <Outlet />
            </Box>
        </Box>
    );
}