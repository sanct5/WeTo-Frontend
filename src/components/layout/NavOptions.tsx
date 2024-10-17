import { Dashboard, Announcement, Groups, Sell, Apartment, QuestionAnswer, Help, NotificationImportant } from '@mui/icons-material';
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
    { text: 'Publicidad', icon: <Sell />, link: '/app/ads', role: ['ADMIN', 'RESIDENT'] },
    { text: 'Residentes', icon: <Groups />, link: '/app/residents', role: ['ADMIN'] },
    { text: 'PQRS', icon: <QuestionAnswer />, link: '/app/cases', role: ['ADMIN'] },
    { text: 'PQRS', icon: <Help />, link: '/app/pqrs', role: ['RESIDENT'] },
    { text: 'Configuración', icon: <Apartment />, link: '/app/config', role: ['ADMIN'] },
    { text: 'Tel.Emergencia', icon: <NotificationImportant />, link: '/app/numbers', role: ['ADMIN', 'RESIDENT'] },
    { text: 'Reservas', icon: <Apartment />, link: '/app/zone/', role: ['RESIDENT'] },
];