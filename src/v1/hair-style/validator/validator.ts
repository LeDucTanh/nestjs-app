import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { HairStyleService } from '../hair-style.service';

@ValidatorConstraint({ name: 'IsHairStyleExist', async: true })
@Injectable()
export class IsHairStyleExist implements ValidatorConstraintInterface {
  constructor(private service: HairStyleService) {}
  async validate(value: number): Promise<boolean> {
    const instance = await this.service.findOne(value);
    return !!instance;
  }
  defaultMessage(args: ValidationArguments) {
    return `${args.property} does not exist`;
  }
}
