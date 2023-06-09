import { chatResponseArgs } from '../args.interface';
import UserOptionsMenu from './UserOptionsMenu';

type arg = {
	message: chatResponseArgs,
	role: string,
	channelName: string
}

export default function Message({ message, role, channelName }: arg) {
	return (
		<div className='message'>
			<UserOptionsMenu message={message} role={role} channelName={channelName} />
			<p><a href="blank">{ message.source }</a>: { message.data }</p>
		</div>
	);
}
