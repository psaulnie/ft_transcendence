import { chatResponseArgs } from '../args.interface';
import { actionTypes } from '../args.types';
import { useSelector } from 'react-redux';
import JoinMessage from './JoinMessage';
import LeftMessage from './LeftMessage';
import Message from './Message';

import { useRef, useEffect } from 'react';

type arg = {
	messages: chatResponseArgs[],
	role: string,
	roomName: string,
	isDirectMessage: boolean
}

export default function MessagesBox({ messages, role, roomName, isDirectMessage }: arg) {
	const user = useSelector((state: any) => state.user);
	const bottomRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);
	  
	return (
		<div className='messages'>
		{
			messages.map((message, index) => {
				if (user.blockedUsers.indexOf(message.source) !== -1)
					return (null);
				if (message.action === actionTypes.join)
				{
					
					return (<JoinMessage key={index} message={message} />);
				}
				else if (message.action === actionTypes.left)
					return (<LeftMessage key={index} message={message} />);
				else if (message.action === actionTypes.msg)
					return (<Message key={index} message={message} role={role} roomName={roomName} isDirectMessage={isDirectMessage} />);
				return (null);
			}
		)
		}
		<div ref={bottomRef}></div>
        </div>
	);
}
