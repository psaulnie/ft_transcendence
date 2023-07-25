import React, { useEffect } from 'react';

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

import { Skeleton, Box, Grid } from '@mui/material';

import RoomTabs from './RoomTabs';
import { addRoom, setRoomIndex } from '../../store/rooms';

function Chat() {
	const user = useSelector((state: any) => state.user);
	const rooms = useSelector((state: any) => state.rooms);
	const dispatch = useDispatch();

	useEffect(() => {
		chatSocket.emit("newUser", user.username);
	}, [user.username, dispatch]);
	
	const {
		data: blockedUsers,
		isLoading: blockedUsersLoading,
		isSuccess: blockedUsersSuccess,
		isError: blockedUsersError,
		error: blockedUsersErrorData,
		refetch: blockedUsersRefetch
	} = useGetBlockedUsersQuery({username: user.username});

	const {
		data: userRoomList,
		isLoading: userRoomListLoading,
		isSuccess: userRoomListSuccess,
		isError: userRoomListError,
		error: userRoomListErrorData,
		refetch: userRoomListRefetch
	} = useGetUserRoomListQuery({username: user.username});
	
	useEffect(() => {
		blockedUsersRefetch();
		if (blockedUsersSuccess && blockedUsers)
		{
			blockedUsers.forEach((element: any) => {
				dispatch(addBlockedUser(element));
			});
		}
		userRoomListRefetch();
		if (userRoomListSuccess && userRoomList)
		{
			userRoomList.forEach((element: any) => {
				dispatch(addRoom({	name: element.roomName,
									role: element.role,
									hasPassword: element.hasPassword,
									isDirectMsg: false,
									isMuted: element.isMuted,
									openTab: false
								}));
			});
			if (userRoomList.length > 0)
				dispatch(setRoomIndex(0));
		}
	}, [user.username, blockedUsersSuccess, blockedUsers, dispatch, blockedUsersRefetch, userRoomListSuccess, userRoomList, userRoomListRefetch]);
	
	if (!chatSocket.connected)
		return (<p>Chat Socket error</p>);
	if (blockedUsersError)
		return (<Error error={blockedUsersErrorData} />)
	else if (userRoomListError)
		return	(<Error error={userRoomListErrorData} />)
	else if (blockedUsersLoading || userRoomListLoading)
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