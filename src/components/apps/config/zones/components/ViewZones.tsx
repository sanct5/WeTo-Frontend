import { useState, useEffect } from 'react';
import {
    Box,
    Grid2,
    Card,
    CardContent,
    Typography,
    CircularProgress,
} from '@mui/material';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { UserState } from '../../../../../hooks/users/userSlice';
import { Announcement, CalendarMonth } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { format } from '@formkit/tempo';
import { useNavigate } from 'react-router-dom';

const ViewZones = () => {
    const [loading, setLoading] = useState(false);
    const [zonesList, setZonesList] = useState<any[]>([]);
    const user = useSelector((state: { user: UserState }) => state.user);
    const navigate = useNavigate();

    // Para obtener todas las zonas
    useEffect(() => {
        const getZones = async () => {
            setLoading(true);

            try {
                const response = await axios.get(`/api/zones`);
                const zones = response.data;
                setZonesList(zones);
            } catch (error) {
                toast.error('Error al cargar las zonas.');
            } finally {
                setLoading(false);
            }
        };

        getZones();
    }, []);

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
                                        cursor: 'pointer',
                                        transition: 'background-color 0.3s',
                                        '&:hover': { backgroundColor: '#f0f0f0' },
                                        display: 'flex',
                                        flexDirection: 'column',
                                        flexGrow: 1,
                                        height: '100%',
                                    }}
                                    onClick={() => navigate(`/zones/${zone._id}`)}
                                >
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Box display="flex" alignItems="center">
                                            <Typography variant="h6" sx={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                                                {zone.name}
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" sx={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                                            {zone.description}
                                        </Typography>
                                        <Typography variant="body1" sx={{ mt: 1 }}>
                                            Días disponibles: {zone.availableDays.join(', ')}
                                        </Typography>
                                        <Typography variant="body1" sx={{ mt: 1 }}>
                                            Horas disponibles: {`${format(zone.availableHours.start, { time: 'short' })} - ${format(zone.availableHours.end, { time: 'short' })}`}
                                        </Typography>
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