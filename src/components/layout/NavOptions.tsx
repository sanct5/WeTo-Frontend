import { AccountBox, Dashboard, Announcement } from '@mui/icons-material';
import { Role } from '../../hooks/users/userSlice';
import React from 'react';

interface NavOptions {
    text: string;
    icon: React.ReactElement;
    link: string;
    role: Role[];
}

export const userOptions: NavOptions[] = [
    { text: 'Dashboard', icon: <Dashboard />, link: '/app/dashboard', role: ['ADMIN'] },
    { text: 'Anuncios', icon: <Announcement />, link: '/app/announcements', role: ['ADMIN', 'RESIDENT'] },
    { text: 'Perfil', icon: <AccountBox />, link: '/app/profile', role: ['ADMIN', 'RESIDENT'] },
];