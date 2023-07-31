import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

// If logged in, show the account button
function Navigation({setDrawerState}: {setDrawerState: any}) {

	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static" sx={ {backgroundColor: '#102b47'}}>
				<Toolbar>
					<IconButton
						size="large"
						edge="start"
						color="inherit"
						aria-label="menu"
						sx={{ mr: 2 }}
						onClick={() => setDrawerState(true)}
					>
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
						ft_transcendence
					</Typography>
				</Toolbar>
			</AppBar>
		</Box>
	)
}

export default Navigation;