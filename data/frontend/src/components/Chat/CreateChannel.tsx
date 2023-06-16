import React, { useState } from 'react';

import { chatSocket } from '../../chatSocket';
import { manageRoomsTypes } from './args.types';
import { accessStatus } from './accessStatus';
import { useDispatch, useSelector } from 'react-redux';
import { useGetIsRoomNameTakenQuery } from '../../store/api';
import { addRoom } from '../../store/rooms';

import { TextField, Select, MenuItem, FormControl, FormHelperText, SelectChangeEvent, IconButton, InputLabel, Skeleton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add'
import PasswordDialog from './PasswordDialog';

function CreateChannel({ setRoomIndex }: { setRoomIndex: any }) {
	const user = useSelector((state: any) => state.user);
	const rooms = useSelector((state: any) => state.rooms);
	const dispatch = useDispatch();
	
	const [newRoomName, setNewRoomName] = useState('');
	const [access, setAccess] = useState(accessStatus.public);
	const [showDialog, setShowDialog] = useState(false);

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
		return (
			<div>
				<Skeleton variant="text"/>
				<Skeleton variant="rectangular" />
			</div>
		);

	function updateNewRoomName(e: any) 
	{
		refetch();
		if (e.target.value.length <= 10)
			setNewRoomName(e.target.value);
	}

	function changeAccess(event: SelectChangeEvent)
	{
		event.preventDefault();
		if (event.target.value === "public")
			setAccess(accessStatus.public);
		else if (event.target.value === "private")
			setAccess(accessStatus.private);
		else if (event.target.value === "password")
			setAccess(accessStatus.protected);
	}

	function createRoom(event: any)
	{
		event.preventDefault();
		if (!rooms.room.find((obj: {name: string, role: string}) => obj.name === newRoomName))
		{
			let hasPassword = false;
			if (access === accessStatus.protected)
			{
				setShowDialog(true);
				hasPassword = true;
				return ;
			}
			dispatch(addRoom({name: newRoomName, role: "owner", isDirectMsg: false, hasPassword: hasPassword}));
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
				<TextField error={exist.data} helperText={exist.data ? 'This room already exists' : null} label="Room name" value={newRoomName} onChange={updateNewRoomName} />
				<FormControl>
					<InputLabel>Access</InputLabel>
					<Select name="roomAccess" onChange={changeAccess} defaultValue=''>
						<MenuItem defaultChecked value="public">Public</MenuItem>
						<MenuItem value="private">Private</MenuItem>
						<MenuItem value="password">Password-protected</MenuItem>
					</Select>
					<FormHelperText>Channel access</FormHelperText>
				</FormControl>
				<IconButton name='rooms' disabled={exist.data === true || newRoomName === ''} onClick={ createRoom } >
					<AddIcon/>
				</IconButton>
				{ showDialog === true ? <PasswordDialog open={showDialog} setOpen={setShowDialog} roomName={newRoomName} role="owner" /> : null}
				{ exist.data === true ? <p>This room already exist</p> : null}
		</div>
	)
}

export default CreateChannel;