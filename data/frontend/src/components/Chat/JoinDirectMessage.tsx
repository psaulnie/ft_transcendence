import React, { useState, useEffect } from 'react';

import { chatSocket } from '../../chatSocket';
import { manageRoomsTypes } from './args.types';
import { useSelector, useDispatch } from 'react-redux';
import { useGetUsersListQuery } from '../../store/api';
import { addRoom } from '../../store/rooms';

import { FormControl, FormHelperText, InputLabel, Select, MenuItem, SelectChangeEvent, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add'

function JoinDirectMessage({ setRoomIndex }: { setRoomIndex: any }) {
	const user = useSelector((state: any) => state.user);
	const rooms = useSelector((state: any) => state.rooms);
	const dispatch = useDispatch();

	const [newUser, setNewUser] = useState('null');

	function changeSelectedUser(event: SelectChangeEvent)
	{
		event.preventDefault();
		setNewUser(event.target.value);
	}

	function joinRoom(event: any)
	{
		event.preventDefault();
		if (newUser === 'null')
			return ;
		if (!rooms.room.find((obj: {name: string, role: string}) => obj.name === newUser))
		{
			dispatch(addRoom({name: newUser, role: "none", isDirectMsg: true}));
			setRoomIndex(rooms.room.length);
			chatSocket.emit('manageRooms', { type: manageRoomsTypes.addDirectMsg, source: user.username, room: newUser, access: 0});
		}
		setNewUser('null');
	}

	const {
		data: usersList,
		isLoading,
		isError,
		error,
		refetch
	} = useGetUsersListQuery({});

	useEffect(() => {
		refetch();
	}, [refetch]);

	if (isError) // TODO fix show real error page (make Error component)
		return (<p>Error: {error.toString()}</p>)
	else if (isLoading)
		return (<p>Loading...</p>);

	return (
		<div className='joinDirectMessage'>
			<p>Direct Message</p>
				<FormControl sx={{ m: 1, minWidth: 120 }} size="small">
					<InputLabel>Users</InputLabel>
					<Select name="usersList" onClick={refetch} onChange={changeSelectedUser} defaultValue=''>
						{
							usersList.data.map((username: any) => {
								if (!user.blockedUsers.find((obj: string) => obj === username))
									return (
										<MenuItem key={username} value={username}>{username}</MenuItem>
									);
								return (null);
							})
						}
					</Select>
					<FormHelperText>Select an user</FormHelperText>
				</FormControl>
				<IconButton size="small" onClick={ joinRoom }> {/* TODO disable button when user not selected*/}
					<AddIcon/>
				</IconButton>
		</div>
	)
}

export default JoinDirectMessage;