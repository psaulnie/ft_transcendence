import React, { useState, useEffect } from 'react';

import { chatSocket } from '../../chatSocket';
import { manageRoomsTypes } from './args.types';
import { useSelector, useDispatch } from 'react-redux';
import { useGetUsersListQuery } from '../../store/api';
import { addRoom } from '../../store/rooms';

import Error from '../Global/Error';

import { FormControl, FormHelperText, InputLabel, Select, MenuItem, SelectChangeEvent, IconButton, Skeleton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add'

function JoinDirectMessage() {
	const user = useSelector((state: any) => state.user);
	const rooms = useSelector((state: any) => state.rooms);
	const dispatch = useDispatch();

	const [newUser, setNewUser] = useState('');

	function changeSelectedUser(event: SelectChangeEvent)
	{
		event.preventDefault();
		setNewUser(event.target.value);
	}

	function joinRoom(event: any)
	{
		event.preventDefault();
		if (newUser === '')
			return ;
		if (!rooms.room.find((obj: {name: string, role: string}) => obj.name === newUser))
		{
			dispatch(addRoom({name: newUser, role: "none", isDirectMsg: true, hasPassword: false, openTab: true, isMuted: false}));
			chatSocket.emit('manageRooms', { type: manageRoomsTypes.addDirectMsg, source: user.username, room: newUser, access: 0});
		}
		setNewUser('');
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

	if (isError)
		return (<Error error={error} />)
	else if (isLoading)
		return (
			<div>
				<Skeleton variant="text"/>
				<Skeleton variant="rectangular" />
			</div>
		);

	return (
		<div className='joinDirectMessage'>
			<p>Direct Message</p>
				<FormControl sx={{ m: 1, minWidth: 120 }} size="small">
					<InputLabel>Users</InputLabel>
					<Select name="usersList" onClick={refetch} onChange={changeSelectedUser} value={newUser} defaultValue=''>
						{
							usersList.map((username: any, key: number) => {
								if (!user.blockedUsers.find((obj: string) => obj === username) && user.username !== username)
									return (
										<MenuItem key={key} value={username}>{username}</MenuItem>
									);
							})
						}
					</Select>
					<FormHelperText>Select an user</FormHelperText>
				</FormControl>
				<IconButton size="small" onClick={ joinRoom } disabled={newUser === ""}>
					<AddIcon/>
				</IconButton>
		</div>
	)
}

export default JoinDirectMessage;