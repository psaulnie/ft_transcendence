import './App.css';

import { SyntheticEvent } from 'react';
// Components
import Navigation from './components/Navigation/Navigation';
import Chat from './components/Chat/Chat';
import { useSelector, useDispatch } from 'react-redux';
import { login, logout, setUsername } from './store/user';

function App() {
	const user = useSelector((state: any) => state.user);
	const dispatch = useDispatch();

	function onChange(e: React.ChangeEvent<HTMLInputElement>)
	{
		e.preventDefault();
		dispatch(setUsername(e.currentTarget.value));
	}

	function onSubmit(e: React.FormEvent)
	{
		e.preventDefault();
		if (user.username !== '')
			dispatch(login());
	}

	function logoutButton(e: SyntheticEvent)
	{
		e.preventDefault();
		dispatch(logout());
	}

	return (
	<div className="App">
		<Navigation />
		<div className='main'>
			<form onSubmit={onSubmit}>
				<p>Username:</p>
				<input name="username" value={user.username || ''} onChange={ onChange } />
				<button>Login</button>
			</form>
			{user.isLoggedIn ? <button onClick={logoutButton}>Logout</button> : null}
			{user.isLoggedIn ? (<Chat />) : null}
		</div>
	</div>
	);
}

export default App;
