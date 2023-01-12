import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments
} from 'class-validator';
import { ExpertsService} from "../services/experts.service";
import {Injectable, Inject} from "@nestjs/common";

@ValidatorConstraint({ name: 'isExpertExist',async: true })
@Injectable()
export class IsExpertExist implements ValidatorConstraintInterface {
    constructor(
        private readonly expertsService: ExpertsService,
    ) {}

    validate(id: number, args: ValidationArguments) {
        console.log(this.expertsService)
        return this.expertsService.findById(id).then((expert) => {
            return !expert;
        });
    }
}
