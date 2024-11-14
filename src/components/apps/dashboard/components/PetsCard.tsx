import { Card, Typography, CircularProgress, Alert, AlertTitle } from '@mui/material';
import { Pets, Warning } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { UserService } from '../../../../api/UserService';
import { UserState } from '../../../../hooks/users/userSlice';

const PetsCard = () => {
    const [totalPets, setTotalPets] = useState(0);
    const [isLoadingPets, setIsLoadingPets] = useState(false);
    const user = useSelector((state: { user: UserState }) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user.idComplex) return;
        const fetchPets = async () => {
            setIsLoadingPets(true);
            const residentsResponse = await axios.get(`${UserService.baseUrl}${UserService.endpoints.GetUsersByComplex}/${user.idComplex}`);
            const residents = residentsResponse.data;
            const petsCount = residents.reduce((total: number, resident: any) => total + (resident.pets ? resident.pets.length : 0), 0);
            setTotalPets(petsCount);
            setIsLoadingPets(false);
        };
        fetchPets();
    }, [user.idComplex]);

    return (
        <Card onClick={() => navigate('/app/residents')} sx={{
            height: '100%',
            width: 'auto',
            padding: '24px',
            textAlign: 'center',
            borderRadius: '12px',
            marginBottom: '16px',
            boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
        }}>
            <Pets color="primary" style={{ fontSize: '50px' }} />
            <Typography variant="h6" color="textSecondary">Total de Mascotas</Typography>
            <Typography variant="h4">
                {isLoadingPets ? <CircularProgress /> : totalPets > 0 ? totalPets : (
                    <Alert severity="warning" icon={<Warning />} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <AlertTitle>No hay mascotas</AlertTitle>
                    </Alert>
                )}
            </Typography>
        </Card>
    );
};

export default PetsCard;