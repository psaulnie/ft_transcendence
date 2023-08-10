import './App.css';

import React, { SyntheticEvent, useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { logout } from './store/user';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

// Components
import Chat from './components/Chat/Chat';
// import Game from './components/Game/Game';
import Login from './components/Login/Login';
import Navigation from './components/Navigation/Navigation';
import NavDrawer from './components/Navigation/NavDrawer';

import UploadButton from './components/Global/UploadButton';
import Home from './components/Home/Home';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Profile from './components/Global/Profile';

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
		window.location.href = "/";
	}

	return (
	<div className="App">
		<ThemeProvider theme={darkTheme}>
     		<CssBaseline />
			<BrowserRouter>
				<Navigation setDrawerState={setDrawerState}/>
				<NavDrawer state={drawerState} toggleDrawer={toggleDrawer}/>
				<div className='main'>
					<Routes>
						<Route path="/" element={<Login/>}></Route>
						<Route path="/profile" element={<Profile/>}></Route>
						<Route path="/home" element={<Home/>}></Route>
					</Routes>
					{user.isLoggedIn ? (<UploadButton />) : null}
					{user.isLoggedIn ? <button onClick={logoutButton}>Logout</button> : null}
					{user.isLoggedIn ? (<Chat/>) : null}
				</div>
			</BrowserRouter>
	    </ThemeProvider>
	</div>
	);
}

export default App;
