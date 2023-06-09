import { chatResponseArgs } from '../args.interface';

export default function LeftMessage({message}: {message: chatResponseArgs}) {
	return (
		<p>&#60;= <a href='blank'>{message.source}</a> left the room</p>
	);
}
