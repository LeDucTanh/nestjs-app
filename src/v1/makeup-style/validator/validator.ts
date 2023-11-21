import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { MakeupStyleService } from '../makeup-style.service';

@ValidatorConstraint({ name: 'IsMakeupStyleExist', async: true })
@Injectable()
export class IsMakeupStyleExist implements ValidatorConstraintInterface {
  constructor(private service: MakeupStyleService) {}
  async validate(value: number): Promise<boolean> {
    const instance = await this.service.findOne(value);
    return !!instance;
  }
  defaultMessage(args: ValidationArguments) {
    return `${args.property} does not exist`;
  }
}
