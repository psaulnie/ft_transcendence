import React from 'react';

type arg = {
	messages: string[]
}

export default function Messages({ messages }: arg) {
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
			return (<p key={ index }>{ message }</p>);
		}
		)
		}
		</div>
	);
}