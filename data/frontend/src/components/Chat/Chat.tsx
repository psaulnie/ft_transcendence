import React, { useState, useEffect } from 'react';

import Room from './Room';
import { chatSocket } from '../../chatSocket';
import { chatResponseArgs } from './args.interface';
import { actionTypes, manageRoomsTypes } from './args.types';
import { accessStatus } from './accessStatus';
import { useDispatch, useSelector } from 'react-redux';
import { useGetBlockedUsersQuery } from '../../store/api';
import { addBlockedUser } from '../../store/user';

function Chat() {
	const user = useSelector((state: any) => state.user);
	const dispatch = useDispatch();

	const [newRoomName, setNewRoomName] = useState('');
	const [rooms, setRooms] = useState<string[]>([]);
	const [access, setAccess] = useState(accessStatus.public);

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

	function updateNewRoomName(e: React.FormEvent<HTMLInputElement>) { setNewRoomName(e.currentTarget.value); }

	function changeAccess(event: React.FormEvent<HTMLSelectElement>)
	{
		event.preventDefault();
		if (event.currentTarget.value === "public")
			setAccess(accessStatus.public);
		else if (event.currentTarget.value === "private")
			setAccess(accessStatus.private);
		else if (event.currentTarget.value === "password")
			setAccess(accessStatus.protected);
	}

	function createRoom(event: any)
	{
		event.preventDefault();
		if (!rooms.includes(newRoomName, 0))
		{
			setRooms(previous => [...previous, newRoomName]);
			let	arg = { type: manageRoomsTypes.add, source: user.username, room: newRoomName, access: access};
			chatSocket.emit('manageRooms', arg);
		}
		else
			alert("You are currently in this channel");
	}

	function removeRoom(roomName: string)
	{
		setRooms(rooms.filter(room => room !== roomName));
		chatSocket.emit('manageRooms', { type: manageRoomsTypes.remove, source: user.username, room: roomName, access: access});
	}

	const {
		data: blockedUsers,
		isLoading,
		isSuccess,
		isError,
		error
	} = useGetBlockedUsersQuery({username: user.username});
	if (isError) // TODO fix show real error page (make Error component)
		return (<p>Error: {error.toString()}</p>)
	else if (isLoading)
		return (<p>Loading...</p>);
	else if (isSuccess)
	{
		blockedUsers.data.forEach((element: string) => {
			dispatch(addBlockedUser(element));
		});
	}
	return (
		<div className='chat'>
			<p>------------------------------------------------</p>
			<p>Create a new channel</p>
			<form onSubmit={ createRoom }>
				<input onChange={ updateNewRoomName} />
				<select name="roomAccess" onChange={changeAccess}>
					<option value="public">Public</option>
					<option value="private">Private</option>
					<option value="password">Password-protected</option>
				</select>
				<button id='rooms' name='rooms'>+</button>
			</form>
			<p>------------------------------------------------</p>
			<div className='rooms'>
				{rooms.map((room) =>
					<div key={room}>
						<p>{room}: </p>
						<Room channelName={room} />
						<button onClick={ () => { removeRoom(room) } }>x</button>
					</div>)}
			</div>

		</div>
	);
}

export default Chat;