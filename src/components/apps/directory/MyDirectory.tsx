import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { UserState } from '../../../hooks/users/userSlice';
import { Link } from 'react-router-dom';
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
import axios from 'axios';
import { AddBox, Delete, Edit, Help } from '@mui/icons-material';
import WarningIcon from '@mui/icons-material/Warning';
import { toast } from 'react-toastify';
import { DirectoryService } from '../../../api/Directory';
import { Directory } from '../models';

const MyDirectory = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [reloadFlag, setReloadFlag] = useState<boolean>(false);
    const [services, setServices] = useState<Directory[]>([]);
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const [selectedService, setSelectedService] = useState<{ _id: string, service: string }>({ _id: '', service: '' });
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    const user = useSelector((state: { user: UserState }) => state.user);

    useEffect(() => {
        if (!user._id) return;
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${DirectoryService.baseUrl}${DirectoryService.endpoints.GetByUser}/${user._id}`);

                if (response.data.status === 404) {
                    setServices([]);
                    return;
                }
                setServices(response.data);
            } catch (error) {
                toast.error('Error al cargar los servicios');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [reloadFlag, user._id]);

    const openDeleteDialog = (_id: string, service: string) => {
        setSelectedService({ _id, service });
        setDeleteModalOpen(true);
    }

    const handleDelete = async (_id: string) => {
        setIsDeleting(true);
        try {
            await axios.delete(`${DirectoryService.baseUrl}${DirectoryService.endpoints.Delete}/${_id}`);
            setReloadFlag(!reloadFlag);
            setDeleteModalOpen(false);
            setIsDeleting(false);
            toast.success('Servicio eliminado correctamente');
        } catch (error) {
            setIsDeleting(false);
            toast.error('Error al eliminar el servicio');
        }
    }

    return (
        <Container disableGutters className="bg-white flex justify-center max-w-4xl rounded-lg" sx={{ mt: 2 }}>
            <Box sx={{ flexGrow: 1, maxWidth: 1024, minHeight: '80vh', p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h5" component="h1" gutterBottom>
                        Mis servicios
                    </Typography>
                    <Box display={{ xs: 'block', sm: 'none' }} marginRight={2}>
                        <Link to="/app/directory/create">
                            <IconButton color="primary">
                                <AddBox fontSize="large" />
                            </IconButton>
                        </Link>
                    </Box>
                    <Box display={{ xs: 'none', sm: 'block' }} marginRight={2}>
                        <Link to="/app/directory/create">
                            <Button variant="contained" color="primary">
                                Agregar
                            </Button>
                        </Link>
                    </Box>
                </Box>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="70vh">
                        <CircularProgress />
                    </Box>
                ) : (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align='center'>Servicio</TableCell>
                                    <TableCell align='center'>Ubicación</TableCell>
                                    <TableCell align='center'>Teléfono</TableCell>
                                    <TableCell align='center'>WhatsApp</TableCell>
                                    <TableCell align="right"></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {services.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                                <Help sx={{ mb: 2 }} fontSize='large' color='secondary' />
                                                <Typography variant="h5" component="p" gutterBottom>
                                                    No tienes servicios, puedes crear uno nuevo tocando el botón de arriba
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    services.map((service) => (
                                        <TableRow key={service._id}>
                                            <TableCell component="th" scope="row" align='center' sx={{ wordBreak: 'break-word' }}>
                                                {service.service}
                                            </TableCell>
                                            <TableCell component="th" scope="row" align='center' sx={{ wordBreak: 'break-word' }}>
                                                {service.location}
                                            </TableCell>
                                            <TableCell component="th" scope="row" align='center'>
                                                {service.phone}
                                            </TableCell>
                                            <TableCell component="th" scope="row" align='center'>
                                                {service.hasWhatsApp ? service.whatsAppNumber : 'No tiene'}
                                            </TableCell>
                                            <TableCell align="right">
                                                <Link to={`/app/directory/edit/${service._id}`}>
                                                    <IconButton
                                                        aria-label="Edit"
                                                        color='primary'
                                                    >
                                                        <Edit />
                                                    </IconButton>
                                                </Link>
                                                <IconButton
                                                    onClick={() => openDeleteDialog(service._id, service.service)}
                                                    aria-label="Delete"
                                                    color='secondary'
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
                    <DialogContent>
                        {!isDeleting ? (<WarningIcon color="secondary" style={{ fontSize: 60, display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />) : <CircularProgress style={{ fontSize: 50, display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />}
                        <DialogContentText align="center" fontSize={20} sx={{ marginTop: "25px" }}>
                            ¿Estás segur@ de que deseas eliminar el servicio: <b>{selectedService.service}</b>?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteModalOpen(false)} color="secondary">
                            Cancelar
                        </Button>
                        <Button onClick={() => handleDelete(selectedService._id)} color="primary">
                            Eliminar
                        </Button>
                    </DialogActions>
                </Dialog>

            </Box>
        </Container>
    );
}

export default MyDirectory;