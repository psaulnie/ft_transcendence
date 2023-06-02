import React, { useState, useEffect } from 'react';

import Messages from './Messages';
import InputForm from './InputForm';

import { chatSocket } from '../../chatSocket';
import { chatResponseArgs } from './args.interface';
import { useGetRoleQuery } from '../../store/api';

type arg = {
	username: string
	channelName: string
}

function Room({ username, channelName }: arg) {
	const [messageSent, setMsg] = useState<chatResponseArgs[]>([]);
	// const [role, setRole] = useState('none');

	useEffect(() => {
	  function onMsgSent(value: chatResponseArgs) {
		setMsg(previous => [...previous, value]);
	  }
	
	  chatSocket.on(channelName, onMsgSent);
	  return () => {
		chatSocket.off(channelName, onMsgSent);
	  };
	}, [channelName]);

	const {
		data: role,
		isLoading,
		isSuccess,
		isError,
		error
	} = useGetRoleQuery({username, channelName})

	// const fetchUserData = () => {
	// 	fetch("http://localhost:5000/api/chat/role?username=" + username + "&roomName=" + channelName)
	// 		.then(response => {
	// 			return response.text()
	// 		  })
	// 		  .then(data => {
	// 			setRole(data)
	// 		  })
	// 	  }
		
	// 	  useEffect(() => {
	// 		fetchUserData()
	// 	  });

	let content;

	if (isSuccess)
	{
		content = (
			<Messages messages={ messageSent } role={ role.data } channelName={ channelName } />)
	}
	else if (isError)
		return (<p>Error: {error.toString()}</p>)
	else if (isLoading)
		return (<p>Loading...</p>);
		
	return (
		<div className="chat">
			{ content }
			<InputForm username={ username } channelName={ channelName } />
		</div>
	);
}

export default Room;