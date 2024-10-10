import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { UserState } from '../../../hooks/users/userSlice'
import { Link, useNavigate } from 'react-router-dom'
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
import { UserService } from '../../../api/UserService'
import { AddBox, Delete, Edit } from '@mui/icons-material'
import WarningIcon from '@mui/icons-material/Warning';
import { toast } from 'react-toastify';



const viewAll = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [reloadFlag, setReloadFlag] = useState<boolean>(false);
    const [residents, setResidents] = useState<any[]>([]);
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<any>({ userId: '', userName: '' });
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    const navigate = useNavigate();

    const user = useSelector((state: { user: UserState }) => state.user);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            let idComplex = user.idComplex;

            const response = await axios.get(`${UserService.baseUrl}${UserService.endpoints.GetUsersByComplex}/${idComplex}`);
            const sortedResidents = response.data
                .sort((a: any, b: any) => a.userName.localeCompare(b.userName))
                .filter((resident: any) => resident.idDocument !== user.idDocument);
            setResidents(sortedResidents);

            setLoading(false);
        };

        fetchData();
    }, [reloadFlag, user.idComplex]);

    const openDeleteDialog = (userId: string, userName: string) => {
        setSelectedUser({ userId, userName });
        setDeleteModalOpen(true);
    }

    const handleDelete = async (userId: String) => {
        setIsDeleting(true);
        try {
            await axios.delete(`${UserService.baseUrl}${UserService.endpoints.DeleteUser}/${userId}`);
            setReloadFlag(!reloadFlag);
            setDeleteModalOpen(false);
            setIsDeleting(false);
            toast.success('Usuario eliminado correctamente');
        } catch (error) {
            setIsDeleting(false);
            toast.error('Error al eliminar el Usuario');
        }
    }

    return (
        <Container disableGutters className="bg-white flex justify-center max-w-4xl rounded-lg">
            <Box sx={{ flexGrow: 1, maxWidth: 1024, minHeight: '80vh', p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h5" component="h1" gutterBottom>
                        Mis residentes
                    </Typography>
                    <IconButton
                        component={Link}
                        to="create"
                        aria-label="Create"
                        color='primary'
                    >
                        <AddBox />
                    </IconButton>
                </Box>
                <Typography variant="body1" mb={2}>
                    Aquí puedes ver a todos los residentes de tu unidad. Para ver más detalles de un residente, has click en su nombre.
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
                                    <TableCell align='center'>Nombre</TableCell>
                                    <TableCell align='center'>Departamento</TableCell>
                                    <TableCell align='center'>Teléfono</TableCell>
                                    <TableCell align="right"></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {residents.map((resident) => (
                                    <TableRow key={resident.idDocument}>
                                        <TableCell
                                            component="th"
                                            scope="row"
                                            align="center"
                                            onClick={() => navigate(`/app/profile/${resident._id}`)}
                                            sx={{ cursor: 'pointer' }}
                                            className="transform transition-transform duration-300 hover:scale-125 hover:font-bold"
                                        >
                                            {resident.userName}
                                        </TableCell>
                                        <TableCell component="th" scope="row" align='center'>
                                            {resident.apartment}
                                        </TableCell>
                                        <TableCell component="th" scope="row" align='center'>
                                            {resident.phone}
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                component={Link}
                                                to={`edit/${resident._id}`}
                                                aria-label="Edit"
                                                color='primary'
                                            >
                                                <Edit />
                                            </IconButton>
                                            <IconButton
                                                onClick={() => {
                                                    openDeleteDialog(resident._id, resident.userName);
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
                        {!isDeleting ? (<WarningIcon color="secondary" style={{ fontSize: 60, display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />) : <CircularProgress style={{ fontSize: 50, display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />}
                        <DialogContentText align="center" fontSize={20} sx={{ marginTop: "25px" }}>
                            ¿Estás segur@ de que deseas eliminar al usuario: <b>{selectedUser.userName}</b>?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteModalOpen(false)} color="secondary">
                            Cancelar
                        </Button>
                        <Button onClick={() => handleDelete(selectedUser.userId)} color="primary">
                            Eliminar
                        </Button>
                    </DialogActions>
                </Dialog>

            </Box>
        </Container>
    )
}

export default viewAll