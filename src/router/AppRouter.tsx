import { createBrowserRouter, Navigate } from 'react-router-dom';
import NotFound404 from './pages/404';
import SignIn from '../components/auth/SignIn';
import SideBar from '../components/layout/SideBar';
import WorkingOn from './pages/WorkingOn';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="login" replace />,
        errorElement: <NotFound404 />,
    },
    {
        path: '/login',
        element: <SignIn />,
    },
    {
        path: '/app',
        element: <SideBar />,
        children: [
            {
                path: 'dashboard',
                element: <WorkingOn />,
            },
            {
                path: 'announcements',
                element: <WorkingOn />,
            },
            {
                path: 'profile',
                element: <WorkingOn />,
            }
        ],
    },
]);

export default router;