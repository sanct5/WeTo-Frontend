import { useState, useEffect } from 'react';
import {
    Box,
    Grid,
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
import { PriorityHigh, CalendarMonth, Person } from '@mui/icons-material';
import { format } from '@formkit/tempo';
import CaseModal from '../cases/CaseModal';;

const ViewPQRS = () => {
    const [loading, setLoading] = useState(false);
    const [pqrList, setPqrList] = useState<Pqrs[]>([]);
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
                const sortedPqrs = response.data.sort((a, b) => (a.date > b.date ? -1 : 1)); // Ordenar por fecha de envío, más recientes primero
                setPqrList(sortedPqrs);
            } catch (error) {
                console.error('Error fetching PQRS:', error);
            }
            setLoading(false);
        };

        getPqrsByUser();
    }, [user._id]);

    // Para notificar al administrador sobre PQRS pendientes sin respuesta en más de dos días
    const notifyAdmin = async () => {
        try {
            await axios.post(`${pqrsService.baseUrl}${pqrsService.endpoints.notifyAll}`, { userId: user._id });
            alert('Notificación enviada al administrador.');
        } catch (error) {
            console.error('Error notifying admin:', error);
        }
    };

    const renderPqrs = (pqrs: Pqrs[]) => (
        <Grid container spacing={2}>
            {pqrs.map((c) => (
                <Grid item xs={12} key={c._id}>
                    <Card
                        sx={{
                            marginBottom: 2,
                            cursor: 'pointer',
                            transition: 'background-color 0.3s',
                            '&:hover': {
                                backgroundColor: '#f0f0f0',
                            },
                        }}
                        onClick={() => {
                            setOpen(true);
                            setSelectedCase(c);
                        }}
                    >
                        <CardContent>
                            <Typography variant="h6" sx={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                                {c.case}
                            </Typography>
                            <Typography variant="body2" sx={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                                {c.description}
                            </Typography>
                            <Typography variant="body1" sx={{ mt: 1 }}>
                                <Person color="primary" sx={{ mr: 1 }} />
                                {c.userName}
                            </Typography>
                            <Typography variant="body2" component="p">
                                <CalendarMonth color="secondary" sx={{ mr: 1 }} />
                                {format(c.date, { date: 'long', time: 'short' })}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Estado: {c.state}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );

    return (
        <Box sx={{ backgroundColor: '#F0F0F0', height: 'max-content', minHeight: '100vh', p: 2 }}>
            <Box display="flex" justifyContent="flex-end" mb={2}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={notifyAdmin}
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
                <Box>
                    {renderPqrs(pqrList)}
                </Box>
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
