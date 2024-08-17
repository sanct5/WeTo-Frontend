import { ReactNode } from 'react';
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { useUserCustomTheme } from '../hooks/applyUserAppTheme';

export const AppTheme = ({ children }: { children: ReactNode }) => {
    const theme = useUserCustomTheme();

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
}