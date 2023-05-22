import { io } from 'socket.io-client';

const URL = 'http://localhost:5050/gateways/chat';

export const chatSocket = io(URL, { query: { "username": "salut" }});