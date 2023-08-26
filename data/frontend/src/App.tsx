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
import Game from './components/Game/Game';
import { useIsAuthentifiedMutation } from './store/api';
import { Skeleton, Box, Grid, Button, Typography, Avatar, Slide} from '@mui/material';

const theme = createTheme({
	palette: {
		mode: 'dark',
	  	primary: {
			main: '#000000', // Red color
	  	},
	  	secondary: {
			main: '#ff9900', // Orange color
	  	},
	},
  });
function App() {
	const [isProfilOpen, setIsProfilOpen] = useState(false);
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

	const toggleProfil = () => {
  	  setIsProfilOpen(!isProfilOpen);
  	};

	// const [isAuthentified, isError ] = useIsAuthentifiedMutation(user.accessToken);
	// if (!isError)
	// 	return (<p>error</p>)
	function logoutButton(e: SyntheticEvent)
	{
		e.preventDefault();
		dispatch(logout());
		window.location.href = "/";
	}

	return (
	<div className="App">
		<ThemeProvider theme={theme}>
     		<CssBaseline />
			<BrowserRouter>
				<Navigation setDrawerState={setDrawerState}/>
				<NavDrawer state={drawerState} toggleDrawer={toggleDrawer}/>
				<div className='main'>
					<Routes>
						<Route path="/" element={<Login/>}></Route>
						<Route path="/profile" element={<Profile toggleProfil={toggleProfil}/>}></Route>
						<Route path="/home" element={<Home/>}></Route>
						<Route path="/game" element={<Game/>}></Route>
					</Routes>
					{/* {user.isLoggedIn ? <button onClick={logoutButton}>Logout</button> : null} */}
					{user.isLoggedIn ? (<Chat/>) : null}
				</div>
			</BrowserRouter>
	    </ThemeProvider>
	</div>
	);
}

export default App;
