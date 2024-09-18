import { useEffect, useState } from 'react';
import { Button, Grid, Typography, Box, CircularProgress } from '@mui/material';
import { MuiColorInput } from 'mui-color-input';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { ComplexService } from '../../../api/ComplexService';
import { setComplexColors, UserState } from '../../../hooks/users/userSlice';


interface ComplexColorsProps {
    primaryColor: string;
    secondaryColor: string;
}

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
        <Box p={3}>
            <ToastContainer />
            <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
                Colores de la Unidad Residencial
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Typography variant="body1">Color Primario</Typography>
                    <MuiColorInput
                        value={colors.primaryColor}
                        onChange={(newColor) => handleColorChange(newColor, 'primary')}
                        fullWidth
                        format='hex'
                        sx={{ backgroundColor: 'white'}}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="body1">Color Secundario</Typography>
                    <MuiColorInput
                        value={colors.secondaryColor}
                        onChange={(newColor) => handleColorChange(newColor, 'secondary')}
                        fullWidth
                        format='hex'
                        sx={{ backgroundColor: 'white' }}
                    />
                </Grid>
            </Grid>

            <Box mt={4} display="flex" justifyContent="flex-end">
                <Button variant="contained" color="primary" onClick={updateComplexColors}>
                    Guardar Cambios
                </Button>
            </Box>
        </Box>
    );
};

export default ComplexColors;
