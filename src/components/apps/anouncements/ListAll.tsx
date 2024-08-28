
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Box,
    IconButton,
    Button,
    Grid,
    Card,
    CardContent,
    Typography,
    Dialog,
    DialogContent,
    DialogActions,
    CircularProgress,
    DialogContentText,
    TextField,
    InputAdornment
} from '@mui/material';
import { format } from '@formkit/tempo';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AnnouncementsService } from '../../../api/Anouncements';
import { useSelector } from 'react-redux';
import { UserState } from '../../../hooks/users/userSlice';
import { Announcements } from '../models'
import parse from 'html-react-parser'
import { CalendarMonth, DateRangeRounded, AddBox, Delete, Warning, Edit, Search, Handyman, Interests, Groups, House } from '@mui/icons-material';

const ListAll = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [reloadFlag, setReloadFlag] = useState<boolean>(false);
    const [adminAnnouncements, setAdminAnnouncements] = useState<Announcements[]>([]);
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [selectedAnnouncement, setselectedAnnouncement] = useState<any>({ AnnouncementId: '', AnnouncementUser: '' });

    const user = useSelector((state: { user: UserState }) => state.user);

    useEffect(() => {
        const getAdminAnnouncements = async () => {
            setLoading(true);
            let idComplex = user.idComplex;
            const response = await axios.get<Announcements[]>(`${AnnouncementsService.baseUrl}${AnnouncementsService.endpoints.GetAnnouncementsByComplex}/${idComplex}`);
            const sortedAnnouncements = response.data
                .filter(announcement => announcement.isAdmin)
                .sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime());
            setAdminAnnouncements(sortedAnnouncements);
            setLoading(false);
        };
        getAdminAnnouncements();
    }, [reloadFlag]);

    const openDeleteDialog = (AnnouncementId: string, AnnouncementUser: string) => {
        setselectedAnnouncement({ AnnouncementId, AnnouncementUser });
        setDeleteModalOpen(true);
    }

    const handleDelete = async (announcementId: String) => {
        setIsDeleting(true);
        try {
            axios.delete(`${AnnouncementsService.baseUrl}${AnnouncementsService.endpoints.DeleteAnnouncement}/${announcementId}`);
            setReloadFlag(!reloadFlag);
            setDeleteModalOpen(false);
            setIsDeleting(false);
            toast.success('Anuncio eliminado correctamente');
        } catch (error) {
            setIsDeleting(false);
            toast.error('Error al eliminar el anuncio');
        }
    }

    return (
        <Box sx={{ backgroundColor: '#F0F0F0', height: 'max-content', minHeight: '100vh' }}>
            {!loading && <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', maxWidth: 800, margin: 'auto' }}>
                <TextField
                    fullWidth
                    label="Buscar anuncio"
                    variant="outlined"
                    sx={{ backgroundColor: 'white', maxWidth: 600, margin: 2 }}
                    placeholder='Buscar un anuncio'
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                />
                <Box display={{ xs: 'block', sm: 'none' }} marginRight={2}>
                    <Link to="/app/announcements/create">
                        <IconButton color="primary">
                            <AddBox fontSize="large" />
                        </IconButton>
                    </Link>
                </Box>
                <Box display={{ xs: 'none', sm: 'block' }} marginRight={2}>
                    <Link to="/app/announcements/create">
                        <Button variant="contained" color="primary">
                            Agregar
                        </Button>
                    </Link>

                </Box>
            </Box>}
            {loading ? (
                <Grid container justifyContent="center" alignItems="center" style={{ height: '50vh' }}>
                    <CircularProgress />
                    <Typography variant="h6" component="div" marginLeft={2}>
                        Cargando anuncios...
                    </Typography>
                </Grid>
            ) : (
                <Grid container spacing={2} justifyContent="flex-start">
                    {adminAnnouncements.map((announcement) => (
                        <Grid item key={announcement._id} xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Card sx={{ display: 'flex', flexDirection: 'column', minWidth: 275, width: '100%', position: 'relative', pt: 1 }}>
                                <Box sx={{ position: 'absolute', top: 0, right: 0, display: 'flex', gap: 1 }}>
                                    <IconButton aria-label="edit" size="small">
                                        <Link to={`/app/announcements/edit/${announcement._id}`}>
                                            <Edit fontSize="small" />
                                        </Link>
                                    </IconButton>
                                    <IconButton aria-label="delete" size="small" onClick={() => openDeleteDialog(announcement._id, announcement.CreatedBy)}>
                                        <Delete fontSize="small" />
                                    </IconButton>
                                </Box>
                                <CardContent>
                                    <Typography variant="h5" component="div" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                        {announcement.category === 'Mantenimiento' ? <Handyman color='primary' /> :
                                            announcement.category === 'Servicios' ? <House color='primary' /> :
                                                announcement.category === 'General' ? <Interests color='primary' /> :
                                                    announcement.category === 'Reuniones' ? <Groups color='primary' /> : null}
                                        <Box sx={{ ml: 1 }}>
                                            {announcement.Title}
                                        </Box>
                                    </Typography>
                                    <Typography variant="body2" component="p">
                                        {parse(announcement.Body)}
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', marginTop: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
                                        <Typography variant="body2" component="p" sx={{ mr: 2 }}>
                                            <DateRangeRounded color='primary' sx={{ mr: 1 }} />
                                            Publicado el: {format(announcement.Date, { date: "long", time: "short" })}
                                        </Typography>
                                        {announcement.Date !== announcement.LastModify && (
                                            <Typography variant="body2" component="p">
                                                <CalendarMonth color='secondary' sx={{ mr: 1 }} />
                                                Ultima modificación: {format(announcement.LastModify, { date: "long", time: "short" })}
                                            </Typography>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
                <DialogContent>
                    {!isDeleting ? (<Warning color="secondary" style={{ fontSize: 60, display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />) : <CircularProgress style={{ fontSize: 50, display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />}
                    <DialogContentText align="center" fontSize={20} sx={{ marginTop: "25px" }}>
                        ¿Estás segur@ de que deseas eliminar el anuncio creado por: <b>{selectedAnnouncement.AnnouncementUser}</b>?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteModalOpen(false)} color="secondary">
                        Cancelar
                    </Button>
                    <Button onClick={() => handleDelete(selectedAnnouncement.AnnouncementId)} color="primary">
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
}

export default ListAll