import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserService } from '../../../api/UserService';
import axios from 'axios';
import {
    Container,
    CardContent,
    Typography,
    Grid,
    Avatar,
    Box,
    CircularProgress,
    ListItem,
    ListItemText,
    CardHeader,
    Card,
    List,
    IconButton,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { Pet, UserState, Vehicle } from '../../../hooks/users/userSlice';
import { useSelector } from 'react-redux';
import {
    ErrorOutline,
    Badge,
    Email,
    Home,
    Phone,
    AssignmentInd,
    Pets,
    PedalBike,
    Delete,
    Warning,
    Visibility
} from '@mui/icons-material';
import PetModal from './PetModal';
import VehicleModal from './VehicleModal';
import { toast } from 'react-toastify';

const ViewProfile = () => {
    const { id } = useParams<{ id: string }>();
    const [profile, setProfile] = useState<UserState | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [openPetModal, setOpenPetModal] = useState<boolean>(false);
    const [selectedPet, setSelectedPet] = useState<Pet>({ _id: '', name: '', type: '', breed: '', color: '' });
    const [openVehicleModal, setOpenVehicleModal] = useState<boolean>(false);
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle>({ _id: '', plate: '', model: '', color: '', year: '' });
    const [deletePetModalOpen, setDeletePetModalOpen] = useState<boolean>(false);
    const [deleteVehicleModalOpen, setDeleteVehicleModalOpen] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [reloadFlag, setReloadFlag] = useState<boolean>(false);

    const user = useSelector((state: { user: UserState }) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserById = async (id: string) => {
            try {
                const response = await axios.get(`${UserService.baseUrl}${UserService.endpoints.GetUserById}/${id}`);
                setProfile(response.data);
            } catch (error) {
                return;
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            if (user.role === 'ADMIN' || user._id === id) {
                fetchUserById(id);
            } else {
                if (!user._id) {
                    return;
                } else {
                    navigate(`/404`);
                }
            }
        }
    }, [user._id, id, reloadFlag]);

    const deletePet = async (petId: string) => {
        if (isDeleting) return;
        setIsDeleting(true);
        try {
            await axios.delete(`${UserService.baseUrl}${UserService.endpoints.deleteUserPet}/${user._id}/${petId}`);
            setReloadFlag(!reloadFlag);
            setDeletePetModalOpen(false);
            setIsDeleting(false);
            toast.success('Mascota eliminada correctamente');
        } catch (error) {
            setIsDeleting(false);
            toast.error('Ocurrió un error al eliminar la mascota');
        }
    }

    const deleteVehicle = async (vehicleId: string) => {
        if (isDeleting) return;
        setIsDeleting(true);
        try {
            await axios.delete(`${UserService.baseUrl}${UserService.endpoints.deleteUserVehicle}/${user._id}/${vehicleId}`);
            setReloadFlag(!reloadFlag);
            setDeleteVehicleModalOpen(false);
            setIsDeleting(false);
            toast.success('Vehículo eliminado correctamente');
        } catch (error) {
            setIsDeleting(false);
            toast.error('Ocurrió un error al eliminar el vehículo');
        }
    }

    const handleSelectPet = (pet: Pet, isCreating?: boolean) => {
        if (isCreating) {
            setSelectedPet({ _id: '', name: '', type: '', breed: '', color: '' });
        } else {
            setSelectedPet(pet);
        }
        setOpenPetModal(true);
    };

    const handleDeletePet = (pet: Pet) => {
        setSelectedPet(pet);
        setDeletePetModalOpen(true);
    };

    const handleSelectVehicle = (vehicle: Vehicle, isCreating?: boolean) => {
        if (isCreating) {
            setSelectedVehicle({ _id: '', plate: '', model: '', color: '', year: '' });
        } else {
            setSelectedVehicle(vehicle);
        }
        setOpenVehicleModal(true);
    };

    const handleDeleteVehicle = (vehicle: Vehicle) => {
        setSelectedVehicle(vehicle);
        setDeleteVehicleModalOpen(true);
    };

    return (
        <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
            <Container maxWidth="sm" sx={{ height: 'fit-content', backgroundColor: 'white', borderRadius: '20px', padding: 2, boxShadow: 3 }}>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                        <CircularProgress />
                    </Box>
                ) : profile ? (
                    <CardContent>
                        <Box display="flex" justifyContent="center" mb={3}>
                            <Avatar sx={{ bgcolor: 'primary.main', width: 64, height: 64 }}>
                                <PersonIcon fontSize="large" />
                            </Avatar>
                        </Box>
                        <Typography variant="h4" align="center" gutterBottom mb={3}>
                            {profile.userName}
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={2} container alignItems="center">
                                <Badge fontSize='large' color="secondary" />
                            </Grid>
                            <Grid item xs={10} container alignItems="center">
                                <Typography variant="body1"><strong>Número de documento:</strong> {profile.idDocument}</Typography>
                            </Grid>

                            <Grid item xs={2} container alignItems="center">
                                <Email color="secondary" fontSize='large' />
                            </Grid>
                            <Grid item xs={10} container alignItems="center">
                                <Typography variant="body1"><strong>Email:</strong> {profile.email}</Typography>
                            </Grid>

                            <Grid item xs={2} container alignItems="center">
                                <Home color="secondary" fontSize='large' />
                            </Grid>
                            <Grid item xs={10} container alignItems="center">
                                <Typography variant="body1"><strong>Apartamento:</strong> {profile.apartment}</Typography>
                            </Grid>

                            <Grid item xs={2} container alignItems="center">
                                <Phone color="secondary" fontSize='large' />
                            </Grid>
                            <Grid item xs={10} container alignItems="center">
                                <Typography variant="body1"><strong>Teléfono:</strong> {profile.phone}</Typography>
                            </Grid>
                            <Grid item xs={2} container alignItems="center">
                                <AssignmentInd color="secondary" fontSize='large' />
                            </Grid>
                            <Grid item xs={10} container alignItems="center">
                                <Typography variant="body1"><strong>Rol:</strong> {profile.role}</Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                ) : (
                    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100%">
                        <ErrorOutline sx={{ fontSize: 40, mb: 2 }} color='primary' />
                        <Typography variant="h5" align="center" gutterBottom>
                            No se encontró el usuario
                        </Typography>
                        <Typography variant="body1" align="center">
                            Por favor, verifica la información e intenta nuevamente.
                        </Typography>
                    </Box>
                )}
            </Container>
            {!loading && (
                <Box sx={{ mt: 2, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, width: '100%', maxWidth: 'lg' }}>
                    <Card sx={{ flex: 1, mb: { xs: 2, sm: 0 }, mr: { xs: 0, sm: 2 }, height: 'fit-content', borderRadius: '20px', padding: 2, boxShadow: 3 }}>
                        <CardHeader avatar={<Pets color='primary' />} title="Mascotas" sx={{ paddingBottom: 0 }} titleTypographyProps={{ variant: 'h5' }} />
                        <CardContent>
                            {profile?.pets && profile.pets.length > 0 ? (
                                <List>
                                    {profile?.pets.map((pet) => (
                                        <ListItem key={pet._id} secondaryAction={
                                            id === user._id &&
                                            <Box display="flex" alignItems="center" sx={{ gap: { xs: 0.5, sm: 2 } }}>
                                                <IconButton edge="end" aria-label="edit" onClick={() => handleSelectPet(pet)}>
                                                    <Visibility color='primary' />
                                                </IconButton>
                                                <IconButton edge="end" aria-label="delete" onClick={() => handleDeletePet(pet)}>
                                                    <Delete color='secondary' />
                                                </IconButton>
                                            </Box>
                                        }>
                                            <ListItemText
                                                primary={`${pet.name} - ${pet.type}`}
                                                secondary={`* ${pet.breed}\n* ${pet.color}`}
                                                secondaryTypographyProps={{ component: 'span', style: { whiteSpace: 'pre-line' } }}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            ) : (
                                <Box display="flex" justifyContent="center" alignItems="center" height="100%" padding={2}>
                                    <Typography variant="body1" color="textSecondary">
                                        No hay mascotas registradas
                                    </Typography>
                                </Box>
                            )}
                            {id === user._id && <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={() => handleSelectPet({ _id: '', name: '', type: '', breed: '', color: '' }, true)}>
                                Agregar mascota
                            </Button>}
                        </CardContent>
                    </Card>
                    <Card sx={{ flex: 1, height: 'fit-content', borderRadius: '20px', padding: 2, boxShadow: 3 }}>
                        <CardHeader avatar={<PedalBike color='primary' />} title="Vehículos" sx={{ paddingBottom: 0 }} titleTypographyProps={{ variant: 'h5' }} />
                        <CardContent>
                            {profile?.vehicles && profile.vehicles.length > 0 ? (
                                <List>
                                    {profile?.vehicles.map((vehicle) => (
                                        <ListItem key={vehicle._id} secondaryAction={
                                            id === user._id &&
                                            <Box display="flex" alignItems="center" gap={2}>
                                                <IconButton edge="end" aria-label="edit" onClick={() => handleSelectVehicle(vehicle)}>
                                                    <Visibility color='primary' />
                                                </IconButton>
                                                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteVehicle(vehicle)}>
                                                    <Delete color='secondary' />
                                                </IconButton>
                                            </Box>
                                        }>
                                            <ListItemText
                                                primary={`${vehicle.model} - ${vehicle.plate}`}
                                                secondary={`* ${vehicle.color}\n * ${vehicle.year}`}
                                                secondaryTypographyProps={{ component: 'span', style: { whiteSpace: 'pre-line' } }}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            ) : (
                                <Box display="flex" justifyContent="center" alignItems="center" height="100%" padding={2}>
                                    <Typography variant="body1" color="textSecondary">
                                        No hay vehículos registrados
                                    </Typography>
                                </Box>
                            )}
                            {id === user._id && <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={() => handleSelectVehicle({ _id: '', plate: '', model: '', color: '', year: '' }, true)}>
                                Agregar vehículo
                            </Button>}
                        </CardContent>
                    </Card>
                </Box>
            )}

            <PetModal pet={selectedPet} open={openPetModal} setOpen={setOpenPetModal} reload={reloadFlag} setReload={setReloadFlag} />
            <VehicleModal vehicle={selectedVehicle} open={openVehicleModal} setOpen={setOpenVehicleModal} reload={reloadFlag} setReload={setReloadFlag} />

            <Dialog open={deletePetModalOpen} onClose={() => setDeletePetModalOpen(false)}>
                <DialogContent>
                    {!isDeleting ? (<Warning color="secondary" style={{ fontSize: 60, display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />) : <CircularProgress style={{ fontSize: 50, display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />}
                    <DialogContentText align="center" fontSize={20} sx={{ marginTop: "25px" }}>
                        ¿Estás segur@ de que deseas eliminar a <b>{selectedPet.name}</b>?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeletePetModalOpen(false)} color="secondary">
                        Cancelar
                    </Button>
                    <Button onClick={() => deletePet(selectedPet._id)} color="primary" autoFocus>
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={deleteVehicleModalOpen} onClose={() => setDeleteVehicleModalOpen(false)}>
                <DialogContent>
                    {!isDeleting ? (<Warning color="secondary" style={{ fontSize: 60, display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />) : <CircularProgress style={{ fontSize: 50, display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />}
                    <DialogContentText align="center" fontSize={20} sx={{ marginTop: "25px" }}>
                        ¿Estás segur@ de que deseas eliminar tu <b>{selectedVehicle.model}</b>?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteVehicleModalOpen(false)} color="secondary">
                        Cancelar
                    </Button>
                    <Button onClick={() => deleteVehicle(selectedVehicle._id)} color="primary" autoFocus>
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ViewProfile;