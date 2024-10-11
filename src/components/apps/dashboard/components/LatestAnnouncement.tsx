import { Card, Typography, CircularProgress, Alert, AlertTitle, Box, CardContent } from '@mui/material';
import { Handyman, House, Interests, Groups, DateRangeRounded, CalendarMonth, Warning } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { AnnouncementsService } from '../../../../api/Anouncements';
import { UserState } from '../../../../hooks/users/userSlice';
import { format } from '@formkit/tempo';
import parse from 'html-react-parser';
import { Announcements } from '../../models';
import { useNavigate } from 'react-router-dom';

const LatestAnnouncementCard = () => {
    const [isLoadingAnnouncements, setIsLoadingAnnouncements] = useState(false);
    const [latestRelevantAnnouncement, setLatestRelevantAnnouncement] = useState<Announcements>({
        _id: '',
        User: '',
        Title: '',
        Body: '',
        category: 'General',
        Date: new Date(),
        LastModify: new Date(),
        CreatedBy: '',
        isAdmin: false
    });

    
    const user = useSelector((state: { user: UserState }) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAnnouncements = async () => {
            setIsLoadingAnnouncements(true);
            const announcementsResponse = await axios.get(`${AnnouncementsService.baseUrl}${AnnouncementsService.endpoints.GetAnnouncementsByComplex}/${user.idComplex}`);
            const announcements: Announcements[] = announcementsResponse.data;

            const relevantAnnouncements = announcements
                .filter(a => ['Servicios', 'Mantenimiento', 'General', 'Reuniones'].includes(a.category))
                .sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime());

            if (relevantAnnouncements.length > 0) {
                setLatestRelevantAnnouncement(relevantAnnouncements[0]);
            }
            setIsLoadingAnnouncements(false);
        };
        fetchAnnouncements();
    }, [user.idComplex]);

    return (
        <Card onClick={() => navigate('/app/announcements')} sx={{
            width: '100%',
            padding: '24px',
            textAlign: 'center',
            borderRadius: '12px',
            boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)',
            height: '100%',
            cursor: 'pointer',
        }}>
            <Typography variant="h6" color="textSecondary" mb={2}>Último anuncio de administración</Typography>
            {isLoadingAnnouncements ? <CircularProgress /> : latestRelevantAnnouncement ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 275, width: '100%', position: 'relative' }}>
                    <Typography variant="h5" component="div" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                        {latestRelevantAnnouncement.category === 'Mantenimiento' ? <Handyman color='primary' /> :
                            latestRelevantAnnouncement.category === 'Servicios' ? <House color='primary' /> :
                                latestRelevantAnnouncement.category === 'General' ? <Interests color='primary' /> :
                                    latestRelevantAnnouncement.category === 'Reuniones' ? <Groups color='primary' /> : null}
                        <Box sx={{ ml: 1 }}>
                            {latestRelevantAnnouncement.Title}
                        </Box>
                    </Typography>
                    <CardContent sx={{ textAlign: 'left', overflowY: 'auto', maxHeight: '200px' }}>
                        <Typography variant="body2" component="p">
                            {parse(latestRelevantAnnouncement.Body)}
                        </Typography>
                    </CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', marginTop: 1, flexDirection: { xs: 'column', sm: 'row' }, padding: '16px' }}>
                        <Typography variant="body2" component="p" sx={{ mr: 2 }}>
                            <DateRangeRounded color='primary' sx={{ mr: 1 }} />
                            Publicado el: {format(latestRelevantAnnouncement.Date, { date: "long", time: "short" })}
                        </Typography>
                        {latestRelevantAnnouncement.Date !== latestRelevantAnnouncement.LastModify && (
                            <Typography variant="body2" component="p">
                                <CalendarMonth color='secondary' sx={{ mr: 1 }} />
                                Ultima modificación: {format(latestRelevantAnnouncement.LastModify, { date: "long", time: "short" })}
                            </Typography>
                        )}
                    </Box>
                </Box>
            ) : (
                <Alert severity="warning" icon={<Warning />} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <AlertTitle>No hay anuncios relevantes</AlertTitle>
                </Alert>
            )}
        </Card>
    );
};

export default LatestAnnouncementCard;