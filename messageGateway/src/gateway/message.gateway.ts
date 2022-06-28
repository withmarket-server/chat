import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Socket, Server } from 'socket.io';
import { AllExceptionsFilter } from 'src/filter/filter';
import { Body, Controller, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common'
import { Logger } from '@nestjs/common';
import { Message } from 'src/model/message';
import { MessageService } from './message.service';
import { ChangeGroupState } from 'src/model/change.group.state';
  
@WebSocketGateway({
    cors: {
      origin: '*',
    },
})
export class MessageGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {

    constructor(private messageService: MessageService) {}

    @WebSocketServer()
    server: Server;
    private logger: Logger = new Logger(MessageGateway.name);
    private APPID: string = process.env.APPID || MessageGateway.name;

    afterInit() {
        this.logger.log(`${this.APPID} Server Init Complete`);
    }

    handleConnection(client: Socket) {
        this.logger.log(`${client.handshake.address}(${client.handshake.query['userId']}) is connected!`);
    }
    
    handleDisconnect(client: Socket) {
        this.logger.log(`${client.handshake.address}(${client.handshake.query['userId']}) is disconnected`);
    }

    @UsePipes(new ValidationPipe())
    @UseFilters(new AllExceptionsFilter())
    @SubscribeMessage('to-server')
    async messagePassing(@MessageBody() message: Message) {
        // 메시지 저장 서비스 로직 달면 됨.
        this.messageService.save(message)
        this.server.to(message.groupId).emit('to-client', message);
    }
    
    @SubscribeMessage('change-state')
    changeState(client: Socket, changeGroupState: ChangeGroupState) {
        if (changeGroupState.state === 'join') {
            client.join(changeGroupState.groupId);
            this.logger.log(`${client.handshake.address}(${changeGroupState.userId}) joined at room [${changeGroupState.groupId}]!`);
        } else if (changeGroupState.state === 'leave') {
            client.leave(changeGroupState.groupId);
            this.logger.log(`${client.handshake.address}(${changeGroupState.userId}) leaved from room [${changeGroupState.groupId}]!`);
        } else if (changeGroupState.state === 'writingNotify') [
            this.server.to(changeGroupState.groupId).emit('writingNotify', changeGroupState.userId)
        ]
    }
}