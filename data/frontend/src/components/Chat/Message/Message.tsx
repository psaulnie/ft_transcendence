import { chatResponseArgs } from '../args.interface';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import UserOptionsMenu from './UserOptionsMenu';

import { useGetUserInfoInRoomQuery, useGetUsersInRoomQuery } from '../../../store/api';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

const StyledPaper = styled(Paper)(({ theme }) => ({
	backgroundColor: '#102b47',
	...theme.typography.body2,
	padding: theme.spacing(2),
	maxWidth: 400,
}));

type arg = {
	message: chatResponseArgs,
	role: string,
	roomName: string,
}

export default function Message({ message, role, roomName }: arg) {
	const user = useSelector((state: any) => state.user);
	const [contextMenu, setContextMenu] = useState<{
		mouseX: number;
		mouseY: number;
	  } | null>(null);
	const [showAdminOpt, setShowAdminOpt] = useState(false);
	const [isMuted, setIsMuted] = useState(false);

	const {
		data: cUser,
		isSuccess,
		refetch
	} = useGetUserInfoInRoomQuery({username: message.source, roomName: roomName});

	const handleContextMenu = (event: React.MouseEvent) => {
		event.preventDefault();
		refetch();
		if (isSuccess)
		{
				setShowAdminOpt(true);
				setIsMuted(cUser.isMuted);
		}
		else
			setShowAdminOpt(false);
		setContextMenu(
			contextMenu === null
			? {
				mouseX: event.clientX + 2,
				mouseY: event.clientY - 6,
				}
			: null,
		);
	};

	return (
		<div className='message' onContextMenu={handleContextMenu} >
			{
				user.username !== message.source ? 
					<UserOptionsMenu cUser={{username: message.source, role: message.role, isMuted: isMuted}} role={role}
						roomName={roomName}
						contextMenu={contextMenu} setContextMenu={setContextMenu}
						showAdminOpt={showAdminOpt}/>
				: null
			}
			<Box sx={{ flexGrow: 1, overflow: 'hidden', px: 3}} >
				<StyledPaper
					sx={{
					my: 1,
					mx: 'auto',
					p: 2,
					}}
				>
					<Grid container wrap="nowrap" spacing={2}>
						{	user.username !== message.source ? 
								<Grid item>
									<Avatar>{message.source[0]}</Avatar>
								</Grid>
							: null
						}
						<Grid item xs style={{ flexWrap: 'wrap' } }>
							<Typography style={ {color: 'white', overflowWrap: 'break-word', textAlign: user.username !== message.source ? 'start' : 'end'} } >{ message.data }</Typography>
						</Grid>
						{
							user.username === message.source ? 
								<Grid item>
									<Avatar>{message.source[0]}</Avatar>
								</Grid>
							: null
						}
					</Grid>
	  			</StyledPaper>
			</Box>
		</div>
	);
}
