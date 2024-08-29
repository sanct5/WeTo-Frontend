import React, { FormEvent, useState } from 'react';
import { TextField, MenuItem, Container, Typography, Box, IconButton, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useSelector } from 'react-redux';
import { UserState } from '../../../hooks/users/userSlice';
import { toast } from 'react-toastify';
import { Editor } from '@tinymce/tinymce-react';
import { AnnouncementCategory } from '../models';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import axios from 'axios';
import { AnnouncementsService } from '../../../api/Anouncements';
import { useNavigate } from 'react-router-dom';


const CreateFormAnnouncements = () => {
    const [formData, setFormData] = useState<{
        Title: string;
        Body: string;
        category: AnnouncementCategory;
    }>({
        Title: '',
        Body: '',
        category: 'General',
    });

    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const user = useSelector((state: { user: UserState }) => state.user);
    const User = user._id;

    const categories: AnnouncementCategory[] = [
        "General",
        "Mantenimiento",
        "Servicios",
        "Reuniones"
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleEditorChange = (Body: string) => {
        setFormData({
            ...formData,
            Body,
        });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validaciones
        const { Title, Body, category } = formData;

        if (!Title || !Body || !category) {
            toast.error('Todos los campos son obligatorios');
            return;
        }

        setIsLoading(true);

        try {
            const AnnouncementData = {
                ...formData,
                User,
            };

            // Llamada a la API
            await axios.post(`${AnnouncementsService.baseUrl}${AnnouncementsService.endpoints.AddAnnouncement}`, AnnouncementData);
            toast.success('Anuncio creado correctamente');
            navigate('/app/announcements');
        } catch (error) {
            toast.error('No se pudo crear el anuncio');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        toast.info('Los cambios no se guardaron');
        navigate('/app/announcements');
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ backgroundColor: 'white', borderRadius: '20px', padding: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <IconButton
                        color="secondary"
                        onClick={() => navigate('/app/announcements')}
                        sx={{ mr: 2 }}
                    >
                        <ArrowBackIosIcon />
                    </IconButton>
                    <Typography variant="h4">
                        Agregar nuevo anuncio
                    </Typography>
                </Box>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="Title"
                        label="Título"
                        name="Title"
                        value={formData.Title}
                        onChange={handleChange}
                    />
                    <Editor
                        apiKey='bfqew20400z8yzz2jqkg6yp4p7f6ur54kqikor53k2betw6u'
                        value={formData.Body}
                        init={{
                            height: 500,
                            menubar: false,
                            toolbar: 'undo redo | formatselect | bold italic backcolor | \
                          alignleft aligncenter alignright alignjustify | \
                          bullist numlist outdent indent | removeformat | fontsize | styles',
                            Body_css: 'https://www.tiny.cloud/css/codepen.min.css',
                        }}
                        onEditorChange={handleEditorChange}
                    />
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
                            loading={isLoading}
                            type="submit"
                            variant="contained"
                            sx={{ height: '50px' }}
                        >
                            Guardar
                        </LoadingButton>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default CreateFormAnnouncements;

