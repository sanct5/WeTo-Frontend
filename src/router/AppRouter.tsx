import { createBrowserRouter, Navigate } from 'react-router-dom';
import NotFound404 from './pages/404';
import SignIn from '../components/auth/SignIn';
import SideBar from '../components/layout/SideBar';
import WorkingOn from './pages/WorkingOn';
import CreateForm from '../components/apps/residents/CreateForm';
import EditForm from '../components/apps/residents/EditForm';

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
            },
            // Residents
            {
                path: 'residents',
                element: <WorkingOn />,
            },
            {
                path: 'residents/:id',
                element: <WorkingOn />,
            },
            {
                path: 'residents/create',
                element: <CreateForm />,
            },
            {
                path: 'residents/edit/:id',
                element: <EditForm />,
            },
        ],
    },
]);

export default router;