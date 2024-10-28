import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useSelector } from 'react-redux';
import { UserState } from '../../../hooks/users/userSlice';
import ListAll from './ListAll';
import CreateFormAnnouncements from './CreateForm';

export default function AnnouncementTabs() {
    const [value, setValue] = useState('all');
    const { role } = useSelector((state: { user: UserState }) => state.user);

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        event.preventDefault();
        setValue(newValue);
    };

    return (
        <Box sx={{ backgroundColor: '#F0F0F0', height: 'max-content', minHeight: '100vh' }}>
            <Box sx={{ width: '100%' }}>
                {role === 'RESIDENT' ? (
                    <ListAll />
                ) : (
                    <>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            textColor="secondary"
                            indicatorColor="secondary"
                            aria-label="Tabs"
                            sx={{ backgroundColor: { xs: 'white', sm: 'transparent' } }}
                        >
                            <Tab value="all" label="Tablero de anuncios" />
                            <Tab value="create" label="Crear" />
                        </Tabs>
                        {value === 'all' && <ListAll />}
                        {value === 'create' && <CreateFormAnnouncements setValue={setValue} />}
                    </>
                )}
            </Box>
        </Box>
    );
}