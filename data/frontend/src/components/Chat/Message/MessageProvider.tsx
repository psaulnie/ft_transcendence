import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { chatResponseArgs } from "../args.interface";
import { addMsg, addRoom, addUser, removeUser, setHasPassword, setRead } from "../../../store/rooms";
import { chatSocket } from "../../../chatSocket";
import { actionTypes } from "../args.types";

function MessageProvider({roomName}: {roomName: string}) {
	const user = useSelector((state: any) => state.user);
	const rooms = useSelector((state: any) => state.rooms);
	const dispatch = useDispatch();

	
	
	useEffect(() => {
		function onMsgSent(value: chatResponseArgs) {
			let roomIndex = rooms.room.findIndex(((obj: any) => obj.name === roomName));

			if (value.action === actionTypes.hasPassword)
				dispatch(setHasPassword({index: roomIndex, value: true}));
			else if (value.action === actionTypes.noPassword)
				dispatch(setHasPassword({index: roomIndex, value: false}));
			else
			{
				if (value.action === actionTypes.join)
					dispatch(addUser({roomName: roomName, username: value.source, role: value.role}));
				else if (value.action === actionTypes.left)
					dispatch(removeUser({roomName: roomName, username: value.source}));
				dispatch(addMsg({name: roomName, message: value}));
				if (value.source === user.username || rooms.index === roomIndex)
				{
					dispatch(setRead(roomIndex));
				}
				if (rooms.room[roomIndex] && rooms.room[roomIndex].isDirectMessage === true)
					dispatch(addRoom({name: value.source, role: "none",  isDirectMsg: true, hasPassword: false, openTab: false}));
			}
		}
		
		let currentRoom = rooms.room.find(((obj: any) => obj.name === roomName));
		let listener = roomName;
		
		if (currentRoom.isDirectMessage === true)
			listener = roomName + user.username;
		chatSocket.on(listener, onMsgSent);
		return () => {
		  chatSocket.off(listener, onMsgSent);
		};
	  }, [roomName, dispatch, rooms, user]);

	return (null);
}

export default MessageProvider;