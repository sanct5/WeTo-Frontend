export const AnnouncementsService = {
    baseUrl: import.meta.env.VITE_WETO_BACKEND_ANNOUNCEMENTS,
    endpoints: {
        GetAnnouncementsByComplex: '/getAnounsByComplex',
        GetAnnouncementsByUser: '/getAnounsByUser',
        GetAnnouncementById: '/getAnounById',
        UpdateAnnouncement: '/updateAnoun',
        AddAnnouncement: '/addAnoun',
        DeleteAnnouncement: '/deleteAnoun',
        SearchAnnouncements: '/searchAnnouncements',
    },
};