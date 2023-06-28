import { useGetUsersInRoomQuery } from "../../store/api";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { Grid, Skeleton, ListItem, ListItemButton, List, ListItemIcon, ListItemText, ListItemAvatar, Avatar, Typography } from "@mui/material";

import StarIcon from '@mui/icons-material/Star';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import PersonIcon from '@mui/icons-material/Person';

import UserOptionsMenu from "./Message/UserOptionsMenu";

export default function UsersList({roomName, role}: {roomName: string, role: string}) {
	const user = useSelector((state: any) => state.user);

	const [contextMenu, setContextMenu] = useState<{
		mouseX: number;
		mouseY: number;
	} | null>(null);

	const {
		data: usersList,
		isLoading,
		isError,
		error,
		refetch
	} = useGetUsersInRoomQuery({roomName: roomName});

	const handleContextMenu = (event: React.MouseEvent, username: string) => {
		event.preventDefault();
		refetch();
		if (user.username !== username)
			setContextMenu(
				contextMenu === null
				? {
					mouseX: event.clientX + 2,
					mouseY: event.clientY - 6,
					}
				: null,
			);
	};

	function getRoleIcon(role: string)
	{
		if (role === 'owner')
			return (<StarIcon/>);
		else if (role === 'admin')
			return (<StarOutlineIcon/>);
		else
			return (<PersonIcon/>);
	}

	
	useEffect(() => {
		refetch();
	}, [refetch]);
	
	if (isError) // TODO fix show real error page (make Error component)
		return (<p>Error: {error.toString()}</p>)
	else if (isLoading)
		return (
				<div>
					<Skeleton variant="text"/>
					<Skeleton variant="rectangular" />
				</div>
			);
	return (
		<Grid>
			<List>
			{
				usersList.data.map((cUser: any, key: number) => {						
					return (
						<ListItem disablePadding dense key={key} >
							<ListItemButton onClick={(e) => handleContextMenu(e, cUser.username)}>
								<ListItemAvatar>
									<Avatar>
										{cUser.username[0]}
									</Avatar>
								</ListItemAvatar>
								<ListItemText primary={<Typography display='block' fontWeight={cUser.username === user.username ? 'bold' : 'normal'}>{cUser.username}</Typography>} />
								<ListItemIcon>
									{
										user.username === cUser.username ?
											getRoleIcon(role)
										:
											getRoleIcon(cUser.role)
									}
								</ListItemIcon>
							</ListItemButton>
						{
							cUser.username !== user.username ? 
								<UserOptionsMenu cUser={cUser}
									role={role}
									roomName={roomName}
									contextMenu={contextMenu} setContextMenu={setContextMenu}
									showAdminOpt={true} />
								: null
						}
						</ListItem>
					);
				})
			}
			</List>
		</Grid>
	);
};