import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsExpertExist } from '../../rules/exist-expert.rule';

export class ApiCreateRoomChatDto {
  @IsExpertExist()
  @IsNotEmpty({ message: 'validation.IsNotEmpty' })
  @ApiProperty({ required: true, description: "ID's expert " })
  expert_id: number;
}
