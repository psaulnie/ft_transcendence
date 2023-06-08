import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface roomType {
	name: string,
	role: string
}

interface RoomsState {
	room: roomType[]
};

const initialUser: RoomsState = localStorage.getItem('rooms') ? JSON.parse(localStorage.getItem('rooms') || '{}') : { room: [] }; // TODO maybe add to localstorage

const initialState: RoomsState = {
	room: initialUser.room
};

export const roomsSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
	addRoom: (state, action: PayloadAction<roomType>) => {
		if (!state.room.find((obj: roomType) => obj.name === action.payload.name))
			state.room.push(action.payload);
	},
	removeRoom: (state, action: PayloadAction<string>) => {
		state.room = state.room.filter((element) => element.name !== action.payload);
	},
	changeRole: (state, action: PayloadAction<roomType>) => {
		let room = state.room.find((obj: roomType) => obj.name === action.payload.name);
		if (room)
			room.role = action.payload.role;
	},
	quitAll: (state) => {
		state.room = [];
	},
  },
})

export const { addRoom, removeRoom, changeRole, quitAll } = roomsSlice.actions
export default roomsSlice.reducer