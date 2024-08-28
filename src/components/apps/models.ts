export type Announcements = {
    _id: string;
    User: string;
    Title: string;
    Body: string;
    category: string;
    Date: Date;
    LastModify: Date;
    CreatedBy: string;
    isAdmin: boolean;
}

export type AnnouncementCategory = "Mantenimiento" | "Servicios" | "General" | "Reuniones";