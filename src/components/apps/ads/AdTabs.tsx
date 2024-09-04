import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import AllAds from './allAds';
import MyAds from './MyAds';
import { useSelector } from 'react-redux';
import { UserState } from '../../../hooks/users/userSlice';

export default function AdTabs() {
    const [value, setValue] = useState('all');
    const { role } = useSelector((state: { user: UserState }) => state.user);

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        event.preventDefault();
        setValue(newValue);
    };

    return (
        <Box sx={{ backgroundColor: '#F0F0F0', height: 'max-content', minHeight: '100vh' }}>
            <Box sx={{ width: '100%' }}>
                {role === 'ADMIN' ? (
                    <AllAds />
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
                            <Tab value="all" label="Tablero de publicidad" />
                            <Tab value="my" label="Mis anuncios" />
                        </Tabs>
                        {value === 'all' && <AllAds />}
                        {value === 'my' && <MyAds />}
                    </>
                )}
            </Box>
        </Box>
    );
}