import { io } from 'socket.io-client';

const URL = 'http://localhost:5500/gateways/chat';

export const chatSocket = io(URL);