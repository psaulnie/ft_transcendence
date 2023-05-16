import React, { useState, useEffect } from 'react';

import Room from './Room';
import Messages from './Messages';
import InputForm from './InputForm';

import { chatSocket } from '../../chatSocket';

function Chat() {
	// Fetch data to check which channel is joined


	const [username, setUsername] = useState('');

	function onChange(e: React.FormEvent<HTMLInputElement>)
	{
	  setUsername(e.currentTarget.value);
	}
  
	return (
		<div className='chat'>
			<form>
				<input value={username} onChange={ onChange } />
			</form>
			<Room username={username} channelName='general' />
			<Room username={username} channelName='other' />

		</div>
	);
}

export default Chat;