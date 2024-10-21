import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Typography, Box, CardContent, useTheme, CircularProgress, Alert, AlertTitle, LinearProgress } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import { useSelector } from 'react-redux';
import { AnnouncementsService } from '../../../../api/Anouncements';
import { UserState } from '../../../../hooks/users/userSlice';
import { Announcements } from '../../models';
import { useNavigate } from 'react-router-dom';
import { Warning } from '@mui/icons-material';

const AnnouncementPieChart = () => {
    const [publicidadTotal, setPublicidadTotal] = useState(0);
    const [serviciosTotal, setServiciosTotal] = useState(0);
    const [mantenimientoTotal, setMantenimientoTotal] = useState(0);
    const [reunionesTotal, setReunionesTotal] = useState(0);
    const [generalTotal, setGeneralTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const user = useSelector((state: { user: UserState }) => state.user);
    const theme = useTheme();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user.idComplex) return;
        const fetchAnnouncementsData = async () => {
            try {
                setIsLoading(true);
                const announcementsResponse = await axios.get(`${AnnouncementsService.baseUrl}${AnnouncementsService.endpoints.GetAnnouncementsByComplex}/${user.idComplex}`);
                const announcements: Announcements[] = announcementsResponse.data;

                setPublicidadTotal(announcements.filter(a => a.category === 'Publicidad').length);
                setServiciosTotal(announcements.filter(a => a.category === 'Servicios').length);
                setMantenimientoTotal(announcements.filter(a => a.category === 'Mantenimiento').length);
                setReunionesTotal(announcements.filter(a => a.category === 'Reuniones').length);
                setGeneralTotal(announcements.filter(a => a.category === 'General').length);
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
            }
        };

        fetchAnnouncementsData();
    }, [user.idComplex]);

    // Datos para el gráfico
    const pieData = [
        { label: 'Publicidad', value: publicidadTotal },
        { label: 'Servicios', value: serviciosTotal },
        { label: 'Mantenimiento', value: mantenimientoTotal },
        { label: 'Reuniones', value: reunionesTotal },
        { label: 'General', value: generalTotal },
    ];

    const totalAnnouncements = pieData.reduce((acc, curr) => acc + curr.value, 0);

    const colors = [
        theme.palette.primary.light,
        theme.palette.primary.main,
        theme.palette.primary.dark,
        theme.palette.secondary.light,
        theme.palette.secondary.main,
    ];

    return (
        <Card onClick={() => navigate('/app/announcements')} sx={{
            padding: '24px',
            textAlign: 'center',
            borderRadius: '12px',
            boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)',
            height: '100%',
            cursor: 'pointer',
        }}>
            {isLoading ? <CircularProgress /> : pieData.every(data => data.value === 0) ? (
                <Alert severity="warning" icon={<Warning />} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <AlertTitle>No hay anuncios</AlertTitle>
                </Alert>
            ) : (
                <CardContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Box>
                            <Typography variant="h6" >
                                Anuncios por categoría
                            </Typography>
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <PieChart
                                series={[
                                    {
                                        data: pieData.map((item, index) => ({
                                            value: item.value,
                                            color: colors[index],
                                        })),
                                        outerRadius: 100,
                                    },
                                ]}
                                height={300}
                                width={300}
                            />
                        </Box>
                        <Box sx={{ mt: 2, width: '100%' }}>
                            {pieData.map((item, index) => (
                                <Box key={index} sx={{ mb: 1 }}>
                                    <Typography variant="body2" color="textSecondary">
                                        {item.label}: {item.value} ({((item.value / totalAnnouncements) * 100).toFixed(2)}%)
                                    </Typography>
                                    <LinearProgress
                                        variant="determinate"
                                        value={(item.value / totalAnnouncements) * 100}
                                        sx={{ height: 10, borderRadius: 5, backgroundColor: colors[index] }}
                                    />
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </CardContent>
            )}
        </Card>
    );
};

export default AnnouncementPieChart;