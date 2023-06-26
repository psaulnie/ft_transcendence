import React, { useEffect } from 'react';

import { chatSocket } from '../../chatSocket';

import { useDispatch, useSelector } from 'react-redux';
import { useGetBlockedUsersQuery } from '../../store/api';
import { addBlockedUser } from '../../store/user';

import Room from './Room';
import CreateChannel from './CreateChannel';
import JoinChannel from './JoinChannel';
import JoinDirectMessage from './JoinDirectMessage';
import DirectMessageProvider from './DirectMessageProvider';
import ChatProcess from './ChatProcess';

import { Skeleton, Box, Grid } from '@mui/material';

import RoomTabs from './RoomTabs';

function Chat() {
	const user = useSelector((state: any) => state.user);
	const rooms = useSelector((state: any) => state.rooms);
	const dispatch = useDispatch();

	useEffect(() => {
		chatSocket.emit("newUser", user.username);
	}, [user.username, dispatch]);
	
	
	const {
		data: blockedUsers,
		isLoading,
		isSuccess,
		isError,
		error,
		refetch
	} = useGetBlockedUsersQuery({username: user.username});
	
	useEffect(() => {
		refetch();
		if (isSuccess)
		{
			blockedUsers.data.forEach((element: any) => {
				dispatch(addBlockedUser(element.username));
			});
		}
	}, [user.username, isSuccess, blockedUsers, dispatch, refetch, rooms]);
	
	if (!chatSocket.connected)
		return (<p>Chat Socket error</p>);
	if (isError) // TODO fix show real error page (make Error component)
		return (<p>Error: {error.toString()}</p>)
	else if (isLoading)
		return (
			<div>
				<Skeleton variant="text"/>
				<Skeleton variant="rectangular" />
			</div>
		);

	return (
		<div className='chat'>
			<ChatProcess/>
			<Grid container sx={{ display: 'flex'}} justifyContent="space-evenly">
				<Grid item xs={3}>
						<Box sx={{ backgroundColor: '#102b47', height: '100%', padding: '16px', borderRadius: '10px'}}>
							<Grid container>
								<JoinDirectMessage/>
							</Grid>
							<Grid container>
								<CreateChannel/>
							</Grid>
							<Grid container>
								<JoinChannel/>
							</Grid>
						</Box>
				</Grid>
				<Grid item xs={7}>
						<DirectMessageProvider/>
						<Grid>
							{ 
								rooms.index !== -1 && rooms.room[rooms.index] ?
									<Room key={rooms.room[rooms.index].name} roomName={rooms.room[rooms.index].name}/>
								: null
							}	
						</Grid>
						<Grid item sx={{ marginBottom: '70px' }}>
							<RoomTabs/>
						</Grid>
				</Grid>
			</Grid>
		</div>
	);
}

export default Chat;