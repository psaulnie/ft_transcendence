import React, { SyntheticEvent, useState, useEffect } from 'react';

import Room from './Room';
import { chatSocket } from '../../chatSocket';

function Chat() {
	const [username, setUsername] = useState('');
	const [newRoomName, setNewRoomName] = useState('');
	const [rooms, setRooms] = useState<string[]>([]);

	function onChange(e: React.FormEvent<HTMLInputElement>)
	{
		e.preventDefault();
		setUsername(e.currentTarget.value);
	}

	function updateNewRoomName(e: React.FormEvent<HTMLInputElement>) { setNewRoomName(e.currentTarget.value); }

	function createRoom(event: SyntheticEvent)
	{
		event.preventDefault();
		if (username == '')
		{
			alert("Set an username");
			return ;
		}
		if (!rooms.includes(newRoomName, 0))
		{
			setRooms(previous => [...previous, newRoomName]);
			chatSocket.emit('manageRooms', username + " ADD " + newRoomName);
		}
		else
			alert("You are currently in this channel");
	}

	function removeRoom(roomName: string)
	{
		setRooms(rooms.filter(room => room !== roomName));
		chatSocket.emit('manageRooms', username + " REMOVE " + roomName);
	}

	return (
		<div className='chat'>
			<form>
				<p>Username:</p>
				<input value={username} onChange={ onChange } />
				{/* <button onClick={}>Set</button> */}
			</form>
			<p>------------------------------------------------</p>
			<p>Create a new channel</p>
			<form onSubmit={ createRoom }>
				<input onChange={ updateNewRoomName} />
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