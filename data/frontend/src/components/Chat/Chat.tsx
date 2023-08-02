import React, { useEffect } from 'react';

import { chatSocket } from '../../chatSocket';

import { useDispatch, useSelector } from 'react-redux';
import { useGetBlockedUsersQuery } from '../../store/api';
import { useGetUserRoomListQuery } from '../../store/api';
import { addBlockedUser } from '../../store/user';

import Room from './Room';
import Drawer from "@mui/material/Drawer";
import CreateChannel from './CreateChannel';
import JoinChannel from './JoinChannel';
import JoinDirectMessage from './JoinDirectMessage';
import DirectMessageProvider from './DirectMessageProvider';
import ChatProcess from './ChatProcess';
import Error from '../Global/Error';

import { Skeleton, Box, Grid, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import RoomTabs from './RoomTabs';
import { addRoom, setRoomIndex } from '../../store/rooms';

function Chat() {
	const user = useSelector((state: any) => state.user);
	const rooms = useSelector((state: any) => state.rooms);
	const dispatch = useDispatch();

	useEffect(() => {
		chatSocket.emit("newUser", user.username);
	}, [user.username, dispatch]);
	
	const {
		data: blockedUsers,
		isLoading: blockedUsersLoading,
		isSuccess: blockedUsersSuccess,
		isError: blockedUsersError,
		error: blockedUsersErrorData,
		refetch: blockedUsersRefetch
	} = useGetBlockedUsersQuery({username: user.username});

	const {
		data: userRoomList,
		isLoading: userRoomListLoading,
		isSuccess: userRoomListSuccess,
		isError: userRoomListError,
		error: userRoomListErrorData,
		refetch: userRoomListRefetch
	} = useGetUserRoomListQuery({username: user.username});
	
	useEffect(() => {
		blockedUsersRefetch();
		if (blockedUsersSuccess && blockedUsers)
		{
			blockedUsers.forEach((element: any) => {
				dispatch(addBlockedUser(element));
			});
		}
		userRoomListRefetch();
		if (userRoomListSuccess && userRoomList)
		{
			userRoomList.forEach((element: any) => {
				dispatch(addRoom({	name: element.roomName,
									role: element.role,
									hasPassword: element.hasPassword,
									isDirectMsg: false,
									isMuted: element.isMuted,
									openTab: false
								}));
			});
			if (userRoomList.length > 0)
				dispatch(setRoomIndex(0));
		}
	}, [user.username, blockedUsersSuccess, blockedUsers, dispatch, blockedUsersRefetch, userRoomListSuccess, userRoomList, userRoomListRefetch]);
	
	if (!chatSocket.connected)
		return (<p>Chat Socket error</p>);
	if (blockedUsersError)
		return (<Error error={blockedUsersErrorData} />)
	else if (userRoomListError)
		return	(<Error error={userRoomListErrorData} />)
	else if (blockedUsersLoading || userRoomListLoading)
		return (
			<div>
				<Skeleton variant="text"/>
				<Skeleton variant="rectangular" />
			</div>
		);

	return (
		<div className='chat'>
			<ChatProcess/>
			<Grid container sx={{ display: 'flex'}} justifyContent="space-evenly">
				<Grid item xs={3}>
						<Box sx={{ backgroundColor: '#102b47', height: '100%', padding: '16px', borderRadius: '10px'}}>
							<Grid container>
								<JoinDirectMessage/>
							</Grid>
							<Grid container>
								<CreateChannel/>
							</Grid>
							<Grid container>
								<JoinChannel/>
							</Grid>
						</Box>
				</Grid>
				<Grid item xs={7}>
						<DirectMessageProvider/>
						{/* <Grid item sx={{ marginBottom: '70px' }}>
							<RoomTabs/>
						</Grid> */}
				</Grid>
			</Grid>
			<Box
                sx={{
                position: "fixed",
                bgcolor: '#FFA500',
                height: 500,
                width: 500,
                borderRadius: '2%',
                opacity: 0.8,
                border: 8,
                borderColor: '#994000',
                borderStyle: 'double',
				marginTop: "auto",
                bottom: 20,
                right: 20,
                zIndex: 2,
                }}
			>
				<Grid container sx={{ height: '50%', width: '100%'}}>
					<Grid item zIndex={999} xs={11} sx={{ height: '5%', width: '100%'}}>
						<RoomTabs/>
					</Grid>
					{/* <Grid item xs={1} sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
						<Button variant="text"
							startIcon={<Box sx={{ fontSize: 30, color: "red"}}>
							<MenuIcon />
							</Box>}
      						sx={{
							padding: "0.7em",
        					"& .MuiButton-startIcon": {
        						marginRight: "0.25em", // Ajustez la marge droite de l'icône pour le centrer
        					},
        					"& .MuiButton-label": {
        					  	display: "flex",
        						alignItems: "center",
        					},
      						}}
						></Button>
      				</Grid> */}
				</Grid>
				<Grid
					zIndex={0}
					sx={{height: "95%",
					width: "100%",
					overflow: 'scroll', 
					display: "flex",
        			flexDirection: "column",
					alignItems:"flex-end",
				}}
				>
					{ 
						rooms.index !== -1 && rooms.room[rooms.index] ?
							<Room key={rooms.room[rooms.index].name} roomName={rooms.room[rooms.index].name}/>
						: null
					}	
				</Grid>
			</Box>
		</div>
	);
}

export default Chat;