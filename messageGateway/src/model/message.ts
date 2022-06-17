import { IsString, IsNotEmpty } from 'class-validator';

export class Message{

    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    groupId: string;

    @IsString()
    message: string;

    createdAt: Date;
}