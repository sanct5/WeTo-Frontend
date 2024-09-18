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
import AdTabs from '../components/apps/ads/AdTabs';
import ViewProfile from '../components/apps/profile/ViewProfile';


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
            // Announcements
            {
                path: 'announcements',
                element: <ListAll />,
            },
            {
                path: 'cases',
                element: <WorkingOn />,
            },
            {
                path: 'pqrs',
                element: <WorkingOn />,
            },
            {
                path: 'pqrs/create',
                element: <WorkingOn />,
            },
            {
                path: 'announcements/create',
                element: <CreateFormAnnouncements />,
            },
            {
                path: 'announcements/edit/:id',
                element: <EditFormAnnouncements />,
            },
            // Ads
            {
                path: 'ads',
                element: <AdTabs />,
            },
            // Profile
            {
                path: 'profile/:id',
                element: <ViewProfile />,
            },
            // Residents
            {
                path: 'residents',
                element: (
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                        <ViewAll />
                    </ProtectedRoute>
                ),
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
            {
                path: 'config',
                element: <WorkingOn />,
            }
        ],
    },
]);

export default router;