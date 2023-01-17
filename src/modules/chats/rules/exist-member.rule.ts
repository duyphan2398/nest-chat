import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
  isInstance,
} from 'class-validator';
import { MembersService } from '../services/members.service';
import { Injectable } from '@nestjs/common';
import { Member } from '../entities/member.entity';

@ValidatorConstraint({ name: 'isMemberExist', async: true })
@Injectable()
export class IsMemberExistConstraint implements ValidatorConstraintInterface {
  constructor(private readonly membersService: MembersService) {}

  validate(id: number) {
    return this.membersService.findById(id).then((member) => {
      return isInstance(member, Member);
    });
  }

  defaultMessage(args: ValidationArguments) {
    return 'validation.IsMemberExist';
  }
}

export function IsMemberExist(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsMemberExistConstraint,
    });
  };
}
