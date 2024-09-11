import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserService } from '../../../api/UserService';
import axios from 'axios';
import { Container, CardContent, Typography, Grid, Avatar, Box } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import EmailIcon from '@mui/icons-material/Email';
import HomeIcon from '@mui/icons-material/Home';
import PhoneIcon from '@mui/icons-material/Phone';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { UserState } from '../../../hooks/users/userSlice';
import { useSelector } from 'react-redux';


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
            console.error('Error fetching user:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            if (user.role === 'ADMIN' || user._id === id) {
                fetchUserById(id);
            } else {
                navigate('/404');
            }
        }

    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Container maxWidth="sm" sx={{ height: {xs: '100vh', sm: 'fit-content'}, backgroundColor: 'white', borderRadius: '20px', padding: 2, boxShadow: 3 }}>
            {profile ? (
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
                        <Grid item xs={2}>
                            <BadgeIcon color="secondary" />
                        </Grid>
                        <Grid item xs={10}>
                            <Typography variant="body1"><strong>Número de documento:</strong> {profile.idDocument}</Typography>
                        </Grid>

                        <Grid item xs={2}>
                            <EmailIcon color="secondary"/>
                        </Grid>
                        <Grid item xs={10}>
                            <Typography variant="body1"><strong>Email:</strong> {profile.email}</Typography>
                        </Grid>

                        <Grid item xs={2}>
                            <HomeIcon color="secondary"/>
                        </Grid>
                        <Grid item xs={10}>
                            <Typography variant="body1"><strong>Apartamento:</strong> {profile.apartment}</Typography>
                        </Grid>

                        <Grid item xs={2}>
                            <PhoneIcon color="secondary"/>
                        </Grid>
                        <Grid item xs={10}>
                            <Typography variant="body1"><strong>Teléfono:</strong> {profile.phone}</Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <AssignmentIndIcon color="secondary"/>
                        </Grid>
                        <Grid item xs={10}>
                            <Typography variant="body1"><strong>Rol:</strong> {profile.role}</Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            ) : (
                <Typography variant="body1" align="center">No se encontró el usuario</Typography>
            )}
        </Container>
    );
};

export default ViewProfile;