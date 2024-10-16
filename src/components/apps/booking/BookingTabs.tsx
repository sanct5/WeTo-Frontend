import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import WorkingOn from '../../../router/pages/WorkingOn';
import ViewZones from './ViewZones';

export default function BookingTabs() {
    const [value, setValue] = useState('viewzones');

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        event.preventDefault();
        setValue(newValue);
    };

    return (
        <Box sx={{ backgroundColor: '#F0F0F0', height: 'max-content', minHeight: '100vh' }}>
            <Box sx={{ width: '100%' }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    textColor="secondary"
                    indicatorColor="secondary"
                    aria-label="Tabs"
                    variant="scrollable"
                    scrollButtons
                    allowScrollButtonsMobile
                    sx={{ backgroundColor: { xs: 'white', sm: 'transparent' } }}
                >
                    <Tab value="viewzones" label="Zonas comunes" />
                    <Tab value="workingon" label="Reservar" />
                </Tabs>
                {value === 'viewzones' && <ViewZones />}
                {value === 'workingon' && <WorkingOn />}
            </Box>
        </Box>
    );
}