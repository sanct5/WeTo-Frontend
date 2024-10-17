import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { UserState } from '../../../../hooks/users/userSlice';
import { Link, useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Container,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogActions,
    CircularProgress,
} from '@mui/material';
import { AddBox, Delete, Edit } from '@mui/icons-material';
import WarningIcon from '@mui/icons-material/Warning';
import { toast } from 'react-toastify';
import { Zone } from '../../models';
import dayjs from 'dayjs';
import { ComplexService } from '../../../../api/ComplexService';
import axios from 'axios';

const daysInSpanish: { [key: string]: string } = {
    Monday: 'Lu',
    Tuesday: 'Ma',
    Wednesday: 'Mi',
    Thursday: 'Ju',
    Friday: 'Vi',
    Saturday: 'Sa',
    Sunday: 'Do'
};

const ViewAll = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [reloadFlag, setReloadFlag] = useState<boolean>(false);
    const [zones, setZones] = useState<Zone[]>([]);
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const [selectedZone, setSelectedZone] = useState<any>({ zoneId: '', zoneName: '' });
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    const navigate = useNavigate();
    const user = useSelector((state: { user: UserState }) => state.user);

    useEffect(() => {
        if (!user.idComplex) return;
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${ComplexService.baseUrl}${ComplexService.endpoints.GetZones}/${user.idComplex}`);
                const data = response.data;
                const sortedZones = data.sort((a: Zone, b: Zone) => a.name.localeCompare(b.name));
                setZones(sortedZones);
            } catch (error) {
                toast.error('Error al obtener las zonas');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [reloadFlag, user.idComplex]);

    const openDeleteDialog = (zoneId: string, zoneName: string) => {
        setSelectedZone({ zoneId, zoneName });
        setDeleteModalOpen(true);
    };

    const handleDelete = async (zoneId: string) => {
        setIsDeleting(true);
        try {
            await axios.delete(`${ComplexService.baseUrl}${ComplexService.endpoints.DeleteZone}/${user.idComplex}/${zoneId}`);
            setReloadFlag(!reloadFlag);
            setDeleteModalOpen(false);
            toast.success('Zona eliminada correctamente');
        } catch (error) {
            toast.error('Error al eliminar la Zona');
        } finally {
            setIsDeleting(false);
        }
    };

    const orderedDays: Array<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'> = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return (
        <Container disableGutters className="bg-white flex justify-center max-w-4xl rounded-lg" sx={{ mt: 2 }}>
            <Box sx={{ flexGrow: 1, maxWidth: 1024, minHeight: '80vh', p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h5" component="h1" gutterBottom>
                        Zonas
                    </Typography>
                    <IconButton
                        component={Link}
                        to="createzone"
                        aria-label="Createzone"
                        color='primary'
                    >
                        <AddBox />
                    </IconButton>
                </Box>
                <Typography variant="body1" mb={2}>
                    Aquí puedes ver todas las zonas de tu unidad. Para ver más detalles de una zona, haz clic en su nombre.
                </Typography>
                <TableContainer component={Paper} sx={{ maxWidth: '80vw' }}>
                    {loading ? (
                        <Box display="flex" justifyContent="center" alignItems="center" height="70vh">
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell align='center'>Zona</TableCell>
                                    <TableCell align='center'>Franja horaria</TableCell>
                                    <TableCell align='center'>Días disponibles</TableCell>
                                    <TableCell align="right"></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {zones.map((zone) => (
                                    <TableRow key={zone._id}>
                                        <TableCell
                                            component="th"
                                            scope="row"
                                            align="center"
                                            onClick={() => navigate(`/app/zone/${user.idComplex}/${zone._id}`)}
                                            sx={{ cursor: 'pointer' }}
                                            className="transform transition-transform duration-300 hover:scale-125 hover:font-bold"
                                        >
                                            {zone.name}
                                        </TableCell>
                                        <TableCell component="th" scope="row" align='center'>
                                            {dayjs(zone.availableHours.start).format('hh:mm A')} - {dayjs(zone.availableHours.end).format('hh:mm A')}
                                        </TableCell>
                                        <TableCell component="th" scope="row" align='center'>
                                            {orderedDays.filter(day => zone.availableDays.includes(day)).map(day => daysInSpanish[day]).join(', ')}
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                component={Link}
                                                to={`editzone/${zone._id}`}
                                                aria-label="Edit"
                                                color='primary'
                                            >
                                                <Edit />
                                            </IconButton>
                                            <IconButton
                                                onClick={() => {
                                                    openDeleteDialog(zone._id, zone.name);
                                                }}
                                                aria-label="Delete"
                                                color='secondary'
                                            >
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </TableContainer>

                <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
                    <DialogContent>
                        {!isDeleting ? (
                            <WarningIcon color="secondary" style={{ fontSize: 60, display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />
                        ) : (
                            <CircularProgress style={{ fontSize: 50, display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />
                        )}
                        <DialogContentText align="center" fontSize={20} sx={{ marginTop: "25px" }}>
                            ¿Estás segur@ de que deseas eliminar la zona: <b>{selectedZone.zoneName}</b>?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteModalOpen(false)} color="secondary">
                            Cancelar
                        </Button>
                        <Button onClick={() => handleDelete(selectedZone.zoneId)} color="primary">
                            Eliminar
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Container>
    );
};

export default ViewAll;