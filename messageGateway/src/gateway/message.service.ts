import { Injectable } from '@nestjs/common';
import { Message } from 'src/model/message';

@Injectable()
export class MessageService {

    save(message: Message) {
        //데이터 베이스 데이터 저장
    }
}