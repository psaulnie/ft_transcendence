import { chatResponseArgs } from '../args.interface';

import { useState } from 'react';
import { useSelector } from 'react-redux';

import UserOptionsMenu from './UserOptionsMenu';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

const StyledPaper = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
	...theme.typography.body2,
	padding: theme.spacing(2),
	maxWidth: 400,
	color: theme.palette.text.primary,
}));

type arg = {
	message: chatResponseArgs,
	role: string,
	channelName: string,
}

export default function Message({ message, role, channelName }: arg) {
	const user = useSelector((state: any) => state.user);
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

	return (
		<div className='message'onContextMenu={handleContextMenu} style={{ cursor: 'context-menu' }}>
			{
				user.username !== message.source ? 
					<UserOptionsMenu message={message} role={role} channelName={channelName} contextMenu={contextMenu} setContextMenu={setContextMenu} handleContextMenu={handleContextMenu} />
				: null
			}
			<p>{ message.source }: { message.data }</p>
		</div>
	);
}
