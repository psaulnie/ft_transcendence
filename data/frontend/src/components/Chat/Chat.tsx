import React, { SyntheticEvent, useState, useEffect } from 'react';

import Room from './Room';
import { chatSocket } from '../../chatSocket';
import { manageRoomsArgs } from './args.interface';
import { manageRoomsTypes } from './args.types';
import { accessStatus } from './accessStatus';

type arg = {
	username: string
}

function Chat({ username }: arg) {
	const [newRoomName, setNewRoomName] = useState('');
	const [rooms, setRooms] = useState<string[]>([]);
	const [access, setAccess] = useState(accessStatus.public);

	useEffect(() => {
		function process(value: string) {
			const arr = value.split(' ');

			if (arr[0] == "KICK")
			{
				setRooms(rooms.filter(room => room !== arr[1]));
				alert("You've been kicked from this channel: " + arr[1]);
			}
			else if (arr[0] == "BAN")
			{
				setRooms(rooms.filter(room => room !== arr[1]));
				alert("You are banned from this channel: " + arr[1]);
			}
			else if (arr[0] == "PRIVATE")
			{
				setRooms(rooms.filter(room => room !== arr[1]));
				alert("You cannot join this private channel: " + arr[1]);
			}
		}
	
		chatSocket.on(username, process);
		return () => {
			chatSocket.off(username, process);
	  	};
	}, []);

	useEffect(() => {
		chatSocket.emit("newUser", username);
	}, []);

	function updateNewRoomName(e: React.FormEvent<HTMLInputElement>) { setNewRoomName(e.currentTarget.value); }

	function changeAccess(event: React.FormEvent<HTMLSelectElement>)
	{
		event.preventDefault();
		if (event.currentTarget.value == "public")
			setAccess(accessStatus.public);
		else if (event.currentTarget.value == "private")
			setAccess(accessStatus.private);
		else if (event.currentTarget.value == "password")
			setAccess(accessStatus.protected);
	}

	function createRoom(event: any)
	{
		event.preventDefault();
		if (!rooms.includes(newRoomName, 0))
		{
			setRooms(previous => [...previous, newRoomName]);
			let	arg = { type: manageRoomsTypes.add, source: username, room: newRoomName, access: access};
			chatSocket.emit('manageRooms', arg);
		}
		else
			alert("You are currently in this channel");
	}

	function removeRoom(roomName: string)
	{
		setRooms(rooms.filter(room => room !== roomName));
		let	arg = { type: manageRoomsTypes.remove, source: username, room: roomName, access: access};
		chatSocket.emit('manageRooms', arg);
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
				<button id='rooms' name='rooms' >+</button>
			</form>
			<p>------------------------------------------------</p>
			<div className='rooms'>
				{rooms.map((room, index) =>
					<div key={index}>
						<p>{room}: </p>
						<Room username={username} channelName={room} />
						<button onClick={ () => { removeRoom(room) } }>x</button>
					</div>)}
			</div>

		</div>
	);
}

export default Chat;