import React, { useState, useEffect } from 'react';


// Chat need to return 
function Main() {
	const [users, setUsers] = useState('')

	const fetchUserData = () => {
	  fetch("http://10.19.248.89:5000/users?name=pierrotswag")
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