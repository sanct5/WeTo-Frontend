import { createTheme } from '@mui/material';

export const mainTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#0097b2',
        },
        secondary: {
            main: '#ff914d',
        },
        error: {
            main: '#d32f2f',
        },
        warning: {
            main: '#ed6c02',
        },
        info: {
            main: '#0288d1',
        },
        success: {
            main: '#2e7d32',
        },
    },
});