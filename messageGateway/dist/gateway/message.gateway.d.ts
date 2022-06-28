import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Message } from 'src/model/message';
import { ChangeGroupState } from 'src/model/change.group.state';
export declare class MessageGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    server: Server;
    private logger;
    private APPID;
    afterInit(): void;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    messagePassing(message: Message): Promise<void>;
    changeState(client: Socket, changeGroupState: ChangeGroupState): void;
}
