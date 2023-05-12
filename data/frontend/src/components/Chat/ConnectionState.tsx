import React from 'react';

type arg = {
	isConnected: boolean
}
export default function ConnectionState({ isConnected }: arg) {
  return <p>State: { '' + isConnected }</p>;
}