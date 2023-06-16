import { Tabs, Tab, IconButton } from "@mui/material"

import MessageProvider from './Message/MessageProvider';

import CloseIcon from '@mui/icons-material/Close';
import MarkChatUnreadIcon from '@mui/icons-material/MarkChatUnread';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble'; 

import { useDispatch, useSelector } from 'react-redux';
import { useState } from "react";

import { chatSocket } from "../../chatSocket";
import { removeRoom, setRead } from "../../store/rooms";
import { manageRoomsTypes } from "./args.types";
import RoomOptionsMenu from "./RoomOptionsMenu";

export default function RoomTabs({roomIndex, setRoomIndex}: {roomIndex: number, setRoomIndex: any })
{
	const user = useSelector((state: any) => state.user);
	const rooms = useSelector((state: any) => state.rooms);
	const dispatch = useDispatch();
	const [contextMenu, setContextMenu] = useState<{
		mouseX: number;
		mouseY: number;
	  } | null>(null);

	const handleContextMenu = (event: React.MouseEvent) => {
		event.preventDefault();
		setContextMenu(
			contextMenu === null
			? {
				mouseX: event.clientX + 2,
				mouseY: event.clientY - 6,
				}
			: null,
		);
	};
	function changeSelectedRoom(event: React.SyntheticEvent, newIndex: number)
	{
		setRoomIndex(newIndex);
		dispatch(setRead(newIndex));
	}

	function quitRoom(roomName: string, roomIndex: number)
	{
		if (rooms.room.length === 1)
			setRoomIndex(-1)
		else if (roomIndex !== 0)
			setRoomIndex(roomIndex - 1);
		chatSocket.emit('manageRooms', { type: manageRoomsTypes.remove, source: user.username, room: roomName, access: 0});
		dispatch(removeRoom(roomName));
	}

	if (roomIndex !== -1)
		return (
			<Tabs sx={{position: 'fixed', bottom:"0", width:"100%"}} value={roomIndex} onChange={changeSelectedRoom} variant="scrollable" scrollButtons="auto">
				{rooms.room.map((room: {name: string, role: string, unread: boolean}, key: number) =>
					<Tab value={key} tabIndex={key} key={key} onContextMenu={handleContextMenu} label={
						<span>
							{room.name}
							{
								roomIndex === key ? 
									<IconButton size="small" component="span" onClick={() => quitRoom(room.name, key) }>
										<CloseIcon/>
									</IconButton>
								: null
							}
							<MessageProvider roomName={room.name} currentRoomIndex={roomIndex}/>
							<RoomOptionsMenu contextMenu={contextMenu} setContextMenu={setContextMenu} roomIndex={key} roomName={room.name} role={room.role}/>
						</span>
					} icon={ room.unread ? <MarkChatUnreadIcon fontSize='small'/> : <ChatBubbleIcon fontSize='small'/> } iconPosition="start" />
				)}
			</Tabs>
		);
	else
		return (null);

};