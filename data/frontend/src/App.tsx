import './App.css';

import { SyntheticEvent, useState } from 'react';
// Components
import Navigation from './components/Navigation/Navigation';
import Chat from './components/Chat/Chat';

function App() {
	const [username, setUsername] = useState('');
	const [showChat, setShowChat] = useState(false);

	function onChange(e: React.FormEvent<HTMLInputElement>)
	{
		e.preventDefault();
		setUsername(e.currentTarget.value);
	}

	function onSubmit(e: SyntheticEvent)
	{
		e.preventDefault();
		if (username !== '')
			setShowChat(true);
	}

	return (
	<div className="App"> {/* TODO rename */}
		<Navigation />
		<div className='main'>
			<form onSubmit={onSubmit}>
				<p>Username:</p>
				<input value={username} onChange={ onChange } />
				<button>Submit</button>
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
