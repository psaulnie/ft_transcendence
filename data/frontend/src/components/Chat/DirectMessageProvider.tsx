import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { chatResponseArgs } from "./args.interface";
import { addMsg, addRoom, setRead } from "../../store/rooms";
import { webSocket } from "../../webSocket";
import { actionTypes } from "./args.types";

export default function DirectMessageProvider() {
	const user = useSelector((state: any) => state.user);
	const rooms = useSelector((state: any) => state.rooms);
	const dispatch = useDispatch();

	useEffect(() => {
		function onMsgSent(value: chatResponseArgs) {
			if (value.action !== actionTypes.left)
			{
				dispatch(addRoom({name: value.source, role: "none",  isDirectMsg: true, hasPassword: false, openTab: false, isMuted: false}))
				dispatch(addMsg({name: value.source, message: value}));
			}
			dispatch(setRead(rooms.index));
		}

		webSocket.on(user.username, onMsgSent);
		return () => {
		  webSocket.off(user.username, onMsgSent);
		};
	  }, [user, dispatch, rooms]);

	return (null);
}