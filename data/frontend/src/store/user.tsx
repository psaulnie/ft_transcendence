import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserState {
	tmpUsername: string
	username: string
	isLoggedIn: boolean
}

const initialUser: UserState = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : { tmpUsername: "", username: "", isLoggedIn: false }

const initialState: UserState = {
	tmpUsername: initialUser.tmpUsername,
	username: initialUser.username,
	isLoggedIn: initialUser.isLoggedIn
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
	login: (state) => {
		state.username = state.tmpUsername;
		state.isLoggedIn = true;
		localStorage.setItem('user', JSON.stringify(state))
	},
	logout: (state) => {
		state.username = "";
		state.isLoggedIn = false;
		localStorage.removeItem('user');
	},
	setUsername: (state, action: PayloadAction<string>) => {
		state.tmpUsername = action.payload;
	}
  },
})

export const { login, logout, setUsername } = userSlice.actions
export default userSlice.reducer