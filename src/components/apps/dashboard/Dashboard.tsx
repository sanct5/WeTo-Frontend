import { PieChart, Pie, LineChart, Line, XAxis, YAxis, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, CardContent, Grid2, Alert, AlertTitle, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import { People, Handyman, Interests, Groups, House, DateRangeRounded, CalendarMonth, PendingActions, Warning } from '@mui/icons-material';
import { format } from '@formkit/tempo';
import parse from 'html-react-parser';
import { AnnouncementsService } from '../../../api/Anouncements';
import { UserService } from '../../../api/UserService';
import { pqrsService } from '../../../api/Pqrs';
import { UserState } from '../../../hooks/users/userSlice';
import { useNavigate } from 'react-router-dom';
import { Announcements, Pqrs } from '../models';


const Dashboard = () => {
    const [pqrsData, setPqrsData] = useState<Pqrs[]>([]);
    const [residentesTotal, setResidentesTotal] = useState(0);
    const [publicidadTotal, setPublicidadTotal] = useState(0);
    const [serviciosTotal, setServiciosTotal] = useState(0);
    const [mantenimientoTotal, setMantenimientoTotal] = useState(0);
    const [reunionesTotal, setReunionesTotal] = useState(0);
    const [generalTotal, setGeneralTotal] = useState(0);
    const [latestRelevantAnnouncement, setLatestRelevantAnnouncement] = useState<Announcements>({
        _id: '',
        User: '',
        Title: '',
        Body: '',
        category: 'General',
        Date: new Date(),
        LastModify: new Date(),
        CreatedBy: '',
        isAdmin: false
    });

    const [isLoadingPqrs, setIsLoadingPqrs] = useState(false);
    const [isLoadingResidents, setIsLoadingResidents] = useState(false);
    const [isLoadingAnnouncements, setIsLoadingAnnouncements] = useState(false);

    const user = useSelector((state: { user: UserState }) => state.user);

    const navigate = useNavigate();

    const fetchDashboardData = async () => {
        try {
            setIsLoadingPqrs(true);
            const pqrsResponse = await axios.get(`${pqrsService.baseUrl}${pqrsService.endpoints.getPqrsByComplex}/${user.idComplex}`);
            const pqrs: Pqrs[] = pqrsResponse.data;
            setPqrsData(pqrs);
            setIsLoadingPqrs(false);

            setIsLoadingResidents(true);
            const residentsResponse = await axios.get(`${UserService.baseUrl}${UserService.endpoints.GetUsersByComplex}/${user.idComplex}`);
            const residents = residentsResponse.data;
            const filteredResidents = residents.filter((resident: any) => resident.role !== 'ADMIN');
            setResidentesTotal(filteredResidents.length);
            setIsLoadingResidents(false);

            setIsLoadingAnnouncements(true);
            const announcementsResponse = await axios.get(`${AnnouncementsService.baseUrl}${AnnouncementsService.endpoints.GetAnnouncementsByComplex}/${user.idComplex}`);
            const announcements: Announcements[] = announcementsResponse.data;

            setPublicidadTotal(announcements.filter(a => a.category === 'Publicidad').length);
            setServiciosTotal(announcements.filter(a => a.category === 'Servicios').length);
            setMantenimientoTotal(announcements.filter(a => a.category === 'Mantenimiento').length);
            setReunionesTotal(announcements.filter(a => a.category === 'Reuniones').length);
            setGeneralTotal(announcements.filter(a => a.category === 'General').length);

            const relevantAnnouncements = announcements
                .filter(a => ['Servicios', 'Mantenimiento', 'General', 'Reuniones'].includes(a.category))
                .sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime());

            if (relevantAnnouncements.length > 0) {
                setLatestRelevantAnnouncement(relevantAnnouncements[0]);
            }
            setIsLoadingAnnouncements(false);
        } catch (error) {
            setIsLoadingPqrs(false);
            setIsLoadingResidents(false);
            setIsLoadingAnnouncements(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, [user.idComplex]);

    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    const filteredPqrsData = pqrsData.filter(p => new Date(p.date) > last30Days);

    const getStartOfWeek = (date: Date) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    };

    const lineData = filteredPqrsData.reduce((acc: Record<string, { date: string; Pendiente: number; Cerrado: number; Tramite: number; Total: number }>, pqr) => {
        const date = getStartOfWeek(new Date(pqr.date)).toISOString().split('T')[0];
        if (!acc[date]) {
            acc[date] = { date, Pendiente: 0, Cerrado: 0, Tramite: 0, Total: 0 };
        }

        acc[date].Total++;
        switch (pqr.state) {
            case 'pendiente':
                acc[date].Pendiente++;
                break;
            case 'cerrado':
                acc[date].Cerrado++;
                break;
            case 'tramite':
                acc[date].Tramite++;
                break;
            default:
                break;
        }

        return acc;
    }, {});

    const lineChartData = Object.values(lineData).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const pieData = [
        { name: 'Publicidad', value: publicidadTotal },
        { name: 'Servicios', value: serviciosTotal },
        { name: 'Mantenimiento', value: mantenimientoTotal },
        { name: 'Reuniones', value: reunionesTotal },
        { name: 'General', value: generalTotal },
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6384'];

    const latestPqrs = pqrsData.slice(-5).reverse();

    const pqrsPendientesCount = pqrsData.filter(pqr => pqr.state === 'pendiente' || pqr.state === 'tramite').length;

    // Función personalizada para renderizar etiquetas
    const renderCustomizedLabel = ({ value }: { value: number }) => {
        return value > 0 ? value : null;
    };

    return (
        <Grid2 container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 4, md: 12 }} sx={{
            borderRight: '2px',
            borderBottom: '2px'
        }}>
            <Grid2 container size="grow" spacing={2}>
                <Card onClick={() => navigate('/app/residents')} sx={{
                    width: '100%',
                    padding: '24px',
                    textAlign: 'center',
                    borderRadius: '12px',
                    marginBottom: '16px',
                    boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)',
                    transition: '0.3s',
                    '&:hover': { transform: 'scale(1.05)', boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.2)' }
                }}>
                    <People color="success" style={{ fontSize: '50px' }} />
                    <Typography variant="h6" color="textSecondary">Residentes Totales</Typography>
                    <Typography variant="h4">
                        {isLoadingResidents ? <CircularProgress /> : residentesTotal > 0 ? residentesTotal : (
                            <Alert severity="warning" icon={<Warning />} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <AlertTitle>No hay residentes</AlertTitle>
                            </Alert>
                        )}
                    </Typography>
                </Card>
                <Card onClick={() => navigate('/app/cases')} sx={{
                    width: '100%',
                    padding: '24px',
                    textAlign: 'center',
                    borderRadius: '12px',
                    boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)',
                    transition: '0.3s',
                    '&:hover': { transform: 'scale(1.05)', boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.2)' }
                }}>
                    <PendingActions color="warning" style={{ fontSize: '50px' }} />
                    <Typography variant="h6" color="textSecondary">PQRS Pendientes</Typography>
                    <Typography variant="h4">
                        {isLoadingPqrs ? <CircularProgress /> : pqrsPendientesCount > 0 ? pqrsPendientesCount : (
                            <Alert severity="warning" icon={<Warning />} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <AlertTitle>No hay PQRS pendientes</AlertTitle>
                            </Alert>
                        )}
                    </Typography>
                </Card>
            </Grid2>

            <Grid2 container spacing={2} justifyContent="center" size={4}>
                <Grid2 component="div" size="grow">
                    <Card onClick={() => navigate('/app/announcements')} sx={{
                        padding: '24px',
                        textAlign: 'center',
                        borderRadius: '12px',
                        boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)',
                        transition: '0.3s',
                        height: '100%',
                        '&:hover': { transform: 'scale(1.05)', boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.2)' }
                    }}>
                        {isLoadingAnnouncements ? <CircularProgress /> : pieData.every(data => data.value === 0) ? (
                            <Alert severity="warning" icon={<Warning />} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <AlertTitle>No hay anuncios</AlertTitle>
                            </Alert>
                        ) : (
                            <ResponsiveContainer width="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        fill="#8884d8"
                                        label={renderCustomizedLabel}
                                    >
                                        {pieData.map((_entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </Card>
                </Grid2>
            </Grid2>

            <Grid2 container spacing={2} justifyContent="center" size={5}>
                <Grid2 component="div" size="grow">
                    <Card onClick={() => navigate('/app/cases')} sx={{
                        padding: '24px',
                        textAlign: 'center',
                        borderRadius: '12px',
                        boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)',
                        transition: '0.3s',
                        height: '100%',
                        '&:hover': { transform: 'scale(1.05)', boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.2)' }
                    }}>
                        {isLoadingPqrs ? <CircularProgress /> : lineChartData.length === 0 ? (
                            <Alert severity="warning" icon={<Warning />} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <AlertTitle>No hay PQRS</AlertTitle>
                            </Alert>
                        ) : (
                            <ResponsiveContainer width="100%">
                                <LineChart data={lineChartData}>
                                    <XAxis dataKey="date" tickFormatter={(date) => {
                                        const startDate = new Date(date);
                                        const endDate = new Date(startDate);
                                        endDate.setDate(startDate.getDate() + 6);
                                        return `${startDate.getDate()} - ${endDate.getDate()}`;
                                    }} />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="Pendiente" stroke="#8884d8" />
                                    <Line type="monotone" dataKey="Cerrado" stroke="#82ca9d" />
                                    <Line type="monotone" dataKey="Tramite" stroke="#ffc658" />
                                    <Line dataKey="Total" strokeOpacity={0} legendType='none' />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </Card>
                </Grid2>
            </Grid2>

            <Grid2 container spacing={2} justifyContent="center" size={6}>
                <Grid2 component="div" size="grow">
                    <Card onClick={() => navigate('/app/cases')} sx={{
                        padding: '24px',
                        textAlign: 'center',
                        borderRadius: '12px',
                        boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)',
                        transition: '0.3s',
                        height: '100%',
                        display: 'flex',
                        '&:hover': { transform: 'scale(1.05)', boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.2)' }
                    }}>
                        {isLoadingPqrs ? <CircularProgress /> : latestPqrs.length === 0 ? (
                            <Alert severity="warning" icon={<Warning />} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <AlertTitle>No hay datos de PQRS recientes</AlertTitle>
                            </Alert>
                        ) : (
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Asunto</TableCell>
                                            <TableCell>Residente</TableCell>
                                            <TableCell>Fecha</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {latestPqrs.map((pqr) => (
                                            <TableRow key={pqr._id}>
                                                <TableCell>{pqr.case}</TableCell>
                                                <TableCell>{pqr.userName}</TableCell>
                                                <TableCell>{new Date(pqr.date).toLocaleDateString()}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </Card>
                </Grid2>
            </Grid2>

            <Grid2 container spacing={2} justifyContent="center" size={6}>
                <Grid2 component="div" size="grow">
                    <Card onClick={() => navigate('/app/announcements')} sx={{
                        padding: '24px',
                        textAlign: 'center',
                        borderRadius: '12px',
                        boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)',
                        transition: '0.3s',
                        height: '100%',
                        '&:hover': { transform: 'scale(1.05)', boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.2)' }
                    }}>
                        <Typography variant="h6" color="textSecondary">Último Anuncio De Administración</Typography>
                        {isLoadingAnnouncements ? <CircularProgress /> : latestRelevantAnnouncement ? (
                            <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 275, width: '100%', position: 'relative' }}>
                                <Typography variant="h5" component="div" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                    {latestRelevantAnnouncement.category === 'Mantenimiento' ? <Handyman color='primary' /> :
                                        latestRelevantAnnouncement.category === 'Servicios' ? <House color='primary' /> :
                                            latestRelevantAnnouncement.category === 'General' ? <Interests color='primary' /> :
                                                latestRelevantAnnouncement.category === 'Reuniones' ? <Groups color='primary' /> : null}
                                    <Box sx={{ ml: 1 }}>
                                        {latestRelevantAnnouncement.Title}
                                    </Box>
                                </Typography>
                                <CardContent sx={{ textAlign: 'left', overflowY: 'auto', maxHeight: '200px' }}>
                                    <Typography variant="body2" component="p">
                                        {parse(latestRelevantAnnouncement.Body)}
                                    </Typography>
                                </CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-start', marginTop: 1, flexDirection: { xs: 'column', sm: 'row' }, padding: '16px' }}>
                                    <Typography variant="body2" component="p" sx={{ mr: 2 }}>
                                        <DateRangeRounded color='primary' sx={{ mr: 1 }} />
                                        Publicado el: {format(latestRelevantAnnouncement.Date, { date: "long", time: "short" })}
                                    </Typography>
                                    {latestRelevantAnnouncement.Date !== latestRelevantAnnouncement.LastModify && (
                                        <Typography variant="body2" component="p">
                                            <CalendarMonth color='secondary' sx={{ mr: 1 }} />
                                            Ultima modificación: {format(latestRelevantAnnouncement.LastModify, { date: "long", time: "short" })}
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        ) : (
                            <Alert severity="warning" icon={<Warning />} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <AlertTitle>No hay anuncios relevantes</AlertTitle>
                            </Alert>
                        )}
                    </Card>
                </Grid2>
            </Grid2>
        </Grid2>
    );
};

export default Dashboard;