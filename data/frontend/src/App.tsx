import './App.css';

import { SyntheticEvent, useState } from 'react';
// Components
import Navigation from './components/Navigation/Navigation';
import Chat from './components/Chat/Chat';

function App() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [showChat, setShowChat] = useState(false);
	const [apiToken, setApiToken] = useState('');

	const signInRequestOptions = {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ username: username, password: password })
	};

	const profileRequestOptions = {
		headers: { 'Authorization': `Bearer ${apiToken}` }
	};

	//Get Method
	const apiGet = () => {
		fetch("http://localhost:5000/auth/login", signInRequestOptions)
			.then((response) => response.json())
			.then((json) => {
				console.log(json);
				setApiToken(json.access_token);
			});
	};

	const apiGetProfile = () => {
		console.log(profileRequestOptions)
		fetch("http://localhost:5000/profile", profileRequestOptions)
			.then((response) => response.json())
			.then((json) => {
				console.log(json);
			});
	};

	function onUsernameChange(e: React.FormEvent<HTMLInputElement>) {
		e.preventDefault();
		setUsername(e.currentTarget.value);
	}

	function onPasswordChange(e: React.FormEvent<HTMLInputElement>) {
		e.preventDefault();
		setPassword(e.currentTarget.value);
	}

	function onSubmit(e: SyntheticEvent) {
		e.preventDefault();
		if (username != '')
			setShowChat(true);
	}

	function signIn(e: SyntheticEvent) {
		e.preventDefault();
		apiGet();
	}

	function logIn(e: SyntheticEvent) {
		e.preventDefault();
		apiGetProfile();
	}

	return (
		<div className="App"> {/* TODO rename */}
			<Navigation />
			<div className='main'>
				<form>
					<input value={username} onChange={onUsernameChange} />
					<input value={password} onChange={onPasswordChange} />
					<button onClick={signIn}>SignIn</button>
					<button onClick={logIn}>LogIn</button>
				</form>

				{
					showChat ? (<Chat username={username} />) : ''
				}
				{/* TODO add Game component*/}
			</div>
		</div>
	);
}

export default App;
