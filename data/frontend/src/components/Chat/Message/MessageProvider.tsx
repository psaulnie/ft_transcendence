import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { chatResponseArgs } from "../args.interface";
import { addMsg } from "../../../store/rooms";
import { chatSocket } from "../../../chatSocket";

function MessageProvider({roomName}: {roomName: string}) {
	const rooms = useSelector((state: any) => state.rooms);
	const dispatch = useDispatch();

	useEffect(() => {
		function onMsgSent(value: chatResponseArgs) {
		//   setMsg(previous => [...previous, value]);
			dispatch(addMsg({name: roomName, message: value}));
		}
	  
		chatSocket.on(roomName, onMsgSent);
		return () => {
		  chatSocket.off(roomName, onMsgSent);
		};
	  }, [roomName]);

	return (
		null
	);
}

export default MessageProvider;