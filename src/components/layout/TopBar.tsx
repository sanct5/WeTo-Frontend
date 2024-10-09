import { Toolbar, IconButton, Typography, Box } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import Logout from '@mui/icons-material/Logout'
import AccountCircle from '@mui/icons-material/AccountCircle'
import { useSelector } from 'react-redux'
import { UserState } from '../../hooks/users/userSlice'
import { Link } from 'react-router-dom'
import { Notifications } from '@mui/icons-material'

interface TopBarProps {
    handleDrawerToggle: () => void;
    handleLogout: () => void;
}

const TopBar = ({ handleDrawerToggle, handleLogout }: TopBarProps) => {
    const user = useSelector((state: { user: UserState }) => state.user);

    const title = 'WeTo';

    return (
        <Toolbar>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ display: { xs: 'none', sm: 'block' } }}>
                        {title}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography color="inherit" noWrap sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}>
                        {user.userName}
                    </Typography>
                    <IconButton color="inherit">
                        <Notifications />
                    </IconButton>
                    <IconButton color="inherit" component={Link} to={`/app/profile/${user._id}`}>
                        <AccountCircle />
                    </IconButton>
                    <IconButton color="inherit" onClick={handleLogout}>
                        <Logout />
                    </IconButton>
                </Box>
            </Box>
        </Toolbar>
    )
}

export default TopBar;