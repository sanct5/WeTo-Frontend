export const AnnouncementsService = {
    baseUrl: import.meta.env.VITE_WETO_BACKEND_ANNOUNCEMENTS,
    endpoints: {
        GetAnnouncementsByComplex: '/getByComplex',
        GetAnnouncementsByUser: '/getByUser',
        GetAnnouncementById: '/getById',
        UpdateAnnouncement: '/update',
        AddAnnouncement: '/add',
        DeleteAnnouncement: '/delete',
        SearchAnnouncements: '/search',
    },
};