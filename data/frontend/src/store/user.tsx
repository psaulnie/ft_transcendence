import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import Cookies from 'js-cookie'

interface UserState {
	username: string
	isLoggedIn: boolean
	accessToken: string
	isUserBlocked: boolean
	blockedUsers: string[]
};

const initialUser: UserState = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : { 
	username: "",
	isLoggedIn: false,
	accessToken: "",
	isUserBlocked: false,
	blockedUsers: [],
	isMuted: false,
	mutedTime: null
 };

const initialState: UserState = {
	username: initialUser.username,
	isLoggedIn: initialUser.isLoggedIn,
	isUserBlocked: initialUser.isUserBlocked,
	blockedUsers: initialUser.blockedUsers,
	accessToken: initialUser.accessToken,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
	login: (state, action: PayloadAction<string>) => {
		state.isLoggedIn = true;
		state.blockedUsers = [];
		state.accessToken = action.payload;
		localStorage.setItem('user', JSON.stringify(state))
	},
	logout: (state) => {
		state.username = "";
		state.isLoggedIn = false;
		Cookies.remove('accessToken');
		Cookies.remove('username');
		localStorage.removeItem('user');
	},
	setUsername: (state, action: PayloadAction<string>) => {
		state.username = action.payload;
	},
	addBlockedUser: (state, action: PayloadAction<string>) => {
		const nbr = state.blockedUsers.indexOf(action.payload);
		if (nbr === -1)
			state.blockedUsers.push(action.payload);
	},
	removeBlockedUser: (state, action: PayloadAction<string>) => {
		const index = state.blockedUsers.indexOf(action.payload);
		if (index !== -1)
			state.blockedUsers.splice(index, 1);
	},
	isUserBlocked: (state) => {
		const nbr = state.blockedUsers.indexOf(state.username);
		if (nbr === -1)
			state.isUserBlocked = false;
		else
			state.isUserBlocked = true;
	},
  },
})

export const { login, logout, setUsername, addBlockedUser, removeBlockedUser, isUserBlocked} = userSlice.actions
export default userSlice.reducer