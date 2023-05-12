import React, { KeyboardEvent, SyntheticEvent, useState } from 'react';
import { socket } from '../../socket';


export default function InputForm() {
  const [value, setValue] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function keyPress(event: KeyboardEvent<HTMLButtonElement>) {
	event.preventDefault();
	if (event.key == 'Enter')
	{
		setMessage('');
		setIsLoading(true);
		socket.timeout(1000).emit('sendMsg', value, () => {
		  setIsLoading(false);
		});		
	}
  }

  function onSubmit(event: SyntheticEvent) {
	setMessage('');
    event.preventDefault();
    setIsLoading(true);

    socket.timeout(1000).emit('sendMsg', value, () => {
      setIsLoading(false);
    });
  }

  function onChange(e: React.FormEvent<HTMLInputElement>)
  {
	setValue(e.currentTarget.value);
	setMessage(e.currentTarget.value);	
  }

  return (
    <form onSubmit={ onSubmit }>
      <input value={message} onChange={ onChange } />

      <button id='message' name='message' type="submit" disabled={ isLoading } onKeyDown={keyPress}>Send</button>
    </form>
  );
}