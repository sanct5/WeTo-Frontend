import React, { useState } from 'react';
import {
    Avatar,
    Box,
    Button,
    IconButton,
    Popover,
    TextField,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { Assistant, Close, Send, SmartToy } from '@mui/icons-material';
import { IAService } from '../../api/IAService';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { UserState } from '../../hooks/users/userSlice';
import IsologoSinFondo from '../../assets/images/IsologoSinFondo.png';

const ChatIA = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [message, setMessage] = useState('');
    const user = useSelector((state: { user: UserState }) => state.user);
    let prevMessages = sessionStorage.getItem('messages');
    const [messages, setMessages] = useState<{ sender: string, text: string }[]>(
        prevMessages ? JSON.parse(prevMessages) :
            [{ sender: 'ia', text: `Bienvenido ${user.userName}, ¿En qué puedo ayudarle?` }]
    );
    const [loading, setLoading] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleSendMessage = async () => {
        if (loading || message.trim() === '') return;

        setMessages([...messages, { sender: 'user', text: message }]);
        setMessage('');
        setLoading(true);

        try {
            const response = await axios.post(`${IAService.baseUrl}${IAService.endpoints.input}`, { input: message });
            setMessages((prevMessages) => [...prevMessages, { sender: 'ia', text: response.data.response }]);
            sessionStorage.setItem('messages', JSON.stringify([...messages, { sender: 'user', text: message }, { sender: 'ia', text: response.data.response }]));
        } catch (error) {
            setMessages((prevMessages) => [...prevMessages, { sender: 'ia', text: 'El asistente no está disponible en este momento' }]);
            sessionStorage.setItem('messages', JSON.stringify([...messages, { sender: 'user', text: message }, { sender: 'ia', text: 'El asistente no está disponible en este momento' }]));
        } finally {
            setLoading(false);
        }
    };

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'chat-popover' : undefined;

    return (
        <>
            <IconButton
                color="primary"
                onClick={handleClick}
                sx={{
                    position: 'fixed',
                    bottom: 20,
                    right: 20,
                    zIndex: 1000,
                    backgroundColor: 'primary.main',
                    width: 60,
                    height: 60,
                    '&:hover': {
                        backgroundColor: 'primary.dark',
                    },
                }}
            >
                <Assistant sx={{ fontSize: 32, color: '#fff' }} />
            </IconButton>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                slotProps={{
                    paper: {
                        style: {
                            width: isMobile ? '100%' : '30%',
                            height: isMobile ? '100%' : '60%',
                            display: 'flex',
                            flexDirection: 'column',
                        },
                    }
                }}
            >
                <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', pb: 1, mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'primary.main' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Avatar src={IsologoSinFondo} sx={{ width: 40, height: 40, mr: 1, backgroundColor: 'white', ml: 2 }} />
                        <Typography variant="h6" color="white">
                            WeChat
                        </Typography>
                    </Box>
                    <IconButton size="medium" color='secondary' onClick={handleClose}>
                        <Close />
                    </IconButton>
                </Box>

                <Box sx={{ flexGrow: 1, maxHeight: 'calc(100% - 100px)', overflowY: 'auto', mb: 2, ml: 2, mr: 2 }}>
                    {messages.map((msg, index) => (
                        <Box key={index} sx={{ textAlign: msg.sender === 'user' ? 'right' : 'left', mb: 1, display: 'flex', alignItems: 'center', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                            {msg.sender === 'ia' && <SmartToy sx={{ fontSize: 24, color: 'primary.main', mr: 1 }} />}
                            <Typography
                                variant="body2"
                                sx={{
                                    display: 'inline-block',
                                    padding: '8px 12px',
                                    borderRadius: '12px',
                                    backgroundColor: msg.sender === 'user' ? 'secondary.main' : 'primary.main',
                                    color: '#fff',
                                }}
                            >
                                {msg.text}
                            </Typography>
                        </Box>
                    ))}
                    {loading && (
                        <Box sx={{ textAlign: 'left', mb: 1, display: 'flex', flexDirection: 'row' }}>
                            <SmartToy sx={{ fontSize: 24, color: 'primary.main', mr: 1 }} />
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                El asistente está escribiendo...
                            </Typography>
                        </Box>
                    )}
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', ml: 2, mr: 2, mb: 2 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Escribe tu mensaje..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        disabled={loading}
                        sx={{ mr: 2 }}
                        slotProps={{ htmlInput: { maxLength: 80 } }}
                    />
                    {isMobile ? (
                        <IconButton
                            color="primary"
                            onClick={handleSendMessage}
                            disabled={loading || message.trim() === ''}
                        >
                            <Send />
                        </IconButton>
                    ) : (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSendMessage}
                            disabled={loading || message.trim() === ''}
                            endIcon={<Send />}
                        >
                            Enviar
                        </Button>
                    )}
                </Box>
            </Popover>
        </>
    );
};

export default ChatIA;