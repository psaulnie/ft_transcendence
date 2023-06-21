import { useState } from "react";
import { useSelector } from "react-redux";

import { Menu, MenuItem, Divider } from "@mui/material";

import PasswordDialog from "./PasswordDialog";
import SelectUserDialog from "./SelectUserDialog";

import { chatSocket } from "../../chatSocket";

type arg = {
	contextMenu: any,
	setContextMenu: any,
	roomIndex: number,
	roomName: string,
	role: string
}

export default function RoomOptionsMenu({contextMenu, setContextMenu, roomIndex, roomName, role}: arg) {
	const [showPasswordDialog, setShowPasswordDialog] = useState(false);
	const [showUserDialog, setShowUserDialog] = useState(false);

	const rooms = useSelector((state: any) => state.rooms);
	const handleClose = () => {
		setContextMenu(null);
	};

	function setPassword()
	{
		setShowPasswordDialog(true);
		setContextMenu(null);
	}


	function removePassword()
	{
		chatSocket.emit('removePasswordToRoom', roomName);
		setContextMenu(null)
	}

	function showDialog()
	{
		setShowUserDialog(true);
		setContextMenu(null);
	}
	if (rooms.index !== roomIndex)
		return (null);
	return (
		<div>
			<Menu open={contextMenu !== null}
				onClose={handleClose}
				anchorReference="anchorPosition"
				anchorPosition={
				contextMenu !== null
					? { top: contextMenu.mouseY, left: contextMenu.mouseX }
					: undefined}>
				<div>
					{
						role !== "none" ?
							<div>
								<MenuItem disabled={rooms.room[roomIndex].hasPassword !== false} onClick={setPassword} >Set a password</MenuItem>
								<MenuItem disabled={rooms.room[roomIndex].hasPassword !== true} onClick={setPassword} >Change password</MenuItem>
								<MenuItem disabled={rooms.room[roomIndex].hasPassword !== true} onClick={removePassword}>Remove password</MenuItem>
								<Divider/>
							</div>
						: null
					}
					{ !rooms.room[roomIndex].isDirectMsg ? <MenuItem onClick={ showDialog } >Invite user</MenuItem> : null }
				</div>
			</Menu>
			{ showPasswordDialog === true ? <PasswordDialog open={showPasswordDialog} setOpen={setShowPasswordDialog} roomName={roomName} role="none" createRoom={false} /> : null}
			{ showUserDialog === true ? <SelectUserDialog open={showUserDialog} setOpen={setShowUserDialog} roomName={roomName} /> : null}
		</div>
	);
}