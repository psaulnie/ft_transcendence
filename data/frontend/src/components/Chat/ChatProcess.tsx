import { useEffect, useState } from "react";
import { actionTypes } from "./args.types";

import { useDispatch, useSelector } from "react-redux";
import { removeRoom, changeRole, addRoom } from "../../store/rooms";
import { mute, unmute } from "../../store/user";
import { chatResponseArgs } from "./args.interface";
import { chatSocket } from "../../chatSocket";
import { manageRoomsTypes } from "./args.types";

import { Snackbar, Alert, AlertColor, IconButton, Box } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { accessStatus } from "./accessStatus";

export default function ChatProcess({roomIndex, setRoomIndex}: {roomIndex: number, setRoomIndex: any}) {
	const user = useSelector((state: any) => state.user);
	const rooms = useSelector((state: any) => state.rooms);
	const dispatch = useDispatch();

	const [open, setOpen] = useState(false);
	const [openInvite, setOpenInvite] = useState(false);
	const [message, setMessage] = useState('');
	const [type, setType] = useState<AlertColor>('success');

	const [room, setRoom] = useState('');

	function setSnackbar(message: string, type: AlertColor)
	{
		setMessage(message);
		setType(type);
		setOpen(true);
	}

	function setInviteSnackbar(message: string, type: AlertColor)
	{
		setMessage(message);
		setType(type);
		setOpenInvite(true);
	}

	const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
		if (reason === 'clickaway') {
		  return;
		}
		setOpen(false);
	};

	const handleCloseInvite = (event?: React.SyntheticEvent | Event, reason?: string) => {
		if (reason === 'clickaway') {
		  return;
		}
		setOpenInvite(false);
	};

	function acceptInvite()
	{
		if (room === '')
			return ;
		setOpenInvite(false);
		dispatch(addRoom({name: room, role: 'none', isDirectMsg: false, hasPassword: false}));
		chatSocket.emit('joinPrivateRoom', { roomName: room, username: user.username });
		if (roomIndex === -1)
			setRoomIndex(0);
		else
			setRoomIndex(rooms.room.at(-1));
		setRoom('');
	}

	useEffect(() => {

		function quitRoom(roomName: string)
		{
			if (rooms.room.length === 1)
				setRoomIndex(-1)
			else
				setRoomIndex(0);
			dispatch(removeRoom(roomName));
		}

		function process(value: chatResponseArgs) { // TODO function pointer ?
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
				dispatch(changeRole({name: value.source, role: "admin", isDirectMsg: false, hasPassword: false}));
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
				if (roomIndex === -1)
					setRoomIndex(0);
				else
					setRoomIndex(rooms.room.length);
			}
			else if (value.action === actionTypes.invited)
			{
				setInviteSnackbar("You've been invited in this channel: " + value.source, "info");
				setRoom(value.source);
			}
		}

		chatSocket.on(user.username + "OPTIONS", process);
		return () => {
			chatSocket.off(user.username + "OPTIONS", process);
		};
	}, [user.username, dispatch, rooms, setRoomIndex, roomIndex]);

	return (
		<div>
			<Snackbar open={open} autoHideDuration={5000} anchorOrigin={{vertical: 'top', horizontal: 'right'}} onClose={handleClose} >
				<Alert onClose={handleClose} severity={type} sx={{ width: '100%' }}>
					{message}
				</Alert>
			</Snackbar>
			<Snackbar open={openInvite} autoHideDuration={10000} anchorOrigin={{vertical: 'top', horizontal: 'right'}} onClose={handleCloseInvite}>
				<Box sx={{
					backgroundColor: '#fff',
					color: '#000',
					borderRadius: '10px',
					width: '100%',
					display: 'flex',
					alignItems: 'center',
					flexWrap: 'wrap',
				}}>
					<PeopleAltIcon sx={{color: '#000'}}/>
					{message}
					<IconButton size='small' sx={{color: '#000'}} onClick={acceptInvite}>
						<CheckIcon/>
					</IconButton>
					<IconButton size='small' sx={{color: '#000'}} onClick={handleCloseInvite}>
						<CloseIcon/>
					</IconButton>
				</Box>
				{/* <Alert onClose={handleCloseInvite} severity={type} sx={{ width: '100%' }}> */}
				{/* </Alert> */}
			</Snackbar>
		</div>
	);
}