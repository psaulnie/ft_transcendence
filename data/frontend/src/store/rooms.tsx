import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { chatResponseArgs } from '../components/Chat/args.interface';

export interface roomType {
	name: string,
	role: string,
	isDirectMsg: boolean,
	hasPassword: boolean
}

interface roomInterface {
	name: string,
	role: string,
	isDirectMsg: boolean,
	messages: chatResponseArgs[],
	unread: boolean,
	hasPassword: boolean
}

interface RoomsState {
	room: roomInterface[]
	index: number
};

const initialUser: RoomsState = localStorage.getItem('rooms') ? JSON.parse(localStorage.getItem('rooms') || '{ room: [], index: -1 }') : { room: [], index: -1 }; // TODO maybe add to localstorage

const initialState: RoomsState = {
	room: initialUser.room,
	index: initialUser.index
};

export const roomsSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
	addRoom: (state, action: PayloadAction<{
		name: string,
		role: string,
		isDirectMsg: boolean,
		hasPassword: boolean,
		openTab: boolean
	}>) => {
		const room = state.room.find((obj: roomType) => obj.name === action.payload.name);

		if (!room)
		{
			state.room.push({name: action.payload.name, role: action.payload.role, isDirectMsg: action.payload.isDirectMsg,
								messages: [], unread: false, hasPassword: action.payload.hasPassword});
			if (action.payload.openTab)
				state.index++;
		}
	},
	removeRoom: (state, action: PayloadAction<string>) => {
		state.room = state.room.filter((element) => element.name !== action.payload);
		if (state.room.length === 0)
			state.index = -1;
		else
			state.index--;
	},
	changeRole: (state, action: PayloadAction<roomType>) => {
		let room = state.room.find((obj: roomType) => obj.name === action.payload.name);
		if (room)
			room.role = action.payload.role;
	},
	quitAll: (state) => {
		state.room = [];
		state.index--;
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
				unread: true,
				hasPassword: false
			});
		}
	},
	setRead: (state, action: PayloadAction<number>) => {
		if (state.room[action.payload])
			state.room[action.payload].unread = false;
	},
	setHasPassword: (state, action: PayloadAction<{index: number, value: boolean}>) => {
		if (state.room[action.payload.index])
			state.room[action.payload.index].hasPassword = action.payload.value;
	},
	setRoomIndex: (state, action: PayloadAction<number>) => {
		if (action.payload >= 0 || action.payload <= state.index)
			state.index = action.payload;
	}
  },
})

export const { addRoom, removeRoom, changeRole, quitAll, addMsg, setRead, setHasPassword, setRoomIndex } = roomsSlice.actions
export default roomsSlice.reducer