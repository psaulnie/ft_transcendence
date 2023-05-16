import {
	SubscribeMessage,
	WebSocketGateway,
	OnGatewayInit,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
   } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({
	cors: { origin: '*' },
	namespace: '/gateways/chat',
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer() server: Server;

	@SubscribeMessage('sendMsg')
	handleMessage(client: Socket, payload: string) {
		// TODO send msg to good channel
		console.log(payload);
		this.server.emit('receiveMsg', payload);
	}

	afterInit(server: Server) {
		console.log('Init');
	}

	handleDisconnect(client: Socket) {
		console.log(`Client disconnected: ${client.id}`);
	}

	handleConnection(client: Socket, ...args: any[]) {
		console.log(`Client connected: ${client.id}`);
	}
}