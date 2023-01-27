import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsRoomChatExist } from '../../rules/exist-room-chat.rule';

export class ApiGetRoomChatDetailsListDto {
  @IsRoomChatExist()
  @IsNotEmpty({ message: 'validation.IsNotEmpty' })
  @ApiProperty({ required: true, description: "ID's room chat " })
  room_chat_id: number;
}
