import { Card, Typography, CircularProgress, Alert, AlertTitle } from '@mui/material';
import { People, Warning } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { UserService } from '../../../../api/UserService';
import { UserState } from '../../../../hooks/users/userSlice';

const ResidentsCard = () => {
    const [residentesTotal, setResidentesTotal] = useState(0);
    const [isLoadingResidents, setIsLoadingResidents] = useState(false);
    const user = useSelector((state: { user: UserState }) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchResidents = async () => {
            setIsLoadingResidents(true);
            const residentsResponse = await axios.get(`${UserService.baseUrl}${UserService.endpoints.GetUsersByComplex}/${user.idComplex}`);
            const residents = residentsResponse.data;
            const filteredResidents = residents.filter((resident: any) => resident.role !== 'ADMIN');
            setResidentesTotal(filteredResidents.length);
            setIsLoadingResidents(false);
        };
        fetchResidents();
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
        }}>
            <People color="success" style={{ fontSize: '50px' }} />
            <Typography variant="h6" color="textSecondary">Residentes Totales</Typography>
            <Typography variant="h4">
                {isLoadingResidents ? <CircularProgress /> : residentesTotal > 0 ? residentesTotal : (
                    <Alert severity="warning" icon={<Warning />} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <AlertTitle>No hay residentes</AlertTitle>
                    </Alert>
                )}
            </Typography>
        </Card>
    );
};

export default ResidentsCard;