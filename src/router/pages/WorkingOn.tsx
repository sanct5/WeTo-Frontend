import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material';

const WorkingOn = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        height: '100vh',
        width: 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
      }}
    >
      <Typography variant="h2" color="whitesmoke" padding={5}>Aun estamos trabajando en esta sección</Typography>
    </Box>
  );
}

export default WorkingOn;