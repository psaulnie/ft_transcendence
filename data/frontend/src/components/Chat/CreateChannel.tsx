import React, { useState } from 'react';

import { chatSocket } from '../../chatSocket';
import { manageRoomsTypes } from './args.types';
import { accessStatus } from './accessStatus';
import { useDispatch, useSelector } from 'react-redux';
import { useGetIsRoomNameTakenQuery } from '../../store/api';
import { addRoom } from '../../store/rooms';

import { TextField } from '@mui/material';

function CreateChannel({ setRoomIndex }: { setRoomIndex: any }) {
	const user = useSelector((state: any) => state.user);
	const rooms = useSelector((state: any) => state.rooms);
	const dispatch = useDispatch();
	
	const [newRoomName, setNewRoomName] = useState('');
	const [access, setAccess] = useState(accessStatus.public);
	
	const {
		data: exist,
		isLoading,
		isError,
		error,
		refetch
	} = useGetIsRoomNameTakenQuery({roomName: newRoomName});
	
	if (isError) // TODO fix show real error page (make Error component)
		return (<p>Error: {error.toString()}</p>)
	else if (isLoading)
		return (<p>Loading...</p>);

	function updateNewRoomName(e: any) 
	{
		refetch();
		if (e.target.value.length <= 10)
			setNewRoomName(e.target.value);
	}

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
		if (!rooms.room.find((obj: {name: string, role: string}) => obj.name === newRoomName))
		{
			dispatch(addRoom({name: newRoomName, role: "owner"}));
			setRoomIndex(rooms.room.length);
			chatSocket.emit('manageRooms', { type: manageRoomsTypes.add, source: user.username, room: newRoomName, access: access});
		}
		else
			alert("You are currently in this channel");
		setNewRoomName("");
	}



	return (
		<div className='createChannel'>
			<p>Create a new channel</p>
			<form onSubmit={ createRoom }>
				<TextField error={exist.data} helperText={exist.data ? 'This room already exists' : null} label="Room name" value={newRoomName} onChange={updateNewRoomName} />
				<select name="roomAccess" onChange={changeAccess}>
					<option value="public">Public</option>
					<option value="private">Private</option>
					<option value="password">Password-protected</option>
				</select>
				<button id='rooms' name='rooms' disabled={exist.data === true || newRoomName === ''}>+</button>
				{ exist.data === true ? <p>This room already exist</p> : null}
			</form>
		</div>
	)
}

export default CreateChannel;