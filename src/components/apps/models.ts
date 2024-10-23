// Definition of the types used in the application
// Announcement

export type Announcements = {
    _id: string;
    User: string;
    Title: string;
    Body: string;
    category: AnnouncementCategory
    Date: Date;
    LastModify: Date;
    CreatedBy: string;
    isAdmin: boolean;
    reactions?: Reaction[];
}

export type Reaction = {
    user: string;
    type: 'recommend' | 'celebrate' | 'support' | 'love' | 'interest' | 'removed';
}

export type AnnouncementCategory = "Mantenimiento" | "Servicios" | "General" | "Reuniones" | "Publicidad";

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
    type?: "Normal" | "System";
    date: Date;
} & (
        | { admin: string; resident?: never }
        | { resident: string; admin?: never }
    );

export type AvailableHours = {
    start: Date;
    end: Date;
};

export type Zone = {
    _id: string;
    name: string;
    complex: string;
    description?: string;
    availableDays: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday')[];
    availableHours: AvailableHours;
};