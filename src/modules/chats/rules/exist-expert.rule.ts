import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import { ExpertsService } from '../services/experts.service';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ name: 'isExpertExist', async: true })
@Injectable()
export class IsExpertExistConstraint implements ValidatorConstraintInterface {
  constructor(private readonly expertsService: ExpertsService) {}

  validate(id: number) {
    console.log(this.expertsService);
    return this.expertsService.findById(id).then((expert) => {
      return !expert;
    });
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
