import './App.css';

import { SyntheticEvent, useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { logout } from './store/user';

// Components
import Chat from './components/Chat/Chat';
// import Game from './components/Game/Game';
import Login from './components/Global/Login';
import Navigation from './components/Navigation/Navigation';
import NavDrawer from './components/Navigation/NavDrawer';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import UploadButton from './components/Global/UploadButton';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
	background: {
		default: '#0A1929'
	}
  },
});
function App() {
	const user = useSelector((state: any) => state.user);
	const dispatch = useDispatch();
	
	const [drawerState, setDrawerState] = useState(false);

	const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
		if (event.type === 'keydown' &&
			((event as React.KeyboardEvent).key === 'Tab' ||
			(event as React.KeyboardEvent).key === 'Shift')) {
			return;
		}
		setDrawerState(open);
    };

	function logoutButton(e: SyntheticEvent)
	{
		e.preventDefault();
		dispatch(logout());
	}

	return (
	<div className="App">
		<ThemeProvider theme={darkTheme}>
     		<CssBaseline />
			<Navigation setDrawerState={setDrawerState}/>
			<NavDrawer state={drawerState} toggleDrawer={toggleDrawer}/>
			<div className='main'>
				{
					user.isLoggedIn === false ?
						<Login />
					: null
				}
				{user.isLoggedIn ? <button onClick={logoutButton}>Logout</button> : null}
				{user.isLoggedIn ? (<UploadButton />) : null}
				{user.isLoggedIn ? (<Chat />) : null}
				{/* {user.isLoggedIn ? (<Game />) : null} */}
			</div>
	    </ThemeProvider>
	</div>
	);
}

export default App;


// ======================

// import image from "./img/UpmostlyLogo.png"; 

// function Component() {
//   return (
//     <div style={{ backgroundImage:`url(${image})`,backgroundRepeat:"no-repeat" }}>