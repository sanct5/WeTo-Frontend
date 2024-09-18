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
    Tabs,
    Tab,
    useTheme,
    useMediaQuery
} from '@mui/material';
import { format } from '@formkit/tempo';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AnnouncementsService } from '../../../api/Anouncements';
import { useSelector } from 'react-redux';
import { UserState } from '../../../hooks/users/userSlice';
import { Announcements } from '../models'
import parse from 'html-react-parser'
import { CalendarMonth, DateRangeRounded, AddBox, Delete, Warning, Edit, Search, Handyman, Interests, Groups, House, Announcement, ArrowUpward, ArrowDownward } from '@mui/icons-material';

const ListAll = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [reloadFlag, setReloadFlag] = useState<boolean>(false);
    const [adminAnnouncements, setAdminAnnouncements] = useState<Announcements[]>([]);
    const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcements[]>([]);
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [keyWord, setKeyWord] = useState<string>('');
    const [orderMostRecent, setOrderMostRecent] = useState<boolean>(true);
    const [selectedAnnouncement, setselectedAnnouncement] = useState<any>({ AnnouncementId: '', AnnouncementUser: '' });

    const [tabValue, setTabValue] = useState('one');

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        event.preventDefault();
        setTabValue(newValue);
        filterAnnouncements(newValue);
    };

    const filterAnnouncements = (category: string) => {
        setLoading(true);
        let filteredAnnouncements: Announcements[] = [];
        switch (category) {
            case 'two':
                filteredAnnouncements = adminAnnouncements.filter(announcement => announcement.category === 'Servicios');
                break;
            case 'three':
                filteredAnnouncements = adminAnnouncements.filter(announcement => announcement.category === 'General');
                break;
            case 'four':
                filteredAnnouncements = adminAnnouncements.filter(announcement => announcement.category === 'Reuniones');
                break;
            case 'five':
                filteredAnnouncements = adminAnnouncements.filter(announcement => announcement.category === 'Mantenimiento');
                break;
            default:
                filteredAnnouncements = adminAnnouncements;
                break;
        }
        setFilteredAnnouncements(filteredAnnouncements);
        setLoading(false);
    };

    const user = useSelector((state: { user: UserState }) => state.user);
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down('lg'));

    useEffect(() => {
        const getAdminAnnouncements = async () => {
            setLoading(true);
            const response = await axios.get<Announcements[]>(`${AnnouncementsService.baseUrl}${AnnouncementsService.endpoints.GetAnnouncementsByComplex}/${user.idComplex}`);
            const sortedAnnouncements = response.data
                .filter(announcement => announcement.isAdmin)
                .sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime());
            setAdminAnnouncements(sortedAnnouncements);
            setFilteredAnnouncements(sortedAnnouncements);
            setLoading(false);
        };
        getAdminAnnouncements();
    }, [reloadFlag, user.idComplex]);

    const openDeleteDialog = (AnnouncementId: string, AnnouncementUser: string) => {
        setselectedAnnouncement({ AnnouncementId, AnnouncementUser });
        setDeleteModalOpen(true);
    }

    const handleDelete = async (announcementId: String) => {
        setIsDeleting(true);
        try {
            await axios.delete(`${AnnouncementsService.baseUrl}${AnnouncementsService.endpoints.DeleteAnnouncement}/${announcementId}/${user._id}`);
            setReloadFlag(!reloadFlag);
            setTabValue('one');
            setKeyWord('');
            setDeleteModalOpen(false);
            setIsDeleting(false);
            toast.success('Anuncio eliminado correctamente');
        } catch (error) {
            setIsDeleting(false);
            toast.error('Error al eliminar el anuncio');
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
            .filter(announcement => announcement.isAdmin)
            .sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime());

        // Esto es debido a que el back trae tanto los anuncios de los residentes como los de los admins, se debe crear otro endpoint para traer solo los anuncios de los admins
        if (sortedAnnouncements.length === 0) {
            toast.info('No se encontraron anuncios con la palabra clave ingresada');
            setLoading(false);
            return;
        }
        setAdminAnnouncements(sortedAnnouncements);
        setFilteredAnnouncements(sortedAnnouncements);
        setLoading(false);
    }

    const handleOrder = () => {
        setLoading(true);
        if (orderMostRecent) {
            const sortedAnnouncements = adminAnnouncements.sort((a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime());
            setFilteredAnnouncements(sortedAnnouncements);
            setOrderMostRecent(false);
        } else {
            const sortedAnnouncements = adminAnnouncements.sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime());
            setFilteredAnnouncements(sortedAnnouncements);
            setOrderMostRecent(true);
        }
        setLoading(false);
    }

    return (
        <Box sx={{ backgroundColor: '#F0F0F0', height: 'max-content', minHeight: '100vh' }}>
            {!loading && <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-evenly', alignItems: 'center', margin: 'auto' }}>
                <Tabs
                    value={tabValue}
                    onChange={handleChange}
                    textColor="secondary"
                    variant="scrollable"
                    scrollButtons
                    allowScrollButtonsMobile
                    indicatorColor="secondary"
                    aria-label="Tabs"
                >
                    <Tab icon={<Announcement />} iconPosition='start' value="one" label={isXs ? '' : 'Todos'} />
                    <Tab icon={<House />} iconPosition='start' value="two" label={isXs ? '' : 'Servicios'} />
                    <Tab icon={<Interests />} iconPosition='start' value="three" label={isXs ? '' : 'General'} />
                    <Tab icon={<Groups />} iconPosition='start' value="four" label={isXs ? '' : 'Reuniones'} />
                    <Tab icon={<Handyman />} iconPosition='start' value="five" label={isXs ? '' : 'Mantenimiento'} />
                </Tabs>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: 'auto', width: '90%' }}>
                    <>
                        {isXs ? (
                            <IconButton onClick={handleOrder}>
                                {orderMostRecent ? (
                                    <ArrowDownward color='secondary' fontSize='large' />
                                ) : (
                                    <ArrowUpward color='secondary' fontSize='large' />
                                )}
                            </IconButton>
                        ) : (
                            <Button
                                variant="contained"
                                color={orderMostRecent ? 'secondary' : 'primary'}
                                onClick={handleOrder}
                                size='small'
                            >
                                {orderMostRecent ? 'Antiguos' : 'Recientes'}
                            </Button>
                        )}
                    </>
                    <TextField
                        fullWidth
                        value={keyWord}
                        onChange={(e) => setKeyWord(e.target.value)}
                        label="Buscar anuncio"
                        variant="outlined"
                        sx={{ backgroundColor: 'white', margin: 2, maxWidth: 600 }}
                        placeholder='Buscar un anuncio'
                    />
                    <IconButton sx={{ mr: 2 }} onClick={handleSearch}>
                        <Search color='secondary' fontSize='large' />
                    </IconButton>
                    {user.role === 'ADMIN' &&
                        <>
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
                        </>
                    }
                </Box>
            </Box>}
            {
                loading ? (
                    <Grid container justifyContent="center" alignItems="center" style={{ height: '50vh' }}>
                        <CircularProgress />
                        <Typography variant="h6" component="div" marginLeft={2}>
                            Cargando anuncios...
                        </Typography>
                    </Grid>
                ) : (
                    filteredAnnouncements.length === 0 ? (
                        <Grid container direction="column" justifyContent="center" alignItems="center" style={{ height: '50vh' }}>
                            <Typography variant="h3" component="div" sx={{ mb: 4 }}>
                                Aún no hay anuncios
                            </Typography>
                            <Announcement color='primary' style={{ fontSize: 80 }} />
                        </Grid>
                    ) : (
                        <Grid container spacing={2} justifyContent="flex-start">
                            {filteredAnnouncements.map((announcement) => (
                                <Grid item key={announcement._id} xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <Card sx={{ display: 'flex', flexDirection: 'column', minWidth: 275, width: '100%', position: 'relative', pt: user.role === 'ADMIN' ? 1 : 0 }}>
                                        {user.role === 'ADMIN' &&
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
                                        }
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
                    )
                )
            }

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

        </Box >
    );
}

export default ListAll