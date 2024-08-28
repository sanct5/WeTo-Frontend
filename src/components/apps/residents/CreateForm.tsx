import React, { useState } from 'react';
import { TextField, MenuItem, Container, Typography, Box, IconButton, Button } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { UserState } from '../../../hooks/users/userSlice';
import { toast } from 'react-toastify';
import axios from 'axios';
import { UserService } from '../../../api/UserService';
import { LoadingButton } from '@mui/lab';

const CreateForm = () => {
    const [formData, setFormData] = useState({
        idDocument: '',
        userName: '',
        email: '',
        password: '',
        phone: '',
        apartment: '',
        role: 'RESIDENT',
    });
    const [isLoading, setIsLoading] = useState(false);

    const user = useSelector((state: { user: UserState }) => state.user);
    const idComplex = user.idComplex;

    const navigate = useNavigate();

    const handleSubmit = async () => {
        const { idDocument, userName, email, password, phone, apartment, role } = formData;

        // Validaciones
        if (!idDocument || !userName || !email || !password || !phone || !apartment || !role) {
            toast.error('Todos los campos son obligatorios');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error('El email debe ser válido y contener "@" y "."');
            return;
        }

        setIsLoading(true);

        setFormData({ ...formData });
        try {
            const userData = {
                ...formData,
                idComplex,
            };

            // Llamada a la API
            await axios.post(`${UserService.baseUrl}${UserService.endpoints.AddUser}`, userData);
            toast.success('Residente creado correctamente');
            navigate('/app/residents');
        } catch (error) {
            toast.error('La solicitud no fue exitosa, verifica los campos e inténtalo más tarde');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCancel = () => {
        toast.info('Los cambios no se guardaron');
        navigate('/app/residents');
    };

    return (
        <Container maxWidth="sm" sx={{ backgroundColor: 'white', borderRadius: '20px', padding: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <IconButton
                    color="secondary"
                    onClick={() => navigate('/app/residents')}
                    sx={{ mr: 2 }}
                >
                    <ArrowBackIosIcon />
                </IconButton>
                <Typography variant="h4">
                    Agregar nuevo residente
                </Typography>
            </Box>
            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '100%' },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
                noValidate
                autoComplete="off"
            >
                <TextField
                    label="Número de documento"
                    name="idDocument"
                    value={formData.idDocument}
                    onChange={handleChange}
                    size="medium"
                    fullWidth
                    inputProps={{ maxLength: 15 }}
                />
                <TextField
                    label="Nombre"
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    size="medium"
                    fullWidth
                    inputProps={{ maxLength: 80 }}
                />
                <TextField
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    size="medium"
                    fullWidth
                />
                <TextField
                    label="Contraseña"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    size="medium"
                    fullWidth
                    inputProps={{ minLength: 8, maxLength: 15 }}
                />
                <TextField
                    label="Número de teléfono"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    size="medium"
                    fullWidth
                    inputProps={{ maxLength: 15 }}
                />
                <TextField
                    label="Apartamento"
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleChange}
                    size="medium"
                    fullWidth
                    inputProps={{ maxLength: 50 }}
                />
                <TextField
                    select
                    label="rol"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    size="medium"
                    fullWidth
                >
                    <MenuItem value="RESIDENT">Resident</MenuItem>
                </TextField>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', mt: 2 }}>
                    <Button
                        color='secondary'
                        variant="outlined"
                        onClick={handleCancel}
                        sx={{ mr: 2, height: '50px' }}
                    >
                        Cancelar
                    </Button>
                    <LoadingButton
                        onClick={handleSubmit}
                        variant="contained"
                        sx={{ height: '50px' }}
                        loading={isLoading}
                        loadingPosition="center"
                    >
                        Guardar
                    </LoadingButton>
                </Box>
            </Box>
        </Container>
    );
};

export default CreateForm;