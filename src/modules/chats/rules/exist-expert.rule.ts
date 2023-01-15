import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
  isInstance,
} from 'class-validator';
import { ExpertsService } from '../services/experts.service';
import { Injectable } from '@nestjs/common';
import { Expert } from '../entities/expert.entity';

@ValidatorConstraint({ name: 'isExpertExist', async: true })
@Injectable()
export class IsExpertExistConstraint implements ValidatorConstraintInterface {
  constructor(private readonly expertsService: ExpertsService) {}

  validate(id: number) {
    return this.expertsService.findById(id).then((expert) => {
      return isInstance(expert, Expert);
    });
  }

  defaultMessage(args: ValidationArguments) {
    return 'validation.IsExpertExist';
  }
}

export function IsExpertExist(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsExpertExistConstraint,
    });
  };
}
