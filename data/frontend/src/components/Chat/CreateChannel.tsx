import React, { useState } from 'react';

import { chatSocket } from '../../chatSocket';
import { manageRoomsTypes } from './args.types';
import { accessStatus } from './accessStatus';
import { useDispatch, useSelector } from 'react-redux';
import { useGetIsRoomNameTakenQuery } from '../../store/api';
import { addRoom } from '../../store/rooms';

function CreateChannel() {
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

	function updateNewRoomName(e: React.FormEvent<HTMLInputElement>) 
	{
		refetch();
		setNewRoomName(e.currentTarget.value);
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
		// if (!rooms.room.includes(newRoomName, 0))
		if (!rooms.room.find((obj: {name: string, role: string}) => obj.name === newRoomName))
		{
			dispatch(addRoom({name: newRoomName, role: "owner"}));
			// setRooms((previous: string[]) => [...previous, newRoomName]);
			let	arg = { type: manageRoomsTypes.add, source: user.username, room: newRoomName, access: access};
			chatSocket.emit('manageRooms', arg);
		}
		else
			alert("You are currently in this channel");
	}



	return (
		<div className='createChannel'>
			<p>Create a new channel</p>
			<form onSubmit={ createRoom }>
				<input onChange={ updateNewRoomName} className={exist ? 'validForm' : 'invalidForm'}/>
				<select name="roomAccess" onChange={changeAccess}>
					<option value="public">Public</option>
					<option value="private">Private</option>
					<option value="password">Password-protected</option>
				</select>
				<button id='rooms' name='rooms' disabled={exist.data === true}>+</button>
				{ exist.data === true ? <p>This room already exist</p> : null}
			</form>
		</div>
	)
}

export default CreateChannel;