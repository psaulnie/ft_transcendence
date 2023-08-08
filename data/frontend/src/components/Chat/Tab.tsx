import React, { useEffect, useState } from 'react';

import { webSocket } from '../../webSocket';

import { useDispatch, useSelector } from 'react-redux';
import { useGetBlockedUsersQuery } from '../../store/api';
import { useGetUserRoomListQuery } from '../../store/api';
import { addBlockedUser } from '../../store/user';

import Room from './Room';
import CreateChannel from './CreateChannel';
import JoinChannel from './JoinChannel';
import JoinDirectMessage from './JoinDirectMessage';
import DirectMessageProvider from './DirectMessageProvider';
import ChatProcess from './ChatProcess';
import Error from '../Global/Error';

import { Skeleton, Box, Grid, Button, colors } from '@mui/material';
import Drawer from "@mui/material/Drawer";
import MenuIcon from '@mui/icons-material/Menu';

import RoomTabs from './RoomTabs';
import { addRoom, setRoomIndex } from '../../store/rooms';
import { Padding } from '@mui/icons-material';

function Tab()
{
    const [isTabOpen, setIsTabOpen] = useState(false);
  
    const handleOpenTab = () => {
    	setIsTabOpen(true);
    };
  
    const handleCloseTab = () => {
    	setIsTabOpen(false);
    };
  
    return (
    	<>
			<Button variant="text"
				onClick={handleOpenTab}
				startIcon={<Box sx={{ fontSize: 30, color: "red"}}>
					<MenuIcon />
				</Box>}
      			sx={{
				padding: "0.7em",
        		"& .MuiButton-startIcon": {
        			marginRight: "0.25em", // Ajustez la marge droite de l'icône pour le centrer
        		},
        		"& .MuiButton-label": {
        		  	display: "flex",
        			alignItems: "center",
        		},
      			}}
			></Button>
		
    		{/* Drawer for the tab */}
    		<Drawer
    			anchor="right" // Slide in from the right
    			open={isTabOpen}
    			onClose={handleCloseTab}
    		>
    			<Box sx={{ width: "100%", height: "100%", background: "linear-gradient(to bottom left, #f26700, #bf0505)", Padding: '16px'}}>
					<Box sx={{ textAlign: "center", marginTop: "5%", color: "black" }}>
    					<h1 style={{ fontWeight: "bold", textDecoration: "underline", fontSize: "80px"}}>
    						Menu !
    					</h1>
  					</Box>
					<Grid container sx={{ marginLeft: "5%"}}>
						<JoinDirectMessage/>
					</Grid>
					<Grid container sx={{ marginLeft: "5%"}}>
						<CreateChannel/>
					</Grid>
					<Grid container sx={{ marginLeft: "5%"}}>
						<JoinChannel/>
					</Grid>
    			</Box>
    		</Drawer>
    	</>
    );
}

export default Tab;