import { Container, Box, Typography, Grid2, Icon } from '@mui/material';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import EmergencyIcon from '@mui/icons-material/Warning';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SecurityIcon from '@mui/icons-material/Security';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import TrafficIcon from '@mui/icons-material/Traffic';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import GppMaybeIcon from '@mui/icons-material/GppMaybe';

const AllNumbers = () => {
    // Añadimos los números nuevos con sus iconos
    const emergencyNumbers = [
        { name: 'Policía (Cuadrante)', number: '52145', icon: <LocalPoliceIcon fontSize="large" /> },
        { name: 'Bomberos', number: '12345', icon: <LocalFireDepartmentIcon fontSize="large" /> },
        { name: 'Emergencias generales', number: '123', icon: <EmergencyIcon fontSize="large" /> },
        { name: 'Administración', number: '98765', icon: <AdminPanelSettingsIcon fontSize="large" /> },
        { name: 'Portería/Vigilancia', number: '55555', icon: <SecurityIcon fontSize="large" /> },
        { name: 'Secretaría de Salud - Ambulancias', number: '125', icon: <HealthAndSafetyIcon fontSize="large" /> },
        { name: 'Policía de Carreteras', number: '126', icon: <DirectionsCarIcon fontSize="large" /> },
        { name: 'Tránsito', number: '127', icon: <TrafficIcon fontSize="large" /> },
        { name: 'Cruz Roja', number: '132', icon: <MedicalServicesIcon fontSize="large" /> },
        { name: 'Gaula', number: '147', icon: <GppMaybeIcon fontSize="large" /> },
        { name: 'CAI', number: '156', icon: <LocalPoliceIcon fontSize="large" /> }
    ];

    return (
        <Container maxWidth="lg" sx={{ marginTop: 2 }}>
            <Grid2 container spacing={2}>
                {emergencyNumbers.map((contact, index) => (
                    <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '150px',
                                padding: 2,
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                backgroundColor: '#f9f9f9',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                transition: 'transform 0.2s ease-in-out',
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                },
                                width: '100%'
                            }}
                        >
                            <Icon sx={{ color: '#0097b2', fontSize: '50px', marginBottom: 1 }}>
                                {contact.icon}
                            </Icon>
                            <Typography variant="h6" align="center">{contact.name}</Typography>
                            <Typography variant="body1" align="center">{contact.number}</Typography>
                        </Box>
                    </Grid2>
                ))}
            </Grid2>
        </Container>
    );
};

export default AllNumbers;

