import { Module } from '@nestjs/common';
import { WebsocketGateway } from '../socketgateway/socket.gateway';

@Module({
  providers: [WebsocketGateway],
})
export class SocketModule {}
