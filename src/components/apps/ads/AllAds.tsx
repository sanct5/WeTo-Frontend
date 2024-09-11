import { useState, useEffect } from 'react';
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
    TextField
} from '@mui/material';
import { format } from '@formkit/tempo';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AnnouncementsService } from '../../../api/Anouncements';
import { useSelector } from 'react-redux';
import { UserState } from '../../../hooks/users/userSlice';
import { Announcements } from '../models'
import parse from 'html-react-parser'
import { CalendarMonth, DateRangeRounded, Delete, Warning, Search, Announcement, SellOutlined } from '@mui/icons-material';

const AllAds = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [reloadFlag, setReloadFlag] = useState<boolean>(false);
    const [residentAds, setResidentAds] = useState<Announcements[]>([]);
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [keyWord, setKeyWord] = useState<string>('');
    const [selectedAnnouncement, setselectedAnnouncement] = useState<any>({ AnnouncementId: '', AnnouncementUser: '' });

    const user = useSelector((state: { user: UserState }) => state.user);

    useEffect(() => {
        const getResidentAds = async () => {
            setLoading(true);
            let idComplex = user.idComplex;
            const response = await axios.get<Announcements[]>(`${AnnouncementsService.baseUrl}${AnnouncementsService.endpoints.GetAnnouncementsByComplex}/${idComplex}`);
            const sortedAds = response.data
                .filter(announcement => !announcement.isAdmin)
                .sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime());
            setResidentAds(sortedAds);
            setLoading(false);
        };
        getResidentAds();
    }, [reloadFlag, user.idComplex]);

    const openDeleteDialog = (AnnouncementId: string, AnnouncementUser: string, userId: string) => {
        setselectedAnnouncement({ AnnouncementId, AnnouncementUser, userId });
        setDeleteModalOpen(true);
    }

    const handleDelete = async (announcementId: String) => {
        setIsDeleting(true);
        try {
            await axios.delete(`${AnnouncementsService.baseUrl}${AnnouncementsService.endpoints.DeleteAnnouncement}/${announcementId}/${user._id}`);
            setReloadFlag(!reloadFlag);
            setKeyWord('');
            setDeleteModalOpen(false);
            setIsDeleting(false);
            toast.success('Publicidad eliminada correctamente');
        } catch (error) {
            setIsDeleting(false);
            toast.error('Error al eliminar la publicidad');
        }
    }

    const handleSearch = async () => {
        setLoading(true);
        if (keyWord.trim() === '') {
            setReloadFlag(!reloadFlag);
            return;
        }

        const response = await axios.get<Announcements[]>(`${AnnouncementsService.baseUrl}${AnnouncementsService.endpoints.SearchAnnouncements}/${keyWord.trim()}/${user.idComplex}`);
        if (response.data.length === 0) {
            toast.info('No se encontraron anuncios con la palabra clave ingresada');
            setLoading(false);
            return;
        }

        const sortedAnnouncements = response.data
            .filter(announcement => !announcement.isAdmin)
            .sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime());

        // Esto es debido a que el back trae tanto los anuncios de los residentes como los de los admins, se debe crear otro endpoint para traer solo los anuncios de los residentes
        if (sortedAnnouncements.length === 0) {
            toast.info('No se encontraron anuncios con la palabra clave ingresada');
            setLoading(false);
            return;
        }
        setResidentAds(sortedAnnouncements);
        setLoading(false);
    }

    return (
        <Box sx={{ backgroundColor: '#F0F0F0', height: 'max-content', minHeight: '100vh' }}>
            {!loading && <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', maxWidth: 800, margin: 'auto' }}>
                <TextField
                    fullWidth
                    value={keyWord}
                    onChange={(e) => setKeyWord(e.target.value)}
                    label="Buscar publicidad"
                    variant="outlined"
                    sx={{ backgroundColor: 'white', margin: 2, maxWidth: 600 }}
                    placeholder='Buscar por título o contenido'
                />
                <IconButton sx={{ mr: 2 }} onClick={handleSearch}>
                    <Search color='secondary' fontSize='large' />
                </IconButton>
            </Box>}
            {loading ? (
                <Grid container justifyContent="center" alignItems="center" style={{ height: '50vh' }}>
                    <CircularProgress />
                    <Typography variant="h6" component="div" marginLeft={2}>
                        Cargando anuncios...
                    </Typography>
                </Grid>
            ) : (
                residentAds.length === 0 ? (
                    <Grid container direction="column" justifyContent="center" alignItems="center" style={{ height: '50vh' }}>
                        <Typography variant="h3" component="div" sx={{ mb: 4 }}>
                            Aún no hay publicidad
                        </Typography>
                        <Announcement color='primary' style={{ fontSize: 80 }} />
                    </Grid>
                ) : (
                    <Grid container spacing={2} justifyContent="flex-start">
                        {residentAds.map((announcement) => (
                            <Grid item key={announcement._id} xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Card sx={{ display: 'flex', flexDirection: 'column', minWidth: 275, width: '100%', position: 'relative', pt: user.role === 'ADMIN' ? 1 : 0 }}>
                                    {user.role === 'ADMIN' &&
                                        <Box sx={{ position: 'absolute', top: 0, right: 0, display: 'flex', gap: 1 }}>
                                            <IconButton aria-label="delete" size="small" onClick={() => openDeleteDialog(announcement._id, announcement.CreatedBy, announcement.User)}>
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    }
                                    <CardContent>
                                        <Typography variant="h5" component="div" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                            {announcement.category === 'Publicidad' ? (
                                                <SellOutlined color={user.userName === announcement.CreatedBy ? 'secondary' : 'primary'} />
                                            ) : null}
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
                )
            )}

            <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
                <DialogContent>
                    {!isDeleting ? (<Warning color="secondary" style={{ fontSize: 60, display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />) : <CircularProgress style={{ fontSize: 50, display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />}
                    <DialogContentText align="center" fontSize={20} sx={{ marginTop: "25px" }}>
                        ¿Estás segur@ de que deseas eliminar la publicidad creada por: <b>{selectedAnnouncement.AnnouncementUser}</b>?
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

export default AllAds