import { useState } from "react";
import { useSelector } from "react-redux";

import { Menu, MenuItem, Divider } from "@mui/material";

import PasswordDialog from "./PasswordDialog";

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
	console.log(rooms.room[roomIndex]);
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

							<MenuItem disabled={rooms.room[roomIndex].hasPassword !== false} onClick={ () => {  } } >Set a password</MenuItem>
							<MenuItem disabled={rooms.room[roomIndex].hasPassword !== true} >Change password</MenuItem>
							<MenuItem disabled={rooms.room[roomIndex].hasPassword !== true} >Remove password</MenuItem> {/* TODO change disabled */}
						</div>
					: null
				}
				<Divider/>
				<MenuItem>Invite user</MenuItem>
				{ showDialog === true ? <PasswordDialog open={showDialog} setOpen={setShowDialog} roomName={roomName} role="none" createRoom={true} /> : null}
			</div>
	</Menu>
	);
}