import React from 'react';
import { Navigate } from 'react-router-dom';
import { Role } from '../hooks/users/userSlice';

interface ProtectedRouteProps {
    allowedRoles: Role[];
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
    const user = localStorage.getItem('user') || sessionStorage.getItem('user');
    let role = user ? JSON.parse(user).role : 'RESIDENT';
    return allowedRoles.includes(role) ? <>{children}</> : <Navigate to="/404" replace />;
};

export default ProtectedRoute;