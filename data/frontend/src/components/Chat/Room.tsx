import React, { useState, useEffect } from 'react';

import Messages from './Messages';
import InputForm from './InputForm';

import { chatSocket } from '../../chatSocket';

type arg = {
	username: string
	channelName: string
}

function Room({ username, channelName }: arg) {
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
	  chatSocket.on(channelName, onMsgSent);
	  return () => {
		chatSocket.off('connect', onConnect);
		chatSocket.off('disconnect', onDisconnect);
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