import React from 'react';
import { chatSocket } from '../../chatSocket';

type arg = {
	messages: string[],
	role: string,
	channelName: string
}

export default function Messages({ messages, role, channelName }: arg) {
	return (
		<div className='messages'>
		{
			messages.map((message, index) => {
				const arr = message.split(' ');
				if (arr[1] == "JOIN")
				{
					return(
						<div key={ index } className='userJoined'> {/*the three paragraphs must be on the same line*/}
							<p>=&gt; </p>
							<p>{arr[0]}</p>
							<p> joined the room</p>
						</div>
					);
				}
				else if (arr[1] == "LEFT")
				{
					return(
						<div key={ index } className='userLeft'> {/*the three paragraphs must be on the same line*/}
							<p>&#60;= </p>
							<p>{arr[0]}</p>
							<p> left the room</p>
						</div>
					);
				}
				return (
					<div key={ index } className='message'>
						{
							role != "none" ? (
								<div className='options'>
									<button onClick={ () => { chatSocket.emit("kick", message.split(':')[0] + " " + channelName) } } >Kick</button>
									<button onClick={ () => { chatSocket.emit("ban", message.split(':')[0] + " " + channelName) } } >Ban</button>
								</div>
							) : ""
						}
						<p>{ message }</p>
					</div>
				);
			}
		)
		}
		</div>
	);
}