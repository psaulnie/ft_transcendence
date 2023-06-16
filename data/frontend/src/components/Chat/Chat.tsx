import React, { useEffect, useState, useRef } from 'react';

import { chatSocket } from '../../chatSocket';
import { manageRoomsTypes } from './args.types';

import { useDispatch, useSelector } from 'react-redux';
import { useGetBlockedUsersQuery } from '../../store/api';
import { addBlockedUser, unmute } from '../../store/user';
import { removeRoom, setRead } from '../../store/rooms';

import Room from './Room';
import CreateChannel from './CreateChannel';
import JoinChannel from './JoinChannel';
import MessageProvider from './Message/MessageProvider';
import JoinDirectMessage from './JoinDirectMessage';
import DirectMessageProvider from './DirectMessageProvider';
import ChatProcess from './ChatProcess';

import { IconButton, Tab, Tabs, Skeleton, Box, Grid } from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import MarkChatUnreadIcon from '@mui/icons-material/MarkChatUnread';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble'; 

function Chat() {
	const user = useSelector((state: any) => state.user);
	const rooms = useSelector((state: any) => state.rooms);
	const dispatch = useDispatch();

	const [roomIndex, setRoomIndex] = useState(-1);

	useEffect(() => {
		chatSocket.emit("newUser", user.username);
		dispatch(unmute());
	}, [user.username, dispatch]);
	
	function quitRoom(roomName: string, roomIndex: number)
	{
		if (rooms.room.length === 1)
			setRoomIndex(-1)
		else if (roomIndex !== 0)
			setRoomIndex(roomIndex - 1);
		chatSocket.emit('manageRooms', { type: manageRoomsTypes.remove, source: user.username, room: roomName, access: 0});
		dispatch(removeRoom(roomName));
	}
	
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
		// if (rooms.room.length !== 0)
		// 	setRoomIndex(0); // TODO check if necessary

	}, [user.username, isSuccess, blockedUsers, dispatch, refetch, setRoomIndex, rooms]);
	
	function changeSelectedRoom(event: React.SyntheticEvent, newIndex: number)
	{
		setRoomIndex(newIndex);
		dispatch(setRead(newIndex));
	}

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
			<ChatProcess roomIndex={roomIndex} setRoomIndex={setRoomIndex} />
			<Grid container sx={{ display: 'flex'}} justifyContent="space-evenly">
				<Grid item xs={3}>
						<Box sx={{ backgroundColor: '#102b47', height: '100%', padding: '16px', borderRadius: '10px'}}>
							<Grid container>
								<JoinDirectMessage setRoomIndex={setRoomIndex} />
							</Grid>
							<Grid container>
								<CreateChannel setRoomIndex={setRoomIndex} />
							</Grid>
							<Grid container>
								<JoinChannel setRoomIndex={setRoomIndex} />
							</Grid>
						</Box>
				</Grid>
				<Grid item xs={7}>
						<DirectMessageProvider roomIndex={roomIndex} setRoomIndex={setRoomIndex}/>
						<Grid>
							{ 
								roomIndex !== -1 && rooms.room[roomIndex] ?
									<Room key={rooms.room[roomIndex].name} channelName={rooms.room[roomIndex].name}/>
								: null
							}	
						</Grid>
						<Grid item sx={{ marginBottom: '70px' }}>
							{
								roomIndex !== -1 ? 
									<Tabs sx={{position: 'fixed', bottom:"0", width:"100%"}} value={roomIndex} onChange={changeSelectedRoom} variant="scrollable" scrollButtons="auto">
										{rooms.room.map((room: {name: string, role: string, unread: boolean}, key: number) =>
											<Tab value={key} tabIndex={key} key={key} label={
												<span>
													{room.name}
													{
														roomIndex === key ? 
															<IconButton size="small" component="span" onClick={() => quitRoom(room.name, key) }>
																<CloseIcon/>
															</IconButton>
														: null
													}
													<MessageProvider roomName={room.name} currentRoomIndex={roomIndex}/>
												</span>
											} icon={ room.unread ? <MarkChatUnreadIcon fontSize='small'/> : <ChatBubbleIcon fontSize='small'/> } iconPosition="start" />
											)}
									</Tabs>
								: null
							}
						</Grid>
				</Grid>
			</Grid>
		</div>
	);
}

export default Chat;