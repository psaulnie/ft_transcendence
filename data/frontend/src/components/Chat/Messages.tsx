import React from 'react';

type arg = {
	messages: string[],
	role: string
}

export default function Messages({ messages, role }: arg) {
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
								<button>Kick</button>
								<button>Ban</button>
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