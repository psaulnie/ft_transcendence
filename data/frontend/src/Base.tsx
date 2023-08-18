import { useEffect, useState } from "react";
import { SyntheticEvent } from "react";

import { Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "./store/user";

import Navigation from "./components/Navigation/Navigation";
import NavDrawer from "./components/Navigation/NavDrawer";
import Home from "./components/Home/Home";
import Chat from "./components/Chat/Chat";

export default function Base() {
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
		window.location.href = "/login";
	}

	return (
		<div className='main'>
			<Navigation setDrawerState={setDrawerState}/>
			<NavDrawer state={drawerState} toggleDrawer={toggleDrawer}/>
			<Routes>
				<Route path="/home" element={<Home/>}></Route>
			</Routes>
			<button onClick={logoutButton}>Logout</button>
			<Chat/>
		</div>
	);
}