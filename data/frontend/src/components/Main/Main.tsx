import React, { useState, useEffect } from 'react';


// Chat need to return 
function Main() {
	const [users, setUsers] = useState('')

	const fetchUserData = () => {
	  fetch("http://localhost:5000/users?name=piertswag")
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
				<p>{users}: Oe oe oe</p>
			</div>
		</div>
	)
}

export default Main;