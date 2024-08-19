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
} from '@mui/material';
import TopBar from './TopBar';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, UserState, resetUser } from '../../hooks/users/userSlice';
import { toast } from 'react-toastify';
import { userOptions } from './NavOptions';
import { Role } from '../../hooks/users/userSlice';

const drawerWidth = 200;

export default function SideBar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    const handleDrawerClose = () => {
        setIsClosing(true);
        setMobileOpen(false);
    };

    const handleDrawerTransitionEnd = () => {
        setIsClosing(false);
    };

    const handleDrawerToggle = () => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen);
        }
    };

    //Función para cerrar sesión
    const handleLogout = () => {
        localStorage.clear();
        dispatch(resetUser());
        navigate("/login");
    }

    //Estado para almacenar los datos del usuario
    const user = useSelector((state: { user: UserState }) => state.user);

    const loggedUser = JSON.parse(localStorage.getItem('user') as string);

    //Si el usuario no está logueado y no marcó la casilla de "recuerdame", se redirige al login
    useEffect(() => {
        if (loggedUser) {
            dispatch(setUser(loggedUser));
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
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
            >
                <TopBar handleDrawerToggle={handleDrawerToggle} handleLogout={handleLogout} />
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onTransitionEnd={handleDrawerTransitionEnd}
                    onClose={handleDrawerClose}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: { xs: 0, md: 3 },
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
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