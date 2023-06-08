import { useState, useEffect } from 'react';

import Messages from './Messages';
import InputForm from './InputForm';

import { chatSocket } from '../../chatSocket';
import { chatResponseArgs } from './args.interface';
import { useSelector } from 'react-redux';

function Room({channelName}: {channelName: string}) {
	const rooms = useSelector((state: any) => state.rooms);

	const [messageSent, setMsg] = useState<chatResponseArgs[]>([]);
	const [role, setRole] = useState('none');

	useEffect(() => {
	  function onMsgSent(value: chatResponseArgs) {
		setMsg(previous => [...previous, value]);
	  }
	
	  chatSocket.on(channelName, onMsgSent);
	  return () => {
		chatSocket.off(channelName, onMsgSent);
	  };
	}, [channelName]);

	useEffect(() => {
		setRole(rooms.room.find((obj: {name: string, role: string}) => obj.name === channelName).role);
	}, [setRole, rooms, channelName]);

	return (
		<div className="chat">
			<Messages messages={ messageSent } role={ role } channelName={ channelName } />
			<InputForm channelName={ channelName } />
		</div>
	);
}

export default Room;