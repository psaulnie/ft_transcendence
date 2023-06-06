import React, { useState, useEffect } from 'react';

import Messages from './Messages';
import InputForm from './InputForm';

import { chatSocket } from '../../chatSocket';
import { chatResponseArgs } from './args.interface';
import { useGetRoleQuery } from '../../store/api';
import { useSelector } from 'react-redux';

function Room({channelName}: {channelName: string}) {
	const user = useSelector((state: any) => state.user);
	const [messageSent, setMsg] = useState<chatResponseArgs[]>([]);
	let content;

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
	} = useGetRoleQuery({username: user.username, channelName: channelName})


	if (isSuccess)
	{
		content = (
			<Messages messages={ messageSent } role={ role.data } channelName={ channelName } />)
	}
	else if (isError) // TODO fix show real error page (make Error component)
		return (<p>Error: {error.toString()}</p>)
	else if (isLoading)
		return (<p>Loading...</p>);
		
	return (
		<div className="chat">
			{ content }
			<InputForm channelName={ channelName } />
		</div>
	);
}

export default Room;