import { chatSocket } from '../../../chatSocket';
import { chatResponseArgs } from '../args.interface';
import { useDispatch, useSelector } from 'react-redux';
import { addBlockedUser } from '../../../store/user';
import { Menu, MenuItem, Divider } from '@mui/material';
import { addRoom } from '../../../store/rooms';

type arg = {
	message: chatResponseArgs,
	role: string,
	channelName: string,
	contextMenu: any,
	setContextMenu: any,
	handleContextMenu: any
}

export default function UserOptionsMenu({ message, role, channelName, contextMenu, setContextMenu, handleContextMenu }: arg) {
	const user = useSelector((state: any) => state.user);
	const rooms = useSelector((state: any) => state.rooms);
	const dispatch = useDispatch();

	const handleClose = () => {
		setContextMenu(null);
	};

	function blockUser(message: chatResponseArgs) {
		chatSocket.emit("block", { source: user.username, target: message.source, room: channelName });
		dispatch(addBlockedUser(message.source));
	}

	function sendMessage() {
		dispatch(addRoom({name: message.source, role: 'none', hasPassword: false, isDirectMsg: true, openTab: true}));
	}

	return (
			<Menu open={contextMenu !== null}
				onClose={handleClose}
				onClick={handleClose}
				anchorReference="anchorPosition"
				anchorPosition={
				contextMenu !== null
					? { top: contextMenu.mouseY, left: contextMenu.mouseX }
					: undefined}
			>
				{
					role !== "none" && user.username !== message.source && message.role === "none" ? (
						<div className='adminOptions'>
							<MenuItem onClick={ () => { chatSocket.emit("kick", { source: user.username, target: message.source, room: channelName }) } } >Kick</MenuItem>
							<MenuItem onClick={ () => { chatSocket.emit("ban", { source: user.username, target: message.source, room: channelName })  } } >Ban</MenuItem>
							<MenuItem onClick={ () => { chatSocket.emit("mute", { source: user.username, target: message.source, room: channelName }) } }>Mute</MenuItem>
							<MenuItem onClick={ () => { chatSocket.emit("admin", { source: user.username, target: message.source, room: channelName }) } } >Set {message.source} as administrator</MenuItem>
							<Divider/>
						</div>
					) : null
				}
				{
					user.username !== message.source ? (
						<div className='standardOptions'>
							<MenuItem>See profile</MenuItem>
							<MenuItem>Add as friend</MenuItem>
							<MenuItem>Invite {message.source} to play Pong</MenuItem>
							<MenuItem onClick={ () => { blockUser(message) } } >Block</MenuItem>
							<MenuItem onClick={ () => { sendMessage() } }>Send message</MenuItem>
						</div>
					) : null
				}
			</Menu>
	);
}
