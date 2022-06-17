import { IsString, IsNotEmpty } from 'class-validator';

export class ChangeGroupState{

    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    groupId: string;

    @IsString()
    @IsNotEmpty()
    state: string;
}