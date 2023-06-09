import { chatSocket } from '../../../chatSocket';
import { chatResponseArgs } from '../args.interface';
import { useDispatch, useSelector } from 'react-redux';
import { addBlockedUser } from '../../../store/user';

type arg = {
	message: chatResponseArgs,
	role: string,
	channelName: string
}

export default function UserOptionsMenu({ message, role, channelName }: arg) {
	const user = useSelector((state: any) => state.user);
	const dispatch = useDispatch();

	function blockUser(message: chatResponseArgs) {
		chatSocket.emit("block", { source: user.username, target: message.source, room: channelName });
		dispatch(addBlockedUser(message.source));
	}

	return (
		<div className='options'>
		{
			role !== "none" && user.username !== message.source && message.role === "none" ? (
				<div className='adminOptions'>
					<button onClick={ () => { chatSocket.emit("kick", { source: user.username, target: message.source, room: channelName }) } } >Kick</button>
					<button onClick={ () => { chatSocket.emit("ban", { source: user.username, target: message.source, room: channelName })  } } >Ban</button>
					<button onClick={ () => { chatSocket.emit("mute", { source: user.username, target: message.source, room: channelName }) } }>Mute</button>
					<button onClick={ () => { chatSocket.emit("admin", { source: user.username, target: message.source, room: channelName }) } } >Set {message.source} as administrator</button>
				</div>
			) : null
		}
		{
			user.username !== message.source ? (
				<div className='standardOptions'>
					<button onClick={ () => { blockUser(message) } } >Block</button>
					<button>Invite {message.source} to play Pong</button>
				</div>
			) : null
		}
		</div>
	);
}
