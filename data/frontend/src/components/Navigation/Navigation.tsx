import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Grid } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import React, { useState } from 'react';
import Button from '@mui/material/Button';

import { useSelector } from 'react-redux';

import CustomAvatar from '../Global/CustomAvatar';
import { useNavigate } from 'react-router-dom';

// If logged in, show the account button
function Navigation({setDrawerState}: {setDrawerState: any}) {
	const navigate = useNavigate();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	
	const handleBoxClick = (event: React.MouseEvent<HTMLElement>) => {
	  setAnchorEl(event.currentTarget);
	};
	
	const handleMenuClose = () => {
	  setAnchorEl(null);
	};

	const handleProfileClick = () => {
        navigate('/profile');
    };

	  
	const open = Boolean(anchorEl);
	const user = useSelector((state: any) => state.user);
	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static" sx={ {backgroundColor: '#FC7D07', height: '3.5em'}}>
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
							color: 'black',
							marginRight: '1em',
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'flex-end',
							alignItems: 'flex-end',
						}}>
						<div>
							{user.username}
						</div>
						<div>
							Level 5
						</div>
					</Grid>
    					<Grid item xs={3}>
    						<Box
    							sx={{
    								marginLeft: 'auto',
    								position: 'relative',
    								textAlign: 'center',
    								cursor: 'pointer',
    							}}
    							onClick={handleBoxClick}
    						>
    							{user.isLoggedIn ? <CustomAvatar username={user.username} /> : null}
    						</Box>
    						<Menu
    							anchorEl={anchorEl}
    							open={open}
    							onClose={handleMenuClose}
    							anchorOrigin={{
    							  	vertical: 'bottom',
    							  	horizontal: 'center',
    							}}
    							transformOrigin={{
    							  	vertical: 'top',
    							  	horizontal: 'center',
    							}}
    						>
    							<MenuItem onClick={handleMenuClose} sx={{backgroundColor:'white'}}>
    								<Button
    								  	variant="outlined"
    								  	size="small"
    								  	onClick={handleProfileClick}
    								  	sx={{ width: '100%' }}
    								>
    									Show Profile
    								</Button>
    							</MenuItem>
    						</Menu>
    					</Grid>
				</Toolbar>
			</AppBar>
		</Box>
	)
}

export default Navigation;