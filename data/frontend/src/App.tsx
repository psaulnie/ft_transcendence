import './App.css';

import { SyntheticEvent, useState } from 'react';
// Components
import Navigation from './components/Navigation/Navigation';
import Chat from './components/Chat/Chat';
import { useSelector, useDispatch } from 'react-redux';
import { login, logout, setUsername } from './store/user';

function App() {
	const user = useSelector((state: any) => state.user);
	const dispatch = useDispatch();

	// const [showChat, setShowChat] = useState(false);

	function onChange(e: React.ChangeEvent<HTMLInputElement>)
	{
		e.preventDefault();
		dispatch(setUsername(e.currentTarget.value));
		console.log(user.tmpUsername);
		// setUsername(e.currentTarget.value);
	}

	function onSubmit(e: SyntheticEvent)
	{
		e.preventDefault();
		if (user.tmpUsername !== '')
			dispatch(login());
	}

	return (
	<div className="App"> {/* TODO rename */}
		<Navigation />
		<div className='main'>
			<form onSubmit={onSubmit}>
				<p>Username:</p>
				<input value={user.tmpUsername || ''} onChange={ onChange } />
				<button>Login</button>
			</form>
			{
				user.isLoggedIn ? (<Chat username={user.username} />) : ''
			}
		</div>
	</div>
	);
}

export default App;
