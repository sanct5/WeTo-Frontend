import {
    TipsAndUpdates,
    Favorite,
    Handshake,
    Celebration,
    Recommend,
} from '@mui/icons-material';

export const getReactionIcon = (type: string) => {
    switch (type) {
        case 'recommend':
            return <Recommend sx={{ color: 'blue' }} />;
        case 'celebrate':
            return <Celebration sx={{ color: 'pink' }} />;
        case 'support':
            return <Handshake sx={{ color: 'purple' }} />;
        case 'love':
            return <Favorite sx={{ color: 'red' }} />;
        case 'interest':
            return <TipsAndUpdates sx={{ color: 'yellowgreen' }} />;
        default:
            return null;
    }
};

export const getReactionIconGray = (type: string) => {
    switch (type) {
        case 'recommend':
            return <Recommend />;
        case 'celebrate':
            return <Celebration />;
        case 'support':
            return <Handshake />;
        case 'love':
            return <Favorite />;
        case 'interest':
            return <TipsAndUpdates />;
        default:
            return null;
    }
};