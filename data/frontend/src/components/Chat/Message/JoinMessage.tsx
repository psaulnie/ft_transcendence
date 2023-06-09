import { chatResponseArgs } from '../args.interface';


export default function JoinMessage({message}: {message: chatResponseArgs}) {
	return (
		<p>=&#62; <a href='blank'>{message.source}</a> joined the room</p>
	);
}
