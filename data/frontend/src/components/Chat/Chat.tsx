import React, { useEffect, useState } from 'react';

import { chatSocket } from '../../chatSocket';
import { chatResponseArgs } from './args.interface';
import { actionTypes, manageRoomsTypes } from './args.types';

import { useDispatch, useSelector } from 'react-redux';
import { useGetBlockedUsersQuery } from '../../store/api';
import { addBlockedUser, mute, unmute } from '../../store/user';
import { changeRole, removeRoom } from '../../store/rooms';

import Room from './Room';
import CreateChannel from './CreateChannel';
import JoinChannel from './JoinChannel';
import MessageProvider from './Message/MessageProvider';

import { Button, Tab, Tabs } from '@mui/material';

function Chat() {
	const user = useSelector((state: any) => state.user);
	const rooms = useSelector((state: any) => state.rooms);
	const dispatch = useDispatch();

	const [roomIndex, setRoomIndex] = useState(-1);
	
	useEffect(() => {
		function process(value: chatResponseArgs) {
			if (value.action === actionTypes.kick)
			{
				dispatch(removeRoom(value.source));
				alert("You've been kicked from this channel: " + value.target);
			}
			else if (value.action === actionTypes.ban)
			{
				dispatch(removeRoom(value.source));
				alert("You are banned from this channel: " + value.target);
			}
			else if (value.action === actionTypes.private)
			{
				dispatch(removeRoom(value.source));
				alert("You cannot join this private channel: " + value.target);
			}
			else if (value.action === actionTypes.block)
				alert(value.source + " blocked you");
			else if (value.action === actionTypes.admin)
			{
				dispatch(changeRole({name: value.source, role: "admin"}));
				alert("You are now admin in " + value.source);
			}
			else if (value.action === actionTypes.mute)
			{
				if (value.isMuted === true)
				{
					const time = new Date(value.date);
					dispatch(mute());
					alert("You are muted from this channel: " + value.target);
					setTimeout(() => {
						dispatch(unmute());
					}, time.getMinutes() * 60 * 1000);
					return ;
				}
				dispatch(mute());
				alert("You've been muted from this channel: " + value.target);
				setTimeout(() => {
					dispatch(unmute());
				}, 10 * 60 * 1000);
			}
		}
		
		chatSocket.on(user.username, process);
		return () => {
			chatSocket.off(user.username, process);
		};
	}, [rooms, user.username, dispatch]);

	useEffect(() => {
		chatSocket.emit("newUser", user.username);
		dispatch(unmute());
	}, [user.username, dispatch]);
	
	function quitRoom(roomName: string, roomIndex: number)
	{
		console.log("at quit:" + rooms.room.length);
		if (rooms.room.length === 1)
			setRoomIndex(-1)
		else if (roomIndex !== 0)
			setRoomIndex(roomIndex - 1);
		dispatch(removeRoom(roomName));
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
			<p>------------------------------------------------</p>
			<CreateChannel setRoomIndex={setRoomIndex} />
			<p>------------------------------------------------</p>
			<JoinChannel setRoomIndex={setRoomIndex} />
			<p>------------------------------------------------</p>
			<div className='rooms'> {/* TODO replace/stylize <p> tag with good close button*/}
				{
					roomIndex != -1 ? 
						<Tabs value={roomIndex} onChange={changeSelectedRoom}>
							{rooms.room.map((room: {name: string, role: string}, key: number) =>
								<Tab value={key} tabIndex={key} key={key} label={
									<span>
										{room.name}
										{
											roomIndex === key ? <p onClick={() => quitRoom(room.name, key) }>x</p> : null
										}
										<MessageProvider roomName={room.name}/>
									</span>
								}/>
								)}
						</Tabs>
					: null
				}
				{/* TODO append button to quit room*/}
				{ 
					roomIndex != -1 ?
						<Room key={rooms.room[roomIndex].name} channelName={rooms.room[roomIndex].name}/>
					: null
				}
			</div>

		</div>
	);
}

export default Chat;