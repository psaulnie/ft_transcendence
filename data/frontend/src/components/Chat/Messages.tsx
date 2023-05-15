import React from 'react';

type arg = {
	messages: string[]
}

export default function Messages({ messages }: arg) {
  return (
    <div className='messages'>
    {
      messages.map((message, index) =>
        <p key={ index }>{ message }</p>
      )
    }
    </div>
  );
}