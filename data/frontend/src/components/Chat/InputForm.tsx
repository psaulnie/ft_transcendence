import React, { KeyboardEvent, SyntheticEvent, useState } from 'react';
import { chatSocket } from '../../chatSocket';
import { sendMsgArgs } from './args.interface';
import { sendMsgTypes } from './args.types';

type arg = {
	username: string
	channelName: string
}

export default function Room({ username, channelName }: arg) {
  const [value, setValue] = useState<sendMsgArgs>({ type: sendMsgTypes.msg, source: username, target: channelName, data: ''});
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function send() {
		setMessage('');
		setValue({ type: sendMsgTypes.msg, source: username, target: channelName, data: ''});
		setIsLoading(true);
		chatSocket.timeout(500).emit('sendMsg', value, () => {
		setIsLoading(false);
	});
  }

  function keyPress(event: KeyboardEvent<HTMLButtonElement>) {
	event.preventDefault();
	if (event.key == 'Enter' && value.data != '')
		send();
  }

  function onSubmit(event: SyntheticEvent) {
	event.preventDefault();
	if (value.data != '')
		send();
  }

  function onChange(e: React.FormEvent<HTMLInputElement>)
  {
	setValue({ type: sendMsgTypes.msg, source: username, target: channelName, data: e.currentTarget.value });
	setMessage(e.currentTarget.value);	
  }

  return (
	<form onSubmit={ onSubmit }>
	  <input value={message} onChange={ onChange } />
	  <button id='message' name='message' type="submit" disabled={ isLoading } onKeyDown={keyPress}>Send</button>
	</form>
  );
}