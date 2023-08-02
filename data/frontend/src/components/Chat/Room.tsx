import { useState, useEffect, useRef, useLayoutEffect} from 'react';

import MessagesBox from './Message/MessagesBox';
import InputForm from './Message/InputForm';

import { useSelector } from 'react-redux';

import { Grid, Box, Typography } from '@mui/material';

import UsersList from './UsersList';

function Room({roomName}: {roomName: string}) {
	const messagesContainerRef = useRef<HTMLDivElement>(null);
	const rooms = useSelector((state: any) => state.rooms);

	const [role, setRole] = useState('none');
	const roomIndex = rooms.room.findIndex((obj: {name: string, role: string}) => obj.name === roomName);

	useLayoutEffect(() => {
		const containerRef = messagesContainerRef.current;
		if (containerRef) {
			containerRef.scrollTop = containerRef.scrollHeight;
		}
	}, [rooms.room[roomIndex].messages]);
	
	useEffect(() => {
		const cRole = rooms.room.find((obj: {name: string, role: string}) => obj.name === roomName);
		if (cRole)
			setRole(cRole.role);
	}, [setRole, rooms, roomName]);


	return (
		<Grid sx={{height: "100%", width: "100%", display: 'flex'}}>
			<Grid item xs={8} spacing={0} sx={{ height: "100%", width: "100%", overflow: 'hidden', display: "flex", flexDirection: "column"}}>
				<Grid item xs={12} sx={{ height: "100%", width: "100%", padding: '16px', overflow: 'auto', marginTop: "auto" }}>
					<Box sx={{ height: "100%", width: "100%", padding: '2px', overflow: 'scroll'}}>
						<div ref={messagesContainerRef}>
							<MessagesBox messages={ rooms.room[roomIndex].messages } role={ role } roomName={ roomName } />
						</div>
					</Box>
				</Grid>
				<Grid item xs={12} sx={{ marginTop: "auto", marginBottom: "20px" }}>
					<InputForm roomName={ roomName } isDirectMessage={rooms.room[roomIndex].isDirectMessage} />
				</Grid>
			</Grid>
			{/* <Grid item xs={4}>
				<Box sx={{ backgroundColor: '#102b47', height: '100%', padding: '16px', borderRadius: '10px'}}>
					<Typography>Users:</Typography>
					<UsersList roomName={roomName} role={role} />
				</Box>
			</Grid> */}
		</Grid>
	);
}

export default Room;