import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsMemberExist } from '../rules/exist-member.rule';

export class CreateRoomChatDto {
  @IsNotEmpty({ message: 'validation.IsNotEmpty' })
  @IsNumber({}, { message: 'validation.IsNumber' })
  @IsMemberExist()
  @ApiProperty({ required: true, description: "ID's partner " })
  partner_id: number;
}
