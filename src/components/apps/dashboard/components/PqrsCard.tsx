import { Card, Typography, CircularProgress, Alert, AlertTitle } from '@mui/material';
import { PendingActions, Warning } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { pqrsService } from '../../../../api/Pqrs';
import { UserState } from '../../../../hooks/users/userSlice';
import { Pqrs } from '../../models';

const PqrsCard = () => {
    const [pqrsData, setPqrsData] = useState<Pqrs[]>([]);
    const [isLoadingPqrs, setIsLoadingPqrs] = useState(false);
    const user = useSelector((state: { user: UserState }) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user.idComplex) return;
        const fetchPqrs = async () => {
            setIsLoadingPqrs(true);
            const pqrsResponse = await axios.get(`${pqrsService.baseUrl}${pqrsService.endpoints.getPqrsByComplex}/${user.idComplex}`);
            const pqrs: Pqrs[] = pqrsResponse.data;
            setPqrsData(pqrs);
            setIsLoadingPqrs(false);
        };
        fetchPqrs();
    }, [user.idComplex]);

    const pqrsPendientesCount = pqrsData.filter(pqr => pqr.state === 'pendiente' || pqr.state === 'tramite').length;

    return (
        <Card onClick={() => navigate('/app/cases')} sx={{
            height: '100%',
            width: 'auto',
            padding: '24px',
            textAlign: 'center',
            borderRadius: '12px',
            boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
        }}>
            <PendingActions color="secondary" style={{ fontSize: '50px' }} />
            <Typography variant="h6" color="textSecondary">PQRS Pendientes</Typography>
            <Typography variant="h4">
                {isLoadingPqrs ? <CircularProgress /> : pqrsPendientesCount > 0 ? pqrsPendientesCount : (
                    <Alert severity="warning" icon={<Warning />} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <AlertTitle>No hay PQRS pendientes</AlertTitle>
                    </Alert>
                )}
            </Typography>
        </Card>
    );
};

export default PqrsCard;