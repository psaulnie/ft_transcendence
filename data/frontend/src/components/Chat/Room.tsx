import React, { useState, useEffect } from 'react';

import Messages from './Messages';
import InputForm from './InputForm';

import { chatSocket } from '../../chatSocket';

type arg = {
	username: string
	channelName: string
}

function Room({ username, channelName }: arg) {
	const [messageSent, setMsg] = useState<string[]>([]);
  
	useEffect(() => {
	  function onMsgSent(value: string) {
		setMsg(previous => [...previous, value]);
	  }
  
	  chatSocket.on(channelName, onMsgSent);
	  return () => {
		chatSocket.off(channelName, onMsgSent);
	  };
	}, []);
	return (
		<div className="chat">
			<Messages messages={ messageSent } />
			<InputForm username={ username } channelName={ channelName } />
		</div>
	)
}

export default Room;