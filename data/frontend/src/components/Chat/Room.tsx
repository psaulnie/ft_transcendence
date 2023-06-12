import { useState, useEffect } from 'react';

import MessagesBox from './Message/MessagesBox';
import InputForm from './Message/InputForm';

import { chatSocket } from '../../chatSocket';
import { chatResponseArgs } from './args.interface';
import { useSelector } from 'react-redux';

function Room({channelName}: {channelName: string}) {
	const rooms = useSelector((state: any) => state.rooms);

	// const [messageSent, setMsg] = useState<chatResponseArgs[]>([]);
	const [role, setRole] = useState('none');
	const [roomIndex, setRoomIndex] = useState(rooms.room.findIndex((obj: {name: string, role: string}) => obj.name === channelName));

	// useEffect(() => {
	//   function onMsgSent(value: chatResponseArgs) {
	// 	setMsg(previous => [...previous, value]);
	//   }
	
	//   chatSocket.on(channelName, onMsgSent);
	//   return () => {
	// 	chatSocket.off(channelName, onMsgSent);
	//   };
	// }, [channelName]);

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