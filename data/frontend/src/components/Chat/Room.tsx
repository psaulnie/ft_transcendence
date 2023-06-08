import { useState, useEffect } from 'react';

import Messages from './Messages';
import InputForm from './InputForm';

import { chatSocket } from '../../chatSocket';
import { chatResponseArgs } from './args.interface';

function Room({channelName, isCreated}: {channelName: string, isCreated: boolean}) {
	const [messageSent, setMsg] = useState<chatResponseArgs[]>([]);
	let role = (isCreated ? "owner" : "none")

	useEffect(() => {
	  function onMsgSent(value: chatResponseArgs) {
		setMsg(previous => [...previous, value]);
	  }
	
	  chatSocket.on(channelName, onMsgSent);
	  return () => {
		chatSocket.off(channelName, onMsgSent);
	  };
	}, [channelName]);

	return (
		<div className="chat">
			<Messages messages={ messageSent } role={ role } channelName={ channelName } />
			<InputForm channelName={ channelName } />
		</div>
	);
}

export default Room;