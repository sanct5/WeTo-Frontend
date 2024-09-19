import { useState, useEffect } from 'react';
import {
    Tabs,
    Tab,
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    CircularProgress,
} from '@mui/material';
import axios from 'axios';
import { Pqrs } from '../models';
import { pqrsService } from '../../../api/Pqrs';
import { useSelector } from 'react-redux';
import { UserState } from '../../../hooks/users/userSlice';
import { PriorityHigh, CalendarMonth, Person } from '@mui/icons-material';
import { format } from '@formkit/tempo';

const ViewCases = () => {
    const [tabValue, setTabValue] = useState('one');
    const [reloadFlag, setReloadFlag] = useState(false);
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState<Pqrs[]>([]);
    const [complaints, setComplaints] = useState<Pqrs[]>([]);
    const [suggestions, setSuggestions] = useState<Pqrs[]>([]);
    const [claims, setClaims] = useState<Pqrs[]>([]);

    const user = useSelector((state: { user: UserState }) => state.user);

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        event.preventDefault();
        setTabValue(newValue);
        setReloadFlag(!reloadFlag);
    };

    useEffect(() => {
        const getCases = async () => {
            setLoading(true);
            const response = await axios.get<Pqrs[]>(`${pqrsService.baseUrl}${pqrsService.endpoints.getPqrsByComplex}/${user.idComplex}`);
            const cases = response.data.sort((a, b) => a.date > b.date ? -1 : 1);

            const questions = cases.filter(c => c.category === 'P');
            const complaints = cases.filter(c => c.category === 'Q');
            const suggestions = cases.filter(c => c.category === 'R');
            const claims = cases.filter(c => c.category === 'S');

            setQuestions(questions);
            setComplaints(complaints);
            setSuggestions(suggestions);
            setClaims(claims);

            setLoading(false);
        };
        getCases();
    }, [reloadFlag, user.idComplex]);

    const renderCasesByState = (cases: Pqrs[]) => (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
                <Typography variant="h6" align="center" marginBottom={1}>Pendiente</Typography>
                {cases.filter(c => c.state === 'pendiente').length === 0 ? (
                    <Box display="flex" flexDirection="column" justifyContent="flex-start" alignItems="center" sx={{ height: '100%' }}>
                        <PriorityHigh fontSize="large" color="secondary" />
                        <Typography variant="body2" color="textSecondary" align="center">No hay casos pendientes</Typography>
                    </Box>
                ) : (
                    cases.filter(c => c.state === 'pendiente').map((c) => (
                        <Card
                            key={c._id}
                            sx={{
                                marginBottom: 2,
                                cursor: 'pointer',
                                transition: 'background-color 0.3s',
                                '&:hover': {
                                    backgroundColor: '#f0f0f0'
                                }
                            }}
                        >
                            <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography variant="h6" sx={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                                    {c.case}
                                </Typography>
                                <Typography variant="body2" sx={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                                    {c.description}
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 1 }}>
                                    <Person color='primary' sx={{ mr: 1 }} />
                                    {c.userName}
                                </Typography>
                                <Typography variant="body2" component="p">
                                    <CalendarMonth color='secondary' sx={{ mr: 1 }} />
                                    {format(c.date, { date: "long", time: "short" })}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))
                )}
            </Grid>
            <Grid item xs={12} sm={4}>
                <Typography variant="h6" align="center" marginBottom={1}>Trámite</Typography>
                {cases.filter(c => c.state === 'tramite').length === 0 ? (
                    <Box display="flex" flexDirection="column" justifyContent="flex-start" alignItems="center" sx={{ height: '100%' }}>
                        <PriorityHigh fontSize="large" color="secondary" />
                        <Typography variant="body2" color="textSecondary" align="center">No hay casos en trámite</Typography>
                    </Box>
                ) : (
                    cases.filter(c => c.state === 'tramite').map((c) => (
                        <Card
                            key={c._id}
                            sx={{
                                marginBottom: 2,
                                cursor: 'pointer',
                                transition: 'background-color 0.3s',
                                '&:hover': {
                                    backgroundColor: '#f0f0f0'
                                }
                            }}
                        >
                            <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography variant="h6" sx={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                                    {c.case}
                                </Typography>
                                <Typography variant="body2" sx={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                                    {c.description}
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 1 }}>
                                    <Person color='primary' sx={{ mr: 1 }} />
                                    {c.userName}
                                </Typography>
                                <Typography variant="body2" component="p">
                                    <CalendarMonth color='secondary' sx={{ mr: 1 }} />
                                    {format(c.date, { date: "long", time: "short" })}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))
                )}
            </Grid>
            <Grid item xs={12} sm={4}>
                <Typography variant="h6" align="center" marginBottom={1}>Cerrado</Typography>
                {cases.filter(c => c.state === 'cerrado').length === 0 ? (
                    <Box display="flex" flexDirection="column" justifyContent="flex-start" alignItems="center" sx={{ height: '100%' }}>
                        <PriorityHigh fontSize="large" color="secondary" />
                        <Typography variant="body2" color="textSecondary" align="center">No hay casos cerrados</Typography>
                    </Box>
                ) : (
                    cases.filter(c => c.state === 'cerrado').map((c) => (
                        <Card
                            key={c._id}
                            sx={{
                                marginBottom: 2,
                                cursor: 'pointer',
                                transition: 'background-color 0.3s',
                                '&:hover': {
                                    backgroundColor: '#f0f0f0'
                                }
                            }}
                        >
                            <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography variant="h6" sx={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                                    {c.case}
                                </Typography>
                                <Typography variant="body2" sx={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                                    {c.description}
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 1 }}>
                                    <Person color='primary' sx={{ mr: 1 }} />
                                    {c.userName}
                                </Typography>
                                <Typography variant="body2" component="p">
                                    <CalendarMonth color='secondary' sx={{ mr: 1 }} />
                                    {format(c.date, { date: "long", time: "short" })}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))
                )}
            </Grid>
        </Grid>
    );

    return (
        <Box sx={{ backgroundColor: '#F0F0F0', height: 'max-content', minHeight: '100vh' }}>
            <Tabs
                value={tabValue}
                onChange={handleChange}
                textColor="secondary"
                variant="scrollable"
                scrollButtons
                allowScrollButtonsMobile
                indicatorColor="secondary"
                aria-label="Tabs"
            >
                <Tab value="one" label={'Peticiones'} />
                <Tab value="two" label={'Quejas'} />
                <Tab value="three" label={'Reclamos'} />
                <Tab value="four" label={'Sugerencias'} />
            </Tabs>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                    <CircularProgress />
                    <Typography variant="body2" color="textSecondary" sx={{ ml: 2 }}>Cargando casos</Typography>
                </Box>
            ) : (
                <Box p={2}>
                    {tabValue === 'one' && renderCasesByState(questions)}
                    {tabValue === 'two' && renderCasesByState(complaints)}
                    {tabValue === 'three' && renderCasesByState(suggestions)}
                    {tabValue === 'four' && renderCasesByState(claims)}
                </Box>
            )}
        </Box>
    );
};

export default ViewCases