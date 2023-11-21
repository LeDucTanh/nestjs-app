import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { MakeupTypeService } from '../makeup-type.service';

@ValidatorConstraint({ name: 'IsMakeupTypeExist', async: true })
@Injectable()
export class IsMakeupTypeExist implements ValidatorConstraintInterface {
  constructor(private service: MakeupTypeService) {}
  async validate(value: number): Promise<boolean> {
    const instance = await this.service.findOne(value);
    return !!instance;
  }
  defaultMessage(args: ValidationArguments) {
    return `${args.property} does not exist`;
  }
}
