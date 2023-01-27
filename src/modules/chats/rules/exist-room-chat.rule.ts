import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
  isInstance,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { RoomChatsService } from '../services/room-chats.service';
import { RoomChat } from '../entities/room-chat.entity';

@ValidatorConstraint({ name: 'isRoomChatExist', async: true })
@Injectable()
export class IsRoomChatExistConstraint implements ValidatorConstraintInterface {
  constructor(private readonly roomChatsService: RoomChatsService) {}

  validate(id: number) {
    return this.roomChatsService.findById(+id).then((roomChat) => {
      return isInstance(roomChat, RoomChat);
    });
  }

  defaultMessage(args: ValidationArguments) {
    return 'validation.IsRoomChatExist';
  }
}

export function IsRoomChatExist(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsRoomChatExistConstraint,
    });
  };
}
