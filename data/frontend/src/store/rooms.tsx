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
		let index = state.room.indexOf(action.payload);

		state.room[index] = action.payload;
	},
  },
})

export const { addRoom, removeRoom, changeRole } = roomsSlice.actions
export default roomsSlice.reducer