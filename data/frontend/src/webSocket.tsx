import { io } from 'socket.io-client';

const URL = 'http://localhost:5050/gateway';

export const gameSocket = io('http://localhost:5050/gateways/game')
export const webSocket = io('');