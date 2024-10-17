import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {
    CardContent,
    Typography,
    Avatar,
    Box,
    CircularProgress,
    IconButton,
    Container,
    Card
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
        <Container maxWidth="sm" disableGutters sx={{ minHeight: { xs: '100%', sm: 'fit-content' }, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                    <CircularProgress />
                </Box>
            ) : zone ? (
                <Card sx={{ minHeight: { xs: '100%', sm: 'fit-content' }, backgroundColor: 'white', borderRadius: '20px', boxShadow: 3, width: '100%', maxWidth:'500px', padding: 3}}>
                    <CardContent>
                        <Box display="flex" alignItems="center" mb={2} sx={{ flexDirection: 'row' }}>
                            <IconButton
                                color="secondary"
                                onClick={() => navigate(-1)}
                                sx={{ mr: 2 }}
                            >
                                <ArrowBackIosIcon />
                            </IconButton>
                            <Typography variant="h5">Detalles de la zona</Typography>
                        </Box>
                        <Box display="flex" justifyContent="center" mb={3}>
                            <Avatar sx={{ bgcolor: 'primary.main', width: 64, height: 64 }}>
                                <DomainIcon fontSize="large" />
                            </Avatar>
                        </Box>
                        <Typography variant="h4" align="center" gutterBottom mb={3}>
                            {zone.name}
                        </Typography>
                        <Box mb={2}>
                            {zone.description && (
                                <Box mb={1}>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', flexDirection: { xs: 'column', sm: 'row' } }}>
                                        <Typography variant="body1" sx={{ mr: 2, wordWrap: 'break-word' }}>
                                            <InfoOutlined color="secondary" fontSize='large' sx={{ mr: 1 }} />
                                            <strong>Descripción:</strong> {zone.description}
                                        </Typography>
                                    </Box>
                                </Box>
                            )}
                            <Box mb={1}>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-start', flexDirection: { xs: 'column', sm: 'row' } }}>
                                    <Typography variant="body1" sx={{ mr: 2, wordWrap: 'break-word' }}>
                                        <CalendarToday color="secondary" fontSize='large' sx={{ mr: 1 }} />
                                        {zone.availableDays.map((day: string | number) => daysOfWeek[day as keyof typeof daysOfWeek]).join(', ')}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box mb={1}>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-start', flexDirection: { xs: 'column', sm: 'row' } }}>
                                    <Typography variant="body1" sx={{ mr: 2, wordWrap: 'break-word' }}>
                                        <AccessTime color="secondary" fontSize='large' sx={{ mr: 1 }} />
                                        {dayjs(zone.availableHours.start).format('hh:mm A')} - {dayjs(zone.availableHours.end).format('hh:mm A')}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
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