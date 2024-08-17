import { AccountBox, Dashboard, Announcement  } from '@mui/icons-material';
import React from 'react';

interface NavOptions {
    text: string;
    icon: React.ReactElement;
    link: string;
}

export const userOptions: NavOptions[] = [
    { text: 'Dashboard', icon: <Dashboard />, link: '/app/dashboard' },
    { text: 'Anuncios', icon: <Announcement />, link: '/app/announcements' },
    { text: 'Perfil', icon: <AccountBox />, link: '/app/profile' },
];