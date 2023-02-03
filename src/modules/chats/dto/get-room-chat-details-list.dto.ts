import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsRoomChatExist } from '../rules/exist-room-chat.rule';

export class GetRoomChatDetailsListDto {
  @IsNotEmpty({ message: 'validation.IsNotEmpty' })
  @IsRoomChatExist()
  @ApiProperty({ required: true, description: "ID's room chat " })
  room_chat_id: number;
}
