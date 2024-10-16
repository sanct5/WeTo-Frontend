import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {
    Container,
    CardContent,
    Typography,
    Avatar,
    Box,
    CircularProgress,
    IconButton,
    Grid2
} from '@mui/material';
import DomainIcon from '@mui/icons-material/Domain';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { ComplexService } from '../../../../../api/ComplexService';
import { useSelector } from 'react-redux';
import { UserState } from '../../../../../hooks/users/userSlice';
import {
    ErrorOutline,
    CalendarToday,
    AccessTime,
    InfoOutlined
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

const daysOfWeek = {
    Monday: 'Lunes',
    Tuesday: 'Martes',
    Wednesday: 'Miércoles',
    Thursday: 'Jueves',
    Friday: 'Viernes',
    Saturday: 'Sábado',
    Sunday: 'Domingo'
};

const ViewZone = () => {
    const { id } = useParams<{ id: string }>();
    const user = useSelector((state: { user: UserState }) => state.user);
    const [zone, setZone] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user.idComplex || !id) return;
        const fetchZoneById = async (idComplex: string, id: string) => {
            try {
                const response = await axios.get(`${ComplexService.baseUrl}${ComplexService.endpoints.GetZoneById}/${idComplex}/${id}`);
                setZone(response.data);
            } catch (error) {
                toast.error('Ocurrió un error al obtener la información de la zona');
            } finally {
                setLoading(false);
            }
        };

        fetchZoneById(user.idComplex, id);
    }, [user.idComplex, id]);


    return (
        <Container maxWidth="sm" sx={{ height: { xs: '100vh', sm: 'fit-content' }, backgroundColor: 'white', borderRadius: '20px', padding: 2, boxShadow: 3 }}>
            <Box display="flex" alignItems="center" mb={2}>
                <IconButton
                    color="secondary"
                    onClick={() => navigate(-1)}
                    sx={{ mr: 2 }}
                >
                    <ArrowBackIosIcon />
                </IconButton>
                <Typography variant="h5">Detalles de la zona</Typography>
            </Box>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                    <CircularProgress />
                </Box>
            ) : zone ? (
                <CardContent>
                    <Box display="flex" justifyContent="center" mb={3}>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 64, height: 64 }}>
                            <DomainIcon fontSize="large" />
                        </Avatar>
                    </Box>
                    <Typography variant="h4" align="center" gutterBottom mb={3}>
                        {zone.name}
                    </Typography>
                    <Grid2 container spacing={2}>
                        {zone.description && (
                            <Grid2 container spacing={2} alignItems="center">
                                <Grid2 size={{ xs: 2 }} container alignItems="center">
                                    <InfoOutlined color="secondary" fontSize='large' />
                                </Grid2>
                                <Grid2 size={{ xs: 10 }} container alignItems="center">
                                    <Typography variant="body1"><strong>Descripción:</strong> {zone.description}</Typography>
                                </Grid2>
                            </Grid2>
                        )}
                        <Grid2 size={{ xs: 2 }} container alignItems="center">
                            <CalendarToday color="secondary" fontSize='large' />
                        </Grid2>
                        <Grid2 size={{ xs: 10 }} container alignItems="center">
                            <Typography variant="body1"><strong>Días disponibles:</strong> {zone.availableDays.map((day: string | number) => daysOfWeek[day as keyof typeof daysOfWeek]).join(', ')}</Typography>
                        </Grid2>

                        <Grid2 size={{ xs: 2 }} container alignItems="center">
                            <AccessTime color="secondary" fontSize='large' />
                        </Grid2>
                        <Grid2 size={{ xs: 10 }} container alignItems="center">
                            <Typography variant="body1"><strong>Horas disponibles:</strong> {dayjs(zone.availableHours.start).format('hh:mm A')} - {dayjs(zone.availableHours.end).format('hh:mm A')}</Typography>
                        </Grid2>
                    </Grid2>
                </CardContent>
            ) : (
                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100%">
                    <ErrorOutline sx={{ fontSize: 40, mb: 2 }} color='primary' />
                    <Typography variant="h5" align="center" gutterBottom>
                        No se encontró la zona
                    </Typography>
                    <Typography variant="body1" align="center">
                        Por favor, verifica la información e intenta nuevamente.
                    </Typography>
                </Box>
            )}
        </Container>
    );
};

export default ViewZone;