import { Card, CircularProgress, Alert, AlertTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { Warning } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { pqrsService } from '../../../../api/Pqrs';
import { UserState } from '../../../../hooks/users/userSlice';
import { Pqrs } from '../../models';
import { useNavigate } from 'react-router-dom';

const LatestPqrsTable = () => {
    const [pqrsData, setPqrsData] = useState<Pqrs[]>([]);
    const [isLoadingPqrs, setIsLoadingPqrs] = useState(false);
    const user = useSelector((state: { user: UserState }) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPqrs = async () => {
            setIsLoadingPqrs(true);
            const pqrsResponse = await axios.get(`${pqrsService.baseUrl}${pqrsService.endpoints.getPqrsByComplex}/${user.idComplex}`);
            const pqrs: Pqrs[] = pqrsResponse.data;
            setPqrsData(pqrs);
            setIsLoadingPqrs(false);
        };
        fetchPqrs();
    }, [user.idComplex]);

    const latestPqrs = pqrsData.slice(-5).reverse();

    return (
        <Card onClick={() => navigate('/app/cases')} sx={{
            padding: '24px',
            textAlign: 'center',
            borderRadius: '12px',
            boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)',
            height: '100%',
        }}>
            <Typography variant="h6" color="textSecondary" mb={2}>Últimas 5 PQRS</Typography>
            {isLoadingPqrs ? <CircularProgress /> : latestPqrs.length === 0 ? (
                <Alert severity="warning" icon={<Warning />} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <AlertTitle>No hay datos de PQRS recientes</AlertTitle>
                </Alert>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Asunto</TableCell>
                                <TableCell>Residente</TableCell>
                                <TableCell>Fecha</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {latestPqrs.map((pqr) => (
                                <TableRow key={pqr._id}>
                                    <TableCell>{pqr.case}</TableCell>
                                    <TableCell>{pqr.userName}</TableCell>
                                    <TableCell>{new Date(pqr.date).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Card>
    );
};

export default LatestPqrsTable;