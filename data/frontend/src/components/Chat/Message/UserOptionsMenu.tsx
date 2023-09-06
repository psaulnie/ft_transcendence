import webSocketManager from '../../../webSocket';
import { useDispatch, useSelector } from 'react-redux';
import { addBlockedUser, removeBlockedUser } from '../../../store/user';
import { Menu, MenuItem, Divider } from '@mui/material';
import { addRoom } from '../../../store/rooms';
import { userRole } from '../chatEnums';
import { useNavigate } from 'react-router';
import ErrorSnackbar from '../../Global/ErrorSnackbar';
import Loading from '../../Global/Loading';

type arg = {
	cUser: {username: string, role: userRole, isMuted: boolean},
	role: userRole,
	roomName: string,
	contextMenu: any,
	setContextMenu: any,
	showAdminOpt: boolean,
	friendList: any
}

export default function UserOptionsMenu({ cUser, role, roomName, contextMenu, setContextMenu, showAdminOpt, friendList }: arg) {
	const user = useSelector((state: any) => state.user);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleClose = () => {
		setContextMenu(null);
	};

	function blockUser(cUser: {username: string, role: userRole}) {
		webSocketManager.getSocket()?.emit("block", { source: user.username, target: cUser.username, room: roomName });
		dispatch(addBlockedUser(cUser.username));
	}

	function unblockUser(cUser: {username: string, role: userRole}) {
		webSocketManager.getSocket()?.emit("unblock", { source: user.username, target: cUser.username, room: roomName });
		dispatch(removeBlockedUser(cUser.username));
	}

	function sendMessage() {
		dispatch(addRoom({name: cUser.username, role: userRole.none, hasPassword: false, isDirectMsg: true, openTab: true, isMuted: false}));
	}
	
	if (friendList.isError)
		return <ErrorSnackbar error={friendList.error} />;
	if (friendList.isLoading) return <Loading />;
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
					role !== userRole.none && user.username !== cUser.username && cUser.role === userRole.none && showAdminOpt ? (
						<span>
							<MenuItem onClick={ () => { webSocketManager.getSocket()?.emit("kick", { source: user.username, target: cUser.username, room: roomName }) } } >Kick</MenuItem>
							<MenuItem onClick={ () => { webSocketManager.getSocket()?.emit("ban", { source: user.username, target: cUser.username, room: roomName })  } } >Ban</MenuItem>
							{
								!cUser.isMuted ?
									<MenuItem onClick={ () => { webSocketManager.getSocket()?.emit("mute", { source: user.username, target: cUser.username, room: roomName }) } }>Mute</MenuItem>
								:
									<MenuItem onClick={ () => { webSocketManager.getSocket()?.emit("unmute", { source: user.username, target: cUser.username, room: roomName }) } }>Unmute</MenuItem>

							}
							<MenuItem onClick={ () => { webSocketManager.getSocket()?.emit("admin", { source: user.username, target: cUser.username, room: roomName }) } } >Set {cUser.username} as administrator</MenuItem>
							<Divider/>
						</span>
					) : null
				}
				{
					user.username !== cUser.username ? (
						<span>
							<MenuItem onClick={() => { navigate(`/profile/${cUser.username}`) }}>See profile</MenuItem>
							{
								(friendList.data?.find((element: string) => element === cUser.username) ? false : true) ?
									<MenuItem onClick={() => { webSocketManager.getSocket()?.emit("askBeingFriend", {source: user.username, target: cUser.username})}}>Add as friend</MenuItem>
								:   <MenuItem onClick={() => { webSocketManager.getSocket()?.emit("removeFriend", {source: user.username, target: cUser.username})}}>Remove friend</MenuItem>
							}
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
