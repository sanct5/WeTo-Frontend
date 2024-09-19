import { createTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import { UserState } from '../hooks/users/userSlice';
import { useEffect, useState } from 'react';
import { mainTheme } from '../theme/mainTheme';

export function useUserCustomTheme() {
  const { config } = useSelector((state: { user: UserState }) => state.user);

  // Valores por defecto del tema
  const [theme, setTheme] = useState(createTheme(mainTheme));

  useEffect(() => {
    if (!config || !config.primaryColor || !config.secondaryColor) return;

    // Actualizar el tema con los colores de la configuración del usuario si existen
    setTheme(createTheme({
      palette: {
        mode: 'light',
        primary: {
          main: config.primaryColor,
        },
        secondary: {
          main: config.secondaryColor,
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
    }));
  }, [config.primaryColor, config.secondaryColor]);

  return theme;
}