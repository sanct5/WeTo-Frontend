import ResidentsCard from './components/ResidentCard';
import PqrsCard from './components/PqrsCard';
import LatestPqrsTable from './components/LatestPqrsTable';
import LatestAnnouncementCard from './components/LatestAnnouncement';
import { Box, Grid2 } from '@mui/material';
import AnnouncementPieChart from './components/PieChart';
import PqrsZones from './components/PqrsZones';

const Dashboard = () => {
    return (
        <Box sx={{ borderRight: '2px', borderBottom: '2px', width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Grid2 container spacing={2} columns={12}>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <ResidentsCard />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <PqrsCard />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <ResidentsCard />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <PqrsCard />
                </Grid2>
            </Grid2>



            <Grid2 container spacing={2} columns={12}>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                    <AnnouncementPieChart />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                    <PqrsZones />
                </Grid2>
            </Grid2>


            <Grid2 container spacing={2} columns={12}>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                    <LatestPqrsTable />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                    <LatestAnnouncementCard />
                </Grid2>
            </Grid2>
        </Box>
    );
};

export default Dashboard;