import React, { KeyboardEvent, SyntheticEvent, useState } from 'react';
import { chatSocket } from '../../chatSocket';

type arg = {
	username: string
	channelName: string
}

export default function Room({ username, channelName }: arg) {
  const [value, setValue] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function send() {
		setMessage('');
		setValue('');
		setIsLoading(true);
		chatSocket.timeout(500).emit('sendMsg', value, () => {
		setIsLoading(false);
	});
  }

  function keyPress(event: KeyboardEvent<HTMLButtonElement>) {
	event.preventDefault();
	if (event.key == 'Enter' && value != '')
		send()
  }

  function onSubmit(event: SyntheticEvent) {
	event.preventDefault();
	if (value != '')
		send();
  }

  function onChange(e: React.FormEvent<HTMLInputElement>)
  {
	setValue('MSG ' + channelName + ' ' + username + ': ' + e.currentTarget.value);
	setMessage(e.currentTarget.value);	
  }

  return (
	<form onSubmit={ onSubmit }>
	  <input value={message} onChange={ onChange } />
	  <button id='message' name='message' type="submit" disabled={ isLoading } onKeyDown={keyPress}>Send</button>
	</form>
  );
}