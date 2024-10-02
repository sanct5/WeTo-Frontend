import { useState } from 'react'
import {
    Box,
    Typography,
    CircularProgress,
    Dialog, DialogTitle, DialogContent, DialogActions, Button,
    IconButton,
    TextField,
    Tooltip,
    DialogContentText,
} from '@mui/material';
import { Close, Send, Warning, MeetingRoom, NotificationAdd, Refresh, Person, CalendarMonth, Info, Gavel } from '@mui/icons-material';
import { format } from '@formkit/tempo';
import { toast } from 'react-toastify';
import axios from 'axios';
import { pqrsService } from '../../../api/Pqrs';
import { CaseMessages } from './CaseMessages';
import { useSelector } from 'react-redux';
import { UserState } from '../../../hooks/users/userSlice';
import { Pqrs } from '../models';

interface CaseModalProps {
    selectedCase: Pqrs;
    setSelectedCase: React.Dispatch<React.SetStateAction<Pqrs>>;
    reloadFlag: boolean;
    setReloadFlag: React.Dispatch<React.SetStateAction<boolean>>;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CaseModal: React.FC<CaseModalProps> = ({ selectedCase, setSelectedCase, reloadFlag, setReloadFlag, open, setOpen }) => {
    const [answer, setAnswer] = useState<string>('');
    const [closePqrsModal, setClosePqrsModal] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [reloadAnswers, setReloadAnswers] = useState(false);

    const user = useSelector((state: { user: UserState }) => state.user);

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

                if (selectedCase.state === 'pendiente') {
                    setSelectedCase({
                        ...selectedCase,
                        state: 'tramite',
                    });
                }

                setReloadAnswers(!reloadAnswers);
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

    const handleNotify = async () => {
        if (isReplying) return;

        setIsReplying(true);

        try {
            const response = await axios.put(`${pqrsService.baseUrl}${pqrsService.endpoints.notifyOne}/${user._id}/${selectedCase._id}`, {
                userId: user._id,
            });

            if (response.status === 200) {
                toast.success('Notificación enviada');
                setReloadFlag(!reloadFlag);
                setAnswer('');
                setOpen(false);
                setClosePqrsModal(false);
            }
        } catch (error) {
            toast.error('Error al enviar la notificación');
        } finally {
            setIsReplying(false);
        }
    }

    const handleReopenCase = async () => {
        setIsClosing(true);
        try {
            const response = await axios.put(`${pqrsService.baseUrl}${pqrsService.endpoints.reopen}/${selectedCase._id}`);

            if (response.status === 200) {
                toast.success('Caso reabierto');
                setSelectedCase({
                    ...selectedCase,
                    state: 'tramite',
                });
                setReloadFlag(!reloadFlag);
            }
        } catch (error) {
            toast.error('Error al reabrir el caso');
        } finally {
            setIsClosing(false);
        }
    }
    return (
        <>
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
                        {selectedCase.state != 'cerrado' && <IconButton color="primary" onClick={() => setReloadAnswers(!reloadAnswers)} sx={{ marginLeft: 'auto', marginRight: '5px' }}>
                            <Refresh />
                        </IconButton>}
                        {selectedCase.state === 'cerrado' && user.role === 'ADMIN' && <Tooltip title="Reabrir caso"
                            placement="bottom"
                            arrow
                        >
                            <IconButton color="primary" onClick={handleReopenCase} sx={{ marginLeft: 'auto', marginRight: '5px' }}>
                                <MeetingRoom />
                            </IconButton>
                        </Tooltip>}
                    </Box>
                    <IconButton
                        aria-label="close"
                        onClick={() => {
                            setOpen(false);
                            setAnswer('');
                            setReloadFlag(!reloadFlag);
                        }}
                        sx={{
                            alignSelf: 'flex-end',
                            color: (theme) => theme.palette.secondary.main,
                        }}
                    >
                        <Close fontSize='large' />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ overflowY: 'auto', border: '1px solid #f0f0f0' }}>
                    <CaseMessages id={selectedCase._id} description={selectedCase.description} reloadAnswers={reloadAnswers} />
                </DialogContent>
                {selectedCase.state != 'cerrado' && <DialogActions sx={{ padding: 3, display: 'flex', justifyContent: 'center' }}>
                    {selectedCase.state != 'pendiente' && user.role === 'ADMIN' && <Tooltip title="Cerrar caso"
                        placement="top"
                        arrow
                    >
                        <IconButton color="secondary" onClick={() => setClosePqrsModal(true)}>
                            <Gavel />
                        </IconButton>
                    </Tooltip>}
                    {selectedCase.state === 'pendiente' && user.role === 'RESIDENT' && (
                        (selectedCase.answer.length === 0 && new Date().getTime() - new Date(selectedCase.date).getTime() > 2 * 86400000) ||
                            (selectedCase.answer.length > 0 && new Date().getTime() - new Date(selectedCase.answer[selectedCase.answer.length - 1]?.date).getTime() > 2 * 86400000) ? (
                            <Button variant="contained" sx={{ width: '80%' }} color="primary" onClick={handleNotify} startIcon={<NotificationAdd />}>
                                Notificar al administrador
                            </Button>
                        ) : (
                            <Typography variant="body1" color="MenuText" textAlign="start">
                                Espera a que el administrador responda para enviar un mensaje, si no lo hace en 48 horas podrás notificarlo
                            </Typography>
                        )
                    )}
                    {!(selectedCase.state === 'pendiente' && user.role === 'RESIDENT') && (
                        <>
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
                                disabled={user.role === 'RESIDENT' && !selectedCase.answer[selectedCase.answer.length - 1]?.admin}
                                placeholder={user.role === 'RESIDENT' && !selectedCase.answer[selectedCase.answer.length - 1]?.admin ? 'Espera una respuesta del administrador' : 'Escribe tu mensaje aquí...'}
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
                        </>)}
                </DialogActions>}
            </Dialog>

            <Dialog open={closePqrsModal} onClose={() => setClosePqrsModal(false)}>
                <DialogContent>
                    {!isClosing ? (<Warning color="secondary" style={{ fontSize: 60, display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />) : <CircularProgress style={{ fontSize: 50, display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />}
                    <DialogContentText align="center" fontSize={20} sx={{ marginTop: "25px", wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
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
        </>
    )
}

export default CaseModal