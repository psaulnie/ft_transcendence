import React from 'react';
import { chatSocket } from '../../chatSocket';
import { chatResponseArgs } from './args.interface';
import { actionTypes } from './args.types';
import { useDispatch, useSelector } from 'react-redux';
import { addBlockedUser } from '../../store/user';

type arg = {
	messages: chatResponseArgs[],
	role: string,
	channelName: string
}

export default function Messages({ messages, role, channelName }: arg) {
	const user = useSelector((state: any) => state.user);
	const dispatch = useDispatch();
	function blockUser(message: chatResponseArgs) {
		chatSocket.emit("block", { source: user.username, target: message.source, room: channelName });
		dispatch(addBlockedUser(message.source));
	}

	return (
		<div className='messages'>
		{
			messages.map((message, index) => {
				if (user.blockedUsers.indexOf(message.source) !== -1)
					return (null);
				if (message.action === actionTypes.join)
				{
					return(
						<div key={ index } className='userJoined'>
							<p>=&#62; <a href='blank'>{message.source}</a> joined the room</p>
						</div>
					);
				}
				else if (message.action === actionTypes.left)
				{
					return(
						<div key={ index } className='userLeft'>
							<p>&#60;= <a href='blank'>{message.source}</a> left the room</p>
						</div>
					);
				}
				else if (message.action === actionTypes.msg)
				{
					return (
						<div key={ index } className='message'>
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
							<p><a href="blank">{ message.source }</a>: { message.data }</p>
						</div>
					);
				}
				return (null);
			}
		)
		}
		</div>
	);
}
