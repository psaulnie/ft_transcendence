import { io } from 'socket.io-client';

const URL = 'http://localhost:5000/gateways/chat';

export const chatSocket = io(URL);