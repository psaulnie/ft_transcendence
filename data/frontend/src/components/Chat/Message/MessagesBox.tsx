import { chatResponseArgs } from '../args.interface';
import { actionTypes } from '../args.types';
import { useSelector } from 'react-redux';
import JoinMessage from './JoinMessage';
import LeftMessage from './LeftMessage';
import Message from './Message';

type arg = {
	messages: chatResponseArgs[],
	role: string,
	channelName: string
}

export default function MessagesBox({ messages, role, channelName }: arg) {
	const user = useSelector((state: any) => state.user);

	return (
		<div className='messages'>
		{
			messages.map((message, index) => {
				if (user.blockedUsers.indexOf(message.source) !== -1)
					return (null);
				if (message.action === actionTypes.join)
					return (<JoinMessage key={index} message={message} />)
				else if (message.action === actionTypes.left)
					return (<LeftMessage key={index} message={message} />)
				else if (message.action === actionTypes.msg)
					return (<Message key={index} message={message} role={role} channelName={channelName} />)
				return (null);
			}
		)
		}
		</div>
	);
}