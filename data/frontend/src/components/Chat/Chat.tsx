import React, { useEffect } from 'react';

import Room from './Room';
import { chatSocket } from '../../chatSocket';
import { chatResponseArgs } from './args.interface';
import { actionTypes, manageRoomsTypes } from './args.types';
import { useDispatch, useSelector } from 'react-redux';
import { useGetBlockedUsersQuery } from '../../store/api';
import { addBlockedUser } from '../../store/user';
import CreateChannel from './CreateChannel';
import JoinChannel from './JoinChannel';
import { addRoom, changeRole, removeRoom } from '../../store/rooms';

function Chat() {
	const user = useSelector((state: any) => state.user);
	const rooms = useSelector((state: any) => state.rooms)
	const dispatch = useDispatch();

	useEffect(() => {
		function process(value: chatResponseArgs) {
			if (value.action === actionTypes.kick)
			{
				dispatch(addRoom({ name: value.source , role: value.role }));
				// setRooms(rooms.filter(room => room !== value.target));
				alert("You've been kicked from this channel: " + value.target);
			}
			else if (value.action === actionTypes.ban)
			{
				dispatch(addRoom({ name: value.source , role: value.role }));

				// setRooms(rooms.filter(room => room !== value.target));
				alert("You are banned from this channel: " + value.target);
			}
			else if (value.action === actionTypes.private)
			{
				dispatch(addRoom({ name: value.source , role: value.role }));

				// setRooms(rooms.filter(room => room !== value.target));
				alert("You cannot join this private channel: " + value.target);
			}
			else if (value.action === actionTypes.block)
				alert(value.source + " blocked you");
			else if (value.action === actionTypes.admin)
			{
				dispatch(changeRole({name: value.source, role: "admin"}));
				alert("You are now admin in " + value.source);
			}
		}
	
		chatSocket.on(user.username, process);
		return () => {
			chatSocket.off(user.username, process);
	  	};
	}, [rooms, user.username, dispatch]);

	useEffect(() => {
		chatSocket.emit("newUser", user.username);
	}, [user.username]);

	function quitRoom(roomName: string)
	{		
		dispatch(removeRoom(roomName));
		chatSocket.emit('manageRooms', { type: manageRoomsTypes.remove, source: user.username, room: roomName, access: 0});
	}

	const {
		data: blockedUsers,
		isLoading,
		isSuccess,
		isError,
		error,
		refetch
	} = useGetBlockedUsersQuery({username: user.username});

	useEffect(() => {
		refetch();
		if (isSuccess)
		{
			blockedUsers.data.forEach((element: any) => {
				dispatch(addBlockedUser(element.username));
			});
		}
	}, [user.username, isSuccess, blockedUsers, dispatch, refetch]);

	if (isError) // TODO fix show real error page (make Error component)
		return (<p>Error: {error.toString()}</p>)
	else if (isLoading)
		return (<p>Loading...</p>);

	return (
		<div className='chat'>
			<p>------------------------------------------------</p>
			<CreateChannel/>
			<p>------------------------------------------------</p>
			<JoinChannel/>
			<p>------------------------------------------------</p>
			<div className='rooms'>
				{rooms.room.map((room: {name: string, role: string}) =>
					<div key={room.name}>
						<p>{room.name}: </p>
						<Room channelName={room.name}/>
						<button onClick={ () => { quitRoom(room.name) } }>x</button>
					</div>)}
			</div>

		</div>
	);
}

export default Chat;