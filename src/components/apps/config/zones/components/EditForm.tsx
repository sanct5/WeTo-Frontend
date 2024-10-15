import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, TextField, Box, Typography, IconButton, Button, Checkbox, FormControlLabel, FormGroup, useMediaQuery } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { toast } from 'react-toastify';
import { LoadingButton } from '@mui/lab';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import { ComplexService } from '../../../../../api/ComplexService';
import { useSelector } from 'react-redux';
import { UserState } from '../../../../../hooks/users/userSlice';

const daysOfWeek = {
    Monday: 'Lunes',
    Tuesday: 'Martes',
    Wednesday: 'Miércoles',
    Thursday: 'Jueves',
    Friday: 'Viernes',
    Saturday: 'Sábado',
    Sunday: 'Domingo'
};

const EditZoneForm = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        zoneName: '',
        description: '',
        availableDays: [] as string[],
        availableHours: {
            start: dayjs().hour(13).minute(0).second(0), 
            end: dayjs().hour(14).minute(0).second(0),  
        },
    });
    const [isLoading, setIsLoading] = useState(false);

    const user = useSelector((state: { user: UserState }) => state.user);

    const isMobile = useMediaQuery('(max-width:600px)');

    useEffect(() => {
        const fetchZoneData = async () => {
            const response = await axios.get(`${ComplexService.baseUrl}${ComplexService.endpoints.GetZoneById}/${user.idComplex}/${id}`);
            const zone = response.data;
            setFormData({
                zoneName: zone.name,
                description: zone.description,
                availableDays: zone.availableDays,
                availableHours: {
                    start: dayjs(zone.availableHours.start),
                    end: dayjs(zone.availableHours.end),
                },
            });
        };

        fetchZoneData();
    }, [id]);

    const handleSubmit = async () => {
        const { zoneName, description, availableDays, availableHours } = formData;

        if (!zoneName) {
            toast.error('Debe completar los campos obligatorios');
            return;
        }

        if (availableDays.length === 0) {
            toast.error('Debe seleccionar al menos un día disponible');
            return;
        }

        if (availableHours.start.isAfter(availableHours.end) || availableHours.start.isSame(availableHours.end)) {
            toast.error('La hora de apertura debe ser menor a la hora de cierre');
            return;
        }

        setIsLoading(true);

        try {
            const zoneData = {
                name: zoneName,
                description,
                availableDays,
                availableHours: {
                    start: availableHours.start.toDate(),
                    end: availableHours.end.toDate(),
                },
            };

            zoneData.availableDays = 

            await axios.put(`${ComplexService.baseUrl}${ComplexService.endpoints.UpdateZone}/${user.idComplex}/${id}`, zoneData);
            toast.success('Zona actualizada correctamente');
            navigate('/app/config');
        } catch (error) {
            toast.error('Error al actualizar la zona');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleDayChange = (day: string) => {
        const selectedDays = formData.availableDays.includes(day)
            ? formData.availableDays.filter((d) => d !== day)
            : [...formData.availableDays, day];

        setFormData({ ...formData, availableDays: selectedDays });
    };

    const handleTimeChange = (name: string, newValue: Dayjs | null) => {
        if (newValue) {
            setFormData({ ...formData, availableHours: { ...formData.availableHours, [name]: newValue } });
        }
    };

    const handleCancel = () => {
        toast.info('Los cambios no se guardaron');
        navigate('/app/config');
    };

    return (
        <Container maxWidth="sm" sx={{ backgroundColor: 'white', borderRadius: '20px', padding: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <IconButton
                    color="secondary"
                    onClick={() => navigate('/app/config')}
                    sx={{ mr: 2 }}
                >
                    <ArrowBackIosIcon />
                </IconButton>
                <Typography variant="h4">
                    Editar zona
                </Typography>
            </Box>
            <Box
                component="form"
                sx={{
                    gap: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
                noValidate
                autoComplete="off"
            >
                <TextField
                    label="Nombre de la Zona"
                    name="zoneName"
                    value={formData.zoneName}
                    onChange={handleChange}
                    size="medium"
                    fullWidth
                    required
                />
                <TextField
                    label="Descripción"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    size="medium"
                    fullWidth
                    multiline
                    rows={4}
                />

                <Typography variant="h6">Días disponibles</Typography>
                <FormGroup row sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 2fr)' }, justifyContent: 'center', gap: 2 }}>
                    {Object.entries(daysOfWeek).map(([english, spanish]) => (
                        <FormControlLabel
                            key={english}
                            control={
                                <Checkbox
                                    checked={formData.availableDays.includes(english)}
                                    onChange={() => handleDayChange(english)}
                                />
                            }
                            label={spanish}
                            sx={{ flex: '1 0 30%' }}
                        />
                    ))}
                </FormGroup>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: 2,
                        width: '100%',
                    }}
                >
                    {isMobile ? (
                        <>
                            <MobileTimePicker
                                label="Hora de Apertura"
                                value={formData.availableHours.start}
                                onChange={(newValue) => handleTimeChange('start', newValue)}
                                views={['hours']}
                                sx={{ flex: 1 }}
                            />
                            <MobileTimePicker
                                label="Hora de Cierre"
                                value={formData.availableHours.end}
                                onChange={(newValue) => handleTimeChange('end', newValue)}
                                views={['hours']}
                                sx={{ flex: 1 }}
                            />
                        </>
                    ) : (
                        <>
                            <DesktopTimePicker
                                label="Hora de Apertura"
                                value={formData.availableHours.start}
                                onChange={(newValue) => handleTimeChange('start', newValue)}
                                views={['hours']}
                                sx={{ flex: 1 }}
                            />
                            <DesktopTimePicker
                                label="Hora de Cierre"
                                value={formData.availableHours.end}
                                onChange={(newValue) => handleTimeChange('end', newValue)}
                                views={['hours']}
                                sx={{ flex: 1 }}
                            />
                        </>
                    )}
                </Box>

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

export default EditZoneForm;