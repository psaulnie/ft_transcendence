import { io } from 'socket.io-client';
import { useState } from 'react';

function Message() {

	const [message, setMessage] = useState('');
	const socket = io("http://localhost:5000");

	socket.on('connect', function() {
		  console.log('Connected');
	});
	
	socket.on('msgToClient', function(data) {
		console.log('Receive:' + data);
	  });

  const sendMsg = () => {
      console.log("Send: " + message);
      socket.emit("msgToServer", message);
    };

    function handleChange(new_msg: any) {
      setMessage(new_msg.target.value);
    };
	return (
		<div className='chat'>
			<input value={message} onChange={handleChange} placeholder='Send messages here'></input>
			<button onClick={sendMsg}>Send</button>
			<p>{message}</p>
		</div>
	)
}

export default Message;