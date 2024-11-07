import React, { FormEvent, useState } from 'react';
import { TextField, Container, Typography, Box, IconButton, Button, Checkbox, FormControlLabel } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useSelector } from 'react-redux';
import { UserState } from '../../../hooks/users/userSlice';
import { toast } from 'react-toastify';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import axios from 'axios';
import { DirectoryService } from '../../../api/Directory';
import { useNavigate } from 'react-router-dom';
import { Directory } from '../models';

const CreateFormDirectory = () => {
    const [formData, setFormData] = useState<Directory>({
        _id: '',
        userId: '',
        complexId: '',
        service: '',
        location: '',
        phone: '',
        hasWhatsApp: false,
        whatsAppNumber: null,
    });

    const [sameAsPhone, setSameAsPhone] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const user = useSelector((state: { user: UserState }) => state.user);
    const userId = user._id;
    const complexId = user.idComplex;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, checked } = e.target;
        setFormData((prevFormData) => {
            if (name === 'hasWhatsApp') {
                return {
                    ...prevFormData,
                    hasWhatsApp: checked,
                    whatsAppNumber: checked ? prevFormData.whatsAppNumber : null,
                };
            } else if (name === 'sameAsPhone') {
                setSameAsPhone(checked);
                return {
                    ...prevFormData,
                    whatsAppNumber: checked ? prevFormData.phone : '',
                };
            } else {
                return {
                    ...prevFormData,
                    [name]: value,
                    ...(name === 'phone' && sameAsPhone ? { whatsAppNumber: value } : {}),
                };
            }
        });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { service, location, phone, hasWhatsApp, whatsAppNumber } = formData;

        if (!service || !location || !phone || (hasWhatsApp && !whatsAppNumber)) {
            toast.error('Todos los campos son obligatorios');
            return;
        }

        setIsLoading(true);

        try {
            const directoryData = {
                userId,
                complexId,
                service,
                location,
                phone,
                hasWhatsApp,
                whatsAppNumber: hasWhatsApp ? (sameAsPhone ? phone : whatsAppNumber) : null,
            };

            await axios.post(`${DirectoryService.baseUrl}${DirectoryService.endpoints.AddDirectory}`, directoryData);
            toast.success('Servicio creado correctamente');
            navigate('/app/directory');
        } catch (error) {
            toast.error('No se pudo crear el servicio');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/app/directory');
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
                        Agregar nuevo servicio
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
                        id="service"
                        label="Servicio"
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        slotProps={{ htmlInput: { maxLength: 50 } }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="location"
                        label="Ubicación"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        slotProps={{ htmlInput: { maxLength: 80 } }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="phone"
                        label="Teléfono"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        slotProps={{ htmlInput: { maxLength: 15 } }}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={formData.hasWhatsApp}
                                onChange={handleChange}
                                name="hasWhatsApp"
                                color="primary"
                            />
                        }
                        label="Tiene WhatsApp"
                    />
                    {formData.hasWhatsApp && (
                        <>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={sameAsPhone}
                                        onChange={handleChange}
                                        name="sameAsPhone"
                                        color="primary"
                                    />
                                }
                                label="El número de WhatsApp es el mismo que el número de teléfono"
                            />
                            {!sameAsPhone && (
                                <TextField
                                    margin="normal"
                                    fullWidth
                                    id="whatsAppNumber"
                                    label="Número de WhatsApp"
                                    name="whatsAppNumber"
                                    value={formData.whatsAppNumber || ''}
                                    onChange={handleChange}
                                    disabled={!formData.hasWhatsApp}
                                    slotProps={{ htmlInput: { maxLength: 15 } }}
                                />
                            )}
                        </>
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

export default CreateFormDirectory;