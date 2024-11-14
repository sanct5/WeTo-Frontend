import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    CircularProgress,
    Card,
    CardContent,
    Avatar,
    Grid2,
    useTheme,
} from '@mui/material';
import { ReportProblem, Error, Assignment, Lightbulb } from '@mui/icons-material';
import axios from 'axios';
import { pqrsService } from '../../../../api/Pqrs';
import { UserService } from '../../../../api/UserService';
import { useSelector } from 'react-redux';
import { UserState } from '../../../../hooks/users/userSlice';
import { useNavigate } from 'react-router-dom';

const PqrsZones = () => {
    const [pqrsData, setPqrsData] = useState<{ [building: string]: { Complaints: number, Claims: number, Requests: number, Suggestions: number } }>({});
    const [loading, setLoading] = useState(false);

    const user = useSelector((state: { user: UserState }) => state.user);
    const navigate = useNavigate();
    const theme = useTheme();

    useEffect(() => {
        if (!user.idComplex) return;
        const getCases = async () => {
            setLoading(true);
            try {
                const pqrsResponse = await axios.get<any[]>(`${pqrsService.baseUrl}${pqrsService.endpoints.getPqrsByComplex}/${user.idComplex}`);
                const cases = pqrsResponse.data;

                const usersResponse = await axios.get<any[]>(`${UserService.baseUrl}${UserService.endpoints.GetUsersByComplex}/${user.idComplex}`);
                const users = usersResponse.data;

                const userBuildingMap: { [key: string]: string } = {};
                users.forEach(user => {
                    const apartment = user.apartment;
                    const building = apartment.split('-')[1];
                    userBuildingMap[user._id] = building;

                });

                const groupedPqrs: { [building: string]: { Complaints: number, Claims: number, Requests: number, Suggestions: number } } = {};
                cases.forEach(pqrs => {
                    const building = userBuildingMap[pqrs.user];
                    if (building) {
                        if (!groupedPqrs[building]) {
                            groupedPqrs[building] = { Complaints: 0, Claims: 0, Requests: 0, Suggestions: 0 };
                        }
                        if (pqrs.category === 'Q') groupedPqrs[building].Complaints++;
                        if (pqrs.category === 'R') groupedPqrs[building].Claims++;
                        if (pqrs.category === 'P') groupedPqrs[building].Requests++;
                        if (pqrs.category === 'S') groupedPqrs[building].Suggestions++;
                    }
                });

                // Ensure all buildings have entries even if they have 0 cases
                Object.keys(userBuildingMap).forEach(userId => {
                    if (user.role === 'ADMIN') return;
                    const building = userBuildingMap[userId];
                    if (!groupedPqrs[building]) {
                        groupedPqrs[building] = { Complaints: 0, Claims: 0, Requests: 0, Suggestions: 0 };
                    }
                });

                setPqrsData(groupedPqrs);
            } catch (error) {
                return;
            } finally {
                setLoading(false);
            }
        };

        getCases();
    }, [user.idComplex]);

    const getBackgroundColor = (totalPqrs: number) => {
        if (totalPqrs >= 20) return theme.palette.primary.light;
        if (totalPqrs >= 10) return theme.palette.primary.main;
        if (totalPqrs >= 5) return theme.palette.secondary.main;
        return theme.palette.secondary.light;
    };

    const getAvatarColor = (backgroundColor: string) => {
        if (backgroundColor === theme.palette.primary.light || backgroundColor === theme.palette.primary.main) {
            return theme.palette.secondary.main;
        }
        return theme.palette.primary.main;
    };

    return (
        <Card sx={{
            padding: '24px',
            textAlign: 'center',
            borderRadius: '12px',
            boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)',
        }}>
            <Box sx={{ padding: 2 }}>
                <Typography variant="h6" mb={2}>PQRS por edificio</Typography>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
                        <CircularProgress />
                        <Typography variant="body2" color="textSecondary" sx={{ ml: 2 }}>
                            Cargando casos...
                        </Typography>
                    </Box>
                ) : (
                    <Grid2 container spacing={2} justifyContent="center">
                        {Object.keys(pqrsData).map((building) => {
                            const totalPqrs = pqrsData[building].Complaints + pqrsData[building].Claims + pqrsData[building].Requests + pqrsData[building].Suggestions;
                            const backgroundColor = getBackgroundColor(totalPqrs);
                            return (
                                <Grid2 size={{ xs: 12, sm: 6 }} key={building}>
                                    <Card onClick={() => navigate('/app/cases')} sx={{
                                        bgcolor: backgroundColor,
                                        borderRadius: '8px',
                                        boxShadow: 3,
                                        transition: 'transform 0.3s',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                        },
                                        cursor: 'pointer',
                                    }}>
                                        <CardContent >
                                            <Box display="flex" alignItems="center" mb={3}>
                                                <Avatar sx={{ bgcolor: getAvatarColor(backgroundColor) }}>
                                                    {building}
                                                </Avatar>
                                                <Typography variant="h6" color="white" sx={{ marginLeft: 2 }}>
                                                    {`Edificio ${building}`}
                                                </Typography>
                                            </Box>

                                            <Box display="flex" flexDirection="column" alignItems="flex-start" gap={2}>
                                                <Box display="flex" alignItems="center">
                                                    <ReportProblem color="error" />
                                                    <Typography>Quejas: {pqrsData[building].Complaints}</Typography>
                                                </Box>
                                                <Box display="flex" alignItems="center">
                                                    <Error color="warning" />
                                                    <Typography>Reclamos: {pqrsData[building].Claims}</Typography>
                                                </Box>
                                                <Box display="flex" alignItems="center">
                                                    <Assignment color="primary" />
                                                    <Typography>Solicitudes: {pqrsData[building].Requests}</Typography>
                                                </Box>
                                                <Box display="flex" alignItems="center">
                                                    <Lightbulb color="success" />
                                                    <Typography>Sugerencias: {pqrsData[building].Suggestions}</Typography>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid2>
                            );
                        })}
                    </Grid2>
                )}
            </Box>
        </Card >
    );
};

export default PqrsZones;