import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';

import { Box, Grid, Button } from '@mui/material';
import Drawer from "@mui/material/Drawer";
import PersonIcon from '@mui/icons-material/Person';

import UsersList from './UsersList';

function UsersTab({roomName} : {roomName: string})
{
	const rooms = useSelector((state: any) => state.rooms);
	const roomIndex = rooms.room.findIndex((obj: {name: string, role: string}) => obj.name === roomName);

    const [isTabOpen, setIsTabOpen] = useState(false);
	const [role, setRole] = useState('none');

    const handleOpenTab = () => {
    	setIsTabOpen(true);
    };
  
    const handleCloseTab = () => {
    	setIsTabOpen(false);
    };

	useEffect(() => {
		const cRole = rooms.room.find((obj: {name: string, role: string}) => obj.name === roomName);
		if (cRole)
			setRole(cRole.role);
	}, [setRole, rooms, roomName]);

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
							{/* <Typography>Users:</Typography> */}
							<UsersList roomName={roomName} role={role} isDirectMessage={rooms.room[roomIndex].isDirectMsg} />

					</Grid>
    			</Box>
    		</Drawer>
    	</>
    );
}

export default UsersTab;