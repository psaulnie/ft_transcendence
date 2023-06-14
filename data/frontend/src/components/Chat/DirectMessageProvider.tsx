import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { chatResponseArgs } from "./args.interface";
import { addMsg, addRoom, setRead } from "../../store/rooms";
import { chatSocket } from "../../chatSocket";
import { actionTypes } from "./args.types";

export default function DirectMessageProvider({roomIndex, setRoomIndex}: {roomIndex: number, setRoomIndex: any}) {
	const user = useSelector((state: any) => state.user);
	const rooms = useSelector((state: any) => state.rooms);
	const dispatch = useDispatch();

	useEffect(() => {
		function onMsgSent(value: chatResponseArgs) {
			dispatch(addRoom({name: value.source, role: "none",  isDirectMsg: true}))
			if (roomIndex === -1)
			{
				setRoomIndex(0);
				dispatch(setRead(0));
			}
			dispatch(addMsg({name: value.source, message: value}));
		}

		chatSocket.on(user.username, onMsgSent);
		return () => {
		  chatSocket.off(user.username, onMsgSent);
		};
	  }, [user, dispatch, roomIndex, rooms, setRoomIndex]);

	return (null);
}