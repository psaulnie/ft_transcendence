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
	const [role, setRole] = useState('none');

	useEffect(() => {
		function onMsgSent(value: string) {
			setMsg(previous => [...previous, value]);
		}

		chatSocket.on(channelName, onMsgSent);
		return () => {
			chatSocket.off(channelName, onMsgSent);
		};
	}, []);

	const fetchUserData = () => {
		fetch("http://localhost:5500/api/chat/role?username=" + username + "&roomName=" + channelName)
			.then(response => {
				return response.text()
			})
			.then(data => {
				setRole(data)
			})
	}

	useEffect(() => {
		fetchUserData()
	}, []);
	return (
		<div className="chat">
			<Messages messages={messageSent} role={role} channelName={channelName} />
			<InputForm username={username} channelName={channelName} />
		</div>
	)
}

export default Room;