import React, { useState, useEffect } from 'react';

import { chatSocket } from '../../chatSocket';
import { manageRoomsTypes } from './args.types';
import { useSelector, useDispatch } from 'react-redux';
import { useGetRoomsListQuery } from '../../store/api';
import { accessStatus } from './accessStatus';
import { addRoom } from '../../store/rooms';


function JoinChannel({setIsCreated}: {setIsCreated: any}) {
	const user = useSelector((state: any) => state.user);
	const rooms = useSelector((state: any) => state.rooms);
	const dispatch = useDispatch();

	const [newRoomName, setNewRoomName] = useState('null');

	function changeSelectedRoom(event: React.FormEvent<HTMLSelectElement>)
	{
		event.preventDefault();
		setNewRoomName(event.currentTarget.value);
	}

	function joinRoom(event: any)
	{
		event.preventDefault();
		if (newRoomName === 'null')
			return ;
		// if (!rooms.includes(newRoomName, 0))
		if (!rooms.room.find((obj: {name: string, role: string}) => obj.name === newRoomName))
		{
			console.log("newroom");
			setIsCreated(false);
			dispatch(addRoom({name: newRoomName, role: "none"}));
			// setRooms((previous: string[]) => [...previous, newRoomName]);
			let	arg = { type: manageRoomsTypes.add, source: user.username, room: newRoomName, access: 0};
			chatSocket.emit('manageRooms', arg);
		}
		else
			alert("You are currently in this channel");
		setNewRoomName('null');
	}

	const {
		data: roomsList,
		isLoading,
		isError,
		error,
		refetch
	} = useGetRoomsListQuery({username: user.username});

	useEffect(() => {
		refetch();
	}, [refetch]);

	if (isError) // TODO fix show real error page (make Error component)
		return (<p>Error: {error.toString()}</p>)
	else if (isLoading)
		return (<p>Loading...</p>);

	return (
		<div className='joinChannel'>
			<p>Join a new channel</p>
			<form onSubmit={ joinRoom }>
				<select name="roomsList" onClick={refetch} onChange={changeSelectedRoom}>
					<option value="null" >Select an existing channel</option>
					{
						roomsList.data.map((room: any) => {
							if (!rooms.room.find((obj: {name: string, role: string}) => obj.name === room.roomName) && room.access !== accessStatus.private)
								return (
									<option key={room.roomName} value={room.roomName}>{room.roomName}</option>
								);
							return (null);
						})
					}
				</select>
				<button id='rooms' name='rooms'>+</button>
			</form>
		</div>
	)
}

export default JoinChannel;