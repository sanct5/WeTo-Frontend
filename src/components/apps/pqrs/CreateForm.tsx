import React, { FormEvent, useState } from 'react';
import { TextField, MenuItem, Container, Box, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useSelector } from 'react-redux';
import { UserState } from '../../../hooks/users/userSlice';
import { toast } from 'react-toastify';
import axios from 'axios';
import { pqrsService } from '../../../api/Pqrs';

interface CreateFormProps {
    setValue: (value: string) => void;
}

const CreateForm: React.FC<CreateFormProps> = ({ setValue }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<{
        category: string;
        subject: string;
        message: string;
    }>({
        category: 'P',
        subject: '',
        message: '',
    });

    const user = useSelector((state: { user: UserState }) => state.user);

    const categories = [
        { value: 'P', label: 'Petición' },
        { value: 'Q', label: 'Queja' },
        { value: 'R', label: 'Reclamo' },
        { value: 'S', label: 'Sugerencia' },
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { category, subject, message } = formData;

        if (!category || !subject || !message) {
            toast.error('Todos los campos son obligatorios');
            return;
        }

        setIsLoading(true);

        try {
            const pqrsData = {
                user: user._id,
                case: subject,
                description: message,
                category,
            };

            await axios.post(`${pqrsService.baseUrl}${pqrsService.endpoints.addPqrs}`, pqrsData);
            toast.success('PQRS creada correctamente');
            setValue('PQRS');
        } catch (error) {
            toast.error('No se pudo crear la PQRS');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        toast.info('Los cambios no se guardaron');
        setValue('PQRS');
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ backgroundColor: 'white', borderRadius: '8px', padding: 3, mt: 2 }}>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column-reverse', sm: 'row' } }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="subject"
                            label="Asunto"
                            name="subject"
                            value={formData.subject}
                            inputProps={{ maxLength: 150 }}
                            onChange={handleChange}
                            sx={{ mb: 2 }}
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
                            sx={{ mb: 2, ml: { xs: 0, sm: 2 } }}
                        >
                            {categories.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="message"
                        label="Mensaje"
                        name="message"
                        value={formData.message}
                        multiline
                        rows={6}
                        inputProps={{ maxLength: 1000 }}
                        onChange={handleChange}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', mt: 2 }}>
                        <Button
                            color="secondary"
                            variant="outlined"
                            onClick={handleCancel}
                            sx={{ mr: 2 }}
                        >
                            Cancelar
                        </Button>
                        <LoadingButton
                            loading={isLoading}
                            type="submit"
                            variant="contained"
                        >
                            Guardar
                        </LoadingButton>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default CreateForm;
