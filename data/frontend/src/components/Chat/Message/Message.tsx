import { chatResponseArgs } from '../args.interface';
import UserOptionsMenu from './UserOptionsMenu';
import { useState } from 'react';
import { useSelector } from 'react-redux';

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
