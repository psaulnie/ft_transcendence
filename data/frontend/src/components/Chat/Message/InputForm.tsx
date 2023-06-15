import React, { KeyboardEvent, SyntheticEvent, useState } from 'react';
import { chatSocket } from '../../../chatSocket';
import { sendMsgArgs } from '../args.interface';
import { sendMsgTypes } from '../args.types';
import { useSelector } from 'react-redux';

import { Button, Grid, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

export default function Room({channelName, isDirectMessage}: {channelName: string, isDirectMessage: boolean}) {
	const user = useSelector((state: any) => state.user);

	const [value, setValue] = useState<sendMsgArgs>({ type: sendMsgTypes.msg, source: user.username, target: channelName, data: '', isDirectMessage: isDirectMessage});
	const [message, setMessage] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	function send() {
		setMessage('');
		setValue({ type: sendMsgTypes.msg, source: user.username, target: channelName, data: '', isDirectMessage: isDirectMessage});
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

	function onChange(e: any)
	{
		if (e.target.value.length <= 255)
		{
			setValue({ type: sendMsgTypes.msg, source: user.username, target: channelName, data: e.target.value, isDirectMessage: isDirectMessage });
			setMessage(e.target.value);	
		}
	}

	return (
		<form onSubmit={onSubmit}>
			<Grid container justifyContent='center' alignItems='center'>
					<Grid item xs={10} >
						<TextField fullWidth value={message} onChange={onChange} disabled={user.isMuted}/> {/* TODO character limit */}
					</Grid>
					<Grid item xs={2}>
						<Button variant='contained' name='message' type="submit"
								disabled={ isLoading || user.isMuted } onKeyDown={keyPress}
								endIcon={<SendIcon />}>Send</Button>
					</Grid>
			</Grid>
		</form>
	);
}