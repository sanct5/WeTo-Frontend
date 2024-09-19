import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import WorkingOn from '../../../router/pages/WorkingOn';
import CreateForm from './CreateForm';

export default function PQRSTabs() {
    const [value, setValue] = useState('PQRS');

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
                    aria-label="PQRS Tabs"
                    variant="scrollable"
                    scrollButtons
                    allowScrollButtonsMobile
                    sx={{ backgroundColor: { xs: 'white', sm: 'transparent' } }}
                >
                    <Tab value="PQRS" label="Mis PQRS" />
                    <Tab value="crearPQRS" label="Crear PQRS" />
                </Tabs>
                {value === 'PQRS' && <WorkingOn />}
                {value === 'crearPQRS' && <CreateForm setValue={setValue} />}
            </Box>
        </Box>
    );
}