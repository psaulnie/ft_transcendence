import React from 'react';
import { chatSocket } from '../../chatSocket';
import { chatResponseArgs } from '../../../../shared/args.interface';
import { actionTypes } from '../../../../shared/args.types';

type arg = {
	messages: chatResponseArgs[],
	role: string,
	channelName: string
}

export default function Messages({ messages, role, channelName }: arg) {
	return (
		<div className='messages'>
		{
			messages.map((message, index) => {
				// const arr = message.split(' ');

				if (message.action == actionTypes.join)
				{
					return(
						<div key={ index } className='userJoined'> {/*the three paragraphs must be on the same line*/}
							<p>=&gt; </p>
							<p>{message.source}</p>
							<p> joined the room</p>
						</div>
					);
				}
				else if (message.action == actionTypes.left)
				{
					return(
						<div key={ index } className='userLeft'> {/*the three paragraphs must be on the same line*/}
							<p>&#60;= </p>
							<p>{message.source}</p>
							<p> left the room</p>
						</div>
					);
				}
				else if (message.action == actionTypes.msg)
				{
					return (
						<div key={ index } className='message'>
							{
								role != "none" ? (
									<div className='options'>
										<button onClick={ () => { chatSocket.emit("kick", { source: '', target: message.source, room: channelName }) } } >Kick</button>
										<button onClick={ () => { chatSocket.emit("ban", { source: '', target: message.source, room: channelName })  } } >Ban</button>
									</div>
								) : ""
							}
							<p>{ message.source }</p>
							<p>{ message.data }</p>
						</div>
					);
				}
			}
		)
		}
		</div>
	);
}

// export default function Messages({ messages, role, channelName }: arg) {
// 	return (
// 		<div className='messages'>
// 		{
// 			messages.map((message, index) => {
// 				const arr = message.split(' ');
// 				if (arr[1] == "JOIN")
// 				{
// 					return(
// 						<div key={ index } className='userJoined'> {/*the three paragraphs must be on the same line*/}
// 							<p>=&gt; </p>
// 							<p>{arr[0]}</p>
// 							<p> joined the room</p>
// 						</div>
// 					);
// 				}
// 				else if (arr[1] == "LEFT")
// 				{
// 					return(
// 						<div key={ index } className='userLeft'> {/*the three paragraphs must be on the same line*/}
// 							<p>&#60;= </p>
// 							<p>{arr[0]}</p>
// 							<p> left the room</p>
// 						</div>
// 					);
// 				}
// 				return (
// 					<div key={ index } className='message'>
// 						{
// 							role != "none" ? (
// 								<div className='options'>
// 									<button onClick={ () => { chatSocket.emit("kick", { source: '', target: message.split(':')[0], room: channelName }) } } >Kick</button>
// 									<button onClick={ () => { chatSocket.emit("ban", { source: '', target: message.split(':')[0], room: channelName })  } } >Ban</button>
// 								</div>
// 							) : ""
// 						}
// 						<p>{ message }</p>
// 					</div>
// 				);
// 			}
// 		)
// 		}
// 		</div>
// 	);
// }