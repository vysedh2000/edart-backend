// src/chat/chat.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger} from '@nestjs/common';

@WebSocketGateway({
path: '/edg/ws',
  cors: {
    origin: true,
  },
})
export class WebsocketGateway {
  @WebSocketServer()
    server!: Server;

  private logger = new Logger('ChatGateway');

  @SubscribeMessage('send_message')
  handleMessage(
    @MessageBody() payload: { room: string; text: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(`Message in ${payload.room}: ${payload.text}`);

    // Broadcast to everyone in the room (including sender)
    this.server.to(payload.room).emit('receive_message', {
      text: payload.text,
      senderId: client.id,
      timestamp: new Date().toISOString(),
    });
  }

  @SubscribeMessage('join_room')
  handleJoinRoom(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(room);
    client.emit('joined_room', room);
    this.logger.log(`${client.id} joined ${room}`);
  }

  @SubscribeMessage('leave_room')
  handleLeaveRoom(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(room);
    client.emit('left_room', room);
  }
}