import { createBrowserRouter, Navigate } from 'react-router-dom';
import NotFound404 from './pages/404';
import SignIn from '../components/auth/SignIn';
import SideBar from '../components/layout/SideBar';
import CreateForm from '../components/apps/residents/CreateForm';
import EditForm from '../components/apps/residents/EditForm';
import ViewAll from '../components/apps/residents/ViewAll';
import CreateFormAnnouncements from '../components/apps/announcements/CreateForm';
import EditFormAnnouncements from '../components/apps/announcements/EditForm';
import ListAll from '../components/apps/announcements/ListAll';
import ProtectedRoute from './ProtectedRoute';
import AdTabs from '../components/apps/ads/AdTabs';
import ViewProfile from '../components/apps/profile/ViewProfile';
import ConfigTabs from '../components/apps/config/ConfigTabs';
import PQRSTabs from '../components/apps/pqrs/PqrsTabs';
import ViewCases from '../components/apps/cases/ViewCases';
import Dashboard from '../components/apps/dashboard/Dashboard';
import AllNumbers from '../components/apps/numbers/AllNumbers';

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
                element: (
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                        <Dashboard />
                    </ProtectedRoute>
                ),
            },

            // PQRS
            {
                path: 'cases',
                element: (
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                        <ViewCases />
                    </ProtectedRoute>
                )
            },
            {
                path: 'pqrs',
                element: (
                    <ProtectedRoute allowedRoles={['RESIDENT']}>
                        <PQRSTabs />
                    </ProtectedRoute>
                )
            },
            // Announcements
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
                element: (
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                        <ConfigTabs />
                    </ProtectedRoute>
                )
            },
            //Numbers
            {
                path: 'numbers',
                element: < AllNumbers/>,
            },
        ],
    },
]);

export default router;