import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, TextField, Box, Typography, IconButton, Button, MenuItem } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { toast } from 'react-toastify';
import { LoadingButton } from '@mui/lab';
import { AnnouncementsService } from '../../../api/Anouncements';
import { AnnouncementCategory } from '../models';
import { Editor } from '@tinymce/tinymce-react';
import { UserState } from '../../../hooks/users/userSlice';
import { useSelector } from 'react-redux';

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
        navigate('/app/announcements');
    };

    return (
        <Container maxWidth="md" sx={{ backgroundColor: 'white', borderRadius: '20px', padding: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <IconButton
                    color="secondary"
                    onClick={() => navigate('/app/announcements')}
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
                    '& .MuiTextField-root': { m: 1, width: '100%' },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
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
                    inputProps={{ maxLength: 100 }}
                    fullWidth
                />
                <Editor
                    apiKey='bfqew20400z8yzz2jqkg6yp4p7f6ur54kqikor53k2betw6u'
                    value={formData.Body}
                    init={{
                        height: 500,
                        width: '100%',
                        menubar: false,
                        toolbar: 'undo redo | formatselect | bold italic backcolor | \
                        alignleft aligncenter alignright alignjustify | \
                        bullist numlist outdent indent | removeformat | fontsize | styles',
                        Body_css: 'https://www.tiny.cloud/css/codepen.min.css',
                    }}
                    onEditorChange={handleEditorChange}
                />
                {user.role === 'RESIDENT' ? (
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="category"
                        label="Categoría"
                        name="category"
                        value="Publicidad"
                        InputProps={{
                            readOnly: true,
                        }}
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
