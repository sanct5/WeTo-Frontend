import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, TextField, Box, Typography, IconButton, Button } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { toast } from 'react-toastify';
import { LoadingButton } from '@mui/lab';
import { UserService } from '../../../api/UserService';

const EditForm = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        _id: id,
        idDocument: '',
        userName: '',
        email: '',
        password: '',
        phone: '',
        apartment: '',
        role: 'RESIDENT',
    });
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${UserService.baseUrl}${UserService.endpoints.GetUserById}/${id}`);
                setFormData(response.data);
            } catch (error) {
                toast.error('Error al cargar los datos del residente');
            }
        };

        fetchUserData();
    }, [id]);

    const handleSubmit = async () => {
        const { idDocument, userName, email, phone, apartment } = formData;

        // Validaciones
        if (!idDocument || !userName || !email || !phone || !apartment) {
            toast.error('Todos los campos son obligatorios');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error('El email debe ser válido y contener "@" y "."');
            return;
        }

        setIsLoading(true);
        try {
            await axios.put(`${UserService.baseUrl}${UserService.endpoints.UpdateUser}`, formData);
            toast.success('Residente actualizado correctamente');
            navigate('/app/residents');
        } catch (error) {
            toast.error('Error al actualizar el residente');
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
                    Editar residente
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
                        Guardar cambios
                    </LoadingButton>
                </Box>
            </Box>
        </Container>
    );
};

export default EditForm;