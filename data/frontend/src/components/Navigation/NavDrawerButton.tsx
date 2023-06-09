import { ListItem } from '@mui/material';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import MessageIcon from '@mui/icons-material/Message';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function NavDrawerButton({buttonText}: {buttonText: string}) {
	if (buttonText === "Profile")
	{
		return (
			<ListItem disablePadding>
				<ListItemButton>
					<ListItemIcon>
						<AccountCircleIcon/>
					</ListItemIcon>
					<ListItemText primary={buttonText} />
				</ListItemButton>
			</ListItem>
		);
	}
	else if (buttonText === "Game")
	{
		return (
			<ListItem disablePadding>
				<ListItemButton>
					<ListItemIcon>
						<VideogameAssetIcon/>
					</ListItemIcon>
					<ListItemText primary={buttonText} />
				</ListItemButton>
			</ListItem>

		);
	}
	else if (buttonText === "Chat")
	{
		return (
			<ListItem disablePadding>
				<ListItemButton>
					<ListItemIcon>
						<MessageIcon/>
					</ListItemIcon>
					<ListItemText primary={buttonText} />
				</ListItemButton>
			</ListItem>

		);
	}
	return (null);
}