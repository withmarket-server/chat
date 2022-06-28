import { WsResponse } from '@nestjs/websockets';
import { Observable } from 'rxjs';
import { Socket, Server } from 'socket.io';
import { Message } from 'src/model/message';
export declare class EventsGateway {
    server: Server;
    private logger;
    messagePassing(message: Message): Promise<Observable<WsResponse<any>>>;
    joinRoom(client: Socket, group: string): void;
    leaveRoom(client: Socket, group: string): void;
}
