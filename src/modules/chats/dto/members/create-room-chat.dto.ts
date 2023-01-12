import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';
import { IsExpertExist } from '../../rules/exist-expert.rule';

export class CreateRoomChatDto {
  @IsNotEmpty({ message: i18nValidationMessage('validation.IsNotEmpty') })
  @IsNumber(null, { message: i18nValidationMessage('validation.IsNumber') })
  @IsExpertExist()
  @ApiProperty({ required: true, description: "ID's expert " })
  expert_id: number;
}
