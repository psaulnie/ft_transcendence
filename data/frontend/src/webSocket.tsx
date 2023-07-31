import { io } from 'socket.io-client';

const URL = 'http://localhost:5000/gateway';

export const webSocket = io(URL);