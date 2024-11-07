import { useState, useEffect } from 'react';
import {
    Box,
    IconButton,
    Button,
    Typography,
    Dialog,
    DialogContent,
    DialogActions,
    CircularProgress,
    DialogContentText,
    TextField,
    Tooltip,
    Grid2,
    Card,
    CardContent,
    CardHeader
} from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import { DirectoryService } from '../../../api/Directory';
import { useSelector } from 'react-redux';
import { UserState } from '../../../hooks/users/userSlice';
import { Directory } from '../models';
import {
    Delete,
    Warning,
    Search,
    LocalPhone,
    ChatBubbleOutline,
    ContactPhone,
    WhatsApp,
    AddIcCall,
    LocationOn
} from '@mui/icons-material';

const AllDirectory = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [reloadFlag, setReloadFlag] = useState<boolean>(false);
    const [directoryEntries, setDirectoryEntries] = useState<Directory[]>([]);
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [keyWord, setKeyWord] = useState<string>('');
    const [selectedService, setSelectedService] = useState<any>({ _id: '', service: '' });

    const user = useSelector((state: { user: UserState }) => state.user);

    useEffect(() => {
        if (!user.idComplex) return;
        const getDirectoryEntries = async () => {
            setLoading(true);
            let idComplex = user.idComplex;
            const response = await axios.get<Directory[]>(`${DirectoryService.baseUrl}${DirectoryService.endpoints.GetByComplex}/${idComplex}`);
            setDirectoryEntries(response.data);
            setLoading(false);
        };
        getDirectoryEntries();
    }, [reloadFlag, user.idComplex]);

    const openDeleteDialog = (_id: string, service: string) => {
        setSelectedService({ _id, service });
        setDeleteModalOpen(true);
    };

    const handleDelete = async (_id: string) => {
        setIsDeleting(true);
        try {
            await axios.delete(`${DirectoryService.baseUrl}${DirectoryService.endpoints.Delete}/${_id}`);
            setReloadFlag(!reloadFlag);
            setKeyWord('');
            setDeleteModalOpen(false);
            setIsDeleting(false);
            toast.success('Entrada eliminada correctamente');
        } catch (error) {
            setIsDeleting(false);
            toast.error('Error al eliminar la entrada');
        }
    };

    const handleSearch = async () => {
        setLoading(true);
        if (keyWord.trim() === '') {
            setReloadFlag(!reloadFlag);
            return;
        }

        const response = await axios.get<Directory[]>(`${DirectoryService.baseUrl}${DirectoryService.endpoints.GetByComplex}/${user.idComplex}?search=${keyWord.trim()}`);
        if (response.data.length === 0) {
            toast.info('No se encontraron entradas con la palabra clave ingresada');
            setLoading(false);
            return;
        }

        setDirectoryEntries(response.data);
        setLoading(false);
    };

    return (
        <Box sx={{ backgroundColor: '#F0F0F0', height: 'max-content', minHeight: '100vh' }}>
            {!loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', maxWidth: 800, margin: 'auto' }}>
                    <TextField
                        fullWidth
                        value={keyWord}
                        onChange={(e) => setKeyWord(e.target.value)}
                        label="Buscar servicio"
                        variant="outlined"
                        sx={{ backgroundColor: 'white', margin: 2, maxWidth: 600 }}
                        placeholder='Buscar por servicio o teléfono'
                    />
                    <IconButton sx={{ mr: 2 }} onClick={handleSearch}>
                        <Search color='secondary' fontSize='large' />
                    </IconButton>
                </Box>
            )}
            {loading ? (
                <Grid2 container justifyContent="center" alignItems="center" style={{ height: '50vh' }}>
                    <CircularProgress />
                    <Typography variant="h6" component="div" marginLeft={2}>
                        Cargando servicios...
                    </Typography>
                </Grid2>
            ) : (
                directoryEntries.length === 0 ? (
                    <Grid2 container direction="column" justifyContent="center" alignItems="center" style={{ height: '50vh' }}>
                        <Typography variant="h3" component="div" sx={{ mb: 4 }} textAlign="center">
                            Aún no hay servicios
                        </Typography>
                    </Grid2>
                ) : (
                    <Grid2 container spacing={2} columns={12} sx={{ display: 'flex', alignItems: 'stretch' }}>
                        {directoryEntries.map((service) => (
                            <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={service._id}>
                                <Card sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
                                    {user.role === 'ADMIN' && (
                                        <Box sx={{ position: 'absolute', top: 0, right: 0 }}>
                                            <Tooltip title="Eliminar">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => openDeleteDialog(service._id, service.service)}
                                                >
                                                    <Delete color="error" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    )}
                                    <CardHeader
                                        avatar={<ContactPhone sx={{ mr: 1, color: "secondary.main" }} />}
                                        title={service.service}
                                        titleTypographyProps={{ variant: 'h6', color: 'black', sx: { display: 'flex', alignItems: 'center', wordBreak: 'break-word' } }}
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography
                                            variant="body2"
                                            sx={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap', mb: 2 }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <LocationOn sx={{ mr: 1 }} color="primary" /> {service.location}
                                            </Box>
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{ display: 'flex', alignItems: 'center', mb: 1, wordBreak: 'break-word' }}
                                        >
                                            <LocalPhone sx={{ mr: 1 }} color="primary" /> Teléfono: {service.phone}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            component="p"
                                            sx={{ display: 'flex', alignItems: 'center', wordBreak: 'break-word', mt: 2 }}
                                        >
                                            <ChatBubbleOutline sx={{ mr: 1 }} color="primary" /> WhatsApp: {service.whatsAppNumber ? service.whatsAppNumber : "No tiene"}
                                        </Typography>
                                    </CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                        <Tooltip title="Llamar">
                                            <IconButton href={`tel:${service.phone}`}>
                                                <AddIcCall color="primary" />
                                            </IconButton>
                                        </Tooltip>
                                        {service.hasWhatsApp && (
                                            <Tooltip title="WhatsApp">
                                                <IconButton href={`https://wa.me/${service.whatsAppNumber}`} target="_blank" rel="noopener noreferrer">
                                                    <WhatsApp color="success" />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </Box>
                                </Card>
                            </Grid2>
                        ))}
                    </Grid2>
                )
            )}

            <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
                <DialogContent>
                    {!isDeleting ? (
                        <Warning color="secondary" style={{ fontSize: 60, display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />
                    ) : (
                        <CircularProgress style={{ fontSize: 50, display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />
                    )}
                    <DialogContentText align="center" fontSize={20} sx={{ mt: 2 }}>
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
        </Box >
    );
};

export default AllDirectory;