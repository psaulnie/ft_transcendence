import { useState, useEffect, useRef } from 'react';

import { useLayoutEffect } from 'react';

import MessagesBox from './Message/MessagesBox';
import InputForm from './Message/InputForm';

import { useSelector } from 'react-redux';

import { Grid, Box } from '@mui/material';

function Room({roomName}: {roomName: string}) {
	const messagesContainerRef = useRef<HTMLDivElement>(null);
	const rooms = useSelector((state: any) => state.rooms);

	const [role, setRole] = useState('none');
	const roomIndex = rooms.room.findIndex((obj: {name: string, role: string}) => obj.name === roomName);

	const messages = rooms.room[roomIndex].messages;

	useLayoutEffect(() => {
		const containerRef = messagesContainerRef.current;
		if (containerRef) {
			containerRef.scrollTop = containerRef.scrollHeight;
		}
	}, [messages]);
	
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
							<MessagesBox messages={ rooms.room[roomIndex].messages } role={ role } roomName={ roomName } isDirectMessage={rooms.room[roomIndex].isDirectMsg} />
						</div>
					</Box>
				</Grid>
				<Grid item xs={12} sx={{ marginTop: "auto", marginBottom: "9%" }}>
					<InputForm roomName={ roomName } isDirectMessage={rooms.room[roomIndex].isDirectMsg} />
				</Grid>
			</Grid>
		</Grid>
	);
}

export default Room;