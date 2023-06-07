import React, { useState, useEffect } from 'react';

import Room from './Room';
import { chatSocket } from '../../chatSocket';
import { chatResponseArgs } from './args.interface';
import { actionTypes, manageRoomsTypes } from './args.types';
import { useDispatch, useSelector } from 'react-redux';
import { useGetBlockedUsersQuery } from '../../store/api';
import { addBlockedUser } from '../../store/user';
import CreateChannel from './CreateChannel';
import JoinChannel from './JoinChannel';

function Chat() {
	const user = useSelector((state: any) => state.user);
	const dispatch = useDispatch();

	const [rooms, setRooms] = useState<string[]>([]);

	useEffect(() => {
		function process(value: chatResponseArgs) {
			if (value.action === actionTypes.kick)
			{
				setRooms(rooms.filter(room => room !== value.target));
				alert("You've been kicked from this channel: " + value.target);
			}
			else if (value.action === actionTypes.ban)
			{
				setRooms(rooms.filter(room => room !== value.target));
				alert("You are banned from this channel: " + value.target);
			}
			else if (value.action === actionTypes.private)
			{
				setRooms(rooms.filter(room => room !== value.target));
				alert("You cannot join this private channel: " + value.target);
			}
			else if (value.action === actionTypes.block)
			{
				alert(value.source + " blocked you");
			}
		}
	
		chatSocket.on(user.username, process);
		return () => {
			chatSocket.off(user.username, process);
	  	};
	}, [rooms, user.username]);

	useEffect(() => {
		chatSocket.emit("newUser", user.username);
	}, [user.username]);

	function removeRoom(roomName: string)
	{
		setRooms(rooms.filter(room => room !== roomName));
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

	if (isError) // TODO fix show real error page (make Error component)
		return (<p>Error: {error.toString()}</p>)
	else if (isLoading)
		return (<p>Loading...</p>);

	return (
		<div className='chat'>
			<p>------------------------------------------------</p>
			<CreateChannel rooms={rooms} setRooms={setRooms}/>
			<p>------------------------------------------------</p>
			<JoinChannel rooms={rooms} setRooms={setRooms}/>
			<p>------------------------------------------------</p>
			<div className='rooms'>
				{rooms.map((room) =>
					<div key={room}>
						<p>{room}: </p>
						<Room channelName={room}/>
						<button onClick={ () => { removeRoom(room) } }>x</button>
					</div>)}
			</div>

		</div>
	);
}

export default Chat;