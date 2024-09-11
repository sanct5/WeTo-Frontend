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
    CircularProgress
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { UserState } from '../../../hooks/users/userSlice';
import { useSelector } from 'react-redux';
import {
    ErrorOutline,
    Badge,
    Email,
    Home,
    Phone,
    AssignmentInd
} from '@mui/icons-material';

const ViewProfile = () => {
    const { id } = useParams<{ id: string }>();
    const user = useSelector((state: { user: UserState }) => state.user);
    const [profile, setProfile] = useState<UserState | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

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

    useEffect(() => {
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

    }, [user._id, id]);

    return (
        <Container maxWidth="sm" sx={{ height: { xs: '100vh', sm: 'fit-content' }, backgroundColor: 'white', borderRadius: '20px', padding: 2, boxShadow: 3 }}>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
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
    );
};

export default ViewProfile;