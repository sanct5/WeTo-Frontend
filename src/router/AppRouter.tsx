import { createBrowserRouter, Navigate } from 'react-router-dom';
import NotFound404 from './pages/404';
import SignIn from '../components/auth/SignIn';
import SideBar from '../components/layout/SideBar';
import WorkingOn from './pages/WorkingOn';
import CreateForm from '../components/apps/residents/CreateForm';
import EditForm from '../components/apps/residents/EditForm';
import ViewAll from '../components/apps/residents/ViewAll';
import CreateFormAnnouncements from '../components/apps/announcements/CreateForm';
import EditFormAnnouncements from '../components/apps/announcements/EditForm';
import ListAll from '../components/apps/announcements/ListAll';
import ProtectedRoute from './ProtectedRoute';


const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="login" replace />,
        errorElement: <NotFound404 />,
    },
    {
        path: '/404',
        element: <NotFound404 />,
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
                element: <ListAll />,
            },
            {
                path: 'announcements/create',
                element: <CreateFormAnnouncements />,
            },
            {
                path: 'announcements/edit/:id',
                element: <EditFormAnnouncements />,
            },
            {
                path: 'profile',
                element: <WorkingOn />,
            },
            // Residents
            {
                path: 'residents',
                element: <ViewAll />,
            },
            {
                path: 'residents/:id',
                element: <WorkingOn />,
            },
            {
                path: 'residents/create',
                element: (
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                        <CreateForm />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'residents/edit/:id',
                element: (
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                        <EditForm />
                    </ProtectedRoute>
                ),
            },
        ],
    },
]);

export default router;