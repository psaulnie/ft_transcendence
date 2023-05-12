import React, { useState, useEffect } from 'react';

import Messages from './Messages'
import InputForm from './InputForm'
import ConnectionState from './ConnectionState';
import ConnectionManager from './ConnectionManager';

import { io } from 'socket.io-client';
import { socket } from '../../socket';

function Chat() {
	const [isConnected, setIsConnected] = useState(socket.connected);
	const [messageSent, setMsg] = useState<string[]>([]);
  
	useEffect(() => {
	  function onConnect() {
		setIsConnected(true);
	  }
  
	  function onDisconnect() {
		setIsConnected(false);
	  }
  
	  function onMsgSent(value: string) { // check if value is a string
		setMsg(previous => [...previous, value]);
	  }
  
	  socket.on('connect', onConnect);
	  socket.on('disconnect', onDisconnect);
	  socket.on('receiveMsg', onMsgSent);
	  return () => {
		socket.off('connect', onConnect);
		socket.off('disconnect', onDisconnect);
		socket.off('receiveMsg', onMsgSent);
	  };
	}, []);
	return (
		<div className="chat">
			<ConnectionState isConnected={ isConnected } />
      		<ConnectionManager />
			<Messages messages={ messageSent } />
			<InputForm />
		</div>
	)
}

export default Chat;