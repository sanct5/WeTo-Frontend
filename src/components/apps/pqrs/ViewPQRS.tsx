import { useState, useEffect } from 'react';
import {
    Box,
    Grid2,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Button,
} from '@mui/material';
import axios from 'axios';
import { Pqrs } from '../models';
import { pqrsService } from '../../../api/Pqrs';
import { useSelector } from 'react-redux';
import { UserState } from '../../../hooks/users/userSlice';
import { CalendarMonth, NotificationAdd } from '@mui/icons-material';
import { format } from '@formkit/tempo';
import CaseModal from '../cases/CaseModal';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import { HelpOutline, ReportProblem, Feedback, QuestionAnswer } from '@mui/icons-material';
import { toast } from 'react-toastify';

const ViewPQRS = () => {
    const [loading, setLoading] = useState(false);
    const [pqrsList, setpqrsList] = useState<Pqrs[]>([]);
    const [reloadFlag, setReloadFlag] = useState(false);
    const [selectedCase, setSelectedCase] = useState<Pqrs>({
        _id: '',
        user: '',
        userName: '',
        case: '',
        description: '',
        category: 'P',
        date: new Date(),
        state: 'pendiente',
        answer: [],
    });
    const [open, setOpen] = useState(false);
    const user = useSelector((state: { user: UserState }) => state.user);

    // Para obtener las PQRS del usuario
    useEffect(() => {
        const getPqrsByUser = async () => {
            setLoading(true);
            try {
                const response = await axios.get<Pqrs[]>(`${pqrsService.baseUrl}${pqrsService.endpoints.getByUser}/${user._id}`);
                const sortedPqrs = response.data.sort((a, b) => (a.date > b.date ? -1 : 1));
                setpqrsList(sortedPqrs);
            } catch (error) {
                toast.error('Error al cargar las PQRS.');
            }
            setLoading(false);
        };

        getPqrsByUser();
    }, [user._id, reloadFlag]);

    // Para notificar al administrador sobre PQRS pendientes sin respuesta en más de dos días
    const notifyAdmin = async () => {
        try {
            await axios.put(`${pqrsService.baseUrl}${pqrsService.endpoints.notifyAll}/${user._id}`);
            toast.success('Notificación enviada al administrador.');
        } catch (error) {
            toast.error('Error al enviar la notificación.');
        }
    };

    // Definir color según el estado de la PQRS
    const getStatusColor = (state: string) => {
        switch (state) {
            case 'pendiente':
                return '#FFC107';
            case 'tramite':
                return '#4CAF50';
            case 'cerrado':
                return '#F44336';
            default:
                return 'gray';
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'P':
                return <HelpOutline color="primary" sx={{ mr: 1 }} />;
            case 'Q':
                return <ReportProblem color="primary" sx={{ mr: 1 }} />;
            case 'R':
                return <Feedback color="primary" sx={{ mr: 1 }} />;
            case 'S':
                return <QuestionAnswer color="primary" sx={{ mr: 1 }} />;
            default:
                return 'Q';
        }
    };


    return (
        <Box sx={{ backgroundColor: '#F0F0F0', height: 'max-content', minHeight: '100vh', p: 2 }}>
            <Box display="none" justifyContent="flex-end" mb={2}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={notifyAdmin}
                    startIcon={<NotificationAdd />}
                >
                    Notificar al administrador
                </Button>
            </Box>

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                    <CircularProgress />
                    <Typography variant="body2" color="textSecondary" sx={{ ml: 2 }}>
                        Cargando PQRS...
                    </Typography>
                </Box>
            ) : (
                <Grid2 container columnSpacing={3} rowSpacing={2}>
                    {pqrsList.map((c) => (
                        <Card
                            sx={{
                                cursor: 'pointer',
                                transition: 'background-color 0.3s',
                                '&:hover': {
                                    backgroundColor: '#f0f0f0',
                                },
                                display: 'flex',
                                flexDirection: 'column',
                                flexGrow: 1,
                            }}
                            onClick={() => {
                                setOpen(true);
                                setSelectedCase(c);
                            }}
                        >
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Box display="flex" alignItems="center">
                                    <Typography variant="h6" sx={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                                        {c.case}
                                    </Typography>
                                </Box>
                                <Typography variant="body2" sx={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                                    {c.description}
                                </Typography>
                                <Typography variant='body1' sx={{ mt: 1 }}>
                                    {getCategoryIcon(c.category)}
                                    {c.category === 'P' ? 'Petición' : c.category === 'Q' ? 'Queja' : c.category === 'R' ? 'Reclamo' : 'Sugerencia'}
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 1, textTransform: 'capitalize' }}>
                                    <RadioButtonCheckedIcon sx={{ color: getStatusColor(c.state), mr: 1 }} />
                                    {c.state}
                                </Typography>
                                <Typography variant="body2" component="p" sx={{ mt: 1 }}>
                                    <CalendarMonth color="secondary" sx={{ mr: 1 }} />
                                    {format(c.date, { date: 'long', time: 'short' })}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Grid2>
            )}

            <CaseModal
                open={open}
                setOpen={setOpen}
                selectedCase={selectedCase}
                setSelectedCase={setSelectedCase}
                reloadFlag={reloadFlag}
                setReloadFlag={setReloadFlag}
            />
        </Box>
    );
};

export default ViewPQRS;

