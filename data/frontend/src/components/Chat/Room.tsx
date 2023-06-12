import { useState, useEffect } from 'react';

import MessagesBox from './Message/MessagesBox';
import InputForm from './Message/InputForm';

import { useSelector } from 'react-redux';

function Room({channelName}: {channelName: string}) {
	const rooms = useSelector((state: any) => state.rooms);

	const [role, setRole] = useState('none');
	const roomIndex = rooms.room.findIndex((obj: {name: string, role: string}) => obj.name === channelName); // TODO check if need to recalculate index at every rendering in useEffect

	useEffect(() => {
		const cRole = rooms.room.find((obj: {name: string, role: string}) => obj.name === channelName);
		if (cRole)
			setRole(cRole.role);
	}, [setRole, rooms, channelName]);

	return (
		<div className="chat">
			<MessagesBox messages={ rooms.room[roomIndex].messages } role={ role } channelName={ channelName } />
			<InputForm channelName={ channelName } />
		</div>
	);
}

export default Room;