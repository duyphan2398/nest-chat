import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsExpertExist } from '../../rules/exist-expert.rule';

export class SupplierApiCreateRoomChatDto {
  @IsNotEmpty({ message: 'validation.IsNotEmpty' })
  @IsNumber({}, { message: 'validation.IsNumber' })
  @IsExpertExist()
  @ApiProperty({ required: true, description: "ID's expert " })
  expert_id: number;
}
