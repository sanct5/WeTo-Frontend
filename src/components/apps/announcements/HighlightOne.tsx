import {
    Dialog,
    Typography,
    Box,
    CircularProgress,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
} from '@mui/material';
import { Announcements } from '../models';
import React, { useEffect, useState } from 'react';
import parse from 'html-react-parser'
import { format } from '@formkit/tempo';

interface HighlightOneProps {
    openHighlight: boolean;
    setOpenHighlight: React.Dispatch<React.SetStateAction<boolean>>;
    announcement: Announcements;
}

const HighlightOne = ({ openHighlight, setOpenHighlight, announcement }: HighlightOneProps) => {
    const seconds: number = 3;

    const [timeLeft, setTimeLeft] = useState<number>(seconds);

    useEffect(() => {
        if (openHighlight) {
            const interval = setInterval(() => {
                setTimeLeft((prev: number) => prev - 1);
            }, 1000);

            return () => {
                clearInterval(interval);
            };
        }
    }, [announcement]);

    const progress = (timeLeft * 100) / seconds;

    return (
        <Dialog
            open={openHighlight}
            fullScreen
            sx={{
                maxWidth: { xs: '95%', sm: '70%' },
                margin: 'auto',
                maxHeight: { xs: '95%', sm: '90%' },
            }}
        >
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">
                        {announcement.isAdmin ? "ADMINISTRACIÓN: " : ""}
                        {announcement.Title}
                    </Typography>
                    {progress > 0 && <Box position="relative" display="inline-flex">
                        <CircularProgress variant="determinate" value={progress} thickness={3} />
                        <Box
                            top={0}
                            left={0}
                            bottom={0}
                            right={0}
                            position="absolute"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Typography variant="body1" component="div" color="textSecondary">
                                {timeLeft}
                            </Typography>
                        </Box>
                    </Box>}
                    {progress <= 0 && (
                        <IconButton onClick={() => setOpenHighlight(false)}>
                            <Typography variant="body1" component="div" color="textSecondary">
                                Cerrar
                            </Typography>
                        </IconButton>
                    )
                    }
                </Box>
            </DialogTitle>
            <DialogContent>
                <Typography variant="body1" component="p" gutterBottom>
                    {parse(announcement?.Body)}
                </Typography>
            </DialogContent>
            <DialogActions>
                {!announcement.isAdmin && (
                    <Typography variant='body1' color='textSecondary'>
                        {announcement.CreatedBy} |
                    </Typography>
                )}
                <Typography variant="body1" color="textSecondary">
                    {announcement.category} |
                </Typography>
                <Typography variant="body1" color="textSecondary">
                    {format(announcement.Date, { date: "long" })}
                </Typography>
            </DialogActions>
        </Dialog>
    );
}

export default HighlightOne;