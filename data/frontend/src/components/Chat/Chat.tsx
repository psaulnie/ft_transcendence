import React, { useEffect, useState } from 'react';

import { chatSocket } from '../../chatSocket';
import { manageRoomsTypes } from './args.types';

import { useDispatch, useSelector } from 'react-redux';
import { useGetBlockedUsersQuery } from '../../store/api';
import { addBlockedUser, unmute } from '../../store/user';
import { removeRoom } from '../../store/rooms';

import Room from './Room';
import CreateChannel from './CreateChannel';
import JoinChannel from './JoinChannel';
import MessageProvider from './Message/MessageProvider';
import JoinDirectMessage from './JoinDirectMessage';
import DirectMessageProvider from './DirectMessageProvider';
import ChatProcess from './ChatProcess';

import { IconButton, Tab, Tabs } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

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
		dispatch(removeRoom(roomName));
		const room = rooms.room.find((obj: any) => obj.name === roomName)
		if (room.isDirectMessage === false)
			chatSocket.emit('manageRooms', { type: manageRoomsTypes.remove, source: user.username, room: roomName, access: 0});
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
	}, [user.username, isSuccess, blockedUsers, dispatch, refetch]);
	
	function changeSelectedRoom(event: React.SyntheticEvent, newIndex: number)
	{
		setRoomIndex(newIndex);
	}

	if (isError) // TODO fix show real error page (make Error component)
		return (<p>Error: {error.toString()}</p>)
	else if (isLoading)
		return (<p>Loading...</p>);

	return (
		<div className='chat'>
			<ChatProcess setRoomIndex={setRoomIndex} />
			<p>------------------------------------------------</p>
			<JoinDirectMessage setRoomIndex={setRoomIndex} />
			<p>------------------------------------------------</p>
			<CreateChannel setRoomIndex={setRoomIndex} />
			<p>------------------------------------------------</p>
			<JoinChannel setRoomIndex={setRoomIndex} />
			<p>------------------------------------------------</p>
			<div className='rooms'>
				<DirectMessageProvider roomIndex={roomIndex} setRoomIndex={setRoomIndex}/>
				{
					roomIndex !== -1 ? 
						<Tabs value={roomIndex} onChange={changeSelectedRoom}>
							{rooms.room.map((room: {name: string, role: string}, key: number) =>
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
										<MessageProvider roomName={room.name}/>
									</span>
								}/>
								)}
						</Tabs>
					: null
				}
				{ 
					roomIndex !== -1 ?
						<Room key={rooms.room[roomIndex].name} channelName={rooms.room[roomIndex].name}/>
					: null
				}
			</div>

		</div>
	);
}

export default Chat;