import React, { KeyboardEvent, SyntheticEvent, useState } from 'react';
import { chatSocket } from '../../../chatSocket';
import { sendMsgArgs } from '../args.interface';
import { sendMsgTypes } from '../args.types';
import { useSelector } from 'react-redux';

export default function Room({channelName}: {channelName: string}) {
	const user = useSelector((state: any) => state.user);
	const [value, setValue] = useState<sendMsgArgs>({ type: sendMsgTypes.msg, source: user.username, target: channelName, data: ''});
	const [message, setMessage] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	function send() {
		setMessage('');
		setValue({ type: sendMsgTypes.msg, source: user.username, target: channelName, data: ''});
		setIsLoading(true);
		chatSocket.timeout(500).emit('sendMsg', value, () => {
			setIsLoading(false);
		});
	}

	function keyPress(event: KeyboardEvent<HTMLButtonElement>) {
	event.preventDefault();
	if (event.key ==='Enter' && value.data !== '')
		send();
	}

	function onSubmit(event: SyntheticEvent) {
	event.preventDefault();
	if (value.data !== '')
		send();
	}

	function onChange(e: React.FormEvent<HTMLInputElement>)
	{
		if (e.currentTarget.value.length <= 255)
		{
			setValue({ type: sendMsgTypes.msg, source: user.username, target: channelName, data: e.currentTarget.value });
			setMessage(e.currentTarget.value);	
		}
	}

	return (
		<form onSubmit={ onSubmit }>
			<input maxLength={255} value={message} onChange={ onChange } disabled={user.isMuted} />
			<button id='message' name='message' type="submit" disabled={ isLoading || user.isMuted } onKeyDown={keyPress}>Send</button>
		</form>
	);
}