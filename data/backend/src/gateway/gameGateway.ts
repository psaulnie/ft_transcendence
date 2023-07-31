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
	namespace: '/gateways/game',
})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	
	constructor(

	) { }
	@WebSocketServer() server: Server;

	@SubscribeMessage('game')
	async handleGame(client: Socket, payload: {player: string, opponent: string, y: number})
	{
		console.log(payload);
        console.log("receive");
	}

	async afterInit(server: Server) {
		console.log('Init');
	}

	async handleDisconnect(client: Socket) {
		console.log(`Client disconnected: ${client.id}`);
	}

	async handleConnection(client: Socket, ...args: any[]) {
		console.log(`Client connected game: ${client.id}`);
	}
}

