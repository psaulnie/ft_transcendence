import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { chatResponseArgs } from "../args.interface";
import { addMsg } from "../../../store/rooms";
import { chatSocket } from "../../../chatSocket";

function MessageProvider({roomName}: {roomName: string}) {
	const dispatch = useDispatch();

	useEffect(() => {
		function onMsgSent(value: chatResponseArgs) {
			dispatch(addMsg({name: roomName, message: value}));
		}
	  
		chatSocket.on(roomName, onMsgSent);
		return () => {
		  chatSocket.off(roomName, onMsgSent);
		};
	  }, [roomName, dispatch]);

	return (null);
}

export default MessageProvider;