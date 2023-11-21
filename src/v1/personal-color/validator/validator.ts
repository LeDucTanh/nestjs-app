import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PersonalColorService } from 'src/v1/personal-color/personal-color.service';

@ValidatorConstraint({ name: 'IsPersonalColorExist', async: true })
@Injectable()
export class IsPersonalColorExist implements ValidatorConstraintInterface {
  constructor(private service: PersonalColorService) {}
  async validate(value: number): Promise<boolean> {
    const personalColor = await this.service.findOne(value);
    return !!personalColor;
  }
  defaultMessage(args: ValidationArguments) {
    return `${args.property} does not exist`;
  }
}
