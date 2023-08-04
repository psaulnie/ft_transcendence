import React, { useEffect, useState } from 'react';

import { chatSocket } from '../../chatSocket';

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
import PersonIcon from '@mui/icons-material/Person';

import RoomTabs from './RoomTabs';
import { addRoom, setRoomIndex } from '../../store/rooms';
import { Padding } from '@mui/icons-material';

function UsersTab()
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
				endIcon={<Box sx={{ fontSize: 15, color: "black"}}>
					<PersonIcon />
				</Box>}
      			sx={{
				padding: "0.5em",
        		"& .MuiButton-label": {
        		  	display: "flex",
        			alignItems: "right",
        		},
      			}}
			></Button>
		
    		{/* Drawer for the tab */}
    		<Drawer
    			anchor="right" // Slide in from the right
    			open={isTabOpen}
    			onClose={handleCloseTab}
    		>
    			<Box sx={{ width: "100%", height: "100%", background: "linear-gradient(to bottom left, #f26700, #bf0505)", padding: '45px'}}>
					<Box sx={{ textAlign: "center", marginTop: "5%", color: "black" }}>
    					<h1 style={{ fontWeight: "bold", textDecoration: "underline", fontSize: "42px"}}>
    						Users:
    					</h1>
  					</Box>
					<Grid container sx={{ marginLeft: "5%"}}>
						<JoinDirectMessage/>
					</Grid>
    			</Box>
    		</Drawer>
    	</>
    );
}

export default UsersTab;