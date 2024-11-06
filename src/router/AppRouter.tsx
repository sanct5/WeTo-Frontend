import { createBrowserRouter, Navigate } from 'react-router-dom';
import NotFound404 from './pages/404';
import SignIn from '../components/auth/SignIn';
import SideBar from '../components/layout/SideBar';
import CreateForm from '../components/apps/residents/CreateForm';
import EditForm from '../components/apps/residents/EditForm';
import ViewAll from '../components/apps/residents/ViewAll';
import CreateFormAnnouncements from '../components/apps/announcements/CreateForm';
import EditFormAnnouncements from '../components/apps/announcements/EditForm';
import ProtectedRoute from './ProtectedRoute';
import AdTabs from '../components/apps/ads/AdTabs';
import ViewProfile from '../components/apps/profile/ViewProfile';
import ConfigTabs from '../components/apps/config/ConfigTabs';
import PQRSTabs from '../components/apps/pqrs/PqrsTabs';
import ViewCases from '../components/apps/cases/ViewCases';
import Dashboard from '../components/apps/dashboard/Dashboard';
import AllNumbers from '../components/apps/numbers/AllNumbers';
import AnnouncementTabs from '../components/apps/announcements/AnnouncementsTabs';
import CreateZoneForm from '../components/apps/config/zones/components/CreateForm';
import EditZoneForm from '../components/apps/config/zones/components/EditForm';
import ViewZone from '../components/apps/config/zones/components/ViewZone';
import BookingTabs from '../components/apps/booking/BookingTabs';
import DirectoryTabs from '../components/apps/directory/DirectoryTabs';
import CreateFormDirectory from '../components/apps/directory/CreateForm';
import EditFormDirectory from '../components/apps/directory/EditForm';


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
                element: <AnnouncementTabs />,
            },
            {
                path: 'announcements/create',
                element: <CreateFormAnnouncements setValue={() => { }} />,
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

            //Zones
            {
                path: 'config/createzone',
                element: (
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                        <CreateZoneForm />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'config/editzone/:id',
                element: (
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                        <EditZoneForm />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'zone',
                element: <BookingTabs />,
            },
            {
                path: 'zone/:idcomplex/:id',
                element: <ViewZone />,
            },

            //Numbers
            {
                path: 'numbers',
                element: < AllNumbers />,
            },

            //Directory
            {
                path: 'directory',
                element: <DirectoryTabs />,
            },
            {
                path: 'directory/create',
                element:
                    <ProtectedRoute allowedRoles={['RESIDENT']}>
                        <CreateFormDirectory />
                    </ProtectedRoute>
            },
            {
                path: 'directory/edit/:id',
                element: 
                    <ProtectedRoute allowedRoles={['RESIDENT']}>
                        <EditFormDirectory />
                    </ProtectedRoute>
            }
        ],
    },
]);

export default router;