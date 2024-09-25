// Definition of the types used in the application
// Announcement

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

// Pqrs

export type Pqrs = {
    _id: string;
    user: string;
    userName: string;
    case: string;
    description: string;
    category: PqrsCategory;
    date: Date;
    state: PqrsState;
    answer: PqrsAnswer[];
}

export type PqrsCategory = "P" | "Q" | "R" | "S";
export type PqrsState = "pendiente" | "tramite" | "cerrado";

export type PqrsAnswer = {
    _id: string;
    comment: string;
    date: Date;
} & (
        | { admin: string; resident?: never }
        | { resident: string; admin?: never }
    );