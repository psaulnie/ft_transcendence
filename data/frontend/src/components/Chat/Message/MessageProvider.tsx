import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { chatResponseArgs } from "../args.interface";
import { addMsg } from "../../../store/rooms";
import { chatSocket } from "../../../chatSocket";

function MessageProvider({roomName}: {roomName: string}) {
	const user = useSelector((state: any) => state.user);
	const rooms = useSelector((state: any) => state.rooms);
	const dispatch = useDispatch();

	
	useEffect(() => {
		function onMsgSent(value: chatResponseArgs) {
			dispatch(addMsg({name: roomName, message: value}));
		}
		
		let currentRoom = rooms.room.find(((obj: any) => obj.name === roomName));
		let listener = roomName;

		if (currentRoom.isDirectMessage === true)
			listener = roomName + user.username;
		chatSocket.on(listener, onMsgSent);
		return () => {
		  chatSocket.off(listener, onMsgSent);
		};
	  }, [roomName, dispatch]);

	return (null);
}

export default MessageProvider;