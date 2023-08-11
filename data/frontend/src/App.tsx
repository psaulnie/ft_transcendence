import './App.css';

import React, { SyntheticEvent, useState } from 'react';
import { useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { logout, login, setUsername } from './store/user';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Cookies from 'js-cookie';

// Components
import Chat from './components/Chat/Chat';
// import Game from './components/Game/Game';
import Login from './components/Login/Login';
import Navigation from './components/Navigation/Navigation';
import NavDrawer from './components/Navigation/NavDrawer';

import Home from './components/Home/Home';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import PrivateRoute from './components/Global/PrivateRoute';

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
	const user = useSelector((state: any) => state.user);
	const dispatch = useDispatch();
	// const navigate = useNavigate();

	const [drawerState, setDrawerState] = useState(false);
	// const [authenticated, setAuthenticated] = useState(false);

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
		// redirect('/');
		window.location.href = "/";
	}

    useEffect(() => {
        const username = Cookies.get('username');
        const accessToken = Cookies.get('accessToken');
        if (!username || !accessToken)
            return; // TODO
        dispatch(setUsername(username));
        dispatch(login(accessToken));
    }, [dispatch]);

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
							{/* <Route path="/profile" element={<Profile/>}></Route> */}
							<Route path="/home" element={<PrivateRoute />}>
								<Route path="/home" element={<Home/>}></Route>
							</Route>
						</Routes>
						{user.isLoggedIn ? <button onClick={logoutButton}>Logout</button> : null}
						{user.isLoggedIn ? (<Chat/>) : null}
					</div>
				</BrowserRouter>
			</ThemeProvider>
		</div>
	);
}

export default App;
