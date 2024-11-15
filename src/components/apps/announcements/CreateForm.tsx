import React, { FormEvent, useState } from 'react';
import { TextField, MenuItem, Container, Typography, Box, IconButton, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useSelector } from 'react-redux';
import { UserState } from '../../../hooks/users/userSlice';
import { toast } from 'react-toastify';
import { AnnouncementCategory } from '../models';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import axios from 'axios';
import { AnnouncementsService } from '../../../api/Anouncements';
import { useNavigate } from 'react-router-dom';
import TinyEditor from '../../common/TinyEditor';

interface CreateFormProps {
    setValue: (value: string) => void;
}

const CreateFormAnnouncements = ({ setValue }: CreateFormProps) => {
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
    const [lastToastTime, setLastToastTime] = useState<number>(0);
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

    const handleEditorChange = (content: string) => {
        const MAX_LENGTH = 3500;
        const currentTime = Date.now();
        const textContent = content.replace(/<img[^>]*>/g, ''); // Remove image tags from content
        if (textContent.length > MAX_LENGTH) {
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

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

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

            await axios.post(`${AnnouncementsService.baseUrl}${AnnouncementsService.endpoints.AddAnnouncement}`, AnnouncementData);
            toast.success('Anuncio creado correctamente');
            if (user.role === 'RESIDENT') {
                navigate('/app/ads');
            } else {
                setValue('all');
            }
        } catch (error) {
            toast.error('No se pudo crear el anuncio');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        if (user.role === 'RESIDENT') {
            navigate('/app/ads');
        } else {
            setValue('all');
        }
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ backgroundColor: 'white', borderRadius: '20px', padding: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <IconButton
                        color="secondary"
                        onClick={() => handleCancel()}
                        sx={{ mr: 2 }}
                    >
                        <ArrowBackIosIcon />
                    </IconButton>
                    <Typography variant="h4">
                        Agregar nuevo anuncio
                    </Typography>
                </Box>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{
                        gap: 1,
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="Title"
                        label="Título"
                        name="Title"
                        value={formData.Title}
                        slotProps={{ htmlInput: { maxLength: 100 } }}
                        onChange={handleChange}
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
