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
    Dialog, DialogTitle, DialogContent, DialogActions, Button,
    IconButton,
    TextField,
    Tooltip,
    DialogContentText,
} from '@mui/material';
import axios from 'axios';
import { Pqrs } from '../models';
import { pqrsService } from '../../../api/Pqrs';
import { useSelector } from 'react-redux';
import { UserState } from '../../../hooks/users/userSlice';
import { PriorityHigh, CalendarMonth, Person, Close, Send, Info, Warning, Gavel } from '@mui/icons-material';
import { format } from '@formkit/tempo';
import { ViewOneCase } from './ViewOneCase';
import { toast } from 'react-toastify';

const ViewCases = () => {
    const [tabValue, setTabValue] = useState('one');
    const [reloadFlag, setReloadFlag] = useState(false);
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState<Pqrs[]>([]);
    const [complaints, setComplaints] = useState<Pqrs[]>([]);
    const [suggestions, setSuggestions] = useState<Pqrs[]>([]);
    const [claims, setClaims] = useState<Pqrs[]>([]);
    const [open, setOpen] = useState(false);
    const [answer, setAnswer] = useState<string>('');
    const [closePqrsModal, setClosePqrsModal] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [selectedCase, setSelectedCase] = useState<Pqrs>(
        {
            _id: '',
            user: '',
            userName: '',
            case: '',
            description: '',
            category: 'P',
            date: new Date(),
            state: 'pendiente',
            answer: [],
        }
    );

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

    const handleSendAnswer = async () => {
        if (isReplying) return;

        if (answer.trim() === '') {
            toast.error('El mensaje no puede estar vacío');
            return;
        }

        setIsReplying(true);
        try {
            const response = await axios.put(`${pqrsService.baseUrl}${pqrsService.endpoints.replyPqrs}/${selectedCase._id}`, {
                answer: answer.trim(),
                userId: user._id,
            });

            if (response.status === 200) {
                toast.success('Respuesta enviada');

                // Temporal solution to update the answer in the selected case until the backend is updated
                setSelectedCase({
                    ...selectedCase, answer: [...selectedCase.answer, {
                        _id: response.data._id,
                        comment: answer,
                        date: new Date(),
                        admin: user._id,
                    }],
                    state: 'tramite',
                });

                setAnswer('');
            }
        } catch (error) {
            toast.error('Error al enviar la respuesta');
        } finally {
            setIsReplying(false);
        }
    }

    const handleCaseClose = async () => {
        setIsClosing(true);
        try {
            const response = await axios.put(`${pqrsService.baseUrl}${pqrsService.endpoints.closePqrs}/${selectedCase._id}`, {
                userId: user._id,
            });

            if (response.status === 200) {
                toast.success('Caso cerrado');
                setReloadFlag(!reloadFlag);
                setAnswer('');
                setOpen(false);
                setClosePqrsModal(false);
            }
        } catch (error) {
            toast.error('Error al cerrar el caso');
        } finally {
            setIsClosing(false);
        }
    }

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
                            onClick={() => {
                                setOpen(true);
                                setSelectedCase(c);
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
                            onClick={() => {
                                setOpen(true);
                                setSelectedCase(c);
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
                            onClick={() => {
                                setOpen(true);
                                setSelectedCase(c);
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

            <Dialog
                open={open}
                onClose={() => {
                    setOpen(false);
                    setAnswer('');
                    setReloadFlag(!reloadFlag);
                }}
                fullScreen
                sx={{
                    maxWidth: { xs: '95%', sm: '70%' },
                    margin: 'auto',
                    maxHeight: { xs: '95%', sm: '90%' },
                }}
            >
                <DialogTitle sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', pb: 0, pt: 0 }}>
                    <Box display="flex" alignItems="center" justifyContent="flex-start" width="100%">
                        <Box display="flex" alignItems="center">
                            <Person color='primary' sx={{ mr: 1 }} />
                            <Typography variant="body1" color="textSecondary" fontWeight="bold">
                                {selectedCase.userName}
                            </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" marginLeft={2}>
                            <CalendarMonth color='secondary' sx={{ mr: 1 }} />
                            <Typography variant="body2" color="textSecondary">
                                {format(selectedCase.date, { date: "short", time: "short" })}
                            </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" marginLeft={2}>
                            <Info color='secondary' sx={{ mr: 1 }} />
                            <Typography variant="body2" color="textSecondary" sx={{ textTransform: 'capitalize' }}>
                                {selectedCase.state}
                            </Typography>
                        </Box>
                    </Box>
                    <IconButton
                        aria-label="close"
                        onClick={() => setOpen(false)}
                        sx={{
                            alignSelf: 'flex-end',
                            color: (theme) => theme.palette.secondary.main,
                        }}
                    >
                        <Close fontSize='large' />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ overflowY: 'auto', border: '1px solid #f0f0f0' }}>
                    <ViewOneCase answers={selectedCase.answer} description={selectedCase.description} />
                </DialogContent>
                {selectedCase.state != 'cerrado' && <DialogActions sx={{ padding: 3 }}>
                    {selectedCase.state != 'pendiente' && <Tooltip title="Cerrar caso"
                        placement="top"
                        arrow
                    >
                        <IconButton color="secondary" onClick={() => setClosePqrsModal(true)}>
                            <Gavel />
                        </IconButton>
                    </Tooltip>}
                    <TextField
                        id="answer"
                        label="Mensaje"
                        multiline
                        rows={2}
                        fullWidth
                        variant="outlined"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        inputProps={{ maxLength: 500 }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        sx={{ display: { xs: 'none', sm: 'flex' } }}
                        onClick={handleSendAnswer}
                    >
                        Responder
                    </Button>
                    <IconButton
                        color="primary"
                        sx={{ display: { xs: 'flex', sm: 'none' } }}
                        onClick={handleSendAnswer}
                    >
                        <Send />
                    </IconButton>
                </DialogActions>}
            </Dialog>

            <Dialog open={closePqrsModal} onClose={() => setClosePqrsModal(false)}>
                <DialogContent>
                    {!isClosing ? (<Warning color="secondary" style={{ fontSize: 60, display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />) : <CircularProgress style={{ fontSize: 50, display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />}
                    <DialogContentText align="center" fontSize={20} sx={{ marginTop: "25px" }}>
                        ¿Estás segur@ de que deseas cerrar el caso: <b>{selectedCase.case}</b>?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setClosePqrsModal(false)} color="secondary">
                        Cancelar
                    </Button>
                    <Button onClick={() => handleCaseClose()} color="primary">
                        Cerrar caso
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
};

export default ViewCases