import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { chatResponseArgs } from '../components/Chat/args.interface';

export interface roomType {
	name: string,
	role: string,
	isDirectMsg: boolean
}

interface roomInterface {
	name: string,
	role: string,
	isDirectMsg: boolean,
	messages: chatResponseArgs[],
	unread: boolean
}

interface RoomsState {
	room: roomInterface[]
};

const initialUser: RoomsState = localStorage.getItem('rooms') ? JSON.parse(localStorage.getItem('rooms') || '{ room: [] }') : { room: [] }; // TODO maybe add to localstorage

const initialState: RoomsState = {
	room: initialUser.room
};

export const roomsSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
	addRoom: (state, action: PayloadAction<roomType>) => {
		const room = state.room.find((obj: roomType) => obj.name === action.payload.name);

		if (!room)
			state.room.push({name: action.payload.name, role: action.payload.role, isDirectMsg: action.payload.isDirectMsg,
								messages: [], unread: false});
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
	addMsg: (state, action: PayloadAction<{name: string, message: chatResponseArgs}>) => {
		const roomIndex = state.room.findIndex((obj: roomType) => obj.name === action.payload.name);
		if (roomIndex !== -1)
		{
			state.room[roomIndex].messages.push(action.payload.message);
			state.room[roomIndex].unread = true;
		}
		else
		{
			state.room.push({
				name: action.payload.name,
				role: "none",
				isDirectMsg: true,
				messages: [action.payload.message],
				unread: true
			});
		}
	},
	setRead: (state, action: PayloadAction<number>) => {
		if (state.room[action.payload])
			state.room[action.payload].unread = false;
	},
  },
})

export const { addRoom, removeRoom, changeRole, quitAll, addMsg, setRead } = roomsSlice.actions
export default roomsSlice.reducer