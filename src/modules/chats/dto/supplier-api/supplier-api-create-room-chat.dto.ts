import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsMemberExist } from '../../rules/exist-member.rule';

export class SupplierApiCreateRoomChatDto {
  @IsNotEmpty({ message: 'validation.IsNotEmpty' })
  @IsNumber({}, { message: 'validation.IsNumber' })
  @IsMemberExist()
  @ApiProperty({ required: true, description: "ID's member " })
  member_id: number;
}
