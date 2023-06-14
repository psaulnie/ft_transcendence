import { useEffect } from "react";
import { actionTypes } from "./args.types";

import { useDispatch, useSelector } from "react-redux";
import { removeRoom, changeRole, addRoom } from "../../store/rooms";
import { mute, unmute } from "../../store/user";
import { chatResponseArgs } from "./args.interface";
import { chatSocket } from "../../chatSocket";

export default function ChatProcess({setRoomIndex}: {setRoomIndex: any}) {
	const user = useSelector((state: any) => state.user);
	const rooms = useSelector((state: any) => state.rooms);

	const dispatch = useDispatch();

	useEffect(() => {
		function process(value: chatResponseArgs) {
			if (value.action === actionTypes.kick)
			{
				dispatch(removeRoom(value.source));
				alert("You've been kicked from this channel: " + value.target);
			}
			else if (value.action === actionTypes.ban)
			{
				dispatch(removeRoom(value.source));
				alert("You are banned from this channel: " + value.target);
			}
			else if (value.action === actionTypes.private)
			{
				dispatch(removeRoom(value.source));
				alert("You cannot join this private channel: " + value.target);
			}
			else if (value.action === actionTypes.block)
				alert(value.source + " blocked you");
			else if (value.action === actionTypes.admin)
			{
				dispatch(changeRole({name: value.source, role: "admin", isDirectMsg: false}));
				alert("You are now admin in " + value.source);
			}
			else if (value.action === actionTypes.mute)
			{
				if (value.isMuted === true)
				{
					const time = new Date(value.date);
					dispatch(mute());
					alert("You are muted from this channel: " + value.target);
					setTimeout(() => {
						dispatch(unmute());
					}, time.getMinutes() * 60 * 1000);
					return ;
				}
				dispatch(mute());
				alert("You've been muted from this channel: " + value.target);
				setTimeout(() => {
					dispatch(unmute());
				}, 10 * 60 * 1000);
			}
			else if (value.action === actionTypes.wrongpassword)
			{
				dispatch(removeRoom(value.target))
				alert("Wrong password"); // TODO use a snackbar
			}
			else if (value.action === actionTypes.rightpassword)
			{
				setRoomIndex(rooms.room.length);
			}
		}

		chatSocket.on(user.username + "OPTIONS", process);
		return () => {
			chatSocket.off(user.username + "OPTIONS", process);
		};
	}, [user.username, dispatch]);

	return (null);
}