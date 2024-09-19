import { useEffect, useState } from 'react';
import { Button, Typography, Box, CircularProgress } from '@mui/material';
import { MuiColorInput } from 'mui-color-input';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { ComplexService } from '../../../api/ComplexService';
import { setComplexColors, UserState } from '../../../hooks/users/userSlice';


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
    const [loading, setLoading] = useState<boolean>(true);

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

    const updateComplexColors = async () => {
        const payload = {
            primaryColor: colors.primaryColor,
            secondaryColor: colors.secondaryColor,
        };

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
    };


    useEffect(() => {
        if (user.idComplex) {
            fetchComplexColors();
        }
    }, [user.idComplex]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box maxWidth={800} padding={3} display={'flex'} flexDirection={'column'} >
            <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} sx={{justifyContent: 'center', alignItems: 'center'}} gap={3}>
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
                <Button variant="contained" color="secondary" sx={{mr: 2}} onClick={resetToDefaultColors}>
                    Restablecer Valores
                </Button>
                <Button variant="contained" color="primary" onClick={updateComplexColors}>
                    Guardar Cambios
                </Button>
            </Box>
        </Box>
    );
}

    export default ComplexColors;
