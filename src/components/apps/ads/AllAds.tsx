import { useState, useEffect } from 'react';
import {
    Box,
    IconButton,
    Button,
    Card,
    CardContent,
    Typography,
    Dialog,
    DialogContent,
    DialogActions,
    CircularProgress,
    DialogContentText,
    TextField,
    Grid2,
    Tooltip,
    Popover
} from '@mui/material';
import { format } from '@formkit/tempo';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AnnouncementsService } from '../../../api/Anouncements';
import { useSelector } from 'react-redux';
import { UserState } from '../../../hooks/users/userSlice';
import { Announcements } from '../models'
import parse from 'html-react-parser'
import {
    CalendarMonth,
    DateRangeRounded,
    Delete, Warning,
    Search,
    Announcement,
    TipsAndUpdates,
    Favorite,
    Handshake,
    Celebration,
    Recommend,
    AddReaction,
    SellOutlined
} from '@mui/icons-material';
import { getReactionIcon, getReactionIconGray, reactionsToSpanish } from '../constants';
import { getTopReactions } from '../utils';

const AllAds = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [reloadFlag, setReloadFlag] = useState<boolean>(false);
    const [residentAds, setResidentAds] = useState<Announcements[]>([]);
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [keyWord, setKeyWord] = useState<string>('');
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>({ AnnouncementId: '', AnnouncementUser: '' });
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [openReactionsDetails, setOpenReactionsDetails] = useState<boolean>(false);

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    const user = useSelector((state: { user: UserState }) => state.user);

    useEffect(() => {
        if (!user.idComplex) return;
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
        setSelectedAnnouncement({ AnnouncementId, AnnouncementUser, userId });
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


    const hanldeReaction = async (reaction: string) => {
        handlePopoverClose();
        const announcementId = selectedAnnouncement.AnnouncementId;

        const hasReacted = residentAds.find(announcement => announcement._id === announcementId)?.reactions?.find(reaction => reaction.user === user._id);

        if (hasReacted?.type === reaction) {
            return;
        }

        try {
            const response = await axios.post(`${AnnouncementsService.baseUrl}${AnnouncementsService.endpoints.ReactToAnnouncement}/${announcementId}/${user._id}`, { reactionType: reaction });
            if (response.status === 200) {
                setResidentAds(residentAds.map(announcement => {
                    if (announcement._id === announcementId) {
                        announcement.reactions = response.data.reactions;
                    }
                    return announcement;
                }));
            } else {
                toast.error('Error al agregar la reacción');
            }
        } catch (error) {
            toast.error('Error al agregar la reacción');
        } finally {
            setAnchorEl(null);
        }
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
                <Grid2 container justifyContent="center" alignItems="center" style={{ height: '50vh' }}>
                    <CircularProgress />
                    <Typography variant="h6" component="div" marginLeft={2}>
                        Cargando anuncios...
                    </Typography>
                </Grid2>
            ) : (
                residentAds.length === 0 ? (
                    <Grid2 container direction="column" justifyContent="center" alignItems="center" style={{ height: '50vh' }}>
                        <Typography variant="h3" component="div" sx={{ mb: 4 }} textAlign="center">
                            Aún no hay publicidad
                        </Typography>
                        <Announcement color='primary' style={{ fontSize: 80 }} />
                    </Grid2>
                ) : (
                    <Grid2 container spacing={2} columns={16} sx={{ display: 'flex', alignItems: 'stretch' }}>
                        {residentAds.map((announcement) => (
                            <Grid2 size={{ xs: 16, md: 8 }} key={announcement._id} sx={{ display: 'flex' }}>
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
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                            <Typography
                                                variant="body2"
                                                component="p"
                                                mr={2}
                                                onClick={() => {
                                                    (announcement.reactions?.length ?? 0) > 0 &&
                                                        setOpenReactionsDetails(true);
                                                    setSelectedAnnouncement({ AnnouncementId: announcement._id, AnnouncementUser: announcement.CreatedBy });
                                                }}
                                            >
                                                <Typography sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                                                    {announcement.reactions?.length || 'Sé el primero en reaccionar'}
                                                </Typography>
                                            </Typography>
                                            {getTopReactions(announcement.reactions).map((reaction, index) => (
                                                <Box key={index} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                    {getReactionIcon(reaction)}
                                                </Box>
                                            ))}
                                            <IconButton onClick={(e) => { handlePopoverOpen(e); setSelectedAnnouncement({ AnnouncementId: announcement._id, AnnouncementUser: announcement.CreatedBy }) }}>
                                                {announcement.reactions?.some(reaction => reaction.user === user._id)
                                                    ? getReactionIconGray(announcement.reactions.find(reaction => reaction.user === user._id)?.type || '')
                                                    : <AddReaction />}
                                            </IconButton>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid2>
                        ))}
                        <Popover
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handlePopoverClose}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                        >
                            <Box sx={{ display: 'flex', flexDirection: 'row', p: 1 }}>
                                <Tooltip title="Recomendar" placement='top'>
                                    <IconButton onClick={() => hanldeReaction('recommend')}>
                                        <Recommend sx={{ color: 'blue' }} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Celebrar" placement='top'>
                                    <IconButton onClick={() => hanldeReaction('celebrate')}>
                                        <Celebration sx={{ color: 'pink' }} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Apoyar" placement='top'>
                                    <IconButton onClick={() => hanldeReaction('support')}>
                                        <Handshake sx={{ color: 'purple' }} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Encantar" placement='top'>
                                    <IconButton onClick={() => hanldeReaction('love')}>
                                        <Favorite sx={{ color: 'red' }} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Interesar" placement='top'>
                                    <IconButton onClick={() => hanldeReaction('interest')}>
                                        <TipsAndUpdates sx={{ color: 'yellowgreen' }} />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Popover>
                    </Grid2>
                )
            )}

            <Dialog open={openReactionsDetails} onClose={() => setOpenReactionsDetails(false)}>
                <DialogContent>
                    <Typography variant="h5" component="div" sx={{ mb: 2 }}>
                        Reacciones
                    </Typography>
                    <DialogContentText>
                        {residentAds.find(announcement => announcement._id === selectedAnnouncement.AnnouncementId)?.reactions?.map((reaction, index) => (
                            <Box key={index} display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                <Typography variant="body1" component="span">
                                    <b>{reaction.userName}</b> {reactionsToSpanish(reaction.type)}
                                </Typography>
                                <Typography variant="body1" component="span" sx={{ ml: 6 }}>
                                    {getReactionIcon(reaction.type)}
                                </Typography>
                            </Box>
                        ))}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenReactionsDetails(false)} color="primary">
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>

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