import React, { useState, useEffect } from 'react';

import { chatSocket } from '../../chatSocket';
import { manageRoomsTypes } from './args.types';
import { useSelector, useDispatch } from 'react-redux';
import { useGetRoomsListQuery } from '../../store/api';
import { accessStatus } from './accessStatus';
import { addRoom } from '../../store/rooms';

import { FormControl, FormHelperText, InputLabel, Select, MenuItem, SelectChangeEvent, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add'

function JoinChannel({ setRoomIndex }: { setRoomIndex: any }) {
	const user = useSelector((state: any) => state.user);
	const rooms = useSelector((state: any) => state.rooms);
	const dispatch = useDispatch();

	const [newRoomName, setNewRoomName] = useState('null');

	function changeSelectedRoom(event: SelectChangeEvent)
	{
		event.preventDefault();
		setNewRoomName(event.target.value);
	}

	function joinRoom(event: any)
	{
		event.preventDefault();
		if (newRoomName === 'null')
			return ;
		if (!rooms.room.find((obj: {name: string, role: string}) => obj.name === newRoomName))
		{
			dispatch(addRoom({name: newRoomName, role: "none", isDirectMsg: false}));
			console.log(rooms.room.length - 1);
			setRoomIndex(rooms.room.length);
			chatSocket.emit('manageRooms', { type: manageRoomsTypes.add, source: user.username, room: newRoomName, access: 0});
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
	} = useGetRoomsListQuery({});

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
				<FormControl sx={{ m: 1, minWidth: 120 }} size="small">
					<InputLabel>Channel</InputLabel>
					<Select name="roomsList" onClick={refetch} onChange={changeSelectedRoom} defaultValue=''>
						{
							roomsList.data.map((room: any) => {
								if (!rooms.room.find((obj: {name: string, role: string}) => obj.name === room.roomName) && room.access !== accessStatus.private)
									return (
										<MenuItem key={room.roomName} value={room.roomName}>{room.roomName}</MenuItem>
									);
								return (null);
							})
						}
					</Select>
					<FormHelperText>Select an existing channel</FormHelperText>
				</FormControl>
				<IconButton size="small" onClick={ joinRoom }>
					<AddIcon/>
				</IconButton>
		</div>
	)
}

export default JoinChannel;