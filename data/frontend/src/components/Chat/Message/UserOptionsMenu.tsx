import { webSocket } from '../../../webSocket';
import { useDispatch, useSelector } from 'react-redux';
import { addBlockedUser, removeBlockedUser } from '../../../store/user';
import { Menu, MenuItem, Divider } from '@mui/material';
import { addRoom } from '../../../store/rooms';
import { userRole } from '../chatEnums';
import { useEffect, useState } from 'react';
import { useGetUserFriendsListQuery } from '../../../store/api';
import Error from '../../Global/Error';

type arg = {
	cUser: {username: string, role: userRole, isMuted: boolean},
	role: userRole,
	roomName: string,
	contextMenu: any,
	setContextMenu: any,
	showAdminOpt: boolean
}

export default function UserOptionsMenu({ cUser, role, roomName, contextMenu, setContextMenu, showAdminOpt }: arg) {
	const user = useSelector((state: any) => state.user);
	const dispatch = useDispatch();

	const [isFriend, setIsFriend] = useState(false);

	const handleClose = () => {
		setContextMenu(null);
	};

	function blockUser(cUser: {username: string, role: userRole}) {
		webSocket.emit("block", { source: user.username, target: cUser.username, room: roomName });
		dispatch(addBlockedUser(cUser.username));
	}

	function unblockUser(cUser: {username: string, role: userRole}) {
		webSocket.emit("unblock", { source: user.username, target: cUser.username, room: roomName });
		dispatch(removeBlockedUser(cUser.username));
	}

	function sendMessage() {
		dispatch(addRoom({name: cUser.username, role: userRole.none, hasPassword: false, isDirectMsg: true, openTab: true, isMuted: false}));
	}

	const {data, error, isError, isLoading, refetch} = useGetUserFriendsListQuery({username: user.username});

	useEffect(() => {
		refetch();
		console.log(data);
	}, [refetch]);
	
	if (isError)
		return (<Error error={error}/>);
	// if (data && isSuccess)
	// 	setIsFriend(data.friendsList?.find((element: string) => element === cUser.username) ? true : false);
	if (isLoading)
		return (<div>Loading...</div>)
	console.log((data.friendsList?.find((element: string) => element === cUser.username) ? true : false));
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
							<MenuItem onClick={ () => { webSocket.emit("kick", { source: user.username, target: cUser.username, room: roomName }) } } >Kick</MenuItem>
							<MenuItem onClick={ () => { webSocket.emit("ban", { source: user.username, target: cUser.username, room: roomName })  } } >Ban</MenuItem>
							{
								!cUser.isMuted ?
									<MenuItem onClick={ () => { webSocket.emit("mute", { source: user.username, target: cUser.username, room: roomName }) } }>Mute</MenuItem>
								:
									<MenuItem onClick={ () => { webSocket.emit("unmute", { source: user.username, target: cUser.username, room: roomName }) } }>Unmute</MenuItem>

							}
							<MenuItem onClick={ () => { webSocket.emit("admin", { source: user.username, target: cUser.username, room: roomName }) } } >Set {cUser.username} as administrator</MenuItem>
							<Divider/>
						</span>
					) : null
				}
				{
					user.username !== cUser.username ? (
						<span>
							<MenuItem>See profile</MenuItem>
							{
								(data.friendsList?.find((element: string) => element === cUser.username) ? false : true) ?
									<MenuItem onClick={() => { webSocket.emit("askBeingFriend", {source: user.username, target: cUser.username})}}>Add as friend</MenuItem>
								:   <MenuItem onClick={() => { webSocket.emit("removeFriend", {source: user.username, target: cUser.username})}}>Remove friend</MenuItem>
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
