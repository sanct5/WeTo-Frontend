import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, TextField, Box, Typography, IconButton, Button, MenuItem } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { toast } from 'react-toastify';
import { LoadingButton } from '@mui/lab';
import { AnnouncementsService } from '../../../api/Anouncements';
import { AnnouncementCategory } from '../models';
import { UserState } from '../../../hooks/users/userSlice';
import { useSelector } from 'react-redux';
import TinyEditor from '../../common/TinyEditor';

const EditFormAnnouncements = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        _id: id,
        Title: '',
        Body: '',
        category: 'General',
    });
    const [isLoading, setIsLoading] = useState(false);

    const [lastToastTime, setLastToastTime] = useState<number>(0);

    const user = useSelector((state: { user: UserState }) => state.user);


    const categories: AnnouncementCategory[] = [
        "General",
        "Mantenimiento",
        "Servicios",
        "Reuniones"
    ];

    useEffect(() => {
        const fetchAnnouncementData = async () => {
            try {
                const response = await axios.get(`${AnnouncementsService.baseUrl}${AnnouncementsService.endpoints.GetAnnouncementById}/${id}`);
                setFormData(response.data);
            } catch (error) {
                toast.error('Error al cargar los datos del anuncio');
            }
        };

        fetchAnnouncementData();
    }, [id]);

    const handleSubmit = async () => {
        const { Title, Body, category } = formData;

        // Validaciones
        if (!Title || !Body || !category) {
            toast.error('Todos los campos son obligatorios');
            return;
        }

        setIsLoading(true);
        try {
            await axios.put(`${AnnouncementsService.baseUrl}${AnnouncementsService.endpoints.UpdateAnnouncement}/${user._id}`, formData);
            toast.success('Anuncio actualizado correctamente');
            if (user.role === 'RESIDENT') {
                navigate('/app/ads');
            } else {
                navigate('/app/announcements');
            }
        } catch (error) {
            toast.error('Error al actualizar el anuncio');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleEditorChange = (content: string) => {
        const MAX_LENGTH = 3500;
        const currentTime = Date.now();
        if (content.length > MAX_LENGTH) {
            if (currentTime - lastToastTime > 5000) {
                toast.warning(`El contenido excede el límite de ${MAX_LENGTH} caracteres.`);
                setLastToastTime(currentTime);
            }
            content = content.substring(0, MAX_LENGTH);
        }
        setFormData({
            ...formData,
            Body: content,
        });
    };

    const handleCancel = () => {
        toast.info('Los cambios no se guardaron');
        if (user.role === 'RESIDENT') {
            navigate('/app/ads');
        } else {
            navigate('/app/announcements');
        }
    };

    return (
        <Container maxWidth="md" sx={{ backgroundColor: 'white', borderRadius: '20px', padding: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <IconButton
                    color="secondary"
                    onClick={() => navigate(user.role === 'RESIDENT' ? '/app/ads' : '/app/announcements')}
                    sx={{ mr: 2 }}
                >
                    <ArrowBackIosIcon />
                </IconButton>
                <Typography variant="h4">
                    Editar anuncio
                </Typography>
            </Box>
            <Box
                component="form"
                sx={{
                    gap: 1,
                    display: 'flex',
                    flexDirection: 'column',
                }}
                noValidate
                autoComplete="off"
            >
                <TextField
                    label="Título"
                    name="Title"
                    value={formData.Title}
                    onChange={handleChange}
                    size="medium"
                    slotProps={{ htmlInput: { maxLength: 100 } }}
                    fullWidth
                />
                <TinyEditor value={formData.Body} onEditorChange={handleEditorChange} />
                {user.role === 'RESIDENT' ? (
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="category"
                        label="Categoría"
                        name="category"
                        value="Publicidad"
                        slotProps={{ htmlInput: { readOnly: true } }}
                    />
                ) : (
                    <TextField
                        select
                        margin="normal"
                        required
                        fullWidth
                        id="category"
                        label="Categoría"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                    >
                        {categories.map((category) => (
                            <MenuItem key={category} value={category}>
                                {category}
                            </MenuItem>
                        ))}
                    </TextField>
                )}
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

export default EditFormAnnouncements;
