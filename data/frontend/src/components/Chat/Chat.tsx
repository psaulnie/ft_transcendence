import React, { SyntheticEvent, useState, useEffect } from 'react';

import Room from './Room';
import Messages from './Messages';
import InputForm from './InputForm';

import { chatSocket } from '../../chatSocket';

function Chat() {
	const [username, setUsername] = useState('');
	const [newRoomName, setNewRoomName] = useState('');
	const [rooms, setRooms] = useState<string[]>(['general']);

	function onChange(e: React.FormEvent<HTMLInputElement>)
	{
		e.preventDefault();
		setUsername(e.currentTarget.value);
	}

	function updateNewRoomName(e: React.FormEvent<HTMLInputElement>) { setNewRoomName(e.currentTarget.value); }

	function createRoom(event: SyntheticEvent)
	{
		event.preventDefault();
		if (rooms.find((str: string) => {return (str != newRoomName)}))
			setRooms(previous => [...previous, newRoomName]);
		else
			alert("You are currently in this channel");
	}

	return (
		<div className='chat'>
			<form>
				<p>Username:</p>
				<input value={username} onChange={ onChange } />
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
					</div>)}

			</div>

		</div>
	);
}

export default Chat;