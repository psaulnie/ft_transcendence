import './App.css';

import { SyntheticEvent, useState } from 'react';
// Components
import Navigation from './components/Navigation/Navigation';

function App() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [apiToken, setApiToken] = useState('');

	const signInRequestOptions = {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ username: username, password: password })
	};

	const profileRequestOptions = {
		headers: { 'Authorization': `Bearer ${apiToken}` }
	};

	const apiGet = () => {
		fetch("http://localhost:5000/auth/login", signInRequestOptions)
			.then((response) => response.json())
			.then((json) => {
				console.log(json);
				setApiToken(json.access_token);
			});
	};

	// const apiSignIn = () => {
	async function apiSignIn() {
		try {
			await fetch("http://localhost:5000/auth/signIn", signInRequestOptions)
				.then(response => response.json())
				.then((json) => {
					if (json.statusCode) {
						throw new Error('bad password');
					}
					console.log("Successfully logged");
					console.log('JSON ', json);
					console.log(json.user);
				});
		}
		catch (e) {
			console.log('Error from apiSignIn: ', e);
		}
	}

	const apiGetProfile = () => {
		console.log(profileRequestOptions)
		fetch("http://localhost:5000/profile", profileRequestOptions)
			.then((json) => {
				console.log(json);
			});
	};

	// async function apiLogInIntra() {
	// 	try {
	// 		await fetch("http://localhost:5000/auth/intra", signInRequestOptions)
	// 			.then(response => response.json())
	// 			.then((json) => {
	// 				if (json.statusCode) {
	// 					throw new Error('bad password');
	// 				}
	// 				console.log("Successfully logged");
	// 				console.log('JSON ', json);
	// 				console.log(json.user);
	// 			});
	// 	}
	// 	catch (e) {
	// 		console.log('Error from apiSignIn: ', e);
	// 	}
	// }
	//
	function onUsernameChange(e: React.FormEvent<HTMLInputElement>) {
		e.preventDefault();
		setUsername(e.currentTarget.value);
	}

	function onPasswordChange(e: React.FormEvent<HTMLInputElement>) {
		e.preventDefault();
		setPassword(e.currentTarget.value);
	}

	function signIn(e: SyntheticEvent) {
		e.preventDefault();
		apiSignIn();
	}

	function logIn(e: SyntheticEvent) {
		e.preventDefault();
		apiGet();
		// apiGetProfile();
	}

	function intraLogIn(e: SyntheticEvent) {
		e.preventDefault();
		apiLogInIntra();
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
					<button onClick={intraLogIn}>Intra login</button>
				</form>
				{/* TODO add Game component*/}
			</div>
		</div>
	);
}

export default App;
