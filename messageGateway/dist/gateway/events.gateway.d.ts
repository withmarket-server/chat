import { WsResponse } from '@nestjs/websockets';
import { Observable } from 'rxjs';
import { Socket, Server } from 'socket.io';
import { Message } from 'src/model/message';
import { Group } from 'src/model/group';
export declare class EventsGateway {
    socket: Server;
    private logger;
    events(message: Message): Promise<Observable<WsResponse<any>>>;
    messagePassing(message: Message): Promise<void>;
    joinRoom(client: Socket, group: Group): void;
    leaveRoom(client: Socket, group: Group): void;
}
