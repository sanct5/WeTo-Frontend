import { useEffect, useState } from 'react';
import { Typography, Box, CircularProgress } from '@mui/material';
import { MuiColorInput } from 'mui-color-input';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { ComplexService } from '../../../api/ComplexService';
import { setComplexColors, UserState } from '../../../hooks/users/userSlice';
import { LoadingButton } from '@mui/lab';

interface ComplexColorsProps {
    primaryColor: string;
    secondaryColor: string;
}

const defaultColors: ComplexColorsProps = {
    primaryColor: '#0097b2',
    secondaryColor: '#ff914d',
};

const ComplexColors = () => {
    const [colors, setColors] = useState<ComplexColorsProps>({ primaryColor: '#FFFFFF', secondaryColor: '#000000' });
    const [isLoading, setIsLoading] = useState(false);
    const [loading, setLoading] = useState(true);

    const user = useSelector((state: { user: UserState }) => state.user);

    const dispatch = useDispatch();

    const fetchComplexColors = async () => {
        try {
            const response = await axios.get(`${ComplexService.baseUrl}${ComplexService.endpoints.ComplexColors}/${user.idComplex}`);

            setColors({
                primaryColor: response.data.config.primaryColor,
                secondaryColor: response.data.config.secondaryColor,
            });
        } catch (error) {
            toast.error('Error al obtener los colores del complex.');
        } finally {
            setLoading(false);
        }
    };

    const isValidHexColor = (color: string) => /^#([0-9A-F]{3}|[0-9A-F]{6})$/i.test(color);

    const updateComplexColors = async () => {
        const payload = {
            primaryColor: colors.primaryColor,
            secondaryColor: colors.secondaryColor,
        };

        if (!isValidHexColor(payload.primaryColor) || !isValidHexColor(payload.secondaryColor)) {
            toast.error('Los colores deben estar en formato hexadecimal.');
            return;
        }

        setIsLoading(true);

        try {
            await axios.put(`${ComplexService.baseUrl}${ComplexService.endpoints.UpdateComplexColors}/${user.idComplex}`, payload);
            toast.success('Colores actualizados exitosamente.');
            dispatch(setComplexColors(payload));
            if (user.stayLogged) {
                localStorage.setItem('user', JSON.stringify({ ...user, config: payload }));
            } else {
                sessionStorage.setItem('user', JSON.stringify({ ...user, config: payload }));
            }
        } catch (error) {
            toast.error('Error al actualizar los colores.');
        }
        finally {
            setIsLoading(false);
        }
    };

    const handleColorChange = (color: string, type: 'primary' | 'secondary') => {
        setColors((prevColors) => ({
            ...prevColors,
            [type === 'primary' ? 'primaryColor' : 'secondaryColor']: color,
        }));
    };

    const resetToDefaultColors = async () => {
        const payload = {
            primaryColor: defaultColors.primaryColor,
            secondaryColor: defaultColors.secondaryColor,
        };

        setIsLoading(true);

        try {
            await axios.put(`${ComplexService.baseUrl}${ComplexService.endpoints.UpdateComplexColors}/${user.idComplex}`, payload);
            toast.success('Colores restablecidos a los valores predeterminados.');
            dispatch(setComplexColors(payload));
            if (user.stayLogged) {
                localStorage.setItem('user', JSON.stringify({ ...user, config: payload }));
            } else {
                sessionStorage.setItem('user', JSON.stringify({ ...user, config: payload }));
            }
            setColors(defaultColors);
        } catch (error) {
            toast.error('Error al restablecer los colores.');
        }
        finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user.idComplex) {
            fetchComplexColors();
        }
    }, [user.idComplex]);

    return (
        <Box display="flex" justifyContent="center" height="100vh">
            {loading ? (
                <Box display="flex" flexDirection={'column'} justifyContent="flex-start" alignItems="center" marginTop={5}>
                    <CircularProgress />
                    <Typography variant="body1" marginTop={2}>Cargando...</Typography>
                </Box>
            ) : (
                <Box maxWidth={800} padding={3} display={'flex'} flexDirection={'column'}>
                    <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} sx={{ justifyContent: 'center', alignItems: 'center' }} gap={3}>
                        <Box flex={1}>
                            <Typography variant="body1">Color Primario</Typography>
                            <MuiColorInput
                                value={colors.primaryColor}
                                onChange={(newColor) => handleColorChange(newColor, 'primary')}
                                fullWidth
                                format='hex'
                                sx={{ backgroundColor: 'white' }}
                            />
                        </Box>
                        <Box flex={1}>
                            <Typography variant="body1">Color Secundario</Typography>
                            <MuiColorInput
                                value={colors.secondaryColor}
                                onChange={(newColor) => handleColorChange(newColor, 'secondary')}
                                fullWidth
                                format='hex'
                                sx={{ backgroundColor: 'white' }}
                            />
                        </Box>
                    </Box>

                    <Box mt={4} display="flex" justifyContent="flex-end">
                        <LoadingButton
                            loading={isLoading}
                            variant="contained"
                            color="secondary"
                            onClick={resetToDefaultColors}
                            sx={{ mr: 2 }}
                        >
                            Restablecer Valores
                        </LoadingButton>
                        <LoadingButton
                            loading={isLoading}
                            variant="contained"
                            onClick={updateComplexColors}
                            color="primary"
                        >
                            Guardar
                        </LoadingButton>
                    </Box>
                </Box>
            )}
        </Box>
    );
}

export default ComplexColors;