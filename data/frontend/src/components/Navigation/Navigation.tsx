import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Grid } from '@mui/material';

import { useSelector } from 'react-redux';

import CustomAvatar from '../Global/CustomAvatar';

// If logged in, show the account button
function Navigation({setDrawerState}: {setDrawerState: any}) {
	const user = useSelector((state: any) => state.user);
	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static" sx={ {backgroundColor: '#FC7D07'}}>
				<Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
					<IconButton
						size="large"
						edge="start"
						aria-label="menu"
						sx={{ mr: 2, color: 'black' }}
						onClick={() => setDrawerState(true)}
					>
						<MenuIcon />
					</IconButton>
    			  			<Grid item xs={9} sx={{
									marginLeft: 'auto',
									marginRight: '1em',
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'flex-end',
									alignItems: 'flex-end',
								}}>
								<div>
									Name
								</div>
								<div>
									Level 5
								</div>
							</Grid>
    			  			<Grid item xs={3}>
								<Box sx={{ marginLeft: 'auto' }}>
									{user.isLoggedIn ? <CustomAvatar username={user.username} /> : null}
								</Box>
    			  			</Grid>
				</Toolbar>
			</AppBar>
		</Box>
	)
}

export default Navigation;