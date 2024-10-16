import { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Grid2
} from '@mui/material';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { UserState } from '../../../hooks/users/userSlice';
import { Announcement, LocationOn, AccessTime, CalendarToday } from '@mui/icons-material';
import { Zone } from '../models';
import { ComplexService } from '../../../api/ComplexService';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const daysOfWeek = {
    Monday: 'Lunes',
    Tuesday: 'Martes',
    Wednesday: 'Miércoles',
    Thursday: 'Jueves',
    Friday: 'Viernes',
    Saturday: 'Sábado',
    Sunday: 'Domingo'
};

const ViewZones = () => {
    const [loading, setLoading] = useState(false);
    const [zonesList, setZonesList] = useState<Zone[]>([]);
    const user = useSelector((state: { user: UserState }) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user.idComplex) return;
        const getZones = async () => {
            setLoading(true);

            try {
                const response = await axios.get(`${ComplexService.baseUrl}${ComplexService.endpoints.GetZones}/${user.idComplex}`);
                const zones: Zone[] = response.data;
                setZonesList(zones);
            } catch (error) {
                return;
            } finally {
                setLoading(false);
            }
        };

        getZones();
    }, [user.idComplex]);

    return (
        <Box sx={{ backgroundColor: '#F0F0F0', height: 'max-content', minHeight: '100vh', p: 2 }}>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                    <CircularProgress />
                    <Typography variant="body2" color="textSecondary" sx={{ ml: 2 }}>
                        Cargando zonas...
                    </Typography>
                </Box>
            ) : (
                zonesList.length === 0 ? (
                    <Box display="flex" justifyContent="center" flexDirection="column" alignItems="center" height="50vh">
                        <Announcement color='primary' style={{ fontSize: 70, marginBottom: 10 }} />
                        <Typography variant="body1" color="textSecondary" textAlign="center">
                            No hay zonas disponibles.
                        </Typography>
                    </Box>
                ) : (
                    <Grid2 container spacing={2} columns={16} sx={{ display: 'flex', alignItems: 'stretch' }}>
                        {zonesList.map((zone) => (
                            <Grid2 size={{ xs: 16, sm: 8 }} key={zone._id} sx={{ display: 'flex' }}>
                                <Card
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        flexGrow: 1,
                                        height: '100%',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => navigate(`/app/zone/${user.idComplex}/${zone._id}`)}
                                >
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Box display="flex" alignItems="center">
                                            <LocationOn color="primary" sx={{ mr: 1 }} />
                                            <Typography variant="h6" sx={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                                                {zone.name}
                                            </Typography>
                                        </Box>
                                        <Box display="flex" alignItems="center" sx={{ mt: 1 }}>
                                            <CalendarToday color="secondary" sx={{ mr: 1 }} />
                                            <Typography variant="body1">
                                                Días disponibles: {zone.availableDays.map(day => daysOfWeek[day]).join(', ')}
                                            </Typography>
                                        </Box>
                                        <Box display="flex" alignItems="center" sx={{ mt: 1 }}>
                                            <AccessTime color="secondary" sx={{ mr: 1 }} />
                                            <Typography variant="body1">
                                                Horas disponibles: {dayjs(zone.availableHours.start).format('hh:mm A')} - {dayjs(zone.availableHours.end).format('hh:mm A')}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid2>
                        ))}
                    </Grid2>
                )
            )}
        </Box>
    );
};

export default ViewZones;