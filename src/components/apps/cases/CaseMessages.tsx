import { useSelector } from 'react-redux';
import { Box, CircularProgress, Paper, Typography } from '@mui/material';
import { UserState } from '../../../hooks/users/userSlice';
import { format } from '@formkit/tempo';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { pqrsService } from '../../../api/Pqrs';
import { toast } from 'react-toastify';
import { Pqrs } from '../models';

interface CaseMessagesProps {
    reloadAnswers: boolean;
    selectedCase: Pqrs;
    setSelectedCase: React.Dispatch<React.SetStateAction<Pqrs>>;
}

export const CaseMessages = ({ reloadAnswers, setSelectedCase, selectedCase }: CaseMessagesProps) => {
    const [loading, setLoading] = useState<boolean>(true);

    const user = useSelector((state: { user: UserState }) => state.user);

    useEffect(() => {
        setLoading(true);
        const fetchAnswers = async () => {
            try {
                const response = await axios.get(`${pqrsService.baseUrl}${pqrsService.endpoints.getPqrsAnswers}/${selectedCase._id}`);
                setSelectedCase(
                    (prevState) => ({
                        ...prevState,
                        answer: response.data,
                    })
                );
            } catch (error) {
                toast.error('Error al cargar las respuestas');
            } finally {
                setLoading(false);
            }
        };

        fetchAnswers();
    }, [selectedCase._id, reloadAnswers]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Paper
                sx={{
                    backgroundColor: 'secondary.light',
                    marginBottom: 2,
                    marginTop: 2,
                    textAlign: 'center',
                    width: 'fit-content',
                    alignSelf: 'center',
                    padding: 1,
                }}
            >
                <Typography variant='body2' sx={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                    {selectedCase.description}
                </Typography>
            </Paper>
            <>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                        <CircularProgress />
                        <Typography variant="body2" color="textSecondary" sx={{ marginLeft: 2 }}>
                            Cargando Mensajes...
                        </Typography>
                    </Box>
                ) : (
                    selectedCase.answer.map((answer) => (
                        <Box
                            key={answer._id}
                            sx={{
                                justifyContent: answer.type === "System"
                                    ? user.role === 'ADMIN'
                                        ? 'center'
                                        : 'none'
                                    : (answer?.admin && user.role === 'ADMIN') || (answer?.resident && user.role === 'RESIDENT')
                                        ? 'flex-end'
                                        : 'flex-start',
                                display: answer.type === "System" && user.role !== 'ADMIN' ? 'none' : 'flex',
                            }}
                        >
                            <Paper
                                sx={{
                                    padding: 2,
                                    backgroundColor: answer.type === "System"
                                        ? 'secondary.light'
                                        : (answer?.admin && user.role === 'ADMIN') || (answer?.resident && user.role === 'RESIDENT')
                                            ? 'primary.light'
                                            : 'grey.300',
                                    maxWidth: '70%',
                                    marginBottom: 2,
                                }}
                            >
                                <Typography sx={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>{answer.comment}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {format(answer.date, { date: "short", time: "short" })}
                                </Typography>
                            </Paper>
                        </Box>
                    ))
                )}
            </>
        </Box>
    );
};