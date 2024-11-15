import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { UserState } from '../../../hooks/users/userSlice'
import { Link } from 'react-router-dom'
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
} from '@mui/material'
import axios from 'axios'
import { AddBox, Delete, Edit, Help } from '@mui/icons-material'
import WarningIcon from '@mui/icons-material/Warning';
import { toast } from 'react-toastify';
import { AnnouncementsService } from '../../../api/Anouncements'
import { format } from '@formkit/tempo'



const MyAds = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [reloadFlag, setReloadFlag] = useState<boolean>(false);
    const [ads, setAds] = useState<any[]>([]);
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const [selectedAd, setSelectedAd] = useState<any>({ adId: '', adTitle: '' });
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    const user = useSelector((state: { user: UserState }) => state.user);

    useEffect(() => {
        if (!user._id) return;
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${AnnouncementsService.baseUrl}${AnnouncementsService.endpoints.GetAnnouncementsByUser}/${user._id}`);

                if (response.data.status === 404) {
                    setAds([]);
                    return;
                }
                const sortedAds = response.data
                    .sort((a: any, b: any) => new Date(b.Date).getTime() - new Date(a.Date).getTime());
                setAds(sortedAds);
            } catch (error) {
                toast.error('Error al cargar las publicaciones');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [reloadFlag, user._id]);

    const openDeleteDialog = (adId: string, adTitle: string) => {
        setSelectedAd({ adId, adTitle });
        setDeleteModalOpen(true);
    }

    const handleDelete = async (adId: String) => {
        setIsDeleting(true);
        try {
            await axios.delete(`${AnnouncementsService.baseUrl}${AnnouncementsService.endpoints.DeleteAnnouncement}/${adId}/${user._id}`);
            setReloadFlag(!reloadFlag);
            setDeleteModalOpen(false);
            setIsDeleting(false);
            toast.success('Publicación eliminada correctamente');
        } catch (error) {
            setIsDeleting(false);
            toast.error('Error al eliminar la publicación');
        }
    }

    return (
        <Container disableGutters className="bg-white flex justify-center max-w-4xl rounded-lg">
            <Box sx={{ flexGrow: 1, maxWidth: 1024, minHeight: '80vh', p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h5" component="h1" gutterBottom>
                        Mis publicaciones
                    </Typography>
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
                                    <TableCell align='center'>Título</TableCell>
                                    <TableCell align='center'>Fecha de publicación</TableCell>
                                    <TableCell align='center'>Última modificación</TableCell>
                                    <TableCell align="right"></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {ads.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center">
                                            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                                <Help sx={{ mb: 2 }} fontSize='large' color='secondary' />
                                                <Typography variant="h5" component="p" gutterBottom>
                                                    No tienes publicaciones, puedes crear una nueva tocando el botón de arriba
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    ads.map((ad) => (
                                        <TableRow key={ad._id}>
                                            <TableCell component="th" scope="row" align='center'>
                                                {ad.Title}
                                            </TableCell>
                                            <TableCell component="th" scope="row" align='center'>
                                                {format(ad.Date, { date: "short", time: "short" })}
                                            </TableCell>
                                            <TableCell component="th" scope="row" align='center'>
                                                {format(ad.LastModified, { date: "short", time: "short" })}
                                            </TableCell>
                                            <TableCell align="right">
                                                <Link to={`/app/announcements/edit/${ad._id}`}>
                                                    <IconButton
                                                        aria-label="Edit"
                                                        color='primary'
                                                    >
                                                        <Edit />
                                                    </IconButton>
                                                </Link>
                                                <IconButton
                                                    onClick={() => openDeleteDialog(ad._id, ad.Title)}
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
                            ¿Estás segur@ de que deseas eliminar la publicación: <b>{selectedAd.adTitle}</b>?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteModalOpen(false)} color="secondary">
                            Cancelar
                        </Button>
                        <Button onClick={() => handleDelete(selectedAd.adId)} color="primary">
                            Eliminar
                        </Button>
                    </DialogActions>
                </Dialog>

            </Box>
        </Container>
    )
}

export default MyAds