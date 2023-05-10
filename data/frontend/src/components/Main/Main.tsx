import { useState, useEffect } from 'react';

import Message from './../Chat/Message'
import * as SocketIOClient from 'socket.io-client';

function Main() {
	const [users, setUsers] = useState('')

	const fetchUserData = () => {
	  fetch("http://localhost:5000/users?name=pierrotswag")
		.then(response => {
		  return response.text()
		})
		.then(data => {
		  setUsers(data)
		})
	}
  
	useEffect(() => {
	  fetchUserData()
	}, [])

	return (
		<div className="main">
			<div id="pong-game">
				Pong game
			</div>
			<div className="chat">
				<Message />
				<p>{users}: Oe oe oe</p>
			</div>
		</div>
	)
}

export default Main;