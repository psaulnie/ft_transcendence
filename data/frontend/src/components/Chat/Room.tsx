import React, { useState, useEffect } from 'react';

import Messages from './Messages';
import InputForm from './InputForm';

import { chatSocket } from '../../chatSocket';

type arg = {
	username: string
}

function Room({ username }: arg) {
	const [isConnected, setIsConnected] = useState(chatSocket.connected); { /* TODO check if need to be removed */}
	const [messageSent, setMsg] = useState<string[]>([]);
  
	useEffect(() => {
	  function onConnect() {
		setIsConnected(true);
	  }
  
	  function onDisconnect() {
		setIsConnected(false);
	  }
  
	  function onMsgSent(value: string) {
		setMsg(previous => [...previous, value]);
	  }
  
	  chatSocket.on('connect', onConnect);
	  chatSocket.on('disconnect', onDisconnect);
	  chatSocket.on('receiveMsg', onMsgSent);
	  return () => {
		chatSocket.off('connect', onConnect);
		chatSocket.off('disconnect', onDisconnect);
		chatSocket.off('receiveMsg', onMsgSent);
	  };
	}, []);
	return (
		<div className="chat">
			<Messages messages={ messageSent } />
			<InputForm username={ username } />
		</div>
	)
}

export default Room;