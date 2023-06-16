import { useEffect, useState } from "react";
import { actionTypes } from "./args.types";

import { useDispatch, useSelector } from "react-redux";
import { removeRoom, changeRole } from "../../store/rooms";
import { mute, unmute } from "../../store/user";
import { chatResponseArgs } from "./args.interface";
import { chatSocket } from "../../chatSocket";

import { Snackbar, Alert, AlertColor } from "@mui/material";

export default function ChatProcess({roomIndex, setRoomIndex}: {roomIndex: number, setRoomIndex: any}) {
	const user = useSelector((state: any) => state.user);
	const rooms = useSelector((state: any) => state.rooms);
	const dispatch = useDispatch();

	const [open, setOpen] = useState(false);
	const [message, setMessage] = useState('');
	const [type, setType] = useState<AlertColor>('success');

	function setSnackbar(message: string, type: AlertColor)
	{
		setMessage(message);
		setType(type);
		setOpen(true);
	}

	const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
		if (reason === 'clickaway') {
		  return;
		}
		setOpen(false);
	};

	useEffect(() => {

		function quitRoom(roomName: string)
		{
			if (rooms.room.length === 1)
				setRoomIndex(-1)
			else
				setRoomIndex(0);
			dispatch(removeRoom(roomName));
		}

		function process(value: chatResponseArgs) {
			if (value.action === actionTypes.kick)
			{
				quitRoom(value.target);
				setSnackbar("You've been kicked from this channel: " + value.target, "error");
			}
			else if (value.action === actionTypes.ban)
			{
				quitRoom(value.target);
				setSnackbar("You are banned from this channel: " + value.target, "error");
			}
			else if (value.action === actionTypes.private)
			{
				quitRoom(value.target);
				setSnackbar("You cannot join this private channel: " + value.target, "error");
			}
			else if (value.action === actionTypes.block)
				setSnackbar(value.source + " blocked you", "warning");
			else if (value.action === actionTypes.admin)
			{
				dispatch(changeRole({name: value.source, role: "admin", isDirectMsg: false}));
				setSnackbar("You are now admin in " + value.source, "success");
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
				setSnackbar("You've been muted from this channel: " + value.target, "error")
				setTimeout(() => {
					dispatch(unmute());
				}, 10 * 60 * 1000);
			}
			else if (value.action === actionTypes.wrongpassword)
			{
				dispatch(removeRoom(value.target))
				setSnackbar("Wrong password", "error");
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
	}, [user.username, dispatch, rooms, setRoomIndex, roomIndex]);

	return (
		<Snackbar open={open} autoHideDuration={5000} anchorOrigin={{vertical: 'top', horizontal: 'right'}} onClose={handleClose} >
			<Alert onClose={handleClose} severity={type} sx={{ width: '100%' }}>
				{message}
 			</Alert>
		</Snackbar>
	);
}