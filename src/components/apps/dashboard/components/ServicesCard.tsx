import { Card, Typography, CircularProgress, Alert, AlertTitle } from '@mui/material';
import {  Warning } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { DirectoryService } from '../../../../api/Directory';
import { UserState } from '../../../../hooks/users/userSlice';
import ImportContacts from '@mui/icons-material/ImportContacts';

const ServicesCard = () => {
    const [totalServices, setTotalServices] = useState(0);
    const [isLoadingServices, setIsLoadingServices] = useState(false);
    const user = useSelector((state: { user: UserState }) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user.idComplex) return;
        const fetchServices = async () => {
            setIsLoadingServices(true);
            const servicesResponse = await axios.get(`${DirectoryService.baseUrl}${DirectoryService.endpoints.GetByComplex}/${user.idComplex}`);
            const services = servicesResponse.data;
            setTotalServices(services.length);
            setIsLoadingServices(false);
        };
        fetchServices();
    }, [user.idComplex]);

    return (
        <Card onClick={() => navigate('/app/directory')} sx={{
            height: '100%',
            width: 'auto',
            padding: '24px',
            textAlign: 'center',
            borderRadius: '12px',
            marginBottom: '16px',
            boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
        }}>
            <ImportContacts color="secondary" style={{ fontSize: '50px' }} />
            <Typography variant="h6" color="textSecondary">Total de Servicios</Typography>
            <Typography variant="h4">
                {isLoadingServices ? <CircularProgress /> : totalServices > 0 ? totalServices : (
                    <Alert severity="warning" icon={<Warning />} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <AlertTitle>No hay servicios</AlertTitle>
                    </Alert>
                )}
            </Typography>
        </Card>
    );
};

export default ServicesCard;