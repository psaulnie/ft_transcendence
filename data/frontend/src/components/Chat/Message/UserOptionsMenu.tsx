import { chatSocket } from '../../../chatSocket';
import { useDispatch, useSelector } from 'react-redux';
import { addBlockedUser, removeBlockedUser } from '../../../store/user';
import { Menu, MenuItem, Divider } from '@mui/material';
import { addRoom } from '../../../store/rooms';

type arg = {
	cUser: {username: string, role: string, isMuted: boolean},
	role: string,
	roomName: string,
	contextMenu: any,
	setContextMenu: any,
	showAdminOpt: boolean
}

export default function UserOptionsMenu({ cUser, role, roomName, contextMenu, setContextMenu, showAdminOpt }: arg) {
	const user = useSelector((state: any) => state.user);
	const dispatch = useDispatch();

	const handleClose = () => {
		setContextMenu(null);
	};

	function blockUser(cUser: {username: string, role: string}) {
		chatSocket.emit("block", { source: user.username, target: cUser.username, room: roomName });
		dispatch(addBlockedUser(cUser.username));
	}

	function unblockUser(cUser: {username: string, role: string}) {
		chatSocket.emit("unblock", { source: user.username, target: cUser.username, room: roomName });
		dispatch(removeBlockedUser(cUser.username));
	}

	function sendMessage() {
		dispatch(addRoom({name: cUser.username, role: 'none', hasPassword: false, isDirectMsg: true, openTab: true, isMuted: false}));
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
					role !== "none" && user.username !== cUser.username && cUser.role === "none" && showAdminOpt ? (
						<span>
							<MenuItem onClick={ () => { chatSocket.emit("kick", { source: user.username, target: cUser.username, room: roomName }) } } >Kick</MenuItem>
							<MenuItem onClick={ () => { chatSocket.emit("ban", { source: user.username, target: cUser.username, room: roomName })  } } >Ban</MenuItem>
							{
								!cUser.isMuted ?
									<MenuItem onClick={ () => { chatSocket.emit("mute", { source: user.username, target: cUser.username, room: roomName }) } }>Mute</MenuItem>
								:
									<MenuItem onClick={ () => { chatSocket.emit("unmute", { source: user.username, target: cUser.username, room: roomName }) } }>Unmute</MenuItem>

							}
							<MenuItem onClick={ () => { chatSocket.emit("admin", { source: user.username, target: cUser.username, room: roomName }) } } >Set {cUser.username} as administrator</MenuItem>
							<Divider/>
						</span>
					) : null
				}
				{
					user.username !== cUser.username ? (
						<span>
							<MenuItem>See profile</MenuItem>
							<MenuItem>Add as friend</MenuItem>
							<MenuItem>Invite {cUser.username} to play Pong</MenuItem>
							{
								user.blockedUsers.find((element: string) => element === cUser.username) ?
									<MenuItem onClick={ () => { unblockUser(cUser) } } >Unblock</MenuItem>
								:
									<MenuItem onClick={ () => { blockUser(cUser) } } >Block</MenuItem>
							}
							<MenuItem onClick={ () => { sendMessage() } }>Send message</MenuItem>
						</span>
					) : null
				}
			</Menu>
	);
}
