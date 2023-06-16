import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserState {
	username: string
	isLoggedIn: boolean
	isUserBlocked: boolean
	blockedUsers: string[]
	isMuted: boolean
	mutedTime: Date
};

const initialUser: UserState = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : { 
	username: "",
	isLoggedIn: false,
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
	isMuted: initialUser.isMuted,
	mutedTime: initialUser.mutedTime
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
	login: (state) => {
		state.isLoggedIn = true;
		state.blockedUsers = [];
		localStorage.setItem('user', JSON.stringify(state))
	},
	logout: (state) => {
		state.username = "";
		state.isLoggedIn = false;
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
		state.blockedUsers.filter(function(item) {
			return item !== action.payload
		})
	},
	isUserBlocked: (state) => {
		const nbr = state.blockedUsers.indexOf(state.username);
		if (nbr === -1)
			state.isUserBlocked = false;
		else
			state.isUserBlocked = true;
	},
	mute: (state) => {
		state.isMuted = true;
		state.mutedTime = new Date();
	},
	unmute: (state) => {
		state.isMuted = false;
	},
  },
})

export const { login, logout, setUsername, addBlockedUser, removeBlockedUser, isUserBlocked, mute, unmute } = userSlice.actions
export default userSlice.reducer