import { useState } from "react";
import { useSelector } from "react-redux";

import { Menu, MenuItem, Divider } from "@mui/material";

import PasswordDialog from "./PasswordDialog";
import { chatSocket } from "../../chatSocket";

type arg = {
	contextMenu: any,
	setContextMenu: any,
	roomIndex: number,
	roomName: string,
	role: string
}

export default function RoomOptionsMenu({contextMenu, setContextMenu, roomIndex, roomName, role}: arg) {
	const [showDialog, setShowDialog] = useState(false);

	const rooms = useSelector((state: any) => state.rooms);
	const handleClose = () => {
		setContextMenu(null);
	};

	function removePassword()
	{
		
	}

	return (
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
							<MenuItem disabled={rooms.room[roomIndex].hasPassword !== false} onClick={ () => { setShowDialog(true) } } >Set a password</MenuItem>
							<MenuItem disabled={rooms.room[roomIndex].hasPassword !== true} onClick={ () => { setShowDialog(true) } } >Change password</MenuItem>
							<MenuItem disabled={rooms.room[roomIndex].hasPassword !== true} onClick={ () => chatSocket.emit('removePasswordToRoom', roomName) }>Remove password</MenuItem>
							<Divider/>
						</div>
					: null
				}
				<MenuItem>Invite user</MenuItem>
				{ showDialog === true ? <PasswordDialog open={showDialog} setOpen={setShowDialog} roomName={roomName} role="none" createRoom={false} /> : null}
			</div>
	</Menu>
	);
}